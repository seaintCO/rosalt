import { randomBytes } from "node:crypto";
import { Resend } from "resend";
import { z } from "zod";
import { env } from "@/lib/env";
import { ok, parseJson, problem, requireUser } from "@/lib/http";
import { fingerprint } from "@/lib/security";

const createSchema=z.object({action:z.literal("create"),subject:z.string().trim().min(3).max(160),provider:z.enum(["in_app","email","airbnb_draft"]),propertyId:z.uuid().optional(),reservationId:z.uuid().optional(),participantName:z.string().trim().min(1).max(120),participantEmail:z.email().optional()});
const messageSchema=z.object({action:z.literal("message"),conversationId:z.uuid(),body:z.string().trim().min(1).max(10000)});
const requestSchema=z.discriminatedUnion("action",[createSchema,messageSchema]);

async function context(){
  const auth=await requireUser();if("error" in auth)return {kind:"error" as const,response:auth.error};
  const {data:membership}=await auth.client.from("organization_members").select("organization_id,role").eq("user_id",auth.user.id).eq("status","active").limit(1).maybeSingle();
  if(!membership)return {kind:"error" as const,response:problem("ORGANIZATION_REQUIRED","Create or join a host organization before using communications.",409)};
  return {kind:"ok" as const,client:auth.client,user:auth.user,organizationId:membership.organization_id,role:membership.role};
}

export async function GET(){
  const ctx=await context();if(ctx.kind==="error")return ctx.response;
  const {data,error}=await ctx.client.from("conversations").select("id,subject,provider,status,unread_count,last_message_at,property_id,reservation_id,properties(name),conversation_participants(display_name,email,role),conversation_messages(id,sender_name,sender_type,direction,provider,body,delivery_status,error_message,created_at)").eq("organization_id",ctx.organizationId).order("last_message_at",{ascending:false}).limit(100);
  if(error)return problem("CONVERSATIONS_LOAD_FAILED","Messages could not be loaded.",500);
  const conversations=(data??[]).map((row:any)=>{
    const messages=[...(row.conversation_messages??[])].sort((a:any,b:any)=>new Date(a.created_at).getTime()-new Date(b.created_at).getTime());
    const property=Array.isArray(row.properties)?row.properties[0]:row.properties;
    return {id:row.id,subject:row.subject,provider:row.provider,status:row.status,unreadCount:row.unread_count,lastMessageAt:row.last_message_at,property:property?.name??null,participants:row.conversation_participants??[],messages};
  });
  return ok({conversations,providerStatus:{in_app:"connected",email:env.RESEND_API_KEY&&process.env.RESEND_FROM_EMAIL?"connected":"setup_required",airbnb_draft:"draft_only",whatsapp:"setup_required",instagram:"setup_required",facebook:"setup_required",sms:"setup_required"}});
}

export async function POST(request:Request){
  const ref=crypto.randomUUID();
  try{
    const ctx=await context();if(ctx.kind==="error")return ctx.response;
    const input=requestSchema.parse(await parseJson(request));
    if(input.action==="create"){
      if(input.provider==="email"&&!input.participantEmail)return problem("RECIPIENT_REQUIRED","An email address is required for an email conversation.",400,ref);
      if(input.propertyId){const {data}=await ctx.client.from("properties").select("id").eq("organization_id",ctx.organizationId).eq("id",input.propertyId).maybeSingle();if(!data)return problem("FORBIDDEN","The selected property is not available in this organization.",403,ref)}
      if(input.reservationId){const {data}=await ctx.client.from("reservations").select("id").eq("organization_id",ctx.organizationId).eq("id",input.reservationId).maybeSingle();if(!data)return problem("FORBIDDEN","The selected reservation is not available in this organization.",403,ref)}
      const {data:conversation,error}=await ctx.client.from("conversations").insert({organization_id:ctx.organizationId,property_id:input.propertyId??null,reservation_id:input.reservationId??null,provider:input.provider,subject:input.subject,created_by:ctx.user.id}).select("id").single();
      if(error||!conversation)throw error??new Error("CONVERSATION_CREATE_FAILED");
      const ownerName=ctx.user.user_metadata?.full_name||ctx.user.email?.split("@")[0]||"Host";
      const {error:participantError}=await ctx.client.from("conversation_participants").insert([{organization_id:ctx.organizationId,conversation_id:conversation.id,user_id:ctx.user.id,display_name:ownerName,email:ctx.user.email,role:"host"},{organization_id:ctx.organizationId,conversation_id:conversation.id,display_name:input.participantName,email:input.participantEmail??null,role:"guest"}]);
      if(participantError){await ctx.client.from("conversations").delete().eq("id",conversation.id);throw participantError}
      let inviteUrl:string|undefined;
      if(input.provider==="in_app"){
        const token=randomBytes(32).toString("hex"),tokenHash=await fingerprint(token),expiresAt=new Date(Date.now()+7*86400000).toISOString();
        const {error:inviteError}=await ctx.client.from("conversation_invites").insert({organization_id:ctx.organizationId,conversation_id:conversation.id,token_hash:tokenHash,invited_name:input.participantName,invited_email:input.participantEmail??null,created_by:ctx.user.id,expires_at:expiresAt});
        if(!inviteError)inviteUrl=`${env.NEXT_PUBLIC_APP_URL||new URL(request.url).origin}/c/${token}`;
      }
      await ctx.client.from("audit_logs").insert({actor_user_id:ctx.user.id,organization_id:ctx.organizationId,action:"conversation.created",target_table:"conversations",target_id:conversation.id,request_id:ref,metadata:{provider:input.provider}});
      return ok({conversationId:conversation.id,inviteUrl,deliveryMode:input.provider==="airbnb_draft"?"draft_only":"ready"},201,ref);
    }
    const {data:conversation}=await ctx.client.from("conversations").select("id,provider,subject").eq("organization_id",ctx.organizationId).eq("id",input.conversationId).maybeSingle();
    if(!conversation)return problem("NOT_FOUND","Conversation not found.",404,ref);
    const senderName=ctx.user.user_metadata?.full_name||ctx.user.email?.split("@")[0]||"Host";
    let deliveryStatus="read",direction="internal",providerMessageId:string|null=null,errorMessage:string|null=null;
    if(conversation.provider==="airbnb_draft"){deliveryStatus="draft";direction="draft"}
    else if(conversation.provider==="email"){
      if(!env.RESEND_API_KEY||!process.env.RESEND_FROM_EMAIL)return problem("SETUP_REQUIRED","Email delivery requires RESEND_API_KEY and RESEND_FROM_EMAIL. The message was not sent.",503,ref);
      const {data:recipient}=await ctx.client.from("conversation_participants").select("email").eq("conversation_id",conversation.id).eq("role","guest").not("email","is",null).limit(1).maybeSingle();
      if(!recipient?.email)return problem("RECIPIENT_REQUIRED","This conversation does not have a guest email address.",409,ref);
      try{const sent=await new Resend(env.RESEND_API_KEY).emails.send({from:process.env.RESEND_FROM_EMAIL,to:String(recipient.email),subject:conversation.subject,text:input.body});if(sent.error)throw new Error(sent.error.message);providerMessageId=sent.data?.id??null;deliveryStatus="sent";direction="outbound"}catch(caught){errorMessage=caught instanceof Error?caught.message:"Email provider rejected the message";return problem("EMAIL_SEND_FAILED",`The email was not sent: ${errorMessage}`,502,ref)}
    }
    const {data:message,error}=await ctx.client.from("conversation_messages").insert({organization_id:ctx.organizationId,conversation_id:conversation.id,sender_user_id:ctx.user.id,sender_name:senderName,sender_type:"host",direction,provider:conversation.provider,body:input.body,provider_message_id:providerMessageId,delivery_status:deliveryStatus,error_message:errorMessage}).select("id").single();
    if(error||!message)throw error??new Error("MESSAGE_SAVE_FAILED");
    await ctx.client.from("conversations").update({last_message_at:new Date().toISOString()}).eq("id",conversation.id);
    return ok({messageId:message.id,delivery:deliveryStatus},201,ref);
  }catch(error){if(error&&typeof error==="object"&&"issues" in error)return problem("VALIDATION_ERROR","Check the communication details.",400,ref,error);return problem("COMMUNICATION_FAILED","The communication request could not be completed.",500,ref)}
}

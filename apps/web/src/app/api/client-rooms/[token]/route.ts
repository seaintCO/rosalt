import { z } from "zod";
import { ok, parseJson, problem } from "@/lib/http";
import { fingerprint, rateLimit } from "@/lib/security";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { env } from "@/lib/env";

async function room(token:string){
  if(!env.SUPABASE_SERVICE_ROLE_KEY||!/^[a-f0-9]{64}$/.test(token))return null;
  const admin=createSupabaseAdmin(),tokenHash=await fingerprint(token);
  const {data:invite}=await admin.from("conversation_invites").select("id,organization_id,conversation_id,invited_name,expires_at,revoked_at,conversations(id,subject,status,provider,properties(name))").eq("token_hash",tokenHash).maybeSingle();
  if(!invite||invite.revoked_at||new Date(invite.expires_at)<=new Date()||(invite.conversations as {status?:string}|null)?.status!=="open")return null;
  return {admin,invite};
}

export async function GET(_:Request,{params}:{params:Promise<{token:string}>}){
  const resolved=await room((await params).token);if(!resolved)return problem("NOT_FOUND","This private room link is invalid, expired, or revoked.",404);
  const {admin,invite}=resolved;
  const {data:messages,error}=await admin.from("conversation_messages").select("id,sender_name,sender_type,body,delivery_status,created_at").eq("conversation_id",invite.conversation_id).order("created_at");
  if(error)return problem("ROOM_LOAD_FAILED","The private room could not be loaded.",500);
  await admin.from("conversation_invites").update({last_used_at:new Date().toISOString()}).eq("id",invite.id);
  const conversation=invite.conversations as unknown as {subject:string;properties?:{name?:string}|Array<{name?:string}>};
  const property=Array.isArray(conversation.properties)?conversation.properties[0]:conversation.properties;
  return ok({subject:conversation.subject,property:property?.name??null,participant:invite.invited_name??"Guest",expiresAt:invite.expires_at,messages:messages??[]});
}

export async function POST(request:Request,{params}:{params:Promise<{token:string}>}){
  const ref=crypto.randomUUID();
  if(!await rateLimit(request,"client-room-message",30,3600))return problem("RATE_LIMITED","Too many messages. Try again later.",429,ref);
  const resolved=await room((await params).token);if(!resolved)return problem("NOT_FOUND","This private room link is invalid, expired, or revoked.",404,ref);
  const parsed=z.object({body:z.string().trim().min(1).max(10000)}).safeParse(await parseJson(request));if(!parsed.success)return problem("VALIDATION_ERROR","Enter a message between 1 and 10,000 characters.",400,ref,parsed.error);
  const {admin,invite}=resolved;
  const {data,error}=await admin.from("conversation_messages").insert({organization_id:invite.organization_id,conversation_id:invite.conversation_id,sender_name:invite.invited_name??"Guest",sender_type:"guest",direction:"inbound",provider:"in_app",body:parsed.data.body,delivery_status:"received"}).select("id").single();
  if(error||!data)return problem("MESSAGE_FAILED","The message could not be posted.",500,ref);
  await admin.from("conversations").update({last_message_at:new Date().toISOString(),unread_count:1}).eq("id",invite.conversation_id);
  return ok({messageId:data.id},201,ref);
}

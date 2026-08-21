import { NextResponse } from "next/server";
import type { ZodError } from "zod";
export function referenceId(){return crypto.randomUUID()}
export function ok<T>(data:T,status=200,ref=referenceId()){return NextResponse.json({data,referenceId:ref},{status})}
export function problem(code:string,message:string,status:number,ref=referenceId(),error?:unknown){
  const details=error&&typeof error==="object"&&"flatten" in error?(error as ZodError).flatten().fieldErrors:undefined;
  return NextResponse.json({error:{code,message,referenceId:ref,...(details?{details}:{})}},{status});
}
export async function requireUser(){const client=await (await import("@/lib/supabase/server")).createSupabaseServer();if(!client)return {error:problem("SETUP_REQUIRED","Supabase authentication is not configured. Add the documented Supabase variables.",503)} as const;const {data:{user},error}=await client.auth.getUser();if(error||!user)return {error:problem("UNAUTHORIZED","Sign in is required.",401)} as const;return {client,user} as const;}
export async function parseJson(request:Request,maxBytes=100_000){const size=Number(request.headers.get("content-length")??0);if(size>maxBytes)throw new Error("REQUEST_TOO_LARGE");return request.json() as Promise<unknown>}

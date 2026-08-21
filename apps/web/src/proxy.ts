import { NextResponse, type NextRequest } from "next/server";
export function proxy(request:NextRequest){
  const response=NextResponse.next();
  const nonce=crypto.randomUUID().replaceAll("-","");
  const isDev=process.env.NODE_ENV!=="production";
  response.headers.set("Content-Security-Policy",`default-src 'self'; script-src 'self' 'nonce-${nonce}'${isDev?" 'unsafe-eval'":""} https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co https://api.stripe.com https://app.ticketmaster.com; frame-src https://js.stripe.com https://hooks.stripe.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests`);
  response.headers.set("x-nonce",nonce); response.headers.set("x-request-id",request.headers.get("x-request-id")??crypto.randomUUID());
  return response;
}
export const config={matcher:["/((?!_next/static|_next/image|favicon.ico|icon.svg).*)"]};

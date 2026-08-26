import {integrationStatus} from "@/lib/env";import {ok} from "@/lib/http";
export function GET(){return ok({status:"ok",timestamp:new Date().toISOString(),integrations:Object.fromEntries(Object.entries(integrationStatus).map(([name,configured])=>[name,{configured,status:configured?"configured":"setup_required"}]))})}

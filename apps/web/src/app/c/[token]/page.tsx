import { ClientRoom } from "@/components/client-room";
export const dynamic="force-dynamic";
export default async function RoomPage({params}:{params:Promise<{token:string}>}){return <ClientRoom token={(await params).token}/>}

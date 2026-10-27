import {isAdmin} from '../../../../../lib/admin-auth';
import {makeDpdStationFile} from '../../../../../lib/dpd-station';
import {getOrders} from '../../../../../lib/site-data';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(request:Request){
 if(!await isAdmin())return Response.json({error:'Accès refusé.'},{status:401});
 const id=new URL(request.url).searchParams.get('id')||'',order=(await getOrders()).find(item=>item.id===id);if(!order)return Response.json({error:'Commande introuvable.'},{status:404});if(!order.delivery.method.startsWith('dpd-'))return Response.json({error:'Cet export est réservé aux anciennes commandes DPD.'},{status:400});
 try{const text=makeDpdStationFile(order);const bytes=Uint8Array.from(text,char=>char.charCodeAt(0)&255);return new Response(bytes,{headers:{'Content-Type':'text/plain; charset=iso-8859-1','Content-Disposition':'attachment; filename="DPD-'+order.reference+'.txt"','Cache-Control':'no-store'}})}catch(error){return Response.json({error:error instanceof Error?error.message:'Export impossible.'},{status:503})}
}

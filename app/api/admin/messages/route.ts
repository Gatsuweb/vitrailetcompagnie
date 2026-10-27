import {isAdmin,sameOrigin} from '../../../../lib/admin-auth';
import {getMessages,updateMessages} from '../../../../lib/site-data';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(){if(!await isAdmin())return Response.json({error:'Accès refusé.'},{status:401});return Response.json(await getMessages(),{headers:{'Cache-Control':'no-store'}})}
export async function PATCH(request:Request){
 if(!await isAdmin())return Response.json({error:'Accès refusé.'},{status:401});
 if(!sameOrigin(request))return Response.json({error:'Requête refusée.'},{status:403});
 const body=await request.json().catch(()=>({}));
 if(typeof body.id!=='string'||typeof body.read!=='boolean')return Response.json({error:'Requête invalide.'},{status:400});
 const found=await updateMessages(items=>{const item=items.find(m=>m.id===body.id);if(item)item.read=body.read;return {items,result:Boolean(item)}});
 return found?Response.json({ok:true}):Response.json({error:'Message introuvable.'},{status:404});
}
export async function DELETE(request:Request){
 if(!await isAdmin())return Response.json({error:'Accès refusé.'},{status:401});
 if(!sameOrigin(request))return Response.json({error:'Requête refusée.'},{status:403});
 const body=await request.json().catch(()=>({}));
 if(typeof body.id!=='string')return Response.json({error:'Requête invalide.'},{status:400});
 await updateMessages(items=>({items:items.filter(m=>m.id!==body.id),result:true}));
 return Response.json({ok:true});
}


import {isAdmin,sameOrigin} from '../../../../lib/admin-auth';
import {getOrders,getSiteData,saveSiteData,updateOrders,withCommerceLock,type OrderStatus} from '../../../../lib/site-data';

export const runtime='nodejs';
export const dynamic='force-dynamic';

const nextStatuses:Record<OrderStatus,OrderStatus[]>={
 new:['confirmed','cancelled'],
 confirmed:['preparing','cancelled'],
 preparing:['shipped','cancelled'],
 shipped:[],
 cancelled:[]
};

export async function GET(){
 if(!await isAdmin())return Response.json({error:'Accès refusé.'},{status:401});
 return Response.json(await getOrders(),{headers:{'Cache-Control':'no-store'}});
}

export async function PATCH(request:Request){
 if(!await isAdmin())return Response.json({error:'Accès refusé.'},{status:401});
 if(!sameOrigin(request))return Response.json({error:'Requête refusée.'},{status:403});
 const body=await request.json().catch(()=>null);
 const id=typeof body?.id==='string'?body.id:'';
 const status=body?.status as OrderStatus;
 const trackingNumber=typeof body?.trackingNumber==='string'?body.trackingNumber.trim():'';
 if(!id||!Object.hasOwn(nextStatuses,status)||trackingNumber.length>30||!/^[A-Za-z0-9]*$/.test(trackingNumber))return Response.json({error:'Mise à jour invalide.'},{status:400});

 return withCommerceLock(async()=>{
  const current=(await getOrders()).find(item=>item.id===id);
  if(!current)return Response.json({error:'Demande introuvable.'},{status:404});
  const changingStatus=status!==current.status;
  if(changingStatus&&!nextStatuses[current.status].includes(status))return Response.json({error:'Confirmez la demande avant de la préparer ou de l’expédier. Une demande annulée ou expédiée est définitive.'},{status:409});
  if(status==='shipped'&&!trackingNumber)return Response.json({error:'Ajoutez un numéro de suivi avant de marquer la commande expédiée.'},{status:400});
  const stockDelta=current.status==='new'&&status==='confirmed'?-1:status==='cancelled'&&['confirmed','preparing'].includes(current.status)?1:0;
  let content;
  if(stockDelta){
   content=await getSiteData();
   for(const item of current.items){
    const work=content.works.find(work=>work.id===item.workId);
    if(!work)return Response.json({error:'Création introuvable : vérifiez le catalogue avant de confirmer.'},{status:409});
    if(stockDelta<0&&work.stock<item.quantity)return Response.json({error:`Stock insuffisant pour « ${item.title} ». Ajustez la demande avec la cliente avant de confirmer.`},{status:409});
   }
   for(const item of current.items){const work=content.works.find(work=>work.id===item.workId)!;work.stock+=stockDelta*item.quantity}
   await saveSiteData(content);
  }
  try{
   const updated=await updateOrders(items=>{
    const found=items.find(item=>item.id===id);
    if(found){found.status=status;found.trackingNumber=trackingNumber}
    return {items,result:found};
   });
   return Response.json(updated);
  }catch(error){
   if(content){for(const item of current.items){const work=content.works.find(work=>work.id===item.workId)!;work.stock-=stockDelta*item.quantity}await saveSiteData(content)}
   throw error;
  }
 });
}

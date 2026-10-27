import {sameOrigin} from '../../../lib/admin-auth';
import {addOrder,getSiteData,withCommerceLock} from '../../../lib/site-data';
export const runtime='nodejs';
const recent=new Map<string,number[]>();
const clean=(value:unknown,max:number)=>typeof value==='string'?value.trim().slice(0,max+1):'';
const emailOk=(value:string)=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const mobile=(value:string)=>{const digits=value.replace(/\D/g,'');return digits.startsWith('33')?'0'+digits.slice(2):digits};
export async function POST(request:Request){
 if(!sameOrigin(request))return Response.json({error:'Requête refusée.'},{status:403});
 if(Number(request.headers.get('content-length')||0)>30000)return Response.json({error:'Commande trop volumineuse.'},{status:413});
 const body=await request.json().catch(()=>null);if(!body||typeof body!=='object')return Response.json({error:'Commande invalide.'},{status:400});
 return withCommerceLock(async()=>{
 const data=await getSiteData();if(!data.commerce.enabled)return Response.json({error:'Les commandes en ligne ne sont pas ouvertes.'},{status:503});
 if(!Array.isArray(body.items)||body.items.length<1||body.items.length>25)return Response.json({error:'Votre panier est invalide.'},{status:400});
 const firstName=clean(body.customer?.firstName,80),lastName=clean(body.customer?.lastName,80),email=clean(body.customer?.email,180),phone=mobile(clean(body.customer?.phone,30));
 const line1=clean(body.address?.line1,120),line2=clean(body.address?.line2,120),postalCode=clean(body.address?.postalCode,5),city=clean(body.address?.city,80);
 if(!firstName||!lastName||!emailOk(email)||!/^0[67]\d{8}$/.test(phone)||!line1||!/^\d{5}$/.test(postalCode)||/^9[78]/.test(postalCode)||!city||body.consent!==true)return Response.json({error:'Vérifiez vos coordonnées, votre mobile français et votre adresse en France métropolitaine.'},{status:400});
 const quantities=new Map<string,number>();for(const raw of body.items){const id=clean(raw?.workId,80),quantity=Number(raw?.quantity);if(!id||!Number.isInteger(quantity)||quantity<1||quantity>20)return Response.json({error:'Une quantité est invalide.'},{status:400});quantities.set(id,(quantities.get(id)||0)+quantity)}
 const items=[];for(const [id,quantity] of quantities){const work=data.works.find(item=>item.id===id&&item.published&&item.forSale);if(!work||work.priceCents<1||work.stock<quantity)return Response.json({error:'Une pièce du panier n’est plus disponible dans cette quantité.'},{status:409});items.push({workId:work.id,title:work.title,image:work.image,unitPriceCents:work.priceCents,quantity,weightGrams:work.shippingWeightGrams})}
 const method=body.delivery?.method;if(method!=='chronopost-home'&&method!=='colissimo-home')return Response.json({error:'Choisissez un mode de livraison.'},{status:400});
 if(method==='chronopost-home'&&!data.commerce.chronopostHomeEnabled||method==='colissimo-home'&&!data.commerce.colissimoHomeEnabled)return Response.json({error:'Ce mode de livraison n’est pas disponible.'},{status:400});
 const weight=items.reduce((sum,item)=>sum+item.weightGrams*item.quantity,0);if(weight<1||weight>30000)return Response.json({error:'Le poids de cette commande ne permet pas la livraison choisie.'},{status:400});
 const subtotalCents=items.reduce((sum,item)=>sum+item.unitPriceCents*item.quantity,0);const normalShipping=method==='chronopost-home'?data.commerce.chronopostHomePriceCents:data.commerce.colissimoHomePriceCents;if(normalShipping<1)return Response.json({error:'Les frais de livraison ne sont pas encore configurés.'},{status:503});const priceCents=data.commerce.freeShippingThresholdCents>0&&subtotalCents>=data.commerce.freeShippingThresholdCents?0:normalShipping;
 const ip=request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'local',now=Date.now(),hits=(recent.get(ip)||[]).filter(time=>now-time<60*60*1000);if(hits.length>=5)return Response.json({error:'Trop de demandes ont été envoyées. Réessayez plus tard.'},{status:429});recent.set(ip,[...hits,now]);
 const order=await addOrder({customer:{firstName,lastName,email,phone},address:{line1,line2,postalCode,city,country:'FR'},delivery:{method,priceCents},items,subtotalCents,totalCents:subtotalCents+priceCents,notes:clean(body.notes,1000)});
 return Response.json({reference:order.reference},{status:201});
 });
}

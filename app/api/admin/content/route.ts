import {isAdmin,sameOrigin} from '../../../../lib/admin-auth';
import {editorialDefaults,imageDefaults} from '../../../../lib/editorial-content';
import {getSiteData,saveSiteData,withCommerceLock,type SiteData} from '../../../../lib/site-data';

export const runtime='nodejs';
export const dynamic='force-dynamic';

export async function GET(){
 if(!await isAdmin())return Response.json({error:'Accès refusé.'},{status:401});
 return Response.json(await getSiteData(),{headers:{'Cache-Control':'no-store'}});
}

const text=(value:unknown,max:number)=>typeof value==='string'&&value.trim().length<=max;
const filled=(value:unknown,max:number)=>text(value,max)&&String(value).trim().length>0;
const social=(value:unknown,domain:string)=>typeof value==='string'&&(value===''||(value.length<=300&&(()=>{try{const url=new URL(value);return url.protocol==='https:'&&(url.hostname===domain||url.hostname==='www.'+domain)}catch{return false}})()));
const reviewUrl=(value:unknown)=>typeof value==='string'&&(value===''||(value.length<=300&&(()=>{try{const url=new URL(value);return url.protocol==='https:'&&url.hostname==='g.page'}catch{return false}})()));
const image=(value:unknown)=>typeof value==='string'&&value.length<=300&&(value.startsWith('/images/')||/^\/api\/media\/[a-f0-9-]+\.webp$/.test(value));
const link=(value:unknown)=>typeof value==='string'&&value.length<=300&&(value.startsWith('/')||(()=>{try{return new URL(value).protocol==='https:'}catch{return false}})());
const unique=(items:{id:string}[])=>new Set(items.map(item=>item.id)).size===items.length;

function invalid(value:unknown):string|null{
 if(!value||typeof value!=='object')return 'Contenu invalide.';
 const data=value as SiteData,p=data.profile;
 if(!p||!['artist','introduction','story','approach','email','phone','location','legalName','legalAddress','siret','publisher','hostName','hostAddress'].every(key=>text(p[key as keyof typeof p],3000))||!social(p.instagram,'instagram.com')||!social(p.facebook,'facebook.com')||!social(p.pinterest,'pinterest.com')||!reviewUrl(p.googleReviewUrl))return 'Vérifiez les coordonnées et les liens du profil.';
 if(!data.editorial||!Object.keys(editorialDefaults).every(key=>filled(data.editorial[key],3000)))return 'Complétez les textes des pages avant d’enregistrer.';
 if(!data.images||!Object.keys(imageDefaults).every(key=>image(data.images[key])))return 'Une image de présentation est manquante ou invalide.';
 if(!Array.isArray(data.works)||data.works.length>100||!unique(data.works)||!data.works.every(w=>w&&filled(w.id,80)&&text(w.title,120)&&text(w.category,80)&&text(w.description,1500)&&text(w.alt,200)&&text(w.dimensions,80)&&Array.isArray(w.images)&&w.images.length<=8&&w.images.every(image)&&typeof w.featured==='boolean'&&typeof w.published==='boolean'&&typeof w.forSale==='boolean'&&Number.isInteger(w.priceCents)&&w.priceCents>=0&&Number.isInteger(w.stock)&&w.stock>=0&&Number.isInteger(w.weightGrams)&&w.weightGrams>=0&&Number.isInteger(w.shippingWeightGrams)&&w.shippingWeightGrams>=0&&(w.image===''||image(w.image))))return 'Vérifiez les créations.';
 if(data.works.some(w=>w.published&&(!filled(w.title,120)||!filled(w.category,80)||!filled(w.description,1500)||!image(w.image)||!filled(w.alt,200))))return 'Complétez les créations publiées, y compris leur image et sa description.';
 if(data.works.some(w=>w.forSale&&(!w.published||w.priceCents<1||(data.commerce?.enabled&&w.shippingWeightGrams<1))))return 'Une pièce en vente doit être publiée, comporter un prix et, avant l’ouverture des commandes, un poids de colis emballé.';
 if(!Array.isArray(data.services)||data.services.length>20||!unique(data.services)||!data.services.every(s=>s&&filled(s.id,80)&&text(s.title,120)&&text(s.description,500)&&text(s.detail,1500)&&text(s.alt,200)&&typeof s.published==='boolean'&&(s.image===''||image(s.image))))return 'Vérifiez les prestations.';
 if(data.services.some(s=>s.published&&(!filled(s.title,120)||!filled(s.description,500)||!filled(s.detail,1500)||!image(s.image)||!filled(s.alt,200))))return 'Complétez les prestations publiées, y compris leur image et sa description.';
 if(!Array.isArray(data.events)||data.events.length>100||!unique(data.events)||!data.events.every(e=>e&&filled(e.id,80)&&text(e.title,120)&&text(e.date,40)&&text(e.endDate,40)&&text(e.place,120)&&text(e.address,300)&&text(e.description,1500)&&text(e.details,5000)&&text(e.admission,300)&&text(e.bookingEmail,180)&&text(e.externalUrl,300)&&(!e.bookingEmail||/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.bookingEmail))&&(!e.externalUrl||(()=>{try{return new URL(e.externalUrl).protocol==='https:'}catch{return false}})())&&text(e.alt,200)&&(e.image===''||image(e.image))&&typeof e.published==='boolean'))return 'Vérifiez les événements.';
 if(data.events.some(e=>e.published&&(!filled(e.title,120)||!/^\d{4}-\d{2}-\d{2}$/.test(e.date)||(e.endDate&&(!/^\d{4}-\d{2}-\d{2}$/.test(e.endDate)||e.endDate<e.date))||!filled(e.place,120)||!filled(e.description,1500)||(e.image!==''&&!filled(e.alt,200)))))return 'Complétez les événements publiés, notamment leurs dates et leur lieu.';
 if(!Array.isArray(data.testimonials)||data.testimonials.length>30||!unique(data.testimonials)||!data.testimonials.every(t=>t&&filled(t.id,80)&&text(t.name,120)&&text(t.quote,1500)&&typeof t.published==='boolean'))return 'Vérifiez les avis clients.';
 if(data.testimonials.some(t=>t.published&&(!filled(t.name,120)||!filled(t.quote,1500))))return 'Complétez les avis clients avant de les publier.';
 if(!Array.isArray(data.faq)||data.faq.length>20||!unique(data.faq)||!data.faq.every(item=>item&&filled(item.id,80)&&text(item.question,200)&&text(item.answer,1500)&&typeof item.published==='boolean'))return 'Vérifiez la FAQ.';
 if(data.faq.some(item=>item.published&&(!filled(item.question,200)||!filled(item.answer,1500))))return 'Complétez les questions publiées de la FAQ.';
 const c=data.commerce;if(!c||typeof c.enabled!=='boolean'||typeof c.chronopostHomeEnabled!=='boolean'||typeof c.colissimoHomeEnabled!=='boolean'||![c.chronopostHomePriceCents,c.colissimoHomePriceCents,c.freeShippingThresholdCents].every(n=>Number.isInteger(n)&&n>=0)||!text(c.preparationDays,120)||!text(c.orderNotice,1000)||!text(c.termsUrl,300)||!text(c.withdrawalUrl,300))return 'Vérifiez les paramètres de vente en ligne.';
 if(c.enabled&&(!c.chronopostHomeEnabled&&!c.colissimoHomeEnabled||c.chronopostHomeEnabled&&c.chronopostHomePriceCents<1||c.colissimoHomeEnabled&&c.colissimoHomePriceCents<1||!filled(c.preparationDays,120)||!filled(c.orderNotice,1000)||!link(c.termsUrl)||!link(c.withdrawalUrl)))return 'Avant d’autoriser les commandes, activez une livraison, indiquez des frais TTC, les délais, les conditions de vente et la page de rétractation.';
 return null;
}

export async function PUT(request:Request){
 if(!await isAdmin())return Response.json({error:'Accès refusé.'},{status:401});
 if(!sameOrigin(request))return Response.json({error:'Requête refusée.'},{status:403});
 if(Number(request.headers.get('content-length')||0)>300000)return Response.json({error:'Contenu trop volumineux.'},{status:413});
 const body=await request.json().catch(()=>null);
 const error=invalid(body);
 if(error)return Response.json({error},{status:400});
 await withCommerceLock(()=>saveSiteData(body));
 return Response.json({ok:true});
}

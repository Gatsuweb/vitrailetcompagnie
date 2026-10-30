import 'server-only';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import {editorialDefaults,imageDefaults,faqDefaults} from './editorial-content';
export type Work = { id:string; title:string; category:string; description:string; image:string; images:string[]; alt:string; dimensions:string; featured:boolean; published:boolean; forSale:boolean; priceCents:number; stock:number; weightGrams:number; shippingWeightGrams:number };
export type Event = { id:string; title:string; date:string; endDate:string; place:string; address:string; description:string; details:string; admission:string; bookingEmail:string; externalUrl:string; image:string; alt:string; published:boolean };
export type Service = { id:string; title:string; description:string; detail:string; image:string; alt:string; published:boolean };
export type Testimonial = { id:string; name:string; quote:string; published:boolean };
export type FaqItem = { id:string; question:string; answer:string; published:boolean };
export type Message = { id:string; name:string; email:string; subject:string; message:string; createdAt:string; read:boolean };
export type CommerceSettings = { enabled:boolean; chronopostHomeEnabled:boolean; colissimoHomeEnabled:boolean; chronopostHomePriceCents:number; colissimoHomePriceCents:number; freeShippingThresholdCents:number; preparationDays:string; orderNotice:string; termsUrl:string; withdrawalUrl:string };
export type OrderStatus = 'new'|'confirmed'|'preparing'|'shipped'|'cancelled';
export type DeliveryMethod = 'chronopost-home'|'colissimo-home'|'dpd-home'|'dpd-pickup';
export type Order = { id:string; reference:string; createdAt:string; status:OrderStatus; customer:{firstName:string;lastName:string;email:string;phone:string}; address:{line1:string;line2:string;postalCode:string;city:string;country:string}; delivery:{method:DeliveryMethod;priceCents:number;pickup?:{id:string;name:string;address:string;postalCode:string;city:string}}; items:{workId:string;title:string;image:string;unitPriceCents:number;quantity:number;weightGrams:number}[]; subtotalCents:number; totalCents:number; notes:string; trackingNumber:string };
export type SiteData = { profile:{ artist:string; introduction:string; story:string; approach:string; email:string; phone:string; location:string; instagram:string; facebook:string; pinterest:string; googleReviewUrl:string; legalName:string; legalAddress:string; siret:string; publisher:string; hostName:string; hostAddress:string }; works:Work[]; events:Event[]; services:Service[]; testimonials:Testimonial[]; faq:FaqItem[]; editorial:Record<string,string>; images:Record<string,string>; commerce:CommerceSettings };
export const initialData:SiteData = {
 editorial:editorialDefaults, images:imageDefaults, faq:faqDefaults,
 commerce:{enabled:false,chronopostHomeEnabled:false,colissimoHomeEnabled:false,chronopostHomePriceCents:0,colissimoHomePriceCents:0,freeShippingThresholdCents:0,preparationDays:'',orderNotice:'Votre demande sera vérifiée par Valérie avant confirmation. Aucun paiement n’est demandé sur ce site.',termsUrl:'',withdrawalUrl:''},
 profile:{ artist:'Valérie Le Bihan', introduction:'Je suis Valérie Le Bihan. Je crée des vitraux artisanaux inspirés par la nature, la couleur et la lumière.', story:'Je respire et laisse venir mon inspiration du moment… Dessiner des œuvres décalées, pourquoi pas mystiques, ou tout simplement proches de ma terre natale… Chère Bretagne ! Rien n’est impossible.', approach:'Fleurs, oiseaux, paysages et personnages nourrissent mon imaginaire. Je prends le temps de choisir les textures et les transparences qui rendent chaque création singulière.', email:'vlebihan2222@gmail.com', phone:'+33 6 62 81 98 66', location:'', instagram:'', facebook:'https://www.facebook.com/profile.php?id=61583030155318', pinterest:'', googleReviewUrl:'https://g.page/r/Cd7MdckjPqMkECE/review', legalName:'Valérie Le Bihan', legalAddress:'10 Kermorvan, 22340 Plévin', siret:'51419386100028', publisher:'Valérie Le Bihan', hostName:'', hostAddress:'' },
 works:[
  {id:'rose',title:'La rose bleue',category:'Fleurs',description:'J’ai composé cette rose bleue pour que ses reflets changent avec la lumière.',image:'/images/creation-rose.webp',images:['/images/creation-rose.webp'],alt:'Rose bleue en vitrail dans un décor végétal',dimensions:'',featured:true,published:true,forSale:false,priceCents:0,stock:0,weightGrams:0,shippingWeightGrams:0},
  {id:'nature',title:'Au jardin',category:'Nature',description:'J’assemble formes végétales et verres colorés pour faire entrer le jardin dans la maison.',image:'/images/creation-nature.webp',images:['/images/creation-nature.webp'],alt:'Créations en vitrail inspirées de la nature',dimensions:'',featured:true,published:true,forSale:false,priceCents:0,stock:0,weightGrams:0,shippingWeightGrams:0},
  {id:'voiliers',title:'À fleur d’eau',category:'Paysages',description:'J’ai imaginé ces deux petits voiliers comme une invitation à laisser vagabonder le regard.',image:'/images/creation-voiliers.webp',images:['/images/creation-voiliers.webp'],alt:'Deux voiliers colorés en vitrail',dimensions:'',featured:true,published:true,forSale:false,priceCents:0,stock:0,weightGrams:0,shippingWeightGrams:0},
  {id:'dragon',title:'Le merveilleux',category:'Imaginaire',description:'J’aime donner vie à des silhouettes inattendues, entre conte et lumière.',image:'/images/creation-dragon.webp',images:['/images/creation-dragon.webp'],alt:'Dragon bleu réalisé en vitrail',dimensions:'',featured:false,published:true,forSale:false,priceCents:0,stock:0,weightGrams:0,shippingWeightGrams:0},
  {id:'papillon',title:'L’envol',category:'Nature',description:'J’ai choisi des verres éclatants pour saisir la légèreté d’un papillon.',image:'/images/creation-papillon.webp',images:['/images/creation-papillon.webp'],alt:'Papillon multicolore en vitrail',dimensions:'',featured:false,published:true,forSale:false,priceCents:0,stock:0,weightGrams:0,shippingWeightGrams:0}
 ],
 testimonials:[], events:[],
 services:[
  {id:'creations',title:'Créations artisanales',description:'Je crée des pièces décoratives au gré des couleurs, des saisons et de mes envies.',detail:'Parcourez mes créations et écrivez-moi pour connaître les pièces disponibles.',image:'/images/creation-rose.webp',alt:'Rose bleue façonnée en vitrail',published:true},
  {id:'sur-mesure',title:'Une pièce à votre image',description:'Vous avez un motif, une couleur ou un lieu à illuminer en tête ? J’aimerais découvrir votre idée.',detail:'Décrivez-moi votre envie, les dimensions souhaitées et votre calendrier. Je vous répondrai pour envisager sa réalisation.',image:'/images/creation-voiliers.webp',alt:'Voiliers colorés réalisés en vitrail',published:true},
  {id:'particuliers',title:'Pour les particuliers',description:'Je réalise sur devis des vitraux pensés pour s’intégrer à votre intérieur et à son architecture.',detail:'Séparations de pièces en vitrail\nCréations pour ouvertures de portes\nŒils-de-bœuf\nCréations personnalisées selon vos envies et votre intérieur',image:'/images/creation-nature.webp',alt:'Créations en vitrail inspirées de la nature',published:true},
  {id:'entreprises',title:'Pour les entreprises',description:'Je conçois également sur devis des réalisations en vitrail pour les espaces professionnels et leur communication.',detail:'Panneaux publicitaires de type roll-up\nBrise-vue en vitrail',image:'/images/creation-dragon.webp',alt:'Dragon bleu réalisé en vitrail',published:true},
  {id:'rencontres',title:'Rencontres & événements',description:'Je partage mon univers lors de rencontres et d’événements annoncés sur le site.',detail:'Je publierai les prochaines dates dès qu’elles seront confirmées.',image:'/images/creation-nature.webp',alt:'Créations en vitrail dans un décor inspiré de la nature',published:true}
 ]
};
const dataDir=process.env.SITE_DATA_DIR || join(process.cwd(),'data');
export const mediaDir=join(dataDir,'uploads');
const pathFor=(name:string)=>join(/* turbopackIgnore: true */ dataDir,name);
let writeQueue:Promise<unknown>=Promise.resolve();
async function readJson<T>(name:string,fallback:T):Promise<T> { try {return JSON.parse(await readFile(/* turbopackIgnore: true */ pathFor(name),'utf8')) as T} catch(error) {if((error as NodeJS.ErrnoException).code==='ENOENT') return fallback; throw error} }
async function saveJson<T>(name:string,value:T) { const pending=writeQueue.then(async()=>{await mkdir(dataDir,{recursive:true});const temporary=pathFor(name+'.'+randomUUID()+'.tmp');await writeFile(temporary,JSON.stringify(value,null,2),{encoding:'utf8',mode:0o600});await rename(temporary,pathFor(name))});writeQueue=pending.catch(()=>undefined);await pending }
export async function getSiteData(){const stored=await readJson<SiteData>('content.json',initialData);return {...initialData,...stored,profile:{...initialData.profile,...stored.profile},commerce:{...initialData.commerce,...stored.commerce,enabled:stored.commerce?.enabled===true&&typeof stored.commerce.chronopostHomeEnabled==='boolean'&&typeof stored.commerce.colissimoHomeEnabled==='boolean'},editorial:{...editorialDefaults,...stored.editorial},images:{...imageDefaults,...stored.images},faq:(stored.faq||faqDefaults).map(item=>({...item,published:item.published!==false})),events:(stored.events||initialData.events).map(event=>({...event,endDate:event.endDate||'',address:event.address||'',details:event.details||'',admission:event.admission||'',bookingEmail:event.bookingEmail||'',externalUrl:event.externalUrl||'',alt:event.alt||event.title})),works:(stored.works||initialData.works).map(work=>{const images=Array.isArray(work.images)?work.images.filter(Boolean):[];const image=work.image||images[0]||'';return {...work,image,images:images.length?images:image?[image]:[],dimensions:typeof work.dimensions==='string'?work.dimensions:'',published:work.published!==false,forSale:work.forSale===true,priceCents:Number.isInteger(work.priceCents)?work.priceCents:0,stock:Number.isInteger(work.stock)?work.stock:0,weightGrams:Number.isInteger(work.weightGrams)?work.weightGrams:0,shippingWeightGrams:Number.isInteger(work.shippingWeightGrams)?work.shippingWeightGrams:0}}),testimonials:(stored.testimonials||[]).map(item=>({...item,published:item.published!==false})),services:(stored.services||initialData.services).map(service=>{const fallback=initialData.services.find(item=>item.id===service.id);return {...service,published:service.published!==false,image:service.image||fallback?.image||'',alt:service.alt||fallback?.alt||service.title}})}}
export async function saveSiteData(value:SiteData){await saveJson('content.json',value)}
export async function getMessages(){return readJson<Message[]>('messages.json',[])}
export async function saveMessages(value:Message[]){await saveJson('messages.json',value)}
let messageQueue:Promise<unknown>=Promise.resolve();
export async function updateMessages<T>(update:(items:Message[])=>{items:Message[];result:T}):Promise<T>{
 const pending=messageQueue.then(async()=>{const current=await getMessages();const next=update(current);await saveMessages(next.items);return next.result});
 messageQueue=pending.catch(()=>undefined);
 return pending;
}
export async function addMessage(value:Omit<Message,'id'|'createdAt'|'read'>){
 const message={...value,id:randomUUID(),createdAt:new Date().toISOString(),read:false};
 return updateMessages(items=>({items:[message,...items],result:message}));
}

export async function getOrders(){return readJson<Order[]>('orders.json',[])}
export async function saveOrders(value:Order[]){await saveJson('orders.json',value)}
let orderQueue:Promise<unknown>=Promise.resolve();
let commerceQueue:Promise<unknown>=Promise.resolve();
export function withCommerceLock<T>(action:()=>Promise<T>):Promise<T>{
 const pending=commerceQueue.then(action);
 commerceQueue=pending.catch(()=>undefined);
 return pending;
}
export async function updateOrders<T>(update:(items:Order[])=>{items:Order[];result:T}):Promise<T>{
 const pending=orderQueue.then(async()=>{const current=await getOrders();const next=update(current);await saveOrders(next.items);return next.result});
 orderQueue=pending.catch(()=>undefined);
 return pending;
}
export async function addOrder(value:Omit<Order,'id'|'reference'|'createdAt'|'status'|'trackingNumber'>){
 const createdAt=new Date().toISOString();
 const reference='VC-'+createdAt.slice(2,10).replaceAll('-','')+'-'+randomUUID().slice(0,6).toUpperCase();
 const order:Order={...value,id:randomUUID(),reference,createdAt,status:'new',trackingNumber:''};
 return updateOrders(items=>({items:[order,...items],result:order}));
}

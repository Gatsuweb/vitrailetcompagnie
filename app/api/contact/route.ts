import {addMessage} from '../../../lib/site-data';
import {sameOrigin} from '../../../lib/admin-auth';
export const runtime='nodejs';
const recent=new Map<string,number[]>();
const clean=(value:unknown,max:number)=>typeof value==='string'?value.trim().slice(0,max+1):'';
export async function POST(request:Request){
 if(!sameOrigin(request))return Response.json({error:'Requête refusée.'},{status:403});
 if(Number(request.headers.get('content-length')||0)>12000)return Response.json({error:'Message trop long.'},{status:413});
 const body=await request.json().catch(()=>null);if(!body||typeof body!=='object')return Response.json({error:'Formulaire invalide.'},{status:400});
 if(body.website)return Response.json({ok:true});
 const name=clean(body.name,100),email=clean(body.email,180),subject=clean(body.subject,120),message=clean(body.message,4000);
 if(name.length<2||name.length>100||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||subject.length<2||subject.length>120||message.length<10||message.length>4000||body.consent!==true)return Response.json({error:'Vérifiez les champs obligatoires et le consentement.'},{status:400});
 const ip=request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'local';
 const now=Date.now(),hits=(recent.get(ip)||[]).filter(t=>now-t<60*60*1000);if(hits.length>=5)return Response.json({error:'Trop de messages envoyés. Réessayez plus tard.'},{status:429});recent.set(ip,[...hits,now]);
 await addMessage({name,email,subject,message});return Response.json({ok:true});
}


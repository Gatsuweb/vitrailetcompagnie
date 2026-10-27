import {NextResponse} from 'next/server';
import {checkPassword,clearSession,createSession,sameOrigin} from '../../../../lib/admin-auth';
export const runtime='nodejs';
const attempts=new Map<string,{count:number;until:number}>();
export async function POST(request:Request){
 if(!sameOrigin(request))return NextResponse.json({error:'Requête refusée.'},{status:403});
 const ip=request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'local';
 const entry=attempts.get(ip);if(entry&&entry.until>Date.now()&&entry.count>=6)return NextResponse.json({error:'Trop de tentatives. Réessayez plus tard.'},{status:429});
 const body=await request.json().catch(()=>({}));
 if(typeof body.password!=='string'||!checkPassword(body.password)){
  const current=entry&&entry.until>Date.now()?entry.count:0;attempts.set(ip,{count:current+1,until:Date.now()+15*60*1000});
  return NextResponse.json({error:'Mot de passe incorrect.'},{status:401});
 }
 attempts.delete(ip);await createSession();return NextResponse.json({ok:true});
}
export async function DELETE(request:Request){if(!sameOrigin(request))return NextResponse.json({error:'Requête refusée.'},{status:403});await clearSession();return NextResponse.json({ok:true})}


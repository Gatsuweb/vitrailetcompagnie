import 'server-only';
import {createHmac,randomBytes,scryptSync,timingSafeEqual} from 'node:crypto';
import {cookies} from 'next/headers';
const COOKIE='vc_admin';
const SESSION_SECONDS=60*60*12;
const secret=()=>process.env.ADMIN_SESSION_SECRET||'';
export function checkPassword(candidate:string){const passwords=[process.env.ADMIN_PASSWORD,process.env.ADMIN_CLIENT_PASSWORD].filter((value):value is string=>Boolean(value));if(!passwords.length||candidate.length>256)return false;const salt=process.env.ADMIN_PASSWORD_SALT||'vitrail-compagnie';const actual=scryptSync(candidate,salt,32);return passwords.some(password=>timingSafeEqual(actual,scryptSync(password,salt,32)))}
function sign(payload:string){return createHmac('sha256',secret()).update(payload).digest('base64url')}
export async function createSession(){if(!secret())throw new Error('ADMIN_SESSION_SECRET absent');const payload=String(Date.now()+SESSION_SECONDS*1000)+'.'+randomBytes(16).toString('base64url');(await cookies()).set(COOKIE,payload+'.'+sign(payload),{httpOnly:true,sameSite:'strict',secure:process.env.NODE_ENV==='production',path:'/',maxAge:SESSION_SECONDS})}
export async function clearSession(){(await cookies()).delete(COOKIE)}
export async function isAdmin(){if(!secret())return false;const value=(await cookies()).get(COOKIE)?.value||'';const pieces=value.split('.');if(pieces.length!==3||!Number.isFinite(Number(pieces[0]))||Number(pieces[0])<Date.now())return false;const actual=Buffer.from(pieces[2]);const expected=Buffer.from(sign(pieces[0]+'.'+pieces[1]));return actual.length===expected.length&&timingSafeEqual(actual,expected)}
export function sameOrigin(request:Request){const origin=request.headers.get('origin');if(!origin)return false;try{const requestedHost=request.headers.get('host')||new URL(request.url).host;return new URL(origin).host===requestedHost}catch{return false}}


import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {mediaDir} from '../../../../lib/site-data';
export const runtime='nodejs';
export async function GET(_request:Request,{params}:{params:Promise<{name:string}>}){const {name}=await params;if(!/^[a-f0-9-]{36}\.webp$/.test(name))return new Response(null,{status:404});try{const bytes=await readFile(join(mediaDir,name));return new Response(bytes,{headers:{'Content-Type':'image/webp','Cache-Control':'public, max-age=31536000, immutable','X-Content-Type-Options':'nosniff'}})}catch{return new Response(null,{status:404})}}


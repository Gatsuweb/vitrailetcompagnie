import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {get as getBlob} from '@vercel/blob';
import {mediaDir,usesBlobStorage} from '../../../../lib/site-data';
export const runtime='nodejs';
export async function GET(_request:Request,{params}:{params:Promise<{name:string}>}){const {name}=await params;if(!/^[a-f0-9-]{36}\.webp$/.test(name))return new Response(null,{status:404});try{
 if(usesBlobStorage){const result=await getBlob('site-media/'+name,{access:'private'});if(!result||result.statusCode!==200||!result.stream)return new Response(null,{status:404});return new Response(result.stream,{headers:{'Content-Type':'image/webp','Cache-Control':'public, max-age=86400','X-Content-Type-Options':'nosniff'}})}
 const bytes=await readFile(join(mediaDir,name));return new Response(bytes,{headers:{'Content-Type':'image/webp','Cache-Control':'public, max-age=31536000, immutable','X-Content-Type-Options':'nosniff'}})
 }catch{return new Response(null,{status:404})}}


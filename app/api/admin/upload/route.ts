import {randomUUID} from 'node:crypto';
import {join} from 'node:path';
import {mkdir,writeFile} from 'node:fs/promises';
import sharp from 'sharp';
import {isAdmin,sameOrigin} from '../../../../lib/admin-auth';
import {mediaDir} from '../../../../lib/site-data';
export const runtime='nodejs';
export async function POST(request:Request){
 if(!await isAdmin())return Response.json({error:'Accès refusé.'},{status:401});
 if(!sameOrigin(request))return Response.json({error:'Requête refusée.'},{status:403});
 if(Number(request.headers.get('content-length')||0)>9_000_000)return Response.json({error:'Image trop volumineuse.'},{status:413});
 const data=await request.formData().catch(()=>null);const input=data?.get('image');
 if(!(input instanceof File)||input.size>8_000_000||input.size===0||!['image/jpeg','image/png','image/webp'].includes(input.type))return Response.json({error:'Choisissez une image JPEG, PNG ou WebP de moins de 8 Mo.'},{status:400});
 try{const buffer=Buffer.from(await input.arrayBuffer());const output=await sharp(buffer,{limitInputPixels:25_000_000}).rotate().resize({width:1800,height:1800,fit:'inside',withoutEnlargement:true}).webp({quality:84}).toBuffer();const name=randomUUID()+'.webp';await mkdir(mediaDir,{recursive:true});await writeFile(join(mediaDir,name),output,{flag:'wx'});return Response.json({url:'/api/media/'+name})}catch{return Response.json({error:'Image illisible.'},{status:400})}
}



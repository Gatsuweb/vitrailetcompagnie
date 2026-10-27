import 'server-only';
import type {Order} from './site-data';
const ascii=(value:string)=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^\x20-\x7E]/g,' ').replace(/\s+/g,' ').trim();
const fill=(line:string[],position:number,length:number,value:string,numeric=false)=>{const clean=ascii(value).slice(0,length);const text=numeric?clean.padStart(length,'0'):clean.padEnd(length,' ');for(let i=0;i<length;i++)line[position-1+i]=text[i]};
export function makeDpdStationFile(order:Order){
 const sender={name:process.env.DPD_SENDER_NAME||'',address:process.env.DPD_SENDER_ADDRESS||'',postalCode:process.env.DPD_SENDER_POSTAL_CODE||'',city:process.env.DPD_SENDER_CITY||'',phone:process.env.DPD_SENDER_PHONE||'',account:process.env.DPD_STATION_ACCOUNT||''};
 if(!sender.name||!sender.address||!/^\d{5}$/.test(sender.postalCode)||!sender.city||!/^\d{1,8}$/.test(sender.account))throw new Error('Configuration expéditeur DPD incomplète.');
 const line=Array<string>(2246).fill(' '),weightDecagrams=Math.max(1,Math.ceil(order.items.reduce((sum,item)=>sum+item.weightGrams*item.quantity,0)/10));
 fill(line,1,35,order.reference);fill(line,38,8,String(weightDecagrams),true);fill(line,61,35,order.customer.lastName);fill(line,96,35,order.customer.firstName);
 fill(line,271,10,order.address.postalCode);fill(line,281,35,order.address.city);fill(line,326,35,order.address.line1);fill(line,371,3,'F');fill(line,374,30,order.customer.phone);
 fill(line,419,35,sender.name);fill(line,629,10,sender.postalCode);fill(line,639,35,sender.city);fill(line,684,35,sender.address);fill(line,729,3,'F');fill(line,732,20,sender.phone);
 const now=new Intl.DateTimeFormat('fr-FR',{timeZone:'Europe/Paris',day:'2-digit',month:'2-digit',year:'numeric'}).format(new Date());fill(line,902,10,now);fill(line,912,8,sender.account,true);
 fill(line,1232,80,order.customer.email);fill(line,1312,35,order.customer.phone);
 if(order.delivery.method==='dpd-pickup')fill(line,1443,8,order.delivery.pickup?.id||'');else fill(line,1569,1,'+');
 fill(line,1570,35,order.customer.firstName+' '+order.customer.lastName);
 return '$VERSION=110\r\n'+line.join('')+'\r\n';
}

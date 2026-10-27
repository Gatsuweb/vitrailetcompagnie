import type {Event} from './site-data';

const fullDate=new Intl.DateTimeFormat('fr-FR',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'});
const monthYear=new Intl.DateTimeFormat('fr-FR',{month:'long',year:'numeric',timeZone:'UTC'});
const atNoon=(date:string)=>new Date(`${date}T12:00:00Z`);

export function eventDateLabel(event:Event){
 if(!event.date)return 'Date à venir';
 if(!event.endDate||event.endDate===event.date)return fullDate.format(atNoon(event.date));
 if(event.date.slice(0,7)===event.endDate.slice(0,7))return `${Number(event.date.slice(8))} et ${Number(event.endDate.slice(8))} ${monthYear.format(atNoon(event.date))}`;
 return `Du ${fullDate.format(atNoon(event.date))} au ${fullDate.format(atNoon(event.endDate))}`;
}

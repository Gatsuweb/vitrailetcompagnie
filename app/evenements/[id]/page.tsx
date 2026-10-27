import type {Metadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {InnerShell} from '../../../components/SiteChrome';
import {eventDateLabel} from '../../../lib/event-format';
import {getSiteData} from '../../../lib/site-data';
import e from '../../editorial.module.css';
import s from '../events.module.css';

export const dynamic='force-dynamic';
type Props={params:Promise<{id:string}>};

export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {id}=await params;
 const {events}=await getSiteData();
 const event=events.find(item=>item.id===id&&item.published);
 return event?{title:`${event.title} | Vitrail & compagnie`,description:event.description,openGraph:{title:event.title,description:event.description,images:event.image?[event.image]:[]}}:{title:'Événement introuvable | Vitrail & compagnie',robots:{index:false}};
}

export default async function EventDetails({params}:Props){
 const {id}=await params;
 const {events}=await getSiteData();
 const event=events.find(item=>item.id===id&&item.published);
 if(!event)notFound();
 const paragraphs=event.details.split(/\n\s*\n/).map(text=>text.trim()).filter(Boolean);
 const bookingSubject=encodeURIComponent(`Inscription — ${event.title}`);
 return <InnerShell><article className={e.page}>
  <div className={s.detailTop}><Link href="/evenements">← Tous les événements</Link></div>
  <header className={s.detailHero}>
   <div className={s.detailIntro}><p className={e.eyebrow}>RENDEZ-VOUS À L’ATELIER</p><time dateTime={event.date}>{eventDateLabel(event)}</time><h1>{event.title}</h1><p className={s.detailLead}>{event.description}</p><p className={s.detailPlace}>{event.place}</p></div>
   {event.image&&<figure className={s.detailPoster}><img src={event.image} alt={event.alt||event.title}/><figcaption>Affiche de l’événement</figcaption></figure>}
  </header>
  <div className={s.detailBody}>
   <div className={s.detailStory}><p className={e.eyebrow}>LE RENDEZ-VOUS</p><h2>Venez nous rencontrer.</h2>{paragraphs.length?paragraphs.map((paragraph,index)=><p key={index}>{paragraph}</p>):<p>{event.description}</p>}</div>
   <aside className={s.practical}><h2>Informations pratiques</h2><dl><div><dt>Dates</dt><dd>{eventDateLabel(event)}</dd></div><div><dt>Lieu</dt><dd>{event.place}{event.address&&<><br/>{event.address}</>}</dd></div>{event.admission&&<div><dt>Accès et tarifs</dt><dd>{event.admission}</dd></div>}</dl>{event.bookingEmail&&<a className={e.button} href={`mailto:${event.bookingEmail}?subject=${bookingSubject}`}>S’inscrire ou poser une question <span aria-hidden="true">↗</span></a>}{event.externalUrl&&<a className={s.external} href={event.externalUrl} target="_blank" rel="noopener noreferrer">Voir le programme de l’organisateur ↗</a>}</aside>
  </div>
  <div className={s.detailBottom}><Link href="/evenements">← Revenir à l’agenda</Link></div>
 </article></InnerShell>;
}

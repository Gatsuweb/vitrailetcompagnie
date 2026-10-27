import type {Metadata} from 'next';
import Link from 'next/link';
import {getSiteData} from '../../lib/site-data';
import {eventDateLabel} from '../../lib/event-format';
import {InnerShell} from '../../components/SiteChrome';
import e from '../editorial.module.css';
import s from './events.module.css';

export const dynamic='force-dynamic';

export async function generateMetadata():Promise<Metadata>{
 const {editorial:t}=await getSiteData();
 return {title:t.seoEventsTitle,description:t.seoEventsDescription};
}

export default async function Events(){
 const {events,editorial:t}=await getSiteData();
 const published=events.filter(event=>event.published).sort((a,b)=>a.date.localeCompare(b.date));
 return <InnerShell><div className={e.page}>
  <header className={e.wideIntro}><p className={e.eyebrow}>L’AGENDA DE L’ATELIER</p><h1 className={e.title}>{t.eventsTitle}<br/><em>{t.eventsAccent}</em></h1><p className={e.lead}>{t.eventsIntro}</p></header>
  <section className={s.list} aria-label="Agenda">
   {published.length?published.map(event=><article key={event.id}>
    <Link className={s.card} href={`/evenements/${encodeURIComponent(event.id)}`} aria-label={`Découvrir l’événement ${event.title}`}>
     <div className={s.cardImage}>{event.image?<img src={event.image} alt={event.alt||event.title}/>:<span>Vitrail & compagnie</span>}</div>
     <div className={s.cardCopy}><time dateTime={event.date}>{eventDateLabel(event)}</time><h2>{event.title}</h2><p className={s.cardPlace}>{event.place}</p><p className={s.cardDescription}>{event.description}</p><span className={s.cardAction}>Découvrir l’événement <span aria-hidden="true">↗</span></span></div>
    </Link>
   </article>):<div className={s.empty}><h2>{t.eventsEmptyTitle}</h2><p>{t.eventsEmptyText}</p></div>}
  </section>
  <section className={e.contactBand}><div><p className={e.eyebrow}>UNE QUESTION ?</p><h2 className={e.sectionTitle}>{t.eventsContactTitle}<br/><em>{t.eventsContactAccent}</em></h2></div><Link className={e.button} href="/contact">M’écrire <span aria-hidden="true">↗</span></Link></section>
 </div></InnerShell>;
}

import type {Metadata} from 'next';
import {getSiteData} from '../../lib/site-data';
import {InnerShell} from '../../components/SiteChrome';
import ContactForm from '../../components/ContactForm';
import e from '../editorial.module.css';
import s from '../inner-pages.module.css';
export const dynamic='force-dynamic';
export async function generateMetadata():Promise<Metadata>{const {editorial:t}=await getSiteData();return {title:t.seoContactTitle,description:t.seoContactDescription}}
export default async function Contact(){const {profile,editorial:t}=await getSiteData();return <InnerShell><div className={e.page}><header className={e.wideIntro}><p className={e.eyebrow}>M’ÉCRIRE</p><h1 className={e.title}>{t.contactTitle}<br/><em>{t.contactAccent}</em></h1><p className={e.lead}>{t.contactIntro}</p></header><section className={s.contactWrap} aria-label="Contacter l’atelier"><aside className={s.contactAside}><p className={e.eyebrow}>JE SUIS À VOTRE ÉCOUTE</p><h2 className={e.sectionTitle}>{t.contactAsideTitle}<br/><em>{t.contactAsideAccent}</em></h2><p>{t.contactAsideText}</p>{profile.email&&<p><strong>E-mail</strong><br/><a href={'mailto:'+profile.email}>{profile.email}</a></p>}{profile.phone&&<p><strong>Téléphone</strong><br/><a href={'tel:'+profile.phone.replace(/[^+\d]/g,'')}>{profile.phone}</a></p>}{profile.location&&<p><strong>Atelier</strong><br/>{profile.location}</p>}{(profile.instagram.startsWith('https://www.instagram.com/')||profile.instagram.startsWith('https://instagram.com/'))&&<p><a href={profile.instagram} target="_blank" rel="noopener noreferrer">Suivre l’atelier sur Instagram ↗</a></p>}{profile.facebook&&<p><a href={profile.facebook} target="_blank" rel="noopener noreferrer">Me retrouver sur Facebook ↗</a></p>}</aside><ContactForm copy={t}/></section></div></InnerShell>}


import type {Metadata} from 'next';
import {getSiteData} from '../../lib/site-data';
import {InnerShell} from '../../components/SiteChrome';
import Reveal from '../../components/Reveal';
import e from '../editorial.module.css';
import s from '../inner-pages.module.css';
export const dynamic='force-dynamic';
export async function generateMetadata():Promise<Metadata>{const {editorial:t}=await getSiteData();return {title:t.seoAboutTitle,description:t.seoAboutDescription}}
export default async function About(){const {profile,editorial:t,images}=await getSiteData();return <InnerShell><div className={e.page}><section className={s.heroSplit}><div className={s.heroText}><p className={e.eyebrow}>L’UNIVERS DE L’ATELIER</p><h1 className={e.title}>{t.aboutTitle}<br/><em>{t.aboutAccent}</em></h1><p className={e.lead}>{profile.introduction}</p></div><div className={s.heroPhoto}><img src={images.aboutHero} alt={t.aboutHeroAlt} /></div></section><section className={s.story}><Reveal><div className={s.storyImage}><img src={images.aboutStory} alt={t.aboutStoryAlt}/></div></Reveal><Reveal className={s.storyText}><p className={e.eyebrow}>L’ATELIER DE {profile.artist.toUpperCase()}</p><h2 className={e.sectionTitle}>{t.aboutStoryTitle}<br/><em>{t.aboutStoryAccent}</em></h2><p>{profile.story}</p><p>{profile.approach}</p></Reveal></section><section className={e.contactBand}><div><p className={e.eyebrow}>VOTRE PROJET</p><h2 className={e.sectionTitle}>{t.aboutContactTitle}<br/><em>{t.aboutContactAccent}</em></h2></div><a className={e.button} href="/contact">M’écrire <span aria-hidden="true">↗</span></a></section></div></InnerShell>}


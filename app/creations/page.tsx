import type {Metadata} from 'next';
import {getSiteData} from '../../lib/site-data';
import {InnerShell} from '../../components/SiteChrome';
import Gallery from '../../components/Gallery';
import e from '../editorial.module.css';
import s from '../inner-pages.module.css';

export const dynamic='force-dynamic';

export async function generateMetadata():Promise<Metadata>{
 const {editorial}=await getSiteData();
 return {title:editorial.seoWorksTitle,description:editorial.seoWorksDescription};
}

export default async function Creations(){
 const {works,commerce,editorial}=await getSiteData();
 return <InnerShell><div className={e.page}>
  <header className={e.wideIntro}>
   <p className={e.eyebrow}>MES CRÉATIONS</p>
   <h1 className={e.title}>{editorial.worksTitle}<br/><em>{editorial.worksAccent}</em></h1>
   <p className={e.lead}>{editorial.worksIntro}</p>
  </header>
  <section className={s.galleryArea} aria-label="Créations en vitrail">
   <Gallery works={works.filter(work=>work.published)} commerceEnabled={commerce.enabled}/>
  </section>
  <section className={e.contactBand}>
   <div><p className={e.eyebrow}>UNE CRÉATION VOUS PLAÎT ?</p><h2 className={e.sectionTitle}>{editorial.worksContactTitle} <em>{editorial.worksContactAccent}</em></h2></div>
   <a className={e.button} href="/contact">M’écrire <span aria-hidden="true">↗</span></a>
  </section>
 </div></InnerShell>;
}

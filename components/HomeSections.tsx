import Image from 'next/image';
import Link from 'next/link';
import QRCode from 'qrcode';
import {getSiteData} from '../lib/site-data';
import SiteNav from './SiteNav';
import Reveal from './Reveal';
import BotanicalArtwork from './BotanicalArtwork';
import e from '../app/editorial.module.css';
import s from '../app/home-sections.module.css';

export default async function HomeSections(){
 const data=await getSiteData();
 const t=data.editorial, images=data.images;
 const publishedWorks=data.works.filter(w=>w.published);
 const featured=(publishedWorks.some(w=>w.featured)?publishedWorks.filter(w=>w.featured):publishedWorks).slice(0,3);
 const testimonials=data.testimonials.filter(item=>item.published);
 const faq=data.faq.filter(item=>item.published);
 const qrSource=data.profile.googleReviewUrl==='https://g.page/r/Cd7MdckjPqMkECE/review'?'/images/avis-google-qr.png':data.profile.googleReviewUrl?await QRCode.toDataURL(data.profile.googleReviewUrl,{width:180,margin:2,errorCorrectionLevel:'M'}):'';
 return <>
  <SiteNav home commerceEnabled={data.commerce.enabled}/>
  <section id="univers" className={s.about} aria-labelledby="home-about">
   <BotanicalArtwork/>
   <Reveal className={s.aboutHeading}>
    <p className={e.eyebrow}>MON UNIVERS</p>
    <h2 className={e.sectionTitle} id="home-about">{t.homeAboutTitle}<br/><em>{t.homeAboutAccent}</em></h2>
   </Reveal>
   <Reveal className={s.aboutImage}><img src={images.homeAbout} alt={t.homeAboutAlt} loading="lazy"/></Reveal>
   <Reveal className={s.aboutText}>
    <p className={s.aboutLead}>{data.profile.introduction}</p>
    <Link className={e.button} href="/a-propos">Découvrir mon histoire <span aria-hidden="true">↗</span></Link>
   </Reveal>
   <Reveal className={s.aboutSecondary}><img src={images.homeAboutSecondary} alt={t.homeAboutSecondaryAlt} loading="lazy"/></Reveal>
  </section>
  <section id="creations" className={s.works} aria-labelledby="home-creations">
   <div className={s.sectionTop}><div><p className={e.eyebrow}>QUELQUES CRÉATIONS</p><h2 className={e.sectionTitle} id="home-creations">{t.homeWorksTitle}<br/><em>{t.homeWorksAccent}</em></h2></div><p>{t.homeWorksDescription}</p></div>
   <div className={e.featureGrid}>{featured.map((w,i)=><Reveal key={w.id} className={e.imageReveal}><Link className={e.card} href="/creations"><div className={e.cardImage}><img className={e.imageCover} src={w.image} alt={w.alt} loading="lazy"/></div><div className={e.cardMeta}><span>{String(i+1).padStart(2,'0')} / {w.category}</span><span aria-hidden="true">↗</span></div><h3>{w.title}</h3><p>{w.description}</p></Link></Reveal>)}</div>
   <div className={s.worksBottom}><Link className={e.button} href="/creations">Voir toutes mes créations <span aria-hidden="true">↗</span></Link></div>
  </section>
  <section className={s.reviews} aria-labelledby="home-reviews">
   <div className={s.reviewTopline}><p>VOS RETOURS</p><span>LA SUITE DE L’HISTOIRE ↘</span></div>
   <div className={s.reviewsHeader}>
    <div className={s.reviewsCopy}>
     <h2 className={s.reviewsTitle} id="home-reviews">{t.homeReviewsTitle}<br/><em>{t.homeReviewsAccent}</em></h2>
     <p>{t.homeReviewsDescription}</p>
    </div>
    <div className={s.reviewVisualFrame}>
     <div className={s.reviewVisual}><Image src={images.homeReviews} alt={t.homeReviewsAlt} fill sizes="(max-width: 800px) 70vw, 32vw"/></div>
     <span className={s.reviewVisualNote}>UNE CRÉATION, MILLE REFLETS</span>
    </div>
   </div>
   {testimonials.length>0&&<div className={s.reviewList}>{testimonials.map(item=><article className={s.review} key={item.id}><blockquote>« {item.quote} »</blockquote><cite>{item.name}</cite></article>)}</div>}
   {data.profile.googleReviewUrl&&<div className={s.reviewAction}>
    <div className={s.reviewActionCopy}>
     <span className={s.reviewActionKicker}>VOTRE MOT COMPTE</span>
     <p className={s.reviewPrompt}>{t.homeReviewsPrompt}<br/><em>{t.homeReviewsPromptAccent}</em></p>
     <a className={s.reviewCta} href={data.profile.googleReviewUrl} target="_blank" rel="noopener noreferrer">Donner mon avis sur Google <span aria-hidden="true">↗</span></a>
    </div>
    <a className={s.qrLink} href={data.profile.googleReviewUrl} target="_blank" rel="noopener noreferrer" aria-label="Ouvrir la page pour donner un avis sur Google"><Image src={qrSource} alt="Code QR vers le formulaire d’avis Google" width={100} height={100} unoptimized/><span className={s.qrText}><strong>AVIS GOOGLE</strong><small>Scannez le code pour partager votre expérience.</small><i aria-hidden="true">↗</i></span></a>
   </div>}
  </section>
  <section className={s.faq} aria-labelledby="home-faq">
   <div className={s.faqIntro}>
    <p className={e.eyebrow}>À SAVOIR</p>
    <h2 className={s.faqTitle} id="home-faq">{t.faqTitle}<br/><em>{t.faqAccent}</em></h2>
    <p>{t.faqDescription}</p>
    <Link className={s.faqLink} href="/contact">Me poser une autre question <span aria-hidden="true">↗</span></Link>
   </div>
   <div className={s.faqList}>
    <p className={s.faqListLabel}>QUESTIONS FRÉQUENTES <span>{String(faq.length).padStart(2,'0')} QUESTIONS</span></p>
    {faq.map((item,i)=><details className={s.faqItem} key={item.id}><summary><span className={s.faqNumber}>{String(i+1).padStart(2,'0')}</span><span className={s.faqQuestion}>{item.question}</span><span className={s.faqToggle} aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}
   </div>
  </section>
  <section className={s.contact}><div><p className={e.eyebrow}>UNE IDÉE EN TÊTE ?</p><h2 className={e.sectionTitle}>{t.homeContactTitle}<br/><em>{t.homeContactAccent}</em></h2></div><Link className={e.button} href="/contact">M’écrire <span aria-hidden="true">↗</span></Link></section>
 </>;
}

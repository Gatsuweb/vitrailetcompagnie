'use client';
import { getImageProps } from 'next/image';
import SuspendedMoon from './SuspendedMoon';
import { useParallaxScene } from '../hooks/useParallaxScene';
import { useHeroIntro } from '../hooks/useHeroIntro';
import styles from './StainedGlassHero.module.css';
export default function StainedGlassHero({editorial,images}:{editorial:Record<string,string>;images:Record<string,string>}) {
  const sceneLayers = [
  { name:'background', desktop:images.heroDesktopBackground, mobile:images.heroMobileBackground },
  { name:'middle', desktop:images.heroDesktopMiddle, mobile:images.heroMobileMiddle },
  { name:'foreground', desktop:images.heroDesktopForeground, mobile:images.heroMobileForeground },
].map((layer, index) => {
  const common = { alt:'', fill:true, sizes:'100vw', quality:90, className:styles.image, loading:'eager' as const };
  return {
    name:layer.name,
    desktop:getImageProps({ ...common, src:layer.desktop, fetchPriority:index === 0 ? 'high' : 'auto' }).props,
    mobile:getImageProps({ ...common, src:layer.mobile }).props,
  };
});

  const intro=useHeroIntro();
  const sceneRef=useParallaxScene(intro.complete);
  return <section className={styles.hero} ref={sceneRef} aria-labelledby={intro.complete ? "hero-title" : "intro-title"} id="accueil" data-intro={intro.phase}>
    <a href="#creations" className={styles.skipLink} hidden={!intro.complete}>Passer à la découverte des créations</a>
    <div className={styles.scene} aria-hidden="true">
      {sceneLayers.map((layer,index)=><div className={styles.layer+' '+styles[layer.name]} data-depth={index} key={layer.name}>
        <div className={styles.reveal}>
          <picture>
            <source media="(max-width:767px)" srcSet={layer.mobile.srcSet} sizes={layer.mobile.sizes}/>
            <img {...layer.desktop} />
          </picture>
        </div>
      </div>)}
    </div>
    <SuspendedMoon requested={intro.moonRequested} introComplete={intro.complete} />
    <div className={styles.content} inert={!intro.complete} aria-hidden={!intro.complete}>
      {/* <p className={styles.eyebrow}><span/> {editorial.heroEyebrow}</p> */}
      <h1 id="hero-title" ref={intro.titleRef} tabIndex={-1}>{editorial.heroTitle}<br/><em>{editorial.heroTitleAccent}</em></h1>
      <p className={styles.description}>{editorial.heroDescription}</p>
      <a className={styles.cta} href="#creations">Découvrir les créations <span aria-hidden="true">↗</span></a>
      <p className={styles.signature}>{editorial.heroSignature}</p>
    </div>
    {intro.complete&&<a className={styles.mobileCue} href="#univers">Découvrir mon univers <span aria-hidden="true">↓</span></a>}
    <div className={styles.bottom} inert={!intro.complete} aria-hidden={!intro.complete}><p>MATIÈRE <span>·</span> LUMIÈRE <span>·</span> ÉMOTION</p><a href="#creations">Entrer dans l’univers <span aria-hidden="true">↓</span></a><span className={styles.number}>VITRAIL & COMPAGNIE</span></div>
    {!intro.complete && <div className={styles.intro} role="dialog" aria-modal="true" aria-labelledby="intro-title" aria-describedby="intro-description" onClick={() => { if (intro.phase === 'revealing') intro.finish(); }}>
      <div className={styles.veil} aria-hidden="true" />
      <div className={styles.introContent}>
        <p className={styles.introEyebrow}>{editorial.introEyebrow}</p>
        <h2 id="intro-title">Vitrail <i>&</i> compagnie</h2>
        <p id="intro-description">{editorial.introSubtitle}</p>
        <button type="button" ref={intro.buttonRef} onClick={intro.enter} className={styles.introButton}>Découvrir <span aria-hidden="true">↗</span></button>
      </div>
      <p className={styles.introHint}>Échap pour passer</p>
    </div>}
  </section>;
}

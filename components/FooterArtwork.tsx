'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import footerImage from '../public/images/footer.webp';
import footerMiddle from '../public/images/footer-middle.webp';
import styles from '../app/page.module.css';

export default function FooterArtwork({images}:{images:Record<string,string>}) {
  const artworkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const artwork = artworkRef.current;
    const footer = artwork?.closest('footer');
    const layers = Array.from(artwork?.querySelectorAll<HTMLElement>('[data-footer-depth]') ?? []);
    if (!artwork || !footer || layers.length !== 2) return;

    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = matchMedia('(hover: hover) and (pointer: fine) and (min-width:1024px)');
    const depths = [
      { x:12, y:7, smoothing:.035 },
      { x:24, y:14, smoothing:.09 },
    ];
    const positions = depths.map(() => ({ x:0, y:0 }));
    let visible = false, frame = 0, lastTime = 0;
    let targetX = 0, targetY = 0, progress = 0;
    let distances = [35,75];

    const render = () => {
      layers.forEach((layer, index) => {
        if (reduced.matches) {
          layer.style.transform = 'none';
          layer.style.willChange = 'auto';
          return;
        }
        const x = positions[index].x * depths[index].x;
        const y = (1-progress)*distances[index] + positions[index].y*depths[index].y;
        layer.style.transform = 'translate3d('+x.toFixed(3)+'px,'+y.toFixed(3)+'px,0)';
        layer.style.willChange = visible && !document.hidden ? 'transform' : 'auto';
      });
    };
    const tick = (time: number) => {
      frame = 0;
      if (!visible || document.hidden || reduced.matches) { lastTime=0; render(); return; }
      const dt = lastTime ? Math.min((time-lastTime)/16.667,3) : 1;
      positions.forEach((position,index) => {
        const follow = 1-Math.pow(1-depths[index].smoothing,dt);
        position.x += (targetX-position.x)*follow;
        position.y += (targetY-position.y)*follow;
      });
      render();
      lastTime = time;
      if (positions.some(p=>Math.abs(targetX-p.x)+Math.abs(targetY-p.y)>.001)) {
        frame = requestAnimationFrame(tick);
      } else lastTime=0;
    };
    const schedule = () => { if (!frame) frame=requestAnimationFrame(tick); };
    const measure = () => {
      const rect = footer.getBoundingClientRect();
      const travel = Math.min(innerHeight,rect.height);
      progress = Math.min(1,Math.max(0,(innerHeight-rect.top)/Math.max(1,travel)));
      distances = innerWidth<768 ? [16,36] : [35,75];
      schedule();
    };
    const onScroll = () => { if (visible && !reduced.matches) measure(); };
    const pointer = (event: PointerEvent) => {
      if (!desktop.matches || reduced.matches) return;
      const rect = footer.getBoundingClientRect();
      targetX = Math.min(1,Math.max(-1,(event.clientX-rect.left)/rect.width*2-1));
      targetY = Math.min(1,Math.max(-1,(event.clientY-rect.top)/rect.height*2-1));
      schedule();
    };
    const resetPointer = () => { targetX=targetY=0; schedule(); };
    const preferenceChanged = () => {
      cancelAnimationFrame(frame); frame=lastTime=0;
      targetX=targetY=0;
      positions.forEach(p=>{p.x=p.y=0;});
      render();
      measure();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible=entry.isIntersecting;
      if (!visible) { cancelAnimationFrame(frame); frame=lastTime=0; targetX=targetY=0; }
      measure();
    });
    const resize = new ResizeObserver(measure);
    observer.observe(footer);
    resize.observe(footer);
    measure();
    window.addEventListener('scroll',onScroll,{passive:true});
    window.addEventListener('resize',measure,{passive:true});
    footer.addEventListener('pointermove',pointer,{passive:true});
    footer.addEventListener('pointerleave',resetPointer);
    reduced.addEventListener('change',preferenceChanged);
    desktop.addEventListener('change',preferenceChanged);
    document.addEventListener('visibilitychange',measure);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect(); resize.disconnect();
      window.removeEventListener('scroll',onScroll);
      window.removeEventListener('resize',measure);
      footer.removeEventListener('pointermove',pointer);
      footer.removeEventListener('pointerleave',resetPointer);
      reduced.removeEventListener('change',preferenceChanged);
      desktop.removeEventListener('change',preferenceChanged);
      document.removeEventListener('visibilitychange',measure);
    };
  }, []);

  return <div className={styles.footerArtwork} ref={artworkRef} aria-hidden="true">
    <div className={styles.footerPlane+' '+styles.footerMiddle} data-footer-depth="0">
      <Image src={images.footerMiddle} alt="" fill sizes="100vw" quality={90} className={styles.footerSceneImage}/>
    </div>
    <div className={styles.footerArtworkTitle}>Vitrail et compagnie</div>
    <div className={styles.footerPlane+' '+styles.footerForeground} data-footer-depth="1">
      <Image src={images.footerForeground} alt="" fill sizes="112vw" quality={90} className={styles.footerSceneImage}/>
    </div>
  </div>;
}

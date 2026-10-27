'use client';
import { useEffect, useRef } from 'react';
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const depths = [
  { scroll: .025, mobile: .01, x: -2, y: -1, smoothing: .025 },
  { scroll: .07, mobile: .025, x: 5, y: 3, smoothing: .035 },
  { scroll: .14, mobile: .04, x: 10, y: 6, smoothing: .09 },
];
/** Pointer and scroll updates never trigger React renders. */
export function useParallaxScene(enabled = true) {
  const sceneRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || !enabled) return;
    const layers = Array.from(scene.querySelectorAll<HTMLElement>('[data-depth]'));
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px)');
    let frame = 0, lastTime = 0, visible = false;
    let targetX = 0, targetY = 0, scroll = 0, currentScroll = 0;
    const positions = depths.map(() => ({ x: 0, y: 0 }));
    let width = innerWidth;
    function tick(time: number) {
      frame = 0;
      if (!visible || reduced.matches || document.hidden) return;
      const dt = lastTime ? Math.min((time-lastTime)/16.667,3) : 1;
      const smoothing = 1-Math.pow(.95,dt);
      currentScroll += (scroll-currentScroll)*Math.min(1,smoothing*2);
      layers.forEach((layer,index) => {
        const d = depths[index];
        const position = positions[index];
        // Each depth has its own inertia, independent of refresh rate.
        const follow = 1-Math.pow(1-d.smoothing,dt);
        position.x += (targetX-position.x)*follow;
        position.y += (targetY-position.y)*follow;
        const factor = width < 768 ? d.mobile : d.scroll*(width < 1024 ? .5 : 1);
        // Shared overscan preserves registration; travel stays inside image edges.
        const margin = Math.max(0,layer.clientHeight*.015-1);
        const dy = clamp(currentScroll*factor+position.y*d.y,-margin,margin);
        layer.style.transform = 'translate3d('+(position.x*d.x).toFixed(3)+'px,'+dy.toFixed(3)+'px,0) scale(1.03)';
      });
      lastTime = time;
      if (positions.some(position => Math.abs(targetX-position.x)+Math.abs(targetY-position.y)>.001) || Math.abs(scroll-currentScroll)>.05) frame=requestAnimationFrame(tick);
      else lastTime=0;
    }
    function schedule() { if(!frame && visible && !reduced.matches && !document.hidden) frame=requestAnimationFrame(tick); }
    function measure() { width=innerWidth; scroll=clamp(-scene!.getBoundingClientRect().top,0,scene!.clientHeight); schedule(); }
    function pointer(e: PointerEvent) {
      if(!desktop.matches || reduced.matches) return;
      const rect=scene!.getBoundingClientRect();
      targetX=clamp((e.clientX-rect.left)/rect.width*2-1,-1,1);
      targetY=clamp((e.clientY-rect.top)/rect.height*2-1,-1,1);
      schedule();
    }
    function resetPointer() { targetX=targetY=0; schedule(); }
    function preferenceChanged() {
      cancelAnimationFrame(frame); frame=lastTime=0;
      targetX=targetY=currentScroll=0;
      positions.forEach(position => { position.x=position.y=0; });
      layers.forEach(layer=>{layer.style.transform='';});
      measure();
    }
    const observer=new IntersectionObserver(([entry])=>{
      visible=entry.isIntersecting;
      if(visible) measure(); else {cancelAnimationFrame(frame);frame=lastTime=0;}
    });
    observer.observe(scene);
    window.addEventListener('scroll',measure,{passive:true});
    window.addEventListener('resize',measure,{passive:true});
    scene.addEventListener('pointermove',pointer,{passive:true});
    scene.addEventListener('pointerleave',resetPointer);
    reduced.addEventListener('change',preferenceChanged);
    desktop.addEventListener('change',preferenceChanged);
    document.addEventListener('visibilitychange',measure);
    return ()=>{
      cancelAnimationFrame(frame);observer.disconnect();
      window.removeEventListener('scroll',measure);window.removeEventListener('resize',measure);
      scene.removeEventListener('pointermove',pointer);scene.removeEventListener('pointerleave',resetPointer);
      reduced.removeEventListener('change',preferenceChanged);desktop.removeEventListener('change',preferenceChanged);
      document.removeEventListener('visibilitychange',measure);
    };
  },[enabled]);
  return sceneRef;
}
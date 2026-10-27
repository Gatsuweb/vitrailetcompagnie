'use client';
import {useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import styles from './SiteChrome.module.css';
import {CartNavLink} from './CartProvider';

const baseLinks=[['/','Accueil'],['/a-propos','À propos'],['/prestations','Prestations'],['/creations','Créations'],['/evenements','Événements'],['/contact','Contact']];

export function SiteNav({home=false,commerceEnabled=false}:{home?:boolean;commerceEnabled?:boolean}){
 const pathname=usePathname();
 const [scrolled,setScrolled]=useState(false);
 const [open,setOpen]=useState(false);
 const menuButton=useRef<HTMLButtonElement>(null);
 useEffect(()=>{if(!home)return;const update=()=>{const hero=document.getElementById('accueil');setScrolled(!hero||hero.getBoundingClientRect().bottom<=90)};update();window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);return()=>{window.removeEventListener('scroll',update);window.removeEventListener('resize',update)}},[home]);
 useEffect(()=>{setOpen(false)},[pathname]);
 useEffect(()=>{if(!open)return;const onKeyDown=(event:KeyboardEvent)=>{if(event.key==='Escape'){setOpen(false);menuButton.current?.focus()}};window.addEventListener('keydown',onKeyDown);return()=>window.removeEventListener('keydown',onKeyDown)},[open]);
 const links=baseLinks;
 return <nav className={styles.nav} data-site-nav data-home={home} data-scrolled={scrolled} aria-label="Navigation du site">
  <a className={styles.skipToContent} href={home?'#univers':'#main-content'}>Aller au contenu</a>
  <Link className={styles.brand} href="/" aria-label="Vitrail & compagnie, accueil" onClick={()=>setOpen(false)}><span className={styles.mark}><svg viewBox="0 0 44 52" fill="none" aria-hidden="true"><path d="M3 48V23a19 19 0 0 1 38 0v25H3Z" stroke="currentColor" strokeWidth="1.3"/><path d="M22 4v44M3 28h38M7 12l15 16 15-16M3 48l19-20 19 20" stroke="currentColor"/></svg></span><span>Vitrail <i>&</i> compagnie<small>CRÉATIONS ARTISANALES</small></span></Link>
  <div className={styles.links}>{links.map(([href,label])=><Link key={href} href={href} aria-current={pathname===href?'page':undefined} onClick={()=>setOpen(false)}>{label}</Link>)}</div>
  {commerceEnabled?<CartNavLink className={styles.cta}/>:<Link className={styles.cta} href="/contact">Me parler de votre projet <span aria-hidden="true">↗</span></Link>}
  <button type="button" ref={menuButton} className={styles.menuButton} aria-label={open?'Fermer le menu':'Ouvrir le menu'} aria-expanded={open} aria-controls={open?'site-menu':undefined} onClick={()=>setOpen(!open)}><span>{open?'Fermer':'Menu'}</span><span className={styles.lines} aria-hidden="true"><i/><i/></span></button>
  {open&&<div id="site-menu" className={styles.mobileMenu}>{links.map(([href,label])=><Link key={href} href={href} aria-current={pathname===href?'page':undefined} onClick={()=>setOpen(false)}>{label}<span aria-hidden="true">↗</span></Link>)}{commerceEnabled&&<CartNavLink/>}</div>}
 </nav>
}
export default SiteNav;

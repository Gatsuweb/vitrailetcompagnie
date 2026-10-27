import Link from 'next/link';
import FooterArtwork from './FooterArtwork';
import {getSiteData} from '../lib/site-data';
import styles from '../app/page.module.css';

const pages:[string,string][]=[
 ['/', 'Accueil'], ['/a-propos','À propos'], ['/prestations','Prestations'],
 ['/creations','Créations'], ['/evenements','Événements'], ['/contact','Contact']
];

export default async function SiteFooter({home=false}:{home?:boolean}){
 const {profile,images}=await getSiteData();
 const top=home?'#accueil':'/#accueil';
 const socialLinks=[
  {label:'Instagram',url:profile.instagram},
  {label:'Facebook',url:profile.facebook},
  {label:'Pinterest',url:profile.pinterest}
 ].filter(item=>item.url);
 return <footer className={styles.footer} aria-label="Pied de page">
  <div className={styles.footerContent}>
   <div className={styles.footerColumns}>
    <div className={styles.footerColumn}><h3>Explorer</h3><div className={styles.footerLinks}>{pages.map(([href,label])=><Link href={href} key={href}>{label}</Link>)}</div></div>
    <div className={styles.footerColumn}><h3>Échanger</h3><div className={styles.footerLinks}>{profile.email&&<a href={'mailto:'+profile.email}>{profile.email}</a>}{profile.phone&&<a href={'tel:'+profile.phone.replace(/[^+\d]/g,'')}>{profile.phone}</a>}{profile.location&&<span>{profile.location}</span>}<Link href="/contact">M’écrire <span aria-hidden="true">↗</span></Link></div></div>
    <div className={styles.footerColumn}><h3>Suivre</h3><div className={styles.footerLinks}>{socialLinks.length?socialLinks.map(item=><a key={item.label} href={item.url} target="_blank" rel="noopener noreferrer">{item.label} <span aria-hidden="true">↗</span></a>):<span>Les liens des réseaux seront ajoutés prochainement.</span>}</div></div>
   </div>
   <div className={styles.footerMeta}><span>© {new Date().getFullYear()} Vitrail & compagnie</span><div><Link href="/mentions-legales">Mentions légales</Link><Link href="/conditions-generales-de-vente">CGV</Link><Link href="/livraison-et-retours">Livraison & retours</Link><Link href="/confidentialite">Confidentialité</Link><Link className={styles.backToTop} href={top}>Retour en haut <span aria-hidden="true">↑</span></Link></div></div>
  </div>
  <FooterArtwork images={images}/>
 </footer>
}

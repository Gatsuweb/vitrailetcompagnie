import type {Metadata} from 'next';
import localFont from 'next/font/local';
import './globals.css';
import 'lenis/dist/lenis.css';
import SectionMotion from '../components/SectionMotion';
import SmoothScroll from '../components/SmoothScroll';
import {getSiteData} from '../lib/site-data';
import {CartProvider} from '../components/CartProvider';
import {siteOrigin} from '../lib/seo';
const flowmery=localFont({src:'./fonts/Flowmery-Regular.ttf',display:'swap',variable:'--font-flowmery',weight:'400'});
export async function generateMetadata():Promise<Metadata>{
 const {editorial:t,images}=await getSiteData();
 return {
  title:{default:t.seoHomeTitle,template:'%s'},
  description:t.seoHomeDescription,
  metadataBase:new URL(siteOrigin),
  alternates:{canonical:siteOrigin},
  openGraph:{type:'website',locale:'fr_FR',siteName:'Vitrail & compagnie',url:siteOrigin,title:t.seoHomeTitle,description:t.seoHomeDescription,images:[{url:images.heroDesktopBackground,width:1672,height:941,alt:'L’univers lumineux de Vitrail & compagnie'}]},
 };
}
export default async function RootLayout({children}:Readonly<{children:React.ReactNode}>){
 const {profile,images}=await getSiteData();
 const business={
  '@context':'https://schema.org',
  '@type':'LocalBusiness',
  '@id':`${siteOrigin}/#atelier`,
  name:'Vitrail & compagnie',
  url:siteOrigin,
  description:'Atelier de vitrail artisanal de Valérie Le Bihan à Plévin, en Bretagne. Créations en verre et projets sur mesure.',
  image:new URL(images.aboutHero,siteOrigin).toString(),
  telephone:profile.phone,
  email:profile.email,
  address:{'@type':'PostalAddress',streetAddress:'10 Kermorvan',postalCode:'22340',addressLocality:'Plévin',addressRegion:'Côtes-d’Armor',addressCountry:'FR'},
  founder:{'@type':'Person',name:profile.artist},
  sameAs:[profile.facebook,profile.instagram,profile.pinterest].filter(Boolean),
 };
 return <html lang="fr" className={flowmery.variable}><body><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(business).replace(/</g,'\\u003c')}}/><CartProvider>{children}</CartProvider><SectionMotion/><SmoothScroll/></body></html>;
}


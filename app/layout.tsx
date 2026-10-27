import type {Metadata} from 'next';
import localFont from 'next/font/local';
import './globals.css';
import 'lenis/dist/lenis.css';
import SectionMotion from '../components/SectionMotion';
import SmoothScroll from '../components/SmoothScroll';
import {getSiteData} from '../lib/site-data';
import {CartProvider} from '../components/CartProvider';
const flowmery=localFont({src:'./fonts/Flowmery-Regular.ttf',display:'swap',variable:'--font-flowmery',weight:'400'});
const siteUrl=process.env.NEXT_PUBLIC_SITE_URL;
export async function generateMetadata():Promise<Metadata>{
 const {editorial:t,images}=await getSiteData();
 return {
  title:{default:t.seoHomeTitle,template:'%s'},
  description:t.seoHomeDescription,
  metadataBase:new URL(siteUrl||'http://localhost:3000'),
  openGraph:{type:'website',locale:'fr_FR',siteName:'Vitrail & compagnie',title:t.seoHomeTitle,description:t.seoHomeDescription,images:[{url:images.heroDesktopBackground,width:1672,height:941,alt:'L’univers lumineux de Vitrail & compagnie'}]},
 };
}
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="fr" className={flowmery.variable}><body><CartProvider>{children}</CartProvider><SectionMotion/><SmoothScroll/></body></html>}


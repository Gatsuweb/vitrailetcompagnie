import SiteFooter from '../components/SiteFooter';
import StainedGlassHero from '../components/StainedGlassHero';
import HomeSections from '../components/HomeSections';
import {getSiteData} from '../lib/site-data';
export const dynamic='force-dynamic';
export default async function Home(){const {editorial,images}=await getSiteData();return <main><StainedGlassHero editorial={editorial} images={images}/><HomeSections/>
 <SiteFooter home/>
 </main>}



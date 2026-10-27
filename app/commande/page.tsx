import type {Metadata} from 'next';
import {InnerShell} from '../../components/SiteChrome';
import CheckoutPage from '../../components/CheckoutPage';
import {getSiteData} from '../../lib/site-data';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:'Commande | Vitrail & compagnie',robots:{index:false,follow:false}};
export default async function Commande(){const {commerce}=await getSiteData();return <InnerShell><CheckoutPage commerce={commerce}/></InnerShell>}

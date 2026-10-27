import type {Metadata} from 'next';
import {InnerShell} from '../../components/SiteChrome';
import CartPage from '../../components/CartPage';
export const metadata:Metadata={title:'Panier | Vitrail & compagnie',robots:{index:false,follow:false}};
export default function Panier(){return <InnerShell><CartPage/></InnerShell>}

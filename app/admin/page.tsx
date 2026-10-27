import type {Metadata} from 'next';
import {isAdmin} from '../../lib/admin-auth';
import {getMessages,getOrders,getSiteData} from '../../lib/site-data';
import AdminPanel from '../../components/AdminPanel';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:'Administration | Vitrail & compagnie',robots:{index:false,follow:false}};
export default async function Admin(){const authenticated=await isAdmin();const [initial,messages,orders]=authenticated?await Promise.all([getSiteData(),getMessages(),getOrders()]):[null,[],[]];return <AdminPanel authenticated={authenticated} configured={Boolean(process.env.ADMIN_PASSWORD&&process.env.ADMIN_SESSION_SECRET)} initial={initial} messages={messages} orders={orders}/>}


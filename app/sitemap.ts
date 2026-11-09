import type {MetadataRoute} from 'next';
import {getSiteData} from '../lib/site-data';
import {absoluteSiteUrl} from '../lib/seo';

export const dynamic='force-dynamic';

export default async function sitemap():Promise<MetadataRoute.Sitemap>{
 const {events}=await getSiteData();
 const pages=['/','/a-propos','/prestations','/creations','/contact','/evenements'];
 return [
  ...pages.map((path,index)=>({url:absoluteSiteUrl(path),changeFrequency:'monthly' as const,priority:index===0?1:.7})),
  ...events.filter(event=>event.published).map(event=>({url:absoluteSiteUrl(`/evenements/${encodeURIComponent(event.id)}`),changeFrequency:'monthly' as const,priority:.5})),
 ];
}

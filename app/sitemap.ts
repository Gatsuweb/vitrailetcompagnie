import type {MetadataRoute} from 'next';
export default function sitemap():MetadataRoute.Sitemap{const origin=process.env.NEXT_PUBLIC_SITE_URL;if(!origin)return [];return ['/','/a-propos','/prestations','/creations','/contact','/evenements'].map((path,index)=>({url:new URL(path,origin).toString(),changeFrequency:'monthly' as const,priority:index===0?1:.7}))}

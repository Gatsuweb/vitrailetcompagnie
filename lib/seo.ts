export const siteOrigin = 'https://www.vitrailetcompagnie.com';

export function absoluteSiteUrl(path: string): string {
 return new URL(path, siteOrigin).toString();
}

import type {Metadata} from 'next';
import {InnerShell} from '../../components/SiteChrome';
import {getSiteData} from '../../lib/site-data';
import e from '../editorial.module.css';
import styles from './page.module.css';

export const dynamic='force-dynamic';

export async function generateMetadata():Promise<Metadata>{
 const {profile}=await getSiteData();
 const complete=Boolean(profile.legalName&&profile.legalAddress&&profile.siret&&profile.publisher&&profile.hostName&&profile.hostAddress);
 return {title:'Mentions légales | Vitrail & compagnie',robots:{index:complete,follow:true}};
}

const Value=({value}:{value:string})=><span className={value?'':styles.missing}>{value||'À compléter avant la mise en ligne'}</span>;

export default async function LegalPage(){
 const {profile}=await getSiteData();
 const incomplete=!profile.legalName||!profile.legalAddress||!profile.siret||!profile.publisher||!profile.hostName||!profile.hostAddress;
 return <InnerShell><div className={e.page}><header className={e.wideIntro}><p className={e.eyebrow}>INFORMATIONS DU SITE</p><h1 className={e.title}>Mentions légales.</h1><p className={e.lead}>Les informations relatives à Vitrail & compagnie et à l’hébergement de ce site.</p></header><div className={styles.content}>
 {incomplete&&<p className={styles.notice}>Cette page est en cours de finalisation. Les informations administratives manquantes seront ajoutées avant la mise en ligne publique du site.</p>}
 <section><p className={styles.number}>01 / ÉDITEUR</p><h2>Le site et son atelier</h2><dl><div><dt>Nom légal ou raison sociale</dt><dd><Value value={profile.legalName}/></dd></div><div><dt>Adresse professionnelle</dt><dd><Value value={profile.legalAddress}/></dd></div><div><dt>SIRET</dt><dd><Value value={profile.siret}/></dd></div><div><dt>Directeur ou directrice de la publication</dt><dd><Value value={profile.publisher}/></dd></div><div><dt>Contact</dt><dd>{profile.email?<a href={'mailto:'+profile.email}>{profile.email}</a>:<a href="/contact">Formulaire de contact</a>}</dd></div></dl></section>
 <section><p className={styles.number}>02 / HÉBERGEMENT</p><h2>Hébergeur du site</h2><dl><div><dt>Nom</dt><dd><Value value={profile.hostName}/></dd></div><div><dt>Adresse</dt><dd><Value value={profile.hostAddress}/></dd></div></dl></section>
 <section><p className={styles.number}>03 / DONNÉES PERSONNELLES</p><h2>Respect de votre vie privée</h2><p>Les informations envoyées depuis le formulaire de contact servent à répondre à votre demande. Pour connaître leur utilisation et leur conservation, consultez la <a href="/confidentialite">politique de confidentialité</a>.</p></section>
 </div></div></InnerShell>;
}

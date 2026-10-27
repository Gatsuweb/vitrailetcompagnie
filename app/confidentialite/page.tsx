import type {Metadata} from 'next';
import {InnerShell} from '../../components/SiteChrome';
import {getSiteData} from '../../lib/site-data';
import e from '../editorial.module.css';
import s from '../legal-text.module.css';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:'Politique de confidentialité | Vitrail & compagnie',robots:{index:false,follow:false}};
export default async function Privacy(){
 const {profile}=await getSiteData();
 return <InnerShell><div className={e.page}>
  <header className={e.wideIntro}><p className={e.eyebrow}>VOS DONNÉES</p><h1 className={e.title}>Politique de<br/><em>confidentialité.</em></h1><p className={e.lead}>Les informations utilisées pour vous répondre et préparer vos créations.</p></header>
  <div className={s.content}>
   <p className={s.notice}><strong>Politique à finaliser avant l’ouverture des commandes.</strong> Les coordonnées de l’hébergeur et la durée de conservation précise des demandes restent à confirmer avec l’atelier.</p>
   <section><h2>01 / Responsable du traitement</h2><p>Valérie Le Bihan, Vitrail & compagnie, {profile.legalAddress}. Pour toute question relative à vos données : <a href={'mailto:'+profile.email}>{profile.email}</a>.</p></section>
   <section><h2>02 / Données et finalités</h2><p>Le formulaire de contact recueille votre nom, votre adresse e-mail, le sujet et le contenu de votre message pour permettre à Valérie de vous répondre, notamment à propos d’une création ou d’un devis.</p><p>Lorsque les demandes de commande seront ouvertes, le site recueillera aussi votre nom, votre téléphone, votre adresse de livraison, les pièces choisies, le mode de livraison et un éventuel message. Ces informations servent à étudier la demande, confirmer la vente, préparer l’envoi et assurer le suivi de la commande. Les champs signalés comme obligatoires sont nécessaires pour traiter la demande correspondante.</p></section>
   <section><h2>03 / Bases juridiques</h2><p>Les échanges relatifs à un devis ou à une commande reposent sur les mesures prises à votre demande avant la conclusion d’un contrat, puis sur l’exécution de celui-ci. Les autres questions adressées à l’atelier sont traitées dans son intérêt légitime à répondre aux personnes qui la contactent. Les informations nécessaires à la tenue des documents commerciaux sont conservées conformément aux obligations légales applicables.</p></section>
   <section><h2>04 / Destinataires</h2><p>Les messages et demandes sont accessibles à l’atelier depuis son administration protégée et, pour les besoins techniques, à son hébergeur. Les seules informations nécessaires à l’expédition seront communiquées au transporteur retenu, Chronopost ou Colissimo, lorsque la commande sera préparée. Les données ne sont ni vendues ni utilisées par l’atelier pour un démarchage automatisé depuis ce site.</p></section>
   <section><h2>05 / Conservation</h2><p>Les échanges sont conservés pendant le temps nécessaire au traitement de la demande et de ses suites éventuelles. Les informations relatives aux ventes sont conservées pour le suivi de la relation commerciale et, le cas échéant, les durées imposées par les obligations comptables ou légales. L’atelier doit préciser et appliquer ses durées de conservation avant l’ouverture des commandes.</p></section>
   <section><h2>06 / Panier et cookies</h2><p>Le panier est enregistré localement dans votre navigateur afin de retrouver vos créations pendant votre visite ; il ne contient pas vos coordonnées. La navigation publique du site ne charge pas d’outil de mesure d’audience tel que Google Analytics et n’utilise pas de cookie publicitaire. Un cookie technique est utilisé pour la session de connexion à l’administration.</p></section>
   <section><h2>07 / Vos droits</h2><p>Vous pouvez demander l’accès, la rectification ou l’effacement de vos données, ainsi que la limitation du traitement, dans les conditions prévues par la réglementation. Écrivez à <a href={'mailto:'+profile.email}>{profile.email}</a> en précisant votre demande. Certaines informations doivent toutefois être conservées lorsque la loi l’exige. Vous pouvez également adresser une réclamation à la <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer">CNIL</a>.</p></section>
  </div>
 </div></InnerShell>;
}

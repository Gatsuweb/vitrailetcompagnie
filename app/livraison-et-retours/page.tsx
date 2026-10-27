import type {Metadata} from 'next';
import Link from 'next/link';
import {InnerShell} from '../../components/SiteChrome';
import {getSiteData} from '../../lib/site-data';
import e from '../editorial.module.css';
import s from '../legal-text.module.css';

export const dynamic='force-dynamic';
export const metadata:Metadata={title:'Livraison et retours | Vitrail & compagnie',robots:{index:false,follow:false}};

export default async function ShippingAndReturns(){
 const {profile}=await getSiteData();
 const withdrawalSubject=encodeURIComponent('Rétractation — commande Vitrail & compagnie');
 return <InnerShell><div className={e.page}>
  <header className={e.wideIntro}><p className={e.eyebrow}>VOTRE COMMANDE</p><h1 className={e.title}>Livraison<br/><em>& retours.</em></h1><p className={e.lead}>Les étapes prévues pour vos créations, de l’atelier à chez vous.</p></header>
  <div className={s.content}>
   <p className={s.notice}><strong>Informations en cours de validation.</strong> Les commandes en ligne ne sont pas encore ouvertes. Valérie confirmera les frais, le mode de livraison et le délai avant toute vente.</p>
   <section><h2>01 / Après votre demande</h2><p>L’envoi du panier ne déclenche ni paiement ni expédition. Valérie vérifie la disponibilité de la création, prépare le colis adapté à sa fragilité et vous confirme par e-mail le montant et les conditions de livraison. La commande devient ferme selon les modalités de cette confirmation.</p></section>
   <section><h2>02 / Expédition et suivi</h2><p>Selon les services activés, une livraison à domicile pourra être proposée avec Chronopost ou Colissimo. Les frais affichés au moment de la demande sont confirmés avant la vente. Après l’expédition, l’atelier communique le numéro de suivi lorsqu’il est disponible.</p><p>Si le colis est perdu, endommagé ou si la pièce reçue ne correspond pas à la commande, contactez rapidement <a href={'mailto:'+profile.email}>{profile.email}</a> avec votre référence et, si possible, des photographies. Lorsque le transporteur est proposé par l’atelier, Valérie reste votre interlocutrice pour résoudre le problème.</p></section>
   <section><h2>03 / Vous rétracter</h2><p>Pour une création déjà réalisée achetée à distance, vous pouvez notifier votre décision de vous rétracter dans les <strong>14 jours suivant sa réception</strong>, sans justification. Écrivez à <a href={'mailto:'+profile.email+'?subject='+withdrawalSubject}>{profile.email}</a> ou à {profile.legalAddress}. Indiquez votre nom, votre référence de commande, la pièce concernée et une adresse pour la réponse. Vous pouvez utiliser le modèle ci-dessous, sans obligation de le reprendre mot pour mot.</p><p>Après avoir notifié votre décision, renvoyez la pièce dans les 14 jours. Les modalités de renvoi adaptées à la fragilité du vitrail seront communiquées par l’atelier. Les frais directs de retour sont à la charge du client, sous réserve des informations confirmées avant la vente et sauf erreur ou non-conformité imputable à l’atelier.</p><p>Le remboursement des sommes dues intervient dans les 14 jours suivant la notification de votre rétractation. Il peut être différé jusqu’à la réception de la pièce ou jusqu’à la preuve de son expédition, selon la première de ces dates. En cas de rétractation, les frais de livraison initiaux sont remboursés dans la limite du mode de livraison standard proposé.</p></section>
   <section><h2>04 / Pièces personnalisées</h2><p>Le droit de rétractation ne s’applique pas à un bien effectivement confectionné selon vos spécifications ou nettement personnalisé. Une création déjà terminée et simplement choisie dans la galerie n’entre pas dans cette exception du seul fait qu’elle est artisanale. Les modalités particulières d’une prestation sur devis sont indiquées avant son acceptation.</p></section>
   <section><h2>05 / Modèle de rétractation</h2><p>À l’attention de Vitrail & compagnie — {profile.legalName||profile.artist}, {profile.legalAddress}, <a href={'mailto:'+profile.email}>{profile.email}</a>.</p><p>Je vous notifie par la présente ma rétractation du contrat portant sur la création suivante : [nom de la pièce]. Commande n° [référence], reçue le [date]. Nom et adresse du client : [à compléter]. Date : [à compléter].</p><p>Pour les autres questions, consultez les <Link href="/conditions-generales-de-vente">conditions générales de vente</Link> ou <Link href="/contact">contactez l’atelier</Link>.</p></section>
  </div>
 </div></InnerShell>;
}

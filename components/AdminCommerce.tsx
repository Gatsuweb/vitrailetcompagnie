'use client';

import {useState} from 'react';
import type {DeliveryMethod,Order,OrderStatus} from '../lib/site-data';
import {euros} from './CartProvider';
import styles from './AdminPanel.module.css';

const labels:Record<OrderStatus,string>={new:'Nouvelle',confirmed:'Confirmée',preparing:'En préparation',shipped:'Expédiée',cancelled:'Annulée'};
const deliveryLabels:Record<DeliveryMethod,string>={'chronopost-home':'Chronopost à domicile','colissimo-home':'Colissimo à domicile','dpd-home':'DPD Predict à domicile','dpd-pickup':'DPD Pickup'};
const trackingPages:Record<DeliveryMethod,string>={'chronopost-home':'https://www.chronopost.fr/fr/suivi-colis','colissimo-home':'https://www.laposte.fr/outils/suivre-vos-envois','dpd-home':'https://trace.dpd.fr/','dpd-pickup':'https://trace.dpd.fr/'};
const nextStatuses:Record<OrderStatus,OrderStatus[]>={new:['confirmed','cancelled'],confirmed:['preparing','cancelled'],preparing:['shipped','cancelled'],shipped:[],cancelled:[]};
function confirmationLink(order:Order){
 const subject=`Votre demande ${order.reference} — Vitrail & compagnie`;
 const message=`Bonjour ${order.customer.firstName},\n\nJ’ai vérifié votre demande ${order.reference} concernant ${order.items.map(item=>`${item.title} × ${item.quantity}`).join(', ')}.\n\nMontant des créations : ${euros(order.subtotalCents)}\nLivraison prévue (${deliveryLabels[order.delivery.method]}) : ${euros(order.delivery.priceCents)}\nMontant total proposé : ${euros(order.totalCents)}\nDélai prévu : [à compléter]\nModalités de paiement : [à compléter]\n\nMerci de me confirmer par retour d’e-mail si cette proposition vous convient.\n\nValérie — Vitrail & compagnie`;
 return `mailto:${order.customer.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
}
type Props={orders:Order[];onOrders:(orders:Order[])=>void;notify:(message:string,error?:boolean)=>void;onStockChanged:()=>Promise<void>;disabled?:boolean};

export default function AdminCommerce({orders,onOrders,notify,onStockChanged,disabled=false}:Props){
 const [busy,setBusy]=useState('');
 async function update(order:Order,status:OrderStatus,trackingNumber:string){
  if(disabled){notify('Enregistrez d’abord les modifications des créations avant de traiter une commande.',true);return}
  if(status==='confirmed'&&order.status==='new'&&!window.confirm('Confirmer cette demande et décompter le stock ? Contactez ensuite la cliente pour lui communiquer les modalités de paiement.'))return;
  setBusy(order.id);
  try{const response=await fetch('/api/admin/orders',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:order.id,status,trackingNumber})});
   const result=await response.json();
   if(response.ok){onOrders(orders.map(item=>item.id===order.id?result:item));if(status!==order.status)await onStockChanged();notify(status==='confirmed'?'Demande confirmée et stock décompté. Informez la cliente des modalités de paiement.':'Commande mise à jour.')}else notify(result.error||'Mise à jour impossible.',true);
  }catch{notify('Mise à jour impossible. Réessayez.',true)}finally{setBusy('')}
 }
 return <section className={styles.panel}><h2>Commandes</h2><p>Chaque demande arrive avec l’état « Nouvelle ». Vérifiez le stock, les frais de livraison et le montant avec la cliente, puis confirmez-la ici. Contactez-la ensuite pour le paiement. Préparez l’étiquette dans l’espace du transporteur et ajoutez le numéro de suivi avant de marquer la commande expédiée.</p>
  {orders.length?orders.map(order=><article className={styles.order} key={order.id}>
   <div className={styles.itemHead}><div><h3>{order.reference}</h3><small>{new Intl.DateTimeFormat('fr-FR',{dateStyle:'long',timeStyle:'short'}).format(new Date(order.createdAt))} · {euros(order.totalCents)}</small></div><strong>{labels[order.status]}</strong></div>
   <div className={styles.orderGrid}>
    <div><h4>Cliente</h4><p>{order.customer.firstName} {order.customer.lastName}<br/><a href={'mailto:'+order.customer.email}>{order.customer.email}</a><br/><a href={'tel:'+order.customer.phone}>{order.customer.phone}</a></p></div>
    <div><h4>Livraison</h4><p>{deliveryLabels[order.delivery.method]||order.delivery.method}<br/>{order.delivery.pickup?order.delivery.pickup.name:order.address.line1}<br/>{order.delivery.pickup?order.delivery.pickup.address:order.address.line2}<br/>{order.delivery.pickup?order.delivery.pickup.postalCode:order.address.postalCode} {order.delivery.pickup?order.delivery.pickup.city:order.address.city}</p></div>
    <div><h4>Pièces</h4><p>{order.items.map(item=>item.title+' × '+item.quantity).join(', ')}</p></div>
   </div>
   {order.notes&&<p><strong>Note :</strong> {order.notes}</p>}
   {order.status==='new'&&<p><strong>À faire :</strong> vérifier la pièce et les frais avant de confirmer cette demande.</p>}
   {order.status==='confirmed'&&<p><a href={confirmationLink(order)}>Préparer l’e-mail de confirmation à la cliente ↗</a> <small>Relisez et complétez le délai et le paiement avant l’envoi.</small></p>}
   <div className={styles.grid}>
    <label className={styles.field}>État<select value={order.status} onChange={event=>update(order,event.target.value as OrderStatus,order.trackingNumber)} disabled={busy===order.id||disabled}>{[order.status,...nextStatuses[order.status]].map(value=><option value={value} key={value}>{labels[value]}</option>)}</select></label>
    <label className={styles.field}>Numéro de suivi<input defaultValue={order.trackingNumber} onBlur={event=>{if(event.target.value!==order.trackingNumber)update(order,order.status,event.target.value)}} placeholder="Numéro du colis"/></label>
   </div>
   {order.trackingNumber&&<p>Numéro : {order.trackingNumber} · <a href={trackingPages[order.delivery.method]||'https://www.laposte.fr/outils/suivre-vos-envois'} target="_blank" rel="noopener noreferrer">Ouvrir le suivi {deliveryLabels[order.delivery.method]||'du colis'} ↗</a></p>}
   {order.delivery.method.startsWith('dpd-')&&<p><a href={'/api/admin/orders/dpd-export?id='+encodeURIComponent(order.id)}>Télécharger l’ancien fichier Station DPD ↓</a></p>}
  </article>):<p className={styles.empty}>Aucune commande reçue pour le moment.</p>}
 </section>;
}

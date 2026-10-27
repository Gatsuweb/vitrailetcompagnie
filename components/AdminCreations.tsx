'use client';

import {useState,type ChangeEvent} from 'react';
import type {SiteData,Work} from '../lib/site-data';
import styles from './AdminPanel.module.css';

type Props={data:SiteData;onEdit:(change:(draft:SiteData)=>void)=>void;notify:(message:string,error?:boolean)=>void};
const cents=(value:string)=>Math.max(0,Math.round(Number(value)*100)||0);
const whole=(value:string)=>Math.max(0,Math.floor(Number(value))||0);

export default function AdminCreations({data,onEdit,notify}:Props){
 const [uploading,setUploading]=useState('');
 function update(index:number,change:(work:Work)=>void){onEdit(draft=>change(draft.works[index]))}
 function add(){onEdit(draft=>draft.works.push({id:crypto.randomUUID(),title:'',category:'',description:'',image:'',images:[],alt:'',dimensions:'',featured:false,published:false,forSale:false,priceCents:0,stock:0,weightGrams:0,shippingWeightGrams:0}))}
 function remove(index:number){if(!window.confirm('Supprimer définitivement cette création après enregistrement ?'))return;onEdit(draft=>draft.works.splice(index,1))}
 function move(index:number,offset:number){onEdit(draft=>{const [work]=draft.works.splice(index,1);draft.works.splice(index+offset,0,work)})}
 async function upload(event:ChangeEvent<HTMLInputElement>,index:number){
  const files=Array.from(event.target.files||[]);if(!files.length)return;
  setUploading(data.works[index].id);notify('Import de l’image en cours…');
  try{const urls:string[]=[];for(const file of files){const body=new FormData();body.set('image',file);const response=await fetch('/api/admin/upload',{method:'POST',body});const result=await response.json();if(!response.ok)throw new Error(result.error||'Import impossible.');urls.push(result.url)}update(index,work=>{work.images=[...(work.images||[]),...urls];work.image=work.image||urls[0]});notify(`${urls.length} photo${urls.length>1?'s':''} importée${urls.length>1?'s':''}. Enregistrez pour publier.`)}catch(cause){notify(cause instanceof Error?cause.message:'Import impossible.',true)}finally{setUploading('');event.target.value=''}
 }
 return <>
  <section className={styles.panel}>
   <h2>Vente et livraison</h2>
   <p>Valérie utilise ses espaces Mon Compte Pro pour préparer les étiquettes après confirmation des demandes. Renseignez les frais de port TTC et finalisez les pages de vente avant d’ouvrir les commandes.</p>
   <div className={styles.checkRow}>
    <label><input type="checkbox" checked={data.commerce.enabled} onChange={event=>onEdit(d=>{d.commerce.enabled=event.target.checked})}/> Autoriser les commandes en ligne</label>
    <label><input type="checkbox" checked={data.commerce.chronopostHomeEnabled} onChange={event=>onEdit(d=>{d.commerce.chronopostHomeEnabled=event.target.checked})}/> Chronopost à domicile</label>
    <label><input type="checkbox" checked={data.commerce.colissimoHomeEnabled} onChange={event=>onEdit(d=>{d.commerce.colissimoHomeEnabled=event.target.checked})}/> Colissimo à domicile</label>
   </div>
   <div className={styles.grid}>
    <label className={styles.field}>Frais client Chronopost TTC (€)<input type="number" min="0" step=".01" value={(data.commerce.chronopostHomePriceCents/100).toFixed(2)} onChange={event=>onEdit(d=>{d.commerce.chronopostHomePriceCents=cents(event.target.value)})}/></label>
    <label className={styles.field}>Frais client Colissimo TTC (€)<input type="number" min="0" step=".01" value={(data.commerce.colissimoHomePriceCents/100).toFixed(2)} onChange={event=>onEdit(d=>{d.commerce.colissimoHomePriceCents=cents(event.target.value)})}/></label>
    <label className={styles.field}>Livraison offerte dès (€)<input type="number" min="0" step=".01" value={(data.commerce.freeShippingThresholdCents/100).toFixed(2)} onChange={event=>onEdit(d=>{d.commerce.freeShippingThresholdCents=cents(event.target.value)})}/><small>0 désactive ce seuil.</small></label>
    <label className={styles.field}>Délai de préparation<input value={data.commerce.preparationDays} placeholder="Ex. 3 à 5 jours ouvrés" onChange={event=>onEdit(d=>{d.commerce.preparationDays=event.target.value})}/></label>
    <label className={styles.field}>Conditions de vente<input value={data.commerce.termsUrl} placeholder="/conditions-generales-de-vente" onChange={event=>onEdit(d=>{d.commerce.termsUrl=event.target.value})}/></label>
    <label className={styles.field}>Retours et rétractation<input value={data.commerce.withdrawalUrl} placeholder="/livraison-et-retours" onChange={event=>onEdit(d=>{d.commerce.withdrawalUrl=event.target.value})}/></label>
   </div>
   <label className={styles.field}>Message après commande<textarea value={data.commerce.orderNotice} onChange={event=>onEdit(d=>{d.commerce.orderNotice=event.target.value})}/></label>
   <div className={styles.notice}><strong>Préparation de la livraison</strong><p>La grille Chronopost reçue indique des coûts de transport HT qui varient selon le poids. Les frais TTC facturés au client sont à définir ici. Avant d’activer Chronopost, demandez une confirmation écrite que le contrat accepte et couvre les créations en vitrail : les CGV Pro standard excluent les œuvres et objets d’art. Les relais et les étiquettes automatiques nécessitent les accès transporteurs.</p></div>
  </section>

  <section className={styles.panel+' '+styles.creationsPanel}>
   <div className={styles.itemHead}><div><h2>Créations</h2><p>Chaque fiche réunit désormais la galerie et les informations de vente.</p></div><button type="button" className={styles.secondary} onClick={add}>+ Ajouter une création</button></div>
   {data.works.map((work,index)=><article className={styles.item} key={work.id}>
    <div className={styles.itemHead}><h3>{work.title||'Nouvelle création'} <small>{work.published?'En ligne':'Brouillon'}</small></h3><div className={styles.itemActions}><button type="button" className={styles.secondary} disabled={index===0} aria-label="Monter cette création" onClick={()=>move(index,-1)}>↑</button><button type="button" className={styles.secondary} disabled={index===data.works.length-1} aria-label="Descendre cette création" onClick={()=>move(index,1)}>↓</button><button type="button" className={styles.danger} onClick={()=>remove(index)}>Supprimer</button></div></div>
    <div className={styles.creationEditor}>
     <div className={styles.creationPhoto}>{work.image?<img src={work.image} alt="Aperçu de la création"/>:<span className={styles.empty}>Aucune image</span>}<div className={styles.photoList}>{(work.images||[]).map(url=><div key={url}><img src={url} alt="Miniature"/><button type="button" className={styles.secondary} disabled={url===work.image} onClick={()=>update(index,w=>{w.image=url})}>{url===work.image?'Principale':'Choisir'}</button><button type="button" className={styles.danger} onClick={()=>update(index,w=>{w.images=w.images.filter(item=>item!==url);if(w.image===url)w.image=w.images[0]||''})}>×</button></div>)}</div><label className={styles.field}>Photos<input type="file" multiple accept="image/jpeg,image/png,image/webp" disabled={uploading===work.id} onChange={event=>upload(event,index)}/><small>{uploading===work.id?'Import en cours…':'Une ou plusieurs images · JPEG, PNG ou WebP · 8 Mo maximum chacune'}</small></label></div>
     <div>
      <div className={styles.grid}><label className={styles.field}>Titre<input value={work.title} onChange={event=>update(index,w=>{w.title=event.target.value})}/></label><label className={styles.field}>Catégorie<input value={work.category} onChange={event=>update(index,w=>{w.category=event.target.value})}/></label><label className={styles.field}>Dimensions<input value={work.dimensions} placeholder="Ex. 20 × 20 cm" onChange={event=>update(index,w=>{w.dimensions=event.target.value})}/></label></div>
      <label className={styles.field}>Description<textarea value={work.description} onChange={event=>update(index,w=>{w.description=event.target.value})}/></label>
      <label className={styles.field}>Description de l’image (accessibilité)<input value={work.alt} onChange={event=>update(index,w=>{w.alt=event.target.value})}/></label>
     </div>
    </div>
    <div className={styles.saleSettings}>
     <label><input type="checkbox" checked={work.forSale} onChange={event=>update(index,w=>{w.forSale=event.target.checked})}/> Disponible à la commande</label>
     <label className={styles.field}>Prix TTC (€)<input type="number" min="0" step=".01" value={(work.priceCents/100).toFixed(2)} onChange={event=>update(index,w=>{w.priceCents=cents(event.target.value)})}/></label>
     <label className={styles.field}>Stock<input type="number" min="0" step="1" value={work.stock} onChange={event=>update(index,w=>{w.stock=whole(event.target.value)})}/></label>
     <label className={styles.field}>Poids de la création (g)<input type="number" min="0" step="1" value={work.weightGrams} onChange={event=>update(index,w=>{w.weightGrams=whole(event.target.value)})}/></label>
     <label className={styles.field}>Poids du colis emballé (g)<input type="number" min="0" step="1" value={work.shippingWeightGrams} onChange={event=>update(index,w=>{w.shippingWeightGrams=whole(event.target.value)})}/><small>Requis pour activer la commande en ligne.</small></label>
    </div>
    <div className={styles.checkRow}><label><input type="checkbox" checked={work.featured} onChange={event=>update(index,w=>{w.featured=event.target.checked})}/> À la une sur l’accueil</label><label><input type="checkbox" checked={work.published} onChange={event=>update(index,w=>{w.published=event.target.checked})}/> Publier cette création</label></div>
   </article>)}
  </section>
 </>;
}

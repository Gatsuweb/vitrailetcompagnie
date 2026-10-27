'use client';
import {useState} from 'react';
import type {Work} from '../lib/site-data';
import {AddToCartButton,euros} from './CartProvider';
import Reveal from './Reveal';
import e from '../app/editorial.module.css';
import s from '../app/inner-pages.module.css';

export default function Gallery({works,commerceEnabled=false}:{works:Work[];commerceEnabled?:boolean}){
 const [category,setCategory]=useState('Toutes');
 const [selectedImages,setSelectedImages]=useState<Record<string,number>>({});
 const categories=['Toutes',...Array.from(new Set(works.map(w=>w.category)))];
 const filtered=category==='Toutes'?works:works.filter(w=>w.category===category);
 return <>
  <div className={s.filters} role="group" aria-label="Filtrer les créations">
   {categories.map(name=><button key={name} type="button" data-active={category===name} aria-pressed={category===name} onClick={()=>setCategory(name)}>{name}</button>)}
  </div>
  <div className={s.galleryGrid} key={category}>
   {filtered.map((work,i)=>{const images=work.images?.length?work.images:[work.image];const selected=Math.min(selectedImages[work.id]||0,images.length-1);return <Reveal className={e.imageReveal} key={work.id}>
    <article className={e.card}>
     <div className={e.cardImage}><img className={e.imageCover} src={images[selected]} alt={work.alt} loading="lazy"/>{images.length>1&&<div className={s.photoNav} aria-label={`Photos de ${work.title}`}>{images.map((_,index)=><button type="button" key={index} data-active={index===selected} aria-label={`Afficher la photo ${index+1}`} onClick={()=>setSelectedImages(current=>({...current,[work.id]:index}))}/>)}</div>}</div>
     <div className={e.cardMeta}><span>{String(i+1).padStart(2,'0')} / {work.category}</span><span>VITRAIL</span></div>
     <h3>{work.title}</h3><p>{work.description}</p>
     {(work.dimensions||work.weightGrams>0)&&<p className={s.workFacts}>{work.dimensions&&<span>{work.dimensions}</span>}{work.weightGrams>0&&<span>{work.weightGrams} g</span>}</p>}
     {commerceEnabled&&work.priceCents>0&&<div className={s.salePanel}>
      <div><strong>{euros(work.priceCents)}</strong><small>{work.stock<1?'Création vendue':work.forSale?'Disponible à la commande':'Commande sur demande'}</small></div>
      {work.forSale&&<AddToCartButton className={s.saleButton} product={{id:work.id,title:work.title,image:work.image,priceCents:work.priceCents,stock:work.stock,weightGrams:work.shippingWeightGrams}}/>}
     </div>}
    </article>
   </Reveal>})}
  </div>
 </>;
}

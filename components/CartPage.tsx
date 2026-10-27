'use client';
import Link from 'next/link';
import {euros,useCart} from './CartProvider';
import styles from '../app/commerce.module.css';

export default function CartPage(){
 const cart=useCart();
 return <div className={styles.page}><header className={styles.intro}><h1>Votre panier,<br/><em>tout en lumière.</em></h1><p>Vérifiez vos pièces avant de choisir votre livraison.</p></header>
 {!cart.items.length?<div className={styles.empty}><h2>Votre panier est vide.</h2><p>Découvrez les pièces disponibles parmi mes créations.</p><Link href="/creations">Voir les créations</Link></div>:<div className={styles.layout}><div className={styles.lines}>{cart.items.map(item=><article className={styles.line} key={item.id}><img src={item.image} alt=""/><div><h2>{item.title}</h2><p>{euros(item.priceCents)} l’unité</p><div className={styles.quantity}><label>Quantité <input type="number" min="1" max={item.stock} value={item.quantity} onChange={event=>cart.setQuantity(item.id,Number(event.target.value))}/></label><button type="button" className={styles.remove} onClick={()=>cart.remove(item.id)}>Retirer</button></div></div><strong>{euros(item.priceCents*item.quantity)}</strong></article>)}</div><aside className={styles.summary}><h2>Récapitulatif</h2><div className={styles.totalRow}><span>Sous-total</span><strong>{euros(cart.subtotalCents)}</strong></div><p className={styles.muted}>Les frais de livraison seront ajoutés à l’étape suivante.</p><Link className={styles.primary} href="/commande">Choisir ma livraison</Link></aside></div>}
 </div>;
}

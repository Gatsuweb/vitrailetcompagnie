'use client';

import Link from 'next/link';
import {createContext,useContext,useEffect,useMemo,useState,type ReactNode} from 'react';

export type CartProduct={id:string;title:string;image:string;priceCents:number;stock:number;weightGrams:number};
type CartLine=CartProduct&{quantity:number};
type CartContextValue={items:CartLine[];count:number;subtotalCents:number;add:(product:CartProduct)=>void;remove:(id:string)=>void;setQuantity:(id:string,quantity:number)=>void;clear:()=>void};
const CartContext=createContext<CartContextValue|null>(null);
const storageKey='vitrail-compagnie-cart';

export const euros=(cents:number)=>new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(cents/100);

export function CartProvider({children}:{children:ReactNode}){
 const [items,setItems]=useState<CartLine[]>([]);
 const [ready,setReady]=useState(false);
 useEffect(()=>{try{const stored=JSON.parse(localStorage.getItem(storageKey)||'[]');if(Array.isArray(stored))setItems(stored.filter(item=>item&&typeof item.id==='string'&&Number.isInteger(item.quantity)))}catch{}setReady(true)},[]);
 useEffect(()=>{if(ready)localStorage.setItem(storageKey,JSON.stringify(items))},[items,ready]);
 const value=useMemo<CartContextValue>(()=>({
  items,
  count:items.reduce((sum,item)=>sum+item.quantity,0),
  subtotalCents:items.reduce((sum,item)=>sum+item.priceCents*item.quantity,0),
  add(product){setItems(current=>{const found=current.find(item=>item.id===product.id);if(found)return current.map(item=>item.id===product.id?{...item,quantity:Math.min(item.quantity+1,product.stock)}:item);return [...current,{...product,quantity:1}]})},
  remove(id){setItems(current=>current.filter(item=>item.id!==id))},
  setQuantity(id,quantity){setItems(current=>current.map(item=>item.id===id?{...item,quantity:Math.max(1,Math.min(Math.floor(quantity)||1,item.stock))}:item))},
  clear(){setItems([])}
 }),[items]);
 return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(){const value=useContext(CartContext);if(!value)throw new Error('useCart doit être utilisé dans CartProvider');return value}

export function AddToCartButton({product,className}:{product:CartProduct;className?:string}){
 const {add}=useCart();const [added,setAdded]=useState(false);
 return <button type="button" className={className} disabled={product.stock<1} onClick={()=>{add(product);setAdded(true);window.setTimeout(()=>setAdded(false),1600)}}>{product.stock<1?'Pièce vendue':added?'Ajoutée au panier ✓':'Ajouter au panier'}</button>;
}

export function CartNavLink({className}:{className?:string}){
 const {count}=useCart();
 const label=count?'Panier, '+count+' article'+(count>1?'s':''):'Panier vide';
 return <Link href="/panier" className={className} aria-label={label}>Panier{count>0&&<span aria-hidden="true"> ({count})</span>}</Link>;
}

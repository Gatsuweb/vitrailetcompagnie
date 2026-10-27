import type {ReactNode} from 'react';
import SiteNav from './SiteNav';
import SiteFooter from './SiteFooter';
import styles from './SiteChrome.module.css';
import {getSiteData} from '../lib/site-data';
export async function InnerShell({children}:{children:ReactNode}){const {commerce}=await getSiteData();return <><SiteNav commerceEnabled={commerce.enabled}/><div className={styles.spacer} aria-hidden="true"/><main id="main-content">{children}</main><SiteFooter/></>}

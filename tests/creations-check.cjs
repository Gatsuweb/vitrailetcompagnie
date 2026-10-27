const {chromium}=require('@playwright/test');
const {readFileSync}=require('node:fs');
const assert=require('node:assert/strict');

function envValue(name){
 const line=readFileSync('.env.local','utf8').split(/\r?\n/).find(row=>row.startsWith(name+'='));
 return line?.slice(name.length+1)||'';
}

(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
 const desktop=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
 await desktop.goto('http://localhost:3001/creations',{waitUntil:'networkidle'});
 assert.ok(await desktop.getByRole('link',{name:'Créations',exact:true}).count()>=1);
 assert.equal(await desktop.getByRole('link',{name:'Boutique',exact:true}).count(),0);
 await desktop.screenshot({path:'tests/creations-desktop.png',fullPage:true});

 await desktop.goto('http://localhost:3001/realisations',{waitUntil:'networkidle'});
 assert.equal(new URL(desktop.url()).pathname,'/creations');
 await desktop.goto('http://localhost:3001/boutique',{waitUntil:'networkidle'});
 assert.equal(new URL(desktop.url()).pathname,'/creations');

 const mobile=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
 await mobile.goto('http://localhost:3001/creations',{waitUntil:'networkidle'});
 await mobile.screenshot({path:'tests/creations-mobile.png',fullPage:true});

 const admin=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
 await admin.goto('http://localhost:3001/admin',{waitUntil:'networkidle'});
 const password=envValue('ADMIN_PASSWORD');
 if(await admin.getByRole('button',{name:'Se connecter'}).count()){
  await admin.getByLabel('Mot de passe').fill(password);
  await admin.getByRole('button',{name:'Se connecter'}).click();
  await admin.getByText('Bonjour, l’atelier.').waitFor();
 }
 assert.equal(await admin.getByRole('button',{name:'Boutique & DPD'}).count(),0);
 await admin.getByRole('button',{name:'Créations',exact:true}).click();
 await admin.getByRole('heading',{name:'Créations',exact:true}).first().waitFor();
 assert.ok(await admin.getByLabel('Autoriser les commandes en ligne').count());
 assert.ok(await admin.getByLabel('Photo').count());
 assert.ok(await admin.getByLabel('Prix TTC (€)').count());
 await admin.screenshot({path:'tests/admin-creations-desktop.png',fullPage:true});
 await browser.close();
 console.log('Créations publiques, redirections et administration unifiée : OK');
})().catch(error=>{console.error(error);process.exit(1)});

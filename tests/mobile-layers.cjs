const { chromium } = require('@playwright/test');
const assert = require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try {
  for (const [width,height] of [[390,844],[320,568],[767,1024],[768,1024],[1440,900]]) {
   const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   const requests=[];page.on('request',r=>{if(r.resourceType()==='image')requests.push(decodeURIComponent(r.url()));});
   await page.goto('http://localhost:3000',{waitUntil:'networkidle'});
   await page.waitForFunction(()=>document.activeElement?.tagName==='BUTTON');
   const button=page.getByRole('button',{name:'Découvrir',exact:true});
   const box=await button.boundingBox();
   assert(box.y>=0&&box.y+box.height<=height,'Intro action must stay within the viewport');
   await button.click();
   await page.locator('#accueil[data-intro="complete"]').waitFor();
   const images=await page.locator('[data-depth] img').evaluateAll(imgs=>imgs.map(i=>({
    loaded:i.complete&&i.naturalWidth>0,src:decodeURIComponent(i.currentSrc),
    rect:{w:i.getBoundingClientRect().width,h:i.getBoundingClientRect().height},
    fit:getComputedStyle(i).objectFit,transform:getComputedStyle(i).transform
   })));
   assert.equal(images.length,3);assert(images.every(i=>i.loaded));
   assert(images.every(i=>i.src.includes('-mobile.')===(width<=767)),'Wrong image family selected');
   assert(await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth));
   if(width<=767){
    assert(images.every(i=>Math.abs(i.rect.w/i.rect.h-941/1672)<.002),'Mobile layers must share the portrait framing');
    assert(images.every(i=>i.transform==='none'),'The foreground must not use the desktop shrink');
    assert(!requests.some(url=>/\/(background|middle|foreground)\.[a-z0-9]+\.webp/.test(url)),'Avoid fetching unused desktop scene assets');
    assert(await page.locator('[data-moon] img').isVisible());
   }
   if(width===390)await page.screenshot({path:'tests/mobile-layers.png',fullPage:true});
   if(width===1440)await page.screenshot({path:'tests/desktop-layers.png'});
   assert.deepEqual(errors,[]);
   console.log(width+'x'+height+': correct assets, framing, entry controls and visible moon');
   await page.close();
  }
 } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exit(1)});

const { chromium } = require('@playwright/test');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ channel:'msedge', headless:true });
  try {
    const page = await browser.newPage({ viewport:{width:1440,height:900} });
    const errors = [];
    page.on('pageerror', e=>errors.push(e.message));
    await page.goto('http://localhost:3000', {waitUntil:'networkidle'});
    const hero=page.locator('#accueil');
    assert.equal(await hero.getAttribute('data-intro'),'intro');
    assert.equal(await page.getByRole('dialog').count(),1);
    assert.equal(await page.locator('#hero-title').isVisible(),false);
    assert.equal(await page.evaluate(()=>document.activeElement.textContent.trim()),'Découvrir ↗');
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(()=>document.activeElement.tagName),'BUTTON');
    await page.mouse.wheel(0,500);
    await page.mouse.move(1300,450);
    await page.waitForTimeout(200);
    assert.equal(await page.evaluate(()=>scrollY),0);
    assert(await page.locator('[data-depth]').evaluateAll(els=>els.every(el=>new DOMMatrix(getComputedStyle(el).transform).m41===0)));
    assert(await page.locator('#creations').evaluate(el=>el.inert));
    await page.screenshot({path:'tests/intro-desktop.png'});
    await page.getByRole('button',{name:'Découvrir',exact:true}).click();
    assert.equal(await hero.getAttribute('data-intro'),'revealing');
    await page.waitForTimeout(1700);
    assert.equal(await hero.getAttribute('data-intro'),'complete');
    assert.equal(await page.evaluate(()=>document.activeElement.id),'hero-title');
    assert.equal(await page.evaluate(()=>document.documentElement.style.overflow),'');
    assert.equal(await page.locator('#creations').evaluate(el=>el.inert),false);
    assert(await page.locator('[data-depth] > div').evaluateAll(els=>els.every(el=>{
      const m=new DOMMatrix(getComputedStyle(el).transform);
      return Math.abs(m.m11-1)<.0001 && m.m42===0;
    })));
    await page.screenshot({path:'tests/intro-complete.png'});
    await page.mouse.wheel(0,200);
    await page.waitForTimeout(150);
    assert(await page.evaluate(()=>scrollY>0));
    await page.reload({waitUntil:'networkidle'});
    await page.keyboard.press('Escape');
    assert.equal(await hero.getAttribute('data-intro'),'complete');
    await page.reload({waitUntil:'networkidle'});
    await page.getByRole('button',{name:'Découvrir',exact:true}).dblclick();
    assert.equal(await hero.getAttribute('data-intro'),'complete');

    const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
    await mobile.goto('http://localhost:3000',{waitUntil:'networkidle'});
    await mobile.screenshot({path:'tests/intro-mobile.png'});
    await mobile.getByRole('button',{name:'Découvrir',exact:true}).click();
    await mobile.waitForTimeout(1100);
    assert.equal(await mobile.locator('#accueil').getAttribute('data-intro'),'complete');
    assert(await mobile.evaluate(()=>document.documentElement.scrollWidth===innerWidth));

    const reduced=await browser.newPage({reducedMotion:'reduce'});
    await reduced.goto('http://localhost:3000',{waitUntil:'networkidle'});
    await reduced.getByRole('button',{name:'Découvrir',exact:true}).click();
    assert.equal(await reduced.locator('#accueil').getAttribute('data-intro'),'complete');
    assert.equal(await reduced.evaluate(()=>document.documentElement.style.overflow),'');
    assert.deepEqual(errors,[]);
    console.log('PASS: intro framing, scroll lock, focus, inert content, camera handoff, Escape, second click, mobile duration, reduced motion and runtime errors.');
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exit(1);});

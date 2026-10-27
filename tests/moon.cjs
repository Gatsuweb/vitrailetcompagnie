const { chromium } = require('@playwright/test');
const assert = require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try {
  const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://localhost:3000',{waitUntil:'networkidle'});
  const rig=page.locator('[data-moon]');
  assert.equal(await rig.getAttribute('data-moon'),'hidden');
  assert.equal(await rig.isVisible(),false);
  assert(await rig.locator('img').evaluate(i=>i.complete&&i.naturalWidth>0));
  const initialHeight=await page.locator('#accueil').evaluate(el=>el.offsetHeight);
  await page.mouse.move(1300,300);await page.waitForTimeout(150);
  assert.equal(await rig.getAttribute('data-moon'),'hidden');
  await page.getByRole('button',{name:'Découvrir',exact:true}).click();
  assert.equal(await rig.getAttribute('data-moon'),'falling');
  // Sample the real CSS animations deterministically, including the tension.
  const sample=async time=>rig.evaluate(async(el,time)=>{
    const animations=el.getAnimations({subtree:true});
    animations.forEach(a=>{a.pause();a.currentTime=time;});
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    const fall=el.querySelector('[data-moon-drop]');
    const cord=el.querySelector('[data-moon-cord]');
    const tilt=el.querySelector('[data-moon-tilt]');
    const swing=el.querySelector('[data-moon-swing]');
    const length=parseFloat(getComputedStyle(swing).height);
    const y=new DOMMatrix(getComputedStyle(fall).transform).m42;
    return {
      y, attachmentY:length+y,
      cordEndY:length*new DOMMatrix(getComputedStyle(cord).transform).m22,
      angle:Math.atan2(new DOMMatrix(getComputedStyle(tilt).transform).m12,new DOMMatrix(getComputedStyle(tilt).transform).m11),
      originY:parseFloat(getComputedStyle(tilt).transformOrigin.split(' ')[1]),
      anchorTop:el.getBoundingClientRect().top,
      bottom:fall.getBoundingClientRect().bottom,
      count:animations.length
    };
  },time);
  const start=await sample(0);assert(start.bottom<0);assert.equal(start.count,4);
  for(const t of [500,650,800,1000,1250,1700,2900,3100]){
    const s=await sample(t);
    assert(Math.abs(s.attachmentY-s.cordEndY)<.15,'Cord detached at '+t);
    assert.equal(s.anchorTop,0);
    assert.equal(s.originY,0,'Rotation must pivot at the upper attachment');
    if(t===800) assert(s.y>0,'Expected tension overshoot');
    if(t===1000) assert(s.y<0,'Expected small rebound');
    if(t===1700) assert(Math.abs(s.angle)>0,'Expected a light swing');
    if(t===3100) assert(Math.abs(s.y)<.001&&Math.abs(s.angle)<.001,'Must settle');
  }
  await page.keyboard.press('Escape');
  assert.equal(await rig.getAttribute('data-moon'),'settled');
  assert.equal(await page.locator('#accueil').evaluate(el=>el.offsetHeight),initialHeight);
  // Ending the intro does not replace/restart the moon animations.
  assert.equal(await rig.evaluate(el=>el.getAnimations({subtree:true}).length),0);
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.emulateMedia({reducedMotion:'no-preference'});
  assert.equal(await rig.evaluate(el=>el.getAnimations({subtree:true}).length),0);
  await page.screenshot({path:'tests/moon-desktop.png'});

  await page.reload({waitUntil:'networkidle'});
  await page.keyboard.press('Escape');
  assert.equal(await rig.getAttribute('data-moon'),'settled');
  assert.equal(await rig.evaluate(el=>el.getAnimations({subtree:true}).length),0);

  const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
  await mobile.goto('http://localhost:3000',{waitUntil:'networkidle'});
  await mobile.getByRole('button',{name:'Découvrir',exact:true}).click();
  const mobileRig=mobile.locator('[data-moon]');
  assert.equal(await mobileRig.getAttribute('data-moon'),'settled');
  assert.equal(await mobileRig.evaluate(el=>el.getAnimations({subtree:true}).length),0);
  assert(await mobileRig.locator('img').isVisible());
  assert(await mobile.evaluate(()=>document.documentElement.scrollWidth===innerWidth));
  await mobile.screenshot({path:'tests/moon-mobile.png'});
  assert.deepEqual(errors,[]);
  console.log('PASS: hidden until click, off-screen start, connected cord, overshoot/rebound, diminishing swing, upper pivot, fixed anchor, no replay/layout shift, static skip, mobile/reduced motion.');
 } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exit(1);});

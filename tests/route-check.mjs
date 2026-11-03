// End-to-end check of the route controller on a virtual clock, so inertia and timing
// are exact. Needs Chrome: `npm i --no-save playwright-core && node tests/route-check.mjs`
// Synthetic input only: real trackpads and phones still need a manual pass.
import {createRequire} from 'module';import http from 'http';import fs from 'fs';import path from 'path';
const {chromium}=createRequire(import.meta.url)('playwright-core');
const root=path.resolve(path.dirname(new URL(import.meta.url).pathname),'..');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.svg':'image/svg+xml'};
const server=http.createServer((q,a)=>{const file=path.join(root,decodeURIComponent(q.url.split('?')[0]).replace(/^\/$/,'/index.html'));fs.readFile(file,(e,b)=>{a.writeHead(e?404:200,{'content-type':types[path.extname(file)]||'text/plain'});a.end(b)})});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const url=`http://127.0.0.1:${server.address().port}/`,browser=await chromium.launch({channel:'chrome',headless:true});
const clock=`(()=>{let now=1000,cbs=[];performance.now=()=>now;window.requestAnimationFrame=c=>(cbs.push(c),1);
window.tick=(n=1,dt=1000/60)=>{for(let i=0;i<n;i++){now+=dt;const r=cbs;cbs=[];r.forEach(c=>c(now));}};
window.wheel=(deltaY,o={})=>{const e=new WheelEvent('wheel',{deltaY,bubbles:true,cancelable:true,...o});(o.on?document.querySelector(o.on):document.querySelector('#world')).dispatchEvent(e);return e.defaultPrevented};
window.touch=(type,x,y)=>{const t=new Touch({identifier:1,target:document.querySelector('#world'),clientX:x,clientY:y}),e=new TouchEvent(type,{bubbles:true,cancelable:true,touches:type==='touchend'?[]:[t],changedTouches:[t]});document.querySelector('#world').dispatchEvent(e);return e.defaultPrevented};
window.flick=(dx,dy)=>{touch('touchstart',200,500);for(let i=1;i<=6;i++){touch('touchmove',200+dx*i/6,500+dy*i/6);tick()}touch('touchend',200+dx,500+dy)};
window.settle=(max=3000)=>{let n=0;while(n++<max&&route.state!=='idle')tick()};
window.place=i=>{commitJump(STOPS[i].p);route.current=route.target=i;route.state='settling';route.lastInput=-1e6;tick(3)};
// A long trackpad flick: strong start, slow exponential tail.
window.inertia=(sign,frames,from=90)=>{for(let i=0;i<frames;i++){wheel(sign*Math.max(.5,from*Math.exp(-i/70)));tick()}};
})()`;
async function open(o={}){const page=await(await browser.newContext({viewport:{width:1280,height:720},...o})).newPage();page.errs=[];page.on('pageerror',e=>page.errs.push(String(e)));await page.addInitScript(clock);await page.goto(url);
 await page.waitForFunction(`[deskImage,tokyoImage,sevenImage,heroAtlas,driverAtlas,...bmwImages].every(i=>i.complete&&i.naturalWidth)&&heroFrames.length===8`);
 await page.evaluate(`document.getElementById('loader')?.remove();document.documentElement.classList.remove('booting');tick(3)`);return page}
let failed=0;const ok=(name,cond,info='')=>{console.log(`${cond?'  ok ':'FAIL '} ${name}${info!==''?' — '+JSON.stringify(info):''}`);if(!cond)failed++};
const at=(pg,i,script)=>pg.evaluate(`(()=>{place(${i});${script}})()`);
const stop=pg=>pg.evaluate(`route.current`);
const lands=async(pg,name,i,script,want)=>{await at(pg,i,script+';settle()');const s=await pg.evaluate(`({c:route.current,p,want:STOPS[${want}].p})`);ok(name,s.c===want&&Math.abs(s.p-s.want)<1e-9,s)};

{console.log('wheel, keyboard, buttons');const d=await open();
 await d.evaluate(`place(1)`);const hint=await d.evaluate(`$('#hint').textContent`);ok('hint clears after the first stop',hint==='',hint);
 await lands(d,'one notch',1,`wheel(100)`,2);
 await lands(d,'one notch, Firefox line mode',1,`wheel(3,{deltaMode:1})`,2);
 await lands(d,'tiny series is one stop',1,`for(let i=0;i<40;i++){wheel(2);tick()}`,2);
 await lands(d,'below threshold does nothing',1,`for(let i=0;i<20;i++){wheel(1);tick()}`,1);
 await lands(d,'split by a pause does not add up',1,`wheel(30);tick(30);wheel(30)`,1);
 await lands(d,'hard scroll is one stop',1,`for(let i=0;i<12;i++){wheel(1500);tick()}`,2);
 await lands(d,'inertia outlasting the walk is one stop',1,`inertia(1,420)`,2);
 await lands(d,'long inertia into an episode is one stop',5,`inertia(1,700)`,6);
 await lands(d,'reversal mid-transition queues nothing',1,`wheel(120);tick(40);wheel(-120);tick(5);wheel(-60)`,2);
 await lands(d,'firm reversal during the tail is a new gesture',2,`wheel(120);while(route.state==='transitioning'){tick();wheel(2)}for(let i=0;i<8;i++){tick();wheel(2)}for(let i=0;i<4;i++){wheel(-40);tick()}`,2);
 await lands(d,'second stop needs the wheel to go quiet',1,`wheel(120);while(route.state==='transitioning'){tick();wheel(1)}for(let i=0;i<60;i++){wheel(30);tick()}`,2);
 await lands(d,'input during a transition is dropped',1,`wheel(120);tick(30);wheel(300);dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowDown'}));$('#routeNext').click();$('#routeNext').click()`,2);
 ok('wheel is captured on the route',await d.evaluate(`(place(1),wheel(10))`));
 ok('ctrl wheel is left to the browser',!(await d.evaluate(`(place(1),wheel(100,{ctrlKey:true}))`)));
 ok('cmd wheel is left to the browser',!(await d.evaluate(`(place(1),wheel(100,{metaKey:true}))`)));
 await d.evaluate(`place(1);$('#routeBack').blur();document.body.focus()`);await d.keyboard.down('ArrowDown');for(let i=0;i<30;i++)await d.keyboard.down('ArrowDown');await d.evaluate(`settle();tick(240)`);await d.keyboard.up('ArrowDown');ok('held key is one stop',await stop(d)===2,await stop(d));
 await d.evaluate(`place(3);$('#routeBack').focus()`);await d.keyboard.press(' ');await d.evaluate(`settle()`);ok('Space presses the focused Back',await stop(d)===2,await stop(d));
 await d.evaluate(`document.activeElement.blur()`);
 ok('no page errors',!d.errs.length,d.errs);
 console.log('dialogs');
 await d.evaluate(`place(1);openCase(0)`);
 const prevented=await d.evaluate(`wheel(200,{on:'#modal'})`);ok('modal wheel stays native',!prevented);
 await d.setViewportSize({width:700,height:420});await d.evaluate(`tick(3)`);
 const box=await d.evaluate(`(()=>{const r=$('#modal').getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]})()`);await d.mouse.move(...box);await d.mouse.wheel(0,300);await d.waitForFunction(`$('#modal').scrollTop>0`,null,{timeout:3000}).catch(()=>{});
 const m=await d.evaluate(`(tick(20),{top:$('#modal').scrollTop,p,c:route.current})`);ok('case text scrolls with a real wheel, city holds',m.top>0&&m.c===1&&m.p===.25,m);
 await d.evaluate(`$('#modal').close()`);await d.setViewportSize({width:1280,height:720});
 await lands(d,'close then inertia stays put',1,`openCase(0);wheel(40);tick(10);$('#modal').close();for(let i=0;i<30;i++){tick();wheel(30)}`,1);
 await d.evaluate(`place(1);$('#routeNext').click();tick(40);openCase(0)`);const a=await d.evaluate(`(tick(120),p)`),b=await d.evaluate(`(tick(120),p)`);ok('dialog freezes a walk',a===b&&a>.25&&a<.38,[a,b]);
 await d.evaluate(`$('#modal').close();settle()`);ok('walk resumes after close',await stop(d)===2);
 for(const [frames,label] of [[40,'walk to the car'],[100,'sitting down'],[200,'turn']]){await d.evaluate(`place(5);$('#routeNext').click();tick(${frames});openMap($('#routeName'))`);const q=await d.evaluate(`(tick(90),p)`),r=await d.evaluate(`(tick(90),p)`);await d.evaluate(`$('#map').close();settle()`);const e=await d.evaluate(`({c:route.current,p})`);ok(`map opened and closed during ${label} finishes the episode`,q===r&&e.c===6&&e.p===.775,e);}
 console.log('map during motion');
 await lands(d,'map pick while walking',1,`$('#routeNext').click();tick(40);openMap($('#routeName'));document.querySelector('.maplinks button.route-stop').click()`,6);
 await lands(d,'map pick of the stop just left',1,`$('#routeNext').click();tick(40);openMap($('#routeName'));go(STOPS[1].p)`,1);
 await lands(d,'map pick mid-boarding',5,`$('#routeNext').click();tick(100);openMap($('#routeName'));go(STOPS[2].p)`,2);
 await lands(d,'map pick on the stairs',7,`$('#routeNext').click();tick(180);openMap($('#routeName'));go(STOPS[3].p)`,3);
 console.log('skip');
 for(const [i,frames] of [[5,60],[5,130],[5,240],[6,180],[6,320],[6,400],[7,60],[7,160],[7,260]]){await d.evaluate(`place(${i});$('#routeNext').click();tick(${frames})`);ok(`skip offered at ${i}+${frames}`,await d.evaluate(`!$('#routeSkip').hidden`));await d.evaluate(`$('#routeSkip').click();settle()`);
  const s=await d.evaluate(`(()=>{let girls=0,seat=0;const a=girl,b=seatedHero,c=carTransferHero;girl=(...v)=>{if(!v[3])girls++;return a(...v)};seatedHero=(...v)=>{seat++;return b(...v)};carTransferHero=(...v)=>{girls+=100;return c(...v)};tick();girl=a;seatedHero=b;carTransferHero=c;return {c:route.current,p,girls,seat,sk:$('#routeSkip').hidden}})()`);
  const want=i+1,bad=want===6?s.seat!==1||s.girls!==0:s.seat!==0||s.girls>2;ok(`skip lands whole on stop ${want}`,s.c===want&&s.p===[0,0,0,0,0,0,.775,.935,.98][want]&&!bad&&s.sk,s);}
 console.log('reverse');
 for(const [i,w] of [[8,7],[7,6],[6,5]]){await d.evaluate(`place(${i});$('#routeBack').click();tick(6)`);const k=await d.evaluate(`route.kind`);await d.evaluate(`settle()`);const e=await d.evaluate(`({c:route.current,facing:roofState.facingCity})`);ok(`back ${i}→${w} is a glitch`,k==='glitch'&&e.c===w&&!e.facing,{k,...e});}
 console.log('resize');
 await d.evaluate(`place(4)`);await d.setViewportSize({width:844,height:390});await d.evaluate(`tick(30)`);await d.setViewportSize({width:390,height:844});await d.evaluate(`tick(30)`);await d.setViewportSize({width:390,height:760});await d.evaluate(`tick(30)`);
 ok('resize keeps the stop',await d.evaluate(`route.current===4&&p===STOPS[4].p&&route.state==='idle'`));
 await d.evaluate(`route.lastInput=-1e6;$('#routeNext').click();tick(40)`);const mid=await d.evaluate(`({p,t:route.target,dir})`);await d.setViewportSize({width:844,height:390});const after=await d.evaluate(`(tick(),{t:route.target,dir,p})`);await d.evaluate(`settle()`);ok('resize mid-walk keeps target and direction',after.t===mid.t&&after.dir===mid.dir&&Math.abs(after.p-mid.p)<.01&&await stop(d)===5,{mid,after});
 await d.setViewportSize({width:1280,height:720});
 console.log('whole route on Next');
 const seen=[];await d.evaluate(`place(0);$('#enter').click();settle();tick(30)`);
 for(let i=1;i<9;i++){seen.push(await d.evaluate(`(()=>{const c=route.current,s=STOPS[c],hud=$('#driveHud').style.display==='block'&&p<.9,last=c===8;if(last)return {c,contacts:!$('#finalContacts').hidden,mail:!!$('#finalContacts a[href^="mailto"]')};(hud?$('#driveCase'):$('#caseBtn')).click();const t=$('#caseTitle').textContent;$('#modal').close();return {c,t,want:portfolio[s.proj].name}})()`));if(i<8){await d.evaluate(`tick(2);route.state==='idle'||settle();$('#routeNext').click();settle()`);}}
 ok('every project opens via Next, no map',seen.slice(0,7).every(x=>x.t===x.want),seen);ok('contacts reached via Next',seen[7]?.contacts&&seen[7]?.mail,seen[7]);
 ok('Next ends at contacts',await d.evaluate(`$('#routeNext').disabled`));
 await d.evaluate(`for(let i=8;i>0;i--){$('#routeBack').click();settle()}`);ok('hint stays gone back at the entrance',await d.evaluate(`(tick(5),route.current===0&&$('#hint').textContent==='')`));
 ok('no page errors overall',!d.errs.length,d.errs);await d.context().close();}

{console.log('touch');const t=await open({viewport:{width:390,height:844},hasTouch:true,isMobile:true,deviceScaleFactor:1});
 await lands(t,'tap does nothing',2,`touch('touchstart',200,500);tick();touch('touchend',200,500)`,2);
 await lands(t,'small drag does nothing',2,`flick(0,-30)`,2);
 await lands(t,'swipe up is next',2,`flick(0,-120)`,3);
 await lands(t,'swipe down is back',2,`flick(0,120)`,1);
 await lands(t,'diagonal is ignored',2,`flick(120,-110)`,2);
 await lands(t,'long swipe is one stop',2,`flick(0,-640)`,3);
 await lands(t,'finger left down over arrival fires once',2,`touch('touchstart',200,500);for(let i=1;i<300;i++){touch('touchmove',200,500-i*.8);tick()}touch('touchend',200,260)`,3);
 await lands(t,'swipe begun mid-transition is spent',2,`flick(0,-120);tick(20);touch('touchstart',200,500);tick();touch('touchmove',200,480);settle();tick(30);touch('touchmove',200,380);tick();touch('touchend',200,380)`,3);
 await lands(t,'second finger cancels',2,`touch('touchstart',200,500);(()=>{const a=new Touch({identifier:1,target:$('#world'),clientX:200,clientY:500}),b=new Touch({identifier:2,target:$('#world'),clientX:260,clientY:500}),e=new TouchEvent('touchstart',{bubbles:true,cancelable:true,touches:[a,b]});$('#world').dispatchEvent(e)})();touch('touchmove',200,400);touch('touchend',200,400)`,2);
 ok('page zoom left on',await t.evaluate(`!/user-scalable=no|maximum-scale=1/.test(document.querySelector('meta[name=viewport]').content)`));
 ok('no page errors',!t.errs.length,t.errs);await t.context().close();}

{console.log('reduced motion');const r=await open({reducedMotion:'reduce'});
 const trip=await r.evaluate(`(()=>{place(0);const out=[];for(let i=1;i<9;i++){let n=0;$('#routeNext').click();while(route.state==='transitioning'){tick();n++}out.push(n);route.lastInput=-1e6;tick()}return {out,c:route.current,facing:roofState.facingCity,sig:signalState.quiet}})()`);
 ok('every stop is a short calm cut',trip.out.every(n=>n<20)&&trip.c===8&&trip.facing&&trip.sig,trip);
 ok('contacts available',await r.evaluate(`(tick(),!$('#finalContacts').hidden)`));ok('no page errors',!r.errs.length,r.errs);await r.context().close();}

await browser.close();server.close();console.log(failed?`\n${failed} FAILED`:'\nall checks passed');process.exit(failed?1:0);

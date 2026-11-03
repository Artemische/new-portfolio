// Allocate extra scroll distance only to the open-road section and the walk back.
function storyToScroll(v){return (v+.065* Math.max(0,Math.min(1,(v-.75055)/.09555))+.025*Math.max(0,Math.min(1,(v-.90)/.035)))/1.09}
function scrollToStory(q){let lo=0,hi=1;for(let i=0;i<24;i++){const mid=(lo+hi)/2;if(storyToScroll(mid)<q)lo=mid;else hi=mid}return (lo+hi)/2}
const $=s=>document.querySelector(s), C=$('#world'),ctx=C.getContext('2d'),scene=document.createElement('canvas');scene.width=1100;scene.height=680;const g=scene.getContext('2d');let w=innerWidth,h=innerHeight,p=0,target=0,last=0,dir=1,walk=0,clock=0,navigating=false;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;if('scrollRestoration' in history)history.scrollRestoration='manual';
function resize(){w=innerWidth;h=innerHeight;C.width=w*devicePixelRatio;C.height=h*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0)}addEventListener('resize',resize);resize();const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),lerp=(a,b,t)=>a+(b-a)*t;function rect(x,y,a,b,c){g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),a,b)}function glow(x,y,r,c){const z=g.createRadialGradient(x,y,0,x,y,r);z.addColorStop(0,c);z.addColorStop(1,'transparent');g.fillStyle=z;g.fillRect(x-r,y-r,r*2,r*2)}function line(x,y,X,Y,c,width=1){g.strokeStyle=c;g.lineWidth=width;g.beginPath();g.moveTo(x,y);g.lineTo(X,Y);g.stroke()}function text(t,x,y,size,c){g.font=`${size}px monospace`;g.fillStyle=c;g.fillText(t,x,y)}
const buildings=Array.from({length:58},(_,i)=>({x:i*116,y:90+((i*73)%160),width:90+(i*19)%44,color:['#101a27','#121e2a','#17222d'][i%3]}));
function sign(t,x,y,width,color,on){rect(x-5,y-5,width+10,40,'#121e22');rect(x-3,y-3,width+6,36,on?color:'#273238');rect(x,y,width,30,'#10191d');if(on){g.shadowColor=color;g.shadowBlur=13;text(t,x+9,y+22,19,color);g.shadowBlur=0;glow(x+width/2,y+20,width*.8,color+'22')}else text(t,x+9,y+22,19,'#364044')}
let screenHover=-1,screenLook=null,sceneView=null;
const actor={time:0,motion:0,camera:0,proximity:0};
function cityBeat(progress){const world=440+clamp((cityProgress(progress)-.15)/.85)*3900;let proximity=0;for(const c of portfolio.slice(0,5))proximity=Math.max(proximity,Math.exp(-(((world-c.x-170)/145)**2)));return proximity;}
function updateActor(dt,delta,t){const city=p>.18&&p<.625,k=1-Math.exp(-dt/300);actor.time=reduced?0:t;actor.proximity=city?cityBeat(p):0;
const speed=city?clamp(Math.abs(delta)/Math.max(dt,1)*18000):0;actor.motion+=((reduced?0:speed)-actor.motion)*k;
// The lead tapers off on approach so the fixed boarding camera takes over without a lurch.
const lead=city&&!reduced?dir*(actor.motion*26+actor.proximity*16)*(1-clamp((p-.585)/.035)):0;actor.camera+=(lead-actor.camera)*(1-Math.exp(-dt/620));if(!city)actor.camera*=Math.exp(-dt/240);
}

let active=-1,torchOn=true,aimY=405;const chapters=portfolio;
const tokyoImage=new Image();tokyoImage.src="assets/tokyo-panorama.webp";const sevenImage=new Image();sevenImage.src="assets/seven-stop.webp";
// Entrance desk plate: real photo of the room; the live city renders inside its CRT glass.
const deskImage=new Image();deskImage.src="assets/hero-desk.jpg";
const thumbs=portfolio.slice(0,5).map(()=>new Image());
function poly(points,c){g.fillStyle=c;g.beginPath();points.forEach((v,i)=>i?g.lineTo(...v):g.moveTo(...v));g.closePath();g.fill()}
function round(x,y,r,c){g.fillStyle=c;g.beginPath();g.arc(x,y,r,0,Math.PI*2);g.fill()}
function graph(x,y,ww,hh,c,t){for(let i=0;i<4;i++)line(x,y+i*hh/4,x+ww,y+i*hh/4,'#34474955');g.strokeStyle=c;g.lineWidth=2;g.beginPath();for(let i=0;i<=ww;i+=4){const v=y+hh*.5+Math.sin(i*.06+t)*hh*.22+Math.sin(i*.19)*hh*.1;i?g.lineTo(x+i,v):g.moveTo(x+i,v)}g.stroke()}
function facade(c,index,lit,t){if(index===0){durianoArcade(c,lit,t);return;}if(index===1){fundraislyFacade(c,lit,t);return;}const x=c.x,col=lit?c.color:'#34404a';rect(x,252,330,263,'#18242e');rect(x+6,260,318,7,'#384751');for(let y=275;y<515;y+=16)line(x,y,x+330,y,'#273641');rect(x+18,342,294,165,'#070f17');rect(x+23,348,284,151,lit?'#172a32':'#101a23');const distance=Math.abs((440+clamp((p-.15)/.85)*3900)-(x+170));
g.save();g.globalAlpha=lit?.30+.70*(1-ease((distance-110)/420)):1;sign(c.name.toUpperCase(),x+26,281,278,c.color,lit);g.restore();rect(x-8,329,346,12,'#34434d');rect(x-8,329,346,3,col);
if(index===0){for(let i=0;i<3;i++){const k=x+37+i*88;rect(k,382,63,113,'#080d18');poly([[k+3,382],[k+59,382],[k+55,445],[k+65,459],[k+62,495],[k,495],[k-4,458],[k+5,445]],'#292b49');rect(k+9,391,44,49,lit?'#3e3461':'#19202c');if(lit){text(['PVP','CLAN','TON'][i],k+15,414,12,c.color);for(let j=0;j<4;j++)rect(k+13+j*8,423,4,5,['#c3ce73','#b894e1','#6cb6af'][i]);}rect(k+3,449,54,10,'#514963');round(k+17,452,3,'#c19cb0');rect(k+39,450,7,3,col);}
// pixel durian mascot on the roof
for(let j=0;j<7;j++)for(let i=0;i<8;i++){const edge=Math.abs(i-3.5)+Math.abs(j-3);if(edge<5)rect(x+227+i*7,205+j*7,7,7,lit?(j<4?'#a8bb5e':'#97587b'):'#2a3742');}rect(x+241,224,10,4,'#121e20');rect(x+264,224,10,4,'#121e20');text('INSERT TON / START PLAYING',x+25,362,9,col);}
if(index===1){rect(x+39,365,251,96,'#0c1922');const pts=[[x+72,392],[x+139,379],[x+155,432],[x+245,395],[x+259,440]];pts.forEach((pt,i)=>{if(i)line(...pts[i-1],...pt,lit?'#4b939b':'#24383f');round(...pt,i%2?9:6,lit?c.color:'#33464d');});if(lit){round(x+170+Math.sin(t*.5)*90,407,3,'#eefdc5');text('STARTUPS  ∞  INVESTORS',x+57,482,12,c.color);}rect(x+120,465,83,3,'#546770');text('AI MATCHING / NLP SEARCH',x+38,360,9,col);}
if(index===2){rect(x+33,365,167,106,'#091720');graph(x+42,388,145,58,col,t);text('LIVE TELEMETRY',x+42,379,10,col);for(let i=0;i<3;i++){rect(x+214,365+i*36,75,30,'#0a1820');rect(x+222,374+i*36,5,5,col);text(['WELLS','FLOW','ALERTS'][i],x+236,381+i*36,8,col);}rect(x+56,478,220,7,'#3c4d55');text('CONTROL ROOM / GGOFS',x+51,360,9,col);
// working oil pump behind the control room
const k=x+380;line(k,510,k+30,315,'#56636a',7);line(k+70,510,k+30,315,'#56636a',7);line(k-15,510,k+90,510,'#53626b',6);const lift=Math.sin(t*.7)*12;line(k-24,318-lift,k+115,300+lift,lit?'#a3957c':'#53626b',8);rect(k+105,290+lift,18,37,'#8b8277');line(k+113,320+lift,k+113,498,'#7d8b8d',2);line(k+10,405,k+68,405,'#616e73',3);round(k+30,318,8,'#343d47');}
if(index===3){focolorBay(x,col,lit,t);}
if(index===4){rect(x,267,330,8,'#c77746');rect(x,275,330,5,'#cfdfbc');rect(x,320,330,8,'#38745c');rect(x+240,208,65,51,'#d6dfc4');text('7',x+259,239,33,'#c97745');text('ELEVEN',x+245,251,10,'#35735a');for(let i=0;i<4;i++){const xx=x+38+i*65;rect(xx,367,49,120,'#0b121c');for(let j=0;j<6;j++){rect(xx+3,372+j*18,43,13,'#273542');rect(xx+9,376+j*18,3,3,lit&&(j+i+Math.floor(t))%4?'#8fbcb5':'#3b5261');line(xx+18,379+j*18,xx+39,379+j*18,'#566573');}}text('PRIVATE / RESTRICTED ACCESS',x+37,360,9,col);rect(x+304,410,9,20,'#223342');round(x+308,417,2,lit?'#efbb7b':'#36444a');}
// each doorway has a genuine portfolio preview
if(lit&&thumbs[index].complete&&thumbs[index].naturalWidth){if(index===3){rect(x+331,347,128,162,'#172733');poly([[x+459,347],[x+470,357],[x+470,509],[x+459,509]],'#35434c');rect(x+337,352,116,4,'#65727a');for(const yy of [376,435]){rect(x+449,yy,15,5,'#111b25');rect(x+460,yy+1,2,2,'#819098');}rect(x+345,447,107,5,'#030b16');}rect(x+340,363,110,83,'#263941');g.globalAlpha=.8;g.drawImage(thumbs[index],x+344,367,102,64);g.globalAlpha=1;
const focused=screenHover===index||screenLook?.index===index;
const glitch=!reduced&&(focused||Math.sin(t*2.2+index*1.7)>.97);
if(glitch){g.save();g.beginPath();g.rect(x+344,367,102,64);g.clip();for(let k=0;k<3;k++){const yy=(Math.floor(t*19)+k*19)%58,offset=Math.sin(t*35+k)*5;g.drawImage(thumbs[index],0,yy/64*thumbs[index].naturalHeight,thumbs[index].naturalWidth,thumbs[index].naturalHeight*4/64,x+344+offset,367+yy,102,4);rect(x+344,367+yy,102,1,k%2?'#ef77cf66':'#7ce6e666');}g.restore();}
text('View case study →',x+346,441,9,c.color);if(focused){g.strokeStyle=c.color;g.lineWidth=1.5;g.strokeRect(x+340,363,110,83);glow(x+395,402,85,c.color+'38');}}if(lit){glow(x+165,400,190,c.color+'1c');for(let i=0;i<24;i++){g.globalAlpha=.15*(1-i/25);rect(x+20+Math.sin(i*4)*20,532+i*5,300-i*7,2,c.color);}g.globalAlpha=1;}}
function drawCity(t){const cam=clamp((p-.15)/.85)*3900+actor.camera,black=molisBlackout(p);g.clearRect(0,0,1100,680);rect(0,0,1100,680,'#0a1420');glow(800,180,450,'#25394c55');g.save();g.translate(-cam*.25,0);for(const b of buildings){rect(b.x,b.y,b.width,510-b.y,b.color);rect(b.x+5,b.y-7,b.width-10,7,'#1c2a35');for(let y=b.y+18;y<480;y+=24)for(let x=b.x+9;x<b.x+b.width-8;x+=17)if(((x+y)|0)%7<3)rect(x,y,5,8,['#426064','#6d615e','#2c505a'][(x|0)%3]);line(b.x+40,b.y,b.x+40,b.y-33,'#37404b');}g.restore();if(tokyoImage.complete&&tokyoImage.naturalWidth){g.save();g.globalAlpha=.66;const sx=(cam*.20)%900;g.drawImage(tokyoImage,-sx,0,1800,680);g.drawImage(tokyoImage,1800-sx,0,1800,680);g.restore();}rect(0,515,1100,165,'#0c1a23');for(let y=528;y<680;y+=8)line(0,y,1100,y,'#24323933');g.save();g.translate(-cam,0);
g.save();g.globalAlpha=.65;for(let x=-100;x<5100;x+=370){rect(x,180,120,334,'#13212c');for(let y=208;y<310;y+=42){rect(x+13,y,32,25,'#09121c');rect(x+65,y,30,25,'#233945');}rect(x+91,380,26,51,'#33404a');for(let y=387;y<425;y+=5)line(x+94,y,x+111,y,'#172832');}
g.restore();const mb=projectWorldBounds(6);if(objectInScene(mb.left,mb.right,cam))molisShop(t);portfolio.slice(0,5).forEach((c,i)=>{const bounds=projectWorldBounds(i);if(objectInScene(bounds.left,bounds.right,cam))facade(c,i,true,t)});
rect(160,365,85,148,'#23343b');rect(166,371,73,98,black?'#1d3039':'#63989b');rect(170,375,62,85,'#172c38');for(let j=0;j<3;j++)for(let i=0;i<4;i++)rect(176+i*14,386+j*23,6,13,['#bd9691','#729e9b','#b7ba85'][j]);rect(176,480,40,12,'#080f17');sign('ARTEMISCHE',132,303,150,'#C982A3',!black);
for(let lamp=340;lamp<5100;lamp+=620){const x=lamp===960?1190:lamp===2820?3220:lamp===2200?2236:lamp;rect(x,190,5,325,'#40505b');line(x,192,x+70,192,'#465b63',3);if(!(black&&Math.abs(x-molisBounds().x)<310)){glow(x+70,206,90,'#e2cf9540');rect(x+48,195,35,4,'#d7d7b8');poly([[x+45,201],[x-50,515],[x+170,515],[x+84,201]],'#dfd2a209');}}
for(let x=-100;x<5100;x+=480){g.strokeStyle='#030b13';g.lineWidth=2;g.beginPath();g.moveTo(x,170);g.quadraticCurveTo(x+300,265,x+600,145);g.stroke();g.beginPath();g.moveTo(x,180);g.quadraticCurveTo(x+300,290,x+600,150);g.stroke();}
// A lamp briefly falters at the edge of each district, then returns to full light.
if(!black&&!reduced){for(const c of portfolio.slice(0,5)){const wx=440+clamp((p-.15)/.85)*3900,d=wx-(c.x+360);if(Math.abs(d)<90){const pulse=.35+.65*Math.abs(Math.sin(d*.065));glow(c.x+390,260,95,c.color+Math.round(pulse*100).toString(16).padStart(2,'0'));rect(c.x+386,256,8,5,pulse>.65?'#f6efcd':'#40505b');}}}
g.restore();
const gx=molisState.actorX!==null?molisState.actorX-cam:440-actor.camera,worldX=gx+cam,gy=477-clamp((worldX-3770)/135)*82;
// Torch and reflection stop at the boarding plate, so both leave before she reaches it.
const exitFade=1-clamp((p-.64)/.04);
// flashlight follows the travel direction; pointer changes its vertical angle
if(torchOn&&!boardingScene&&!screenLook){g.save();g.globalAlpha=lerp(1,.24,clamp((p-.14)/.05))*exitFade;const beamDir=molisState.action?molisState.direction:dir,repair=molisZone(p)&&!molisState.restored&&(molisBounds().x+17*molisBounds().k-cam-gx)*beamDir>0,sx=gx+beamDir*43,sy=gy-41,ey=repair?515+(422-515)*molisBounds().k:clamp(aimY,320,510);const reach=repair?Math.abs(molisBounds().x+17*molisBounds().k-cam-sx):440,spread=repair?20:95;const grad=g.createLinearGradient(sx,sy,sx+beamDir*reach,ey);grad.addColorStop(0,'#fff6c550');grad.addColorStop(1,'#c4e1c000');g.fillStyle=grad;g.beginPath();g.moveTo(sx,sy-3);g.lineTo(sx+beamDir*reach,ey-spread);g.quadraticCurveTo(sx+beamDir*(reach+10),ey,sx+beamDir*reach,ey+spread);g.lineTo(sx,sy+3);g.fill();glow(sx+beamDir*reach*.6,lerp(sy,ey,.6),repair?30:120,'#edffd316');glow(sx,sy,50,'#fff0bf20');g.restore();}
if(!boardingScene)molisGirl(gx,gy,true);g.save();g.globalAlpha=boardingScene?0:.10*exitFade;g.translate(gx,gy+79);g.scale(1,-.45);g.translate(-gx,-gy);girl(gx,gy,!black);g.restore();for(let i=0;i<100;i++){const x=(i*137.3+t*(20+i%7))%1150,y=(i*57+t*(110+i%40))%700;line(x,y,x-3,y+12,'#9cbcc11c');}glow(400+Math.sin(t*.15)*200,590,490,'#85bab815');}
function updateUI(){const intro=clamp(1-p/.13);$('#intro').style.opacity=intro;$('#intro').style.transform=`translateY(${w<700?-p*180: -p*180}px) ${w<700?'':'translateY(-50%)'}`;$('#intro').style.visibility=intro?'visible':'hidden';let ix=streetChapter(p,active);const visible=ix>=0&&ix!==5;if(ix!==active){active=ix;if(visible){const c=chapters[ix];$('#chapterNum').textContent=c.n;$('#chapterTitle').innerHTML=c.title;$('#chapterDesc').textContent=c.desc;$('#caseBtn').innerHTML=(ix===5?'Get in touch':'View case study')+' <span>→</span>';document.documentElement.style.setProperty('--accent',c.color);}}$('#chapter').style.opacity=visible?(p>=.925&&p<.94?ease((p-.925)/.004):1):0;$('#chapter').style.visibility=visible?'visible':'hidden';$('#chapter').style.transform='translateY(0)';$('#blackout').style.display='none';$('#hint').textContent=p<.18?(route.hintCleared?'':'Scroll or swipe to the next stop'):p>.92?'END OF TRANSMISSION':'';$('#coords').textContent=p<.18?'':`DISTRICT 0${Math.max(1,routeOrder.indexOf(ix)+1)} / ${Math.round(p*100).toString().padStart(3,'0')}%`;document.querySelectorAll('#progress button').forEach((b,i)=>b.classList.toggle('active',i===(ix>=0?routeOrder.indexOf(ix)+1:0)));updateScreenTargets();updateMolisTargets();}
let caseReturnFocus=null;
function openCase(index){
const c=chapters[index];if(!c)return;if(index===5){go(.98);return;}
const media=caseMedia[index],material=media?.src,caption=media?.caption||'Typographic cover · not a product screenshot';
const primary=c.url?`<a class="project-link" href="${c.url}" target="_blank" rel="noopener noreferrer">${c.url.startsWith('https://t.me/')?'Open in Telegram':'Visit website'} <span>↗</span></a>`:'';
const requestedAt=performance.now();$('#modal').classList.toggle('banner-material',index===1);$('#modal').style.setProperty('--case-accent',c.color);
$('#modalBody').innerHTML=`<div class="case-layout"><figure class="case-visual">${caseVisualHTML(index)}<figcaption>${caption}</figcaption>${index===6?`<div class="case-extra"><img src="assets/molis-website.webp" width="1348" height="926" loading="lazy" decoding="async" alt="MOLIS homepage — actual website screenshot"><p class="note">Actual website screenshot · original language</p></div>`:""}</figure><div class="case-content"><div class="eyebrow">${chapterNumber(index)} / ${c.place.toUpperCase()} · ${c.status}</div><h2 id="caseTitle">${c.name}</h2>${c.history?`<p class="history-note">${c.history}</p>`:''}<p class="case-summary">${c.body}</p><div class="case-actions">${primary}${c.companyUrl?`<a class="secondary-link" href="${c.companyUrl}" target="_blank" rel="noopener noreferrer">Company on LinkedIn ↗</a>`:''}</div>${c.bullets?`<section class="case-section"><h3>My contribution</h3>${c.contributionNote?`<p class="contribution-note">${c.contributionNote}</p>`:''}<ul class="features">${c.bullets.map(b=>`<li>${b}</li>`).join('')}</ul></section>`:''}${c.tags.length?`<section class="case-section"><h3>Tech stack</h3><div>${c.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div></section>`:''}${!c.url&&!c.companyUrl?'<p class="private-note">Private project · no public link available.</p>':''}</div></div>`;
caseReturnFocus=document.activeElement;signalState.velocity=0;setScrollPosition(p);$('#modal').showModal();$('#modal').scrollTop=0;attachCaseMedia(index,requestedAt);
}
$('#progress').innerHTML='<button data-p="0" class="active"><span>00</span> Entrance</button>'+routeOrder.map((id,i)=>{const c=portfolio[id];return `<button data-p="${c.pos}"><span>0${i+1}</span> ${id===5?'Get in touch':c.name}</button>`}).join('');$('.maplinks').innerHTML='<button data-p="0"><span>00</span><b>Entrance</b><span>Room →</span></button>'+routeOrder.map((id,i)=>{const c=portfolio[id];return `<button data-p="${c.pos}"><span>0${i+1}</span><b>${id===5?'Get in touch':c.name}</b><span>${c.place} →</span></button>`}).join('');$('#torch').onclick=()=>{torchOn=!torchOn;$('#torch').setAttribute('aria-pressed',String(torchOn));$('#torch').innerHTML=(torchOn?'Flashlight on':'Flashlight off')+' <span>◉</span>';};addEventListener('pointermove',e=>{aimY=350+e.clientY/h*140});

// Measured CRT glass quad (TL,TR,BR,BL) in plate pixels, plus the plate size.
// The full city is drawn into this quad as vertical strips so it follows the
// tube's slight trapezoid. On scroll the desk AND the city are zoomed by one
// shared transform about the glass centre (drifting to the viewport centre), so
// the city stays locked to the glass — no black tube edges peek through — and the
// trapezoid resolves to a full rectangle once the glass overfills the viewport.
const PLATE_W=1672,PLATE_H=941,GLASS=[[819,254],[1333,214],[1328,627],[814,617]];
// Rounded CRT-glass outline (radius in plate px) so the live city gets soft tube corners.
function glassPath(pts,r){ctx.beginPath();const a=pts[3],b=pts[0];ctx.moveTo((a[0]+b[0])/2,(a[1]+b[1])/2);for(let i=0;i<4;i++){const c=pts[i],n=pts[(i+1)%4];ctx.arcTo(c[0],c[1],(c[0]+n[0])/2,(c[1]+n[1])/2,r);}ctx.closePath();}
function entranceCRT(e){
const mob=w<700,cv=Math.max(w/PLATE_W,h/PLATE_H),iw=PLATE_W*cv,ih=PLATE_H*cv;
let ox=w*.5-1088*cv,oy=(mob?h*.62:h*.46)-437*cv;ox=Math.min(0,Math.max(w-iw,ox));oy=Math.min(0,Math.max(h-ih,oy));
const S=GLASS.map(c=>[ox+c[0]*cv,oy+c[1]*cv]);
const gcx=(S[0][0]+S[1][0]+S[2][0]+S[3][0])/4,gcy=(S[0][1]+S[1][1]+S[2][1]+S[3][1])/4;
const gw=Math.max(S[1][0],S[2][0])-Math.min(S[0][0],S[3][0]),gh=S[3][1]-S[0][1],zb=Math.max(w/gw,h/gh)*1.04,ee=e*e,dz=lerp(1,zb,ee),cx=lerp(gcx,w/2,ee),cy=lerp(gcy,h/2,ee);
ctx.save();ctx.translate(cx,cy);ctx.scale(dz,dz);ctx.translate(-gcx,-gcy);
if(deskImage.complete&&deskImage.naturalWidth){ctx.save();ctx.globalAlpha=clamp(1-(e-.78)/.2);ctx.drawImage(deskImage,ox,oy,iw,ih);ctx.restore();}
ctx.imageSmoothingEnabled=false;const N=mob?36:56;
ctx.save();glassPath(S,4);ctx.clip();
for(let i=0;i<N;i++){const u0=i/N,u1=(i+1)/N,tx0=lerp(S[0][0],S[1][0],u0),ty0=lerp(S[0][1],S[1][1],u0),bx0=lerp(S[3][0],S[2][0],u0),by0=lerp(S[3][1],S[2][1],u0),tx1=lerp(S[0][0],S[1][0],u1),h=by0-ty0,sk=(bx0-tx0)/h;ctx.save();ctx.transform(1,0,sk,1,tx0-sk*ty0,0);ctx.drawImage(scene,u0*1100,0,1100/N,680,0,ty0,tx1-tx0+1,h);ctx.restore();}
ctx.restore();
if(e<.6){ctx.save();glassPath(S,4);ctx.clip();const y0=Math.min(S[0][1],S[1][1]),y1=Math.max(S[2][1],S[3][1]),x0=Math.min(S[0][0],S[3][0]),x1=Math.max(S[1][0],S[2][0]);ctx.fillStyle='#090D162b';for(let s=y0;s<y1;s+=3)ctx.fillRect(x0,s,x1-x0,1);ctx.restore();}
ctx.restore();
const P=S.map(c=>[cx+dz*(c[0]-gcx),cy+dz*(c[1]-gcy)]);
return {x:Math.min(P[0][0],P[3][0]),y:Math.min(P[0][1],P[1][1]),sw:Math.max(P[1][0],P[2][0])-Math.min(P[0][0],P[3][0]),sh:Math.max(P[2][1],P[3][1])-Math.min(P[0][1],P[1][1])};
}
function frame(ms){const t=ms/1000,dt=Math.min(64,ms-(clock||ms));clock=ms;advanceJourney(ms,dt);if(Math.abs(p-last)>.00001){dir=p>last?1:-1;walk+=Math.abs(p-last)*230;}updateMolis(p,ms);warmNearbyCases();updateActor(dt,p-last,t);updateHeroGait(p,dt);updateRoofAction(ms,dt);last=p;if(screenLook&&Math.abs(p-screenLook.progress)>.006){screenLook=null;}if(screenLook&&!screenLook.opened&&ms-screenLook.started>650){screenLook.opened=true;openCase(screenLook.index);}drawJourney(reduced?0:t);ctx.clearRect(0,0,w,h);ctx.fillStyle='#090D16';ctx.fillRect(0,0,w,h);const z=clamp(p/.18),e=z*z*(3-2*z);// Entrance frames the live city inside the CRT; scrolling dives the camera into the screen.
const mobile=w<700,scale=Math.max(w/1100,h/(mobile?780:680)),viewW=w/scale,viewH=h/scale;
let focus=mobile?490:550;
if(mobile&&p>.625){
if(p<.75055)focus=lerp(490,660,ease((p-.625)/.12555));
else if(p<.8461)focus=driveMotion(ease((p-.75055)/.09555)).x;
else if(p<.87795)focus=parkX((p-.8461)/.03185);
else if(p<.90){const a=clamp((p-.87795)/.02205),stop=clamp(a/.5);focus=400+70*(1-(1-stop)**3)+130*ease((a-.84)/.16);}
else focus=p>=.945?roofPath(p).x:p>=.94?lerp(490,450,ease((p-.94)/.005)):lerp(600,490,ease((p-.90)/.035));
}
const sourceW=lerp(1100,viewW,e),sourceH=lerp(680,viewH,e),sourceX=clamp(focus-sourceW/2,0,1100-sourceW),sourceY=(680-sourceH)/2;
if(e>=1){ctx.imageSmoothingEnabled=false;ctx.drawImage(scene,sourceX,sourceY,sourceW,sourceH,0,0,w,h);sceneView={sourceX,sourceY,sourceW,sourceH,x:0,y:0,sw:w,sh:h};}
else{const vb=entranceCRT(e,sourceX,sourceY,sourceW,sourceH);sceneView={sourceX,sourceY,sourceW,sourceH,x:vb.x,y:vb.y,sw:vb.sw,sh:vb.sh};const t=clamp((e-.8)/.2),blend=t*t*(3-2*t);if(blend>0){ctx.save();ctx.globalAlpha=blend;ctx.imageSmoothingEnabled=false;ctx.drawImage(scene,sourceX,sourceY,sourceW,sourceH,0,0,w,h);ctx.restore();}}
updateUI();updateDriveUI();updateFinale(ms);updateUnifiedUI();requestAnimationFrame(frame)}requestAnimationFrame(frame);
function go(v){routeTo(stopIndexFor(v));$('#map').close()}document.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>go(+b.dataset.p));$('#enter').onclick=enterCity;document.querySelectorAll('.close').forEach(b=>b.onclick=()=>b.closest('dialog').close());document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}}));$('#caseBtn').onclick=()=>openCase(active);
let audioCtx,master,on=false;$('#sound').onclick=()=>{if(!audioCtx){audioCtx=new AudioContext();master=audioCtx.createGain();master.gain.value=0;master.connect(audioCtx.destination);[55,82.41,110,164.81].forEach((f,i)=>{const o=audioCtx.createOscillator(),v=audioCtx.createGain();o.type='sine';o.frequency.value=f;v.gain.value=.025/(i+1);o.connect(v);v.connect(master);o.start()});const buffer=audioCtx.createBuffer(1,audioCtx.sampleRate*3,audioCtx.sampleRate),a=buffer.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=(Math.random()*2-1)*.02;const noise=audioCtx.createBufferSource();noise.buffer=buffer;noise.loop=true;const filter=audioCtx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=700;noise.connect(filter);filter.connect(master);noise.start();}audioCtx.resume();on=!on;master.gain.setTargetAtTime(on?1:0,audioCtx.currentTime,.3);$('#sound').innerHTML=on?'Sound on <span>◖</span>':'Sound off <span>◖</span>'};

function updateDriveUI(){const driving=p>=.655&&p<.925;const hud=$('#driveHud');hud.style.display=driving?'block':'none';hud.style.opacity=p>.90?1-ease((p-.90)/.025):ease((p-.659)/.012);$('#torch').style.opacity=driving?.35:1;$('#torch').disabled=driving;if(!driving)return;const v=(p-.655)/.245;const moments=v<.22?['FOCOLOR · IGNITION','Keys to the night.','Settle into the cabriolet. The night road awaits.']:v<.39?['LEAVING THE CITY','Towards the horizon.','The garage lights fade behind us.']:v<.78?['FUJI HIGHWAY','Take the long way.','Open highway. Gentle turns. Mount Fuji on the horizon.']:['NIGHT STOP','Seven minutes to dawn.','Pull in at 7-Eleven. From here, we walk.'];$('#driveLabel').textContent=chapterNumber(3)+' / '+moments[0];$('#driveTitle').textContent=moments[1];$('#driveDesc').textContent=moments[2];$('#driveHud .drive-line i').style.width=(Math.min(1,v)*100)+'%';$('#coords').textContent='FOCOLOR / FUJI NIGHT RUN';$('#hint').textContent='';document.querySelectorAll('#progress button').forEach((b,i)=>b.classList.toggle('active',i===routeOrder.indexOf(3)+1));}
$('#driveCase').onclick=()=>openCase(3);const ride=document.createElement('button');ride.dataset.p='.775';ride.className='route-stop';ride.innerHTML='<span>↳</span><b>Fuji Highway</b><span>Focolor route →</span>';ride.onclick=()=>go(.775);$('.maplinks').children[5].after(ride);

const screenButtons=portfolio.slice(0,5).map((c,index)=>{const b=document.createElement('button');b.className='screen-hit';b.dataset.case=index;b.setAttribute('aria-label',c.name+' — View case study');b.title=c.name+' / View case study';b.onpointerenter=b.onfocus=()=>screenHover=index;b.onpointerleave=b.onblur=()=>{if(screenHover===index)screenHover=-1};b.onclick=()=>openCase(index);$('#screenTargets').append(b);return b;});
function updateScreenTargets(){if(!sceneView)return;
// Boarding keeps the garage visible at a fixed city-camera position.
const garage=p>=.655&&p<.655+.245*.22;
const v=sceneView,renderProgress=garage?.68:cityProgress(p),cam=clamp((renderProgress-.15)/.85)*3900+actor.camera;
const city=(streetVisible()&&p<.94)||garage;
screenButtons.forEach((b,i)=>{const area=i===0?durianoScreenBounds():i===1?fundraislyScreenBounds():{x:340,y:363,w:110,h:83};const sx=portfolio[i].x+area.x-cam,sy=area.y,left=v.x+(sx-v.sourceX)*v.sw/v.sourceW,top=v.y+(sy-v.sourceY)*v.sh/v.sourceH,bw=area.w*v.sw/v.sourceW,bh=area.h*v.sh/v.sourceH;const visible=city&&(!garage||i===3)&&left+bw>0&&left<w&&top+bh>0&&top<h;b.hidden=!visible;b.style.left=left+'px';b.style.top=top+'px';b.style.width=bw+'px';b.style.height=bh+'px';b.disabled=!!screenLook;});}


$('#modal').addEventListener('close',()=>{screenLook=null;screenHover=-1;const el=caseReturnFocus;caseReturnFocus=null;if(el?.isConnected&&!el.hidden)el.focus({preventScroll:true});else $('#caseBtn').focus({preventScroll:true});});

initFinale();initCaseWarmup();initUnifiedUI();
$('#modal').addEventListener('keydown',trapCaseFocus);

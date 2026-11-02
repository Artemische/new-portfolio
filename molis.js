const molisPhoto=new Image();molisPhoto.decoding='async';
const molisTerminalInteraction={hover:false,focus:false};
// Visit-scoped power state. Navigation never rewinds a completed restoration.
const molisState={entered:false,restored:false,start:null,power:0,outageAt:null,pending:null,action:null,actorX:null,hand:0,direction:1};
function restoreMolis(instant=false){if(molisState.restored)return;molisState.pending=null;molisState.restored=true;molisState.start=performance.now();if(instant||reduced)molisState.power=1;}
function requestMolisPower(){if(reduced){restoreMolis(true);return;}if(molisState.restored||molisState.action)return;const world=cityCamera(p)+440-actor.camera,dest=molisBounds().x+17*molisBounds().k-43;molisState.action={start:performance.now(),from:world,to:dest,duration:Math.max(220,Math.abs(dest-world)/.22),progress:p};molisState.hand=0;}
function updateMolis(progress,ms){const inZone=molisZone(progress);if(inZone&&!molisPhoto.src)molisPhoto.src='assets/molis-thumb.webp';if(inZone&&!molisState.entered){molisState.entered=true;molisState.outageAt=ms;}
const action=molisState.action;if(action){if(Math.abs(progress-action.progress)>.008||signalState.active){molisState.action=null;molisState.actorX=null;molisState.hand=0;if(!molisState.restored)molisState.pending=ms;}else{const elapsed=ms-action.start,q=clamp(elapsed/action.duration);molisState.actorX=lerp(action.from,action.to,q);molisState.direction=q<1?Math.sign(action.to-action.from)||1:1;molisState.hand=clamp((elapsed-action.duration)/240);if(elapsed>action.duration+240)restoreMolis();if(elapsed>action.duration+620){molisState.hand=1-clamp((elapsed-action.duration-620)/250);if(elapsed>action.duration+870){const home=cityCamera(progress)+440-actor.camera,back=clamp((elapsed-action.duration-870)/Math.max(220,Math.abs(home-action.to)/.22));molisState.actorX=lerp(action.to,home,back);molisState.direction=Math.sign(home-action.to)||1;if(back>=1){molisState.action=null;molisState.actorX=null;molisState.hand=0;}}}}}
if((molisState.entered&&!inZone)||progress>.60){if(!molisState.entered)restoreMolis(true);else if(!molisState.restored&&!molisState.pending)molisState.pending=ms;}
if(molisState.pending&&ms-molisState.pending>300)restoreMolis();if(molisState.restored&&molisState.power<1)molisState.power=reduced?1:clamp((ms-molisState.start)/1400);}
function molisStatus(){return !molisState.restored?'POWER OUTAGE':molisState.power<1?'RESTORING POWER':'LIGHT RESTORED';}
function molisBlackout(progress){return molisZone(progress)&&molisState.power<.65;}
function molisBounds(){return {k:w<700?.78:1,x:w<700?1735:1805,y:515};}
function molisLevels(){const dip=molisState.outageAt===null?1:1-ease(clamp((performance.now()-molisState.outageAt)/260));const power=molisState.restored?molisState.power:molisState.entered?dip:1;return [ease((power-.06)/.27),ease((power-.28)/.30),ease((power-.54)/.46)];}
function mAlpha(a,draw){g.save();g.globalAlpha=a;draw();g.restore();}
// Quantized shading, in the same one-pixel grid as the architecture.
function mGlobe(x,y,r,on){for(let yy=-r;yy<=r;yy++){const extent=Math.floor(Math.sqrt(r*r-yy*yy));for(let xx=-extent;xx<=extent;xx++){const d=Math.hypot(xx+2,yy+3)/r;const shade=Math.min(3,Math.floor(d*2.4)),cold=[[154,171,174],[101,118,130],[62,78,92],[38,52,65]][shade],warm=[[255,244,209],[234,208,156],[197,154,94],[129,99,68]][shade];rect(x+xx,y+yy,1,1,'rgb('+cold.map((v,i)=>Math.round(v+(warm[i]-v)*on)).join(',')+')');}}mAlpha(on,()=>{glow(x,y,r*2.3,'#f6c87836');rect(x-3,y-4,3,2,'#fff3d2');});}
function mPlinth(x,y,ww,hh,depth){poly([[x,y],[x+depth,y-8],[x+ww+depth,y-8],[x+ww,y]],'#63706e');rect(x,y,ww,hh,'#3e494c');poly([[x+ww,y],[x+ww+depth,y-8],[x+ww+depth,y+hh-8],[x+ww,y+hh]],'#263138');line(x,y,x+ww,y,'#9b9f8c');for(let i=0;i<50;i++){const xx=x+(i*17)%ww,yy=y+(i*13)%hh;rect(xx,yy,i%3+1,1,i%2?'#82908728':'#0c192a38');}poly([[x-5,y+hh],[x+ww,y+hh],[x+ww+depth+12,y+hh-4],[x+12,y+hh-6]],'#020914a0');}
function molisShop(t){const {k,x}=molisBounds(),[table,pendants,main]=molisLevels();
g.save();g.translate(x,515);g.scale(k,k);g.translate(0,-515);
// Dressed stone facade, thin mortar, rain streaks and steel cornice.
rect(0,242,410,273,'#23313c');poly([[410,242],[429,254],[429,515],[410,515]],'#0b1723');
for(let yy=246;yy<515;yy+=19)for(let xx=(yy%38?0:-27);xx<410;xx+=54){rect(xx,yy,52,17,'#27353e');rect(xx,yy,52,1,'#56616a40');for(let j=0;j<7;j++)rect(xx+(j*19)%50,yy+2+(j*7)%14,2,1,'#96a0a51c');}
for(let i=0;i<20;i++)rect(4+i*21,247+(i*17)%48,1,24+i%9,'#07152145');
rect(-7,237,425,7,'#59626a');rect(-4,244,419,4,'#0a1621');rect(10,507,399,8,'#121d28');rect(8,505,402,2,'#59656b');
// A deep display bay: back wall, two returns, ceiling and receding tiled floor.
rect(31,321,298,181,'#050d17');rect(63,342,234,120,'#202932');
poly([[33,323],[63,342],[63,461],[33,498]],'#303d46');poly([[297,342],[327,323],[327,498],[297,461]],'#111d29');
poly([[33,323],[327,323],[297,342],[63,342]],'#18232d');poly([[33,498],[327,498],[297,461],[63,461]],'#38434a');
for(let xx=65;xx<297;xx+=47){rect(xx,344,1,116,'#080f19');rect(xx+2,344,1,114,'#69727627');}
for(let i=0;i<8;i++)line(33+i*42,498,63+i*33,461,'#07121b66');for(const yy of [467,476,488])line(34,yy,325,yy,'#101b2666');
rect(63,342,234,7,'#02091255');rect(63,451,234,10,'#0b142090');
// A rear doorway and shelving create a second depth plane.
rect(71,360,37,93,'#101a25');rect(75,364,28,84,'#26323b');rect(78,366,23,78,'#17232e');rect(98,407,2,6,'#64746e');
rect(229,412,67,3,'#84755d');rect(230,415,66,4,'#040d18');rect(233,437,63,3,'#736750');rect(235,440,61,4,'#030c15');
for(let j=0;j<3;j++){const xx=235+j*21;rect(xx,399,13,13,'#555950');rect(xx+2,400,9,10,'#aaa18a');rect(xx+5,403,3,4,'#4b4c43');rect(xx+1,425,10,12,'#5c655f');rect(xx+3,427,6,7,'#b4ad97');rect(xx+5,429,2,3,'#42493f');}
// Local light washes remain inside the room, leaving corners dark.
g.save();g.beginPath();g.rect(34,324,292,174);g.clip();mAlpha(table,()=>{glow(91,439,61,'#dea65b85');glow(66,451,44,'#efb96c2a');});mAlpha(pendants,()=>{glow(267,419,67,'#edba6a70');});mAlpha(main,()=>{glow(164,372,81,'#dfad5d70');glow(178,449,65,'#e9b97025');});g.restore();
// Three separate display levels with visible top and side faces.
mPlinth(70,465,52,29,10);mPlinth(145,476,71,18,14);mPlinth(258,458,34,32,10);
mAlpha(table,()=>{poly([[70,465],[80,457],[132,457],[122,465]],'#dfb87555');poly([[70,465],[122,465],[122,491],[70,491]],'#c3954d20');});mAlpha(main,()=>{poly([[145,476],[159,468],[230,468],[216,476]],'#d9b56d4a');});mAlpha(pendants,()=>{poly([[258,458],[268,450],[302,450],[292,458]],'#e2be795a');});
// Small ceramic vessel and an angled sample board on the central plinth.
poly([[162,472],[164,456],[175,456],[179,472]],'#647574');rect(166,453,7,3,'#9aa095');rect(166,458,3,12,'#98a49a');poly([[188,470],[190,452],[205,452],[207,470]],'#0b1722');poly([[191,467],[193,455],[202,455],[204,467]],'#8c8772');
// Pleated table lamp: brass base, stem, faceted shade and underside.
rect(88,459,17,3,'#1a1c20');rect(90,457,13,2,'#9c8455');rect(95,433,3,25,'#a98b53');rect(96,436,1,19,'#debd7c');
poly([[85,416],[108,416],[118,436],[75,436]],'#6b716c');for(let j=0;j<18;j++){const xx=77+j*2;line(87+(xx-87)*.53,417,xx,435,j%2?'#b3ae91':'#737765');}rect(76,436,41,2,'#353e3e');
mAlpha(table,()=>{poly([[85,416],[108,416],[117,435],[76,435]],'#f3d6a096');rect(78,435,37,2,'#ffe0a5');glow(96,438,26,'#f4c57344');line(71,465,122,465,'#d4b47d');poly([[80,439],[110,439],[119,465],[73,465]],'#f9cd7821');});
// Pendants: ribbed glass, a shallow metal saucer and a smaller ceramic cone.
for(const [xx,yy,kind] of [[238,385,0],[275,407,1],[300,371,2]]){rect(xx-4,324,8,3,'#5c625a');line(xx,328,xx,yy-12,'#8f8061');rect(xx-2,yy-14,4,5,'#a68b57');
if(kind===0){for(let z=-11;z<=11;z++){const hh=Math.round(Math.sqrt(121-z*z));rect(xx+z,yy-hh,1,hh*2,z%3?'#75817b':'#a8aa8a');}mAlpha(pendants,()=>{for(let z=-10;z<=10;z+=2){const hh=Math.round(Math.sqrt(100-z*z));rect(xx+z,yy-hh,1,hh*2,z%4?'#cda66b':'#f2d49b');}glow(xx,yy,26,'#ebbc7540');});}
else{poly([[xx-3,yy-12],[xx+3,yy-12],[xx+(kind===1?19:10),yy+3],[xx-(kind===1?19:10),yy+3]],kind===1?'#526369':'#a68b68');line(xx,yy-10,xx+6,yy+1,'#b8ae8a');rect(xx-(kind===1?18:9),yy+3,kind===1?36:18,2,'#1a2830');mAlpha(pendants,()=>{rect(xx-(kind===1?17:8),yy+3,kind===1?34:16,1,'#ffe0a3');glow(xx,yy+7,34,'#f2bd6749');});}}
// Chandelier: ceiling rose, linked suspension, spindle, curved brass arms and opal globes.
rect(153,324,22,3,'#83734f');rect(158,327,12,3,'#b09b6a');for(let yy=331;yy<360;yy+=5){rect(163,yy,3,4,'#8f7950');rect(164,yy,1,2,'#d4bd84');}rect(161,359,7,25,'#91794c');rect(162,359,2,25,'#c5a86d');
for(const [xx,yy] of [[127,378],[143,366],[185,366],[204,378],[166,388]]){g.strokeStyle='#211d1a';g.lineWidth=4;g.beginPath();g.moveTo(164,387);g.bezierCurveTo(xx,411,xx-2,398,xx,yy+8);g.stroke();g.strokeStyle='#a48a58';g.lineWidth=2;g.stroke();rect(xx-5,yy+8,10,3,'#b39964');mGlobe(xx,yy,9,main);}
rect(158,387,13,4,'#796243');rect(161,391,7,4,'#b2945d');rect(163,395,3,5,'#857049');
// Structural shadows and warm spill on the returns, sill and lower masonry.
rect(31,319,298,5,'#6c7b80');rect(34,324,292,4,'#010912a0');for(const xx of [31,218,325]){rect(xx,323,4,181,'#4a5b65');rect(xx+4,328,3,172,'#00091670');rect(xx+1,325,1,172,'#80938c55');}
mAlpha(main*.7+table*.3,()=>{line(35,332,35,498,'#c9a16a',2);line(37,499,324,499,'#dfb77a',2);rect(33,505,295,2,'#bf97665c');glow(174,513,105,'#d8aa5c38');poly([[34,489],[326,489],[326,513],[34,513]],'#d7a46018');line(39,508,323,508,'#b48b5544',2);});rect(30,501,300,4,'#263947');
// Glass: sparse skyline fragments, no full-window veil.
poly([[49,334],[52,334],[78,387],[75,387]],'#bfdae00d');rect(284,347,8,34,'#adcbd10c');rect(291,355,7,4,'#b8cfda0b');line(187,338,201,365,'#b0c9cd12');
rect(22,263,386,48,'#08121c');rect(25,266,380,41,'#1b2a32');rect(28,268,374,1,'#566466');rect(29,304,371,1,'#080f17');g.font='24px Georgia,serif';g.fillStyle=main>.4?'#efd4a3':'#77898d';g.fillText('M O L I S',130,296);mAlpha(main,()=>{glow(165,289,94,'#e7bd6d16');line(30,306,399,306,'#a8906544');});
// Built-in terminal: double-depth bezel and a designed editorial lighting card.
rect(337,320,89,185,'#030b14');poly([[419,324],[427,320],[427,502],[419,507]],'#596267');rect(341,324,78,176,'#637078');rect(344,327,72,170,'#0b1923');rect(348,331,64,157,'#182832');text('MOLIS',360,348,12,'#e5c99f');line(354,356,390,356,'#6f6d5c');
g.save();g.globalAlpha=.24+.76*main;if(molisPhoto.complete&&molisPhoto.naturalWidth){g.imageSmoothingEnabled=true;g.drawImage(molisPhoto,molisPhoto.naturalWidth*.42,0,molisPhoto.naturalWidth*.58,molisPhoto.naturalHeight,347,369,68,69);g.imageSmoothingEnabled=false;poly([[349,371],[355,371],[374,436],[369,436]],'#bbd9e418');}text('LIGHT / SPACE',351,453,7,'#a6b4ae');g.restore();
// Terminal lettering and focus light belong to the world, behind the pedestrian.
rect(345,464,70,29,'#24353c');line(350,465,410,465,'#b79c6b');
g.save();g.textAlign='center';text('View case study',380,478,8,'#f1d6ae');text('→',380,489,10,'#f1d6ae');g.restore();
if(molisTerminalInteraction.hover||molisTerminalInteraction.focus){g.save();g.strokeStyle='#e1bd7e';g.lineWidth=1.5;g.strokeRect(337,320,89,185);glow(380,415,72,'#e2bb7818');g.restore();}
// Reachable closed circuit panel. Amber relay pulses precede automatic restoration.
line(16,321,16,398,'#0b151e',3);rect(3,398,28,39,'#060d16');rect(5,400,24,35,'#647079');rect(7,402,20,31,'#26343f');for(const yy of [404,430]){rect(8,yy,2,1,'#a8b0a3');rect(25,yy,2,1,'#a8b0a3');}const responding=molisState.action||molisState.pending||molisState.restored;rect(11,406,12,4,'#111d25');rect(13,407,8,2,molisState.restored?'#b3df8c':responding?'#efc58a':'#806b50');glow(17,409,responding?18:9,molisState.restored?'#b3df8c35':'#d8ab5740');rect(11,416,12,12,'#101a24');rect(13,417,8,8,'#b6a37a');rect(14,418,6,2,'#e4cda0');text('AUTO RESET',3,446,5,'#82909a');
if(responding&&!molisState.restored){g.save();g.globalAlpha=.25+.25*Math.sin(t*4);line(17,399,17,317,'#edc58b',2);line(17,317,96,317,'#edc58b',2);g.restore();}
// Source-aligned puddles: deterministic irregular clusters and black gaps.
for(const [sx,level,seed] of [[96,table,2],[164,main,5],[238,pendants,9],[282,pendants,13]]){mAlpha(level,()=>{for(let j=0;j<30;j++){const yy=519+(j*19+seed*7)%76,dist=(yy-515)/90,xx=sx+Math.sin(j*7.31+seed)*(8+dist*22),ww=3+(j*13%17)*(1-dist*.55);g.globalAlpha=level*(.13+(j%5)*.055)*(1-dist);rect(xx,yy,ww,j%7===0?3:1,j%3?'#d8a466':'#f2d29a');}});}
g.restore();}
const molisHeroCanvas=document.createElement('canvas');molisHeroCanvas.width=160;molisHeroCanvas.height=180;
function molisGirl(x,y,lit){const strength=molisLevels().reduce((a,b)=>a+b,0)/3;if(!molisZone(p)){girl(x,y,lit);return;}const c=molisHeroCanvas.getContext('2d');c.clearRect(0,0,160,180);const previousDir=dir;if(molisState.action)dir=molisState.direction;girl(70,112,lit,c);dir=previousDir;if(molisState.hand>.05)c.clearRect(46,62,18,37);c.save();c.globalCompositeOperation='source-atop';const light=c.createLinearGradient(42,0,108,0);light.addColorStop(0,'#eeb36b00');light.addColorStop(1,'#eeb36b70');c.globalAlpha=strength*.65;c.fillStyle=light;c.fillRect(0,0,160,180);c.restore();g.drawImage(molisHeroCanvas,Math.round(x)-70,Math.round(y)-112);drawMolisHand(x,y);}
let molisTargets;
function updateMolisTargets(){if(active===6)$('#chapterNum').textContent='03 / MOLIS / '+molisStatus();if(!sceneView)return;if(!molisTargets){molisTargets=['MOLIS — View case study','Restore the lights'].map((label,i)=>{const b=document.createElement('button');b.className='screen-hit molis-hit '+(i?'molis-power':'molis-case');b.setAttribute('aria-label',label);b.onclick=()=>i?requestMolisPower():openCase(6);b.innerHTML=i?'<span>Restore the lights</span>':'';if(!i){b.dataset.case='6';b.onpointerenter=()=>molisTerminalInteraction.hover=true;b.onpointerleave=()=>molisTerminalInteraction.hover=false;b.onfocus=()=>molisTerminalInteraction.focus=true;b.onblur=()=>molisTerminalInteraction.focus=false;}$('#screenTargets').append(b);return b;});}
const v=sceneView,{k,x}=molisBounds(),cam=clamp((cityProgress(p)-.15)/.85)*3900+actor.camera;
[[337,320,89,185],[0,394,34,47]].forEach((q,i)=>{const b=molisTargets[i],left=v.x+(x+q[0]*k-cam-v.sourceX)*v.sw/v.sourceW,top=v.y+(515+(q[1]-515)*k-v.sourceY)*v.sh/v.sourceH;b.style.left=left+'px';b.style.top=top+'px';b.style.width=q[2]*k*v.sw/v.sourceW+'px';b.style.height=q[3]*k*v.sh/v.sourceH+'px';b.hidden=!streetVisible()||left>w||left+q[2]*k*v.sw/v.sourceW<0||(i===1&&(molisState.restored||!molisZone(p)));});}

function drawMolisHand(x,y){if(!molisState.hand||heroFrames.length!==8)return;const k=molisBounds().k,px=molisBounds().x+17*k-cityCamera(p),py=515+(422-515)*k,u=ease(molisState.hand);
// The free near arm presses the switch. The other hand keeps the torch.
const shoulder={x:x-13,y:y-66},elbow={x:lerp(x-23,px-29,u),y:lerp(y-37,py+15,u)},hand={x:lerp(x-22,px,u),y:lerp(y-19,py,u)},art=heroFrames[6];
heroLimb(g,art,[30,43,18,25],shoulder,elbow,17);
heroLimb(g,art,[29,66,17,21],elbow,hand,15);
g.drawImage(art,30,85,12,13,Math.round(hand.x-5),Math.round(hand.y-5),12,13);
}

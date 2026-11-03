// Platinum heroine: six distance-driven walk poses, idle, and existing back-facing interaction.
const heroAtlas=new Image(),heroFrames=[],heroDarkFrames=[];
const heroFrameMeta=[{"x": 0, "y": 0, "top": 26, "bottom": 490, "anchor": 204.0}, {"x": 384, "y": 0, "top": 26, "bottom": 491, "anchor": 202.5}, {"x": 768, "y": 0, "top": 26, "bottom": 491, "anchor": 179.5}, {"x": 1152, "y": 0, "top": 26, "bottom": 492, "anchor": 179.0}, {"x": 0, "y": 512, "top": 9, "bottom": 468, "anchor": 204.5}, {"x": 384, "y": 512, "top": 11, "bottom": 468, "anchor": 211.0}, {"x": 768, "y": 512, "top": 9, "bottom": 471, "anchor": 176.5}, {"x": 1152, "y": 512, "top": 10, "bottom": 471, "anchor": 180.5}];
heroAtlas.onload=()=>{for(const m of heroFrameMeta){const frame=document.createElement('canvas');frame.width=128;frame.height=160;const c=frame.getContext('2d');c.imageSmoothingEnabled=false;const scale=144/(m.bottom-m.top);c.drawImage(heroAtlas,m.x,m.y,384,512,Math.round(52-m.anchor*scale),Math.round(10-m.top*scale),Math.round(384*scale),Math.round(512*scale));heroFrames.push(frame);const dark=document.createElement('canvas');dark.width=128;dark.height=160;const dc=dark.getContext('2d');dc.drawImage(frame,0,0);dc.globalCompositeOperation='source-atop';dc.fillStyle='#071323aa';dc.fillRect(0,0,128,160);heroDarkFrames.push(dark);}};
heroAtlas.src='assets/hero-platinum-sheet.png';
// Animation follows character displacement, including the boarding/arrival paths.
const heroGait={distance:0,position:0,section:'',rest:1000,moving:false};
function heroPath(progress){
if(molisState.actorX!==null&&progress<.60)return {section:"street",position:molisState.actorX-440};
if(progress>=.94&&progress<.945)return {section:'roof-approach',position:roofApproach(progress).distance};
if(progress>=.945)return {section:'roof',position:roofPath(progress).distance};
if(progress>=.90&&progress<.9175)return {section:'arrival',position:187+arrivalBeyond(progress)};
if(progress<.655||progress>=.90)return {section:'street',position:Math.max(0,Math.min(1,(cityProgress(progress)-.15)/.85))*3900};
const v=(progress-.655)/.245;
if(v<.22){const a=v/.22;return {section:'boarding',position:boardingPoint(progress).x-440}}
if(v>=.91){const arrival=.7+(v-.91)/.09*.3;return {section:'arrival',position:187*leadIn(((arrival-.7)/.3-.84)/.16)}}
return {section:'car',position:0};}
function updateHeroGait(progress,dt){const current=heroPath(progress);const distance=current.section===heroGait.section?Math.abs(current.position-heroGait.position):0;
heroGait.position=current.position;heroGait.section=current.section;
// Steer the stride so a scripted walk ends on a feet-under-hips frame, never mid-lunge.
const finish={'roof-approach':roofApproach(1).distance,roof:roofPath(.98).distance,boarding:boardingPoint(progress).seat-440}[current.section];
if(finish!==undefined){const left=finish-current.position,want=Math.round((heroGait.distance+left-62.5)/75)*75+62.5-left;heroGait.distance+=(want-heroGait.distance)*.1;}
if(distance>.015&&current.section!=='car'){heroGait.distance+=distance;heroGait.rest=0;}else heroGait.rest+=dt;
heroGait.moving=current.section!=='car'&&heroGait.rest<130;}
function girl(x,y,lit,drawContext=g){const g=drawContext;if(heroFrames.length!==8)return;
const roofResting=typeof roofState!=='undefined'&&p>=.945&&roofState.facingCity;
const looking=roofResting||(screenLook&&performance.now()-screenLook.started>120);
const moving=!looking&&heroGait.moving;
const frames=lit?heroFrames:heroDarkFrames,idle=frames[6];
// Contact → passing → feet under hips, then the opposite leg. No repeated contact poses.
const cycle=[0,1,6,5,4,6],phase=Math.floor(heroGait.distance/25)%cycle.length;
g.save();g.translate(Math.round(x),Math.round(y));g.scale(looking?1:dir,1);g.imageSmoothingEnabled=false;
if(looking){g.drawImage(frames[7],-52,-106);}
else if(moving){
// Hip stays joined to the legs; weight shift tapers from shoulders to waist.
const legs=frames[cycle[phase]];
g.drawImage(legs,0,92,128,68,Math.round(-52*.72),-14,Math.round(128*.72),68);
const stride=heroGait.distance/150*Math.PI*2;
const sway=reduced?0:Math.sin(stride)*1.6;
const lift=reduced?0:Math.round((1-Math.cos(stride*2))*.5);
for(let row=0;row<92;row++){
const weight=Math.max(0,1-row/92),shift=Math.round(sway*weight);
const rise=Math.round(lift*weight);
const nextRise=Math.round(lift*Math.max(0,1-(row+1)/92));
g.drawImage(idle,0,row,128,1,-52+shift,-106+row-rise,128,1+rise-nextRise);
}
}else if(!reduced){const breath=Math.round(Math.sin(actor.time*1.65)*.55),hair=Math.round(Math.sin(actor.time*1.1)*.55);
g.drawImage(idle,0,0,128,40,-52+hair,-106+breath,128,40);
g.drawImage(idle,0,40,128,52,-52,-66+breath,128,52);
g.drawImage(idle,0,92,128,68,Math.round(-52*.72),-14,Math.round(128*.72),68);
}else{g.drawImage(idle,0,92,128,68,Math.round(-52*.72),-14,Math.round(128*.72),68);g.drawImage(idle,0,0,128,92,-52,-106,128,92);}
g.restore();}

// Dedicated sitting artwork, independent of every pedestrian frame.
const driverAtlas=new Image();
driverAtlas.src='assets/hero-driving-sheet.png';
const driverViews={side:{x:100,y:36,w:570,h:604,head:145},rear:{x:790,y:36,w:510,h:604,head:180},quarter:{x:1450,y:36,w:555,h:604,head:170}};
let hideDriver=false;
// x is the centre of the head / seat axis, y is the crown. All views share scale.
function seatedHero(x,y,height,view='side',mirror=false){
if(hideDriver||!driverAtlas.complete||!driverAtlas.naturalWidth)return;
const m=driverViews[view],scale=height/m.h;
g.save();g.translate(x,y);g.scale(mirror?-1:1,1);g.imageSmoothingEnabled=false;
g.drawImage(driverAtlas,m.x,m.y,m.w,m.h,-m.head*scale,0,m.w*scale,height);g.restore();
}

// Reversible crouch-to-seat transfer. No clipping, fading, or whole-body shrinking.
// Torso keeps its drawing scale while knees bend, with feet fixed on the far-side road.
function carTransferHero(carX,carY,carScale,amount){
if(hideDriver||heroFrames.length!==8)return;
const q=normalizedBMW(0,90,33),seatX=carX+(q.left+q.w*q.seat)*carScale;
const seatY=carY+(q.top+q.height*q.crown)*carScale,standY=carY-33;
const crown=standY-96,foldEnd=crown+48;
if(amount<.65){const bend=ease(amount/.65),hipDrop=48*bend,idle=heroFrames[6];
g.save();g.imageSmoothingEnabled=false;
g.drawImage(idle,0,0,128,92,Math.round(seatX-52),Math.round(standY-106+hipDrop),128,92);
// All leg pixels remain present. Folding takes place behind the opaque bodywork.
g.drawImage(idle,0,92,128,68,Math.round(seatX-52*.72),Math.round(standY-14+hipDrop),Math.round(128*.72),68-hipDrop);
g.restore();
}else{const settle=ease((amount-.65)/.35);seatedHero(seatX,lerp(foldEnd,seatY,settle),lerp(70,41*carScale,settle),'side');}
}

// Articulated limbs retain the original cloth, seams and pixel highlights.
function heroLimb(context,source,box,a,b,width){
const dx=b.x-a.x,dy=b.y-a.y,length=Math.hypot(dx,dy);
context.save();context.imageSmoothingEnabled=false;context.translate(Math.round(a.x),Math.round(a.y));context.rotate(Math.atan2(dy,dx)-Math.PI/2);
context.drawImage(source,box[0],box[1],box[2],box[3],-width/2,-2,width,length+4);context.restore();
}

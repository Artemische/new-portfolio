// A scroll-directed interlude. Every car pose and tyre mark is derived from progress.
let boardingScene=false;
const ease=v=>{v=Math.max(0,Math.min(1,v));return v*v*(3-2*v)};
// Half eases with unit slope at the join, so a moving leg hands over without a speed step.
const leadOut=v=>{v=Math.max(0,Math.min(1,v));return v+v*v-v*v*v},leadIn=v=>1-leadOut(1-v);
function cityProgress(v){if(v<.60)return v;if(v<.655)return .60+(v-.60)/.055*.08;if(v<.90)return .68;if(v<.96)return .745+ease((v-.90)/.06)*.14;return .885+(v-.96)/.04*.115}
function sideCar(x,y,scale=1,boarding=0,lights=true,occupant=1){bmwSide(x,y,scale,lights,occupant)}
function fujiSky(v){rect(0,0,1100,680,'#091320');const sky=g.createLinearGradient(0,0,0,450);sky.addColorStop(0,'#07101e');sky.addColorStop(.7,'#17283b');sky.addColorStop(1,'#454151');g.fillStyle=sky;g.fillRect(0,0,1100,460);round(838,119,35,'#c9d2c1');glow(838,119,100,'#c9e2c120');for(let i=0;i<65;i++)rect((i*137)%1100,(i*37)%220,1,1,'#c1c9c46b');const fx=730-v*70;
poly([[fx-460,405],[fx-320,325],[fx-230,265],[fx-130,204],[fx-25,113],[fx,98],[fx+22,114],[fx+130,226],[fx+280,329],[fx+440,405]],'#25354a');poly([[fx-127,204],[fx-25,113],[fx,98],[fx+22,114],[fx+117,212],[fx+70,193],[fx+48,204],[fx+14,167],[fx-4,190],[fx-29,165],[fx-56,195],[fx-78,184]],'#9eabb5');poly([[fx,111],[fx+22,114],[fx+117,212],[fx+68,185],[fx+15,155]],'#637a90');poly([[0,378],[170,298],[267,352],[394,304],[523,383],[701,332],[857,363],[1100,297],[1100,465],[0,465]],'#142b39');rect(0,414,1100,104,'#18313b');for(let i=0;i<60;i++)rect((i*73-v*150+2200)%1100,420+(i*11)%85,30+(i%9)*8,1,'#83939620');for(let i=0;i<55;i++){let x=(i*33-v*100+2200)%1100;rect(x,398+(i%3)*4,2,2,['#c4b08c','#a0bba5','#9e819d'][i%3]);}glow(600,400,450,'#d9b8a214');}
function sevenStore(x,y,scale=1){g.save();g.translate(x,y);g.scale(scale,scale);rect(0,0,420,218,'#c3c6ad');rect(-12,-9,444,17,'#d4d6bc');rect(0,14,420,10,'#d97540');rect(0,24,420,8,'#f4e9bd');rect(0,32,420,11,'#26735a');rect(0,43,420,7,'#d4d9bc');for(let i=0;i<4;i++){rect(15+i*100,66,90,136,'#253941');rect(20+i*100,71,80,126,'#7d9d91');for(let j=0;j<3;j++){rect(25+i*100,100+j*27,70,3,'#475f56');for(let k=0;k<7;k++)rect(28+i*100+k*9,86+j*27,5,12,['#e1ce9f','#a0b3a4','#d39377'][j]);}rect(15+i*100,66,3,136,'#ccd3b9');}rect(192,68,5,134,'#cdd6c4');rect(204,125,3,22,'#d5d9be');rect(174,-4,76,64,'#e4e6cc');text('7',194,35,42,'#d3683a');text('ELEVEN',181,51,12,'#337657');glow(210,139,240,'#c6e5b52b');rect(5,211,410,7,'#6d7b73');g.restore()}
function sevenBackground(){if(sevenImage.complete&&sevenImage.naturalWidth){g.drawImage(sevenImage,0,0,1100,680);rect(0,0,1100,680,'#050e1928');}else{fujiSky(.8);sevenStore(570,262,.95);}for(let i=0;i<5;i++)line(560+i*105,513,520+i*105,610,'#8a9d9455');text('NEXT / SERVER ROOM',755,500,12,'#bdd89c');rect(745,481,8,23,'#b8d29b');}
// Exterior actors are always drawn before the unchanged, alpha-transparent car.
function farSidePedestrian(x,y,freeze=false){const moving=heroGait.moving;if(freeze)heroGait.moving=false;girl(x,y,true);heroGait.moving=moving;}
// She keeps walking out of frame into the fade instead of treading on the spot.
const arrivalBeyond=progress=>clamp((progress-.90)/.0175)*150;
// The car holds its line until the cut, then rolls in nose-first at the speed the brake curve starts from.
function parkX(a){return a<.5?driveMotion(1).x:400-160*(2-2*a);}
function arrival(v,t,beyond=0){
sevenBackground();const a=clamp((v-.7)/.3),stop=clamp(a/.5),carx=400+70*(1-(1-stop)**3),exiting=a>=.70;
const walkout=leadIn((a-.84)/.16),old=dir;
if(exiting&&a<.84)carTransferHero(carx,564,1.1,1-clamp((a-.70)/.125));
else if(exiting)farSidePedestrian(lerp(453,640,walkout)+beyond,531);
bmwBrake=a>.10?ease((a-.10)/.12)*(1-ease((a-.74)/.1)):0;sideCar(carx,564,1.1,0,true,exiting?0:1);bmwBrake=0;
dir=old;
}
// Yaw around the vertical axis. Height never rotates into the road plane.
function carPoint(x,z,height,steer){const a=steer*40*Math.PI/180,c=Math.cos(a),sn=Math.sin(a);return [x*c+z*sn,(z*c-x*sn)*.48-height*.90+5]}
function rearCar(x,y,scale=1,steer=0){bmwRear(x,y,scale,steer)}
function horizonSky(v){rect(0,0,1100,680,'#090e1c');const sky=g.createLinearGradient(0,0,0,325);sky.addColorStop(0,'#090e1e');sky.addColorStop(.65,'#252034');sky.addColorStop(1,'#674055');g.fillStyle=sky;g.fillRect(0,0,1100,330);
for(let i=0;i<65;i++)rect((i*137)%1100,(i*47)%210,1,1,'#c7b1c450');
// Striped dusk disc from the reference, softened behind Mount Fuji.
const sx=755,sy=155;glow(sx,sy,210,'#f7897330');g.save();g.beginPath();g.arc(sx,sy,99,0,Math.PI*2);g.clip();const sun=g.createLinearGradient(0,55,0,260);sun.addColorStop(0,'#dcca9d');sun.addColorStop(.5,'#d1977d');sun.addColorStop(1,'#9d526a');g.fillStyle=sun;g.fillRect(sx-100,sy-100,200,200);for(let yy=155;yy<260;yy+=13)rect(sx-100,yy,200,4+(yy-155)/24,'#322039');g.restore();
const fx=675+Math.sin(v*3)*8;poly([[fx-355,302],[fx-230,256],[fx-137,209],[fx-43,126],[fx-14,108],[fx+15,108],[fx+46,135],[fx+147,216],[fx+300,287],[fx+367,307]],'#24324b');poly([[fx-104,180],[fx-43,126],[fx-14,108],[fx+15,108],[fx+46,135],[fx+112,187],[fx+67,171],[fx+43,179],[fx+16,152],[fx-2,165],[fx-29,151],[fx-51,177],[fx-72,167]],'#8c9ab0');poly([[fx+15,108],[fx+46,135],[fx+112,187],[fx+46,160]],'#657b99');
poly([[0,302],[90,253],[186,282],[280,240],[390,290],[512,270],[605,308],[775,281],[880,250],[998,282],[1100,246],[1100,335],[0,335]],'#19283e');for(let i=0;i<22;i++){let x=i*53;line(x,309,x+55,278+(i%3)*9,'#b078c71b')}glow(630,305,380,'#9f7ecb20');}
function perspectiveRoad(v,t,car=true){horizonSky(v);const hy=310,cy=660;rect(0,hy,1100,680-hy,'#101c2b');const bend=Math.sin(v*3.7)*24;const center=q=>cy+bend*q*q;const width=q=>9+q*560;const point=(q,side)=>[center(q)+side*width(q),hy+q*q*380];
// Sparse violet reflection grid on the shoulders.
for(let i=-12;i<=12;i++)line(cy+i*10,hy,cy+i*160,680,'#8960ba24');const phase=v*3.4;for(let i=0;i<18;i++){const q=((i/18+phase)%1);line(0,hy+q*q*380,1100,hy+q*q*380,'#8764b522');}
let road=[];for(let i=0;i<=60;i++)road.push(point(i/60,-1));for(let i=60;i>=0;i--)road.push(point(i/60,1));poly(road,'#151e2c');
// Deterministic road patches move with the road; their size collapses at the horizon.
for(let i=0;i<190;i++){const q=(i/190+phase*.77)%1,side=Math.sin(i*31.71)*.93,pt=point(q,side);if(q<.15)continue;rect(pt[0],pt[1],1+q*q*(3+i%11),Math.max(1,q*2),i%7===0?'#84939724':'#3944532e');}
for(let i=0;i<14;i++){const q=(i/14+phase*.62)%1;for(const side of [-1,1]){const pt=point(q,side*.8);g.save();g.translate(pt[0],pt[1]);g.scale(1,.18+.12*q);glow(0,0,16+q*65,'#e0c7a515');g.restore();for(let j=0;j<4;j++)rect(pt[0]-12*q+j*5,pt[1]+j*3*q,8*q,1,'#b8ab9b15');}}

for(const side of [-1,1]){g.beginPath();for(let i=0;i<=60;i++){const q=i/60,pt=point(q,side*.98);i?g.lineTo(...pt):g.moveTo(...pt)}g.strokeStyle='#a5a6bd80';g.lineWidth=2;g.stroke();g.beginPath();for(let i=0;i<=60;i++){const pt=point(i/60,side*1.04);i?g.lineTo(...pt):g.moveTo(...pt)}g.strokeStyle='#85739a55';g.lineWidth=3;g.stroke();}
// The lane marks accelerate toward the viewer through perspective, not camera shake.
for(let i=0;i<17;i++){const q=(i/17+phase)%1,q2=Math.min(1,q+.022);for(const lane of [-.333,.333])poly([point(q,lane-.006),point(q,lane+.006),point(q2,lane+.006),point(q2,lane-.006)],'#b8b8c070');}
for(let i=0;i<11;i++){const q=(i/11+phase*.62)%1,yy=hy+q*q*380;for(const side of [-1,1]){const xx=center(q)+side*(width(q)+18*q),height=8+q*170;line(xx,yy,xx,yy-height,'#526279',Math.max(1,q*4));line(xx,yy-height,xx-side*34*q,yy-height,'#8293a2',Math.max(1,q*3));rect(xx-side*35*q,yy-height,12*q+1,3*q+1,'#e0bf9f');if(q>.2){glow(xx-side*30*q,yy-height,22*q,'#e1bda321');g.save();g.beginPath();road.forEach((pt,j)=>j?g.lineTo(...pt):g.moveTo(...pt));g.closePath();g.clip();g.translate(xx-side*70*q,yy);g.scale(1,.2+.15*q);glow(0,0,14+q*78,'#e6cc9d25');g.restore();}}}
if(car){const motion=driveMotion(v),yaw=motion.yaw*40*Math.PI/180;
g.save();g.beginPath();road.forEach((pt,j)=>j?g.lineTo(...pt):g.moveTo(...pt));g.closePath();g.clip();for(const side of [-1,1])roadLight(motion.x+side*37*Math.cos(yaw)+Math.sin(-yaw)*65,motion.y+8-38*Math.cos(yaw),Math.sin(-yaw),-Math.cos(yaw),190,30);g.restore();
drawTyreSmoke(v);rearCar(motion.x,motion.y,1.05,motion.yaw);}}
// One deterministic manoeuvre: 20% preparation, 25% entry, 30% hold, 25% recovery.
function driftAt(v){const q=clamp((v-.08)/.82);if(q<.20)return 0;if(q<.45)return -.9*ease((q-.20)/.25);if(q<.75)return -.9;return -.9*(1-ease((q-.75)/.25));}
function driveMotion(v){const q=clamp(v),arc=ease((q-.18)/.74),yaw=driftAt(q),front=660+Math.sin(q*3.7)*24*.64-36*Math.sin(arc*Math.PI);return {x:front+yaw*62,y:568,yaw};}
function rearTyreAt(v,side){const pose=driveMotion(v),pt=bmwTyre(pose.yaw,side);return [pose.x+pt[0]*1.05,pose.y+pt[1]*1.05];}
function drawTyreSmoke(v){
// Fixed distance samples: pausing produces no new particles; reverse retraces the same cloud.
for(let i=22;i>=0;i--){const age=i/22,old=v-age*.13;if(old<0)continue;const slip=Math.abs(driftAt(old));if(slip<.08)continue;
for(const side of [-1,1]){const wheel=rearTyreAt(old,side),jitter=Math.sin(i*12.3+side*4),xx=wheel[0]+age*(side*30+jitter*13),yy=wheel[1]+age*22;
g.save();g.globalAlpha=slip*(1-age)*.14;const r=3+age*13;for(let k=0;k<3;k++){const dx=Math.round((xx+k*4+jitter*3)/2)*2,dy=Math.round((yy-k*3)/2)*2;round(dx,dy,r*(.7+k*.13),k===1?'#c1b7c8':'#8b879e');}g.restore();}}
for(const side of [-1,1]){for(let i=1;i<32;i++){const old=v-i*.0035,prev=old+.0035;if(old<0||Math.abs(driftAt(old))<.08)continue;const a=rearTyreAt(old,side),b=rearTyreAt(prev,side);line(a[0],a[1]+i*2.5,b[0],b[1]+(i-1)*2.5,'#040a1338',2);}}
}
// Environment changes at one fully occluded instant, never through double exposure.
function transitionShade(a){const shade=ease((a-.25)/.25)*(1-ease((a-.5)/.25));if(shade>0)rect(0,0,1100,680,`rgba(4,9,17,${shade})`);}
function sceneCut(drawA,drawB,a){if(a<.5)drawA();else drawB();transitionShade(a);}
function boardingPoint(progress){const q=normalizedBMW(0,90,33),seat=660+(q.left+q.w*q.seat)*1.05,amount=clamp((progress-.655)/(BOARD_START-.655)),x=lerp(440,seat,leadOut(amount));return {x,y:lerp(477,493,ease(amount)),seat,remaining:seat-x};}
function boardingFrame(a,t){const actual=p;p=.68;boardingScene=true;drawCity(t);boardingScene=false;p=actual;
const progress=.655+a*.245*.22,point=boardingPoint(progress),seated=progress>=BOARD_END;
if(progress<BOARD_START)farSidePedestrian(point.x,point.y,point.remaining<.3);
else if(!seated)carTransferHero(660,526,1.05,(progress-BOARD_START)/(BOARD_END-BOARD_START));
sideCar(660,526,1.05,0,ease((progress-BOARD_END)/(.7089-BOARD_END)),seated?1:0);
}
function drawJourneyScene(t){const actual=p;if(actual>=.94){drawRooftop(t);return;}
if(actual<.655){p=cityProgress(actual);drawCity(t);p=actual;if(actual>.55){g.save();g.globalAlpha=1;const cam=clamp((cityProgress(actual)-.15)/.85)*3900+actor.camera;sideCar(660+(2432-cam),526,1.05,0,false,0);g.restore();}return;}
if(actual>=.90){if(actual<.935){sceneCut(()=>arrival(1,t,arrivalBeyond(actual)),()=>{p=cityProgress(actual);drawCity(t);p=actual},(actual-.90)/.035);}else{p=cityProgress(actual);drawCity(t);p=actual;}return;}
const v=(actual-.655)/.245;
if(v<.22){boardingFrame(v/.22,t);}
else if(v<.39){const a=(v-.22)/.17,b=ease(a);hideDriver=true;hideCar=true;sceneCut(()=>boardingFrame(1,t),()=>perspectiveRoad(0,t,false),a);hideDriver=false;hideCar=false;bmwTransition(660,lerp(526,568,b),1.05,b);transitionShade(a);}
else if(v<.78){perspectiveRoad(ease((v-.39)/.39),t);}
else if(v<.91){const a=(v-.78)/.13,b=ease(a);hideDriver=true;hideCar=true;sceneCut(()=>perspectiveRoad(1,t,false),()=>sevenBackground(),a);hideDriver=false;hideCar=false;
const cx=parkX(a),ground=lerp(568+70*1.05,564+33*1.1,b),size=lerp(1.05,1.1,b),turn=1-b;
bmwTransition(cx,ground-(33+37*turn)*size,size,turn);transitionShade(a);}

else{arrival(.7+(v-.91)/.09*.3,t);}
}

// The access terrace is already visible ahead of the final storefront.
// A short street approach leads through a doorway before the stairwell is revealed.
const ROOF_APPROACH_RUN=480;
function roofApproach(progress){const u=clamp((progress-.94)/.005);return {u,travel:ROOF_APPROACH_RUN*u,x:440+10*u,foot:525+30*u,distance:Math.hypot(ROOF_APPROACH_RUN+10,30)*u};}
function drawJourney(t){
 if(p<.9175){drawJourneyScene(t);return;}
 const actual=p,a=roofApproach(actual),startCam=clamp((cityProgress(.94)-.15)/.85)*3900;
 const currentCam=clamp((cityProgress(Math.min(actual,.94))-.15)/.85)*3900;
 const origin=ROOF_APPROACH_RUN+startCam-currentCam-a.travel;
 const rise=actual>=.945?roofPath(actual).offset+180:0;
 // Continue the existing street camera; the terrace moves at walking speed.
 rect(0,0,1100,680,'#09131f');
 if(tokyoImage.complete&&tokyoImage.naturalWidth){g.save();g.globalAlpha=.5;g.drawImage(tokyoImage,-180,-100,1400,680);g.restore();}
 g.save();g.translate(-a.travel,0);p=cityProgress(Math.min(actual,.94));boardingScene=true;drawCity(t);boardingScene=false;g.restore();
 const corner=origin+290;
 g.save();g.beginPath();g.rect(corner,0,Math.max(0,1100-corner),680);g.clip();g.translate(origin,0);
 p=Math.max(.945,actual);drawRooftop(t,actual>=.945);g.restore();p=actual;
 g.save();g.translate(0,rise);
 // Exterior masonry defines the edge of the building, not an opaque screen wipe.
 // Finish the corner flush with the parapet cap; nothing projects into the skyline.
 const cornerTop=451-290*25/1100-180;
 rect(corner-4,cornerTop,8,555-cornerTop,'#26343e');rect(corner-4,cornerTop,2,555-cornerTop,'#59616a');
 for(let y=cornerTop+16;y<530;y+=28)line(corner-2,y,corner+4,y,'#46515a');
 rect(corner-4,cornerTop,9,4,'#71848a');
 {
  poly([[0,525],[origin-40,525],[origin+450,555],[1100,555],[1100,680],[0,680]],'#25313c');
  line(origin-40,527,origin+450,557,'#7d78833a');
  for(let i=0;i<30;i++){const x=(i*71-a.travel%71+1100)%1100,y=563+(i*37)%110;rect(x,y,8+i%11,1,'#9aa0a31c');}
 }
 // The opaque outer wall only opens into a cutaway after the doorway is crossed.
 const insideX=a.x-origin,doorOpen=ease((insideX-285)/70),reveal=ease((insideX-330)/105);
 drawAccessFacade(origin,doorOpen,reveal);
 g.restore();
 if(actual>=.945)return;
 const hx=actual<.94?440-actor.camera:a.x,foot=actual<.94?525:a.foot;
 g.save();g.translate(hx,foot+2);g.scale(1,.15);glow(0,0,24,'#010710a0');g.restore();girl(hx,foot-48,true);
 // Second half of the 7-Eleven fade: this branch takes over exactly at full black.
 if(actual<.935)transitionShade((actual-.90)/.035);
}

function drawAccessFacade(origin,doorOpen,reveal){
 if(reveal>=1)return;
 g.save();g.translate(origin,0);g.globalAlpha=1-reveal;
 // Two-storey enclosed stair building, with a readable cornice and recessed entry.
 rect(286,154,814,401,'#17232f');rect(294,162,806,385,'#26313c');
 rect(280,145,820,10,'#51515e');rect(286,155,814,8,'#0d1823');
 for(let y=178;y<547;y+=23){line(294,y,1100,y,'#46505a44');for(let x=294+(Math.floor(y/23)%2)*42;x<1100;x+=84)line(x,y,x,y+22,'#111d2866');}
 rect(286,163,9,392,'#53545d');rect(296,163,6,392,'#0d1826');
 for(const x of [343,520,697,874]){rect(x,208,90,123,'#0b1521');rect(x+5,213,80,111,'#38414c');rect(x+10,219,70,101,'#121e2c');
 rect(x+43,219,3,101,'#4e535d');rect(x+10,266,70,3,'#414a55');rect(x-5,332,100,6,'#5d5d66');
 for(let k=0;k<5;k++)line(x+11,226+k*17,x+79,226+k*17,'#62728720');}
 // Door leaf swings into the recessed opening; its threshold stays attached to the pavement.
 rect(320,390,102,165,'#101823');rect(326,396,90,159,'#53535a');rect(332,402,78,153,'#070f1b');
 const leaf=70*(1-doorOpen);poly([[337,407],[337+leaf,407+doorOpen*9],[337+leaf,550-doorOpen*4],[337,550]],'#34414a');
 if(leaf>9){line(343,421,337+leaf-5,421,'#667079');rect(337+leaf-10,472,3,13,'#b1a58d');}
 rect(326,552,92,4,'#8c877b');rect(319,385,104,5,'#686570');
 rect(319,361,104,18,'#101b27');text('ROOF ACCESS',328,374,10,'#c8bdb4');rect(347,382,47,3,'#e6c392');
 glow(371,408,65,'#d7b07921');
 // Downpipe, service box and subdued rain marks keep the exterior grounded.
 line(448,166,448,550,'#131d29',6);line(447,166,447,550,'#64707a',2);
 for(const y of [199,348,494])rect(442,y,11,4,'#78818a');
 rect(495,446,48,66,'#18222d');rect(499,450,40,58,'#3b444b');line(501,464,536,464,'#697078');
 for(let i=0;i<16;i++){const x=570+i*31;rect(x,344+i%4*5,1,22+i%5*9,'#080f1b44');}
 rect(422,548,678,7,'#0c1723');line(422,547,1100,547,'#5c6269');
 g.restore();
}

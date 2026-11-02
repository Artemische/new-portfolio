// Roof position, foot support, contemplation and one-shot flight have separate clocks.
const roofState={seen:false,departed:false,start:null,arrival:0,facingCity:false,departing:false,direction:1,lastPosition:0,settleStart:0,turnUntil:0,turnTarget:0,rainStart:0,rainStrength:0};
function roofPath(progress){const climb=clamp((progress-.945)/.021),landing=clamp((progress-.966)/.002),walk=clamp((progress-.968)/.012);return {climb,landing,walk,x:450-80*(1-clamp((progress-.94)/.005))+220*climb+135*ease(walk),y:735-180*climb-35*ease(walk),distance:-80*(1-clamp((progress-.94)/.005))+Math.hypot(220,180)*climb+Math.hypot(135,35)*ease(walk),offset:-180*(1-climb)};}
function updateRoofAction(ms,dt){if(p<.945)return;const point=roofPath(p),delta=point.distance-roofState.lastPosition;roofState.lastPosition=point.distance;
if(Math.abs(delta)>.12){roofState.direction=delta<0?-1:1;if(delta>0)roofState.departing=false;roofState.settleStart=0;if(delta<0)roofState.facingCity=false;}
if(!roofState.departing&&p>=.9798&&!heroGait.moving&&!roofState.turnUntil){if(!roofState.settleStart)roofState.settleStart=ms;if(ms-roofState.settleStart>200)roofState.facingCity=true;}
if(roofState.facingCity){roofState.arrival=1;if(!roofState.rainStart)roofState.rainStart=ms;if(!roofState.seen){roofState.seen=true;roofState.start=ms;}}
else roofState.rainStart=0;
const rainTarget=roofState.facingCity?clamp((ms-roofState.rainStart)/1000):0;roofState.rainStrength+=(rainTarget-roofState.rainStrength)*Math.min(1,dt/160);
if(!reduced&&roofState.seen&&ms-roofState.start>4800)roofState.departed=true;}
// Each supporting boot is fixed to a tread. The other lifts to the next tread.
function stairFoot(step){return {x:450+22*step,y:735-18*step};}
function stairFeet(climb){const q=clamp(climb)*10,n=Math.min(9,Math.floor(q)),u=q-n,a=stairFoot(n),b=stairFoot(n+1),previous=stairFoot(Math.max(0,n-1));const moving={x:lerp(previous.x,b.x,ease(u)),y:lerp(previous.y,b.y,ease(u))-Math.sin(u*Math.PI)*14};return n%2?[moving,a]:[a,moving];}
function stairHero(point){if(heroFrames.length!==8)return;
if(p<.945){girl(point.x,point.y-48,true);return;}
const feet=point.climb>=1?[{x:670,y:555},{x:lerp(648,670,ease(point.landing)),y:lerp(573,555,ease(point.landing))-Math.sin(point.landing*Math.PI)*8}]:stairFeet(point.climb),hx=point.x-5,hipY=point.y-64,art=heroFrames[6];
for(let i=0;i<2;i++){const foot=feet[i],hipX=hx+(i?5:-4),dx=foot.x-hipX,dy=foot.y-12-hipY,len=Math.hypot(dx,dy),bend=Math.sqrt(Math.max(0,29*29-len*len/4)),kx=(hipX+foot.x)/2+dy/Math.max(1,len)*bend*roofState.direction,ky=(hipY+foot.y-12)/2-dx/Math.max(1,len)*bend*roofState.direction;
heroLimb(g,art,[i?57:39,92,22,24],{x:hipX,y:hipY},{x:kx,y:ky},16);
heroLimb(g,art,[i?61:37,113,23,23],{x:kx,y:ky},{x:foot.x,y:foot.y-12},17);
g.save();g.translate(Math.round(foot.x),Math.round(foot.y));g.scale(roofState.direction,1);g.drawImage(art,i?63:32,132,39,23,-13,-20,30,23);g.restore();line(foot.x-10,foot.y+3,foot.x+17,foot.y+3,'#01080bab',2);}
g.save();g.translate(Math.round(hx),Math.round(hipY));g.scale(roofState.direction,1);g.drawImage(art,0,0,128,92,-52,-92,128,92);g.restore();}
function roofBird(x,y,flight){g.save();g.translate(Math.round(x),Math.round(y));const k=flight?Math.max(.18,1-flight*.8):1;g.scale(k,k);
poly([[-12,0],[-5,-7],[6,-7],[12,-2],[7,5],[-7,5]],'#c8d3d6');poly([[-11,0],[-3,-5],[5,-2],[0,3]],'#f0e9dc');rect(5,-12,8,8,'#e8e6db');rect(11,-10,2,2,'#202e39');poly([[13,-8],[19,-6],[13,-5]],'#bca58c');poly([[-11,0],[-20,3],[-18,7],[-6,4]],'#9dafbb');
if(flight){const wing=Math.sin(flight*40)*18;poly([[-4,-2],[-24,-18-wing],[-32,-12-wing],[-12,6],[2,3]],'#f1efe4');poly([[0,-3],[18,-20-wing],[27,-17-wing],[10,4]],'#aebfcb');}else{line(-2,5,-3,10,'#b9a0a2');line(4,5,6,10,'#b9a0a2');}g.restore();}
function drawRooftop(t,showHero=true){const point=roofPath(p);rect(0,0,1100,680,'#080f1c');
if(tokyoImage.complete&&tokyoImage.naturalWidth){g.save();g.globalAlpha=.50;g.drawImage(tokyoImage,-180,-100+point.climb*35,1400,680);g.restore();}
rect(0,0,1100,680,'#07121c30');glow(810,290,310,'#4077862b');
// Recessed windows, stepped roofs, tanks and equipment distinguish the middle distance.
for(let i=0;i<14;i++){const x=i*87-25,top=190+(i*53)%145;poly([[x,top+16],[x+8,top+16],[x+8,top],[x+60,top],[x+60,top+22],[x+73,top+22],[x+73,440],[x,440]],i%2?'#102331':'#0c1b29');rect(x+9,top-4,51,5,'#40505b');rect(x+2,top+22,4,210,'#18303b');
for(let j=0;j<6;j++)for(let k=0;k<3;k++){rect(x+12+k*17,top+30+j*20,9,13,'#060f1b');if((i+j+k)%3)rect(x+14+k*17,top+33+j*20,5,8,(i+j)%2?'#8eb5b354':'#bc9e7059');}
if(i%3===0){rect(x+22,top-26,25,22,'#152734');rect(x+24,top-29,21,4,'#536168');line(x+25,top-3,x+21,top+6,'#334857',2);line(x+44,top-3,x+48,top+7,'#334857',2);}
else{rect(x+15,top-13,21,9,'#3a4852');for(let k=0;k<4;k++)line(x+18+k*4,top-11,x+18+k*4,top-5,'#172831');line(x+51,top,x+51,top-30,'#2d4351');}
for(let j=0;j<4;j++)line(x+62,top+30+j*10,x+69,top+30+j*10,'#385260');line(x+61,top+24,x+61,top+78,'#2e4555');line(x+70,top+24,x+70,top+78,'#2e4555');}
glow(790,330,250,'#59738419');
g.save();g.translate(0,Math.round(point.offset));
// Exterior access terrace and building wall remain visible during the ascent.
rect(0,555,1100,320,'#13242e');
for(let y=570;y<850;y+=22){line(0,y,1100,y,'#33434a');for(let x=((y/22|0)%2)*45;x<1100;x+=90)line(x,y,x,y+21,'#233740');}
// Open-air service terrace, rather than an interior doorway.
rect(280,618,104,72,'#1a2a34');rect(285,623,94,62,'#30414a');
for(let x=292;x<375;x+=9)line(x,629,x,677,'#14252e',3);
line(310,555,310,611,'#50616a',5);line(310,611,365,611,'#50616a',5);
rect(338,591,39,4,'#d9c7a0');glow(357,615,65,'#d8b77724');text('ROOF ACCESS →',303,582,9,'#9daba8');
poly([[0,738],[454,738],[485,754],[0,770]],'#4b5059');rect(0,754,485,12,'#26333e');
line(0,754,485,754,'#819092',2);
// Two diagonal stringers bolt to masonry brackets, with a braced bottom landing.
for(const i of [0,3,6,9]){const a=stairFoot(i);rect(a.x-12,a.y+14,8,49,'#1b2d39');line(a.x-10,a.y+57,a.x+25,a.y+20,'#4a606c',3);rect(a.x-17,a.y+53,20,6,'#596b73');rect(a.x-14,a.y+54,2,2,'#afbab1');}
// One continuous roof deck reaches the landing; the stairwell is outside its left edge.
poly([[0,510],[1100,485],[1100,680],[672,680],[672,560],[650,548],[415,738],[415,555],[0,555]],'#3a3d49');
poly([[415,738],[650,548],[672,560],[672,680],[656,680],[656,570],[411,755]],'#10222f');
line(650,548,672,560,'#8c9d9e',2);
for(const yy of [531,566,607,654])line(700,yy,1100,yy-8,'#b0a8b534');
for(const xx of [755,900,1050])line(xx,510,xx+28,680,'#171c2d80');
for(let i=0;i<58;i++){const x=(i*163)%1100,y=520+(i*43)%150;if(x>420&&x<680&&y>555)continue;rect(x,y,8+i%23,1,i%3?'#9c91a02b':'#b4abb638');}
// Broad roofing seams follow the slab perspective, away from the stair opening.
for(let i=0;i<6;i++){const y=522+i*i*5;line(685,y,1100,y-12,'#141e2b65');line(685,y+2,1100,y-10,'#807b8730');}
for(let i=0;i<38;i++){const x=700+(i*109)%390,y=526+(i*47)%137;rect(x,y,10+i%17,2,'#b1a3ac16');}
// Permanent shallow puddles have irregular contours; impacts use a separate clock.
for(const [x,y,ww,hh] of [[728,590,52,8],[908,565,80,7],[805,649,98,12],[1045,620,66,10]]){poly([[x-ww/2,y],[x-ww*.22,y-hh*.4],[x+ww*.4,y-hh*.25],[x+ww/2,y+hh*.3],[x+ww*.16,y+hh*.6],[x-ww*.4,y+hh*.4]],'#252e3b');line(x-ww*.3,y+1,x+ww*.19,y+1,'#709d9f32');line(x-ww*.08,y+3,x+ww*.32,y+3,'#a5798e22');}
// Drain channel, maintenance curb and vent give the wet slab a usable scale.
poly([[940,508],[956,495],[1026,493],[1011,507]],'#53646c');rect(940,508,72,22,'#1b303d');poly([[1012,508],[1026,493],[1026,518],[1012,530]],'#0d222e');
for(let i=0;i<9;i++)line(946+i*7,512,946+i*7,525,'#4b6570');line(936,532,1015,532,'#030e1990',3);
line(685,671,1100,662,'#0b1c26',4);for(let x=710;x<1100;x+=10)line(x,667,x+3,672,'#647b8245');
// Rooftop utilities are anchored to the slab, kept clear of the walking path.
rect(55,489,138,27,'#132632');poly([[55,489],[69,480],[203,480],[193,489]],'#495c65');
for(let x=67;x<184;x+=9)line(x,495,x,508,'#61727a');
rect(208,499,34,13,'#112532');line(225,501,225,457,'#50656c',5);line(225,458,254,458,'#60727a',5);
for(let i=0;i<95;i++){const x=700+(i*97)%392,y=519+(i*47)%151;rect(x,y,1+i%4,1,i%4?'#6b87931c':'#b1c6b424');}
for(let i=0;i<10;i++){const x=890+i*9,y=529+i*3;line(x,y,x+5+(i%3)*7,y,'#8b9f9040');}
roofImpacts(t,point);
poly([[0,459],[1100,434],[1100,491],[0,516]],'#192d38');line(0,516,1100,491,'#0c1924',5);line(0,519,1100,494,'#78728266',2);poly([[0,451],[1100,426],[1100,436],[0,461]],'#71848a');line(0,453,1100,428,'#9bb4b655',2);
for(let i=0;i<48;i++){const x=i*25,y=461-x*.023;rect(x,y,1,10+i%27,'#06152270');if(i%3===0)rect(x+5,y+9,12,1,'#7b899529');}
// Steel stairs: separate top surfaces and risers, plus two visible support strings.
for(let i=0;i<10;i++){const a=stairFoot(i);poly([[a.x-17,a.y+3],[a.x+6,a.y+3],[a.x+6,a.y+10],[a.x-17,a.y+10]],'#273e4b');line(a.x-17,a.y+3,a.x+6,a.y+3,'#839397',2);line(a.x-12,a.y+7,a.x+2,a.y+7,'#111f2a');}
line(425,758,675,562,'#304755',5);line(442,758,692,562,'#0b1421',3);poly([[650,548],[772,545],[793,558],[671,560]],'#57616d');poly([[762,546],[793,544],[814,557],[793,558]],'#454852');line(793,558,814,557,'#b1a3b15c');line(650,548,671,560,'#a4b9bc',2);line(671,560,762,560,'#718991');line(746,546,762,560,'#607984');line(744,561,744,589,'#304753',4);line(701,583,744,561,'#3b5360',3);for(let x=667;x<742;x+=8)line(x,550,x+10,557,'#93a6a839');
for(let i=0;i<=10;i+=2){const a=stairFoot(i);line(a.x-18,a.y,a.x-18,a.y-68,'#334a58',3);}line(432,667,652,487,'#526875',3);
const oldDir=dir;dir=roofState.direction;
if(showHero){if(point.climb<1||point.landing<1){stairHero(point);}else{g.save();g.translate(point.x,point.y+2);g.scale(1,.18);glow(0,0,28,'#010710c0');g.restore();const wasMoving=heroGait.moving;if(roofState.turnUntil)heroGait.moving=false;girl(point.x,point.y-48,true);heroGait.moving=wasMoving;}}
// Near handrail is in front of the climbing body; the landing has an open passage.
{line(452,682,649,522,'#49606d',3);for(let i=0;i<9;i+=2){const a=stairFoot(i);line(a.x+2,a.y+8,a.x+2,a.y-52,'#314855',2);}}
dir=oldDir;
if(torchOn&&roofState.facingCity){g.save();g.translate(point.x+25,point.y);g.scale(1,.23);glow(0,0,34,'#e8d6a523');g.restore();}
const elapsed=performance.now()-roofState.start;if(!roofState.departed){const flight=reduced||!roofState.seen?0:clamp((elapsed-2000)/2800);g.save();g.translate(858,425);g.scale(1.05,1.05);roofBird(flight*110,-flight*170,flight);g.restore();}
for(let i=0;i<12;i++){const x=(i*89+35)%1100,y=451-x*.023;const splash=(t*(1+roofState.rainStrength)+i*.71)%1;if(splash<.19){line(x-3,y-3,x,y,'#bdcfd566');line(x,y,x+4,y-4,'#bdcfd544');}}
g.restore();
const strength=roofState.rainStrength;for(let i=0;i<100+Math.floor(strength*65);i++){const near=i%3===0,x=(i*137+t*(near?48:19))%1120,y=(i*73+t*(near?220:100))%710;g.globalAlpha=x<460?.45:1;line(Math.round(x),Math.round(y),Math.round(x-2),Math.round(y+(near?15+strength*8:7)),near?'#a9c4cf58':'#7899ae28');}g.globalAlpha=1;}

function roofImpacts(t,point){for(let i=0;i<22;i++){const x=690+((i*139+Math.floor(i/4)*37)%390),y=560+((i*67)%108),perspective=.45+(y-550)/150;if(Math.abs(x-point.x)<27&&Math.abs(y-555)<24)continue;const period=2.2+(i%7)*.27,phase=(t+i*.831)%period;
if(phase<.20){const drop=1-phase/.20;line(x+drop*4,y-45*drop,x+drop*4-1,y-45*drop+7,'#a9cad559');}
else if(phase<.34){const a=(phase-.20)/.14;line(x-4*a,y-4*Math.sin(a*Math.PI),x,y,'#bfd3d070');line(x,y,x+5*a,y-5*Math.sin(a*Math.PI),'#a9ced45c');}
else if(phase<1.1){const u=(phase-.34)/.76,rx=(3+u*16)*perspective,ry=rx*.23;g.save();g.globalAlpha=(1-u)*.38;g.strokeStyle='#91b8bf';g.lineWidth=1;g.beginPath();for(let j=0;j<=16;j++){const a=j/16*Math.PI*2,xx=Math.round(x+Math.cos(a)*rx),yy=Math.round(y+Math.sin(a)*ry);j?g.lineTo(xx,yy):g.moveTo(xx,yy);}g.stroke();g.restore();}}}

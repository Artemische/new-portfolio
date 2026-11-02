// Dedicated transparent widebody E30 views. Coordinates are relative to each cockpit.
const bmwImages=Array.from({length:8},(_,i)=>{const im=new Image();im.src=`assets/bmw-${i}.png`;return im});
const bmwMeta=[
{w:220,ratio:222/610,seat:.43,crown:.03,belt:.35,tyres:[.20,.82]},
{w:180,ratio:252/366,seat:.33,crown:.04,belt:.31,tyres:[.07,.93]},
{w:201,ratio:299/479,seat:.41,crown:.04,belt:.30,tyres:[.13,.83]},
{w:220,ratio:303/493,seat:.44,crown:.04,belt:.34,tyres:[.13,.78]},
{w:237,ratio:316/519,seat:.41,crown:.07,belt:.39,tyres:[.10,.70]},
{w:251,ratio:328/485,seat:.42,crown:.08,belt:.42,tyres:[.08,.65]},
{w:240,ratio:433/1372,seat:.43,crown:.09,belt:.34,tyres:[.33,.87]},
{w:251,ratio:444/1301,seat:.44,crown:.10,belt:.33,tyres:[.43,.88]}
];
let hideCar=false;
function bmwPose(index,bottom=70){const m=bmwMeta[index],height=m.w*m.ratio;return {...m,index,height,left:-m.w/2,top:bottom-height,bottom};}
// One opaque pose at every yaw; never interpolate image opacity.
function normalizedBMW(index,angle,bottom=70){
const pose=bmwPose(index,bottom);
// Register all views to the same roof/ground envelope. Scaling is uniform.
const height=80+52*Math.cos(angle*Math.PI/180);
pose.height=height;pose.w=height/pose.ratio;pose.left=-pose.w/2;pose.top=bottom-height;
return pose;
}
function bmwAngles(steer){const angle=Math.min(40,Math.abs(steer)*40),index=angle<6?1:angle<17?2:angle<28?3:4;return [{...normalizedBMW(index,angle),weight:1}];}
let bmwBrake=0;
function bmwDriverData(poses){let x=0,y=0,belt=0;for(const q of poses){x+=(q.left+q.w*q.seat)*q.weight;y+=(q.top+q.height*q.crown)*q.weight;belt+=(q.top+q.height*q.belt)*q.weight;}return {x,y,belt};}
function paintBMW(poses,occupant=1,view='rear',lights=false){
if(hideCar||!bmwImages.every(im=>im.complete&&im.naturalWidth))return;
const opacity=g.globalAlpha;g.imageSmoothingEnabled=false;
// Compact contact shadow and a much fainter wet-road reflection.
for(const q of poses){if(!q.weight)continue;g.save();g.globalAlpha=opacity*q.weight;
g.fillStyle='#030915aa';g.beginPath();g.ellipse(0,q.bottom-2,q.w*.47,6,0,0,Math.PI*2);g.fill();
g.save();g.globalAlpha*=.055;g.translate(0,q.bottom*2+2);g.scale(1,-.24);g.translate(0,q.bottom*(1/.24-1));g.drawImage(bmwImages[q.index],q.left,q.top,q.w,q.height);g.restore();
if(lights&&q.index===0)roadLight(q.left+q.w*.97,q.bottom-5,1,0,140,26);
g.drawImage(bmwImages[q.index],q.left,q.top,q.w,q.height);g.restore();}
const seat=bmwDriverData(poses);
if(occupant&&!hideDriver){g.save();g.globalAlpha=opacity*occupant;g.beginPath();g.rect(-180,-200,360,seat.belt+200);g.clip();
const height=view==='side'?41:47;
// Wheel rim at the ends of the driver's bent arms, behind the hands.
const wx=seat.x+(view==='side'?height*.47:height*.35),wy=seat.y+height*.54;
g.strokeStyle='#141b27';g.lineWidth=3;g.beginPath();g.ellipse(wx,wy,view==='side'?3:6,5,-.35,0,Math.PI*2);g.stroke();g.strokeStyle='#8790a0';g.lineWidth=1;g.stroke();
seatedHero(seat.x,seat.y,height,view);g.restore();}
// Repaint only the door/rear deck foreground so the lower body sits inside the car.
for(const q of poses){if(!q.weight)continue;g.save();g.globalAlpha=opacity*q.weight;g.beginPath();g.rect(-180,q.top+q.height*q.belt,360,300);g.clip();g.drawImage(bmwImages[q.index],q.left,q.top,q.w,q.height);g.restore();}
// Brake lamps are attached to the selected body, not to the screen.
if(bmwBrake>0){for(const q of poses){const lamps=q.index===0?[.025]:[.15,.72];for(const xx of lamps){g.save();g.globalAlpha=opacity*bmwBrake*.65;glow(q.left+q.w*xx,q.top+q.height*(q.index===0?.52:.55),9,'#ff634c80');g.restore();}}}

}
function bmwSide(x,y,scale,lights,occupant){
g.save();g.translate(x,y);g.scale(scale,scale);const pose={...normalizedBMW(0,90,33),weight:1};
// Side-view driver is behind the actual car pixels, with no rectangular character mask.
if(occupant&&!hideCar&&!hideDriver){const seat=bmwDriverData([pose]),height=41,wx=seat.x+height*.47,wy=seat.y+height*.54;
g.strokeStyle='#141b27';g.lineWidth=3;g.beginPath();g.ellipse(wx,wy,3,5,-.35,0,Math.PI*2);g.stroke();g.strokeStyle='#8790a0';g.lineWidth=1;g.stroke();
seatedHero(seat.x,seat.y,height,'side');}
paintBMW([pose],0,'side',lights);g.restore();
}
function bmwRear(x,y,scale,steer){g.save();g.translate(x,y);g.scale(steer>0?-scale:scale,scale);const poses=bmwAngles(steer).map(q=>({...q,seat:steer>0?1-q.seat:q.seat}));paintBMW(poses,1,Math.abs(steer)>.25?'quarter':'rear');
// A narrow outer tread cue leaves the original BBS rim and wheel arch intact.
const q=poses[0],lock=Math.abs(steer);
if(q.index>=3&&lock>.35){const wx=q.left+q.w*.985,wy=q.top+q.height*.545,ry=q.height*.145;
for(let yy=-Math.floor(ry);yy<=ry;yy+=2){const edge=Math.sqrt(Math.max(0,1-yy*yy/(ry*ry)));rect(wx-1,wy+yy,Math.max(1,Math.round(edge*3*lock)),2,yy%4?'#303647':'#171f2b');}}
g.restore();}
function bmwTransition(x,y,scale,turn){
const angle=90*(1-turn),index=angle>80?0:angle>62?6:angle>45?7:angle>28?4:angle>17?3:angle>6?2:1;
const pose=normalizedBMW(index,angle,33+37*turn);
g.save();g.translate(x,y);g.scale(scale,scale);paintBMW([{...pose,weight:1}],1,index===0?'side':index===1?'rear':'quarter',index===0);g.restore();
}
function bmwTyre(steer,side){const poses=bmwAngles(steer),mirror=steer>0?-1:1;let x=0,y=0;for(const q of poses){x+=(q.left+q.w*q.tyres[side<0?0:1])*q.weight;y+=(q.bottom-(side>0?Math.abs(steer)*8:0))*q.weight;}return [x*mirror,y];}

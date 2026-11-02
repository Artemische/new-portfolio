const repairCoupe=new Image();repairCoupe.src='assets/focolor-repair-coupe.png';
// Soft elliptical footprints form two light volumes on the road, never the sky.
function roadLight(x,y,dx,dy,length,spread){
 for(const side of [-1,1])for(let i=18;i>=0;i--){const u=i/18,d=length*u,fade=Math.sin(Math.PI*u)*.042;g.save();g.translate(x-dy*side*5+dx*d,y+dx*side*3+dy*d*.8);g.scale(1,.23);const z=g.createRadialGradient(0,0,0,0,0,spread*(.45+u));z.addColorStop(0,`rgba(224,219,184,${fade})`);z.addColorStop(1,'rgba(224,219,184,0)');g.fillStyle=z;g.fillRect(-spread*2,-spread*2,spread*4,spread*4);g.restore();}
}
function focolorBay(x,col,lit,t){
 rect(x+18,343,294,164,'#060e17');poly([[x+18,343],[x+43,362],[x+43,486],[x+18,507]],'#39454c');poly([[x+312,343],[x+284,362],[x+284,486],[x+312,507]],'#283741');rect(x+43,362,241,124,'#121e28');
 for(let yy=367;yy<470;yy+=13){line(x+45,yy,x+282,yy,'#42505235');for(let xx=46;xx<282;xx+=34)rect(x+xx,yy,1,12,'#050d1739');}
 poly([[x+18,507],[x+43,470],[x+284,470],[x+312,507]],'#35404a');for(let i=0;i<7;i++)line(x+20+i*47,506,x+62+i*32,470,'#7b807229');
 // Workshop lamp and steel cabinet.
 rect(x+107,357,105,5,'#858276');rect(x+112,362,94,3,lit?'#e1c79c':'#4b4b49');if(lit)glow(x+162,407,110,'#d9ae7230');
 rect(x+247,432,35,57,'#060c15');rect(x+248,429,32,53,'#69423e');rect(x+248,429,32,3,'#bc8f77');for(let i=0;i<5;i++){rect(x+251,436+i*9,26,6,'#7b4b42');rect(x+259,438+i*9,11,1,'#b2a699');}round(x+252,487,3,'#071019');round(x+276,487,3,'#071019');
 rect(x+27,461,15,29,'#394c52');rect(x+30,455,9,7,'#788285');line(x+35,459,x+52,446,'#151c25',2);
 // Two anchored lift columns, cross beam and support arms.
 for(const xx of [52,225]){rect(x+xx-6,493,23,5,'#060d16');rect(x+xx,374,9,119,'#465a65');rect(x+xx,374,3,119,'#91a0a0');for(let yy=382;yy<478;yy+=9)rect(x+xx+4,yy,3,3,'#1b2a34');rect(x+xx-4,437,17,8,'#b89261');}
 rect(x+55,374,179,5,'#65747a');line(x+61,444,x+94,435,'#8a795e',4);line(x+229,444,x+203,435,'#8a795e',4);
 // A detailed independent repair car, held by lift pads under the chassis.
 poly([[x+64,478],[x+237,478],[x+219,470],[x+82,470]],'#02081390');
 rect(x+78,432,145,4,'#101b25');rect(x+82,430,14,3,'#a89671');rect(x+205,430,14,3,'#a89671');
 if(repairCoupe.complete&&repairCoupe.naturalWidth){g.save();g.imageSmoothingEnabled=false;g.globalAlpha=lit?1:.45;g.drawImage(repairCoupe,24,199,1660,574,x+58,376,187,65);g.restore();}
 // Near lift post and hydraulic details overlap the vehicle only at the edge.
 rect(x+52,376,4,115,'#859394');rect(x+48,445,12,6,'#263844');line(x+57,448,x+90,434,'#a18d64',3);
 rect(x+57,453,9,13,'#24333d');rect(x+59,456,4,3,lit?'#b1c991':'#41534c');
 for(let j=0;j<8;j++){rect(x+44,363+j*15,2,10,'#6e7d7d30');rect(x+281,363+j*15,2,10,'#040d1844');}
 if(lit){g.save();g.globalAlpha=.5;glow(x+161,459,81,'#d6b78028');line(x+22,503,x+307,503,'#bca784');g.restore();}
 rect(x+84,466,143,3,'#020b1644');rect(x+20,500,291,5,'#79817a');text('BMW & MINI / WORKSHOP',x+45,354,9,col);for(let i=0;i<9;i++)rect(x+30+(i*17)%27,522+i*4,230-i*19,1,'#c5a67f16');
}

// Duriano alone: layered pixel architecture and deterministic, reversible proximity lighting.
const durianoTerminal={x:290,y:374,w:130,h:108};
function durianoScreenBounds(){const scale=w<700?.8:1,q=durianoTerminal;return {x:q.x*scale,y:515+(q.y-515)*scale,w:q.w*scale,h:q.h*scale};}
function durianoArcade(c,lit,t){
const x=c.x,world=440+clamp((p-.15)/.85)*3900,near=lit?ease((520-Math.abs(world-(x+165)))/300):0;
const power=[near,.16+.84*ease((near-.08)/.55),.16+.84*ease((near-.19)/.55),.16+.84*ease((near-.30)/.55)],terminalPower=.30+.70*ease((near-.57)/.40);
const hot=screenHover===0,rose='#d38cae',violet='#bba0d5',lime='#bfd778';
g.save();g.translate(x,515);const facadeScale=w<700?.8:1;g.scale(facadeScale,facadeScale);g.translate(0,-515);
// Narrow masonry, side return, roof cap and dark upper storey.
poly([[0,190],[397,177],[438,193],[438,515],[0,515]],'#111b29');
rect(7,194,390,321,'#222534');poly([[397,194],[438,205],[438,515],[397,515]],'#131b26');
rect(-8,184,413,10,'#3e3b4c');rect(-8,184,413,2,'#737080');rect(7,195,390,4,'#080f1b');
for(let yy=204;yy<510;yy+=12){rect(9,yy,386,1,'#30303d');for(let xx=10+(yy%24?0:17);xx<395;xx+=34)rect(xx,yy,1,11,'#171f2d');}
// Quiet masonry variation, rain runs, chipped joints and panel fixings.
for(let row=0;row<25;row++)for(let col=0;col<11;col++){const xx=12+col*34+(row%2)*17,yy=202+row*12;if(xx>390)continue;rect(xx+2,yy+2,27,7,['#36303b28','#5d4b4b18','#080f1822'][(row*7+col)%3]);if((row+col)%5===0)rect(xx+3,yy+9,10,1,'#74647128');}
for(let i=0;i<19;i++){const xx=24+(i*67)%362,yy=205+(i*29)%290;rect(xx,yy,1,9+i%12,'#030b1839');rect(xx+1,yy+2,1,4,'#6b687219');}
rect(9,507,386,8,'#060b15');line(14,505,390,505,'#45444e',1);
for(let i=0;i<3;i++){const xx=32+i*109;rect(xx-4,211,79,64,'#0c1420');rect(xx,215,71,53,i===1?'#56433e':'#192537');for(let k=0;k<5;k++)rect(xx+k*14,216,4,50,i===1?'#786251':'#233346');rect(xx+33,215,3,53,'#111b29');rect(xx,244,71,3,'#111b29');rect(xx-5,271,81,5,'#44404d');if(i===1){rect(xx+43,226,19,27,'#b69a6b55');glow(xx+35,244,42,'#c6a57212');}}
// External compressor, cables and subtle wear.
rect(335,280,57,33,'#47505a');rect(338,283,51,27,'#303c49');for(let yy=287;yy<307;yy+=4)rect(341,yy,29,1,'#829096');rect(377,287,8,17,'#1b2634');line(392,296,409,296,'#65727b',2);line(409,296,409,365,'#4c5d69',2);
line(20,203,20,289,'#0a101c',3);line(20,206,315,199,'#090f19',2);line(315,199,429,220,'#0a101c',2);
for(let i=0;i<27;i++){const xx=12+(i*71)%379,yy=201+(i*37)%305;rect(xx,yy,2+i%4,1,'#68707a22');}
// Recessed hall: thick reveals, warm door on left and deep window on right.
rect(17,343,270,166,'#080f19');poly([[17,343],[30,355],[30,498],[17,509]],'#434052');poly([[17,343],[287,343],[274,356],[30,355]],'#121526');
rect(114,356,160,140,'#101420');poly([[114,496],[274,496],[228,432],[163,432]],'#3d3342');
for(let i=0;i<6;i++)line(114+i*32,496,179+i*8,432,'#77617144');for(let i=0;i<5;i++){let yy=435+i*i*3;line(120,yy,268,yy,'#77617144');}
rect(173,365,59,80,'#070c15');for(let i=0;i<4;i++){rect(178+i*12,390+i*5,8,11,'#3d3150');rect(179+i*12,392+i*5,6,4,near>.5?'#7c678e':'#272437');}
// Coloured screen bounce on the floor and adjacent reveals.
for(let i=0;i<3;i++){g.save();g.globalAlpha=power[i+1]*.38;glow(140+i*51,427,43,['#b794d152','#b9ce7045','#d4a17b42'][i]);poly([[128+i*51,452],[153+i*51,452],[165+i*51,494],[118+i*51,494]],['#b794d113','#b9ce7010','#d4a17b13'][i]);g.restore();}
// Three near cabinets; invented tiny game vignettes, never project screenshots.
for(let i=0;i<3;i++){const xx=120+i*51,yy=387+(i===1?3:0),on=power[i+1];
poly([[xx,yy],[xx+34,yy],[xx+37,yy+45],[xx+45,yy+53],[xx+43,492],[xx-3,492],[xx-3,yy+53],[xx+3,yy+43]],'#181a2c');
poly([[xx+34,yy],[xx+41,yy+5],[xx+45,yy+53],[xx+37,yy+48]],'#51415f');rect(xx+3,yy+3,29,10,'#493c58');text(['PVP','CLANS','QUESTS'][i],xx+5,yy+11,7,on>.3?violet:'#787184');
rect(xx+4,yy+17,28,27,'#070e18');g.save();g.globalAlpha=on;rect(xx+6,yy+19,24,23,['#28213e','#1c343b','#30342a'][i]);
for(let k=0;k<4;k++)rect(xx+7+k*6,yy+37-(k+i)%3*3,5,4,'#6d617b');const drift=reduced?0:Math.floor(Math.sin(t*.8+i)*2);rect(xx+12+drift,yy+29,3,5,[rose,lime,'#81b5c0'][i]);rect(xx+11+drift,yy+27,5,3,'#ddd0b7');rect(xx+25,yy+24,2,2,lime);g.restore();
poly([[xx+2,yy+44],[xx+34,yy+44],[xx+41,yy+53],[xx-1,yy+53]],'#5b4a67');rect(xx+7,yy+46,2,5,'#d2bbc9');rect(xx+25,yy+48,3,2,rose);rect(xx+31,yy+48,3,2,lime);rect(xx+5,yy+59,28,26,'#252235');rect(xx+15,yy+63,7,3,'#0a1420');rect(xx+15,yy+64,6,1,'#8c8293');}
// Reflected distant windows, deliberately sparse enough to retain the game screens.
for(let i=0;i<9;i++){rect(119+i*16,361+(i%3)*9,3,16,'#a0b8cf0e');rect(121+i*16,364+(i%3)*9,1,7,'#d4c0a40c');}
rect(114,356,160,7,'#02081199');rect(114,356,6,140,'#02081180');rect(267,356,7,140,'#02081170');
// Glass stays translucent; metal mullions sit in front of the cabinets.
poly([[120,357],[132,357],[199,493],[187,493]],'#b3b9d008');poly([[240,357],[247,357],[274,416],[274,431]],'#c6d4dd0c');rect(110,350,5,151,'#535368');rect(274,350,6,151,'#505263');rect(112,352,166,3,'#8c7689');rect(193,357,3,139,'#3b3c50');rect(111,498,169,5,'#777082');
// Open entrance: dark jamb, angled door and a quiet warm spill.
rect(31,355,70,141,'#0a0e19');rect(40,362,48,128,'#252032');rect(44,366,40,119,'#7d5c45');rect(48,370,32,110,'#ad886055');
poly([[85,363],[105,351],[105,492],[85,484]],'#443a49');poly([[88,369],[101,362],[101,453],[88,459]],'#2a2636');line(101,362,101,487,'#a89183',2);rect(89,452,2,11,'#d1bca4');
poly([[43,496],[86,496],[114,520],[22,520]],'#c39b6530');rect(26,497,77,5,'#887568');rect(20,503,90,6,'#4b4650');
for(let yy=509;yy<520;yy+=5)for(let xx=18;xx<111;xx+=13){rect(xx,yy,11,3,'#464350');rect(xx,yy,11,1,'#777080');}
rect(31,355,9,141,'#02061190');rect(31,355,70,9,'#020611aa');
// Deep awning and extruded letterbox sign.
poly([[-3,331],[289,331],[302,347],[-12,347]],'#383246');rect(-12,347,314,7,'#151e2c');rect(-10,347,309,2,'#9b668b');
rect(16,290,276,35,'#070f1c');poly([[16,290],[24,283],[300,283],[292,290]],'#645069');poly([[292,290],[300,283],[300,319],[292,325]],'#392c46');rect(19,293,270,28,'#292136');for(const xx of [32,270]){rect(xx,276,6,13,'#151b28');rect(xx+1,279,3,3,'#7c7482');rect(xx,322,5,8,'#111924');}line(288,286,307,277,'#0a111d',2);line(307,277,307,302,'#0a111d',2);
g.save();g.globalAlpha=.25+.75*power[0];text('DURIANO',30,315,24,violet);text('ARCADE',206,312,10,rose);g.restore();if(near){glow(143,312,130,'#bd78d41b');line(0,351,285,351,'#bb86bd66',1);}
// Dedicated illuminated durian marker, bolted onto the side pier.
rect(309,303,45,53,'#111c27');rect(312,306,39,47,'#45503c');rect(314,308,35,43,'#1b2726');for(let yy=0;yy<7;yy++)for(let xx=0;xx<7;xx++)if(Math.abs(xx-3)+Math.abs(yy-3)<5)rect(318+xx*4,315+yy*4,3,3,near>.2?(yy<4?lime:'#839450'):'#46543c');rect(326,326,3,3,'#112024');rect(338,326,3,3,'#112024');text('24H',321,348,7,lime);
// Terminal built into a structural pier; the entire visible screen has one DOM target.
poly([[284,355],[421,360],[432,483],[409,510],[283,510]],'#171d2c');poly([[421,360],[435,369],[446,491],[432,483]],'#3a304b');rect(284,357,137,5,'#78617f');
rect(425,374,10,115,'#040b16aa');for(const yy of [383,465]){rect(427,yy,14,5,'#111b26');rect(432,yy+1,2,2,'#9995a0');}glow(420,428,58,'#b992d214');const q=durianoTerminal;rect(q.x-4,q.y-4,q.w+8,q.h+8,'#51455f');rect(q.x-1,q.y-1,q.w+2,q.h+2,hot?'#dab2e4':'#82718e');rect(q.x,q.y,q.w,q.h,'#0a1220');
text('DurianoBot',q.x+9,q.y+17,14,near>.2?'#e2c7ed':'#9287a0');
if(thumbs[0].complete&&thumbs[0].naturalWidth){g.save();g.globalAlpha=terminalPower;const im=thumbs[0],ratio=Math.min((q.w-12)/im.naturalWidth,58/im.naturalHeight),iw=im.naturalWidth*ratio,ih=im.naturalHeight*ratio;g.drawImage(im,q.x+(q.w-iw)/2,q.y+23+(58-ih)/2,iw,ih);g.restore();}
rect(q.x+6,q.y+83,q.w-12,20,hot?'#3d344c':'#24283a');text('View case study →',q.x+9,q.y+96,9,hot?'#e9f7bf':'#c8daa0');
rect(293,492,111,3,'#665775');rect(302,495,35,3,'#232c3a');rect(381,495,5,3,lime);
for(let i=0;i<9;i++){g.save();g.globalAlpha=(.08+near*.12)*(1-i/10);rect(35+(i*13)%24,523+i*5,40-i*2,2,'#d6af7b');rect(292+(i*23)%37,525+i*6,78-i*5,1,'#c5a3df');g.restore();}
if(hot)glow(355,427,85,'#dba3e426');
// Broken horizontal reflections, weaker than the source lights.
for(let i=0;i<14;i++){g.save();g.globalAlpha=near*.16*(1-i/15);rect(20+(i*31)%39,528+i*5,220-i*9,2,i%3?rose:violet);rect(313+(i*7)%17,525+i*4,24-i,1,lime);g.restore();}
if(!reduced&&near>.8){const pulse=Math.max(0,Math.sin(t*.35)-.97)*5;g.save();g.globalAlpha=pulse;rect(24,321,260,1,violet);g.restore();}
g.restore();
}

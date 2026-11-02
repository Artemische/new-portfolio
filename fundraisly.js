// Layered investor-network office. Lighting follows scene progress in both directions.
const fundraislyTerminal={x:293,y:373,w:137,h:112};
function fundraislyScreenBounds(){const k=w<700?.8:1,q=fundraislyTerminal;return {x:q.x*k,y:515+(q.y-515)*k,w:q.w*k,h:q.h*k};}
function fundraislyFacade(c,lit,t){
 const world=440+clamp((p-.15)/.85)*3900,near=lit?ease((510-Math.abs(world-(c.x+170)))/340):0;
 const cyan=c.color,hot=screenHover===1,power=.22+.78*near;
 g.save();g.translate(c.x,515);g.scale(w<700?.8:1,w<700?.8:1);g.translate(0,-515);
 poly([[0,236],[411,236],[446,250],[446,515],[0,515]],'#111f2a');rect(7,244,404,268,'#20313b');
 poly([[411,244],[446,256],[446,515],[411,515]],'#12232e');
 for(let yy=250;yy<510;yy+=17){rect(8,yy,402,1,'#3c4c512f');for(let xx=12+(yy%34?0:26);xx<408;xx+=52){rect(xx,yy,1,16,'#09161e77');if((xx+yy)%3===0)rect(xx+4,yy+4,23,1,'#68746e18');}}
 for(let i=0;i<20;i++){const xx=17+i*19;rect(xx,251+(i*31)%250,1,7+i%17,'#030b1540');}
 rect(-7,235,426,8,'#516169');rect(-7,235,426,2,'#7a8c8d');rect(8,505,404,10,'#050e16');
 // Bolted, extruded sign; no pulsing of the brand lettering.
 for(const xx of [32,270]){rect(xx,267,7,17,'#0b151d');rect(xx+2,270,3,3,'#829a9b');}
 poly([[19,282],[27,275],[302,275],[294,282]],'#46626a');poly([[294,282],[302,275],[302,322],[294,329]],'#28464f');
 rect(19,282,275,47,'#08131d');rect(23,286,267,39,'#142c35');text('FUNDRAISLY',34,310,26,lit?'#9fe5e4':'#506e76');text('INVESTOR NETWORK',35,322,8,'#83adb2');
 line(300,286,316,269,'#080e16',2);line(316,269,416,269,'#0a121c',2);line(416,269,416,350,'#0a121c',2);
 // Deep window reveals around a dark room and a perspective floor.
 rect(17,346,270,159,'#050d16');poly([[17,346],[31,360],[31,491],[17,505]],'#3c515b');poly([[17,346],[287,346],[272,360],[31,360]],'#101b26');poly([[17,505],[31,491],[272,491],[287,505]],'#40565d');
 rect(31,360,241,131,'#0b1722');poly([[31,491],[272,491],[231,452],[75,452]],'#1c3039');
 for(let i=0;i<7;i++)line(31+i*40,491,75+i*26,452,'#61979621');for(let i=0;i<4;i++)line(40,458+i*i*3,268,458+i*i*3,'#5b858223');
 // Dim rear workstations establish the room beyond the central graph display.
 for(let i=0;i<3;i++){rect(48+i*70,371,48,31,'#152d38');rect(51+i*70,374,42,25,'#11232d');for(let j=0;j<3;j++)rect(55+i*70,379+j*5,23-j*5,1,'#558b8b50');rect(69+i*70,402,5,7,'#263f48');}
 rect(52,470,203,7,'#050e17');rect(52,465,203,5,'#3b545d');rect(61,477,5,14,'#182a35');rect(244,477,5,14,'#182a35');
 // The network is on a framed display inside the room, not painted on the glass.
 rect(60,398,196,68,'#020a13');poly([[60,398],[65,392],[261,392],[256,398]],'#37525d');rect(64,401,188,60,'#172f39');rect(68,405,180,52,'#0a1d29');
 const pts=[[82,431],[116,416],[147,443],[184,420],[233,434]],levels=pts.map((_,i)=>.16+.84*ease((near-i*.12)/.42));
 pts.forEach((pt,i)=>{if(i){g.save();g.globalAlpha=levels[i];line(...pts[i-1],...pt,cyan,1);g.restore();}g.save();g.globalAlpha=levels[i];rect(pt[0]-3,pt[1]-3,6,6,cyan);rect(pt[0]-1,pt[1]-1,2,2,'#d6fcdd');g.restore();});
 g.save();g.globalAlpha=power*.4;line(116,416,184,420,cyan);line(82,431,147,443,cyan);g.restore();
 if(!reduced&&near>.65){const u=(t*.12)%1;rect(116+(184-116)*u,416+4*u,2,2,'#c7f4e9');}
 rect(150,466,7,5,'#496872');rect(133,471,43,2,'#354b55');
 glow(154,440,110,'#67c9d017');
 // Glass reflections and foreground metal frames stay above the interior.
 poly([[35,361],[44,361],[112,490],[102,490]],'#b6e6e30b');poly([[228,361],[234,361],[271,429],[271,444]],'#b6e6e30a');
 for(let i=0;i<6;i++)rect(38+i*39,363+(i%3)*7,3,14,'#a5d7e010');
 rect(29,357,4,137,'#55717b');rect(270,357,5,137,'#4c6670');rect(29,357,246,3,'#71949b');rect(171,361,3,132,'#2b454f');rect(30,490,243,4,'#58737b');rect(33,361,237,5,'#020a1466');
 poly([[-5,334],[292,334],[302,347],[-12,347]],'#3e515b');rect(-12,347,314,7,'#0d1b26');rect(-9,347,307,2,'#65a4ad88');
 // Terminal mounted in an architectural pier, with a side wall and cast shadow.
 rect(286,345,147,163,'#1d303a');poly([[433,345],[446,356],[446,508],[433,508]],'#344851');rect(289,350,141,4,'#557079');rect(428,374,10,119,'#030c1688');
 for(const yy of [380,470]){rect(429,yy,14,5,'#111c25');rect(437,yy+1,2,2,'#8da6a5');}
 const q=fundraislyTerminal;rect(q.x-3,q.y-3,q.w+6,q.h+6,'#58737b');rect(q.x,q.y,q.w,q.h,'#07121e');
 const tp=.30+.70*ease((near-.50)/.45);g.save();g.globalAlpha=hot?1:tp;
 text('Fundraisly',q.x+9,q.y+18,15,'#b1e9e4');
 const im=thumbs[1];if(im.complete&&im.naturalWidth){const k=Math.min(121/im.naturalWidth,58/im.naturalHeight),iw=im.naturalWidth*k,ih=im.naturalHeight*k;g.drawImage(im,q.x+(q.w-iw)/2,q.y+25,iw,ih);}
 rect(q.x+5,q.y+87,q.w-10,20,hot?'#28454e':'#17313b');text('View case study →',q.x+8,q.y+100,12*.62,'#b9eee7');g.restore();
 if(hot){g.strokeStyle=cyan;g.strokeRect(q.x,q.y,q.w,q.h);glow(q.x+65,q.y+50,76,'#72dfe61c');}
 rect(296,495,125,3,'#455b63');for(let i=0;i<14;i++){g.save();g.globalAlpha=power*.13*(1-i/15);rect(25+(i*23)%31,526+i*5,235-i*9,2,cyan);rect(302+(i*13)%23,523+i*6,94-i*4,1,cyan);g.restore();}
 g.restore();
}

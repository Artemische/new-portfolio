// Discrete route control: one recognised gesture drives exactly one stop transition.
// current = arrived stop, target = destination, p = visual progress. They are kept
// apart so window resize, orientation or address-bar changes never move the selection.
const STOPS=[
 {id:'entrance',p:0,proj:-1,name:'Entrance'},
 {id:'duriano',p:.25,proj:0},
 {id:'fundraisly',p:.38,proj:1},
 {id:'molis',p:.455,proj:6},
 {id:'ggofs',p:.575,proj:2},
 {id:'focolor',p:.638,proj:3},
 {id:'fuji',p:.775,proj:3,name:'Fuji Highway'},
 {id:'automation',p:.935,proj:4},
 {id:'contact',p:.98,proj:5,name:'Get in touch'},
];
// Gesture-recognition settings. Tuned on a wheel mouse and a trackpad; the quiet
// window swallows a trackpad's inertial tail so it cannot start the next stop.
const GESTURE={wheelStep:46,lineHeight:16,pageFraction:.8,quiet:150,swipeMin:44,tapMax:12,vertBias:1.2};
// states: idle · transitioning · settling (awaiting gesture end) · modal.
const route={state:'idle',current:0,target:0,from:0,kind:null,episode:false,accum:0,accumDir:0,lastInput:0,hintCleared:false};
const signalState={active:false,start:0,destination:0,committed:false,raw:0,velocity:0,cooldown:0,opacity:0,quiet:false};
const transfer={kind:null,start:0,from:0,to:0,duration:820,hold:160};
const BOARD_START=.68734,BOARD_END=.700276,EXIT_START=.893385,EXIT_END=.896472;
// Native scroll is no longer an input; these stay as no-ops for the few callers.
function scrollPosition(){return 0;}
function setScrollPosition(){}
function stopIndexFor(p){let best=0,d=1e9;for(let i=0;i<STOPS.length;i++){const e=Math.abs(STOPS[i].p-p);if(e<d){d=e;best=i;}}return best;}
function episodeSegment(a,b){return Math.max(STOPS[a].p,STOPS[b].p)>.639;}

function requestJump(v){entranceTravel=null;const s=signalState;v=clamp(v);s.quiet=reduced;s.raw=0;s.destination=v;s.start=performance.now();s.active=true;s.committed=false;s.velocity=0;transfer.kind=null;roofState.turnUntil=0;navigating=false;screenLook=null;preloadCaseAt(v);captureSignal();$('#signal').classList.toggle('quiet',s.quiet);$('#signal').style.visibility='visible';$('#signal').setAttribute('aria-hidden','false');}
function commitJump(v){dir=v<p?-1:1;p=last=target=v;actor.camera=actor.motion=0;heroGait.section='';heroGait.rest=1000;heroGait.moving=false;screenHover=-1;screenLook=null;active=-1;transfer.kind=null;if(v>.60&&!molisState.restored)restoreMolis(true);roofState.departing=false;roofState.facingCity=v>=.98;roofState.arrival=v>=.98?1:0;roofState.lastPosition=roofPath(v).distance;updateHeroGait(v,1000);updateUI();updateDriveUI();}
function startTransfer(kind,ms){transfer.kind=kind;transfer.start=ms;transfer.from=kind==='board'?BOARD_START:EXIT_START;transfer.to=kind==='board'?BOARD_END:EXIT_END;p=target=transfer.from;signalState.velocity=0;}

// One controller for every input: gestures, buttons, keyboard and the map.
function startTransition(next,viaMap){
 next=clamp(Math.round(next),0,STOPS.length-1);if(next===route.current&&route.state!=='transitioning')return false;
 route.from=route.current;route.target=next;route.accum=0;route.accumDir=0;entranceTravel=null;transfer.kind=null;
 const forward=STOPS[next].p>=STOPS[route.current].p;route.episode=episodeSegment(route.current,next);
 dir=forward?1:-1;signalState.velocity=0;preloadCaseAt(STOPS[next].p);
 // Glitch when: reduced motion, a direct map pick, a non-adjacent hop, or a reverse
 // that would otherwise run the drive or the stairs mechanically backwards.
 const glitch=reduced||viaMap||Math.abs(next-route.current)>1||(!forward&&route.episode);
 route.state='transitioning';
 if(route.current===0&&forward&&!glitch){route.kind='enter';entranceTravel={start:performance.now(),from:p,duration:1700*(1-p/.20)};}
 else if(glitch){route.kind='glitch';requestJump(STOPS[next].p);}
 else route.kind='walk';
 updateUnifiedUI();return true;
}
function routeGo(step){if(route.state!=='idle')return false;return startTransition(route.current+step,false);}
function routeTo(index){return startTransition(index,true);}
function routeSkip(){if(route.state==='transitioning'&&route.kind!=='glitch'&&route.episode){route.kind='glitch';requestJump(STOPS[route.target].p);updateUnifiedUI();}}
function arriveStop(){route.current=route.target;route.state='settling';route.lastInput=performance.now();route.kind=null;route.episode=false;signalState.velocity=0;transfer.kind=null;if(route.current>0)route.hintCleared=true;updateUI();updateUnifiedUI();updateDriveUI();}

// The glitch overlay is its own clock; commitJump snaps the world at 36% of the tear.
function advanceSignal(ms){const s=signalState,duration=s.quiet?220:460,age=ms-s.start;
 s.opacity=age<duration*.36?Math.max(s.opacity,clamp(age/(duration*.30))):age<duration*.64?1:1-clamp((age-duration*.64)/(duration*.36));
 $('#signal').style.opacity=s.opacity;$('#signal').classList.toggle('tearing',!s.quiet&&age<duration*.64);drawSignal(age/duration,s.quiet);
 if(age>=duration*.36&&!s.committed){commitJump(s.destination);s.committed=true;}
 if(age>=duration){s.active=false;s.opacity=0;s.cooldown=ms+600;$('#signal').style.visibility='hidden';$('#signal').setAttribute('aria-hidden','true');}
}
function advanceJourney(ms,dt){const s=signalState;
 if($('#modal').open||$('#map').open){route.state='modal';return;}
 if(route.state==='modal'){route.state='settling';route.lastInput=ms;route.accum=0;route.accumDir=0;return;}
 if(s.active){advanceSignal(ms);if(!s.active)arriveStop();return;}
 if(route.state==='settling'){if(ms-route.lastInput>GESTURE.quiet){route.state='idle';route.accum=0;route.accumDir=0;}return;}
 if(route.state!=='transitioning')return;
 const toP=STOPS[route.target].p,forward=toP>=STOPS[route.from].p;
 // Entering the city: the CRT dive eases in, then the heroine walks on to the first stop.
 if(route.kind==='enter'){const a=entranceTravel;if(a){const u=clamp((ms-a.start)/a.duration);p=last=target=lerp(a.from,.20,ease(u));s.velocity=0;if(u>=1){entranceTravel=null;route.kind='walk';}return;}route.kind='walk';}
 // A boarding or exit episode runs on its own clock once started.
 if(transfer.kind){const age=ms-transfer.start;p=lerp(transfer.from,transfer.to,clamp(age/transfer.duration));target=p;s.velocity=0;if(age>=transfer.duration+transfer.hold)transfer.kind=null;return;}
 target=toP;
 const metric=movementMetric(p);
 const walking=p<BOARD_START||p>=EXIT_END,maxSpeed=walking?Math.min(.000048,metric.speed/metric.derivative,p>=.966&&p<.968?.002/350:1):.000100;
 let desired=clamp((target-p)/105,-maxSpeed,maxSpeed);
 if(p>=.655&&p<BOARD_START&&desired>0){const distance=boardingPoint(p).remaining;desired*=.25+.75*clamp(distance/35);}
 if(Math.sign(desired)!==Math.sign(s.velocity))s.velocity=0;
 s.velocity+=(desired-s.velocity)*(1-Math.exp(-dt/85));let move=s.velocity*dt;if(Math.abs(move)>Math.abs(target-p))move=target-p;const previous=p;p+=move;
 if(Math.abs(target-p)<.000015){p=target;s.velocity=0;}
 if(forward&&previous<BOARD_START&&p>=.655&&move>=0&&boardingPoint(p).remaining<.3){startTransfer('board',ms);return;}
 if(forward&&previous<EXIT_START&&p>=EXIT_START&&move>=0){startTransfer('exit',ms);return;}
 if(p===target&&!transfer.kind)arriveStop();
}

// World-space velocity avoids the very short exit/stair progress ranges becoming sprints.
function movementMetric(v){const a=heroPath(v),b=heroPath(Math.min(1,v+.00001)),derivative=a.section===b.section?Math.max(1,Math.abs(b.position-a.position)/.00001):4588;const streetSpeed=.000048*3900/.85;let speed=streetSpeed;
if(v>=.945&&v<.966)speed=streetSpeed*Math.hypot(22,18)/75;
return {derivative,speed};}

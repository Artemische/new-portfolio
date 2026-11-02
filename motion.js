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
// flipMin is the opposite delta that counts as a new gesture: inertia never changes sign.
const GESTURE={wheelStep:46,lineHeight:16,pageFraction:.8,quiet:150,flipMin:12,swipeMin:44,tapMax:12,vertBias:1.2};
// states: idle · transitioning · settling (awaiting gesture end) · modal.
const route={state:'idle',current:0,target:0,from:0,kind:null,episode:false,clock:0,held:false,accum:0,accumDir:0,gestureDir:0,lastInput:0,hintCleared:false};
const signalState={active:false,start:0,destination:0,committed:false,raw:0,velocity:0,cooldown:0,opacity:0,quiet:false};
const BOARD_START=.68734,BOARD_END=.700276,EXIT_START=.893385,EXIT_END=.896472;
// Authored episodes, keyed by destination stop: [end of leg, leg duration in ms].
// p is a function of the episode clock, so every beat keeps its length whatever its
// share of p, and a dialog simply stops the clock. Walking legs match WALK; the exit
// turn and brake keep a 14:9 ratio so parkX meets the brake curve at the same speed.
const EPISODES={
 6:[[.655,350],[BOARD_START,700],[BOARD_END,1000],[.7089,450],[.75055,1400],[.775,1000]],
 7:[[.8461,2400],[.87795,1400],[.889,900],[EXIT_START,250],[EXIT_END,1000],[.90,900],[.9175,800],[.935,900]],
 8:[[.94,320],[.944,1300],[.945,600],[.966,2200],[.968,220],[.98,700]],
};
// Street pace in p/ms (about .33px/ms) and the braking that ends a walk without a dead tail.
const WALK=.000072,BRAKE=.00000018;
function episodeProgress(legs,from,clock){for(let i=0;i<legs.length;i++){const [to,ms]=legs[i],end=i===legs.length-1;if(clock<ms||end){let u=clamp(clock/ms);if(i===0)u=leadIn(u);if(end)u=leadOut(u);return lerp(from,to,u);}clock-=ms;from=to;}}
// Native scroll is no longer an input; these stay as no-ops for the few callers.
function scrollPosition(){return 0;}
function setScrollPosition(){}
function stopIndexFor(p){let best=0,d=1e9;for(let i=0;i<STOPS.length;i++){const e=Math.abs(STOPS[i].p-p);if(e<d){d=e;best=i;}}return best;}
function episodeSegment(a,b){return Math.max(STOPS[a].p,STOPS[b].p)>.639;}

function requestJump(v){entranceTravel=null;const s=signalState;v=clamp(v);s.quiet=reduced;s.raw=0;s.destination=v;s.start=performance.now();s.active=true;s.committed=false;s.velocity=0;roofState.turnUntil=0;navigating=false;screenLook=null;preloadCaseAt(v);captureSignal();$('#signal').classList.toggle('quiet',s.quiet);$('#signal').style.visibility='visible';$('#signal').setAttribute('aria-hidden','false');}
function commitJump(v){dir=v<p?-1:1;p=last=target=v;actor.camera=actor.motion=0;heroGait.section='';heroGait.rest=1000;heroGait.moving=false;screenHover=-1;screenLook=null;active=-1;if(v>.60&&!molisState.restored)restoreMolis(true);roofState.departing=false;roofState.facingCity=v>=.98;roofState.arrival=v>=.98?1:0;roofState.lastPosition=roofPath(v).distance;updateHeroGait(v,1000);updateUI();updateDriveUI();}

// One controller for every input: gestures, buttons, keyboard and the map.
function startTransition(next,viaMap){
 next=clamp(Math.round(next),0,STOPS.length-1);if(next===route.current&&route.state!=='transitioning')return false;
 route.from=route.current;route.target=next;route.accum=0;route.accumDir=0;route.clock=0;entranceTravel=null;
 const forward=STOPS[next].p>=STOPS[route.current].p;route.episode=episodeSegment(route.current,next);
 dir=forward?1:-1;signalState.velocity=0;preloadCaseAt(STOPS[next].p);
 // Glitch when: reduced motion, a direct map pick, a non-adjacent hop, or a reverse
 // that would otherwise run the drive or the stairs mechanically backwards.
 const glitch=reduced||viaMap||Math.abs(next-route.current)>1||(!forward&&route.episode);
 route.state='transitioning';
 if(route.current===0&&forward&&!glitch){route.kind='enter';entranceTravel={age:0,from:p,duration:1300*(1-p/.15)};}
 else if(glitch){route.kind='glitch';requestJump(STOPS[next].p);}
 else route.kind='walk';
 updateUnifiedUI();return true;
}
function routeGo(step){if(route.state!=='idle')return false;return startTransition(route.current+step,false);}
function routeTo(index){return startTransition(index,true);}
function routeSkip(){if(route.state==='transitioning'&&route.kind!=='glitch'&&route.episode){route.kind='glitch';requestJump(STOPS[route.target].p);updateUnifiedUI();}}
function arriveStop(){route.current=route.target;route.state='settling';route.lastInput=performance.now();route.kind=null;route.episode=false;signalState.velocity=0;if(route.current>0)route.hintCleared=true;updateUI();updateUnifiedUI();updateDriveUI();}

// The glitch overlay is its own clock; commitJump snaps the world at 36% of the tear.
function advanceSignal(ms){const s=signalState,duration=s.quiet?220:460,age=ms-s.start;
 s.opacity=age<duration*.36?Math.max(s.opacity,clamp(age/(duration*.30))):age<duration*.64?1:1-clamp((age-duration*.64)/(duration*.36));
 $('#signal').style.opacity=s.opacity;$('#signal').classList.toggle('tearing',!s.quiet&&age<duration*.64);drawSignal(age/duration,s.quiet);
 if(age>=duration*.36&&!s.committed){commitJump(s.destination);s.committed=true;}
 if(age>=duration){s.active=false;s.opacity=0;s.cooldown=ms+600;$('#signal').style.visibility='hidden';$('#signal').setAttribute('aria-hidden','true');}
}
function advanceJourney(ms,dt){const s=signalState;
 // A dialog pauses whatever is running; closing it waits for a fresh gesture.
 if($('#modal').open||$('#map').open){route.held=true;if(s.active)s.start+=dt;return;}
 if(route.held){route.held=false;route.accum=0;route.accumDir=0;route.lastInput=ms;if(route.state==='idle')route.state='settling';}
 if(s.active){advanceSignal(ms);if(!s.active)arriveStop();return;}
 if(route.state==='settling'){if(ms-route.lastInput>GESTURE.quiet){route.state='idle';route.accum=0;route.accumDir=0;}return;}
 if(route.state!=='transitioning')return;
 // The CRT dive ends where the street starts moving (.15), landing exactly on walking speed.
 if(route.kind==='enter'){const a=entranceTravel;if(a){a.age+=dt;const u=clamp(a.age/a.duration),d=.15-a.from,m=WALK*a.duration/d;p=last=target=a.from+d*(u*u*(3-2*u)+m*u*u*(u-1));s.velocity=u<1?0:WALK;if(u>=1){entranceTravel=null;route.kind='walk';}return;}route.kind='walk';}
 if(route.episode){const legs=EPISODES[route.target];route.clock+=dt;p=target=episodeProgress(legs,STOPS[route.from].p,route.clock);if(route.clock>=legs.reduce((sum,leg)=>sum+leg[1],0))arriveStop();return;}
 target=STOPS[route.target].p;
 const metric=movementMetric(p),maxSpeed=Math.min(WALK,metric.speed/metric.derivative);
 const desired=Math.sign(target-p)*Math.min(maxSpeed,Math.sqrt(2*BRAKE*Math.abs(target-p)));
 if(Math.sign(desired)!==Math.sign(s.velocity))s.velocity=0;
 // Speeding up is smoothed; slowing down follows the curve exactly, or she hits the stop at speed.
 s.velocity=Math.abs(desired)<Math.abs(s.velocity)?desired:s.velocity+(desired-s.velocity)*(1-Math.exp(-dt/85));let move=s.velocity*dt;if(Math.abs(move)>Math.abs(target-p))move=target-p;p+=move;
 if(Math.abs(target-p)<.000015){p=target;s.velocity=0;}
 if(p===target)arriveStop();
}

// World-space velocity keeps the walk even where the street camera changes rate.
function movementMetric(v){const a=heroPath(v),b=heroPath(Math.min(1,v+.00001)),derivative=a.section===b.section?Math.max(1,Math.abs(b.position-a.position)/.00001):4588;return {derivative,speed:WALK*3900/.85};}

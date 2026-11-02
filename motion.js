// Native input, bounded travel and timed actions are separate clocks.
const signalState={active:false,start:0,destination:0,committed:false,raw:0,velocity:0,cooldown:0,opacity:0};
const transfer={kind:null,start:0,from:0,to:0,duration:820,hold:160};
const BOARD_START=.68734,BOARD_END=.700276,EXIT_START=.893385,EXIT_END=.896472;
function scrollPosition(){return scrollToStory(scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight));}
function setScrollPosition(v){scrollTo({top:storyToScroll(v)*Math.max(1,document.documentElement.scrollHeight-innerHeight),behavior:'instant'});signalState.raw=scrollPosition();}
function stableDestination(v){if(v>=.655&&v<.75055)return v>=p?.75055:.638;if(v>=.8461&&v<.935)return v>=p?.94:.775;return v;}
function requestJump(v,automatic=false){entranceTravel=null;const s=signalState;v=clamp(automatic?stableDestination(v):v);s.auto=automatic;s.quiet=reduced||(automatic&&performance.now()<s.cooldown);s.raw=scrollPosition();s.destination=v;s.start=performance.now();s.active=true;s.committed=false;s.velocity=0;s.reverseBudget=0;transfer.kind=null;roofState.turnUntil=0;navigating=false;screenLook=null;preloadCaseAt(v);captureSignal();$('#signal').classList.toggle('quiet',s.quiet);$('#signal').style.visibility='visible';$('#signal').setAttribute('aria-hidden','false');}
function commitJump(v){dir=v<p?-1:1;p=last=target=v;setScrollPosition(v);actor.camera=actor.motion=0;heroGait.section='';heroGait.rest=1000;heroGait.moving=false;screenHover=-1;screenLook=null;active=-1;transfer.kind=null;if(v>.60&&!molisState.restored)restoreMolis(true);roofState.departing=false;roofState.facingCity=v>=.98;roofState.arrival=v>=.98?1:0;roofState.lastPosition=roofPath(v).distance;updateHeroGait(v,1000);updateUI();updateDriveUI();}
function startTransfer(kind,ms){transfer.kind=kind;signalState.reverseBudget=0;transfer.start=ms;transfer.from=kind==='board'?BOARD_START:EXIT_START;transfer.to=kind==='board'?BOARD_END:EXIT_END;p=target=transfer.from;signalState.velocity=0;setScrollPosition(p);}
function advanceJourney(ms,dt){const s=signalState;const raw=scrollPosition();if($('#modal').open||$('#map').open)return;
if(entranceTravel){const a=entranceTravel,u=clamp((ms-a.start)/a.duration);p=last=target=lerp(a.from,.20,ease(u));setScrollPosition(p);s.velocity=0;if(u===1)entranceTravel=null;return;}
if(s.active){const duration=s.quiet?220:460;let age=ms-s.start;if(Math.abs(raw-s.raw)>.025){s.destination=s.auto?stableDestination(raw):raw;s.raw=raw;s.committed=false;s.start=ms;age=0;}
s.opacity=age<duration*.36?Math.max(s.opacity,clamp(age/(duration*.30))):age<duration*.64?1:1-clamp((age-duration*.64)/(duration*.36));$('#signal').style.opacity=s.opacity;$('#signal').classList.toggle('tearing',!s.quiet&&age<duration*.64);drawSignal(age/duration,s.quiet);
if(age>=duration*.36&&!s.committed){commitJump(s.destination);s.committed=true;}if(age>=duration){s.active=false;s.opacity=0;s.cooldown=ms+600;$('#signal').style.visibility='hidden';$('#signal').setAttribute('aria-hidden','true');}return;}
const inputDelta=raw-s.raw;s.raw=raw;const gap=raw-p;s.reverseBudget=inputDelta>.00002?0:(s.reverseBudget||0)+Math.max(0,-inputDelta);
// Only an actual negative native-input delta can request reverse transport.
// Camera lag, scroll rounding and velocity settling are not reverse input.
if(s.reverseBudget>0&&gap<-.00002&&p>=BOARD_END&&p<.935){if(s.reverseBudget>.0003)requestJump(raw<.638?raw:.638);else{target=p;s.velocity=0;}return;}
if(transfer.kind){if(inputDelta<-.002){requestJump(transfer.kind==='board'?.638:.94);return;}const age=ms-transfer.start;p=lerp(transfer.from,transfer.to,clamp(age/transfer.duration));target=p;setScrollPosition(p);s.velocity=0;if(age>=transfer.duration+transfer.hold)transfer.kind=null;return;}
if(p<.18&&gap>.04){enterCity();return;}
if(Math.abs(gap)>.060||Math.abs(inputDelta)>.045){requestJump(raw,true);return;}
// Before leaving contemplation, turn the whole body, then allow the first step.
if(roofState.facingCity&&gap<-.00035&&p>=.974){roofState.facingCity=false;roofState.departing=true;roofState.settleStart=0;roofState.arrival=0;roofState.direction=-1;p=last=Math.min(p,.98);dir=-1;roofState.turnUntil=ms+180;roofState.turnTarget=p-Math.min(.006,Math.abs(gap));s.velocity=0;}
if(roofState.turnUntil){if(ms<roofState.turnUntil){target=p;setScrollPosition(p);return;}roofState.turnUntil=0;setScrollPosition(roofState.turnTarget);return;}
const metric=movementMetric(p),backlog=Math.min(.006,metric.speed*260/metric.derivative);target=clamp(raw,p-backlog,p+backlog);if(Math.abs(raw-target)>.0001)setScrollPosition(target);
const walking=p<BOARD_START||p>=EXIT_END,maxSpeed=walking?Math.min(.000048,metric.speed/metric.derivative,p>=.966&&p<.968?.002/350:1):.000100;
let desired=clamp((target-p)/105,-maxSpeed,maxSpeed);
if(p>=.655&&p<BOARD_START&&desired>0){const distance=boardingPoint(p).remaining;desired*=.25+.75*clamp(distance/35);}
// Brake before changing direction; never drift away from the actual target.
if(Math.sign(desired)!==Math.sign(s.velocity))s.velocity=0;
s.velocity+=(desired-s.velocity)*(1-Math.exp(-dt/85));let move=s.velocity*dt;if(Math.abs(move)>Math.abs(target-p))move=target-p;const previous=p;p+=move;
if(Math.abs(target-p)<.000015){p=target;s.velocity=0;}
if(previous<BOARD_START&&p>=.655&&move>=0&&boardingPoint(p).remaining<.3){startTransfer('board',ms);return;}
if(previous<EXIT_START&&p>=EXIT_START&&move>=0){startTransfer('exit',ms);return;}
}

// World-space velocity avoids the very short exit/stair progress ranges becoming sprints.
function movementMetric(v){const a=heroPath(v),b=heroPath(Math.min(1,v+.00001)),derivative=a.section===b.section?Math.max(1,Math.abs(b.position-a.position)/.00001):4588;const streetSpeed=.000048*3900/.85;let speed=streetSpeed;
if(v>=.945&&v<.966)speed=streetSpeed*Math.hypot(22,18)/75;
return {derivative,speed};}

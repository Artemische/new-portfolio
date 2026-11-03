// Every input funnels through the single route controller (routeGo/routeTo).
// Nothing is queued: during a transition and its settle window, input is only
// read to detect when the current gesture has ended, never to stack another stop.
(function(){
 const dialogOpen=()=>$('#modal').open||$('#map').open;
 const onInteractive=el=>!!(el&&el.closest&&el.closest('button,a,input,textarea,select,summary,label,[role="button"],[contenteditable],dialog'));

 // Wheel — normalised for deltaMode. Ctrl/Cmd wheel stays with the browser (zoom);
 // when a dialog is open the event is left alone so the panel scrolls natively.
 addEventListener('wheel',e=>{
  if(e.ctrlKey||e.metaKey)return;
  if(dialogOpen())return;
  e.preventDefault();
  const now=performance.now(),quiet=now-route.lastInput>GESTURE.quiet;route.lastInput=now;
  const unit=e.deltaMode===1?GESTURE.lineHeight:e.deltaMode===2?innerHeight*GESTURE.pageFraction:1;
  const dy=e.deltaY*unit;if(!dy)return;
  const d=Math.sign(dy);
  if(route.state==='transitioning')route.gestureDir=d;
  // Inertia keeps its sign, so a firm reversal after arrival is a new gesture.
  if(route.state==='settling'&&d!==route.gestureDir&&Math.abs(dy)>=GESTURE.flipMin)route.state='idle';
  if(route.state!=='idle')return; // absorb inertia / mid-transition events without acting
  if(d!==route.accumDir||quiet){route.accum=0;route.accumDir=d;}
  route.accum+=dy;
  if(Math.abs(route.accum)>=GESTURE.wheelStep){route.accum=0;route.gestureDir=d;routeGo(d);}
 },{passive:false});

 // Single-finger vertical swipe. Multi-touch is left untouched so pinch-to-zoom works.
 let sx=0,sy=0,sid=null,tracking=false,swiped=false;
 addEventListener('touchstart',e=>{tracking=false;if(dialogOpen()||e.touches.length>1||onInteractive(e.target))return;const t=e.touches[0];tracking=true;swiped=route.state!=='idle';sid=t.identifier;sx=t.clientX;sy=t.clientY;},{passive:true});
 addEventListener('touchmove',e=>{if(!tracking||dialogOpen())return;if(e.touches.length>1){tracking=false;return;}const t=[...e.touches].find(x=>x.identifier===sid)||e.touches[0];const dx=t.clientX-sx,dy=t.clientY-sy;if(Math.abs(dy)>Math.abs(dx)*GESTURE.vertBias&&Math.abs(dy)>GESTURE.tapMax){e.preventDefault();if(!swiped&&Math.abs(dy)>=GESTURE.swipeMin&&route.state==='idle'){swiped=true;route.lastInput=performance.now();routeGo(dy<0?1:-1);}}},{passive:false});
 addEventListener('touchend',()=>{tracking=false;},{passive:true});

 // Keyboard: forward/back keys drive one stop each. Auto-repeat never chains.
 addEventListener('keydown',e=>{
  if(dialogOpen()||e.repeat||e.ctrlKey||e.metaKey||e.altKey)return;
  const el=document.activeElement;if(el&&el.matches&&el.matches('input,textarea,select,[contenteditable]'))return;
  if((e.key===' '||e.key==='Spacebar')&&el&&el.matches&&el.matches('button,a'))return; // Space activates the focused control
  let step=0;
  if(e.key==='ArrowDown'||e.key==='ArrowRight'||e.key==='PageDown'||e.key===' '||e.key==='Spacebar')step=1;
  else if(e.key==='ArrowUp'||e.key==='ArrowLeft'||e.key==='PageUp')step=-1;
  if(!step)return;e.preventDefault();route.lastInput=performance.now();routeGo(step);
 });
})();

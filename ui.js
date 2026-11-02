// Shared navigation: the compact Back · stop · Next control, the map and the skip
// affordance. Every button routes through the one transition controller in motion.js.
let routeNav,routeName,routeBack,routeNext,routeSkipBtn,mapReturnFocus;
function stopLabel(i){const s=STOPS[i];return s.name||portfolio[s.proj].name;}
function stopNumber(i){const s=STOPS[i];return s.id==='entrance'?'00':s.id==='fuji'?'05':chapterNumber(s.proj);}
function initUnifiedUI(){
 routeNav=document.createElement('nav');routeNav.id='routeNav';routeNav.setAttribute('aria-label','Route');
 routeNav.innerHTML='<button id="routeBack" aria-label="Previous stop"><span>‹</span> Back</button><button id="routeName" aria-haspopup="dialog" aria-label="City map"></button><button id="routeNext" aria-label="Next stop">Next <span>›</span></button>';
 document.body.append(routeNav);
 routeBack=$('#routeBack');routeName=$('#routeName');routeNext=$('#routeNext');
 routeBack.onclick=()=>routeGo(-1);routeNext.onclick=()=>routeGo(1);routeName.onclick=()=>openMap(routeName);
 routeSkipBtn=document.createElement('button');routeSkipBtn.id='routeSkip';routeSkipBtn.hidden=true;routeSkipBtn.textContent='Skip ⏭';routeSkipBtn.onclick=routeSkip;document.body.append(routeSkipBtn);
 $('#viewProjects').onclick=()=>openMap($('#viewProjects'));$('#enter').onclick=enterCity;
 $('#menuBtn').onclick=()=>openMap($('#menuBtn'));$('#exploreProjects').onclick=()=>openMap($('#exploreProjects'));
 $('#map').addEventListener('keydown',trapCaseFocus);$('#map').addEventListener('close',()=>{route.accum=0;route.accumDir=0;route.lastInput=performance.now();if(mapReturnFocus?.isConnected)mapReturnFocus.focus({preventScroll:true});});
}
function openMap(trigger){entranceTravel=null;mapReturnFocus=trigger;signalState.velocity=0;updateUnifiedUI();$('#map').showModal();}
function updateUnifiedUI(){const entrance=route.current===0&&route.state!=='transitioning';document.body.classList.toggle('at-entrance',entrance);
 if(routeNav){routeNav.hidden=entrance;
  const current=Math.max(0,route.current);
  routeName.innerHTML='<b>'+stopNumber(current)+'</b> '+stopLabel(current)+' <span>＋</span>';
  routeName.setAttribute('aria-label','City map — '+stopLabel(current));
  routeBack.disabled=current<=0;routeNext.disabled=current>=STOPS.length-1;
 }
 if(routeSkipBtn)routeSkipBtn.hidden=!(route.state==='transitioning'&&route.kind==='walk'&&route.episode);
 document.querySelectorAll('.maplinks button').forEach(b=>{const v=+b.dataset.p;const selected=b.classList.contains('route-stop')?route.current===6:route.current>0&&Math.abs(v-STOPS[route.current].p)<.001;b.classList.toggle('active',selected);if(selected)b.setAttribute('aria-current','location');else b.removeAttribute('aria-current');});
 document.querySelectorAll('#progress button').forEach(b=>{const selected=b.classList.contains('active');b.setAttribute('aria-label',b.textContent.trim());if(selected)b.setAttribute('aria-current','location');else b.removeAttribute('aria-current');});
 if(entrance&&!route.hintCleared)$('#hint').textContent='Scroll or swipe to the next stop';
}

let entranceTravel=null;
function enterCity(){if(route.current!==0||route.state!=='idle')return;startTransition(1,false);}

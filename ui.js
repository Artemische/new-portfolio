// Shared navigation state, dialog focus, and compact location control.
let locationControl,mapReturnFocus;
function initUnifiedUI(){
locationControl=document.createElement('button');locationControl.id='locationControl';locationControl.setAttribute('aria-haspopup','dialog');locationControl.onclick=()=>openMap(locationControl);document.body.append(locationControl);
$('#viewProjects').onclick=()=>openMap($('#viewProjects'));$('#enter').onclick=enterCity;
$('#menuBtn').onclick=()=>openMap($('#menuBtn'));$('#exploreProjects').onclick=()=>openMap($('#exploreProjects'));
$('#map').addEventListener('keydown',trapCaseFocus);$('#map').addEventListener('close',()=>{if(mapReturnFocus?.isConnected)mapReturnFocus.focus({preventScroll:true});});
}
function openMap(trigger){entranceTravel=null;mapReturnFocus=trigger;signalState.velocity=0;setScrollPosition(p);updateUnifiedUI();$('#map').showModal();}
function updateUnifiedUI(){document.body.classList.toggle('at-entrance',p<.18);
const current=p<.19?-1:p>=.945?5:p>=.655&&p<.925?3:active;
const name=current<0?'Entrance':current===5?'Get in touch':portfolio[current].name;
if(locationControl){locationControl.textContent=(current<0?'00':chapterNumber(current))+' / '+name+'  ＋';locationControl.setAttribute('aria-label','City map — '+name);}
document.querySelectorAll('.maplinks button').forEach(b=>{const v=+b.dataset.p;const selected=b.classList.contains('route-stop')?p>=.75055&&p<.87795:current<0?v===0:Math.abs(v-portfolio[current].pos)<.001;b.classList.toggle('active',selected);if(selected)b.setAttribute('aria-current','location');else b.removeAttribute('aria-current');});
document.querySelectorAll('#progress button').forEach(b=>{const selected=b.classList.contains('active');b.setAttribute('aria-label',b.textContent.trim());if(selected)b.setAttribute('aria-current','location');else b.removeAttribute('aria-current');});
}

let entranceTravel=null;
function enterCity(){if(p>=.18)return;if(reduced){requestJump(.20);return;}entranceTravel={start:performance.now(),from:p,duration:1700*(1-p/.20)};signalState.velocity=0;}

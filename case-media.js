// Each entry owns a decoded image; repeat openings reuse it without a second fade.
const caseMedia={
0:{src:'duriano-material.webp',width:640,height:400,caption:'Existing project material'},
1:{src:'fundraisly-public.webp',width:1128,height:191,caption:'Current public company banner · Fundraisly on LinkedIn'},
2:{src:'ggofs-material.webp',width:960,height:600,caption:'Illustrated city scene · not a product screenshot'},
3:{src:'focolor-material.webp',width:640,height:400,caption:'Existing project material'},
4:{src:'automation-material.webp',width:960,height:600,caption:'Illustrated city scene · not a product screenshot'},
6:{src:'molis-original.webp',width:1200,height:686,caption:'Original website imagery · molis.by'}
};
const caseCache=new Map(),caseTimings=[];let caseAssetSuffix='',casePreloadDisabled=false;
function preloadCase(index,retry=false){const spec=caseMedia[index];if(!spec)return Promise.resolve(null);let entry=caseCache.get(index);if(entry&&!retry)return entry.promise;
entry={state:spec.src?'loading':'ready',image:null,requested:performance.now(),ready:null};caseCache.set(index,entry);
if(!spec.src){entry.ready=performance.now();entry.promise=Promise.resolve(entry);return entry.promise;}
const im=new Image();im.decoding='async';im.fetchPriority='low';im.alt=portfolio[index].name+' — '+spec.caption;im.width=spec.width;im.height=spec.height;entry.image=im;
entry.promise=new Promise(resolve=>{im.onload=async()=>{try{await im.decode();entry.state='ready';entry.ready=performance.now();}catch{entry.state='error';}resolve(entry);};im.onerror=()=>{entry.state='error';resolve(entry);};});im.src='assets/'+spec.src+caseAssetSuffix;return entry.promise;}
function preloadCaseAt(v){if(casePreloadDisabled)return;const hit=routeOrder.filter(i=>i!==5).find(i=>Math.abs(portfolio[i].pos-v)<.035);if(hit!==undefined)preloadCase(hit);}
function warmNearbyCases(){if(casePreloadDisabled||p<.19)return;preloadCaseAt(p);const cam=cityCamera(p);for(let i=0;i<5;i++){if(Math.abs(portfolio[i].x-cam-440)<900&&!thumbs[i].src){thumbs[i].decoding='async';thumbs[i].fetchPriority='low';thumbs[i].src='assets/'+['duriano-thumb.webp','fundraisly-thumb.webp','ggofs-thumb.webp','focolor-thumb.webp','automation-thumb.webp'][i];}}}
function caseVisualHTML(index){const m=caseMedia[index];if(!m.src)return '<div class="molis-editorial"><span>LIGHT / SPACE / ATMOSPHERE</span><b>MOLIS</b><i></i><small>Lighting & electrical goods</small></div>';return `<div class="case-image-slot" style="aspect-ratio:${m.width}/${m.height};max-width:${m.width}px" aria-busy="true"><span class="media-state" role="status">Loading image…</span></div>`;}
function attachCaseMedia(index,requestedAt){const modal=$('#modal'),slot=$('#modal .case-image-slot'),cached=caseCache.get(index),timing={project:portfolio[index].name,cache:cached?.state==='ready'?'decoded':'cold-or-pending',windowMs:performance.now()-requestedAt,imageMs:null,paintMs:null};caseTimings.push(timing);
const present=entry=>{if(!entry||!modal.open||modal.dataset.case!==String(index)||modal.dataset.request!==String(requestedAt))return;if(!slot){timing.imageMs=performance.now()-requestedAt;return;}slot.setAttribute('aria-busy','false');if(entry.state==='ready'){slot.replaceChildren(entry.image);timing.imageMs=performance.now()-requestedAt;requestAnimationFrame(()=>requestAnimationFrame(()=>timing.paintMs=performance.now()-requestedAt));}else{slot.innerHTML='<span class="media-state" role="status">Image unavailable.<button type="button">Try again</button></span>';slot.querySelector('button').onclick=()=>{slot.setAttribute('aria-busy','true');slot.innerHTML='<span class="media-state" role="status">Loading image…</span>';preloadCase(index,true).then(present);};timing.error=true;}};
modal.dataset.case=String(index);modal.dataset.request=String(requestedAt);if(cached?.state==='ready')present(cached);else preloadCase(index).then(present);
requestAnimationFrame(()=>{timing.windowFrameMs=performance.now()-requestedAt;});}
function initCaseWarmup(){const warm=e=>{const el=e.target.closest?.('button');if(!el)return;if(el.dataset.case!==undefined)preloadCase(+el.dataset.case);else if(el.dataset.p!==undefined)preloadCaseAt(+el.dataset.p);else if(el.id==='caseBtn')preloadCase(active);else if(el.id==='driveCase')preloadCase(3);};document.addEventListener('pointerover',warm);document.addEventListener('focusin',warm);}

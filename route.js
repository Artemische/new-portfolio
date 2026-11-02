// Geometry is independent from chapter selection and power state.
function cityCamera(progress){return clamp((cityProgress(progress)-.15)/.85)*3900+actor.camera;}
function streetVisible(progress=p){return progress>=.19&&(progress<.655||progress>=.925&&progress<.94);}
function projectWorldBounds(index){const c=portfolio[index];if(index===6){const b=molisBounds();return {left:b.x-7*b.k,right:b.x+429*b.k};}return {left:c.x-18,right:c.x+([438,446,525,470,450][index]||750)};}
function objectInScene(left,right,cam,padding=120){return right+padding>=cam&&left-padding<=cam+1100;}
function chapterNumber(index){return String(routeOrder.indexOf(index)+1).padStart(2,'0');}
function streetBoundaries(){const ids=[0,1,6,2,3];return ids.map((id,i)=>({id,start:i? (Math.min(projectWorldBounds(ids[i-1]).right,portfolio[id].x)+portfolio[id].x)/2:portfolio[id].x-70}));}
function streetChapter(progress,previous=-1){if(progress<.19)return -1;if(progress>=.655)return progress<.925?-1:progress<.94?4:5;
// The heroine's world position is derived from the current camera, not scroll target.
const world=cityCamera(progress)+440-actor.camera,items=streetBoundaries();let candidate=0;for(const item of items)if(world>=item.start)candidate=item.id;
const old=items.findIndex(x=>x.id===previous),next=items.findIndex(x=>x.id===candidate);if(old>=0&&next!==old){const edge=items[Math.max(old,next)].start;if(Math.abs(world-edge)<18)return previous;}return candidate;}
function molisZone(progress){const world=cityCamera(progress)+440-actor.camera,items=streetBoundaries();return world>=items[2].start-30&&world<items[3].start;}

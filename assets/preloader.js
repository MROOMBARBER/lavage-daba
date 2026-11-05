/* Lavage Daba — non-blocking preloader; progressive enhancement only. */
(()=>{'use strict';
const root=document.documentElement;
const overlay=document.getElementById('ld-preloader');
if(!overlay||!root.classList.contains('ld-preloading')){if(overlay)overlay.hidden=true;return}
const fill=overlay.querySelector('[data-ld-preload-fill]');
const amount=overlay.querySelector('[data-ld-preload-percent]');
const progress=overlay.querySelector('[role="progressbar"]');
const skip=overlay.querySelector('[data-ld-preload-skip]');
let ended=false,value=0,frameId=0;
const start=performance.now();
const minDuration=530;const maxDuration=1650;
const setProgress=(n)=>{value=Math.max(value,Math.min(100,Math.round(n)));if(fill)fill.style.width=value+'%';if(amount)amount.textContent=String(value).padStart(2,'0')+'%';if(progress&&value%5===0)progress.setAttribute('aria-valuenow',String(value))};
function finish(){if(ended)return;ended=true;cancelAnimationFrame(frameId);setProgress(100);overlay.classList.add('is-leaving');try{sessionStorage.setItem('ld_preloader_seen_v1','1')}catch(_){}
window.setTimeout(()=>{root.classList.remove('ld-preloading');overlay.hidden=true},450)}
function ready(){const elapsed=performance.now()-start;window.setTimeout(finish,Math.max(0,minDuration-elapsed))}
function tick(t){if(ended)return;const elapsed=t-start;const p=Math.min(elapsed/1080,1);setProgress(4+90*(1-Math.pow(1-p,2.6)));frameId=requestAnimationFrame(tick)}
frameId=requestAnimationFrame(tick);
if(document.readyState==='complete')ready();
else window.addEventListener('load',ready,{once:true});
window.setTimeout(ready,1080);
window.setTimeout(finish,maxDuration);
if(skip)skip.addEventListener('click',finish);
window.addEventListener('pageshow',e=>{if(e.persisted)finish()});
})();

(()=>{'use strict';
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
const narrow=window.matchMedia('(max-width: 780px)');
const saveData=!!navigator.connection?.saveData;
const motionOK=!reduced.matches&&!saveData;
const $=(sel,root=document)=>root.querySelector(sel);
const $$=(sel,root=document)=>[...root.querySelectorAll(sel)];
const reduceAnimations=()=>reduced.matches||saveData;
const loadScript=(url)=>new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=url;script.async=true;script.onload=resolve;script.onerror=reject;document.head.append(script)});
const whenVisible=(element,callback)=>{if(!('IntersectionObserver'in window)){callback();return}const obs=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){obs.disconnect();callback()}},{rootMargin:'200px'});obs.observe(element)};
const hero=$('#accueil');
const scenes=$$('.ld-wash-scene');
const seq=$('.ld-sequence');
const frames=$$('.ld-sequence-frames img');
const counter=$('.ld-sequence-counter');
const horiz=$('.ld-horizontal');
const track=$('.ld-horizontal-track');
function frameAt(t){if(!frames.length)return;const p=Math.min(frames.length-1.000001,Math.max(0,t)*(frames.length-1));frames.forEach((f,i)=>{f.style.opacity=String(Math.max(0,1-Math.abs(p-i)))});if(counter)counter.textContent=String(Math.min(frames.length,Math.floor(p)+1)).padStart(2,'0')+' / '+String(frames.length).padStart(2,'0')}
frameAt(0);
function setupReveal(gsap,ScrollTrigger){$$('[data-ld-words]').forEach(el=>{if(el.dataset.splitDone)return;el.dataset.splitDone='1';const nodes=[...el.childNodes];const frag=document.createDocumentFragment();for(const node of nodes){if(node.nodeType!==Node.TEXT_NODE){frag.append(node.cloneNode(true));continue}const parts=node.textContent.split(/(\s+)/);for(const part of parts){if(!part)continue;if(/^\s+$/.test(part)){frag.append(document.createTextNode(part));continue}const o=document.createElement('span');o.className='ld-word';const inside=document.createElement('span');inside.textContent=part;o.append(inside);frag.append(o)}}el.replaceChildren(frag);const words=$$('.ld-word > span',el);gsap.from(words,{yPercent:110,stagger:.045,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 89%',once:true}})});
$$('.ld-mask img').forEach(img=>{gsap.fromTo(img,{scale:1.18},{scale:1,duration:1.5,ease:'power2.out',scrollTrigger:{trigger:img,start:'top 90%',once:true}})})}
async function motion(){
if(!motionOK)return;
try{
await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js');
await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js');
const gsap=window.gsap,ScrollTrigger=window.ScrollTrigger;if(!gsap||!ScrollTrigger)return;
gsap.registerPlugin(ScrollTrigger);
setupReveal(gsap,ScrollTrigger);
if(hero){const visual=$('.ld-hero-photo img',hero);if(visual&&!narrow.matches)gsap.to(visual,{yPercent:13,scale:1.1,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:true}});const text=$('h1',hero);if(text)gsap.fromTo(text,{clipPath:'inset(0 0 100% 0)',y:35},{clipPath:'inset(0 0 0% 0)',y:0,duration:1.45,ease:'power4.out'})}
if(!narrow.matches){
scenes.forEach((scene,index)=>{const image=$('.ld-scene-photo',scene);const copy=$('.ld-scene-copy',scene);if(image){gsap.fromTo(image,{scale:1.2,yPercent:-8},{scale:1,yPercent:8,ease:'none',scrollTrigger:{trigger:scene,start:'top bottom',end:'bottom top',scrub:1}})}
if(copy)gsap.fromTo(copy,{y:60,opacity:.35},{y:0,opacity:1,ease:'none',scrollTrigger:{trigger:scene,start:'top 65%',end:'center center',scrub:1}});
ScrollTrigger.create({trigger:scene,start:'top top',end:'+=50%',pin:true,pinSpacing:true,anticipatePin:1})});
if(seq&&frames.length){ScrollTrigger.create({trigger:seq,start:'top top',end:'+=180%',pin:true,pinSpacing:true,anticipatePin:1,onUpdate:self=>frameAt(self.progress)})}
if(horiz&&track){const travel=()=>Math.max(0,track.scrollWidth-innerWidth);gsap.to(track,{x:()=>-travel(),ease:'none',scrollTrigger:{trigger:horiz,start:'top top',end:()=>'+='+Math.max(350,travel()),pin:true,scrub:1,anticipatePin:1,invalidateOnRefresh:true}})}
}else{
if(seq){ScrollTrigger.create({trigger:seq,start:'top bottom',end:'bottom top',scrub:1,onUpdate:self=>frameAt(self.progress)})}
}
ScrollTrigger.refresh();
if(!narrow.matches&&!saveData){try{await loadScript('https://cdn.jsdelivr.net/npm/lenis@1.1.18/dist/lenis.min.js');if(window.Lenis){const lenis=new Lenis({duration:1.1,smoothWheel:true,wheelMultiplier:.85,touchMultiplier:1});lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(a&&a.hash&&document.querySelector(a.hash)){e.preventDefault();lenis.scrollTo(a.hash,{offset:-90})}})}}catch(e){/* native scroll remains available */}}
}catch(err){/* enhancements should never block content or booking */}
}
if('requestIdleCallback'in window)requestIdleCallback(motion,{timeout:1500});else setTimeout(motion,450);
function magnetic(){if(narrow.matches||!motionOK||!matchMedia('(hover:hover)').matches)return;$$('.ld-btn').forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();el.style.transform='translate('+((e.clientX-r.left-r.width/2)*.11)+'px,'+((e.clientY-r.top-r.height/2)*.11)+'px)'});el.addEventListener('pointerleave',()=>{el.style.transform='translate(0,0)'})})}magnetic();
const lab=$('.ld-product-3d');if(!lab)return;
whenVisible(lab,async()=>{if(reduceAnimations()||narrow.matches||!('WebGLRenderingContext'in window))return;
try{await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/0.150.1/three.min.js');const THREE=window.THREE;if(!THREE)return;
const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(34,1,.1,100);camera.position.set(0,1.0,8.5);const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;lab.append(renderer.domElement);const fallback=$('.ld-product-fallback',lab);if(fallback)fallback.style.visibility='hidden';
const bottle=new THREE.Group();scene.add(bottle);
const dark=new THREE.MeshPhysicalMaterial({color:0x102a2a,metalness:.58,roughness:.21,clearcoat:1,clearcoatRoughness:.14});const capMat=new THREE.MeshStandardMaterial({color:0x192525,metalness:.75,roughness:.24});const mint=new THREE.MeshStandardMaterial({color:0xb6ed80,metalness:.18,roughness:.35});const white=new THREE.MeshBasicMaterial({color:0xf4f7e9});
function part(geo,mat,x,y,z){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);bottle.add(m);return m}
part(new THREE.CylinderGeometry(.67,.73,2.45,64),dark,0,0,0);part(new THREE.CylinderGeometry(.44,.57,.35,64),dark,0,1.36,0);part(new THREE.CylinderGeometry(.43,.43,.33,64),capMat,0,1.68,0);part(new THREE.CylinderGeometry(.47,.47,.07,64),mint,0,1.84,0);
const front=new THREE.Mesh(new THREE.PlaneGeometry(1.23,1.22),new THREE.MeshBasicMaterial({color:0xe9f1e9,side:THREE.DoubleSide}));front.position.set(0,.06,.705);bottle.add(front);
const strips=[{c:0x008b5f,x:-.47},{c:0xe9e9e2,x:-.34},{c:0xdd3538,x:-.21}];strips.forEach(v=>{const band=new THREE.Mesh(new THREE.PlaneGeometry(.11,.85),new THREE.MeshBasicMaterial({color:v.c,side:THREE.DoubleSide}));band.position.set(v.x,.08,.709);bottle.add(band)});
const canvas=document.createElement('canvas');canvas.width=512;canvas.height=512;const cx=canvas.getContext('2d');cx.clearRect(0,0,512,512);cx.fillStyle='#102c27';cx.font='900 78px Arial';cx.fillText('LAVAGE',52,182);cx.fillText('DABA',52,268);cx.font='600 24px Arial';cx.fillText('ITALIAN CARE CONCEPT',54,315);const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;const label=new THREE.Mesh(new THREE.PlaneGeometry(1.2,1.18),new THREE.MeshBasicMaterial({map:tex,transparent:true}));label.position.set(0,.01,.715);bottle.add(label);
scene.add(new THREE.AmbientLight(0xffffff,1.9));const key=new THREE.DirectionalLight(0xffffff,4);key.position.set(4,6,7);scene.add(key);const rim=new THREE.DirectionalLight(0x66e1df,2);rim.position.set(-5,1,-4);scene.add(rim);
let active=true,raf=0,drag=false,px=0,target=0,tick=0;
function resize(){const w=lab.clientWidth,h=lab.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}resize();const ro=new ResizeObserver(resize);ro.observe(lab);
function animate(){if(!active)return;tick+=.009;bottle.rotation.y+=(target-bottle.rotation.y)*.07;bottle.position.y=Math.sin(tick)*.12;renderer.render(scene,camera);raf=requestAnimationFrame(animate)}
const observer=new IntersectionObserver(entries=>{const inView=entries[0].isIntersecting&&document.visibilityState==='visible';if(inView&&!active){active=true;animate()}else if(!inView){active=false;cancelAnimationFrame(raf)}},{threshold:.01});observer.observe(lab);active=true;animate();
lab.addEventListener('pointerdown',e=>{drag=true;px=e.clientX;lab.setPointerCapture?.(e.pointerId)});lab.addEventListener('pointermove',e=>{if(!drag)return;target+=(e.clientX-px)*.009;px=e.clientX});lab.addEventListener('pointerup',()=>drag=false);lab.addEventListener('pointercancel',()=>drag=false);lab.setAttribute('aria-label','Visualisation 3D interactive d’un flacon de produit d’entretien automobile générique. Faites glisser pour le faire tourner.');lab.setAttribute('role','img');
}catch(e){/* static product graphic remains visible */}});
})();
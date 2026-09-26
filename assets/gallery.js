(function(){
'use strict';

var root=document.querySelector('[data-category-gallery]');
var imageWall=document.querySelector('.image-grid');

function addStyles(){
  if(document.getElementById('calista-gallery-polish')) return;
  var s=document.createElement('style');
  s.id='calista-gallery-polish';
  s.textContent=''+
  '.real-story-slider{display:grid!important;grid-template-columns:clamp(40px,5vw,58px) minmax(0,1fr) clamp(40px,5vw,58px);align-items:center;gap:16px;columns:auto!important;margin-top:34px}'+
  '.real-story-frame{min-width:0;aspect-ratio:16/9;max-height:72vh;overflow:hidden;display:grid;place-items:center;background:#202820;border:1px solid var(--line);box-shadow:0 18px 50px rgba(37,45,39,.12)}'+
  '.real-story-image{width:100%;height:100%;object-fit:contain!important;background:#202820}'+
  '.real-story-control{width:clamp(40px,5vw,58px);height:clamp(40px,5vw,58px);display:grid;place-items:center;border:1px solid var(--line);border-radius:50%;background:var(--cream);color:var(--ink);font:inherit;font-size:1.7rem;line-height:1;cursor:pointer;transition:transform .25s ease,background .25s ease,color .25s ease,box-shadow .25s ease}'+
  '.real-story-control:hover,.real-story-control:focus-visible{background:var(--ink);color:#fff;transform:translateY(-1px);box-shadow:0 10px 24px rgba(31,41,34,.16);outline:none}'+
  '.real-story-lightbox{position:fixed;inset:0;z-index:120;display:grid;place-items:center;padding:5vw;background:rgba(20,26,22,.92);cursor:zoom-out}'+
  '.real-story-lightbox img{max-width:94vw;max-height:90vh;width:auto;height:auto;object-fit:contain;box-shadow:0 24px 80px rgba(0,0,0,.4)}'+
  '.category-gallery.category-modal-host{position:fixed;inset:0;z-index:110;display:none;margin:0!important;padding:clamp(14px,4vw,52px);border:0;background:rgba(20,26,22,.78);backdrop-filter:blur(12px);overflow:auto}'+
  '.category-gallery.category-modal-host.is-open{display:grid;place-items:center}'+
  '.category-gallery.category-modal-host .category-modal-panel{width:min(1100px,100%);max-height:calc(100vh - 28px);overflow:auto;padding:clamp(16px,3vw,30px);border:1px solid rgba(255,255,255,.18);background:var(--cream);box-shadow:0 30px 90px rgba(0,0,0,.3);position:relative}'+
  '.category-gallery.category-modal-host .category-stage{grid-template-columns:52px minmax(0,1fr) 52px;gap:14px}'+
  '.category-gallery.category-modal-host .category-frame{aspect-ratio:16/10;max-height:68vh;background:#eee}'+
  '.category-gallery.category-modal-host .category-frame img{object-fit:contain!important}'+
  '.category-gallery.category-modal-host .category-stage button{border-radius:50%;font-size:1.5rem}'+
  '.category-modal-close{position:absolute;top:12px;right:12px;width:38px;height:38px;border:1px solid var(--line);border-radius:50%;background:var(--cream);color:var(--ink);font-size:1.4rem;line-height:1;cursor:pointer;z-index:3}'+
  '.category-modal-close:hover,.category-modal-close:focus-visible{background:var(--ink);color:#fff;outline:none}'+
  '.category-tab[data-category="candles"]{display:none!important}'+
  '.footer .social{align-items:center;flex-wrap:wrap}'+
  '.footer .social a{padding:9px 0;border-bottom:1px solid rgba(238,230,214,.35);transition:opacity .2s ease,border-color .2s ease}'+
  '.footer .social a:hover,.footer .social a:focus-visible{opacity:.7;border-color:currentColor;outline:none}'+
  '.collection[role="button"]:focus-visible,.pill[role="button"]:focus-visible{outline:2px solid var(--gold);outline-offset:4px}'+
  '@media(max-width:700px){.real-story-slider{grid-template-columns:36px minmax(0,1fr) 36px;gap:7px}.real-story-frame{aspect-ratio:4/3}.real-story-control{width:36px;height:36px;font-size:1.3rem}.category-gallery.category-modal-host{padding:10px}.category-gallery.category-modal-host .category-modal-panel{max-height:calc(100vh - 20px);padding:15px}.category-gallery.category-modal-host .category-stage{grid-template-columns:36px minmax(0,1fr) 36px;gap:6px}.category-gallery.category-modal-host .category-frame{aspect-ratio:4/5;max-height:62vh}}'+
  '@media(prefers-reduced-motion:reduce){.real-story-control{transition:none}}';
  document.head.appendChild(s);
}
addStyles();

function lightbox(img){
  var o=document.createElement('div');
  o.className='real-story-lightbox';
  o.setAttribute('role','dialog');
  o.setAttribute('aria-modal','true');
  var full=document.createElement('img');
  full.src=img.currentSrc||img.src;
  full.alt=img.alt||'CALISTA VITA image';
  o.appendChild(full);
  o.addEventListener('click',function(){o.remove();});
  document.body.appendChild(o);
}

function setupStory(){
  if(!imageWall) return;
  var sources=[].slice.call(imageWall.querySelectorAll('img')).map(function(img){return{src:img.currentSrc||img.src,alt:img.alt||'CALISTA VITA editorial image'};}).filter(function(x){return x.src;});
  if(!sources.length) return;
  imageWall.innerHTML='';
  imageWall.classList.add('real-story-slider');
  var prev=document.createElement('button');
  var next=document.createElement('button');
  var frame=document.createElement('div');
  var img=document.createElement('img');
  prev.type=next.type='button';
  prev.className=next.className='real-story-control';
  prev.setAttribute('aria-label','Previous image'); next.setAttribute('aria-label','Next image');
  prev.textContent='‹'; next.textContent='›';
  frame.className='real-story-frame'; img.className='real-story-image'; img.loading='eager'; img.decoding='async';
  frame.appendChild(img); imageWall.appendChild(prev); imageWall.appendChild(frame); imageWall.appendChild(next);
  var i=0,timer=null,paused=false;
  function render(){i=(i+sources.length)%sources.length;img.src=sources[i].src;img.alt=sources[i].alt;}
  function reset(){clearInterval(timer);if(!paused&&sources.length>1)timer=setInterval(function(){i++;render();},9000);}
  function go(n){i+=n;render();reset();}
  prev.addEventListener('click',function(){go(-1);}); next.addEventListener('click',function(){go(1);});
  img.addEventListener('click',function(){lightbox(img);});
  var sx=0,sy=0;
  frame.addEventListener('touchstart',function(e){var t=e.changedTouches[0];sx=t.clientX;sy=t.clientY;paused=true;reset();},{passive:true});
  frame.addEventListener('touchend',function(e){var t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;paused=false;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))go(dx<0?1:-1);else reset();},{passive:true});
  imageWall.addEventListener('mouseenter',function(){paused=true;reset();});
  imageWall.addEventListener('mouseleave',function(){paused=false;reset();});
  document.addEventListener('visibilitychange',function(){paused=document.hidden;reset();});
  render(); reset();
}
setupStory();

if(!root) return;

var panel=document.createElement('div');
panel.className='category-modal-panel';
while(root.firstChild) panel.appendChild(root.firstChild);
root.appendChild(panel);
root.classList.add('category-modal-host');

var close=document.createElement('button');
close.type='button'; close.className='category-modal-close'; close.setAttribute('aria-label','Close collection view'); close.textContent='×'; panel.appendChild(close);

var data={
  jewellery:['assets/posters/01-jewellery.jpg','assets/images/01.jpg','assets/images/02.jpg','assets/images/03.jpg','assets/images/04.jpg','assets/images/05.jpg'],
  handbags:['assets/posters/02-handbags.jpg','assets/images/32.jpg','assets/images/40.jpg','assets/images/47.jpg','assets/images/48.jpg','assets/images/49.jpg'],
  handmade:['assets/posters/04-handmade.jpg','assets/images/41.jpg','assets/images/42.jpg','assets/images/43.jpg','assets/images/44.jpg','assets/images/45.jpg'],
  fragrance:['assets/posters/03-fragrance.jpg','assets/images/46.jpg','assets/images/47.jpg','assets/images/48.jpg','assets/images/49.jpg','assets/images/50.jpg']
};
var names={jewellery:'Jewellery',handbags:'Handbags',handmade:'Handmade & Home',fragrance:'Perfume & Fragrance'};
var i=0,key='jewellery',timer=null,paused=false;
var img=root.querySelector('[data-gallery-image]');
var title=root.querySelector('[data-gallery-title]');
var count=root.querySelector('[data-gallery-count]');
if(count) count.remove();
var buttons=[].slice.call(root.querySelectorAll('[data-category]'));

function render(){
  var list=data[key]||[]; if(!list.length)return;
  i=(i+list.length)%list.length;
  img.src=list[i]; img.alt='CALISTA VITA '+names[key]+' image '+(i+1); img.style.objectFit='contain';
  title.textContent=names[key];
  buttons.forEach(function(b){b.setAttribute('aria-selected',b.getAttribute('data-category')===key?'true':'false');});
}
function reset(){clearInterval(timer);if(!paused&&root.classList.contains('is-open'))timer=setInterval(next,9000);}
function next(){i++;render();reset();}
function prev(){i--;render();reset();}
function openCategory(category){if(!data[category])return;key=category;i=0;render();root.classList.add('is-open');document.body.style.overflow='hidden';close.focus();reset();}
function closeCategory(){root.classList.remove('is-open');document.body.style.overflow='';clearInterval(timer);}
function selectCategory(category){if(!data[category])return;key=category;i=0;render();reset();}

buttons.forEach(function(b){b.addEventListener('click',function(){selectCategory(b.getAttribute('data-category'));});});

var collectionMap={'Jewellery':'jewellery','Handbags':'handbags','Perfume & Fragrance':'fragrance','Handmade & Home':'handmade'};
document.querySelectorAll('.collection').forEach(function(card){
  var h=card.querySelector('h3'); if(!h)return;
  var category=collectionMap[h.textContent.trim()]; if(!category)return;
  card.setAttribute('role','button'); card.setAttribute('tabindex','0'); card.setAttribute('aria-label','View '+names[category]+' collection');
  function activate(){openCategory(category);}
  card.addEventListener('click',activate);
  card.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();activate();}});
});

var pillMap={Jewellery:'jewellery',Handbags:'handbags',Perfume:'fragrance',Handmade:'handmade',Candles:'handmade'};
document.querySelectorAll('.pill').forEach(function(p){
  var category=pillMap[p.textContent.trim()]; if(!category)return;
  p.setAttribute('role','button'); p.setAttribute('tabindex','0');
  function activate(){openCategory(category);}
  p.addEventListener('click',activate);
  p.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();activate();}});
});

root.querySelector('[data-next]').addEventListener('click',next);
root.querySelector('[data-prev]').addEventListener('click',prev);
img.addEventListener('click',function(){lightbox(img);});
close.addEventListener('click',closeCategory);
root.addEventListener('click',function(e){if(e.target===root)closeCategory();});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&root.classList.contains('is-open'))closeCategory();});
var sx=0,sy=0;
img.addEventListener('touchstart',function(e){var t=e.changedTouches[0];sx=t.clientX;sy=t.clientY;paused=true;reset();},{passive:true});
img.addEventListener('touchend',function(e){var t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;paused=false;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))dx<0?next():prev();else reset();},{passive:true});
root.addEventListener('mouseenter',function(){paused=true;reset();});
root.addEventListener('mouseleave',function(){paused=false;reset();});
document.addEventListener('visibilitychange',function(){paused=document.hidden;reset();});
render();
})();
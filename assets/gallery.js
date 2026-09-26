(function(){
'use strict';

var root=document.querySelector('[data-category-gallery]');
var imageWall=document.querySelector('.image-grid');

function injectStyles(){
  if(document.getElementById('calista-gallery-polish')) return;
  var style=document.createElement('style');
  style.id='calista-gallery-polish';
  style.textContent=[
    '.real-story-slider{display:grid!important;grid-template-columns:clamp(38px,5vw,56px) minmax(0,1fr) clamp(38px,5vw,56px);align-items:center;gap:14px;columns:auto!important;margin-top:34px}',
    '.real-story-frame{position:relative;min-width:0;aspect-ratio:16/9;max-height:72vh;display:grid;place-items:center;overflow:hidden;background:#202820;border:1px solid var(--line);box-shadow:0 18px 50px rgba(37,45,39,.12)}',
    '.real-story-image{width:100%;height:100%;object-fit:contain!important;background:#202820}',
    '.real-story-control{width:clamp(38px,5vw,56px);height:clamp(38px,5vw,56px);display:grid;place-items:center;border:1px solid var(--line);border-radius:50%;background:var(--cream);color:var(--ink);font:inherit;font-size:1.7rem;line-height:1;cursor:pointer;transition:transform .25s ease,background .25s ease,color .25s ease,box-shadow .25s ease;z-index:2}',
    '.real-story-control:hover,.real-story-control:focus-visible{background:var(--ink);color:#fff;transform:translateY(-1px);box-shadow:0 10px 24px rgba(31,41,34,.16);outline:none}',
    '.real-story-lightbox{position:fixed;inset:0;z-index:120;display:grid;place-items:center;padding:5vw;background:rgba(20,26,22,.92);cursor:zoom-out}',
    '.real-story-lightbox img{max-width:94vw;max-height:90vh;width:auto;height:auto;object-fit:contain;box-shadow:0 24px 80px rgba(0,0,0,.4)}',
    '.category-gallery.category-modal-host{position:fixed;inset:0;z-index:110;display:none;margin:0!important;padding:clamp(16px,4vw,52px);border:0;background:rgba(20,26,22,.78);backdrop-filter:blur(12px);overflow:auto}',
    '.category-gallery.category-modal-host.is-open{display:grid;place-items:center}',
    '.category-gallery.category-modal-host .category-modal-panel{width:min(1100px,100%);max-height:calc(100vh - 32px);overflow:auto;padding:clamp(16px,3vw,30px);border:1px solid rgba(255,255,255,.18);background:var(--cream);box-shadow:0 30px 90px rgba(0,0,0,.3);position:relative}',
    '.category-gallery.category-modal-host .category-stage{grid-template-columns:52px minmax(0,1fr) 52px;gap:14px}',
    '.category-gallery.category-modal-host .category-frame{aspect-ratio:16/10;max-height:68vh;background:#eee}',
    '.category-gallery.category-modal-host .category-frame img{object-fit:contain!important}',
    '.category-gallery.category-modal-host .category-stage button{border-radius:50%;font-size:1.5rem}',
    '.category-modal-close{position:absolute;top:12px;right:12px;width:38px;height:38px;border:1px solid var(--line);border-radius:50%;background:var(--cream);color:var(--ink);font-size:1.4rem;line-height:1;cursor:pointer;z-index:3}',
    '.category-modal-close:hover,.category-modal-close:focus-visible{background:var(--ink);color:#fff;outline:none}',
    '@media(max-width:700px){.real-story-slider{grid-template-columns:36px minmax(0,1fr) 36px;gap:7px}.real-story-frame{aspect-ratio:4/3}.real-story-control{width:36px;height:36px;font-size:1.3rem}.category-gallery.category-modal-host{padding:10px}.category-gallery.category-modal-host .category-modal-panel{max-height:calc(100vh - 20px);padding:15px}.category-gallery.category-modal-host .category-stage{grid-template-columns:36px minmax(0,1fr) 36px;gap:6px}.category-gallery.category-modal-host .category-frame{aspect-ratio:4/5;max-height:62vh}}',
    '@media(prefers-reduced-motion:reduce){.real-story-control{transition:none}}'
  ].join('');
  document.head.appendChild(style);
}
injectStyles();

function makeLightbox(image){
  var overlay=document.createElement('div');
  overlay.className='real-story-lightbox';
  overlay.setAttribute('role','dialog');
  overlay.setAttribute('aria-modal','true');
  var full=document.createElement('img');
  full.src=image.src;
  full.alt=image.alt;
  overlay.appendChild(full);
  overlay.addEventListener('click',function(){overlay.remove();});
  document.body.appendChild(overlay);
}

if(imageWall){
  var sources=[].slice.call(imageWall.querySelectorAll('img')).map(function(image){
    return {src:image.currentSrc||image.src,alt:image.alt||'CALISTA VITA editorial image'};
  }).filter(function(item){return item.src;});

  imageWall.innerHTML='';
  imageWall.classList.add('real-story-slider');

  var frame=document.createElement('div');
  frame.className='real-story-frame';
  var prev=document.createElement('button');
  prev.type='button'; prev.className='real-story-control'; prev.setAttribute('aria-label','Previous image'); prev.textContent='‹';
  var next=document.createElement('button');
  next.type='button'; next.className='real-story-control'; next.setAttribute('aria-label','Next image'); next.textContent='›';
  var image=document.createElement('img');
  image.className='real-story-image';
  image.loading='eager';
  image.decoding='async';
  frame.appendChild(image);
  imageWall.appendChild(prev);
  imageWall.appendChild(frame);
  imageWall.appendChild(next);

  var index=0,timer=null,paused=false;
  function render(){
    if(!sources.length)return;
    index=(index+sources.length)%sources.length;
    image.src=sources[index].src;
    image.alt=sources[index].alt;
  }
  function reset(){
    clearInterval(timer);
    if(!paused && sources.length>1) timer=setInterval(function(){index++;render();},9000);
  }
  function go(delta){index+=delta;render();reset();}
  prev.addEventListener('click',function(){go(-1);});
  next.addEventListener('click',function(){go(1);});
  var startX=0,startY=0;
  frame.addEventListener('touchstart',function(e){
    var t=e.changedTouches[0]; startX=t.clientX; startY=t.clientY; paused=true; reset();
  },{passive:true});
  frame.addEventListener('touchend',function(e){
    var t=e.changedTouches[0],dx=t.clientX-startX,dy=t.clientY-startY;
    paused=false;
    if(Math.abs(dx)>45 && Math.abs(dx)>Math.abs(dy)) go(dx<0?1:-1); else reset();
  },{passive:true});
  image.addEventListener('click',function(){makeLightbox(image);});
  imageWall.addEventListener('mouseenter',function(){paused=true;reset();});
  imageWall.addEventListener('mouseleave',function(){paused=false;reset();});
  imageWall.addEventListener('focusin',function(){paused=true;reset();});
  imageWall.addEventListener('focusout',function(){paused=false;reset();});
  document.addEventListener('visibilitychange',function(){paused=document.hidden;reset();});
  render();
  reset();
}

/* Collections open as a focused category view instead of creating another permanent gallery block. */
if(!root)return;

var panel=document.createElement('div');
panel.className='category-modal-panel';
while(root.firstChild) panel.appendChild(root.firstChild);
root.appendChild(panel);
root.classList.add('category-modal-host');

var close=document.createElement('button');
close.type='button';
close.className='category-modal-close';
close.setAttribute('aria-label','Close collection view');
close.textContent='×';
panel.appendChild(close);

var data={
  jewellery:['assets/posters/01-jewellery.jpg','assets/images/01.jpg','assets/images/02.jpg','assets/images/03.jpg','assets/images/04.jpg','assets/images/05.jpg'],
  handbags:['assets/posters/02-handbags.jpg','assets/images/32.jpg','assets/images/40.jpg','assets/images/47.jpg','assets/images/48.jpg','assets/images/49.jpg'],
  candles:['assets/posters/04-handmade.jpg','assets/posters/03-fragrance.jpg','assets/images/50.jpg','assets/images/51.jpg','assets/images/45.jpg','assets/images/46.jpg'],
  handmade:['assets/posters/04-handmade.jpg','assets/images/41.jpg','assets/images/42.jpg','assets/images/43.jpg','assets/images/44.jpg','assets/images/45.jpg'],
  fragrance:['assets/posters/03-fragrance.jpg','assets/images/46.jpg','assets/images/47.jpg','assets/images/48.jpg','assets/images/49.jpg','assets/images/50.jpg']
};
var names={jewellery:'Jewellery',handbags:'Handbags',candles:'Candles',handmade:'Handmade & Home',fragrance:'Perfume & Fragrance'};
var index=0,key='jewellery',timer=null,paused=false;
var img=root.querySelector('[data-gallery-image]');
var title=root.querySelector('[data-gallery-title]');
var count=root.querySelector('[data-gallery-count]');
if(count)count.remove();

var buttons=[].slice.call(root.querySelectorAll('[data-category]'));
function render(){
  var list=data[key]||[];
  if(!list.length)return;
  index=(index+list.length)%list.length;
  img.src=list[index];
  img.alt='CALISTA VITA '+names[key]+' image '+(index+1);
  img.style.objectFit='contain';
  title.textContent=names[key];
  buttons.forEach(function(b){
    b.setAttribute('aria-selected',b.getAttribute('data-category')===key?'true':'false');
  });
}
function next(){index++;render();reset();}
function prev(){index--;render();reset();}
function reset(){
  clearInterval(timer);
  if(!paused)timer=setInterval(next,9000);
}
function openCategory(category){
  if(!data[category])return;
  key=category;
  index=0;
  render();
  root.classList.add('is-open');
  document.body.style.overflow='hidden';
  close.focus();
  reset();
}
function closeCategory(){
  root.classList.remove('is-open');
  document.body.style.overflow='';
  clearInterval(timer);
}
function selectCategory(category){
  if(!data[category])return;
  key=category;
  index=0;
  render();
  reset();
}
buttons.forEach(function(b){
  b.addEventListener('click',function(){selectCategory(b.getAttribute('data-category'));});
});

var collectionMap={
  'Jewellery':'jewellery',
  'Handbags':'handbags',
  'Perfume & Fragrance':'fragrance',
  'Handmade & Home':'handmade'
};
document.querySelectorAll('.collection').forEach(function(card){
  var heading=card.querySelector('h3');
  if(!heading)return;
  var category=collectionMap[heading.textContent.trim()];
  if(!category)return;
  card.setAttribute('role','button');
  card.setAttribute('tabindex','0');
  card.setAttribute('aria-label','View '+names[category]+' collection');
  function activate(){openCategory(category);}
  card.addEventListener('click',activate);
  card.addEventListener('keydown',function(e){
    if(e.key==='Enter'||e.key===' '){e.preventDefault();activate();}
  });
});

var pillMap={Jewellery:'jewellery',Handbags:'handbags',Perfume:'fragrance',Handmade:'handmade',Candles:'candles'};
document.querySelectorAll('.pill').forEach(function(pill){
  var category=pillMap[pill.textContent.trim()];
  if(!category)return;
  pill.setAttribute('role','button');
  pill.setAttribute('tabindex','0');
  function activate(){openCategory(category);}
  pill.addEventListener('click',activate);
  pill.addEventListener('keydown',function(e){
    if(e.key==='Enter'||e.key===' '){e.preventDefault();activate();}
  });
});

root.querySelector('[data-next]').addEventListener('click',next);
root.querySelector('[data-prev]').addEventListener('click',prev);
var startX=0,startY=0;
img.addEventListener('touchstart',function(e){
  var t=e.changedTouches[0]; startX=t.clientX; startY=t.clientY; paused=true; reset();
},{passive:true});
img.addEventListener('touchend',function(e){
  var t=e.changedTouches[0],dx=t.clientX-startX,dy=t.clientY-startY;
  paused=false;
  if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)) dx<0?next():prev(); else reset();
},{passive:true});
img.addEventListener('click',function(){makeLightbox(img);});
close.addEventListener('click',closeCategory);
root.addEventListener('click',function(e){if(e.target===root)closeCategory();});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&root.classList.contains('is-open'))closeCategory();});
root.addEventListener('mouseenter',function(){paused=true;reset();});
root.addEventListener('mouseleave',function(){paused=false;reset();});
root.addEventListener('focusin',function(){paused=true;reset();});
root.addEventListener('focusout',function(){paused=false;reset();});
document.addEventListener('visibilitychange',function(){paused=document.hidden;reset();});
render();
})();
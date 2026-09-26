(function(){
'use strict';
var root=document.querySelector('[data-category-gallery]');
var imageWall=document.querySelector('.image-grid');
var imageWallSection=imageWall?imageWall.closest('.section'):null;

/* Turn the existing Real Imagery wall into the main compact slideshow without moving or removing the section. */
if(imageWall){
  var sources=[].slice.call(imageWall.querySelectorAll('img')).map(function(image){return {src:image.currentSrc||image.src,alt:image.alt||'CALISTA VITA editorial image'};}).filter(function(item){return item.src;});
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
  imageWall.appendChild(prev); imageWall.appendChild(frame); imageWall.appendChild(next);
  var index=0,timer=null,paused=false;
  function render(){
    if(!sources.length)return;
    index=(index+sources.length)%sources.length;
    image.src=sources[index].src;
    image.alt=sources[index].alt;
  }
  function reset(){clearInterval(timer);if(!paused&&sources.length>1)timer=setInterval(function(){index++;render();},9000);}
  function go(delta){index+=delta;render();reset();}
  prev.addEventListener('click',function(){go(-1);});
  next.addEventListener('click',function(){go(1);});
  var startX=0,startY=0;
  frame.addEventListener('touchstart',function(e){var t=e.changedTouches[0];startX=t.clientX;startY=t.clientY;paused=true;reset();},{passive:true});
  frame.addEventListener('touchend',function(e){var t=e.changedTouches[0],dx=t.clientX-startX,dy=t.clientY-startY;paused=false;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)){go(dx<0?1:-1);}else reset();},{passive:true});
  image.addEventListener('click',function(){
    var overlay=document.createElement('div');
    overlay.className='real-story-lightbox';
    overlay.setAttribute('role','dialog');
    overlay.setAttribute('aria-modal','true');
    var full=document.createElement('img');
    full.src=image.src; full.alt=image.alt;
    overlay.appendChild(full);
    overlay.addEventListener('click',function(){overlay.remove();});
    document.body.appendChild(overlay);
  });
  imageWall.addEventListener('mouseenter',function(){paused=true;reset();});
  imageWall.addEventListener('mouseleave',function(){paused=false;reset();});
  imageWall.addEventListener('focusin',function(){paused=true;reset();});
  imageWall.addEventListener('focusout',function(){paused=false;reset();});
  document.addEventListener('visibilitychange',function(){paused=document.hidden;reset();});
  render();reset();
}

/* Keep the category selector for the Collections section, but never show an image count. */
if(!root)return;
var data={
jewellery:['assets/posters/01-jewellery.jpg','assets/images/01.jpg','assets/images/02.jpg','assets/images/03.jpg','assets/images/04.jpg','assets/images/05.jpg'],
handbags:['assets/posters/02-handbags.jpg','assets/images/32.jpg','assets/images/40.jpg','assets/images/47.jpg','assets/images/48.jpg','assets/images/49.jpg'],
candles:['assets/posters/04-handmade.jpg','assets/posters/03-fragrance.jpg','assets/images/50.jpg','assets/images/51.jpg','assets/images/45.jpg','assets/images/46.jpg'],
handmade:['assets/posters/04-handmade.jpg','assets/images/41.jpg','assets/images/42.jpg','assets/images/43.jpg','assets/images/44.jpg','assets/images/45.jpg'],
fragrance:['assets/posters/03-fragrance.jpg','assets/images/46.jpg','assets/images/47.jpg','assets/images/48.jpg','assets/images/49.jpg','assets/images/50.jpg']};
var names={jewellery:'Jewellery',handbags:'Handbags',candles:'Candles',handmade:'Handmade & Home',fragrance:'Perfume & Fragrance'};
var index=0,key='jewellery',timer=null,paused=false;
var img=root.querySelector('[data-gallery-image]'),title=root.querySelector('[data-gallery-title]');
var count=root.querySelector('[data-gallery-count]');
if(count)count.remove();
var buttons=[].slice.call(root.querySelectorAll('[data-category]'));
function render(){
 var list=data[key]||[]; if(!list.length)return;
 index=(index+list.length)%list.length;
 img.src=list[index]; img.alt='CALISTA VITA '+names[key]+' image '+(index+1); img.style.objectFit='contain';
 title.textContent=names[key];
 buttons.forEach(function(b){b.setAttribute('aria-selected',b.getAttribute('data-category')===key?'true':'false');});
}
function next(){index++;render();reset();}
function prev(){index--;render();reset();}
function reset(){clearInterval(timer);if(!paused)timer=setInterval(next,9000);}
function selectCategory(category,scrollToGallery){if(!data[category])return;key=category;index=0;render();reset();if(scrollToGallery)root.scrollIntoView({behavior:'smooth',block:'center'});}
buttons.forEach(function(b){b.addEventListener('click',function(){selectCategory(b.getAttribute('data-category'),false);});});
var collectionMap={'Jewellery':'jewellery','Handbags':'handbags','Perfume & Fragrance':'fragrance','Handmade & Home':'handmade'};
document.querySelectorAll('.collection').forEach(function(card){
 var heading=card.querySelector('h3'); if(!heading)return;
 var category=collectionMap[heading.textContent.trim()]; if(!category)return;
 card.setAttribute('role','button'); card.setAttribute('tabindex','0'); card.setAttribute('aria-label','View '+names[category]+' gallery');
 function activate(){selectCategory(category,true);}
 card.addEventListener('click',activate);
 card.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();activate();}});
});
var pillMap={Jewellery:'jewellery',Handbags:'handbags',Perfume:'fragrance',Handmade:'handmade',Candles:'candles'};
document.querySelectorAll('.pill').forEach(function(pill){
 var category=pillMap[pill.textContent.trim()]; if(!category)return;
 pill.setAttribute('role','button'); pill.setAttribute('tabindex','0');
 function activate(){selectCategory(category,true);}
 pill.addEventListener('click',activate);
 pill.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();activate();}});
});
root.querySelector('[data-next]').addEventListener('click',next);
root.querySelector('[data-prev]').addEventListener('click',prev);
var startX=0,startY=0;
img.addEventListener('touchstart',function(e){var t=e.changedTouches[0];startX=t.clientX;startY=t.clientY;paused=true;reset();},{passive:true});
img.addEventListener('touchend',function(e){var t=e.changedTouches[0],dx=t.clientX-startX,dy=t.clientY-startY;paused=false;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)){dx<0?next():prev();}else reset();},{passive:true});
img.addEventListener('click',function(){
 var overlay=document.createElement('div'); overlay.className='real-story-lightbox'; overlay.setAttribute('role','dialog'); overlay.setAttribute('aria-modal','true');
 var full=document.createElement('img'); full.src=img.src; full.alt=img.alt; overlay.appendChild(full); overlay.addEventListener('click',function(){overlay.remove();}); document.body.appendChild(overlay);
});
root.addEventListener('mouseenter',function(){paused=true;reset();}); root.addEventListener('mouseleave',function(){paused=false;reset();});
root.addEventListener('focusin',function(){paused=true;reset();}); root.addEventListener('focusout',function(){paused=false;reset();});
document.addEventListener('visibilitychange',function(){paused=document.hidden;reset();});
render();reset();
})();
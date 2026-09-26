(function(){
'use strict';
var root=document.querySelector('[data-category-gallery]');
if(!root)return;
var data={
jewellery:['assets/posters/01-jewellery.jpg','assets/images/01.jpg','assets/images/02.jpg','assets/images/03.jpg','assets/images/04.jpg','assets/images/05.jpg'],
handbags:['assets/posters/02-handbags.jpg','assets/images/32.jpg','assets/images/40.jpg','assets/images/47.jpg','assets/images/48.jpg','assets/images/49.jpg'],
candles:['assets/posters/04-handmade.jpg','assets/posters/03-fragrance.jpg','assets/images/50.jpg','assets/images/51.jpg','assets/images/45.jpg','assets/images/46.jpg'],
handmade:['assets/posters/04-handmade.jpg','assets/images/41.jpg','assets/images/42.jpg','assets/images/43.jpg','assets/images/44.jpg','assets/images/45.jpg'],
fragrance:['assets/posters/03-fragrance.jpg','assets/images/46.jpg','assets/images/47.jpg','assets/images/48.jpg','assets/images/49.jpg','assets/images/50.jpg']};
var names={jewellery:'Jewellery',handbags:'Handbags',candles:'Candles',handmade:'Handmade & Home',fragrance:'Perfume & Fragrance'};
var index=0,key='jewellery',timer=null,paused=false;
var img=root.querySelector('[data-gallery-image]'),title=root.querySelector('[data-gallery-title]'),count=root.querySelector('[data-gallery-count]');
var buttons=[].slice.call(root.querySelectorAll('[data-category]'));
var imageWall=document.querySelector('.image-grid');
var imageWallSection=imageWall?imageWall.closest('.section'):null;

/* The category slider replaces the long archive wall on the page, preventing mobile overload. */
if(imageWallSection)imageWallSection.style.display='none';

function render(){
 var list=data[key]||[];
 if(!list.length)return;
 index=(index+list.length)%list.length;
 img.src=list[index];
 img.alt='CALISTA VITA '+names[key]+' image '+(index+1);
 img.style.objectFit='contain';
 title.textContent=names[key];
 count.textContent=(index+1)+' / '+list.length;
 buttons.forEach(function(b){b.setAttribute('aria-selected',b.getAttribute('data-category')===key?'true':'false');});
}
function next(){index++;render();reset();}
function prev(){index--;render();reset();}
function reset(){clearInterval(timer);if(!paused)timer=setInterval(next,9000);}
function selectCategory(category,scrollToGallery){
 if(!data[category])return;
 key=category;index=0;render();reset();
 if(scrollToGallery)root.scrollIntoView({behavior:'smooth',block:'center'});
}
buttons.forEach(function(b){b.addEventListener('click',function(){selectCategory(b.getAttribute('data-category'),false);});});

/* Make the four large collection cards open their matching category without changing their styling. */
var collectionMap={'Jewellery':'jewellery','Handbags':'handbags','Perfume & Fragrance':'fragrance','Handmade & Home':'handmade'};
document.querySelectorAll('.collection').forEach(function(card){
 var heading=card.querySelector('h3');
 if(!heading)return;
 var category=collectionMap[heading.textContent.trim()];
 if(!category)return;
 card.setAttribute('role','button');
 card.setAttribute('tabindex','0');
 card.setAttribute('aria-label','View '+names[category]+' gallery');
 function activate(){selectCategory(category,true);}
 card.addEventListener('click',activate);
 card.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();activate();}});
});

/* Make the existing hero category pills functional while preserving their appearance. */
var pillMap={Jewellery:'jewellery',Handbags:'handbags',Perfume:'fragrance',Handmade:'handmade',Candles:'candles'};
document.querySelectorAll('.pill').forEach(function(pill){
 var category=pillMap[pill.textContent.trim()];
 if(!category)return;
 pill.setAttribute('role','button');
 pill.setAttribute('tabindex','0');
 function activate(){selectCategory(category,true);}
 pill.addEventListener('click',activate);
 pill.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();activate();}});
});

root.querySelector('[data-next]').addEventListener('click',next);
root.querySelector('[data-prev]').addEventListener('click',prev);
var startX=0,startY=0;
img.addEventListener('touchstart',function(e){var t=e.changedTouches[0];startX=t.clientX;startY=t.clientY;paused=true;reset();},{passive:true});
img.addEventListener('touchend',function(e){var t=e.changedTouches[0],dx=t.clientX-startX,dy=t.clientY-startY;paused=false;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)){dx<0?next():prev();}else reset();},{passive:true});
img.addEventListener('click',function(){window.open(img.src,'_blank','noopener,noreferrer');});
root.addEventListener('mouseenter',function(){paused=true;reset();});
root.addEventListener('mouseleave',function(){paused=false;reset();});
root.addEventListener('focusin',function(){paused=true;reset();});
root.addEventListener('focusout',function(){paused=false;reset();});
document.addEventListener('visibilitychange',function(){paused=document.hidden;reset();});
render();reset();
})();
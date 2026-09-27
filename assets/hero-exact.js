(function(){
'use strict';
var img=document.getElementById('calistaExactHero');
if(!img)return;
var chunks=['00','01','02','03','04','05','06'];
img.dataset.heroExact='loading';
Promise.all(chunks.map(function(n){return fetch('assets/hero-exact/'+n+'.txt',{cache:'force-cache'}).then(function(r){if(!r.ok)throw new Error('Hero chunk '+n+' HTTP '+r.status);return r.text();});}))
.then(function(parts){
  var raw=atob(parts.join('').replace(/\s+/g,''));
  var bytes=new Uint8Array(raw.length);
  for(var i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);
  if(bytes.length!==2887863)throw new Error('Exact hero byte length mismatch: '+bytes.length);
  var url=URL.createObjectURL(new Blob([bytes],{type:'image/png'}));
  img.addEventListener('load',function(){
    if(img.naturalWidth!==1536||img.naturalHeight!==1024)throw new Error('Exact hero dimensions mismatch');
    img.dataset.heroExact='true';
    img.dataset.heroBytes=String(bytes.length);
    img.style.visibility='visible';
  },{once:true});
  img.addEventListener('error',function(){throw new Error('Exact hero PNG decode failed');},{once:true});
  img.src=url;
})
.catch(function(err){
  console.error('CALISTA VITA exact hero failed to load',err);
  img.dataset.heroExact='false';
});
})();
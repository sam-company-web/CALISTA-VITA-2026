(function(){
'use strict';
var img=document.getElementById('calistaExactHero');
if(!img)return;
var chunks=['00','01'];
var EXPECTED_BYTES=421251;
var EXPECTED_WIDTH=2048;
var EXPECTED_HEIGHT=1355;
var EXPECTED_SHA='d5c0e3d0d8fa52d68bc4440782c9239c5d647c2d506aceffadde51d5bef07db8';
img.dataset.heroExact='loading';
function sha256(bytes){return crypto.subtle.digest('SHA-256',bytes).then(function(hash){return Array.from(new Uint8Array(hash)).map(function(b){return b.toString(16).padStart(2,'0');}).join('');});}
Promise.all(chunks.map(function(n){return fetch('assets/hero-current/'+n+'.txt',{cache:'no-store'}).then(function(r){if(!r.ok)throw new Error('Hero chunk '+n+' HTTP '+r.status);return r.text();});}))
.then(function(parts){
  var raw=atob(parts.join('').replace(/\s+/g,''));
  var bytes=new Uint8Array(raw.length);
  for(var i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);
  if(bytes.length!==EXPECTED_BYTES)throw new Error('Exact hero byte length mismatch: '+bytes.length);
  return sha256(bytes).then(function(hash){if(hash!==EXPECTED_SHA)throw new Error('Exact hero SHA mismatch: '+hash);return bytes;});
})
.then(function(bytes){
  var url=URL.createObjectURL(new Blob([bytes],{type:'image/jpeg'}));
  img.addEventListener('load',function(){
    if(img.naturalWidth!==EXPECTED_WIDTH||img.naturalHeight!==EXPECTED_HEIGHT)throw new Error('Exact hero dimensions mismatch');
    img.dataset.heroExact='true';
    img.dataset.heroBytes=String(bytes.length);
    img.dataset.heroSha256=EXPECTED_SHA;
    img.style.setProperty('visibility','visible','important');
  },{once:true});
  img.addEventListener('error',function(){throw new Error('Exact hero JPEG decode failed');},{once:true});
  img.src=url;
})
.catch(function(err){
  console.error('CALISTA VITA exact hero failed to load',err);
  img.dataset.heroExact='false';
});
})();
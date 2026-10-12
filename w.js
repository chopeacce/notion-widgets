(function(){var q=new URLSearchParams(location.search),t=q.get('theme');
if(t==='dark'||(t==='auto'&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark');
var ns=(q.get('id')||'default')+':';
window.W={q:q,get:function(k,d){try{var v=JSON.parse(localStorage.getItem(ns+k));return v==null?d:v}catch(e){return d}},
set:function(k,v){try{localStorage.setItem(ns+k,JSON.stringify(v))}catch(e){}},
$:function(i){return document.getElementById(i)},
esc:function(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}};})();

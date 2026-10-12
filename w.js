(function(){var q=new URLSearchParams(location.search),t=q.get('theme');
if(t==='dark'||(t==='auto'&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark');
var ns=(q.get('id')||'default')+':',subs=[];
window.W={q:q,lang:q.get('lang')||'en-US',get:function(k,d){try{var v=JSON.parse(localStorage.getItem(ns+k));return v==null?d:v}catch(e){return d}},
set:function(k,v){try{localStorage.setItem(ns+k,JSON.stringify(v))}catch(e){}},
$:function(i){return document.getElementById(i)},
esc:function(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})},
uid:function(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)},
iso:function(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')},
day:function(s){var p=s.split('-');return new Date(+p[0],p[1]-1,+p[2])},
hrs:function(ms){var m=Math.round(ms/60000);return (m>=60?Math.floor(m/60)+'h ':'')+m%60+'m'},
courses:function(){return W.get('courses',[{id:'c1',n:'Contracts',p:'',w:''},{id:'c2',n:'Civil Procedure',p:'',w:''},{id:'c3',n:'Torts',p:'',w:''}])},
opts:function(sel){return '<option value="">No course</option>'+W.courses().map(function(c){return '<option value="'+c.id+'"'+(c.id===sel?' selected':'')+'>'+W.esc(c.n)+'</option>'}).join('')},
on:function(f){subs.push(f)}};
window.addEventListener('storage',function(e){if(e.key&&e.key.indexOf(ns)===0)subs.forEach(function(f){f(e.key.slice(ns.length))})});})();

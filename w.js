(function(){var q=new URLSearchParams(location.search),t=q.get('theme');
if(t==='dark'||(t==='auto'&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark');
var ns=(q.get('id')||'default')+':',subs=[];
function get(k,d){try{var v=JSON.parse(localStorage.getItem(ns+k));return v==null?d:v}catch(e){return d}}
function set(k,v){try{localStorage.setItem(ns+k,JSON.stringify(v))}catch(e){}}
var ko=(get('lang',null)||(q.get('lang')==='ko'?'ko':'en'))==='ko';
window.W={q:q,ko:ko,lang:ko?'ko-KR':'en-US',get:get,set:set,
$:function(i){return document.getElementById(i)},
esc:function(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})},
uid:function(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)},
iso:function(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')},
day:function(s){var p=s.split('-');return new Date(+p[0],p[1]-1,+p[2])},
hrs:function(ms){var m=Math.round(ms/60000),h=Math.floor(m/60);return ko?(h?h+'시간 ':'')+m%60+'분':(h?h+'h ':'')+m%60+'m'},
courses:function(){return get('courses',[{id:'c1',n:'Contracts',p:'',w:''},{id:'c2',n:'Civil Procedure',p:'',w:''},{id:'c3',n:'Torts',p:'',w:''}])},
opts:function(sel){return '<option value="">No course</option>'+W.courses().map(function(c){return '<option value="'+c.id+'"'+(c.id===sel?' selected':'')+'>'+W.esc(c.n)+'</option>'}).join('')},
on:function(f){subs.push(f)}};
window.addEventListener('storage',function(e){if(!e.key||e.key.indexOf(ns)!==0)return;var k=e.key.slice(ns.length);if(k==='lang'){location.reload();return}subs.forEach(function(f){f(k)})});
var s2=document.getElementById('sheet2');
if(s2){var r=document.createElement('div');r.className='rowb';r.innerHTML='<button class="btn sm'+(ko?' ghost':'')+'" data-l="en">English</button><button class="btn sm'+(ko?'':' ghost')+'" data-l="ko">한국어</button>';
r.onclick=function(e){var l=e.target.getAttribute('data-l');if(l){set('lang',l);location.reload()}};s2.querySelector('.box').appendChild(r)}
if(!ko)return;
var D={'Edit':'수정','Done':'완료','Name':'이름','Start':'시작','Goal':'목표일','Weekly Tracker':'주간 트래커','Study Timer':'스터디 타이머','Pause':'일시정지','Resume':'계속','Finish':'완료','No course':'과목 없음','Tasks':'할 일','Today':'오늘','Edit task':'할 일 수정','Title':'제목','Date':'날짜','Priority':'우선순위','High':'높음','Mid':'보통','Low':'낮음','Course':'과목','Delete':'삭제','Save':'저장','Backup':'백업','Restore':'복원','Copy':'복사','Courses':'과목','+ Add':'+ 추가','Add professor and schedule':'교수님과 시간표를 적어보세요','No courses yet. Press + Add.':'과목이 없어요. + 추가를 눌러보세요.','Edit course':'과목 수정','New course':'새 과목','Professor':'교수','Schedule':'시간표','Study Log':'스터디 로그','Other':'기타','Finish a timer session or press + Add.':'타이머를 완료하거나 + 추가를 눌러보세요.','Add study time':'공부 시간 추가','Minutes':'분','Cancel':'취소','Nothing due today.':'오늘 할 일이 없어요.','Finished tasks show up here.':'완료한 일이 여기에 모여요.','No unscheduled tasks.':'날짜 없는 할 일이 없어요.','Type above, then drag a task onto a date.':'위에 입력한 뒤 날짜 칸으로 끌어다 놓으세요.','Copy this code and keep it somewhere safe. To restore, paste a code here and press Restore.':'이 코드를 복사해 안전한 곳에 보관하세요. 복원하려면 코드를 붙여넣고 복원을 누르세요.','Copied. Paste it into a note to keep it.':'복사했어요. 메모에 붙여넣어 보관하세요.','That code is not a valid backup. Nothing was changed.':'올바른 백업 코드가 아니에요. 바뀐 것은 없어요.','Add a task — press Enter':'할 일 입력 후 Enter','Add for today — press Enter':'오늘 할 일 입력 후 Enter','Your name':'이름','One line about you':'한 줄 소개','Prof. Kim':'김 교수님','Mon / Wed 10:30 · Room 204':'월 / 수 10:30 · 204호'},
R=[[/^Today (.+)$/,'오늘 $1'],[/^7 days · (.+)$/,'최근 7일 · $1'],[/^(\d+) \/ (\d+) days · (\d+%)$/,'$1 / $2일 · $3'],[/^(\d+) open tasks?$/,'남은 할 일 $1개'],[/^Add to (.+) — press Enter$/,'$1에 추가 — Enter'],[/^Row (\d) \(empty to hide\)$/,'$1번 항목 (비우면 숨김)']],
SK='.t,.chip,.cn,td.n,[contenteditable],textarea,script,style',PR={H:'상',M:'중',L:'하'},D1=['일','월','화','수','목','금','토'],D2=['','월','화','수','목','금','토','일'];
function tr(k){if(D[k])return D[k];for(var i=0;i<R.length;i++)if(R[i][0].test(k))return k.replace(R[i][0],R[i][1]);return null}
function each(sel,f){[].forEach.call(document.querySelectorAll(sel),f)}
function pass(){var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),n,a=[];while(n=w.nextNode())a.push(n);
a.forEach(function(n){var s=n.nodeValue,k=s.trim();if(!k||!n.parentNode||n.parentNode.closest(SK))return;var v=tr(k);if(v)n.nodeValue=s.replace(k,v)});
['placeholder','data-ph'].forEach(function(at){each('['+at+']',function(el){var v=tr(el.getAttribute(at));if(v)el.setAttribute(at,v)})});
each('.dow span',function(el,i){if(el.textContent!==D1[i])el.textContent=D1[i]});
each('#tb th',function(el,i){if(i&&el.textContent!==D2[i])el.textContent=D2[i]});
each('.pr',function(el){var v=PR[el.textContent];if(v)el.textContent=v})}
var mo=new MutationObserver(function(){mo.disconnect();pass();ob()});
function ob(){mo.observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['placeholder','data-ph']})}
document.addEventListener('DOMContentLoaded',function(){pass();ob()});})();

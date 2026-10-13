(function(){var q=new URLSearchParams(location.search),t=q.get('theme');
if(t==='dark'||(t==='auto'&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark');
var ns=(q.get('id')||'default')+':',subs=[];
function get(k,d){if(used)used[k]=1;try{var v=JSON.parse(localStorage.getItem(ns+k));return v==null?d:v}catch(e){return d}}
var used={},FB='https://firestore.googleapis.com/v1/projects/notion-widgets-84645/databases/(default)/documents/sync/',FK='?key=AIzaSyBTnIhz7zThATaGq3OltcNZ_Kb3ZnrcCkE',NOS={nbs:1,timer:1,lang:1},pend={},pt=null,code=null;
function raw(k,v){try{localStorage.setItem(ns+k,JSON.stringify(v))}catch(e){}}
function set(k,v){raw(k,v);if(code&&k.charAt(0)!=='_'&&!NOS[k])mark(k)}
function enc(k){return 'k_'+k.replace(/[^a-zA-Z0-9]/g,'_')}
function tmap(){return get('_t',{})}
function mark(k){var t=tmap();t[k]=Date.now();raw('_t',t);pend[k]=1;clearTimeout(pt);pt=setTimeout(flush,900)}
function url(d,x){return FB+code+'/k/'+d+FK+(x||'')}
function send(u,b,ka){return fetch(u,{method:'PATCH',keepalive:!!ka,headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:b})}).then(function(r){if(!r.ok)throw 0})}
function flush(ka){var ks=Object.keys(pend),t=tmap(),mf={},mask='',ps=[];pend={};clearTimeout(pt);
ks.forEach(function(k){var v=null;try{v=localStorage.getItem(ns+k)}catch(e){}if(v==null||!t[k])return;var d=enc(k);mf[d]={integerValue:String(t[k])};mask+='&updateMask.fieldPaths='+d;ps.push(send(url(d),{k:{stringValue:k},d:{stringValue:v},t:{integerValue:String(t[k])}},ka))});
if(!ps.length)return;Promise.all(ps).then(function(){return send(url('_m',mask),mf,ka)}).catch(function(){ks.forEach(function(k){pend[k]=1})})}
function changed(k){if(k==='lang'){location.reload();return}if(subs.length)subs.forEach(function(f){f(k)});else if(used[k])location.reload()}
function doc(d){fetch(url(d)).then(function(r){return r.json()}).then(function(j){if(!j.fields)return;var k=j.fields.k.stringValue,rt=+j.fields.t.integerValue,t=tmap();if(t[k]&&t[k]>=rt)return;try{localStorage.setItem(ns+k,j.fields.d.stringValue)}catch(e){}t[k]=rt;raw('_t',t);changed(k)}).catch(function(){})}
function pull(gap){if(!code||document.hidden)return;var now=Date.now();if(now-get('_p',0)<gap)return;raw('_p',now);
fetch(url('_m')).then(function(r){return r.status===404?{}:r.json()}).then(function(m){if(m.error)return;var f=m.fields||{},t=tmap(),known={},dirty=false,i,key,k;
Object.keys(t).forEach(function(k){known[enc(k)]=k});
try{for(i=0;i<localStorage.length;i++){key=localStorage.key(i);if(key.indexOf(ns)!==0)continue;k=key.slice(ns.length);if(k.charAt(0)==='_'||NOS[k]||t[k])continue;if(!f[enc(k)]){t[k]=now;dirty=true}}}catch(e){}
if(dirty)raw('_t',t);
Object.keys(f).forEach(function(d){if(d.indexOf('k_')!==0)return;var k=known[d],rt=+f[d].integerValue;if(!k||!t[k]||rt>t[k])doc(d)});
Object.keys(t).forEach(function(k){var r=f[enc(k)]?+f[enc(k)].integerValue:0;if(t[k]>r&&!NOS[k])pend[k]=1});
if(Object.keys(pend).length)flush()}).catch(function(){})}
code=q.get('sync')||get('_sync',null);if(code&&code.length<20)code=null;if(code&&get('_sync',null)!==code)raw('_sync',code);
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
window.addEventListener('storage',function(e){if(!e.key||e.key.indexOf(ns)!==0)return;var k=e.key.slice(ns.length);if(k.charAt(0)==='_')return;if(k==='lang'){location.reload();return}subs.forEach(function(f){f(k)})});
if(code){setTimeout(function(){pull(8000)},50);setInterval(function(){pull(45000)},15000);document.addEventListener('visibilitychange',function(){pull(10000)});window.addEventListener('pagehide',function(){if(Object.keys(pend).length)flush(true)})}
W.sync=!!code;
var bc={};W.blob={put:function(id,d){bc[id]=d;if(code)return send(url('b_'+id),{d:{stringValue:d}}).catch(function(){});raw('b:'+id,d);return Promise.resolve()},
get:function(id){if(bc[id])return Promise.resolve(bc[id]);if(!code)return Promise.resolve(get('b:'+id,''));return fetch(url('b_'+id)).then(function(r){return r.json()}).then(function(j){var d=j.fields?j.fields.d.stringValue:'';if(d)bc[id]=d;return d}).catch(function(){return ''})}};
var s2=document.getElementById('sheet2');
if(s2){var r=document.createElement('div');r.className='rowb';r.innerHTML='<button class="btn sm'+(ko?' ghost':'')+'" data-l="en">English</button><button class="btn sm'+(ko?'':' ghost')+'" data-l="ko">한국어</button>';
r.onclick=function(e){var l=e.target.getAttribute('data-l');if(l){set('lang',l);location.reload()}};s2.querySelector('.box').appendChild(r);if(code){var z=document.createElement('div');z.className='sub';z.textContent='Sync is on. Changes save to the cloud automatically.';s2.querySelector('.box').appendChild(z)}}
if(!ko)return;
var D={'Edit':'수정','Done':'완료','Name':'이름','Start':'시작','Goal':'목표일','Weekly Tracker':'주간 트래커','Study Timer':'스터디 타이머','Pause':'일시정지','Resume':'계속','Finish':'완료','No course':'과목 없음','Tasks':'할 일','Today':'오늘','Edit task':'할 일 수정','Title':'제목','Date':'날짜','Priority':'우선순위','High':'높음','Mid':'보통','Low':'낮음','Course':'과목','Delete':'삭제','Save':'저장','Backup':'백업','Restore':'복원','Copy':'복사','Courses':'과목','+ Add':'+ 추가','Add professor and schedule':'교수님과 시간표를 적어보세요','No courses yet. Press + Add.':'과목이 없어요. + 추가를 눌러보세요.','Edit course':'과목 수정','New course':'새 과목','Professor':'교수','Schedule':'시간표','Study Log':'스터디 로그','Other':'기타','Finish a timer session or press + Add.':'타이머를 완료하거나 + 추가를 눌러보세요.','Add study time':'공부 시간 추가','Minutes':'분','Cancel':'취소','Nothing due today.':'오늘 할 일이 없어요.','Finished tasks show up here.':'완료한 일이 여기에 모여요.','No unscheduled tasks.':'날짜 없는 할 일이 없어요.','Type above, then drag a task onto a date.':'위에 입력한 뒤 날짜 칸으로 끌어다 놓으세요.','Copy this code and keep it somewhere safe. To restore, paste a code here and press Restore.':'이 코드를 복사해 안전한 곳에 보관하세요. 복원하려면 코드를 붙여넣고 복원을 누르세요.','Copied. Paste it into a note to keep it.':'복사했어요. 메모에 붙여넣어 보관하세요.','That code is not a valid backup. Nothing was changed.':'올바른 백업 코드가 아니에요. 바뀐 것은 없어요.','Add a task — press Enter':'할 일 입력 후 Enter','Add for today — press Enter':'오늘 할 일 입력 후 Enter','Your name':'이름','One line about you':'한 줄 소개','Prof. Kim':'김 교수님','Mon / Wed 10:30 · Room 204':'월 / 수 10:30 · 204호','Notebook':'노트북','Notes':'노트','Cases':'판례','Concepts':'개념','Rules':'법조문','Search':'검색','+ New note':'+ 새 노트','Untitled':'제목 없음','Note title':'노트 제목','Concept':'개념','Rule / Statute':'법조문 / Rule','Case':'판례','Professor said':'교수님 강조','Question':'질문','Note':'메모','Term':'용어','Definition':'정의','Example':'예시','Source':'출처','Text':'원문','Elements':'요건','Facts':'사실관계','Holding':'판시','Why it matters':'의미','Issue':'쟁점','Answer':'답','+ Concept':'+ 개념','+ Rule':'+ 법조문','+ Case':'+ 판례','+ Professor':'+ 교수님 강조','+ Question':'+ 질문','+ Note':'+ 메모','Delete page':'페이지 삭제','Delete note':'노트 삭제','Sure?':'정말요?','Pick a note on the left, or start a new one.':'왼쪽에서 노트를 고르거나 새 노트를 만드세요.','No notes yet.':'아직 노트가 없어요.','Nothing here yet.':'아직 없어요.','This page is empty. Add a block below.':'빈 페이지예요. 아래에서 블록을 추가하세요.','Write it the way the professor said it':'교수님이 말한 그대로 적기','Write anything':'자유롭게 적기','One line':'한 줄로','+ Text':'+ 텍스트','Type / for commands':'/ 를 눌러 명령어 보기','Heading 1':'제목 1','Heading 2':'제목 2','Heading 3':'제목 3','Bulleted list':'글머리 기호 목록','Numbered list':'번호 목록','To-do list':'할 일 목록','Toggle':'토글','Quote':'인용','Callout':'콜아웃','Divider':'구분선','Code':'코드','Table':'표','Image':'이미지','+ Row':'+ 행','+ Col':'+ 열','− Row':'− 행','− Col':'− 열','Link':'링크','Sync is on. Changes save to the cloud automatically.':'동기화가 켜져 있어요. 변경 내용이 자동으로 클라우드에 저장돼요.'},
R=[[/^Today (.+)$/,'오늘 $1'],[/^7 days · (.+)$/,'최근 7일 · $1'],[/^(\d+) \/ (\d+) days · (\d+%)$/,'$1 / $2일 · $3'],[/^(\d+) open tasks?$/,'남은 할 일 $1개'],[/^Add to (.+) — press Enter$/,'$1에 추가 — Enter'],[/^Row (\d) \(empty to hide\)$/,'$1번 항목 (비우면 숨김)'],[/^Page (\d+)$/,'$1페이지']],
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

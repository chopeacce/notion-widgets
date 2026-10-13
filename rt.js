(function(){var x=function(c,v){document.execCommand(c,false,v)},menu,bar,sl=null,mi=0,flt=[],rng=null,RT=window.RT={},
OK={B:1,STRONG:1,I:1,EM:1,U:1,S:1,STRIKE:1,MARK:1,A:1,H1:1,H2:1,H3:1,UL:1,OL:1,LI:1,BLOCKQUOTE:1,PRE:1,CODE:1,P:1,DIV:1,BR:1,HR:1,TABLE:1,TBODY:1,TR:1,TD:1,TH:1,IMG:1,DETAILS:1,SUMMARY:1,SPAN:1};
function walk(n){[].slice.call(n.children).forEach(function(c){var T=c.tagName.toUpperCase();
if(!OK[T]){if(/^(SCRIPT|STYLE|IFRAME|OBJECT|EMBED|LINK|META|FORM|INPUT|BUTTON|SVG|SELECT|TEXTAREA)$/.test(T)){c.remove();return}walk(c);c.replaceWith.apply(c,[].slice.call(c.childNodes));return}
[].slice.call(c.attributes).forEach(function(a){var k=a.name,v=a.value,ok=(k==='href'&&T==='A'&&/^(https?:|mailto:)/i.test(v))||(k==='data-img'&&T==='IMG'&&/^[a-z0-9]+$/.test(v))||(k==='class'&&/^(todo|co)$/.test(v))||(k==='data-done'&&T==='LI')||(k==='open'&&T==='DETAILS');if(!ok)c.removeAttribute(k)});
if(T==='IMG'&&!c.getAttribute('data-img')){c.remove();return}
if(T==='A'){c.setAttribute('target','_blank');c.setAttribute('rel','noopener')}walk(c)})}
RT.clean=function(h){var d=new DOMParser().parseFromString('<body>'+(h||'')+'</body>','text/html');walk(d.body);return d.body.innerHTML};
function norm(rt){var s=sel(),an=s.anchorNode,ao=s.anchorOffset,p=null,moved=false;
if(!rt.firstChild){rt.innerHTML='<p><br></p>';if(document.activeElement===rt)caretIn(rt.firstChild)}
else [].slice.call(rt.childNodes).forEach(function(c){var inl=c.nodeType===3||(c.nodeType===1&&/^(B|STRONG|I|EM|U|S|STRIKE|MARK|A|SPAN|BR|CODE)$/.test(c.tagName));
if(!inl){p=null;return}if(c.nodeType===3&&!c.data.trim()&&!p){c.remove();return}if(!p){p=document.createElement('p');rt.insertBefore(p,c)}p.appendChild(c);moved=true});
if(moved&&an&&rt.contains(an)){try{var r=document.createRange();r.setStart(an,ao);r.collapse(true);s.removeAllRanges();s.addRange(r)}catch(e){}}
rt.classList.toggle('emp',rt.children.length===1&&rt.firstElementChild.tagName==='P'&&!rt.textContent&&!rt.querySelector('img'))}
RT.hydrate=function(root){[].forEach.call(root.querySelectorAll('.rt'),norm);[].forEach.call(root.querySelectorAll('img[data-img]'),function(im){if(im.getAttribute('src'))return;W.blob.get(im.getAttribute('data-img')).then(function(s){if(s)im.src=s})})};
function rtOf(n){while(n&&n.nodeType!==1)n=n.parentNode;return n&&n.closest?n.closest('.rt'):null}
function sel(){return window.getSelection()}
function fire(el){if(el)el.dispatchEvent(new Event('input',{bubbles:true}))}
function blockOf(n,rt){while(n&&n.parentNode!==rt)n=n.parentNode;return n}
function caretIn(el){var r=document.createRange();r.selectNodeContents(el);r.collapse(true);var s=sel();s.removeAllRanges();s.addRange(r)}
function prevOfCaret(q){var s=sel(),rt=rtOf(s.anchorNode),b=blockOf(s.anchorNode,rt);while(b&&!(b.matches&&b.matches(q)))b=b.previousElementSibling;return b}
function topB(rt){var b=blockOf(sel().anchorNode,rt);return b&&b.nodeType===1?b:null}
function mk(t,h,c){var e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e}
function setB(tag,cls){var s=sel(),rt=rtOf(s.anchorNode);if(!rt)return;norm(rt);var b=topB(rt);if(!b)return;var an=s.anchorNode,ao=s.anchorOffset,T=b.tagName,list=tag==='ul'||tag==='ol',el,tgt;
if(T==='UL'||T==='OL'){if(!list){x('formatBlock','<'+tag+'>');return}el=mk(tag,null,cls);while(b.firstChild)el.appendChild(b.firstChild);b.replaceWith(el);tgt=an&&el.contains(an)?null:el.firstChild}
else if(/^(P|H1|H2|H3|BLOCKQUOTE|PRE|DIV)$/.test(T)){el=mk(tag,null,cls);tgt=el;if(list){tgt=mk('li');el.appendChild(tgt)}while(b.firstChild)tgt.appendChild(b.firstChild);
[].slice.call(tgt.childNodes).forEach(function(c){if(c.nodeType===3&&!c.data)c.remove()});if(!tgt.firstChild)tgt.innerHTML='<br>';b.replaceWith(el)}else return;
try{var r=document.createRange();if(an&&an.nodeType===3&&an.data&&el.contains(an))r.setStart(an,Math.min(ao,an.data.length));else{r.selectNodeContents(tgt||el);}r.collapse(true);s.removeAllRanges();s.addRange(r)}catch(e){}}
function ins(node,rt){rt=rt||rtOf(sel().anchorNode);if(!rt)return node;norm(rt);var b=topB(rt);if(!b)rt.appendChild(node);else if(b.tagName==='P'&&!b.textContent&&!b.querySelector('img'))b.replaceWith(node);else b.after(node);
if(!node.nextElementSibling||node.nextElementSibling.tagName!=='P')node.after(mk('p','<br>'));return node}
var CMD={p:function(){setB('p')},h1:function(){setB('h1')},h2:function(){setB('h2')},h3:function(){setB('h3')},ul:function(){setB('ul')},ol:function(){setB('ol')},todo:function(){setB('ul','todo')},quote:function(){setB('blockquote')},code:function(){setB('pre')},
hr:function(){caretIn(ins(mk('hr')).nextElementSibling)},
co:function(){caretIn(ins(mk('div','<br>','co')))},
tg:function(){var d=ins(mk('details','<summary>Toggle</summary><p><br></p>'));d.open=true;var r=document.createRange();r.selectNodeContents(d.firstChild);var s=sel();s.removeAllRanges();s.addRange(r)},
tb:function(){var r='<tr><td><br></td><td><br></td><td><br></td></tr>';caretIn(ins(mk('table','<tbody>'+r+r+r+'</tbody>')).querySelector('td'))},
img:function(){rng=rtOf(sel().anchorNode);pick.click()}},
IT=[['Text','p text 텍스트 본문','p'],['Heading 1','h1 title 제목','h1'],['Heading 2','h2 제목','h2'],['Heading 3','h3 제목','h3'],['Bulleted list','ul bullet 글머리 목록','ul'],['Numbered list','ol number 번호 목록','ol'],['To-do list','todo check 체크 할일','todo'],['Toggle','toggle 토글 접기','tg'],['Quote','quote 인용','quote'],['Callout','callout 콜아웃 강조','co'],['Divider','hr line 구분선','hr'],['Code','code 코드','code'],['Table','table 표','tb'],['Image','image photo 이미지 사진','img'],
['Concept','concept 개념','@concept'],['Rule / Statute','rule statute 법조문','@rule'],['Case','case 판례','@case'],['Hypo','hypo 사례','@hypo'],['Professor said','professor 교수 강조','@prof'],['Question','question 질문','@q']];
var pick=document.createElement('input');pick.type='file';pick.accept='image/*';pick.style.display='none';document.body.appendChild(pick);
pick.onchange=function(){var f=pick.files[0];pick.value='';if(f)addImg(f)};
function addImg(f){var fr=new FileReader();fr.onload=function(){var im=new Image();im.onload=function(){var m=1400,sc=Math.min(1,m/Math.max(im.width,im.height)),d,q=.82;
do{var c=document.createElement('canvas');c.width=Math.max(1,Math.round(im.width*sc));c.height=Math.max(1,Math.round(im.height*sc));var g=c.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,c.width,c.height);g.drawImage(im,0,0,c.width,c.height);d=c.toDataURL('image/jpeg',q);sc*=.8}while(d.length>850000&&sc>.05);
var id=W.uid();W.blob.put(id,d);var im2=mk('img');im2.setAttribute('data-img',id);im2.src=d;var rt=rng&&rng.classList?rng:rtOf(sel().anchorNode);rng=null;if(!rt)return;if(!rt.contains(sel().anchorNode))caretIn(rt.lastElementChild||rt);caretIn(ins(im2,rt).nextElementSibling);fire(rt)};im.src=fr.result};fr.readAsDataURL(f)}
function host(){return document.querySelector('.card')}
function place(el,rect,above){var h=host().getBoundingClientRect(),w=el.offsetWidth,ht=el.offsetHeight,l=Math.max(8,Math.min(rect.left-h.left,h.width-w-8)),t=above?rect.top-h.top-ht-6:rect.bottom-h.top+6;if(!above&&t+ht>h.height-8)t=rect.top-h.top-ht-6;if(t<8)t=rect.bottom-h.top+6;el.style.left=l+'px';el.style.top=t+'px'}
function closeMenu(){sl=null;if(menu)menu.style.display='none'}
function drawMenu(){menu.innerHTML=flt.map(function(it,i){return '<button data-i="'+i+'"'+(i===mi?' class="on"':'')+'>'+it[0]+'</button>'}).join('');var o=menu.querySelector('.on');if(o)o.scrollIntoView({block:'nearest'})}
function openMenu(q,node,start,end){var k=q.toLowerCase();flt=IT.filter(function(it){return !k||(it[0]+' '+it[1]).toLowerCase().indexOf(k)>=0});if(!flt.length){closeMenu();return}
sl={node:node,start:start,end:end};mi=0;menu.style.display='flex';drawMenu();var r=document.createRange();r.setStart(node,start);r.setEnd(node,end);place(menu,r.getBoundingClientRect(),false)}
function choose(it){if(!sl||!it)return;var r=document.createRange();try{r.setStart(sl.node,sl.start);r.setEnd(sl.node,sl.end);r.deleteContents()}catch(e){}var s=sel();s.removeAllRanges();s.addRange(r);var rt=rtOf(sl.node);closeMenu();
if(it[2].charAt(0)==='@'){fire(rt);if(RT.onBlock)RT.onBlock(it[2].slice(1),rt)}else{CMD[it[2]]();fire(rt)}}
function hideBar(){if(bar)bar.style.display='none'}
function showBar(html,rect){bar.innerHTML=html;bar.style.display='flex';place(bar,rect,true)}
var FMT='<button data-c="bold"><b>B</b></button><button data-c="italic"><i>I</i></button><button data-c="underline"><u>U</u></button><button data-c="strikeThrough"><s>S</s></button><button data-c="mark"><mark>A</mark></button><button data-c="link">Link</button><i class="sep"></i><button data-c="h1">H1</button><button data-c="h2">H2</button><button data-c="h3">H3</button><button data-c="p">T</button>',
TBL='<button data-c="r+">+ Row</button><button data-c="c+">+ Col</button><button data-c="r-">− Row</button><button data-c="c-">− Col</button>';
function onSel(){var s=sel();if(!s.rangeCount||document.activeElement===bar.querySelector('input'))return;var rt=rtOf(s.anchorNode);if(!rt){hideBar();return}
if(!s.isCollapsed){showBar(FMT,s.getRangeAt(0).getBoundingClientRect());return}
var n=s.anchorNode;while(n&&n.nodeType!==1)n=n.parentNode;var td=n&&n.closest('td,th');if(td&&rt.contains(td))showBar(TBL,td.getBoundingClientRect());else hideBar()}
function barCmd(c){var s=sel(),rt=rtOf(s.anchorNode),n=s.anchorNode;while(n&&n.nodeType!==1)n=n.parentNode;if(!rt)return;
if(c==='mark'){var m=n.closest('mark');if(m)m.replaceWith.apply(m,[].slice.call(m.childNodes));else x('insertHTML','<mark>'+W.esc(s.toString())+'</mark>')}
else if(c==='link'){var lr=s.getRangeAt(0).cloneRange();bar.innerHTML='<input placeholder="https://" aria-label="Link">';var i=bar.querySelector('input');i.focus();i.onkeydown=function(e){if(e.key==='Escape'){hideBar();return}if(e.key!=='Enter'||e.isComposing)return;e.preventDefault();var u=i.value.trim();hideBar();var z=sel();z.removeAllRanges();z.addRange(lr);if(u){if(!/^(https?:|mailto:)/i.test(u))u='https://'+u;x('createLink',u)}fire(rt)};return}
else if(CMD[c])CMD[c]();
else if(/^[rc][+-]$/.test(c)){var td=n.closest('td,th'),tr=td.parentNode,tb=tr.parentNode,ci=[].indexOf.call(tr.children,td);
if(c==='r+'){var nr=tr.cloneNode(true);[].forEach.call(nr.children,function(d){d.innerHTML='<br>'});tr.after(nr)}
else if(c==='r-'){if(tb.children.length>1)tr.remove();else tb.closest('table').remove()}
else if(c==='c+')[].forEach.call(tb.children,function(r){var d=document.createElement('td');d.innerHTML='<br>';r.children[ci].after(d)});
else{if(tr.children.length>1)[].forEach.call(tb.children,function(r){r.children[ci].remove()});else tb.closest('table').remove()}hideBar()}
else x(c);fire(rt)}
RT.init=function(){x('defaultParagraphSeparator','p');
menu=document.createElement('div');menu.className='slm';bar=document.createElement('div');bar.className='fb';host().appendChild(menu);host().appendChild(bar);
menu.onmousedown=function(e){e.preventDefault();var b=e.target.closest('button');if(b)choose(flt[+b.getAttribute('data-i')])};
bar.onmousedown=function(e){var b=e.target.closest('button');if(!b)return;e.preventDefault();barCmd(b.getAttribute('data-c'))};
document.addEventListener('selectionchange',onSel);document.addEventListener('focusin',function(e){if(e.target.classList&&e.target.classList.contains('rt'))norm(e.target)});
document.addEventListener('input',function(e){var rt=e.target.classList&&e.target.classList.contains('rt')?e.target:null;if(!rt)return;norm(rt);
[].forEach.call(rt.querySelectorAll('ul.todo li[data-done]'),function(li){if(!li.textContent.trim())li.removeAttribute('data-done')});
if(rt.lastElementChild&&rt.lastElementChild.tagName!=='P'){var p=document.createElement('p');p.innerHTML='<br>';rt.appendChild(p)}
var s=sel(),n=s.anchorNode;if(!s.isCollapsed||!n||n.nodeType!==3){closeMenu();return}var t=n.data.slice(0,s.anchorOffset),m=t.match(/(?:^|\s)\/([^\s\/]{0,20})$/);
if(m)openMenu(m[1],n,s.anchorOffset-m[1].length-1,s.anchorOffset);else closeMenu()});
document.addEventListener('keydown',function(e){var rt=e.target.classList&&e.target.classList.contains('rt')?e.target:null;if(!rt||e.isComposing||e.keyCode===229)return;
if(sl){if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();mi=(mi+(e.key==='ArrowDown'?1:flt.length-1))%flt.length;drawMenu();return}
if(e.key==='Enter'||e.key==='Tab'){e.preventDefault();choose(flt[mi]);return}if(e.key==='Escape'){closeMenu();return}}
norm(rt);var s=sel(),n=s.anchorNode;if(!s.isCollapsed||!n)return;
if(e.key===' '&&n.nodeType===3&&!n.previousSibling){var pre=n.data.slice(0,s.anchorOffset),par=n.parentNode,top=par===rt||par.parentNode===rt,c={'#':'h1','##':'h2','###':'h3','-':'ul','*':'ul','1.':'ol','[]':'todo','>':'quote','```':'code'}[pre];
if(c&&top&&!/^(H[1-3]|LI|PRE|BLOCKQUOTE|TD)$/.test(par.tagName)){e.preventDefault();n.deleteData(0,s.anchorOffset);CMD[c]();fire(rt)}}
else if(e.key==='Enter'&&!e.shiftKey&&topB(rt)&&/^(BLOCKQUOTE|H1|H2|H3|PRE)$/.test(topB(rt).tagName+'')&&!topB(rt).textContent.trim()||e.key==='Enter'&&!e.shiftKey&&topB(rt)&&topB(rt).classList.contains('co')&&!topB(rt).textContent.trim()){e.preventDefault();setB('p');fire(rt)}
else if(e.key==='Enter'&&!e.shiftKey&&topB(rt)&&topB(rt).tagName==='PRE'){e.preventDefault();x('insertText','\n')}
else if(e.key==='Enter'&&n.nodeType===3&&n.data==='---'&&(n.parentNode===rt||n.parentNode.parentNode===rt)){e.preventDefault();n.data='';norm(rt);CMD.hr();fire(rt)}
else if(e.key==='Tab'){var el=n.nodeType===1?n:n.parentNode,td=el.closest('td,th');if(td){e.preventDefault();var all=[].slice.call(td.closest('table').querySelectorAll('td,th')),nx=all[all.indexOf(td)+(e.shiftKey?-1:1)];if(nx)caretIn(nx)}else if(el.closest('li')){e.preventDefault();x(e.shiftKey?'outdent':'indent');fire(rt)}}});
document.addEventListener('click',function(e){var li=e.target.closest&&e.target.closest('ul.todo>li');if(li&&e.target===li&&e.offsetX<24&&rtOf(li)){if(li.hasAttribute('data-done'))li.removeAttribute('data-done');else li.setAttribute('data-done','1');fire(rtOf(li))}
if(sl&&!e.target.closest('.slm'))closeMenu()});
document.addEventListener('paste',function(e){var rt=rtOf(e.target);if(!rt)return;var cd=e.clipboardData,i,f;for(i=0;i<cd.items.length;i++)if(cd.items[i].type.indexOf('image/')===0){f=cd.items[i].getAsFile();break}
e.preventDefault();if(f){rng=rt;addImg(f);return}var h=cd.getData('text/html');if(h)x('insertHTML',RT.clean(h).replace(/<img[^>]*>/g,''));else x('insertText',cd.getData('text/plain'))});
document.addEventListener('drop',function(e){var rt=rtOf(e.target),f=e.dataTransfer&&e.dataTransfer.files&&e.dataTransfer.files[0];if(rt&&f&&f.type.indexOf('image/')===0){e.preventDefault();rt.focus();rng=rt;addImg(f)}})};
})();

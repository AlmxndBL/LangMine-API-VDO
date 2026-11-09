import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const dir=path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/,'$1'));
const old=path.resolve(dir,'../video-sample-r2');
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const read=p=>fs.readFileSync(p,'utf8');
const write=(p,s)=>fs.writeFileSync(path.join(dir,p),s);
const design=read(path.resolve(dir,'../DESIGN.md'));
const beats=[...design.matchAll(/### (B\d\d) · ([^\n]+)[\s\S]*?บท: “([^”]+)”/g)].map(([_,id,title,text])=>{
 const file=fs.readdirSync(path.join(dir,'assets')).find(n=>n.startsWith('EP02 '+id+' ')&&n.endsWith('.wav'));
 const duration=+execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','csv=p=0',path.join(dir,'assets',file)],{encoding:'utf8'}).trim();
 return {id,title:title.split(' · ')[0],text,file,duration};
});
let clock=.5;
for(const b of beats){b.start=clock;b.end=clock+b.duration;b.length=b.duration+(b.id==='B16'?4:b.id==='B12'?7:1);clock+=b.length;}
const total=Math.ceil((clock+.3)*30)/30;
write('timing.json',JSON.stringify({total,beats},null,2));
const q1='ช่วยเขียนข้อความแจ้งลูกค้าว่าสินค้าส่งช้า ให้สุภาพหน่อย';
const a1='ขออภัยค่ะ ขณะนี้การจัดส่งสินค้าล่าช้ากว่ากำหนด ทางร้านกำลังติดตามและจะแจ้งความคืบหน้าให้ทราบ ขอบคุณที่อดทนรอนะคะ';
const q2='ขอสั้นลงสำหรับส่งใน LINE';
const a2='ขออภัยค่ะ สินค้าจัดส่งล่าช้ากว่ากำหนด ทางร้านกำลังติดตามและจะแจ้งให้ทราบนะคะ';
const css=`@font-face{font-family:Sarabun;src:url('assets/Sarabun-Regular.ttf')}@font-face{font-family:Sarabun;src:url('assets/Sarabun-Bold.ttf');font-weight:700}*{box-sizing:border-box}#root{position:relative;width:1080px;height:1920px;overflow:hidden;color:#17252e;font-family:Sarabun;background-color:var(--paper,#fff9e9);background-image:linear-gradient(#658baf24 2px,transparent 2px),linear-gradient(90deg,#658baf24 2px,transparent 2px);background-size:54px 54px}h1{position:absolute;left:100px;top:177px;width:880px;margin:0;padding:24px 28px;font-size:65px;line-height:1.3;text-align:center;background:var(--label,#ffda35);border:7px solid #202326;box-shadow:8px 9px 0 white;transform:rotate(-1deg);font-weight:700;z-index:5}.kicker{position:absolute;top:105px;left:110px;font-size:32px;font-weight:700}.note{position:absolute;left:110px;top:1280px;width:860px;font-size:43px;line-height:1.5;background:#fffdf5;border:4px solid #202326;padding:22px 30px;border-radius:15px;z-index:5}.big{position:absolute;left:110px;top:445px;width:860px;font-size:65px;line-height:1.55;font-weight:700}.big strong{background:#ffe16b;padding:0 12px}.sub{font-size:43px;font-weight:400}.tile{padding:30px 34px;margin-bottom:38px;background:white;border:6px solid #202326;border-radius:25px;box-shadow:8px 9px 0 #ffffff}.tile b{display:block;color:#125eac}.tile small{font-size:40px;font-weight:400}.robot{position:absolute;right:100px;top:930px;width:290px;height:320px;object-fit:contain}.badge{display:inline-block;background:#1bae76;border:5px solid #202326;padding:12px 24px;color:#102c25;font-size:46px;font-weight:700}.foot{position:absolute;top:1410px;left:110px;font-size:32px;width:860px;color:#344953}.url{font-family:Consolas,monospace;font-size:48px;overflow-wrap:anywhere;line-height:1.7}.arrow{font-size:70px;text-align:center;color:#145eac}img,video{object-fit:contain}`;
function shell(id,title,body,script='',extra='',paper='#fff9e9',label='#ffda35'){
 label=['#ffda35','#8bc1ff','#53d5a2'][parseInt(id.slice(1,3))%3];
 return `<!doctype html><html lang="th"><head><meta charset="utf-8"><title>${esc(title)}</title></head><body><template><style>${css}${extra}</style><div id="root" data-composition-id="${id}" style="--paper:${paper};--label:${label}"><div class="kicker">EP02 · เว็บแชทของเราเอง</div><h1>${title}</h1>${body}</div><script>${script||`const tl=gsap.timeline({paused:true});tl.fromTo('h1',{opacity:0,y:18},{opacity:1,y:0,duration:.35},0);tl.fromTo('.big,.note',{opacity:0,y:22},{opacity:1,y:0,duration:.45,stagger:.12},.2);window.__timelines=window.__timelines||{};window.__timelines['${id}']=tl;`}</script></template></body></html>`;
}
let shots=[];
function add(b,n,f,title,kind,data={}){
 const beat=beats.find(x=>x.id===b),start=beat.start+f[0]*beat.length,duration=(f[1]-f[0])*beat.length;
 shots.push({id:b.toLowerCase()+'-'+n,beat:b,start,duration,title,kind,...data});
}
add('B01',1,[0,.48],'ใช้ AI ช่วยร่างข้อความอยู่แล้ว?', 'chat',{state:'answer',head:'แชท AI ที่คุ้นเคย'});
add('B01',2,[.48,1],'ถ้าเป็นเว็บของทีมเราเองล่ะ?', 'hero');
add('B02',1,[0,.52],'ช่วยทีมร่างข้อความ', 'chat',{state:'answer'});
add('B02',2,[.52,1],'ขอฉบับสั้นสำหรับ LINE', 'chat',{state:'follow'});
add('B03',1,[0,.82],'ข้อความเดินทางผ่าน 3 ส่วน', 'flow');
add('B03',2,[.82,1],'เริ่มจากเตรียมผู้ช่วย', 'step');
add('B04',1,[0,.42],'ตั้งหน้าที่ให้ผู้ช่วยก่อน', 'cards',{items:['ร่างข้อความไทยสุภาพ','ไม่แต่งวันส่งสินค้า'],note:'Agent = ผู้ช่วยที่เราตั้งหน้าที่ไว้',robot:'06-thinking.png'});
add('B04',2,[.42,1],'สองรหัส ใช้คนละหน้าที่', 'cards',{items:['Agent ID|เลือกผู้ช่วย','API key|ยืนยันสิทธิ์'],note:'นำทั้งคู่ไปตั้งค่าฝั่ง server',robot:'05-point-up.png'});
add('B05',1,[0,.30],'สร้าง key สำหรับแอปนี้', 'footage',{media:0,note:'ชื่อ key เป็นป้ายกำกับให้จำได้'});
add('B05',2,[.30,.55],'เลือกอายุการใช้งาน', 'footage',{media:7,note:'อายุ = ช่วงเวลาที่ key ใช้งานได้'});
add('B05',3,[.55,.82],'เลือกสิทธิ์ที่ต้องใช้', 'footage',{media:14,note:'ตัวอย่างแชทใช้ chat:invoke'});
add('B05',4,[.82,1],'นำ key ไปตั้งค่า server', 'code',{file:'.env · server',lines:['LANGMIND_API_KEY=<API_KEY>'],active:0,note:'ภาพอธิบาย · ค่าจริงเก็บฝั่ง server'});
add('B06',1,[0,.26],'ตั้งค่าฝั่ง server', 'code',{file:'.env · server',lines:['LANGMIND_API_KEY=<API_KEY>','','LANGMIND_AGENT_ID=<AGENT_ID>'],active:0,note:'key ยืนยันสิทธิ์ · Agent ID เลือกผู้ช่วย'});
add('B06',2,[.26,.64],'คัดลอกเฉพาะหลัง /agents/', 'agent');
add('B06',3,[.64,1],'โค้ด server อ่านค่าตั้งต้น', 'code',{file:'server.mjs · server',lines:['const API_KEY =','  process.env.','  LANGMIND_API_KEY;','','const AGENT_ID =','  process.env.','  LANGMIND_AGENT_ID;'],active:1,note:'.env → ค่าตั้งต้น → โค้ด server'});
add('B07',1,[0,.22],'กดส่งจากหน้าเว็บ', 'chat',{state:'wait'});
add('B07',2,[.22,.66],'/api/chat เป็นของแอปเรา', 'code',{file:'public/chat.js · หน้าเว็บ',lines:["fetch('/api/chat', {","  method: 'POST',","  body: JSON.stringify({","    message","  })","})"],active:0,note:'หน้าเว็บส่งข้อความให้ server ของแอป'});
add('B07',3,[.66,1],'server เชื่อมให้ผู้ใช้', 'flow',{focus:1});
add('B08',1,[0,.30],'ส่งคำขอไปที่ไหน?', 'code',{file:'HTTP request · server',lines:['POST','/api/chat/message/blocking','','Host: langmind.in.th'],active:1,note:'endpoint ของ LangMind · รอคำตอบเต็ม'});
add('B08',2,[.30,.58],'ยืนยันสิทธิ์ตรงไหน?', 'code',{file:'Request headers · server',lines:['Authorization:','  Bearer <API_KEY>','','Content-Type:','  application/json'],active:1,note:'JSON = ข้อมูลที่เขียนเป็นชื่อช่องกับค่า'});
add('B08',3,[.58,1],'ส่งข้อมูลอะไร?', 'code',{file:'Request body · server',lines:['{','  "agent_id": "<AGENT_ID>",','  "query": "คำถามผู้ใช้",','  "conversation_id": null','}'],active:3,note:'ครั้งแรกยังไม่มีรหัสบทสนทนา'});
add('B09',1,[0,.35],'ใช้ fetch ฝั่ง server', 'code',{file:'server.mjs · server',lines:['const res = await fetch(','  LANGMIND_URL, {',"  method: 'POST',",'  headers: {', '    Authorization:', '      `Bearer ${API_KEY}`','  },'],active:5,note:'ภาพย่อเพื่ออธิบาย · key อ่านจากฝั่ง server'});
add('B09',2,[.35,.68],'จับคู่ข้อมูลใน body', 'code',{file:'server.mjs · server',lines:['body: JSON.stringify({','  agent_id: AGENT_ID,','  query: message,','  conversation_id:','    conversationId','})'],active:0,note:'เลือกผู้ช่วย + คำถาม + รหัสบทสนทนา'});
add('B09',3,[.68,1],'ตรวจผลก่อนอ่านคำตอบ', 'code',{file:'server.mjs · server',lines:['if (!res.ok) {',"  throw Error('API error');",'}','return await res.json();'],active:0,note:'ข้อผิดพลาดต้องแยกจากคำตอบของผู้ช่วย'});
add('B10',1,[0,.51],'แสดงคำตอบ เก็บรหัสไว้', 'code',{file:'Response ตัวอย่าง · server',lines:['{','  "answer": "ข้อความคำตอบ",','  "conversation_id":','    "conv_demo_01"','}'],active:1,note:'answer → แชท · conversation_id → server'});
add('B10',2,[.51,1],'คำตอบกลับถึงหน้าเว็บ', 'chat',{state:'answer'});
add('B11',1,[0,.40],'ระหว่างรอ กันการส่งซ้ำ', 'chat',{state:'wait'});
add('B11',2,[.40,.84],'ถ้าส่งไม่สำเร็จ', 'chat',{state:'error'});
add('B12',1,[0,.23],'ถามต่อในเรื่องเดิม', 'chat',{state:'followQ'});
add('B12',2,[.23,.75],'ใช้ conversation_id เดิม', 'diff');
add('B12',3,[.75,1],'ได้ฉบับสั้นสำหรับ LINE', 'chat',{state:'follow'});
add('B13',1,[0,.45],'ตัวอย่างนี้รอคำตอบครบ', 'chat',{state:'wait'});
add('B13',2,[.45,1],'ถ้าจะรับคำตอบเป็นช่วง', 'cards',{items:['server|ปรับส่วนรับข้อมูล','หน้าเว็บ|ปรับการแสดงผล'],note:'ต้องพัฒนาเพิ่มทั้งสองฝั่ง'});
add('B14',1,[0,.60],'ออกแบบให้เหมาะกับอุปกรณ์', 'devices');
add('B14',2,[.60,1],'จอใหญ่ เพิ่มพื้นที่แก้ข้อความ', 'workspace');
add('B15',1,[0,.38],'เปลี่ยนหน้าที่ แล้วต่อเติม', 'cards',{items:['คำสั่ง|หน้าที่และน้ำเสียง','ฐานความรู้|FAQ และคู่มือ','ระบบงาน|เพิ่มเครื่องมือและตรวจสิทธิ์'],note:'ส่วนต่อยอดต้องเตรียมและพัฒนาเพิ่ม'});
add('B15',2,[.38,.78],'จำวงจรหลักไว้', 'flow',{summary:true});
add('B15',3,[.78,1],'งานแรกของคุณคืออะไร?', 'hero',{end:true});
add('B16',1,[0,1],'สร้างสิ่งต่อไป ในแบบของคุณ', 'logo');
const alignmentPath=path.join(dir,'evidence/narration-alignment.json');
if(fs.existsSync(alignmentPath)){
 const align=JSON.parse(read(alignmentPath));
 const anchors={'b01-2':'แต่ถ้าอยากให้ทีม','b02-2':'แล้วขอฉบับสั้น','b04-2':'จากนั้นเตรียมสองอย่าง','b05-2':'ส่วนอายุ','b05-3':'และสิทธิ์','b05-4':'เมื่อสร้างแล้ว','b06-2':'ให้เปิดหน้าของ Agent','b06-3':'ส่วนโค้ดฝั่ง server','b07-2':'หน้าเว็บนำข้อความ','b07-3':'ส่วน server','b08-2':'ในส่วนหัว','b08-3':'ส่วนข้อมูล','b09-2':'แล้วใส่คำถาม','b09-3':'เมื่อ API ตอบกลับ','b10-2':'แล้วส่งข้อความ','b11-2':'ถ้าส่งไม่สำเร็จ','b12-2':'เราส่งคำถามใหม่','b14-2':'ส่วนจอใหญ่','b15-2':'จำวงจรหลักไว้','b15-3':'ลองเริ่มจากงานหนึ่ง'};
 const clean=s=>s.toLowerCase().replace(/[\s.,?!:;_“”"'\/()–—…]/g,'');
 for(const s of shots){const b=beats.find(b=>b.id===s.beat);if(anchors[s.id]){const a=align[s.beat];const i=a.source.indexOf(clean(anchors[s.id]));if(i>=0)s.start=b.start+a.times[i];}if(s.id==='b12-3')s.start=b.end;}
 const opening=shots.find(s=>s.id==='b01-2');const openingAlign=align.B01;opening.start=beats[0].start+openingAlign.times[openingAlign.source.indexOf(clean('พร้อมหน้าจอที่เข้ากับงาน'))];
 for(const b of beats){const group=shots.filter(s=>s.beat===b.id);for(let i=0;i<group.length;i++)group[i].duration=(group[i+1]?.start??(b.start+b.length))-group[i].start;}
}
shots[0].duration+=shots[0].start;shots[0].start=0;
const tokenState=(lines)=>({code:lines.join('\n'),tokens:lines.flatMap((line,i)=>[{key:'l'+i,content:line,color:line.includes('conversation')?'#ffdc60':line.includes('API_KEY')?'#9ee9c4':'#eef5ff',fontStyle:0},{key:'n'+i,content:'\n',color:'#fff',fontStyle:0}])});
function codeShot(s,diff=false){
 const src=read(path.join(old,'compositions',diff?'code-diff.html':'code-highlight.html'));
 const baseStyle=src.match(/<style>([\s\S]*?)<\/style>/)[1];
 const engine=src.slice(src.indexOf('// hf-code-anim.js')).replace(/<\/script>[\s\S]*$/,'').replaceAll('window.__timelines["'+(diff?'code-diff':'code-highlight')+'"]',`window.__timelines["${s.id}"]`);
 const lines=diff?['query: "คำถามแรก",','conversation_id: null']:s.lines;
 const states=diff?[tokenState(lines),tokenState(['query: "ขอสั้นลงสำหรับ LINE",','conversation_id:','  "conv_demo_01"'])]:[tokenState(lines)];
 const js=`window.__TOKENS={feature:{states:${JSON.stringify(states)}}};window.__BLOCK={seq:'feature',effect:'${diff?'diff':'highlight'}',line:${s.active||0}};${engine}`.replaceAll('height: 46','height: 82').replaceAll('opacity: 0.45','opacity: 0.72').replace('start + FADE + 0.3','start + FADE + 1.8');
 return shell(s.id,s.title,`<div class="editor" id="editor" data-layout-allow-overlap><div class="titlebar"><span class="filename">${esc(diff?'Request body · server':s.file)}</span></div><div class="code-surface" id="surface"></div></div><div class="note">${diff?'ครั้งแรก: null → ถามต่อ: รหัสเดิม<br>server ต้องตรวจเจ้าของบทสนทนาด้วย':s.note}</div><div class="foot">${diff?'ภาพเปรียบเทียบข้อมูลจำลอง · สีแดงคือข้อมูลก่อนเปลี่ยน':'โค้ดย่อประกอบคำอธิบาย · ไม่ใช่โปรเจกต์พร้อมรัน'}</div>`,js,`${baseStyle}\n${css}\n#root{background-color:#eaf4ff}.editor{left:90px;top:420px;transform:none;width:900px;height:790px;border:7px solid #202326;border-radius:28px;box-shadow:9px 10px 0 white}.titlebar{height:95px;flex-basis:95px;padding:20px 30px;background:#172a3a}.filename{font:700 38px Sarabun;color:#fff}.code{font:48px/82px Consolas,monospace;top:34px;padding:0 22px 0 75px}.gutter{top:34px;width:60px;padding-right:12px;font:36px/82px Consolas}.ln,.line{min-height:82px;height:82px}.hl-box{background:#2564a766;border-left:6px solid #ffd73c}.diff-line{height:82px;line-height:82px;font-size:45px}.diff-sign{width:38px}.note{top:1265px;font-size:43px}.scene{background:transparent}`);
}
function chatShot(s){
 const src=read(path.join(old,'compositions/ai-chat-reveal.html'));
 const style=src.match(/<style>([\s\S]*?)<\/style>/)[1];
 let markup=src.slice(src.indexOf('<section id="acr-chat"'),src.indexOf('id="acr-endcard"'));
 markup=markup.slice(0,markup.lastIndexOf('<section')).replace('data-duration="16.9"',`data-duration="${s.duration}"`);
 markup=markup.replace('How do I turn my HTML into real video?',esc(q1)).replace('>Assistant<','>'+esc(s.head||'ผู้ช่วยร้านเรา')+'<');
 const follow=s.state.startsWith('follow');
 const answer=s.state==='wait'||s.state==='followQ'?'กำลังรอคำตอบ…':s.state==='error'?'ส่งข้อความไม่สำเร็จ ลองอีกครั้ง':follow?a2:a1;
 const js=`document.querySelector('#acr-bubble').textContent=${JSON.stringify(follow?q2:q1)};document.querySelector('#acr-answer').textContent=${JSON.stringify(answer)};document.querySelector('#acr-ph').textContent=${JSON.stringify(s.state==='error'?q1:'พิมพ์ข้อความ…')};const tl=gsap.timeline({paused:true});tl.fromTo('#acr-bubble',{opacity:0,y:12},{opacity:1,y:0,duration:.3},.15);tl.fromTo('#acr-answer',{opacity:0},{opacity:1,duration:.3},${s.state==='wait'?.55:1});window.__timelines=window.__timelines||{};window.__timelines['${s.id}']=tl;`;
 const extra=`${style}\n${css}\n#acr-chat{inset:0;background:transparent;overflow:visible} .acr-stage{left:90px;top:405px;width:900px;height:825px;transform:none;border:7px solid #202326;border-radius:32px;background:#fff;box-shadow:10px 10px 0 #fff;overflow:hidden;font-family:Sarabun}#acr-chat-bg{border-radius:28px}#acr-statusbar,#acr-keyboard,#acr-hleft,.acr-hicons,#acr-home,#acr-homebar,#acr-dot,#acr-plusi,#acr-mic,#acr-wave,#acr-btn-stop,#acr-btn-send-grey{display:none!important}#acr-header{top:0;left:0;width:100%;height:102px;background:#d9ecff;border-bottom:3px solid #202326;display:grid;place-items:center}#acr-htitle{font:700 45px Sarabun;position:static;letter-spacing:0}#acr-bubble{top:138px;right:30px;max-width:750px;font:46px/1.5 Sarabun;letter-spacing:0;background:#d7f1e3;border:3px solid #204c43;border-radius:24px;opacity:1;visibility:visible;padding:20px 27px}#acr-answer{top:${follow?305:390}px;left:32px;width:820px;font:46px/1.55 Sarabun;letter-spacing:0;color:${s.state==='error'?'#942f30':'#17252e'}}#acr-composer{left:25px;right:25px;bottom:20px}#acr-pill{border:3px solid #719398;border-radius:18px;min-height:80px;padding:12px 20px}#acr-ph{position:static;font:37px/1.5 Sarabun;color:#465a61;letter-spacing:0;max-width:680px}#acr-ctext,#acr-caret{display:none}#acr-btn-send-black{display:block;visibility:visible;opacity:${s.state==='wait'?'.25':'1'}}#acr-endcard{display:none} .note{top:1290px;font-size:38px}`;
 return shell(s.id,s.title,markup+`<div class="note">ภาพจำลอง · คำตอบตัวอย่าง${follow?'<br>ร่างข้อความสำหรับนำไปส่ง LINE':''}</div>`,js,extra,s.state==='error'?'#fff0ef':'#fff9e9');
}
function exchangeShot(s){
 const source=read(path.join(dir,'compositions/chatgpt-exchange.html'));
 const style=source.match(/<style>([\s\S]*?)<\/style>/)[1];
 const build=source.slice(source.indexOf('const screen = document.getElementById("cge-screen")'),source.indexOf('// table'));
 const js=`const CONFIG={prompt:${JSON.stringify(q1)},paragraphs:[${JSON.stringify(a1)}]};${build}port.appendChild(thread);screen.appendChild(port);const tl=gsap.timeline({paused:true});tl.fromTo(bubble,{opacity:0,y:12},{opacity:1,y:0,duration:.3},.15);tl.fromTo(answer,{opacity:0},{opacity:1,duration:.3},.9);window.__timelines=window.__timelines||{};window.__timelines['${s.id}']=tl;`;
 return shell(s.id,s.title,`<div class="screen" id="cge-screen"><div class="header">ChatGPT</div><div class="composer">ถาม ChatGPT</div></div><div class="note">ภาพจำลอง · คำตอบตัวอย่าง</div>`,js,style+css+`.screen{left:90px;top:405px;width:900px;height:880px;margin:0;transform:none;background:#191919;border:7px solid #202326;border-radius:30px;font-family:Sarabun;--ink:#fff;--bubble:#343434}.header{position:absolute;top:0;left:0;width:100%;height:102px;display:grid;place-items:center;font:700 45px Sarabun;background:#242424;color:#fff;z-index:15}.scrollport{top:110px;bottom:100px}.thread{padding:25px 32px}.bubble{width:750px;font:46px/1.5 Sarabun;padding:20px 27px;border-radius:24px}.answer{font:45px/1.55 Sarabun;color:white;margin-top:35px}.para{font:inherit;height:auto}.w{opacity:1}.composer{position:absolute;left:25px;top:auto;bottom:20px;width:836px;height:80px;border:3px solid #aaa;border-radius:18px;font:37px Sarabun;padding:14px 22px;color:#d8d8d8;background:#242424}.note{top:1320px;font-size:38px}`);
}
function flowShot(s){
 const source=read(path.join(old,'compositions/flowchart-vertical.html'));
 const nodeCss=source.match(/<style>[\s\S]*?<\/style>/g)?.map(x=>x.slice(7,-8)).join('\n')||'';
 const labels=['หน้าเว็บ','server ของแอปเรา','LangMind Agent'];
 const subs=['พิมพ์และอ่านคำตอบ','/api/chat · รับข้อความ','ผู้ช่วยที่เราตั้งหน้าที่ไว้'];
 const body=`<div class="canvas"><svg class="connectors" width="1080" height="1300"><path class="connector" d="M540 615 L540 735"/><path class="connector" d="M540 915 L540 1035"/></svg>${labels.map((x,i)=>`<div id="node-${i}" class="node ${['yellow','green','peach'][i]}">${x}<small>${subs[i]}</small></div>`).join('')}</div><div class="note">${s.summary?'หน้าเว็บ → server → LangMind → คำตอบ<br>ถามต่อ ใช้รหัสบทสนทนาเดิม':'เราพัฒนาหน้าเว็บและส่วนเชื่อมต่อ<br>LangMind ให้ Agent ตอบตามที่ตั้งค่า'}</div>`;
 const js=`const tl=gsap.timeline({paused:true});${labels.map((_,i)=>`tl.fromTo('#node-${i}',{scale:.8,opacity:0},{scale:1,opacity:1,duration:.4,ease:'back.out(1.3)'},${.2+i*1.4});`).join('')}tl.fromTo('.connector',{strokeDashoffset:140},{strokeDashoffset:0,duration:.7,stagger:1.4},1);tl.fromTo('#node-${s.focus||2}',{borderColor:'#202326'},{borderColor:'#1667d0',duration:.4},4.5);window.__timelines=window.__timelines||{};window.__timelines['${s.id}']=tl;`;
 return shell(s.id,s.title,body,js,`${nodeCss}\n${css}\n.canvas{position:absolute;inset:0}.node{position:absolute;left:170px;width:740px;height:180px;border:6px solid #202326;border-radius:22px;box-shadow:8px 9px 0 white;font:700 54px Sarabun;text-align:center;display:flex;flex-direction:column;justify-content:center;transform:none}.node small{font:39px Sarabun;margin-top:12px}#node-0{top:435px;background:#ffdf60}#node-1{top:735px;background:#bce9d8}#node-2{top:1035px;background:#c8dfff}.connector{stroke:#202326;stroke-width:7;fill:none;stroke-dasharray:140}.note{top:1285px;font-size:40px}`);
}
for(const s of shots){
 let html;
 if(s.kind==='code'||s.kind==='diff')html=codeShot(s,s.kind==='diff');
 else if(s.kind==='chat')html=chatShot(s);
 else if(s.kind==='flow')html=flowShot(s);
 else if(s.kind==='hero')html=shell(s.id,s.title,`<div class="big">${s.end?'เริ่มจากงานหนึ่งอย่าง<br>ที่อยากให้ผู้ช่วยทำ':'<strong>ผู้ช่วยที่กำหนดหน้าที่ไว้</strong><br>บนหน้าจอที่เข้ากับงานทีม'}<p class="sub">${s.end?'แล้วออกแบบหน้าจอให้เหมาะกับงานนั้น':'ร่างข้อความ → รับคำตอบ → ถามต่อ'}</p></div><img class="robot" width="290" height="320" src="assets/${s.end?'04-open-arms.png':'01-question.png'}" alt="Robot LangMind">`);
 else if(s.kind==='cards')html=shell(s.id,s.title,`<div class="big">${s.items.map(x=>`<div class="tile">${x.includes('|')?`<b>${x.split('|')[0]}</b><small>${x.split('|')[1]}</small>`:x}</div>`).join('')}</div><div class="note">${s.note}</div>${s.robot?`<img class="robot" width="290" height="320" src="assets/${s.robot}" alt="Robot ช่วยชี้">`:''}`,'','.big{font-size:53px}.tile{padding:24px 30px;margin-bottom:30px}.robot{width:190px;height:220px;right:105px;top:1040px}');
 else if(s.kind==='agent')html=shell(s.id,s.title,`<div class="big" style="top:420px"><img src="assets/agent-url.png" width="860" height="115" alt="ตำแหน่ง URL หน้า Agent จากภาพผู้ใช้"><div class="tile url">langmind.in.th/agents/<br><strong>a056aef2-3bfb-4564-<br>8166-7abd28849c42</strong></div><div class="arrow">↓</div><div class="badge">LANGMIND_AGENT_ID</div></div><div class="note">ตัวอย่างตำแหน่งรหัสจากหน้า Agent NECTEC<br>ใช้ ID ของ Agent ที่คุณสร้างเอง</div>`,'','.note{font-size:39px}');
 else if(s.kind==='footage')html=shell(s.id,s.title,`<video id="key-video" class="clip" data-start="0" data-duration="${s.duration}" data-media-start="${s.media}" src="assets/key-panel.mp4" muted width="626" height="896" style="position:absolute;left:185px;top:380px;width:710px;height:1016px;border:7px solid #202326;border-radius:20px"></video><div class="note">${s.note}</div>`,'','.note{top:1410px;font-size:39px;padding:12px 22px}');
 else if(s.kind==='step')html=shell(s.id,s.title,`<div class="big"><div class="tile"><b>1 · เตรียมผู้ช่วย</b></div><div class="tile">2 · เชื่อมข้อความ</div><div class="tile">3 · ออกแบบต่อยอด</div></div>`);
 else if(s.kind==='devices')html=shell(s.id,s.title,`<div id="device-stage" class="clip" data-composition-id="multi-device-splay" data-composition-src="compositions/components/multi-device-splay.html" data-start="0" data-duration="${s.duration}" data-width="1080" data-height="1920" style="position:absolute;left:0;top:390px;width:1080px;height:850px" data-variable-values='{"accent":"green"}'></div><div class="note">มือถือ: ถามและคัดลอกข้อความ<br>จอใหญ่: เพิ่มพื้นที่แก้ข้อความข้างแชท</div>`);
 else if(s.kind==='workspace')html=shell(s.id,s.title,`<div class="big"><div class="tile" style="font-size:46px"><b>พื้นที่แชท</b>${q2}</div><div class="tile" style="font-size:44px"><b>พื้นที่แก้ข้อความ</b>${a2}</div><span class="badge">Agent ตัวเดิม</span></div><div class="note">ภาพอธิบายการจัดพื้นที่ · เราพัฒนาหน้าจอเอง</div>`,'','.note{font-size:38px}');
 else if(s.kind==='logo')html=shell(s.id,s.title,`<div id="extruded-host" class="clip" data-start="0" data-duration="3.3" data-composition-id="extruded-logo" data-composition-src="compositions/extruded-logo.html" data-width="1920" data-height="1080" data-variable-values='{"text":"LANGMIND","background":"#fff9e9","color":"#009ec3"}' style="position:absolute;top:500px;width:1080px;height:607.5px"></div><img id="end-logo" src="assets/logo.png" width="760" height="380" style="position:absolute;left:160px;top:560px;width:760px;height:380px" alt="LangMind"><div class="big" style="top:1070px;text-align:center;font-size:45px">langmind.in.th</div>`,`const tl=gsap.timeline({paused:true});tl.fromTo('#end-logo',{opacity:0,scale:.94},{opacity:1,scale:1,duration:.65},3.25);window.__timelines=window.__timelines||{};window.__timelines['${s.id}']=tl;`);
 if(s.kind==='chat')html=html.replace('</style>', '#acr-ph{position:absolute;left:22px;top:20px;transform:none;width:700px;max-width:700px;white-space:normal}#acr-pill{height:94px;min-height:94px;display:block}#acr-cmic{display:none}#acr-btn-send-black{right:8px;top:8px}.acr-stage{height:880px}#acr-answer{font-size:45px}#acr-composer{bottom:18px}'+(s.state==='error'?'#acr-pill{height:205px}#acr-ph{font-size:35px;width:690px}':'')+'</style>');
 if(s.kind==='footage'){
  const name=['key-name.mp4','key-age.mp4','key-scope.mp4'][+s.id.at(-1)-1];
  html=html.replace('assets/key-panel.mp4','assets/'+name).replace(`data-media-start="${s.media}"`,'data-media-start="0"').replace('left:185px;top:380px;width:710px;height:1016px','left:100px;top:455px;width:880px;height:820px').replace('.note{top:1410px','.note{top:1310px');
 }
 if(s.kind==='diff')html=html.replace('.note{top:1265px;font-size:43px}', '.note{top:1235px;font-size:40px}.foot{top:1415px;font-size:28px}');
 if(s.kind==='logo')html=html.replace('width:1080px;height:607.5px','width:1920px;height:1080px;transform:scale(.5625);transform-origin:top left').replace('"background":"#fff9e9"','"tagline":"","background":"#fff9e9"');
 if(s.kind==='step'){
  const step=read(path.join(dir,'compositions/components/onboarding-stepper-flow.html'));
  const style=step.match(/<style>([\s\S]*?)<\/style>/)[1];
  let body=step.slice(step.indexOf('<div class="hf-ui-onboarding-flow">'),step.indexOf('<style>'));
  body=body.replace('class="done"','class="active"').replace('<span class="active">2</span>','<span>2</span>').replace('Step 2 of 3','เส้นทางของตอนนี้').replace('Choose your visual style','1 · เตรียมผู้ช่วย').replace('Pick a direction so the agent can generate matching motion primitives.','2 · เชื่อมข้อความ<br>3 · ออกแบบต่อยอด').replace('<button type="button">Continue</button>','');
  html=shell(s.id,s.title,body,`const tl=gsap.timeline({paused:true});tl.fromTo('.hf-ui-onboarding-steps span',{scale:.7,opacity:0},{scale:1,opacity:1,duration:.28,stagger:.08,ease:'back.out(1.8)'},.1);tl.fromTo('.hf-ui-onboarding-card',{y:28,opacity:0},{y:0,opacity:1,duration:.42,ease:'power3.out'},.4);window.__timelines=window.__timelines||{};window.__timelines['${s.id}']=tl;`,style+`.hf-ui-onboarding-flow{position:absolute;left:110px;top:500px;width:860px;font-family:Sarabun;gap:55px}.hf-ui-onboarding-steps{gap:55px}.hf-ui-onboarding-steps span{width:100px;height:100px;font-size:48px;border:5px solid #202326}.hf-ui-onboarding-steps .active{background:#16704c}.hf-ui-onboarding-card{border:6px solid #202326;box-shadow:8px 9px 0 white;padding:48px;gap:35px}.hf-ui-onboarding-card small{font-size:33px;letter-spacing:0;color:#3a4a54}.hf-ui-onboarding-card strong{font-size:61px;line-height:1.3}.hf-ui-onboarding-card p{font-size:46px;line-height:1.7;color:#334d5f}`);
 }
 write('compositions/'+s.id+'.html',html);
}
const overlays=[];
for(const id of ['b04-2','b06-1','b06-2','b08-2','b12-2']){const s=shots.find(s=>s.id===id);overlays.push(`<div id="dart-${id}" class="clip" data-composition-id="dart-cursor" data-composition-src="compositions/components/dart-cursor.html" data-start="${s.start+1}" data-duration="${Math.min(4,s.duration-1)}" data-width="1080" data-height="1920" data-variable-values='{"target_x":54,"target_y":41,"target2_x":52,"target2_y":51,"tone":"light","blur":0}' style="position:absolute;inset:0;z-index:5;pointer-events:none"></div>`);}
const captions=[];
const correctedPath=path.join(dir,'evidence/corrected-captions.json');
if(fs.existsSync(correctedPath))for(const [i,c] of JSON.parse(read(correctedPath)).entries()){const b=beats.find(b=>b.id===c.beat);captions.push({id:c.beat+'-'+i,start:b.start+c.start,end:Math.min(b.end+.3,b.start+c.end),text:c.text});}
for(const b of beats){
 if(fs.existsSync(correctedPath))continue;
 const p=path.join(dir,'evidence',b.id+'-transcript.json');
 if(!fs.existsSync(p))continue;
 const segs=JSON.parse(read(p));
 for(const [i,seg] of segs.entries()){
  const words=seg.words?.length?seg.words:[{start:seg.start,end:seg.end,text:seg.text}];
  let group=[],len=0;
  function flush(){if(!group.length)return;const text=group.map(w=>w.text).join('').trim();captions.push({id:b.id+'-'+i+'-'+captions.length,start:b.start+group[0].start,end:Math.min(b.end+.2,b.start+group.at(-1).end+.12),text});group=[];len=0;}
  for(const w of words){if(len+w.text.length>62&&group.length)flush();group.push(w);len+=w.text.length;}flush();
 }
}
const root=`<!doctype html><html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=1080,height=1920"><title>EP02 · เว็บแชทของเราเองด้วย LangMind API</title><script src="assets/gsap.min.js"></script><style>@font-face{font-family:Sarabun;src:url('assets/Sarabun-Regular.ttf')}*{box-sizing:border-box}html,body{margin:0;width:1080px;height:1920px;background:#fff9e9;overflow:hidden}#root{position:relative;width:1080px;height:1920px}.caption{position:absolute;left:108px;top:1530px;width:864px;z-index:20;text-align:center;font:48px/1.5 Sarabun;color:white}.caption span{background:#17252ef5;border-radius:12px;padding:8px 17px;box-decoration-break:clone;-webkit-box-decoration-break:clone}.logo{position:absolute;right:90px;top:36px;width:235px;height:95px;object-fit:contain;z-index:8}.bar{position:absolute;left:0;bottom:0;height:12px;background:#1bae76;width:1080px;transform-origin:left;z-index:30}</style></head><body><main id="root" data-composition-id="main" data-width="1080" data-height="1920" data-duration="${total}" data-fps="30">${shots.map(s=>`<div id="${s.id}" class="clip" data-composition-id="${s.id}" data-composition-src="compositions/${s.id}.html" data-start="${s.start}" data-duration="${s.duration}" data-track-index="1" data-track-kind="graphics" data-width="1080" data-height="1920" style="position:absolute;inset:0"></div>`).join('\n')}${overlays.join('\n')}${beats.map(b=>`<audio id="vo-${b.id}" class="clip" src="assets/${esc(b.file)}" data-start="${b.start}" data-duration="${b.duration}" data-volume="0.83" data-track-index="2" data-track-kind="audio"></audio>`).join('\n')}${captions.map(c=>`<div id="caption-${c.id}" class="clip caption" data-start="${c.start}" data-duration="${Math.max(.1,c.end-c.start)}" data-track-index="6" data-track-kind="captions"><span>${esc(c.text)}</span></div>`).join('\n')}<img class="logo" src="assets/logo.png" width="235" height="95" alt="LangMind"><div class="bar"></div></main><script>const tl=gsap.timeline({paused:true});tl.fromTo('.bar',{scaleX:0},{scaleX:1,duration:${total},ease:'none'},0);window.__timelines=window.__timelines||{};window.__timelines.main=tl;</script></body></html>`;
write('index.html',root);write('shots.json',JSON.stringify(shots,null,2));write('captions.json',JSON.stringify(captions,null,2));
const stamp=t=>{let ms=Math.round(t*1000);return `${String(Math.floor(ms/3600000)).padStart(2,'0')}:${String(Math.floor(ms/60000)%60).padStart(2,'0')}:${String(Math.floor(ms/1000)%60).padStart(2,'0')},${String(ms%1000).padStart(3,'0')}`;};
write('captions.srt',captions.map((c,i)=>`${i+1}\n${stamp(c.start)} --> ${stamp(c.end)}\n${c.text}\n`).join('\n'));
console.log(JSON.stringify({total,beats:beats.length,shots:shots.length,captions:captions.length}));

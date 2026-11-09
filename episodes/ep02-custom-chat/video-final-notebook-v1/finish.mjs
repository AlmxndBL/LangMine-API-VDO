import fs from 'node:fs';
const dir=new URL('./',import.meta.url),read=p=>fs.readFileSync(new URL(p,dir),'utf8'),write=(p,s)=>fs.writeFileSync(new URL(p,dir),s);
// The first registry's full mobile builder requires unrelated status/keyboard state.
// Use the already verified AI Chat Reveal adaptation for this brief familiar-chat shot.
let builder=read('build.mjs').replace("html=s.id==='b01-1'?exchangeShot(s):chatShot(s)","html=chatShot(s)");write('build.mjs',builder);
await import('./build.mjs?final');
const {beats,total}=JSON.parse(read('timing.json'));let shots=JSON.parse(read('shots.json'));
const grid=`background-color:#f4e8ce;background-image:linear-gradient(#557ea52b 2px,transparent 2px),linear-gradient(90deg,#557ea52b 2px,transparent 2px);background-size:54px 54px;`;
const summaries={
B01:['จากแชท AI ที่คุ้นเคย','สู่ผู้ช่วยบนเว็บของทีมเรา','ตั้งแต่เตรียม key จนถึงถามต่อ'],
B02:['ช่วยทีมร่างข้อความสุภาพ','ขอฉบับสั้นสำหรับ LINE','ตรวจข้อความก่อนนำไปส่ง'],
B03:['เริ่มจาก 3 ส่วน','หน้าเว็บส่งข้อความให้ server','server เชื่อม LangMind Agent','ได้คำตอบ ส่งกลับทางเดิม','เราพัฒนาหน้าเว็บและส่วนเชื่อมต่อ'],
B04:['ตั้งหน้าที่และน้ำเสียงให้ Agent','Agent ID เลือกผู้ช่วย','API key ยืนยันสิทธิ์'],
B05:['ตั้งชื่อ key ให้จำแอปได้','เลือกอายุและสิทธิ์ที่ต้องใช้','ตัวอย่างแชทใช้ chat:invoke','นำ key ไปตั้งค่าฝั่ง server'],
B06:['เก็บ key ฝั่ง server','Agent ID อยู่หลัง /agents/','ใช้ ID ของ Agent ที่คุณสร้าง','โค้ดอ่านจากค่าตั้งต้น'],
B07:['กดส่งจากหน้าเว็บ','/api/chat คือ route ของแอปเรา','server จึงเรียก LangMind'],
B08:['POST ไปยัง LangMind','Authorization: Bearer ตามด้วย key','agent_id เลือกผู้ช่วย · query คือคำถาม','รอบแรก conversation_id เป็น null'],
B09:['server ใช้ fetch เรียก API','อ่าน key และ Agent ID จากค่าตั้งต้น','ตรวจผลสำเร็จก่อนอ่านคำตอบ'],
B10:['answer คือข้อความคำตอบ','server เก็บรหัสบทสนทนาไว้','ส่งคำตอบกลับมาแสดงในแชท'],
B11:['ระหว่างรอ กันการกดส่งซ้ำ','ส่งไม่สำเร็จ ให้ลองใหม่ได้','เก็บข้อความที่ผู้ใช้พิมพ์ไว้'],
B12:['ถามใหม่ แต่คุยเรื่องเดิม','ใช้ conversation_id จากรอบก่อน','server ต้องตรวจเจ้าของบทสนทนา','ได้ข้อความฉบับสั้นแล้ว'],
B13:['ตัวอย่างนี้รอคำตอบครบ','รับเป็นช่วง ต้องปรับทั้งสองฝั่ง'],
B14:['จัดหน้าจอให้เข้ากับอุปกรณ์','มือถือ: ถามและคัดลอก','จอใหญ่: เพิ่มพื้นที่แก้ข้อความ'],
B15:['ต่อยอดคำสั่งและฐานความรู้','เชื่อมระบบงาน ต้องตรวจสิทธิ์','จำวงจรข้อความไป–กลับ','เริ่มจากงานหนึ่งอย่างของคุณ']};
const captions=[];
for(const b of beats){if(!summaries[b.id])continue;const list=summaries[b.id],span=b.id==='B12'?b.length:b.duration;list.forEach((text,i)=>captions.push({id:b.id+'-'+i,text,start:b.start+i*span/list.length,end:b.start+(i+1)*span/list.length}));}
for(const s of shots){if(s.beat==='B16')continue;let html=read('compositions/'+s.id+'.html');
const heading=['code','agent','footage','diff'].includes(s.kind)?`h1{font-size:48px;left:110px;top:175px;width:auto;max-width:860px;padding:15px 25px;text-align:left;box-shadow:6px 7px 0 white}`:'h1{display:none}';
html=html.replace('</style>',`#root{${grid}}.kicker,.note{display:none!important}.foot{font-size:29px;top:1460px;width:860px}.robot{display:none}.big{top:390px;font-size:58px}.tile{box-shadow:7px 9px 0 white;border-width:5px}.tile:nth-child(2n){transform:rotate(1deg);background:#e3f3eb}.tile:nth-child(2n+1){transform:rotate(-1deg)}${heading}.acr-stage{transform:rotate(-1deg);transform-origin:center}.editor{top:360px!important}.url{font-size:46px}.badge{font-size:43px}</style>`);
if(s.kind==='flow'&&s.beat==='B03'){
 const b=beats.find(b=>b.id==='B03');s.duration=b.length;
 html=`<!doctype html><html lang="th"><body><template><style>#root{width:1080px;height:1920px;position:relative;${grid}}.grid{position:absolute;inset:0;background-image:linear-gradient(#557ea52b 2px,transparent 2px),linear-gradient(90deg,#557ea52b 2px,transparent 2px);background-size:54px 54px}</style><div id="root"><video id="explainroo-journey" class="clip" data-start="0" data-duration="${b.length}" src="assets/journey.mp4" muted width="1080" height="1920"></video><div class="grid"></div></div><script>window.__timelines=window.__timelines||{};window.__timelines['${s.id}']=gsap.timeline({paused:true}).to({},{duration:${b.length}});</script></template></body></html>`;
}
html=html.replace('<div id="root"><video',`<div id="root" data-composition-id="${s.id}"><video`);
html=html.replace('</style>','.foot{width:570px;font-size:30px}.code{padding-left:60px!important}</style>');
if(['chat','devices','workspace'].includes(s.kind))html=html.replace('</div><script>',`<div style="position:absolute;left:110px;top:1460px;width:570px;font:34px Sarabun;color:#344953">ภาพจำลอง · คำตอบตัวอย่าง</div></div><script>`);
if(s.kind==='agent')html=html.replace('</div><script>',`<div style="position:absolute;left:110px;top:1460px;width:570px;font:32px Sarabun;color:#344953">ตัวอย่างตำแหน่งรหัสจาก Agent NECTEC<br>ใช้รหัสของ Agent ที่คุณสร้างเอง</div></div><script>`);
write('compositions/'+s.id+'.html',html);
}
shots=shots.filter(s=>s.id!=='b03-2');
let root=read('index.html').replace(/<div id="caption-[\s\S]*?<\/div>/g,'').replace(/<div id="b03-2"[\s\S]*?<\/div>/,'');
const b3=beats.find(b=>b.id==='B03');root=root.replace(new RegExp('(id="b03-1"[^>]*data-duration=")[^"]+'),`$1${b3.length}`);
const end=beats.find(b=>b.id==='B16');root=root.replace(/<div id="b16-1"[\s\S]*?<\/div>/,`<div id="final-brand" class="clip" data-composition-id="logo-brand-close" data-composition-src="compositions/components/logo-brand-close.html" data-start="${end.start}" data-duration="${total-end.start}" data-variable-values='{"wordmark":"LANGMIND","tagline":"สร้างสิ่งต่อไป ในแบบของคุณ","url":"langmind.in.th","accent":"green","exit":"none"}' style="position:absolute;inset:0" data-width="1080" data-height="1920"></div><div id="brand-logo" class="clip" data-start="${end.start+2.1}" data-duration="${total-end.start-2.1}" style="position:absolute;left:330px;top:480px;width:420px;height:290px;z-index:10"><img src="assets/logo.png" width="420" height="290" style="object-fit:contain" alt="LangMind"></div>`);
root=root.replace('<img class="logo"',captions.map(c=>`<div id="summary-${c.id}" class="clip caption" data-start="${c.start}" data-duration="${c.end-c.start}" data-track-kind="captions"><span>${c.text}</span></div>`).join('')+'<img class="logo"');
const roles=[];
for(const s of shots){if(s.beat==='B16')continue;let pose='05-point-up.png',x=720,y=1250;
 if(['chat','hero'].includes(s.kind)){pose=s.state==='answer'||s.state==='follow'?'10-thumbs-up.png':s.state==='error'?'06-thinking.png':'04-open-arms.png';}
 if(s.kind==='cards')pose=s.beat==='B04'?'06-thinking.png':'04-open-arms.png';
 if(s.kind==='flow')pose='04-open-arms.png';
 if(s.kind==='agent'){x=730;y=1120;}
 if(s.kind==='footage'){x=700;y=1320;}
 if(s.beat==='B03'){
  for(const [i,a,z,file,px,py] of [[0,0,4,'06-thinking.png',680,320],[1,4,7.5,'05-point-up.png',80,770],[2,7.5,12,'05-point-up.png',680,1210],[3,12,17.5,'10-thumbs-up.png',690,1280],[4,17.5,b3.length,'04-open-arms.png',700,1280]])roles.push({id:s.id+'-'+i,start:s.start+a,duration:z-a,pose:file,x:px,y:py});
 }else roles.push({id:s.id,start:s.start,duration:s.duration,pose,x,y});
}
roles.push({id:'bye',start:end.start,duration:4,pose:'08-high-wave.png',x:90,y:1180});
root=root.replace('<div class="bar"></div>',roles.map(r=>`<div id="robot-${r.id}" class="clip" data-start="${r.start}" data-duration="${r.duration}" style="position:absolute;left:${r.x}px;top:${r.y}px;width:280px;height:320px;z-index:9"><img src="assets/${r.pose}" width="280" height="320" style="object-fit:contain" alt="Robot LangMind ช่วยอธิบาย"></div>`).join('')+'<div class="bar"></div>');
root=root.replace('</style>',`#root{${grid}--bg:#f4e8ce;--fg:#17252e;--font-body:Sarabun;--font-display:Sarabun}.caption{top:1660px;font-size:50px;line-height:1.5}.caption span{background:#fff4c9;color:#17252e;border:4px solid #202326;padding:10px 20px;box-shadow:6px 7px 0 white}.logo{width:190px;height:80px;opacity:.9}</style>`);
root=root.replace('window.__timelines=window.__timelines||{};',roles.map(r=>`tl.fromTo('#robot-${r.id} img',{opacity:0,y:20,scale:.95},{opacity:1,y:0,scale:1,duration:.3,ease:'power2.out'},${r.start});`).join('')+'window.__timelines=window.__timelines||{};');
write('index.html',root);write('shots.json',JSON.stringify(shots,null,2));write('captions-summary.json',JSON.stringify(captions,null,2));write('robot-actions.json',JSON.stringify(roles,null,2));
console.log(JSON.stringify({total,beats:beats.length,shots:shots.length,summaryCues:captions.length,robotActions:roles.length}));

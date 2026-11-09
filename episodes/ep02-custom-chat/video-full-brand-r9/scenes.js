import {shots,captions} from './data.js';
const C={bg:'#091d20',panel:'#102c30',line:'#35575a',ink:'#e3eeed',muted:'#b7cbca',cyan:'#80ceec',lime:'#b7dd78',paper:'#f0f7f5',dark:'#102c30',soft:'#4a6668'};
const Q='ช่วยเขียนข้อความแจ้งลูกค้า\nว่าสินค้าส่งช้า ให้สุภาพหน่อย';
const A='ขออภัยค่ะ สินค้าจัดส่งล่าช้ากว่ากำหนด\nทางร้านกำลังติดตามและจะแจ้งให้ทราบค่ะ';
const F='ขอสั้นลงสำหรับส่งใน LINE';
const AF='ขออภัยที่จัดส่งล่าช้าค่ะ\nร้านกำลังติดตามและจะแจ้งความคืบหน้าค่ะ';
function image(s,src,x,y,w,at=0){s.image('assets/'+src,{x,y,w,at,frame:'none',shadow:false,enter:'fade'});}
function frame(s,shot){const u=s.ui;u.backdrop(C.bg);u.text('LANGMIND / EP02',80,100,{size:25,weight:700,color:'#64dfcc'});u.text(shot.beat+' / 16',1000,100,{size:25,align:'right',color:C.muted});u.card(80,142,64,5,{fill:'#0094ca',border:false,lift:0});if(shot.kind!=='logo')u.text(shot.title,80,235,{size:43,weight:700,color:C.ink});
 const caption=captions.find(c=>shot.start+s.t>=c.start&&shot.start+s.t<c.end);
 if(caption){u.card(70,1630,940,132,{fill:C.panel,border:C.line,radius:16,lift:0});u.para(caption.text,540,1667,870,{size:36,align:'center',color:C.ink,lh:51});}
 u.text('ภาพจำลองเพื่ออธิบาย · ไม่ใช่ผลเรียก API จริง',540,1830,{size:24,align:'center',color:C.muted});
}
function bubble(u,x,y,w,text,user=false,h=145){u.card(x,y,w,h,{fill:user?'#dceff5':'#e5f0d4',border:user?'#9fc7d5':'#b7cc98',radius:18,lift:0});u.para(text,x+24,y+31,w-48,{size:32,color:C.dark,lh:46});}
function note(s,text,y=1450,color=C.cyan){if(!text)return;const shot=shots.find(x=>x.scene===s.id);const caption=shot&&captions.find(c=>shot.start+s.t>=c.start&&shot.start+s.t<c.end);const compact=t=>t.replace(/[\s·→]/g,'');if(caption&&compact(caption.text)===compact(text))return;s.ui.para(text,80,y,900,{size:30,color,lh:47});}
function robot(s,pose='10-thumbs-up.png',x=865,y=1430,w=175){image(s,pose,x,y,w,.2);}
function chat(s,shot){const u=s.ui,follow=['follow','followQ'].includes(shot.state),waiting=shot.state==='wait',error=shot.state==='error';
 u.browser(75,355,930,1050,{url:'team.example / assistant',urlSize:22,at:-.6},(x,y,w,h)=>{
 u.text(shot.head||'ผู้ช่วยร้านเรา',x+32,y+62,{size:35,weight:700});u.text('ร่างข้อความภาษาไทยสำหรับทีมขาย',x+32,y+108,{size:26,color:C.soft});
 bubble(u,x+180,y+160,665,Q,true);
 if(waiting){u.text('กำลังรอคำตอบ…',x+34,y+370,{size:32,color:'#206b45'});u.text('ส่งแล้ว · รอคำตอบก่อนส่งข้อความใหม่',x+34,y+425,{size:27,color:C.soft});}
 else if(error){u.card(x+30,y+350,w-60,200,{fill:'#fff0eb',border:'#be705c',radius:16,lift:0});u.text('ส่งข้อความไม่สำเร็จ',x+55,y+400,{size:33,color:'#983b24',weight:700});u.text('ข้อความยังอยู่ ลองส่งอีกครั้งได้',x+55,y+456,{size:28,color:'#733c30'});u.button('ลองใหม่',x+55,y+590,180,65,{size:26});}
 else {bubble(u,x+30,y+350,775,A);if(follow){bubble(u,x+240,y+530,605,F,true,115);if(shot.state==='follow'&&s.t>.5)bubble(u,x+30,y+685,775,AF);}}
 const value=error?'ช่วยเขียนข้อความแจ้งลูกค้าว่าสินค้าส่งช้า':'';
 u.input(x+30,y+h-105,w-165,72,{value,placeholder:waiting?'รอคำตอบ…':'พิมพ์ข้อความถึงผู้ช่วย…',size:26});
 u.button(waiting?'รอ…':'ส่ง',x+w-115,y+h-105,85,72,{size:26,loading:waiting,variant:waiting?'secondary':'primary'});
 });note(s,shot.state==='follow'?'ถามต่อในบทสนทนาเดิม':waiting?'แอปเป็นผู้จัดการสถานะรอและกันส่งซ้ำ':error?'เก็บข้อความไว้ เพื่อให้ผู้ใช้ลองใหม่ได้':'ตรวจข้อความก่อนนำไปส่งให้ลูกค้า');}
function hero(s,shot){const u=s.ui;u.text(shot.end?'เริ่มจากงานหนึ่งอย่าง':'ผู้ช่วยของทีม',80,480,{size:62,weight:700,color:C.ink});u.text(shot.end?'ที่อยากให้ผู้ช่วยทำ':'บนหน้าจอที่เราออกแบบเอง',80,575,{size:43,color:C.cyan});
 u.panel(80,740,920,420,{fill:C.panel,border:C.line,at:.3,lift:0},()=>{u.text('ร่างข้อความ',125,825,{size:38,color:C.lime,weight:700});u.text('ตรวจคำตอบ → ขอปรับ → นำไปใช้',125,910,{size:35,color:C.ink});u.text('หน้าเว็บและส่วนเชื่อมต่อ เป็นส่วนที่เราพัฒนา',125,1030,{size:29,color:C.muted});});robot(s,shot.end?'10-thumbs-up.png':'06-thinking.png',810,1330,235);}
function flow(s,shot){const u=s.ui;const labels=[['หน้าเว็บของเรา','พิมพ์คำถาม · อ่านคำตอบ',C.cyan],['server ของแอป','เก็บ key · เชื่อมต่อ API',C.lime],['LangMind Agent','ผู้ช่วยที่ตั้งหน้าที่ไว้','#64dfcc']];const times=shot.summary?[0,.6,1.2]:shot.focus?[0,.2,.5]:[0,3.5,7.5];
 labels.forEach(([title,sub,col],i)=>{const y=380+i*300;u.panel(140,y,800,215,{at:times[i],fill:C.panel,border:C.line,lift:0},()=>{u.text(title,185,y+75,{size:39,weight:700,color:col});u.text(sub,185,y+145,{size:31,color:C.ink});});if(i<2&&s.t>times[i+1])u.text('↓',540,y+260,{size:46,align:'center',color:C.cyan});});
 const returnAt=shot.summary?3:shot.focus?2:12;
 if(s.t>returnAt){u.text('คำตอบส่งกลับทางเดิม ↑',540,1360,{size:34,align:'center',color:C.lime});}note(s,'หน้าเว็บ → server → Agent → คำตอบ',1450);}
function cards(s,shot){const u=s.ui;const items=shot.items||[];items.forEach((v,i)=>{const [head,body]=v.split('|'),y=390+i*260;u.panel(80,y,920,215,{at:i*.35,fill:C.panel,border:C.line,lift:0},()=>{u.text(head,120,y+73,{size:38,weight:700,color:i%2?C.lime:C.cyan});if(body)u.para(body,120,y+145,820,{size:31,color:C.ink});});});note(s,shot.note,1240,C.muted);if(items.length<=2)robot(s,shot.robot||'05-point-up.png',830,1400,205);}
function key(s,shot){const u=s.ui,stage=shot.media===0?0:shot.media===7?1:2;
 u.browser(75,355,930,1060,{url:'LangMind · หน้าจอจำลอง',urlSize:22,at:0},(x,y,w,h)=>{
 u.text('สร้าง API key',x+40,y+70,{size:37,weight:700});u.text('สำหรับเว็บผู้ช่วยทีมขาย',x+40,y+122,{size:28,color:C.soft});
 u.input(x+40,y+210,w-80,80,{label:'ชื่อ key',value:stage===0?u.typed('เว็บผู้ช่วยทีมขาย',.5,12):'เว็บผู้ช่วยทีมขาย',focus:stage===0?1:0,size:29});
 u.select(x+40,y+395,w-80,80,{label:'อายุการใช้งาน',value:stage>=1?'เลือกให้เหมาะกับการใช้งาน':'กำหนดอายุ key',open:0,size:28});
 u.text('สิทธิ์สำหรับตัวอย่างแชท',x+40,y+570,{size:32,weight:700});u.checkbox(x+55,y+650,stage===2&&s.t>.7?1:0);u.text('chat:invoke',x+100,y+655,{size:33,color:'#206b45'});u.text('สนทนากับ Agent',x+100,y+712,{size:28,color:C.soft});
 u.button(stage===2&&s.t>7?'สร้างแล้ว':'สร้าง key',x+w-270,y+h-110,230,72,{size:28,press:stage===2?u.press(6.5):0});
 });if(stage===2)u.cursor([{at:0,x:450,y:820},{at:.2,x:130,y:1055},{at:1,click:true},{at:5,x:835,y:1330},{at:6.5,click:true}],{out:7});}
function agent(s){const u=s.ui;u.browser(75,410,930,600,{url:'langmind.in.th/agents/<AGENT_ID>',urlSize:24,at:0},(x,y,w,h)=>{u.text('ผู้ช่วยทีมขาย',x+40,y+100,{size:40,weight:700});u.text('หน้าที่: ร่างข้อความไทยสุภาพ',x+40,y+180,{size:31,color:C.soft});u.card(x+40,y+260,w-80,145,{fill:'#e5f0d4',border:'#b7cc98',radius:16,lift:0});u.text('/agents/  <AGENT_ID>',x+70,y+330,{size:36,color:C.dark,weight:700});});u.text('คัดลอกเฉพาะรหัสหลัง /agents/',80,1130,{size:36,color:C.lime,weight:700});note(s,'รหัสเลือกผู้ช่วย ไม่ใช่ key ยืนยันสิทธิ์',1240,C.muted);robot(s,'05-point-up.png',830,1410,200);}
function codeSource(shot){if(shot.file?.startsWith('public/'))return "fetch('/api/chat', {\n  method: 'POST',\n  headers: {\n    'Content-Type': 'application/json'\n  },\n  body: JSON.stringify({ message })\n})";
 if(shot.id==='b06-3')return 'const API_KEY =\n  process.env.LANGMIND_API_KEY;\n\nconst AGENT_ID =\n  process.env.LANGMIND_AGENT_ID;';return (shot.lines||[]).join('\n');}
function code(s,shot){const src=codeSource(shot);const json=/body|Response/.test(shot.file||'');s.ui.text(/หน้าเว็บ/.test(shot.file)?'หน้าเว็บของเรา':'ฝั่ง server ของแอป',80,365,{size:29,color:/หน้าเว็บ/.test(shot.file)?C.cyan:C.lime,weight:700});
 s.code(src,{x:540,y:790,w:930,size:33,lang:json?'json':shot.file?.includes('.env')?'sh':'js',title:shot.file,at:0,reveal:'none',highlight:[Math.min((shot.active||0)+1,src.split('\n').length)]});
 note(s,shot.note,1320,C.muted);s.ui.text('โค้ดเฉพาะส่วนเพื่ออธิบาย ไม่ใช่โปรเจกต์พร้อมรัน',80,1500,{size:26,color:C.muted});}
function diff(s){const u=s.ui;u.text('คำถามใหม่ · บทสนทนาเดิม',80,365,{size:33,color:C.cyan,weight:700});const first='{\n  "query": "คำถามแรก",\n  "conversation_id": null\n}',next='{\n  "query": "ขอสั้นลงสำหรับ LINE",\n  "conversation_id":\n    "conv_demo_01"\n}';s.code([{code:first,at:0,highlight:[3]},{code:next,at:2.5,highlight:[4,5]}],{x:540,y:750,w:930,size:33,lang:'json',title:'Request body · server',reveal:'none'});
 u.panel(80,1180,920,250,{at:6,fill:C.panel,border:C.line,lift:0},()=>{u.text('server ต้องตรวจเจ้าของบทสนทนา',115,1250,{size:34,color:C.lime,weight:700});u.text('conversation_id อย่างเดียวไม่ใช่สิทธิ์เข้าถึง',115,1340,{size:29,color:C.ink});});}
function devices(s){const u=s.ui;u.text('Agent เดิม · หน้าจอต่างกัน',80,365,{size:34,color:C.cyan,weight:700});u.panel(80,490,360,760,{fill:C.paper,border:'#8eaaa8',at:0,lift:0},()=>{u.text('มือถือ',115,560,{size:33,weight:700});bubble(u,105,650,310,'พิมพ์ถาม\nอ่านคำตอบ',true,170);u.input(105,1080,310,70,{placeholder:'พิมพ์ข้อความ…',size:23});});u.panel(485,590,515,560,{fill:C.paper,border:'#8eaaa8',at:.4,lift:0},()=>{u.text('จอใหญ่',520,660,{size:33,weight:700});u.card(515,725,210,300,{fill:'#dceff5',border:'#9fc7d5',lift:0});u.card(745,725,225,300,{fill:'#e5f0d4',border:'#b7cc98',lift:0});u.text('แชท',555,805,{size:30});u.text('แก้ข้อความ',765,805,{size:28});});note(s,'การจัดหน้าจอแต่ละอุปกรณ์ เป็นส่วนที่เราพัฒนา',1400,C.muted);}
function workspace(s){const u=s.ui;u.browser(75,410,930,940,{url:'team.example / workspace',urlSize:22,at:0},(x,y,w,h)=>{u.text('พื้นที่แชท',x+35,y+65,{size:33,weight:700});bubble(u,x+30,y+130,w-60,F,true,120);bubble(u,x+30,y+285,w-60,AF,false,150);u.text('พื้นที่แก้ข้อความ',x+35,y+520,{size:33,weight:700});u.card(x+30,y+580,w-60,210,{fill:'#e5f0d4',border:'#b7cc98',radius:16,lift:0});u.para(AF,x+55,y+620,w-110,{size:31,color:C.dark});});note(s,'คุยกับ Agent เดิม และเพิ่มเครื่องมือให้เข้ากับงาน',1450,C.muted);}
function logo(s){const u=s.ui;u.card(250,380,580,570,{fill:'#ffffff',border:false,radius:25,lift:0});image(s,'langmind-logo.png',540,660,470,.1);image(s,'08-high-wave.png',540,1210,300,.2);u.text('สร้างสิ่งต่อไป ในแบบของคุณ',540,1470,{size:42,align:'center',weight:700,color:C.lime});}
export default Object.fromEntries(shots.map(shot=>[shot.scene,s=>{frame(s,shot);switch(shot.kind){case 'chat':chat(s,shot);break;case 'hero':hero(s,shot);break;case 'flow':flow(s,shot);break;case 'cards':cards(s,shot);break;case 'footage':key(s,shot);break;case 'agent':agent(s);break;case 'code':code(s,shot);break;case 'diff':diff(s);break;case 'devices':devices(s);break;case 'workspace':workspace(s);break;case 'logo':logo(s);break;default:throw Error('Unhandled shot '+shot.kind);}}]));

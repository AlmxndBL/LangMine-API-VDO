import {beats} from './data.js';
import {codeCues} from './code-cues.js';
const C={bg:'#091D20',panel:'#102C30',ink:'#E3EEED',muted:'#B7CBCA',cyan:'#80CEEC',lime:'#B7DD78',paper:'#F0F7F5'};
const Q1='ช่วยเขียนข้อความแจ้งลูกค้าว่าสินค้าส่งช้า ให้สุภาพหน่อย';
const A1='ขออภัยค่ะ สินค้าจัดส่งล่าช้ากว่ากำหนด ทางร้านกำลังติดตามและจะแจ้งให้ทราบค่ะ';
const Q2='ขอสั้นลงสำหรับส่งใน LINE';
const A2='ขออภัยที่จัดส่งล่าช้าค่ะ ร้านกำลังติดตามและจะแจ้งความคืบหน้าค่ะ';
const H1='พิมพ์ว่า “ขอสั้นลง” แล้วแชทรู้ได้อย่างไรว่าหมายถึงข้อความไหน?';
const CAPTIONS={
  B01:'แชทรู้ได้อย่างไร\nว่า “ขอสั้นลง” หมายถึงอะไร?',
  B02:'ใช้เว็บช่วยทีมขาย\nร่างข้อความให้ลูกค้า',
  B03:'หน้าเว็บส่งข้อความผ่าน server\nแล้วคุยกับ LangMind Agent',
  B04:'Agent ID เลือกผู้ช่วย\nAPI key ยืนยันสิทธิ์',
  B05:'ตั้งชื่อ key เลือกอายุ\nและสิทธิ์ chat:invoke',
  B06:'เก็บ key กับ Agent ID\nไว้ฝั่ง server',
  B07:'หน้าเว็บส่งข้อความให้ /api/chat\nserver จัดการก่อนเรียก Agent',
  B08:'POST ส่งคำถามพร้อม key\nครั้งแรก conversation_id = null',
  B09:'server ส่งคำขอ ตรวจผล\nแล้วค่อยนำคำตอบไปใช้',
  B10:'answer คือคำตอบ\nconversation_id เชื่อมแชทเดิม',
  B11:'แอปแจ้งว่ากำลังรอ\nและเก็บข้อความเมื่อล้มเหลว',
  B12:'ถามต่อด้วย conversation_id เดิม\nserver ตรวจเจ้าของบทสนทนา',
  B13:'คำตอบทยอยขึ้นได้\nแต่ต้องปรับทั้ง server และหน้าเว็บ',
  B14:'ออกแบบหน้าจอให้เหมาะกับทีม\nการเรียก Agent ใช้หลักเดิม',
  B15:'Agent ID เลือกผู้ช่วย\nAPI key ยืนยันสิทธิ์\nconversation_id เชื่อมแชทเดิม',
  B16:'เริ่มจากข้อความเดียว\nแล้วลองถามต่อในแชทเดิม'
};
const ease=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
function text(s,t,x,y,size=48,color=C.ink,w=792,align='left',weight=400){
  const ctx=s.ctx;ctx.save();ctx.font=`${weight} ${size}px Sarabun`;
  const wrapped=String(t).split('\n').flatMap(p=>{const out=[];let row='';for(const {segment} of new Intl.Segmenter('th',{granularity:'word'}).segment(p)){if(row&&ctx.measureText(row+segment).width>w){out.push(row.trim());row=segment.trimStart();}else row+=segment;}out.push(row.trim());return out;}).join('\n');ctx.restore();
  s.ui.para(wrapped,x,y,w,{size,color,weight,lh:size*1.38,align,at:-1});
  return wrapped.split('\n').length*size*1.38;
}
function line(s,x1,y1,x2,y2,color=C.cyan,width=3){s.draw({at:-1},ctx=>{ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();});}
function box(s,x,y,w,h,fill=C.panel,stroke='#35575A'){s.ui.card(x,y,w,h,{fill,border:stroke||false,radius:18,lift:0,at:-1});}
function base(s,b){s.camera([]);s.ui.backdrop(C.bg);text(s,`EP02 · ${b}`,108,112,28,C.muted);const caption=CAPTIONS[b];const lines=caption.split('\n').length;const h=58*lines;s.ui.card(108,1520,864,180,{fill:'#20382E',border:'#20382E',radius:20,lift:0,at:-1});text(s,caption,540,1520+(180-h)/2,42,'#F5F1E7',864,'center',700);}
function heading(s,t){text(s,t,108,210,58,C.ink);line(s,108,190,170,190);line(s,108,190,108,240);}
function note(s,t){}
function question(s,full=false){if(full){text(s,H1,108,192,64);line(s,108,175,180,175);line(s,108,175,108,235);}else{text(s,'“ขอสั้นลง” เชื่อมกับเรื่องเดิมอย่างไร?',108,232,48,C.cyan);line(s,108,310,250,310);}}
function collapseQuestion(s){const p=ease((s.t-13)/.6);s.ctx.save();s.ctx.globalAlpha=1-p;question(s,true);s.ctx.restore();s.ctx.save();s.ctx.globalAlpha=p;question(s);s.ctx.restore();}
function raster(s,name,{x=108,y=400,w=792,h=960,zoom=1,focusY=.5}={}){
  const img=s.engine.image('assets/'+name+'.png');
  // Pin the raster header/composer; scroll only its raster message region.
  s.draw({at:-1},ctx=>{
    const iw=img.naturalWidth,ih=img.naturalHeight,sx=iw*.073,sw=iw*.854,scale=w/sw;
    const head=ih*.084*scale,foot=ih*.108*scale,bodyH=h-head-foot;
    const scroll=name==='R06-desktop'?170*ease((s.t-8)/2):name.startsWith('R05')||name==='R06-mobile'||name==='R04-error'?150:0;
    ctx.save();ctx.beginPath();ctx.roundRect(x,y,w,h,24);ctx.clip();
    ctx.drawImage(img,sx,ih*.265,sw,ih*.084,x,y,w,head);
    ctx.save();ctx.beginPath();ctx.rect(x,y+head,w,bodyH);ctx.clip();
    const bz=focusY<.6?zoom:1;
    ctx.drawImage(img,sx,ih*.349,sw,ih*.461,x-(w*(bz-1))/2+20*(bz-1),y+head-scroll,w*bz,ih*.461*scale*bz);
    ctx.restore();ctx.save();ctx.beginPath();ctx.rect(x,y+h-foot,w,foot);ctx.clip();
    const fz=focusY>.8?zoom:1;
    ctx.drawImage(img,sx,ih*.810,sw,ih*.108,x-w*(fz-1)/2+25*(fz-1)/.15,y+h-foot,w*fz,foot*fz);
    ctx.restore();ctx.restore();
  });
}
function demo(s,name,opts={}){raster(s,name,opts);}
function tag(s,{y=1368}={}){box(s,108,y,792,80,C.panel,C.lime);text(s,'server · รหัสบทสนทนา / conv_demo_01',504,y+14,42,C.lime,760,'center');}
function focus(s,x,y,w,h,amount=.35){s.draw({at:-1},ctx=>{ctx.fillStyle=`rgba(9,29,32,${amount})`;ctx.beginPath();ctx.rect(108,350,792,1100);ctx.roundRect(x,y,w,h,12);ctx.fill('evenodd');ctx.strokeStyle=C.cyan;ctx.lineWidth=3;ctx.strokeRect(x,y,w,h);});}
function flow(s,{phase=0,id=false,query=Q1,compact=false}={}){
  const ys=[470,800,1130],height=190;
  ['หน้าเว็บของเรา','server ของแอป','LangMind Agent'].forEach((v,i)=>{box(s,160,ys[i],680,height);text(s,v,194,ys[i]+30,48,i===1?C.lime:C.ink,610);text(s,['พิมพ์ · อ่านคำตอบ','/api/chat · เก็บ key','ผู้ช่วยที่ตั้งหน้าที่ไว้'][i],194,ys[i]+100,36,C.muted,610);if(i<2)line(s,504,ys[i]+height,504,ys[i+1],C.cyan);});
  const p=Math.max(0,Math.min(2,phase));const j=Math.min(1,Math.floor(p)),u=p-j;
  s.draw({at:-1},ctx=>{ctx.fillStyle=C.cyan;ctx.beginPath();ctx.arc(504,ys[j]+height+(ys[j+1]-ys[j]-height)*u,9,0,Math.PI*2);ctx.fill();});
  if(query)text(s,query,504,1332,42,C.cyan,680,'center');
  if(id)tag(s);
}
function code(s,title,rows,active=0){
  if(s.captureCode){s.captureCode({title,rows,active});return;}
  const sampleTime=Math.min(s.t,s.dur-1/30);
  const cue=codeCues.find(c=>c.scene===s.id&&sampleTime>=c.start&&sampleTime<c.end);
  if(!cue)throw Error(`Missing code-highlight cue ${s.id}@${s.t}`);
  text(s,s.id==='B07'?'หน้าเว็บของเรา':'server ของแอปเรา',108,362,42,s.id==='B07'?C.cyan:C.lime);
  const at=cue.start,local=s.t-at;
  if(local<1.2)s.clip(`assets/code-${cue.id}.mp4`,{x:504,y:875,w:792,h:820,frame:'none',shadow:false,at,enter:'fade'});
  else s.image(`assets/code-${cue.id}-hold.png`,{x:504,y:875,w:792,h:820,frame:'none',shadow:false,at:-1});
  text(s,'โค้ดประกอบคำอธิบาย',504,1310,42,C.muted,792,'center');
}
function excerpt(s,t,body,after){heading(s,t);code(s,'ส่วนหนึ่งของ request',body,0);if(after)note(s,after);}
function footage(s,n,at){const end=at+(n==='name'?8:7);if(s.t<end)s.clip('assets/K-'+n+'.mp4',{x:504,y:850,w:792,h:710,fit:'contain',frame:'none',at,from:0,shadow:false,enter:'fade'});else s.image('assets/K-'+n+'-hold.png',{x:504,y:850,w:792,h:710,fit:'contain',frame:'none',at:-1,shadow:false});}
function device(s,name,desktop=false){const t=s.t;const f=desktop?ease((t-8)/1.2):ease(t/1.2);s.draw({at:-1},ctx=>{ctx.strokeStyle='#B7CBCA';ctx.lineWidth=8;ctx.beginPath();ctx.roundRect(96,388,816,984,desktop?10:42);ctx.stroke();});demo(s,name,{x:108+(1-f)*30,y:400,w:792-(1-f)*60});}
function endBackdrop(s){if(s.t<.6){base(s,'B15');text(s,'ใช้ conversation_id เดิม คุยต่อเรื่องเดิม',108,232,48,C.cyan);line(s,108,310,250,310);flow(s,{compact:true,id:true,query:null,phase:0});note(s,'คุณอยากให้ผู้ช่วยร่างเรื่องอะไร?');s.draw({at:-1},ctx=>{ctx.save();ctx.globalAlpha=ease(s.t/.6);ctx.fillStyle='#FFFFFF';ctx.fillRect(0,0,1080,1920);ctx.restore();});}else s.ui.backdrop('#FFFFFF');}
const scenes={
  B01(s){base(s,'B01');const t=s.t;if(t>=13&&t<13.6)collapseQuestion(s);else question(s,t<13);const z=t<3?1:t<3.8?1+.15*ease((t-3)/.8):t<13?1.15:t<14?1.15-.15*ease(t-13):1;demo(s,'R01',{y:490,h:870,zoom:z,focusY:.97});if(t>=3&&t<10)note(s,'ส่งเรื่องเดิมใหม่?     มีตัวเชื่อม?');if(t>=10&&t<13)note(s,'ลองทายก่อน');},
  B02(s){base(s,'B02');question(s);demo(s,s.t<3?'R01':'R02-composer');text(s,'ย้อนดูข้อความแรก',504,350,42,C.lime,792,'center');note(s,s.t<15?'เว็บแชทของเรา ด้วย LangMind Agent':'ตัวอย่างอธิบาย · ยังไม่ได้ส่งให้ลูกค้า');},
  B03(s){base(s,'B03');question(s);const p=ease(s.t/5);if(p<1)demo(s,'R02-composer',{w:792-160*p,x:108+80*p});else flow(s,{phase:2*ease((s.t-5)/12)});if(s.t>=12&&s.t<17)focus(s,150,790,700,215);note(s,s.t>=23?'หน้าเว็บและส่วนเชื่อมต่อ: เราพัฒนา':'คำถามผ่าน server · คำตอบกลับทางเดิม');},
  B04(s){base(s,'B04');heading(s,'เตรียมผู้ช่วย และแยกสองค่า');flow(s,{compact:true,query:null});if(s.t<8){focus(s,150,1120,700,215);note(s,'ร่างข้อความสุภาพ · ไม่แต่งวันส่งสินค้า');}else if(s.t<16){focus(s,150,1120,700,215);note(s,'Agent ID: เลือกผู้ช่วย');}else{focus(s,150,790,700,215);note(s,s.t<23?'API key: ยืนยันสิทธิ์':'Agent ID เลือกผู้ช่วย\nAPI key ยืนยันสิทธิ์');}},
  B05(s){base(s,'B05');heading(s,'สร้าง key สำหรับแอปเรา');const t=s.t,n=t<10?'name':t<20?'age':'scope',at=t<10?0:t<20?10:20;if(t<31)footage(s,n,at);else{box(s,160,700,680,300);text(s,'API key',504,775,60,C.lime,600,'center');text(s,'เก็บฝั่ง server',504,900,48,C.ink,600,'center');}note(s,t<10?'ชื่อ: ป้ายกำกับ':t<20?'อายุ: ช่วงที่ key ใช้งานได้':t<31?'สิทธิ์แชท: chat:invoke':'ภาพเดิมไม่ได้ยืนยันว่า key ยังใช้ได้');text(s,'ภาพขั้นตอนเดิม · ไม่ใช่การเรียก API',504,1400,34,C.muted,792,'center');},
  B06(s){base(s,'B06');const t=s.t;heading(s,'ตั้งค่าฝั่ง server');if(t>=10&&t<22){box(s,108,560,792,380);s.image('assets/K-agent-domain.png',{x:330,y:650,w:420,frame:'none',at:-1,shadow:false});text(s,'/agents/',150,760,48,C.cyan,680);text(s,'<AGENT_ID>',420,760,48,C.lime,440);note(s,'คัดลอกเฉพาะรหัสหลัง /agents/\nตัวอย่างตำแหน่ง ไม่ใช่ Agent ร้านนี้');}else{code(s,'.env / ค่าตั้งต้น',[t<10?'LANGMIND_API_KEY\n= <API_KEY>':'LANGMIND_API_KEY\n= <API_KEY>','LANGMIND_AGENT_ID\n= <AGENT_ID>',...(t>=22?['process.env']:[])],t>=22?2:0);note(s,'เก็บ key บน server\nไม่ฝังในหน้าเว็บ');}},
  B07(s){base(s,'B07');question(s);if(s.t<5)demo(s,s.t<1?'R02-composer':s.t<2?'R02-sent':'R02-pending');else if(s.t<12)flow(s,{phase:ease((s.t-5)/7)});else if(s.t<21)code(s,'หน้าเว็บ → server',["fetch('/api/chat', {","method: 'POST',",'body: JSON.stringify({','  message','})', '})'],0);else demo(s,'R02-pending');note(s,s.t<12?'ส่งข้อความครั้งเดียว':'/api/chat = route ของแอปเรา');},
  B08(s){base(s,'B08');const t=s.t;if(t<9)excerpt(s,'ปลายทางของ request',['POST','https://langmind.in.th','/api/chat/message','/blocking'],'รอคำตอบเต็มก่อน');else if(t<18)excerpt(s,'ส่วนหัว: สิทธิ์และชนิดข้อมูล',['Authorization:','Bearer <API_KEY>','Content-Type:','application/json'],'key ยืนยันสิทธิ์');else excerpt(s,'ข้อมูลของข้อความแรก',['agent_id: <AGENT_ID>','query:',Q1,'conversation_id: null'],'ตัวอย่างนี้ไม่ส่ง user_id');},
  B09(s){base(s,'B09');heading(s,'ส่งคำขอ แล้วตรวจผล');const t=s.t;if(t<8)code(s,'fetch ฝั่ง server',['const response =','await fetch(endpoint, {',"method: 'POST',",'// blocking endpoint','});'],1);else if(t<16)code(s,'headers / body',['Authorization:','Bearer ${API_KEY}','agent_id: AGENT_ID','query: message','conversation_id'],3);else code(s,'ตรวจผลก่อนนำไปใช้',['if (!response.ok) {','  // จัดการข้อผิดพลาด','}','const data =','await response.json();'],0);note(s,t>=16?'ตรวจรูปแบบข้อมูลก่อนใช้\nยังต้องเชื่อมผู้ใช้และที่เก็บข้อมูลจริง':'key และ Agent ID อ่านจากค่าตั้งต้น');},
  B10(s){base(s,'B10');heading(s,'แสดงคำตอบ · เก็บรหัส');if(s.t<8)code(s,'ผลตัวอย่างแบบย่อ',['answer:',A1],0);else if(s.t<15)code(s,'เก็บคู่กับเจ้าของ',['conversation_id:','conv_demo_01','server ตรวจเจ้าของ'],1);else if(s.t<17)flow(s,{query:null,phase:2-2*ease((s.t-15)/2)});else demo(s,'R03-success',{zoom:s.t<21?1:1+.1*ease(s.t-21),focusY:.4});if(s.t>=8)tag(s);note(s,s.t<8?'answer → แสดงคำตอบ':'conversation_id → เก็บฝั่ง server');},
  B11(s){base(s,'B11');const t=s.t;heading(s,t<7?'กรณีระหว่างรอ':t<15?'ถ้าส่งไม่สำเร็จ':'กลับตัวอย่างที่สำเร็จ');demo(s,t<7?'R02-pending':t<15?'R04-error':t<19?'R03-success':'R01');tag(s);note(s,'แอปจัดการสถานะ · ไม่ใช่คำตอบ Agent');},
  B12(s){base(s,'B12');const t=s.t;if(t<7){question(s,true);demo(s,'R01',{y:490,h:870});tag(s);note(s,t<4?'ต้องเปลี่ยนอะไร เก็บอะไรไว้?':'ลองทายก่อน');}else if(t<17){heading(s,'เปลี่ยน query · คงรหัสเดิม');code(s,'ส่วนหนึ่งของ request',['query:',Q2,'conversation_id:','conv_demo_01','agent_id: <AGENT_ID>'],t<12?1:3);tag(s);note(s,'server ตรวจเจ้าของบทสนทนา');}else{heading(s,t<25?'คำถามใหม่ · บทสนทนาเดิม':'ใช้ conversation_id เดิม');demo(s,t<19?'R05-pending':'R05-answer');tag(s);note(s,t<25?'ร่างคำตอบ · ยังไม่ได้ส่งเข้า LINE':'เพื่อคุยต่อในบทสนทนาเดียวกัน');}},
  B13(s){base(s,'B13');heading(s,s.t<7?'ตัวอย่างนี้: รอคำตอบครบ':'อีกทางเลือก: รับข้อมูลเป็นช่วง');demo(s,'R05-answer');tag(s);note(s,s.t<7?'คำตอบครบ แล้วแสดง':'ต้องปรับ server และหน้าเว็บ\nไม่ใช่แค่ทำตัวอักษรทยอยปรากฏ');},
  B14(s){base(s,'B14');const t=s.t;heading(s,t<8?'มือถือ: พิมพ์และอ่าน':'จอใหญ่: เพิ่มพื้นที่แก้ข้อความ');device(s,t<8?'R06-mobile':'R06-desktop',t>=8);tag(s);note(s,'หน้าจอเราออกแบบ · วงจรเดิม');},
  B15(s){base(s,'B15');text(s,'ใช้ conversation_id เดิม คุยต่อเรื่องเดิม',108,232,48,C.cyan);line(s,108,310,250,310);flow(s,{compact:true,id:true,query:null,phase:s.t<5?2*ease(s.t/5):s.t<10?2-2*ease((s.t-5)/5):0});note(s,s.t<10?'หน้าเว็บ → server → Agent → คำตอบ':s.t<13?'Agent ID เลือกผู้ช่วย':s.t<16?'API key ยืนยันสิทธิ์':s.t<18?'conversation_id คุยต่อเรื่องเดิม':'คุณอยากให้ผู้ช่วยร่างเรื่องอะไร?');},
  B16(s){s.camera([]);endBackdrop(s);const a=ease((s.t-.6)/2.4);s.draw({at:-1},ctx=>{ctx.globalAlpha=a;const img=s.engine.image('assets/langmind-logo.png');const w=480,h=w*img.naturalHeight/img.naturalWidth;ctx.drawImage(img,300,460,w,h);ctx.globalAlpha=1;});if(s.t>=.6){text(s,'https://langmind.in.th',540,1096,48,'#102C30',792,'center');text(s,'ตาคุณลองแล้ว —\nร่างข้อความหนึ่งเรื่อง\nแล้วขอให้สั้นลงในแชทเดิม',540,1180,48,'#102C30',720,'center');}},
};
export default Object.fromEntries(beats.map(b=>[b.id,scenes[b.id]]));

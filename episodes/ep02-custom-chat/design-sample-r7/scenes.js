const C={ink:'#17252e',blue:'#2563eb',green:'#16856b',orange:'#b45309',muted:'#526071'};
function base(s,n,title,sub){const u=s.ui;u.backdrop('#f8f5ed');u.text('LANGMIND / EP02',80,110,{size:25,weight:700,color:C.green});u.text(n+' / 03',1000,110,{size:25,align:'right',color:C.muted});u.text(title,80,215,{size:44,weight:700});u.text(sub,80,280,{size:29,color:C.muted});u.text('ภาพจำลองเพื่ออธิบาย · ตัวอย่างออกแบบ ไม่มีเสียง',540,1770,{size:25,align:'center',color:C.muted});}
function msg(u,x,y,w,text,user=false){u.card(x,y,w,135,{fill:user?'#e8efff':'#edf6f2',border:user?'#c6d6fc':'#c8e3d8',radius:20,lift:0});u.para(text,x+25,y+31,w-50,{size:32,color:C.ink});}
export default {
 chat(s){base(s,'01','ลูกค้าตามของ… ตอบอย่างไรดี?','ให้ผู้ช่วยร่าง แล้วปรับให้เข้ากับช่องทาง');const u=s.ui;
 u.browser(75,370,930,1070,{url:'team.example / assistant',at:0},(x,y,w,h)=>{
 u.text('ผู้ช่วยร้านเรา',x+35,y+70,{size:35,weight:700});u.text('ร่างข้อความสำหรับทีมขาย',x+35,y+116,{size:26,color:C.muted});
 msg(u,x+185,y+170,650,'ช่วยร่างข้อความแจ้งลูกค้า\nว่าสินค้าจัดส่งช้ากว่ากำหนด',true);
 if(s.t<2.5)u.text('กำลังร่างคำตอบ…',x+35,y+365,{size:30,color:C.green});
 if(s.t>=2.5)msg(u,x+35,y+345,750,'ขออภัยค่ะ สินค้าจัดส่งล่าช้ากว่ากำหนด\nทางร้านกำลังติดตามและจะแจ้งให้ทราบค่ะ');
 if(s.t>=5)msg(u,x+240,y+520,595,'ขอสั้นลง สำหรับส่งใน LINE',true);
 if(s.t>=7.5)msg(u,x+35,y+695,750,'ขออภัยที่จัดส่งล่าช้าค่ะ\nร้านกำลังติดตามและจะแจ้งความคืบหน้าค่ะ');
 u.input(x+30,y+h-105,w-160,70,{placeholder:'พิมพ์ข้อความถึงผู้ช่วย…'});u.button('ส่ง',x+w-110,y+h-105,80,70,{variant:'primary'});
 });u.text(s.t<5?'เริ่มจากปัญหาที่คนดูคุ้นเคย':'ถามต่อในบทสนทนาเดิม',80,1555,{size:34,weight:700,color:C.blue});u.text('ร่าง → ตรวจ → ปรับข้อความก่อนนำไปใช้',80,1620,{size:29,color:C.muted});},
 key(s){base(s,'02','สร้าง key ให้แอปของเรา','เลือกสิทธิ์ แล้วเก็บค่าไว้ฝั่ง server');const u=s.ui;
 u.browser(75,370,930,1050,{url:'LangMind · หน้าจอจำลอง',at:0},(x,y,w,h)=>{
 u.text('สร้าง API key',x+40,y+85,{size:38,weight:700});u.text('ตั้งชื่อให้จำได้ว่าใช้กับแอปใด',x+40,y+140,{size:28,color:C.muted});
 u.input(x+40,y+210,w-80,80,{label:'ชื่อ key',value:u.typed('เว็บผู้ช่วยทีมขาย',1,12),focus:s.t<4?1:0});
 u.select(x+40,y+370,w-80,80,{label:'อายุการใช้งาน',value:'เลือกตามการใช้งานของทีม',open:0});
 u.text('สิทธิ์สำหรับตัวอย่างนี้',x+40,y+535,{size:30,weight:700});u.checkbox(x+55,y+610,s.t>=5?1:0);u.text('chat:invoke',x+100,y+615,{size:32,color:C.green});u.text('สนทนากับ Agent',x+100,y+663,{size:27,color:C.muted});
 u.button(s.t>=9?'สร้างแล้ว':'สร้าง key',x+w-260,y+h-110,220,70,{press:u.press(8.5)});
 });if(s.t>=9){u.card(95,1450,890,180,{fill:'#fff3df',border:'#e8cfaa',radius:18,lift:0});u.text('API key → เก็บใน server',130,1505,{size:34,weight:700,color:C.orange});u.text('ไม่วาง key ในโค้ดหน้าเว็บ',130,1565,{size:29,color:C.ink});}
 u.cursor([{at:3,x:700,y:700},{at:4,x:130,y:1030},{at:5,click:true},{at:7,x:850,y:1320},{at:8.5,click:true}],{out:9});},
 code(s){base(s,'03','กดส่งแล้ว ข้อความไปที่ไหน?','หน้าเว็บ → server ของเรา → LangMind');const u=s.ui;
 u.pill('หน้าเว็บของเรา',80,360,'blue');
 s.code([{code:"const response = await fetch('/api/chat', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ message })\n});",at:0,highlight:[1]}, {code:"const response = await fetch('/api/chat', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ message })\n});\nconst { answer } = await response.json();",at:5,highlight:[6]}],{x:540,y:740,w:920,size:27,lang:'js',title:'public/chat.js',reveal:'lines',lineDelay:.35});
 u.card(80,1160,920,260,{fill:'#fff3df',border:'#e8cfaa',radius:18,lift:0});u.text('server เป็นผู้เรียก LangMind',115,1220,{size:35,weight:700,color:C.orange});u.text('แนบ API key และ Agent ID ฝั่งนี้',115,1290,{size:30});u.text('/api/chat เป็น route ของแอปเรา',115,1350,{size:28,color:C.muted});
 u.text(s.t<5?'ส่งข้อความเข้า route ของแอป':'นำ answer กลับมาแสดงในแชท',80,1540,{size:35,weight:700,color:C.blue});u.text('โค้ดเฉพาะส่วนเพื่ออธิบาย ไม่ใช่โปรเจกต์พร้อมรัน',80,1620,{size:26,color:C.muted});}
};

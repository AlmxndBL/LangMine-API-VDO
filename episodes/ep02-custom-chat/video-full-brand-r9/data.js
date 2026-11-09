export const shots=[
  {
    "id": "b01-1",
    "beat": "B01",
    "start": 0,
    "duration": 9.333333333333334,
    "title": "ใช้ AI ช่วยร่างข้อความอยู่แล้ว?",
    "kind": "chat",
    "state": "answer",
    "head": "แชท AI ที่คุ้นเคย",
    "scene": "b01_1"
  },
  {
    "id": "b01-2",
    "beat": "B01",
    "start": 9.333333333333334,
    "duration": 11.1,
    "title": "ถ้าเป็นเว็บของทีมเราเองล่ะ?",
    "kind": "hero",
    "scene": "b01_2"
  },
  {
    "id": "b02-1",
    "beat": "B02",
    "start": 20.433333333333334,
    "duration": 8.2,
    "title": "ช่วยทีมร่างข้อความ",
    "kind": "chat",
    "state": "answer",
    "scene": "b02_1"
  },
  {
    "id": "b02-2",
    "beat": "B02",
    "start": 28.633333333333333,
    "duration": 7.133333333333333,
    "title": "ขอฉบับสั้นสำหรับ LINE",
    "kind": "chat",
    "state": "follow",
    "scene": "b02_2"
  },
  {
    "id": "b03-1",
    "beat": "B03",
    "start": 35.766666666666666,
    "duration": 21.233333333333334,
    "title": "ข้อความเดินทางผ่าน 3 ส่วน",
    "kind": "flow",
    "scene": "b03_1"
  },
  {
    "id": "b04-1",
    "beat": "B04",
    "start": 57,
    "duration": 7.066666666666663,
    "title": "ตั้งหน้าที่ให้ผู้ช่วยก่อน",
    "kind": "cards",
    "items": [
      "ร่างข้อความไทยสุภาพ",
      "ไม่แต่งวันส่งสินค้า"
    ],
    "note": "Agent = ผู้ช่วยที่เราตั้งหน้าที่ไว้",
    "robot": "06-thinking.png",
    "scene": "b04_1"
  },
  {
    "id": "b04-2",
    "beat": "B04",
    "start": 64.06666666666666,
    "duration": 12.666666666666671,
    "title": "สองรหัส ใช้คนละหน้าที่",
    "kind": "cards",
    "items": [
      "Agent ID|เลือกผู้ช่วย",
      "API key|ยืนยันสิทธิ์"
    ],
    "note": "นำทั้งคู่ไปตั้งค่าฝั่ง server",
    "robot": "05-point-up.png",
    "scene": "b04_2"
  },
  {
    "id": "b05-1",
    "beat": "B05",
    "start": 76.73333333333333,
    "duration": 6.266666666666666,
    "title": "สร้าง key สำหรับแอปนี้",
    "kind": "footage",
    "media": 0,
    "note": "ชื่อ key เป็นป้ายกำกับให้จำได้",
    "scene": "b05_1"
  },
  {
    "id": "b05-2",
    "beat": "B05",
    "start": 83,
    "duration": 3,
    "title": "เลือกอายุการใช้งาน",
    "kind": "footage",
    "media": 7,
    "note": "อายุ = ช่วงเวลาที่ key ใช้งานได้",
    "scene": "b05_2"
  },
  {
    "id": "b05-3",
    "beat": "B05",
    "start": 86,
    "duration": 10.666666666666671,
    "title": "เลือกสิทธิ์ที่ต้องใช้",
    "kind": "footage",
    "media": 14,
    "note": "ตัวอย่างแชทใช้ chat:invoke",
    "scene": "b05_3"
  },
  {
    "id": "b05-4",
    "beat": "B05",
    "start": 96.66666666666667,
    "duration": 5.36666666666666,
    "title": "นำ key ไปตั้งค่า server",
    "kind": "code",
    "file": ".env · server",
    "lines": [
      "LANGMIND_API_KEY=<API_KEY>"
    ],
    "active": 0,
    "note": "ภาพอธิบาย · ค่าจริงเก็บฝั่ง server",
    "scene": "b05_4"
  },
  {
    "id": "b06-1",
    "beat": "B06",
    "start": 102.03333333333333,
    "duration": 8.533333333333331,
    "title": "ตั้งค่าฝั่ง server",
    "kind": "code",
    "file": ".env · server",
    "lines": [
      "LANGMIND_API_KEY=<API_KEY>",
      "",
      "LANGMIND_AGENT_ID=<AGENT_ID>"
    ],
    "active": 0,
    "note": "key ยืนยันสิทธิ์ · Agent ID เลือกผู้ช่วย",
    "scene": "b06_1"
  },
  {
    "id": "b06-2",
    "beat": "B06",
    "start": 110.56666666666666,
    "duration": 12.866666666666674,
    "title": "คัดลอกเฉพาะหลัง /agents/",
    "kind": "agent",
    "scene": "b06_2"
  },
  {
    "id": "b06-3",
    "beat": "B06",
    "start": 123.43333333333334,
    "duration": 6.566666666666663,
    "title": "โค้ด server อ่านค่าตั้งต้น",
    "kind": "code",
    "file": "server.mjs · server",
    "lines": [
      "const API_KEY =",
      "  process.env.",
      "  LANGMIND_API_KEY;",
      "",
      "const AGENT_ID =",
      "  process.env.",
      "  LANGMIND_AGENT_ID;"
    ],
    "active": 1,
    "note": ".env → ค่าตั้งต้น → โค้ด server",
    "scene": "b06_3"
  },
  {
    "id": "b07-1",
    "beat": "B07",
    "start": 130,
    "duration": 1,
    "title": "กดส่งจากหน้าเว็บ",
    "kind": "chat",
    "state": "wait",
    "scene": "b07_1"
  },
  {
    "id": "b07-2",
    "beat": "B07",
    "start": 131,
    "duration": 9.533333333333331,
    "title": "/api/chat เป็นของแอปเรา",
    "kind": "code",
    "file": "public/chat.js · หน้าเว็บ",
    "lines": [
      "fetch('/api/chat', {",
      "  method: 'POST',",
      "  body: JSON.stringify({",
      "    message",
      "  })",
      "})"
    ],
    "active": 0,
    "note": "หน้าเว็บส่งข้อความให้ server ของแอป",
    "scene": "b07_2"
  },
  {
    "id": "b07-3",
    "beat": "B07",
    "start": 140.53333333333333,
    "duration": 7.066666666666663,
    "title": "server เชื่อมให้ผู้ใช้",
    "kind": "flow",
    "focus": 1,
    "scene": "b07_3"
  },
  {
    "id": "b08-1",
    "beat": "B08",
    "start": 147.6,
    "duration": 7.833333333333343,
    "title": "ส่งคำขอไปที่ไหน?",
    "kind": "code",
    "file": "HTTP request · server",
    "lines": [
      "POST",
      "/api/chat/message/blocking",
      "",
      "Host: langmind.in.th"
    ],
    "active": 1,
    "note": "endpoint ของ LangMind · รอคำตอบเต็ม",
    "scene": "b08_1"
  },
  {
    "id": "b08-2",
    "beat": "B08",
    "start": 155.43333333333334,
    "duration": 8.133333333333326,
    "title": "ยืนยันสิทธิ์ตรงไหน?",
    "kind": "code",
    "file": "Request headers · server",
    "lines": [
      "Authorization:",
      "  Bearer <API_KEY>",
      "",
      "Content-Type:",
      "  application/json"
    ],
    "active": 1,
    "note": "JSON = ข้อมูลที่เขียนเป็นชื่อช่องกับค่า",
    "scene": "b08_2"
  },
  {
    "id": "b08-3",
    "beat": "B08",
    "start": 163.56666666666666,
    "duration": 9.166666666666657,
    "title": "ส่งข้อมูลอะไร?",
    "kind": "code",
    "file": "Request body · server",
    "lines": [
      "{",
      "  \"agent_id\": \"<AGENT_ID>\",",
      "  \"query\": \"คำถามผู้ใช้\",",
      "  \"conversation_id\": null",
      "}"
    ],
    "active": 3,
    "note": "ครั้งแรกยังไม่มีรหัสบทสนทนา",
    "scene": "b08_3"
  },
  {
    "id": "b09-1",
    "beat": "B09",
    "start": 172.73333333333332,
    "duration": 5.5,
    "title": "ใช้ fetch ฝั่ง server",
    "kind": "code",
    "file": "server.mjs · server",
    "lines": [
      "const res = await fetch(",
      "  LANGMIND_URL, {",
      "  method: 'POST',",
      "  headers: {",
      "    Authorization:",
      "      `Bearer ${API_KEY}`",
      "  },"
    ],
    "active": 5,
    "note": "ภาพย่อเพื่ออธิบาย · key อ่านจากฝั่ง server",
    "scene": "b09_1"
  },
  {
    "id": "b09-2",
    "beat": "B09",
    "start": 178.23333333333332,
    "duration": 5.066666666666691,
    "title": "จับคู่ข้อมูลใน body",
    "kind": "code",
    "file": "server.mjs · server",
    "lines": [
      "body: JSON.stringify({",
      "  agent_id: AGENT_ID,",
      "  query: message,",
      "  conversation_id:",
      "    conversationId",
      "})"
    ],
    "active": 0,
    "note": "เลือกผู้ช่วย + คำถาม + รหัสบทสนทนา",
    "scene": "b09_2"
  },
  {
    "id": "b09-3",
    "beat": "B09",
    "start": 183.3,
    "duration": 8.399999999999977,
    "title": "ตรวจผลก่อนอ่านคำตอบ",
    "kind": "code",
    "file": "server.mjs · server",
    "lines": [
      "if (!res.ok) {",
      "  throw Error('API error');",
      "}",
      "return await res.json();"
    ],
    "active": 0,
    "note": "ข้อผิดพลาดต้องแยกจากคำตอบของผู้ช่วย",
    "scene": "b09_3"
  },
  {
    "id": "b10-1",
    "beat": "B10",
    "start": 191.7,
    "duration": 9.633333333333354,
    "title": "แสดงคำตอบ เก็บรหัสไว้",
    "kind": "code",
    "file": "Response ตัวอย่าง · server",
    "lines": [
      "{",
      "  \"answer\": \"ข้อความคำตอบ\",",
      "  \"conversation_id\":",
      "    \"conv_demo_01\"",
      "}"
    ],
    "active": 1,
    "note": "answer → แชท · conversation_id → server",
    "scene": "b10_1"
  },
  {
    "id": "b10-2",
    "beat": "B10",
    "start": 201.33333333333334,
    "duration": 8.5,
    "title": "คำตอบกลับถึงหน้าเว็บ",
    "kind": "chat",
    "state": "answer",
    "scene": "b10_2"
  },
  {
    "id": "b11-1",
    "beat": "B11",
    "start": 209.83333333333334,
    "duration": 6.5,
    "title": "ระหว่างรอ กันการส่งซ้ำ",
    "kind": "chat",
    "state": "wait",
    "scene": "b11_1"
  },
  {
    "id": "b11-2",
    "beat": "B11",
    "start": 216.33333333333334,
    "duration": 6.399999999999977,
    "title": "ถ้าส่งไม่สำเร็จ",
    "kind": "chat",
    "state": "error",
    "scene": "b11_2"
  },
  {
    "id": "b12-1",
    "beat": "B12",
    "start": 222.73333333333332,
    "duration": 3.133333333333354,
    "title": "ถามต่อในเรื่องเดิม",
    "kind": "chat",
    "state": "followQ",
    "scene": "b12_1"
  },
  {
    "id": "b12-2",
    "beat": "B12",
    "start": 225.86666666666667,
    "duration": 14.866666666666646,
    "title": "ใช้ conversation_id เดิม",
    "kind": "diff",
    "scene": "b12_2"
  },
  {
    "id": "b12-3",
    "beat": "B12",
    "start": 240.73333333333332,
    "duration": 7,
    "title": "ได้ฉบับสั้นสำหรับ LINE",
    "kind": "chat",
    "state": "follow",
    "scene": "b12_3"
  },
  {
    "id": "b13-1",
    "beat": "B13",
    "start": 247.73333333333332,
    "duration": 5.300000000000011,
    "title": "ตัวอย่างนี้รอคำตอบครบ",
    "kind": "chat",
    "state": "wait",
    "scene": "b13_1"
  },
  {
    "id": "b13-2",
    "beat": "B13",
    "start": 253.03333333333333,
    "duration": 6.466666666666669,
    "title": "ถ้าจะรับคำตอบเป็นช่วง",
    "kind": "cards",
    "items": [
      "server|ปรับส่วนรับข้อมูล",
      "หน้าเว็บ|ปรับการแสดงผล"
    ],
    "note": "ต้องพัฒนาเพิ่มทั้งสองฝั่ง",
    "scene": "b13_2"
  },
  {
    "id": "b14-1",
    "beat": "B14",
    "start": 259.5,
    "duration": 6.133333333333326,
    "title": "ออกแบบให้เหมาะกับอุปกรณ์",
    "kind": "devices",
    "scene": "b14_1"
  },
  {
    "id": "b14-2",
    "beat": "B14",
    "start": 265.6333333333333,
    "duration": 10.866666666666674,
    "title": "จอใหญ่ เพิ่มพื้นที่แก้ข้อความ",
    "kind": "workspace",
    "scene": "b14_2"
  },
  {
    "id": "b15-1",
    "beat": "B15",
    "start": 276.5,
    "duration": 12.300000000000011,
    "title": "เปลี่ยนหน้าที่ แล้วต่อเติม",
    "kind": "cards",
    "items": [
      "คำสั่ง|หน้าที่และน้ำเสียง",
      "ฐานความรู้|FAQ และคู่มือ",
      "ระบบงาน|เพิ่มเครื่องมือและตรวจสิทธิ์"
    ],
    "note": "ส่วนต่อยอดต้องเตรียมและพัฒนาเพิ่ม",
    "scene": "b15_1"
  },
  {
    "id": "b15-2",
    "beat": "B15",
    "start": 288.8,
    "duration": 8.300000000000011,
    "title": "จำวงจรหลักไว้",
    "kind": "flow",
    "summary": true,
    "scene": "b15_2"
  },
  {
    "id": "b15-3",
    "beat": "B15",
    "start": 297.1,
    "duration": 6.5,
    "title": "งานแรกของคุณคืออะไร?",
    "kind": "hero",
    "end": true,
    "scene": "b15_3"
  },
  {
    "id": "b16-1",
    "beat": "B16",
    "start": 303.6,
    "duration": 6.833333333333314,
    "title": "สร้างสิ่งต่อไป ในแบบของคุณ",
    "kind": "logo",
    "scene": "b16_1"
  }
];
export const captions=[
  {
    "id": "B01-0",
    "text": "จากแชท AI ที่คุ้นเคย",
    "start": 0.5,
    "end": 6.814666666666667
  },
  {
    "id": "B01-1",
    "text": "สู่ผู้ช่วยบนเว็บของทีมเรา",
    "start": 6.814666666666667,
    "end": 13.129333333333333
  },
  {
    "id": "B01-2",
    "text": "ตั้งแต่เตรียม key จนถึงถามต่อ",
    "start": 13.129333333333333,
    "end": 19.444
  },
  {
    "id": "B02-0",
    "text": "ช่วยทีมร่างข้อความสุภาพ",
    "start": 20.444,
    "end": 25.219110999999998
  },
  {
    "id": "B02-1",
    "text": "ขอฉบับสั้นสำหรับ LINE",
    "start": 25.219110999999998,
    "end": 29.994222
  },
  {
    "id": "B02-2",
    "text": "ตรวจข้อความก่อนนำไปส่ง",
    "start": 29.994222,
    "end": 34.769333
  },
  {
    "id": "B03-0",
    "text": "เริ่มจาก 3 ส่วน",
    "start": 35.769333,
    "end": 39.818399600000006
  },
  {
    "id": "B03-1",
    "text": "หน้าเว็บส่งข้อความให้ server",
    "start": 39.818399600000006,
    "end": 43.8674662
  },
  {
    "id": "B03-2",
    "text": "server เชื่อม LangMind Agent",
    "start": 43.8674662,
    "end": 47.9165328
  },
  {
    "id": "B03-3",
    "text": "ได้คำตอบ ส่งกลับทางเดิม",
    "start": 47.9165328,
    "end": 51.9655994
  },
  {
    "id": "B03-4",
    "text": "เราพัฒนาหน้าเว็บและส่วนเชื่อมต่อ",
    "start": 51.9655994,
    "end": 56.014666000000005
  },
  {
    "id": "B04-0",
    "text": "ตั้งหน้าที่และน้ำเสียงให้ Agent",
    "start": 57.014666000000005,
    "end": 63.25466600000001
  },
  {
    "id": "B04-1",
    "text": "Agent ID เลือกผู้ช่วย",
    "start": 63.25466600000001,
    "end": 69.49466600000001
  },
  {
    "id": "B04-2",
    "text": "API key ยืนยันสิทธิ์",
    "start": 69.49466600000001,
    "end": 75.734666
  },
  {
    "id": "B05-0",
    "text": "ตั้งชื่อ key ให้จำแอปได้",
    "start": 76.734666,
    "end": 82.806666
  },
  {
    "id": "B05-1",
    "text": "เลือกอายุและสิทธิ์ที่ต้องใช้",
    "start": 82.806666,
    "end": 88.87866600000001
  },
  {
    "id": "B05-2",
    "text": "ตัวอย่างแชทใช้ chat:invoke",
    "start": 88.87866600000001,
    "end": 94.95066600000001
  },
  {
    "id": "B05-3",
    "text": "นำ key ไปตั้งค่าฝั่ง server",
    "start": 94.95066600000001,
    "end": 101.022666
  },
  {
    "id": "B06-0",
    "text": "เก็บ key ฝั่ง server",
    "start": 102.022666,
    "end": 108.766666
  },
  {
    "id": "B06-1",
    "text": "Agent ID อยู่หลัง /agents/",
    "start": 108.766666,
    "end": 115.510666
  },
  {
    "id": "B06-2",
    "text": "ใช้ ID ของ Agent ที่คุณสร้าง",
    "start": 115.510666,
    "end": 122.254666
  },
  {
    "id": "B06-3",
    "text": "โค้ดอ่านจากค่าตั้งต้น",
    "start": 122.254666,
    "end": 128.99866600000001
  },
  {
    "id": "B07-0",
    "text": "กดส่งจากหน้าเว็บ",
    "start": 129.99866600000001,
    "end": 135.53466600000002
  },
  {
    "id": "B07-1",
    "text": "/api/chat คือ route ของแอปเรา",
    "start": 135.53466600000002,
    "end": 141.07066600000002
  },
  {
    "id": "B07-2",
    "text": "server จึงเรียก LangMind",
    "start": 141.07066600000002,
    "end": 146.60666600000002
  },
  {
    "id": "B08-0",
    "text": "POST ไปยัง LangMind",
    "start": 147.60666600000002,
    "end": 153.64133275000003
  },
  {
    "id": "B08-1",
    "text": "Authorization: Bearer ตามด้วย key",
    "start": 153.64133275000003,
    "end": 159.67599950000002
  },
  {
    "id": "B08-2",
    "text": "agent_id เลือกผู้ช่วย · query คือคำถาม",
    "start": 159.67599950000002,
    "end": 165.71066625000003
  },
  {
    "id": "B08-3",
    "text": "รอบแรก conversation_id เป็น null",
    "start": 165.71066625000003,
    "end": 171.74533300000002
  },
  {
    "id": "B09-0",
    "text": "server ใช้ fetch เรียก API",
    "start": 172.74533300000002,
    "end": 178.72933300000003
  },
  {
    "id": "B09-1",
    "text": "อ่าน key และ Agent ID จากค่าตั้งต้น",
    "start": 178.72933300000003,
    "end": 184.713333
  },
  {
    "id": "B09-2",
    "text": "ตรวจผลสำเร็จก่อนอ่านคำตอบ",
    "start": 184.713333,
    "end": 190.69733300000001
  },
  {
    "id": "B10-0",
    "text": "answer คือข้อความคำตอบ",
    "start": 191.69733300000001,
    "end": 197.40755533333333
  },
  {
    "id": "B10-1",
    "text": "server เก็บรหัสบทสนทนาไว้",
    "start": 197.40755533333333,
    "end": 203.11777766666668
  },
  {
    "id": "B10-2",
    "text": "ส่งคำตอบกลับมาแสดงในแชท",
    "start": 203.11777766666668,
    "end": 208.828
  },
  {
    "id": "B11-0",
    "text": "ระหว่างรอ กันการกดส่งซ้ำ",
    "start": 209.828,
    "end": 213.79955566666666
  },
  {
    "id": "B11-1",
    "text": "ส่งไม่สำเร็จ ให้ลองใหม่ได้",
    "start": 213.79955566666666,
    "end": 217.77111133333332
  },
  {
    "id": "B11-2",
    "text": "เก็บข้อความที่ผู้ใช้พิมพ์ไว้",
    "start": 217.77111133333332,
    "end": 221.742667
  },
  {
    "id": "B12-0",
    "text": "ถามใหม่ แต่คุยเรื่องเดิม",
    "start": 222.742667,
    "end": 228.98866700000002
  },
  {
    "id": "B12-1",
    "text": "ใช้ conversation_id จากรอบก่อน",
    "start": 228.98866700000002,
    "end": 235.234667
  },
  {
    "id": "B12-2",
    "text": "server ต้องตรวจเจ้าของบทสนทนา",
    "start": 235.234667,
    "end": 241.480667
  },
  {
    "id": "B12-3",
    "text": "ได้ข้อความฉบับสั้นแล้ว",
    "start": 241.480667,
    "end": 247.72666700000002
  },
  {
    "id": "B13-0",
    "text": "ตัวอย่างนี้รอคำตอบครบ",
    "start": 247.72666700000002,
    "end": 253.10800050000003
  },
  {
    "id": "B13-1",
    "text": "รับเป็นช่วง ต้องปรับทั้งสองฝั่ง",
    "start": 253.10800050000003,
    "end": 258.48933400000004
  },
  {
    "id": "B14-0",
    "text": "จัดหน้าจอให้เข้ากับอุปกรณ์",
    "start": 259.48933400000004,
    "end": 264.82266733333336
  },
  {
    "id": "B14-1",
    "text": "มือถือ: ถามและคัดลอก",
    "start": 264.82266733333336,
    "end": 270.1560006666667
  },
  {
    "id": "B14-2",
    "text": "จอใหญ่: เพิ่มพื้นที่แก้ข้อความ",
    "start": 270.1560006666667,
    "end": 275.48933400000004
  },
  {
    "id": "B15-0",
    "text": "ต่อยอดคำสั่งและฐานความรู้",
    "start": 276.48933400000004,
    "end": 283.01733400000006
  },
  {
    "id": "B15-1",
    "text": "เชื่อมระบบงาน ต้องตรวจสิทธิ์",
    "start": 283.01733400000006,
    "end": 289.545334
  },
  {
    "id": "B15-2",
    "text": "จำวงจรข้อความไป–กลับ",
    "start": 289.545334,
    "end": 296.07333400000005
  },
  {
    "id": "B15-3",
    "text": "เริ่มจากงานหนึ่งอย่างของคุณ",
    "start": 296.07333400000005,
    "end": 302.60133400000007
  }
];

# EP03 v4.3 — Plan

สถานะ: Silent Draft ผลิตด้วย Pillow + FFmpeg fallback จาก story/scene design; แพ็กเกจ HyperFrames แยก 9 scene hosts และ lint ผ่าน; ไม่มีเสียงและไม่มีการเรียก API จริง. Native snapshot/render ยังติดข้อจำกัด localhost ของ sandbox.

## คำถามและขอบเขตคนดู

**คำถามคนดู:** ถ้าผู้ใช้คุยกับ Agent ใน LangMind อยู่แล้ว นักพัฒนาจะส่งคำถามผ่าน Chat API และทำให้ถามต่อในแอปของตัวเองอย่างไร?

**คำตอบหลังดู:** เตรียม `agent_id` กับ API key ที่มีสิทธิ์ `chat:invoke`, ส่ง `POST /api/chat/message` แบบ SSE, รอ `message_end`, เก็บ `conversation_id` แล้วส่ง ID เดิมเมื่อถามต่อ. แอปของนักพัฒนาจัดการ key และเป็นผู้แสดงผลใน UI.

## เส้นเรื่อง

ผู้ใช้ขอข้อความสุภาพเพื่อเลื่อนประชุมจาก 14:00 เป็น 15:00 แล้วขอให้ย่อ. เหตุการณ์เดียวกันเดินผ่าน 9 beats ตาม [STORYBOARD-v4.3.md](STORYBOARD-v4.3.md). ตัวอย่างบทสนทนาและคำตอบเป็น illustrative; ไม่อ้างผลจาก Agent จริง.

## Claim ledger

| Claim | สถานะ | ที่มา / วิธีนำเสนอ |
|---|---|---|
| Chat API มี `POST /api/chat/message` แบบ SSE เป็นค่าเริ่มต้น | documented | `langmind-api.md`, หมวด Chat API |
| `POST /api/chat/message/blocking` คืนคำตอบเต็มแบบ JSON | documented | `langmind-api.md`, ตารางและตัวอย่าง blocking |
| SSE มี `message_start`, `message`, `citations` ที่อาจมี และ `message_end` | documented | `langmind-api.md`, ตัวอย่าง response stream |
| `message_end` มีคำตอบเต็มและ usage; ห้ามใช้ข้อมูลตัวเลขตัวอย่างเป็นผลจริง | documented | `langmind-api.md`; ในคลิปไม่แสดง usage values |
| ส่ง `conversation_id: null` เพื่อเริ่มบทสนทนาใหม่ในตัวอย่างนี้ และส่ง ID เดิมเพื่อถามต่อ | documented | `langmind-api.md`, request และคำอธิบาย Chat API |
| Chat endpoint ใช้ scope `chat:invoke`; การอ่าน/จัดการ conversation ต้องระบุ `agent_id` | documented | `langmind-api.md`, ตาราง endpoint และหมายเหตุ `agent_id` |
| เก็บ API key ฝั่ง server และให้แอปแสดงข้อความ | implementation responsibility | ข้อกำหนดความปลอดภัยของ workspace และการแบ่งหน้าที่ในระบบตัวอย่าง; ไม่อ้างว่า API วาด UI ให้ |
| ขอร่างข้อความเลื่อนประชุมและขอให้ย่อ | illustrative | เหตุการณ์สมมติที่ใช้ตาม request ตั้งแต่ต้นจนจบ; ภาพแสดงป้าย “ภาพจำลอง” |
| ID, คำตอบ, citation, usage, เวลา และค่าใช้จ่ายจากการเรียกจริง | unknown / omitted | ไม่มีการเรียก API; ไม่สร้างค่าขึ้นมาแทน |

## โครง beat

| Beat | หน้าที่ | จุดส่งต่อ |
|---|---|---|
| B1 | เริ่มจากคำขอที่คนดูเข้าใจ | ผู้ใช้ต้องการแก้คำตอบได้ |
| B2 | แยกงานของหน้าแอป, server, Chat API และ Agent | คำถามเดินทางผ่าน server |
| B3 | เตรียม `agent_id`, scope และที่เก็บ key | พร้อมส่ง request |
| B4 | แสดง endpoint และ body ที่เริ่มบทสนทนาใหม่ | `conversation_id: null` |
| B5 | แสดง event stream ตามลำดับ | แอปอ่าน event และรอ `message_end` |
| B6 | ใช้ ID เดิมกับคำขอต่อเนื่อง | กลับสู่บทสนทนาผู้ใช้ |
| B7 | จัดกลุ่ม route อื่นของ Chat API | คนดูเห็นขอบเขต API โดยไม่อ่านทุก payload |
| B8 | ทวนการแบ่งหน้าที่และวิธีถามต่อ | ผู้ชมจำลำดับเดียวได้ |
| B9 | ปิดด้วยชื่อผลิตภัณฑ์และเว็บไซต์จริง | ไม่ใช้ข้อความผู้สนับสนุน |

## การนำเสนอและ motion

- หน้าจอแชต 2 ภาพออกแบบก่อนสร้าง และสร้างเป็น raster แยกจาก HTML composition
- ใช้ Sarabun local, safe area แนวตั้ง และซับร่างที่เห็นชัดในภาพทุก beat
- ใช้ Catalog Code Highlight เป็นฐานการเน้นบรรทัด request; รายละเอียด source, preview และการปรับอยู่ใน [CATALOG-v4.3.md](CATALOG-v4.3.md)
- สำหรับ SSE ใช้ event path ที่ระบุ “ภาพอธิบาย” ไม่ทำ mock terminal output เพราะไม่มีผลเรียก API จริง
- เฟรมแรกมี hook และภาพแชตอยู่แล้ว; ทุก beat ใช้ hard cut หรือการเปลี่ยนสถานะที่มีเหตุผล ไม่ใช้ entrance ซ้ำทั้งคลิป

## ขอบเขตการผลิต

- ไม่มีเสียงพากย์/ดนตรีจนกว่าจะมีเสียงตัวอย่างที่ผู้ใช้เลือก; subtitle ที่ฝังเป็นบทอ่านร่าง ไม่ซิงค์กับเสียงจริง
- ไม่ส่ง key, agent id จริง หรือข้อความไปยัง API; ไม่สร้าง provider resource และไม่ publish
- v4.2 และ preview state ของ v4.2 ไม่ถูกแก้

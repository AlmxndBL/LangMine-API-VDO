# EP03 v4.3 — Script

ฉบับ Silent Draft: ข้อความซับเป็นบทอ่านบนจอระหว่างตรวจเนื้อหาและจังหวะ ยังไม่ซิงค์กับเสียงจริง

| Beat | บทบรรยายร่าง | ซับร่าง | ข้อความเน้น |
|---|---|---|---|
| B1 | อยากเลื่อนประชุม แต่คิดคำสุภาพไม่ออก? ผู้ใช้ขอร่าง แล้วขอให้ย่ออีกครั้ง | อยากเลื่อนประชุม แต่คิดคำสุภาพไม่ออก?<br>ผู้ใช้ขอร่าง แล้วขอให้ย่ออีกครั้ง | จากคำขอหนึ่งครั้ง ไปถึงการถามต่อ |
| B2 | ในแอปของคุณ แอปเป็นคนแสดงหน้าจอ; server ส่งคำถามผ่าน Chat API ไปยัง Agent | แอปของคุณแสดงหน้าจอ<br>server ส่งคำถามผ่าน Chat API ไปยัง Agent | แอปของคุณ → server → Chat API → Agent |
| B3 | เตรียม `agent_id` กับ API key ที่มีสิทธิ์ `chat:invoke`; เก็บ key ไว้ฝั่ง server ไม่ใส่ browser | เตรียม `agent_id` กับ API key ที่มีสิทธิ์ `chat:invoke`;<br>เก็บ key ไว้ฝั่ง server ไม่ใส่ browser | `agent_id` · `chat:invoke` · เก็บ key ฝั่ง server |
| B4 | เริ่มด้วย `POST /api/chat/message` แบบ SSE ที่ทยอยส่งข้อมูล; ส่ง `agent_id`, `query` และ `conversation_id: null` เพื่อเปิดบทสนทนาใหม่ | เริ่มด้วย `POST /api/chat/message` แบบ SSE<br>ที่ทยอยส่งข้อมูล; ส่ง `agent_id`, `query`<br>และ `conversation_id: null` เพื่อเริ่มใหม่ | `POST /api/chat/message` · SSE stream |
| B5 | `message_start` แจ้ง ID ของบทสนทนาและข้อความ; `message` ทยอยส่งคำตอบ, `citations` อาจมี แล้ว `message_end` ส่งคำตอบฉบับเต็ม | `message_start` แจ้ง ID ของบทสนทนาและข้อความ<br>`message` ส่งคำตอบทีละช่วง; `citations` อาจมี<br>`message_end` ส่งคำตอบฉบับเต็ม | `message_start` → `message` → `citations` (อาจมี) → `message_end` |
| B6 | เก็บ `conversation_id` ไว้; เมื่อถามต่อ ส่ง ID เดิมเพื่อกลับไปยังบทสนทนาเดิม | เก็บ `conversation_id` ไว้; เมื่อถามต่อ<br>ส่ง ID เดิมเพื่อกลับไปยังบทสนทนาเดิม | คำถามถัดไปใช้ `conversation_id` เดิม |
| B7 | นอกจากแบบทยอยส่ง ยังมีแบบรอคำตอบเต็ม; พรีวิวใน Agent Builder; หยุด stream; ดูหรือจัดการประวัติ; ให้คะแนนคำตอบ และดาวน์โหลดไฟล์ที่ Agent สร้าง | ยังเลือกแบบรอคำตอบเต็มหรือพรีวิวใน Agent Builder<br>หยุด stream และอ่านหรือจัดการประวัติได้<br>รวมถึงให้คะแนนคำตอบและดาวน์โหลดไฟล์จาก Agent | ส่ง/ควบคุม · ประวัติ · feedback/ไฟล์ |
| B8 | สรุป: server ส่งคำถาม; แอปรับ stream และแสดงคำตอบ; ส่ง `conversation_id` เดิมเมื่อถามต่อ | server ส่งคำถาม; แอปรับ stream และแสดงคำตอบ<br>ส่ง `conversation_id` เดิมเมื่อถามต่อ | server ส่ง → แอปแสดง → ID ใช้ถามต่อ |
| B9 | หน้าจอและคำตอบเป็นภาพจำลอง ไม่ได้เรียก API จริง. ดูคู่มือ Chat API ที่ langmind.in.th | หน้าจอและคำตอบเป็นภาพจำลอง ไม่ได้เรียก API จริง.<br>ดูคู่มือ Chat API ที่ langmind.in.th | LangMind API · langmind.in.th |

## หมายเหตุการอ่าน

- อ่าน `SSE` ว่า “เอสเอสอี”; อธิบายว่าเป็นการทยอยส่งข้อมูลใน B4
- อ่าน `agent_id` ว่า “เอเจนต์ไอดี”; `conversation_id` ว่า “คอนเวอร์เซชันไอดี”
- คำอังกฤษใน code และ endpoint คงรูปเดิม; อย่าอ่าน placeholder เป็นค่าจริง
- บทสนทนาและคำตอบในหน้าจอเป็นตัวอย่างประกอบ ไม่ใช่ผลจาก Agent จริง

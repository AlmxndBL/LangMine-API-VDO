# EP03 v4.3.1 — Plan

## เป้าหมายและคนดู

คนดูทั่วไปที่ใช้ LangMind และ developer ที่อยากนำ Chat API ไปใส่ในแอป หลังดูจบควรจำได้ว่าแอปส่งคำถามผ่าน server ไปยัง Chat API, API ส่งข้อมูลคำตอบกลับเป็นช่วงได้ และต้องเก็บ `conversation_id` ไว้เมื่อจะถามต่อในบทสนทนาเดิม.

## เรื่องที่ใช้พาไปจนจบ

ผู้ใช้ขอร่างข้อความสุภาพเพื่อเลื่อนประชุมจาก 14:00 เป็น 15:00 แล้วขอให้ย่อหนึ่งประโยค. เหตุการณ์เดียวกันปรากฏในภาพจำลองเริ่มต้น, request, คำตอบแบบ SSE และภาพถามต่อ.

## โครงเรื่อง 9 beats

1. เห็นการแชตใน LangMind จากมุมผู้ใช้ทั่วไป
2. แสดงว่าแอปเป็นเจ้าของหน้าจอ ส่วน server ส่ง request ผ่าน Chat API
3. อธิบาย `agent_id`, API key และ `chat:invoke` แบบสั้น พร้อมย้ำว่า key อยู่ฝั่ง server
4. แสดง `POST /api/chat/message`, API key ใน `Authorization` header ฝั่ง server และ `conversation_id: null` ใน request ตัวอย่าง
5. อธิบาย SSE ว่าคำตอบทยอยมา และ `message_end` ระบุว่าครบแล้ว
6. เปรียบ `conversation_id` เป็นรหัสห้องแชต
7. ส่งรหัสเดิมกับคำถามใหม่เพื่อคุยต่อ
8. สรุปความสามารถอื่นของ Chat API เป็นสามกลุ่ม ไม่ยัดตาราง endpoint
9. ทวนสามขั้นและชี้ไปที่คู่มือ

## Claim ledger

| ข้อความ | สถานะ | หลักฐาน/ขอบเขต |
|---|---|---|
| `POST /api/chat/message` ใช้ SSE เป็นค่าเริ่มต้น | documented | `langmind-api.md`, Chat API snapshot |
| `message_start` มี conversation/message ID; `message` ส่ง answer chunks; `message_end` มีคำตอบเต็มและ usage | documented | ตัวอย่าง SSE ใน snapshot; วิดีโอไม่แสดงค่า usage จริง |
| `conversation_id: null` เปิดบทสนทนาใหม่ในตัวอย่างที่ไม่ส่ง `user_id` | documented | request body และหมายเหตุใน snapshot |
| ส่ง `conversation_id` เดิมเพื่อถามต่อ | documented | request/response fields ใน snapshot |
| Chat API มี preview, blocking, stop, ประวัติ, feedback, และไฟล์ | documented | ตาราง Chat API; ในคลิปจัดกลุ่มเป็นภาษาทั่วไป |
| หน้าจอและคำตอบเลื่อนประชุม | illustrative | raster สร้างขึ้นใหม่และติดป้าย “ภาพจำลอง” |
| API key ต้องอยู่ฝั่ง server | security practice | แสดงเป็นคำแนะนำการนำ API ไปใช้; ไม่มี key จริง |

## ขอบเขตการผลิต

ไม่มี live/paid API, ไม่มี secret, ไม่มี provider resource, ไม่มี publish. ไม่มีค่า ID, answer, citations, usage, cost หรือ latency ที่อ้างว่าได้จากการเรียกจริง. เป้าหมายนี้คือ Silent Draft; หลังตรวจบทและภาพให้ทำ voice sample ต่อเนื่องก่อนสร้างเสียงเต็ม.

## ภาพและ Catalog

ใช้ Editorial Paper & Sage Ink ตาม EP04 v3 Orus: กระดาษมีเส้นบาง, กรอบ ink, เงา sage, progress step สามสี และ caption ด้านล่าง. ใช้ภาพ raster สำหรับหน้าจอแชต. Catalog component HF-337 ทำ stepper; HF-113 ทำ code highlight ใน B4. แยกสถานะ source integration ออกจาก preview/native-render verification ใน [CATALOG](CATALOG.md).

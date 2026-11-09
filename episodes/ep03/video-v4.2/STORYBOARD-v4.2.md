# EP03 v4.2 — Storyboard และการแสดงภาพ

## ภาษาภาพ

แนวตั้ง 1080×1920, Editorial Paper & Sage Ink: กระดาษครีม เส้นบรรทัดบาง ตัวอักษร Sarabun ป้ายเขียวหม่น/teal และแผงโค้ดเข้ม ใช้โลโก้กลางและ robot PNG จาก shared assets โดยรักษาสัดส่วน

ภาพหน้าจอที่สร้างใหม่เป็น raster ระบุ “ภาพจำลอง” ในภาพทุกใบ; ไม่สร้าง mock UI เป็น HTML และไม่ใช้ภาพจำลองแทนผล API จริง

## รายละเอียดราย Beat

| ID / สงสัยก่อน → เข้าใจหลัง | ภาพเริ่ม → การกระทำ → ภาพจบ / focus | บทพากย์และข้อความ | Motion / Catalog | Assets และการตรวจ |
|---|---|---|---|---|
| B1 · แชทถามต่อ | เริ่มเห็นคำถามในมือถือ → คำตอบปรากฏ → สถานะสองเปลี่ยนเป็นคำขอให้ย่อ; สายตาอยู่ที่บทสนทนา | VO: “เคยขอให้ผู้ช่วยช่วยร่างข้อความ แล้วอยากให้แก้ต่ออีกนิดไหม?” / “ตัวอย่างนี้เริ่มจากแชทที่คุ้นเคย: ขอร่าง แล้วถามให้สั้นลงในเรื่องเดิม” ซับตรงกับประโยค | ภาพการ์ด/มือถือเลื่อนเข้าจากล่าง; ไม่ใส่ effect ใน UI | `S01`, `S02`; ป้าย “ภาพจำลอง · ตัวอย่างสมมติ”; Robot 01 ตั้งคำถาม |
| B2 · ใครส่งอะไรให้ใคร | เริ่มจากแอปหนึ่งกล่อง → backend แทรกระหว่างแอปกับ API → Agent และทางกลับปรากฏตามลำดับ | VO: “หน้าจอแชทคือสิ่งที่ผู้ใช้เห็น ส่วน API คือทางเชื่อมของระบบ” / “แอปส่งคำถามให้ backend แล้ว backend เรียก Chat API; แอปของคุณเป็นผู้แสดงคำตอบ” | เปิดแผนภาพทีละ node; ลูกศรเดินไป/กลับอย่างต่อเนื่อง. HF-408 Flowchart ใช้เป็นตัวเลือกในทะเบียน แต่ปรับ diagram custom เพราะต้องระบุ ownership ให้ตรงสถาปัตยกรรม | diagram ไม่ใช่ screenshot; label แยก frontend/backend/API/Agent; ตรวจ direction ของลูกศร |
| B3 · เตรียมอะไร | การ์ด Agent → เผย publish และ ID → การ์ด Key กับ server lock เข้ามาทีละชิ้น | VO: “เตรียม Agent ที่ publish แล้ว และใช้ agent_id ของ Agent นั้น” / “สร้าง Personal API Key ให้มีสิทธิ์ chat:invoke แล้วเก็บ Key ไว้ฝั่ง server” | Checklist reveal ทีละรายการ; key เปิดเฉพาะป้าย scope ไม่แสดง token | Shared robot 01; placeholder `AGENT_ID`; ไม่แสดง secret จริง |
| B4 · ส่งคำขอ | route เต็มก่อน → header ขึ้น → JSON ปรากฏทีละบรรทัด โดยเริ่มที่ `agent_id` แล้ว `query` และ `conversation_id: null` | VO: “ส่งคำถามผ่าน POST /api/chat/message ซึ่งตอบกลับเป็น SSE โดยค่าเริ่มต้น” / “backend ใส่ Bearer Key และข้อมูลคำขอ; null หมายถึงเริ่มบทสนทนาใหม่” | เปิดโค้ดและ caret ตามลำดับ **HF-118 Code Typing** เป็น reference behavior. เวลาต่อ token เป็น custom fallback ไม่ใช่ source block ที่ integrated | Payload ตัวอย่างในแผง dark terminal; label “ตัวอย่างโค้ด · ไม่ได้เรียก API จริง”; ไม่มีค่ารับรองปลอม |
| B5 · SSE คืออะไร | เริ่มเป็นแกน event ว่าง → event ชิปไหลลงทีละขั้น → `message_end` รับ focus | VO: “SSE หรือ Server-Sent Events ส่งข้อมูลจาก server มาเป็นลำดับ” / “message_start ให้ ID; message ส่งเนื้อหาเป็นส่วน ๆ; citations อาจมี; message_end ส่งคำตอบเต็มและ usage” | เรียงบรรทัดตาม cue แบบ **HF-196 Code Terminal Run**; custom fallback เป็นการเผย schema labels ไม่ใช่ output จริง | แสดงชื่อ event และ field แบบไม่มีตัวเลขหรือเนื้อหาคำตอบจำลอง; แยก optional citations |
| B6 · ถามต่อ | เห็นผลของ ID จาก B5 → ID เดิมย้ายลง payload ถัดไป → ลูกศรย้อนกลับสู่ conversation เดิม | VO: “เมื่อถามต่อ ใช้ conversation_id ที่ได้รับจาก stream เดิม” / “จึงส่งข้อความใหม่ในบทสนทนาเดิม; ใช้ null เมื่อเริ่มห้องใหม่” | เส้น ID โค้งกลับและเสียบเข้า request ถัดไป; ไม่ใช้ `conv_123` | Placeholder เชิงคำอธิบาย `[conversation_id ที่ได้มา]`; Robot 05 ชี้ความสัมพันธ์ |
| B7 · endpoint อื่น | 3 กลุ่ม route ปรากฏตามการเลื่อนการ์ดแนวตั้ง; DELETE มีป้ายเตือนอยู่กับ route นั้น | VO: “ยังมี endpoint ส่ง preview แบบ blocking และหยุด stream” / “อ่านหรือแก้ประวัติ ให้คะแนนคำตอบ และดาวน์โหลดไฟล์ที่ Agent สร้างได้; ลบ conversation เป็นการลบถาวร” | Card stack แยกแต่ละหมวด; ป้ายแดงแสดงกับ DELETE เพื่อเตือนการกระทำจริง | routes ครบตาม API snapshot; ทุกกลุ่มแสดง `chat:invoke`; GET history แสดง `agent_id` |
| B8 · สรุป workflow | ของบนจอที่เหลือเป็นสี่ขั้น → highlight เปลี่ยนตามลำดับ → หยุดที่ ID สำหรับถามต่อ | VO: “เก็บ Key ที่ server ส่งคำถาม อ่าน stream จน message_end แล้วเก็บ conversation_id เพื่อถามต่อ” / “API ส่งข้อมูลกลับมา ส่วนแอปของคุณเลือกวิธีแสดงผลบนหน้าจอ” | Marker checklist/flow rail reveal. HF-242 Marker Checklist Card เป็น reference; custom fallback เพราะ text Thai 9:16 ต้อง wrap ตามจริง | ไม่มี endpoint ใหม่; ตรวจว่าคำว่า “API แสดงผลแชท” ไม่ได้อ้างเกินจริง |
| B9 · ปิดเรื่อง | โลโก้กลางอยู่บนพื้นอ่อน → URL ปรากฏ → robot thumbs-up เป็นองค์ประกอบรอง | VO: “นี่คือภาพรวมการเริ่มต้นใช้ Chat API กับ LangMind” / “ดูรายละเอียดเพิ่มเติมได้ที่ langmind.in.th” | โลโก้ fade-in, URL slide-up, Robot 10 เข้าท้าย | โลโก้ shared ตรงไฟล์; ไม่มีข้อความสนับสนุน/สปอนเซอร์ที่ไม่มีหลักฐาน |

## แบบภาพหน้าจอ

รายละเอียดข้อความ/ตำแหน่ง/ความต่อเนื่องของสองสถานะอยู่ที่ [SCREEN-DESIGNS-v4.2.md](SCREEN-DESIGNS-v4.2.md). ตรวจ raster จริงก่อนใช้ใน timeline และแสดงใน B1 เท่านั้น

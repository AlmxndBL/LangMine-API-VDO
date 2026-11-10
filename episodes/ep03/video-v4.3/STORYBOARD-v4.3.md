# EP03 v4.3 — Storyboard

ลำดับ 9 beats เริ่มจากเหตุการณ์ที่ผู้ใช้ทั่วไปคุ้นเคย แล้วเปิดเผยหน้าที่ของแอป, server และ Chat API. เวลาสุดท้ายมาจาก [timing.json](timing.json); ใช้ [timing.generated.json](timing.generated.json) เป็นค่าหลัง build.

| Beat | ภาพและลำดับเหตุการณ์ | ข้อความ/ซับ | Motion / timing | Source / handoff |
|---|---|---|---|---|
| B1 · ขอร่างแล้วขอแก้ต่อ | เปิดด้วย raster `CHAT-01` ซึ่งมีคำถามและคำตอบสมมติครบ; robot pose `01-question.png` เป็นตัวประกอบด้านล่าง | Hook “อยากเลื่อนประชุม แต่คิดคำสุภาพไม่ออก?”; ป้าย “ภาพจำลอง” อยู่ใน raster | เฟรมแรกมีภาพแชต; raster คงนิ่งใน fallback | Illustrative; พาไปถามว่าใครเป็นผู้แสดงหน้าจอ |
| B2 · ใครแสดงหน้าจอ | เส้นแนวตั้งพาไปตาม `แอปของคุณ → server → Chat API → Agent`; มีเส้นกลับระบุ SSE | แอปแสดงหน้าจอ; server ส่งคำถาม; Chat API สื่อสารกับ Agent | รายการและเส้นทางค่อย ๆ ปรากฏ; source มี timeline แยกตามจุด | API role boundary; handoff ไปสิ่งที่ต้องเตรียม |
| B3 · เตรียมก่อนเรียก | แสดงสามสิ่งที่ต้องมี: `agent_id`, API key ที่มี `chat:invoke`, และ key เก็บใน server | ซับอธิบาย scope ว่าเป็นสิทธิ์สำหรับเรียก Chat API | จุดและข้อความเปิดตามลำดับแนวตั้ง แล้วหยุดให้อ่าน | Scope อ้างจาก `langmind-api.md`; ไม่ใส่ key จริง; handoff ไป request |
| B4 · ส่งคำถาม | แสดง `POST /api/chat/message`, Authorization placeholder และ JSON body ที่มี `agent_id`, `query`, `conversation_id: null`, `attachment_ids: []` | อธิบาย SSE ว่าทยอยส่งข้อมูล และ `null` ใช้เริ่มบทสนทนาใหม่ในตัวอย่างนี้ | กวาดแถบเน้น `conversation_id: null` แล้วค้าง; fallback วาด highlight ด้วย Pillow | Payload จาก `langmind-api.md`; block HF-113 อยู่ใน source แต่ native render ยังไม่ผ่านการตรวจ; handoff ไป event |
| B5 · อ่าน SSE events | แผนผังเรียง `message_start` → `message` → `citations` (อาจมี) → `message_end`; ระบุว่า event แรกให้ ID และ event ท้ายมีคำตอบเต็ม/usage | ซับร่างเล่าความหมายโดยไม่ใส่ response value, ID, citation หรือ usage ตัวเลข | event เปิดเรียงตามเวลา; fallback วาดเป็น diagram ไม่ใช่ terminal log | Event sequence จากตัวอย่างใน `langmind-api.md`; ไม่ใช้ HF-196 เพราะไม่มีผลเรียก API จริง; handoff ไป ID ที่จะเก็บไว้ |
| B6 · ถามต่อ | Raster `CHAT-02` คงคำถาม/คำตอบแรก และเพิ่มคำถามให้ย่อกับคำตอบตัวอย่าง | ป้าย “ภาพจำลอง”; ข้อความ `conversation_id เดิม → request ถัดไป` | แสดง raster และคำอธิบาย ID คงนิ่งให้อ่าน | UI ต่อเนื่องจาก CHAT-01; คำตอบเป็น illustrative; handoff ไป route map |
| B7 · เส้นทางอื่นของ Chat API | แสดง 10 routes แบ่งเป็นส่ง/ควบคุม, ประวัติ, feedback/ไฟล์; PATCH/DELETE จัดคอลัมน์แยกจาก path | มี note ว่าทุก endpoint ใช้ `chat:invoke` และงานประวัติต้องระบุ `agent_id`; ซับแปล blocking/preview/stop ให้เป็นภาษาพูด | เปิดกลุ่มตามลำดับและหยุดภาพเมื่ออ่าน route | เทียบกับตาราง Chat API ใน `langmind-api.md`; ไม่ใช้ card grid; handoff ไปสรุป |
| B8 · กลับไปที่ผู้ใช้ | กลับ raster `CHAT-02`; ข้อความสรุปเส้นทางจาก server ไปแอปและ ID สำหรับถามต่อ | “server ส่ง → แอปแสดง → ID ใช้ถามต่อ”; ซับย้ำส่ง `conversation_id` เดิม | หน้าจอและคำอธิบายหยุดนิ่ง ไม่เพิ่ม motion ตกแต่ง | ทวนการแบ่งหน้าที่และ conversation mapping; handoff ไป end card |
| B9 · LangMind API | โลโก้จริงอยู่กึ่งกลาง; ตามด้วย “LangMind API” และ `langmind.in.th` | ซับย้ำว่าหน้าจอและคำตอบเป็นภาพจำลอง ไม่มีการเรียก API จริง | source ขยับโลโก้หนึ่งครั้ง; fallback วางโลโก้และข้อความกึ่งกลาง | Brand source อยู่ใน shared assets; ไม่กล่าวอ้างผู้สนับสนุน |

## หลักฐานภาพและข้อจำกัด

- ภาพจุดตรวจจาก MP4 อยู่ใน [qa-contact-sheet-v4.3.png](renders/qa-contact-sheet-v4.3.png); เปิดดูภาพเต็มของ B4/B5/B7/B9 ก่อนบันทึก review.
- HyperFrames source มี scene host แยก 9 beats และ composition `code-highlight`; lint ผ่าน 0 errors/0 warnings.
- Native `check`/`snapshot` ไม่ได้ภาพเพราะ Chrome ใน sandbox เปิด `127.0.0.1` ไม่ได้; MP4 จึงเรนเดอร์ด้วย `render_silent.py` (Pillow + FFmpeg). ภาพ motion ใน MP4 ไม่ใช่การ render จาก Catalog block จริง.
- ไม่มีเสียงพากย์หรือเพลง; subtitle เป็นบทอ่านสำหรับ Silent Draft ไม่ได้ sync กับเสียง.

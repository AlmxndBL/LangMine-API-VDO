# แผน EP03 v4.2 — Chat API

สถานะ: ผลิต Silent Draft เพื่อรีวิวภายในวันที่ 9 พฤศจิกายน 2026  
ผู้ชม: ผู้ใช้ทั่วไปที่สนใจเชื่อม Chat API โดยอธิบายศัพท์ให้เข้าใจง่าย  
รูปแบบ: แนวตั้ง 1080×1920, 30 fps, ภาษาไทย, มีซับฝังในภาพ, ไม่มีเสียงพากย์/ดนตรีในร่างนี้

## เป้าหมายคนดู

หลังดูจบ คนดูอธิบายได้ว่าแชทที่เห็นเชื่อมกับ Agent ผ่าน Chat API อย่างไร ต้องเตรียมอะไร ส่งข้อความแบบ SSE อย่างไร และนำ `conversation_id` ไปใช้ถามต่ออย่างไร

## ขอบเขตเนื้อหา

1. แชทใน LangMind จากมุมผู้ใช้ทั่วไป
2. ภาพรวม **Chat API เท่านั้น** และบทบาทของแอป/ระบบหลังบ้าน/Agent
3. ตัวอย่าง `POST /api/chat/message` แบบ SSE โดยใช้ `agent_id` ที่ผู้ชมเตรียมไว้ และตัวอย่างการถามต่อ

ใช้เหตุการณ์ตัวอย่างเดียวตลอดเรื่อง: ผู้ใช้ขอให้ Agent ช่วยร่างข้อความ แล้วถามให้ย่ออีกครั้ง ใช้เพื่ออธิบายบริบทของบทสนทนาเท่านั้น ไม่ใช่คำตอบจาก API จริง

## หลักฐานและขอบเขตการกล่าวอ้าง

- **documented:** รายการ route, scope `chat:invoke`, request fields, SSE event names/order, การเริ่มบทสนทนาใหม่ด้วย `conversation_id: null`, การใช้ conversation ID เดิมเมื่อถามต่อ และพฤติกรรม endpoint อื่น อ้างอิง [langmind-api.md](../../../langmind-api.md) ส่วน Chat API
- **illustrative:** หน้าจอแชทและบทสนทนาตัวอย่างเป็นภาพที่สร้างขึ้นสำหรับคลิป ไม่ใช่หน้า LangMind จริงหรือผลจาก live API
- **observed:** การทำงานของ Catalog ดูตามบันทึก [CATALOG_USAGE_MAP.md](../../../docs/CATALOG_USAGE_MAP.md) ลงวันที่ 6 พ.ย. 2026; เป็นการดู preview ของ Catalog ไม่ได้ยืนยันว่าบล็อกถูกติดตั้งหรือ render ในโปรเจกต์นี้
- **unknown:** เวลา latency, token, ค่าใช้จ่าย, citation และคำตอบจาก Agent จริง จึงไม่นำตัวเลขสมมติมาแสดง

## โครง 9 Beat

| Beat | หน้าที่ต่อเรื่อง | ภาพ/การกระทำหลัก | ข้อความที่ต้องเห็น | หลักฐาน |
|---|---|---|---|---|
| B1 · จากแชทที่คุ้นเคย | ตั้งคำถามว่าแชทถามต่อได้อย่างไร | ภาพจำลองสองสถานะ: ขอร่าง → ขอให้สั้นลง | “คุยต่อในเรื่องเดิม” | illustrative |
| B2 · สิ่งที่อยู่หลังแชท | แยกหน้าที่หน้าจอออกจากทางเชื่อม | เส้นทางแอป → backend → Chat API → Agent แล้วผลกลับ | “API เชื่อมระบบ; แอปแสดงผล” | documented + diagram |
| B3 · เตรียมก่อนเชื่อม | ทำให้รู้ว่าต้องมีอะไร | Agent ที่ publish แล้ว, `agent_id`, Key `chat:invoke` อยู่ server | Key ไม่อยู่ใน client | documented |
| B4 · ส่งคำถามแรก | แสดง call หลักที่ต้องใช้ | route ปรากฏก่อน แล้ว payload ค่อยเผยทีละส่วน | `POST /api/chat/message`, `conversation_id: null` | documented + illustrative payload |
| B5 · อ่าน SSE ให้จบ | อธิบาย stream โดยไม่แสร้งเป็นผลจริง | ชิป event ต่อเป็นลำดับ แล้วเน้น `message_end` | `message_start` → `message` → `citations` (ถ้ามี) → `message_end` | documented; ไม่มีค่าจำลอง |
| B6 · ถามต่อในห้องเดิม | ปิดวงเหตุการณ์ที่เริ่มจาก B1 | ID จาก event ไหลกลับเข้า request ถัดไป | ใช้ `conversation_id` เดิม; `null` ใช้เริ่มใหม่ | documented + diagram |
| B7 · เส้นทาง Chat API อื่น | ให้ภาพรวมครบโดยไม่ไล่ทุก payload | แบ่ง route เป็นส่ง/ควบคุม, ประวัติ, feedback/ไฟล์ | `chat:invoke`; route `/conversations` ใช้ `agent_id`; DELETE ลบถาวร | documented |
| B8 · สรุปลำดับใช้งาน | ทวน workflow เป็นภาพเดียว | Key ที่ server → ส่ง → อ่านจนจบ → เก็บ ID | API ส่งข้อมูลกลับ; แอปจัดการการแสดงผล | documented + implementation responsibility |
| B9 · ปิดเรื่อง | ให้ทางไปอ่าน API ต่อ | โลโก้จริงบนพื้นอ่อน และ URL | `langmind.in.th` | brand asset |

## จังหวะและเวลา

- ใช้เวลาแบบร่างจากความยาวบทที่ `chars_per_second: 11` บวกช่วงหายใจ 0.35 วินาทีต่อข้อความ; ยังไม่ใช่ timing ที่ sync กับเสียงพากย์
- จำนวน/ระยะช็อตเป็นผลจากเนื้อหา ไม่ล็อกจาก v4.1; ภาพเปลี่ยนเฉพาะเมื่อมีการเผยข้อมูลหรือเปลี่ยนสถานะ
- แถบซับสีเขียวเข้มอยู่คงที่และมีพื้นที่ว่างพออ่าน ไม่ย่อฟอนต์เพื่อบรรจุประโยคยาว

## Catalog ที่เลือกและข้อจำกัด

- **HF-118 Code Typing (Block):** ใช้เป็นแบบอ้างอิงสำหรับเปิด payload ทีละ token/ขยับ caret ใน B4; preview ในทะเบียนเดิมสังเกตช่วงประมาณ 0:01 และ 0:04
- **HF-196 Code Terminal Run (Component):** ใช้เป็นแบบอ้างอิงสำหรับให้ event/ผลลัพธ์ปรากฏตาม cue ใน B5; preview ในทะเบียนเดิมสังเกต prompt ว่างที่ 0:00 และบรรทัด output หลายบรรทัดที่ราว 0:04
- ในสภาพแวดล้อมนี้ `hyperframes` เรียก `volta` ไม่สำเร็จสองครั้ง จึงไม่สามารถเพิ่ม source block ผ่าน CLI หรือเปิด browser preview ตรวจ composition ได้ตาม `.agents/skills/hyperframes-registry/SKILL.md` และ `.agents/skills/hyperframes-cli/SKILL.md`
- เพื่อให้ได้ MP4 ตรวจภาพได้ในงานนี้ ทำ fallback renderer ใน Python ให้เผย payload และ event เป็นสถานะต่อเนื่องตามหน้าที่ Catalog; **ไม่อ้างว่าเป็น HyperFrames block ที่ติดตั้งหรือ render จริง**. หากต้องการ source Catalog แบบตรงตัว ต้องแก้ PATH/รัน CLI ใน environment ที่มองเห็น Volta แล้วตรวจซ้ำ

## ประตูตรวจ

1. ความถูกต้อง: เทียบ route, field, scope, ลำดับ SSE กับ API snapshot
2. ภาพ/ข้อความ: ตรวจ screenshot จริงและ contact sheet ที่ขนาดเต็ม
3. เทคนิค: ตรวจ MP4 codec, มิติ, fps, duration, stream เสียง และ SHA-256
4. ข้อจำกัด: ยังไม่ตรวจ HyperFrames native preview, ไม่ใช่คำบรรยายที่ sync กับเสียงจริง และยังไม่ผ่านการรับรองเนื้อหาจากผู้ใช้

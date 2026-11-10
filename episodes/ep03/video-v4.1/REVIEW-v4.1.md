# EP03 Animatic v4.1 — Review record

Revision date: 9 พฤศจิกายน 2026<br>
Scope: Chat API (v4.1) modeled directly on `ep04-v3-orus.mp4` visual language and architecture; scripts, explanatory diagrams, code panels, silent MP4 export, and visual quality review. No user acceptance is inferred.

## 1. สรุปภาพและเนื้อหา

- **Observed in export:** วิดีโอแนวตั้ง 1080×1920 ความยาว 133.167 วินาที (3,995 frames @ 30fps) มี 10 beats (25 visual stages) ปรากฏเส้นบรรทัดสมุดโน้ต Soft Cream `#f8f4e9`, Kicker `EP03 / CHAT API` พร้อมขีดเส้นใต้สีเขียวเอียง -3 องศา, ป้าย `ภาพจำลอง`, แถบสถานะความคืบหน้า (Spine 3 ขั้น), กรอบโทรศัพท์มือถือแสดงแชทเสมือนจริง, แผนภาพสถาปัตยกรรมพร้อมลูกศรชี้ทิศทาง, การ์ดแสดงกลุ่ม API 3 หมวด, กล่องโค้ดสไตล์ Dark Theme `#1f2a25` พร้อมแถบเน้นคำสั่ง และกล่องซับไตเติลกลางขอบล่างของหน้าจอ
- **Documented:**
  - Chat API scope คือ `chat:invoke`
  - `POST /api/chat/message` ใช้ Server-Sent Events (SSE)
  - `POST /api/chat/message/blocking` ส่ง JSON เต็มก้อนเดียว
  - `POST /api/chat/preview` รองรับ Builder ช่องทาง Web
  - `POST /api/chat/messages/{id}/stop` สั่งหยุดการสตรีม
  - การจัดการประวัติ (GET conversations, {id}, messages, PATCH, DELETE) ต้องส่ง `agent_id`
  - `DELETE /api/chat/conversations/{id}` เป็นการลบถาวร
  - `POST /api/chat/messages/{id}/feedback` รับค่า `1` หรือ `-1`
  - `GET /api/chat/messages/{id}/generated-files/{file_id}` ดาวน์โหลดไฟล์ที่ Agent สร้าง
  - SSE stream เริ่มจาก `message_start` → `message` (chunks) → `citations` (ถ้ามี) → `message_end`
  - เริ่มใหม่ส่ง `"conversation_id": null`; ถามต่อส่ง `conversation_id` เดิม
  - API Key ต้องเก็บฝั่ง Server Backend เท่านั้น
- **Illustrative:**
  - การขอให้ร่างข้อความเลื่อนประชุม 15:00 น. และการขอให้สั้นลง
  - ภาพหน้าจอโทรศัพท์แชทที่ระบุ `ภาพจำลอง`
  - รหัสจำลอง `LM_TOKEN`, `<AGENT_ID>`, `conv_123`, `msg_01`
- **Unknown:**
  - Latency จริงในการสตรีมผ่านเครือข่าย
  - เสียงพากย์จริงและการ sync timing คำต่อคำ (รอผู้ใช้จัดทำเสียงในขั้นตอนต่อไป)
- **Audio/subtitles:**
  - ไม่มีสตรีมเสียง (`streams: []`), วิดีโอเงียบ (Silent Animatic)
  - ซับไตเติลร่างฝังในภาพตามจังหวะแต่ละสเตจ

## 2. Technical evidence

| รายการ | คำสั่ง / หลักฐาน | ผลลัพธ์ |
|---|---|---|
| สร้างภาพและเรนเดอร์ MP4 | `python render_v4_1.py` | Exit code 0; 25 stages; 133.167s; silent |
| ตรวจสอบมิติและเฟรมวิดีโอ | `ffprobe -v error -select_streams v:0 -show_entries stream=width,height,avg_frame_rate,duration,nb_frames -show_entries format=duration,size -of json renders/ep03-v4.1.mp4` | 1080×1920, 30/1 fps, 133.166667s, 3,995 frames, size 2,971,054 bytes |
| ตรวจสอบระบบเสียง | `ffprobe -v error -select_streams a:0 -show_entries stream=codec_name -of json renders/ep03-v4.1.mp4` | ไม่มีสตรีมเสียง (`streams: []`) ตามเงื่อนไข "ยังไม่ต้องทำเสียง" |
| ไวยากรณ์ Build script | `node --check build.mjs` | Exit code 0 (ผ่าน) |
| รันตัวสร้าง HyperFrames | `node build.mjs` | สร้าง `index.html` และ `VOICE-SCRIPT.md` สำเร็จ ความยาวคำนวณได้ ~143.47s |
| SHA-256 ของไฟล์วิดีโอ | `Get-FileHash renders/ep03-v4.1.mp4 -Algorithm SHA256` | `148C9D2E13B5FE416F2F61FBEEDA386B83970AC4BCB9B92211E9090503017D5B` |

## 3. การสอดคล้องกับ Reference (EP04 v3 Orus)

- **สไตล์ภาพ (Visual Language):** ใช้พื้นลายสมุดโน้ตเส้นขนาน `#f8f4e9`, การ์ดสีครีมเงาสีเขียว `#a2b78d`, ฟอนต์ Sarabun-Bold/Regular และระบบสีหลักเดียวกัน (`#38815A`, `#8d732c`, `#1E7578`)
- **การจัดฉาก (Staging):** มี Kicker, Note, Heading ที่มีเลขข้อในวงกลมทึบ, Spine บอกสถานะ 3 ขั้นตอน (`1 เข้าใจ`, `2 รู้จัก API`, `3 ลองส่ง`) และแถบ Minimap นำสายตา
- **สถาปัตยกรรมโค้ด (Code Architecture):** ใช้ `timing.json` + `build.mjs` + `style.css` + `motion.js` -> `index.html` + `VOICE-SCRIPT.md` แบบเดียวกับ EP04 v3 Orus ทุกประการ

## 4. สถานะและขั้นตอนถัดไป

- ส่งมอบงาน v4.1 เรียบร้อย:
  - วิดีโอหลัก: [ep03-v4.1.mp4](renders/ep03-v4.1.mp4)
  - แผ่นภาพตรวจสายตา: [contact-sheet.png](renders/final-review-v4.1/contact-sheet.png)
  - HyperFrames Source: [index.html](index.html), [style.css](style.css), [motion.js](motion.js), [build.mjs](build.mjs)
  - สคริปต์พากย์เสียง: [VOICE-SCRIPT.md](VOICE-SCRIPT.md)
  - เอกสารกำกับสินทรัพย์: [ASSETS-v4.1.md](ASSETS-v4.1.md), [timing.json](timing.json)
- ขั้นตอนถัดไปเมื่อต้องการทำเสียง:
  - นำ [VOICE-SCRIPT.md](VOICE-SCRIPT.md) ไปบันทึกเสียงพากย์ใน `assets/voice/b1.wav` ถึง `b10.wav`
  - รัน `node build.mjs` และเรนเดอร์เสียงเต็มรูปแบบ

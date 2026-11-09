# EP02 r10 (สไตล์ EP04 video-v3) — ผลตรวจและการวิเคราะห์เปรียบเทียบ

วันที่: 9 พฤศจิกายน 2026 (Asia/Bangkok)
ไฟล์วิดีโอ:
- ฉบับความเร็วปกติ `1.0x` (`440.000000 วินาที` / `7:20 นาที`): [ep02-r10-ep04-style.mp4](ep02-r10-ep04-style.mp4)
- ฉบับเร่งความเร็ว `1.25x` (`352.000000 วินาที` / `5:52 นาที` ตามแนว `voice-r10`): [ep02-r10-125x-ep04-style.mp4](ep02-r10-125x-ep04-style.mp4)
- รุ่นก่อนหน้า (ใช้เสียงเดิม 310.43s): [ep02-ep04-style.mp4](ep02-ep04-style.mp4)

หลักฐานภาพนิ่ง (21 เฟรม + เฟรมจาก MP4 จริง):
- [contact-sheet-1.jpg](evidence/snapshots-r10/contact-sheet-1.jpg) · [contact-sheet-2.jpg](evidence/snapshots-r10/contact-sheet-2.jpg) · [contact-sheet-3.jpg](evidence/snapshots-r10/contact-sheet-3.jpg)
- [snapshots-r10-fix/contact-sheet.jpg](evidence/snapshots-r10-fix/contact-sheet.jpg)
- [mp4-r10-contact-sheet.jpg](evidence/mp4-r10-contact-sheet.jpg)

> ภาพหน้าจอแอป โค้ด และผลตอบกลับในคลิปเป็น **ภาพจำลอง (illustrative)** เพื่ออธิบายลำดับการเชื่อมต่อ ไม่ได้เรียกใช้งาน LangMind API จริงขณะเรนเดอร์

---

## 1. การผสานเนื้อหาและเสียง `r10` เข้ากับงานภาพและการเคลื่อนไหวแบบ `EP04 (video-v3)`

1. **เสียงพากย์และจังหวะเวลา (Voice & Timing จาก `voice-r10/assets`)**
   - ใช้ไฟล์เสียง Kore TTS ชุด `B01.wav`–`B16.wav` จาก [video-continuity-r10/voice-r10/assets](../video-continuity-r10/voice-r10/assets/) ครบทั้ง 16 ไฟล์
   - ยึดจุดเริ่มแต่ละ beat ตาม `vo-map-cues.json` ของ `r10` (`0, 18, 40, 68, 96, 136, 172, 198, 234, 264, 292, 316, 354, 372, 396, 420` วินาที รวม `440 วินาที`) พร้อมฝัง 16 chapters ตรงจังหวะ

2. **โครงเรื่องและเนื้อหา `r10` ในระบบภาพ `EP04`**
   - **`B01`–`B02` (ปริศนาเปิดเรื่อง → ย้อนดูข้อความแรก)**: เริ่มจากเห็นคำว่า *"ขอสั้นลงสำหรับส่งใน LINE"* ใน `R01.png` แล้วตั้งคำถาม *"พิมพ์ว่า 'ขอสั้นลง' แชทรู้ได้อย่างไรว่าหมายถึงข้อความไหน? ต้องส่งเรื่องเดิมใหม่ หรือมีตัวเชื่อม?"* ก่อนย้อนกลับไปดูข้อความแรก (`R02-composer.png`) ของทีมร้านค้า
   - **`B03` (ผัง 3 ส่วน)**: หน้าเว็บของเรา (ไม่ถือ Key เอง) ⇄ `server ของแอป` (รับข้อความ · เก็บ Key) ⇄ `LangMind Agent`
   - **`B04`–`B06` (`1 เตรียม` — สีเขียว `#38815A`)**: แยกหน้าที่ของ `Agent ID` (เลือกผู้ช่วย) กับ `API key` (ยืนยันสิทธิ์) และย้ำว่าคนละตัวกับรหัสบทสนทนาตอนถามต่อ (`B04`), ภาพขั้นตอนสร้าง key ชื่อ/อายุ/สิทธิ์ `chat:invoke` (`B05`), และการเก็บ `LANGMIND_API_KEY` + `LANGMIND_AGENT_ID` (คัดลอกหลัง `/agents/`) ใน `.env` อ่านผ่าน `process.env` (`B06`)
   - **`B07`–`B10` (`2 เชื่อม` — สีเหลืองทอง `#8d732c`)**: ใช้ `.minimap` + `.panel` ของ EP04 ไล่ตั้งแต่กดส่งข้อความแรกไป `/api/chat` (`B07`), แกะกล่อง `POST /api/chat/message/blocking` พร้อมหมายเหตุว่าตัวอย่างนี้ไม่ส่ง `user_id` (`B08`), โค้ด `fetch` และตรวจ `!response.ok` (`B09`), จนถึงรับ `answer` + เก็บ `conversation_id: "conv_demo_01"` คู่กับเจ้าของบนป้าย `.srv-tag` (`server · รหัสบทสนทนา / conv_demo_01`) แล้วสลับเข้าหน้าจอแชท `R03-success.png` (`B10`)
   - **`B11`–`B14` (`3 ใช้ผล` — สีเขียวอมฟ้า `#1E7578`)**: สลับสถานะ `R02-pending.png` → `R04-error.png` → `R01.png` พร้อมป้าย `conv_demo_01` (`B11`), เฉลยปริศนา *"ขอสั้นลง ต้องเปลี่ยนอะไร เก็บอะไรไว้?"* ด้วยการเปลี่ยน `query` แต่คง `conversation_id: "conv_demo_01"` เดิมพร้อมตรวจเจ้าของบทสนทนา แล้วสลับเข้า `R05-pending.png` → `R05-answer.png` (`B12`), เทียบโหมดรอคำตอบครบ vs รับข้อมูลเป็นช่วง (`B13`), และเทียบจอมือถือ `R06-mobile.png` คู่กับจอใหญ่ `R06-desktop.png` (`B14`)
   - **`B15`–`B16` (ทวนวงจร 3 ค่าสำคัญ → ตาคุณลองแล้ว)**: การ์ดสรุป `.recap` ทวนจากข้อความเดียว แยก 3 ค่า (`Agent ID`, `API key`, `conversation_id`) และซีนปิดโลโก้ LangMind + `https://langmind.in.th`

---

## 2. ผลตรวจทางเทคนิคและภาพ (Observed)

| รายการตรวจ | คำสั่ง / วิธีตรวจ | ผลลัพธ์ (Observed) |
|---|---|---|
| Layout / Lint / Contrast / Audio Check | `npx hyperframes check --json --no-craft --no-cache` | `ok: true` · `lint: 0 errors` · `runtime: 0 errors` · `layout: 0 errors, 0 warnings, 0 info` · `contrast: 96/96 passed` · `audio: 0 errors` |
| Snapshot Inspection (21 เฟรม + 3 เฟรมแก้จุดชิดขอบ) | `npx hyperframes snapshot` + เปิดดูภาพจริง | ทุกซีน `B01`–`B16` แสดงครบ ไม่ทับกัน ป้าย `server · รหัสบทสนทนา / conv_demo_01` แสดงชัดเจนใน `B10`–`B15` |
| Render MP4 (`1.0x` · 440s) | `ep02-r10-ep04-style.mp4` | `1080×1920` `30fps` `440.000000s` (`13,200 frames`) · H.264 + AAC 48kHz stereo · 16 chapters · `51,004,706 bytes` · SHA-256 `6AB79F6CCCEE37AE210A863775B129CDEDB7F1659FA570FDE6BA18271715D64B` |
| Render MP4 (`1.25x` · 352s) | `ep02-r10-125x-ep04-style.mp4` | `1080×1920` `30fps` `352.000000s` (`10,560 frames`) · H.264 + AAC 48kHz stereo · 16 chapters · SHA-256 `1355D2792F755549564890B581C342066AF645315EE2761245B8F4B9D66547E0` |
| Full Decode Verification | `ffmpeg -v error -i <file> -f null -` | `0 errors` ทั้งไฟล์ `1.0x` และ `1.25x` |
| คู่มือต้นฉบับ `langmind-api.md` | `Get-FileHash -Algorithm SHA256 langmind-api.md` | `DDDBE02F30EC0215E98CB515A3D3374A85F754298163ED84F21FACC6E9164A2C` (ไม่ถูกแก้ไข) |

---

## 3. ขอบเขตที่ยังไม่ตรวจ (Pending User Review)
- รอผู้ใช้เปิดชมไฟล์ [ep02-r10-ep04-style.mp4](ep02-r10-ep04-style.mp4) (ความเร็วปกติ `1.0x` ยาว `7:20 นาที`) หรือ [ep02-r10-125x-ep04-style.mp4](ep02-r10-125x-ep04-style.mp4) (ความเร็ว `1.25x` ยาว `5:52 นาที`) เพื่อเลือกความเร็วและตรวจรับขั้นสุดท้าย

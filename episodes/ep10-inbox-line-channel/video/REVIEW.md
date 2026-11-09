# EP10 — ผลตรวจและสถานะวิดีโอ (Inbox API & LINE Channel)

วันที่: 9 พฤศจิกายน 2026 (Asia/Bangkok) · ไฟล์: [ep10-inbox-line-channel-silent.mp4](ep10-inbox-line-channel-silent.mp4)  
อ้างอิง: [PLAN.md](../PLAN.md), [SCRIPT.md](../SCRIPT.md), [STORYBOARD.md](../STORYBOARD.md), [SILENT-TIMING.md](SILENT-TIMING.md)

ภาพหน้าจอแอป โค้ด และคำตอบเป็น **ภาพจำลอง** ไม่ได้เรียก LangMind API จริง

---

## 1. สถานะเสียงและไทม์ไลน์ (Voice & Timing)

- ฉบับนี้เป็น **วิดีโอแบบไม่มีเสียง (Silent Timeline)** ตามคำสั่ง "ยังไม่ต้องทำเสียง"
- คำนวณความยาวจากตัวอักษรของบทบรรยายภาษาพูด (อัตรา 11 ตัวอักษร/วินาที + gap 0.35 s)
- เพิ่ม `"hold": 2.5` ให้ beat b4, b5, b6 เพื่อให้โค้ดและข้อมูล JSON/สถานะในจอนิ่งนานพออ่าน
- ความยาวรวม: **216.93 วินาที** (3 นาที 36 วินาที, 6,508 เฟรม ที่ 30 fps)
- หากสร้างไฟล์เสียงจริงในอนาคต ให้นำไฟล์เสียงมาวางที่ `assets/voice/<beat>.wav` แล้วรัน `node build.mjs` เพื่อ snap จังหวะตัดซับไตเติลให้ตรงกับเสียงจริง

---

## 2. Technical Gates (observed)

| หัวข้อตรวจ | ผลการตรวจ | รายละเอียด |
|---|---|---|
| `npx hyperframes check` | **PASSED** (0 errors, 0 warnings) | Runtime 0 errors, Layout 0 issues across 9 samples |
| Contrast | **PASSED** | 76/76 text checks pass WCAG AA |
| Code Marks | **PASSED** | ไฮไลต์โค้ดและข้อความกุญแจสำคัญเคลื่อนไหวตามจังหวะบทพูด |
| Render Engine | **PASSED** | H.264 1080×1920 30 fps, 6,508 เฟรม |
| File Output | **PASSED** | `ep10-inbox-line-channel-silent.mp4` |

---

## 3. Visual & Storytelling Gates (observed)

- **โครงเรื่อง 9 Beats ครบถ้วน (`b1–b9`)**:
  - `b1`: เกริ่นนำโจทย์แชท LINE ในระบบเรา + หน้าจอจำลองมือถือ + คำถาม 3 ข้อ + Robot `03-wave-chest.png`
  - `b2`: แผนผังภาพรวม 3 ส่วน (LINE แชท ⇄ LangMind Inbox ⇄ หลังบ้าน) แสดง 3 ขั้นตอนอ่านข้อมูล
  - `b3`: สิ่งที่ต้องเตรียม 3 ข้อ (Agent เปิด LINE, API Key สิทธิ์ `inbox:read`, หลังบ้านเก็บ Key)
  - `b4`: เชื่อมครั้งที่ 1: รายการเธรด `GET .../inbox/threads?channel=line` + ไฮไลต์ `channel_counts` + Robot `05-point-up.png`
  - `b5`: เชื่อมครั้งที่ 2: เช็กสถานะรับสาย `GET .../handover` + ไฮไลต์ `active: true` (`expires_in_sec: 1420`) + Robot `12-clipboard.png`
  - `b6`: เชื่อมครั้งที่ 3: Export ประวัติ `GET .../export?format=xlsx` + ดาวน์โหลดไฟล์ Excel ไบนารี
  - `b7`: เอาผลไปใช้: มอนิเตอร์หลังบ้าน, ดึงข้อความในเธรด (`/messages`), ขอบเขตความปลอดภัย (API Key อ่านอย่างเดียว ตอบกลับ/Handover ผ่านเว็บ)
  - `b8`: สรุป 3 กล่อง (เตรียม → เชื่อม 3 จุด → ใช้ผล) + Robot `10-thumbs-up.png`
  - `b9`: การ์ดผู้สนับสนุน LangMind (`langmind.in.th`) ปิดท้าย ซ่อน spine และ note ภาพจำลอง
- **ข้อกำหนด Typography และความปลอดภัย**:
  - ฟอนต์ Sarabun หัวเรื่อง 60px, ซับไตเติล 42px กึ่งกลางกรอบ y=1572px อยู่ใน Safe Zone
  - ติดป้าย "ภาพจำลอง" ตลอดคลิปตามกฎระเบียบ ยกเว้นฉากสปอนเซอร์ b9

---

## 4. สิ่งที่ต้องตรวจเมื่อเพิ่มเสียงในอนาคต

1. การออกเสียงคำเฉพาะ: `Inbox API`, `LINE Channel`, `Handover`, `active: true`, `expires_in_sec`, `XLSX`, `CSV`, `inbox:read`
2. ความเป็นธรรมชาติของจังหวะเว้นวรรคระหว่างประโยคในแต่ละ Beat

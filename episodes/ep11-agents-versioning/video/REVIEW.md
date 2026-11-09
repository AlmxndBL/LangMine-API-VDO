# EP11 — ผลตรวจและสถานะวิดีโอ (Agents & Versioning API)

วันที่: 9 พฤศจิกายน 2026 (Asia/Bangkok) · ไฟล์: [ep11-agents-versioning-silent.mp4](ep11-agents-versioning-silent.mp4)  
อ้างอิง: [PLAN.md](../PLAN.md), [SCRIPT.md](../SCRIPT.md), [STORYBOARD.md](../STORYBOARD.md), [SILENT-TIMING.md](SILENT-TIMING.md)

ภาพหน้าจอแอป โค้ด และคำตอบเป็น **ภาพจำลอง** ไม่ได้เรียก LangMind API จริง

---

## 1. สถานะเสียงและไทม์ไลน์ (Voice & Timing)

- ฉบับนี้เป็น **วิดีโอแบบไม่มีเสียง (Silent Timeline)** ตามคำสั่ง "ยังไม่ต้องทำเสียง"
- คำนวณความยาวจากตัวอักษรของบทบรรยายภาษาพูด (อัตรา 11 ตัวอักษร/วินาที + gap 0.35 s)
- เพิ่ม `"hold": 2.5` ให้ beat b4, b5, b6 เพื่อให้โค้ดและข้อมูล JSON/สถานะในจอนิ่งนานพออ่าน
- ความยาวรวม: **233.13 วินาที** (3 นาที 53 วินาที, 6,994 เฟรม ที่ 30 fps)
- หากสร้างไฟล์เสียงจริงในอนาคต ให้นำไฟล์เสียงมาวางที่ `assets/voice/<beat>.wav` แล้วรัน `node build.mjs` เพื่อ snap จังหวะตัดซับไตเติลให้ตรงกับเสียงจริง

---

## 2. Technical Gates (observed)

| หัวข้อตรวจ | ผลการตรวจ | รายละเอียด |
|---|---|---|
| `npx hyperframes check` | **PASSED** (0 errors, 0 warnings) | Runtime 0 errors, Layout 0 issues across 9 samples |
| Contrast | **PASSED** | 105/105 text checks pass WCAG AA |
| Code Marks | **PASSED** | ไฮไลต์โค้ดและข้อความกุญแจสำคัญเคลื่อนไหวตามจังหวะบทพูด |
| Render Engine | **PASSED** | H.264 1080×1920 30 fps, 6,994 เฟรม |
| File Output | **PASSED** | `ep11-agents-versioning-silent.mp4` |

---

## 3. Visual & Storytelling Gates (observed)

- **โครงเรื่อง 9 Beats ครบถ้วน (`b1–b9`)**:
  - `b1`: จัดการเวอร์ชัน Agent (ปรับ Prompt, แยก Draft, Rollback) + หน้าจอจำลองมือถือ + คำถาม 3 ข้อ + Robot `06-thinking.png`
  - `b2`: แผนผังภาพรวม 3 ส่วน (สคริปต์/หลังบ้าน ⇄ Agents API ⇄ ลูกค้าจริง) แยก Published v1 ออกจาก Draft v2
  - `b3`: สิ่งที่ต้องเตรียม 3 ข้อ (LLM Credential บนเว็บ, API Key สิทธิ์ `agents:read` + `agents:write`, หลังบ้าน/CI-CD)
  - `b4`: เชื่อมครั้งที่ 1: เช็กโมเดล `GET .../providers/models` แล้วสร้าง Agent `POST /api/agents` (Publish v1 อัตโนมัติ) + Robot `05-point-up.png`
  - `b5`: เชื่อมครั้งที่ 2: บันทึกฉบับร่าง `POST .../versions` ระบุ `publish: false` และ `note` โดยไม่กระทบผู้ใช้จริง
  - `b6`: เชื่อมครั้งที่ 3: สั่งเปิดใช้งานจริง `POST .../publish` หรือย้อนกลับ `POST .../rollback` ในคำสั่งเดียว + Robot `10-thumbs-up.png`
  - `b7`: เอาผลไปใช้: `PATCH` แก้ metadata vs `/versions` แก้ Prompt/Model, คำสั่ง `duplicate` โคลน Agent, ผูกทรัพยากรด้วย `PUT`
  - `b8`: สรุป 3 กล่อง (เตรียม → เชื่อม 3 ขั้น → ใช้ผล) + Robot `04-open-arms.png`
  - `b9`: การ์ดผู้สนับสนุน LangMind (`langmind.in.th`) ปิดท้าย ซ่อน spine และ note ภาพจำลอง
- **ข้อกำหนด Typography และความปลอดภัย**:
  - ฟอนต์ Sarabun หัวเรื่อง 60px, ซับไตเติล 42px กึ่งกลางกรอบ y=1572px อยู่ใน Safe Zone
  - ติดป้าย "ภาพจำลอง" ตลอดคลิปตามกฎระเบียบ ยกเว้นฉากสปอนเซอร์ b9

---

## 4. สิ่งที่ต้องตรวจเมื่อเพิ่มเสียงในอนาคต

1. การออกเสียงคำเฉพาะ: `Agents API`, `Versioning`, `Draft`, `Publish`, `Rollback`, `OpenRouter`, `Gemma`, `Temperature`, `Max Tokens`, `agents:read`, `agents:write`
2. ความเป็นธรรมชาติของจังหวะเว้นวรรคระหว่างประโยคในแต่ละ Beat

# EP11 — Storyboard และแบบกำหนดหน้าจอ (Agents & Versioning API)

เอกสารอ้างอิง: [PLAN](PLAN.md), [SCRIPT](SCRIPT.md), [CATALOG](CATALOG.md), และ [STORYBOARD_GUIDELINES](../../docs/STORYBOARD_GUIDELINES.md)  
สถานะ: แผน W4 พร้อมสำหรับเริ่มสร้าง Sample (W5) และการผลิต (W6)

---

## 1. แนวภาพและระบบการแสดงผล (Visual System)

* **สไตล์หลัก**: Editorial Paper & Sage Ink
* **สัดส่วนและขนาด**: 9:16 (1080×1920 พิกเซล, 30 fps)
* **ชุดสี (Palette)**: พื้นหลัง `#F5F1E7`, หมึกเข้ม `#202824`, สีเน้นเวอร์ชันที่เผยแพร่แล้ว (`Published`) `#38815A`, สีเน้นฉบับร่างและการสลับรุ่น (`Draft / Rollback`) `#1E7578`
* **ระบบตัวอักษร**: ฟอนต์ Sarabun (หัวเรื่อง 64–72px, ป้ายกำกับ 40–48px, ซับไตเติล 44–48px กึ่งกลางกรอบ y=1540–1720px)
* **พื้นที่ปลอดภัย (Safe Area)**: x=108–972, y=192–1500

---

## 2. รายละเอียด Storyboard ราย Beat (`b1–b9`)

| Beat / เวลาประมาณ | สงสัยก่อน → เข้าใจหลัง | ภาพเริ่ม → การเคลื่อนไหว → ภาพจบ | บทพากย์และข้อความเน้น | Assets / Catalog / Robot |
|---|---|---|---|---|
| **b1** (14–16s) | แก้ Prompt ยังไงไม่ให้กระทบลูกค้าที่คุยอยู่ และถ้าพลาดจะย้อนกลับยังไง? → ใช้ระบบ Versioning ของ Agents API | หน้าจอ `APP-AGENT-DRAFT` เด่นกลางจอ แสดง `Published v1` คู่กับ `Draft v2` → ถอยออกมาตั้ง 3 คำถามหลัก | **บท**: เวลาที่เรามี Agent ใช้งานจริงอยู่ แล้วอยากปรับปรุง Prompt... ต้องเตรียมอะไร เชื่อมตรงไหน และเอาผลไปใช้ยังไง มาดูกันครับ<br>**ข้อความ**: "สร้าง ปรับรุ่น & Rollback Agent ผ่าน API" | • `Browser Device Stage` (`#hf-195`)<br>• ภาพ `APP-AGENT-DRAFT`<br>• Robot `06-thinking.png` |
| **b2** (14–16s) | ภาพรวมจัดการรุ่นยังไง? → แยก `Published` กับ `Draft` ผ่าน 3 ขั้นตอน | แผนผัง 3 ขั้น: 1.ดูโมเดลและสร้าง Agent (v1) → 2.บันทึกร่างใหม่ (`versions` v2) → 3.สั่ง `publish` หรือ `rollback` | **บท**: ภาพรวมคือการแยกเวอร์ชันที่ใช้งานจริงออกจากฉบับร่าง... เรียก Agents API สามขั้นตอนหลัก<br>**ข้อความ**: "1.สร้าง Agent → 2.บันทึกร่าง (`versions`) → 3.`publish` / `rollback`" | • `Flowchart Vertical` (`#hf-409`)<br>• ไม่ใช้ Robot |
| **b3** (14–16s) | ต้องเตรียมอะไรบ้าง? → ตั้งค่า Credential บนเว็บ + Key (`agents:read`, `agents:write`) + หลังบ้าน | การ์ดเช็กลิสต์ 3 ข้อ พร้อมไฮไลต์สิทธิ์ `agents:read` และ `agents:write` | **บท**: เริ่มจากสิ่งที่ต้องเตรียม... ตั้งค่า Credential บนเว็บ, API Key สิทธิ์ agents read และ write และระบบหลังบ้าน<br>**ข้อความ**: `agents:read` + `agents:write` | • `Marker Highlight` (`#hf-072`) |
| **b4** (17–19s) | ครั้งที่ 1 เช็กโมเดลและสร้าง Agent ยังไง? → `GET /providers/models` แล้ว `POST /agents` | กล่องโค้ดไฮไลต์ `provider_type: "openrouter"` และ `model_name: "google/gemma-3-27b-it"` ส่งเข้า `POST /api/agents` ได้ `published_version_no: 1` | **บท**: ครั้งที่หนึ่ง เรียก GET providers models... แล้วส่ง POST ที่ agents ระบบจะ publish เวอร์ชันที่หนึ่งให้อัตโนมัติ<br>**ข้อความ**: `GET /api/providers/models` → `POST /api/agents` (v1) | • `Code Highlight Sweep` (`#hf-113`)<br>• Robot `05-point-up.png` |
| **b5** (17–19s) | ครั้งที่ 2 บันทึกการแก้ไขเป็นฉบับร่างยังไง? → ส่ง `POST /agents/{id}/versions` (`"publish": false`) | บล็อก `Code Diff` แสดงการเพิ่ม `"temperature": 0.2, "max_tokens": 8192` คู่กับหน้าจอ `APP-AGENT-DRAFT` ที่แสดง v2 เป็นฉบับร่าง | **บท**: ครั้งที่สอง ส่ง POST ไปที่ versions พร้อมตั้งค่า publish เป็น false... บันทึกเป็นเวอร์ชันสองโดยไม่กระทบลูกค้าจริง<br>**ข้อความ**: `POST /api/agents/{id}/versions` (`"publish": false`) | • `Code Diff` (`#hf-112`)<br>• `Browser Device Stage` (`#hf-195`)<br>• ภาพ `APP-AGENT-DRAFT` |
| **b6** (17–19s) | ครั้งที่ 3 เปิดใช้งานจริงหรือย้อนกลับยังไง? → ส่ง `POST .../publish` หรือ `POST .../rollback` | หน้าจอสลับเป็น `APP-AGENT-PUBLISH` แสดง `Published: v2` และแถบ `State Chip Rail` สาธิตการกด `POST .../rollback` ย้อนกลับได้ทันที | **บท**: ครั้งที่สาม ส่ง POST ไปที่ publish เพื่อเปิดใช้ร่างล่าสุด และถ้าต้องการย้อนกลับก็ส่ง POST ไปที่ rollback ได้ทันทีโดยไม่ต้องมี body<br>**ข้อความ**: `POST .../publish` · `POST .../rollback` (ไม่ต้องมี body) | • `Browser Device Stage` (`#hf-195`)<br>• ภาพ `APP-AGENT-PUBLISH`<br>• `State Chip Rail` (`#hf-208`)<br>• Robot `10-thumbs-up.png` |
| **b7** (15–17s) | แก้ชื่อกับแก้ Prompt ใช้เส้นเดียวกันไหม? → `PATCH /agents/{id}` แก้ metadata ส่วน Prompt ต้องผ่าน `/versions` | ป้ายสรุปแยกชัดเจน: `PATCH /agents/{id}` (ชื่อ/ไอคอน/visibility) vs `/versions` (Prompt/Model) พร้อม `POST .../duplicate` และ `PUT .../datasets|tools|credential` | **บท**: ถ้าแก้เฉพาะชื่อหรือการมองเห็นใช้ PATCH agents ID แต่ถ้าแก้ Prompt หรือโมเดลต้องผ่าน versions เสมอ รวมถึงคัดลอกด้วย duplicate ได้ครับ<br>**ข้อความ**: `PATCH` = Metadata · `/versions` = Prompt/Model · `duplicate` & `PUT` bindings | • `Marker Highlight` (`#hf-072`) |
| **b8** (12–14s) | สรุปทั้งคลิป? → เตรียม Key → สร้าง · บันทึกร่าง `versions` → `publish` / `rollback` | ภาพรวมสรุป 3 ช่อง: เตรียม → เชื่อม (`agents` · `versions` · `publish/rollback`) → ใช้ผล | **บท**: สรุปครับ เตรียม Key สิทธิ์ agents read และ write เชื่อมสามขั้นตอน ช่วยให้อัปเกรด AI ได้อย่างปลอดภัยทุกครั้งครับ<br>**ข้อความ**: "เตรียม → เชื่อม 3 ขั้น → อัปเกรดและ Rollback ปลอดภัย" | • Robot `04-open-arms.png` (กลางล่าง) |
| **b9** (6–8s) | ผู้สนับสนุน? → LangMind (`langmind.in.th`) | โลโก้จริง `langmind-logo.png` กลางจอ พร้อม `langmind.in.th` | **บท**: คลิปนี้สนับสนุนโดย LangMind เริ่มสร้างและบริหารจัดการ Agent ของคุณได้ที่ LangMind ดอท อิน ดอท ทีเอช<br>**ข้อความ**: `langmind.in.th` | • `shared/assets/brand/langmind-logo.png` |

---

## 3. การเลือกฉากตัวอย่างสำหรับทำ Sample (W5)

* **ช่วงที่เลือกทำ Sample**: **`b4 – b6` (สร้าง Agent v1 → บันทึก Draft v2 ด้วย `Code Diff` → สั่ง `publish` / `rollback`)**
* **เหตุผล**: ทดสอบการทำงานร่วมกันของ `Code Diff` (`#hf-112`) กับการสลับหน้าจอ `APP-AGENT-DRAFT` และ `APP-AGENT-PUBLISH`

---

## 4. แบบกำหนดหน้าจอ Mockup ก่อนเจนรูป (Screen Specifications)

### หน้าจอ 1: `APP-AGENT-DRAFT` (สถานะมี Published v1 ใช้งานอยู่ และบันทึก Draft v2 แยกไว้)
* **ขนาดไฟล์ภาพ**: 1440×1800 พิกเซล (4:5)
* **Header** (y=0.06–0.14): `"จัดการเวอร์ชัน Agent: ผู้ช่วยฝ่ายขาย"`
* **เนื้อหาหลัก**:
  * การ์ดบน — เวอร์ชันใช้งานจริง (y=0.18–0.46):
    * ป้ายสีเขียว: `"กำลังใช้งานจริง (published_version_no: 1)"`
    * โมเดล: `"openrouter / google/gemma-3-27b-it"`
    * ค่าพารามิเตอร์: `"max_tokens: 4096 · คำสั่ง: คุณคือพนักงานขาย..."`
  * การ์ดล่าง — เวอร์ชันฉบับร่าง (y=0.50–0.80):
    * ป้ายสีฟ้าอมเขียว: `"ฉบับร่างรอตรวจ (draft version_no: 2 · publish: false)"`
    * หมายเหตุ (`note`): `"ปรับโทนคำตอบ"`
    * ค่าที่เปลี่ยน: `"temperature: 0.2 · max_tokens: 8192"`
  * ป้ายถาวร (y=0.88–0.93 มุมขวาล่าง): `"ภาพจำลอง"`

### หน้าจอ 2: `APP-AGENT-PUBLISH` (สถานะหลังสั่ง Publish เวอร์ชัน 2 และปุ่ม Rollback)
* **ขนาดไฟล์ภาพ**: 1440×1800 พิกเซล (4:5) — คง Header, โครงหน้าต่าง `#F5F1E7` และป้าย `"ภาพจำลอง"` ตรงกับ `APP-AGENT-DRAFT` ทุกพิกเซล
* **ส่วนที่เปลี่ยน**:
  * การ์ดหลัก — เวอร์ชันใช้งานจริงอัปเดตแล้ว (y=0.18–0.54):
    * ป้ายสีเขียวเด่นชัด: `"กำลังใช้งานจริง (published_version_no: 2 — อัปเดตแล้ว)"`
    * หมายเหตุ (`note`): `"ปรับโทนคำตอบ"`
    * ค่าพารามิเตอร์: `"temperature: 0.2 · max_tokens: 8192"`
  * การ์ดคำสั่งย้อนกลับด้านล่าง (y=0.58–0.82):
    * ป้ายสถานะ: `"ประวัติรุ่นก่อนหน้า: เวอร์ชัน 1 (พร้อมย้อนกลับด้วย POST /rollback)"`

---

## 5. Prompt สำหรับเจนภาพ Raster (ใช้ใน W5)

```text
[APP-AGENT-DRAFT]
A clean, minimal web version-control UI card in Thai language titled "จัดการเวอร์ชัน Agent: ผู้ช่วยฝ่ายขาย", 1440x1800 portrait 4:5 ratio. Soft warm paper background #F5F1E7, dark ink text #202824, sage green #38815A and teal #1E7578 accents. Top card shows green badge "กำลังใช้งานจริง (published_version_no: 1)", model "openrouter / google/gemma-3-27b-it", and config "max_tokens: 4096 · คำสั่ง: คุณคือพนักงานขาย...". Bottom card shows teal badge "ฉบับร่างรอตรวจ (draft version_no: 2 · publish: false)", note "ปรับโทนคำตอบ", and config "temperature: 0.2 · max_tokens: 8192". Small subtle tag at bottom right reading "ภาพจำลอง".

[APP-AGENT-PUBLISH]
Same exact header "จัดการเวอร์ชัน Agent: ผู้ช่วยฝ่ายขาย", outer frame geometry, #F5F1E7 background, and bottom-right tag "ภาพจำลอง" as APP-AGENT-DRAFT, 1440x1800 portrait 4:5 ratio. Main top card now shows highlighted green badge "กำลังใช้งานจริง (published_version_no: 2 — อัปเดตแล้ว)", note "ปรับโทนคำตอบ", and config "temperature: 0.2 · max_tokens: 8192". Bottom card shows rollback panel reading "ประวัติรุ่นก่อนหน้า: เวอร์ชัน 1 (พร้อมย้อนกลับด้วย POST /rollback)".
```

# EP08 — Storyboard และแบบกำหนดหน้าจอ (Chat Conversations & History API)

เอกสารอ้างอิง: [PLAN](PLAN.md), [SCRIPT](SCRIPT.md), [CATALOG](CATALOG.md), และ [STORYBOARD_GUIDELINES](../../docs/STORYBOARD_GUIDELINES.md)  
สถานะ: แผน W4 พร้อมสำหรับเริ่มสร้าง Sample (W5) และการผลิต (W6)

---

## 1. แนวภาพและระบบการแสดงผล (Visual System)

* **สไตล์หลัก**: Editorial Paper & Sage Ink
* **สัดส่วนและขนาด**: 9:16 (1080×1920 พิกเซล, 30 fps)
* **ชุดสี (Palette)**: พื้นหลัง `#F5F1E7`, หมึกเข้ม `#202824`, สีเน้นรายการแชทที่เปิดอยู่ (`open`) `#38815A`, สีเน้นการแก้ไขชื่อและปิดงาน (`PATCH / closed`) `#1E7578`
* **ระบบตัวอักษร**: ฟอนต์ Sarabun (หัวเรื่อง 64–72px, ป้ายกำกับ 40–48px, ซับไตเติล 44–48px กึ่งกลางกรอบ y=1540–1720px)
* **พื้นที่ปลอดภัย (Safe Area)**: x=108–972, y=192–1500

---

## 2. รายละเอียด Storyboard ราย Beat (`b1–b9`)

| Beat / เวลาประมาณ | สงสัยก่อน → เข้าใจหลัง | ภาพเริ่ม → การเคลื่อนไหว → ภาพจบ | บทพากย์และข้อความเน้น | Assets / Catalog / Robot |
|---|---|---|---|---|
| **b1** (14–16s) | ลูกค้าปิดเว็บแล้วกลับมาใหม่ ดึงแชทเก่าและจัดการห้องแชทยังไง? → ใช้ Conversations & Messages API | หน้าจอ `APP-HISTORY-LIST` เด่นกลางจอ → ถอยออกมาตั้ง 3 คำถาม: เตรียมอะไร · เชื่อมตรงไหน · ใช้ผลยังไง | **บท**: พอเราทำหน้าเว็บแชทให้คุยกับ AI ได้แล้ว... ต้องเตรียมอะไร เชื่อมตรงไหน และเอาผลไปใช้ยังไง มาดูกันครับ<br>**ข้อความ**: "ทำระบบประวัติแชท & จัดการห้องสนทนา" | • `Browser Device Stage` (`#hf-195`)<br>• ภาพ `APP-HISTORY-LIST`<br>• Robot `01-question.png` |
| **b2** (14–16s) | ภาพรวมต้องเชื่อมกี่จุด? → 3 ขั้น: ดึงรายการห้อง → โหลดข้อความ → เปลี่ยนชื่อ/ปิด/ลบ | แผนผัง 3 ขั้นตอนเรียงชัดเจนระหว่างหน้าเว็บแชท ระบบหลังบ้าน และ LangMind | **บท**: ภาพรวมเชื่อมผ่านสามขั้นตอนหลัก คือ ดึงรายการบทสนทนา ดึงข้อความย้อนหลัง และเปลี่ยนชื่อ ปิด หรือลบ<br>**ข้อความ**: "1.ดึงรายการห้อง → 2.โหลดข้อความ → 3.เปลี่ยนชื่อ/ปิด/ลบ" | • `Flowchart Vertical` (`#hf-409`)<br>• ไม่ใช้ Robot |
| **b3** (14–16s) | ต้องเตรียมอะไรบ้าง? → `?agent_id=` (บังคับทุกเส้น) + Key `chat:invoke` + ระบบหลังบ้าน | การ์ดเช็กลิสต์ 3 ข้อ พร้อมไฮไลต์เน้นว่าทุกเส้นต้องส่ง `?agent_id=` เสมอ | **บท**: เริ่มจากสิ่งที่ต้องเตรียม... รหัส agent ID ซึ่งบังคับส่งเป็น query param เสมอ, API Key สิทธิ์ chat invoke และระบบหลังบ้าน<br>**ข้อความ**: บังคับส่ง `?agent_id=` ทุกครั้ง · สิทธิ์ `chat:invoke` | • `Marker Highlight` (`#hf-072`) |
| **b4** (17–19s) | ครั้งที่ 1 ดึงรายการห้องแชทและแบ่งหน้ายังไง? → `GET /chat/conversations?agent_id=...` ได้ `items` & `next_cursor` | หน้าจอ `APP-HISTORY-LIST` คู่กับโค้ดไฮไลต์ `title: "ราคาสินค้า A"`, `status: "open"`, `message_count: 4` และ `next_cursor` | **บท**: ครั้งที่หนึ่ง เรียก GET chat conversations พร้อมส่ง agent ID... คืนรายการ items และแบ่งหน้าด้วย next cursor<br>**ข้อความ**: `GET /api/chat/conversations?agent_id=...` → `items` & `next_cursor` | • `Browser Device Stage` (`#hf-195`)<br>• ภาพ `APP-HISTORY-LIST`<br>• `Code Highlight Sweep` (`#hf-113`)<br>• Robot `05-point-up.png` |
| **b5** (16–18s) | ครั้งที่ 2 โหลดข้อความเก่าในห้องยังไง? → `GET .../messages?agent_id=...` เรียงเก่าไปใหม่เสมอ | กล่องโค้ดและหน้าจอแสดงข้อความเรียง `user` (`"ราคาสินค้า A เท่าไร"`) → `assistant` (`"สินค้า A ราคา 590 บาทค่ะ"`) พร้อม `citations` | **บท**: ครั้งที่สอง เรียก GET conversations ตามด้วยรหัสห้องและ messages... คืนข้อความเรียงจากเก่าไปใหม่เสมอ<br>**ข้อความ**: `GET .../conversations/{id}/messages?agent_id=...` (เก่า → ใหม่) | • `Code Highlight Sweep` (`#hf-113`)<br>• `Message Thread Reveal` (`#hf-183`) |
| **b6** (17–19s) | ครั้งที่ 3 เปลี่ยนชื่อ ปิด หรือลบห้องแชทยังไง? → ส่ง `PATCH` (partial) หรือ `DELETE` (`204` ลบถาวร) | หน้าจอสลับเป็น `APP-HISTORY-DETAIL` แสดงชื่อหัวข้อเปลี่ยนเป็น `"สอบถามราคาสินค้า A"` และป้ายสถานะเปลี่ยนเป็น `"ปิดงานแล้ว (closed)"` | **บท**: ครั้งที่สาม ส่ง PATCH ไปเปลี่ยน title และ status เป็น closed หรือส่ง DELETE เพื่อลบถาวรทันที<br>**ข้อความ**: `PATCH .../conversations/{id}` (`title`, `status: "closed"`) · `DELETE` → `204` | • `Browser Device Stage` (`#hf-195`)<br>• ภาพ `APP-HISTORY-DETAIL`<br>• Robot `12-clipboard.png` |
| **b7** (15–17s) | มีรายละเอียดและฟีเจอร์เสริมอะไรอีก? → `tokens/latency` มีเฉพาะ `assistant`, กดหยุดด้วย `/stop`, โหลดไฟล์ด้วย `/generated-files` | ป้ายสรุป 3 จุด: 1. `tokens_in/out` มีเฉพาะ `assistant` 2. หยุดข้อความสดด้วย `POST /chat/messages/{id}/stop` 3. โหลดไฟล์ที่ AI สร้างด้วย `GET .../generated-files/{file_id}` | **บท**: ค่าโทเค็นและ latency มีเฉพาะฝั่ง assistant... และสั่งหยุด stream ได้ที่ stop หรือดาวน์โหลดไฟล์ที่เอเจนต์สร้างผ่าน generated files<br>**ข้อความ**: `POST .../stop` (`204`) · `GET .../generated-files/{file_id}` | • `Marker Highlight` (`#hf-072`) |
| **b8** (12–14s) | สรุปทั้งคลิป? → เตรียม `agent_id` + `chat:invoke` → เชื่อม 3 จุด → ระบบประวัติแชทครบวงจร | ภาพรวมสรุป 3 ช่อง: เตรียม → เชื่อม (`conversations` · `messages` · `PATCH/DELETE`) → ใช้ผล | **บท**: สรุปครับ เตรียม agent ID และ Key สิทธิ์ chat invoke เชื่อมสามจุด เว็บแชทของคุณก็มีระบบประวัติที่ครบถ้วนแล้วครับ<br>**ข้อความ**: "เตรียม → เชื่อม 3 จุด → ระบบประวัติแชทครบวงจร" | • Robot `10-thumbs-up.png` (กลางล่าง) |
| **b9** (6–8s) | ผู้สนับสนุน? → LangMind (`langmind.in.th`) | โลโก้จริง `langmind-logo.png` กลางจอ พร้อม `langmind.in.th` | **บท**: คลิปนี้สนับสนุนโดย LangMind เริ่มสร้างเว็บแชทและเชื่อมต่อ Agent ของคุณได้ที่ LangMind ดอท อิน ดอท ทีเอช<br>**ข้อความ**: `langmind.in.th` | • `shared/assets/brand/langmind-logo.png` |

---

## 3. การเลือกฉากตัวอย่างสำหรับทำ Sample (W5)

* **ช่วงที่เลือกทำ Sample**: **`b4 – b6` (`GET /conversations` → `GET .../messages` → `PATCH .../conversations/{id}`)**
* **เหตุผล**: ทดสอบการแสดงผลหน้าจอประวัติแชท `APP-HISTORY-LIST` และการเปลี่ยนสถานะหัวข้อเป็น `APP-HISTORY-DETAIL` บนจอมือถือ

---

## 4. แบบกำหนดหน้าจอ Mockup ก่อนเจนรูป (Screen Specifications)

### หน้าจอ 1: `APP-HISTORY-LIST` (สถานะแสดงรายการประวัติแชทและข้อความย้อนหลัง)
* **ขนาดไฟล์ภาพ**: 1440×1800 พิกเซล (4:5)
* **Header** (y=0.06–0.14): `"ประวัติการสนทนา — ผู้ช่วยฝ่ายขาย"`
* **เนื้อหาหลัก**:
  * การ์ดรายการห้องแชทที่เลือก (y=0.18–0.38):
    * หัวข้อห้องแชท (`title`): `"ราคาสินค้า A"` (`id: 01J8XM...`)
    * ป้ายสถานะสีเขียว: `"สถานะ: เปิดอยู่ (open) · 4 ข้อความ · next_cursor: null"`
  * กล่องประวัติข้อความในห้อง เรียงเก่า → ใหม่ (y=0.42–0.82):
    * ข้อความที่ 1 (`role: user`): `"ราคาสินค้า A เท่าไร"`
    * ข้อความที่ 2 (`role: assistant`): `"สินค้า A ราคา 590 บาทค่ะ"`
    * ป้ายข้อมูลประกอบใต้ข้อความ `assistant`: `"อ้างอิง: คู่มือ.pdf (score: 0.82) · tokens: 320 in / 48 out"`
  * ป้ายถาวร (y=0.88–0.93 มุมขวาล่าง): `"ภาพจำลอง"`

### หน้าจอ 2: `APP-HISTORY-DETAIL` (สถานะหลังสั่ง `PATCH` เปลี่ยนชื่อหัวข้อและปิดบทสนทนา)
* **ขนาดไฟล์ภาพ**: 1440×1800 พิกเซล (4:5) — คง Header, โครงหน้าต่าง `#F5F1E7`, กล่องข้อความ และป้าย `"ภาพจำลอง"` ตรงกับ `APP-HISTORY-LIST` ทุกพิกเซล
* **ส่วนที่เปลี่ยน**:
  * การ์ดหัวข้อห้องแชทด้านบน (y=0.18–0.38):
    * หัวข้อห้องแชทเปลี่ยนเป็น: `"สอบถามราคาสินค้า A (อัปเดตชื่อแล้ว)"`
    * ป้ายสถานะเปลี่ยนเป็นสีฟ้าอมเขียว `#1E7578`: `"สถานะ: ปิดบทสนทนาแล้ว (status: closed)"`
  * แถบปุ่มจัดการด้านล่าง (y=0.76–0.84):
    * แสดงป้ายคำสั่งเสริม: `"พร้อมใช้งาน: เปลี่ยนชื่อ (PATCH) · ลบถาวร (DELETE 204) · ดาวน์โหลดไฟล์ (generated-files)"`

---

## 5. Prompt สำหรับเจนภาพ Raster (ใช้ใน W5)

```text
[APP-HISTORY-LIST]
A clean, minimal web chat history UI card in Thai language titled "ประวัติการสนทนา — ผู้ช่วยฝ่ายขาย", 1440x1800 portrait 4:5 ratio. Soft warm paper background #F5F1E7, dark ink text #202824, sage green accents #38815A, clean thin dark borders. Top selected conversation card shows title "หัวข้อ: ราคาสินค้า A (id: 01J8XM...)" and a sage green badge "สถานะ: เปิดอยู่ (open) · 4 ข้อความ · next_cursor: null". Below is a chronological message history box (เก่า -> ใหม่) showing user bubble "ราคาสินค้า A เท่าไร" followed by assistant bubble "สินค้า A ราคา 590 บาทค่ะ" with metadata pill "อ้างอิง: คู่มือ.pdf (score: 0.82) · tokens: 320 in / 48 out". Small subtle tag at bottom right reading "ภาพจำลอง". Sharp flat editorial UI style, crisp Thai typography.

[APP-HISTORY-DETAIL]
Using the exact same header "ประวัติการสนทนา — ผู้ช่วยฝ่ายขาย", outer frame geometry, #F5F1E7 background, message bubbles, and bottom-right tag "ภาพจำลอง" as APP-HISTORY-LIST, 1440x1800 portrait 4:5 ratio. In the top conversation card, update the title to "หัวข้อ: สอบถามราคาสินค้า A (อัปเดตชื่อแล้ว)" and change the status badge to a teal pill #1E7578 reading "สถานะ: ปิดบทสนทนาแล้ว (status: closed)". At the bottom of the card, show an action bar reading "จัดการห้องแชท: เปลี่ยนชื่อ (PATCH) · ลบถาวร (DELETE 204) · ดาวน์โหลดไฟล์ (generated-files)". Sharp flat editorial UI style, crisp Thai typography.
```

# EP09 — Storyboard และแบบกำหนดหน้าจอ (Analytics & Feedback API)

เอกสารอ้างอิง: [PLAN](PLAN.md), [SCRIPT](SCRIPT.md), [CATALOG](CATALOG.md), และ [STORYBOARD_GUIDELINES](../../docs/STORYBOARD_GUIDELINES.md)  
สถานะ: แผน W4 พร้อมสำหรับเริ่มสร้าง Sample (W5) และการผลิต (W6)

---

## 1. แนวภาพและระบบการแสดงผล (Visual System)

* **สไตล์หลัก**: Editorial Paper & Sage Ink
* **สัดส่วนและขนาด**: 9:16 (1080×1920 พิกเซล, 30 fps)
* **ชุดสี (Palette)**: พื้นหลัง `#F5F1E7`, หมึกเข้ม `#202824`, สีเน้นคะแนนบวก/ผู้ใช้ `#38815A`, สีเน้นกราฟ/สถิติ `#1E7578`
* **ระบบตัวอักษร**: ฟอนต์ Sarabun (หัวเรื่อง 64–72px, ป้ายกำกับ 40–48px, ซับไตเติล 44–48px กึ่งกลางกรอบ y=1540–1720px)
* **พื้นที่ปลอดภัย (Safe Area)**: x=108–972, y=192–1500

---

## 2. รายละเอียด Storyboard ราย Beat (`b1–b9`)

| Beat / เวลาประมาณ | สงสัยก่อน → เข้าใจหลัง | ภาพเริ่ม → การเคลื่อนไหว → ภาพจบ | บทพากย์และข้อความเน้น | Assets / Catalog / Robot |
|---|---|---|---|---|
| **b1** (14–16s) | ปล่อยแชทแล้วรู้ได้ยังไงว่าคนใช้กี่คน เสียเงินเท่าไหร่ ตอบดีไหม? → ใช้ Feedback & Analytics API | หน้าจอ `APP-ANALYTICS-DASHBOARD` เด่นกลางจอ → ถอยออกมาตั้ง 3 คำถาม: เตรียมอะไร · เชื่อมตรงไหน · ใช้ผลยังไง | **บท**: พอเราปล่อยแชท AI ขึ้นใช้งานจริง... ต้องเตรียมอะไร เชื่อมตรงไหน และเอาผลไปใช้ยังไง มาดูกันครับ<br>**ข้อความ**: "วัดผลแชท AI คุมงบ Token & เก็บ Feedback" | • `Browser Device Stage` (`#hf-195`)<br>• ภาพ `APP-ANALYTICS-DASHBOARD`<br>• Robot `01-question.png` |
| **b2** (14–16s) | ภาพรวมเชื่อมยังไง? → ส่ง `user_id` ตอนแชท → ส่ง `feedback` → ดึง `analytics` | แผนผัง 3 จังหวะเรียงจากหน้าแชท ผ่านระบบหลังบ้าน ไปยัง LangMind | **บท**: ภาพรวมเชื่อมผ่านสามจังหวะ คือ ส่งรหัสผู้ใช้ตอนแชท ส่งคะแนนประเมิน และดึงข้อมูลสถิติ<br>**ข้อความ**: "1.ส่ง `user_id` → 2.ส่ง `feedback` → 3.ดึง `analytics`" | • `Flowchart Vertical` (`#hf-409`)<br>• ไม่ใช้ Robot |
| **b3** (14–16s) | ต้องเตรียมอะไรบ้าง? → `user_id` + `message_id` + Key (`chat:invoke`, `analytics:read`) + หลังบ้าน | การ์ดเตรียมความพร้อม 3 ใบ พร้อมเน้นสิทธิ์ `chat:invoke` คู่กับ `analytics:read` | **บท**: เริ่มจากสิ่งที่ต้องเตรียม... user ID, message ID, API Key สองสิทธิ์ และระบบหลังบ้านเก็บ Key<br>**ข้อความ**: `chat:invoke` + `analytics:read` | • `Marker Highlight` (`#hf-072`) |
| **b4** (16–18s) | ครั้งที่ 1 ทำไมต้องส่ง `user_id`? → เพื่อให้นับจำนวนผู้ใช้แยกคน (และระวังเมื่อ `conversation_id: null`) | กล่องโค้ด `/api/chat/message` ไฮไลต์ฟิลด์ `user_id` พร้อมป้ายเตือนเงื่อนไขการคุยต่อเมื่อ `conversation_id: null` | **บท**: ครั้งที่หนึ่ง การส่ง user ID ตอนเรียกแชท... ถ้าระบุ user ID สถิติจะนับจำนวนผู้ใช้แยกคนได้ตามจริง<br>**ข้อความ**: ส่ง `user_id` = นับผู้ใช้แยกคนตามจริง | • `Code Highlight Sweep` (`#hf-113`) |
| **b5** (16–18s) | ครั้งที่ 2 เก็บคะแนนคำตอบยังไง? → ส่ง `POST /chat/messages/{id}/feedback` (`1` หรือ `-1`) | หน้าจอ `APP-CHAT-FEEDBACK` กดปุ่ม 👍 → กล่องโค้ดไฮไลต์ `"rating": 1, "comment": "ตอบตรงประเด็นดี"` คืน `204` | **บท**: ครั้งที่สอง การเก็บคะแนนคำตอบ ส่ง POST ไปที่ feedback โดย rating รับเฉพาะ 1 หรือ -1 เท่านั้น<br>**ข้อความ**: `POST /api/chat/messages/{id}/feedback` (`rating: 1 / -1`) | • `Browser Device Stage` (`#hf-195`)<br>• ภาพ `APP-CHAT-FEEDBACK`<br>• Robot `14-heart.png` |
| **b6** (18–20s) | ครั้งที่ 3 ดึงสถิติและต้นทุนยังไง? → เรียก `GET /analytics/agents` และ `/analytics/agents/{id}` | หน้าจอสลับเป็น `APP-ANALYTICS-DASHBOARD` แสดงตัวเลขสรุปและกราฟแยก `daily`, `models`, `channels`, `tools` | **บท**: ครั้งที่สาม การดึงสถิติและค่าใช้จ่าย เรียก GET analytics agents... คืนทั้งภาพรวม รายวัน โมเดล ช่องทาง และ tool<br>**ข้อความ**: `GET /api/analytics/agents/{id}` → `summary` · `daily` · `channels` | • `Browser Device Stage` (`#hf-195`)<br>• ภาพ `APP-ANALYTICS-DASHBOARD`<br>• `Count-Up Stat Card` (`#hf-428`)<br>• Robot `11-reading.png` |
| **b7** (15–17s) | เอาตัวเลขไหนไปใช้ทำอะไร? → คุมงบ `cost_usd`, ดู `total_tokens`, และเช็ก `feedback_positive / negative` | แสดง `Animated Bar Chart` เปรียบเทียบช่องทาง (`web: 30`, `line: 12`) และไฮไลต์ตัวชี้วัดหลัก | **บท**: ผลที่ได้นำมาสร้าง Dashboard ได้ครบ ทั้งจำนวนบทสนทนา โทเค็น ค่าใช้จ่าย อัตราสำเร็จ และคะแนนบวกลบ<br>**ข้อความ**: `total_tokens` · `cost_usd` · `feedback_positive / negative` | • `Animated Bar Chart` (`#hf-154`)<br>• `Marker Highlight` (`#hf-072`) |
| **b8** (12–14s) | สรุปทั้งคลิป? → เตรียม → เชื่อม 3 จุด → ใช้ผลคุมงบและคุณภาพ | ภาพรวมสรุป 3 ช่อง: เตรียม → เชื่อม (`user_id` · `feedback` · `analytics`) → ใช้ผล | **บท**: สรุปครับ เตรียมรหัสผู้ใช้และ Key สองสิทธิ์ เชื่อมสามจังหวะ ดูแลทั้งคุณภาพและต้นทุนได้อย่างมั่นใจครับ<br>**ข้อความ**: "เตรียม → เชื่อม 3 จุด → วัดผลครบวงจร" | • Robot `10-thumbs-up.png` (กลางล่าง) |
| **b9** (6–8s) | ผู้สนับสนุน? → LangMind (`langmind.in.th`) | โลโก้จริง `langmind-logo.png` กลางจอ พร้อม `langmind.in.th` | **บท**: คลิปนี้สนับสนุนโดย LangMind เริ่มสร้างและติดตามผลการทำงานของ Agent ได้ที่ LangMind ดอท อิน ดอท ทีเอช<br>**ข้อความ**: `langmind.in.th` | • `shared/assets/brand/langmind-logo.png` |

---

## 3. การเลือกฉากตัวอย่างสำหรับทำ Sample (W5)

* **ช่วงที่เลือกทำ Sample**: **`b4 – b6` (`user_id` → `feedback` → `analytics`)**
* **เหตุผล**: ทดสอบความเชื่อมโยงระหว่างหน้าจอแชท `APP-CHAT-FEEDBACK` และหน้าจอสรุปผล `APP-ANALYTICS-DASHBOARD` พร้อมการอ่านตัวเลขบนจอมือถือ

---

## 4. แบบกำหนดหน้าจอ Mockup ก่อนเจนรูป (Screen Specifications)

### หน้าจอ 1: `APP-CHAT-FEEDBACK` (สถานะลูกค้ากดให้คะแนนคำตอบในแชท)
* **ขนาดไฟล์ภาพ**: 1440×1800 พิกเซล (4:5)
* **Header** (y=0.06–0.14): `"ผู้ช่วยฝ่ายขาย — แชทสอบถามสินค้า"`
* **เนื้อหาหลัก**:
  * ข้อความลูกค้า (y=0.20–0.32): `"ราคาสินค้า A เท่าไร"`
  * กล่องคำตอบ AI (y=0.36–0.56): `"สินค้า A ราคา 590 บาทค่ะ"`
  * แถบปุ่มให้คะแนนใต้คำตอบ (y=0.58–0.78):
    * ปุ่ม 👍 ไฮไลต์สีเขียว `"ถูกใจ (rating: 1)"` คู่กับปุ่ม 👎 `"ไม่ถูกใจ (-1)"`
    * กล่องความคิดเห็น: `"ตอบตรงประเด็นดี"`
  * ป้ายถาวร (y=0.88–0.93 มุมขวาล่าง): `"ภาพจำลอง"`

### หน้าจอ 2: `APP-ANALYTICS-DASHBOARD` (สถานะหน้า Dashboard สรุปสถิติและต้นทุน)
* **ขนาดไฟล์ภาพ**: 1440×1800 พิกเซล (4:5) — คงสไตล์สี `#F5F1E7`, กรอบ และป้าย `"ภาพจำลอง"` มุมขวาล่างตรงกับ `APP-CHAT-FEEDBACK`
* **เนื้อหาหลัก**:
  * Header (y=0.06–0.14): `"รายงานการใช้งาน Agent: ผู้ช่วยฝ่ายขาย (1–18 ส.ค.)"`
  * การ์ดสรุป 4 ช่อง (y=0.18–0.48) ใช้ตัวเลขตรงตามตัวอย่างในคู่มือ:
    * `"บทสนทนา: 42 ครั้ง (ผู้ใช้ 30 คน)"`
    * `"โทเค็นรวม: 50,400 tokens"`
    * `"ค่าใช้จ่าย: $1.2600 (อัตราสำเร็จ 98%)"`
    * `"ผลประเมิน: 👍 18 · 👎 1"`
  * การ์ดแยกตามช่องทาง (y=0.52–0.80):
    * `"ช่องทาง Web: 30 บทสนทนา (ผู้ใช้ 22 คน)"`
    * `"ช่องทาง LINE: 12 บทสนทนา (ผู้ใช้ 8 คน)"`
  * ป้ายถาวร (y=0.88–0.93 มุมขวาล่าง): `"ภาพจำลอง (ตัวเลขตัวอย่าง)"`

---

## 5. Prompt สำหรับเจนภาพ Raster (ใช้ใน W5)

```text
[APP-CHAT-FEEDBACK]
A clean, minimal chat UI card in Thai language titled "ผู้ช่วยฝ่ายขาย — แชทสอบถามสินค้า", 1440x1800 portrait 4:5 ratio. Soft warm paper background #F5F1E7, dark ink text #202824, sage green accents #38815A. Shows user message bubble "ราคาสินค้า A เท่าไร", assistant reply bubble "สินค้า A ราคา 590 บาทค่ะ", and an active feedback bar below with a highlighted green thumbs-up button "ถูกใจ (rating: 1)", a neutral thumbs-down button "ไม่ถูกใจ (-1)", and comment text "ตอบตรงประเด็นดี". Small subtle tag at bottom right reading "ภาพจำลอง".

[APP-ANALYTICS-DASHBOARD]
A clean, minimal analytics dashboard UI card in Thai language titled "รายงานการใช้งาน Agent: ผู้ช่วยฝ่ายขาย (1–18 ส.ค.)", 1440x1800 portrait 4:5 ratio, matching the exact frame style and #F5F1E7 palette of APP-CHAT-FEEDBACK. Displays a 2x2 grid of stat cards: "บทสนทนา: 42 ครั้ง (ผู้ใช้ 30 คน)", "โทเค็นรวม: 50,400 tokens", "ค่าใช้จ่าย: $1.2600 (อัตราสำเร็จ 98%)", and "ผลประเมิน: 👍 18 · 👎 1". Below is a channel breakdown card showing "ช่องทาง Web: 30 บทสนทนา" and "ช่องทาง LINE: 12 บทสนทนา". Small subtle tag at bottom right reading "ภาพจำลอง (ตัวเลขตัวอย่าง)".
```

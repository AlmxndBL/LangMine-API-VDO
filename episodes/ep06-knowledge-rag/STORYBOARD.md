# EP06 — Storyboard และแบบกำหนดหน้าจอ (Knowledge & Datasets API)

เอกสารอ้างอิง: [PLAN](PLAN.md), [SCRIPT](SCRIPT.md), [CATALOG](CATALOG.md), และ [STORYBOARD_GUIDELINES](../../docs/STORYBOARD_GUIDELINES.md)  
สถานะ: แผน W4 พร้อมสำหรับเริ่มสร้าง Sample (W5) และการผลิต (W6)

---

## 1. แนวภาพและระบบการแสดงผล (Visual System)

* **สไตล์หลัก**: Editorial Paper & Sage Ink (สอดคล้องกับ EP04)
* **สัดส่วนและขนาด**: 9:16 (1080×1920 พิกเซล, 30 fps)
* **ชุดสี (Palette)**:
  * พื้นหลัง: กระดาษนวล `#F5F1E7`
  * ตัวอักษรและเส้นขอบหลัก: หมึกเข้ม `#202824`
  * สีเน้นขาเข้า (Upload / Dataset): เขียวเซจ `#38815A`
  * สีเน้นผลค้นคืน (Retrieval Test): ฟ้าอมเขียว `#1E7578`
* **ระบบตัวอักษร**: ฟอนต์ Sarabun (หัวเรื่อง 64–72px, ป้ายกำกับ 40–48px, ซับไตเติล 44–48px กึ่งกลางกรอบ y=1540–1720px)
* **พื้นที่ปลอดภัย (Safe Area)**: x=108–972, y=192–1500

---

## 2. รายละเอียด Storyboard ราย Beat (`b1–b9`)

| Beat / เวลาประมาณ | สงสัยก่อน → เข้าใจหลัง | ภาพเริ่ม → การเคลื่อนไหว → ภาพจบ | บทพากย์และข้อความเน้น | Assets / Catalog / Robot |
|---|---|---|---|---|
| **b1** (14–16s) | ข้อมูลร้านเปลี่ยนบ่อย อัปเดตให้ AI อัตโนมัติได้ไหม? → ทำได้ผ่าน API พร้อมตั้ง 3 คำถามหลัก | หน้าจอ `APP-RAG-UPLOAD` เด่นกลางจอ แสดงไฟล์ `โปรโมชันเดือนนี้.pdf` → ถอยกล้องขึ้นเห็น 3 คำถาม: เตรียมอะไร · เชื่อมตรงไหน · ใช้ผลยังไง | **บท**: เวลาที่ร้านมีโปรโมชันใหม่... ต้องเตรียมอะไร เชื่อมตรงไหน และเอาผลไปใช้ยังไง มาดูกันครับ<br>**ข้อความ**: "อัปเดตความรู้ AI อัตโนมัติด้วย API" | • `Browser Device Stage` (`#hf-195`)<br>• ภาพ `APP-RAG-UPLOAD`<br>• Robot `01-question.png` (มุมซ้ายล่าง) |
| **b2** (14–16s) | ภาพรวมต้องเชื่อมอะไรบ้าง? → ระบบหลังบ้าน ⇄ LangMind Knowledge ⇄ Agent (3 ครั้ง) | แผนผัง 3 กล่องเรียงชัดเจน → ลูกศรชี้ลำดับการเรียก 3 ครั้ง: 1.อัปโหลดเอกสาร 2.ผูกคลัง 3.ทดสอบค้นคืน | **บท**: ภาพรวมของฟีเจอร์นี้มีสามส่วน... เรียก LangMind สามขั้นตอน คือ อัปโหลด ผูกคลัง และทดสอบค้นคืน<br>**ข้อความ**: "1.อัปโหลด → 2.ผูก Agent → 3.ทดสอบค้นคืน" | • `Flowchart Vertical` (`#hf-409`)<br>• `Hand-Drawn Arrow` (`#hf-322`)<br>• ไม่ใช้ Robot |
| **b3** (15–17s) | ต้องเตรียมอะไรก่อนเขียนโค้ด? → Agent ที่ตั้งค่า RAG แล้ว + Key 3 สิทธิ์ + ระบบหลังบ้าน | การ์ดเช็กลิสต์ 3 ข้อปรากฏทีละใบ พร้อมป้ายเตือน `503 RAGFLOW_NOT_CONFIGURED` หากยังไม่ตั้งค่า RAG | **บท**: เริ่มจากสิ่งที่ต้องเตรียม... Agent ที่ตั้งค่า RAG, API Key สามสิทธิ์ และระบบหลังบ้านเก็บ Key<br>**ข้อความ**: `knowledge:write` · `knowledge:read` · `agents:write` | • `Marker Highlight` (`#hf-072`)<br>• การ์ดเตรียมความพร้อม 3 ใบ |
| **b4** (18–20s) | ครั้งที่ 1 อัปโหลดแล้วใช้ได้ทันทีไหม? → ได้ `202 pending` ต้องเช็กจนเป็น `indexed` | กล่องโค้ด `POST /datasets/{id}/documents/upload` ส่งไฟล์ → แถบ `State Chip Rail` เลื่อนสถานะ `pending → processing → indexed` | **บท**: ครั้งที่หนึ่ง การอัปโหลดเอกสาร... ตอบกลับ 202 pending เช็กที่ GET documents จนเป็น indexed<br>**ข้อความ**: `POST .../documents/upload` → `pending → processing → indexed` | • `Code Highlight Sweep` (`#hf-113`)<br>• `State Chip Rail` (`#hf-208`)<br>• Robot `21-carry-books.png` |
| **b5** (14–16s) | ครั้งที่ 2 ทำยังไงให้ Agent ใช้คลังนี้? → เรียก `PUT /agents/{id}/datasets` | เส้นเชื่อมจากกล่อง Dataset ที่ `indexed` วิ่งเข้า Agent พร้อมไฮไลต์ `dataset_id` และ `weight: 1` | **บท**: ครั้งที่สอง การผูกคลังความรู้เข้ากับ Agent ด้วย PUT agents datasets พร้อมระบุ dataset ID และ weight<br>**ข้อความ**: `PUT /api/agents/{id}/datasets` (`weight: 1`) | • `Code Highlight Sweep` (`#hf-113`)<br>• `Hand-Drawn Arrow` (`#hf-322`) |
| **b6** (18–20s) | ครั้งที่ 3 เช็กยังไงว่าค้นเจอโดยไม่เสียเงินเรียก LLM? → เรียก `POST /retrieval/test` | กล่องคำขอ `POST /retrieval/test` ส่งคำค้น `"โปรโมชันอเมริกาโน่"` → หน้าจอสลับเป็น `APP-RAG-TEST` โชว์ข้อความที่ค้นเจอและ `score: 0.84` | **บท**: ครั้งที่สาม การทดสอบค้นคืนโดยไม่เรียก LLM ส่ง POST ไปที่ retrieval test ได้ segments และ score กลับมา<br>**ข้อความ**: `POST /api/retrieval/test` → `segments` & `score` | • `Browser Device Stage` (`#hf-195`)<br>• ภาพ `APP-RAG-TEST`<br>• Robot `11-reading.png` |
| **b7** (15–17s) | เอาผลไปใช้ต่อยังไงและต้องระวังอะไร? → รองรับหลายช่องทางนำเข้า และ `score` ไม่ใช่ % ความถูกต้อง | แสดงป้ายตัวเลือกการนำเข้า (`upload-batch ≤ 50 MB`, `/url`, `/text`, `/crawl`) และป้ายเน้นความหมายของ `score` | **บท**: ผลที่ได้เอาไปใช้เช็กคุณภาพเอกสาร... รองรับทั้ง upload-batch, url, text, crawl และจำไว้ว่า score คือค่าความคล้าย ไม่ใช่เปอร์เซ็นต์ความถูกต้อง<br>**ข้อความ**: `upload-batch` · `/url` · `/text` · `/crawl` | • `Marker Highlight` (`#hf-072`)<br>• การ์ดสรุปการนำไปใช้ |
| **b8** (12–14s) | สรุปทั้งคลิปต้องทำอะไรบ้าง? → เตรียม → เชื่อม 3 ขั้น → ใช้ผล | ถอยภาพรวมสรุป 3 ช่อง: เตรียม (RAG + Key) → เชื่อม (Upload · Bind · Test) → ใช้ผล | **บท**: สรุปครับ เตรียม Agent และ Key สามสิทธิ์ เชื่อมสามขั้นตอน เพียงเท่านี้ AI ก็มีข้อมูลใหม่อัปเดตตลอดเวลาแล้วครับ<br>**ข้อความ**: "เตรียม → เชื่อม 3 ขั้น → ใช้ผล" | • Robot `10-thumbs-up.png` (กลางล่าง) |
| **b9** (6–8s) | ใครเป็นผู้สนับสนุน? → LangMind (`langmind.in.th`) | โลโก้จริง `langmind-logo.png` กลางจอบนพื้นสว่าง พร้อม URL `langmind.in.th` | **บท**: คลิปนี้สนับสนุนโดย LangMind เริ่มสร้าง Agent และคลังความรู้ของคุณได้ที่ LangMind ดอท อิน ดอท ทีเอช<br>**ข้อความ**: `langmind.in.th` | • `shared/assets/brand/langmind-logo.png` |

---

## 3. การเลือกฉากตัวอย่างสำหรับทำ Sample (W5)

* **ช่วงที่เลือกทำ Sample**: **`b4 – b6` (3 ขั้นตอนการเชื่อม: Upload & Status → Bind Agent → Retrieval Test)**
* **เหตุผล**: ทดสอบทั้งการเปลี่ยนสถานะ `pending → processing → indexed`, การไฮไลต์โค้ด JSON และการแสดงหน้าจอจำลอง `APP-RAG-TEST` บนจอมือถือ

---

## 4. แบบกำหนดหน้าจอ Mockup ก่อนเจนรูป (Screen Specifications)

### หน้าจอ 1: `APP-RAG-UPLOAD` (สถานะอัปโหลดเอกสารและจัดทำดัชนีเสร็จสิ้น)
* **ขนาดไฟล์ภาพ**: 1440×1800 พิกเซล (4:5)
* **Header** (y=0.06–0.14): `"ระบบจัดการคลังความรู้ร้านกาแฟ"`
* **เนื้อหาหลัก**:
  * การ์ดคลังความรู้ (y=0.18–0.34): `"คลังข้อมูล: คู่มือและโปรโมชันร้าน"` (`dataset_id: 5e2a...`)
  * รายการเอกสารที่อัปโหลด (y=0.38–0.68): ไฟล์ `"โปรโมชันเดือนนี้.pdf"` พร้อมแถบสถานะเรียง 3 ขั้น `รอดำเนินการ (pending)` → `กำลังประมวลผล (processing)` → ไฮไลต์สีเขียวที่ `พร้อมใช้งาน (indexed)`
  * ป้ายสถานะการผูก Agent (y=0.72–0.82): `"ผูกกับ Agent: ผู้ช่วยร้านกาแฟ (weight: 1)"`
  * ป้ายถาวร (y=0.88–0.93 มุมขวาล่าง): `"ภาพจำลอง"`

### หน้าจอ 2: `APP-RAG-TEST` (สถานะทดสอบค้นคืนด้วย `/retrieval/test`)
* **ขนาดไฟล์ภาพ**: 1440×1800 พิกเซล (4:5) — สืบทอดโครงสร้าง Header, สีพื้น `#F5F1E7`, กรอบ และป้าย `"ภาพจำลอง"` จาก `APP-RAG-UPLOAD` ทุกพิกเซล
* **ส่วนที่เปลี่ยน**:
  * ช่องคำค้นทดสอบ (y=0.18–0.32): `"คำค้นทดสอบ: โปรโมชันอเมริกาโน่"` + ป้าย `"ทดสอบค้นคืน (ไม่เรียก LLM)"`
  * กล่องผลลัพธ์ `Segment #1` (y=0.36–0.78):
    * ชื่อไฟล์: `"โปรโมชันเดือนนี้.pdf (หน้า 1)"`
    * เนื้อหาที่ค้นเจอ: `"อเมริกาโน่เย็น ซื้อ 2 แก้ว ลดทันที 20 บาท ตลอดเดือนนี้"`
    * ป้ายค่าความคล้าย: `"ค่าความคล้าย (score): 0.84"`
  * ข้อห้าม: ห้ามใส่คำว่า `"แม่นยำ 84%"` เด็ดขาด (ต้องใช้คำว่า `"ค่าความคล้าย (score): 0.84"`)

---

## 5. Prompt สำหรับเจนภาพ Raster (ใช้ใน W5)

```text
[APP-RAG-UPLOAD]
A clean, minimal web dashboard UI card in Thai language for a cafe knowledge base manager titled "ระบบจัดการคลังความรู้ร้านกาแฟ", 1440x1800 portrait 4:5 ratio. Soft warm paper background #F5F1E7, dark ink text #202824, sage green accents #38815A. Shows dataset card "คลังข้อมูล: คู่มือและโปรโมชันร้าน", an uploaded file row "โปรโมชันเดือนนี้.pdf" with a 3-step status pill bar highlighting "พร้อมใช้งาน (indexed)" in sage green, and a bottom note "ผูกกับ Agent: ผู้ช่วยร้านกาแฟ (weight: 1)". Small subtle tag at bottom right reading "ภาพจำลอง". Sharp flat editorial illustration style, high legibility for mobile viewing.

[APP-RAG-TEST]
Same exact layout geometry, header "ระบบจัดการคลังความรู้ร้านกาแฟ", colors, and bottom-right tag "ภาพจำลอง" as APP-RAG-UPLOAD, 1440x1800 portrait 4:5 ratio. The center area switches to a retrieval test panel showing search query "คำค้นทดสอบ: โปรโมชันอเมริกาโน่" with a teal badge "ทดสอบค้นคืน (ไม่เรียก LLM)", and a matched document segment card from "โปรโมชันเดือนนี้.pdf" reading "อเมริกาโน่เย็น ซื้อ 2 แก้ว ลดทันที 20 บาท ตลอดเดือนนี้" with a pill label "ค่าความคล้าย (score): 0.84".
```

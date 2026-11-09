# EP07 — Storyboard และแบบกำหนดหน้าจอ (Simple Knowledge & Knowledge Candidates API)

เอกสารอ้างอิง: [PLAN](PLAN.md), [SCRIPT](SCRIPT.md), [CATALOG](CATALOG.md), และ [STORYBOARD_GUIDELINES](../../docs/STORYBOARD_GUIDELINES.md)  
สถานะ: แผน W4 พร้อมสำหรับเริ่มสร้าง Sample (W5) และการผลิต (W6)

---

## 1. แนวภาพและระบบการแสดงผล (Visual System)

* **สไตล์หลัก**: Editorial Paper & Sage Ink
* **สัดส่วนและขนาด**: 9:16 (1080×1920 พิกเซล, 30 fps)
* **ชุดสี (Palette)**: พื้นหลัง `#F5F1E7`, หมึกเข้ม `#202824`, สีเน้นกฎตอบด่วน `#38815A`, สีเน้นการ Promote เข้าคลัง `#1E7578`
* **ระบบตัวอักษร**: ฟอนต์ Sarabun (หัวเรื่อง 64–72px, ป้ายกำกับ 40–48px, ซับไตเติล 44–48px กึ่งกลางกรอบ y=1540–1720px)
* **พื้นที่ปลอดภัย (Safe Area)**: x=108–972, y=192–1500

---

## 2. รายละเอียด Storyboard ราย Beat (`b1–b9`)

| Beat / เวลาประมาณ | สงสัยก่อน → เข้าใจหลัง | ภาพเริ่ม → การเคลื่อนไหว → ภาพจบ | บทพากย์และข้อความเน้น | Assets / Catalog / Robot |
|---|---|---|---|---|
| **b1** (14–16s) | คำถามง่ายๆ ทำไมต้องรอ AI และคำถามใหม่ๆ เก็บเข้าคลังยังไง? → มี 2 เครื่องมือช่วยจัดการ | หน้าจอ `APP-FAQ-RULE` เด่นกลางจอ → ถอยออกมาตั้ง 3 คำถาม: เตรียมอะไร · เชื่อมตรงไหน · ใช้ผลยังไง | **บท**: เวลาทำแชทบอทร้านค้า มักเจอสองเรื่องนี้พร้อมกัน... ต้องเตรียมอะไร เชื่อมตรงไหน และเอาผลไปใช้ยังไง มาดูกันครับ<br>**ข้อความ**: "คำตอบด่วน FAQ & คัดกรองคำถามเข้าคลัง" | • `Browser Device Stage` (`#hf-195`)<br>• ภาพ `APP-FAQ-RULE`<br>• Robot `06-thinking.png` |
| **b2** (14–16s) | ทั้ง 2 ระบบต่างกันยังไง? → ด่านหน้าตอบทันที vs ด่านคัดกรองตรวจก่อนเข้า Dataset | แผนผัง `Hand-Drawn Flowchart` แยกบน–ล่าง: เส้นบน `Simple Knowledge` ตอบทันทีก่อนถึง RAG/LLM, เส้นล่าง `Knowledge Candidates` ตรวจก่อนเข้า Dataset | **บท**: ภาพรวมแบ่งเป็นสองด่าน ด่านหน้าคือ Simple Knowledge... ส่วนด่านพัฒนาคือ Knowledge Candidates<br>**ข้อความ**: "ด่านหน้าตอบด่วน vs ด่านตรวจเข้า Dataset" | • `Hand-Drawn Flowchart` (`#hf-418`)<br>• ไม่ใช้ Robot |
| **b3** (13–15s) | ต้องเตรียมอะไรบ้าง? → `agent_id` + `dataset_id` + Key สิทธิ์ `knowledge` + ระบบหลังบ้าน | การ์ดเตรียมความพร้อม 3 ใบเรียงลงมา พร้อมไฮไลต์สิทธิ์ `knowledge:write` และ `knowledge:read` | **บท**: เริ่มจากสิ่งที่ต้องเตรียม... agent ID, dataset ID, API Key สิทธิ์ knowledge write/read และระบบหลังบ้าน<br>**ข้อความ**: `agent_id` · `dataset_id` · `knowledge:write` | • `Marker Highlight` (`#hf-072`) |
| **b4** (16–18s) | ครั้งที่ 1 ตั้งกฎคำตอบด่วนยังไง? → ส่ง `POST /simple-knowledge` | กล่องโค้ด `POST /api/simple-knowledge` ไฮไลต์ `keyword: "เวลาทำการ"`, `response: "เปิด 9 โมงถึง 5 โมง"`, `match_type: "exact"` คู่กับภาพ `APP-FAQ-RULE` | **บท**: ครั้งที่หนึ่ง การตั้งกฎคำตอบด่วน ส่ง POST ไปที่ simple knowledge... ตอบกลับทันทีโดยไม่เรียก LLM<br>**ข้อความ**: `POST /api/simple-knowledge` (`match_type: "exact"`) | • `Code Highlight Sweep` (`#hf-113`)<br>• ภาพ `APP-FAQ-RULE`<br>• Robot `05-point-up.png` |
| **b5** (15–17s) | ครั้งที่ 2 ตรวจอนุมัติคำถามยังไง? → ส่ง `POST /knowledge-candidates/review` | การ์ด `Marker Checklist Card` ติ๊กถูกที่คำถามรอตรวจ → กล่องโค้ดไฮไลต์ `"action": "approve"` | **บท**: ครั้งที่สอง การตรวจอนุมัติคำถาม ส่ง POST ไปที่ knowledge candidates review พร้อมใส่ action เป็น approve<br>**ข้อความ**: `POST /api/knowledge-candidates/review` (`"action": "approve"`) | • `Marker Checklist Card` (`#hf-242`)<br>• `Code Highlight Sweep` (`#hf-113`) |
| **b6** (17–19s) | ครั้งที่ 3 ดันคำถามที่อนุมัติเข้าคลังยังไง? → ส่ง `POST .../promote` | หน้าจอสลับเป็น `APP-CANDIDATE-PROMOTE` แสดงรายการที่ `approved` วิ่งเข้า `dataset_id` พร้อมคืน `promoted` และ `export_batch_id` | **บท**: ครั้งที่สาม การดันคำถามเข้าคลังความรู้จริง ส่ง POST ไปที่ promote... คืนรายการ promoted และ export batch ID<br>**ข้อความ**: `POST .../promote` → `promoted` & `export_batch_id` | • `Browser Device Stage` (`#hf-195`)<br>• ภาพ `APP-CANDIDATE-PROMOTE`<br>• Robot `12-clipboard.png` |
| **b7** (15–17s) | เอาผลไปใช้ยังไงและมีข้อควรระวังอะไร? → กติกา `match_type` (`422`/`409`) และการแยก `skipped` | ป้ายสรุปกติกา: `exact / contains / pattern` (`{variable}` ขาด = `422`, คีย์ซ้ำ = `409`) และเฉพาะ `status=approved` เท่านั้นที่ถูก `promoted` | **บท**: ผลที่ได้ช่วยให้จัดการความรู้อย่างมีระบบ... ถ้าคีย์ซ้ำได้ 409 และเฉพาะรายการที่ approved เท่านั้นที่ promote ได้จริง<br>**ข้อความ**: `422` / `409` · เฉพาะ `approved` → `promoted` | • `Marker Highlight` (`#hf-072`) |
| **b8** (12–14s) | สรุปทั้งคลิป? → เตรียม → เชื่อม 3 จุด → ใช้ผล | ภาพรวมสรุป 3 ช่อง: เตรียม → เชื่อม (`simple-knowledge` · `review` · `promote`) → ใช้ผล | **บท**: สรุปครับ เตรียม Agent ID, Dataset ID และ Key เชื่อมสามจุด ช่วยให้บอทตอบไวและฉลาดขึ้นอย่างปลอดภัยครับ<br>**ข้อความ**: "เตรียม → เชื่อม 3 จุด → ใช้ผล" | • Robot `04-open-arms.png` (กลางล่าง) |
| **b9** (6–8s) | ผู้สนับสนุน? → LangMind (`langmind.in.th`) | โลโก้จริง `langmind-logo.png` กลางจอ พร้อม `langmind.in.th` | **บท**: คลิปนี้สนับสนุนโดย LangMind เริ่มสร้างและดูแลคลังความรู้ให้ Agent ของคุณได้ที่ LangMind ดอท อิน ดอท ทีเอช<br>**ข้อความ**: `langmind.in.th` | • `shared/assets/brand/langmind-logo.png` |

---

## 3. การเลือกฉากตัวอย่างสำหรับทำ Sample (W5)

* **ช่วงที่เลือกทำ Sample**: **`b4 – b6` (Simple Knowledge → Review → Promote)**
* **เหตุผล**: ทดสอบการแสดงผลคู่กันของทั้ง 2 API หมวดย่อย และการสลับภาพหน้าจอจำลอง `APP-FAQ-RULE` ไปยัง `APP-CANDIDATE-PROMOTE`

---

## 4. แบบกำหนดหน้าจอ Mockup ก่อนเจนรูป (Screen Specifications)

### หน้าจอ 1: `APP-FAQ-RULE` (สถานะตั้งกฎคำตอบด่วน Simple Knowledge)
* **ขนาดไฟล์ภาพ**: 1440×1800 พิกเซล (4:5)
* **Header** (y=0.06–0.14): `"จัดการคำตอบด่วน & คัดกรองคำถามร้านกาแฟ"`
* **เนื้อหาหลัก**:
  * ส่วนที่ 1 กฎคำตอบด่วน (y=0.18–0.65): การ์ด `"กฎคำตอบด่วน (Simple Knowledge)"`
    * หัวข้อ: `"เวลาทำการ"`
    * คำสำคัญ (`keyword`): `"เวลาทำการ"` · รูปแบบ (`match_type`): ป้ายสีเขียว `"ตรงทุกตัวอักษร (exact)"`
    * คำตอบ (`response`): `"เปิด 9 โมงถึง 5 โมง"`
    * ป้ายสถานะ: `"เปิดใช้งาน (ตอบทันทีก่อนถึง RAG/LLM)"`
  * ป้ายถาวร (y=0.88–0.93 มุมขวาล่าง): `"ภาพจำลอง"`

### หน้าจอ 2: `APP-CANDIDATE-PROMOTE` (สถานะอนุมัติและดันคำถามเข้า Dataset)
* **ขนาดไฟล์ภาพ**: 1440×1800 พิกเซล (4:5) — คง Header, โครงสี `#F5F1E7` และป้าย `"ภาพจำลอง"` มุมขวาล่างตรงกับ `APP-FAQ-RULE`
* **ส่วนที่เปลี่ยน**:
  * การ์ด `"รายการคำถามรอตรวจ (Knowledge Candidates)"` (y=0.18–0.78):
    * แถวที่ 1: คำถาม `"หน้าร้านมีที่จอดรถไหม"` · คำตอบ `"จอดฟรีหน้าร้านได้ 5 คันครับ"` · ป้ายสถานะสีเขียว `"อนุมัติแล้ว (approved)"` → ป้ายผลลัพธ์ `"ส่งเข้าคลังแล้ว (promoted)"`
    * แถวที่ 2: คำถาม `"รับจัดเลี้ยงนอกสถานที่ไหม"` · ป้ายสถานะสีเทา `"รอตรวจ (pending)"` → ป้ายผลลัพธ์ `"ข้ามรายการ (skipped)"`
    * แถบล่างในการ์ด: `"คลังปลายทาง: คู่มือสินค้า (5e2a...) · Batch: batch_20260818_01"`

---

## 5. Prompt สำหรับเจนภาพ Raster (ใช้ใน W5)

```text
[APP-FAQ-RULE]
A clean, minimal web admin UI card in Thai language titled "จัดการคำตอบด่วน & คัดกรองคำถามร้านกาแฟ", 1440x1800 portrait 4:5 ratio. Soft warm paper background #F5F1E7, dark ink typography #202824, sage green accents #38815A. Displays a section "กฎคำตอบด่วน (Simple Knowledge)" showing rule title "เวลาทำการ", keyword pill "เวลาทำการ", match type badge "ตรงทุกตัวอักษร (exact)", response box "เปิด 9 โมงถึง 5 โมง", and an active status badge "เปิดใช้งาน (ตอบทันทีก่อนถึง RAG/LLM)". Small subtle label at bottom right reading "ภาพจำลอง". Flat vector-like editorial style, high contrast for mobile.

[APP-CANDIDATE-PROMOTE]
Same exact header "จัดการคำตอบด่วน & คัดกรองคำถามร้านกาแฟ", outer frame geometry, color palette #F5F1E7, and bottom-right label "ภาพจำลอง" as APP-FAQ-RULE, 1440x1800 portrait 4:5 ratio. The main area shows "รายการคำถามรอตรวจ (Knowledge Candidates)" with two rows: Row 1 shows "หน้าร้านมีที่จอดรถไหม" with green badge "อนุมัติแล้ว (approved)" and teal pill "ส่งเข้าคลังแล้ว (promoted)"; Row 2 shows "รับจัดเลี้ยงนอกสถานที่ไหม" with neutral badge "รอตรวจ (pending)" and pill "ข้ามรายการ (skipped)". Footer inside card reads "คลังปลายทาง: คู่มือสินค้า (5e2a...) · Batch: batch_20260818_01".
```

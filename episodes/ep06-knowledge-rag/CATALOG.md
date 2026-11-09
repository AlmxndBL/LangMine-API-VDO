# EP06 — ทะเบียนคัดเลือก Catalog (Knowledge & Datasets API)

อ้างอิง: [CATALOG_USAGE_MAP](../../docs/CATALOG_USAGE_MAP.md), [PLAN](PLAN.md), และ [Workflow](../../docs/WORKFLOW.md)  
สถานะ: แผนการเลือกบล็อก Motion สำหรับ W4 ก่อนสร้าง Sample ใน W5

---

## 1. เกณฑ์การคัดเลือกตามหน้าที่ของซีน

ในคลิป EP06 มี 4 หน้าที่หลักที่ต้องการแอนิเมชันช่วยอธิบาย:
1. **แสดงหน้าจอระบบหลังบ้านจำลอง (Device Hosting)**: ให้เห็นหน้าจออัปโหลดไฟล์โปรโมชันและหน้าจอผลทดสอบค้นคืน
2. **แสดงการเปลี่ยนสถานะเอกสารเบื้องหลัง (Async Status Progression)**: ให้เห็นสถานะ `pending → processing → indexed` อย่างชัดเจน
3. **แสดงท่อการเชื่อม API 3 ขั้นตอน (Data Pipeline & Code Highlight)**: ให้เห็นลำดับการอัปโหลด ผูกคลัง และทดสอบค้นคืน
4. **เน้นข้อความส่วนที่ค้นเจอ (Retrieval Segment Highlight)**: ให้เห็นว่าคำค้นดึงส่วนไหนของเอกสารออกมา

---

## 2. รายการ Catalog ที่เลือกใช้ตามหน้าที่

| รหัส / ชื่อ Catalog | หน้าที่ในซีน | Beat ที่ใช้ | เหตุผลและข้อจำกัด |
|---|---|---|---|
| **#hf-195 Browser Device Stage** | แสดงกรอบหน้าจอครอบภาพจำลอง `APP-RAG-UPLOAD` และ `APP-RAG-TEST` | b1, b4, b6 | ใช้ host ภาพ raster ให้เห็นบริบทระบบหลังบ้านร้านกาแฟโดยไม่ใช้ HTML วาด UI ทับ |
| **#hf-208 State Chip Rail** | แสดงแถบสถานะเอกสารเปลี่ยนจาก `pending` → `processing` → `indexed` | b4 | สื่อสารการทำงานแบบ background indexing ได้ตรงตาม contract ของ API |
| **#hf-409 Flowchart Vertical (ร่วมกับ #hf-322 Hand-Drawn Arrow)** | แสดงแผนผัง 3 ส่วนและท่อการเรียก API 3 ครั้ง | b2, b4, b5, b6 | ช่วยให้คนดูเห็นความเชื่อมโยงระหว่าง Dataset, Agent และ Retrieval Test |
| **#hf-113 Code Highlight Sweep / #hf-122 Code Snippet - Dark Modern** | แสดงบล็อกคำขอ API และไฮไลต์บรรทัดสำคัญ (`dataset_id`, `query`, `segments`) | b4, b5, b6 | ดึงสายตาไปยังฟิลด์สำคัญใน JSON โดยไม่ต้องแสดงโค้ดยาวทั้งไฟล์ |
| **#hf-072 Marker Highlight** | ไฮไลต์เน้นข้อความสำคัญ เช่น `503 RAGFLOW_NOT_CONFIGURED` และคำเตือนเรื่อง `score` | b3, b7, b8 | เน้นข้อควรระวังให้จำง่ายบนหน้าจอมือถือ |

---

## 3. สิ่งที่ต้องทดสอบใน Sample (W5)

* **ความชัดเจนของ State Chip Rail (`pending → processing → indexed`)**: ทดสอบจังหวะการเปลี่ยนสีป้ายสถานะให้สอดคล้องกับเสียงพากย์ช่วง `b4` โดยไม่อ่านเร็วเกินไป
* **การจัดวาง Code Snippet คู่กับภาพ `APP-RAG-TEST` ใน `b6`**: ตรวจสอบว่าเมื่อแสดงผล `segments` คู่กับหน้าจอจำลองในสัดส่วน 9:16 ตัวอักษรภาษาไทยยังอ่านง่ายบนจอมือถือ (360×640)

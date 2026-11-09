# EP07 — ทะเบียนคัดเลือก Catalog (Simple Knowledge & Knowledge Candidates API)

อ้างอิง: [CATALOG_USAGE_MAP](../../docs/CATALOG_USAGE_MAP.md), [PLAN](PLAN.md), และ [Workflow](../../docs/WORKFLOW.md)  
สถานะ: แผนการเลือกบล็อก Motion สำหรับ W4 ก่อนสร้าง Sample ใน W5

---

## 1. เกณฑ์การคัดเลือกตามหน้าที่ของซีน

ในคลิป EP07 มี 3 หน้าที่หลักที่ต้องการแอนิเมชันช่วยอธิบาย:
1. **เปรียบเทียบ 2 ทางเดินของความรู้ (Fast Rule vs Reviewed Candidate Flow)**: ให้เห็นว่า Simple Knowledge ตอบด่านหน้าทันที ส่วน Knowledge Candidates ต้องผ่านการตรวจอนุมัติก่อนเข้า Dataset
2. **แสดงการตรวจอนุมัติรายการคำถาม (Review & Checklist Progression)**: ให้เห็นการเปลี่ยนสถานะเป็น `approved` และการแยก `promoted` กับ `skipped`
3. **แสดงหน้าจอจำลองและบล็อกโค้ด (Device Hosting & Code Highlight)**: ให้เห็น JSON body ของทั้ง 3 endpoints

---

## 2. รายการ Catalog ที่เลือกใช้ตามหน้าที่

| รหัส / ชื่อ Catalog | หน้าที่ในซีน | Beat ที่ใช้ | เหตุผลและข้อจำกัด |
|---|---|---|---|
| **#hf-195 Browser Device Stage** | แสดงกรอบหน้าจอครอบภาพจำลอง `APP-FAQ-RULE` และ `APP-CANDIDATE-PROMOTE` | b1, b4, b6 | ใช้ host ภาพ raster หน้าจอจัดการ FAQ และหน้าอนุมัติคำถาม |
| **#hf-418 Hand-Drawn Flowchart** | แสดงแผนผังแยก 2 เส้นทาง: ด่านหน้า (Simple Knowledge) กับด่านคัดกรอง (Candidates → Dataset) | b2, b5, b6 | เส้นเชื่อมสไตล์วาดมือเข้ากับโทนกระดาษ Editorial Paper และแยก 2 บทบาทได้ชัดเจน |
| **#hf-242 Marker Checklist Card** | แสดงรายการคำถาม Candidate ที่ถูกติ๊กเลือกและเปลี่ยนสถานะเป็น `approved` | b5, b6 | สื่อสารขั้นตอน batch review และการแยก `promoted` ออกจาก `skipped` ได้เข้าใจง่าย |
| **#hf-113 Code Highlight Sweep** | ไฮไลต์ฟิลด์สำคัญใน JSON (`keyword`, `match_type`, `action: "approve"`, `dataset_id`) | b4, b5, b6 | ช่วยเน้นพารามิเตอร์ที่ต้องส่งในแต่ละครั้งโดยไม่ต้องอ่านโค้ดทั้งก้อน |
| **#hf-072 Marker Highlight** | เน้นรหัสข้อผิดพลาด `422` / `409` และเงื่อนไข `status=approved` | b7, b8 | ดึงสายตาไปยังกติกา validation สำคัญของ API |

---

## 3. สิ่งที่ต้องทดสอบใน Sample (W5)

* **การวาง Hand-Drawn Flowchart 2 เส้นทางบนจอ 9:16**: ทดสอบว่าป้ายชื่อ `Simple Knowledge` และ `Knowledge Candidates` ไม่เบียดกันและอ่านชัดบนมือถือ
* **ความต่อเนื่องระหว่าง `APP-FAQ-RULE` และ `APP-CANDIDATE-PROMOTE`**: ตรวจสอบขนาดตัวอักษรไทยในตารางอนุมัติคำถามไม่ให้เล็กเกินไปเมื่อย่อในกรอบ Device Stage

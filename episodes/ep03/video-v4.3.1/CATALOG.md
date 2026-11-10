# EP03 v4.3.1 — HyperFrames Catalog log

บันทึกแยกสถานะ source, integration, preview และ output ตามข้อกำหนดโปรเจกต์. การอ่าน source หรือ lint ผ่านไม่ใช่หลักฐานว่า visual motion ถูกต้อง.

| รายการ | หน้าที่ในคลิป | Source / integration | Preview และ render | ผลที่ใช้ |
|---|---|---|---|---|
| HF-337 Onboarding Stepper Flow · Component | progress 3 ขั้นที่ส่วนหัวทุกฉาก | ปรับ source ใน `compositions/components/onboarding-stepper-flow.html` จาก component ที่อยู่ใน workspace แล้ว inject เข้า composition โดย build script; เปลี่ยน labels/สีเป็นไทยและ Editorial Paper & Sage Ink | ไม่ได้ดู official Catalog preview ใน session นี้; native HyperFrames render ยังไม่ยืนยัน. Pillow fallback วาด progress แยก ไม่ได้ render component | ใช้เป็น source component ใน editable HyperFrames project; visual status ยัง unverified |
| HF-113 Code Highlight Sweep · Block | เน้น `conversation_id: null` ใน B4 | source ต้นฉบับเก็บที่ `catalog-source/HF-113-code-highlight-original.html`; ปรับ source ที่ `compositions/code-highlight.html`; host อยู่ใน B4 | official preview ไม่ปรากฏในเอกสารที่อ่านได้และ browser preview ยังปิด; native composition ยังไม่ยืนยัน. Pillow fallback วาด highlight ของตัวเอง | source integrated ใน B4 HTML; MP4 fallback ไม่ได้ใช้ block นี้ |
| HF-418 Hand-Drawn Flowchart / HF-322 Hand-Drawn Arrow · candidate | แสดงทางเดิน request/response และ event timeline | ตรวจรายละเอียดใน `docs/CATALOG_USAGE_MAP.md`; ไม่เพิ่ม source | ไม่ได้เห็น preview จริงในรอบนี้ จึงไม่อ้างว่าเลือกหรือยืนยัน | ใช้ลูกศร/เส้นแบบเรียบใน fallback ตามที่จำเป็นต่อเหตุผลของภาพ; ช่องว่างคือยังไม่ได้ทดลอง Catalog source จริง |

## หลักฐานและข้อจำกัด

- [Catalog map](../../../docs/CATALOG_USAGE_MAP.md) ใช้เป็นดัชนี candidate และระบุ preview states.
- [HF-113 official details](https://hyperframes.heygen.com/catalog/blocks/code-highlight) อธิบายว่าแถบ highlight กวาดผ่านบรรทัดเป้าหมายและลดความเด่นของบริบท; ตัวอย่างต้นทางระบุ 5 วินาทีที่ 1920×1080. คลิปนี้ปรับลงในกรอบ portrait จึงต้องตรวจ native render ก่อนยืนยันผล.
- Preview browser ที่ใช้กับ Studio ปิดใน Work settings และ localhost preview เคยถูก sandbox ปฏิเสธ; จึงไม่อ้างการสังเกต motion จาก official player.
- `hyperframes lint` ตรวจ source structure เท่านั้น ไม่รับรองการจัดวางหรือ motion.
- หากเปิด native preview ได้ ขั้นต่อไปให้ตรวจ HF-113 และ HF-337 บนเฟรมจริงก่อน production เสียง.

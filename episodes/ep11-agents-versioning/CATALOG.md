# EP11 — ทะเบียนคัดเลือก Catalog (Agents & Versioning API)

อ้างอิง: [CATALOG_USAGE_MAP](../../docs/CATALOG_USAGE_MAP.md), [PLAN](PLAN.md), และ [Workflow](../../docs/WORKFLOW.md)  
สถานะ: แผนการเลือกบล็อก Motion สำหรับ W4 ก่อนสร้าง Sample ใน W5

---

## 1. เกณฑ์การคัดเลือกตามหน้าที่ของซีน

ในคลิป EP11 มี 3 หน้าที่หลักที่ต้องการแอนิเมชันช่วยอธิบาย:
1. **เปรียบเทียบเวอร์ชันที่ใช้งานจริงกับฉบับร่าง (Published v1 vs Draft v2 Comparison)**: ให้เห็นว่าขณะที่แก้ Draft v2 ลูกค้าจริงยังคุยกับ Published v1 อยู่
2. **แสดงการเปลี่ยนแปลงค่า Config ในโค้ด (Code Diff & Highlight)**: ให้เห็นการเปลี่ยน `temperature: 0.2`, `max_tokens: 8192` และ `prompt.system`
3. **แสดงการสลับสถานะเมื่อสั่ง Publish และ Rollback (State Transition & Device Hosting)**: ให้เห็นจังหวะที่ v2 กลายเป็น `published` และจังหวะที่กด `rollback` กลับมาเป็น v1

---

## 2. รายการ Catalog ที่เลือกใช้ตามหน้าที่

| รหัส / ชื่อ Catalog | หน้าที่ในซีน | Beat ที่ใช้ | เหตุผลและข้อจำกัด |
|---|---|---|---|
| **#hf-195 Browser Device Stage** | ครอบภาพหน้าจอจำลอง `APP-AGENT-DRAFT` และ `APP-AGENT-PUBLISH` | b1, b5, b6 | ใช้ host ภาพ raster ของหน้าจัดการเวอร์ชัน Agent |
| **#hf-112 Code Diff (ร่วมกับ #hf-113 Code Highlight Sweep)** | แสดงความต่างของ Config ระหว่างเวอร์ชัน 1 (`max_tokens: 4096`) กับเวอร์ชัน 2 (`temperature: 0.2, max_tokens: 8192`) | b4, b5 | `Code Diff` เป็นหนึ่งใน 3 รายการที่ตรวจ motion บนตัวเล่นแล้ว เหมาะกับการเปรียบเทียบการแก้ Config ของ Agent |
| **#hf-208 State Chip Rail** | แสดงการเปลี่ยนสถานะจาก `Published: v1 | Draft: v2` → `Published: v2` → `Rollback: v1` | b5, b6 | ช่วยให้คนดูเห็นผลของคำสั่ง `/publish` และ `/rollback` ชัดเจน |
| **#hf-072 Marker Highlight** | เน้นความต่างระหว่าง `PATCH /agents/{id}` (แก้ metadata) กับ `POST /agents/{id}/versions` (แก้ prompt/model) | b7, b8 | ป้องกันความสับสนในการเลือกใช้ endpoint |

---

## 3. สิ่งที่ต้องทดสอบใน Sample (W5)

* **การจัดวาง Code Diff บนจอแนวตั้ง 9:16 (`b5`)**: ตรวจสอบความยาวบรรทัด JSON ของ `POST /api/agents/{id}/versions` ให้เห็นทั้งส่วนที่คงเดิมและส่วนที่เปลี่ยนโดยไม่ล้นกรอบ
* **ความต่อเนื่องของการสลับภาพ `APP-AGENT-DRAFT` ไปยัง `APP-AGENT-PUBLISH` (`b5 → b6`)**: ตรวจสอบว่าป้าย `published_version_no` เปลี่ยนจาก `1` เป็น `2` อย่างชัดเจนและอ่านง่ายบนจอมือถือ

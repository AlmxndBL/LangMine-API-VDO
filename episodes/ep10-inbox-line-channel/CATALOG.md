# EP10 — ทะเบียนคัดเลือก Catalog (Inbox API & LINE Channel)

อ้างอิง: [CATALOG_USAGE_MAP](../../docs/CATALOG_USAGE_MAP.md), [PLAN](PLAN.md), และ [Workflow](../../docs/WORKFLOW.md)  
สถานะ: แผนการเลือกบล็อก Motion สำหรับ W4 ก่อนสร้าง Sample ใน W5

---

## 1. เกณฑ์การคัดเลือกตามหน้าที่ของซีน

ในคลิป EP10 มี 3 หน้าที่หลักที่ต้องการแอนิเมชันช่วยอธิบาย:
1. **แสดงหน้าจอมอนิเตอร์รายการเธรดและสถานะ Handover (Device Hosting)**: ให้เห็นรายการแชทจาก LINE พร้อมป้าย `channel_counts` และสถานะแอดมินรับสาย
2. **แสดงการแจ้งเตือนสถานะและป้ายจำนวนแชท (Badges & Thread Stack)**: ให้เห็นว่า `channel_counts` และ `active: true` ทำงานอย่างไร
3. **เน้นขอบเขตความปลอดภัยของ API Key (Highlight & Callout)**: ย้ำว่า API Key อ่านและ Export ได้เท่านั้น ส่วนการตอบกลับ/ควบคุม handover ต้องทำผ่านหน้าเว็บ

---

## 2. รายการ Catalog ที่เลือกใช้ตามหน้าที่

| รหัส / ชื่อ Catalog | หน้าที่ในซีน | Beat ที่ใช้ | เหตุผลและข้อจำกัด |
|---|---|---|---|
| **#hf-195 Browser Device Stage** | ครอบภาพหน้าจอจำลอง `APP-INBOX-THREADS` และ `APP-INBOX-HANDOVER` | b1, b4, b5 | ใช้ host ภาพ raster ของระบบมอนิเตอร์ Inbox หลังบ้าน |
| **#hf-281 Badge Pop** | แสดงป้ายจำนวนเธรดแยกช่องทางจาก `channel_counts` (`LINE: 1`, `Web: 0`) และป้าย `Handover Active` | b4, b5 | ดึงสายตาให้เห็นประโยชน์ของฟิลด์ `channel_counts` และ `active: true` |
| **#hf-196 Code Terminal Run / #hf-113 Code Highlight Sweep** | แสดงคำสั่ง `curl` ดึงเธรด, เช็ก handover และดาวน์โหลด `inbox-export.xlsx` | b4, b5, b6 | แสดงทั้ง JSON response และการส่งออกไฟล์ `.xlsx` ตามตัวอย่างในคู่มือ |
| **#hf-072 Marker Highlight** | ไฮไลต์ข้อจำกัดสำคัญว่า `POST /inbox/reply` และเริ่ม/จบ handover ต้องล็อกอินผ่านเว็บเท่านั้น | b7, b8 | ป้องกันไม่ให้นักพัฒนาเขียนโค้ดยิง endpoint ที่ไม่อนุญาตสำหรับ API Key |

---

## 3. สิ่งที่ต้องทดสอบใน Sample (W5)

* **ความชัดเจนของป้ายสถานะ `active: true` (`expires_in_sec: 1420`) บนภาพ `APP-INBOX-HANDOVER` (`b5`)**: ตรวจสอบว่าคนดูเข้าใจทันทีว่าเมื่อแอดมินรับสาย ตัว AI จะหยุดตอบอัตโนมัติ
* **การจัดวางบล็อกคำสั่ง `curl ... -o inbox-export.xlsx` (`b6`)**: ตรวจสอบขนาดฟอนต์บนจอ 9:16 ให้อ่านชื่อพารามิเตอร์ `format=xlsx&channel=line` ได้ชัดเจน

> อัปเดต 6 พฤศจิกายน 2026: ผู้ใช้ยืนยันลบ EP01 เดิมรวมร่างคืนสินค้าแล้ว และให้เริ่ม ep01-api-introduction ใหม่ตาม workflow งาน active คือ W3 วางแผนจากมุมคนดู ยังไม่เจนภาพ ประกอบ timeline หรือ render ข้อความเกี่ยวกับการพัก EP01 หรือหลักฐานรุ่นเก่าด้านล่างเป็นบริบทก่อนคำสั่งนี้ สถานะปัจจุบันดู README ตอนและแผนรีเซ็ต EP01

# Workspace map

Root: C:/Users/Admin/Desktop/work/gitlab_intern/LangMine-API-VDO
ใช้ workspace เดียวสำหรับซีรีส์ ไม่สร้าง root หรือ agent config ซ้ำต่อคลิป

| ที่เก็บ | หน้าที่ |
|---|---|
| AGENTS.md | คำสั่ง agent ที่เดียว |
| README.md | ทางเข้าเอกสาร |
| langmind-api.md | snapshot เดิม ไม่แก้/คัดลอกซ้ำ |
| docs/PROJECT_BRIEF.md | เป้าหมายและขอบเขตซีรีส์ |
| docs/WORKFLOW.md | ลำดับงานและเกณฑ์ตรวจ |
| docs/STORYBOARD_GUIDELINES.md | กฎออกแบบเรื่อง รายละเอียดซีนและ prompt |
| docs/CATALOG_USAGE_MAP.md | ทะเบียนขอบเขต motion กลาง |
| docs/VIDEO_STYLE_GUIDE.md | ระบบภาพ/ข้อความ/ตัวละคร |
| docs/SKILLS.md | เครื่องมือและที่ติดตั้ง |
| docs/reference/SOURCES.md | หลักฐานและข้อจำกัดของแหล่ง |
| docs/plans/2026-11-06-workspace-foundation.md | สถานะกลางและ next action |
| .agents/skills/langmind-video-producer/ | สกิลผลิตวิดีโออธิบาย API ตามมาตรฐาน EP04-EP11 ครบวงจร พร้อมแม่แบบ |
| ideas/ | คลังไอเดียและ Use Cases สำหรับทำคลิปหรือต่อยอดโซลูชัน |
| shared/assets/brand/ | โลโก้ต้นฉบับและ provenance |
| shared/assets/characters/robot/ | ZIP ต้นฉบับ 44 PNG manifest และ contact sheet |
| episodes/README.md | สารบัญผลงาน |
| episodes/<id>/README.md | สถานะเฉพาะตอน |
| episodes/<id>/inputs, script, assets, references | สร้างเมื่อมีงานจริง แยกข้อมูล บท สื่อและ reference |
| episodes/<id>/demo/ | แอป/API integration เฉพาะเมื่ออยู่ใน scope |
| episodes/<id>/evidence/<run-id>/ | หลักฐานจริงที่ sanitize แล้ว |
| episodes/<id>/video/ | HyperFrames source และ QA ตามเวอร์ชัน |
| episodes/<id>/exports/ | render แยกจาก source |

เก็บ historical evidence เว้นแต่ผู้ใช้ยืนยันลบชัดเจน เช่น รอบรีเซ็ต EP01 นี้
เมื่อถึงงานรายตอนให้ระบุ episode ID ชัดก่อนอ่าน/แก้ เอกสารกลางไม่บังคับ EP01
สำเนา shared ที่ต้องใช้ใน project บันทึกต้นทาง รุ่น/hash และการปรับ ไม่แก้ source กลางเพื่อแก้ตอนเดียว
ไม่สร้าง template engine, shared backend, runtime หรือ empty directories เผื่ออนาคต
สถานะกลางใช้ [แผนหลัก](plans/2026-11-06-workspace-foundation.md) สถานะตอนใช้ README ตอน ไม่ทำรายการสถานะซ้ำทั่วเอกสาร

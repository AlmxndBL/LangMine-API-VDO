# EP06 — ผลตรวจ draft (ฉบับไม่มีเสียง)

วันที่: 9 พฤศจิกายน 2026 (Asia/Bangkok) · ไฟล์: [ep06-knowledge-rag-silent.mp4](ep06-knowledge-rag-silent.mp4)

ภาพหน้าจอแอป โค้ด และคำตอบเป็น **ภาพจำลอง** ไม่ได้เรียก LangMind API จริง และไม่มีตัวเลข latency

## เสียง
- ยังไม่ได้สร้างไฟล์เสียงจริง (ยังไม่ต้องทำเสียงตามคำสั่ง)
- ใช้การประมาณเวลาอ่าน 11 ตัวอักษร/วินาที + ช่องว่าง 0.35 s ต่อประโยค จาก `timing.json`
- เพิ่มเวลา hold สำหรับโค้ดและสถานะ: b4 (2.5 s), b5 (2.0 s), b6 (3.5 s) เพื่อให้อ่านเนื้อหาและ JSON ได้ชัดเจน
- ความยาวรวม: 223.03 s (3:43 นาที) 6,691 เฟรม ที่ 30 fps

## Technical (observed)
| ตรวจ | ผล |
|---|---|
| `npx hyperframes check` | ok: true · 0 errors (ผ่านทุกการตรวจสอบ WCAG AA 77/77, runtime 0 errors) |
| render | `--quality draft` · H.264 1080×1920 30 fps · `ep06-knowledge-rag-silent.mp4` (14.6 MB, MD5: `D582B41AC1E186A469A4AC26D1554F91`) |
| decode | `ffmpeg -i … -f null -` ผ่านครบ |

## Visual (observed)
- b1: Header + device หน้าจอจัดการคลังความรู้ `app-rag-upload.jpg` + Robot `01-question.png` + กล่องคำถาม 3 ข้อ
- b2: ผังภาพรวม 3 ส่วน (ระบบหลังบ้าน ⇄ LangMind Knowledge ⇄ Agent) พร้อมแถบขั้นตอน 1 อัปโหลด → 2 ผูกคลัง → 3 ทดสอบค้นคืน
- b3: การ์ดเตรียมความพร้อม 3 ใบ (Agent ตั้งค่า RAG + ป้ายเตือน 503, API Key 3 สิทธิ์, ระบบหลังบ้าน) พร้อมแถบ spine เริ่มนับเฟส 1
- b4: ขั้นตอนที่ 1 อัปโหลดเอกสาร `POST /api/datasets/{id}/documents/upload` ตอบกลับ 202 pending พร้อมแถบสถานะ pending → processing → indexed ✓ และ Robot `21-carry-books.png`
- b5: ขั้นตอนที่ 2 ผูกคลังเข้ากับ Agent `PUT /api/agents/{id}/datasets` ไฮไลต์ `weight: 1.0`
- b6: ขั้นตอนที่ 3 ทดสอบค้นคืน `POST /api/retrieval/test` ส่งคำค้น “โปรโมชันอเมริกาโน่” ได้ score 0.84 พร้อมหน้าจอสลับเป็น `app-rag-test.jpg` และ Robot `11-reading.png`
- b7: การ์ดต่อยอด 3 ใบ (เช็กคุณภาพก่อนเปิดจริง, upload-batch ≤ 50MB / url / text / crawl, score = ค่าความคล้าย) + Robot `01-question.png`
- b8: สรุป 3 ขั้นตอน พร้อม Robot `10-thumbs-up.png`
- b9: ป้ายผู้สนับสนุน LangMind (`langmind.in.th`) ชัดเจน

## ตารางเวลา
- ดูรายละเอียดเวลาเริ่ม-จบรายประโยคได้ที่ [SILENT-TIMING.md](SILENT-TIMING.md)

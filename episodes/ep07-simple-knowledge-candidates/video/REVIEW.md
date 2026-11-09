# EP07 — ผลตรวจ draft (ฉบับไม่มีเสียง)

วันที่: 9 พฤศจิกายน 2026 (Asia/Bangkok) · ไฟล์: [ep07-simple-knowledge-candidates-silent.mp4](ep07-simple-knowledge-candidates-silent.mp4)

ภาพหน้าจอแอป โค้ด และคำตอบเป็น **ภาพจำลอง** ไม่ได้เรียก LangMind API จริง และไม่มีตัวเลข latency

## เสียง
- ยังไม่ได้สร้างไฟล์เสียงจริง (ยังไม่ต้องทำเสียงตามคำสั่ง)
- ใช้การประมาณเวลาอ่าน 11 ตัวอักษร/วินาที + ช่องว่าง 0.35 s ต่อประโยค จาก `timing.json`
- เพิ่มเวลา hold สำหรับโค้ดและสถานะ: b4 (2.5 s), b5 (2.0 s), b6 (3.0 s) เพื่อให้อ่านเนื้อหาและ JSON ได้ชัดเจน
- ความยาวรวม: 219.53 s (3:39 นาที) 6,586 เฟรม ที่ 30 fps

## Technical (observed)
| ตรวจ | ผล |
|---|---|
| `npx hyperframes check` | ok: true · 0 errors (ผ่านทุกการตรวจสอบ WCAG AA, runtime 0 errors) |
| render | `--quality draft` · H.264 1080×1920 30 fps · `ep07-simple-knowledge-candidates-silent.mp4` (13.7 MB, MD5: `5337708D2609D291C77ACF8E058F3557`) |
| decode | `ffmpeg -i … -f null -` ผ่านครบ |

## Visual (observed)
- b1: Header + device หน้าจอตั้งกฎคำตอบด่วน `app-faq-rule.jpg` + Robot `06-thinking.png` + กล่องคำถาม 3 ข้อ
- b2: ผังภาพรวม 2 ด่าน (ด่านหน้า Simple Knowledge ตอบด่วน vs ด่านคัดกรอง Knowledge Candidates) + แถบขั้นตอน 1 ตั้งกฎด่วน → 2 ตรวจอนุมัติ → 3 ดันเข้า Dataset
- b3: การ์ดเตรียมความพร้อม 3 ใบ (Agent ID & Dataset ID, API Key สิทธิ์ knowledge:write/read, ระบบหลังบ้าน) พร้อมแถบ spine เริ่มนับเฟส 1
- b4: ขั้นตอนที่ 1 ตั้งกฎคำตอบด่วน `POST /api/simple-knowledge` (`match_type: "exact"`, keyword: "เวลาทำการ") ตอบทันทีไม่เรียก LLM + Robot `05-point-up.png`
- b5: ขั้นตอนที่ 2 ตรวจอนุมัติ `POST /api/knowledge-candidates/review` ไฮไลต์ `"action": "approve"` เปลี่ยนสถานะเป็น approved
- b6: ขั้นตอนที่ 3 ดันเข้า Dataset `POST /api/knowledge-candidates/{id}/promote` ได้ `promoted: ["kc_6b2e"]` พร้อมหน้าจอสลับเป็น `app-candidate-promote.jpg` และ Robot `12-clipboard.png`
- b7: การ์ดข้อควรรู้ 3 ใบ (match_type 3 แบบ exact/contains/pattern, pattern ต้องมี {variable} ขาดได้ 422 คีย์ซ้ำได้ 409, เฉพาะ approved เท่านั้นที่เข้าคลัง ส่วนที่เหลือ skipped)
- b8: สรุป 3 ขั้นตอน พร้อม Robot `04-open-arms.png`
- b9: ป้ายผู้สนับสนุน LangMind (`langmind.in.th`) ชัดเจน

## ตารางเวลา
- ดูรายละเอียดเวลาเริ่ม-จบรายประโยคได้ที่ [SILENT-TIMING.md](SILENT-TIMING.md)

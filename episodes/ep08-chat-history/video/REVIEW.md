# EP08 video — ผลตรวจ draft & silent render (Chat Conversations & History API)

วันที่: 9 พฤศจิกายน 2026 (Asia/Bangkok) · ไฟล์: [ep08-chat-history-silent.mp4](ep08-chat-history-silent.mp4) · ขนาด 24.1 MB

ภาพหน้าจอแอป โค้ด และข้อมูลประวัติแชทเป็น **ภาพจำลอง** อ้างอิงโครงสร้างและตัวอย่างจากคู่มือ [langmind-api.md](../../../langmind-api.md)

## เสียง & Timing
- ฉบับนี้สร้างเป็น silent draft video ("ยังไม่ต้องทำเสียง") ตามข้อกำหนดของโปรเจกต์
- การจับเวลาฉากและข้อความซับไตเติลคำนวณจากอัตราอ่านจำลอง 11 ตัวอักษร/วินาที (+0.35s gap ต่อประโยค) และเพิ่ม `"hold": 2.5` ให้กับ beat โค้ด (b4, b5, b6) เพื่อให้คนดูมีเวลาอ่านหน้าจอและโค้ด JSON ชัดเจน
- ความยาวรวม: 238.37 วินาที (3:58 นาที) 7,151 เฟรม (30 fps)
- ตารางเวลารายประโยคและข้อความสำหรับอัดเสียงอยู่ใน [SILENT-TIMING.md](SILENT-TIMING.md) และ [VOICE-SCRIPT.md](VOICE-SCRIPT.md)

## Technical Gate (observed)
| รายการตรวจ | ผลการตรวจ |
|---|---|
| `npx hyperframes check` | **Passed (ok: true)** · 0 errors across Lint, Runtime, Layout, Motion, Contrast |
| Contrast Accessibility | 86/86 text checks pass WCAG AA (พื้นหลัง `#f8f4e9` / กล่องโค้ด `#1f2a25` / ซับ `#23382e`) |
| Render Engine | `--quality draft` · H.264 1080×1920 30 fps · 7,151 เฟรม · 238.37 s · ไม่มีแทร็กเสียง |
| Artifact output | `ep08-chat-history-silent.mp4` (24.1 MB) |

## Visual Gate (observed)
- **b1 (ระบบประวัติแชท ทำได้ยังไง?)**: กรอบ Device แสดงภาพจำลอง `assets/app-history-list.jpg`, Robot `01-question.png`, ป้ายคำถาม และชิป 3 ข้อ (เตรียมอะไร · เชื่อมตรงไหน · ใช้ผลยังไง)
- **b2 (ภาพรวม 3 ส่วน · 3 ขั้นตอน)**: ผังระบบระหว่างหน้าเว็บแชท ⇄ หลังบ้าน ⇄ LangMind พร้อม 3 Step Pills (1 รายการห้อง · 2 ข้อความ · 3 แก้ไข/ลบ)
- **b3 (เตรียม 3 อย่าง)**: การ์ดเน้น `agent_id` (Query Param บังคับทุกเส้น), API Key สิทธิ์ `chat:invoke` (ตัวเดียวครบ), และระบบหลังบ้านเก็บ Key
- **b4 (เชื่อมครั้งที่ 1 · ดึงรายการห้อง)**: Minimap + Live API Panel `GET /api/chat/conversations` แสดงรายการ `items` และไฮไลต์ `next_cursor`
- **b5 (เชื่อมครั้งที่ 2 · โหลดข้อความ)**: Minimap + Live API Panel `GET .../messages` แสดงข้อความเรียงเก่า → ใหม่ พร้อม `citations` และ tokens
- **b6 (เชื่อมครั้งที่ 3 · เปลี่ยนชื่อ/ปิด/ลบ)**: Live API Panel `PATCH .../conversations/{id}` สลับแสดงหน้าจอจำลอง `assets/app-history-detail.jpg` และ Robot `12-clipboard.png`
- **b7 (ใช้ผล)**: การ์ด 3 ใบ แสดงประวัติแชท, ปุ่มหยุดตอบ `POST /stop`, และดาวน์โหลดไฟล์ `GET /generated-files` พร้อม Robot `01-question.png`
- **b8 (สรุป)**: สรุป 3 กล่อง เตรียม → เชื่อม 3 จุด → ใช้ผล พร้อม Robot `10-thumbs-up.png`
- **b9 (ผู้สนับสนุน)**: โลโก้ LangMind จริง `assets/langmind-logo.png` + `langmind.in.th` และชิปแท็ก

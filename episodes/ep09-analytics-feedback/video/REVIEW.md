# EP09 video — ผลตรวจ draft & silent render (Analytics & Feedback API)

วันที่: 9 พฤศจิกายน 2026 (Asia/Bangkok) · ไฟล์: [ep09-analytics-feedback-silent.mp4](ep09-analytics-feedback-silent.mp4)

ภาพหน้าจอแอป โค้ด และข้อมูลสถิติเป็น **ภาพจำลอง (ตัวเลขตัวอย่าง)** อ้างอิงโครงสร้างและตัวอย่างจากคู่มือ [langmind-api.md](../../../langmind-api.md)

## เสียง & Timing
- ฉบับนี้สร้างเป็น silent draft video ("ยังไม่ต้องทำเสียง") ตามข้อกำหนดของโปรเจกต์
- การจับเวลาฉากและข้อความซับไตเติลคำนวณจากอัตราอ่านจำลอง 11 ตัวอักษร/วินาที (+0.35s gap ต่อประโยค) และเพิ่ม `"hold": 2.5` ให้กับ beat โค้ด (b4, b5, b6) เพื่อให้คนดูมีเวลาอ่านหน้าจอและโค้ด JSON ชัดเจน
- ความยาวรวม: 216.47 วินาที (3:36 นาที) 6,494 เฟรม (30 fps)
- ตารางเวลารายประโยคและข้อความสำหรับอัดเสียงอยู่ใน [SILENT-TIMING.md](SILENT-TIMING.md) และ [VOICE-SCRIPT.md](VOICE-SCRIPT.md)

## Technical Gate (observed)
| รายการตรวจ | ผลการตรวจ |
|---|---|
| `npx hyperframes check` | **Passed (ok: true)** · 0 errors across Lint, Runtime, Layout, Motion, Contrast |
| Contrast Accessibility | 84/84 text checks pass WCAG AA (พื้นหลัง `#f8f4e9` / กล่องโค้ด `#1f2a25` / ซับ `#23382e`) |
| Render Engine | `--quality draft` · H.264 1080×1920 30 fps · 6,494 เฟรม · 216.47 s · ไม่มีแทร็กเสียง |
| Artifact output | `ep09-analytics-feedback-silent.mp4` |

## Visual Gate (observed)
- **b1 (วัดผลแชท AI คุมงบ & คุณภาพยังไง?)**: กรอบ Device แสดงภาพจำลอง `assets/app-chat-feedback.jpg`, Robot `01-question.png`, ป้ายคำถาม และชิป 3 ข้อ (เตรียมอะไร · เชื่อมตรงไหน · ใช้ผลยังไง)
- **b2 (ภาพรวม 3 ส่วน · 3 จังหวะ)**: ผังระบบระหว่างหน้าแชทของลูกค้า ⇄ หลังบ้าน ⇄ LangMind พร้อม 3 Step Pills (1 ส่ง user_id · 2 feedback · 3 analytics)
- **b3 (เตรียม 3 อย่าง)**: การ์ดเน้น `user_id` และ `message_id`, API Key (2 สิทธิ์: `chat:invoke` + `analytics:read`), และระบบหลังบ้านเก็บ Key
- **b4 (เชื่อมครั้งที่ 1 · ส่ง user_id)**: Minimap + Live API Panel `POST /api/chat/message` ไฮไลต์ฟิลด์ `user_id` และคำเตือนเรื่องนับผู้ใช้แยกคน
- **b5 (เชื่อมครั้งที่ 2 · เก็บ feedback)**: Minimap + Live API Panel `POST .../feedback` ไฮไลต์ `rating: 1` (ไม่ใช่สเกล 1-5) และส่ง comment เสริมได้ คืน `204`
- **b6 (เชื่อมครั้งที่ 3 · ดึงสถิติ)**: Live API Panel `GET /api/analytics/agents/{id}` สลับแสดงหน้าจอจำลอง Dashboard `assets/app-analytics-dashboard.jpg` และ Robot `11-reading.png`
- **b7 (ใช้ผล)**: การ์ด 3 ใบ คุมงบค่า Token, ติดตามคุณภาพคำตอบ, และวิเคราะห์ช่องทาง Web/LINE พร้อม Robot `14-heart.png`
- **b8 (สรุป)**: สรุป 3 กล่อง เตรียม → เชื่อม 3 จังหวะ → ใช้ผล พร้อม Robot `10-thumbs-up.png`
- **b9 (ผู้สนับสนุน)**: โลโก้ LangMind จริง `assets/langmind-logo.png` + `langmind.in.th` และชิปแท็ก

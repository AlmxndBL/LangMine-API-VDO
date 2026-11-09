# EP08 — Chat Conversations & History API: ทำระบบประวัติแชท โหลดข้อความเก่า และจัดการห้องสนทนา

Episode ID: `ep08-chat-history`  
อัปเดต 9 พฤศจิกายน 2026 (Asia/Bangkok)

## สถานะปัจจุบัน: W6 — Render ฉบับภาพไม่มีเสียง (Silent Draft) สำเร็จ ตรวจไฟล์แล้ว รอผู้ใช้ตรวจภาพก่อนทำเสียง

- **ไฟล์วิดีโอ**: [ep08-chat-history-silent.mp4](video/ep08-chat-history-silent.mp4) (1080×1920, 30 fps, H.264, 238.37 วินาที, 7,151 เฟรม, 24.14 MB)
- **ผลตรวจทางเทคนิค**: [REVIEW.md](video/REVIEW.md) (`npx hyperframes check` 0 errors, decode ผ่าน 100%)
- **ตารางเวลาประโยค**: [SILENT-TIMING.md](video/SILENT-TIMING.md) (คำนวณตามอัตราอ่าน 11 ตัวอักษร/วินาที + hold โค้ด/ตาราง)
- **โครงเรื่องหลัก**: ใช้โครงเล่าจากมุมคนดู 9 beat แบบ EP04 v3 (**เตรียม → เชื่อม 3 ครั้ง → ใช้ผล** และปิดท้ายด้วยผู้สนับสนุน LangMind)
- **ภาพประกอบ**: นำเข้า `app-history-list.jpg` และ `app-history-detail.jpg` ไว้ใน `video/assets/` เรียบร้อยแล้ว
- **หลักฐาน API**: อ้างอิงจาก [langmind-api.md](../../langmind-api.md) หมวด `Chat API` (Conversations, Messages, PATCH/DELETE, Stop Generation & Generated Files)

## เอกสารประจำตอน
| เอกสาร | หน้าที่ | สถานะ |
|---|---|---|
| [README.md](README.md) | สถานะภาพรวมของตอน และลำดับถัดไป | อัปเดตล่าสุด (W6 Silent Draft Rendered) |
| [PLAN.md](PLAN.md) | แผน W3: โจทย์คนดู ขอบเขต use case โครงเรื่อง 9 beat และ Claim Ledger | จัดทำแล้ว |
| [SCRIPT.md](SCRIPT.md) | บทพากย์ภาษาพูด 9 Beats ข้อความเน้นบนจอ และ Claim Ledger | จัดทำแล้ว |
| [CATALOG.md](CATALOG.md) | ทะเบียนคัดเลือกบล็อก Motion ตามหน้าที่ของแต่ละ Beat และจุดตรวจ W5 | จัดทำแล้ว |
| [STORYBOARD.md](STORYBOARD.md) | Storyboard ราย Beat (b1–b9) แบบกำหนดหน้าจอ Mockup (`APP-HISTORY-LIST` / `APP-HISTORY-DETAIL`) และ Prompt | จัดทำแล้ว |
| [video/REVIEW.md](video/REVIEW.md) | บันทึกผลตรวจฉบับ draft และรายละเอียด beat b1–b9 | บันทึกแล้ว |
| [video/SILENT-TIMING.md](video/SILENT-TIMING.md) | ตารางเวลาอ่านรายประโยคสำหรับฉบับไม่มีเสียง | บันทึกแล้ว |

## ลำดับถัดไปเมื่อเริ่มทำเสียง (Next Actions — Voiceover Phase)
1. **Sample เสียงพากย์**: เจนหรือบันทึกตัวอย่างเสียงพากย์ช่วงตัวแทน (`b4–b6`) ให้ผู้ใช้ฟังเลือก
2. **สร้างไฟล์เสียงเต็มตอน**: บันทึกไฟล์เสียงแยกแต่ละ Beat (`b1.mp3` ถึง `b9.mp3`) ตามสคริปต์ [VOICE-SCRIPT.md](video/VOICE-SCRIPT.md)
3. **Re-render พร้อมเสียงจริง**: นำไฟล์เสียงเข้าใส่ใน `video/assets/` แล้วรัน `node build.mjs` และ `npx hyperframes render` เพื่อได้ฉบับสมบูรณ์มีเสียง

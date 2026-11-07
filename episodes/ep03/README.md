# EP03 — ตอบทันใจ ไม่ต้องรอโหลด ด้วย Streaming API (SSE)

Episode ID: `ep03-streaming-chat`  
อัปเดต: 7 พฤศจิกายน 2026 (Asia/Bangkok)

---

## 1. สถานะปัจจุบัน: W5 Sample ผ่านการตรวจรับ ➜ รอเลือกเสียงเพื่อเข้าสู่ W6

| ขั้นตอน (Workflow) | สถานะ | เอกสาร/หลักฐาน |
|---|---|---|
| **W3 ออกแบบเรื่องและขอบเขต** | **ผ่านการอนุมัติ (Done)** | [plan/PLAN.md](plan/PLAN.md) |
| **W4 Storyboard & แบบหน้าจอ** | **จัดทำแล้วเสร็จ (Done)** | • [SCRIPT.md](SCRIPT.md)<br>• [CATALOG.md](CATALOG.md)<br>• [STORYBOARD.md](STORYBOARD.md) |
| **W5 ภาพนิ่ง & ตัวอย่างเสียง** | **ผ่านการตรวจรับ (Done)** | • [evidence/ASSETS.md](evidence/ASSETS.md)<br>• [evidence/REVIEW-sample.md](evidence/REVIEW-sample.md)<br>• [evidence/mobile-frames.jpg](evidence/mobile-frames.jpg) |
| **W6 ประกอบคลิป HyperFrames** | **รอดำเนินการ (Next Action)** | ประกอบโค้ด HTML/JS และยึด Timing ตามเสียงจริง |
| **W7 ตรวจส่งมอบ 4 ประตู** | ยังไม่เริ่ม | รอการเรนเดอร์ MP4 |

---

## 2. สิ่งที่ส่งมอบใน W5 (Sample Phase)
1. **ภาพ Raster UI ตัวแทนตามสเปก W4:**
   - `scr-01-chat-loading.png` (สถานะ Waiting / Loading ค้าง)
   - `scr-02-chat-streaming.png` (สถานะ Streaming SSE กำลังพิมพ์)
   - คงตำแหน่ง Geometry และขนาดฟอนต์ Sarabun 100% ต่อเนื่องกัน
2. **หลักฐานการตรวจขนาดจอมือถือ:**
   - [evidence/mobile-frames.jpg](evidence/mobile-frames.jpg) ย่อขนาดตรวจพบว่าอ่านออกคมชัด
3. **ทะเบียนสินทรัพย์ (Asset Ledger):**
   - [evidence/ASSETS.md](evidence/ASSETS.md) บันทึก Hash, ขนาด และที่มาของไฟล์ทั้งหมด
4. **ข้อกำหนด Voice Audition:**
   - [evidence/REVIEW-sample.md](evidence/REVIEW-sample.md) คัดเลือกย่อหน้าตัวแทน และคู่มือออกเสียงศัพท์เทคนิค

---

## 3. Next Action สำหรับการก้าวเข้าสู่ W6
- ผู้ใช้รับรองตัวอย่างภาพใน [evidence/mobile-frames.jpg](evidence/mobile-frames.jpg)
- เลือกลักษณะเสียงพากย์ที่ต้องการ (เช่น เสียงหญิงนุ่มนวล หรือเสียงชายเป็นกันเอง)
- เริ่มประกอบซอร์สโค้ดโปรเจกต์ HyperFrames ในโฟลเดอร์ `video/`

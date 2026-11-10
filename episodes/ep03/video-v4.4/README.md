# EP03 v4.4 — Chat API ใน LangMind (ต่อแชตบอต AI เข้ากับแอป)

อัปเดต: 10 พฤศจิกายน 2026 (Asia/Bangkok)  
สถานะ: **Silent Draft (183.63s, 5,509 frames, 1080×1920 @ 30fps) พร้อมส่งตรวจภาพและจังหวะ**

---

## 1. ผลลัพธ์และสื่อสำหรับตรวจสอบ

- **วิดีโอตัวอย่าง (Silent Draft MP4)**: [ep03-v4.4-silent.mp4](renders/ep03-v4.4-silent.mp4)  
  *(ความละเอียด 1080×1920, 30 fps, H.264 High Profile, ความยาว 183.63 วินาที ไม่มีเสียง)*
- **ภาพสรุปทั้ง 9 ฉาก (QA Contact Sheet)**: [qa-contact-sheet-v4.4.png](renders/qa-contact-sheet-v4.4.png)
- **รายงานการตรวจสอบคุณภาพ**: [REVIEW.md](REVIEW.md)
- **ผังกำหนดเวลาอ่าน**: [SILENT-TIMING.md](SILENT-TIMING.md)
- **บทพากย์และซับไตเติล**: [SCRIPT.md](SCRIPT.md) และ [VOICE-SCRIPT.md](VOICE-SCRIPT.md)

---

## 2. แกนเรื่องใหม่ของ EP03 v4.4

ถอดแบบโครงสร้าง 9 Beat และธีม **Editorial Paper & Sage Ink** ตามมาตรฐานความสำเร็จของ `.agents` (langmind-video-producer):

* **Use Case**: ผู้ช่วย AI ตอบคำถามบริการลูกค้าในโมบายล์แอป (Customer Service Assistant)
* **ปัญหา (b1)**: แชตบอตทั่วไปตอบช้า ต้องรอโหลดทั้งประโยค หรือคุยต่อเนื่องแล้วลืมเรื่องเดิม
* **สถาปัตยกรรม (b2)**: แบ่ง 3 ส่วนชัดเจน (แอปมือถือ ⇄ เซิร์ฟเวอร์หลังบ้าน ⇄ LangMind Chat API)
* **สิ่งที่ต้องเตรียม (b3)**: `agent_id` ที่เปิดใช้งานแล้ว, API Key สิทธิ์ `chat:invoke`, และเซิร์ฟเวอร์หลังบ้านสำหรับเก็บกุญแจปลอดภัย
* **เชื่อมครั้งที่ 1 (b4)**: ยิง `POST /api/chat/message` พร้อม `conversation_id: null` เพื่อเปิดห้องใหม่ และรับ `conversation_id` ประจำห้องจาก event `message_start`
* **เชื่อมครั้งที่ 2 (b5)**: สตรีมคำตอบสดแบบ Real-time ทีละคำผ่าน SSE events `message` จนถึง `message_end` พร้อมทางเลือก Blocking (`/blocking`)
* **เชื่อมครั้งที่ 3 (b6)**: ลูกค้าถามต่อหาส่วนลด โดยส่ง `conversation_id` เดิมไปด้วย AI จำบริบทเดิมได้ทันที
* **นำผลไปใช้ & ข้อควรระวัง (b7)**: ส่ง `user_id` เพื่อนับสถิติจริง, สั่งหยุดสตรีมด้วย `/stop`, ดึงประวัติด้วย `/messages`, และเช็ก `message_end` เสมอ
* **สรุป (b8)**: 3 เสาหลัก (เตรียม → เชื่อม 3 ครั้ง → ใช้ผล)
* **ผู้สนับสนุน (b9)**: โลโก้ LangMind + เว็บไซต์ `langmind.in.th`

---

## 3. เอกสารและไฟล์งานประจำรุ่น

- [PLAN.md](PLAN.md) — แผนงาน W3: โจทย์คนดู, แกนเรื่อง, และ Claim Ledger
- [SCRIPT.md](SCRIPT.md) — บทพากย์ 9 Beat, ซับไตเติล, และคำศัพท์เทคนิค
- [STORYBOARD.md](STORYBOARD.md) — รายละเอียดองค์ประกอบภาพและแอนิเมชันราย Beat
- [CATALOG.md](CATALOG.md) — ทะเบียนชิ้นส่วน Motion และจุดตรวจ W5
- [ASSETS.md](ASSETS.md) — ทะเบียนและขนาดไฟล์ Assets ทั้งหมด
- [build.mjs](build.mjs) — คอมไพเลอร์สร้าง `index.html` สำหรับ HyperFrames
- [build_screens.py](build_screens.py) — สคริปต์สร้างภาพจำลองแชต Raster (1440×1800 px)
- [render_silent.py](render_silent.py) — สคริปต์ Render MP4 และ Contact Sheet

---

## 4. วิธีทดสอบและสร้างซ้ำ

```powershell
# คอมไพล์ HTML และ Timing
node episodes/ep03/video-v4.4/build.mjs

# เจนภาพจำลองหน้าจอแชต
python episodes/ep03/video-v4.4/build_screens.py

# Render วิดีโอ Silent Draft
python episodes/ep03/video-v4.4/render_silent.py
```

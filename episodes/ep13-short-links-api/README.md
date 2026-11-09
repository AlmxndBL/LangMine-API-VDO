# EP13 — Short Links API: ลิงก์โปรของร้าน ย่อลิงก์และนับคลิกเอง

**สถานะ: W5 — draft v1 (12 ช่วง ~3:51) มีภาพและซับครบ ยังไม่มีเสียงพากย์** · ใช้ Short Links API ครบทุก endpoint: usage, สร้าง + ตัวเลือก, รายการ/อ่าน/แก้/ลบ, สถิติลิงก์เดียว/ภาพรวม/CSV, error 3 รหัส

- วิดีโอ draft (ไม่มีเสียง เวลาประมาณจากบท): [video/ep13-short-links-draft-v1.mp4](video/ep13-short-links-draft-v1.mp4) · ผลตรวจ: [video/REVIEW.md](video/REVIEW.md)

- แผน คนดู โครงเรื่อง: [PLAN.md](PLAN.md)
- บทพากย์ราย beat + claim ledger อ้างบรรทัดคู่มือ: [SCRIPT.md](SCRIPT.md)
- Storyboard ราย beat + สเปกหน้าจอจำลอง: [STORYBOARD.md](STORYBOARD.md)
- บล็อก motion ที่ใช้ตามหน้าที่ซีน: [CATALOG.md](CATALOG.md)
- วิดีโอ: [video/](video/) — ใช้ engine เดียวกับ EP12
  - บท/ซับ: [video/timing.json](video/timing.json) · บทสำหรับเสียง: [video/VOICE-SCRIPT.md](video/VOICE-SCRIPT.md)
  - เฟรมขนาดมือถือ: [video/evidence/draft-v1-mobile-frames-1.jpg](video/evidence/draft-v1-mobile-frames-1.jpg), [-2.jpg](video/evidence/draft-v1-mobile-frames-2.jpg)
  - สถานะโปรเจกต์ HyperFrames (ผลตรวจ/การ render ที่ CLI บันทึก): `video/.hyperframes/`
  - ภาพหน้าจอจำลอง (ทำจากโค้ด): `video/assets/app-sl-*.jpg` · ต้นฉบับ HTML: [video/mockups/](video/mockups/)

## ลำดับถัดไป (Next Actions)
1. ตรวจบทใน `video/VOICE-SCRIPT.md` และภาพตัวอย่าง ถ้าจะแก้ ให้แก้ก่อนสร้างเสียง
2. สร้างเสียง: ในโฟลเดอร์ `video/` รัน `python make-voice-samples.py` (Niwat −16%) หรือให้คนพากย์อ่านจาก VOICE-SCRIPT แล้ววางไฟล์ `assets/voice/b1.wav` … `b12.wav`
3. `node build.mjs` → `npx hyperframes check` → `npx hyperframes render --quality draft`
4. ฟังตรวจ บันทึกผลใน `video/REVIEW.md` แล้ว render ฉบับส่งมอบ

## แก้ภาพหน้าจอจำลอง
แก้ไฟล์ใน `video/mockups/*.html` แล้วถ่ายเป็นภาพ 1440×1800 เช่น
`chrome --headless=new --hide-scrollbars --window-size=1440,1800 --screenshot=campaign.png video/mockups/campaign.html` แล้วแปลงเป็น `video/assets/app-sl-campaign.jpg`

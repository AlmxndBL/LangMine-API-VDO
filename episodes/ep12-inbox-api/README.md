# EP12 — Inbox API: ทำหน้ากล่องแชทของร้านเอง

**สถานะ: W5 — draft v1 (11 ช่วง ~3:08) มีภาพและซับครบ ยังไม่มีเสียงพากย์** · ใช้ Inbox API ครบ: รายการแชท + search, ข้อความ + cursor, handover 2 สถานะ, export

- วิดีโอ draft (ไม่มีเสียง เวลาประมาณจากบท): [video/ep12-inbox-draft-v1.mp4](video/ep12-inbox-draft-v1.mp4) · ผลตรวจ: [video/REVIEW.md](video/REVIEW.md)

- แผน คนดู โครงเรื่อง: [PLAN.md](PLAN.md)
- บทพากย์ราย beat + claim ledger อ้างบรรทัดคู่มือ: [SCRIPT.md](SCRIPT.md)
- Storyboard ราย beat + สเปกหน้าจอจำลอง: [STORYBOARD.md](STORYBOARD.md)
- บล็อก motion ที่ใช้ตามหน้าที่ซีน: [CATALOG.md](CATALOG.md)
- วิดีโอ: [video/](video/) — ใช้ engine เดียวกับ EP04 video-v3
  - บท/ซับ: [video/timing.json](video/timing.json) · บทสำหรับเสียง: [video/VOICE-SCRIPT.md](video/VOICE-SCRIPT.md)
  - ภาพตัวอย่างทุกฉาก (ยังไม่มีเสียง): [video/evidence/no-voice-frames-1.jpg](video/evidence/no-voice-frames-1.jpg), [no-voice-frames-2.jpg](video/evidence/no-voice-frames-2.jpg)
  - สถานะโปรเจกต์ HyperFrames (ผลตรวจ/การ render ที่ CLI บันทึก): `video/.hyperframes/`
  - ภาพหน้าจอจำลอง (ทำจากโค้ด): `video/assets/app-inbox-*.jpg` · ต้นฉบับ HTML: [video/mockups/](video/mockups/)

## ลำดับถัดไป (Next Actions)
1. ตรวจบทใน `video/VOICE-SCRIPT.md` และภาพตัวอย่าง ถ้าจะแก้ ให้แก้ก่อนสร้างเสียง
2. สร้างเสียง: ในโฟลเดอร์ `video/` รัน `python make-voice-samples.py` (Niwat −16%) หรือให้คนพากย์อ่านจาก VOICE-SCRIPT แล้ววางไฟล์ `assets/voice/b1.wav` … `b11.wav`
3. `node build.mjs` → `npx hyperframes check` → `npx hyperframes render --quality draft`
4. ฟังตรวจ บันทึกผลใน `video/REVIEW.md` แล้ว render ฉบับส่งมอบ

## แก้ภาพหน้าจอจำลอง
แก้ไฟล์ใน `video/mockups/*.html` แล้วถ่ายเป็นภาพ 1440×1800 เช่น
`chrome --headless=new --window-size=1440,1800 --screenshot=inbox.png video/mockups/inbox.html` แล้วแปลงเป็น `video/assets/app-inbox-inbox.jpg`

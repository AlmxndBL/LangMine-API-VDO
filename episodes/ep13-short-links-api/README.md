# EP13 — Short Links API: ลิงก์โปรของร้าน ย่อลิงก์และนับคลิกเอง

**สถานะ: W6 — v1 มีเสียงพากย์ (12 ช่วง 3:31) รอฟังตรวจ** · ใช้ Short Links API ครบทุก endpoint: usage, สร้าง + ตัวเลือก, รายการ/อ่าน/แก้/ลบ, สถิติลิงก์เดียว/ภาพรวม/CSV, error 3 รหัส

- วิดีโอ v1 มีเสียง: [video/ep13-short-links-v1.mp4](video/ep13-short-links-v1.mp4) · draft เดิมไม่มีเสียง: [video/ep13-short-links-draft-v1.mp4](video/ep13-short-links-draft-v1.mp4) · ผลตรวจ: [video/REVIEW.md](video/REVIEW.md)

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
1. ฟังตรวจ `video/ep13-short-links-v1.mp4` (เสียง + ซับ + จังหวะภาพ) แล้วจดจุดที่ต้องแก้ใน `video/REVIEW.md`
2. ถ้าแก้บท: แก้ `video/timing.json` → สร้างเสียงใหม่ด้วย `python make-voice-samples.py` (ได้ทั้ง `.wav` และ `.segments.json`) → `node build.mjs` → `npx hyperframes check` → render
3. ผ่านแล้ว render ฉบับส่งมอบ (`--quality high`)

จุดตัดซับมาจาก `video/assets/voice/<beat>.segments.json` — ชุดนี้สร้างจากการถอดเสียง (Whisper) เทียบกับบท เพราะไฟล์เสียงที่ได้มาไม่มี `.segments.json` (รายละเอียดใน `video/REVIEW.md`) ถ้าสร้างเสียงใหม่ด้วยสคริปต์ จะได้ไฟล์นี้แบบแม่นยำแทน

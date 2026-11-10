# EP12 — Inbox API: ทำหน้ากล่องแชทของร้านเอง

**สถานะ: W6 — v1 มีเสียงพากย์ (11 ช่วง 2:52) รอฟังตรวจ** · ใช้ Inbox API ครบ: รายการแชท + search, ข้อความ + cursor, handover 2 สถานะ, export

- วิดีโอ v1 มีเสียง: [video/ep12-inbox-v1.mp4](video/ep12-inbox-v1.mp4) · draft เดิมไม่มีเสียง: [video/ep12-inbox-draft-v1.mp4](video/ep12-inbox-draft-v1.mp4) · ผลตรวจ: [video/REVIEW.md](video/REVIEW.md)

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
1. ฟังตรวจ `video/ep12-inbox-v1.mp4` (เสียง + ซับ + จังหวะภาพ) แล้วจดจุดที่ต้องแก้ใน `video/REVIEW.md`
2. ถ้าแก้บท: แก้ `video/timing.json` → สร้างเสียงใหม่ด้วย `python make-voice-samples.py` (ได้ทั้ง `.wav` และ `.segments.json`) → `node build.mjs` → `npx hyperframes check` → render
3. ผ่านแล้ว render ฉบับส่งมอบ (`--quality high`)

จุดตัดซับมาจาก `video/assets/voice/<beat>.segments.json` — ชุดนี้สร้างจากการถอดเสียง (Whisper) เทียบกับบท เพราะไฟล์เสียงที่ได้มาไม่มี `.segments.json` (รายละเอียดใน `video/REVIEW.md`) ถ้าสร้างเสียงใหม่ด้วยสคริปต์ จะได้ไฟล์นี้แบบแม่นยำแทน

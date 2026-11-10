# EP14 — Errors: อ่าน error ให้เป็น รับมือให้ถูก

**สถานะ: W6 — v1 มีเสียงพากย์ (11 ช่วง 2:24) รอฟังตรวจ** · ครอบคลุมหมวด Errors ในคู่มือครบ: error envelope, code ทั้ง 10 ตัว (401/403/404/422/429 + Voice 5 ตัว), การรับมือ 3 กลุ่ม และการเอาไปใช้ในระบบ · เรื่องลิมิตและโควตาอยู่ใน [EP15](../ep15-rate-limit-quota/README.md)

- วิดีโอ v1 มีเสียง: [video/ep14-errors-v1.mp4](video/ep14-errors-v1.mp4) · draft เดิมไม่มีเสียง: [video/ep14-errors-draft-v1.mp4](video/ep14-errors-draft-v1.mp4) · ผลตรวจ: [video/REVIEW.md](video/REVIEW.md)

- แผน คนดู โครงเรื่อง: [PLAN.md](PLAN.md)
- บทพากย์ราย beat + claim ledger: [SCRIPT.md](SCRIPT.md)
- Storyboard + สเปกหน้าจอจำลอง: [STORYBOARD.md](STORYBOARD.md)
- บล็อก motion ตามหน้าที่ซีน: [CATALOG.md](CATALOG.md)
- วิดีโอ: [video/](video/) — engine เดียวกับ EP12/EP13
  - บท/ซับ: [video/timing.json](video/timing.json) · บทสำหรับเสียง: [video/VOICE-SCRIPT.md](video/VOICE-SCRIPT.md)
  - เฟรมขนาดมือถือ: [video/evidence/](video/evidence/)
  - สถานะโปรเจกต์ HyperFrames: `video/.hyperframes/`
  - ภาพหน้าจอจำลอง: `video/assets/app-err-*.jpg` · ต้นฉบับ: [video/mockups/](video/mockups/)

## ลำดับถัดไป
1. ฟังตรวจ `video/ep14-errors-v1.mp4` (เสียง + ซับ + จังหวะภาพ) แล้วจดจุดที่ต้องแก้ใน `video/REVIEW.md`
2. ถ้าแก้บท: แก้ `video/timing.json` → สร้างเสียงใหม่ด้วย `python make-voice-samples.py` (ได้ทั้ง `.wav` และ `.segments.json`) → `node build.mjs` → `npx hyperframes check` → render
3. ผ่านแล้ว render ฉบับส่งมอบ (`--quality high`)

จุดตัดซับมาจาก `video/assets/voice/<beat>.segments.json` — ชุดนี้สร้างจากการถอดเสียง (Whisper) เทียบกับบท เพราะไฟล์เสียงที่ได้มาไม่มี `.segments.json` (รายละเอียดใน `video/REVIEW.md`) ถ้าสร้างเสียงใหม่ด้วยสคริปต์ จะได้ไฟล์นี้แบบแม่นยำแทน

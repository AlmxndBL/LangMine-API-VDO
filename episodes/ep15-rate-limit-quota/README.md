# EP15 — Rate Limit & Quota: โควตานับยังไง ลิมิตเท่าไร ดูยอดที่ไหน

**สถานะ: W6 — v1 มีเสียงพากย์ (11 ช่วง 2:20) รอฟังตรวจ** · ครอบคลุมหมวด Rate Limit & Quota และแนวทางใช้งานที่ปลอดภัยในคู่มือครบ: โควตาบัญชีร่วมกับเว็บ, หน้า Credentials, ลิมิต Voice 60/300 ครั้งต่อนาที, โควตาเสียง (`/me/voice-quota`), โควตาลิงก์ย่อ (`/short-links/usage`), การรับมือ 429 และการดูแล API Key · ตอนก่อนหน้า: [EP14 Errors](../ep14-errors/README.md)

- วิดีโอ v1 มีเสียง: [video/ep15-rate-limit-quota-v1.mp4](video/ep15-rate-limit-quota-v1.mp4) · draft เดิมไม่มีเสียง: [video/ep15-rate-limit-quota-draft-v1.mp4](video/ep15-rate-limit-quota-draft-v1.mp4) · ผลตรวจ: [video/REVIEW.md](video/REVIEW.md)

- แผน คนดู โครงเรื่อง: [PLAN.md](PLAN.md)
- บทพากย์ราย beat + claim ledger: [SCRIPT.md](SCRIPT.md)
- Storyboard + สเปกหน้าจอจำลอง: [STORYBOARD.md](STORYBOARD.md)
- บล็อก motion ตามหน้าที่ซีน: [CATALOG.md](CATALOG.md)
- วิดีโอ: [video/](video/) — engine เดียวกับ EP12–EP14
  - บท/ซับ: [video/timing.json](video/timing.json) · บทสำหรับเสียง: [video/VOICE-SCRIPT.md](video/VOICE-SCRIPT.md)
  - เฟรมขนาดมือถือ: [video/evidence/](video/evidence/)
  - สถานะโปรเจกต์ HyperFrames: `video/.hyperframes/`
  - ภาพหน้าจอจำลอง: `video/assets/app-q-*.jpg` · ต้นฉบับ: [video/mockups/](video/mockups/)

## ลำดับถัดไป
1. ฟังตรวจ `video/ep15-rate-limit-quota-v1.mp4` (เสียง + ซับ + จังหวะภาพ) แล้วจดจุดที่ต้องแก้ใน `video/REVIEW.md`
2. ถ้าแก้บท: แก้ `video/timing.json` → สร้างเสียงใหม่ด้วย `python make-voice-samples.py` (ได้ทั้ง `.wav` และ `.segments.json`) → `node build.mjs` → `npx hyperframes check` → render
3. ผ่านแล้ว render ฉบับส่งมอบ (`--quality high`)

จุดตัดซับมาจาก `video/assets/voice/<beat>.segments.json` — ชุดนี้สร้างจากการถอดเสียง (Whisper) เทียบกับบท เพราะไฟล์เสียงที่ได้มาไม่มี `.segments.json` (รายละเอียดใน `video/REVIEW.md`) ถ้าสร้างเสียงใหม่ด้วยสคริปต์ จะได้ไฟล์นี้แบบแม่นยำแทน

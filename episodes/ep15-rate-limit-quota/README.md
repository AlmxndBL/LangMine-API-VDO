# EP15 — Rate Limit & Quota: โควตานับยังไง ลิมิตเท่าไร ดูยอดที่ไหน

**สถานะ: W5 — draft v1 (11 ช่วง 2:26) มีภาพและซับครบ ยังไม่มีเสียงพากย์** · ครอบคลุมหมวด Rate Limit & Quota และแนวทางใช้งานที่ปลอดภัยในคู่มือครบ: โควตาบัญชีร่วมกับเว็บ, หน้า Credentials, ลิมิต Voice 60/300 ครั้งต่อนาที, โควตาเสียง (`/me/voice-quota`), โควตาลิงก์ย่อ (`/short-links/usage`), การรับมือ 429 และการดูแล API Key · ตอนก่อนหน้า: [EP14 Errors](../ep14-errors/README.md)

- วิดีโอ draft: [video/ep15-rate-limit-quota-draft-v1.mp4](video/ep15-rate-limit-quota-draft-v1.mp4) · ผลตรวจ: [video/REVIEW.md](video/REVIEW.md)

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
1. ตรวจบทใน `video/VOICE-SCRIPT.md`
2. สร้างเสียง: ในโฟลเดอร์ `video/` รัน `python make-voice-samples.py` (Niwat −16%) → ได้ `assets/voice/b1.wav` … `b11.wav`
3. `node build.mjs` → `npx hyperframes check` → `npx hyperframes render --quality draft`
4. ฟังตรวจ บันทึกใน `video/REVIEW.md` แล้ว render ฉบับส่งมอบ

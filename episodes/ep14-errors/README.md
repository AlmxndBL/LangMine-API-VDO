# EP14 — Errors: อ่าน error ให้เป็น รับมือให้ถูก

**สถานะ: W5 — draft v1 (11 ช่วง 2:30) มีภาพและซับครบ ยังไม่มีเสียงพากย์** · ครอบคลุมหมวด Errors ในคู่มือครบ: error envelope, code ทั้ง 10 ตัว (401/403/404/422/429 + Voice 5 ตัว), การรับมือ 3 กลุ่ม และการเอาไปใช้ในระบบ · เรื่องลิมิตและโควตาอยู่ใน [EP15](../ep15-rate-limit-quota/README.md)

- วิดีโอ draft: [video/ep14-errors-draft-v1.mp4](video/ep14-errors-draft-v1.mp4) · ผลตรวจ: [video/REVIEW.md](video/REVIEW.md)

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
1. ตรวจบทใน `video/VOICE-SCRIPT.md`
2. สร้างเสียง: ในโฟลเดอร์ `video/` รัน `python make-voice-samples.py` (Niwat −16%) → ได้ `assets/voice/b1.wav` … `b11.wav`
3. `node build.mjs` → `npx hyperframes check` → `npx hyperframes render --quality draft`
4. ฟังตรวจ บันทึกใน `video/REVIEW.md` แล้ว render ฉบับส่งมอบ

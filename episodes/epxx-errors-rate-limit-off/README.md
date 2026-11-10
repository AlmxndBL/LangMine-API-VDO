# EP14 — Errors / Rate Limit & Quota: อ่าน error ให้เป็น รับมือให้ถูก

**สถานะ: W5 — draft v1 (13 ช่วง ~4:58) มีภาพและซับครบ ยังไม่มีเสียงพากย์** · ครอบคลุมหมวด Errors และ Rate Limit & Quota ในคู่มือครบ: error envelope, code ทั้ง 10 ตัว (401/403/404/422/429 + Voice 5 ตัว), การรับมือ 3 กลุ่ม, โควตาบัญชี, ลิมิตของ Voice และแนวทางใช้ API Key อย่างปลอดภัย

- วิดีโอ draft (ไม่มีเสียง เวลาประมาณจากบท): [video/ep14-errors-draft-v1.mp4](video/ep14-errors-draft-v1.mp4) · ผลตรวจ: [video/REVIEW.md](video/REVIEW.md)

- แผน คนดู โครงเรื่อง: [PLAN.md](PLAN.md)
- บทพากย์ราย beat + claim ledger อ้างบรรทัดคู่มือ: [SCRIPT.md](SCRIPT.md)
- Storyboard ราย beat + สเปกหน้าจอจำลอง: [STORYBOARD.md](STORYBOARD.md)
- บล็อก motion ที่ใช้ตามหน้าที่ซีน: [CATALOG.md](CATALOG.md)
- วิดีโอ: [video/](video/) — ใช้ engine เดียวกับ EP12/EP13
  - บท/ซับ: [video/timing.json](video/timing.json) · บทสำหรับเสียง: [video/VOICE-SCRIPT.md](video/VOICE-SCRIPT.md)
  - เฟรมขนาดมือถือ: [video/evidence/draft-v1-mobile-frames-1.jpg](video/evidence/draft-v1-mobile-frames-1.jpg), [-2.jpg](video/evidence/draft-v1-mobile-frames-2.jpg)
  - สถานะโปรเจกต์ HyperFrames: `video/.hyperframes/`
  - ภาพหน้าจอจำลอง (ทำจากโค้ด): `video/assets/app-err-*.jpg` · ต้นฉบับ HTML: [video/mockups/](video/mockups/)

## ลำดับถัดไป (Next Actions)
1. ตรวจบทใน `video/VOICE-SCRIPT.md` · ถ้าคิดว่ายาวไป ตัวเลือกคือย่อ b7 (Voice) หรือย้ายไปไว้ในภาคต่อของ EP04
2. สร้างเสียง: ในโฟลเดอร์ `video/` รัน `python make-voice-samples.py` (Niwat −16%) หรือให้คนพากย์อ่านจาก VOICE-SCRIPT แล้ววาง `assets/voice/b1.wav` … `b13.wav`
3. `node build.mjs` → `npx hyperframes check` → `npx hyperframes render --quality draft`
4. ฟังตรวจ บันทึกผลใน `video/REVIEW.md` แล้ว render ฉบับส่งมอบ

## แก้ภาพหน้าจอจำลอง
แก้ไฟล์ใน `video/mockups/*.html` แล้วถ่ายเป็นภาพ 1440×1800 เช่น
`chrome --headless=new --hide-scrollbars --window-size=1440,1800 --screenshot=log.png video/mockups/log.html` แล้วแปลงเป็น `video/assets/app-err-log.jpg`

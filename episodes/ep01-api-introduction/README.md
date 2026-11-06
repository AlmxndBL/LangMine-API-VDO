# EP01 — API คืออะไร

Episode ID: `ep01-api-introduction`
อัปเดต 6 พฤศจิกายน 2026 (Asia/Bangkok)

## งานปัจจุบัน: v2

มี [draft พร้อมเสียง Kore](video-voice/ep01-v2-voice-draft.mp4) แยกจาก animatic โดยใช้เสียง 11 ช่วงที่สร้างใน Voice Studio และขยายเวลาฉากตามความยาวไฟล์เสียง [ผลตรวจและข้อจำกัด](video-voice/REVIEW.md) ข้อความบนจอเป็นข้อความสรุปและจับเวลาประมาณ ยังต้องฟังตรวจจังหวะและการออกเสียงตลอดคลิป

มี [ฉบับปรับฟอนต์ Sarabun และจัดซับกลางกรอบ](video-voice/ep01-v2-voice-sarabun.mp4) ตรวจ HyperFrames check, MP4 decode และดูเฟรมมือถือแล้ว เสียงและ timing ใช้ชุดเดิม ยังต้องตรวจซับกับเสียงจริงตลอดคลิป

ผู้ใช้ให้ขยายคำอธิบาย ไม่ล็อกความยาว เพิ่มภาพและ motion โดยใช้ antislop AFTER และ ui-ux-pro-max ดู [แผน v2](../../docs/plans/2026-11-06-ep01-v2.md), [บท/claim ledger](SCRIPT-v2.md) และ [Storyboard v2](STORYBOARD-v2.md)

ฉบับตรวจภาพ r2 มี 11 ฉาก ความยาว 1:41.63 ตามเวลาอ่านชั่วคราว พาคำถามเดิมไปจนเห็นคำตอบกลับก่อนอธิบายงานต่อยอด และแสดงสถานะรอ/เรียกไม่สำเร็จเป็นแผนภาพ [เปิด source](video-v2/index.html)

- [MP4 animatic v2 r2](video-v2/ep01-v2-animatic-r2.mp4)
- [เฟรมจาก MP4 r2 ที่ขนาดมือถือ](video-v2/evidence/rendered-mobile-r2.jpg)
- [ผลตรวจ r2](video-v2/REVIEW-r2.md)
- [MP4 animatic v2 เดิม](video-v2/ep01-v2-animatic.mp4) และ [ผลตรวจเดิม](video-v2/REVIEW.md)
- [ที่มาภาพและ prompt](video-v2/evidence/ASSETS-v2.md)

ผู้ใช้เลือกเสียงทดลอง Kore แบบที่ 2 และให้ประกอบเสียงทั้งตอน เก็บ [audition เดิม](video-v2/assets/female-voice-audition.mp3) เป็นหลักฐานการทดลอง

## ประวัติ sample v1

W3 ได้รับอนุมัติสำหรับผู้ชมที่ยังไม่รู้จัก API ดู [แผน](PLAN.md) และ [ประวัติรีเซ็ต](../../docs/plans/2026-11-06-ep01-reset.md)
W4 ใช้ [บท](SCRIPT.md), [Storyboard](STORYBOARD.md) และ [Catalog](CATALOG.md) เป็นฐาน พร้อมบันทึกการปรับสำหรับ sample
W5 มี **B04–B05 draft v1** ยาวประมาณ 33 วินาที แสดงคำถามผ่านระบบของแอปไปยัง LangMind และข้อมูลกลับมาก่อนแอปแสดงคำตอบ ตัวอย่างเป็นบริการปรึกษาออนไลน์สมมติ

- [เปิดไฟล์ draft v1](video/ep01-b04-b05-draft-v1.mp4)
- [ภาพที่ตรวจขนาดมือถือ](video/evidence/mobile-frames.jpg)
- [ผลตรวจและสิ่งที่ค้าง](video/evidence/REVIEW-v1.md)
- [ที่มาของ assets และ prompt](video/evidence/ASSETS-v1.md)

ก่อนขยายทั้งตอน ให้ทวนการออกเสียงชื่อและจังหวะอ่านซับพร้อมเสียง จากนั้นลองให้ผู้ชมใหม่เล่าย้อนว่าใครส่งคำถามและใครแสดงคำตอบ ความยาวทั้งตอนในบทเป็นค่าประมาณ และขนาดแนวตั้งของ sample เป็นค่าทำงานชั่วคราว

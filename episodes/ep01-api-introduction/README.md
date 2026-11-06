# EP01 — API คืออะไร

Episode ID: `ep01-api-introduction`
อัปเดต 6 พฤศจิกายน 2026 (Asia/Bangkok)

## งานปัจจุบัน: v2

ผู้ใช้ให้ขยายคำอธิบาย ไม่ล็อกความยาว เพิ่มภาพและ motion โดยใช้ antislop AFTER และ ui-ux-pro-max ดู [แผน v2](../../docs/plans/2026-11-06-ep01-v2.md), [บท/claim ledger](SCRIPT-v2.md) และ [Storyboard v2](STORYBOARD-v2.md)

มี animatic ทั้งเรื่อง 14 ช่วง ความยาว 214.378 วินาที ประมาณ 3:34 ที่ [video-v2](video-v2/index.html) ใช้เวลาอ่านข้อความชั่วคราว ยังไม่ใช่ timing จากเสียงเต็ม

- [ดู MP4 animatic v2 (ไม่มีเสียงพากย์)](video-v2/ep01-v2-animatic.mp4)
- [ภาพจาก MP4 ที่ขนาดมือถือ](video-v2/evidence/rendered-mobile-frames.jpg)
- [ทดลองเสียงผู้หญิงช่วงแรก](video-v2/assets/female-voice-audition.mp3)
- [ผลตรวจและข้อจำกัด v2](video-v2/REVIEW.md)
- [ที่มาภาพและ prompt เต็ม](video-v2/evidence/ASSETS-v2.md)

เสียงเต็มยังไม่สำเร็จ: ผู้ใช้เลือกและอนุญาตส่งบทไป Edge TTS ผู้หญิง Premwadee; ได้ช่วงแรก แต่ช่วงถัดไป NoAudioReceived สองครั้ง ผู้ใช้ให้ทดลองประโยคสั้นอีกหนึ่งรอบ ยังล้มเหลว จึงหยุดตามคำสั่ง ไม่เปลี่ยน provider ไม่ใช้เสียงเดิมแทน และไม่อ้างว่าคลิปเสียงเสร็จแล้ว

ขั้นถัดไป: ตรวจ animatic/บททั้งเรื่องกับผู้ใช้และผู้เริ่มต้น แล้วเลือกวิธีพากย์ที่ใช้งานได้ก่อนปรับ timing สุดท้าย ไม่เรียก Edge ซ้ำอัตโนมัติ

## ประวัติ sample v1

W3 ได้รับอนุมัติสำหรับผู้ชมที่ยังไม่รู้จัก API ดู [แผน](PLAN.md) และ [ประวัติรีเซ็ต](../../docs/plans/2026-11-06-ep01-reset.md)
W4 ใช้ [บท](SCRIPT.md), [Storyboard](STORYBOARD.md) และ [Catalog](CATALOG.md) เป็นฐาน พร้อมบันทึกการปรับสำหรับ sample
W5 มี **B04–B05 draft v1** ยาวประมาณ 33 วินาที แสดงคำถามผ่านระบบของแอปไปยัง LangMind และข้อมูลกลับมาก่อนแอปแสดงคำตอบ ตัวอย่างเป็นบริการปรึกษาออนไลน์สมมติ

- [เปิดไฟล์ draft v1](video/ep01-b04-b05-draft-v1.mp4)
- [ภาพที่ตรวจขนาดมือถือ](video/evidence/mobile-frames.jpg)
- [ผลตรวจและสิ่งที่ค้าง](video/evidence/REVIEW-v1.md)
- [ที่มาของ assets และ prompt](video/evidence/ASSETS-v1.md)

ก่อนขยายทั้งตอน ให้ทวนการออกเสียงชื่อและจังหวะอ่านซับพร้อมเสียง จากนั้นลองให้ผู้ชมใหม่เล่าย้อนว่าใครส่งคำถามและใครแสดงคำตอบ ความยาวทั้งตอนในบทเป็นค่าประมาณ และขนาดแนวตั้งของ sample เป็นค่าทำงานชั่วคราว

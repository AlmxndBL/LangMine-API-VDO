# EP02 notebook r6

ปรับจากตัวอย่าง r5 ที่ผู้ใช้ชอบ เฉพาะ sample 27 วินาที B03/B16: ซับเป็นสรุป 6 ใจความตามคำสั่ง ไม่ใช่ transcript ทุกคำ; พื้นกระดาษครีม #F4E8CE พร้อม grid ทั้ง diagram/chat/close; robot 6 จังหวะเปลี่ยนท่าตามหน้าที่และย้ายตำแหน่งไปข้างสิ่งที่อธิบาย คงเสียงต้นฉบับที่ 1x และ Catalog Logo Brand Close, Dart Cursor, AI Chat Reveal กับ visual layer Explainroo

ท่า robot จาก shared: thinking, point-up, thumbs-up, open-arms, high-wave. ไม่สร้างตัวละครใหม่. คง r5 MP4 เดิม. รุ่นนี้อยู่ visual-proof-r6-notebook แยกจาก visual-proof-r6 ที่มีอยู่แล้ว

ตรวจ snapshots ที่ 2,6,10,15,19,23,26s จริง: ซับสั้นอ่านง่ายและไม่ทับ code/UI, robot อยู่ข้าง frontend/server/Agent และใต้ chat/brand ตามจังหวะ. พบ grid ของ Explainroo จางมาก จึงเพิ่มกริดใน host เฉพาะ diagram ให้เห็นตาม reference. ไม่ใช้ปุ่มเล่น/ช่องค้นหาหรือ watermark จากภาพ reference

Verification commands: `node revise.mjs`; Explainroo render --workers 3; HyperFrames check --at 2,6,10,15,19,23,26 --max-transition-samples 0 --json; HyperFrames render --quality looks --workers 3; FFprobe; FFmpeg full decode and exported frames.

Terminal check: ok=true, lint/runtime/layout/contrast errors=0. ภาพก่อน export ผ่านการดูจริง ไม่ใช้ check เป็นการรับรองความสวย. ผล export และรูปที่ถอดจาก MP4 อยู่ evidence. คำตอบบนภาพเป็นตัวอย่างจำลอง ไม่มี API calls

ยังไม่ตรวจ: ไม่ได้ฟังเสียงครบใหม่เพราะใช้ WAV เดิม ไม่ใช่ audience testing หรือการรับรองว่าปรับทั้งตอนเสร็จ. Readability จากเฟรม 360px ไม่รับรองการบีบอัดของแพลตฟอร์ม

Export result: H.264 1080x1920 30fps + AAC, 27.000s, 3,100,350 bytes; full FFmpeg decode exit 0. Inspected MP4 contact sheet at 360px/frame, including grid and robot positions. SHA-256 3C5D27AFD70695922292D2FA875ED3E380F44366152B642B424C0609BE7DF3AD. Both supplied WAV hashes match r5.

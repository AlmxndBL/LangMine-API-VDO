# EP02 sample r6

ต่อจากแนว r5 ที่ผู้ใช้ตอบรับ เปลี่ยนเฉพาะซับ พื้นหลัง และการมีส่วนร่วมของ robot. ตัวอย่างเดิมยังอยู่ ไม่ขยายเป็นฉบับเต็มหรือแตะ EP01.

- พื้น: กระดาษตารางสีครีม #f3e6c7 ใช้ Explainroo custom look และเส้นตารางจาก host; ฉากแชทและ Logo Brand Close ใช้กระดาษชุดเดียวกัน ไม่มีพื้นขาวเต็มเฟรม
- ซับ: คงข้อความบทเดิม แบ่งวลีสั้นตามคำด้วย Intl.Segmenter, Sarabun Bold 48px, ป้ายเหลือง/ครีม ตัวหนังสือเข้ม ขอบหมึก จัดกลาง แทนแถบดำ; timing ภายใน cue คำนวณตามความยาววลีจากช่วง Whisper ที่มีอยู่ ไม่อ้าง forced alignment ใหม่ระดับคำ
- Robot: ชี้ frontend, ชี้ server, กางแขนอธิบาย Agent, thumbs up เมื่อคำตอบกลับ, clipboard ตอนทบทวน และไหว้ปิดท้าย; ขยับ/เปลี่ยนท่าจาก PNG ต้นฉบับ ไม่แก้ต้นฉบับหรืออ้าง skeletal animation
- เสียง B03/B16 เดิม ความเร็ว 1x. ยังคง Explainroo visual layer และ Catalog AI Chat Reveal, Dart Cursor, Logo Brand Close

ตรวจภาพจริง 6 จุด และอีก 3 จุดหลังแก้ orphan caption. ใช้ความกว้างภาพมือถือเป็นเกณฑ์อ่าน ไม่ใช้ syntax รับรองภาพ. อ่าน check-final.json, render.log และ export.json เป็นหลักฐานเทคนิค

ยังไม่ฟังเสียงครบทุกคำหรือทดสอบความเข้าใจกับผู้ชม และยังไม่ปรับคลิปทั้งตอน. ไม่มี API calls, paid generation หรือ publish

Files Changed: visual-proof-r6, docs/plans/2026-11-07-ep02-proof-r6.md, README ตอน. Verification Commands: Explainroo render; HyperFrames snapshot/check/render; ffprobe; FFmpeg full decode. ผลส่งออกบันทึกต่อท้ายเมื่อเสร็จ

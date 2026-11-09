# EP02 r10 · ฉบับล่าสุด

ฉบับล่าสุดยาว 5:52 ใช้เสียง Kore r10 และเร่งภาพกับเสียงพร้อมกัน 1.25× ซับเป็นประโยคสั้นในกรอบสีเขียว ลบป้าย “ฉบับภาพ · ไม่มีเสียง” และ “ภาพจำลอง · คำตอบตัวอย่าง” แล้ว

- วิดีโอ: [ep02-r10-125x-boxed-captions.mp4](voice-r10/ep02-r10-125x-boxed-captions.mp4)
- [ภาพรวมฉบับล่าสุด](voice-r10/evidence-contact-125x.jpg)
- [รายละเอียดและผลตรวจ](voice-r10/README.md)

ฉบับเสียง 1.0× และฉบับภาพเงียบด้านล่างเก็บไว้เป็นประวัติและฐานงาน

# EP02 r10 · silent visual draft

ฉบับภาพไม่มีเสียงตามคำสั่งผู้ใช้ระหว่างผลิต ใช้ visual budget 440s ตาม STORYBOARD ไม่สร้าง TTS ไม่ใช้ narration/caption timing ของ r9

ส่วน code ใช้ Code Highlight Sweep จาก HyperFrames Catalog ตามคำสั่งล่าสุด Source เดิมอยู่ catalog-source/ และ HTML variants แก้ไขได้อยู่ compositions/ รวม13cue; runtime GSAP/highlightจริง pre-render เป็นcode clips ให้ Explainroo host

- Output: [ep02-continuity-r10.mp4](ep02-continuity-r10.mp4)
- [ผลตรวจและข้อจำกัด](REVIEW.md)
- [Asset manifest](asset-manifest.json)
- [บทและ VO cues สำหรับทำเสียงภายหลัง](vo-map-cues.json)
- captions-th.srt ว่างโดยเจตนา เพราะไม่มีเสียงจริงให้ถอด

Render จาก workspace root:

```powershell
node episodes/ep02-custom-chat/video-continuity-r10/render-code-highlight.mjs
node episodes/ep02-custom-chat/video-continuity-r10/prepare.mjs
node .tools/explainroo/bin/explainroo.js render episodes/ep02-custom-chat/video-continuity-r10 --workers 4 --out episodes/ep02-custom-chat/video-continuity-r10/out/explainroo-master.mp4
node episodes/ep02-custom-chat/video-continuity-r10/normalize-color.mjs
node episodes/ep02-custom-chat/video-continuity-r10/verify-export.mjs
```

คำสั่งไม่มี narration ใน script จึงไม่สร้างเสียง ไม่เติม spoken script ก่อนมีแหล่งเสียงและสิทธิ์ที่ผู้ใช้เลือก

assemble-corrections.mjs เป็นประวัติการตรวจช่วงก่อนคำสั่ง Catalog ไม่ใช่ขั้นผลิตปัจจุบัน

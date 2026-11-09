# EP02 — LangMind Brand r9

ฉบับเต็มตาม sample r9 ที่ผู้ใช้เลือก: [MP4](ep02-complete-langmind-r9.mp4), [ซับสรุป SRT](captions-summary.srt), [Chapters](chapters.txt), [Review](REVIEW.md).

ภาพใหม่ครบ B01–B16 ด้วย Explainroo. พื้น teal เข้ม สีจาก LangMind โลโก้จริงและ robot จาก shared. ใช้เสียงฉบับเดิม 1x ไม่มี TTS ใหม่ ไม่มี live API หรือ publish. หน้าจอและคำตอบจำลอง โค้ดเพื่ออธิบายไม่ใช่ระบบพร้อมรัน.

Source: scenes.js วาดฉาก, data.js เก็บ shots/captions, script.md กำหนดเวลาให้ Explainroo, video.json/brand.json เก็บ theme. timing.json และซับอ้างอิงรุ่น Notebook v1. build/out เป็น intermediates; evidence เก็บผลตรวจ. Source scenes ไม่มีการเรียก API.

รันจาก workspace root:

```powershell
node episodes/ep02-custom-chat/video-full-brand-r9/prepare.mjs
node .tools/explainroo/bin/explainroo.js check episodes/ep02-custom-chat/video-full-brand-r9 --view-width 540 --json
node .tools/explainroo/bin/explainroo.js render episodes/ep02-custom-chat/video-full-brand-r9 --workers 3 --out episodes/ep02-custom-chat/video-full-brand-r9/out/visual-master.mp4 --json
node episodes/ep02-custom-chat/video-full-brand-r9/finish.mjs
```

finish.mjs mux เสียงจาก assets/narration-original.m4a ลงภาพ โดย copy audio/video streams และตรวจ hash เทียบเสียงใน MP4 เดิม พร้อม chapters, decode และ export frames. ต้องมี FFmpeg/FFprobe และ clip รุ่นเดิมเพื่อการตรวจเทียบ. ไม่ใช้ Explainroo voice/verify speech เพื่อไม่ดาวน์โหลดโมเดลหรือเปลี่ยนเสียงโดยไม่จำเป็น.

ข้อจำกัด: บางข้อความรองและโค้ดมี small-text warnings เมื่อย่อจอ ยังไม่รับรองการบีบอัดบนแพลตฟอร์ม. คุณภาพเสียงตามต้นฉบับที่ผู้ใช้ให้คงไว้. การผ่าน check/decode ไม่ใช่ user acceptance หรือ audience testing.

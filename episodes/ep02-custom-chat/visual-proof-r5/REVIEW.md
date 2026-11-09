# EP02 · visual proof r5

ตัวอย่างทิศทางภาพ 27 วินาที ช่วงอธิบายข้อความไปกลับ B03 และปิด B16 ตามคำสั่งล่าสุดให้ทำตัวอย่างใหม่ก่อน ไม่ใช่ฉบับเต็มตอนที่ผู้ใช้รับรอง

เปลี่ยนจากหัวเรื่องและกล่องคำอธิบายถาวรเป็นป้ายสั้นช่วงเปิด คำถามที่เคลื่อนไปตามเส้น ลูกศรที่วาดตามลำดับ และภาพคำตอบในแชท ใช้ฟอนต์ Sarabun มีหัวและ robot/โลโก้ต้นฉบับกลาง รักษางาน r3/r4 และ EP01

## Source และ integration

- Explainroo 0.4.1 จาก https://github.com/vincentsch/explainroo ใช้จริง: `explainroo/scenes.js` วาด icons/boxes/curved arrows ด้วย engine canvas และ render เป็น `assets/journey.mp4` ไม่สร้างเสียงใหม่
- HyperFrames Catalog AI Chat Reveal: ปรับ source ที่ทดลองใน r3 เป็นภาพ payoff ตัดหัวเรื่องและคำอธิบายซ้ำ มีป้ายจำลอง
- Catalog Dart Cursor: mount original component เพื่อชี้ frontend ไป server
- Catalog Logo Brand Close: ใช้ cascade wordmark และ tagline/URL พร้อมโลโก้ต้นฉบับ ปรับ hold ให้ครบฉาก และเพิ่มขนาดข้อความท้าย
- ui-ux-pro-max: อ่าน skill และรัน design-system/domain searches ผลค้นเอนไปทาง app/landing ไม่ใช่สื่อ จึงไม่เอา template landing/clay มาใช้ ใช้หลัก hierarchy, readable scale และ progressive disclosure ตาม Quick Reference เท่านั้น
- Reference Download.mp4: ดู contact sheet จริง ใช้กรอบเอียง/ป้ายสั้น/ตัวชี้และตัวละครตามหน้าที่ ไม่ใช้ watermark หรือ assets ของเจ้าของคลิป

## Verification

Explainroo render 608 frames, 1080×1920, 20.2667s. หลังขยาย label เป็น 52px `explainroo check --view-width 360 --json` ได้ issues=[].

HyperFrames initial check: zero lint/runtime/layout/contrast errors; warnings เรื่องข้อความคำตอบค้างสั้น (เป็นภาพ payoff ซ้ำจากบริบท ไม่ใช่บทอ่านใหม่) และข้อความท้ายเล็ก ซึ่งแก้ขนาด tagline/URL แล้ว. ดู JSON และ render log ใน evidence.

ตรวจ snapshots จริง 7 จุดก่อน render และจะตรวจ decoded export เพิ่ม แยกจาก syntax/check. เสียงใช้ WAV B03/B16 ที่ผู้ใช้ให้ ความเร็ว 1x; ซับอ้างบทที่ align กับ Whisper local จากรอบก่อน ยังไม่ได้ฟังตรวจการออกเสียงทั้งไฟล์หรือทดสอบความเข้าใจกับผู้ชม ไม่อ้าง audio acceptance.

ข้อจำกัด: นี่เป็น sample ทิศทางภาพช่วงเดียว ไม่ใช่การเปลี่ยนภาพทั้งตอนแล้ว เส้น diagram และ robot ยังเป็นภาพอธิบาย; คำตอบเป็นตัวอย่างจำลอง ไม่มี API calls. จุดอ่อนคือช่วงเปิดที่ diagram ยังไม่ครบมีพื้นที่ว่างมากกว่าฉาก payoff เหมาะให้ผู้ใช้ตัดสินทิศทางก่อนขยาย ไม่อ้างว่าสวยผ่านตรวจรับแล้ว

Files changed: visual-proof-r5, docs/plans/2026-11-07-ep02-visual-proof-r5.md และ README ตอน. Explainroo checkout/dependencies อยู่ .tools/explainroo; r4 assets ที่ไม่มี index ไม่ถือเป็นคลิปที่ส่งมอบ
`nExport verified: 27.000s, H.264 1080×1920/30fps + AAC, 3,645,982 bytes; FFmpeg full decode exit 0. SHA-256 F21A72FE6C05D3A6D675C9BE5A89BD816B7F8F63026B5CE412F8AB4799D0344F. Inspected exported contact sheet at 360px per frame. Nexus session save was attempted but connector rejected project identity; workspace evidence remains authoritative.

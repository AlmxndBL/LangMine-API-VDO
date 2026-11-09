# EP02 ฉบับสมบูรณ์ Notebook v1

คำสั่งล่าสุดอนุมัติผลิตครบตอนหลังยอมรับแนวภาพ r6-notebook พร้อมยอมรับข้อจำกัดเสียงเดิม รุ่นนี้ประกอบ B01–B16 ครบ 310.4333 วินาที (5:10) เก็บตัวอย่างและ EP01 เดิม ใช้เสียงปกติ 16 WAV ที่ให้มา ไม่มีการสร้างเสียงใหม่หรือเรียก API

## การผลิต

- พื้นกระดาษครีมตาราง Sarabun มีหัว ซับสรุป 51 ช่วงตามคำสั่ง ไม่ใช่ transcript verbatim
- 38 ช็อตและ 42 จังหวะ robot จาก poses กลาง ทำหน้าที่ตั้งข้อสงสัย ชี้ รับผล และปิด
- B03 ใช้ Explainroo notebook journey ที่ render จริงในตัวอย่างที่อนุมัติ ส่วนอื่นใช้ Catalog AI Chat Reveal, Code Highlight, Code Diff, Flowchart Vertical, Multi Device Splay และ Dart Cursor ที่ปรับ source แล้ว ฉากปิดใช้ Logo Brand Close คู่โลโก้ต้นฉบับ
- ลดหัวเรื่องเหลือป้ายสั้นเฉพาะ code/footage/Agent ID; ฉากแชท/cards/diagram ใช้ภาพเป็นหลัก กรอบ code แสดงชื่อไฟล์และฝั่ง; key อยู่ server; /api/chat route แอปแยกจาก endpoint LangMind
- ภาพ Agent อธิบายเฉพาะรหัสหลัง /agents/ มีป้าย NECTEC/ใช้ ID ของตนเอง; footage crop เฉพาะฟอร์ม ไม่มีโปรไฟล์หรือ bookmarks
- คำตอบ A1/A2 และ conv_demo_01 เป็นตัวอย่างจำลองตาม DESIGN; โค้ดเป็น snippets ประกอบคำอธิบาย ไม่ใช่โปรเจกต์แจกพร้อมรัน; ไม่อ้าง live API

## Verification และข้อจำกัด

`node finish.mjs` ได้ 16 beats / 38 shots / 51 summary cues / 42 robot actions. `node --check finish.mjs` ผ่าน. `node verify-assets.mjs` ยืนยัน WAV 16 ไฟล์ hash ตรงกับ Downloads ความเร็ว 1x

ดู snapshot ทุกช็อต 38 ภาพแล้ว รวม contact sheets 5 ใบ และตรวจจุดแก้เพิ่มที่ 48/106/116/230/308s. แก้ mount Explainroo ที่ขาด composition-id แล้ว; final check ok=true: lint/runtime/layout/audio errors=0, layout warnings=0. พบ contrast warning จุดสีท้ายแบรนด์จึงปรับเขียวเข้ม และ footnote ที่เล็กจึงเพิ่มเป็น 30px ก่อน render

Warnings ที่เก็บ: wrapper ของ robot ทำให้ lint เตือน nested img/duplicate source discovery แต่ใช้ clip ของตัวเองและตรวจว่าไม่แสดงซ้อนจริง; /api/chat เป็น string ของโค้ดบนภาพไม่ใช่ asset path. ช็อตสถานะส่งช่วงแรกสั้นเพื่อแสดง action ที่จะขยายด้วย code/diagram ต่อ ไม่ใช้ช่วงนั้นให้อ่านคำถามทั้งหมดใหม่. ข้อความกำกับแยกจากซับหลัก

เสียง: ผู้ใช้ระบุมีปัญหาแต่ยอมรับให้ผลิตฉบับเต็ม จึงคงทุก WAV โดยไม่เร่ง/เปลี่ยนเสียง ไม่มีการฟังตรวจรับใหม่หรืออ้างแก้การออกเสียงแล้ว ไม่ได้ทดสอบความเข้าใจกับกลุ่มผู้ชม/การบีบอัดแพลตฟอร์ม

อ่านหน้าจอจากภาพขนาดมือถือและตรวจ export จริงเพิ่มเติมใน evidence. การตรวจอัตโนมัติไม่ใช่การรับรองความสวยแทนผู้ใช้. งานนี้ผลิตไฟล์ในเครื่อง ไม่มี publish

Files Changed: โฟลเดอร์นี้ พร้อม docs/plans/2026-11-07-ep02-final-notebook-v1.md, README ตอน และสถานะกลาง. Source builder ดัดแปลงจาก r3 โดย finish.mjs; ไม่ควรรัน build.mjs อย่างเดียวเพื่อสร้างรุ่นสุดท้าย ให้ใช้ finish.mjs

## Export result
Delivery render exit 0: 9313 frames, 310.433333s, H.264 1080x1920 30fps + AAC, 27,565,739 bytes (26.3 MiB). Full FFmpeg decode PASS. SHA-256 071dbdb3910c07a3e526d30c31bab1729207a42357596776e72121ddfc91800c. Inspected exported contact sheet plus code@177s and close@308s. Mean audio -17.1 dBFS, max -1.1 dBFS; measured, not a new listening acceptance. EP01 and r5/r6 sample hashes unchanged. Nexus get-brief/save-session rejected project identity; local evidence retained.

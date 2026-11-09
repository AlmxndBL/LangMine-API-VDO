# EP03 — Animatic v3

รุ่นภาพเงียบที่ปรับลำดับคำอธิบายหลังทบทวน v2: ใช้คำถามเดียวต่อเนื่อง, แสดงความต่างของการรับครบกับการทยอยแสดงก่อน, แล้วค่อยแนะนำ event และหน้าที่ Backend/UI มีซับร่างภาษาไทยฝังในภาพตามช่วง visual stage

- MP4: [renders/EP03-animatic-v3.mp4](renders/EP03-animatic-v3.mp4)
- HyperFrames source: [index.html](index.html), [build.mjs](build.mjs), [compositions/](compositions/)
- Timing และ stage manifest: [timing.json](timing.json)
- ภาพ raster ที่สร้างจาก screen specs: [assets/plates/v3/](assets/plates/v3/)
- ทะเบียน assets: [ASSETS-v3.md](ASSETS-v3.md)
- ผลตรวจ: [REVIEW-v3.md](REVIEW-v3.md)

สถานะ: silent animatic 52 วินาที พร้อมซับร่างภาษาไทย; ไม่มีเสียงพากย์หรือเพลง และซับยังไม่ sync กับบทพูด. เวลาเป็น story holds ระหว่างเตรียม voice audition ไม่ใช่ความยาวฉบับเต็ม. ภาพตัวอย่างเป็นภาพอธิบาย ไม่ใช่ผลเรียก LangMind API จริง.

Voice audition ยังรอผู้ใช้เลือก. HyperFrames CLI check/preview ยังไม่ผ่านใน environment นี้: shim เรียก Volta ที่ไม่มีให้ใช้ และแพ็กเกจ CLI ไม่อยู่ใน npm offline cache. MP4 สร้างจาก local raster plates ด้วย FFmpeg และตรวจจาก export จริง; อ่านรายละเอียดใน REVIEW-v3. ไม่เรียก live/paid API, ไม่สร้าง provider resources และไม่ publish.

# EP03 — Animatic v3.1

รุ่นปรับจาก v3: เพิ่มภาพอธิบายสองภาพในซีนเปรียบเทียบ ใช้ motion ที่ดัดแปลงจาก HyperFrames Catalog และทบทวนคำไทย/ข้อความ event แล้ว v3 เดิมเก็บไว้เป็นหลักฐานก่อนปรับ

- คลิป: [EP03-animatic-v3.1.mp4](renders/EP03-animatic-v3.1.mp4)
- บท: [SCRIPT-v3.1.md](../SCRIPT-v3.1.md)
- Storyboard และ screen specs: [STORYBOARD-v3.1.md](../STORYBOARD-v3.1.md)
- HyperFrames source: [index.html](index.html), [build.mjs](build.mjs), [compositions/](compositions/)
- Timing และข้อความซับร่าง: [timing.json](timing.json)
- Raster plates: [assets/plates/v3.1/](assets/plates/v3.1/)
- ภาพอธิบาย: [assets/illustrations/v3.1/](assets/illustrations/v3.1/)
- Asset ledger: [ASSETS-v3.1.md](ASSETS-v3.1.md)
- Review: [REVIEW-v3.1.md](REVIEW-v3.1.md)

สถานะ: animatic เงียบ 52 วินาที มีซับร่างภาษาไทยฝังตาม visual stage; ไม่มีเสียงพากย์หรือเพลง และซับยังไม่ sync กับบทพูด. ภาพเปรียบเทียบเป็นภาพอธิบายที่สร้างในเครื่อง ไม่ใช่ UI ทางการหรือผลเรียก LangMind API จริง.

การเรนเดอร์ MP4 ใช้ local raster + FFmpeg; ซีน 2 สร้างเฟรม motion ตามพฤติกรรมที่ดูจาก Catalog (wipe 0.25–1.30s และหัวข้อ Soft Blur In 0.8s). HyperFrames HTML source มี component adaptation สำหรับซีนเดียวกัน แต่ `check --json --snapshots` ไม่สามารถเปิด Chrome ไปยัง localhost ได้ (`ERR_NETWORK_ACCESS_DENIED`) จึงไม่ได้ยืนยัน runtime render ของ HyperFrames; ดูหลักฐานใน [review](REVIEW-v3.1.md). ไม่เรียก live/paid API, ไม่สร้าง provider resources และไม่ publish.

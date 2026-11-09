# EP03 v4.2 — Asset ledger

Hashes/dimensions อ่านจากไฟล์ที่ใช้จริงหลัง render และเก็บฉบับเต็มไว้ใน [render-manifest-v4.2.json](renders/render-manifest-v4.2.json). PNG แสดง alpha extrema จาก channel A; ไฟล์ RGB ไม่มี alpha.

| Asset | มิติ/โหมด | SHA-256 | ใช้ในงาน |
|---|---|---|---|
| `assets/langmind-logo.png` | 689×606 RGBA, alpha 0–255 | `025dbb6064076ac724f42009635e715f985a3d2df8abfa374a8fcec398979c49` | โลโก้ source กลางในซีนปิด; รักษาสัดส่วนและสี |
| `assets/robot/01-question.png` | 445×503 RGBA, alpha 0–255 | `c7d8bbe30cbc7ecbaf439b499ed35c4c2cb9dead8144dd08fcb84445065a5085` | ตั้งคำถาม/เตรียมเชื่อม |
| `assets/robot/05-point-up.png` | 445×436 RGBA, alpha 0–255 | `6596f6b0a6fd7a57a3a6cc6c31b8da13e18cf17bf14777351480bd222e04dc01` | ชี้ความสัมพันธ์ของ ID ใน B6 |
| `assets/robot/10-thumbs-up.png` | 512×485 RGBA, alpha 0–254 | `a12f374f8b804ab812c185f2191ec19b736cfea8466bae947a54926f4764cb17` | ตัวประกอบท้ายเรื่อง |
| `assets/screens/CHAT-01.png` | 1440×1800 RGB | `98af4063f33cfbe11c330e7d0262f5acf262b80737b5033e4f26c58588e1a38b` | Raster ภาพจำลองสถานะเริ่มต้น |
| `assets/screens/CHAT-02.png` | 1440×1800 RGB | `fa3b38f09713773f4e0e93d3b3bfd89dad61d2840c8623d5af82fbbc579cb913` | Raster ภาพจำลองหลังผู้ใช้ถามให้ย่อ |
| `assets/fonts/Sarabun-Regular.ttf` | TTF, 90,220 bytes | `226d4f368fbc0457990ddef2692679badfd2c1a4e89e5ac4d43c10ba7743b2f1` | ข้อความ/ซับภาษาไทย |
| `assets/fonts/Sarabun-Bold.ttf` | TTF, 89,804 bytes | `d38308ca27d067b9a1b79006337c1f9a66c29aa016d96a9d88d3801da7fa83b9` | หัวข้อ/ข้อความเน้น |
| `assets/gsap.min.js` | JavaScript, 72,790 bytes | `fd6978c80858a3036c39b4e53b5a6f9385d759d43283e6b1de89237e5640d85f` | Timeline source ใน HTML composition |
| `assets/plates/v4.2/stage_01…18_*.png` | 18 plates, 1080×1920 RGB | แยกตามไฟล์ใน JSON manifest | เฟรมที่เรนเดอร์และตรวจสายตาจริง; caption ฝังในแต่ละ raster |

โลโก้และ robot ใช้สำเนาจาก `shared/assets/` โดยไม่แก้ source; ฟอนต์คัดลอกจาก project asset เดิม. ไม่มีภาพ stock หรือข้อความที่ฝังจาก generator ภายนอก

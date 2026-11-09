# EP03 Animatic v3 — Asset ledger

ผลตรวจ assets ที่ใช้สร้าง plate: อ่านไฟล์จริง, ตรวจขนาด/alpha, SHA-256 และดูเฟรมเต็มกับขนาด 360×640. Character sprites ใช้ alpha จาก source, crop เฉพาะขอบโปร่งใสที่มี alpha ≤8 และขยายก่อนวางลงฉาก โดยไม่แก้ไฟล์ต้นฉบับหรือแปะ matte สีขาว. แผนภาพ, ข้อความบนจอ และซับร่างที่ฝังด้านล่างเป็น local raster ที่สร้างจาก [render_fallback.py](render_fallback.py) ตาม screen specs; ไม่ใช่ official LangMind UI หรือซับที่ sync กับเสียง.

## Assets ที่ใช้

| Asset | ขนาด/ชนิด | Alpha | SHA-256 | การใช้ |
|---|---|---|---|---|
| assets/ui/scr-01-chat-loading.png | 1080×1920 RGBA | 200–255 | a92834184afe14a5d28cc9794d8ffda9751d237c92c4c223c9865a584c21a663 | crop header, คำถาม และสถานะรอในซีน 1 |
| assets/brand/langmind-logo.png | 689×606 RGBA | 0–255 | 025dbb6064076ac724f42009635e715f985a3d2df8abfa374a8fcec398979c49 | โลโก้ปิดท้าย; source มีคำ LANG MIND ชิดขอบล่าง |
| assets/characters/01-question.png | 445×503 RGBA | 0–255 | c7d8bbe30cbc7ecbaf439b499ed35c4c2cb9dead8144dd08fcb84445065a5085 | ตัวละครประกอบซีน 1 |
| assets/characters/05-point-up.png | 445×436 RGBA | 0–255 | 6596f6b0a6fd7a57a3a6cc6c31b8da13e18cf17bf14777351480bd222e04dc01 | ชี้ส่วนเปรียบเทียบซีน 2 |
| assets/characters/20-laptop.png | 1254×1254 RGBA | 0–255 | 66584b5a029117702af7f8bb85634b4a3979b327ca4bbafee62d572db008ab72 | ประกอบซีน event |
| assets/characters/39-tiptoe.png | 1254×1254 RGBA | 0–255 | dd9a9452dcd8ffaa03d9cbc440511b21807b4adc9e0dbc291bd4205ad41f7f4b | ประกอบแผนภาพหน้าที่ |
| assets/characters/10-thumbs-up.png | 512×485 RGBA | 0–254 | a12f374f8b804ab812c185f2191ec19b736cfea8466ba947a54926f4764cb17 | องค์ประกอบรองในซีนสรุป |
| assets/fonts/Sarabun-Regular.ttf | TTF, 90,220 bytes | — | 226d4f368fbc0457990ddef2692679badfd2c1a4e89e5ac4d43c10ba7743b2f1 | ข้อความไทย |
| assets/fonts/Sarabun-Bold.ttf | TTF, 89,804 bytes | — | d38308ca27d067b9a1b79006337c1f9a66c29aa016d96a9d88d3801da7fa83b9 | หัวข้อและข้อความเน้น |
| assets/vendor/gsap.min.js | JavaScript, 72,790 bytes | — | fd6978c80858a3036c39b4e53b5a6f9385d759d43283e6b1de89237e5640d85f | local HyperFrames source |

## Generated plates

ทุกภาพเป็น PNG, 1080×1920, RGB ทึบแสง; ซับร่างภาษาไทยฝังในแต่ละภาพตาม stage. แต่ละ plate แสดง state ต่อเนื่องตามลำดับใน timing manifest.

| Plate | SHA-256 |
|---|---|
| assets/plates/v3/b1-question.png | 20af74c1f0ebcb0447c8ec5690a67ace8483428f6497d41afb299b91393e307c |
| assets/plates/v3/b1-waiting.png | d63621b22e894ba67298cdac4ad9210f8296f934eb79417963a192054a9826a6 |
| assets/plates/v3/b2-compare-1.png | 2d1287ce47e033f7eed9e046dbdd2359803bdc3f998d82ba1540b27f7c7a9221 |
| assets/plates/v3/b2-compare-2.png | 8abc70ee6480ff9377dbebbe3d76baa17dc35fde7eef7fa2610ff8c523fcf45f |
| assets/plates/v3/b2-compare-3.png | 33f0c8f2ba10d1b9100465326aa5e4a268d0150f279b322d94458ae8448a0dba |
| assets/plates/v3/b3-event-1.png | 7c21c7e501471ea7b01b2b6a17b31a4b117cfca894f6c396593d243feb552d38 |
| assets/plates/v3/b3-event-2.png | 9e80702648c0d1440e50f90b68b4caaaf71692fae158f287150fd304d52ddbeb |
| assets/plates/v3/b3-event-3.png | 6fa8821c5b1ccc48f0b0f3fe372f0e14f0ea09bff1d6f10a74938f07d9901d06 |
| assets/plates/v3/b3-event-4.png | 28d3cab814911abae7654db0cce8f1caf7de633968c109e9693a34b5ef485106 |
| assets/plates/v3/b4-roles-1.png | 5220fad176c42391b300dbe2e31d0bfab90c2f325dd50d1931c5391fec3dc9f9 |
| assets/plates/v3/b4-roles-2.png | 324294d25728e7705e4ed4c6677bb7962ee0b37af4eaf30b2cef3003b75e49cb |
| assets/plates/v3/b4-roles-3.png | 29ded79c24238763e2a178c321644ae61c5268807675d20190fff46b84a983fb |
| assets/plates/v3/b5-recap-1.png | eb8bbaf30cbe7c9f9576352cc90c30aae9d220b1eda1b66bef126780250441dc |
| assets/plates/v3/b5-recap-2.png | 200f97ca7d64970d18fc1cd76a3fb8113f6947c26ed39358d949054d728a5bb0 |
| assets/plates/v3/b5-recap-3.png | 97225d553753e66215e6c88a19825359d83d61bd58e5e0b10370814f5a0624c7 |

## ไม่ได้ใช้และข้อจำกัด

- assets/ui/scr-02-chat-streaming.png ถูกคัดลอกมาจาก v2 แต่ v3 ไม่อ้างอิง; มีคำตอบตัวอย่างรายละเอียด API key จึงตัดออกเพื่อไม่ให้ดูเหมือนข้อมูลจริง
- ไม่แก้ source โลโก้หรือ robot; ภาพโลโก้ที่ชิดขอบล่างเป็นข้อจำกัดที่สืบทอดจากไฟล์ต้นฉบับ

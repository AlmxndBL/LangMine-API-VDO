# EP03 Animatic v3.1 — Asset ledger

ตรวจ assets จริงหลังผลิต: ขนาดภาพ, โหมดสี, alpha และ SHA-256. แผนภาพและข้อความบนจอเป็นภาพ raster ที่สร้างในเครื่องจาก `render_fallback.py`; ไม่ใช่ official LangMind UI, ผลเรียก API หรือข้อความจากผู้ใช้จริง.

## ภาพอธิบายใหม่

| Asset | ขนาด/โหมด | Alpha | SHA-256 | การใช้ |
|---|---|---|---|---|
| assets/illustrations/v3.1/batch-complete.png | 980×800 RGB | ไม่มี | `ef9b9dcd3094fc73a2916de504ab4437d6dde9dafadc860b4e44092e5283ebb7` | ภาพเอกสารที่รอครบทั้งชุดและผลรวม; before layer ของ wipe |
| assets/illustrations/v3.1/stream-chunks.png | 980×800 RGB | ไม่มี | `816c0273aa245eeb80235072c928852dedf121d592c61ce54e69033e316c2e61` | ภาพข้อมูลสามชิ้นและลูกศร; after layer ของ wipe |

ภาพทั้งสองเป็น diagram ที่วาดด้วย Pillow ในเครื่อง ไม่ได้ดาวน์โหลดจากหน้า Catalog หรือเรียก API จริง

## Assets ร่วมจาก workspace

| Asset | ขนาด/ชนิด | Alpha | SHA-256 | การใช้ |
|---|---|---|---|---|
| assets/ui/scr-01-chat-loading.png | 1080×1920 RGBA | 200–255 | `a92834184afe14a5d28cc9794d8ffda9751d237c92c4c223c9865a584c21a663` | crop คำถามและสถานะรอในซีน 1; ไม่แก้ต้นฉบับ |
| assets/brand/langmind-logo.png | 689×606 RGBA | 0–255 | `025dbb6064076ac724f42009635e715f985a3d2df8abfa374a8fcec398979c49` | โลโก้ในซีนสรุป; source มีคำ LANG MIND ชิดขอบล่าง |
| assets/characters/01-question.png | 445×503 RGBA | 0–255 | `c7d8bbe30cbc7ecbaf439b499ed35c4c2cb9dead8144dd08fcb84445065a5085` | ตัวละครประกอบซีน 1 |
| assets/characters/20-laptop.png | 1254×1254 RGBA | 0–255 | `66584b5a029117702af7f8bb85634b4a3979b327ca4bbafee62d572db008ab72` | ตัวละครประกอบซีน event |
| assets/characters/39-tiptoe.png | 1254×1254 RGBA | 0–255 | `dd9a9452dcd8ffaa03d9cbc440511b21807b4adc9e0dbc291bd4205ad41f7f4b` | ตัวละครประกอบแผนภาพหน้าที่ |
| assets/characters/10-thumbs-up.png | 512×485 RGBA | 0–254 | `a12f374f8b804ab812c185f2191ec19b736cfea8466ba947a54926f4764cb17` | องค์ประกอบรองในซีนสรุป |
| assets/fonts/Sarabun-Regular.ttf | TTF, 90,220 bytes | — | `226d4f368fbc0457990ddef2692679badfd2c1a4e89e5ac4d43c10ba7743b2f1` | ข้อความไทย |
| assets/fonts/Sarabun-Bold.ttf | TTF, 89,804 bytes | — | `d38308ca27d067b9a1b79006337c1f9a66c29aa016d96a9d88d3801da7fa83b9` | หัวข้อและข้อความเน้น |
| assets/vendor/gsap.min.js | JavaScript, 72,790 bytes | — | `fd6978c80858a3036c39b4e53b5a6f9385d759d43283e6b1de89237e5640d85f` | local GSAP ของ HyperFrames source; ไม่โหลด CDN |

## Generated plates

ทุก plate เป็น PNG 1080×1920 RGB ไม่มี alpha; แต่ละ stage มีซับร่างฝังในภาพ. ซีน 2 ใช้ shell ที่สร้างจาก plate เหล่านี้แล้ววาง Catalog-style comparison motion ทับขณะเรนเดอร์.

| Plate | SHA-256 |
|---|---|
| assets/plates/v3.1/b1-question.png | `20af74c1f0ebcb0447c8ec5690a67ace8483428f6497d41afb299b91393e307c` |
| assets/plates/v3.1/b1-waiting.png | `d63621b22e894ba67298cdac4ad9210f8296f934eb79417963a192054a9826a6` |
| assets/plates/v3.1/b2-compare-1.png | `1a451ec1a0a13d4ed7772700a7e2d18b227dd6f5c11338d73b0852ad68bd79d5` |
| assets/plates/v3.1/b2-compare-2.png | `d8601a7ea38aa679b61233a62059dac3faa53993aa5dadc231cdcdaa136d1b88` |
| assets/plates/v3.1/b2-compare-3.png | `de83d89703f14ac19ecc5677fa797d657cb9024e4e5360382d3c0c7419f76018` |
| assets/plates/v3.1/b3-event-1.png | `7f1840aeafd6b9e31606fda2fb4cb150c67fbbb440df8245e57b2a27c3d485e2` |
| assets/plates/v3.1/b3-event-2.png | `4edbe8a46ce144c1736ddba4d35b9dcbed9f1648197111bebd39403315058e5e` |
| assets/plates/v3.1/b3-event-3.png | `10cd344870e0868303f0d161fbed552f680fe590dc2ddc10c8cdeca4c415f4e1` |
| assets/plates/v3.1/b3-event-4.png | `b2cd23652bf5d9a669d0576eb4f2f68355f0d141db98e17747ee0675ea86dcf1` |
| assets/plates/v3.1/b4-roles-1.png | `b53f2816947c0a156ea7461fba09a5ca68bec37716a39632093b0f13a0606680` |
| assets/plates/v3.1/b4-roles-2.png | `5a60d083b71d1218ecdb692d744a3b2dd755f208aad2758a929f3c4913291f88` |
| assets/plates/v3.1/b4-roles-3.png | `e214d1e9f9e6bf4d2fc82ef6063441c0994f39ccad79dd145e6e5eb13ed3af2c` |
| assets/plates/v3.1/b5-recap-1.png | `3038267c6c4b6ed1fd1c6255da4ab19b2b51916f62c20227f1c6463c3f55a065` |
| assets/plates/v3.1/b5-recap-2.png | `f54eb7a3f71a593ccd26331331aae700ae5a6c665d1708be3828fe5a7f0b5983` |
| assets/plates/v3.1/b5-recap-3.png | `cc8c69caa2685c32a36ee8cbb9b970711f1e63a575e8fc98c56e606e71c1bf04` |

## ผลส่งออกและการดูภาพ

- [EP03-animatic-v3.1.mp4](renders/EP03-animatic-v3.1.mp4): 1080×1920, 30 fps, 52.000 วินาที, 1,560 frames, ไม่มี audio track; SHA-256 `1e454784a1e8b1410223289c8bf09c6db45ae557ecde290fd676adbf1a3c9c21`
- [ภาพรวมเฟรมที่ตรวจ](renders/final-review-v3.1/contact-sheet.png) และเฟรมเต็มซีน 2 ที่ 9.3 วินาที: ตรวจ layout, การอ่านภาษาไทย, ภาพอธิบาย และขอบ panel จาก export จริง
- `assets/ui/scr-02-chat-streaming.png` ที่คัดลอกมาจากรุ่นก่อนยังอยู่ใน workspace แต่ v3.1 ไม่ใช้เป็นภาพหลัก; ซีน 2 ใช้ภาพอธิบายใหม่สองไฟล์ด้านบน

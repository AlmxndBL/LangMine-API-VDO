# EP03 Animatic v2 — Asset Ledger

ภาพทั้งหมดอยู่ในโฟลเดอร์ `assets/` และ render ไม่ดึง media จาก network

| ไฟล์ | ต้นทาง | ขนาด/ชนิด | SHA-256 | Alpha |
|---|---|---:|---|---|
| `assets/ui/scr-01-chat-loading.png` | `episodes/ep03/assets/ui/` ภาพ W5 ที่ติดป้ายภาพจำลอง | 1080×1920 PNG | `a92834184afe14a5d28cc9794d8ffda9751d237c92c4c223c9865a584c21a663` | มี transparent pixels |
| `assets/ui/scr-02-chat-streaming.png` | `episodes/ep03/assets/ui/` ภาพ W5 ที่ติดป้ายภาพจำลอง | 1080×1920 PNG | `94d7289d67523224cc0c8a1bf4a30e9218c4e8b2c68d1e6fb922016e2db152a0` | มี transparent pixels |
| `assets/characters/01-question.png` | `shared/assets/characters/robot/` | 445×503 PNG | `c7d8bbe30cbc7ecbaf439b499ed35c4c2cb9dead8144dd08fcb84445065a5085` | มี transparent pixels |
| `assets/characters/05-point-up.png` | `shared/assets/characters/robot/` | 445×436 PNG | `6596f6b0a6fd7a57a3a6cc6c31b8da13e18cf17bf14777351480bd222e04dc01` | มี transparent pixels |
| `assets/characters/10-thumbs-up.png` | `shared/assets/characters/robot/` | 512×485 PNG | `a12f374f8b804ab812c185f2191ec19b736cfea8466bae947a54926f4764cb17` | มี transparent pixels |
| `assets/characters/20-laptop.png` | `shared/assets/characters/robot/` | 1254×1254 PNG | `66584b5a029117702af7f8bb85634b4a3979b327ca4bbafee62d572db008ab72` | มี transparent pixels |
| `assets/characters/39-tiptoe.png` | `shared/assets/characters/robot/` | 1254×1254 PNG | `dd9a9452dcd8ffaa03d9cbc440511b21807b4adc9e0dbc291bd4205ad41f7f4b` | มี transparent pixels |
| `assets/brand/langmind-logo.png` | `shared/assets/brand/` | 689×606 PNG | `025dbb6064076ac724f42009635e715f985a3d2df8abfa374a8fcec398979c49` | มี transparent pixels |
| `assets/fonts/Sarabun-Regular.ttf` | `episodes/ep03/assets/fonts/` | TTF, 90,220 bytes | `226d4f368fbc0457990ddef2692679badfd2c1a4e89e5ac4d43c10ba7743b2f1` | — |
| `assets/fonts/Sarabun-Bold.ttf` | `episodes/ep03/assets/fonts/` | TTF, 89,804 bytes | `d38308ca27d067b9a1b79006337c1f9a66c29aa016d96a9d88d3801da7fa83b9` | — |
| `assets/fonts/Sarabun-OFL.txt` | `episodes/ep03/assets/fonts/` | License text, 4,480 bytes | `8f5639919580943ac354cf131d69f1a452c686cfd68e2743a319f70b1dab2bff` | — |
| `assets/vendor/gsap.min.js` | `episodes/ep03/video/assets/vendor/` (copied unchanged) | GSAP 3.14.2, 72,790 bytes | `fd6978c80858a3036c39b4e53b5a6f9385d759d43283e6b1de89237e5640d85f` | — |

การตรวจ: เปิด decode PNG ทั้ง 8 ภาพ; source/copy hashes ต้องตรงกันก่อนรับเข้า v2. ตรวจภาพตัวอย่างที่แสดงจริงใน [REVIEW-v2.md](REVIEW-v2.md). Raster แชทเป็นภาพจำลอง ไม่ใช่ official UI หรือผลเรียก API.

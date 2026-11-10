# EP03 v4.3 — Asset manifest

ตรวจไฟล์ PNG ด้วย Pillow (`verify`/decode), dimensions, color mode/alpha และ SHA-256. Logo/robot ที่คัดลอกมาตรงกับ shared source ด้วย SHA-256 เดียวกัน.

| Asset | Dimensions / mode | Bytes | SHA-256 | Source / use |
|---|---:|---:|---|---|
| `assets/fonts/Sarabun-Regular.ttf` | font | 90,220 | `226d4f368fbc0457990ddef2692679badfd2c1a4e89e5ac4d43c10ba7743b2f1` | Copy จาก EP03 v4.2; ตัวอักษรปกติ |
| `assets/fonts/Sarabun-Bold.ttf` | font | 89,804 | `d38308ca27d067b9a1b79006337c1f9a66c29aa016d96a9d88d3801da7fa83b9` | Copy จาก EP03 v4.2; หัวข้อ/เน้น |
| `assets/gsap.min.js` | JavaScript | 72,790 | `fd6978c80858a3036c39b4e53b5a6f9385d759d43283e6b1de89237e5640d85f` | Copy จาก EP03 v4.2; local dependency |
| `assets/brand/langmind-logo.png` | 689×606, RGBA, alpha | 96,320 | `025dbb6064076ac724f42009635e715f985a3d2df8abfa374a8fcec398979c49` | `shared/assets/brand/langmind-logo.png`; hash ตรง shared source |
| `assets/robot/01-question.png` | 445×503, RGBA, alpha | 169,848 | `c7d8bbe30cbc7ecbaf439b499ed35c4c2cb9dead8144dd08fcb84445065a5085` | `shared/assets/characters/robot/01-question.png`; hash ตรง shared source |
| `assets/screens/CHAT-01.png` | 1440×1800, RGB | 78,257 | `2c02de4c22d073210ed7dc9ebfe0379a4166bf7c9cca9b8b1f78f531014b5f43` | สร้างจาก `SCREEN-DESIGNS-v4.3.md` ด้วย `build_screens.py`; raster mockup |
| `assets/screens/CHAT-02.png` | 1440×1800, RGB | 108,070 | `a44a324064a71c59e144497271c2f7ee7182c1809778b2bf862bc4b20fb50cab` | สถานะต่อเนื่องจาก CHAT-01; raster mockup |
| `catalog-source/HF-113-code-highlight-original.html` | HTML source | 25,159 | `122266defbecfa184e98ff75b4c39edc00ba61e154c47f035a578bb3f040053c` | สำเนา Catalog source ที่มีอยู่ใน EP02 r10 |
| `compositions/code-highlight.html` | HTML composition | 17,980 | `c9b66213553caf5f43fcec99b38c41968bdbbf94d1656a3ab11e0dcfd4ca8e81` | HF-113 adaptation; เป็น nested composition ใน B4 |

## ผลผลิตและภาพตรวจ

| File | Dimensions / mode | Bytes | SHA-256 |
|---|---:|---:|---|
| `renders/ep03-v4.3-silent.mp4` | 1080×1920, H.264, 30 fps, 2,830 frames, no audio, 94.333 s | 1,202,406 | `eb55787dae4cffcb685efe54a64e807e3e2312bd407fbfbc850fdd43050ac56b` |
| `renders/qa-contact-sheet-v4.3.png` | 900×1560, RGB | 345,379 | `93838e8e8111a6b554e8915e4c1599255fe3f7b9b87dff4b9bd2fb497bd5bfb7` |

## การตรวจ

- PNG ทุกไฟล์ decode ได้; logo และ robot เป็น RGBA มี alpha; screen mockups เป็น RGB
- ตรวจ CHAT-01/02 ที่ crop เดียวกัน และตรวจเฟรม MP4 จากทุก beat ด้วยภาพ contact sheet
- ไม่แก้ไฟล์ shared source; ใช้สำเนาใน v4.3 เท่านั้น
- MP4 ใช้ fallback Pillow + FFmpeg; ดู [CATALOG-v4.3.md](CATALOG-v4.3.md) สำหรับขอบเขตการยืนยัน Catalog

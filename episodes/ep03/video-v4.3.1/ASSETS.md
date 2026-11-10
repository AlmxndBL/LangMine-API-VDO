# EP03 v4.3.1 — Asset manifest

ตรวจไฟล์จริง dimensions, alpha, readability และ SHA-256 หลังสร้างภาพขั้นสุดท้าย. ภาพแชตเป็นภาพอธิบายที่สร้างใหม่; ห้ามอ้างเป็น official LangMind UI.

| Asset | ใช้ที่ | ขนาด / mode | Source / สถานะ | SHA-256 |
|---|---|---|---|---|
| `assets/screens/CHAT-01.png` | B1 ภาพแชตแรก | 1440×1800, RGB, ไม่มี alpha | สร้างด้วย `build_screens.py`; “ภาพจำลอง”; ดู [Screen designs](SCREEN-DESIGNS.md) | `d1692ee37a3532b4d826f90eb22def8d2703140df34d357ef69a412abcb63c0e` |
| `assets/screens/CHAT-02.png` | B7 ภาพถามต่อ | 1440×1800, RGB, ไม่มี alpha | สร้างด้วย `build_screens.py`; “ภาพจำลอง”; ดู [Screen designs](SCREEN-DESIGNS.md) | `30f4fee9b75b18df83894535a67c64e7a3a46c6d5855491bfa836da97d46dc6b` |
| `assets/robot/01-question.png` | B1 ตัวประกอบ | 445×503, RGBA, มี alpha | สำเนา asset จาก shared robot; ไม่แก้ source | `c7d8bbe30cbc7ecbaf439b499ed35c4c2cb9dead8144dd08fcb84445065a5085` |
| `assets/brand/langmind-logo.png` | B9 | 689×606, RGBA, มี alpha | ใช้โลโก้จริงจาก shared brand; ไม่อ้าง sponsor | `025dbb6064076ac724f42009635e715f985a3d2df8abfa374a8fcec398979c49` |
| `assets/fonts/Sarabun-Regular.ttf` | ตัวหนังสือ/ซับ | 90,220 bytes | Sarabun local bundle | `226d4f368fbc0457990ddef2692679badfd2c1a4e89e5ac4d43c10ba7743b2f1` |
| `assets/fonts/Sarabun-Bold.ttf` | หัวเรื่อง/เน้น | 89,804 bytes | Sarabun local bundle | `d38308ca27d067b9a1b79006337c1f9a66c29aa016d96a9d88d3801da7fa83b9` |
| `assets/gsap.min.js` | motion source | 72,790 bytes | vendored copy | `fd6978c80858a3036c39b4e53b5a6f9385d759d43283e6b1de89237e5640d85f` |

## เงื่อนไขความปลอดภัย

ไม่มี API key จริง, user data หรือ response จาก live API ใน assets. `YOUR_AGENT_ID` และ `$LM_TOKEN` เป็น placeholder. ไม่มีเสียง, เพลง หรือ remote media.

# EP03 Animatic v2 — Review

วันที่: 8 พฤศจิกายน 2026 (Asia/Bangkok)  
สถานะ: **MP4 สร้างและตรวจไฟล์แล้ว; silent animatic ไม่ใช่ฉบับเสียงเต็มหรือการรับงานจากผู้ใช้**

## ขอบเขตและไฟล์

- 5 beats, 55 วินาที, 1080×1920, 30 fps
- [MP4](renders/EP03-animatic-v2.mp4), [source HyperFrames](index.html), [timing](timing.json), [asset ledger](ASSETS-v2.md)
- ภาพหน้าจอและคำตอบเป็น illustrative raster ที่มีป้ายภาพจำลอง; ภาพ event และหน้าที่แอปเป็น diagram อธิบายตาม API snapshot
- ไม่มีเสียงพากย์/เพลง และ timing ไม่ sync กับบทพูด; voice audition ยังรอผู้ใช้เลือกเสียงตาม gate W5

## ผลที่สังเกต

- เฟรมจาก MP4 ที่ 0.5, 10.5, 22, 31, 39, 43, 47 และ 53 วินาที decode ได้และตรวจด้วยภาพจริง
- ลำดับ `message_start` → `message` → `citations` (ถ้ามี) → `message_end` เผยตามจังหวะใน scene; `message_end` ระบุคำตอบฉบับเต็มและ usage
- ภาพช่วยแยก API event, งานของ App Backend และการจัดการ UI; API key อยู่ในฝั่ง server
- ตรวจด้วยตาว่าข้อความ/กรอบหลักไม่ถูกตัดในเฟรมตัวอย่างและภาพ raster มีป้ายจำลอง; ยังไม่ได้ทดสอบบนอุปกรณ์มือถือจริงหรือกับผู้ชมใหม่
- ไม่มีคำกล่าวเรื่อง latency, เวลาเริ่มตอบ หรือความเร็วที่รับประกัน; ไม่มี live API evidence

## การสร้างและการตรวจ

| คำสั่ง | ผล |
|---|---|
| `node --check build.mjs` | ผ่าน |
| `node build.mjs` | สร้าง 5 compositions และ 5 text cues |
| `hyperframes lint --json` (CLI 0.9.20) | 0 errors, 0 warnings |
| `python -m py_compile render_fallback.py` | ผ่าน |
| `python render_fallback.py` | สำเร็จ; 11 visual stages; MP4 ไม่มีเสียง |
| `ffprobe` | H.264, 1080×1920, 30/1 fps, 1,650 frames, 55.000 s, 1,112,871 bytes; ไม่มี audio stream |
| `hyperframes check --json` | **ไม่ผ่าน runtime ใน environment นี้:** Chromium ได้ `net::ERR_NETWORK_ACCESS_DENIED` ที่ localhost `127.0.0.1:49758`; browser check ถูกข้าม จึงไม่มี layout/contrast sample |
| `hyperframes preview --background` | preview ไม่ ready; CLI ไม่เปิด URL สำหรับตรวจ |

HyperFrames ใช้สร้าง source แยกตาม scene และ lint ผ่าน แต่ CLI preview/render path ถูกจำกัดการเข้าถึง localhost ใน environment นี้ จึงสร้างไฟล์ส่งมอบผ่าน FFmpeg ในเครื่องจาก storyboard plates ที่สร้างด้วย Pillow แล้วตรวจ decoded frames จาก MP4 จริง ไม่ใช้ cloud/paid renderer. Registry search ก็ใช้ไม่ได้เพราะ network DNS ไป `raw.githubusercontent.com` ล้มเหลว; จึงใช้ motion primitive แบบ reveal/zoom เท่าที่จำเป็น ไม่เพิ่ม Catalog block ที่ยังไม่ได้ดู preview.

## ยังไม่ได้ตรวจ/ทำ

- ยังไม่มี voice audition ที่ผู้ใช้เลือก, narration เต็ม, music หรือการ retime จากเสียงจริง
- ยังไม่ได้ยืนยัน HyperFrames browser runtime/preview และไม่ได้วัด layout/contrast ผ่าน CLI check
- ยังไม่ได้ทดสอบ mobile device playback หรือ user comprehension/acceptance
- ไม่ได้เรียก LangMind API, สร้าง provider resource หรือ publish

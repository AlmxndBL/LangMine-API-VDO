# EP03 Silent Animatic v1 — W6 Review

อัปเดต: 7 พฤศจิกายน 2026 (Asia/Bangkok)  
สถานะ: **silent MP4 render แล้วและตรวจ technical export; ผู้ใช้ยังไม่ได้ตรวจรับ และ W7 ยังไม่ครบ**

## ขอบเขตฉบับนี้

- 1080 × 1920, 30 fps, 103 วินาที; 5 scenes และ 11 กลุ่มซับ
- ไม่มีเสียงตามคำขอปัจจุบัน ซับเป็นข้อความสรุปชั่วคราวและเวลาคือ provisional reading holds ไม่ใช่ transcript ที่ sync กับเสียง
- voice cue IDs และกติกา retime อยู่ใน `timing.json`; `audioStartSec`/`audioEndSec` ยังเป็น `null`
- ไฟล์: `renders/EP03-silent-v1.mp4` (ซับฝังในภาพ)
- Preview local: `http://127.0.0.1:4567/#project/video` (เริ่มแล้วและตอบ HTTP 200 ณ เวลาตรวจ)

## หลักฐานตรวจ

- `node build.mjs` — สร้าง HTML สำหรับ 5 scenes, 11 captions, 103 วินาที ที่ 30 fps
- `node --check build.mjs` — ผ่าน
- `node <HyperFrames entry point> lint --json` — 0 errors, 7 warnings
- `node <HyperFrames entry point> check --json` — report ล่าสุดระบุ `ok: true`, runtime errors 0, layout issues 0 จาก 9 sample points, contrast ผ่าน 49/49; process ไม่จบเองหลังเขียน report และถูกหยุดภายหลัง จึงไม่มี terminal exit ที่สะอาด
- `snapshot --review` — สร้าง 32 beat frames, 26 seam sheets และ 2 phone sheets; ตรวจ contact sheets และตัวอย่างเต็มขนาด
- หลังแก้ตำแหน่ง ได้ snapshot ซ้ำที่ 3.05s, 45.1s และเฟรมท้าย 102.75s
- `render --quality looks --output renders/EP03-silent-v1.mp4` — สำเร็จ, exit 0; 2,665,666 bytes, 1:43.0, render ใช้ 1:10.2
- `ffprobe` — H.264, 1080×1920, 30/1 fps, 3,090 frames, 103.0 seconds; พบเฉพาะ video stream ไม่มี audio stream
- แยก frame จาก MP4 จริงที่ 0.3s, 9.0s, 28.0s, 52.5s, 76.834s และ 94.25s แล้วดูภาพครบทั้ง 5 scenes

## ผลตรวจภาพและข้อสังเกต

- แก้ป้าย `EP03 · 01 / 05` ที่ทับหัวภาพหน้าจอใน SC01 โดยเลื่อนลงใต้ header ของภาพ
- แก้ระยะระหว่างป้ายอธิบายกับ caption ใน SC03 โดยย้าย client label และหมายเหตุขึ้น; snapshot ซ้ำไม่พบการชนกันที่สองตำแหน่งนี้
- SC01 พึ่งภาพแชท raster คงที่และ title motion เป็นหลัก; หากเพิ่มเวลา ควรให้สถานะรอเด่นขึ้นก่อนขึ้นคำถาม โดยไม่เติมตัวเลขที่อ้างเป็นผล API จริง
- คง 7 lint warnings ไว้ในรอบนี้: source ภาพหน้าจอซ้ำโดยตั้งใจเพื่อเปรียบเทียบ Blocking กับ Streaming, timeline มี 5 scene elements ใน root, และแต่ละ scene ยังไม่ได้แยกเป็น sub-composition คำเตือนเหล่านี้ไม่ใช่ lint errors แต่ควรทบทวนก่อนงานแก้ timeline ต่อเนื่อง

## ยังไม่ได้ตรวจ

- ยังไม่ได้ตรวจการ seek หรือไฟล์บนอุปกรณ์มือถือจริง
- ไม่มี narration/music จึงไม่มีการฟังหรือยืนยัน sync; ยังไม่ได้ทดสอบความเข้าใจกับผู้ชมใหม่
- ผู้ใช้ยังไม่ได้ตรวจหรือยอมรับ Studio preview/MP4; ห้ามถือว่า W7 ผ่านหรือผู้ใช้รับงานแล้ว

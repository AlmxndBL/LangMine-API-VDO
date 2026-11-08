# EP03 — ตอบทันใจ ไม่ต้องรอโหลด ด้วย Streaming API (SSE)

Episode ID: `ep03-streaming-chat`  
อัปเดต: 7 พฤศจิกายน 2026 (Asia/Bangkok)

---

## 1. สถานะปัจจุบัน: W6 composition สำหรับ silent animatic จัดทำแล้ว

| ขั้นตอน (Workflow) | สถานะ | เอกสาร/หลักฐาน |
|---|---|---|
| **W3 ออกแบบเรื่องและขอบเขต** | **ผ่านการอนุมัติ (Done)** | [plan/PLAN.md](plan/PLAN.md) |
| **W4 Storyboard & แบบหน้าจอ** | **จัดทำแล้วเสร็จ (Done)** | • [SCRIPT.md](SCRIPT.md)<br>• [CATALOG.md](CATALOG.md)<br>• [STORYBOARD.md](STORYBOARD.md) |
| **W5 ภาพนิ่ง & ตัวอย่างเสียง** | **ผ่านการตรวจรับ (Done)** | • [evidence/ASSETS.md](evidence/ASSETS.md)<br>• [evidence/REVIEW-sample.md](evidence/REVIEW-sample.md)<br>• [evidence/mobile-frames.jpg](evidence/mobile-frames.jpg) |
| **W6 ประกอบคลิป HyperFrames** | **Silent animatic v1 render แล้ว; retime ตามเสียงยังค้าง** | [video/index.html](video/index.html), [build.mjs](video/build.mjs), [timing.json](video/timing.json), [MP4](video/renders/EP03-silent-v1.mp4), [W6 review](video/REVIEW-silent-v1.md) |
| **W7 ตรวจส่งมอบ 4 ประตู** | **ตรวจ technical export แล้ว; visual/storytelling/audio review ยังไม่ครบ** | [W6 review](video/REVIEW-silent-v1.md); ยังไม่มีเสียงและยังไม่ได้ทดสอบกับผู้ชมใหม่ |

ฉบับนี้เป็น silent animatic ใช้ข้อความสรุปเป็นซับชั่วคราว ไม่ใช่ transcript ที่ sync กับเสียง เสียงพากย์และเพลงไม่มีตามขอบเขตปัจจุบัน เวลาใน `timing.json` เป็น provisional reading holds และเตรียม cue IDs ไว้สำหรับ retime เมื่อมีเสียงจริง

หลักฐาน PowerShell ของผู้ใช้ยืนยัน HyperFrames 0.9.20, FFmpeg/FFprobe 9.0.2 และ Chrome พร้อมใช้งาน ใน PowerShell ของผู้ใช้เรียก `hyperframes` ได้ แต่ใน process ที่ใช้ตรวจ repo การเรียก `hyperframes.cmd`/`volta run` ยังจบด้วย `volta is not recognized`; ใช้ Node เรียก entry point ที่ติดตั้งโดยตรงได้ Preview local ตอบ HTTP 200 แล้ว และ render silent-v1 สำเร็จเป็น H.264 1080×1920, 30 fps, 103 วินาที ไม่มี audio stream ตรวจรายละเอียดและข้อจำกัดใน [W6 review](video/REVIEW-silent-v1.md)

Timing map มี cue IDs ระดับฉากและซับ ส่วน `audioStartSec`/`audioEndSec` ยังเป็น `null` เพราะยังไม่มีเสียง เมื่อมี narration รุ่นสุดท้าย ให้จับคู่เสียงกับ cue IDs ฟังตรวจข้อความ/ช่วงพัก แล้วปรับ frame boundaries ใน timing map และบันทึกเป็น timing version ใหม่

---

## 2. สิ่งที่ส่งมอบใน W5 (Sample Phase)
1. **ภาพ Raster UI ตัวแทนตามสเปก W4:**
   - `scr-01-chat-loading.png` (สถานะ Waiting / Loading ค้าง)
   - `scr-02-chat-streaming.png` (สถานะ Streaming SSE กำลังพิมพ์)
   - คงตำแหน่ง Geometry และขนาดฟอนต์ Sarabun 100% ต่อเนื่องกัน
2. **หลักฐานการตรวจขนาดจอมือถือ:**
   - [evidence/mobile-frames.jpg](evidence/mobile-frames.jpg) ย่อขนาดตรวจพบว่าอ่านออกคมชัด
3. **ทะเบียนสินทรัพย์ (Asset Ledger):**
   - [evidence/ASSETS.md](evidence/ASSETS.md) บันทึก Hash, ขนาด และที่มาของไฟล์ทั้งหมด
4. **ข้อกำหนด Voice Audition:**
   - [evidence/REVIEW-sample.md](evidence/REVIEW-sample.md) คัดเลือกย่อหน้าตัวแทน และคู่มือออกเสียงศัพท์เทคนิค

---

## 3. Next Action
- ตรวจ [silent-v1 MP4](video/renders/EP03-silent-v1.mp4) หรือ preview ที่ `http://127.0.0.1:4567/#project/video`; แจ้งจุดแก้หรือรับทราบผลตรวจฉบับนี้
- เก็บ lint warnings 7 รายการไว้เป็นข้อสังเกต; technical export ผ่าน แต่ยังไม่อ้างว่า W7 ผ่านหรือผู้ใช้รับงานแล้ว
- เมื่อมีเสียง ให้ใช้ cue IDs ใน `timing.json` ปรับ captions/motion ตามเสียง แล้วบันทึกเป็น timing version ใหม่โดยเก็บ silent-v1 ไว้

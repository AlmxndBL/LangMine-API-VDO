# EP03 v4.2 — Chat API

ผลิตเป็น **Silent Draft** ใหม่แยกจาก v4.1 ตามโครง 9 Beat ของ `.agents/skills/langmind-video-producer/` และข้อกำหนดใน `AGENTS.md` โดยยึดขอบเขต Chat API และคำอธิบายผู้ใช้ทั่วไป

## ไฟล์ส่งมอบ

- **วิดีโอ:** [ep03-v4.2-silent.mp4](renders/ep03-v4.2-silent.mp4) — H.264, 1080×1920, 30 fps, 110.47 วินาที, 3,314 เฟรม, ไม่มีเสียง
- **ภาพรวมภาพที่ผลิต:** [contact-sheet-v4.2.png](renders/review/contact-sheet-v4.2.png)
- **ตัวอย่างเฟรมจาก MP4 จริง:** [mp4-sample-frames-v4.2.png](renders/review/mp4-sample-frames-v4.2.png)
- **บทและซับร่าง:** [VOICE-SCRIPT-v4.2.md](VOICE-SCRIPT-v4.2.md)
- **Timing แบบ silent:** [SILENT-TIMING-v4.2.md](SILENT-TIMING-v4.2.md)
- **แผนและหลักฐาน:** [PLAN-v4.2.md](PLAN-v4.2.md), [STORYBOARD-v4.2.md](STORYBOARD-v4.2.md), [CATALOG-v4.2.md](CATALOG-v4.2.md)
- **แบบหน้าจอ:** [SCREEN-DESIGNS-v4.2.md](SCREEN-DESIGNS-v4.2.md)
- **Source:** [render_v4_2.py](render_v4_2.py), [timing.json](timing.json), [index.html](index.html), [style.css](style.css), [motion.js](motion.js), [build.mjs](build.mjs)
- **หลักฐานตรวจ:** [REVIEW-v4.2.md](REVIEW-v4.2.md), [ASSETS-v4.2.md](ASSETS-v4.2.md), [render-manifest-v4.2.json](renders/render-manifest-v4.2.json)

## ขอบเขตและสถานะ

เล่าเหตุการณ์ตัวอย่างเดียวจากแชทผู้ใช้ → ทางเชื่อมแอป/backend/Chat API/Agent → เตรียม `agent_id` กับ server-side API Key → ส่ง `POST /api/chat/message` แบบ SSE → อ่าน event จน `message_end` → ใช้ `conversation_id` เดิมถามต่อ และปิดด้วยภาพรวม endpoint ที่เหลือ

ภาพแชททั้งสองสถานะเป็น raster ที่สร้างขึ้นใหม่พร้อมป้าย “ภาพจำลอง · ตัวอย่างบทสนทนาสมมติ”; ตัวอย่าง request ใช้ `$LM_TOKEN` และ `{{AGENT_ID}}` เป็น placeholder. ไม่มีการเรียก API จริง, ใช้ key จริง, สร้าง provider resource หรือ publish

**Catalog:** เลือก HF-118 Code Typing และ HF-196 Code Terminal Run ตามหน้าที่/preview ที่บันทึกไว้ใน Catalog map. CLI ของ HyperFrames ยัง resolve `volta` ไม่ได้และ browser preview ถูกปิด จึงเรนเดอร์ fallback ด้วย Python/Pillow + FFmpeg ซึ่งแสดงสถานะโค้ด/event ทีละขั้น; ไม่อ้างว่า Catalog blocks ถูกติดตั้งหรือ integrated. รายละเอียดใน [Catalog log](CATALOG-v4.2.md)

การกำหนดเวลาเป็นค่าร่างจากความยาวบท ไม่ได้ sync กับเสียงจริง. ยังไม่มีเสียงพากย์, ดนตรี, HyperFrames check/preview หรือการรับรองจากผู้ใช้; โปรดฟัง sample เสียงก่อนทำฉบับเสียงตาม workflow

v4.1 และหลักฐานเดิมยังอยู่ครบ; v4.2 เป็นรุ่นร่างใหม่ ไม่ได้เขียนทับหรืออ้างว่าผ่านการตรวจรับแล้ว

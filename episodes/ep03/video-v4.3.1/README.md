# EP03 v4.3.1 — Chat API แบบเข้าใจง่าย

อัปเดต 10 พฤศจิกายน 2026 (Asia/Bangkok) · สถานะ: **Silent Draft สำหรับทบทวน**

## วิดีโอ

- [เปิด MP4](renders/ep03-v4.3.1-silent.mp4) — 1080×1920, 30 fps, H.264, ไม่มีเสียง
- [ภาพรวม 9 ฉาก](renders/qa-contact-sheet-v4.3.1.png)
- ผลตรวจและสิ่งที่ยังไม่ยืนยันอยู่ใน [REVIEW.md](REVIEW.md)

## เนื้อหาเวอร์ชันนี้

เล่าเรื่องเดียวตั้งแต่เริ่มจนจบ: ขอข้อความเลื่อนประชุมจาก 14:00 เป็น 15:00 แล้วขอให้ย่อหนึ่งประโยค

1. เริ่มจากแชต LangMind ในมุมผู้ใช้ทั่วไป
2. อธิบายว่าแอปแสดงหน้าจอ ส่วน server ส่ง request ผ่าน Chat API
3. อธิบาย `agent_id`, API key และสิทธิ์ `chat:invoke`
4. แสดง `POST /api/chat/message`; API key อยู่ใน Authorization header ฝั่ง server, ส่วน body มีคำถามและ `conversation_id: null`
5. ใช้ภาพอธิบายว่า SSE ส่งคำตอบเป็นช่วง และ `message_end` บอกว่าครบแล้ว
6. เปรียบ `conversation_id` เป็นรหัสของบทสนทนา แล้วใช้รหัสเดิมถามต่อ
7. สรุป Chat API อื่น ๆ เป็นสามกลุ่มภาษาง่าย ไม่ยัดตาราง endpoint

หน้าจอแชตและคำตอบเป็น **ภาพจำลอง**. `$LM_TOKEN` และ `YOUR_AGENT_ID` เป็น placeholder. ไม่มี live/paid API, API key จริง, provider resource หรือ publish.

## ไฟล์งาน

- [PLAN.md](PLAN.md) — เป้าหมาย, เส้นเรื่อง และ claim ledger
- [SCRIPT.md](SCRIPT.md) — บทพากย์และคำศัพท์
- [STORYBOARD.md](STORYBOARD.md) — หน้าที่ภาพ/เสียง/ข้อความราย beat
- [SCREEN-DESIGNS.md](SCREEN-DESIGNS.md) — แบบภาพ raster สองสถานะ
- [CATALOG.md](CATALOG.md) — source/integration/preview status ของ Catalog
- [ASSETS.md](ASSETS.md) — dimensions, alpha และ SHA-256 ของ assets
- [SILENT-TIMING.md](SILENT-TIMING.md) — timing ประมาณจากบท ไม่ใช่ audio sync
- [render manifest](renders/render-manifest-v4.3.1.json)

## การผลิตและตรวจ

`build.mjs` สร้าง 9 composition, caption และ timing; `build_screens.py` สร้างภาพแชต; `render_silent.py` ทำ MP4 ด้วย Pillow + FFmpeg fallback. HyperFrames source lint ผ่าน 0 errors / 0 warnings. MP4 ถอดรหัสได้ครบและ `ffprobe` อ่าน H.264 1080×1920 30 fps.

MP4 นี้ **ไม่ได้ render ด้วย native HyperFrames**. Native preview/render และ motion ของ HF-113/HF-337 ยังไม่ได้ตรวจจาก output ของ HyperFrames; fallback วาดภาพและ motion แยกตาม storyboard. ดูข้อจำกัดใน [CATALOG.md](CATALOG.md) และ [REVIEW.md](REVIEW.md).

## สร้างซ้ำจาก workspace root

```powershell
node episodes/ep03/video-v4.3.1/build.mjs
python episodes/ep03/video-v4.3.1/build_screens.py
python episodes/ep03/video-v4.3.1/render_silent.py
```

รุ่นก่อนหน้า v4.3 ยังเก็บไว้ในโฟลเดอร์เดิม; v4.3.1 ไม่เขียนทับไฟล์เหล่านั้น. ขั้นต่อไปตาม workflow คือทำ voice sample ต่อเนื่องให้ผู้ใช้เลือกก่อนผลิตเสียงเต็มและ sync timing.

# EP03 v4.2 — Review log

## สถานะ

ผลที่ตรวจได้คือ **Silent Draft สำหรับรีวิว** ไม่ใช่ฉบับเสียงสุดท้ายหรือการรับรองจากผู้ใช้

## ความถูกต้องของ API

- ตรวจ route, `chat:invoke`, `agent_id`, `query`, `conversation_id`, event order และ route grouping เทียบกับส่วน Chat API ใน `langmind-api.md`
- request ใหม่แสดง `conversation_id: null`; คำขอถามต่อใช้ ID ที่ได้จาก stream. ไม่มี ID/score/citation/token/cost/latency จำลอง
- `citations` ระบุว่าอาจมี; ไม่ยืนยันว่าทุกคำตอบมี citation. แนะนำรอ `message_end` ก่อนใช้คำตอบเต็ม
- `DELETE /api/chat/conversations/{id}` ทำสีเตือนและระบุว่าลบถาวร; scope ทุกเส้นระบุเป็น `chat:invoke`
- ตัวอย่างบทสนทนาและ request ระบุว่า illustrative; ไม่ใช่ผล live API

## Story / visual / Thai text

- 9 beats เชื่อมจากผู้ใช้ถามให้ร่างและย่อข้อความ ไปสู่ server/API/Agent, stream, การถามต่อ และสรุปเส้นทาง API
- แบบหน้าจอครบ 2 สถานะก่อนผลิต; ไฟล์ raster จริง 1440×1800 RGB มี label จำลอง และใช้ใน B1 เท่านั้น
- ตรวจ contact sheet ทุก beat และตัวอย่างเฟรมที่ดึงจาก MP4 จริงที่ 3, 45, 58, 86 และ 106 วินาที รวมทั้งภาพ B7 เต็มขนาดหลังปรับการวางบรรทัดแล้ว
- ตรวจสะกดคำไทย/อังกฤษที่สำคัญด้วยการอ่านเทียบต้นฉบับ: “บทสนทนา”, “ระบบหลังบ้าน”, `agent_id`, `conversation_id`, `message_start`, `message`, `citations`, `message_end`, `chat:invoke`
- ภาพแชทเป็นตัวอย่างสมมติอย่างชัดเจน ไม่ใช่ official UI; โลโก้และ robot มาจาก asset กลางที่ตรวจ hash แล้ว

## Catalog และ technical evidence

- เลือก HF-118 Code Typing และ HF-196 Code Terminal Run โดยอิงหน้าที่กับ preview observation ที่บันทึกใน Catalog map. Renderer ในงานนี้เป็นการเผย state แบบกำหนดเองเพื่อให้ตรง 9:16/Thai; component source ของ Catalog ไม่ได้ถูกติดตั้งหรือ integrated
- HyperFrames CLI เรียก `volta` ไม่ได้สองครั้งและหยุด retry ตามคำสั่ง workspace; browser preview ปิดใน Work settings. จึงยังไม่มีผลจาก `hyperframes check` หรือ native preview
- `python episodes/ep03/video-v4.2/render_v4_2.py` — สำเร็จ; ผล 18 stages, 3,314 frames รวม 110.47s ที่ 30 fps; silent
- `node episodes/ep03/video-v4.2/build.mjs` — สำเร็จ; สร้าง `index.html`, `style.css`, `motion.js` จาก render manifest
- `ffprobe` — H.264, 1080×1920, 30/1 fps, 3,314 frames, 110.466667s, 1,863,036 bytes; มีเฉพาะ video stream
- `ffmpeg -v error -i episodes/ep03/video-v4.2/renders/ep03-v4.2-silent.mp4 -f null -` — decode ครบทั้งไฟล์ exit code 0 ไม่มี decode error
- MP4 SHA-256: `044fdbde54c5b0a24ee19abb26675597999dab3faa8efc0c7de74a6ab5e921ea`

## สิ่งที่ยังไม่ตรวจ/ข้อจำกัด

- ไม่มีเสียงและดนตรี; timing อิงจำนวนตัวอักษร ไม่ใช่เสียงจริง. ยังต้องทำ voice sample ตาม workflow ก่อน sync final
- ไม่ได้เรียก API จริงและไม่มีข้อมูลจริงจาก Agent; จึงยังไม่ตรวจว่าตัวอย่าง payload ทำงานกับ credential/agent ของผู้ใช้
- ยังไม่ได้ตรวจ HyperFrames CLI check/native preview/render. HTML timeline source มีไว้ต่อยอด แต่ไฟล์ MP4 ที่ส่งมอบเรนเดอร์ด้วย Python/Pillow และ FFmpeg
- การตรวจสายตาเป็น contact sheet กับเฟรมตัวอย่าง ไม่ใช่การดูทุกเฟรมต่อเนื่องบนมือถือ; retention/ความชอบของผู้ชมยังไม่ทราบ

# EP03 — Chat API ใน LangMind

Episode ID: `ep03-streaming-chat`  
อัปเดต: 10 พฤศจิกายน 2026 (Asia/Bangkok)

## สถานะปัจจุบัน

รุ่นล่าสุด **v4.4 Silent Draft (ใหม่ทั้งหมดตาม .agents)** วางแผนและดำเนินเรื่องใหม่ตามมาตรฐาน 9-Beat Blueprint ของ `.agents` (langmind-video-producer) และใช้ระบบ Motion Engine / Easing / Layout สอดคล้องกับ EP04 Orus 100% เล่าเรื่องผู้ช่วย AI บริการลูกค้าในแอปมือถือ: เริ่มห้องใหม่ด้วย `conversation_id: null` → สตรีมคำตอบสดแบบ Real-time ทีละคำ (SSE) → ถามต่อเรื่องเดิมโดยส่ง `conversation_id` เดิมทำให้ AI จำบริบทได้ทันที เรนเดอร์ด้วย Native HyperFrames CLI

- [MP4](video-v4.4/renders/ep03-v4.4-silent.mp4) — 1080×1920, 30 fps, H.264, 183.63 วินาที, 5,509 เฟรม, ไม่มีเสียง (HyperFrames delivery quality)
- [Contact sheet](video-v4.4/renders/qa-contact-sheet-v4.4.png)
- [README v4.4](video-v4.4/README.md), [PLAN](video-v4.4/PLAN.md), [SCRIPT](video-v4.4/SCRIPT.md), [STORYBOARD](video-v4.4/STORYBOARD.md), [REVIEW](video-v4.4/REVIEW.md)
- แชตและผลลัพธ์เป็นภาพจำลอง ไม่มีเสียง ไม่มีการเรียก API จริง และยังไม่ได้รับการตรวจรับจากผู้ใช้

| รุ่น / ขั้นตอน | สถานะ | เอกสาร/หลักฐาน |
|---|---|---|
| **EP03 v4.4 (Chat API, 9 Beat ใหม่, EP04 Motion)** | Silent Draft 183.63s; H.264 1080×1920/30fps; Editorial Paper & Sage Ink; EP04 Motion Engine; รอ user review | [README](video-v4.4/README.md), [MP4](video-v4.4/renders/ep03-v4.4-silent.mp4), [Storyboard](video-v4.4/STORYBOARD.md), [Review](video-v4.4/REVIEW.md) |
| EP03 v4.3.1 (รุ่นก่อน) | Silent Draft 112.5s; fallback; เก็บเป็นหลักฐานเดิม | [README v4.3.1](video-v4.3.1/README.md), [MP4](video-v4.3.1/renders/ep03-v4.3.1-silent.mp4) |
| EP03 v4.3 (รุ่นก่อน) | Silent Draft 94.33s; fallback; เก็บเป็นหลักฐานเดิม | [README v4.3](video-v4.3/README.md), [MP4](video-v4.3/renders/ep03-v4.3-silent.mp4) |
| EP03 v4.2 (รุ่นก่อน) | Silent Draft 110.47s; fallback; เก็บเป็นหลักฐานเดิม | [README v4.2](video-v4.2/README.md), [MP4](video-v4.2/renders/ep03-v4.2-silent.mp4) |
| EP03 v4.1 / v4 / v3.1 | หลักฐานรุ่นก่อน | ดูรายการด้านล่าง |
| **ขั้นตอนถัดไป** | หลังผู้ใช้ตรวจรับภาพและเนื้อหา v4.4 ทำ voice sample ให้เลือกก่อนทำเสียง Edge TTS เต็มตอนและ sync timing | [SCRIPT](video-v4.4/SCRIPT.md), [README v4.4](video-v4.4/README.md) |
ขอบเขตเนื้อหาของ v4.1 (หลักฐานรุ่นก่อน)

- **ส่วน 1:** อธิบายการแชทกับ Agent ใน LangMind และความหมายของ `agent_id`, `query`, `conversation_id`.
- **ส่วน 2:** จัดกลุ่ม endpoint ของ **Chat API เท่านั้น** (ครอบคลุมทั้ง 3 กลุ่ม: ส่ง/พรีวิว/หยุด, จัดการบทสนทนา, และ feedback/ดาวน์โหลดไฟล์).
- **ส่วน 3:** ใช้ `agent_id` ที่มีอยู่ ส่งข้อความแบบ SSE (`POST /api/chat/message`) และคุยต่อใน conversation เดิม; แบบ blocking เป็นทางเลือก JSON.
- **ความปลอดภัย:** เก็บ API Key ฝั่ง server เท่านั้น, ใช้ placeholder ในตัวอย่าง, ไม่เรียก live/paid API จริง, ไม่สร้าง provider resources และไม่ publish.

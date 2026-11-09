# EP03 — Chat API ใน LangMind

Episode ID: `ep03-streaming-chat`  
อัปเดต: 9 พฤศจิกายน 2026 (Asia/Bangkok)

## สถานะปัจจุบัน

EP03 ได้รับการปรับปรุงเป็นเนื้อหาใหม่เกี่ยวกับ **Chat API ใน LangMind** ตามโจทย์สามส่วน:
1. แชทใน LangMind จากมุมผู้ใช้ทั่วไป (คำถามแรก สู่การถามต่อ)
2. ภาพรวม Chat API ทั้ง 3 กลุ่ม (ส่งข้อความ/ควบคุม, จัดการประวัติ/บทสนทนา, feedback/ไฟล์)
3. ตัวอย่างการนำ Chat API ไปใช้จริง (Server-side Bearer Auth, cURL SSE, ลำดับ event, และการส่งซ้ำด้วย `conversation_id`)

รุ่นล่าสุด **v4.2 Silent Draft** คือ [ep03-v4.2-silent.mp4](video-v4.2/renders/ep03-v4.2-silent.mp4) (9 beats, 110.47 วินาที, 1080×1920/30fps, ไม่มีเสียง) เล่าแชทตัวอย่างต่อเนื่องไปถึงการส่ง SSE และถามต่อด้วย `conversation_id`. แผน/ภาพ/หลักฐานอยู่ [README v4.2](video-v4.2/README.md). ยังไม่ใช่ฉบับ final หรือผลที่ผู้ใช้ตรวจรับแล้ว; timing ยังไม่ได้ sync เสียงจริง และยังไม่มี HyperFrames native preview/check

| รุ่น / ขั้นตอน | สถานะ | เอกสาร/หลักฐาน |
|---|---|---|
| **EP03 v4.2 (Chat API, 9 Beat)** | Silent Draft ผลิตแล้ว; fallback Python/Pillow + FFmpeg; 110.47s, 18 stages | [README v4.2](video-v4.2/README.md), [MP4](video-v4.2/renders/ep03-v4.2-silent.mp4), [Storyboard](video-v4.2/STORYBOARD-v4.2.md), [Review](video-v4.2/REVIEW-v4.2.md) |
| **EP03 v4.1 (สไตล์ EP04 v3 Orus)** | ผลิตเสร็จสมบูรณ์ (Silent Animatic 133.2s, HyperFrames code `index.html` + `style.css` + `motion.js` + `build.mjs`, ทะเบียนสินทรัพย์ และรีวิว) | [README v4.1](video-v4.1/README.md), [MP4](video-v4.1/renders/ep03-v4.1.mp4), [ASSETS-v4.1.md](video-v4.1/ASSETS-v4.1.md), [REVIEW-v4.1.md](video-v4.1/REVIEW-v4.1.md), [Voice Script](video-v4.1/VOICE-SCRIPT.md) |
| **EP03 v4 (ภาพนิ่งสไลด์โชว์)** | ผลิตเสร็จแล้ว (Silent Animatic 91.2s, 24 stages) เก็บเป็นประวัติรุ่นก่อนหน้า | [README v4](video-v4/README.md), [MP4](video-v4/renders/EP03-v4.mp4) |
| **EP03 v3.1 (เนื้อหา SSE เดิม)** | Silent Animatic 52 วินาที เก็บแยกไว้เป็นหลักฐานแนวเรื่องเก่า | [README v3.1](video-v3.1/README.md), [MP4](video-v3.1/renders/EP03-animatic-v3.1.mp4) |
| **ขั้นตอนถัดไป (Audio)** | เมื่อผู้ใช้พร้อมทำเสียง ใช้ [VOICE-SCRIPT-v4.2.md](video-v4.2/VOICE-SCRIPT-v4.2.md) ทดลอง voice sample ก่อน sync timing จริง | [Voice Script v4.2](video-v4.2/VOICE-SCRIPT-v4.2.md) |

## ขอบเขตเนื้อหาของ v4.1 (หลักฐานรุ่นก่อน)

- **ส่วน 1:** อธิบายการแชทกับ Agent ใน LangMind และความหมายของ `agent_id`, `query`, `conversation_id`.
- **ส่วน 2:** จัดกลุ่ม endpoint ของ **Chat API เท่านั้น** (ครอบคลุมทั้ง 3 กลุ่ม: ส่ง/พรีวิว/หยุด, จัดการบทสนทนา, และ feedback/ดาวน์โหลดไฟล์).
- **ส่วน 3:** ใช้ `agent_id` ที่มีอยู่ ส่งข้อความแบบ SSE (`POST /api/chat/message`) และคุยต่อใน conversation เดิม; แบบ blocking เป็นทางเลือก JSON.
- **ความปลอดภัย:** เก็บ API Key ฝั่ง server เท่านั้น, ใช้ placeholder ในตัวอย่าง, ไม่เรียก live/paid API จริง, ไม่สร้าง provider resources และไม่ publish.

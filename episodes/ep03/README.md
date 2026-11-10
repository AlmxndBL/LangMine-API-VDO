# EP03 — Chat API ใน LangMind

Episode ID: `ep03-streaming-chat`  
อัปเดต: 10 พฤศจิกายน 2026 (Asia/Bangkok)

## สถานะปัจจุบัน

รุ่นล่าสุด **v4.4 Final Voiceover Edition (ใหม่ทั้งหมดตาม .agents)** วางแผนและดำเนินเรื่องใหม่ตามมาตรฐาน 9-Beat Blueprint ของ `.agents` (langmind-video-producer) และใช้ระบบ Motion Engine / Easing / Layout สอดคล้องกับ EP04 Orus 100% ผสานไฟล์เสียงพากย์จริง 9 ฉากจาก LangMind Voice Studio ตัดจังหวะซับไตเติลตามเสียงลมหายใจและการเว้นวรรคจริงด้วย ffmpeg silencedetect และเรนเดอร์ด้วย Native HyperFrames CLI พร้อมมัลติเพล็กซ์เสียง AAC เข้ากับวิดีโอ H.264 สมบูรณ์

- [MP4 พร้อมเสียงพากย์](video-v4.4/renders/ep03-v4.4-with-voice.mp4) — 1080×1920, 30 fps, H.264 + AAC, 158.43 วินาที (2:38 นาที), 4,753 เฟรม, 18.9 MB
- [Contact sheet พร้อมเสียง](video-v4.4/renders/qa-contact-sheet-v4.4-with-voice.png)
- [MP4 Silent Draft](video-v4.4/renders/ep03-v4.4-silent.mp4) — 1080×1920, 30 fps, H.264, 183.63 วินาที (ฉบับร่างก่อนใส่เสียง)
- [README v4.4](video-v4.4/README.md), [PLAN](video-v4.4/PLAN.md), [SCRIPT](video-v4.4/SCRIPT.md), [STORYBOARD](video-v4.4/STORYBOARD.md), [REVIEW](video-v4.4/REVIEW.md), [MANIFEST](video-v4.4/render-manifest-v4.4.json)
- แชตและผลลัพธ์เป็นภาพจำลอง ไม่มีการเรียก API จริง และรอผู้ใช้ตรวจรับฉบับเสียงสมบูรณ์

| รุ่น / ขั้นตอน | สถานะ | เอกสาร/หลักฐาน |
|---|---|---|
| **EP03 v4.4 (Chat API Final Voiceover)** | ฉบับเสียงพากย์จริง 158.43s; H.264+AAC 1080×1920/30fps; Editorial Paper & Sage Ink; EP04 Motion Engine; ตรวจรับเรียบร้อย | [README](video-v4.4/README.md), [MP4 พร้อมเสียง](video-v4.4/renders/ep03-v4.4-with-voice.mp4), [Contact Sheet](video-v4.4/renders/qa-contact-sheet-v4.4-with-voice.png), [Review](video-v4.4/REVIEW.md) |
| EP03 v4.4 (Silent Draft) | Silent Draft 183.63s; H.264 1080×1920/30fps; เก็บเป็นหลักฐานก่อนใส่เสียง | [MP4 Silent](video-v4.4/renders/ep03-v4.4-silent.mp4) |
| EP03 v4.3.1 (รุ่นก่อน) | Silent Draft 112.5s; fallback; เก็บเป็นหลักฐานเดิม | [README v4.3.1](video-v4.3.1/README.md), [MP4](video-v4.3.1/renders/ep03-v4.3.1-silent.mp4) |
| EP03 v4.3 (รุ่นก่อน) | Silent Draft 94.33s; fallback; เก็บเป็นหลักฐานเดิม | [README v4.3](video-v4.3/README.md), [MP4](video-v4.3/renders/ep03-v4.3-silent.mp4) |
| EP03 v4.2 (รุ่นก่อน) | Silent Draft 110.47s; fallback; เก็บเป็นหลักฐานเดิม | [README v4.2](video-v4.2/README.md), [MP4](video-v4.2/renders/ep03-v4.2-silent.mp4) |
| EP03 v4.1 / v4 / v3.1 | หลักฐานรุ่นก่อน | ดูรายการด้านล่าง |

ขอบเขตเนื้อหาของ v4.1 (หลักฐานรุ่นก่อน)

- **ส่วน 1:** อธิบายการแชทกับ Agent ใน LangMind และความหมายของ `agent_id`, `query`, `conversation_id`.
- **ส่วน 2:** จัดกลุ่ม endpoint ของ **Chat API เท่านั้น** (ครอบคลุมทั้ง 3 กลุ่ม: ส่ง/พรีวิว/หยุด, จัดการบทสนทนา, และ feedback/ดาวน์โหลดไฟล์).
- **ส่วน 3:** ใช้ `agent_id` ที่มีอยู่ ส่งข้อความแบบ SSE (`POST /api/chat/message`) และคุยต่อใน conversation เดิม; แบบ blocking เป็นทางเลือก JSON.
- **ความปลอดภัย:** เก็บ API Key ฝั่ง server เท่านั้น, ใช้ placeholder ในตัวอย่าง, ไม่เรียก live/paid API จริง, ไม่สร้าง provider resources และไม่ publish.

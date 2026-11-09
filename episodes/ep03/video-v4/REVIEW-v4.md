# EP03 Animatic v4 — Review record

Revision date: 9 พฤศจิกายน 2026<br>
Scope: Chat API (v4), script, explanatory diagrams, code snippets, simulated SSE streams, silent MP4 animatic export, and visual quality review. No user acceptance is inferred.

## 1. สรุปภาพและเนื้อหา

- **Observed in export:** วิดีโอแนวตั้ง 1080×1920 ความยาว 91.167 วินาที แบ่งเป็น 10 beats (24 visual stages) พร้อมแถบซับร่างภาษาไทยกลางกรอบล่าง; การ์ดบทสนทนามีป้าย "ภาพจำลอง"; แผนภาพสถาปัตยกรรม 3 ชั้น (Client Frontend, Backend Server, LangMind API) แสดงทิศทาง request/response; กลุ่ม API ครบทั้ง 3 กลุ่มตามสเปก; กล่องโค้ด cURL และ JSON มี highlight จุดสำคัญ (`conversation_id: null` และการส่งซ้ำ); ลำดับ SSE Event แสดง 4 ขั้นชัดเจน (`message_start`, `message`, `citations`, `message_end`); ปิดท้ายด้วย 3 ขั้นตอนสรุป โลโก้ และตัวละคร Robot
- **Documented:**
  - Scope ของ Chat API คือ `chat:invoke`
  - `POST /api/chat/message` ใช้ Server-Sent Events (SSE) เป็นค่าเริ่มต้น
  - `POST /api/chat/message/blocking` ส่ง JSON คำตอบเต็มครั้งเดียว
  - `POST /api/chat/preview` ทดสอบผ่าน channel `web` ใน Builder
  - `POST /api/chat/messages/{id}/stop` สั่งหยุด stream
  - Endpoint ฝั่งบทสนทนา (GET conversations, {id}, messages, PATCH, DELETE) ต้องส่ง `agent_id`
  - `DELETE /api/chat/conversations/{id}` เป็นการลบถาวร
  - `POST /api/chat/messages/{id}/feedback` รับค่า `1` หรือ `-1`
  - `GET /api/chat/messages/{id}/generated-files/{file_id}` ดาวน์โหลดไฟล์ผลลัพธ์
  - SSE stream เริ่มจาก `message_start` → `message` (chunks) → `citations` (ถ้ามี) → `message_end`
  - เริ่มใหม่ส่ง `conversation_id: null`; ถามต่อส่ง `conversation_id` เดิม
  - API Key เก็บฝั่ง Server เท่านั้น
- **Illustrative:**
  - ตัวอย่างข้อความร่างการประชุม 15:00 น. และการขอให้สั้นลง
  - ฟองสบู่แชทจำลองที่ติดป้าย `ภาพจำลอง`
  - ค่า Placeholder `<AGENT_ID>`, `LM_TOKEN`, `conv_123`, `msg_01`
- **Unknown:**
  - Latency และความเร็วของ First Token บน Network/Server จริง
  - พฤติกรรมของ Live API เมื่อเครือข่ายหลุดระหว่าง SSE Stream
  - เสียงพากย์จริง (ยังไม่ได้บันทึกเสียงตามคำสั่งผู้ใช้)
- **Audio/subtitles:**
  - ไม่มี Audio stream (`-an`), วิดีโอเงียบ (Silent Animatic)
  - ซับไตเติลภาษาไทยฝังในภาพตามจังหวะ visual stage สำหรับให้อ่านทบทวน

## 2. Technical evidence

| รายการ | คำสั่ง / หลักฐาน | ผลลัพธ์ |
|---|---|---|
| สร้างภาพและเรนเดอร์ MP4 | `python render_fallback.py` | Exit code 0; 24 visual stages; 91.167s; silent |
| ตรวจสอบมิติและเฟรมวิดีโอ | `ffprobe -v error -select_streams v:0 -show_entries stream=width,height,avg_frame_rate,duration,nb_frames -show_entries format=duration,size -of json renders/EP03-v4.mp4` | 1080×1920, 30/1 fps, 91.166667s, 2,735 frames, size 2,523,744 bytes |
| ตรวจสอบระบบเสียง | `ffprobe -v error -select_streams a:0 -show_entries stream=codec_name -of json renders/EP03-v4.mp4` | ไม่มีสตรีมเสียง (streams: []) ตามเงื่อนไข "ยังไม่ต้องทำเสียง" |
| ไวยากรณ์ Build script | `node --check build.mjs` | Exit code 0 (ผ่าน) |
| สภาพคอมโพสิชัน HyperFrames | `node build.mjs` | สร้าง `index.html` และ 10 beats ใน `compositions/beat01.html` ถึง `beat10.html` สำเร็จ |
| SHA-256 ของไฟล์วิดีโอ | `Get-FileHash renders/EP03-v4.mp4 -Algorithm SHA256` | `6017B0CFDB3A8AEADB878A8C42F7BD716C1AD2D15D4592506BADD2AF91488D6A` |

## 3. การตรวจภาพและความต่อเนื่อง (Visual Quality & Continuity)

- **ความคมชัดและขนาดตัวอักษร:** ฟอนต์ Sarabun-Bold และ Sarabun-Regular มีขนาด 26–56px อ่านได้สบายตาบนจอมือถือ (9:16)
- **Safe Area:** แถบซับไตเติลถูกล็อกที่ `y = 1540` ถึง `1770` ความกว้าง 936px ป้องกันการชนกับ UI ของโซเชียลมีเดียแนวตั้ง
- **ความต่อเนื่องของการ์ดแชท:** Beat 2 และ Beat 3 ใช้พิกัดกรอบแชทเดียวกัน (`y=200`, `h=1260`) เมื่อต่อเข้าสู่สถานะถามต่อ ข้อความเดิมจะคงอยู่ด้านบนและเพิ่มข้อความใหม่ด้านล่าง ทำให้รู้สึกต่อเนื่องเสมือนบทสนทนาจริง
- **การแยกแยะบทบาทความปลอดภัย:** แผนภาพสถาปัตยกรรมใน Beat 4 และโค้ดใน Beat 8 เน้นย้ำชัดเจนว่า API Key ต้องอยู่ฝั่ง Server Backend เท่านั้น
- **การระบุป้ายจำลอง:** ทุกฉากที่มีแชท, โค้ดตัวอย่าง หรือ SSE events จะมี Badge ติดชัดเจน เช่น `ภาพจำลอง`, `ตัวอย่างคำสั่ง · placeholder`, `ข้อมูลจำลอง`

## 4. สถานะและขั้นตอนถัดไป

- งานวิดีโอ v4 (Animatic เงียบ + ไดอะแกรมและหน้าจอครบ 10 beats) ผลิตและบันทึกเสร็จสมบูรณ์แล้วใน `episodes/ep03/video-v4/`
- ผลิตภัณฑ์ที่ส่งมอบ:
  - วิดีโอหลัก: [EP03-v4.mp4](renders/EP03-v4.mp4)
  - แผ่นภาพรวมสำหรับตรวจสายตา: [contact-sheet.png](renders/final-review-v4/contact-sheet.png)
  - HyperFrames Codebase: [index.html](index.html), [build.mjs](build.mjs), [compositions/](compositions/)
  - เอกสารประกอบ: [ASSETS-v4.md](ASSETS-v4.md), [timing.json](timing.json)
- ขั้นตอนถัดไปเมื่อต้องการทำเสียง:
  - นำช่วงทดสอบเสียงจาก `SCRIPT-v4.md` ให้ผู้ใช้เลือกน้ำเสียง
  - เมื่อได้ไฟล์เสียงพากย์จริง นำมา sync timing และ re-align subtitles ให้ตรงกับคำพูดจริง

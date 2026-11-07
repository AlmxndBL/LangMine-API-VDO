# EP04 Sample B03–B05 — ผลตรวจ draft v2

วันที่: 7 พฤศจิกายน 2026 (Asia/Bangkok) · ไฟล์: [ep04-b03-b05-draft-v2.mp4](ep04-b03-b05-draft-v2.mp4) · เฟรมขนาดมือถือ: [evidence/draft-v2/mobile-frames.jpg](evidence/draft-v2/mobile-frames.jpg)

ภาพหน้าจอแอปและข้อมูลในโค้ดเป็น **ภาพจำลอง** ไม่ได้เรียก LangMind API จริง และไม่มีตัวเลข latency

## สิ่งที่เปลี่ยนจาก sample v1
- v1 ใช้ `className` tween ใน GSAP 3 ทำให้ timeline หยุดทำงานหลังวินาทีที่ 16: ซับ 2–3 ไม่ขึ้น สเต็ป 3 ไม่ทำงาน และฉากตอบกลับว่างทั้งฉาก v2 เขียน `motion.js` ใหม่ ใช้แค่ tween/set (seek ได้ทั้งไปและย้อน)
- โครงใหม่: `timing.json` → `node build.mjs` → `index.html` + `VOICE-SCRIPT.md`; ใส่ไฟล์เสียงที่ `assets/voice/b03.wav`, `b04.wav`, `b05.wav` แล้วรัน build ใหม่ เวลาทุกช่วงและซับจะคิดจากความยาวเสียงจริง
- ใส่องค์ประกอบตาม Storyboard: ไฟล์/ข้อความวิ่งตามลูกศร, กล่องโค้ด endpoint ทั้ง 3 สเต็ปพร้อมสิทธิ์ที่ใช้, ไฮไลต์ `input_mode` และ `conversation_id`, คลื่นเสียงตอน "ฟัง" (เขียว) และ "เล่นเสียงตอบ" (teal), มือถือเปลี่ยนหน้าจอ Q → A ในกรอบเดียวกัน
- เนื้อหาแก้ตามคู่มือ: สิทธิ์ `voice:invoke` + `chat:invoke`, endpoint สเต็ป 2 `POST /api/chat/message/blocking`, ไฟล์ตอบกลับ `audio/mpeg` หรือ `audio/wav`, ตัดคำว่า "ทันที", ระบุว่าเรียกจาก server ของแอปและ key ไม่อยู่ในแอปมือถือ
- เอา header ซ้ำ "Cafe Assistant" ของกรอบมือถือออก และครอปป้าย "ภาพจำลอง" ในภาพ raster (ป้ายของเฟรมยังอยู่มุมขวาบนตลอด)

## Technical (observed)
| ตรวจ | ผล |
|---|---|
| `npx hyperframes lint` | 0 error, 2 warning (`nested_structure_needs_subcomposition` แบบเดียวกับ EP01; `negative_z_index` ของแถบไฮไลต์ ซึ่งแสดงผลถูกในเฟรมจริง) |
| `npx hyperframes check` | ok: true; เหลือ `film_silent` เพราะยังไม่มีเสียง |
| render | `--quality draft`, H.264 1080×1920, 30 fps, 1,561 เฟรม, 52.03 s (ตรงกับ data-duration) |
| decode | `ffmpeg -i … -f null -` ผ่านครบทั้งไฟล์ |

## Visual (observed จากเฟรม MP4 ที่ 360×640)
- ทุกช่วงมีภาพและซับตรงบทพากย์ของช่วงนั้น ข้อความไม่ชนกัน หัวข้อเป็นบรรทัดเดียว
- ข้อจำกัด: ตัวอักษรในกล่องโค้ด (28 px บนเฟรม 1080) อ่านยากที่ขนาดมือถือ ควรถือว่าเป็น "ภาพประกอบ" และให้ซับ/หัวข้อเล่าใจความ หรือขยายเฉพาะบรรทัดสำคัญในรอบถัดไป
- ช่วง B04–B05 ด้านล่างแผนภาพมีพื้นที่ว่างประมาณ 250 px

## ยังไม่ได้ตรวจ / ค้าง
- **ไม่มีเสียงพากย์**: network ฝั่งที่ render บล็อก Edge TTS และโมเดลเสียงอื่น ส่วนเสียง LangMind เป็น API ที่มีค่าใช้จ่ายจึงไม่เรียกเอง เวลาทั้งหมดตอนนี้ประมาณจากความยาวบท (11 ตัวอักษร/วินาที) ยังต้องทำเสียงตัวอย่างให้ผู้รับผิดชอบเลือก แล้ว build/render ใหม่
- storytelling และ audio gate ยังไม่ได้ตรวจกับผู้ชม
- render ใช้ Chrome ปกติ (screenshot capture) ไม่ใช่ chrome-headless-shell

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
| `npx hyperframes check` | ok: true; เหลือ `film_silent` เพราะยังไม่มีเสียง (ไม่มี layout/contrast/text-size finding) |
| render | `--quality draft`, H.264 1080×1920, 30 fps, 1,561 เฟรม, 52.03 s (ตรงกับ data-duration) · render ใหม่หลังแก้ตัวอักษร 7 พ.ย. 19:50 |
| decode | `ffmpeg -i … -f null -` ผ่านครบทั้งไฟล์ |

## Visual (observed จากเฟรม MP4 ที่ 360×640)
- ทุกช่วงมีภาพและซับตรงบทพากย์ของช่วงนั้น ข้อความไม่ชนกัน หัวข้อเป็นบรรทัดเดียว
- รอบแก้ 7 พ.ย. 19:50: ขยายตัวอักษรกล่องโค้ดจาก 28 เป็น 34 px (path 37 px, ป้ายสิทธิ์ 32 px, chip 40 px, JSON 33 px) และขยายแผนภาพให้เต็มความกว้างมากขึ้น ตัดบรรทัดคำตอบตัวอย่างเป็น 3 บรรทัดให้ตรงกับภาพหน้าจอ a ไม่ให้คำขาดกลางบรรทัด
- เติมพื้นที่ว่างใต้แผนภาพ B05 ด้วย Robot และ tip ที่มีในคู่มือ ("ปรับเสียงได้ด้วย voice, speed · ไม่ส่ง = ใช้ค่าเสียงของ Agent ที่ publish" — บรรทัด 888–890) B04 ใช้พื้นที่เต็มแล้วจากกล่องคำตอบที่ใหญ่ขึ้น
- ข้อจำกัดที่เหลือ: บรรทัดโค้ดยังเล็กกว่าซับ (34 px เทียบ 42 px) ใจความหลักยังต้องเล่าด้วยซับและหัวข้อ

## ยังไม่ได้ตรวจ / ค้าง
- **ไม่มีเสียงพากย์**: network ฝั่งที่ render บล็อก Edge TTS และโมเดลเสียงอื่น ส่วนเสียง LangMind เป็น API ที่มีค่าใช้จ่ายจึงไม่เรียกเอง เวลาทั้งหมดตอนนี้ประมาณจากความยาวบท (11 ตัวอักษร/วินาที) ยังต้องทำเสียงตัวอย่างให้ผู้รับผิดชอบเลือก แล้ว build/render ใหม่
- storytelling และ audio gate ยังไม่ได้ตรวจกับผู้ชม
- render ใช้ Chrome ปกติ (screenshot capture) ไม่ใช่ chrome-headless-shell

---

# Draft v3 — ใส่เสียงพากย์ Niwat (7 พ.ย. 2026 21:10)

ไฟล์: [ep04-b03-b05-draft-v3.mp4](ep04-b03-b05-draft-v3.mp4) · เฟรมขนาดมือถือ: [evidence/draft-v3/mobile-frames.jpg](evidence/draft-v3/mobile-frames.jpg)

- **เสียง**: Edge TTS `th-TH-NiwatNeural` rate +0% (ผู้รับผิดชอบเลือก) สร้างด้วย `make-voice-samples.py` ในเครื่องผู้รับผิดชอบ แปลงเป็น `assets/voice/b03.wav`, `b04.wav`, `b05.wav` (48 kHz mono) ความยาว 12.98 / 13.85 / 10.49 s · ที่มา: [assets/voice/samples/SOURCE.txt](assets/voice/samples/SOURCE.txt) · ต้องตรวจเงื่อนไขการใช้งานของ Microsoft ก่อนเผยแพร่
- **เวลา**: `build.mjs` อ่านความยาวเสียงจริง และตัดช่วงซับตามสัดส่วนความยาวบท แล้วจับเข้าช่วงหยุดหายใจที่ใกล้ที่สุด (ffmpeg silencedetect, ภายใน 0.8 s) คลิปยาว 39.93 s (เดิมประมาณไว้ 52 s)
- **Technical (observed)**: check ok: true · render H.264 1080×1920 30 fps 1,198 เฟรม + AAC 48 kHz · decode ผ่านครบ · ระดับเสียง mean −22.7 dB / peak −3.1 dB · ช่วงเงียบในไฟล์อยู่เฉพาะรอยต่อ beat (12.5–14.1, 26.9–28.4 s) และท้ายคลิป
- **คำเตือนที่เหลือ**: `line_unread` 2 จุด — ซับแรกของ B03 (4.7 s) และ B05 (3.6 s) สั้นกว่าเกณฑ์อ่านเล็กน้อย เพราะซับขึ้นตามเสียงพูดจริง ยอมรับไว้ก่อน ถ้าฟังแล้วเร็วไป แก้ได้โดยสร้างเสียงใหม่ที่ `RATE = "-8%"`
- **ยังต้องตรวจโดยคนฟัง**: การออกเสียง LangMind, Voice Transcribe, Voice Speech, input mode, conversation ID และความตรงของซับกับคำพูด (ช่วงตัดซับคิดจากสัดส่วน ไม่ได้ถอดเสียงจริงมาเทียบ)

---

# Draft v4 — เสียง Niwat ช้าลง 8% (7 พ.ย. 2026 21:20)

ไฟล์: [ep04-b03-b05-draft-v4.mp4](ep04-b03-b05-draft-v4.mp4) · เฟรมขนาดมือถือ: [evidence/draft-v4/mobile-frames.jpg](evidence/draft-v4/mobile-frames.jpg)

- **เสียง**: Edge TTS `th-TH-NiwatNeural` rate −8% สร้างด้วย `make-voice-samples.py` (ฉบับเขียนตรงลง `assets/voice/*.wav`) ความยาว 14.09 / 15.05 / 11.40 s
- **Technical (observed)**: `check` ok: true **ไม่มี finding เหลือ** (คำเตือน `line_unread` ของ v3 หายแล้ว) · render H.264 1080×1920 30 fps 1,294 เฟรม + AAC 48 kHz · 43.13 s · decode ผ่าน · ระดับเสียง mean −22.7 dB / peak −2.9 dB · ช่วงเงียบเฉพาะรอยต่อ beat (13.6–15.2, 29.1–30.7 s) และท้ายคลิป
- **ยังต้องตรวจโดยคนฟัง**: การออกเสียงชื่อเฉพาะ และซับตรงคำพูด (ช่วงตัดซับคิดจากสัดส่วนบทแล้วจับเข้าช่วงหยุด)

---

# Full draft v1 — ครบ B01–B06, เสียง Niwat −16% (7 พ.ย. 2026 21:45)

ไฟล์: [ep04-full-draft-v1.mp4](ep04-full-draft-v1.mp4) · เฟรมขนาดมือถือ: [evidence/full-v1/mobile-frames.jpg](evidence/full-v1/mobile-frames.jpg) · เฟรมฉากใหม่: [evidence/full-v1/b01-b02-b06-frames.jpg](evidence/full-v1/b01-b02-b06-frames.jpg)

- **เนื้อหาใหม่**: B01 เปิดเรื่อง (มือถือ + คลื่นเสียง + Robot ถาม), B02 ภาพรวมท่อ 3 สเต็ป (Voice API ×2 + Chat API), B06 เช็กลิสต์ 3 ข้อ (สนทนาด้วยเสียง + publish → ไม่เปิดได้ 403 `VOICE_DISABLED`; สิทธิ์ `voice:invoke` + `chat:invoke`; Key ฝั่ง server) — อ้างคู่มือบรรทัด 888–890, 935
- **เสียง**: Edge TTS `th-TH-NiwatNeural` rate −16% ทั้ง 6 beat: 11.4 / 13.5 / 15.4 / 16.5 / 12.5 / 17.3 s
- **Technical (observed)**: `check` ok: true · render H.264 1080×1920 30 fps 2,721 เฟรม + AAC · 90.70 s · decode ผ่าน · ระดับเสียง mean −22.7 dB / peak −3.1 dB
- **คำเตือนที่เหลือ**: `line_unread` 2 จุด — ซับแรกของ B01 (3.5 s) และข้อ 2 ของ B06 (2.6 s) เพราะจุดตัดซับยังเดาจากช่วงหยุดหายใจ ซึ่งบางจุดเป็นจังหวะเว้นกลางประโยค
- **แก้แล้วในสคริปต์ (รอรันใหม่)**: `make-voice-samples.py` สร้างเสียงทีละประโยคซับ ตัดเงียบหัวท้าย แล้วต่อกันโดยเว้น 0.35 s พร้อมเขียน `<beat>.segments.json` ให้ `build.mjs` ตัดซับตรงจุดเปลี่ยนประโยคพอดี (ทดสอบขั้นตอนเสียงด้วย TTS จำลองแล้ว ทั้งตอนจะยาวขึ้นประมาณ 100 s)

---

# Full draft v2 — ซับตรงประโยค (7 พ.ย. 2026 21:55)

ไฟล์: [ep04-full-draft-v2.mp4](ep04-full-draft-v2.mp4) · เฟรมขนาดมือถือ: [evidence/full-v2/mobile-frames.jpg](evidence/full-v2/mobile-frames.jpg)

- **เสียง**: Edge TTS `th-TH-NiwatNeural` rate −16% สร้างทีละประโยคซับ (`make-voice-samples.py` ฉบับแยกประโยค) ต่อกันเว้น 0.35 s: 10.89 / 12.93 / 14.75 / 15.63 / 11.64 / 16.34 s · จุดเปลี่ยนซับมาจาก `assets/voice/<beat>.segments.json` ทั้ง 6 beat (ไม่ต้องเดาจากช่วงเงียบแล้ว)
- **Technical (observed)**: `check` ok: true · คำเตือน `line_unread` ของ v1 หายครบ · เหลือ info `content_overlap` จุดเดียวที่รอยต่อซับ 1 เฟรม · render H.264 1080×1920 30 fps 2,588 เฟรม + AAC · 86.27 s · decode ผ่าน · ระดับเสียง mean −21.6 dB / peak −2.8 dB
- **ยังต้องตรวจโดยคนฟัง**: การออกเสียง LangMind / Voice Transcribe / Voice Speech / input mode / conversation ID / publish / voice invoke, ความเป็นธรรมชาติของจังหวะเว้นระหว่างประโยค, และเงื่อนไขการใช้เสียง Edge TTS ก่อนเผยแพร่

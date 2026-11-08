# EP04 video-v3 — ผลตรวจ draft

วันที่: 8 พฤศจิกายน 2026 (Asia/Bangkok) · ไฟล์: [ep04-video-v3-draft.mp4](ep04-video-v3-draft.mp4) · เฟรมขนาดมือถือ: [evidence/draft-mobile-frames.jpg](evidence/draft-mobile-frames.jpg)

ภาพหน้าจอแอป โค้ด และคำตอบเป็น **ภาพจำลอง** ไม่ได้เรียก LangMind API จริง และไม่มีตัวเลข latency

## เสียง
- Edge TTS `th-TH-NiwatNeural` rate −16% สร้างทีละประโยคซับด้วย `make-voice-samples.py` (ต่อกันเว้น 0.35 s) · ที่มา: [assets/voice/samples/SOURCE.txt](assets/voice/samples/SOURCE.txt)
- ความยาว b1–b9: 15.3 / 17.5 / 20.5 / 10.5 / 11.8 / 10.4 / 18.5 / 13.3 / 6.6 s
- จุดเปลี่ยนซับมาจาก `assets/voice/<beat>.segments.json` ครบทั้ง 9 beat

## Technical (observed)
| ตรวจ | ผล |
|---|---|
| `npx hyperframes check` | ok: true · ไม่มี finding |
| render | `--quality draft` · H.264 1080×1920 30 fps 3,998 เฟรม + AAC · 133.27 s (2:13) |
| decode | `ffmpeg -i … -f null -` ผ่านครบ |
| ระดับเสียง | mean −21.8 dB / peak −2.3 dB · ช่วงเงียบเฉพาะรอยต่อ beat และช่วงค้างหลัง b5 (77.4–81.2 s) |

- เพิ่ม `"hold": 2.5` ให้ b5 ใน `timing.json` (build.mjs รองรับ `hold` ต่อ beat) เพื่อให้กล่องคำตอบ JSON ค้างนานพออ่าน — คำเตือน `line_unread` หายแล้ว

## Visual (observed จากเฟรม MP4)
- ทุกฉากแสดงครบ ไม่ทับกัน ซับตรงบทของช่วงนั้น · ฉากผู้สนับสนุนซ่อนป้าย "ภาพจำลอง" และแถบความคืบหน้า

## ยังต้องตรวจโดยคนฟัง
- การออกเสียง LangMind, Voice Transcribe, Voice Speech, input mode, conversation ID, publish, voice invoke / chat invoke, "LangMind ดอท อิน ดอท ทีเอช"
- จังหวะเว้นระหว่างประโยคฟังเป็นธรรมชาติไหม และความยาว 2:13 เหมาะกับคนดูหรือไม่
- เงื่อนไขการใช้เสียง Edge TTS ก่อนเผยแพร่

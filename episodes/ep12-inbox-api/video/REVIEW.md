# EP12 Inbox API — ผลตรวจ draft v1

วันที่: 9 พฤศจิกายน 2026 (Asia/Bangkok) · ไฟล์: [ep12-inbox-draft-v1.mp4](ep12-inbox-draft-v1.mp4) · เฟรมขนาดมือถือ: [evidence/draft-v1-mobile-frames.jpg](evidence/draft-v1-mobile-frames.jpg)

ภาพหน้าจอแอป โค้ด และข้อมูลใน JSON เป็น **ภาพจำลอง** ไม่ได้เรียก LangMind API จริง

## เนื้อหา
- ใช้ Inbox API ครบทุกแบบในคู่มือ: รายการแชท (`channel`, `page`, `limit`, `search`, `total`, `channel_counts`), ข้อความ (`limit`, `cursor`, `next_cursor`), สถานะคุมสาย (`active: true` / `false`), export (`format`, `channel`, `date_from`, `date_to`, ไฟล์ตรง, 20,000 แถว)
- ข้อจำกัด: API Key อ่าน/export เท่านั้น — ตอบลูกค้า, เริ่ม/จบคุมสาย ต้องเข้าเว็บ LangMind
- claim ledger: [../PLAN.md](../PLAN.md)

## Technical (observed)
| ตรวจ | ผล |
|---|---|
| `npx hyperframes check` | ok: true · เหลือ `film_silent` (ยังไม่มีเสียง) และ info `content_overlap` ที่รอยต่อซับ 1 เฟรม |
| render | `--quality draft` · H.264 1080×1920 30 fps 5,641 เฟรม · 188.03 s (3:08) · **ไม่มีแทร็กเสียง** |
| decode | `ffmpeg -i … -f null -` ผ่านครบ |

## แก้หลัง draft v1 (render ใหม่ 9 พ.ย. 2026)
- ชิป “สิทธิ์อ่านอย่างเดียว” ใน b3 เดิมไปลอยทับหัวการ์ด เพราะ rule `.note` ของป้าย “ภาพจำลอง” ชนกับ `.chip.note` → เปลี่ยน selector เป็น `#film > .note` ใน style.css และ motion.js แล้ว render ไฟล์เดิมใหม่ (ความยาวเท่าเดิม 188.03 s, decode ผ่าน)

## ยังไม่ได้ทำ / ต้องรู้
- **ยังไม่มีเสียงพากย์** — ฝั่งที่ render เข้า Edge TTS ไม่ได้ เวลาทุกช่วงตอนนี้ประมาณจากความยาวบท (11 ตัวอักษร/วินาที) เมื่อมีเสียงจริง ความยาวจะเปลี่ยน (EP04 ด้วยเสียง Niwat −16% สั้นกว่าค่าประมาณราว 15%)
- ทำเสียง: `python make-voice-samples.py` (หรือให้คนพากย์อ่าน VOICE-SCRIPT แล้ววาง `assets/voice/b1.wav` … `b11.wav`) → `node build.mjs` → `npx hyperframes render`
- ค่าวันที่ใน export เป็นตัวอย่าง คู่มือไม่ได้ระบุรูปแบบวันที่

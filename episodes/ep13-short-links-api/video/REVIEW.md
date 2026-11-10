# EP13 Short Links API — ผลตรวจ draft v1

วันที่: 9 พฤศจิกายน 2026 (Asia/Bangkok) · ไฟล์: [ep13-short-links-draft-v1.mp4](ep13-short-links-draft-v1.mp4) · เฟรมขนาดมือถือ: [evidence/draft-v1-mobile-frames-1.jpg](evidence/draft-v1-mobile-frames-1.jpg), [evidence/draft-v1-mobile-frames-2.jpg](evidence/draft-v1-mobile-frames-2.jpg)

ภาพหน้าจอแอป โค้ด และข้อมูลใน JSON เป็น **ภาพจำลอง** ไม่ได้เรียก LangMind API จริง · ค่าตอนสร้างลิงก์ (b5) ใช้ตามตัวอย่างในคู่มือ

## เนื้อหา
- ใช้ Short Links API ครบทุก endpoint ในคู่มือ (10 ตัว):
  - `GET /short-links/usage`
  - `POST /short-links` + ตัวเลือก `alias`, `title`, `tags`, `utm`, `expires_at`, `max_clicks`, `password`
  - `GET /short-links` (`q`, `tag`, `state`, `sort`, `limit`, `offset`)
  - `GET` / `PATCH` / `DELETE /short-links/{id}`
  - `GET /short-links/{id}/analytics`, `GET /short-links/analytics`, `GET /short-links/{id}/analytics/export`
- error: `SHORT_LINK_LIMIT_EXCEEDED` (422), `SHORT_LINK_RATE_EXCEEDED` (429), `SHORT_LINK_TARGET_BLOCKED` (422)
- claim ledger: [../SCRIPT.md](../SCRIPT.md) หมวด 3

## Technical (observed)
| ตรวจ | ผล |
|---|---|
| `npx hyperframes check` | ok: true · เหลือ warning ที่ EP12 มีเหมือนกัน (`film_silent`, `duplicate_media_discovery_risk`, `negative_z_index`, `nested_structure_needs_subcomposition`) |
| render | `--quality draft` · H.264 1080×1920 30 fps 6,940 เฟรม · 231.33 s (3:51) · **ไม่มีแทร็กเสียง** |
| decode | `ffmpeg -i … -f null -` ผ่านครบ |

## แก้ระหว่างทำ
- ชิปใน b3 ซ้อนกัน: rule `.note` ของป้าย “ภาพจำลอง” ชนกับ `.chip.note` → เปลี่ยนเป็น `#film > .note` (แก้ใน EP12 และ render EP12 ใหม่ด้วย)
- ตัวอักษรต่ำกว่า 28px (คอมเมนต์โค้ด, ป้าย “ตามแผน”, ป้าย DELETE) → ปรับเป็น 28px · โค้ดทั้งตอนใช้ 29px ให้ URL ไม่ตัดบรรทัด
- ช่วงที่ภาพนิ่งเกิน 3 วินาที (b3, b9, b10) → เพิ่มจังหวะ pulse
- ซับ b9 ยาว 3 บรรทัด → ย่อชื่อ error ในซับ (ชื่อเต็มอยู่บนการ์ด)
- คำอธิบายบนการ์ด b9 เดิมตีความเกินคู่มือ (“เรียกถี่เกินไป”, “ตรวจก่อนสร้าง”) → แก้ให้ตรงคู่มือ

## ยังไม่ได้ทำ / ต้องรู้
- **ยังไม่มีเสียงพากย์** เวลาตอนนี้ประมาณจากความยาวบท เมื่อใส่เสียง Niwat −16% คาดว่าเหลือ ~3:15
- ทำเสียง: `python make-voice-samples.py` (หรือให้คนพากย์อ่าน VOICE-SCRIPT แล้ววาง `assets/voice/b1.wav` … `b12.wav`) → `node build.mjs` → `npx hyperframes render`
- คู่มือไม่มีตัวอย่าง response ของ `usage` และ `analytics` → คลิปไม่แสดงชื่อฟิลด์ ถ้ามีตัวอย่างจริงภายหลังค่อยเพิ่มใน b4/b8

## v1 มีเสียงพากย์ (10 พ.ย. 2026)
ไฟล์: [ep13-short-links-v1.mp4](ep13-short-links-v1.mp4) · เสียง `assets/voice/b1.wav` … `b12.wav` (ผู้รับผิดชอบสร้าง, 24 kHz mono)

| ตรวจ | ผล |
|---|---|
| ความยาว | 211.47 s (3:31) — เดิมประมาณจากบท ~3:51 |
| จุดตัดซับ | ไฟล์เสียงไม่มี `.segments.json` → สร้างใหม่จากช่วงเงียบ โดยจับคู่ช่วงเงียบกับช่องว่างในบทตามลำดับ (alignment) · ตรวจแล้วทุกจุดตัดตกในช่วงเงียบ |
| จังหวะภาพ | offset ของภาพในแต่ละท่อนเขียนไว้ตามเวลาประมาณ → ย่อตามสัดส่วนความยาวเสียงจริงของท่อนนั้น (ไม่ยืดถ้าเสียงยาวกว่า) |
| `npx hyperframes check` | ok: true |
| render | `--quality draft` · H.264 1080×1920 30 fps + AAC · decode ผ่านครบ |

## แก้ซับไม่ตรงเสียง (10 พ.ย. 2026, render `ep13-short-links-v1.mp4` ใหม่)
ผู้รับผิดชอบแจ้งว่าซับกับเสียงไม่ตรง · สาเหตุและการแก้:
- ไฟล์เสียงทุกช่วงตรงบท (ตรวจด้วยการถอดเสียงเทียบบทแล้ว)
- **จุดตัดซับ**: ไฟล์เสียงอ่านทั้งช่วงต่อเนื่อง (24 kHz ไม่มีช่วงเงียบสนิทแบบที่ `make-voice-samples.py` ใส่) จึงต้องหาเอง → ถอดเสียงด้วย Whisper small (faster-whisper, int8) ได้เวลาราย ตัวอักษร เทียบกับบท → ได้จุดเปลี่ยนท่อน → ลองตัดที่จุดนั้นและช่วงเงียบใกล้ ๆ แล้วถอดเสียงสองฝั่งเทียบบท เลือกจุดที่ตรงที่สุด → จุดที่ขยับเกิน 0.35 วินาทีตรวจด้วยมือทุกจุด
- ผล: 23 จุดตัด · `assets/voice/*.segments.json` สร้างใหม่ทั้งหมด
- `npx hyperframes check` ok: true · render ใหม่ decode ผ่าน
- ถ้าสร้างเสียงใหม่ ให้ใช้ `python make-voice-samples.py` ซึ่งเขียน `.segments.json` แบบแม่นยำให้เอง

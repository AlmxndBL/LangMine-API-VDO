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

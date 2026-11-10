# EP14 Errors / Rate Limit & Quota — ผลตรวจ draft v1

วันที่: 10 พฤศจิกายน 2026 (Asia/Bangkok) · ไฟล์: [ep14-errors-draft-v1.mp4](ep14-errors-draft-v1.mp4) · เฟรมขนาดมือถือ: [evidence/draft-v1-mobile-frames-1.jpg](evidence/draft-v1-mobile-frames-1.jpg), [evidence/draft-v1-mobile-frames-2.jpg](evidence/draft-v1-mobile-frames-2.jpg)

ภาพหน้าจอแอปและรายการใน log เป็น **ภาพจำลอง** ไม่ได้เรียก LangMind API จริง · error envelope ใช้ค่าตามตัวอย่างในคู่มือ

## เนื้อหา
- error envelope (`status`, `code`, `message`, `message_en`, `request_id`) + กฎ “เช็กที่ code”
- code ครบ 10 ตัวในคู่มือ: 401 UNAUTHORIZED, 403 FORBIDDEN, 404 NOT_FOUND, 422 VALIDATION_ERROR, 429 RATE_LIMIT_EXCEEDED, 403 VOICE_DISABLED, 400 NO_CREDENTIAL, 422 VOICE_AUDIO_FORMAT_UNSUPPORTED, 429 VOICE_QUOTA_EXCEEDED, 403 VOICE_NOT_IN_PLAN
- Rate Limit & Quota: โควตาบัญชีร่วมกับเว็บ, หน้า Credentials, Voice 60 / 300 ครั้งต่อนาที
- แนวทางใช้งานอย่างปลอดภัย 5 ข้อ + API Key จัดการ Key อื่นไม่ได้
- claim ledger: [../SCRIPT.md](../SCRIPT.md) หมวด 3

## Technical (observed)
| ตรวจ | ผล |
|---|---|
| `npx hyperframes check` | ok: true · เหลือ warning ที่ EP12/EP13 มีเหมือนกัน (`film_silent`, `duplicate_media_discovery_risk`, `negative_z_index`, `nested_structure_needs_subcomposition`, console warning ของ engine เรื่อง `svg path[pathLength]`) |
| render | `--quality draft` · H.264 1080×1920 30 fps 8,952 เฟรม · 298.40 s (4:58) · **ไม่มีแทร็กเสียง** |
| decode | `ffmpeg -i … -f null -` ผ่านครบ |

## แก้ระหว่างทำ
- แถบ codemap ช่องที่ไม่ได้เลือก contrast 2.92:1 → เปลี่ยนสีเป็น `#66716a`
- ป้าย error เลข HTTP ติดกับชื่อ code (“401UNAUTHORIZED”) → `.chip.err` เป็น `inline-flex` มีช่องว่าง
- ซับ b8, b10 ยาวเกิน → ย่อคำในซับ

## ยังไม่ได้ทำ / ต้องรู้
- **ยังไม่มีเสียงพากย์** เมื่อใส่เสียง Niwat −16% คาดว่าเหลือ ~4:15 — ยาวกว่า EP12/EP13 เพราะครอบคลุม code ครบ ถ้าต้องการสั้นลง ย่อ b7 (Voice, 34 วิ) ก่อน
- ทำเสียง: `python make-voice-samples.py` → `node build.mjs` → `npx hyperframes render`
- คู่มือไม่ระบุตัวเลข rate limit ของ chat และเวลารอหลัง 429 → คลิปติดหมายเหตุบนจอ ไม่แต่งตัวเลข

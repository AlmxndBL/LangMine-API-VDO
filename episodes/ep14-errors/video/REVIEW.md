# EP14 Errors — ผลตรวจ draft v1

วันที่: 10 พฤศจิกายน 2026 (Asia/Bangkok) · ไฟล์: [ep14-errors-draft-v1.mp4](ep14-errors-draft-v1.mp4) · เฟรมมือถือ: [evidence/draft-v1-mobile-frames-1.jpg](evidence/draft-v1-mobile-frames-1.jpg), [evidence/draft-v1-mobile-frames-2.jpg](evidence/draft-v1-mobile-frames-2.jpg)

ภาพหน้าจอและรายการใน log เป็น **ภาพจำลอง** · error envelope ใช้ค่าตามตัวอย่างในคู่มือ

## เนื้อหา
- error envelope + กฎ “เช็กที่ code”
- code ครบ 10 ตัว: 401 UNAUTHORIZED, 403 FORBIDDEN, 404 NOT_FOUND, 422 VALIDATION_ERROR, 429 RATE_LIMIT_EXCEEDED, 403 VOICE_DISABLED, 400 NO_CREDENTIAL, 422 VOICE_AUDIO_FORMAT_UNSUPPORTED, 429 VOICE_QUOTA_EXCEEDED, 403 VOICE_NOT_IN_PLAN
- การรับมือ 3 กลุ่ม · การใช้ในระบบหลังบ้าน
- claim ledger: [../SCRIPT.md](../SCRIPT.md) หมวด 3

## Technical (observed)
| ตรวจ | ผล |
|---|---|
| `npx hyperframes check` | ok: true · เหลือ warning เดิมของ engine (`film_silent`, `duplicate_media_discovery_risk`, `negative_z_index`, `nested_structure_needs_subcomposition`, console warning `svg path[pathLength]`) |
| render | `--quality draft` · H.264 1080×1920 30 fps 4,489 เฟรม · 149.63 s (2:30) · **ไม่มีแทร็กเสียง** |
| decode | `ffmpeg -i … -f null -` ผ่านครบ |
| ซับ | ถ่ายเฟรมทุกท่อน (23 ท่อน) ตรวจว่าไม่เกิน 2 บรรทัด |

## ประวัติ
- v1 เดิมรวม Errors + Rate Limit & Quota ไว้ตอนเดียว (4:58) → แยกเป็น EP14 (Errors) และ EP15 (Rate Limit & Quota) ตามที่ผู้รับผิดชอบขอ ให้แต่ละคลิปไม่เกิน 3 นาที
- แก้ระหว่างทำ: ซับ 7 ท่อนยาวเกิน 2 บรรทัด → ย่อ · callout b9 ขึ้นช้าเกินอ่านทัน → เลื่อนให้เร็วขึ้น · ท้าย b10 เกินท่อนเสียง → บีบจังหวะ · แถบความคืบหน้าไม่ขึ้นใน b2 (engine เดิมเปิดแถบที่ b3) → เปิดตั้งแต่ b2 แล้ว render ใหม่

## ยังไม่ได้ทำ
- **ยังไม่มีเสียงพากย์** · ทำเสียง: `python make-voice-samples.py` → `node build.mjs` → `npx hyperframes render`

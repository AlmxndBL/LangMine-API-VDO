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

## v1 มีเสียงพากย์ (10 พ.ย. 2026)
ไฟล์: [ep14-errors-v1.mp4](ep14-errors-v1.mp4) · เสียง `assets/voice/b1.wav` … `b11.wav` (ผู้รับผิดชอบสร้าง, 24 kHz mono)

| ตรวจ | ผล |
|---|---|
| ความยาว | 144.07 s (2:24) — เดิมประมาณจากบท 2:30 |
| จุดตัดซับ | ไฟล์เสียงไม่มี `.segments.json` → สร้างใหม่จากช่วงเงียบ โดยจับคู่ช่วงเงียบกับช่องว่างในบทตามลำดับ (alignment) · ตรวจแล้วทุกจุดตัดตกในช่วงเงียบ |
| จังหวะภาพ | offset ของภาพในแต่ละท่อนเขียนไว้ตามเวลาประมาณ → ย่อตามสัดส่วนความยาวเสียงจริงของท่อนนั้น (ไม่ยืดถ้าเสียงยาวกว่า) |
| `npx hyperframes check` | ok: true |
| render | `--quality draft` · H.264 1080×1920 30 fps + AAC · decode ผ่านครบ |

## แก้ซับไม่ตรงเสียง (10 พ.ย. 2026, render `ep14-errors-v1.mp4` ใหม่)
ผู้รับผิดชอบแจ้งว่าซับกับเสียงไม่ตรง · สาเหตุและการแก้:
- **ไฟล์เสียงสลับกัน: `b4 ↔ b5`** — ตรวจด้วยการถอดเสียง (Whisper small) เทียบกับบททุกช่วง พบว่าไฟล์ของสองช่วงนี้เป็นเสียงของอีกช่วง → สลับชื่อไฟล์กลับให้ถูกแล้ว (ไฟล์อื่นตรงบททั้งหมด)
- **จุดตัดซับ**: ไฟล์เสียงอ่านทั้งช่วงต่อเนื่อง (24 kHz ไม่มีช่วงเงียบสนิทแบบที่ `make-voice-samples.py` ใส่) จึงต้องหาเอง → ถอดเสียงด้วย Whisper small (faster-whisper, int8) ได้เวลาราย ตัวอักษร เทียบกับบท → ได้จุดเปลี่ยนท่อน → ลองตัดที่จุดนั้นและช่วงเงียบใกล้ ๆ แล้วถอดเสียงสองฝั่งเทียบบท เลือกจุดที่ตรงที่สุด → จุดที่ขยับเกิน 0.35 วินาทีตรวจด้วยมือทุกจุด
- ผล: 12 จุดตัด · `assets/voice/*.segments.json` สร้างใหม่ทั้งหมด
- `npx hyperframes check` ok: true · render ใหม่ decode ผ่าน
- ถ้าสร้างเสียงใหม่ ให้ใช้ `python make-voice-samples.py` ซึ่งเขียน `.segments.json` แบบแม่นยำให้เอง

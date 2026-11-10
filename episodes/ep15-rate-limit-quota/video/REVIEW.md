# EP15 Rate Limit & Quota — ผลตรวจ draft v1

วันที่: 10 พฤศจิกายน 2026 (Asia/Bangkok) · ไฟล์: [ep15-rate-limit-quota-draft-v1.mp4](ep15-rate-limit-quota-draft-v1.mp4) · เฟรมมือถือ: [evidence/draft-v1-mobile-frames-1.jpg](evidence/draft-v1-mobile-frames-1.jpg), [evidence/draft-v1-mobile-frames-2.jpg](evidence/draft-v1-mobile-frames-2.jpg)

ภาพหน้าจอเป็น **ภาพจำลอง** (หน้าในระบบของร้าน) · ตัวเลขยอดใช้งานเป็นข้อมูลสมมติ · ตัวเลขลิมิต 60 / 300 มาจากคู่มือ

## เนื้อหา
- โควตาบัญชีร่วมกับเว็บ (โทเค็น LLM + rate limit การสนทนา) · หน้า Credentials
- Voice: ลิมิต 60 / 300 ครั้งต่อนาที, ไม่ผูกแพ็กเกจ, ค่าใช้จ่ายตามโมเดล, ถอดเสียง → chat นับโควตา chat · หน่วยนับโควตาเสียง · `VOICE_QUOTA_EXCEEDED` · `GET /api/me/voice-quota`
- Short Links: `GET /api/short-links/usage` · `SHORT_LINK_LIMIT_EXCEEDED` (422) / `SHORT_LINK_RATE_EXCEEDED` (429)
- รับมือ `RATE_LIMIT_EXCEEDED` · เช็กยอดก่อนงานใหญ่ · แนวทางใช้ Key อย่างปลอดภัย 5 ข้อ
- claim ledger: [../SCRIPT.md](../SCRIPT.md) หมวด 3

## Technical (observed)
| ตรวจ | ผล |
|---|---|
| `npx hyperframes check` | ok: true · เหลือ warning เดิมของ engine (`film_silent`, `duplicate_media_discovery_risk`, `negative_z_index`, `nested_structure_needs_subcomposition`, console warning `svg path[pathLength]`) |
| render | `--quality draft` · H.264 1080×1920 30 fps 4,385 เฟรม · 146.17 s (2:26) · **ไม่มีแทร็กเสียง** |
| decode | `ffmpeg -i … -f null -` ผ่านครบ |
| ซับ | ถ่ายเฟรมทุกท่อน (23 ท่อน) ตรวจว่าไม่เกิน 2 บรรทัด |

## แก้ระหว่างทำ
- ช่วงต้น b4 ภาพนิ่ง 3.4 วินาที → เพิ่ม pulse ไอคอน
- แถบความคืบหน้าไม่ขึ้นใน b2 (engine เดิมเปิดแถบที่ b3) → เปิดตั้งแต่ b2 แล้ว render ใหม่ (แก้ใน EP14 ด้วย)

## ยังไม่ได้ทำ
- **ยังไม่มีเสียงพากย์** · ทำเสียง: `python make-voice-samples.py` → `node build.mjs` → `npx hyperframes render`

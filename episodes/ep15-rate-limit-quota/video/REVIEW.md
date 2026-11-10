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

## v1 มีเสียงพากย์ (10 พ.ย. 2026)
ไฟล์: [ep15-rate-limit-quota-v1.mp4](ep15-rate-limit-quota-v1.mp4) · เสียง `assets/voice/b1.wav` … `b11.wav` (ผู้รับผิดชอบสร้าง, 24 kHz mono)

| ตรวจ | ผล |
|---|---|
| ความยาว | 139.53 s (2:20) — เดิมประมาณจากบท 2:26 |
| จุดตัดซับ | ไฟล์เสียงไม่มี `.segments.json` → สร้างใหม่จากช่วงเงียบ โดยจับคู่ช่วงเงียบกับช่องว่างในบทตามลำดับ (alignment) · ตรวจแล้วทุกจุดตัดตกในช่วงเงียบ |
| จังหวะภาพ | offset ของภาพในแต่ละท่อนเขียนไว้ตามเวลาประมาณ → ย่อตามสัดส่วนความยาวเสียงจริงของท่อนนั้น (ไม่ยืดถ้าเสียงยาวกว่า) |
| `npx hyperframes check` | ok: true |
| render | `--quality draft` · H.264 1080×1920 30 fps + AAC · decode ผ่านครบ |

## แก้ซับไม่ตรงเสียง (10 พ.ย. 2026, render `ep15-rate-limit-quota-v1.mp4` ใหม่)
ผู้รับผิดชอบแจ้งว่าซับกับเสียงไม่ตรง · สาเหตุและการแก้:
- **ไฟล์เสียงสลับกัน: `b5 ↔ b6`** — ตรวจด้วยการถอดเสียง (Whisper small) เทียบกับบททุกช่วง พบว่าไฟล์ของสองช่วงนี้เป็นเสียงของอีกช่วง → สลับชื่อไฟล์กลับให้ถูกแล้ว (ไฟล์อื่นตรงบททั้งหมด)
- **จุดตัดซับ**: ไฟล์เสียงอ่านทั้งช่วงต่อเนื่อง (24 kHz ไม่มีช่วงเงียบสนิทแบบที่ `make-voice-samples.py` ใส่) จึงต้องหาเอง → ถอดเสียงด้วย Whisper small (faster-whisper, int8) ได้เวลาราย ตัวอักษร เทียบกับบท → ได้จุดเปลี่ยนท่อน → ลองตัดที่จุดนั้นและช่วงเงียบใกล้ ๆ แล้วถอดเสียงสองฝั่งเทียบบท เลือกจุดที่ตรงที่สุด → จุดที่ขยับเกิน 0.35 วินาทีตรวจด้วยมือทุกจุด
- ผล: 12 จุดตัด · `assets/voice/*.segments.json` สร้างใหม่ทั้งหมด
- `npx hyperframes check` ok: true · render ใหม่ decode ผ่าน
- ถ้าสร้างเสียงใหม่ ให้ใช้ `python make-voice-samples.py` ซึ่งเขียน `.segments.json` แบบแม่นยำให้เอง

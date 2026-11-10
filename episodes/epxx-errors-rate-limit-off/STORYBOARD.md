# EP14 — Storyboard และแบบกำหนดหน้าจอ v1 (Errors / Rate Limit & Quota)

เอกสารอ้างอิง: [PLAN](PLAN.md), [SCRIPT](SCRIPT.md), [CATALOG](CATALOG.md), และ [WORKFLOW](../../docs/WORKFLOW.md)
สถานะ: ตรงกับ draft v1 ([video/ep14-errors-draft-v1.mp4](video/ep14-errors-draft-v1.mp4), ยังไม่มีเสียง) · ฉากอยู่ใน [video/build.mjs](video/build.mjs) การเคลื่อนไหวใน [video/motion.js](video/motion.js)

---

## 1. แนวภาพและระบบการแสดงผล (Visual System)

ใช้ระบบเดียวกับ EP04 v3 / EP12 / EP13

* **สไตล์หลัก**: Editorial Paper & Sage Ink · 9:16 (1080×1920, 30 fps)
* **ชุดสี**:
  * พื้นกระดาษ `#F5F1E7` · หมึกเข้ม `#20352c`
  * **แดงอิฐ `#9b3b2b`** = error ทุกตัว (ป้ายรหัส HTTP, การ์ดปัญหา, ช่องที่เลือกในแถบ code)
  * **เขียว `#38815A`** = ทางแก้ / ทำได้ (การ์ด ok)
  * 3 กลุ่มการรับมือ: เขียว `#38815A` รอแล้วลองใหม่ · ทอง `#8d732c` แก้คำขอ · ฟ้าอมเขียว `#1E7578` ตั้งค่าในเว็บ
* **ตัวอักษร**: Sarabun · โค้ดและชื่อ code ใช้ DejaVu Sans Mono · หัวเรื่อง 72px · ขั้นต่ำ 28px
* **โครงทุกซีน**: kicker “EP14 / ERRORS & LIMITS” · ป้าย “ภาพจำลอง” · แถบความคืบหน้า **1 อ่าน → 2 รับมือ → 3 ป้องกัน** · ซับล่างจอ ≤ 2 บรรทัด
* **แถบ code (codemap)**: b3–b7 มีแถบ `401 403 404 422 429 Voice` ใต้แถบความคืบหน้า ช่องที่กำลังพูดเป็นสีแดง ให้คนดูรู้ว่าเหลืออีกกี่ตัว

---

## 2. รายละเอียด Storyboard ราย Beat (b1 – b13)

| Beat / เวลา (ประมาณ) | สงสัยก่อน → เข้าใจหลัง | ภาพเริ่ม → การเคลื่อนไหว → ภาพจบ | ข้อความเน้น | Assets / Catalog |
|---|---|---|---|---|
| **b1** (21.9s) | ระบบพัง แต่บอกแค่ “เกิดข้อผิดพลาด” → อยากรู้ 3 เรื่อง | มือถือแสดงหน้ากล่องแชทของร้านที่ขึ้น “เกิดข้อผิดพลาด” (APP-ERR-BROKEN) ซูมช้า ๆ → ป้าย “‘เกิดข้อผิดพลาด’ แค่นั้น” → “พังเพราะอะไร? แก้ตรงไหน? รอได้ไหม?” → ชิป 3 คำถาม | หน้าตาแบบไหน? · แปลว่าอะไร? · รับมือยังไง? | Device Stage · `app-err-broken.jpg` |
| **b2** (21.7s + hold 1.5s) | error หน้าตาแบบไหน? → envelope เดียวกันทุกตัว | กล่องโค้ดหัว `HTTP 403` · บรรทัด `status` → `code` (ไฮไลต์) → `message` (ไทย) → `message_en` (อังกฤษ) → `request_id` (ไฮไลต์) → การ์ดคู่ ✓ `code === "FORBIDDEN"` / ✕ แกะข้อความ · แถบความคืบหน้าไฮไลต์ “อ่าน” | เช็กที่ code | Code Snippet · Marker Highlight · การ์ด ok/no |
| **b3** (26.4s) | 401 คืออะไร แก้ยังไง? | แถบ code ไฮไลต์ 401 → การ์ดแดง `401 UNAUTHORIZED` → ชิปสาเหตุ Key ขาด · หมดอายุ · ถูกเพิกถอน → “endpoint ที่ปิดไว้สำหรับ API Key” + `/me/api-tokens` · `/inbox/reply` + แถบ “ต้องเข้าสู่ระบบผ่านเว็บเท่านั้น” → การ์ดเขียว “ทางแก้”: เช็ก `Authorization: Bearer lmpat_…` · สร้างใหม่ที่ บัญชี → Personal API Key | 401 | การ์ด no / ok · codemap |
| **b4** (19.6s) | 403 ต่างจาก 401 ยังไง? | แถบ code ไฮไลต์ 403 → การ์ดแดง `403 FORBIDDEN` + ชิป “ไม่มี scope” · “role ไม่พอ” → กล่องโค้ด `GET /api/agents/{id}/inbox/threads` สิทธิ์ `inbox:read`: “Key มี: chat:invoke // ไม่พอ” → “ต้องใช้: inbox:read” (ไฮไลต์) → การ์ดเขียวทางแก้ | scope | การ์ด · Code Snippet |
| **b5** (18.4s) | 404/422 แก้ด้วยการลองใหม่ได้ไหม? → ไม่ได้ | แถบ code ไฮไลต์ 404 + 422 → การ์ด `404 NOT_FOUND` (ไม่พบ / ของบัญชีอื่น) → การ์ด `422 VALIDATION_ERROR` (ไม่ผ่านการตรวจรูปแบบ / ขาดช่องที่บังคับ) → แถว “ส่งซ้ำแบบเดิม ⟳ ได้ผลเดิม → แก้คำขอก่อน” | แก้คำขอก่อน | การ์ด no · loop |
| **b6** (21.7s) | 429 ต้องทำยังไง? → รอแบบเว้นนานขึ้น แต่ดู code ก่อน | แถบ code ไฮไลต์ 429 → การ์ด `429 RATE_LIMIT_EXCEEDED` → การ์ดเขียว backoff: ลอง → รอ 1 วิ → ลอง → รอ 2 วิ → ลอง → รอ 4 วิ → ✓ + “ตัวเลขเป็นตัวอย่าง · คู่มือไม่ได้ระบุเวลารอ” → การ์ดแดง `429 VOICE_QUOTA_EXCEEDED` “ดูยอดคงเหลือ ไม่ใช่แค่รอ” | 429 มีมากกว่าหนึ่งแบบ | backoff strip |
| **b7** (34.6s + hold 1.0s) | Voice มี error อะไรเพิ่ม? | แถบ code ไฮไลต์ Voice → 5 แถวขึ้นตามเสียง: `403 VOICE_DISABLED`, `403 VOICE_NOT_IN_PLAN`, `400 NO_CREDENTIAL`, `422 VOICE_AUDIO_FORMAT_UNSUPPORTED`, `429 VOICE_QUOTA_EXCEEDED` (แต่ละแถวมีคำอธิบาย) → ชิป `GET /api/me/voice-quota · ดูยอดคงเหลือ` | 5 code ของ Voice | error rows |
| **b8** (21.6s + hold 1.5s) | จำยังไงให้ง่าย? → 3 กลุ่ม | กลุ่ม 1 เขียว “รอแล้วลองใหม่ได้” `429 RATE_LIMIT_EXCEEDED` → กลุ่ม 2 ทอง “แก้คำขอก่อน” 401 / 403 / 404 / 422 / FORMAT → กลุ่ม 3 ฟ้า “ตั้งค่าในเว็บ / ดูแพ็กเกจ” VOICE_DISABLED / NO_CREDENTIAL / VOICE_NOT_IN_PLAN / VOICE_QUOTA → หมายเหตุ “การแบ่งกลุ่มเป็นแนวทางของคลิป” | 3 กลุ่ม | group cards |
| **b9** (21.1s) | เอาไปใช้ในระบบจริงยังไง? | มือถือหน้า “บันทึก error ของระบบ” (APP-ERR-LOG) + callout (HTTP status + code → แยกกรณี, request_id → เก็บไล่ดูภายหลัง) → (RATE_LIMIT_EXCEEDED → ระบบลองใหม่เอง, code อื่น → แจ้งทีม + ทางแก้) → สลับเป็นหน้ากล่องแชทที่บอกทางแก้ (APP-ERR-FRIENDLY) (code → ข้อความบอกทางแก้, request_id → ปุ่มคัดลอก) | log → หน้าจอบอกทางแก้ | Device Stage · callout grid |
| **b10** (30.2s) | โควตานับยังไง? | การ์ด “โควตาบัญชีเดียวกัน”: ชิป เว็บ + API Key = บัญชีเดียวกัน → โควตาโทเค็น LLM · rate limit การสนทนา → “ดูที่เหลือ: หน้า Credentials” · การ์ด “Voice API มีลิมิตของตัวเอง” ตัวเลขใหญ่ **60** ถอดเสียง/นาที · **300** อ่านออกเสียง/นาที → แถบ “ข้อความที่ถอดแล้วส่งเข้า chat ยังนับโควตา chat” · แถบความคืบหน้าไฮไลต์ “ป้องกัน” | 60 / 300 | การ์ด · stats |
| **b11** (25.3s) | ป้องกันยังไง? | 6 แถวขึ้นตามเสียง: scope น้อยสุด · แยก Key · ตั้งวันหมดอายุ · อย่า commit Key · สงสัยหลุด → เพิกถอนทันที · API Key สร้าง/ลบ Key อื่นไม่ได้ | แนวทาง 5+1 ข้อ | safe rows · ไอคอน shield/key/clock/lock/trash/server |
| **b12** (16.6s) | สรุป | แถบความคืบหน้าเสร็จทั้งหมด → 3 แถว อ่าน / รับมือ / ป้องกัน → Robot `04-open-arms` | 3 ขั้น | Robot |
| **b13** (6.9s) | — | โลโก้ LangMind · langmind.in.th · ชิป Errors · Rate Limit · Quota | ผู้สนับสนุน | `langmind-logo.png` |

---

## 3. ฉากที่ใช้ตรวจ (draft v1)

* **ตรวจแล้ว**: `check` ผ่าน (ok: true) · เฟรมขนาดมือถือ [video/evidence/draft-v1-mobile-frames-1.jpg](video/evidence/draft-v1-mobile-frames-1.jpg), [-2.jpg](video/evidence/draft-v1-mobile-frames-2.jpg) — ดู [video/REVIEW.md](video/REVIEW.md)
* **ฉากที่ต้องดูซ้ำหลังมีเสียง**: b7 (ยาวสุด 34 วิ ข้อมูลแน่น), b8 (code 10 ตัวในจอเดียว), b9 (callout 6 ตัว สลับภาพ)

---

## 4. แบบกำหนดหน้าจอ Mockup (Screen Specifications)

ทำจากโค้ด HTML แล้ว screenshot · ต้นฉบับ [video/mockups/](video/mockups/) (สไตล์ร่วม `shop.css`) · 1440×1800 · ป้าย “ภาพจำลอง” ทุกภาพ

### หน้าจอ 1: APP-ERR-BROKEN (`broken.html` → `assets/app-err-broken.jpg`)
* หน้า “กล่องแชทของร้าน” (หลังบ้านร้านกาแฟ) แท็บ ทั้งหมด/LINE/เว็บ
* กล่องกลาง “เกิดข้อผิดพลาด · กรุณาลองใหม่ภายหลัง · [ลองใหม่]” และแถวว่าง (skeleton) — สภาพ “ก่อน” · ใช้ใน b1

### หน้าจอ 2: APP-ERR-LOG (`log.html` → `assets/app-err-log.jpg`)
* หน้า “บันทึก error ของระบบ” · ตัวกรอง ทั้งหมด 4 · ลองใหม่เอง 1 · แจ้งทีม 3
* 4 แถว: เวลา, endpoint, ป้าย HTTP, code, request_id (ตัดท้าย), การจัดการ
  * 403 FORBIDDEN `…/inbox/threads` → แจ้งทีม: Key ไม่มี inbox:read
  * 429 RATE_LIMIT_EXCEEDED `…/chat/message` → ลองใหม่เอง · สำเร็จครั้งที่ 2
  * 422 VALIDATION_ERROR `/short-links` → แจ้งทีม: แก้ข้อมูลที่ส่ง
  * 403 VOICE_DISABLED `…/voice/transcribe` → แจ้งทีม: เปิดเสียงในเว็บ
* ใช้ใน b9

### หน้าจอ 3: APP-ERR-FRIENDLY (`friendly.html` → `assets/app-err-friendly.jpg`)
* หน้ากล่องแชทเดิม แต่มีแบนเนอร์ “ดึงรายการแชทไม่ได้ [403 FORBIDDEN]” · “API Key ที่ระบบใช้ไม่มีสิทธิ์ inbox:read · ทางแก้: แจ้งแอดมินให้ใช้ Key ที่มี scope นี้” · “รหัสอ้างอิง 01J8XK2… [คัดลอก]” — สภาพ “หลัง” · ใช้ใน b9

### การสร้างภาพใหม่
```bash
cd video/mockups
google-chrome --headless=new --hide-scrollbars --window-size=1440,1800 --screenshot=log.png log.html
```
Chrome บันทึกเป็น PNG → แปลงเป็น `../assets/app-err-log.jpg` (ทำแบบเดียวกันกับไฟล์อื่น)

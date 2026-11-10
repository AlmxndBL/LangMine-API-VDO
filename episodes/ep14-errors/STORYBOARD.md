# EP14 — Storyboard และแบบกำหนดหน้าจอ v1 (Errors)

เอกสารอ้างอิง: [PLAN](PLAN.md), [SCRIPT](SCRIPT.md), [CATALOG](CATALOG.md), และ [WORKFLOW](../../docs/WORKFLOW.md)
สถานะ: ตรงกับ draft v1 ([video/ep14-errors-draft-v1.mp4](video/ep14-errors-draft-v1.mp4), 2:30 ยังไม่มีเสียง)

---

## 1. แนวภาพ (Visual System)
* Editorial Paper & Sage Ink · 9:16 (1080×1920, 30 fps) · ระบบเดียวกับ EP12/EP13
* **แดงอิฐ `#9b3b2b`** = error (ป้าย HTTP, การ์ดปัญหา, ช่องที่เลือกในแถบ code) · **เขียว `#38815A`** = ทางแก้
* 3 กลุ่มการรับมือ: เขียว รอแล้วลองใหม่ · ทอง `#8d732c` แก้คำขอ · ฟ้า `#1E7578` ตั้งค่าในเว็บ
* Sarabun / DejaVu Sans Mono · หัวเรื่อง 72px · ขั้นต่ำ 28px · ซับ ≤ 2 บรรทัด
* kicker “EP14 / ERRORS” · แถบความคืบหน้า **1 อ่าน → 2 รับมือ → 3 ใช้ผล**
* **แถบ code (codemap)** b3–b7: `401 403 404 422 429 Voice` ช่องที่กำลังพูดเป็นสีแดง

---

## 2. Storyboard ราย Beat

| Beat / เวลา | สงสัยก่อน → เข้าใจหลัง | ภาพเริ่ม → การเคลื่อนไหว → ภาพจบ | Assets / Catalog |
|---|---|---|---|
| **b1** (13.5s) | ระบบพัง แต่บอกแค่ “เกิดข้อผิดพลาด” | มือถือหน้ากล่องแชทที่พัง (APP-ERR-BROKEN) ซูมช้า ๆ → ป้าย “‘เกิดข้อผิดพลาด’ แค่นั้น” → ชิป 3 คำถามเด้งขึ้น | Device Stage · `app-err-broken.jpg` |
| **b2** (15.4s + hold 1.0s) | error หน้าตาแบบไหน → envelope เดียวกันทุกตัว | กล่องโค้ดหัว `HTTP 403` · `status` → `code` (ไฮไลต์) → `message` → `message_en` → `request_id` (ไฮไลต์) → การ์ดคู่ ✓ เช็ก code / ✕ แกะข้อความ | Code Snippet · Marker Highlight |
| **b3** (14.2s) | 401 คืออะไร | codemap 401 → การ์ดแดง `401 UNAUTHORIZED` + ชิป Key ขาด · หมดอายุ · ถูกเพิกถอน · endpoint ที่ต้อง login เว็บ + `/me/api-tokens` `/inbox/reply` → การ์ดเขียวทางแก้ (Bearer, สร้างใหม่ที่ Personal API Key) | การ์ด no/ok |
| **b4** (12.3s) | 403 ต่างจาก 401 ยังไง | codemap 403 → การ์ด `403 FORBIDDEN` + ชิป scope / role → กล่องโค้ด `GET /api/agents/{id}/inbox/threads` “Key มี: chat:invoke // ไม่พอ” → “ต้องใช้: inbox:read” (ไฮไลต์) → ทางแก้ | Code Snippet |
| **b5** (12.1s) | ลองใหม่ได้ไหม → ไม่ได้ | codemap 404+422 → การ์ด `404 NOT_FOUND` → การ์ด `422 VALIDATION_ERROR` → แถว “ส่งซ้ำแบบเดิม ⟳ ได้ผลเดิม → แก้คำขอก่อน” | loop row |
| **b6** (14.4s) | 429 ต้องรอใช่ไหม → ดู code ก่อน | codemap 429 → การ์ด `429 RATE_LIMIT_EXCEEDED` → การ์ดเขียว “รอแล้วลองใหม่ · ลิมิตดูต่อใน EP15” → การ์ด `429 VOICE_QUOTA_EXCEEDED` “ดูยอดคงเหลือ ไม่ใช่แค่รอ” | การ์ด |
| **b7** (18.6s) | Voice มี error อะไรเพิ่ม | codemap Voice → 4 แถว: `VOICE_DISABLED`, `VOICE_NOT_IN_PLAN`, `NO_CREDENTIAL`, `VOICE_AUDIO_FORMAT_UNSUPPORTED` + “รายละเอียด Voice API ดู EP04” | error rows |
| **b8** (14.0s + hold 1.0s) | จำยังไง → 3 กลุ่ม | กลุ่มเขียว / ทอง / ฟ้า ขึ้นทีละกลุ่ม รวม code ครบ 10 ตัว + หมายเหตุ “แนวทางของคลิป” | group cards |
| **b9** (13.7s) | เอาไปใช้ยังไง | มือถือหน้าบันทึก error (APP-ERR-LOG) + callout status+code · request_id · RATE_LIMIT_EXCEEDED → ลองเอง · code อื่น → แจ้งทีม → สลับเป็นหน้าที่บอกทางแก้ (APP-ERR-FRIENDLY) + callout ข้อความทางแก้ · ปุ่มคัดลอก request_id · แถบไฮไลต์ “ใช้ผล” | Device Stage · callout |
| **b10** (5.1s) | สรุป | แถบเสร็จทั้งหมด · 3 แถว อ่าน / รับมือ / ใช้ผล · Robot | Robot `04-open-arms` |
| **b11** (6.9s) | — | โลโก้ LangMind · langmind.in.th · ชิป Errors · code · request_id | `langmind-logo.png` |

---

## 3. ตรวจแล้ว (draft v1)
* `check` ok: true · ซับทุกท่อนตรวจจากเฟรมจริงว่าไม่เกิน 2 บรรทัด · เฟรมมือถือ [video/evidence/](video/evidence/) — ดู [video/REVIEW.md](video/REVIEW.md)
* ต้องดูซ้ำหลังมีเสียง: b7 (ข้อมูลแน่นสุด), b9 (callout สลับภาพ)

---

## 4. Mockup (Screen Specifications)
ต้นฉบับ [video/mockups/](video/mockups/) (สไตล์ร่วม `shop.css`) · 1440×1800 · ป้าย “ภาพจำลอง”

* **APP-ERR-BROKEN** (`broken.html`): หน้า “กล่องแชทของร้าน” กล่อง “เกิดข้อผิดพลาด · กรุณาลองใหม่ภายหลัง · [ลองใหม่]” + แถวว่าง — สภาพก่อน (b1)
* **APP-ERR-LOG** (`log.html`): “บันทึก error ของระบบ” 4 แถว — 403 FORBIDDEN `…/inbox/threads` แจ้งทีม · 429 RATE_LIMIT_EXCEEDED `…/chat/message` ลองใหม่เองสำเร็จ · 422 VALIDATION_ERROR `/short-links` แจ้งทีม · 403 VOICE_DISABLED `…/voice/transcribe` แจ้งทีม (b9)
* **APP-ERR-FRIENDLY** (`friendly.html`): แบนเนอร์ “ดึงรายการแชทไม่ได้ [403 FORBIDDEN] · Key ไม่มีสิทธิ์ inbox:read · ทางแก้ · รหัสอ้างอิง [คัดลอก]” — สภาพหลัง (b9)

สร้างใหม่: `google-chrome --headless=new --hide-scrollbars --window-size=1440,1800 --screenshot=log.png log.html` แล้วแปลงเป็น `../assets/app-err-log.jpg`

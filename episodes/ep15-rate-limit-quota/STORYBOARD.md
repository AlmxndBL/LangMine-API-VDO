# EP15 — Storyboard และแบบกำหนดหน้าจอ v1 (Rate Limit & Quota)

เอกสารอ้างอิง: [PLAN](PLAN.md), [SCRIPT](SCRIPT.md), [CATALOG](CATALOG.md), และ [WORKFLOW](../../docs/WORKFLOW.md)
สถานะ: ตรงกับ draft v1 ([video/ep15-rate-limit-quota-draft-v1.mp4](video/ep15-rate-limit-quota-draft-v1.mp4), 2:26 ยังไม่มีเสียง)

---

## 1. แนวภาพ (Visual System)
* Editorial Paper & Sage Ink · 9:16 (1080×1920, 30 fps) · ระบบเดียวกับ EP12–EP14
* แถบโควตา: ฟ้าอมเขียว `#1E7578` = ใช้ผ่านเว็บ · ทอง `#c8902c` = ใช้ผ่าน API Key · ครีม `#e8e1d0` = เหลือ
* แดงอิฐ `#9b3b2b` = error / ใกล้หมด · เขียว `#38815A` = ทางแก้
* Sarabun / DejaVu Sans Mono · หัวเรื่อง 72px · ตัวเลขใหญ่ 72px · ขั้นต่ำ 28px · ซับ ≤ 2 บรรทัด
* kicker “EP15 / RATE LIMIT & QUOTA” · แถบความคืบหน้า **1 โควตา → 2 ลิมิต → 3 รับมือ**

---

## 2. Storyboard ราย Beat

| Beat / เวลา | สงสัยก่อน → เข้าใจหลัง | ภาพเริ่ม → การเคลื่อนไหว → ภาพจบ | Assets / Catalog |
|---|---|---|---|
| **b1** (12.1s) | เจอ 429 / โควตาเต็ม | มือถือหน้า “การใช้งาน API ของร้าน” ที่มีแถบแดง “โควตาถอดเสียงเหลือ 8 นาที” (APP-Q-LOW) ซูมช้า ๆ → ป้าย “แชท · เสียง · ลิงก์ย่อ → 429 / โควตาเต็ม” → 3 คำถาม | Device Stage · `app-q-quota-low.jpg` |
| **b2** (12.3s) | API Key แยกโควตาไหม → ไม่แยก | การ์ด “เว็บ · ทีมใช้งาน” และ “API Key · ระบบหลังบ้าน” → ลูกศรลงสองเส้น → การ์ด “โควตาบัญชีเดียวกัน” แถบเติมสีฟ้า (เว็บ) แล้วทอง (API Key) → ท่อน 2 แถบฟ้ายาวขึ้น + แถบเตือน “ทีมใช้เว็บเยอะ → API เหลือน้อยลงด้วย” · แถบความคืบหน้าไฮไลต์ “โควตา” | pool + meter |
| **b3** (13.2s) | อะไรบ้างที่นับรวม | การ์ด “ผู้ใช้คนเดียวกัน” + ชิป โควตาโทเค็น LLM · rate limit การสนทนา → browser · API Key · = คนเดียวกัน → การ์ดเขียว “เช็กโควตาที่เหลือ: หน้า Credentials ในเว็บ LangMind” | การ์ด |
| **b4** (20.6s + hold 1.0s) | Voice นับยังไง | การ์ด “ลิมิตต่อผู้ใช้ (ค่าเริ่มต้น)” ตัวเลขใหญ่ **60** ถอดเสียง/นาที → **300** อ่านออกเสียง/นาที → ชิป ไม่ผูกกับแพ็กเกจ · ค่าใช้จ่ายตามโมเดลเสียง → แถวประ “ถอดเสียง → ข้อความ → chat · นับโควตา chat ด้วย” · แถบไฮไลต์ “ลิมิต” | stats · flow |
| **b5** (13.1s) | โควตาเสียงนับหน่วยอะไร | การ์ดคู่ ถอดเสียง “นับเป็นนาที” / อ่านออกเสียง “นับเป็นตัวอักษร” + “โควตาเสียงของแพ็กเกจ + เครดิต” → การ์ดแดง `429 VOICE_QUOTA_EXCEEDED` → ชิป `GET /api/me/voice-quota · ยอดคงเหลือ` | units · error card |
| **b6** (12.1s + hold 1.0s) | ลิงก์ย่อล่ะ | กล่องโค้ด `GET /api/short-links/usage` สิทธิ์ `short_links:read` · “ใช้ไปเท่าไร // เทียบเพดานของแผน” · “ฟีเจอร์ที่แผนเปิดให้” · foot “นับโควตาเดียวกับหน้า ‘ลิงก์ย่อ’ ในเว็บ” → ป้าย `422 SHORT_LINK_LIMIT_EXCEEDED`, `429 SHORT_LINK_RATE_EXCEEDED` + “ดู EP13” | Code Snippet · error chips |
| **b7** (12.0s) | เจอ 429 ทำยังไง | การ์ดเขียว `429 RATE_LIMIT_EXCEEDED` “รอแล้วลองใหม่ · เว้นให้นานขึ้น” + backoff ลอง → รอ 1 → 2 → 4 วิ → ✓ + “ตัวเลขเป็นตัวอย่าง” → การ์ด “เช็กยอดก่อนงานใหญ่” ชิป voice-quota · usage · หน้า Credentials · แถบไฮไลต์ “รับมือ” | backoff strip |
| **b8** (14.5s) | ป้องกันยังไง | แถบเตือน “Key ที่หลุด ใช้โควตาบัญชีคุณได้” → 5 แถว: scope น้อยสุด · แยก Key · ตั้งวันหมดอายุ · อย่า commit · สงสัยหลุด → เพิกถอนทันที | safe rows |
| **b9** (12.1s) | เอาไปใช้ยังไง | มือถือหน้า “การใช้งาน API ของร้าน” (APP-Q) + callout `/api/me/voice-quota` → ยอดเสียง · `/api/short-links/usage` → ยอดลิงก์ย่อ → สลับเป็นภาพใกล้หมด (APP-Q-LOW) + callout ใกล้หมด → แจ้งทีม · โทเค็น LLM → หน้า Credentials | Device Stage · callout |
| **b10** (8.1s) | สรุป | แถบเสร็จทั้งหมด · 3 แถว โควตา / ลิมิต / รับมือ · Robot | Robot `04-open-arms` |
| **b11** (6.9s) | — | โลโก้ LangMind · langmind.in.th · ชิป Rate Limit · Quota · API Key | `langmind-logo.png` |

---

## 3. ตรวจแล้ว (draft v1)
* `check` ok: true · ซับทุกท่อนตรวจจากเฟรมจริง · เฟรมมือถือ [video/evidence/](video/evidence/) — ดู [video/REVIEW.md](video/REVIEW.md)
* ต้องดูซ้ำหลังมีเสียง: b4 (ยาวสุด 3 ท่อน), b2 (จังหวะแถบโควตากับคำพูด)

---

## 4. Mockup (Screen Specifications)
ต้นฉบับ [video/mockups/](video/mockups/) (`shop.css`) · 1440×1800 · ป้าย “ภาพจำลอง” · เป็นหน้าในระบบของร้านเอง ไม่ใช่หน้าเว็บ LangMind

* **APP-Q** (`quota.html` → `assets/app-q-quota.jpg`): “การใช้งาน API ของร้าน” · การ์ดเสียง (ที่มา `/api/me/voice-quota`) ถอดเสียง 42 จาก 120 นาที, อ่านออกเสียง 18,400 จาก 50,000 ตัวอักษร · การ์ดลิงก์ย่อ (ที่มา `/api/short-links/usage`) 12 จาก 50 · การ์ดโทเค็น LLM “ดูที่หน้า Credentials ในเว็บ LangMind ↗” · การ์ด 429 วันนี้ 3 ครั้ง ลองใหม่สำเร็จ (b9)
* **APP-Q-LOW** (`quota-low.html` → `assets/app-q-quota-low.jpg`): เหมือน APP-Q แต่แถบแดงด้านบน “โควตาถอดเสียงเหลือ 8 นาที · แจ้งทีมแล้ว” และถอดเสียง 112 จาก 120 นาที (b1, b9)

สร้างใหม่: `google-chrome --headless=new --hide-scrollbars --window-size=1440,1800 --screenshot=quota.png quota.html` แล้วแปลงเป็น `../assets/app-q-quota.jpg`

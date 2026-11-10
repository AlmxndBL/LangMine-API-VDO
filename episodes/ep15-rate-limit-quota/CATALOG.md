# EP15 — ทะเบียนคัดเลือก Catalog (Rate Limit & Quota)

อ้างอิง: [CATALOG_USAGE_MAP](../../docs/CATALOG_USAGE_MAP.md), [PLAN](PLAN.md), [STORYBOARD](STORYBOARD.md), [WORKFLOW](../../docs/WORKFLOW.md)
สถานะ: ใช้จริงใน draft v1 · บล็อกเป็นโค้ดใน [video/build.mjs](video/build.mjs) / [video/motion.js](video/motion.js) / [video/style.css](video/style.css) ต่อยอดจาก engine ของ EP14 · รหัส `#hf-…` ใช้ตาม EP04

## 1. หน้าที่ของซีน
ตอนนี้อธิบาย **ปริมาณ** (โควตาที่ใช้ร่วมกัน, ลิมิตเป็นตัวเลข, หน่วยนับ) จึงต้องการบล็อก: แหล่งใช้งานรวมเป็นแถบเดียว · ตัวเลขใหญ่ · หน่วยนับ · พฤติกรรมตามเวลา (backoff) · checklist ป้องกัน · หน้าจอสรุปยอด

## 2. รายการบล็อก

| รหัส / ชื่อ | หน้าที่ | Beat | หมายเหตุ |
|---|---|---|---|
| **#hf-195 Browser Device Stage** (`device()`) | หน้าการใช้งาน API ของร้าน | b1, b9 | b9 สลับปกติ → ใกล้หมด |
| **Shared pool meter** (`.pool`, `.meter-card`, `.mbar` — ใหม่) | เว็บ + API Key ไหลเข้าแถบโควตาเดียว | b2 | ความกว้างแถบ tween ด้วย GSAP (`width`) ตามคำพูด · ไม่ tween className |
| **Stats** (`.stats`) | ตัวเลขใหญ่ 60 / 300 | b4 | ตัวเลขจากคู่มือเท่านั้น |
| **Flow row** (`.flow` — ใหม่) | ถอดเสียง → ข้อความ → chat | b4 | แสดงว่าโควตา chat ถูกนับต่อ |
| **Units pair** (`.units` — ใหม่) | นาที / ตัวอักษร | b5 | — |
| **Error chip / card** (`E()`, `.card.no`) | VOICE_QUOTA_EXCEEDED, SHORT_LINK_* , RATE_LIMIT_EXCEEDED | b5–b7 | จาก EP14 |
| **#hf-122 Code Snippet** (`codeBox()`) | `GET /api/short-links/usage` | b6 | ไม่แสดงชื่อฟิลด์ response (คู่มือไม่มีตัวอย่าง) |
| **Backoff strip** (`.backoff`) | ลอง → รอ → ลอง | b7 | ติด “ตัวเลขเป็นตัวอย่าง” |
| **Safe checklist** (`.safe`) | 5 แนวทาง | b8 | — |
| **Field callout grid** (`callout()`) | endpoint → ส่วนของหน้าจอ | b9 | 2 ชุด |
| **Progress spine** | โควตา / ลิมิต / รับมือ | b2–b10 | phase `b2–b3:1`, `b4–b6:2`, `b7–b9:3` · b10 เสร็จ · b11 ซ่อน |
| **Robot `04-open-arms`** | สรุป | b10 | — |

## 3. ข้อจำกัดทางเทคนิค
* Seek-safe · timeline `window.__timelines['ep15-rate-limit-quota']`
* ป้าย “ภาพจำลอง” ใช้ `#film > .note` · ตัวอักษร ≥ 28px · contrast ≥ 3:1

## 4. ทดสอบหลังมีเสียง
* แถบโควตา b2 ยาวขึ้นตรงคำว่า “ใช้เว็บเยอะ” ไหม · b4 ทันอ่านไหม

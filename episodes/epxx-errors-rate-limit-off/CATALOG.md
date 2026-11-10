# EP14 — ทะเบียนคัดเลือก Catalog (Errors / Rate Limit & Quota)

อ้างอิง: [CATALOG_USAGE_MAP](../../docs/CATALOG_USAGE_MAP.md), [PLAN](PLAN.md), [STORYBOARD](STORYBOARD.md), และ [WORKFLOW](../../docs/WORKFLOW.md)
สถานะ: ใช้จริงใน draft v1 · บล็อกทั้งหมดเป็นโค้ดใน [video/build.mjs](video/build.mjs) / [video/motion.js](video/motion.js) / [video/style.css](video/style.css) ต่อยอดจาก engine ของ EP13 · รหัส `#hf-…` ใช้ตาม EP04 (ไม่ได้เปิด CATALOG_USAGE_MAP ระหว่างทำ)

---

## 1. เกณฑ์การคัดเลือกตามหน้าที่ของซีน

ตอนนี้ไม่มี “การเชื่อม” เป็นแกน แต่เป็น **การจำแนก error** จึงต้องการบล็อกที่ทำ 5 หน้าที่:
1. **แสดงโครงสร้าง error (Envelope)** — ไล่ทีละฟิลด์ และเทียบวิธีอ่านที่ถูก/ผิด
2. **จำแนก code (Classification)** — code อยู่ตรงไหนในชุด 10 ตัว และเป็นปัญหาแบบไหน
3. **ปัญหา → ทางแก้ (Problem / Fix)** — การ์ดแดงคู่การ์ดเขียว
4. **แสดงพฤติกรรมตามเวลา (Retry/backoff)** — ลองใหม่แบบเว้นนานขึ้น
5. **ตัวเลขลิมิต (Stats)** และ **แนวทางป้องกัน (Checklist)**

---

## 2. รายการ Catalog ที่เลือกใช้ตามหน้าที่

| รหัส / ชื่อ | หน้าที่ในซีน | Beat ที่ใช้ | เหตุผลและข้อจำกัด |
|---|---|---|---|
| **#hf-195 Browser Device Stage** (`device()`) | หน้าจอแอปจำลอง ซูม / สลับภาพ | b1, b9 | b1 ใช้ภาพเดียว (หน้าที่พัง) · b9 สลับหน้าบันทึก error → หน้าที่บอกทางแก้ |
| **#hf-122 Code Snippet – Dark Modern** (`.code` + `lnx()`, `codeBox()`) | error envelope ขึ้นทีละบรรทัด (หัวเป็น `HTTP 403` สีแดงแทน method) · ตัวอย่าง scope ไม่พอ | b2, b4 | คอมเมนต์ไทย `// …` อธิบายแต่ละฟิลด์ |
| **#hf-072 Marker Highlight** (`.mark`) | ไฮไลต์ `code`, `request_id`, `inbox:read` | b2, b4 | จังหวะตรงคำในบท |
| **Codemap strip** (`codemap(active)` — ใหม่) | แถบ `401 403 404 422 429 Voice` บอกตำแหน่งในชุด code | b3–b7 | แทน minimap ของ EP12/13 · ช่องที่เลือกเป็นสีแดง · ช่องอื่นใช้สี `#66716a` ให้ผ่าน contrast 3:1 |
| **Error chip** (`E(http, code)`, `.chip.err` — ต่อยอดจาก EP13) | ป้ายรหัส HTTP แดง + ชื่อ code แบบ mono | b3–b8 | `.big` สำหรับหัวการ์ด · ต้องเป็น `inline-flex` (ไม่งั้นเลข HTTP ติดกับชื่อ code) |
| **Problem / Fix cards** (`.card.no` + `fixCard()` — ใหม่) | การ์ดแดงสาเหตุ → การ์ดเขียวทางแก้ | b3, b4, b6 | ชิปสาเหตุเด้งทีละอันตามเสียง |
| **Right / wrong pair** (`.vs`) | ✓ เช็ก code / ✕ แกะข้อความ | b2 | ย้ำกฎข้อเดียวของคู่มือ |
| **Loop row** (`.loop`) | ส่งซ้ำ → ได้ผลเดิม → แก้คำขอก่อน | b5 | ใช้ไอคอน refresh |
| **Backoff strip** (`.backoff` — ใหม่) | ลอง → รอ 1 → 2 → 4 วิ → ✓ | b6 | ติดหมายเหตุ “ตัวเลขเป็นตัวอย่าง” ทุกครั้ง |
| **Error rows** (`.erow`) | 5 code ของ Voice พร้อมคำอธิบาย | b7 | แต่ละแถวขึ้นตามท่อนเสียง |
| **Group cards** (`.grp` — ใหม่) | 3 กลุ่มการรับมือ แถบสีซ้าย | b8 | รวม code ครบ 10 ตัวในจอเดียว |
| **Field callout grid** (`callout()`) | ส่วนของ error → ส่วนของระบบ/หน้าจอ | b9 | 3 ชุด ขึ้นและหายตามท่อน |
| **Stats** (`.stats` — ใหม่) | ตัวเลขใหญ่ 60 / 300 ครั้งต่อนาที | b10 | ตัวเลขจากคู่มือเท่านั้น |
| **Safe checklist** (`.safe` — ใหม่) | 6 แถวแนวทางความปลอดภัย | b11 | ไอคอนใหม่: check, search, refresh, clock, trash |
| **Progress spine** | อ่าน / รับมือ / ป้องกัน | b2–b12 | phase: `b2:1`, `b3–b9:2`, `b10–b11:3` · b12 เสร็จทั้งหมด · b13 ซ่อน |
| **Robot `04-open-arms`** | ปิดท้ายสรุป | b12 | — |

---

## 3. ข้อจำกัดทางเทคนิคที่ต้องรักษา

* **Seek-safe**: ใช้เฉพาะ GSAP tween/set ห้าม tween `className`
* Timeline: `window.__timelines['ep14-errors']`
* ป้าย “ภาพจำลอง” ใช้ `#film > .note` (ไม่ชนกับ `.chip.note`)
* ตัวอักษรขั้นต่ำ 28px · contrast ≥ 3:1 (แถบ codemap แก้แล้ว)

## 4. สิ่งที่ต้องทดสอบหลังมีเสียงจริง

* b7 (ยาวสุด) ยังอ่านทันหรือไม่ — ถ้ายาวไป แยกเป็น 2 ช่วง (ปิดใช้/ตั้งค่า กับ ไฟล์/โควตา)
* backoff ใน b6 ขึ้นตรงคำว่า “เว้นให้นานขึ้น” หรือไม่
* callout b9 ทันอ่านหรือไม่

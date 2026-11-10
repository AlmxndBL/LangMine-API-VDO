# EP14 — ทะเบียนคัดเลือก Catalog (Errors)

อ้างอิง: [CATALOG_USAGE_MAP](../../docs/CATALOG_USAGE_MAP.md), [PLAN](PLAN.md), [STORYBOARD](STORYBOARD.md), [WORKFLOW](../../docs/WORKFLOW.md)
สถานะ: ใช้จริงใน draft v1 · บล็อกเป็นโค้ดใน [video/build.mjs](video/build.mjs) / [video/motion.js](video/motion.js) / [video/style.css](video/style.css) ต่อยอดจาก engine ของ EP13 · รหัส `#hf-…` ใช้ตาม EP04

## 1. หน้าที่ของซีน
ตอนนี้เป็น **การจำแนก error** ต้องการบล็อก 4 หน้าที่: แสดงโครงสร้าง error · บอกตำแหน่งของ code ในชุด · ปัญหา → ทางแก้ · ใช้ผลในระบบจริง

## 2. รายการบล็อก

| รหัส / ชื่อ | หน้าที่ | Beat | หมายเหตุ |
|---|---|---|---|
| **#hf-195 Browser Device Stage** (`device()`) | หน้าจอแอปจำลอง ซูม/สลับภาพ | b1, b9 | b9 สลับ log → หน้าบอกทางแก้ |
| **#hf-122 Code Snippet** (`.code`, `lnx()`, `codeBox()`) | error envelope ขึ้นทีละบรรทัด (หัว `HTTP 403` สีแดง) · ตัวอย่าง scope ไม่พอ | b2, b4 | คอมเมนต์ไทย `// …` |
| **#hf-072 Marker Highlight** (`.mark`) | ไฮไลต์ `code`, `request_id`, `inbox:read` | b2, b4 | — |
| **Codemap strip** (`codemap()`) | แถบ `401 403 404 422 429 Voice` | b3–b7 | ช่องอื่นสี `#66716a` ให้ผ่าน contrast 3:1 |
| **Error chip** (`E()`, `.chip.err`) | ป้าย HTTP + ชื่อ code | b3–b8 | ต้อง `inline-flex` ไม่งั้นเลขติดชื่อ |
| **Problem / Fix cards** (`.card.no`, `fixCard()`) | สาเหตุ → ทางแก้ | b3, b4, b6 | ชิปเด้งตามเสียง |
| **Right / wrong pair** (`.vs`) | ✓ เช็ก code / ✕ แกะข้อความ | b2 | — |
| **Loop row** (`.loop`) | ส่งซ้ำ → ได้ผลเดิม → แก้คำขอ | b5 | — |
| **Error rows** (`.erow`) | 4 code ของ Voice | b7 | — |
| **Group cards** (`.grp`) | 3 กลุ่มการรับมือ | b8 | code ครบ 10 ตัวในจอเดียว |
| **Field callout grid** (`callout()`) | ส่วนของ error → ส่วนของระบบ | b9 | 2 ชุด |
| **Progress spine** | อ่าน / รับมือ / ใช้ผล | b2–b10 | phase `b2:1`, `b3–b8:2`, `b9:3` · b10 เสร็จ · b11 ซ่อน |
| **Robot `04-open-arms`** | สรุป | b10 | — |

## 3. ข้อจำกัดทางเทคนิค
* Seek-safe (ห้าม tween `className`) · timeline `window.__timelines['ep14-errors']`
* ป้าย “ภาพจำลอง” ใช้ `#film > .note` · ตัวอักษร ≥ 28px · contrast ≥ 3:1

## 4. ทดสอบหลังมีเสียง
* b7 ทันอ่านไหม · callout b9 ตรงคำพูดไหม

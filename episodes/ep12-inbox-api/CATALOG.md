# EP12 — ทะเบียนคัดเลือก Catalog (Inbox API)

อ้างอิง: [CATALOG_USAGE_MAP](../../docs/CATALOG_USAGE_MAP.md), [PLAN](PLAN.md), [STORYBOARD](STORYBOARD.md), และ [WORKFLOW](../../docs/WORKFLOW.md)
สถานะ: ใช้จริงใน draft v1 · ทุกบล็อกเขียนเป็นโค้ดใน [video/build.mjs](video/build.mjs) / [video/motion.js](video/motion.js) / [video/style.css](video/style.css) ต่อยอดจาก engine ของ EP04 video-v3 (ไม่ได้ติดตั้งบล็อก catalog แยก)

---

## 1. เกณฑ์การคัดเลือกตามหน้าที่ของซีน

EP12 มี 4 หน้าที่หลักที่ต้องใช้แอนิเมชันช่วยอธิบาย:
1. **แสดงหน้าจอแอปจำลอง (Device Hosting)** — ให้เห็นแชท LINE และหน้ากล่องแชทของร้านในบริบทจริง
2. **แสดงเส้นทางข้อมูล (Data Flow)** — ลูกค้า → LangMind → Inbox API → ระบบหลังบ้าน → หน้าจอ
3. **แสดง request / response ทีละส่วน (Code & JSON)** — 4 endpoint, พารามิเตอร์, ฟิลด์ที่สำคัญ
4. **บอกตำแหน่งในเรื่อง (Wayfinding)** — คนดูต้องรู้ว่าอยู่การเชื่อมแบบไหนจาก 4 แบบ และอยู่ขั้นไหน (เตรียม/เชื่อม/ใช้ผล)

---

## 2. รายการ Catalog ที่เลือกใช้ตามหน้าที่

| รหัส / ชื่อ | หน้าที่ในซีน | Beat ที่ใช้ | เหตุผลและข้อจำกัด |
|---|---|---|---|
| **#hf-195 Browser Device Stage** (`device()` ใน build.mjs) | กรอบมือถือครอบภาพหน้าจอจำลอง ซูมเข้าการ์ด และสลับภาพ (`img-a`) | b1, b8 | ภาพ 1440×1800 ถูกซูมให้การ์ดกลางเต็มกรอบ ตัวหนังสืออ่านได้บนมือถือ · ไม่หลอกว่าเป็นแอปจริง (มีป้าย “ภาพจำลอง”) |
| **hw-pipeline** (adaptation จาก EP04) | โหนดเรียงแนวตั้ง + เส้น SVG วาดตัวเอง (`pathLength=1`) + จุด `.dot` วิ่งตามลูกศร | b2 | แสดงทิศทางข้อมูลทีละช่วงตามเสียง ไม่ขึ้นพร้อมกัน |
| **#hf-122 Code Snippet – Dark Modern** (`panel()` + `lnx()`) | แผง request (method, path, scope) และกล่อง JSON ที่ขึ้นทีละบรรทัด | b4, b5, b6, b7 | ตัด path ยาวด้วย `<br>` ไม่ให้ล้นจอ · แสดงเฉพาะฟิลด์ที่บทพูดถึง ไม่ใช่ response เต็ม |
| **#hf-072 Marker Highlight** (`.ln.hl`, `.ln.hl3`) | ไฮไลต์บรรทัดสำคัญ: `channel_counts`, `search`, `cursor`, `active: true/false` | b4, b5, b6 | สีไฮไลต์ตรงกับสีของการเชื่อมแบบนั้น |
| **Minimap 4 ช่อง** (`minimap(n, verb)` — สร้างใหม่สำหรับ EP12) | แผนที่ย่อ LangMind → 4 endpoint บอกว่าตอนนี้อยู่แบบไหน | b4, b5, b6, b7 | ใช้สีประจำ 4 แบบ (`#38815A`, `#8d732c`, `#1E7578`, `#5b5f9e`) ให้คนดูจำได้ว่าเหลืออีกกี่แบบ |
| **Progress spine** (pill เตรียม/เชื่อม/ใช้ผล — จาก EP04 v3) | แถบความคืบหน้า 3 ขั้นด้านบน | b3–b10 | phase ตั้งใน motion.js (`b3:1, b4–b7:2, b8–b9:3`) · b10 เป็น done ทั้งหมด · b11 ซ่อน |
| **Field callout grid** (`callout(field, meaning)` — สร้างใหม่) | ป้าย “ฟิลด์ → ส่วนของ UI” แบบ 2 คอลัมน์ ข้างภาพมือถือ | b8 | ขึ้นตามท่อนเสียง · ไม่เกิน 4 ป้ายต่อท่อน |
| **Ok / No cards** (`.card.ok`, `.card.no`) | เทียบสิ่งที่ Key ทำได้ / ต้องเข้าเว็บ | b9 | ใช้สีแดงอิฐเฉพาะฝั่ง “ทำไม่ได้” |
| **File chip** (`.chip.out-chip.file`) | ผลของ export เป็นไฟล์ ไม่ใช่ JSON | b7 | เน้นความต่างจาก 3 endpoint แรกด้วยรูปทรง ไม่ใช่ข้อความยาว |
| **Robot `04-open-arms`** | ปิดท้ายสรุป | b10 | ไม่ใช้ Robot ในฉากโค้ด เพื่อไม่แย่งสายตา |

---

## 3. ข้อจำกัดทางเทคนิคที่ต้องรักษา

* **Seek-safe**: ใช้เฉพาะ GSAP tween/set ห้าม tween `className` (เคยทำ timeline ของ EP04 พัง)
* Timeline ลงทะเบียนที่ `window.__timelines['ep12-inbox']`
* ภาพมือถือใช้ `data-layout-allow-overflow` (ภาพใหญ่กว่ากรอบโดยตั้งใจ) · ซับใช้ `data-layout-allow-caption-zone`

## 4. สิ่งที่ต้องทดสอบหลังมีเสียงจริง

* จังหวะ callout ใน b8 ยังตรงกับคำพูดหรือไม่ เมื่อเวลาสั้นลง ~15%
* กล่อง JSON b4/b5 อ่านทันหรือไม่ (อาจต้องเพิ่ม `hold` ใน b4)

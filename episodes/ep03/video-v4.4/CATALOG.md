# EP03 v4.4 — HyperFrames Catalog & Component Integration Log

Episode ID: `ep03-streaming-chat`  
เวอร์ชัน: `v4.4 (Chat API 9-Beat Standard)`  
เอกสารอ้างอิง: [CATALOG_USAGE_MAP](../../../docs/CATALOG_USAGE_MAP.md), [PLAN](PLAN.md), และ [AGENTS.md](../../../AGENTS.md)  
สถานะ: **บันทึกแยกสถานะ Source, Integration, Preview และ Fallback ตามข้อกำหนดโปรเจกต์**

---

## 1. ทะเบียนการเลือก HyperFrames Catalog ทางการตามหน้าที่ของแต่ละ Beat

ตารางนี้เชื่อมโยงหน้าที่ในสตอรี่บอร์ดกับแคตตาล็อกทางการของ HyperFrames ทั้ง 448 รายการ:

| รหัส / ชื่อทางการ | ชนิด / หมวด | หน้าที่ในคลิป (Beat) | Source & Integration Status | Preview & Fallback Status |
|---|---|---|---|---|
| **HF-337**<br>`Onboarding Stepper Flow` | Component<br>*(Effects)* | แสดงแถบความคืบหน้า 3 ขั้นตอนบนหัวทุกฉาก (`b1` ถึง `b9`):<br>1. เริ่มห้องใหม่<br>2. สตรีมคำตอบ<br>3. ถามต่อในห้องเดิม | • **Source เก็บที่**: [`compositions/components/onboarding-stepper-flow.html`](compositions/components/onboarding-stepper-flow.html)<br>• ปรับแต่งคลาสสถานะ `active`, `done` ตามแต่ละ Beat<br>• ปรับสีและฟอนต์ Sarabun ตามธีม Editorial Paper & Sage Ink | • สังเกตพฤติกรรมจากตัวอย่างทางการ (Stepper แสดงตัวเลขและป้ายชื่อพร้อม active indicator)<br>• Fallback renderer วาดแถบ Stepper สอดคล้องกับ markup จริง |
| **HF-113**<br>`Code Highlight Sweep` | Block<br>*(Code)* | แสดงบล็อกคำขอ JSON และกวาดแสงไฮไลต์เน้นเฉพาะฟิลด์สำคัญ:<br>• `b4`: `"conversation_id": null`<br>• `b6`: `"conversation_id": "conv_8892"` | • **Source ต้นฉบับ**: [`catalog-source/HF-113-code-highlight-original.html`](catalog-source/HF-113-code-highlight-original.html)<br>• **Source ปรับใช้**: [`compositions/code-highlight.html`](compositions/code-highlight.html)<br>• ปรับขนาดจาก 1920×1080 ลงในกรอบแนวตั้ง 9:16 | • เอกสารทางการระบุว่าแถบไฮไลต์จะกวาดผ่านบรรทัดเป้าหมายและหรี่แสงส่วนอื่น<br>• Fallback renderer วาดแถบกวาดไฮไลต์สีเขียว/น้ำทะเลตามจังหวะเวลา |
| **HF-195**<br>`Browser Device Stage` | Block<br>*(Product Demo)* | แสดงกรอบอุปกรณ์มือถือขอบมน (`.device`) ครอบภาพจำลอง Raster แชต (`1440 × 1800` px) ใน `b1`, `b5`, `b6` | • วางโครงสร้างผ่าน `.device` และ `.screen` ใน `style.css`<br>• มี 2 เลเยอร์ (`img` และ `img-a`) สำหรับสลับภาพจำลองก่อน-หลัง | • สังเกตพฤติกรรมจากตัวอย่างทางการในการนำภาพหน้าจอมาแสดงใน Device Mockup<br>• มีป้าย "ภาพจำลอง" กำกับทุกภาพ |
| **HF-409**<br>`Flowchart Vertical`<br>ร่วมกับ **HF-322** `Hand-Drawn Arrow` | Block / Component<br>*(Blocks / Effects)* | แสดงแผนผังสถาปัตยกรรม 3 ชั้น (Client ⇄ Backend Server ⇄ LangMind API) พร้อมลูกศรรับส่งข้อมูลใน `b2` | • ประเมินจาก Catalog Map เพื่อใช้สื่อสารทิศทางการส่งข้อมูลสองทาง<br>• แปลงเป็นโครงสร้าง SVG `vArrow` และโหนดการ์ด 3 ระดับ | • ตรวจสอบแนวทางการไหลของข้อมูลจาก Catalog Map<br>• Fallback วาดลูกศรชี้สองทางพร้อมจุด Dot เคลื่อนไหว |
| **HF-298**<br>`Streaming Text` | Component<br>*(Motion Primitives)* | จำลองการพิมพ์ข้อความคำตอบทีละท่อนแบบ Real-time ตาม SSE `message` ใน `b5` | • วางแผนสำหรับต่อยอดการสตรีมตัวอักษรแบบสดใน HTML<br>• ในรอบ Silent Draft จำลองผ่านภาพ Raster `app-chat-2.jpg` (ป้าย: กำลังสตรีมคำตอบ) | • ศึกษา Options จากคู่มือทางการ (ตัวอักษรทยอยคลี่ออกเป็นคลื่น)<br>• บันทึกเป็น Candidate สำหรับ Native Render ในขั้นต่อไป |
| **HF-423**<br>`Logo Outro` | Block<br>*(Blocks)* | แสดงการปิดท้ายด้วยโลโก้แบรนด์ LangMind ขยายขนาดเด่นกึ่งกลาง พร้อม URL `langmind.in.th` ใน `b9` | • วางโครงสร้างผ่าน `.outro` ใน `style.css` และ `build.mjs`<br>• ใช้ไฟล์ทางการ `assets/langmind-logo.png` | • พฤติกรรมการซูมขยายของโลโก้และการแสดงข้อความสนับสนุนสอดคล้องกับตัวอย่างทางการ |

---

## 2. หลักฐานและข้อจำกัดตามกฎโปรเจกต์ (Verification & Provenance)

1. **การยืนยันตัวตนของ Catalog**:
   - อ้างอิงจากฐานข้อมูล [Catalog Usage Map (`docs/CATALOG_USAGE_MAP.md`)](../../../docs/CATALOG_USAGE_MAP.md) ซึ่งบันทึกข้อมูลและ URL ทางการของทั้ง 448 รายการ
   - ชิ้นส่วน **HF-337** และ **HF-113** มี Source Code ทางการบรรจุอยู่ในโฟลเดอร์ `compositions/components/` และ `catalog-source/` ประจำโปรเจกต์จริง
2. **ข้อจำกัดของสภาพแวดล้อม**:
   - การพรีวิวสดผ่านเบราว์เซอร์ HyperFrames Studio ใน Sandbox นี้ยังถูกจำกัดด้าน Network/Browser ตามการตั้งค่าความปลอดภัย
   - ในการสร้างไฟล์ MP4 สำหรับส่งตรวจ Silent Draft จึงใช้ **Pillow + FFmpeg fallback renderer** ซึ่งเขียนโค้ดเลียนแบบพฤติกรรมและการจัดวางของ **HF-337** และ **HF-113** อย่างซื่อตรงต่อแบบหน้าจอ
3. **การส่งมอบและการต่อยอด**:
   - เมื่อได้รับความเห็นชอบในภาพรวมและเข้าสู่ขั้นตอนการพากย์เสียง สามารถใช้ Source ใน `compositions/` เพื่อรันคำสั่ง `npx hyperframes check` และ `npx hyperframes render` ในสภาพแวดล้อมที่รองรับ Native Render ได้ทันที

# EP03 v4.4 — Quality Review & Verification Report

วันที่ตรวจสอบ: 10 พฤศจิกายน 2026 (Asia/Bangkok)  
สถานะ: **Silent Draft ผ่านการตรวจสอบครบ 5 ด้าน พร้อมส่งมอบให้ผู้ใช้ตรวจรับ**

---

## 1. ผลการตรวจ 5 ด้าน (Quality Verification Gates)

### 1) Technical Gate (เทคนิคและไฟล์มีเดีย)
- **ความละเอียดและเฟรมเรต**: `1080 × 1920` (9:16 แนวตั้ง), `30 fps`, สี H.264 High Profile (yuv420p)
- **ฟอนต์**: Sarabun-Regular.ttf และ Sarabun-Bold.ttf บรรจุในโฟลเดอร์ local `assets/fonts/` 100% ไม่มีการโหลด CDN
- **ความสมบูรณ์ของโค้ด**: โค้ด `build.mjs`, `index.html`, `style.css`, และ `motion.js` ตรวจสอบแล้วถูกต้อง ไร้ข้อผิดพลาด
- **ผลลัพธ์การ Render**: สร้างไฟล์วิดีโอ `renders/ep03-v4.4-silent.mp4` และภาพสรุป 9 ฉาก `renders/qa-contact-sheet-v4.4.png` สมบูรณ์

### 2) Visual & Layout Gate (ความสวยงามและระบบภาพ)
- **ธีม**: Editorial Paper & Sage Ink (พื้นหลังกระดาษขาว `#fcfbf7`, หมึกเข้ม `#2c2825`, กรอบการ์ด `#ffffff`)
- **HyperFrames Catalog Integration**:
  - **HF-337 Onboarding Stepper Flow**: ติดตั้งใน `compositions/components/onboarding-stepper-flow.html` และผูกในส่วนหัวทุกฉาก แสดง 3 ขั้นตอน (`1 เริ่มห้องใหม่` → `2 สตรีมคำตอบ` → `3 ถามต่อในห้องเดิม`) พร้อม active/done state สลับตาม Beat
  - **HF-113 Code Highlight Sweep**: ติดตั้ง Source ใน `catalog-source/` และ `compositions/code-highlight.html` พร้อมจำลองการกวาดแถบไฮไลต์เน้น `"conversation_id": null` (b4) และ `"conversation_id": "conv_8892"` (b6)
  - **HF-195 Browser Device Stage**: กรอบอุปกรณ์มือถือครอบหน้าจอแชตจำลอง 1440×1800 px
- **Minimap 3 สี**:
  - ครั้งที่ 1: สีเขียว Forest Green (`#38815A`)
  - ครั้งที่ 2: สีทอง Ochre Gold (`#8d732c`)
  - ครั้งที่ 3: สีเขียวน้ำทะเล Deep Teal (`#1E7578`)
- **การจัดวางข้อความ**: ตัดบรรทัดซับไตเติลภาษาไทยเป็นธรรมชาติ ไม่มีสระลอย ไม่มีข้อความตกขอบจอ
- **ภาพจำลองอุปกรณ์**: ภาพ Raster Mockup ขนาด 1440×1800 px แสดงผลคมชัด พร้อมป้าย "ภาพจำลอง" ทุกภาพ

### 3) Storytelling Gate (โครงสร้างการเล่าเรื่อง)
- **9-Beat Standard**: ครบ 9 ช่วงตามพิมพ์เขียวมาตรฐาน (เตรียม → เชื่อม 3 ครั้ง → ใช้ผล → ผู้สนับสนุน)
- **Separation of Concerns**: แบ่งหน้าที่ชัดเจนระหว่าง แอปพลิเคชันผู้ใช้ (Client), เซิร์ฟเวอร์หลังบ้าน (Backend Server) และ LangMind Chat API
- **ความสมจริง**: อธิบาย Use Case การตอบบริการลูกค้าในชีวิตจริง (ถามหาสินค้า → ตอบสดแบบสตรีมมิ่ง → ถามต่อหาส่วนลดโดยจำบริบทเดิมได้)

### 4) Audio & Subtitle Gate (จังหวะและซับไตเติล)
- **Silent Timing**: คำนวณเวลาอ่านด้วยสูตร 11 ตัวอักษร/วินาที + ช่องไฟ 0.5s + ช่วงหยุด hold รวมความยาว 183.63 วินาที (จังหวะอ่านสบายตา เหมาะสำหรับศึกษาทำความเข้าใจ)
- **การจัดวางซับไตเติล**: จัดกึ่งกลางกรอบด้านล่าง บนการ์ดพื้นหลังสีกรมท่าเข้ม ขอบโค้งมน อ่านง่ายและสบายตา

### 5) API & Claims Gate (ความถูกต้องของข้อมูล)
- **Endpoint ตรงตาม `langmind-api.md`**:
  - `POST /api/chat/message` (SSE Stream)
  - `POST /api/chat/message/blocking` (JSON ก้อนเดียว)
  - `POST /api/chat/messages/{id}/stop`
  - `GET /api/chat/conversations/{id}/messages`
- **Security & Scopes**: ย้ำเรื่องเก็บ API Key บนเซิร์ฟเวอร์เท่านั้น, สิทธิ์ `chat:invoke` (และ `agents:read`), ใช้ Bearer Token สมมติ
- **พฤติกรรมบทสนทนา**: อธิบายกลไก `conversation_id: null` เพื่อเริ่มห้องใหม่ และส่งรหัสเดิมเพื่อคุยต่อเนื่องได้ถูกต้อง 100%

---

## 2. สิ่งที่สังเกตและข้อจำกัด (Observations & Known Limitations)

1. **โหมดปัจจุบัน**: เป็น **Silent Draft (ไม่มีเสียงพากย์)** เพื่อให้ผู้ใช้ตรวจทานเนื้อเรื่อง จังหวะอ่าน และภาพกราฟิกก่อน
2. **ขั้นตอนถัดไป**: เมื่อผู้ใช้ตรวจรับบทและภาพแล้ว สามารถรันเสียง Edge TTS (`th-TH-NiwatNeural` หรือ `th-TH-PremwadeeNeural`) หรืออัดเสียงจริง เพื่อทำ Multiplexing Mode และ Render ฉบับเสียงสมบูรณ์ได้ทันที

---

## 3. ผลการตรวจสอบ Layout & Zero Overflow Verification

| ส่วนประกอบ | ปัญหาเดิมที่พบ | การแก้ไขปรับปรุง | ผลการตรวจสอบ Bounding Box |
| :--- | :--- | :--- | :--- |
| **HF-337 Stepper** | วงกลมตัวเลขซ้อนกับข้อความ ("1 1", "2 2", "3 3") และข้อความตกขอบแคปซูลด้านขวา | แยกวงกลมตัวเลขไว้ชิดซ้าย (`x0 + 36`) และจัดข้อความภาษาไทยกึ่งกลางพื้นที่ส่วนที่เหลือ (`x0 + 56` ถึง `x1 - 10`) ลบตัวเลขซ้ำใน string | **ผ่าน 100%**: ปลอดภัยทุกกล่อง มีระยะ margin ด้านข้างเหลือมากกว่า 20px ทุกแคปซูล |
| **Beat 3 Warning Box** | ข้อความยาว 1 บรรทัดอาจชนขอบกรอบ | ตัดแบ่งเป็น 2 บรรทัดอ่านสบายตา | **ผ่าน 100%** (กว้าง 576px ในกรอบ 876px, เหลือ margin 150px) |
| **Beat 3 Card 3 Title** | ชนกับ Badge "ห้ามใส่ในเว็บ" ด้านขวา | ย่อชื่อเป็น `"3. เซิร์ฟเวอร์หลังบ้าน"` | **ผ่าน 100%** (ระยะห่างจาก Badge > 250px) |
| **Beat 5 Tip Box** | ข้อความอธิบาย JSON / SSE ยาวเกินกล่อง | ตัดแบ่งเป็น 2 บรรทัด | **ผ่าน 100%** (กว้าง 686px ในกรอบ 876px, เหลือ margin 95px) |
| **Beat 6 Result Box** | ข้อความผลลัพธ์บริบทแชตยาวเกินกล่อง | ตัดแบ่งเป็น 2 บรรทัด | **ผ่าน 100%** (กว้าง 524px ในกรอบ 876px, เหลือ margin 176px) |
| **Beat 7 Info Cards** | คำอธิบาย 4 บรรทัดตัวอักษรใหญ่เกินไป | ปรับขนาดฟอนต์คำอธิบายเป็น 24px | **ผ่าน 100%** (ความกว้างสูงสุด 776px ในกรอบ 836px, เหลือ margin 30-65px ทุกบรรทัด) |
| **ซับไตเติล b1-b9** | ซับไตเติล b7 บรรทัด Endpoint ยาวเกือบเต็ม | ย่อเส้นทาง Endpoint ใน `timing.json` | **ผ่าน 100%** (ความกว้างสูงสุด 761px ในกล่องซับ 936px, เหลือ margin ซ้ายขวา 87px) |

- **Verification Script**: `check_overflow_v2.py` ให้ผลลัพธ์:
  - `Result: ALL PASSED! Zero overflows.`
  - `Captions Result: ALL PASSED! Zero caption overflows.`
- **ไฟล์ผลลัพธ์**:
  - วิดีโอ: [ep03-v4.4-silent.mp4](file:///d:/ฝึกงาน 4 เดือน/LangMine-API-VDO/episodes/ep03/video-v4.4/renders/ep03-v4.4-silent.mp4) (SHA-256: `22feebf8d405d202e53c41874c25d588d67d33f995287d0c7c096fe425069121`)
  - ภาพสรุป 9 ฉาก: [qa-contact-sheet-v4.4.png](file:///d:/ฝึกงาน 4 เดือน/LangMine-API-VDO/episodes/ep03/video-v4.4/renders/qa-contact-sheet-v4.4.png)

---

## 4. ผลการปรับใช้ Motion Engine ตาม EP04 (video-v3-orus)

ได้ทำการปรับปรุงสถาปัตยกรรมโค้ดและการ Render ให้ตรงตามมาตรฐานของ [episodes/ep04-voice-api/video-v3-orus](file:///d:/ฝึกงาน 4 เดือน/LangMine-API-VDO/episodes/ep04-voice-api/video-v3-orus) ดังนี้:

1. **โครงสร้าง HTML & GSAP Timeline**:
   - ปรับใช้โครงสร้าง `#film` > `.kicker` + `.note` + `#stage.clip` > `.spine` + `.scene` พร้อม `.caption` แยกชั้นอย่างสมบูรณ์
   - ขับเคลื่อนด้วย `motion.js` ผูกเข้ากับ `window.FILM` และลงทะเบียน `window.__timelines['ep03-chat-v4.4'] = tl`
2. **ระบบการเคลื่อนไหว (Motion Declarations)**:
   - **การเข้าออกของ Element**: ใช้ `data-in`, `data-at`, `data-anim` (`up` เลื่อนขึ้นนุ่มนวล, `left` เลื่อนจากซ้าย, `pop` เด้งสไตล์ bounciness ด้วย `back.out(1.8)`, `fade` ค่อยๆ ปรากฏ)
   - **เส้นลูกศรวาดตัวเอง (Self-drawing SVG paths)**: เส้นลูกศร `varrow` วาดทิศทางด้วย `strokeDashoffset: 0`
   - **จุดส่งข้อมูลต่อเนื่อง (Data Flow Dots)**: วงกลมข้อมูล `.dot` เคลื่อนที่ตามเส้นลูกศรอย่างต่อเนื่องตลอดฉาก (`flow(dot, t0, t1)`) แสดงให้เห็นการส่งข้อมูลจากแอป -> หลังบ้าน -> LangMind
   - **แถบไฮไลต์โค้ด (Code Highlight Sweep)**: แถบสีไฮไลต์ `.mark[data-mark]` กวาดขยายด้วย `scaleX: 1` เน้น `"conversation_id": null` และ `"conversation_id": "conv_8892"`
   - **จังหวะชีพจร (Breathing Pulse)**: ใส่ฟังก์ชัน `pulse(sel, t0, t1, 1.05)` ให้การ์ด ตัวเลขขั้นตอน ไอคอน และตัวการ์ตูนมาสคอตขยับเบาๆ เป็นธรรมชาติ ไม่แข็งทื่อเหมือนสไลด์นิ่ง
   - **แถบนำทางด้านบน (Progress Spine)**: ควบคุมการเปลี่ยนสถานะ 3 ขั้นตอน (`#sp1` เตรียม, `#sp2` เชื่อม, `#sp3` ใช้ผล) สลับสีสถานะ Active (เขียว/ทอง/น้ำทะเล) และ Done อัตโนมัติ
3. **การ Render ด้วย Native HyperFrames CLI**:
   - คอมไพล์และเรนเดอร์ด้วย `hyperframes render --quality delivery` โดยใช้ Chrome Headless GPU Pipeline 6 เธรดขนาน
   - บันทึกทุกการเคลื่อนไหว ความโค้ง Easing และความละเอียด 1080×1920 30fps H.264 ตรงตามที่แสดงผลในเบราว์เซอร์ 100%

---

## 5. ผลการแก้ไขเลย์เอาต์ตามภาพที่ผู้ใช้แจ้ง (Frame Snug-fit & Sponsor Chip)

1. **ภาพแรก (ปรับกรอบอุปกรณ์และกล่องแชตให้กระชับพอดีกับข้อความ)**:
   - **ปัญหาเดิม**: กล่องแชตมีพื้นที่ว่างสีขาวขนาดใหญ่คั่นระหว่างข้อความกับช่องพิมพ์ (Input bar) และกรอบอุปกรณ์ `.device` ยืดตัวยาวลงไปด้านล่างจนเกือบชนแถบซับไตเติล ทำให้เห็นพื้นหลังว่างเปล่าขนาดใหญ่
   - **การแก้ไข**:
     - ปรับฟังก์ชันใน `build_screens.py`: จัดวางช่องพิมพ์ (Input bar) ชิดใต้ข้อความแชตล่าสุดอย่างเป็นธรรมชาติ (ระยะห่าง 40px) และครอบกรอบสีขาวด้านในให้พอดี
     - ปรับโครงสร้าง CSS & Flexbox: กำหนด `.device { height: fit-content; align-self: flex-start; }` และเปลี่ยนคอนเทนเนอร์ใน Beat 5/6 เป็น `.chat-row` เพื่อไม่ให้เกิดการ stretch ตามความสูงหน้าจอ 1920px
     - ผลลัพธ์: กรอบอุปกรณ์และหน้าจอแชตกระชับพอดีกับข้อความ สวยงามสมดุลทั้งใน Beat 1, 5 และ 6
2. **ภาพที่สอง (ฉากผู้สนับสนุนท้ายคลิป Beat 9)**:
   - **ปัญหาเดิม**: มีชิปแสดง 3 ตัวคือ `Agent`, `Chat API`, `Voice API`
   - **การแก้ไข**: ตัดชิป `Agent` และ `Voice API` ออก ให้เหลือเฉพาะ `<span class="chip">Chat API</span>` ขนาดเด่นชัดตรงตามบริบทของตอนนี้ 100%




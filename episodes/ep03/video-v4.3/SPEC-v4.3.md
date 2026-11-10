# EP03 v4.3 — Production spec

- **GOAL:** คนดูเห็นว่า Chat API ส่งข้อความไปยัง Agent, ส่งคำตอบกลับเป็น event stream และใช้ `conversation_id` เพื่อถามต่อได้
- **OUTPUT:** Editable HyperFrames project plus H.264 Silent Draft, 1080×1920, 30 fps. MP4 rendered with Pillow + FFmpeg fallback because native HyperFrames snapshot/render could not access localhost in the sandbox.
- **TIME:** คำนวณจาก `timing.json`: ความยาวบท ÷ 11 ตัวอักษร/วินาที + 0.35 วินาทีต่อ beat + hold ที่ระบุ
- **LOOK:** พื้นสีเขียวเทาอ่อน `#F1F6F4`; หมึก `#183431`; accent `#087F68`; สีรอง `#D5E8DF`; เส้น `#A9C2B9`. พื้นเรียบ ไม่มี gradient หรือ texture. ใช้ Sarabun Regular/Bold ในไฟล์ local; heading 64–72 px, body 38–44 px, route/code 30–36 px, subtitle 34 px
- **MEDIUM:** ภาพแชตจำลองเป็น raster 1440×1800 และมีคำว่า “ภาพจำลอง” อยู่ในภาพ; ฉากอธิบายบทบาทใช้เส้นและข้อความตรง ๆ; editable scene ใช้ source HF-113 Code Highlight ที่มีใน workspace แล้วปรับสีและขนาด. Fallback MP4 วาด highlight ด้วย Pillow ไม่ได้ render Catalog source จริง
- **OBJECTS:** หน้าจอแชตสองสถานะที่คง header, geometry, สีและข้อความเดิม; ทางเชื่อม app → server → Chat API → Agent; API request; SSE events; `conversation_id`; โลโก้จริงและ robot shared pose ในตำแหน่งที่ช่วยเล่า
- **MOTION:** หนึ่ง hero move ต่อ shot. ฉากใช้ hard cut. เส้นทางข้อมูลวาดตามลำดับ; code highlight กวาดหนึ่งบรรทัดใน 0.9 วินาที; SSE names เปิดทีละ event; ช่วงอ่าน route map หยุดนิ่ง. ไม่ทำให้ข้อความเคลื่อนระหว่างอ่าน
- **SAFE AREA:** ข้อความและ demo อยู่ระหว่าง y=168–1330; subtitle อยู่ช่วง y=1140–1300; ไม่มีข้อความสำคัญใต้ y=1330
- **BANNED:** glow, gradient, particles, neon, dark void, serif display, decorative mono labels, pill chips, three cards in a row, tiny route text, every element fading/sliding up, repeated floating motion, screenshot ที่ไม่มีหน้าที่, logo เล็กติดมุม, fake citation/ID/usage/cost/latency
- **QA:** ตรวจเฟรมแรก, ทุก beat midpoint, code highlight, event order, route map, end card; ตรวจภาพเต็มและ crop มือถือ; ตรวจข้อความ/การสะกดด้วยสายตา; lint 0/0, MP4 probe และ decode ผ่าน. Native `check`/`snapshot` ยังไม่ผ่านเพราะ sandbox ปฏิเสธการเข้าถึง `127.0.0.1`

## เงื่อนไขข้อเท็จจริง

ทุกข้อมูล API อ้างจาก `langmind-api.md`. บทสนทนา, `agent_id` placeholder และคำตอบเป็นตัวอย่างประกอบ; ไม่ใช่ผลเรียกจริง. ไม่มี token จริง, citation, ID, usage number หรือผลทดสอบสดในภาพ.

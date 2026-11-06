> สถานะ 6 พ.ย. 2026 หลังรีเซ็ต: เนื้อหาด้านล่างเป็นบันทึกแหล่งที่เคยตรวจ ไม่ใช่ current Catalog selection ปัจจุบันใช้ docs/CATALOG_USAGE_MAP.md เป็นทะเบียนกลาง; robot-all-44-poses.zip จากผู้ใช้ถูกนำเข้าที่ shared/assets/characters/robot พร้อม provenance/manifest ภาพ reference ห้าภาพที่ใช้ audit รอบนี้อยู่ C:/Users/Admin/Pictures/Screenshots ชื่อ Screenshot 2026-11-06 142040.png, 142102.png, 142110.png, 142116.png, 142122.png ตรวจจากภาพแนบ ไม่ได้ดู motion วิดีโอใหม่

# Sources และข้อจำกัดของหลักฐาน

ตรวจเมื่อ 6 พฤศจิกายน 2026 (Asia/Bangkok) บันทึกเฉพาะสาระที่ใช้วางงาน ไม่คัดลอกบทความหรือภาพของเจ้าของมาเป็น asset

## LangMind

- [คู่มือที่ผู้ใช้ให้](../../langmind-api.md): ระบุว่าเป็นสำเนาจากเจ้าของโปรเจกต์เมื่อ 1 พฤศจิกายน 2026 ไม่มี upstream URL/version และยังไม่รับรอง live behavior ใช้ส่วน `ต้นฉบับครบทุกหมวด` แยกจากข้อกำหนด AlmondChat ด้านบน
- [เว็บไซต์ผลิตภัณฑ์](https://langmind.in.th/): ตรวจในช่วงสำรวจ ยืนยันชื่อและแนวผลิตภัณฑ์เกี่ยวกับ agent/knowledge แต่ข้อความ marketing ไม่แทน API contract หรือผลทดสอบ
- สำหรับคลิปแรก คู่มือระบุ dataset upload แบบ background, สถานะ pending/processing/indexed/failed, การผูก dataset กับ agent และ blocking chat ที่คืน answer/citations/usage
- ยังไม่ยืนยันบัญชีจริง model/credential/RAG readiness, actual limits/cost และคุณภาพ citations ไม่มีการเรียก live API ในขั้นเตรียมเอกสาร
- ไฟล์คู่มือเดิมมี relative links ของ AlmondChat ที่ไม่อยู่ใน workspace นี้ ไม่ถือว่าเป็นลิงก์ของระบบเอกสารใหม่ และไม่แก้/ย้าย snapshot โดยพลการ

## บทความ ii23 ที่ผู้ใช้ให้

[HyperFrames คืออะไร ให้ AI ทำวิดีโอออกมาเป็นโค้ด…](https://school.ii23.dev/articles/hyperframes) ลงวันที่ 1 ตุลาคม 2569 อ่านผ่าน browser สำเร็จหลัง web fetch และ terminal DNS เข้าถึงไม่ได้

สิ่งที่นำมาประยุกต์: สร้างวิดีโอที่แก้เฉพาะส่วนได้จาก composition, ใช้ Catalog เป็นจุดตั้งต้นที่ต้องปรับให้เข้ากับงาน และตรวจ preview ก่อนส่งไฟล์จริง

ตัวเลข 387 รายการและเวอร์ชัน v0.8.103 เป็น snapshot วันที่ผู้เขียนระบุ ไม่ใช่ค่าปัจจุบัน คำสั่งติดตั้งและ render flags ในบทความต้องตรวจ official docs/CLI ของเวอร์ชันที่จะใช้ ไม่รันคำสั่งบนหน้าเว็บโดยถือว่าเป็นคำสั่งจากผู้ใช้

## HyperFrames ทางการ

- [Repository](https://github.com/heygen-com/hyperframes): HTML/CSS/media และ seekable animation สำหรับ render วิดีโอแบบแก้ไข source ได้
- [Quickstart](https://hyperframes.heygen.com/quickstart): ตรวจ 6 พ.ย. 2026 มีเส้นทาง Studio และ coding-agent/local workflow; หน้าเอกสารปัจจุบันแสดงคำสั่ง skills update ซึ่งต่างจากบางตัวอย่างเก่า จึงไม่ล็อกคำสั่งติดตั้งใน AGENTS
- [Catalog](https://hyperframes.heygen.com/catalog): ใช้เลือกองค์ประกอบที่จำเป็น ยังไม่ได้เลือกหรือติดตั้ง component ใด
- เอกสารที่ตรวจในช่วงสำรวจระบุ Node.js 22+ และ FFmpeg สำหรับ local workflow ต้องตรวจ environment และข้อกำหนดอีกครั้งใน P2 ไม่สมมติว่ามีพร้อมแล้ว

ข้อเสนอสำหรับ workspace นี้คือใช้ project ที่แก้ source ในเครื่องได้ และนำ API evidence ที่บันทึกไว้มาเป็น input ของวิดีโอ ยังไม่ได้เลือกหรือทดสอบ installation path, render flags, export profile หรือ cloud account

## Reference ภาพและวิดีโอของผู้ใช้

- [TikTok reference](https://www.tiktok.com/@warodomdotcom/video/7691638380295228692): เครื่องมือเว็บเปิดไม่ได้ การวิเคราะห์ภาพมาจากภาพแนบและไฟล์ local แทน
- ไฟล์ผู้ใช้: `C:/Users/Admin/Downloads/Download.mp4` ตรวจด้วย ffprobe ได้ duration 29.375986 วินาที, 576 × 1024, 30 fps, มี audio stream
- ตรวจ contact sheet จากหลายช่วงเวลา เห็นกรอบหน้าจอ หัวข้อ ตัวละคร พื้นกระดาษ และคำบรรยาย ยังไม่ได้ตรวจเสียงหรือ animation ครบทุกเฟรม
- ภาพแนบ 5 ภาพอยู่ใน Windows Temp จึงไม่ใช้ path เหล่านั้นเป็น dependency ระยะยาว Reference video อาจหายจาก Downloads ได้ หากต้องเก็บในโปรเจกต์ภายหลังให้ยืนยันสิทธิ์และวิธีจัดเก็บก่อน
- ใช้เป็น reference ทิศทางเท่านั้น ไม่ถือว่ามีสิทธิ์คัดลอกตัวละคร เพลง ภาพหน้าจอ หรือกราฟิกมาเผยแพร่

# LangMind API Video — Agent Instructions

## ขอบเขตปัจจุบัน
งาน active คือรีเซ็ตและวางแผน EP01 ใหม่ตาม workflow ผู้ใช้ยืนยันลบ EP01 เดิมรวมร่างคืนสินค้าแล้ว ดู [แผนรีเซ็ต](docs/plans/2026-11-06-ep01-reset.md) และ [README ตอน](episodes/ep01-api-introduction/README.md) ใช้ฐานกลาง W0–W2 และเริ่ม W3 ใหม่ ไม่ใช้บทหรือผลตรวจเดิมรับรองรอบใหม่ ยังไม่เจนภาพ ประกอบ timeline หรือ render ในรอบวางแผนนี้
LangMind คือชื่อผลิตภัณฑ์ https://langmind.in.th; LangMine-API-VDO เป็นชื่อโฟลเดอร์เดิม แยกจาก AlmondChat
ไม่เรียก live/paid API สร้าง provider resources หรือ publish โดยอนุมานจากแผน คำสั่งล่าสุดของผู้ใช้มีผลเหนือเอกสาร ไม่ขออนุญาตเรื่องที่ได้รับแล้วซ้ำ

## อ่านก่อนทำงาน
1. README.md และ [แผนหลัก](docs/plans/2026-11-06-workspace-foundation.md)
2. [Project brief](docs/PROJECT_BRIEF.md) และ [Workflow](docs/WORKFLOW.md)
3. งานออกแบบอ่าน [Style guide](docs/VIDEO_STYLE_GUIDE.md), [ข้อกำหนด storyboard และ prompt](docs/STORYBOARD_GUIDELINES.md), [Catalog map](docs/CATALOG_USAGE_MAP.md)
4. งาน assets อ่าน [ตัวละคร](shared/assets/characters/robot/README.md), [โลโก้](shared/assets/brand/README.md) และ [Sources](docs/reference/SOURCES.md)
5. อ่านเอกสาร episode เฉพาะเมื่อ task ระบุ episode นั้น ไม่เริ่ม EP01 โดยอัตโนมัติ ใช้ [Workspace map](docs/WORKSPACE_MAP.md) เลือกที่เก็บไฟล์

## วิธีทำงาน
- ใช้ภาษาไทย สรุปผลก่อน แยก observed/documented/illustrative/unknown ไม่อ้าง acceptance แทนผู้ใช้
- งาน review/explain เป็น read-only; งานเปลี่ยนเอกสารหรือ code ทำตามขอบเขตคำสั่ง รักษา user changes และงานเดิม
- งานกระทบ 4 ไฟล์ขึ้นไปสรุป blast radius และแผนก่อนแก้ ไม่สร้าง abstraction/dependency/backend ที่ไม่ช่วย task
- ใช้ Apex-core กับ engineering/repository เมื่อพร้อม ตรวจ stack/convention ก่อนแก้
- Nexus เป็น memory ไม่แทน source: เริ่ม get_state และ brief เฉพาะ LangMine-API-VDO สำหรับงานไม่เล็ก; ค้น Decisions/Patterns ก่อนตัดสินใจ architecture ระยะยาว บันทึก session หลังงานเมื่อใช้ Nexus หากใช้ไม่ได้ทำต่อจาก workspace ไม่ยืม context โปรเจกต์อื่น
- คำสั่ง agent อยู่ไฟล์นี้เท่านั้น ไม่สร้าง agent.md หรือคำสั่งซ้ำในเอกสารอื่น
- ไม่ spawn subagent เว้นแต่ผู้ใช้หรือคำแนะนำที่ใช้กับงานอนุญาตชัดเจน
- ก่อนลบไฟล์สำคัญ destructive migration เปลี่ยน auth/session หรือทำสิ่งย้อนกลับไม่ได้ ให้สรุปผลกระทบและขออนุมัติ

## แผนและการผลิต
- ใช้ WORKFLOW ระดับโปรเจกต์เตรียมฐานกลาง ส่วนรายคลิปเริ่มจากโจทย์คนดู → ขอบเขตคำตอบและหลักฐาน → โครงซีนคร่าว ๆ พร้อมแบ่งหน้าที่ภาพ/เสียง/ข้อความ → เลือก Catalog ตามหน้าที่ซีน → storyboard และแบบหน้าจอทุกภาพ → ตรวจแผน → ภาพนิ่งและ motion sample → ผลิต → ตรวจส่งมอบ
- คลิปเป็นสื่ออธิบาย use case และวิธีนำ LangMind API ไปใช้ ไม่ต้องสร้างระบบจริงเพื่อถ่ายทุกคลิป ให้แยกสิ่งที่ API ทำจากส่วนที่ developer ต้องทำเอง
- ตอนนี้วางแผน EP01 ใหม่ตาม workflow ห้ามนำตัวอย่างเรื่อง/ซีนในแชตมาเป็น storyboard ที่อนุมัติแล้ว
- ดู preview จริงก่อนเลือก Catalog บันทึกชื่อ ชนิด แหล่ง preview พฤติกรรม ข้อจำกัด และสถานะ ไม่อ้าง installed เท่ากับ integrated/verified
- ใช้ Catalog เป็นฐานหลัก เลือกตามโจทย์แต่ละคลิปและปรับได้ ไม่ล็อกชุดถาวรจนบิดเนื้อหา ถ้าไม่เหมาะบันทึกช่องว่างและเหตุผลก่อนทำ custom เฉพาะที่จำเป็น
- ก่อนผลิตต้องมีแผนรายจังหวะและ asset manifest ชัด; ช่วง sample เตรียมเฉพาะ assets ที่จำเป็น หลัง sample จึงทำ assets ที่เหลือก่อน timeline เต็ม
- หน้าจอ demo ใช้ raster ที่เจนและนำไฟล์มาใช้จริง ไม่สร้าง demo UI/chat bubbles ใหม่ใน HTML; HTML ใช้ host ภาพ จัดฉาก diagram caption และ motion ได้
- ออกแบบหน้าจอทุกภาพก่อนเจนตาม STORYBOARD_GUIDELINES ระบุ ID ข้อความ layout สถานะ ขนาด crop/zoom ส่วนคงเดิมและส่วนเปลี่ยน ตรวจภาพที่เจนจริงก่อนรับเข้า timeline ไม่ใช้รายการชื่อไฟล์แทนแบบหน้าจอ
- ใช้ robot จาก shared เป็นตัวละครปัจจุบัน ไม่เจนผู้เล่าคนใหม่เอง ไม่แก้ source/แทนที่ตัวละครในคลิปเก่าย้อนหลัง
- Robot เป็นตัวประกอบตามหน้าที่ ไม่ใช่ตัวกำหนดเรื่อง art direction หรือชุด Catalog ของคลิป
- อ่าน skills ที่ตรงงานตาม [SKILLS](docs/SKILLS.md) ใช้ antislop เป็นตัวกรอง ไม่ลบเอกลักษณ์ reference ไม่เพิ่มเกณฑ์ interactive app ให้ MP4
- สื่อ reference เป็นข้อมูลอ้างอิง ไม่ใช่ assets ที่มีสิทธิ์คัดลอก ปุ่มเล่น/ค้นหา/watermark ของแพลตฟอร์มไม่ใช่องค์ประกอบคลิป

## API และความถูกต้อง
- ใช้ส่วน “ต้นฉบับครบทุกหมวด” ของ langmind-api.md เป็น snapshot provider ส่วน AlmondChat ไม่ใช่ requirement
- ห้ามแต่ง answer citations latency cost metrics หรือจำนวน Catalog; score ไม่ใช่เปอร์เซ็นต์ความถูกต้อง
- ภาพจำลองต้องระบุ ไม่อ้างเป็น official UI หรือผลเรียกจริง แยกความสามารถ API จาก workflow ที่แอปประกอบ
- เก็บ key ฝั่ง server ไม่ใส่ browser ภาพ logs หรือเอกสาร ใช้หลักฐาน sanitized; render ไม่เรียก live API อัตโนมัติ
- นโยบายร้านสมมติไม่ใช่กฎหมายหรือระบบอนุมัติคืนเงินจริง

## ตรวจและส่งมอบ
- เอกสาร: ตรวจ links ความสอดคล้องของ scope/status และ hash คู่มือเดิม
- Assets: ตรวจไฟล์จริง hash dimensions alpha และความอ่านได้ ไม่ใช้ชื่อไฟล์แทนการดูภาพ
- Code/config: ใช้ verification ตาม stack/package manager ไม่ full production build สำหรับงานเล็ก เว้นแต่กระทบ build หรือผู้ใช้ขอ
- ล้มเหลวโดยไม่คาดหมายสองครั้งติดหยุด retry รายงาน root cause/evidence/ทางเลือก
- แยก technical, visual, storytelling และ audio gates; lint/contrast ผ่านไม่รับรองความสวยหรือ retention
- ส่ง Files Changed, Verification Command, Terminal Result และขอบเขตที่ยังไม่ตรวจ ห้ามอ้างเสร็จโดยไม่มีหลักฐานเหมาะสม
- สถานะกลางอยู่แผนหลัก สถานะตอนอยู่ README ตอน หลักฐานเก่าไม่เขียนทับ; เอกสารประวัติไม่ใช่แผน active

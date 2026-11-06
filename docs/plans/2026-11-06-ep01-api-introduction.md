> Historical / งานพักไว้ — 6 พ.ย. 2026: เอกสารนี้เก็บแผนหรือหลักฐาน ณ รุ่นเดิม ไม่ใช่คำสั่งผลิตหรือ storyboard ที่อนุมัติสำหรับรอบใหม่ งานปัจจุบันคือรีเซ็ตระบบระดับโปรเจกต์ตาม README.md และแผนหลัก เก็บเนื้อหาเดิมไว้เทียบ ไม่ใช้สถานะ PASS หรือ Next action ด้านล่างรับรองงานใหม่

# EP01 API introduction: design and prototype plan

ผู้ใช้เปลี่ยนคลิปแรกจากสาธิตคืนสินค้าเป็นแนะนำ API: อธิบาย API คืออะไร LangMind มี API อะไรและเอาไปใช้ทำอะไร พร้อมขอ storyboard, หน้าจอ, ส่วนประกอบ และตัวอย่างที่ดูได้ อนุญาตให้สร้าง local prototype และ preview แล้ว ไม่รวม paid APIs, live LangMind requests หรือเผยแพร่

Blast radius: เพิ่ม episodes/ep01-api-introduction สำหรับบท/สตอรี่บอร์ดและ HyperFrames project; อัปเดตสารบัญ, brief, AGENTS และเก็บร่างคืนสินค้าเดิมเป็นไอเดีย ไม่ลบหรือเปลี่ยนเป็น EP02 โดยอัตโนมัติ

1. ตรวจ provider snapshot และ skills; เลือกเรื่องผ่านตัวอย่างคำถามหนึ่งข้อ
2. เขียน storyboard/script/spec พร้อม claim sources; ตัวละคร vector ต้นฉบับและหน้าจอจำลองที่ติดป้าย ไม่ใช้ screenshot ปลอมเป็นระบบจริง
3. สร้าง HyperFrames composition 9:16 แยกฉาก ใช้ local GSAP/font/logo ไม่มี network fetch ตอน render
4. Lint/check/snapshot ดูทุกฉากและความอ่านง่ายบนมือถือ เปิด preview และสร้าง draft หากผ่าน
5. สรุปสิ่งที่ตรวจแล้ว ข้อจำกัด เสียงที่ยังไม่ผลิต และ next action ใน README ของตอน

ผู้ใช้เลือกเสียงผู้ชายภาษาไทยโทนคุยเข้าใจง่ายสำหรับฉบับถัดไป ตอนนี้ทำบทและ visual animatic ไม่ใช้เสียงเสียเงินหรือ clone เสียงใคร

Nexus get_state สำเร็จ แต่ project brief ยังคืน validation error ใช้ workspace เป็นหลัก ไม่ใช้ context โปรเจกต์อื่น

## ผลส่งมอบ

สร้าง storyboard/script 11 ฉาก, SPEC, STORYLINES, local Thai font/GSAP/logo, original SVG presenter และ composition แยกฉากครบ เปิด preview และทดสอบ Play/Pause แล้ว

Verification: lint 12 files/0 errors/0 warnings; check ok true, runtime/layout/contrast errors 0, contrast 59 checks ผ่าน มี craft warnings เฉพาะ silent animatic และ hold ช่วงอ่าน; render exit 0 ได้ H.264 1080×1920/15 fps 114 วินาที ไม่มี audio ตรวจ decoded frame sheet แล้ว รายละเอียดอยู่ REVIEW ของตอน

เสียงผู้ชายไทย บทซับตรงเสียง และท่าตัวละครเพิ่มเติมเป็นขั้นถัดไปหลัง review draft ไม่เรียก live/paid API และไม่ publish

Nexus save_session พยายามแล้วแต่คืน `projectId must contain letters or numbers.` เช่นเดิม จึงยังบันทึก memory ไม่สำเร็จ ใช้เอกสารใน workspace เป็น handoff หลัก

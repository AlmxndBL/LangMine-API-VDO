# EPXX — Quality Review & Evidence Ledger

Episode ID: `epXX-<slug>`  
ไฟล์วิดีโอที่ตรวจ: `epXX-<slug>-silent.mp4` หรือ `epXX-<slug>-full.mp4`  
วันที่ตรวจสอบ: [YYYY-MM-DD]

---

## 1. Technical Audit (ผ่าน 100%)

* [ ] **HyperFrames Check**: รัน `npx hyperframes check` ได้ 0 errors, 0 warnings
* [ ] **Local Asset Resolution**: ไฟล์ฟอนต์ (`Sarabun-Regular.ttf`, `Sarabun-Bold.ttf`), ภาพจำลอง, โลโก้, และ Robot โหลดได้ครบถ้วน
* [ ] **Video Decode & Integrity**:
  * ความละเอียด: `1080 × 1920` px
  * อัตราเฟรม: `30 fps`
  * ความยาว: ... วินาที (... เฟรม)
  * ขนาดไฟล์: ... MB
  * การ Seek บาร์เวลา: เดินหน้า-ถอยหลังได้ลื่นไหล ไม่กระตุกหรือค้างเฟรม

---

## 2. Visual & Layout Audit (ผ่าน 100%)

* [ ] **Editorial Theme**: โทนสีและพื้นหลังเป็น Editorial Paper & Sage Ink (`#fcfbf7`) สบายตา
* [ ] **Typography**: ตัวอักษรไทยคมชัด สระไม่ลอย วรรณยุกต์ไม่ซ้อน ตัดบรรทัดซับไตเติลตามจังหวะอ่านธรรมชาติ
* [ ] **Minimap Sync**: แถบ Minimap ด้านบนแสดงสีถูกต้อง (เขียว = ครั้งที่ 1, ทอง = ครั้งที่ 2, เขียวน้ำทะเล = ครั้งที่ 3)
* [ ] **Mobile Mockup**: ภาพ Mockup แสดงผลคมชัด ไม่แตก และมีป้าย "ภาพจำลอง" กำกับทุกภาพ
* [ ] **Safe Area**: องค์ประกอบสำคัญไม่อยู่ชิดขอบจอเกินไป เว้นระยะปลอดภัยอย่างน้อย 80px จากขอบข้าง

---

## 3. Storytelling & Narrative Audit (ผ่าน 100%)

* [ ] **9-Beat Structure**: มีครบทั้ง 9 ช่วงตามโครงเรื่องมาตรฐาน
* [ ] **Audience-First**: เริ่มต้นจากปัญหาจริงของผู้ใช้ และตั้ง 3 คำถามหลัก (`เตรียมอะไร?`, `เชื่อมตรงไหน?`, `ใช้ผลยังไง?`)
* [ ] **Separation of Concerns**: แยกบทบาทชัดเจนว่า LangMind API ทำอะไร และระบบของ Developer ต้องทำอะไร
* [ ] **Sponsor End Card**: มีฉากปิดท้ายผู้สนับสนุน LangMind พร้อมระบุเว็บไซต์ `langmind.in.th` ชัดเจน

---

## 4. Audio & Timing Audit (ผ่าน 100%)

* [ ] **กรณี Silent Draft**:
  * เวลาอ่านประโยคคำนวณตามสูตร 11 ตัวอักษร/วินาที + ช่องว่าง 0.35 วินาที
  * มีช่วง Hold สำหรับโค้ดและผลลัพธ์ใน Beat 4, 5, 6 อย่างน้อย 2-3 วินาที
* [ ] **กรณี Full Render (มีเสียง)**:
  * เสียงพากย์ไม่ทับซ้อนกัน และตรงกับซับไตเติลคำต่อคำ
  * เว้นวรรคหายใจและการออกเสียงศัพท์เฉพาะถูกต้อง (เช่น `Bearer`, `JSON`, `API`)

---

## 5. API Accuracy & Security Audit (ผ่าน 100%)

* [ ] Endpoint, Method, Header, และ Scopes ตรงกับคู่มือ `langmind-api.md` 100%
* [ ] ไม่มี Secret หรือ API Token จริงปรากฏในโค้ดหรือวิดีโอ (ใช้ Bearer Token จำลอง เช่น `lmpat_••••••••`)
* [ ] ผลลัพธ์สมมติถูกระบุว่าเป็นภาพจำลองอย่างชัดเจน

# ทะเบียนสินทรัพย์ (Asset Ledger) — EP03 W5 Sample

Episode ID: `ep03-streaming-chat`  
วันที่บันทึก: 7 พฤศจิกายน 2026  
สถานะ: สินทรัพย์ตัวแทนสำหรับ W5 Sample ผ่านการตรวจรับความอ่านได้และความต่อเนื่องแล้ว  
อ้างอิง: [STORYBOARD.md](../STORYBOARD.md), [CATALOG.md](../CATALOG.md)

---

## 1. รายการสินทรัพย์ภาพ (Visual Assets)

| ชื่อไฟล์ | ชนิดและขนาด | SHA-256 (16 ตัวแรก) | แหล่งที่มา / วิธีสร้าง | การใช้งานใน EP03 |
|---|---|---|---|---|
| `scr-01-chat-loading.png` | PNG 1080×1920 (9:16) RGBA | `38FDEB49A700A9A9` | สร้างด้วย Pillow อิงสเปก `SCR-01` ใช้ฟอนต์ Sarabun | หน้าจอแชทจำลองสถานะ Waiting/Loading (ซีน 1 และ 2) |
| `scr-02-chat-streaming.png` | PNG 1080×1920 (9:16) RGBA | `6A54A039FEC7D224` | สร้างด้วย Pillow อิงสเปก `SCR-02` คงตำแหน่ง 100% กับ `SCR-01` | หน้าจอแชทจำลองสถานะ Streaming SSE กำลังพิมพ์ (ซีน 2 และ 4) |
| `01-question.png` | PNG 445×436 RGBA | `C7D8BBE30CBC7ECB` | สำเนาจาก `shared/assets/characters/robot/` | หุ่นยนต์ท่าสงสัยในซีนที่ 1 |
| `05-point-up.png` | PNG 445×436 RGBA | `6596F6B0A6FD7A57` | สำเนาจาก `shared/assets/characters/robot/` | หุ่นยนต์ท่าชี้นำสายตาในซีนที่ 2 |
| `langmind-logo.png` | PNG 689×606 RGBA | `025DBB6064076AC7` | สำเนาจาก `shared/assets/brand/` | โลโก้แบรนด์ LangMind สำหรับซีน Outro |

---

## 2. ฟอนต์ที่ใช้ในโปรเจกต์ (Typography)

| ชื่อฟอนต์ | ชนิดไฟล์ | สิทธิ์การใช้งาน | หน้าที่ในวิดีโอ |
|---|---|---|---|
| `Sarabun-Regular.ttf` | TrueType Font | SIL Open Font License (OFL) | ข้อความซับไตเติลกลางจอ และข้อความทั่วไปใน Mockup UI |
| `Sarabun-Bold.ttf` | TrueType Font | SIL Open Font License (OFL) | หัวข้อ หัวแอป ป้ายคำเน้น (Emphasis Badges) และตัวเลขเวลา |
| `NotoSansThai.ttf` | TrueType Font | SIL Open Font License (OFL) | ฟอนต์สำรองสำหรับการแสดงผลภาษาไทย |

---

## 3. หลักฐานการตรวจขนาดบนจอมือถือ (Mobile Inspection)
- ไฟล์ภาพตรวจ: [mobile-frames.jpg](mobile-frames.jpg) (ขนาด 1140×1080)
- วัตถุประสงค์: ตรวจสอบความอ่านออกของข้อความภาษาไทยเมื่อย่อลงมาที่ความสูง 960px (ขนาดจำลองสมาร์ตโฟน)
- ผลการตรวจ:
  1. หัวเรื่อง "ผู้ช่วย AI ร้านค้า" และสถานะอ่านได้ชัดเจน
  2. ฟองคำพูดคำถามของผู้ใช้อ่านออกได้ทันที ไม่ต้องเพ่งสายตา
  3. ป้ายกำกับภาพจำลองมุมล่างมี Contrast ชัดเจน ไม่กลืนกับพื้นหลัง
  4. Geometry และขนาดฟองคำพูดระหว่าง `SCR-01` และ `SCR-02` ตรงกันแบบ Pixel-perfect continuity

# EP03 v4.4 — Asset Manifest & Inspection Report

รายการ Assets ทั้งหมดที่ใช้ใน EP03 v4.4 ตามมาตรฐานความปลอดภัยและการออกแบบ

---

## 1. ฟอนต์ (Local Typography)

| ไฟล์ | ขนาด | น้ำหนัก | บทบาท |
|---|---|---|---|
| `assets/fonts/Sarabun-Regular.ttf` | 400 | ปกติ | คำบรรยาย, โค้ดประกอบ, ซับไตเติล |
| `assets/fonts/Sarabun-Bold.ttf` | 700 | หนา | หัวข้อหลัก, ป้ายตัวเลข, สเต็ป 1-2-3 |

---

## 2. ตัวละคร Mascot & แบรนด์ (Official Shared Assets)

| ไฟล์ | แหล่งที่มา | ขนาดเดิม | บทบาทในคลิป |
|---|---|---|---|
| `assets/01-question.png` | `shared/assets/characters/robot/` | 445 × 503 px (RGBA) | ยืนสงสัยมุมจอใน Beat b1 |
| `assets/20-laptop.png` | `shared/assets/characters/robot/` | 445 × 503 px (RGBA) | นั่งพิมพ์โค้ดใน Beat b4 (ยิงคำขอแรก) |
| `assets/10-thumbs-up.png` | `shared/assets/characters/robot/` | 445 × 503 px (RGBA) | ชูนิ้วโป้งยินดีใน Beat b6 (ถามต่อสำเร็จ) และ b8 (สรุป) |
| `assets/langmind-logo.png` | `shared/assets/brand/` | 689 × 606 px (RGBA) | โลโก้แบรนด์ในสถาปัตยกรรม b2 และ Outro b9 |

---

## 3. ภาพจำลองหน้าจอแอป (Raster Mockup Screens)

ภาพจำลองความละเอียดสูงสร้างจาก `build_screens.py` ขนาด `1440 × 1800` px ทุกภาพมีป้าย "ภาพจำลอง" กำกับชัดเจน:

| ไฟล์ | ความละเอียด | คำอธิบายและเนื้อหาที่แสดง |
|---|---|---|
| `assets/app-chat-1.jpg` | 1440 × 1800 px | หน้าจอแชตลูกค้าถาม `"สินค้าชิ้นนี้มีของพร้อมส่งไหมครับ?"` (สถานะคำถามแรก) |
| `assets/app-chat-2.jpg` | 1440 × 1800 px | หน้าจอแชตแสดง AI ตอบสด `"มีสินค้าพร้อมส่ง 5 รายการค่ะ..."` (ป้าย: กำลังสตรีมคำตอบ) |
| `assets/app-chat-3.jpg` | 1440 × 1800 px | หน้าจอแชตลูกค้าถามต่อ `"ถ้าสั่ง 2 ชิ้น มีส่วนลดไหมครับ?"` และ AI คำนวณส่วนลดให้ทันที (ป้าย: จำบริบทเดิมได้) |

---

## 4. Vendor Libraries

| ไฟล์ | แหล่งที่มา | บทบาท |
|---|---|---|
| `assets/gsap.min.js` | GSAP 3.x Standalone | ใช้ขับเคลื่อน Timeline Motion ใน `index.html` แบบ Offline |

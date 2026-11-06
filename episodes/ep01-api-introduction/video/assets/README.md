> Historical / งานพักไว้ — 6 พ.ย. 2026: เอกสารนี้เก็บแผนหรือหลักฐาน ณ รุ่นเดิม ไม่ใช่คำสั่งผลิตหรือ storyboard ที่อนุมัติสำหรับรอบใหม่ งานปัจจุบันคือรีเซ็ตระบบระดับโปรเจกต์ตาม README.md และแผนหลัก เก็บเนื้อหาเดิมไว้เทียบ ไม่ใช้สถานะ PASS หรือ Next action ด้านล่างรับรองงานใหม่

# Asset ledger

ใช้ local assets ทั้งหมด ไม่โหลด media หรือ live API ระหว่าง render

| Asset | ที่มา / สิทธิ์ | การใช้งาน |
|---|---|---|
| langmind-logo.png | สำเนาจาก shared/assets/brand ของ workspace; ผู้ใช้ให้ใช้ทุกคลิป | ไม่แก้สีหรือสัดส่วน |
| guide.svg | Vector ต้นฉบับที่สร้างในโปรเจกต์นี้ตามคำสั่งให้ทำตัวละคร/ส่วนประกอบ | Prototype ท่าอธิบายหนึ่งท่า ไม่ใช่บุคคลหรือ mascot ทางการ |
| fonts/NotoSansThai.ttf | google/fonts, ofl/notosansthai, SIL Open Font License; ดู OFL.txt | Thai text ในทุกฉาก |
| gsap.min.js | jsDelivr npm gsap@3.15.0; URL https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js | Seekable timeline ในเครื่อง |
| style.css | CSS ของตอนนี้ | Layout, typography และสีที่เสนอ |

ฟอนต์: https://github.com/google/fonts/tree/main/ofl/notosansthai

Catalog component chat-message ติดตั้งไว้ใน compositions/components เป็น reference editable source ปรับหลักการ bubble arrival มาใช้ในฉาก 5 ไม่ใส่ข้อความตัวอย่างเดิมในคลิปหลัก ไม่ใช้ Pro style templates

ยังไม่มีเสียงพากย์ เพลง หรือ sound effects ผู้ใช้เลือกเสียงผู้ชายภาษาไทยสำหรับขั้นถัดไป ไม่เรียก TTS หรือสร้างเสียงจากโมเดลในรอบนี้

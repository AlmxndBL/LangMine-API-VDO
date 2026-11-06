# EP01 — Catalog selection สำหรับ W4

ตรวจเว็บ preview วันที่ 6 พฤศจิกายน 2026 ใช้ร่วมกับ [Storyboard](STORYBOARD.md)
สถานะนี้ไม่ใช่ installed/integrated/verified ของตอนใหม่

| รายการ / ชนิด / แหล่ง preview | สิ่งที่ดูจริง | หน้าที่และการปรับ | สถานะ / ข้อจำกัด |
|---|---|---|---|
| [Hand-Drawn Flowchart: hw-pipeline](https://hyperframes.heygen.com/catalog/blocks/hw-pipeline), Block | เห็นช่วงกรอบแรกและลูกศรไปกรอบถัดไปกำลังวาด และช่วงท้ายประมาณ 0:06/0:07 ที่มี Idea → Record → Shine! ครบสามกรอบ | ฐาน diagram B03–B05 ใช้กรอบ/connector วาดตามลำดับ เปลี่ยนเป็นป้ายไทยและจัดแนวให้ตรงเฟรม ใช้สีหมึกเข้มบนกระดาษ | เลือกเป็นฐานหลังดู motion หลายสถานะแล้ว ยังไม่ install; ตัวอย่างแนวนอน 1920×1080 ต้องปรับ layout และฟอนต์ไทย ห้ามย่อทั้งชุดจนอ่านไม่ออก |
| [Browser Device Stage: browser-device-stage](https://hyperframes.heygen.com/catalog/components/browser-device-stage), Component | เห็นกรอบ browser พร้อม skeleton ภายในช่วงประมาณ 0:02/0:05; หน้า Tune มี Browser/Window/Phone และช่อง screen slot ตามคำอธิบาย | host raster APP-Q และ APP-A ใน B01/B05; ใช้ chrome ต่ำ ปรับกรอบให้เข้าภาษาภาพ ไม่ใช้ skeleton เป็น UI ของตอน | เลือกเป็นฐาน host หลังดู preview ภาพจริง การเข้า/ออกและการ swap ยังไม่ได้ตรวจครบ ต้องลองกับ raster จริงก่อนอ้าง integration |
| [Offset Path Traveler: offset-path-traveler](https://hyperframes.heygen.com/catalog/components/offset-path-traveler), Component | เห็น chip “Live preview” บนเส้นโค้งช่วงประมาณ 0:02/0:04; หลายภาพที่จับได้ยังเป็นตำแหน่งใกล้กัน | candidate สำหรับพาคำถาม/คำตอบไปตาม connector ของ diagram ปรับเส้นทางให้เรียบ ไม่หมุนข้อความตาม tangent | ยังไม่เลือกใช้: ยังไม่ยืนยันการเคลื่อนตลอดเส้นและไม่ทดสอบความอ่านไทย หากจำเป็นให้ตรวจเพิ่มก่อนติดตั้ง |
| [Flowchart Vertical: flowchart-vertical](https://hyperframes.heygen.com/catalog/blocks/flowchart-vertical), Block | เห็นโหนดบนแตกกิ่งซ้าย/ขวาบนพื้นขาว ภาพตัวอย่างมีพื้นที่ว่างมาก | ไม่ใช้ในตอนนี้ เพราะเรื่องเป็นการส่งข้อมูลไป/กลับ ไม่ใช่ decision tree | ไม่เลือก ไม่ถือว่า motion ทั้งรายการถูกตรวจแล้ว |

## ช่องว่างและ fallback
ต้องแสดงคำถามไปและคำตอบกลับบนเส้นทางเดียวกัน แต่ hw-pipeline ตัวอย่างแสดง progression ไปข้างหน้า หากปรับ node/connector แล้วรองรับขากลับไม่ได้ ให้ตรวจ Offset Path Traveler เพิ่มก่อน custom
custom อนุญาตเฉพาะการจัด node/ลูกศรกลับและปรับ timing ที่รายการไม่รองรับ ไม่สร้าง demo UI หรือ chat bubbles ใหม่ด้วย HTML
ซับใช้ข้อความนิ่งแบ่งวลีตามเสียงร่าง ยังไม่เลือก caption effect เพราะเป้าคือให้ตามข้อมูลทัน

## หลักฐานเครื่องมือ
`npx --no-install hyperframes catalog --query 'diagram flow arrow' --json` ล้มเหลว ENOTFOUND registry.npmjs.org ไม่ได้ผล catalog จาก CLI และไม่ได้ติดตั้ง dependency
จึงตรวจจากหน้า preview ทางการด้วย browser; ไม่มีการอ้างว่าอ่าน source หรือติดตั้งสำเร็จจากภาพ preview

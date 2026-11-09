# EP10 — Storyboard และแบบกำหนดหน้าจอ (Inbox API & LINE Channel)

เอกสารอ้างอิง: [PLAN](PLAN.md), [SCRIPT](SCRIPT.md), [CATALOG](CATALOG.md), และ [STORYBOARD_GUIDELINES](../../docs/STORYBOARD_GUIDELINES.md)  
สถานะ: แผน W4 พร้อมสำหรับเริ่มสร้าง Sample (W5) และการผลิต (W6)

---

## 1. แนวภาพและระบบการแสดงผล (Visual System)

* **สไตล์หลัก**: Editorial Paper & Sage Ink
* **สัดส่วนและขนาด**: 9:16 (1080×1920 พิกเซล, 30 fps)
* **ชุดสี (Palette)**: พื้นหลัง `#F5F1E7`, หมึกเข้ม `#202824`, สีเน้นช่องทาง LINE / เธรด `#38815A`, สีเน้นสถานะ Handover / Export `#1E7578`
* **ระบบตัวอักษร**: ฟอนต์ Sarabun (หัวเรื่อง 64–72px, ป้ายกำกับ 40–48px, ซับไตเติล 44–48px กึ่งกลางกรอบ y=1540–1720px)
* **พื้นที่ปลอดภัย (Safe Area)**: x=108–972, y=192–1500

---

## 2. รายละเอียด Storyboard ราย Beat (`b1–b9`)

| Beat / เวลาประมาณ | สงสัยก่อน → เข้าใจหลัง | ภาพเริ่ม → การเคลื่อนไหว → ภาพจบ | บทพากย์และข้อความเน้น | Assets / Catalog / Robot |
|---|---|---|---|---|
| **b1** (14–16s) | ลูกค้าทักมาจาก LINE ดึงมาดูหลังบ้าน เช็กแอดมินรับสาย และ Export Excel ได้ไหม? → ได้ด้วย Inbox API | หน้าจอ `APP-INBOX-THREADS` เด่นกลางจอ → ถอยออกมาตั้ง 3 คำถาม: เตรียมอะไร · เชื่อมตรงไหน · ใช้ผลยังไง | **บท**: เมื่อเรานำ Agent ไปเชื่อมต่อกับลูกค้าทาง LINE... ต้องเตรียมอะไร เชื่อมตรงไหน และเอาผลไปใช้ยังไง มาดูกันครับ<br>**ข้อความ**: "ดึงแชท LINE เช็กแอดมินรับสาย & Export รายงาน" | • `Browser Device Stage` (`#hf-195`)<br>• ภาพ `APP-INBOX-THREADS`<br>• Robot `03-wave-chest.png` |
| **b2** (14–16s) | ภาพรวมเชื่อมยังไง? → ลูกค้า LINE ⇄ LangMind Inbox ⇄ ระบบหลังบ้าน (อ่านข้อมูล 3 จุด) | แผนผัง 3 ส่วน พร้อมลูกศรชี้การดึงข้อมูล 3 ครั้ง: 1.รายการเธรด 2.สถานะ Handover 3.Export ไฟล์ | **บท**: ภาพรวมเชื่อมระหว่างแชทภายนอก Inbox ของ LangMind และระบบหลังบ้าน... เรียกอ่านข้อมูลสามจุดหลัก<br>**ข้อความ**: "1.รายการเธรด → 2.สถานะ Handover → 3.Export ไฟล์" | • `Flowchart Vertical` (`#hf-409`)<br>• ไม่ใช้ Robot |
| **b3** (14–16s) | ต้องเตรียมอะไรบ้าง? → Agent เปิดช่องทาง LINE + Key สิทธิ์ `inbox:read` + ระบบหลังบ้าน | การ์ดเช็กลิสต์ 3 ข้อ พร้อมไฮไลต์สิทธิ์ `inbox:read` (และ `chat:invoke` เมื่อส่งแชทผ่าน API) | **บท**: เริ่มจากสิ่งที่ต้องเตรียม... Agent ที่เปิดช่องทาง LINE, API Key สิทธิ์ inbox read และระบบหลังบ้าน<br>**ข้อความ**: เปิดช่องทาง LINE · สิทธิ์ `inbox:read` | • `Marker Highlight` (`#hf-072`) |
| **b4** (17–19s) | ครั้งที่ 1 ดึงรายการแชทและนับจำนวนแยกช่องทางยังไง? → `GET .../inbox/threads?channel=line` | หน้าจอ `APP-INBOX-THREADS` คู่กับโค้ดไฮไลต์ `display_name: "คุณสมชาย"` และป้าย `Badge Pop` แสดง `channel_counts` (`line: 1, web: 0`) | **บท**: ครั้งที่หนึ่ง การดึงรายการเธรด... คืนชื่อแสดงผล รูปโปรไฟล์ และ channel counts นับรวมทุกช่องทางในครั้งเดียว<br>**ข้อความ**: `GET .../inbox/threads` → `display_name` & `channel_counts` | • `Browser Device Stage` (`#hf-195`)<br>• ภาพ `APP-INBOX-THREADS`<br>• `Badge Pop` (`#hf-281`)<br>• Robot `05-point-up.png` |
| **b5** (16–18s) | ครั้งที่ 2 รู้ได้ยังไงว่าแอดมินรับสายแทน AI อยู่? → `GET .../handover` ดูค่า `active: true` | หน้าจอสลับเป็น `APP-INBOX-HANDOVER` แสดงป้าย `"แอดมินกำลังคุย (active: true · เหลือ 1,420 วินาที)"` และสถานะ AI หยุดตอบชั่วคราว | **บท**: ครั้งที่สอง การเช็กสถานะแอดมินรับสาย... ถ้า active เป็น true แปลว่าแอดมินคุมสายอยู่ AI จะหยุดตอบอัตโนมัติ<br>**ข้อความ**: `GET .../handover` → `active: true` (`expires_in_sec: 1420`) | • `Browser Device Stage` (`#hf-195`)<br>• ภาพ `APP-INBOX-HANDOVER`<br>• Robot `12-clipboard.png` |
| **b6** (15–17s) | ครั้งที่ 3 ดึงประวัติแชทเป็น Excel ยังไง? → `GET .../inbox/export?format=xlsx&channel=line` | กล่องคำสั่ง `Code Terminal Run` รันคำสั่งดาวน์โหลด `inbox-export.xlsx` พร้อมป้ายกำกับ `สูงสุด 20,000 แถว/ครั้ง` | **บท**: ครั้งที่สาม การ Export ประวัติการสนทนา... ระบุ format เป็น xlsx หรือ csv คืนไฟล์ไบนารีตรงๆ สูงสุดสองหมื่นแถวต่อครั้ง<br>**ข้อความ**: `GET .../inbox/export?format=xlsx` → `inbox-export.xlsx` | • `Code Terminal Run` (`#hf-196`) |
| **b7** (15–17s) | ข้อจำกัดสำคัญของ API Key กับ Inbox คืออะไร? → อ่านและ Export เท่านั้น ตอบกลับ/ควบคุม handover ต้องทำผ่านหน้าเว็บ | ป้ายเปรียบเทียบชัดเจน: `API Key (inbox:read) = อ่านเธรด / ข้อความ / handover / export` vs `ตอบกลับ & เริ่ม-จบ handover = ล็อกอินผ่านหน้าเว็บเท่านั้น` | **บท**: ข้อควรจำสำคัญคือ API Key ใช้ได้เฉพาะส่วนอ่านเท่านั้น การตอบกลับหรือเริ่มและจบ handover ต้องล็อกอินทำผ่านหน้าเว็บครับ<br>**ข้อความ**: API Key = อ่านและ Export · ตอบกลับ/Handover = หน้าเว็บเท่านั้น | • `Marker Highlight` (`#hf-072`) |
| **b8** (12–14s) | สรุปทั้งคลิป? → เตรียม → เชื่อม 3 จุด → ใช้ผลติดตามแชทและออกรายงาน | ภาพรวมสรุป 3 ช่อง: เตรียม → เชื่อม (`threads` · `handover` · `export`) → ใช้ผล | **บท**: สรุปครับ เตรียม Agent เปิด LINE และ Key สิทธิ์ inbox read เชื่อมสามจุด ช่วยให้ทีมติดตามงานได้ครบทุกช่องทางครับ<br>**ข้อความ**: "เตรียม → เชื่อม 3 จุด → ติดตามแชท & ออกรายงาน" | • Robot `10-thumbs-up.png` (กลางล่าง) |
| **b9** (6–8s) | ผู้สนับสนุน? → LangMind (`langmind.in.th`) | โลโก้จริง `langmind-logo.png` กลางจอ พร้อม `langmind.in.th` | **บท**: คลิปนี้สนับสนุนโดย LangMind เริ่มสร้าง Agent เชื่อมต่อช่องทางแชทของคุณได้ที่ LangMind ดอท อิน ดอท ทีเอช<br>**ข้อความ**: `langmind.in.th` | • `shared/assets/brand/langmind-logo.png` |

---

## 3. การเลือกฉากตัวอย่างสำหรับทำ Sample (W5)

* **ช่วงที่เลือกทำ Sample**: **`b4 – b6` (`threads` → `handover` → `export`)**
* **เหตุผล**: ทดสอบความต่อเนื่องของหน้าจอมอนิเตอร์ `APP-INBOX-THREADS` ไปสู่ `APP-INBOX-HANDOVER` และการแสดงคำสั่ง Export ไฟล์ `.xlsx`

---

## 4. แบบกำหนดหน้าจอ Mockup ก่อนเจนรูป (Screen Specifications)

### หน้าจอ 1: `APP-INBOX-THREADS` (สถานะแสดงรายการเธรดจาก LINE และจำนวนแยกช่องทาง)
* **ขนาดไฟล์ภาพ**: 1440×1800 พิกเซล (4:5)
* **Header** (y=0.06–0.14): `"ระบบมอนิเตอร์กล่องข้อความร้านกาแฟ (Inbox Monitor)"`
* **เนื้อหาหลัก**:
  * แถบป้ายจำนวนแยกช่องทาง (`channel_counts`, y=0.18–0.28): ป้ายสีเขียว `"LINE: 1 เธรด"` · ป้ายสีเทา `"Web: 0 เธรด"`
  * การ์ดรายการเธรดที่ 1 (y=0.32–0.76):
    * ชื่อผู้ใช้: `"คุณสมชาย (ช่องทาง: LINE)"`
    * สถานะเธรด: `"สถานะ: เปิดอยู่ (open) · 6 ข้อความ"`
    * ข้อความล่าสุด: `"ร้านเปิดกี่โมง → เปิด 9 โมงถึง 5 โมงค่ะ"`
  * ป้ายถาวร (y=0.88–0.93 มุมขวาล่าง): `"ภาพจำลอง"`

### หน้าจอ 2: `APP-INBOX-HANDOVER` (สถานะแอดมินรับสายและปุ่ม Export ประวัติ)
* **ขนาดไฟล์ภาพ**: 1440×1800 พิกเซล (4:5) — คง Header, โครงสี `#F5F1E7`, แถบ `channel_counts` และป้าย `"ภาพจำลอง"` ตรงกับ `APP-INBOX-THREADS` ทุกพิกเซล
* **ส่วนที่เปลี่ยน**:
  * การ์ดรายละเอียดเธรด `"คุณสมชาย"` (y=0.32–0.64):
    * แถบสถานะ Handover เด่นชัด: `"สถานะ Handover: แอดมินกำลังรับสาย (active: true)"`
    * เวลาคงเหลือ: `"เวลาคงเหลือ (expires_in_sec): 1,420 วินาที (AI หยุดตอบชั่วคราว)"`
  * แถบส่งออกรายงานด้านล่าง (y=0.68–0.82):
    * ปุ่ม/ป้ายสถานะ: `"ส่งออกประวัติแชท: inbox-export.xlsx (รูปแบบ XLSX · ช่องทาง LINE)"`

---

## 5. Prompt สำหรับเจนภาพ Raster (ใช้ใน W5)

```text
[APP-INBOX-THREADS]
A clean, minimal web inbox monitor UI card in Thai language titled "ระบบมอนิเตอร์กล่องข้อความร้านกาแฟ (Inbox Monitor)", 1440x1800 portrait 4:5 ratio. Soft warm paper background #F5F1E7, dark ink typography #202824, sage green accents #38815A. Top row shows channel count badges "LINE: 1 เธรด" and "Web: 0 เธรด". Main thread card shows customer "คุณสมชาย (ช่องทาง: LINE)", badge "สถานะ: เปิดอยู่ (open) · 6 ข้อความ", and latest message preview "ร้านเปิดกี่โมง → เปิด 9 โมงถึง 5 โมงค่ะ". Small subtle tag at bottom right reading "ภาพจำลอง".

[APP-INBOX-HANDOVER]
Same exact header "ระบบมอนิเตอร์กล่องข้อความร้านกาแฟ (Inbox Monitor)", top channel count badges, frame geometry, #F5F1E7 palette, and bottom-right tag "ภาพจำลอง" as APP-INBOX-THREADS, 1440x1800 portrait 4:5 ratio. Inside the thread card for "คุณสมชาย", a highlighted teal status banner reads "สถานะ Handover: แอดมินกำลังรับสาย (active: true)" with subtext "เวลาคงเหลือ (expires_in_sec): 1,420 วินาที (AI หยุดตอบชั่วคราว)". Below the card is an export action panel reading "ส่งออกประวัติแชท: inbox-export.xlsx (รูปแบบ XLSX · ช่องทาง LINE)".
```

# EP10 — Inbox API & LINE Channel: เชื่อมแชทจาก LINE เช็กแอดมินรับสาย และ Export รายงาน

สถานะ: ออกแบบ W3–W4 เสร็จสมบูรณ์ รอเริ่มสร้าง Sample (W5) และการผลิต (W6)  
อ้างอิง: [Workflow](../../docs/WORKFLOW.md), [ข้อกำหนด Storyboard](../../docs/STORYBOARD_GUIDELINES.md) และคู่มือ [langmind-api.md](../../langmind-api.md)

---

## 1. โจทย์จากมุมคนดู (Audience & Purpose)

* **ผู้ชมเป้าหมาย**: Developer และทีมดูแลลูกค้าที่ใช้ Agent รับแชทจากช่องทางภายนอกอย่าง LINE และต้องการดึงรายการสนทนามาแสดงหลังบ้าน เช็กว่าเคสไหนแอดมินกำลังคุยแทน AI อยู่ หรือดาวน์โหลดประวัติแชทเป็นไฟล์ Excel/CSV
* **พื้นฐานเดิมของผู้ฟัง**: รู้จักการเรียก Chat API แล้ว แต่ยังไม่รู้วิธีดึงข้อมูลจากกล่องข้อความ (Inbox) ของ Agent หรือเข้าใจขอบเขตว่า API Key ทำอะไรกับ Inbox ได้และไม่ได้บ้าง
* **ความต้องการหลัก**: อยากดึงรายการเธรดจาก LINE พร้อมชื่อและรูปโปรไฟล์ เช็กสถานะ `human-handover` และสั่ง Export ประวัติแชทออกมาทำรายงาน
* **จุดติดขัด (Friction)**:
  * ไม่รู้ว่าต้องยิงกี่ครั้งถึงจะรู้จำนวนแชทแยกตามช่องทาง (ความจริงคือ `/inbox/threads` คืน `channel_counts` ของทุกเธรดมาให้ในครั้งเดียว)
  * สับสนว่าใช้ API Key สั่งตอบกลับลูกค้าใน Inbox หรือกดเปิด/ปิด handover ได้ไหม (ความจริงคือ API Key อ่านได้เท่านั้นด้วยสิทธิ์ `inbox:read` ส่วนการตอบกลับ/handover ต้องล็อกอินผ่านเว็บ)
* **เหตุผลที่ดู**: เห็นท่อการอ่านข้อมูล Inbox 3 ขั้นตอน (**ดึงรายการเธรดและจำนวนแยกช่องทาง → เช็กสถานะ Handover → Export ประวัติเป็น `.xlsx`/`.csv`**) พร้อมเข้าใจขอบเขตความปลอดภัยของ API Key
* **สิ่งที่ดูจบแล้วนำไปทำต่อได้**: สร้างหน้ามอนิเตอร์แชทหลายช่องทาง เช็กสถานะแอดมินรับสาย และเขียนสคริปต์ดึงไฟล์รายงานประจำวันได้ทันที

---

## 2. แกนคำอธิบายและ Use Case ตัวอย่าง

* **Use Case ตัวแทน**: **"ระบบมอนิเตอร์แชทลูกค้า LINE และออกรายงานประจำวันของร้านกาแฟ (Cafe LINE Inbox Monitor & Exporter)"**
  * *เหตุการณ์*: ลูกค้าชื่อ `"คุณสมชาย"` ทักมาจาก LINE ระบบหลังบ้านดึงรายการเธรดมาแสดงพร้อมจำนวนแชทแต่ละช่องทาง เช็กดูว่าแอดมินกำลังรับสายเคสนี้อยู่หรือไม่ (`handover`) และเมื่อจบวันก็สั่ง Export ประวัติแชทเป็นไฟล์ `inbox-export.xlsx`
* **ท่อการทำงาน 3 ครั้ง (เตรียม → เชื่อม 3 ครั้ง → ใช้ผล)**:
  1. **ครั้งที่ 1: ดึงรายการเธรดและจำนวนแยกช่องทาง (`GET /api/agents/{agent_id}/inbox/threads`)**: กรอง `?channel=line` รับรายการเธรดพร้อม `display_name`, `avatar_url` และ `channel_counts`
  2. **ครั้งที่ 2: เช็กสถานะแอดมินรับสาย (`GET /api/agents/{agent_id}/inbox/threads/{cid}/handover`)**: ดูค่า `active` (`true`/`false`) และ `expires_in_sec`
  3. **ครั้งที่ 3: Export ประวัติแชทเป็น Excel หรือ CSV (`GET /api/agents/{agent_id}/inbox/export`)**: ระบุ `?format=xlsx&channel=line` รับไฟล์ไบนารีโดยตรง (สูงสุด 20,000 แถวต่อครั้ง)
* **การแบ่งหน้าที่ชัดเจน (Separation of Concerns)**:
  * **LangMind API ทำหน้าที่**: ดึงโปรไฟล์สดจาก LINE/Webex/Telegram, นับจำนวนเธรดแยกช่องทาง, คืนสถานะ handover และสร้างไฟล์ `.xlsx`/`.csv`
  * **แอปพลิเคชัน (Developer) ทำหน้าที่**: นำข้อมูลไปแสดงใน Dashboard หรือจัดเก็บรายงาน และให้แอดมินล็อกอินผ่านหน้าเว็บ LangMind เมื่อต้องการกดรับสายหรือตอบกลับลูกค้าโดยตรง

---

## 3. โครงเรื่อง 9 ช่วง (9-Beat Outline แบบ EP04 v3)

| Beat | คำถามคนดู | สิ่งที่เห็นในจอ |
|---|---|---|
| **b1** | ลูกค้าทักมาจาก LINE อยากดึงแชทมาดูหลังบ้าน เช็กว่าแอดมินรับสายอยู่ไหม และดึงไฟล์ Excel ทำยังไง | หน้าจอมอนิเตอร์แชท LINE แสดงชื่อลูกค้า ป้ายแอดมินรับสาย และปุ่ม Export · ตั้ง 3 คำถาม: เตรียมอะไร · เชื่อมตรงไหน · เอาผลไปใช้ยังไง |
| **b2** | ภาพรวมทั้งหมดทำงานยังไง | แผนผัง: ลูกค้า LINE ⇄ LangMind Agent & Inbox ⇄ ระบบหลังบ้านของคุณ · เชื่อมอ่านข้อมูล 3 ครั้ง: **1. ดึงรายการเธรด → 2. เช็กสถานะ Handover → 3. Export ประวัติ** |
| **b3** | ต้องเตรียมอะไรบ้าง | 1. Agent ที่เปิดใช้งาน LINE channel แล้ว · 2. API Key (`lmpat_`) สิทธิ์ `inbox:read` (และ `chat:invoke` หากส่งข้อความ LINE ผ่าน API) · 3. ระบบหลังบ้านเก็บ Key |
| **b4** | ครั้งที่ 1: ดึงรายการแชทและจำนวนแยกช่องทางยังไง | เรียก `GET /api/agents/{agent_id}/inbox/threads?channel=line&page=1&limit=25` ได้รายการเธรดพร้อม `display_name`, `avatar_url` และ `channel_counts` (ใช้ทำ badge จำนวนต่อช่องทางได้เลยโดยไม่ต้องยิงซ้ำ) |
| **b5** | ครั้งที่ 2: รู้ได้ยังไงว่า AI ตอบอยู่หรือแอดมินรับสายแทนแล้ว | เรียก `GET /api/agents/{agent_id}/inbox/threads/{cid}/handover` ดูค่า `active` และ `expires_in_sec` (ถ้า `active: true` แปลว่าแอดมินคุมสายอยู่ AI จะไม่ตอบแทรก) |
| **b6** | ครั้งที่ 3: ดึงประวัติแชทออกมาเป็นไฟล์ Excel หรือ CSV ยังไง | เรียก `GET /api/agents/{agent_id}/inbox/export?format=xlsx&channel=line` คืนไฟล์ไบนารีตรงๆ (จำกัด 20,000 แถวต่อครั้ง) |
| **b7** | เอาผลไปใช้ยังไงและข้อจำกัดสำคัญคืออะไร | ดึงข้อความในเธรดได้ด้วย `GET .../inbox/threads/{cid}/messages` (โครงสร้างเดียวกับ Chat API) · **ข้อจำกัดสำคัญ:** API Key ใช้ได้เฉพาะส่วนอ่าน (`inbox:read`) ส่วนการตอบกลับลูกค้า (`POST /inbox/reply`) หรือเริ่ม/จบ handover ต้องล็อกอินผ่านเว็บเท่านั้น |
| **b8** | สรุป | เตรียม Agent เปิด LINE + Key `inbox:read` → เชื่อม 3 ครั้ง (`threads` · `handover` · `export`) → ติดตามสถานะแชทและดึงรายงานได้ครบถ้วน |
| **b9** | ผู้สนับสนุน | โลโก้ LangMind · `langmind.in.th` |

---

## 4. ขอบเขตคำตอบและหลักฐาน (Claim Ledger เทียบ `langmind-api.md`)

| ข้อความในคลิป | สถานะหลักฐาน | ที่มาใน `langmind-api.md` |
|---|---|---|
| ส่งแชทระบุ `channel="line"` พร้อม LINE `user_id` ได้เมื่อเอเจนต์เปิดใช้งาน LINE channel แล้ว | **documented** | บรรทัด 690–700 |
| Inbox API ใช้สิทธิ์ `inbox:read` เฉพาะส่วนอ่านเท่านั้น ตอบกลับ/เริ่ม-จบ human-handover ต้อง login ผ่านเว็บ (JWT) | **documented** | บรรทัด 114, 1020, 1031–1032 |
| `GET /api/agents/{agent_id}/inbox/threads` คืน `items`, `total`, `channel_counts` เสมอ พร้อม `display_name` และ `avatar_url` | **documented** | บรรทัด 1024, 1037–1066 |
| `GET /api/agents/{agent_id}/inbox/threads/{cid}/messages` คืนรูปแบบเดียวกับ `GET /chat/conversations/{id}/messages` | **documented** | บรรทัด 1026, 1070–1108 |
| `GET /api/agents/{agent_id}/inbox/threads/{cid}/handover` คืน `active: true/false` และ `expires_in_sec` | **documented** | บรรทัด 1028, 1112–1119 |
| เมื่อ `active: true` แปลว่ามีแอดมินคุมสายอยู่ AI จะไม่ตอบจนกว่า session จะหมดอายุหรือถูกจบเอง | **documented** | บรรทัด 1119 |
| `GET /api/agents/{agent_id}/inbox/export` (`?format=xlsx|csv&channel=&date_from=&date_to=`) คืนไฟล์ไบนารีตรงๆ จำกัด 20,000 แถวต่อครั้ง | **documented** | บรรทัด 1030, 1124–1128 |
| หน้าจอมอนิเตอร์แชท LINE จำลอง (`APP-INBOX-THREADS` / `APP-INBOX-HANDOVER`) | **illustrative** | ออกแบบจำลองขึ้นเอง ติดป้าย "ภาพจำลอง" |

---

## 5. การวางตัวละคร Robot และ Motion

* **Robot กลาง** (`shared/assets/characters/robot/`):
  * `b1`: `03-wave-chest.png` — ทักทายและแนะนำโจทย์การดูแลแชทลูกค้าจาก LINE
  * `b4`: `05-point-up.png` — ชี้ไปที่ `channel_counts` และรายการเธรด
  * `b5`: `34-shushing.png` (หรือ `12-clipboard.png`) — สื่อว่าเมื่อแอดมินรับสาย (`active: true`) ตัว AI จะหยุดตอบชั่วคราวไม่พูดแทรก
  * `b8`: `10-thumbs-up.png` — สรุปการใช้งาน Inbox API
* **Catalog Motion**: ดูรายละเอียดการจับคู่ราย Beat ใน [CATALOG.md](CATALOG.md) และ [STORYBOARD.md](STORYBOARD.md)

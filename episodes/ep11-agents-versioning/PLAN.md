# EP11 — Agents & Versioning API: สร้าง ปรับรุ่น ทดสอบ และ Rollback Agent ผ่านโค้ด

สถานะ: ออกแบบ W3–W4 เสร็จสมบูรณ์ รอเริ่มสร้าง Sample (W5) และการผลิต (W6)  
อ้างอิง: [Workflow](../../docs/WORKFLOW.md), [ข้อกำหนด Storyboard](../../docs/STORYBOARD_GUIDELINES.md) และคู่มือ [langmind-api.md](../../langmind-api.md)

---

## 1. โจทย์จากมุมคนดู (Audience & Purpose)

* **ผู้ชมเป้าหมาย**: Developer และทีมวิศวกรที่ต้องการสร้างและจัดการ Agent ผ่านโค้ด (Agent-as-Code) หรือต้องการอัปเดต Prompt และโมเดลโดยไม่กระทบลูกค้าที่กำลังใช้งานอยู่ พร้อมย้อนกลับ (Rollback) ได้ทันทีหากพบปัญหา
* **พื้นฐานเดิมของผู้ฟัง**: รู้จักการเรียกใช้งาน Agent แล้ว แต่ยังไม่รู้ว่าสามารถดูรายชื่อโมเดลที่มีสิทธิ์ใช้ สร้าง Agent บันทึกเวอร์ชันร่าง (`draft`) สั่ง `publish` และ `rollback` ผ่าน API ได้ทั้งหมด
* **ความต้องการหลัก**: อยากควบคุมการสร้างและอัปเกรดรุ่นของ Agent อย่างปลอดภัยเหมือนการทำ Version Control ของซอฟต์แวร์
* **จุดติดขัด (Friction)**:
  * ไม่รู้ว่าก่อนสร้าง Agent ต้องเอาชื่อ `model_provider` และ `model_name` มาจากไหนให้ตรงสิทธิ์ของบัญชี
  * กังวลว่าการแก้ Prompt หรือ Temperature จะเปลี่ยนพฤติกรรมของ Agent ทันทีจนกระทบผู้ใช้จริง (ความจริงคือบันทึกเป็น `versions` แบบ `publish: false` ก่อนได้)
  * สับสนว่า `PATCH /agents/{id}` แก้ Prompt ได้ไหม (ความจริงคือ `PATCH /agents/{id}` แก้ได้แค่ metadata เช่น ชื่อ/ไอคอน/visibility ส่วนการแก้ Prompt/Model ต้องผ่าน `/versions`)
* **เหตุผลที่ดู**: เห็นท่อการบริหารจัดการรุ่นของ Agent 3 ขั้นตอน (**ดูโมเดลและสร้าง Agent → บันทึก Config รุ่นร่าง → สั่ง Publish หรือ Rollback**)
* **สิ่งที่ดูจบแล้วนำไปทำต่อได้**: เขียนสคริปต์สร้าง Agent, อัปเดตเวอร์ชันใหม่แบบปลอดภัย, สั่ง `publish` เมื่อพร้อม และสั่ง `rollback` หรือ `duplicate` ได้อย่างถูกต้อง

---

## 2. แกนคำอธิบายและ Use Case ตัวอย่าง

* **Use Case ตัวแทน**: **"ระบบอัปเกรดเวอร์ชันผู้ช่วยฝ่ายขายร้านกาแฟอย่างปลอดภัย (Safe Agent Version Upgrade & Rollback)"**
  * *เหตุการณ์*: ทีมพัฒนาสร้าง Agent `"ผู้ช่วยฝ่ายขาย"` (เวอร์ชัน 1 ถูก publish อัตโนมัติ) ต่อมาต้องการปรับโทนคำตอบและ `temperature: 0.2` จึงบันทึกเป็นเวอร์ชัน 2 แบบฉบับร่าง (`publish: false`) เมื่อตรวจแล้วจึงสั่ง `publish` เวอร์ชัน 2 และแสดงวิธีสั่ง `rollback` ย้อนกลับไปเวอร์ชันก่อนหน้าได้ในคำสั่งเดียว
* **ท่อการทำงาน 3 ครั้ง (เตรียม → เชื่อม 3 ครั้ง → ใช้ผล)**:
  1. **ครั้งที่ 1: ดูโมเดลที่มีสิทธิ์ใช้และสร้าง Agent (`GET /api/providers/models` & `POST /api/agents`)**: เช็ก `provider_type` และ `model_name` แล้วสร้าง Agent ใหม่ (publish version 1 อัตโนมัติ)
  2. **ครั้งที่ 2: บันทึก Config เวอร์ชันใหม่เป็นฉบับร่าง (`POST /api/agents/{id}/versions`)**: ส่ง `config` (หรือเฉพาะค่าที่จะแก้) พร้อม `note` และ `"publish": false`
  3. **ครั้งที่ 3: สั่ง Publish เวอร์ชันใหม่ หรือ Rollback ย้อนกลับ (`POST /api/agents/{id}/publish` & `/rollback`)**: เผยแพร่เวอร์ชันล่าสุดขึ้นใช้งานจริง หรือย้อนกลับไปเวอร์ชันก่อนหน้าทันทีโดยไม่ต้องส่ง body
* **การแบ่งหน้าที่ชัดเจน (Separation of Concerns)**:
  * **LangMind API ทำหน้าที่**: กรองรายชื่อโมเดลตามสิทธิ์ของผู้ใช้, แยกเก็บ `published_version` ออกจาก `draft_version`, ตรวจสอบค่าพารามิเตอร์กับ context window ของโมเดล และสลับเวอร์ชันเมื่อสั่ง `publish` หรือ `rollback`
  * **แอปพลิเคชัน (Developer) ทำหน้าที่**: ควบคุมลำดับการสร้างและอัปเดตผ่านระบบหลังบ้านหรือสคริปต์ของทีม โดยเก็บ API Key ไว้ฝั่ง Server เท่านั้น

---

## 3. โครงเรื่อง 9 ช่วง (9-Beat Outline แบบ EP04 v3)

| Beat | คำถามคนดู | สิ่งที่เห็นในจอ |
|---|---|---|
| **b1** | เวลาอยากแก้ Prompt หรือเปลี่ยนโมเดล ทำยังไงไม่ให้กระทบลูกค้าที่กำลังคุยอยู่ และถ้าพลาดจะย้อนกลับยังไง | หน้าจอจัดการรุ่นของ Agent แสดง `Published v1` คู่กับ `Draft v2` · ตั้ง 3 คำถาม: เตรียมอะไร · เชื่อมตรงไหน · เอาผลไปใช้ยังไง |
| **b2** | ภาพรวมทั้งหมดทำงานยังไง | แผนผัง: สคริปต์จัดการของทีม ⇄ LangMind Agents API · แยก `Published` กับ `Draft` ผ่าน 3 ขั้น: **1. เช็กโมเดลและสร้าง → 2. บันทึกร่างใหม่ → 3. Publish หรือ Rollback** |
| **b3** | ต้องเตรียมอะไรบ้าง | 1. ตั้งค่า LLM Credential บนเว็บให้พร้อม · 2. API Key (`lmpat_`) สิทธิ์ `agents:read` และ `agents:write` · 3. ระบบหลังบ้านหรือสคริปต์ที่เก็บ Key ปลอดภัย |
| **b4** | ครั้งที่ 1: เช็กโมเดลที่ใช้ได้และสร้าง Agent ใหม่ยังไง | เรียก `GET /api/providers/models?model_type=llm` เพื่อดู `provider_type` และ `model_name` ที่มีสิทธิ์ใช้ แล้วส่ง `POST /api/agents` สร้าง Agent (ระบบจะ publish version 1 ให้อัตโนมัติ) |
| **b5** | ครั้งที่ 2: แก้ Prompt หรือ Temperature เป็นฉบับร่างก่อนทำยังไง | ส่ง `POST /api/agents/{id}/versions` ระบุ `config`, `note: "ปรับโทนคำตอบ"` และตั้ง `"publish": false` ระบบจะสร้างเวอร์ชัน 2 เป็นฉบับร่างโดยยังไม่กระทบผู้ใช้จริง |
| **b6** | ครั้งที่ 3: สั่งเปิดใช้งานจริง หรือย้อนกลับเวอร์ชันเดิมทำยังไง | เมื่อพร้อมส่ง `POST /api/agents/{id}/publish` (ระบุ `version_id` หรือส่งว่างเพื่อ publish ร่างล่าสุดอัตโนมัติ) และหากพบปัญหาส่ง `POST /api/agents/{id}/rollback` (ไม่ต้องมี body) เพื่อย้อนไปเวอร์ชันก่อนหน้าทันที |
| **b7** | เอาผลไปใช้ยังไงและมีจุดไหนต้องระวัง | `PATCH /api/agents/{id}` ใช้แก้เฉพาะ metadata (`name`, `description`, `icon`, `visibility`) ส่วนการแก้ Prompt/Model ต้องผ่าน `/versions` เสมอ · นอกจากนี้ยังคัดลอก Agent ทั้งตัวได้ด้วย `POST /agents/{id}/duplicate` และผูก `datasets`, `tools`, `credential` ผ่าน `PUT` ได้ครบ |
| **b8** | สรุป | เตรียม Key (`agents:read`, `agents:write`) → เช็กโมเดลและสร้าง · บันทึก `versions` ร่าง · สั่ง `publish` หรือ `rollback` → บริหารจัดการรุ่นของ Agent ได้อย่างปลอดภัย |
| **b9** | ผู้สนับสนุน | โลโก้ LangMind · `langmind.in.th` |

---

## 4. ขอบเขตคำตอบและหลักฐาน (Claim Ledger เทียบ `langmind-api.md`)

| ข้อความในคลิป | สถานะหลักฐาน | ที่มาใน `langmind-api.md` |
|---|---|---|
| `GET /api/providers/models?model_type=llm` (`agents:read`) รวม provider และโมเดลเฉพาะที่ผู้ใช้มีสิทธิ์ในคำตอบเดียว | **documented** | บรรทัด 160–161, 201–231 |
| ใช้ `providers[].provider_type` คู่กับ `models[].model_name` ตอนสร้าง Agent | **documented** | บรรทัด 197, 241–242 |
| `POST /api/agents` (`agents:write`) สร้าง Agent ใหม่และ publish version 1 อัตโนมัติ | **documented** | บรรทัด 123–124, 235–281 |
| `PATCH /api/agents/{id}` แก้ได้เฉพาะ `name`/`description`/`icon`/`icon_background`/`visibility` ส่วนการแก้ prompt/model ต้องผ่าน `/versions` | **documented** | บรรทัด 127–128, 317 |
| `POST /api/agents/{id}/versions` บันทึก config เวอร์ชันใหม่ (`publish: false` = ยังไม่ publish) และ validate กับช่วงค่าที่รองรับและ context window ของโมเดล | **documented** | บรรทัด 135–136, 320–352 |
| `POST /api/agents/{id}/publish` ไม่ส่ง `version_id` (หรือส่ง `null`) = publish เวอร์ชันล่าสุดที่ยังไม่ publish ให้อัตโนมัติ | **documented** | บรรทัด 137–138, 353–359 |
| `POST /api/agents/{id}/rollback` และ `POST /api/agents/{id}/duplicate` ไม่ต้องมี body คืน agent detail | **documented** | บรรทัด 131–132, 139–140, 359 |
| ผูก `datasets`, `tools`, `credential` ด้วย `PUT /api/agents/{id}/datasets|tools|credential` (ส่ง array/object ว่างเพื่อถอด binding ทั้งหมดได้) | **documented** | บรรทัด 141–152, 361–404 |
| หน้าจอจัดการรุ่นของ Agent จำลอง (`APP-AGENT-DRAFT` / `APP-AGENT-PUBLISH`) | **illustrative** | ออกแบบจำลองขึ้นเอง ติดป้าย "ภาพจำลอง" |

---

## 5. การวางตัวละคร Robot และ Motion

* **Robot กลาง** (`shared/assets/characters/robot/`):
  * `b1`: `06-thinking.png` — คิดหาวิธีอัปเกรด Prompt โดยไม่ให้กระทบลูกค้าที่กำลังใช้งาน
  * `b4`: `05-point-up.png` — ชี้การจับคู่ `provider_type` กับ `model_name`
  * `b6`: `15-salute.png` (หรือ `10-thumbs-up.png`) — ยืนยันความพร้อมเมื่อสั่ง `publish` และพร้อม `rollback` ทันทีเมื่อต้องการ
  * `b8`: `04-open-arms.png` — สรุปวงจรการจัดการรุ่นของ Agent
* **Catalog Motion**: ดูรายละเอียดการจับคู่ราย Beat ใน [CATALOG.md](CATALOG.md) และ [STORYBOARD.md](STORYBOARD.md)

# EP11 — บทร่างภาษาพูด 9 Beats (Agents & Versioning API)

ผู้ชม: Developer และทีมวิศวกรที่ต้องการสร้าง ปรับรุ่น ทดสอบ และ Rollback Agent ผ่านโค้ด  
โครงสร้าง: 9 Beats (`b1–b9`) ตามแนวทาง EP04 v3 (เตรียม → เชื่อม 3 ครั้ง → ใช้ผล + ผู้สนับสนุน)  
ภาษา: ไทย โทนสนทนา กระชับ แยกบทพูด (`say`) ซับไตเติล (`cap`) และข้อความเน้นบนจอชัดเจน

---

## 1. บทเต็มและจุดแบ่งจังหวะ (Full Script & Beats)

| Beat | บทบรรยายภาษาพูด (`say`) | ข้อความเน้นบนจอ (แยกจากซับ) |
|---|---|---|
| **b1** | เวลาที่เรามี Agent ใช้งานจริงอยู่ แล้วอยากปรับปรุง Prompt หรือเปลี่ยนค่าโมเดล จะทำอย่างไรไม่ให้กระทบลูกค้าที่กำลังคุยอยู่ และถ้าปรับแล้วผลลัพธ์ไม่เป็นไปตามคาด จะย้อนกลับไปเวอร์ชันเดิมทันทีได้อย่างไร ถ้าอยากจัดการรุ่นของ Agent แบบมืออาชีพ ต้องเตรียมอะไร เชื่อมตรงไหน และเอาผลไปใช้ยังไง มาดูกันครับ | สร้าง ปรับรุ่น & Rollback Agent ผ่าน API |
| **b2** | ภาพรวมของฟีเจอร์นี้คือการแยกเวอร์ชันที่ใช้งานจริง หรือ published ออกจากฉบับร่าง หรือ draft โดยระบบหลังบ้านของเราจะเรียก Agents API สามขั้นตอนหลัก คือ เช็กโมเดลและสร้าง Agent บันทึกการแก้ไขเป็นเวอร์ชันร่าง และสั่ง publish เพื่อเปิดใช้งานจริง หรือสั่ง rollback เพื่อย้อนกลับครับ | เช็กโมเดล/สร้าง Agent → บันทึกร่าง (`versions`) → `publish` / `rollback` |
| **b3** | เริ่มจากสิ่งที่ต้องเตรียม อย่างแรกคือตั้งค่า Credential ของโมเดลบนเว็บให้พร้อม อย่างที่สองคือ API Key ที่มีสิทธิ์ agents read สำหรับอ่านข้อมูลโมเดลและประวัติเวอร์ชัน และสิทธิ์ agents write สำหรับสร้าง แก้ไข และเปลี่ยนเวอร์ชัน อย่างที่สามคือระบบหลังบ้านหรือสคริปต์ที่เก็บ Key ไว้อย่างปลอดภัยครับ | สิ่งที่ต้องเตรียม:<br>1. ตั้งค่า LLM Credential บนเว็บ<br>2. สิทธิ์ `agents:read` & `agents:write`<br>3. ระบบหลังบ้านเก็บ Key |
| **b4** | มาดูการเชื่อมครั้งที่หนึ่ง การเช็กโมเดลและสร้าง Agent ก่อนสร้างให้เรียก GET ไปที่ providers models เพื่อดูรายชื่อ provider และโมเดลที่เราได้รับสิทธิ์ใช้งานในคำตอบเดียว จากนั้นนำค่า provider type เช่น openrouter และ model name มาส่ง POST ที่ agents พร้อมชื่อและคำสั่งเริ่มต้น ระบบจะสร้าง Agent และ publish เวอร์ชันที่หนึ่งให้อัตโนมัติครับ | ครั้งที่ 1: เช็กโมเดล & สร้าง Agent<br>`GET /api/providers/models` → `POST /api/agents` (Publish v1 อัตโนมัติ) |
| **b5** | ครั้งที่สอง การบันทึกเวอร์ชันใหม่เป็นฉบับร่าง เมื่อต้องการปรับ Prompt หรือค่า generation อย่าง temperature และ max tokens ให้ส่ง POST ไปที่ agents ตามด้วย ID และ versions พร้อมระบุหมายเหตุ note และตั้งค่า publish เป็น false ระบบจะตรวจสอบค่ากับ context window ของโมเดล แล้วบันทึกเป็นเวอร์ชันที่สองในสถานะฉบับร่าง โดยยังไม่กระทบลูกค้าที่ใช้งานเวอร์ชันหนึ่งอยู่ครับ | ครั้งที่ 2: บันทึกเป็นฉบับร่าง (Draft)<br>`POST /api/agents/{id}/versions` · `"publish": false` |
| **b6** | ครั้งที่สาม การสั่งเปิดใช้งานจริง หรือย้อนกลับ เมื่อตรวจฉบับร่างจนมั่นใจแล้ว ให้ส่ง POST ไปที่ publish โดยระบุ version ID หรือส่งว่างเพื่อให้ระบบ publish ร่างล่าสุดให้อัตโนมัติ และถ้าเปิดใช้แล้วอยากย้อนกลับไปเวอร์ชันก่อนหน้า ก็ส่ง POST ไปที่ rollback ได้ทันทีโดยไม่ต้องส่งข้อมูลใน body เลยครับ | ครั้งที่ 3: สั่ง `publish` หรือ `rollback`<br>`POST /api/agents/{id}/publish` · `POST /api/agents/{id}/rollback` |
| **b7** | นอกจากนี้ยังมีรายละเอียดที่ช่วยให้จัดการผ่านโค้ดได้ครบวงจร คือถ้าต้องการแก้เฉพาะชื่อ คำอธิบาย ไอคอน หรือการมองเห็น ให้เรียกที่ PATCH agents ID แต่ถ้าแก้ Prompt หรือโมเดลต้องผ่าน versions เสมอ รวมถึงสามารถคัดลอก Agent ทั้งตัวด้วยคำสั่ง duplicate และผูกคลังความรู้ เครื่องมือ หรือ credential ผ่านคำสั่ง PUT ได้ทั้งหมดครับ | จัดการครบวงจร:<br>• `PATCH /agents/{id}` = แก้ชื่อ/ไอคอน/visibility<br>• `POST .../duplicate` = คัดลอก Agent · `PUT .../datasets|tools|credential` |
| **b8** | สรุปครับ เตรียม API Key สิทธิ์ agents read และ write เชื่อมสามขั้นตอน คือดูโมเดลแล้วสร้าง Agent บันทึกร่างใหม่ที่ versions และสั่งเปิดใช้ที่ publish หรือย้อนกลับที่ rollback ช่วยให้ทีมของคุณอัปเกรด AI ได้อย่างปลอดภัยทุกครั้งครับ | สรุป: เตรียม Key → สร้าง · บันทึก `versions` ร่าง → `publish` / `rollback` |
| **b9** | คลิปนี้สนับสนุนโดย LangMind เริ่มสร้างและบริหารจัดการ Agent ของคุณได้ที่ LangMind ดอท อิน ดอท ทีเอช | สนับสนุนโดย LangMind · `langmind.in.th` |

---

## 2. ข้อมูลตัวอย่างสำหรับหน้าจอและโค้ด (`illustrative` จากค่าตัวอย่างในคู่มือ)

* **ข้อมูล Agent ตัวอย่าง** (ตรงตาม [langmind-api.md](../../langmind-api.md) บรรทัด 238–359):
  * `name`: `"ผู้ช่วยฝ่ายขาย"`
  * `model_provider`: `"openrouter"`, `model_name`: `"google/gemma-3-27b-it"`
  * **Version 1 (`published_version_no: 1`)**: คำสั่งเริ่มต้น `"คุณคือพนักงานขาย..."`, `max_tokens: 4096`
  * **Version 2 (`version_no: 2`, `note: "ปรับโทนคำตอบ"`)**: `temperature: 0.2`, `max_tokens: 8192`, `prompt.system: "ปรับ prompt ใหม่..."`

---

## 3. Claim Ledger (ตรวจสอบข้อกล่าวอ้างเทียบกับคู่มือ)

| ข้อกล่าวอ้างในบท | สถานะหลักฐาน | แหล่งอ้างอิงใน [langmind-api.md](../../langmind-api.md) |
|---|---|---|
| `GET /api/providers/models` รวม provider และโมเดลที่มีสิทธิ์ใช้ในคำตอบเดียว (`agents:read`) | **documented** | บรรทัด 160–161, 201–231 |
| ใช้ `provider_type` (เช่น `"openrouter"`) และ `model_name` ตอนเรียก `POST /api/agents` | **documented** | บรรทัด 197, 238–247 |
| `POST /api/agents` สร้าง Agent ใหม่และ publish version 1 อัตโนมัติ | **documented** | บรรทัด 123–124, 253–281 |
| `PATCH /api/agents/{id}` แก้ได้แค่ `name`/`description`/`icon`/`icon_background`/`visibility` ส่วนการแก้ prompt/model ต้องผ่าน `/versions` | **documented** | บรรทัด 317 |
| `POST /api/agents/{id}/versions` รับ `config`, `note`, `publish: false` และ validate กับช่วงค่าที่รองรับและ context window | **documented** | บรรทัด 320–352 |
| `POST /api/agents/{id}/publish` ไม่ส่ง `version_id` = publish เวอร์ชันล่าสุดที่ยังไม่ publish ให้อัตโนมัติ | **documented** | บรรทัด 353–359 |
| `POST /api/agents/{id}/rollback` และ `/duplicate` ไม่ต้องมี body | **documented** | บรรทัด 359 |
| ผูก `datasets`, `tools`, `credential` ด้วย `PUT /api/agents/{id}/datasets|tools|credential` | **documented** | บรรทัด 361–404 |
| หน้าจอ `APP-AGENT-DRAFT` และ `APP-AGENT-PUBLISH` | **illustrative** | ออกแบบจำลองขึ้นเอง ติดป้าย "ภาพจำลอง" |

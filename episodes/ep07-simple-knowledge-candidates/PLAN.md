# EP07 — Simple Knowledge & Candidates API: ตั้งคำตอบด่วน FAQ และปั้นคำถามจริงเข้าคลังความรู้

สถานะ: ออกแบบ W3–W4 เสร็จสมบูรณ์ รอเริ่มสร้าง Sample (W5) และการผลิต (W6)  
อ้างอิง: [Workflow](../../docs/WORKFLOW.md), [ข้อกำหนด Storyboard](../../docs/STORYBOARD_GUIDELINES.md) และคู่มือ [langmind-api.md](../../langmind-api.md)

---

## 1. โจทย์จากมุมคนดู (Audience & Purpose)

* **ผู้ชมเป้าหมาย**: Developer และทีมดูแลระบบแชทบอทที่ต้องการให้คำถามพื้นฐานตอบตรงเป๊ะโดยไม่ต้องเสียโควตาเรียก LLM และอยากนำคำถามที่ลูกค้าถามบ่อยในแชทมาตรวจอนุมัติก่อนเติมเข้าคลังความรู้จริง
* **พื้นฐานเดิมของผู้ฟัง**: รู้จักการทำงานของ Agent และคลังความรู้ Dataset (EP06) แล้ว แต่ยังไม่รู้วิธีตั้งกฎคำตอบด่วนแบบ Keyword และวิธีคัดกรองคำถามจากแชทเข้าคลังความรู้อย่างเป็นระบบ
* **ความต้องการหลัก**: อยากตั้งกฎ FAQ ด่านหน้าให้ตอบทันทีเมื่อตรง Keyword และมีขั้นตอน Review → Approve → Promote สำหรับคำถามใหม่ๆ ที่เก็บมาจากลูกค้า
* **จุดติดขัด (Friction)**:
  * คำถามง่ายๆ เช่น `"เวลาทำการ"` ถ้าปล่อยให้ผ่าน RAG/LLM ทุกครั้งอาจเสียทั้งเวลาและโทเค็นโดยไม่จำเป็น
  * คำถามใหม่ๆ จากลูกค้า ถ้าเอาเข้าคลังความรู้ทันทีโดยไม่มีคนตรวจอนุมัติ อาจทำให้ข้อมูลที่ผิดปนเปื้อนใน Dataset
* **เหตุผลที่ดู**: เข้าใจความต่างและการทำงานร่วมกันของ **Simple Knowledge** (ด่านหน้าตอบด่วนก่อนถึง RAG/LLM) และ **Knowledge Candidates** (คัดกรองคำถาม–คำตอบเข้า Dataset)
* **สิ่งที่ดูจบแล้วนำไปทำต่อได้**: เรียกใช้ `/simple-knowledge` ตั้งกฎ Keyword และสร้างหน้าอนุมัติคำถามด้วย `/knowledge-candidates/review` คู่กับ `/promote` ได้ถูกต้อง

---

## 2. แกนคำอธิบายและ Use Case ตัวอย่าง

* **Use Case ตัวแทน**: **"ระบบตั้งคำตอบด่วนและคัดกรองคำถามใหม่ของร้านกาแฟ (Cafe FAQ & Candidate Curator)"**
  * *เหตุการณ์ที่ 1 (Simple Knowledge)*: ตั้งกฎ Keyword `"เวลาทำการ"` แบบ `"exact"` ให้ตอบทันทีว่า `"เปิด 9 โมงถึง 5 โมง"` โดยไม่ต้องผ่าน RAGFlow หรือ LLM
  * *เหตุการณ์ที่ 2 (Knowledge Candidates)*: แอดมินตรวจคำถามเรื่อง `"มีที่จอดรถไหม"` ที่เก็บไว้เป็น Candidate กดอนุมัติ (`approve`) แล้วสั่ง `promote` เข้า Dataset ของร้าน
* **ท่อการทำงาน 3 ครั้ง (เตรียม → เชื่อม 3 ครั้ง → ใช้ผล)**:
  1. **ครั้งที่ 1: เพิ่มกฎคำตอบด่วน (`POST /api/simple-knowledge`)**: ส่ง `agent_id`, `keyword`, `response` และ `match_type` (`exact`, `contains`, หรือ `pattern`)
  2. **ครั้งที่ 2: ตรวจอนุมัติคำถาม–คำตอบที่รอตรวจ (`POST /api/knowledge-candidates/review`)**: ส่ง `agent_id`, รายการ `ids` และ `action: "approve"`
  3. **ครั้งที่ 3: ดันรายการที่อนุมัติแล้วเข้า Dataset (`POST /api/knowledge-candidates/{agent_id}/promote`)**: ส่ง `ids` และ `dataset_id` เพื่อนำเฉพาะรายการที่ `approved` เข้าคลังความรู้จริง
* **การแบ่งหน้าที่ชัดเจน (Separation of Concerns)**:
  * **LangMind API ทำหน้าที่**: ดักจับ Keyword ตอบทันทีก่อนถึง RAGFlow/LLM, เก็บสถานะของ Knowledge Candidates และคัดเฉพาะรายการที่ `status=approved` ส่งเข้า Dataset
  * **แอปพลิเคชัน (Developer) ทำหน้าที่**: จัดทำหน้าจอให้ทีมงานเพิ่มกฎ FAQ และกดตรวจอนุมัติคำถามผ่านระบบหลังบ้านที่เก็บ API Key ปลอดภัย

---

## 3. โครงเรื่อง 9 ช่วง (9-Beat Outline แบบ EP04 v3)

| Beat | คำถามคนดู | สิ่งที่เห็นในจอ |
|---|---|---|
| **b1** | คำถามง่ายๆ ทำไมต้องรอ AI คิดทุกครั้ง และคำถามใหม่ๆ จากลูกค้าจะเก็บเข้าคลังยังไงให้ปลอดภัย | หน้าจอจัดการคำถามร้านกาแฟ แยกฝั่งคำตอบด่วนกับฝั่งคำถามรอตรวจ · ตั้ง 3 คำถาม: เตรียมอะไร · เชื่อมตรงไหน · เอาผลไปใช้ยังไง |
| **b2** | ภาพรวมทั้งหมดทำงานยังไง | แผนผัง 2 ด่าน: ด่านหน้า **Simple Knowledge** (ตอบทันทีก่อนถึง RAG/LLM) และด่านคัดกรอง **Knowledge Candidates** (ตรวจอนุมัติก่อนเข้า Dataset) · เชื่อม 3 ครั้ง |
| **b3** | ต้องเตรียมอะไรบ้าง | 1. `agent_id` และ `dataset_id` ปลายทาง · 2. API Key (`lmpat_`) สิทธิ์ `knowledge:write` และ `knowledge:read` · 3. ระบบหลังบ้านเก็บ Key |
| **b4** | ครั้งที่ 1: ตั้งกฎคำตอบด่วน FAQ ทำยังไง | ส่ง `POST /api/simple-knowledge` ระบุ `agent_id`, `keyword: "เวลาทำการ"`, `response: "เปิด 9 โมงถึง 5 โมง"`, `match_type: "exact"` |
| **b5** | ครั้งที่ 2: ตรวจอนุมัติคำถามที่เก็บมาทำยังไง | ดูรายการที่รอตรวจ แล้วส่ง `POST /api/knowledge-candidates/review` ระบุ `agent_id`, `ids` และ `action: "approve"` |
| **b6** | ครั้งที่ 3: ดันคำถามที่อนุมัติแล้วเข้า Dataset ยังไง | ส่ง `POST /api/knowledge-candidates/{agent_id}/promote` ระบุ `ids` และ `dataset_id` ได้ผลลัพธ์ `promoted`, `skipped` และ `export_batch_id` |
| **b7** | เอาผลไปใช้ยังไงและต้องระวังอะไร | `match_type` รองรับ `exact`, `contains`, `pattern` (ถ้าใช้ `pattern` ต้องมี `{variable}` มิฉะนั้นได้ `422` และถ้าคีย์ซ้ำใน Agent เดียวกันจะได้ `409`) · ส่วนการ `promote` จะดันเฉพาะรายการที่ `status=approved` เท่านั้น รายการอื่นจะถูกแยกไว้ใน `skipped` |
| **b8** | สรุป | เตรียม Agent + Dataset + Key → เชื่อม 3 ครั้ง (`simple-knowledge` · `review` · `promote`) → ได้ระบบตอบด่วนประหยัดโควตาและคลังความรู้ที่ผ่านการคัดกรอง |
| **b9** | ผู้สนับสนุน | โลโก้ LangMind · `langmind.in.th` |

---

## 4. ขอบเขตคำตอบและหลักฐาน (Claim Ledger เทียบ `langmind-api.md`)

| ข้อความในคลิป | สถานะหลักฐาน | ที่มาใน `langmind-api.md` |
|---|---|---|
| Simple Knowledge คือกฎ FAQ แบบ keyword ที่ตอบทันทีก่อนถึง RAGFlow/LLM | **documented** | บรรทัด 562–563 |
| เพิ่มกฎด้วย `POST /api/simple-knowledge` (`knowledge:write`) โดย `agent_id` อยู่ใน body | **documented** | บรรทัด 566–602 |
| `match_type` รับได้แค่ `exact`, `contains`, `pattern` (ถ้าส่ง `pattern` โดยไม่มี `{variable}` ได้ `422`, คีย์ซ้ำได้ `409`) | **documented** | บรรทัด 603 |
| Knowledge Candidates คือคำถาม–คำตอบที่มาร์กไว้จากกล่องข้อความหรือสร้างผ่าน API รอตรวจก่อนส่งเข้าเป็น knowledge จริง | **documented** | บรรทัด 605–610 |
| ตรวจอนุมัติแบบ batch ด้วย `POST /api/knowledge-candidates/review` (`action: "approve"` / ปฏิเสธ / reset) | **documented** | บรรทัด 615–616, 623–632 |
| ดันเข้า Dataset ตรงๆ ด้วย `POST /api/knowledge-candidates/{agent_id}/promote` คืน `promoted`, `skipped`, `export_batch_id` | **documented** | บรรทัด 619–620, 633–651 |
| เฉพาะ candidate ที่ `status=approved` เท่านั้นที่ promote ได้จริง ที่เหลือไปอยู่ใน `skipped` | **documented** | บรรทัด 652 |
| หน้าจอจัดการคำตอบด่วนและอนุมัติคำถามร้านกาแฟ (`APP-FAQ-RULE` / `APP-CANDIDATE-PROMOTE`) | **illustrative** | ออกแบบจำลองขึ้นเอง ติดป้าย "ภาพจำลอง" |

---

## 5. การวางตัวละคร Robot และ Motion

* **Robot กลาง** (`shared/assets/characters/robot/`):
  * `b1`: `06-thinking.png` — ครุ่นคิดเรื่องการแยกคำถามด่วนกับคำถามรอตรวจ
  * `b4`: `05-point-up.png` — ชี้ไปที่กฎ Keyword `"เวลาทำการ"`
  * `b6`: `12-clipboard.png` — ถือคลิปบอร์ดตรวจรายการที่ `approved` ก่อนส่งเข้า Dataset
  * `b8`: `04-open-arms.png` — ผายมือสรุปภาพรวมทั้ง 2 ด่าน
* **Catalog Motion**: ดูรายละเอียดการจับคู่ราย Beat ใน [CATALOG.md](CATALOG.md) และ [STORYBOARD.md](STORYBOARD.md)

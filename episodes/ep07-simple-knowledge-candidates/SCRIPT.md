# EP07 — บทร่างภาษาพูด 9 Beats (Simple Knowledge & Knowledge Candidates API)

ผู้ชม: Developer และผู้ดูแล Agent ที่ต้องการตั้งกฎคำตอบด่วน FAQ และคัดกรองคำถามจริงเข้าคลังความรู้  
โครงสร้าง: 9 Beats (`b1–b9`) ตามแนวทาง EP04 v3 (เตรียม → เชื่อม 3 ครั้ง → ใช้ผล + ผู้สนับสนุน)  
ภาษา: ไทย โทนสนทนา กระชับ แยกบทพูด (`say`) ซับไตเติล (`cap`) และข้อความเน้นบนจอชัดเจน

---

## 1. บทเต็มและจุดแบ่งจังหวะ (Full Script & Beats)

| Beat | บทบรรยายภาษาพูด (`say`) | ข้อความเน้นบนจอ (แยกจากซับ) |
|---|---|---|
| **b1** | เวลาทำแชทบอทร้านค้า มักเจอสองเรื่องนี้พร้อมกันครับ เรื่องแรกคือคำถามพื้นฐานอย่างร้านเปิดกี่โมง ที่อยากให้ตอบเป๊ะทันทีโดยไม่ต้องเปลืองโควตา AI เรื่องที่สองคือคำถามใหม่ๆ จากลูกค้า ที่อยากคัดกรองก่อนเติมเข้าคลังความรู้ ถ้าอยากทำทั้งสองอย่างนี้ ต้องเตรียมอะไร เชื่อมตรงไหน และเอาผลไปใช้ยังไง มาดูกันครับ | คำตอบด่วน FAQ & คัดกรองคำถามเข้าคลังความรู้ |
| **b2** | ภาพรวมของระบบนี้แบ่งเป็นสองด่านที่ช่วยกันทำงาน ด่านหน้าคือ Simple Knowledge กฎคำถามคำตอบแบบ Keyword ที่ตอบกลับทันทีก่อนถึง RAGFlow และ LLM ส่วนด่านพัฒนาคือ Knowledge Candidates ที่พักคำถามคำตอบไว้ให้ตรวจอนุมัติก่อนส่งเข้า Dataset จริง โดยระบบหลังบ้านจะเชื่อม API สามจุดหลักครับ | ด่านหน้า: Simple Knowledge (ตอบทันที)<br>ด่านคัดกรอง: Knowledge Candidates (ตรวจก่อนเข้าคลัง) |
| **b3** | เริ่มจากสิ่งที่ต้องเตรียม อย่างแรกคือรหัส Agent ID และรหัส Dataset ID ปลายทางที่ต้องการเติมข้อมูล อย่างที่สองคือ API Key ที่มีสิทธิ์ knowledge write และ knowledge read อย่างที่สามคือระบบหลังบ้านของแอป สำหรับเก็บ Key และให้แอดมินจัดการข้อมูลผ่านหน้าจอของเราเอง | สิ่งที่ต้องเตรียม:<br>1. `agent_id` + `dataset_id`<br>2. สิทธิ์ `knowledge:write`, `knowledge:read`<br>3. ระบบหลังบ้านเก็บ Key |
| **b4** | มาดูการเชื่อมครั้งที่หนึ่ง การตั้งกฎคำตอบด่วน ส่งคำขอ POST ไปที่ simple knowledge โดยใส่ agent ID ไว้ใน body พร้อมระบุ keyword เช่น เวลาทำการ คำตอบที่ต้องการคือ เปิดเก้าโมงถึงห้าโมง และเลือกรูปแบบการจับคู่ match type เป็น exact เพียงเท่านี้ เมื่อลูกค้าถามตรงคำ ระบบจะตอบกลับทันทีโดยไม่เรียก LLM ครับ | ครั้งที่ 1: ตั้งกฎคำตอบด่วน<br>`POST /api/simple-knowledge` · `match_type: "exact"` |
| **b5** | ครั้งที่สอง การตรวจอนุมัติคำถามที่รออยู่ เมื่อมีคำถามคำตอบที่มาร์กไว้จากกล่องข้อความ หรือสร้างเข้ามาใน Knowledge Candidates ให้ส่ง POST ไปที่ knowledge candidates review พร้อมระบุ agent ID รายการ ID ที่เลือก และใส่ action เป็น approve เพื่ออนุมัติคำถามที่ตรวจสอบความถูกต้องแล้ว | ครั้งที่ 2: ตรวจอนุมัติคำถาม<br>`POST /api/knowledge-candidates/review` · `"action": "approve"` |
| **b6** | ครั้งที่สาม การดันคำถามเข้าคลังความรู้จริง ส่งคำขอ POST ไปที่ knowledge candidates ตามด้วย agent ID และ promote โดยระบุรายการ ID และ dataset ID ปลายทาง ระบบจะนำเฉพาะรายการที่อนุมัติแล้ว ส่งเข้า Dataset ตรงๆ และคืนรายการที่สำเร็จในชื่อ promoted พร้อมรหัส export batch ID กลับมาครับ | ครั้งที่ 3: ดันเข้า Dataset จริง<br>`POST /api/knowledge-candidates/{agent_id}/promote`<br>คืน `promoted`, `skipped`, `export_batch_id` |
| **b7** | ผลที่ได้ช่วยให้จัดการความรู้อย่างมีระบบ ในฝั่ง Simple Knowledge เลือก match type ได้สามแบบคือ exact, contains และ pattern โดยถ้าใช้ pattern ต้องมีตัวแปรในปีกกา ไม่อย่างนั้นจะได้รหัสสี่สองสอง และถ้าตั้ง keyword ซ้ำใน Agent เดียวกันจะได้รหัสสี่ศูนย์เก้า ส่วนฝั่ง Promote หากเผลอส่งรายการที่ยังไม่อนุมัติไปด้วย ระบบจะแยกไปไว้ใน skipped ให้อัตโนมัติ ไม่ปนเข้าคลังความรู้จริงครับ | ข้อควรรู้ตาม Contract:<br>• `match_type`: `exact` / `contains` / `pattern` (คีย์ซ้ำ = `409`)<br>• เฉพาะ `status=approved` เท่านั้นที่ถูก `promoted` |
| **b8** | สรุปครับ เตรียม Agent ID, Dataset ID และ API Key สิทธิ์ knowledge เชื่อมสามจุด คือเพิ่มกฎด่วนที่ simple knowledge ตรวจอนุมัติที่ review และดันเข้าคลังที่ promote ช่วยให้แชทบอทตอบคำถามพื้นฐานได้ไว และฉลาดขึ้นจากคำถามจริงอย่างปลอดภัยครับ | สรุป: เตรียม → เชื่อม (`simple-knowledge` · `review` · `promote`) → ใช้ผล |
| **b9** | คลิปนี้สนับสนุนโดย LangMind เริ่มสร้างและดูแลคลังความรู้ให้ Agent ของคุณได้ที่ LangMind ดอท อิน ดอท ทีเอช | สนับสนุนโดย LangMind · `langmind.in.th` |

---

## 2. ข้อมูลตัวอย่างสำหรับหน้าจอและโค้ด (`illustrative`)

* **ระบบสมมติ**: "Cafe FAQ & Knowledge Curator"
* **กฎ Simple Knowledge ตัวอย่าง**:
  * `title`: `"เวลาทำการ"`, `keyword`: `"เวลาทำการ"`, `response`: `"เปิด 9 โมงถึง 5 โมง"`, `match_type`: `"exact"` (ตรงกับตัวอย่างในคู่มือ)
* **รายการ Knowledge Candidate ตัวอย่าง**:
  * คำถาม: `"หน้าร้านมีที่จอดรถไหม"` → คำตอบ: `"จอดฟรีหน้าร้านได้ 5 คันครับ"` → สถานะเปลี่ยนเป็น `approved` → ถูกส่งเข้า `promoted: ["6b2e..."]`

---

## 3. Claim Ledger (ตรวจสอบข้อกล่าวอ้างเทียบกับคู่มือ)

| ข้อกล่าวอ้างในบท | สถานะหลักฐาน | แหล่งอ้างอิงใน [langmind-api.md](../../langmind-api.md) |
|---|---|---|
| Simple Knowledge ตอบทันทีก่อนถึง RAGFlow/LLM และ `agent_id` อยู่ใน body/path เอง | **documented** | บรรทัด 562–586 |
| `match_type` รับได้แค่ `exact`/`contains`/`pattern`; ส่ง `pattern` ไม่มี `{variable}` ได้ `422`, คีย์ซ้ำได้ `409` | **documented** | บรรทัด 603 |
| Knowledge Candidates มาจากที่มาร์กไว้ในกล่องข้อความหรือสร้างผ่าน API รอตรวจก่อนเข้าเป็น knowledge จริง | **documented** | บรรทัด 605–610 |
| `POST /api/knowledge-candidates/review` รับ `agent_id`, `ids`, `action: "approve"` | **documented** | บรรทัด 615–616, 623–632 |
| `POST /api/knowledge-candidates/{agent_id}/promote` คืน `promoted`, `skipped`, `export_batch_id` | **documented** | บรรทัด 619–620, 633–651 |
| เฉพาะ candidate ที่ `status=approved` เท่านั้นที่ promote ได้จริง ที่เหลือไปอยู่ใน `skipped` | **documented** | บรรทัด 652 |
| เก็บ API Key ไว้ที่ระบบหลังบ้าน | **documented** | บรรทัด 20, 90 และ AGENTS.md |
| หน้าจอจำลอง `APP-FAQ-RULE` และ `APP-CANDIDATE-PROMOTE` | **illustrative** | ออกแบบจำลองขึ้นเอง ติดป้าย "ภาพจำลอง" |

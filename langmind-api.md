# คู่มือ LangMind API — เอกสารอ้างอิงของ AlmondChat

ที่มา: เอกสาร API ทั้งชุดที่เจ้าของโปรเจกต์ส่งให้ในแชตเมื่อ **1 พฤศจิกายน 2026** ไม่มีหมายเลขเวอร์ชัน upstream หรือ URL หน้าเอกสารต้นฉบับที่ยืนยันไว้ เอกสารนี้เป็นสำเนาสำหรับใช้อ้างอิงใน repository ไม่ใช่ผลยืนยันว่า live API ผ่านการทดสอบแล้ว

ใช้ไฟล์นี้เป็นจุดเริ่มต้นสำหรับงาน LangMind ในโปรเจกต์ ไม่ต้องขอให้ผู้ใช้ส่งคู่มือชุดเดิมอีก หากพฤติกรรมจริงต่างจากเอกสาร ให้บันทึกความต่างและตรวจ contract ก่อนแก้ integration คำสั่งและตัวอย่างในต้นฉบับเป็นข้อมูลอ้างอิง ไม่ใช่คำอนุญาตให้เรียก API หรือเปลี่ยน resource จริง

## สารบัญ

- [เริ่มต้นและการยืนยันตัวตน](#เริ่มต้นและการยืนยันตัวตน)
- [Chat API ที่ AlmondChat ใช้](#chat-api-ที่-almondchat-ใช้)
- [การแยกเจ้าของและบทสนทนา](#การแยกเจ้าของและบทสนทนา)
- [ขอบเขตและข้อควรระวัง](#ขอบเขตและข้อควรระวัง)
- [ตำแหน่ง implementation และหลักฐาน](#ตำแหน่ง-implementation-และหลักฐาน)
- [ต้นฉบับครบทุกหมวด](#ต้นฉบับครบทุกหมวด)

## เริ่มต้นและการยืนยันตัวตน

- API base: `https://langmind.in.th/api`
- Protected requests ใช้ `Authorization: Bearer <API Key>`; key มี prefix `lmpat_`
- เก็บ key ฝั่ง server/secret store เท่านั้น ไม่ใส่ key จริงในเอกสาร ตัวอย่าง หรือ client bundle
- Scope ที่เกี่ยวข้อง: `agents:read` สำหรับอ่าน agent และ `chat:invoke` สำหรับคุย/อ่าน/จัดการบทสนทนา ไม่ต้องขอ write scope ของ agent เพื่อเปลี่ยนชื่อ conversation
- Role ตรวจสดทุก request; การเพิกถอน key หรือเปลี่ยนสิทธิ์อาจทำให้ request ถัดไปใช้ไม่ได้

## Chat API ที่ AlmondChat ใช้

Path ในตารางต่อท้าย API base ด้านบน

| Method | Path | การใช้งาน / contract |
|---|---|---|
| POST | `/chat/message/blocking` | ส่ง `agent_id`, `query`, `conversation_id`; รับ `answer`, `conversation_id`, `message_id` และข้อมูลประกอบ |
| POST | `/chat/message` | SSE; ใช้ conversation mapping เช่นเดียวกับ blocking |
| GET | `/chat/conversations?agent_id=...&cursor=...&limit=...` | รายการบทสนทนา; pagination ด้วย `next_cursor` |
| GET | `/chat/conversations/{id}?agent_id=...` | รายละเอียดบทสนทนาและรหัสอ้างอิงผู้ใช้ |
| GET | `/chat/conversations/{id}/messages?agent_id=...&cursor=...&limit=...` | ข้อความเรียงเก่าไปใหม่ |
| PATCH | `/chat/conversations/{id}?agent_id=...` | Partial update เช่น `{ "title": "ชื่อใหม่" }`; ไม่จำเป็นต้องส่ง status |

GET/PATCH resource ของ conversation และ messages ต้องส่ง `agent_id` ตามเอกสาร ไม่ใช้ local conversation ID ของ AlmondChat แทน provider conversation ID

SSE หลัก: `message_start` ให้ conversation/message ID → `message` ให้ answer chunks → `citations` (ถ้ามี) → `message_end` ให้ answer ฉบับเต็มและ usage หากขาด terminal event ห้ามอ้างว่าคำตอบสมบูรณ์ ดูรายละเอียด payload ในต้นฉบับ

ตัวอย่างเปลี่ยนเฉพาะชื่อ (placeholder ทั้งหมด):

```http
PATCH /api/chat/conversations/<provider_conversation_id>?agent_id=<agent_id>
Authorization: Bearer <API_KEY>
Content-Type: application/json

{ "title": "AlmondChat · U-<owner-reference> · C-<chat-reference> · หัวข้อ" }
```

## การแยกเจ้าของและบทสนทนา

**ข้อเท็จจริงจากเอกสาร provider:** Personal API Key ส่ง `user_id` เป็น external end-user ID ได้ แต่เมื่อ `conversation_id: null` พร้อม `user_id` ระบบอาจคุยต่อในเธรดที่เปิดอยู่ของผู้ใช้นั้น การไม่ส่ง user_id ทำให้สถิติผู้ใช้ถูกนับตามเจ้าของ API Key; channel เริ่มต้นคือ `api`

**แนวทางปัจจุบันของ AlmondChat:** ไม่เพิ่ม account-level user_id ลงใน chat payload เพราะผู้ใช้หนึ่งคนมีหลายแชตที่ต้องแยก context เริ่มแชตใหม่ด้วย null และใช้ provider conversation ID ที่บันทึกไว้เมื่อคุยต่อ Local ownership ยึด `conversations.owner_id` และ mapping ยึด `provider_bindings`

ชื่อ provider ใช้ `AlmondChat · U-รหัสเจ้าของ · C-รหัสแชต · หัวข้อ` รหัสเป็น SHA-256 ของ namespace และ local ID ตัด 20 hex characters; เป็น pseudonymous reference ไม่ใช่ข้อมูลยืนยันสิทธิ์ ไม่ใช่ชื่อบุคคล และไม่ทดแทน authorization หัวข้อยังเป็นข้อความจากชื่อแชตเดิม

อัปเดตชื่อหลัง committed blocking/streaming turn และ local rename ผ่าน PATCH แบบ title-only จำกัด HTTP timeout ไม่เกิน 5 วินาที หากล้มเหลวไม่เปลี่ยนผล turn ที่บันทึกแล้ว ลองใหม่ใน successful turn/rename ครั้งถัดไป ไม่มี durable retry queue หรือ bulk backfill รายการเก่า

ยังไม่มีหน้า lookup รหัสเจ้าของ และสถิติ unique users ฝั่ง provider ยังไม่แยกบัญชี AlmondChat หากต้องการแก้ analytics ต้องออกแบบการสร้างเธรดให้แยกแน่นอนก่อน ไม่เพิ่ม user_id โดยละเลยเงื่อนไข reuse

## ขอบเขตและข้อควรระวัง

- `/chat/preview` เป็น channel web และไม่รับ channel/user_id สำหรับ external thread; ไม่ใช้แทน production chat integration
- การมี endpoint ในต้นฉบับไม่แปลว่า AlmondChat รองรับฟีเจอร์นั้นแล้ว เช่น attachments, voice, feedback, stop-generation, inbox, knowledge, short links และ analytics
- DELETE conversation ใน provider เป็นการลบถาวร ไม่อยู่ในงาน sync ชื่อ; ไม่เรียกเป็นส่วนหนึ่งของ rename/archive
- Error provider มี `status`, `code`, `message`, `message_en`, `request_id` ใช้ HTTP status/code ประกอบการจัดการข้อผิดพลาด ไม่ส่ง raw provider error/secret ให้ browser
- โควตา API Key ใช้ร่วมกับบัญชี; live request อาจมีค่าใช้จ่าย เอกสารนี้ไม่ได้อนุญาตให้ส่งข้อความหรือแก้ resource จริงโดยอัตโนมัติ
- Snapshot นี้ไม่รับรอง API ปัจจุบันตลอดไป ไม่ทราบข้อจำกัด title length จาก provider; ขีดจำกัดใน implementation เป็นการเลือกของ AlmondChat

## ตำแหน่ง implementation และหลักฐาน

- [Blocking adapter](../../server/integrations/langmind.ts)
- [SSE adapter](../../server/integrations/langmind-stream.ts)
- [Provider session labels](../../server/services/provider-session-labels.ts)
- [ประวัติการปรับ blocking contract](../plans/2026-10-30-langmind-contract.md)
- [งานระบุเจ้าของ session และข้อจำกัด verification](../plans/2026-11-01-provider-session-labels.md)
- [Verification policy](verification.md)

## ต้นฉบับครบทุกหมวด

เก็บข้อความที่ผู้ใช้ส่งครบ รวมคำว่า “คัดลอก” และการจัดบรรทัดจากหน้าเว็บ เพื่อไม่แก้ความหมาย contract ต้นฉบับ มีหมวด Authentication/Scopes, Agents และ model catalogs, Knowledge/Datasets, Chat/SSE/Conversations, Attachments, Voice, Inbox, Short Links, Analytics, MCP, API Key management, Errors และ Rate Limit/Quota ข้อความส่วนนี้เป็นเอกสาร provider แยกจากคำอธิบาย implementation ด้านบน

```text
เริ่มต้นใช้งาน
จากสร้าง API Key ถึงเรียก API ตัวแรก ใช้เวลาไม่ถึง 2 นาที

ไปที่ บัญชี → Personal API Key กด "สร้างคีย์" ตั้งชื่อ (เช่น sync-script) แล้วเลือกขอบเขต (scope) เท่าที่ใช้จริง
คัดลอก API Key เต็มรูปแบบ lmpat_... ที่ระบบแสดงให้ทันที — เห็นครั้งเดียว เก็บใน password manager หรือ secret store ของทีม อย่า commit ลง repo
เรียก API ด้วย header ด้านล่าง
shell
คัดลอก
export LM_TOKEN="lmpat_xxxxxxxxxxxxxxxxxxxxxxxx"

curl -H "Authorization: Bearer $LM_TOKEN" \
  https://langmind.in.th/api/agents
การยืนยันตัวตนและ Scope
ทุก request ที่ไม่ใช่ public endpoint ต้องมี header Authorization: Bearer <API Key> — API Key ขึ้นต้นด้วย lmpat_ เสมอ สิทธิ์เท่ากับบัญชีของคุณ ถูกจำกัดเพิ่มด้วย scope ที่เลือกตอนสร้าง

role อ่านสดทุกครั้ง
ถ้าคุณถูกเปลี่ยนสิทธิ์หรือปลดออกจากทีม การเรียก API ด้วย API Key จะหยุดทำงานทันทีในคำขอถัดไป ไม่ต้องรอ API Key หมดอายุ
Scope	ทำอะไรได้
agents:read	ดูรายการ/รายละเอียด agent, version, tools/skills ที่ผูกไว้ · ดูรายชื่อโมเดล/provider ที่ใช้ได้ (สำหรับเลือกตอนสร้าง/แก้ agent)
agents:write	สร้าง/แก้ไข/ลบ agent, publish version, ผูก credential/dataset/tools
knowledge:read	ดู dataset, document, ทดสอบ retrieval
knowledge:write	สร้าง/แก้ไข/ลบ dataset, อัปโหลดเอกสาร, จัดการ simple-knowledge และ knowledge candidates
chat:invoke	ส่งข้อความคุยกับ agent, พรีวิวสด, อ่าน/จัดการบทสนทนา
attachments:write	อัปโหลดไฟล์แนบผ่าน /v1/attachments/upload และดูสถานะ เพื่อนำ id ไปใส่ใน attachment_ids ของ chat
voice:invoke	ถอดเสียงพูดเป็นข้อความ และอ่านข้อความออกเสียง ด้วยการตั้งค่าเสียงของ agent (/v1/agents/{id}/voice/transcribe, /speech) — แยกจาก chat:invoke เพราะทุกครั้งมีค่าใช้จ่ายตามโมเดลเสียง · การดู/แก้การตั้งค่าเสียงใช้ agents:read / agents:write
analytics:read	ดูสรุปการใช้งานของ agent — บทสนทนา โทเค็น ค่าใช้จ่าย อัตราสำเร็จ
short_links:read	ดูลิงก์ย่อ การใช้งานเทียบโควตาแผน และสถิติการคลิก
short_links:write	สร้าง แก้ไข ปิดใช้งาน และลบลิงก์ย่อ — นับตามโควตาลิงก์ย่อในแผนของคุณ
inbox:read	ดูรายการ thread และข้อความจากผู้ใช้ปลายทาง (LINE ฯลฯ), export ประวัติ, ดูสถานะ human-handover — ตอบกลับ/เริ่ม-จบ handover ทำผ่าน API Key ไม่ได้ ต้องเข้าสู่ระบบผ่านเว็บ
เลือกได้หลาย scope ต่อ API Key หนึ่งใบ — endpoint ที่ไม่อยู่ในตารางด้านบน (เช่น การตั้งค่าบัญชี, credential ของ LLM provider, การจัดการผู้ใช้/สิทธิ์ระดับ admin, หรือ API Key อื่นของคุณเอง) เรียกด้วย API Key ไม่ได้เลย ไม่ว่าจะเลือก scope ใด — ต้อง login ผ่านเว็บเท่านั้น

Agents API
สร้าง จัดการ และ publish agent — path เดียวกับที่หน้าเว็บเรียกอยู่แล้ว

Method	Path	คำอธิบาย	Scope
GET
/agents	รายการ agent ของคุณ · ?q=&status=&page=&limit=	agents:read
POST
/agents	สร้าง agent ใหม่ (publish version 1 อัตโนมัติ)	agents:write
GET
/agents/{id}	รายละเอียด + config ที่ publish แล้ว	agents:read
PATCH
/agents/{id}	แก้ name/description/icon/visibility	agents:write
DELETE
/agents/{id}	soft delete	agents:write
POST
/agents/{id}/duplicate	คัดลอก agent + config	agents:write
GET
/agents/{id}/versions	ประวัติ config ทั้งหมด	agents:read
POST
/agents/{id}/versions	บันทึก config ใหม่ (ยังไม่ publish)	agents:write
POST
/agents/{id}/publish	publish version ที่ระบุ	agents:write
POST
/agents/{id}/rollback	ย้อนไป version ก่อนหน้า	agents:write
GET
PUT
/agents/{id}/datasets	ดู/ตั้ง knowledge dataset ที่ผูก	read / write
GET
PUT
/agents/{id}/tools	ดู/ตั้ง tools ที่ผูก	read / write
GET
PUT
/agents/{id}/skills	ดู/ตั้ง skills ที่ผูก	read / write
GET
PUT
/agents/{id}/credential	ดู/ผูก LLM credential (ไม่คืน key เต็ม)	read / write
ก่อนสร้าง/แก้ agent ต้องรู้ว่ามีโมเดล/provider ให้เลือกอะไรบ้าง — endpoint กลุ่มนี้เป็น catalog ล้วนๆ (ไม่มี secret ปน) เลยเปิดให้ PAT เรียกได้ด้วย scope เดียวกับ agent

Method	Path	คำอธิบาย	Scope
GET
/providers	provider ที่ใช้ได้ (ของ tenant + global)	agents:read
GET
/models	โมเดลที่ผู้ใช้คนนี้ใช้ได้ (กรองตาม permission) · ?model_type=llm	agents:read
GET
/providers/models	provider แต่ละตัว พร้อม nested models เฉพาะที่ผู้ใช้คนนี้มีสิทธิ์ (กรองเหมือน /models) · ?model_type=llm	agents:read
ตัวอย่าง — ดูโมเดล/provider ที่ใช้ได้ ก่อนสร้าง agent

GET
/api/models?model_type=llm
คัดลอก
[
  {
    "id": "9c1e...",
    "provider_id": "8b1a...",
    "model_name": "google/gemma-3-27b-it",
    "display_name": "Gemma 3 27B",
    "model_type": "llm",
    "context_window": 128000,
    "price_in": "0.10",
    "price_out": "0.20",
    "capabilities": {
      "vision": false
    },
    "allowed_for_all": true,
    "enabled": true
  }
]
GET
/api/providers
คัดลอก
[
  {
    "id": "8b1a...",
    "tenant_id": null,
    "provider_type": "openrouter",
    "name": "OpenRouter",
    "base_url": "https://openrouter.ai/api/v1",
    "enabled": true
  }
]
models[].model_name ใส่ตรงๆ ใน AgentCreate.model_name ด้านล่างได้เลย ส่วน model_provider ต้องเทียบ models[].provider_id กับ providers[].id แล้วใช้ providers[].provider_type (เช่น "openrouter") — ไม่ใช่ตัว id · โมเดลที่ allowed_for_all: false และคุณยังไม่ได้รับสิทธิ์จะไม่โผล่ในลิสต์นี้เลย (ถูกกรองออก ไม่ใช่โผล่มาแล้วห้ามใช้)

ตัวอย่าง — provider พร้อม model ที่มีสิทธิ์ใช้ nested ในคำตอบเดียว

GET
/api/providers/models
คัดลอก
[
  {
    "id": "8b1a...",
    "tenant_id": null,
    "provider_type": "openrouter",
    "name": "OpenRouter",
    "base_url": "https://openrouter.ai/api/v1",
    "enabled": true,
    "models": [
      {
        "id": "9c1e...",
        "provider_id": "8b1a...",
        "model_name": "google/gemma-3-27b-it",
        "display_name": "Gemma 3 27B",
        "model_type": "llm",
        "context_window": 128000,
        "price_in": "0.10",
        "price_out": "0.20",
        "capabilities": {
          "vision": false
        },
        "allowed_for_all": true,
        "enabled": true
      }
    ]
  }
]
รวม /providers + /models ให้เรียกครั้งเดียว — provider ชุดเดียวกับ GET /providers แต่ models ในแต่ละ provider กรองด้วย permission rule เดียวกับ GET /models ทุกประการ provider ที่คุณไม่มีสิทธิ์ใช้โมเดลไหนเลยจะยังโผล่มาแต่ models: []

ตัวอย่าง — สร้าง agent

POST
/api/agents — request
คัดลอก
{
  "name": "ผู้ช่วยฝ่ายขาย",
  "description": "ตอบคำถามสินค้า",
  "model_provider": "openrouter",
  "model_name": "google/gemma-3-27b-it",
  "instructions": "คุณคือพนักงานขาย...",
  "visibility": "private",
  "max_tokens": 4096,
  "retrieval_top_k": 5
}
พารามิเตอร์ทางเลือกที่มักใช้ร่วมกับตัวอย่างข้างต้น (ไม่ระบุ = ใช้ค่า default):

visibility — "private" (default) หรือ "public" — agent ส่วนตัวเข้าถึงได้เฉพาะเจ้าของ ส่วน public เปิดหน้าแชทสาธารณะให้ได้
max_tokens — จำนวน token สูงสุดของคำตอบต่อ 1 ครั้ง (default 4096) ปรับเป็นค่าต่ำกว่านี้ได้ แต่ค่าที่ต่ำเกินไป (เช่น 2048) อาจทำให้เครื่องมือที่ส่งคืนเนื้อหายาว เช่น create_downloadable_file ถูกตัดข้อความกลางคัน
retrieval_top_k — จำนวนเอกสาร/chunk สูงสุดที่ดึงมาจากฐานความรู้ต่อคำถาม (ไม่ส่ง = ใช้ค่าตั้งต้นที่ผู้ดูแลระบบกำหนดในหน้า ตั้งค่า RAG ปกติคือ 5)
response 201
คัดลอก
{
  "id": "01J8XK2QZ9M3N4P5Q6R7S8T9U0",
  "owner_id": "3f2504e0-...",
  "name": "ผู้ช่วยฝ่ายขาย",
  "description": "ตอบคำถามสินค้า",
  "status": "active",
  "visibility": "private",
  "published_version_id": "01J8XK3...",
  "created_at": "2026-08-18T10:00:00Z",
  "updated_at": "2026-08-18T10:00:00Z",
  "config": {
    "model": {
      "provider": "openrouter",
      "name": "google/gemma-3-27b-it",
      "params": {
        "...": "..."
      }
    },
    "prompt": {
      "system": "คุณคือพนักงานขาย...",
      "...": "..."
    }
  },
  "published_version_no": 1,
  "draft_config": null,
  "draft_version_no": null
}
ตัวอย่าง — รายการ / รายละเอียด agent

shell
คัดลอก
curl -H "Authorization: Bearer $LM_TOKEN" \
  "https://langmind.in.th/api/agents?status=active&page=1&limit=20"
response 200 — GET /api/agents
คัดลอก
{
  "items": [
    {
      "id": "01J8...",
      "name": "ผู้ช่วยฝ่ายขาย",
      "status": "active",
      "visibility": "private",
      "published_version_id": "01J8XK3...",
      "created_at": "...",
      "updated_at": "..."
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20
}
รายการ (list) ไม่มี config — ต้องเรียก GET /agents/{id} เพื่อดู config เต็ม (รูปแบบเดียวกับ response ของ POST /agents ด้านบน)

ตัวอย่าง — แก้ไข metadata

PATCH
/api/agents/{id}
คัดลอก
{
  "name": "ผู้ช่วยฝ่ายขาย (v2)",
  "visibility": "public"
}
แก้ได้แค่ name/description/icon/icon_background/visibility — คืน response รูปแบบเดียวกับ agent detail ด้านบน แก้ prompt/model ต้องผ่าน /versions ด้านล่าง

ตัวอย่าง — บันทึก config เวอร์ชันใหม่ แล้ว publish

POST
/api/agents/{id}/versions — request
คัดลอก
{
  "config": {
    "model": {
      "provider": "openrouter",
      "name": "google/gemma-3-27b-it",
      "params": {
        "temperature": 0.2,
        "max_tokens": 8192
      }
    },
    "prompt": {
      "system": "ปรับ prompt ใหม่..."
    }
  },
  "note": "ปรับโทนคำตอบ",
  "publish": false
}
ต้องการแก้เฉพาะค่า generation ส่ง { "temperature": 0.2, "max_tokens": 8192 } ได้โดยไม่ต้องส่ง config ทั้งก้อน ระบบจะสร้างเวอร์ชันใหม่จาก draft ล่าสุดแล้ว validate กับช่วงค่าที่รองรับและ context window ของโมเดลก่อนบันทึก

response 201
คัดลอก
{
  "id": "01J8XK4...",
  "agent_id": "01J8...",
  "version_no": 2,
  "note": "ปรับโทนคำตอบ",
  "created_by": "3f2504e0-...",
  "created_at": "2026-08-18T11:00:00Z"
}
POST
/api/agents/{id}/publish — request
คัดลอก
{
  "version_id": "01J8XK4..."
}
ไม่ส่ง version_id (หรือส่ง null) = publish version ล่าสุดที่ยังไม่ publish ให้อัตโนมัติ — คืน agent detail ที่ published_version_id อัปเดตแล้ว · POST /rollback และ POST /duplicate ไม่ต้องมี body เลย เรียกเปล่าๆ ได้ผลลัพธ์เป็น agent detail เหมือนกัน

ตัวอย่าง — ผูก knowledge dataset / tools / credential

PUT
/api/agents/{id}/datasets
คัดลอก
{
  "datasets": [
    {
      "dataset_id": "5e2a...",
      "weight": 1
    }
  ]
}
response 200
คัดลอก
[
  {
    "dataset_id": "5e2a...",
    "weight": 1,
    "name": "คู่มือสินค้า",
    "description": "",
    "ragflow_dataset_id": "rf_ds_abc",
    "doc_count": 14
  }
]
PUT
/api/agents/{id}/tools
คัดลอก
{
  "bindings": [
    {
      "provider_id": "2c4d...",
      "tool_name": "get_weather",
      "enabled": true
    }
  ]
}
PUT
/api/agents/{id}/credential
คัดลอก
{
  "credential_id": "1b7f..."
}
ทั้งสามตัวส่ง array/object ว่างเพื่อถอด binding ทั้งหมดได้ (เช่น { "datasets": [] }) — GET คู่กันคืนโครงสร้างเดียวกัน

Knowledge & Datasets API
facade ไป RAGFlow — สร้าง dataset, อัปโหลดเอกสารหลายรูปแบบ, และทดสอบ retrieval โดยไม่ต้องเรียก LLM

Method	Path	คำอธิบาย	Scope
GET
/datasets	รายการ dataset · ?page=&limit=	knowledge:read
POST
/datasets	สร้าง knowledge base ใหม่	knowledge:write
GET
PATCH
DELETE
/datasets/{id}	ดู/แก้/ลบ dataset	read / write
GET
/datasets/{id}/documents	เอกสารใน dataset	knowledge:read
POST
/datasets/{id}/documents/upload	อัปโหลดไฟล์ (multipart)	knowledge:write
POST
/datasets/{id}/documents/upload-batch	อัปโหลดหลายไฟล์ในคำขอเดียว (จำนวนไฟล์ตามแผน สูงสุด 50, field files ซ้ำได้)	knowledge:write
POST
/datasets/{id}/documents/url	สร้าง document จาก URL	knowledge:write
POST
/datasets/{id}/documents/text	สร้าง document จากข้อความตรง	knowledge:write
POST
/datasets/{id}/documents/crawl	ไล่เก็บทั้งเว็บไซต์	knowledge:write
GET
DELETE
/documents/{id}	ดู/ลบ document	read / write
POST
/documents/{id}/resync	ส่งเข้า RAGFlow ใหม่	knowledge:write
POST
/retrieval/test	⭐ ทดสอบค้นคืนโดยไม่เรียก LLM	knowledge:read
ตัวอย่าง — สร้าง dataset แล้วดูรายละเอียด

POST
/api/datasets — request
คัดลอก
{
  "name": "คู่มือสินค้า",
  "description": "เอกสารสินค้าและนโยบาย"
}
response 201
คัดลอก
{
  "id": "5e2a...",
  "name": "คู่มือสินค้า",
  "description": "เอกสารสินค้าและนโยบาย",
  "ragflow_dataset_id": "rf_ds_abc",
  "ragflow_config": {},
  "doc_count": 0,
  "failed_doc_count": 0,
  "active_doc_count": 0,
  "created_at": "2026-08-18T10:00:00Z"
}
GET /datasets/{id} คืน object รูปแบบเดียวกัน · PATCH รับ name/description แบบ partial · DELETE ไม่มี body → 204

ตัวอย่าง — อัปโหลดไฟล์เข้า dataset

shell
คัดลอก
curl -X POST \
  https://langmind.in.th/api/datasets/$DATASET_ID/documents/upload \
  -H "Authorization: Bearer $LM_TOKEN" \
  -F "file=@คู่มือสินค้า.pdf"
response 202 (indexing เกิดใน background ไม่ sync)
คัดลอก
{
  "id": "9f1c...",
  "dataset_id": "5e2a...",
  "name": "คู่มือสินค้า.pdf",
  "source_type": "file",
  "mime_type": "application/pdf",
  "size_bytes": 204800,
  "status": "pending",
  "error": null,
  "ragflow_meta": {},
  "indexed_at": null,
  "created_at": "2026-08-18T10:00:00Z"
}
ตัวอย่าง — อัปโหลดหลายไฟล์พร้อมกัน (จำนวนไฟล์ต่อคำขอตามแผน: Free 3 · Plus 5 · Pro 10 · Max 15 · Team 20 · Business 30 · Enterprise 50)

shell
คัดลอก
curl -X POST \
  https://langmind.in.th/api/datasets/$DATASET_ID/documents/upload-batch \
  -H "Authorization: Bearer $LM_TOKEN" \
  -F "files=@คู่มือสินค้า.pdf" \
  -F "files=@นโยบายคืนสินค้า.docx"
คืน array ของ document เรียงตามลำดับไฟล์ที่ส่ง · ทั้งชุดสำเร็จหรือไม่สำเร็จพร้อมกัน — ถ้ามีไฟล์ว่าง/ใหญ่เกิน หรือเกินโควตา จะไม่มีไฟล์ใดถูกเพิ่ม และข้อความ error ขึ้นต้นด้วยชื่อไฟล์นั้น · ไฟล์ที่เคยอัปโหลดแล้ว (เนื้อหาเดียวกัน) จะคืน document เดิม · ขนาดรวมต่อคำขอต้องไม่เกินขีดจำกัดของเซิร์ฟเวอร์ (50 MB)

status ไล่ตาม pending → processing → indexed (หรือ failed) — poll GET /documents/{id} เพื่อดูสถานะล่าสุด

ตัวอย่าง — สร้าง document จาก URL / ข้อความ / ไล่เก็บเว็บไซต์

POST
/api/datasets/{id}/documents/url
คัดลอก
{
  "url": "https://example.com/policy",
  "name": "นโยบายคืนสินค้า"
}
POST
/api/datasets/{id}/documents/text
คัดลอก
{
  "name": "FAQ เวลาทำการ",
  "content": "เปิดทำการ จันทร์–ศุกร์ 9:00–17:00"
}
POST
/api/datasets/{id}/documents/crawl
คัดลอก
{
  "url": "https://example.com",
  "max_depth": 2,
  "max_pages": 20
}
/crawl ไม่คืน document ทันที — คืนแค่สถานะ { "status": "queued", "url": "...", "max_depth": 2, "max_pages": 20 } แต่ละหน้าที่ ไล่เก็บได้จะกลายเป็น document แยกทีหลัง — poll GET /datasets/{id}/documents ดูผลลัพธ์

ตัวอย่าง — ทดสอบ retrieval โดยไม่เรียก LLM

POST
/api/retrieval/test — request
คัดลอก
{
  "agent_id": "01J8...",
  "query": "นโยบายคืนสินค้า",
  "top_k": 5,
  "similarity_threshold": 0.3
}
response 200
คัดลอก
{
  "segments": [
    {
      "chunk_id": "...",
      "document_id": "...",
      "document_name": "คู่มือ.pdf",
      "content": "...",
      "score": 0.82,
      "metadata": {
        "page": 12
      }
    }
  ],
  "provider": "ragflow",
  "latency_ms": 430,
  "applied": {
    "top_k": 5,
    "similarity_threshold": 0.3,
    "vector_similarity_weight": 0.7,
    "keyword": true,
    "highlight": true,
    "max_context_chars": 4000
  }
}
ส่ง agent_id เพื่อค้นในทุก dataset ที่ผูกกับ agent นั้นให้อัตโนมัติ หรือส่ง dataset_ids: [...] ตรงๆ แทนก็ได้ · top_k/similarity_threshold (และ vector_similarity_weight/keyword/highlight) ไม่บังคับ — ไม่ส่ง = ใช้ค่าของระบบจากหน้า ตั้งค่า RAG ส่วน applied คือค่าที่ใช้ค้นจริง · ถ้าผู้ดูแลระบบยังไม่ได้ตั้งค่า RAG จะได้ 503 RAGFLOW_NOT_CONFIGURED · GET /documents/{id}/DELETE และ POST /documents/{id}/resync (ส่งไฟล์ต้นทางเข้า RAGFlow ใหม่, ไม่มี body) ใช้กับ document เดี่ยวที่ได้จากคำตอบด้านบน

Simple Knowledge API
กฎ FAQ แบบ keyword ที่ตอบทันทีก่อนถึง RAGFlow/LLM — agent_id อยู่ใน body/path เอง ไม่ nest ใต้ /agents/{id}

Method	Path	คำอธิบาย	Scope
POST
/simple-knowledge	เพิ่มกฎ — agent_id อยู่ใน body	knowledge:write
GET
/simple-knowledge/{agent_id}	รายการกฎของ agent นี้ · ?category=&search=&page=&limit=	knowledge:read
PATCH
/simple-knowledge/{rule_id}	แก้กฎ (partial update)	knowledge:write
DELETE
/simple-knowledge/{rule_id}	ลบกฎ	knowledge:write
ตัวอย่าง — เพิ่มกฎ

POST
/api/simple-knowledge — request
คัดลอก
{
  "agent_id": "01J8...",
  "title": "เวลาทำการ",
  "keyword": "เวลาทำการ",
  "response": "เปิด 9 โมงถึง 5 โมง",
  "match_type": "exact",
  "category": "general"
}
response 201
คัดลอก
{
  "id": "01J9...",
  "agent_id": "01J8...",
  "title": "เวลาทำการ",
  "keyword": "เวลาทำการ",
  "response": "เปิด 9 โมงถึง 5 โมง",
  "match_type": "exact",
  "category": "general",
  "tags": "",
  "priority": 0,
  "is_active": true,
  "created_at": "2026-08-18T10:00:00Z",
  "updated_at": "2026-08-18T10:00:00Z"
}
match_type รับได้แค่ exact/contains/pattern — ส่ง pattern โดยที่ keyword ไม่มี {variable} เลยจะได้ 422 คีย์ซ้ำ (agent เดียวกัน + keyword เดียวกัน) ตอบ 409

Knowledge Candidates API
คำถาม–คำตอบที่ mark ไว้จาก กล่องข้อความ (หรือสร้างตรงผ่าน API นี้) รอตรวจก่อนส่งเข้าเป็น knowledge จริง

Method	Path	คำอธิบาย	Scope
POST
/knowledge-candidates	สร้าง candidate	knowledge:write
GET
/knowledge-candidates/{agent_id}	รายการ · ?status=&search=&page=&limit=	knowledge:read
PATCH
/knowledge-candidates/{id}	แก้คำถาม/คำตอบ/หมวด/แท็ก	knowledge:write
POST
/knowledge-candidates/review	อนุมัติ/ปฏิเสธ/reset (batch)	knowledge:write
POST
/knowledge-candidates/delete	ลบ (batch)	knowledge:write
POST
/knowledge-candidates/{agent_id}/promote	⭐ push candidate ที่อนุมัติแล้วเข้า dataset ตรงๆ	knowledge:write
ตัวอย่าง — ตรวจแล้ว promote เข้า dataset

POST
/api/knowledge-candidates/review
คัดลอก
{
  "agent_id": "01J8...",
  "ids": [
    "6b2e..."
  ],
  "action": "approve"
}
POST
/api/knowledge-candidates/{agent_id}/promote
คัดลอก
{
  "agent_id": "01J8...",
  "ids": [
    "6b2e..."
  ],
  "dataset_id": "5e2a..."
}
response 200
คัดลอก
{
  "promoted": [
    "6b2e..."
  ],
  "skipped": [],
  "export_batch_id": "batch_20260818_01"
}
เฉพาะ candidate ที่ status=approved เท่านั้นที่ promote ได้จริง — ที่เหลือไปอยู่ใน skipped

Chat API
ส่งข้อความคุยกับ agent — รองรับทั้ง SSE stream (ดีฟอลต์), พรีวิวสดใน Agent Builder และแบบ blocking สำหรับสคริปต์ที่รอคำตอบเต็ม

Method	Path	คำอธิบาย	Scope
POST
/chat/message	ส่งข้อความ — SSE stream	chat:invoke
POST
/chat/preview	พรีวิวสดใน Agent Builder — SSE stream, channel web	chat:invoke
POST
/chat/message/blocking	ส่งข้อความ — รอคำตอบเต็ม (JSON)	chat:invoke
POST
/chat/messages/{id}/stop	หยุด stream ที่กำลังทำงาน	chat:invoke
GET
/chat/conversations	รายการบทสนทนา · ?agent_id=&cursor=&limit=	chat:invoke
GET
/chat/conversations/{id}	รายละเอียดบทสนทนาเดียว · ?agent_id=	chat:invoke
GET
/chat/conversations/{id}/messages	ข้อความในบทสนทนา · ?agent_id=&cursor=&limit=	chat:invoke
PATCH
DELETE
/chat/conversations/{id}	เปลี่ยนชื่อ/ปิด/ลบบทสนทนา · ?agent_id=	chat:invoke
POST
/chat/messages/{id}/feedback	ให้คะแนนคำตอบ (1 / -1)	chat:invoke
GET
/chat/messages/{id}/generated-files/{file_id}	ดาวน์โหลดไฟล์ที่เอเจนต์สร้าง	chat:invoke
ตัวอย่าง — ส่งข้อความแบบ stream (ดีฟอลต์)

POST
/api/chat/message — request
คัดลอก
{
  "agent_id": "01J8...",
  "query": "ราคาสินค้า A เท่าไร",
  "conversation_id": null,
  "attachment_ids": []
}
Personal API Key callers ส่ง user_id เป็น external end-user id ได้ และเลือก channel เป็น api (ค่าเริ่มต้น) หรือ line ได้ กรณี channel="line" ต้องส่ง LINE userId ใน user_id และเอเจนต์ต้องเปิดใช้งาน LINE channel แล้ว เพื่อให้ กล่องข้อความ แสดง LINE profile และ push reply กลับไปหา user ได้ · ถ้าคำถามมาจาก การพูด (ถอดด้วย Voice API) ส่ง "input_mode": "voice" เพื่อให้ agent ตอบสั้นแบบภาษาพูดตามการตั้งค่า "ตอบแบบภาษาพูด" ของ agent (ค่าเริ่มต้น "text")

POST
/api/chat/message — LINE user ผ่าน API
คัดลอก
{
  "agent_id": "01J8...",
  "query": "สวัสดี",
  "channel": "line",
  "user_id": "U4af498..."
}
response — text/event-stream
คัดลอก
data: {"event":"message_start","conversation_id":"01J8XM...","message_id":"01J8XM2..."}

data: {"event":"message","answer":"ราคา"}

data: {"event":"message","answer":"สินค้า A "}

data: {"event":"citations","citations":[{"document_name":"คู่มือ.pdf","score":0.82}]}

data: {"event":"message_end","conversation_id":"01J8XM...","message_id":"01J8XM2...","answer":"สินค้า A ราคา 590 บาทค่ะ","usage":{"prompt_tokens":320,"completion_tokens":48,"cost_usd":"0.0012"}}
conversation_id: null = เปิดเธรดใหม่ (ถ้าส่ง user_id จะคุยต่อในเธรดที่เปิดอยู่ของ user คนนั้น) · ส่ง user_id ของผู้ใช้ปลายทางเสมอ สถิติจึงนับ "ผู้ใช้" ได้ตามจริง — ถ้าไม่ส่ง ทุกคำขอจะนับเป็นผู้ใช้คนเดียว (เจ้าของ API Key) · ถ้า client ของคุณ parse SSE ไม่สะดวก ใช้ /message/blocking ด้านล่างแทนได้เลย พฤติกรรมเดียวกัน แค่รวบเป็น JSON เดียว · ยกเลิก stream ที่ กำลังวิ่งอยู่ได้ด้วย POST /chat/messages/{message_id}/stop (ไม่มี body ใช้ message_id จาก event message_start ด้านบน) → 204

ตัวอย่าง — พรีวิวสดใน Agent Builder

POST
/api/chat/preview — browser preview
คัดลอก
{
  "agent_id": "01J8...",
  "query": "ลองตอบในโทนของแบรนด์",
  "conversation_id": null,
  "model": null,
  "attachment_ids": []
}
ใช้ payload และ SSE protocol เดียวกับ /chat/message แต่ต้องเรียกจาก browser session (JWT) หรือ Personal API Key ที่มี scope chat:invoke ระบบจะ resolve published version ล่าสุด เสมอ; ถ้าแก้ draft แล้วยังไม่กด เผยแพร่ ผลพรีวิวจะยังเป็นเวอร์ชันเดิม และ conversation จะถูกจัดเป็น channel="web" จึงไม่ปนกับ กล่องข้อความ ของผู้ใช้จริง โดยเส้นนี้ไม่รับ channel/user_id สำหรับ external thread

ตัวอย่าง — เรียกแบบ blocking (เหมาะกับสคริปต์)

POST
/api/chat/message/blocking — request
คัดลอก
{
  "agent_id": "01J8...",
  "query": "ราคาสินค้า A เท่าไร",
  "conversation_id": null
}
response 200
คัดลอก
{
  "conversation_id": "01J8XM...",
  "message_id": "01J8XM2...",
  "answer": "สินค้า A ราคา 590 บาทค่ะ",
  "citations": [
    {
      "document_name": "คู่มือ.pdf",
      "score": 0.82
    }
  ],
  "generated_files": [],
  "usage": {
    "prompt_tokens": 320,
    "completion_tokens": 48,
    "cost_usd": "0.0012"
  }
}
การเรียกด้วย Personal API Key จะบันทึก conversation เป็น channel api โดย default และแสดงใน Inbox ของเอเจนต์; ถ้าส่ง channel="line" พร้อม LINE user_id จะบันทึกเป็น LINE thread เหมือน webhook ปกติ โดยไฟล์ที่สร้างจะอยู่ใน generated_files และดาวน์โหลดได้จาก endpoint ด้านบน

ตัวอย่าง — รายการบทสนทนา

shell
คัดลอก
curl -H "Authorization: Bearer $LM_TOKEN" \
  "https://langmind.in.th/api/chat/conversations?agent_id=01J8...&limit=50"
response 200
คัดลอก
{
  "items": [
    {
      "id": "01J8XM...",
      "agent_id": "01J8...",
      "channel": "api",
      "user_id": "3f2504e0-...",
      "external_user_id": null,
      "title": "ราคาสินค้า A",
      "status": "open",
      "message_count": 4,
      "last_message_role": "assistant",
      "created_at": "2026-08-18T09:30:00Z",
      "last_message_at": "2026-08-18T09:31:20Z"
    }
  ],
  "next_cursor": null
}
agent_id เป็น query param บังคับเสมอ (ไม่ใช่แค่ list — endpoint conversation/message ทุกตัว ในหมวดนี้ต้องส่ง ?agent_id= มาด้วย เพื่อยืนยันว่า conversation นั้นเป็นของ agent ที่ระบุจริง) · list ที่ใช้ cursor (conversations/messages) คืน next_cursor แทน page/total — ส่งค่านั้นกลับไปเป็น ?cursor= เพื่อดึงหน้าถัดไป, null = หมดแล้ว

ตัวอย่าง — รายละเอียดบทสนทนาเดียว

GET
/api/chat/conversations/{id}?agent_id=...
คัดลอก
{
  "id": "01J8XM...",
  "agent_id": "01J8...",
  "channel": "api",
  "user_id": "3f2504e0-...",
  "external_user_id": null,
  "title": "ราคาสินค้า A",
  "status": "open",
  "message_count": 4,
  "last_message_role": "assistant",
  "created_at": "2026-08-18T09:30:00Z",
  "last_message_at": "2026-08-18T09:31:20Z"
}
รูปแบบเดียวกับ item ใน items[] ของ list ด้านบนเป๊ะ — ต่างกันแค่คืนตัวเดียวไม่ห่อด้วย items

ตัวอย่าง — ดึงข้อความในบทสนทนา

shell
คัดลอก
curl -H "Authorization: Bearer $LM_TOKEN" \
  "https://langmind.in.th/api/chat/conversations/01J8XM.../messages?agent_id=01J8...&limit=50"
response 200
คัดลอก
{
  "items": [
    {
      "id": "01J8XM2...",
      "conversation_id": "01J8XM...",
      "agent_id": "01J8...",
      "role": "user",
      "content": "ราคาสินค้า A เท่าไร",
      "content_parts": null,
      "citations": null,
      "model": null,
      "tokens_in": 0,
      "tokens_out": 0,
      "latency_ms": null,
      "error": null,
      "created_at": "2026-08-18T09:30:00Z"
    },
    {
      "id": "01J8XM3...",
      "conversation_id": "01J8XM...",
      "agent_id": "01J8...",
      "role": "assistant",
      "content": "สินค้า A ราคา 590 บาทค่ะ",
      "content_parts": null,
      "citations": [
        {
          "document_name": "คู่มือ.pdf",
          "score": 0.82
        }
      ],
      "model": "google/gemma-3-27b-it",
      "tokens_in": 320,
      "tokens_out": 48,
      "latency_ms": 1200,
      "error": null,
      "created_at": "2026-08-18T09:31:20Z"
    }
  ],
  "next_cursor": null
}
เรียงเก่า→ใหม่เสมอ (ข้อความแรกของบทสนทนามาก่อน) · role เป็น user/assistant · content_parts มีค่าเฉพาะข้อความ user ที่แนบไฟล์ (metadata ของไฟล์แนบ ณ ตอนส่ง) · tokens_in/tokens_out/latency_ms เป็น 0/null เสมอบนข้อความฝั่ง user — มีค่าจริงเฉพาะ assistant

ตัวอย่าง — เปลี่ยนชื่อ/ปิด/ลบบทสนทนา และให้คะแนนคำตอบ

PATCH
/api/chat/conversations/{id}?agent_id=... — request
คัดลอก
{
  "title": "สอบถามราคาสินค้า A",
  "status": "closed"
}
คืน ConversationOut รูปแบบเดียวกับ "รายละเอียดบทสนทนาเดียว" ด้านบน (ค่าที่อัปเดตแล้ว) — ส่งแค่ field ที่จะแก้ก็ได้ (partial) · DELETE /chat/conversations/{id}?agent_id=... ไม่มี body → 204 No Content ลบถาวร กู้คืนไม่ได้

POST
/api/chat/messages/{id}/feedback
คัดลอก
{
  "rating": 1,
  "comment": "ตอบตรงประเด็นดี"
}
rating รับได้แค่ 1/-1 เท่านั้น (ไม่ใช่สเกล 1–5) → 204

Voice API
ใช้เสียงของ agent จากระบบของคุณเอง — ถอดเสียงพูดเป็นข้อความ (Speech-to-Text) และอ่านข้อความออกเสียง (Text-to-Speech) ด้วยโมเดล ผู้ให้บริการ เสียงพูด คำศัพท์เฉพาะ และพจนานุกรมการออกเสียงที่ตั้งไว้ใน agent (แท็บสื่อและเสียง → สนทนาด้วยเสียง) รวมทั้งดูและแก้การตั้งค่าเสียงผ่าน API ได้

Method	Path	คำอธิบาย	Scope
GET
/v1/agents/{id}/voice	การตั้งค่าเสียง — published (ที่ใช้งานจริง) และ draft (เวอร์ชันล่าสุด) พร้อมเลขเวอร์ชัน	agents:read
PATCH
/v1/agents/{id}/voice	แก้บางส่วน — {settings, publish?, note?} รวมเข้ากับเวอร์ชันล่าสุดแล้วบันทึกเป็นเวอร์ชันใหม่ (object ย่อยรวมทีละ key, list แทนที่ทั้งก้อน)	agents:write
POST
/v1/agents/{id}/voice/transcribe	ถอดเสียง — multipart audio (≤ 4 MB) + language? → {text, elapsed_ms}	voice:invoke
POST
/v1/agents/{id}/voice/speech	อ่านออกเสียง — JSON {text ≤ 4,000, voice?, speed?, format?} → ไฟล์เสียง audio/mpeg หรือ audio/wav	voice:invoke
ใช้การตั้งค่าของเวอร์ชันที่เผยแพร่แล้ว
transcribe/speech ใช้ features.voice ของเวอร์ชันที่ publish อยู่ (เหมือน chat) และ agent ต้องเปิด "สนทนาด้วยเสียง" ไว้ ไม่เช่นนั้นได้ 403 VOICE_DISABLED · แก้ด้วย PATCH แล้วยังไม่ publish จะยังไม่มีผล · ไม่มีการเก็บไฟล์เสียง · ใช้ได้กับ agent ของคุณเอง (เจ้าของ agent) เท่านั้น
ตัวอย่าง — ถอดเสียง

shell
คัดลอก
curl -X POST -H "Authorization: Bearer $LM_TOKEN" \
  -F "audio=@question.wav;type=audio/wav" \
  -F "language=th" \
  https://langmind.in.th/api/v1/agents/01J8.../voice/transcribe
response 200
คัดลอก
{
  "text": "ร้านเปิดกี่โมง",
  "elapsed_ms": 640
}
รับ wav, mp3, webm, ogg, m4a/mp4 — ต้องส่ง type= (Content-Type ของไฟล์) ให้ถูก · text ว่าง = ไม่ได้ยินเสียงพูด (ไฟล์สั้นมาก หรือมีแต่เสียงรบกวน) ไม่ใช่ error · ถ้าได้ 422 VOICE_AUDIO_FORMAT_UNSUPPORTED แปลว่าโมเดลถอดเสียง ของ agent อ่านรูปแบบไฟล์นั้นไม่ได้ ให้แปลงเป็น WAV (16 kHz mono) แล้วส่งใหม่ · language ใช้แทนภาษา ที่ตั้งใน agent เฉพาะครั้งนี้ (ไม่ส่ง = ตามการตั้งค่า, ส่งค่าว่าง = ให้โมเดลตรวจจับเอง)

ตัวอย่าง — อ่านออกเสียง

POST
/api/v1/agents/{id}/voice/speech — request
คัดลอก
{
  "text": "ร้านเปิดทุกวันตั้งแต่เก้าโมงเช้าถึงสองทุ่มค่ะ",
  "voice": null,
  "speed": 1.1,
  "format": "mp3"
}
shell — บันทึกเป็นไฟล์
คัดลอก
curl -X POST -H "Authorization: Bearer $LM_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text":"สวัสดีค่ะ ยินดีให้บริการ"}' \
  -o reply.mp3 -D - \
  https://langmind.in.th/api/v1/agents/01J8.../voice/speech
ดูชนิดไฟล์จาก header Content-Type ของ response (audio/mpeg หรือ audio/wav) · voice/speed/format ใช้แทนค่าของ agent เฉพาะครั้งนี้ (โมเดลและผู้ให้บริการ เป็นของ agent เสมอ) · format: auto (ค่าเริ่มต้น — mp3 หรือ wav ตามที่โมเดลรองรับ), mp3, wav · ข้อความเกิน 4,000 ตัวอักษรให้แบ่งเรียกทีละช่วง · พจนานุกรมการออกเสียงและโทน การพูดของ agent ถูกใช้ด้วย (ถ้าเปิดตั้งค่าขั้นสูง)

ตัวอย่าง — คุยด้วยเสียงครบหนึ่งรอบ (Voice agent)

flow
คัดลอก
1) POST /api/v1/agents/{id}/voice/transcribe   (audio)        → { "text": "ร้านเปิดกี่โมง" }
2) POST /api/chat/message/blocking             (query=text,
                                                  input_mode="voice") → { "answer": "...", "conversation_id": "..." }
3) POST /api/v1/agents/{id}/voice/speech       (text=answer)  → audio/mpeg
API Key ต้องมี voice:invoke และ chat:invoke · ส่ง conversation_id เดิมในรอบ ถัดไปเพื่อคุยต่อในบทสนทนาเดียวกัน · ต้องการเสียงเร็วขึ้น ใช้ /chat/message (SSE) แล้วส่งให้ /speech ทีละประโยคที่ได้รับ แทนการรอคำตอบเต็ม · ทุกครั้งที่เรียกหักโควตาเสียงของคุณ: ถอดเสียงตามความยาวเสียงที่วัดจากไฟล์ อ่านออกเสียงตามจำนวนตัวอักษร

ตัวอย่าง — ดูและแก้การตั้งค่าเสียง

GET
/api/v1/agents/{id}/voice — response 200
คัดลอก
{
  "agent_id": "01J8...",
  "published_version_no": 3,
  "published": {
    "enabled": true,
    "source": "system",
    "stt_model": "openai/gpt-4o-mini-transcribe",
    "tts_model": "google/gemini-3.8-flash-lite-tts",
    "voice": "Kore",
    "speed": 1,
    "language": "th",
    "spoken_style": true,
    "credential_id": null,
    "provider": "openrouter",
    "advanced": false,
    "listening": {
      "input_mode": "auto",
      "sensitivity": "normal",
      "end_silence_ms": 900,
      "max_utterance_s": 55,
      "barge_in": true,
      "barge_in_sensitivity": "normal"
    },
    "stt": {
      "source": "main",
      "credential_id": null,
      "provider": null,
      "prompt": "",
      "temperature": null,
      "upload_format": "auto"
    },
    "reply": {
      "spoken_instructions": "",
      "overflow_notice": "",
      "greeting": ""
    },
    "tts": {
      "source": "main",
      "credential_id": null,
      "provider": null,
      "instructions": "",
      "audio_format": "auto",
      "pronunciations": []
    }
  },
  "draft_version_no": 3,
  "draft": {
    "enabled": true,
    "voice": "Kore"
  }
}
PATCH
/api/v1/agents/{id}/voice — request
คัดลอก
{
  "settings": {
    "speed": 1.1,
    "advanced": true,
    "stt": {
      "prompt": "LangMind, RAGFlow"
    },
    "tts": {
      "pronunciations": [
        {
          "term": "LM",
          "say": "แอลเอ็ม"
        }
      ]
    }
  },
  "publish": true,
  "note": "ปรับเสียงผ่าน API"
}
ตัด draft ในตัวอย่างให้สั้น — ของจริงมีฟิลด์ครบเท่า published · response ของ PATCH มีรูปแบบเดียวกับ GET · publish: false (ค่าเริ่มต้น) = บันทึกเป็นฉบับร่าง ยังไม่ใช้งานจริง · ค่าไม่ถูกต้อง (เช่น speed เกิน 0.5–2.0 หรือ key ที่ไม่มี) → 422 VALIDATION_ERROR และไม่มีเวอร์ชันใหม่ · ความหมายของทุกฟิลด์ดูได้ที่เอกสารสนทนาด้วยเสียง (24-voice-agent) หัวข้อการตั้งค่า

source: "system" = ใช้โมเดลเสียงและเสียงพูดเริ่มต้นขององค์กรที่แอดมินกำหนด (นับโควตาเสียง — ค่า provider / credential_id / stt_model / tts_model / voice จะไม่ถูกใช้) · "custom" = ใช้ค่าของเอเจนต์เอง (เรียกด้วย Credential ของคุณ = ไม่นับโควตา) · ส่งฟิลด์ใดในห้าฟิลด์นั้นโดยไม่ส่ง source = เปลี่ยนเป็น "custom" ให้อัตโนมัติ · ส่ง { "source": "system" } เพื่อกลับไปใช้ค่าเริ่มต้น

Inbox API
ดึงข้อมูล thread การสนทนาจากช่องทางภายนอก (LINE ฯลฯ) ของ agent — เฉพาะส่วนอ่านเท่านั้น ตอบกลับผู้ใช้/เริ่ม-จบ human-handover ยังต้อง login ผ่านเว็บ (ดูเหตุผลด้านล่างตาราง)

Method	Path	คำอธิบาย	Scope
GET
/agents/{agent_id}/inbox/threads	รายการ thread · ?channel=&search=&page=&limit= — คืน total/channel_counts เสมอ	inbox:read
GET
/agents/{agent_id}/inbox/threads/{cid}/messages	ข้อความในเธรด · ?cursor=&limit=	inbox:read
GET
/agents/{agent_id}/inbox/threads/{cid}/handover	สถานะ human-handover ของเธรดนั้น	inbox:read
GET
/agents/{agent_id}/inbox/export	export ประวัติเป็น xlsx/csv · ?format=xlsx|csv&channel=&date_from=&date_to=	inbox:read
ทำไมตอบกลับ/handover ถึงเรียกด้วย API Key ไม่ได้
POST /inbox/reply ส่งข้อความจริงหาผู้ใช้ปลายทาง และ POST/DELETE .../handover ควบคุมว่า AI ตอบเองหรือมนุษย์คุมอยู่ — สองอย่างนี้ เปลี่ยนพฤติกรรมที่ end-user เห็นจริง ไม่ใช่แค่อ่านข้อมูล จึงยังจำกัดไว้ที่ browser session (JWT) เท่านั้น เหมือนตอนใช้งานผ่านหน้าเว็บ
ตัวอย่าง — รายการ thread

shell
คัดลอก
curl -H "Authorization: Bearer $LM_TOKEN" \
  "https://langmind.in.th/api/agents/01J8.../inbox/threads?channel=line&page=1&limit=25"
response 200
คัดลอก
{
  "items": [
    {
      "id": "01J8XM...",
      "agent_id": "01J8...",
      "channel": "line",
      "external_user_id": "U4af498...",
      "title": null,
      "status": "open",
      "message_count": 6,
      "last_message_role": "user",
      "created_at": "2026-08-18T08:00:00Z",
      "last_message_at": "2026-08-18T09:15:00Z",
      "display_name": "คุณสมชาย",
      "avatar_url": "https://profile.line-scdn.net/..."
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 25,
  "channel_counts": {
    "line": 1,
    "web": 0
  }
}
display_name/avatar_url ดึงจาก profile API ของช่องทางนั้นสด (ปัจจุบันมี LINE, Webex และ Telegram (ชื่อจากข้อความล่าสุด ไม่มีรูป) — Discord ยังไม่รองรับ) ช่องทางอื่นเป็น null เสมอ · channel_counts นับจากทุก thread ของ agent ไม่ใช่ แค่หน้านี้ ใช้ทำ badge จำนวนต่อช่องทางได้เลยโดยไม่ต้องยิงซ้ำ

ตัวอย่าง — ข้อความในเธรด

GET
/api/agents/{agent_id}/inbox/threads/{cid}/messages?limit=50
คัดลอก
{
  "items": [
    {
      "id": "01J8XM2...",
      "conversation_id": "01J8XM...",
      "agent_id": "01J8...",
      "role": "user",
      "content": "ร้านเปิดกี่โมง",
      "content_parts": null,
      "citations": null,
      "model": null,
      "tokens_in": 0,
      "tokens_out": 0,
      "latency_ms": null,
      "error": null,
      "created_at": "2026-08-18T09:14:40Z"
    },
    {
      "id": "01J8XM3...",
      "conversation_id": "01J8XM...",
      "agent_id": "01J8...",
      "role": "assistant",
      "content": "เปิด 9 โมงถึง 5 โมงค่ะ",
      "content_parts": null,
      "citations": null,
      "model": "google/gemma-3-27b-it",
      "tokens_in": 180,
      "tokens_out": 20,
      "latency_ms": 900,
      "error": null,
      "created_at": "2026-08-18T09:15:00Z"
    }
  ],
  "next_cursor": null
}
รูปแบบเดียวกับ GET /chat/conversations/{id}/messages ทุกประการ (§Chat API) — thread ของ inbox กับ conversation ของ chat เป็น resource เดียวกันในระบบ ต่างกันแค่มุมมองที่ endpoint ไหนดึงมาโชว์

ตัวอย่าง — สถานะ human-handover

GET
/api/agents/{agent_id}/inbox/threads/{cid}/handover
คัดลอก
{
  "active": true,
  "expires_in_sec": 1420
}
active: false, expires_in_sec: null = ไม่มี handover session อยู่ (AI ตอบเองตามปกติ) · active: true = มีแอดมินคุมสายอยู่ ตัว AI จะไม่ตอบจนกว่า session จะหมดอายุหรือถูกจบเอง

ตัวอย่าง — export ประวัติ

shell
คัดลอก
curl -H "Authorization: Bearer $LM_TOKEN" \
  "https://langmind.in.th/api/agents/01J8.../inbox/export?format=xlsx&channel=line" \
  -o inbox-export.xlsx
คืนไฟล์ไบนารีตรงๆ (Content-Disposition: attachment) ไม่ใช่ JSON — ไม่ระบุ date_from/date_to = ดึงทั้งหมด (จำกัด 20,000 แถวต่อครั้ง)

Short Links API
ย่อ URL เป็นลิงก์สั้นบนโดเมนลิงก์ย่อของแพลตฟอร์ม พร้อมสถิติการคลิก — นับโควตาเดียวกับหน้า “ลิงก์ย่อ” ชื่อลิงก์ที่ตั้งเอง วันหมดอายุ จำกัดคลิก รหัสผ่าน และสถิติแบบละเอียดใช้ได้ตามแผน

Method	Path	คำอธิบาย	Scope
GET
/short-links	รายการลิงก์ · ?q=&tag=&state=&sort=created|clicks&limit=&offset=	short_links:read
POST
/short-links	สร้างลิงก์ · target_url, alias?, title?, tags?, utm?, expires_at?, max_clicks?, password?	short_links:write
GET,PATCH,DELETE
/short-links/{id}	อ่าน / แก้เฉพาะ field ที่ส่ง (null = ล้างตัวเลือก) / ลบ	short_links:read / write
GET
/short-links/usage	ใช้ไปเท่าไรเทียบเพดานของแผน และฟีเจอร์ที่แผนเปิดให้	short_links:read
GET
/short-links/{id}/analytics	สถิติของลิงก์ · ?from_date=&to_date= (YYYY-MM-DD)	short_links:read
GET
/short-links/analytics	ภาพรวมทุกลิงก์ · ?from_date=&to_date=	short_links:read
GET
/short-links/{id}/analytics/export	CSV รายวัน (แผนที่มีสถิติแบบละเอียด)	short_links:read
ตัวอย่าง — สร้างลิงก์ย่อพร้อม UTM

shell
คัดลอก
curl -X POST -H "Authorization: Bearer $LM_TOKEN" -H "Content-Type: application/json" \
  -d '{"target_url":"https://shop.example.com/sale","title":"โปรเดือนนี้","utm":{"source":"line","campaign":"oct"}}' \
  "https://langmind.in.th/api/short-links"
response
คัดลอก
{
  "id": "1375269c-...",
  "code": "k7m2p9x",
  "short_url": "https://s3t.me/s/k7m2p9x",
  "target_url": "https://shop.example.com/sale?utm_source=line&utm_campaign=oct",
  "state": "active",
  "total_clicks": 0
}
เกินโควตา → SHORT_LINK_LIMIT_EXCEEDED (422) หรือ SHORT_LINK_RATE_EXCEEDED (429) · ปลายทางไม่ผ่านการตรวจความปลอดภัย → SHORT_LINK_TARGET_BLOCKED (422) พร้อมข้อความบอกเหตุผล

Analytics API
สรุปการใช้งานของ agent — บทสนทนา ผู้ใช้ที่ active, โทเค็น/ค่าใช้จ่าย, latency, อัตราสำเร็จของ LLM/tool — ตัวเลขเดียวกับหน้า Analytics บนเว็บ

Method	Path	คำอธิบาย	Scope
GET
/analytics/agents	สรุปทุก agent ในช่วงวันที่ระบุ · ?from=&to= (ไม่ระบุ = ค่าเริ่มต้นของระบบ)	analytics:read
GET
/analytics/agents/{id}	รายละเอียด agent เดียว — รายวัน + แยกโมเดล + แยกช่องทาง + แยก tool	analytics:read
ตัวอย่าง — สรุปทุก agent

shell
คัดลอก
curl -H "Authorization: Bearer $LM_TOKEN" \
  "https://langmind.in.th/api/analytics/agents?from=2026-08-01&to=2026-08-18"
response 200
คัดลอก
{
  "range": {
    "from_date": "2026-08-01",
    "to_date": "2026-08-18"
  },
  "items": [
    {
      "agent_id": "01J8...",
      "name": "ผู้ช่วยฝ่ายขาย",
      "conversation_count": 42,
      "active_user_count": 30,
      "message_count": 210,
      "llm_call_count": 105,
      "llm_success_rate": 0.98,
      "prompt_tokens": 42000,
      "completion_tokens": 8400,
      "total_tokens": 50400,
      "cost_usd": "1.2600",
      "avg_latency_ms": 1150.5,
      "error_count": 2,
      "feedback_positive": 18,
      "feedback_negative": 1,
      "last_activity_at": "2026-08-18T09:40:00Z"
    }
  ]
}
ตัดฟิลด์ที่ยาวออกไปในตัวอย่างนี้ (retrieval/tool breakdown) — ของจริงมีครบ ดูรูปแบบเต็มที่ GET /analytics/agents/{id} ด้านล่าง

ตัวอย่าง — รายละเอียด agent เดียว

GET
/api/analytics/agents/{id}?from=2026-08-01&to=2026-08-18
คัดลอก
{
  "range": {
    "from_date": "2026-08-01",
    "to_date": "2026-08-18"
  },
  "summary": {
    "agent_id": "01J8...",
    "name": "ผู้ช่วยฝ่ายขาย",
    "conversation_count": 42,
    "total_tokens": 50400,
    "cost_usd": "1.2600"
  },
  "daily": [
    {
      "day": "2026-08-18",
      "conversation_count": 5,
      "message_count": 22,
      "llm_call_count": 11,
      "total_tokens": 5000,
      "cost_usd": "0.1260",
      "error_count": 0
    }
  ],
  "models": [
    {
      "model": "google/gemma-3-27b-it",
      "llm_call_count": 105,
      "llm_success_rate": 0.98,
      "total_tokens": 50400,
      "cost_usd": "1.2600"
    }
  ],
  "channels": [
    {
      "channel": "web",
      "conversation_count": 30,
      "message_count": 150,
      "active_user_count": 22,
      "last_activity_at": "2026-08-18T09:40:00Z"
    },
    {
      "channel": "line",
      "conversation_count": 12,
      "message_count": 60,
      "active_user_count": 8,
      "last_activity_at": "2026-08-18T08:10:00Z"
    }
  ],
  "tools": [
    {
      "tool_name": "get_weather",
      "call_count": 12,
      "success_rate": 1,
      "avg_latency_ms": 340,
      "error_count": 0
    }
  ]
}
summary ในนี้คือ item เดียวกับที่อยู่ใน items[] ของ GET /analytics/agents ด้านบน — daily/models/channels/tools คือส่วนที่มีแค่ endpoint นี้เท่านั้น

MCP — ให้ผู้ช่วย AI เรียก LangMind
ต่อ Claude Code, Cursor, VS Code, Claude Desktop, claude.ai หรือ ChatGPT เข้ากับ https://langmind.in.th/mcp แล้วแอปจะถามเอเจนต์และค้นคลังความรู้ของคุณได้เอง — สิทธิ์ โควตา และค่าใช้จ่ายเหมือนเรียก API (ผู้ดูแลระบบต้องเปิดใช้ก่อน) ตัวอย่างการตั้งค่าของแต่ละแอปอยู่ที่หน้า Personal API Key

แอปที่ใส่ header ได้ (Claude Code, Cursor, VS Code, Claude Desktop) — ใช้ API Key lmpat_... ที่มีขอบเขต agents:read, chat:invoke, knowledge:read
claude.ai / ChatGPT — เพิ่มเป็น custom connector ด้วย URL เดียวกัน แล้วเข้าสู่ระบบ LangMind และกดอนุญาต (OAuth) ไม่ต้องใช้ API Key ถอนได้ที่ Personal API Key → แอปที่เชื่อมต่อ
shell
คัดลอก
claude mcp add --transport http langmind https://langmind.in.th/mcp \
  --header "Authorization: Bearer $LM_TOKEN"
เครื่องมือ	Scope	ทำอะไร
list_agents · get_agent	agents:read	เอเจนต์ของคุณ หน้าที่ คลังความรู้ และคำถามแนะนำ
ask_agent	chat:invoke	ถามเอเจนต์ ได้คำตอบ แหล่งอ้างอิง และ conversation_id — ส่งค่านั้นกลับเพื่อคุยต่อ ไม่ส่ง = เริ่มบทสนทนาใหม่
list_conversations · get_conversation	chat:invoke	บทสนทนาล่าสุดของเอเจนต์
list_datasets · search_knowledge	knowledge:read	ชุดข้อมูล และข้อความดิบที่เกี่ยวข้อง (ไม่มีคำตอบ AI)
add_document	knowledge:write	เพิ่มหน้าเว็บหรือข้อความเข้าชุดข้อมูล (ไม่บังคับ — เลือก scope นี้เองถ้าต้องการ)
เปิดให้เอเจนต์เป็นเครื่องมือแยกของตัวเอง (เช่น ask_sales_helper) ได้ที่ เอเจนต์ → ช่องทาง → ผู้ช่วย AI (MCP)

จัดการ API Key ของคุณเอง
endpoint กลุ่มนี้ต้องเข้าสู่ระบบผ่านเว็บ (JWT) เท่านั้น — API Key สร้าง/ลบ API Key อื่นแทนตัวเองไม่ได้ ป้องกันไม่ให้ API Key ที่หลุดไปยกระดับสิทธิ์ตัวเอง ใช้ผ่านหน้า Personal API Key ได้เลย หรือเรียกตรงตามตารางนี้

Method	Path	คำอธิบาย
GET
/me/api-tokens	API Key ของตัวเอง — ไม่คืน API Key เต็ม เห็นแค่ prefix
POST
/me/api-tokens	สร้างใหม่ — คืน API Key เต็มครั้งเดียว
DELETE
/me/api-tokens/{id}	เพิกถอน — มีผลทันที
Errors
ทุก error มีหน้าตาเดียวกัน — เช็ค code เพื่อ handle เฉพาะกรณีแทนการ parse ข้อความ

error envelope
คัดลอก
{
  "status": "error",
  "code": "FORBIDDEN",
  "message": "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้",
  "message_en": "You do not have permission to access this resource.",
  "request_id": "01J8XK2..."
}
HTTP	code	เกิดเมื่อไหร่
401	UNAUTHORIZED	API Key ขาด, หมดอายุ, ถูกเพิกถอน หรือใช้ที่ endpoint ที่ปิดไว้สำหรับ API Key
403	FORBIDDEN	API Key ไม่มี scope ที่ endpoint นี้ต้องการ หรือ role ไม่พอ
404	NOT_FOUND	ไม่พบ resource หรือเป็นของบัญชีอื่น
422	VALIDATION_ERROR	body/query ไม่ผ่าน schema validation
429	RATE_LIMIT_EXCEEDED	เรียกถี่เกินลิมิต
403	VOICE_DISABLED	Voice API: agent ยังไม่เปิด "สนทนาด้วยเสียง" ในเวอร์ชันที่เผยแพร่
400	NO_CREDENTIAL	ยังไม่ได้ตั้ง API key ให้โมเดลของ agent (รวมโมเดลเสียง) — ตั้งในหน้าจัดการโมเดลหรือเลือก Credential
422	VOICE_AUDIO_FORMAT_UNSUPPORTED	Voice API: โมเดลถอดเสียงอ่านรูปแบบไฟล์เสียงที่ส่งไม่ได้ — แปลงเป็น WAV แล้วส่งใหม่
429	VOICE_QUOTA_EXCEEDED	Voice API: โควตาเสียงของแพ็กเกจและเครดิตไม่พอสำหรับคำขอนี้ (ถอดเสียงนับเป็นนาที อ่านออกเสียงนับเป็นตัวอักษร) — ดูยอดคงเหลือที่ GET /api/me/voice-quota
403	VOICE_NOT_IN_PLAN	Voice API: แพ็กเกจของเจ้าของ agent ไม่รวมการถอดเสียงหรืออ่านออกเสียง
Rate Limit & Quota
การเรียกผ่าน API Key นับรวมกับโควตาบัญชีเดียวกับตอนใช้งานผ่านเว็บ — quota โทเค็น LLM และ rate limit ของ การสนทนา คิดจากผู้ใช้คนเดียวกันไม่ว่าจะเรียกจาก browser หรือ API Key เช็คโควตาที่เหลือได้จากหน้า Credentials

Voice API มีลิมิตต่อผู้ใช้ของตัวเอง (ค่าเริ่มต้น: ถอดเสียง 60 ครั้ง/นาที, อ่านออกเสียง 300 ครั้ง/นาที) และไม่ผูกกับ แพ็กเกจ — ค่าใช้จ่ายคิดตามโมเดลเสียงที่ agent เลือก ส่วนข้อความที่ถอดแล้วนำไปส่ง chat ยังนับโควตาของ chat ตามปกติ

แนวทางการใช้งานที่ปลอดภัย
ให้ scope น้อยที่สุดเท่าที่จำเป็น — สคริปต์ที่แค่อ่าน agent ไม่ต้องมี agents:write
แยก API Key ต่อการใช้งาน — เพิกถอนอันเดียวได้โดยไม่กระทบอันอื่น
ตั้งวันหมดอายุถ้าเป็นไปได้ โดยเฉพาะ API Key ที่ใช้ทดสอบชั่วคราว
อย่า commit API Key ลง repo — ใช้ environment variable หรือ secret manager ของ CI
เพิกถอนทันทีที่สงสัยว่าหลุด — มีผลจริงในคำขอถัดไป ไม่ต้องรอ
```

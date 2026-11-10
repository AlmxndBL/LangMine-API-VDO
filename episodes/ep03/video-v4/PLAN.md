# EP03 v4 — แผนเนื้อหาใหม่: Chat API ใน LangMind

Episode ID: `ep03-streaming-chat`<br>
Version: `video-v4`<br>
วันที่เริ่มร่าง: 9 พฤศจิกายน 2026 (Asia/Bangkok)<br>
สถานะ: แผน W3 ปรับตามข้อมูลผู้ใช้; ยังไม่มีบท/storyboard หรือการผลิต

## 1. จุดตั้งต้นและขอบเขต

ผู้ใช้กำหนดให้เปลี่ยนแกนเนื้อหา EP03 ใหม่เป็น **Chat API** โดยแบ่งเป็นสามส่วน:

1. อธิบายการแชทใน LangMind
2. สอนภาพรวม API ที่ใช้กับ Chat ใน LangMind
3. ยกตัวอย่างการนำ API มาใช้ใน Chat

แนวทางนี้ใช้เป็นฐานของ v4; ไม่ใช่การแก้เนื้อหาใน v2, v3 หรือ v3.1. v3.1 คงเป็นรุ่นคลิปล่าสุด ส่วนโฟลเดอร์นี้เก็บแผนของแนวเรื่องใหม่.

### ขอบเขตที่ผู้ใช้ยืนยันแล้ว

- ส่วนที่ 2 ครอบคลุม **Chat API เท่านั้น** ตาม endpoint ที่ผู้ใช้ส่งมา
- ส่วนที่ 1 เล่า chat จากมุมผู้ใช้ทั่วไป; ส่วนที่ 2–3 พาไปสู่มุมการเชื่อม API สำหรับ developer
- มี `agent_id` สำหรับตัวอย่างอยู่แล้ว จึงไม่สาธิต `GET /api/agents` และไม่รวม API หมวด Agents ในแผนนี้
- ตัวอย่างหลักใช้การส่งข้อความแบบ SSE (`POST /api/chat/message`); แบบ blocking เป็นทางเลือก JSON สั้น ๆ
- API Key อยู่ฝั่ง server; ทุก ID และคำตอบในภาพ/โค้ดเป็น placeholder หรือข้อมูลจำลอง
- ตัดข้อความ “ใช้เวลาไม่ถึง 2 นาที” ออกจาก copy ปัจจุบัน; ค่อยพิจารณาใหม่เมื่อมีการจับเวลาจริง
- เรื่องตัวอย่างที่แนะนำคือผู้ใช้ให้ Agent ช่วยร่างข้อความแจ้งเลื่อนประชุม แล้วขอให้ย่อให้สั้นลง เพื่อเห็นทั้งการถามครั้งแรกและการถามต่อในบทสนทนาเดิม เรื่องนี้เป็นข้อเสนอ ยังไม่ใช่เรื่องที่ผู้ใช้ยืนยัน
- ใช้คลิป EP04 v3 Orus เป็น reference หลักด้านรูปแบบภาพและการเล่า ตามรายละเอียดในหัวข้อ 7; ไม่เรียก API จริงหรือสร้างแอปจริงเพื่อผลิตคลิป

## 2. ผู้ชม คำถาม และคำตอบที่คลิปควรให้

- **ผู้ชม:** ส่วนแรกปูประสบการณ์จากมุมผู้ใช้ทั่วไป; ส่วน API และตัวอย่างมุ่งถึง developer ที่ต้องการต่อ Chat API เข้ากับแอป
- **เหตุผลที่ดู:** เข้าใจประสบการณ์ถาม–ตอบก่อน แล้วเห็นว่าแอปส่งคำถามและรับคำตอบผ่าน Chat API อย่างไร
- **คำถามหลัก:** แชทกับ Agent หนึ่งเรื่องทำงานอย่างไร และแอปจะส่งคำถาม รับคำตอบ และคุยต่อในบทสนทนาเดิมผ่าน Chat API ได้อย่างไร?
- **คำตอบสั้น:** ผู้ใช้ถาม Agent และถามต่อได้; ฝั่งแอปส่ง `agent_id` กับ `query` ผ่าน `POST /api/chat/message`, อ่าน SSE events แล้วเก็บ `conversation_id` ไว้ใช้กับข้อความถัดไป ส่วนการแสดงผลเป็นงานของแอป

### Use case ที่แนะนำ

ใช้ผู้ช่วยที่ตั้งค่าสำหรับช่วยร่างข้อความ: ผู้ใช้ถาม “ช่วยเขียนข้อความแจ้งทีมว่าเลื่อนประชุมเป็น 15:00 น. ให้สุภาพ” แล้วถามต่อว่า “ขอให้สั้นลงอีกนิด”. คำถามที่สองใช้ `conversation_id` เดิมเพื่อเล่าให้เห็นความต่อเนื่อง.

ข้อดีของเรื่องนี้คือไม่ต้องสมมติข้อมูลจริงของร้าน/ผลิตภัณฑ์ และเห็นประโยชน์ของ conversation ต่อผู้ใช้ได้ชัด. ข้อความตอบบนจอจะติดป้ายว่าเป็นตัวอย่างจำลอง ไม่ใช่ผลเรียก API จริงหรือความสามารถค่าเริ่มต้นของ Agent ทุกตัว.

## 3. โครงสามส่วนตามโจทย์ผู้ใช้

| ส่วน | ใจความ | ภาพที่ควรช่วยอธิบาย | หน้าที่เสียง | ข้อความบนจอที่เป็นไปได้ |
|---|---|---|---|---|
| 1. แชทใน LangMind | ผู้ใช้ถาม Agent แล้วได้รับคำตอบและถามต่อ; อธิบาย conversation โดยไม่ลงรายละเอียด endpoint | ภาพแนวคิดผู้ใช้ → Agent → คำตอบ และสถานะถามต่อ; ไม่อ้างว่าเป็นหน้าจอ LangMind จริง | เริ่มจากความต้องการของผู้ใช้ด้วยภาษาธรรมดา | `ถาม → รับคำตอบ → ถามต่อ` |
| 2. ภาพรวม Chat API | จัด endpoint เป็นกลุ่มส่ง/พรีวิว/หยุด, อ่าน/จัดการบทสนทนา, feedback/ดาวน์โหลดไฟล์ | การ์ดแนวตั้งแบ่งหน้าที่เพื่ออ่านทีละกลุ่ม ไม่บีบทุก path ลงเฟรมเดียว | เน้น SSE กับ blocking และหน้าที่ของกลุ่ม API | method/path และ scope `chat:invoke` |
| 3. ตัวอย่างใช้ API ใน Chat | ใช้ `agent_id` ที่มี → ส่งคำถามแรกแบบ SSE → แสดง events → เก็บ `conversation_id` → ส่งคำถามต่อในบทสนทนาเดิม | sequence diagram และตัวอย่าง `curl`/shell แบบ placeholder จาก environment ฝั่ง server | เชื่อมประสบการณ์ผู้ใช้กับ request/events และงานแสดงผลของแอป | `message_start` → `message` → `citations` (ถ้ามี) → `message_end` |

แนะนำให้ใช้ `curl`/shell ตามตัวอย่างเริ่มใช้งานที่ผู้ใช้ส่งมา เพื่อให้เห็น request และ stream โดยตรง; ยังไม่ผูกกับภาษาแอปใด. ไม่กำหนดความยาวก่อนทดลองอ่านบทและฟัง sample.

### โครงจังหวะภาพเบื้องต้น (10 beats)

| Beat | หน้าที่/การเปลี่ยนความเข้าใจ | ภาพและการกระทำ | หน้าที่เสียง/ข้อความ |
|---|---|---|---|
| B1 | เปิดด้วยโจทย์ที่คนทั่วไปคุ้นเคย | ผู้ใช้พิมพ์ขอร่างข้อความแจ้งเลื่อนประชุม; มุมมองเป็นภาพแนวคิดติดป้าย “ภาพจำลอง” | ตั้งคำถามว่าคุยกับ Agent แล้วถามต่อได้อย่างไร |
| B2 | อธิบายประสบการณ์แชท | แสดงคำถาม → Agent → คำตอบตัวอย่างในกรอบสนทนาจำลอง | อธิบายการถาม-ตอบโดยยังไม่ใช้ศัพท์ API |
| B3 | ทำให้เห็นความต่อเนื่อง | ผู้ใช้ขอ “สั้นลงอีกนิด”; คำตอบใหม่ปรากฏในบทสนทนาเดิมและเน้น `conversation_id` | แปลความหมายของบทสนทนาต่อเนื่องด้วยภาษาง่าย |
| B4 | เปลี่ยนจากมุมผู้ใช้สู่มุมผู้พัฒนา | แผนภาพ App/Backend/LangMind; Backend ถือ API Key, `agent_id` เตรียมไว้แล้ว | แยกสิ่งที่ LangMind API ส่งจากสิ่งที่แอปนำไปแสดง |
| B5 | แยก endpoint ส่งคำตอบหลัก | แสดง `/chat/message` (SSE), `/chat/message/blocking` (JSON), `/chat/preview` (published version/channel web) และ `/chat/messages/{id}/stop` | บอกหน้าที่และความต่างแบบกระชับ |
| B6 | จัดการประวัติและบทสนทนา | แสดงรายการ, รายละเอียด, ข้อความ, PATCH ชื่อ/สถานะ, DELETE (ลบถาวร) และเงื่อนไข `agent_id` | อธิบายว่าดูและจัดการบทสนทนาผ่านกลุ่มนี้ |
| B7 | แสดงการทำงานหลังได้คำตอบ | แสดง feedback `1/-1` และ route ดาวน์โหลดไฟล์ generated | ระบุสองงานเสริมและ scope `chat:invoke` |
| B8 | ส่งข้อความแรกจาก Backend | code card แบบ shell/curl ใช้ placeholder token/agent ID และ query เดียวกับ B1; `conversation_id: null` | ไล่ header/body โดยย้ำ key อยู่ฝั่ง server |
| B9 | แสดง stream กลับมาถึงแอป | events ปรากฏตามลำดับ `message_start` → `message` → `citations` (ถ้ามี) → `message_end`; เส้นทาง API → Backend → UI | อธิบายว่าแอปจัดการการแสดงผล และ event สุดท้ายมีคำตอบเต็ม/usage |
| B10 | ปิดวงจรด้วยคำถามต่อ | ส่ง “ขอให้สั้นลงอีกนิด” ด้วย `conversation_id` เดิม; จบท้ายด้วย 3 ขั้นตอน | สรุป: ใช้ Agent ID ที่มี, ส่งข้อความ, เก็บ conversation ID เพื่อคุยต่อ |

จำนวน 10 beats เป็นโครงร่าง ไม่ใช่เวลาที่ล็อกแล้ว; อาจรวม B2–B3 หรือแยก B5 หากการอ่าน endpoint บนมือถือแน่นเกินไป.

### Asset manifest เบื้องต้น (ยังไม่มีไฟล์ผลิต)

| ID | ใช้ใน | รูปแบบ/แหล่ง | สถานะ |
|---|---|---|---|
| `SCR-CHAT-01/02/03` | B2–B3, B10 | raster ภาพจำลองบทสนทนา 3 สถานะ; ข้อความ/continuity ออกแบบใน storyboard | แบบร่างมีแล้ว; ยังไม่สร้าง/ตรวจภาพจริง |
| `DIA-APP-01` | B4 | diagram แสดงผู้ใช้, แอป, Backend และ Chat API | screen spec มีแล้ว; ยังไม่ทำ |
| `API-GROUP-01/02/03` | B5–B7 | infographic จัด route ตามหน้าที่ ไม่ใช่ product UI | screen specs มีแล้ว; ยังไม่ทำ |
| `CODE-REQUEST-01` | B8 | shell command text ใช้ placeholder; อ่านจาก server environment | มีใน script; ยังไม่ทดสอบ 9:16 |
| `SSE-EVENT-01` | B9 | event response เป็นข้อมูลจำลองและติดป้าย | screen spec มีแล้ว; ยังไม่ทำ |
| `BRAND-LOGO` | เปิด/ปิด | โลโก้จริงจาก shared assets ตามคู่มือแบรนด์ | ต้องเลือกไฟล์และตรวจใน W5 |
| `ROBOT-ACCENT` | B10 ถ้ามีหน้าที่ | ใช้ตัวละคร shared เป็นตัวช่วยชี้/สรุป ไม่บังคับให้ปรากฏทุกฉาก | ยังไม่จัด pose |
| `VOICE-SAMPLE` | sample ก่อนผลิต | บทต่อเนื่องสั้นมีชื่อเฉพาะ คำถาม และคำอธิบาย; เลือกเสียงหลังผู้ใช้ฟัง | ยังไม่ทำ |
| `HF-118 Code Typing` | B8 | candidate Catalog สำหรับ code request; preview observation เดิมอยู่ใน `CATALOG-v4.md` | shortlist; ยังไม่ติดตั้ง/test |
| `HF-196 Code Terminal Run` | B9 | candidate Catalog สำหรับ event output ที่ติดป้ายจำลอง | shortlist; ยังไม่ติดตั้ง/test |

## 4. Chat API ที่มีหลักฐานในเอกสารที่ส่งมา

Base URL ที่ระบุใน snapshot คือ `https://langmind.in.th/api`. endpoint ในตารางเป็นเอกสารอ้างอิง ไม่ใช่คำสั่งให้เรียกใช้งานจริง.

| Method | Path | หน้าที่ตามเอกสาร | Scope |
|---|---|---|---|
| `POST` | `/api/chat/message` | ส่งข้อความ; ส่ง response เป็น SSE stream (ค่าเริ่มต้น) | `chat:invoke` |
| `POST` | `/api/chat/preview` | พรีวิว Agent ใน Agent Builder; SSE และ channel `web` | `chat:invoke` |
| `POST` | `/api/chat/message/blocking` | ส่งข้อความและรอ JSON คำตอบเต็ม | `chat:invoke` |
| `POST` | `/api/chat/messages/{id}/stop` | หยุด stream ที่ทำงานอยู่; ใช้ `message_id` จาก `message_start` | `chat:invoke` |
| `GET` | `/api/chat/conversations` | รายการบทสนทนา; ใช้ `agent_id`, cursor และ limit | `chat:invoke` |
| `GET` | `/api/chat/conversations/{id}` | รายละเอียดบทสนทนา; ใช้ `agent_id` | `chat:invoke` |
| `GET` | `/api/chat/conversations/{id}/messages` | อ่านข้อความในบทสนทนา; ใช้ `agent_id`, cursor และ limit | `chat:invoke` |
| `PATCH` / `DELETE` | `/api/chat/conversations/{id}` | แก้ข้อมูล/สถานะ หรือเลือกลบบทสนทนา | `chat:invoke` |
| `POST` | `/api/chat/messages/{id}/feedback` | ให้คะแนน `1` หรือ `-1` | `chat:invoke` |
| `GET` | `/api/chat/messages/{id}/generated-files/{file_id}` | ดาวน์โหลดไฟล์ที่ Agent สร้าง | `chat:invoke` |

การอ่าน Agent ด้วย `GET /api/agents` ใช้ scope `agents:read`; ไม่ใช่ scope ของ Chat endpoint. Protected request ใช้ `Authorization: Bearer <API_KEY>`. เอกสารระบุว่าคีย์ Personal API แสดงเต็มครั้งเดียวและควรเก็บใน secret store/password manager; ตัวอย่างการเรียกควรอ่านจาก environment variable และห้ามใส่ secret ใน browser bundle, repository หรือคลิป.

## 5. หลักฐานและการแยกข้อมูล

### Documented ในแหล่งอ้างอิงที่ให้มา

- Personal API Key ใช้ Bearer authentication; scope เลือกตาม endpoint
- `GET /api/agents` ใช้ดู Agent และต้องมี `agents:read`
- Chat API ในตารางต้องใช้ `chat:invoke`
- `POST /api/chat/message` รับ `agent_id`, `query`, `conversation_id` และตัวอย่างมี `attachment_ids`; response เป็น `text/event-stream`
- ลำดับ event ในตัวอย่าง: `message_start` → `message` (answer chunks) → `citations` (ถ้ามี) → `message_end`; event สุดท้ายมี answer ฉบับเต็มและ usage
- `conversation_id: null` ใช้เริ่มบทสนทนาใหม่ในตัวอย่าง; `message_end` ส่งรหัสบทสนทนา/ข้อความกลับมา
- `POST /api/chat/message/blocking` ให้พฤติกรรมการตอบแบบเดียวกันใน JSON ก้อนเดียว
- Preview ใช้ browser session หรือ Personal API Key ตามเอกสาร, resolve published version และจัด conversation เป็น channel `web`
- endpoint อ่าน conversation/message ต้องส่ง `agent_id`; รายการที่ใช้ cursor ส่ง `next_cursor` สำหรับหน้าถัดไป

### Illustrative หรือข้อความเสนอ

- `agent_id`, ID, คำถาม, event answer, citation, score, token count, cost, latency และวันที่ใน payload ที่ยกตัวอย่างเป็นค่าตัวอย่าง/placeholder ไม่ใช่ผลทดสอบ live
- ตัวอย่างคำตอบเรื่องราคาและ citations ในเอกสารไม่ใช้เป็นคำตอบจาก LangMind ในคลิป
- ข้อความ “จากสร้าง API Key ถึงเรียก API ตัวแรก ใช้เวลาไม่ถึง 2 นาที” ถูกตัดออกจากแผนปัจจุบันตามคำตอบผู้ใช้; หากจะนำกลับมาใช้ภายหลังต้องตรวจจับเวลาใน workflow จริงก่อน
- ภาพรายการ endpoint ที่ผู้ใช้ส่งมาเป็นข้อมูลอ้างอิง ไม่ถือเป็น asset ที่คัดลอกเข้า video

### Unknown / ยังต้องยืนยัน

- เรื่องผู้ช่วยร่างข้อความเป็นข้อเสนอของแผน ยังไม่ได้รับการยืนยันจากผู้ใช้
- ตัวอย่าง `agent_id` และคำตอบสุดท้ายยังเป็น placeholder/ข้อมูลจำลอง; ไม่ต้องใช้ ID หรือ secret จริงในเอกสารผลิต
- ภาษาแอปจริงยังไม่ระบุ; แนวทางแผนเสนอ `curl`/shell เป็นตัวอย่าง API แบบสั้น
- ระดับรายละเอียดของ `user_id`, `channel=line`, `input_mode=voice` และ attachments ถูกพักไว้นอกตัวอย่างหลัก
- behavior ปัจจุบันของ live API; แผนนี้อิง snapshot และตัวอย่างจากผู้ใช้ ไม่ได้ยิง request จริง

## 6. ข้อจำกัดและสิ่งที่จะไม่สรุปเกินหลักฐาน

- ไม่แสดง API Key จริง ไม่เรียก live/paid API และไม่ใช้ข้อมูลตัวอย่างใน payload เป็นผลลัพธ์จริง
- ไม่อ้างว่า SSE เร็วกว่า, API ทำ UI ให้, answer/citation/usage จะมีค่าเฉพาะตามตัวอย่าง หรือ preview แสดง draft ที่ยังไม่ publish
- ไม่ใส่ตัวเลขเวลา ความเร็ว ค่าใช้จ่าย หรือ latency จาก payload ตัวอย่างเป็น metric ของระบบ
- การลบบทสนทนาเป็นการลบถาวรตามเอกสาร; หากกล่าวถึงต้องเตือนความหมายให้ชัด และไม่ใช้ในตัวอย่างหลักโดยไม่จำเป็น
- demo UI และ code snippet ต้องติดป้ายว่าเป็นภาพ/โค้ดอธิบาย ไม่ใช่หน้าจอ official หรือผลทดสอบ

## 7. แนวทางภาพและ motion จาก reference สำหรับ W4 (Catalog shortlist)

ใช้ [EP04 v3 Orus](../../ep04-voice-api/video-v3-orus/ep04-v3-orus.mp4) เป็น reference หลัก. ไฟล์เป็นวิดีโอแนวตั้ง 1080×1920, 30 fps, ยาว 138.1 วินาที; review ระบุ 9 beats และ 27 caption. จาก contact sheet ที่สุ่มดูทุก 15 วินาที เห็นแนวทางดังนี้:

- พื้นกระดาษสีครีมมีเส้นบาง, หัวตอน/ป้ายบอกภาพจำลองที่ตำแหน่งคงที่, การ์ดเส้นเขียวและ accent เขียวเข้ม/เหลือง; stylesheet ใช้ Sarabun และ palette หลัก `#f8f4e9`, `#20352c`, `#38815A`, `#1E7578`, `#8d732c`, `#a2b78d`
- แสดงภาพเป็นขั้น มีตัวเลขความคืบหน้า ลูกศรและการ์ดข้อมูล; code/request ใช้กล่องสีเขียวเข้ม ส่วนคำบรรยายอยู่แถบล่างที่อ่านได้บนจอมือถือ
- motion ใน source ใช้ reveal สั้น ๆ แบบ fade/ยก/เลื่อน/pop, วาดเส้นลูกศร, จุดเคลื่อนตามเส้น, เน้น step และ pulse การ์ดที่กำลังพูดถึง; สำหรับ v4 ให้เลือก Catalog ที่ทำหน้าที่เดียวกันหลังเปิดดู preview ไม่ถือว่า motion source เดิมเป็น Catalog
- เล่าเป็นภาษาพูดต่อเนื่อง: hook ด้วยเหตุการณ์คุ้นเคย → ภาพรวม → เตรียม → เชื่อมทีละขั้น → ผลที่ได้ → สรุป; ใช้ character/robot เป็นตัวช่วยเฉพาะจังหวะที่มีหน้าที่
- สำหรับ EP03 ปรับ motif เป็น `เข้าใจแชท → รู้จัก Chat API → ลองส่งคำถาม`; ใช้เรื่องตัวอย่างเดียวต่อเนื่องทั้งสามส่วน แต่ไม่ยกข้อความ sponsor/CTA ของ EP04 มาใช้
- ยึด 9:16 และภาษาภาพเป็นฐาน; ไม่ล็อกความยาว 138.1 วินาทีตาม reference. จับเวลาจากบทและเสียงจริงตาม workflow
- แสดง API flow/diagram และภาพจำลองพร้อมป้ายกำกับ; ไม่คัดลอกภาพหน้าจอ/API card ของ EP04 มาเป็น asset และไม่ทำ HTML chat UI ปลอม
- shortlist Catalog ที่ทำงานกับ code reveal/output และหลักฐาน preview มีใน [CATALOG-v4.md](CATALOG-v4.md); ยังไม่ติดตั้งหรือทดสอบใน composition v4
- หน้าจอแต่ละภาพต้องมี ID, ข้อความ, layout, state, crop/zoom, continuity และส่วนคงเดิม/เปลี่ยน ก่อนสร้าง raster asset

Storyboard และแบบหน้าจออยู่ใน [STORYBOARD-v4.md](STORYBOARD-v4.md), บทเต็มอยู่ใน [SCRIPT-v4.md](SCRIPT-v4.md), Catalog shortlist อยู่ใน [CATALOG-v4.md](CATALOG-v4.md). ยังไม่สร้างภาพจริง, ไม่เขียน HTML demo UI, ไม่สร้างเสียง และไม่ผลิต timeline ในขั้นนี้. การสังเกตวิดีโออ้างอิงเป็น sample เฟรม ไม่ใช่การตรวจทุกเฟรมหรือฟังทั้งตอนใหม่.

## 8. ความพร้อมและขั้นถัดไป

W3 ขอบเขตตามคำตอบผู้ใช้แล้ว; W4 มีบทเต็ม, storyboard 10 beats และ screen specs ครบในระดับ draft. Storyline ใช้ผู้ช่วยร่างข้อความเป็น working recommendation ตามที่ผู้ใช้ขอให้แนะนำ. ยังไม่พร้อมเริ่ม timeline เต็ม: W5 ต้องตรวจบท/ภาพบนมือถือ, สร้างและตรวจ raster screens, ทดสอบ Catalog candidates ใน 9:16, ทำ voice audition แล้วให้ผู้ใช้เลือกเสียงก่อน. รอบนี้หยุดก่อนทำภาพ/เสียง/คลิปตามคำสั่งเดิม.

## 9. แหล่งข้อมูล

- [LangMind API snapshot](../../../langmind-api.md) — ใช้ส่วน “ต้นฉบับครบทุกหมวด” เป็นเอกสารอ้างอิง provider ตามข้อกำหนด workspace
- ตัวอย่าง request/events และข้อความเริ่มใช้งานที่ผู้ใช้แนบในแชทนี้
- ภาพรายการ Chat API ที่ผู้ใช้แนบในแชทนี้; ใช้ตรวจขอบเขตและชื่อ route ไม่ได้นำภาพมาเป็น asset ในคลิป
- [EP04 v3 Orus — review](../../ep04-voice-api/video-v3-orus/REVIEW.md) และ [voice script](../../ep04-voice-api/video-v3-orus/VOICE-SCRIPT.md); คลิปอ้างอิง SHA-256 `72E55B4EB05E8851C216514EA0F491DCA28E7762ABD528D2467ED034C120FCB4`
- [EP04 v3 Orus — stylesheet](../../ep04-voice-api/video-v3-orus/style.css) และ [motion source](../../ep04-voice-api/video-v3-orus/motion.js) ใช้เป็นหลักฐานของ palette, ฟอนต์และหน้าที่ motion; ไม่ได้คัดลอก code เข้า v4
- วิเคราะห์ลักษณะภาพจาก contact sheet 9 เฟรมที่สุ่มทุก 15 วินาที และอ่าน review/script; ยังไม่ได้ตรวจครบทุกเฟรมหรือฟังเสียงทั้งคลิปในรอบนี้

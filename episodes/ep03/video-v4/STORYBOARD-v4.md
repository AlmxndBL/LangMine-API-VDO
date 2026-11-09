# EP03 v4 — Storyboard และแบบหน้าจอ

สถานะ: storyboard draft สำหรับทบทวน; ยังไม่สร้างภาพ, เสียง, composition หรือ timeline  
รูปแบบตั้งต้น: 9:16, 1080×1920, 30 fps ตามคลิปอ้างอิงและคู่มือซีรีส์; ความยาวรอเสียงจริง  
สคริปต์คู่กัน: [SCRIPT-v4.md](SCRIPT-v4.md) · หลักฐาน API: [PLAN.md](PLAN.md)

## หลักฐานและ continuity

- ทุกภาพแชทมีป้าย `ภาพจำลอง`; ไม่ใช้ชื่อ/โลโก้หรือหน้าตาแบบทางการของผลิตภัณฑ์
- ผู้ใช้ขอร่างข้อความแจ้งเลื่อนประชุม 15:00 น. และถามต่อให้สั้นลง เป็นเหตุการณ์เดียวที่เดินผ่านทั้งตอน
- คำตอบในภาพเป็นข้อความสมมติที่แต่งเพื่ออธิบาย ไม่ใช้ตัวอย่าง answer, citations, score, usage, cost หรือ latency จาก snapshot เป็นผลจริง
- องค์ประกอบคงที่: kicker `EP03 / CHAT API`, ป้าย `ภาพจำลอง` เมื่อเป็นภาพจำลอง, พื้นและสีตาม reference, ซับไทยกลางกรอบตาม style guide
- ไม่แสดงโลโก้ใน mock chat card; ใช้โลโก้จริงเฉพาะฉากเปิด/ปิดหลังเลือกไฟล์จาก shared brand assets และตรวจตามคู่มือ
- Robot เป็นตัวช่วยเฉพาะตอนชี้ลำดับหรือสรุป; ไม่จำเป็นต้องปรากฏในทุกภาพ
- ข้อความใน raster ต้องสะกดและตรวจบรรทัดก่อนสร้าง; code/path ใช้ text layer ที่แก้ไขได้ ไม่ฝังในภาพแชท

## ลำดับซีน

| Beat | คำถามก่อน / ความเข้าใจหลัง | เริ่ม → การกระทำ → จบ | Focus / framing | เสียง, ซับ, ข้อความเน้น | Motion / continuity | หลักฐาน / ตรวจรับ |
|---|---|---|---|---|---|---|
| B1 | ทำไมต้องดู? → แชทเรื่องใกล้ตัวที่มีการแก้ต่อ | คำถาม “ขอร่างข้อความ” อยู่กลางภาพ → วลี “ขอแก้ต่อ” ปรากฏเป็นสิ่งที่ผู้ใช้ต้องการ → ค้างที่โจทย์หนึ่งเรื่อง | หนึ่งการ์ดข้อความขนาดใหญ่; ไม่มี UI chrome หรือโลโก้ | บท B1; เน้น `ขอร่าง` / `แก้ต่อ` | เปิดด้วยภาพเหตุการณ์ทันที; cut ตรงเข้า B2 | Illustrative; อ่านได้ที่ขนาด 360×640 และไม่ดูเหมือน UI จริง |
| B2 | Agent ช่วยอย่างไร? → ผู้ใช้ส่งคำถามและอ่านคำตอบ | คำถามผู้ใช้ปรากฏ → คำตอบจำลองวางต่อในบทสนทนา → คงทั้งคู่พร้อมป้าย | `SCR-CHAT-01`; ครอปให้เห็นคำถามและคำตอบ ไม่เห็น browser/app chrome | บท B2; ป้าย `ภาพจำลอง` | ภาพนิ่ง/ขยับ crop เล็กน้อย; ไม่เพิ่มข้อความที่เสียงไม่ได้รองรับ | ภาพแนวคิด; ตรวจคำไทย, เวลาอ่าน, ความต่างผู้ใช้/Agent |
| B3 | ถ้าคำตอบยังไม่พอดี? → ถามต่อในบทเดิมได้ | ข้อความใหม่ “ขอให้สั้นลงอีกนิด” ต่อท้าย → คำตอบสั้นปรากฏ → ขีดเน้นว่าอยู่ในชุดสนทนาเดียวกัน | `SCR-CHAT-02`; geometry เดิมกับ B2, แสดงเฉพาะสถานะใหม่ | บท B3; ป้าย `ภาพจำลอง` | ใช้ cut จาก B2 รักษาตำแหน่งการ์ด; ไม่มี false typing status | ภาพจำลอง; ตรวจ continuity ของกรอบและเนื้อหา |
| B4 | API กับแอปทำหน้าที่อะไร? → Backend เรียก API, แอปจัดการการแสดงผล | เริ่มจากผู้ใช้/แอป → เพิ่ม Backend ที่ถือ Key → วาดเส้นไป Chat API และกลับ → จบที่แอปแสดงคำตอบ | `DIA-APP-01`; แผนภาพเรียงแนวตั้ง 4 ชั้นเพื่อเหมาะ 9:16 | บท B4; label `รับคำถาม`, `เก็บ Key`, `เรียก Chat API`, `แสดงผล` | เปิดทีละ node ตามคำพากย์; ลูกศรเป็นองค์ประกอบคงที่หลังแสดง; ยังไม่ใช้ Catalog ที่ยังไม่ preview | Documented distinction: scope ของคลิป; ตรวจทิศทาง request/response และไม่เผย key |
| B5 | มี endpoint ส่งข้อความแบบไหน? → SSE เป็นค่าเริ่มต้น, blocking รวมเป็น JSON | การ์ด `message` ขึ้นก่อน → เทียบการรับ SSE กับ blocking JSON → ตามด้วย preview และ stop | `API-GROUP-01`; เรียงการ์ดบนลงล่าง ไม่วาง side-by-side | บท B5; path คงเต็มและ scope `chat:invoke` | reveal ทีละกลุ่ม; ใช้ static hold ให้ path อ่านทัน; ไม่มีการอ้างความเร็ว | Documented; preview ระบุ published version/channel web; stop ใช้ message ID จาก start |
| B6 | จะอ่านหรือจัดการประวัติอย่างไร? → มี route สำหรับ list/read/update/delete | กลุ่ม route อ่านรายการ → รายละเอียด → messages → เปลี่ยนชื่อ/สถานะ → ป้ายเตือนลบถาวร | `API-GROUP-02`; 5 รายการ แบ่งเป็น 2 frame ย่อยต่อเนื่องใน beat เดียวหากแน่น | บท B6; note `agent_id จำเป็น` และ `DELETE ลบถาวร` | เปิด 3 read endpoints แล้วเปลี่ยนเป็น PATCH/DELETE; transition เป็น cut/hold | Documented; ตรวจว่า `agent_id` อยู่ใน query ทุก route conversation ที่กำหนด |
| B7 | ยังทำอะไรได้หลังคำตอบ? → ให้ feedback และดาวน์โหลด generated file | เส้นทาง feedback ปรากฏ → เลือกค่าที่อนุญาต `1/-1` → route generated files ปรากฏ | `API-GROUP-03`; สองการ์ดใหญ่และ note scope | บท B7; `rating: 1 หรือ -1`, `chat:invoke` | highlight แต่ละการ์ดตามเสียง; ไม่แสดงคะแนนตัวอย่างหรือไฟล์จริง | Documented; ตรวจ method/path และไม่ทำคะแนนเป็นสเกล 1–5 |
| B8 | ส่ง request แรกอย่างไร? → Key อยู่ server และ body มี Agent, query, conversation | กล่อง secret อยู่ฝั่ง Backend → command เริ่มพิมพ์ → body fields ปรากฏและหยุดที่ `conversation_id: null` | `CODE-REQUEST-01`; code เป็น text/code layer ไม่ใช่ screenshot terminal; max 4–5 บรรทัดต่อจังหวะ | บท B8; ป้าย `ตัวอย่างคำสั่ง · placeholder · ไม่ได้เรียก API จริง` | HF-118 Code Typing candidate; เปิดทีละส่วน, pause เมื่ออธิบาย key และ body | Documented contract; code syntax ตรวจ shell; token/agent ID ไม่ใช่ secret จริง; อ่านได้บนมือถือ |
| B9 | Stream กลับมาเป็นอะไร? → events มีหน้าที่ต่างกันและ UI เป็นงานของแอป | คำสั่งจบ → output mock แสดง `message_start` → `message` → optional `citations` → `message_end` → เส้นทางกลับไป UI | `SSE-EVENT-01`; 4 แถว event ใหญ่, label `ข้อมูลจำลอง` ชัด | บท B9; callout ว่า start มี IDs, message chunks, citations อาจมี, end มี full answer/usage | HF-196 Code Terminal Run candidate; cues ค่อยแสดงทีละบรรทัด; ไม่ทำเป็น terminal output จาก API จริง | Documented event order, illustrative values; ตรวจว่า citations ติดป้าย optional และ API/แอปไม่ปะปน |
| B10 | ถามต่อทำอย่างไร? → ส่ง conversation ID เดิม | ผู้ใช้พิมพ์คำถามต่อใน `SCR-CHAT-03` → code body ใช้ ID เดิม → สรุปสามขั้น | เริ่ม crop จาก B3 แล้ว match ไปที่ JSON field; จบด้วย `เลือก endpoint → ส่งข้อความ → เก็บ conversation_id` | บท B10; ป้าย mock ยังคงอยู่ | Match crop จาก B3 ไปที่ body; จบด้วยนิ่งให้ซับสรุปอ่านทัน | Documented field `conversation_id`; illustrative chat; ตรวจ continuity และไม่สื่อว่า API สร้าง UI |

## แบบหน้าจอก่อนสร้างภาพ

### `SCR-CHAT-01` — คำถามและคำตอบแรก (B2)

- **วัตถุประสงค์:** ให้ผู้ชมทั่วไปเห็นตัวอย่างการแชทก่อนเห็น API
- **ข้อความไทยที่ต้องมี:** `ช่วยร่างข้อความแจ้งทีมว่าเลื่อนประชุมเป็น 15:00 น. ให้สุภาพ` และ `ขอแจ้งเลื่อนประชุมเป็นเวลา 15:00 น. ขอบคุณครับ`
- **Label:** `ภาพจำลอง`
- **Layout:** portrait card เดียวอยู่กลางพื้นที่; user request อยู่ด้านบน, answer ด้านล่าง, ผู้พูดมี label สั้น ๆ; ไม่มี avatar หรือโลโก้ที่อ้างว่าเป็น official
- **State:** หลังส่งข้อความแรกและเห็นคำตอบตัวอย่างแล้ว
- **Continuity:** palette/มุม/ขนาดกล่องต้องเหมือน `SCR-CHAT-02/03`; สถานะถัดไปเพิ่มข้อความ ไม่ย้ายกรอบเดิม
- **Output:** raster ที่ออกแบบจากข้อความระบุไว้; ตรวจ spelling, contrast และ crop ก่อนรับเข้า timeline

### `SCR-CHAT-02` — คำถามต่อและคำตอบที่ปรับแล้ว (B3)

- **วัตถุประสงค์:** เห็นการถามต่อในหัวข้อเดิม
- **ข้อความไทยที่ต้องมี:** ข้อความทั้งหมดของ `SCR-CHAT-01` พร้อม `ขอให้สั้นลงอีกนิด` และ `ประชุมเลื่อนเป็น 15:00 น. นะครับ`
- **Label:** `ภาพจำลอง`
- **Layout:** reuse geometry ของ `SCR-CHAT-01`; แสดงข้อความใหม่ด้านล่าง และลดความเด่นของข้อความเก่าโดยไม่ลบความสัมพันธ์
- **State:** คำถาม follow-up ได้รับคำตอบแล้ว
- **Continuity:** ห้ามเปลี่ยน font, padding, สีผู้พูด, ตำแหน่งการ์ดหรือความกว้าง; B10 crop กลับมายังข้อความนี้
- **Output:** raster state ที่สอง; เทียบกับ state แรกก่อนนำไปใช้

### `SCR-CHAT-03` — แชทเดิมตอนสรุป (B10)

- **วัตถุประสงค์:** ปิดประสบการณ์ผู้ใช้และเชื่อมกลับสู่ API
- **เนื้อหา:** reuse `SCR-CHAT-02`; highlight เฉพาะคำถามต่อ, ไม่เพิ่มคำตอบใหม่
- **Label:** `ภาพจำลอง`
- **Layout/crop:** crop ที่ตำแหน่งเดียวกับ B3 เพื่อ match cut; เหลือพื้นที่ให้ subtitle กลางกรอบ
- **State/continuity:** เหมือน `SCR-CHAT-02` ทุกอย่างยกเว้นตำแหน่ง highlight

### `DIA-APP-01` — แผนภาพผู้ใช้/แอป/Backend/Chat API (B4)

- **ข้อความ:** `ผู้ใช้`, `แอปของคุณ`, `Backend`, `LangMind Chat API`; งาน: `รับคำถาม`, `เก็บ API Key`, `เรียก endpoint`, `ส่งผลให้แอปแสดง`
- **Layout:** stack แนวตั้ง 4 node; เส้นทาง request ลงด้านล่างและ response กลับขึ้น; API Key อยู่ภายใน Backend เท่านั้น
- **State:** request และ response ครบ; ไม่มี key value หรือข้อมูลผู้ใช้
- **Layering:** vector/HTML diagram แก้ข้อความได้; ไม่ใช่ product UI และไม่ต้อง rasterize
- **Motion:** reveal ตามลำดับ; ลูกศรชี้ทิศทางแต่ไม่เคลื่อนไหวหากไม่มี Catalog preview ที่เหมาะ

### `API-GROUP-01` — ส่ง/พรีวิว/หยุดคำตอบ (B5)

- **ข้อความ:** route/method และหน้าที่ตาม `SCRIPT-v4.md`; `scope: chat:invoke`
- **Layout:** 4 cards stacked; card แรก (`POST /api/chat/message`) เด่นสุด, blocking เป็นคู่เทียบ, preview/stop อยู่ในแถวรอง
- **State:** cards ปรากฏทีละกลุ่ม; preview มี footnote `published version · channel web`
- **Crop/zoom:** ไม่ซูมจน path หลุด; แต่ละการ์ดใช้พื้นที่เต็มแนวตั้ง; ห้ามยัด 4 path เป็นตารางตัวเล็ก
- **Output:** editable infographic composition; ตรวจทุก path กับ provider snapshot

### `API-GROUP-02` — ประวัติและจัดการบทสนทนา (B6)

- **ข้อความ:** `GET /api/chat/conversations`, `GET /api/chat/conversations/{id}`, `GET /api/chat/conversations/{id}/messages`, `PATCH /api/chat/conversations/{id}`, `DELETE /api/chat/conversations/{id}` พร้อมโน้ต `agent_id จำเป็น` และ `DELETE ลบถาวร`
- **Layout:** แบ่ง 2 สถานะตามหน้าที่: read (3 routes) และ update/delete (2 routes); หลีกเลี่ยงแสดงทุกคำอธิบายพร้อมกัน
- **Continuity:** same card style, path ใช้ monospace; หัวข้อและ scope ไม่เปลี่ยน
- **Output:** infographic editable; เช็กพาธ, method และ query requirement

### `API-GROUP-03` — Feedback และไฟล์ที่สร้าง (B7)

- **ข้อความ:** feedback route + `rating 1/-1`; generated-file route; `scope: chat:invoke`
- **Layout:** 2 การ์ดใหญ่ แยก `ให้คะแนน` กับ `ดาวน์โหลด`; ไม่มีคะแนนหรือไฟล์จาก request จริง
- **State:** route ทั้งสองชัดก่อนซีนเปลี่ยน
- **Output:** infographic editable; ตรวจ rate domain ไม่ให้ดูเป็น 1–5

### `CODE-REQUEST-01` — Request แรก (B8)

- **เนื้อหา:** code block ตาม B8 ใน `SCRIPT-v4.md`; ตัวแปร `LM_TOKEN`, placeholder `<AGENT_ID>`, query เดียวกับภาพ B2 และ `conversation_id: null`
- **Layout:** portrait code panel กว้าง 80% frame; ตัดการบรรทัดให้คำสั่งอ่านได้, แสดงไม่เกิน 5 บรรทัดต่อช่วง; ไม่ใส่ prompt ที่ดูเหมือน shell บนเครื่องจริง
- **State:** key env → method/path → header → body; จบที่ ID/query fields
- **Continuity:** ใช้ code typeface ชัด; สี accent ตาม reference แต่ contrast ต้องผ่าน; label `ตัวอย่างคำสั่ง` คงที่
- **Layering:** text จาก source code layer แก้ไขได้; ไม่ใช้ screenshot หรือ raster code

### `SSE-EVENT-01` — Event response (B9)

- **ข้อความ:** `message_start`, `message`, `citations (ถ้ามี)`, `message_end`; คำอธิบายหน้าที่ตามบท
- **Layout:** กล่องแนวตั้งสี่แถว; `message` อาจปรากฏหลายช่วงแต่ใช้ข้อความ ellipsis; label `ข้อมูลจำลอง` อยู่เหนือกล่องตลอด
- **State:** event เติมทีละบรรทัดตาม cue; เส้น connector ชี้จาก API ผ่าน Backend ไป UI
- **Continuity:** ID/answer เป็น placeholder ไม่ใส่ตัวอย่างราคาหรือ citations จาก snapshot; end state ใช้ field names อย่างเดียว
- **Layering:** text/vector diagram editable, ไม่ใช่ screenshot ผลจริง

## การตรวจ storyboard ก่อน W5

- อ่านเฉพาะภาพและการกระทำ ต้องตามเหตุการณ์ผู้ใช้หนึ่งเรื่องได้จาก B1 ถึง B10
- ทุก route อ่านได้บนมือถือ; หากแน่นให้แบ่งภาพ/เวลามากขึ้น ไม่ลดขนาด font เพื่อยัด
- บทพากย์กับซับไม่อ่าน path ทีละตัวอักษร; ให้ภาพและ voice แบ่งหน้าที่กัน
- แยก documented API behavior ออกจากภาพจำลองของข้อความ Agent และงานที่แอปทำเอง
- ตรวจแบบและ continuity ของ raster chat screens ก่อนสร้าง; ยังไม่มีภาพจริงเพื่อรับรอง visual quality
- Catalog item ใน storyboard เป็น candidate ตาม [CATALOG-v4.md](CATALOG-v4.md); ยังไม่ติดตั้งหรือทดสอบบน timeline แนวตั้ง

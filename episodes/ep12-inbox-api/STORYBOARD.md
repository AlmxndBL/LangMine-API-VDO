# EP12 — Storyboard และแบบกำหนดหน้าจอ v1 (Inbox API)

เอกสารอ้างอิง: [PLAN](PLAN.md), [SCRIPT](SCRIPT.md), [CATALOG](CATALOG.md), และ [WORKFLOW](../../docs/WORKFLOW.md)
สถานะ: ตรงกับ draft v1 ที่ render แล้ว ([video/ep12-inbox-draft-v1.mp4](video/ep12-inbox-draft-v1.mp4), ยังไม่มีเสียง) · ฉากทั้งหมดอยู่ใน [video/build.mjs](video/build.mjs) การเคลื่อนไหวอยู่ใน [video/motion.js](video/motion.js)

---

## 1. แนวภาพและระบบการแสดงผล (Visual System)

ใช้ระบบเดียวกับ EP04 video-v3 เพื่อให้ซีรีส์ต่อเนื่องกัน

* **สไตล์หลัก**: Editorial Paper & Sage Ink — อินโฟกราฟิกเทคนิคบนพื้นกระดาษ
* **สัดส่วนและขนาด**: 9:16 (1080×1920, 30 fps)
* **ชุดสี**:
  * พื้นหลังกระดาษ `#F5F1E7` · หมึกเข้ม `#20352c`
  * สีประจำการเชื่อม 4 แบบ (ใช้ทั้งเลขหัวข้อ, minimap, ไฮไลต์):
    1. รายการแชท — เขียวเซจ `#38815A`
    2. ข้อความ — ทองหม่น `#8d732c`
    3. คุมสาย — ฟ้าอมเขียว `#1E7578`
    4. export — ม่วงคราม `#5b5f9e`
  * สีเตือน (ทำไม่ได้ด้วย Key) — แดงอิฐ `#9b3b2b`
* **ตัวอักษร**: Sarabun ในวิดีโอ · Noto Sans Thai Looped ในภาพหน้าจอแอปจำลอง
  * หัวเรื่อง 72px · ข้อความรอง 40px · ป้าย/โค้ด 30–38px · **ขั้นต่ำ 28px** (อ่านได้บนมือถือ)
* **โครงทุกซีน**: kicker “EP12 / INBOX API” ซ้ายบน · ป้าย “ภาพจำลอง” ขวาบน · แถบความคืบหน้า (เตรียม → เชื่อม → ใช้ผล) · ซับล่างจอ
* **พื้นที่ปลอดภัย**: x=92–988 · ซับอยู่โซนล่าง ไม่วางข้อความสำคัญทับ

---

## 2. รายละเอียด Storyboard ราย Beat (b1 – b11)

| Beat / เวลา (ประมาณ) | สงสัยก่อน → เข้าใจหลัง | ภาพเริ่ม → การเคลื่อนไหว → ภาพจบ | ข้อความเน้น | Assets / Catalog |
|---|---|---|---|---|
| **b1** (18.5s) | AI ตอบ LINE แล้ว ทำไมยังต้องทำอะไรอีก? → ทีมอยากเห็นแชทในระบบหลังบ้านเอง | มือถือแสดงแชท LINE (APP-INBOX-CHAT) ซูมเข้าการ์ดแชท → สลับเป็นหน้ากล่องแชทของร้าน (APP-INBOX-INBOX) → ชิป 3 คำถามขึ้นทีละอัน | เตรียมอะไร? · เชื่อมตรงไหน? · ใช้ผลยังไง? | Device Stage · `app-inbox-chat.jpg` → `app-inbox-inbox.jpg` |
| **b2** (15.3s) | ข้อมูลแชทอยู่ที่ไหน ไปถึงร้านยังไง? → อยู่ในกล่องแชทของ Agent ดึงผ่าน Inbox API | โหนดเรียงบนลงล่าง: ลูกค้า LINE → LangMind “กล่องแชท” → Inbox API → ระบบหลังบ้าน → หน้ากล่องแชท · เส้นวาดตัวเอง จุดข้อมูลวิ่งตามลูกศร | ภาพรวมเส้นทางข้อมูล | Pipeline · โลโก้ LangMind |
| **b3** (16.0s) | ต้องเตรียมอะไร? → 3 อย่าง | การ์ด 3 ใบขึ้นทีละใบตามเสียง: Agent ที่ต่อ LINE · API Key `inbox:read` + ป้าย “อ่านอย่างเดียว” · ระบบหลังบ้าน (เก็บ Key + เรียก API) · แถบความคืบหน้าไฮไลต์ “เตรียม” | `inbox:read` | Checklist cards · ไอคอน agent/key/server |
| **b4** (21.1s) | ดึงรายการแชทยังไง? → threads + channel/page/limit | minimap ไฮไลต์ช่อง 1 (เขียว) → แผง request `GET …/inbox/threads?channel=line&page=1&limit=25` → กล่อง JSON ไล่บรรทัด `display_name`, `message_count`, `total`, `channel_counts` (ไฮไลต์) → ต่อท้าย `&search=อเมริกาโน่` | `channel_counts` → แท็บ | Code Snippet · Marker Highlight · minimap |
| **b5** (18.1s + hold 1.5s) | อ่านข้อความในแชทยังไง? → messages + cursor | minimap ช่อง 2 (ทอง) → request `…/threads/{cid}/messages?limit=50` → JSON `role`, `content`, `created_at` + `next_cursor` → บรรทัด “หน้าถัดไป: `?cursor=01J8XL…&limit=50`” ขึ้นในแผง request พร้อมไฮไลต์ | `next_cursor` → หน้าถัดไป | Code Snippet · Marker Highlight |
| **b6** (16.1s) | รู้ได้ยังไงว่าแอดมินคุมสายอยู่? → handover active | minimap ช่อง 3 (ฟ้า) → request `…/handover` → กล่อง JSON บรรทัดแรก `active: true, expires_in_sec: 1420` “แอดมินคุมอยู่ · AI หยุดตอบ” → บรรทัดที่สอง `active: false, expires_in_sec: null` “ไม่มีใครคุม · AI ตอบตามปกติ” (ไฮไลต์คนละสี) | true / false | Code Snippet · Marker Highlight 2 สี |
| **b7** (14.7s) | อยากได้ประวัติเป็นไฟล์? → export | minimap ช่อง 4 (ม่วง) → request `…/inbox/export?format=xlsx&channel=line&date_from=…&date_to=…` (ขึ้นทีละบรรทัด) → ผลเป็นชิปไฟล์ `inbox-export.xlsx` แทนกล่อง JSON → ป้าย “ไม่ระบุวันที่ = ทั้งหมด · สูงสุด 20,000 แถว” | ไฟล์ ไม่ใช่ JSON | Code Snippet · file chip |
| **b8** (20.5s) | เอาผลไปทำอะไรบนหน้าจอ? → ฟิลด์ → ส่วนของ UI | มือถือ APP-INBOX-INBOX + callout ขึ้นตามเสียง (`channel_counts` แท็บ, `display_name` ชื่อ, `message_count`, `last_message_role` ป้ายรอตอบ) → สลับเป็น APP-INBOX-THREAD (`role/content`, `created_at`, `handover.active` ป้ายคุมสาย) → กลับหน้ารายการ (ปุ่ม ⬇ xlsx = export, ช่องค้นหา = search) · แถบความคืบหน้าไฮไลต์ “ใช้ผล” | ฟิลด์ → UI | Device Stage · callout grid 2 คอลัมน์ |
| **b9** (13.8s) | Key ทำอะไรไม่ได้? → อ่านได้อย่างเดียว | 2 การ์ด: ✓ ทำได้ด้วย Key (อ่าน, export) · ✕ ต้องเข้าเว็บ LangMind (ตอบลูกค้า, เริ่ม/จบคุมสาย) + เหตุผล “ลูกค้าเห็นผลจริง” | อ่านอย่างเดียว | การ์ด ok/no |
| **b10** (17.1s) | สรุป? → เตรียม → เชื่อม 4 แบบ → ใช้ผล | แถบความคืบหน้าทั้ง 3 ช่องเป็น “เสร็จ” → 3 แถวสรุปขึ้นทีละแถว (เตรียม 3 ชิป · เชื่อม 4 ชิป · ใช้ผล 2 ชิป) → Robot ท่า `04-open-arms` ขึ้นกลางล่าง | 3 ขั้น | Robot `04-open-arms` |
| **b11** (7.9s) | — | ซ่อนแถบความคืบหน้าและป้าย → โลโก้ LangMind เด้งขึ้นกลางจอ → “สนับสนุนโดย” → `langmind.in.th` | ผู้สนับสนุน | `langmind-logo.png` |

---

## 3. ฉากที่ใช้ตรวจ (draft v1)

* **ตรวจแล้ว**: render ครบ 11 ช่วง · `check` ผ่าน · ตรวจเฟรมขนาดมือถือ [video/evidence/draft-v1-mobile-frames.jpg](video/evidence/draft-v1-mobile-frames.jpg) — ดู [video/REVIEW.md](video/REVIEW.md)
* **ฉากที่ต้องดูซ้ำหลังมีเสียง**: b4 (เนื้อหาเยอะสุด 3 ท่อน), b5 (hold ของกล่อง JSON), b8 (callout 9 ตัว สลับภาพ 2 ครั้ง)

---

## 4. แบบกำหนดหน้าจอ Mockup (Screen Specifications)

ทำจากโค้ด HTML แล้ว screenshot เป็นภาพ (ผู้รับผิดชอบยืนยันแล้ว) · ต้นฉบับ [video/mockups/](video/mockups/) · ขนาด 1440×1800 (4:5) · ทุกภาพมีป้าย “ภาพจำลอง” · ไม่ใช้โลโก้ LINE (ใช้สีเขียวและคำว่า LINE แทน)

### หน้าจอ 1: APP-INBOX-CHAT (`chat.html` → `assets/app-inbox-chat.jpg`)
* แชทฝั่งลูกค้าในแอปแชท: ลูกค้าถามเรื่องเมนู/สั่งกาแฟ AI ของร้านตอบกลับ
* บับเบิลลูกค้าขวา บับเบิล AI ซ้าย (เขียวอ่อน) · ใช้ใน b1

### หน้าจอ 2: APP-INBOX-INBOX (`inbox.html` → `assets/app-inbox-inbox.jpg`)
* หน้ากล่องแชทของร้าน: แท็บช่องทางพร้อมจำนวน (จาก `channel_counts`), ช่องค้นหา, ปุ่ม “⬇ xlsx”
* รายการแชท: ชื่อลูกค้า (`display_name`), ข้อความล่าสุด, จำนวนข้อความ, ป้าย “ลูกค้ารอตอบ” เมื่อ `last_message_role = "user"`
* ใช้ใน b1 และ b8

### หน้าจอ 3: APP-INBOX-THREAD (`thread.html` → `assets/app-inbox-thread.jpg`)
* หน้าอ่านแชทหนึ่งรายการ: ข้อความเรียงเก่า → ใหม่ แยกลูกค้า/AI พร้อมเวลา (`created_at`)
* ป้าย “แอดมินคุมสายอยู่” ด้านบน (จาก `handover.active`) · **ไม่มีช่องพิมพ์ตอบ** เพราะ API Key ตอบลูกค้าไม่ได้
* ใช้ใน b8

### การสร้างภาพใหม่
```bash
cd video/mockups
google-chrome --headless=new --window-size=1440,1800 --screenshot=inbox.png inbox.html
```
Chrome บันทึกเป็น PNG เสมอ → แปลงเป็น `../assets/app-inbox-inbox.jpg` (ทำแบบเดียวกันกับ `chat.html`, `thread.html`)

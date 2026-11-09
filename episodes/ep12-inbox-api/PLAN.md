# EP12 — Inbox API: ทำหน้ากล่องแชทของร้านเอง

อัปเดต 9 พฤศจิกายน 2026 (Asia/Bangkok) · v1.1 ใช้ Inbox API ครบทุกแบบในคู่มือ (search, cursor, handover 2 สถานะ, export) · ใช้โครงเดียวกับ EP04 video-v3 (เล่าจากมุมคนดู: เตรียม → เชื่อม → ใช้ผล + ปิดท้ายผู้สนับสนุน)

## โจทย์จากมุมคนดู (W3)
- **คนดู**: เจ้าของร้าน / ทีมหน้าร้าน / dev ที่ดูแลระบบหลังบ้าน ร้านมี Agent ตอบแชท LINE อยู่แล้ว
- **ทำไมต้องดู**: อยากเห็นแชทลูกค้าทั้งหมดในระบบหลังบ้านของร้านเอง (use case A) แต่ไม่รู้ว่าต้องเตรียมอะไร ต่อกับอะไร และ API ให้ข้อมูลอะไรกลับมา
- **ดูจบแล้วต้องตอบได้**
  1. ต้องเตรียม 3 อย่าง: Agent ที่ต่อ LINE, API Key สิทธิ์ `inbox:read`, ระบบหลังบ้าน
  2. เรียก 4 endpoint: รายการแชท (+ค้นหา) → ข้อความในแชท (+เลื่อนหน้าด้วย cursor) → สถานะคุมสาย → export ไฟล์
  3. เอาฟิลด์ไหนไปทำส่วนไหนของหน้ากล่องแชท
  4. **API Key อ่านได้อย่างเดียว** — ตอบลูกค้า / เริ่ม-จบคุมสาย ต้องทำในเว็บ LangMind

## โครงเรื่อง 11 ช่วง
| Beat | คำถามคนดู | สิ่งที่เห็น |
|---|---|---|
| b1 | ปัญหาคืออะไร | แชทลูกค้าทาง LINE (AI ตอบ) → หน้ากล่องแชทของร้าน · 3 คำถาม |
| b2 | ภาพรวม | ลูกค้า LINE → LangMind เก็บใน “กล่องแชท” → Inbox API → ระบบหลังบ้าน → หน้ากล่องแชทของร้าน |
| b3 | เตรียม | Agent ที่ต่อ LINE · API Key `inbox:read` (อ่านอย่างเดียว) · ระบบหลังบ้าน |
| b4 | เชื่อม 1 รายการแชท | `GET /api/agents/{id}/inbox/threads?channel=line&page=1&limit=25` (+`&search=`) → items, `total`, `channel_counts` (นับทุก thread ใช้ทำแท็บได้เลย) |
| b5 | เชื่อม 2 ข้อความ | `GET …/threads/{cid}/messages?limit=50` → items (role, content, created_at) · `next_cursor` ไม่ว่าง → `?cursor=` ดึงหน้าถัดไป |
| b6 | เชื่อม 3 คุมสาย | `GET …/threads/{cid}/handover` → `active: true` (แอดมินคุม, `expires_in_sec`) / `active: false, null` (AI ตอบปกติ) |
| b7 | เชื่อม 4 export | `GET …/inbox/export?format=xlsx&channel=line&date_from=…&date_to=…` → ไฟล์ตรง ๆ ไม่ใช่ JSON · ไม่ระบุวันที่ = ทั้งหมด · สูงสุด 20,000 แถว |
| b8 | ใช้ผล | หน้ากล่องแชท: แท็บ, ชื่อ, ป้ายรอตอบ · หน้าอ่านแชท: ข้อความ, เวลา, ป้ายคุมสาย · ปุ่ม ⬇ xlsx (export), ช่องค้นหา (search) |
| b9 | ข้อจำกัด | ทำได้ด้วย Key: อ่าน/export · ต้องเข้าเว็บ: ตอบลูกค้า, เริ่ม/จบคุมสาย |
| b10 | สรุป | เตรียม → เชื่อม 4 แบบ → ใช้ผล |
| b11 | ผู้สนับสนุน | โลโก้ LangMind · langmind.in.th |

บทพูด/ซับ: [video/timing.json](video/timing.json) · [video/VOICE-SCRIPT.md](video/VOICE-SCRIPT.md)

## Claim ledger (เทียบ `langmind-api.md` หัวข้อ Inbox API และ Scopes)
| ข้อความในคลิป | สถานะ | ที่มา |
|---|---|---|
| Inbox API ดึง thread จากช่องทางภายนอก (LINE ฯลฯ) — อ่านเท่านั้น | documented | หัวข้อ Inbox API (บรรทัด ~1019–1021) |
| สิทธิ์ `inbox:read` ดูรายการ thread/ข้อความ, export, ดูสถานะ handover | documented | ตาราง Scopes บรรทัด 114 |
| `GET /api/agents/{id}/inbox/threads` รับ `channel, search, page, limit` คืน `total`, `channel_counts` เสมอ | documented | ตาราง Inbox API + ตัวอย่าง |
| item มี `display_name`, `channel`, `message_count`, `last_message_role` | documented | ตัวอย่าง response |
| `display_name/avatar_url` มีเฉพาะ LINE, Webex, Telegram (ชื่อ) | documented | หมายเหตุใต้ตัวอย่าง |
| `GET …/threads/{cid}/messages` รับ `cursor, limit` คืน items (`role`, `content`, `created_at`) + `next_cursor` | documented | ตัวอย่าง messages |
| `GET …/handover` → `active: true` = แอดมินคุมอยู่ AI ไม่ตอบจนหมดอายุหรือถูกจบ; ไม่มีคนคุม = `active: false, expires_in_sec: null` | documented | ตัวอย่าง handover |
| export xlsx/csv · `format, channel, date_from, date_to` · คืนไฟล์ (Content-Disposition: attachment) ไม่ใช่ JSON · ไม่ระบุวันที่ = ทั้งหมด จำกัด 20,000 แถวต่อครั้ง | documented | ตาราง Inbox API + ตัวอย่าง export |
| `channel_counts` นับจากทุก thread ของ agent ไม่ใช่แค่หน้านี้ ใช้ทำ badge ได้โดยไม่ต้องยิงซ้ำ | documented | หมายเหตุใต้ตัวอย่างรายการ thread |
| `next_cursor` ใช้ดึงหน้าถัดไปด้วย `?cursor=` | documented (พารามิเตอร์ cursor + ฟิลด์ next_cursor) | ตาราง Inbox API + ตัวอย่าง messages |
| ค่าวันที่ `2026-11-01` ในตัวอย่าง export | illustrative | คู่มือไม่ได้ระบุรูปแบบวันที่ — ตรวจก่อนใช้จริง |
| ตอบลูกค้า / เริ่ม-จบ handover ใช้ API Key ไม่ได้ ต้อง login เว็บ เพราะเปลี่ยนพฤติกรรมที่ end-user เห็นจริง | documented | “ทำไมตอบกลับ/handover ถึงเรียกด้วย API Key ไม่ได้” |
| เก็บ API Key ฝั่ง server | documented | หัวข้อการยืนยันตัวตน |
| ป้าย “ลูกค้ารอตอบ” จาก `last_message_role = "user"` | การออกแบบหน้าจอ | ตีความฟิลด์เพื่อทำ UI ไม่ใช่ฟีเจอร์ของ API |
| ชื่อลูกค้า ข้อความ จำนวน (12 / 3 / 1420 วินาที) | illustrative | ข้อมูลจำลองในภาพหน้าจอ |

## ภาพหน้าจอจำลอง
ทำจากโค้ด (HTML → ภาพ) ตามที่ผู้รับผิดชอบยืนยัน · ต้นฉบับอยู่ที่ [video/mockups/](video/mockups/) · ไฟล์ที่ใช้: `video/assets/app-inbox-chat.jpg`, `app-inbox-inbox.jpg`, `app-inbox-thread.jpg` (1440×1800 มีป้าย “ภาพจำลอง”) · ไม่ใช้โลโก้ LINE

# EP13 — Storyboard และแบบกำหนดหน้าจอ v1 (Short Links API)

เอกสารอ้างอิง: [PLAN](PLAN.md), [SCRIPT](SCRIPT.md), [CATALOG](CATALOG.md), และ [WORKFLOW](../../docs/WORKFLOW.md)
สถานะ: ตรงกับ draft v1 ที่ render แล้ว ([video/ep13-short-links-draft-v1.mp4](video/ep13-short-links-draft-v1.mp4), ยังไม่มีเสียง) · ฉากทั้งหมดอยู่ใน [video/build.mjs](video/build.mjs) การเคลื่อนไหวอยู่ใน [video/motion.js](video/motion.js)

---

## 1. แนวภาพและระบบการแสดงผล (Visual System)

ใช้ระบบเดียวกับ EP04 v3 และ EP12 ให้ซีรีส์ต่อเนื่องกัน

* **สไตล์หลัก**: Editorial Paper & Sage Ink — อินโฟกราฟิกเทคนิคบนพื้นกระดาษ
* **สัดส่วนและขนาด**: 9:16 (1080×1920, 30 fps)
* **ชุดสี**:
  * พื้นหลังกระดาษ `#F5F1E7` · หมึกเข้ม `#20352c`
  * สีประจำการเชื่อม 4 แบบ (เลขในแถบ minimap):
    1. เช็กโควตา — เขียวเซจ `#38815A`
    2. สร้างลิงก์ — ทองหม่น `#8d732c`
    3. จัดการลิงก์ — ฟ้าอมเขียว `#1E7578`
    4. ดูสถิติ — ม่วงคราม `#5b5f9e`
  * สี error — แดงอิฐ `#9b3b2b` (ป้ายรหัส HTTP, ปุ่ม DELETE)
  * ป้าย “ตามแผน” — เหลืองทอง `#f2d58a`
* **ตัวอักษร**: Sarabun ในวิดีโอ · Noto Sans Thai Looped ในภาพหน้าจอจำลอง · โค้ดใช้ DejaVu Sans Mono 29px
  * หัวเรื่อง 72px · ข้อความรอง 40px · ป้าย/โค้ด 28–38px · **ขั้นต่ำ 28px**
* **โครงทุกซีน**: kicker “EP13 / SHORT LINKS API” ซ้ายบน · ป้าย “ภาพจำลอง” ขวาบน · แถบความคืบหน้า (เตรียม → เชื่อม → ใช้ผล) · ซับล่างจอ (ไม่เกิน 2 บรรทัด)
* **พื้นที่ปลอดภัย**: x=70–1010 · เนื้อหาจบก่อน y≈1500 ซับอยู่ y=1572 ขึ้นไป

---

## 2. รายละเอียด Storyboard ราย Beat (b1 – b12)

| Beat / เวลา (ประมาณ) | สงสัยก่อน → เข้าใจหลัง | ภาพเริ่ม → การเคลื่อนไหว → ภาพจบ | ข้อความเน้น | Assets / Catalog |
|---|---|---|---|---|
| **b1** (20.0s) | ส่งโปรใน LINE แล้วมีปัญหาอะไร? → ลิงก์ยาว และไม่รู้ยอดคลิก | มือถือแสดงแชท LINE ของร้าน (APP-SL-LINE-LONG) ลิงก์ยาวเต็มไปด้วย UTM ซูมช้า ๆ → ป้าย “ส่งไปแล้ว มีคนกดกี่คน?” → สลับเป็นลิงก์สั้นพร้อมการ์ดพรีวิว (APP-SL-LINE-SHORT) → ชิป 3 คำถามเด้งขึ้น | เตรียมอะไร? · เชื่อมตรงไหน? · ใช้ผลยังไง? | Device Stage · `app-sl-line-long.jpg` → `app-sl-line-short.jpg` |
| **b2** (18.4s) | ลิงก์สั้นมาจากไหน นับคลิกยังไง? → ผ่าน Short Links API | โหนดบนลงล่าง: ระบบหลังบ้าน (ป้าย Key) → “Short Links API” → LangMind “ได้ลิงก์สั้น s3t.me/s/…” → “ส่งใน LINE” → ลูกค้ากดลิงก์ → “นับคลิก” → สถิติการคลิก · เส้นวาดตัวเอง จุดข้อมูลวิ่งตามลูกศร | ภาพรวมเส้นทาง | Pipeline · โลโก้ LangMind · ไอคอน server/phone/chart |
| **b3** (27.7s) | ต้องเตรียมอะไร? → 3 อย่าง | การ์ด 1 API Key: ชิป `short_links:write` + “สร้าง · แก้ · ปิดใช้งาน · ลบ” → ชิป `short_links:read` + “ดูลิงก์ · โควตา · สถิติ” · การ์ด 2 ระบบหลังบ้าน · การ์ด 3 รู้แผนของบัญชี (โควตาเดียวกับหน้า “ลิงก์ย่อ”) · แถบความคืบหน้าไฮไลต์ “เตรียม” | 2 scope | Checklist cards · ไอคอน key/server/gauge |
| **b4** (12.6s) | ก่อนสร้าง เหลือโควตาไหม? → usage | minimap ช่อง 1 (เขียว) → แผง `GET /api/short-links/usage` → การ์ดผล “ใช้ไปเท่าไร เทียบเพดานของแผน” + “ฟีเจอร์ที่แผนเปิดให้” + หมายเหตุ “คู่มือไม่ได้แสดงตัวอย่าง response” | usage | Code Snippet · การ์ดผล (ไม่มีชื่อฟิลด์) |
| **b5** (18.9s + hold 1.5s) | สร้างลิงก์ยังไง ได้อะไรกลับมา? → POST + response | minimap ช่อง 2 (ทอง) → แผง `POST /api/short-links` body ขึ้นทีละบรรทัด (`target_url`, `title`, `utm` ไฮไลต์) → JSON ผล: `code`, `short_url` (ไฮไลต์), `target_url` ที่เติม `?utm_source=line&utm_campaign=oct` (ไฮไลต์ตอนพูดเรื่อง UTM), `state`, `total_clicks` | `short_url` · UTM ถูกเติมให้ | Code Snippet · Marker Highlight |
| **b6** (21.7s + hold 1.0s) | ตอนสร้างตั้งค่าอะไรได้อีก? → 5 ตัวเลือก บางตัวตามแผน | minimap ช่อง 2 → โค้ด body เต็ม ขึ้นทีละบรรทัดตามเสียง พร้อมคอมเมนต์ไทย (`alias` ตั้งชื่อเอง, `tags` จัดกลุ่ม, `expires_at` วันหมดอายุ, `max_clicks` จำกัดคลิก, `password` รหัสผ่าน) → ท่อน 3: ป้าย “ตามแผน” เด้งบน 4 บรรทัด + กล่องประ “ใช้ได้ตามแผน · เช็กก่อนจาก usage” + หมายเหตุค่าตัวอย่าง | ป้าย “ตามแผน” | Code Snippet · Marker Highlight · plan badge |
| **b7** (20.4s + hold 1.5s) | จัดการลิงก์ที่มีอยู่ยังไง? → list / PATCH / DELETE | minimap ช่อง 3 (ฟ้า) → กล่อง 1 `GET /api/short-links` (`?q=โปร&tag=line&state=active`, `&sort=clicks` ไฮไลต์, `&limit=20&offset=0` ไฮไลต์) → กล่อง 2 `PATCH /api/short-links/{id}`: `{ "title": … }` “ส่งเฉพาะช่องที่แก้”, `{ "max_clicks": null }` ไฮไลต์ “null = ล้างตัวเลือก” → บรรทัด `DELETE` (ป้ายแดง) | `sort=clicks` · `null` | Code Snippet × 2 |
| **b8** (17.5s) | ดูสถิติได้แบบไหน? → ลิงก์เดียว / ภาพรวม / CSV | minimap ช่อง 4 (ม่วง) → กล่อง `/{id}/analytics?from_date=2026-11-01&to_date=2026-11-07` (ไฮไลต์) → กล่อง `/analytics` ภาพรวมทุกลิงก์ → กล่อง `/{id}/analytics/export` + การ์ดไฟล์ “CSV รายวัน · เฉพาะแผนที่มีสถิติแบบละเอียด” | YYYY-MM-DD · CSV | Code Snippet × 3 · file chip |
| **b9** (20.1s) | อะไรทำให้สร้างไม่ได้? → 3 error | การ์ดแดง “เกินโควตา” ป้าย `422 SHORT_LINK_LIMIT_EXCEEDED` → `429 SHORT_LINK_RATE_EXCEEDED` · การ์ดแดง “ปลายทางไม่ผ่านการตรวจความปลอดภัย” ป้าย `422 SHORT_LINK_TARGET_BLOCKED` + แถบ “มีข้อความบอกเหตุผล · เช็กที่ code” | รหัส error | การ์ด no · error chip |
| **b10** (16.4s) | เอาผลไปทำหน้าอะไร? → หน้าลิงก์โปร + หน้าสถิติ | มือถือ APP-SL-CAMPAIGN + callout ตามเสียง (`/short-links/usage` แถบโควตา, `?sort=clicks` เรียงตามคลิก) → (`short_url` ลิงก์+คัดลอก, `state` ป้ายสถานะ, `total_clicks` คลิกรวม, `tags` ตัวกรอง) → สลับเป็น APP-SL-DETAIL (`/{id}/analytics` กราฟรายวัน, `/{id}/analytics/export` ปุ่ม CSV) · แถบความคืบหน้าไฮไลต์ “ใช้ผล” | endpoint/ฟิลด์ → UI | Device Stage · callout grid |
| **b11** (17.6s) | สรุป? → เตรียม → เชื่อม 4 แบบ → ใช้ผล | แถบความคืบหน้าเป็น “เสร็จ” ทั้งหมด → 3 แถวสรุป (เตรียม 3 ชิป · เชื่อม 4 ชิป · ใช้ผล 2 ชิป) → Robot `04-open-arms` | 3 ขั้น | Robot `04-open-arms` |
| **b12** (8.1s) | — | ซ่อนแถบและป้าย → “สนับสนุนโดย” → โลโก้ LangMind เด้ง → `langmind.in.th` → ชิป Short Links · LINE · สถิติคลิก | ผู้สนับสนุน | `langmind-logo.png` |

---

## 3. ฉากที่ใช้ตรวจ (draft v1)

* **ตรวจแล้ว**: render ครบ 12 ช่วง · `check` ผ่าน (ok: true) · เฟรมขนาดมือถือ [video/evidence/draft-v1-mobile-frames-1.jpg](video/evidence/draft-v1-mobile-frames-1.jpg), [-2.jpg](video/evidence/draft-v1-mobile-frames-2.jpg) — ดู [video/REVIEW.md](video/REVIEW.md)
* **ฉากที่ต้องดูซ้ำหลังมีเสียง**: b6 (โค้ด 6 บรรทัด + ป้าย 4 อัน), b7 (2 กล่องโค้ด 4 ท่อน), b10 (callout 8 ตัว สลับภาพ)

---

## 4. แบบกำหนดหน้าจอ Mockup (Screen Specifications)

ทำจากโค้ด HTML แล้ว screenshot เป็นภาพ · ต้นฉบับ [video/mockups/](video/mockups/) · ขนาด 1440×1800 (4:5) · ทุกภาพมีป้าย “ภาพจำลอง” · ไม่ใช้โลโก้ LINE (ใช้คำว่า LINE และสีเขียวแทน)

### หน้าจอ 1: APP-SL-LINE-LONG (`line-long.html` → `assets/app-sl-line-long.jpg`)
* แชทบัญชีทางการของร้านใน LINE: ข้อความโปร “ลด 20% ทุกเมนู” + ลิงก์ยาว `https://shop.example.com/sale?utm_source=line&utm_campaign=oct`
* ลูกค้าตอบ “ลิงก์ยาวจัง กดได้ใช่ไหมคะ” · กล่องประ “มีลูกค้ากดลิงก์ไปกี่คน? · ร้านยังไม่รู้” · ใช้ใน b1

### หน้าจอ 2: APP-SL-LINE-SHORT (`line-short.html` → `assets/app-sl-line-short.jpg`)
* แชทเดียวกัน แต่ลิงก์เป็นการ์ดพรีวิว “SALE 20% · โปรเดือนนี้ · s3t.me/s/k7m2p9x”
* กล่องประ “ลิงก์สั้น · นับคลิกได้ · ดูสถิติจากระบบของร้าน” · ใช้ใน b1

### หน้าจอ 3: APP-SL-CAMPAIGN (`campaign.html` → `assets/app-sl-campaign.jpg`)
* หน้า “ลิงก์โปรของร้าน” ในหลังบ้าน: แถบโควตา “ใช้ไป 12 จาก 50” + ฟีเจอร์ของแผน (จาก `usage`)
* ช่องค้นหา (`q`), ตัวกรอง “แท็ก: line” (`tag`), “คลิกมากสุด” (`sort=clicks`)
* รายการ 4 ลิงก์: ชื่อ, คลิกรวม, `short_url` + ปุ่มคัดลอก, แท็ก, สถานะ `active` · ใช้ใน b10

### หน้าจอ 4: APP-SL-DETAIL (`detail.html` → `assets/app-sl-detail.jpg`)
* หน้าสถิติของ “โปรเดือนนี้”: `short_url` + คัดลอก, ปลายทางที่เติม UTM, คลิกรวม 1,284, สถานะ `active`
* ช่วงวันที่ 1–7 พ.ย. 2026, ปุ่ม “⬇ CSV รายวัน”, กราฟแท่งคลิกรายวัน (ผลรวม = 1,284) · ใช้ใน b10

### การสร้างภาพใหม่
```bash
cd video/mockups
google-chrome --headless=new --hide-scrollbars --window-size=1440,1800 --screenshot=campaign.png campaign.html
```
Chrome บันทึกเป็น PNG เสมอ → แปลงเป็น `../assets/app-sl-campaign.jpg` (ทำแบบเดียวกันกับไฟล์อื่น) · `line-long.html` และ `line-short.html` ใช้สไตล์ร่วม `chat-common.css`

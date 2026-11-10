# EP14 — บทพากย์ v1 (Errors)

เอกสารอ้างอิง: [PLAN](PLAN.md), [STORYBOARD](STORYBOARD.md), [CATALOG](CATALOG.md), [langmind-api.md](../../langmind-api.md) หัวข้อ Errors (บรรทัด 1303–1325) และส่วนที่เกี่ยวข้อง (89, 108, 114–115, 890, 1024, 1032, 1294–1300)
สถานะ: บท v1 ตรงกับ [video/timing.json](video/timing.json) · draft v1 render แล้วแบบยังไม่มีเสียง · ภาคต่อเรื่องลิมิตและโควตา: [EP15](../ep15-rate-limit-quota/SCRIPT.md)

> ถ้าแก้บท ให้แก้ที่ `video/timing.json` ก่อน แล้วรัน `node build.mjs` ซึ่งจะสร้าง `video/VOICE-SCRIPT.md` ใหม่ จากนั้นค่อยปรับตารางในไฟล์นี้
> หมายเหตุ: บรรทัด 14–70 ของ `langmind-api.md` เป็นบันทึกของโปรเจกต์อื่น (AlmondChat) ไม่ใช่คู่มือ — ไม่ใช้อ้างอิง ยกเว้น `Bearer` / `lmpat_` (บรรทัด 19) ซึ่งไม่พบในส่วนหลัก

---

## 1. บทเต็มและจุดแบ่งจังหวะ

เวลาประมาณจากความยาวบท (ยังไม่มีเสียง) รวม **2:30** · ใส่เสียง Niwat −16% แล้วน่าจะไม่เกิน 2:30 (เป้าไม่เกิน 3:00)

| Beat | เวลา | บทบรรยายภาษาพูด | ข้อความเน้นบนจอ |
|---|---|---|---|
| **b1** ปัญหา | 0:00–0:14 | ระบบหลังบ้านของร้านเรียก API ทุกวัน วันหนึ่งหน้ากล่องแชทขึ้นแค่ว่า เกิดข้อผิดพลาด error แบบนี้หน้าตาเป็นยังไง แปลว่าอะไร และควรรับมือยังไง มาดูกันครับ | “เกิดข้อผิดพลาด” แค่นั้น · 3 คำถาม |
| **b2** อ่าน error | 0:14–0:30 | ทุก error ของ LangMind หน้าตาเดียวกัน code บอกว่าเป็นกรณีไหน message คือข้อความภาษาไทย message en คือภาษาอังกฤษ และมี request id ประจำคำขอ ให้เช็กที่ code เสมอ ไม่ต้องแกะข้อความ | error envelope · ✓ `code === "FORBIDDEN"` / ✕ แกะข้อความ |
| **b3** 401 | 0:31–0:46 | 401 UNAUTHORIZED คือ Key ขาด หมดอายุ ถูกเพิกถอน หรือเรียก endpoint ที่ต้องเข้าสู่ระบบผ่านเว็บ ทางแก้ เช็ก Authorization Bearer หรือสร้าง Key ใหม่ในหน้า Personal API Key | `401 UNAUTHORIZED` · `/me/api-tokens` · `/inbox/reply` · ทางแก้ |
| **b4** 403 | 0:46–0:58 | 403 FORBIDDEN คือ Key ไม่มี scope ที่ endpoint ต้องการ หรือ role ไม่พอ เช่นเรียก Inbox ด้วย Key ที่ไม่มี inbox read ทางแก้ ใช้ Key ที่มี scope ตรงกับงาน | `403 FORBIDDEN` · Key มี `chat:invoke` / ต้องใช้ `inbox:read` |
| **b5** 404/422 | 0:59–1:11 | 404 NOT FOUND คือไม่พบ หรือเป็นของบัญชีอื่น ส่วน 422 VALIDATION ERROR คือ body หรือ query ผิดรูปแบบ ส่งซ้ำแบบเดิมก็ได้ผลเดิม ต้องแก้คำขอก่อน | `404 NOT_FOUND` · `422 VALIDATION_ERROR` · ส่งซ้ำ → ได้ผลเดิม |
| **b6** 429 | 1:11–1:26 | 429 RATE LIMIT EXCEEDED คือเรียกถี่เกินลิมิต ให้รอแล้วลองใหม่ รายละเอียดลิมิตดูต่อใน EP15 แต่ 429 VOICE QUOTA EXCEEDED คือโควตาเสียงไม่พอ ต้องดูยอดคงเหลือ ไม่ใช่แค่รอ | `429 RATE_LIMIT_EXCEEDED` → รอแล้วลองใหม่ (EP15) · `429 VOICE_QUOTA_EXCEEDED` |
| **b7** Voice | 1:26–1:45 | ฝั่ง Voice ยังมี VOICE DISABLED คือยังไม่เปิดเสียงในเวอร์ชันที่เผยแพร่ และ VOICE NOT IN PLAN คือแพ็กเกจไม่รวมงานเสียง NO CREDENTIAL คือโมเดลของ agent ยังไม่มี API key และ FORMAT UNSUPPORTED ให้แปลงไฟล์เป็น WAV แล้วส่งใหม่ | 4 code ของ Voice |
| **b8** 3 กลุ่ม | 1:46–1:59 | จำง่าย ๆ เป็นสามกลุ่ม รอแล้วลองใหม่ได้ คือ rate limit แก้คำขอก่อน คือ 401 403 404 422 และไฟล์เสียงผิดรูปแบบ ที่เหลือของ Voice ต้องไปตั้งค่าในเว็บ หรือดูแพ็กเกจ | 3 กลุ่ม (code ครบ 10 ตัว) |
| **b9** ใช้ผล | 2:01–2:15 | ในระบบหลังบ้าน บันทึก status code และ request id ไว้ใน log ที่ลองใหม่ได้ให้ระบบลองเอง ที่เหลือแจ้งทีม หน้าจอของทีมก็บอกทางแก้ได้ แทนคำว่า เกิดข้อผิดพลาด เฉย ๆ | หน้าบันทึก error → หน้ากล่องแชทที่บอกทางแก้ |
| **b10** สรุป | 2:15–2:20 | สรุปครับ อ่านจาก code เก็บ request id และรับมือตามสามกลุ่ม | อ่าน → รับมือ → ใช้ผล |
| **b11** ผู้สนับสนุน | 2:21–2:28 | คลิปนี้สนับสนุนโดย LangMind เริ่มเชื่อม API ได้ที่ LangMind ดอท อิน ดอท ทีเอช | โลโก้ LangMind |

---

## 2. ข้อมูลตัวอย่าง

* **จากคู่มือ**: error envelope `FORBIDDEN` / “คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้” / `request_id: "01J8XK2..."` (บรรทัด 1307–1313) · `message_en` ตัดเหลือ “You do not have permission…”
* **ตัวอย่างประกอบ (illustrative)**: Key ที่มีแค่ `chat:invoke` เรียก Inbox → 403 · `/inbox/reply` เป็นตัวอย่าง endpoint ที่ต้อง login เว็บ
* **ภาพหน้าจอ**: ร้านกาแฟสมมติ, เวลา, request_id, รายการใน log — ข้อมูลจำลองทั้งหมด ติดป้าย “ภาพจำลอง”

---

## 3. Claim Ledger

| ข้อกล่าวอ้างในบท | สถานะหลักฐาน | แหล่งอ้างอิงใน [langmind-api.md](../../langmind-api.md) |
|---|---|---|
| ทุก error หน้าตาเดียวกัน · เช็ก code แทนการ parse ข้อความ | **documented** | บรรทัด 1304 |
| envelope มี `status: "error"`, `code`, `message`, `message_en`, `request_id` | **documented** | บรรทัด 1306–1314 |
| 401 UNAUTHORIZED = Key ขาด, หมดอายุ, ถูกเพิกถอน หรือใช้ที่ endpoint ที่ปิดไว้สำหรับ API Key | **documented** | บรรทัด 1316 |
| endpoint ที่ API Key เรียกไม่ได้ต้อง login ผ่านเว็บ (ตั้งค่าบัญชี, credential, admin, API Key อื่น) | **documented** | บรรทัด 115 |
| `/me/api-tokens` ต้อง login ผ่านเว็บ (JWT) | **documented** | บรรทัด 1294 |
| `POST /inbox/reply` ต้อง login ผ่านเว็บ | **documented** | บรรทัด 1032 |
| สร้าง Key ใหม่ที่ บัญชี → Personal API Key | **documented** | บรรทัด 89, 1294, 1300 |
| `Authorization: Bearer` + prefix `lmpat_` | **documented** | บรรทัด 19 |
| 403 FORBIDDEN = ไม่มี scope ที่ endpoint ต้องการ หรือ role ไม่พอ | **documented** | บรรทัด 1317 |
| Inbox ต้องใช้ `inbox:read` · `chat:invoke` = คุยกับ agent | **documented** | บรรทัด 108, 114, 1024 |
| ตัวอย่าง Key มีแค่ `chat:invoke` เรียก Inbox → 403 | **illustrative** | สร้างจากนิยาม 403 + ตาราง scope |
| 404 NOT_FOUND = ไม่พบ หรือเป็นของบัญชีอื่น | **documented** | บรรทัด 1318 |
| 422 VALIDATION_ERROR = body/query ไม่ผ่าน schema validation | **documented** | บรรทัด 1319 |
| ส่งซ้ำแบบเดิมได้ผลเดิม ต้องแก้คำขอก่อน | **แนวทาง** | ข้อสรุปจากนิยาม |
| 429 RATE_LIMIT_EXCEEDED = เรียกถี่เกินลิมิต · รอแล้วลองใหม่ | **documented / แนวทาง** | บรรทัด 1320 (วิธีรอไม่ได้ระบุ) |
| 429 VOICE_QUOTA_EXCEEDED = โควตาเสียงไม่พอ · ดูยอดคงเหลือ | **documented** | บรรทัด 1324 |
| VOICE_DISABLED (403) = ยังไม่เปิด “สนทนาด้วยเสียง” ในเวอร์ชันที่เผยแพร่ | **documented** | บรรทัด 1321, 890 |
| VOICE_NOT_IN_PLAN (403) = แพ็กเกจของเจ้าของ agent ไม่รวมงานเสียง | **documented** | บรรทัด 1325 |
| NO_CREDENTIAL (400) = ยังไม่ได้ตั้ง API key ให้โมเดลของ agent | **documented** | บรรทัด 1322 |
| VOICE_AUDIO_FORMAT_UNSUPPORTED (422) → แปลงเป็น WAV แล้วส่งใหม่ | **documented** | บรรทัด 1323 |
| แบ่งการรับมือ 3 กลุ่ม | **แนวทางของคลิป** | สรุปจากบรรทัด 1316–1325 (หมายเหตุบนจอ) |
| log status/code/request_id · ลองใหม่อัตโนมัติ · หน้าจอบอกทางแก้ | **การออกแบบระบบ** | ไม่ใช่ฟีเจอร์ของ API |
| เวลารอหลัง 429 / Retry-After · ความหมายของ request_id ฝั่ง LangMind | **unknown** | ไม่พูดถึง |

---

## 4. ข้อกำหนดซับไตเติลและจังหวะเสียง
* ซับ 23 ท่อน ทุกท่อนไม่เกิน 2 บรรทัด (ตรวจด้วยเฟรมจริงทุกท่อนแล้ว) · ชื่อ code บางตัวย่อในซับ (`FORMAT_UNSUPPORTED`) ชื่อเต็มอยู่บนจอ
* `hold`: b2 และ b8 1.0 วินาที
* เสียง: `th-TH-NiwatNeural` rate −16% ผ่าน `video/make-voice-samples.py`

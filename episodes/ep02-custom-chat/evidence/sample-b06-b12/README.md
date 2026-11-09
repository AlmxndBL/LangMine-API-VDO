# EP02 B06–B12: หลักฐานรอบเตรียม sample

## อัปเดตภาพร่างเงียบ

ผู้ใช้ระบุว่าจะทำเสียงภายหลังด้วย LangMind Voice Studio และให้ทำภาพก่อน จึงไม่ใช้เสียง audition เป็นฐาน timing ภาพร่าง [visual-draft-b06-b12.mp4](../../video-sample-b06-b12/visual-draft-b06-b12.mp4) 1080×1920, 144 วินาที ไม่มีเสียงและซับ แต่ละช็อต 8 วินาทีเป็น placeholder ไม่ใช่ timing สุดท้าย

**ยังไม่เสร็จ:** ภาพร่างใช้โครงที่เขียนใหม่โดยอ้างอิงลักษณะ Catalog ไม่ได้ mount หรือดัดแปลง motion ของ block ต้นฉบับ จึงยังไม่ตรงข้อกำหนดใช้ Catalog เป็นฐาน ช็อตเป็นภาพนิ่งเกือบทั้งหมด ยังไม่มี footage สร้าง key, การชี้ key/ID สู่ตัวแปรแบบเคลื่อนไหว, การเดินทางไปกลับของข้อความ และการเปลี่ยน query ใน Code Diff ต้องทำต่อก่อนถือว่าภาพพร้อม ใช้ภาพ Agent ที่ผู้ใช้ให้เป็นตัวอย่างตำแหน่ง ไม่ทดสอบ ID หรือ key

ตรวจด้วย `hyperframes check --samples 18`: runtime 0 errors, contrast 43 จุดผ่าน, lint 0 errors / 19 warnings เรื่องแยก sub-composition, layout เหลือ 1 info จากการ crop ภาพต้นฉบับโดยตั้งใจ ตรวจภาพจาก render ขนาดกว้าง 360px เฉพาะช็อต code ที่ 52 วินาทีและแชทที่ 140 วินาที พบอ่านได้ในสองเฟรมนั้น ไม่ใช่การตรวจทั้งคลิป; ยังไม่ได้ดู playback ครบ ไม่อ้าง visual/storytelling pass โค้ดที่ wrap เป็นภาพอธิบาย ไม่ใช่ source executable

ไฟล์ผลิต `build-visual.mjs`, `index.html` และ assets อยู่ในโฟลเดอร์วิดีโอ ภาพร่างนี้ยังเป็นงานกำลังทำ ไม่ใช่ sample ที่ผ่านตรวจหรือรับรองโดยผู้ใช้

7 พฤศจิกายน 2026 · สถานะ: รอเลือกเสียง ยังไม่มีวิดีโอ sample ที่ render

## Cleanup

ลบ `chat-example/` ที่สร้างในรอบก่อนตาม prompt เก่าเท่านั้น: `.env.example`, `.gitignore`, `README.md`, `server.mjs`, `test.mjs`, `public/index.html`, `public/chat.js` ทั้งเจ็ดไฟล์สร้างใหม่ในรอบก่อนและเป็นแอป/mock/test หรือคู่มือรัน ไม่ใช่ source สำหรับวิดีโอ ไม่พบ `chat-example` หรือ `CHAT_MODE` ที่เพิ่มตกค้างใน EP02 นอกเอกสารออกแบบ/แผนเดิมซึ่งเป็นประวัติและแบบภาพ ไม่แก้ EP01

## Contract และแหล่งอ้างอิง

ตรวจ `langmind-api.md` ส่วนต้นฉบับ: `Authorization: Bearer <API_KEY>`, `POST /api/chat/message/blocking`, body `agent_id`, `query`, `conversation_id` และ response `answer`, `conversation_id`; `chat:invoke` เป็น scope ของการสนทนา ตัวอย่างใน DESIGN ยังคง C07 เป็น pseudocode และ `/api/chat` ของแอปแยกจาก endpoint provider ไม่เรียก API และไม่ตรวจค่าเดิม API snapshot SHA-256 `DDDBE02F30EC0215E98CB515A3D3374A85F754298163ED84F21FACC6E9164A2C`

ตรวจภาพต้นฉบับ K06 ด้วยตา: เห็น URL และชื่อผู้ช่วย NECTEC ใช้เฉพาะบอกตำแหน่งรหัสหลัง `/agents/` ไม่ใช่ผู้ช่วยร้าน ภาพต้นฉบับ SHA-256 `B42E44AD51C5F27EA4DBB0CAEE32C27C27BEA233D0DA5F8B4D7D0DBCAC80E7F0` คลิปสร้าง key พบไฟล์และ ffprobe ระยะ 42.5 วินาที ยังไม่ได้เลือกช่วงเข้าวิดีโอรอบนี้

## เสียงตัวอย่าง

บทต่อเนื่องจาก DESIGN ส่วน 8 ใช้ Edge TTS โดยไม่ใส่ credential หรือเรียก LangMind: [Premwadee](voice-premwadee.mp3) 11.448 วินาที SHA-256 `C166AF9C86C6B4D9CC160AF64834503191E1CA6EC501F11B2C4320AE21F08C1D`; [Niwat](voice-niwat.mp3) 12.144 วินาที SHA-256 `CB01AFC74BA91D923FA033D1DF8041F00767E8E0EACBF5053ED077DF612E6115` (hash อ้างอิงจากชื่อไฟล์ตรวจซ้ำก่อนใช้) ยังรอผู้ใช้ฟังและเลือก ยังไม่ได้ตรวจคุณภาพการออกเสียงด้วยการฟังหรือสร้างเสียงเต็ม

## Catalog

โฟลเดอร์ [video-sample-b06-b12](../../video-sample-b06-b12/) เป็น scaffold และ source ที่ติดตั้ง ไม่ใช่ composition สำเร็จ `index.html` ยังเป็น template ห้ามตีความเป็น sample ที่พร้อมดู

| รายการ | เปิด preview | ติดตั้ง source | ประกอบ/ตรวจ render |
|---|---|---|---|
| Code Diff | เปิดและกดเล่น เห็นบรรทัดเริ่มปรากฏและสี diff; ยังไม่ได้ตรวจครบทุกจังหวะ | แล้ว | ยังไม่ทำ |
| Code Highlight | มีหลักฐาน preview ใน DESIGN | แล้ว | ยังไม่ทำ |
| Flowchart Vertical | มีหลักฐาน preview ใน DESIGN | แล้ว | ยังไม่ทำ |
| AI Chat Reveal | มีหลักฐาน preview ใน DESIGN | แล้ว | ยังไม่ทำ |
| Onboarding Stepper Flow | มีหลักฐาน preview ใน DESIGN | แล้ว | ยังไม่ทำ |
| Feathered Spotlight (`yt-feather-highlight`) | มีหลักฐาน preview ใน DESIGN | แล้ว | ยังไม่ทำ |

Code Diff source เป็น 1920×1080 และตัวอักษร default 30px จึงต้องปรับให้เหมาะแนวตั้งและทดสอบขนาด 48–54px ที่ 360px; AI Chat Reveal default เป็น streaming จึงต้องปรับเพื่อแสดง blocking และใช้บทสนทนาเดิมก่อน render ห้ามอ้างว่า source ที่ติดตั้งผ่าน integration แล้ว คำสั่ง add แรกติดตั้ง 5 รายการแต่ `spotlight` ไม่ใช่ชื่อ registry; ติดตั้ง `yt-feather-highlight` ตาม DESIGN แยกแล้ว

## ขั้นถัดไป

รอเลือกเสียง จากนั้นสร้างเสียงเต็มช่วงเป็นฐาน timing; ดัดแปลง Catalog ตาม storyboard และตรวจภาพต้นฉบับ/footage ที่ใช้จริง สร้างซับตามเสียง ดู render จริงและตรวจ 360px ก่อนส่ง sample ยังไม่มีผลตรวจ storytelling, การรับฟังเสียง, visual QA หรือการทดลองกับผู้ชม

# EP04 — Voice API: คุยกับ AI ด้วยเสียงพูด

Episode ID: `ep04-voice-api`  
อัปเดต 7 พฤศจิกายน 2026 (Asia/Bangkok)

## สถานะปัจจุบัน: W7 — Full draft v2 ครบ 6 Beat ซับตรงเสียง รอผู้รับผิดชอบฟังตรวจและรับงาน

- **วิดีโอตัวอย่าง**: [video/ep04-b03-b05-draft-v4.mp4](video/ep04-b03-b05-draft-v4.mp4) ยาว 43 วินาที เสียง Edge TTS `th-TH-NiwatNeural` rate −8% เวลาฉาก/ซับคิดจากเสียงจริง `check` ไม่มี finding ผลตรวจอยู่ที่ [video/REVIEW.md](video/REVIEW.md) (v2–v3 ยังเก็บไว้)
- **ภาพหน้าจอจำลอง**: [app-voice-q.jpg](video/assets/app-voice-q.jpg) (กดไมค์พูด) และ [app-voice-a.jpg](video/assets/app-voice-a.jpg) (เล่นเสียงตอบ กล่องตอบสีเขียวอ่อน) สร้างจากภาพต้นฉบับเดียวกันด้วย [make-voice-screens.py](video/evidence/make-voice-screens.py) ฟอนต์/ขนาด/ความหนาเดียวกัน วิดีโอใช้ไฟล์ .jpg ส่วน .png เป็นสำเนา
- **โครงสร้าง source**: แก้บท/เวลาใน [video/timing.json](video/timing.json) แล้วรัน `node build.mjs` ในโฟลเดอร์ `video/` จะสร้าง `index.html` และ [VOICE-SCRIPT.md](video/VOICE-SCRIPT.md) ใหม่ sample v1 เดิมเก็บไว้ที่ `video/evidence/sample-v1/`
- **ฉากใหม่ B01, B02, B06**: เปิดเรื่อง (มือถือ + คำถาม), ภาพรวมท่อ 3 สเต็ป, เช็กลิสต์ 3 ข้อ (โหมดเสียง + publish, สิทธิ์ 2 ตัว, Key ฝั่ง server) เฟรมตรวจที่ [video/evidence/full-v1/b01-b02-b06-frames.jpg](video/evidence/full-v1/b01-b02-b06-frames.jpg)
- **บทและ claim ledger**: [SCRIPT.md](SCRIPT.md) v2 แก้ให้ตรงคู่มือแล้ว (สิทธิ์ `voice:invoke` + `chat:invoke`, publish, endpoint สเต็ป 2, MP3/WAV, ไม่มีคำว่า "ทันที")

## เอกสารประจำตอน
| เอกสาร | หน้าที่ | สถานะ |
|---|---|---|
| [README.md](README.md) | สถานะภาพรวมของตอน และลำดับถัดไป | อัปเดตล่าสุด |
| [PLAN.md](PLAN.md) | แผน W3: โจทย์คนดู ขอบเขต use case และโครงเรื่องคร่าว ๆ | จัดทำแล้ว |
| [SCRIPT.md](SCRIPT.md) | บทพากย์ภาษาพูด 6 Beats และ Claim Ledger ตรวจเทียบ API | v2 แก้ตามคู่มือ |
| [CATALOG.md](CATALOG.md) | ทะเบียนคัดเลือกบล็อก Motion ตามหน้าที่ของแต่ละ Beat | จัดทำแล้ว |
| [STORYBOARD.md](STORYBOARD.md) | Storyboard ราย Beat, การเลือกช่วง Sample, และแบบกำหนดหน้าจอ Mockup (APP-VOICE-Q / A) | จัดทำแล้ว |
| [video/index.html](video/index.html) | HyperFrames ฉาก Sample B03–B05 (สร้างจาก `build.mjs`) | draft v2 |

## ลำดับถัดไป (Next Actions)
1. ดู [video/ep04-full-draft-v2.mp4](video/ep04-full-draft-v2.mp4) (86.3 s) บนมือถือ ฟังการออกเสียงชื่อเฉพาะ และดูว่าซับตรงเสียง
2. ถ้ามีคำที่ออกเสียงผิด แก้คำใน `say` ของ [video/timing.json](video/timing.json) แล้วรัน `python make-voice-samples.py` และ `node build.mjs`
3. ตรวจเงื่อนไขการใช้เสียง Edge TTS ก่อนเผยแพร่ แล้วบันทึกผลรับงานใน [video/REVIEW.md](video/REVIEW.md)
4. เมื่อรับงานแล้ว render ฉบับส่งมอบด้วย `npx hyperframes render --quality delivery`

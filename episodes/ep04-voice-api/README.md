# EP04 — Voice API: คุยกับ AI ด้วยเสียงพูด

Episode ID: `ep04-voice-api`  
อัปเดต 7 พฤศจิกายน 2026 (Asia/Bangkok)

## สถานะปัจจุบัน: W5 — Sample B03–B05 draft v2 (ยังไม่มีเสียงพากย์)

- **วิดีโอตัวอย่าง**: [video/ep04-b03-b05-draft-v2.mp4](video/ep04-b03-b05-draft-v2.mp4) ยาว 52 วินาที เวลาประมาณจากความยาวบท ผลตรวจและข้อจำกัดอยู่ที่ [video/REVIEW.md](video/REVIEW.md)
- **ภาพหน้าจอจำลอง**: [app-voice-q.jpg](video/assets/app-voice-q.jpg) (กดไมค์พูด) และ [app-voice-a.jpg](video/assets/app-voice-a.jpg) (เล่นเสียงตอบ กล่องตอบสีเขียวอ่อน) สร้างจากภาพต้นฉบับเดียวกันด้วย [make-voice-screens.py](video/evidence/make-voice-screens.py) ฟอนต์/ขนาด/ความหนาเดียวกัน วิดีโอใช้ไฟล์ .jpg ส่วน .png เป็นสำเนา
- **โครงสร้าง source**: แก้บท/เวลาใน [video/timing.json](video/timing.json) แล้วรัน `node build.mjs` ในโฟลเดอร์ `video/` จะสร้าง `index.html` และ [VOICE-SCRIPT.md](video/VOICE-SCRIPT.md) ใหม่ sample v1 เดิมเก็บไว้ที่ `video/evidence/sample-v1/`
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
1. ทำเสียงตัวอย่าง B03–B05 จาก [VOICE-SCRIPT.md](video/VOICE-SCRIPT.md) อย่างน้อย 2 เสียงให้เลือก บันทึกบริการ/เสียง/สิทธิ์ที่ใช้
2. วางไฟล์ที่เลือกเป็น `video/assets/voice/b03.wav`, `b04.wav`, `b05.wav` แล้วรัน `node build.mjs`, `npx hyperframes check`, `npx hyperframes render --quality draft`
3. ฟังตรวจการออกเสียงชื่อ LangMind / endpoint และเทียบซับกับเสียงจริง แล้วบันทึกผลใน REVIEW
4. หลังผ่าน sample ปรับ Storyboard ของ B01, B02, B06 แล้วขยายเป็นทั้งตอน (W6)

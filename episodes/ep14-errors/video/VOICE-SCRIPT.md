# EP14 Errors — บทสำหรับสร้างเสียง

รัน `python make-voice-samples.py` (สร้างเสียงทีละประโยคจาก timing.json) แล้ว `node build.mjs`

## b1 → assets/voice/b1.wav
ระบบหลังบ้านของร้านเรียก API ทุกวัน วันหนึ่งหน้ากล่องแชทขึ้นแค่ว่า เกิดข้อผิดพลาด error แบบนี้หน้าตาเป็นยังไง แปลว่าอะไร และควรรับมือยังไง มาดูกันครับ

## b2 → assets/voice/b2.wav
ทุก error ของ LangMind หน้าตาเดียวกัน code บอกว่าเป็นกรณีไหน message คือข้อความภาษาไทย message en คือภาษาอังกฤษ และมี request id ประจำคำขอ ให้เช็กที่ code เสมอ ไม่ต้องแกะข้อความ

## b3 → assets/voice/b3.wav
401 UNAUTHORIZED คือ Key ขาด หมดอายุ ถูกเพิกถอน หรือเรียก endpoint ที่ต้องเข้าสู่ระบบผ่านเว็บ ทางแก้ เช็ก Authorization Bearer หรือสร้าง Key ใหม่ในหน้า Personal API Key

## b4 → assets/voice/b4.wav
403 FORBIDDEN คือ Key ไม่มี scope ที่ endpoint ต้องการ หรือ role ไม่พอ เช่นเรียก Inbox ด้วย Key ที่ไม่มี inbox read ทางแก้ ใช้ Key ที่มี scope ตรงกับงาน

## b5 → assets/voice/b5.wav
404 NOT FOUND คือไม่พบ หรือเป็นของบัญชีอื่น ส่วน 422 VALIDATION ERROR คือ body หรือ query ผิดรูปแบบ ส่งซ้ำแบบเดิมก็ได้ผลเดิม ต้องแก้คำขอก่อน

## b6 → assets/voice/b6.wav
429 RATE LIMIT EXCEEDED คือเรียกถี่เกินลิมิต ให้รอแล้วลองใหม่ รายละเอียดลิมิตดูต่อใน EP15 แต่ 429 VOICE QUOTA EXCEEDED คือโควตาเสียงไม่พอ ต้องดูยอดคงเหลือ ไม่ใช่แค่รอ

## b7 → assets/voice/b7.wav
ฝั่ง Voice ยังมี VOICE DISABLED คือยังไม่เปิดเสียงในเวอร์ชันที่เผยแพร่ และ VOICE NOT IN PLAN คือแพ็กเกจไม่รวมงานเสียง NO CREDENTIAL คือโมเดลของ agent ยังไม่มี API key และ FORMAT UNSUPPORTED ให้แปลงไฟล์เป็น WAV แล้วส่งใหม่

## b8 → assets/voice/b8.wav
จำง่าย ๆ เป็นสามกลุ่ม รอแล้วลองใหม่ได้ คือ rate limit แก้คำขอก่อน คือ 401 403 404 422 และไฟล์เสียงผิดรูปแบบ ที่เหลือของ Voice ต้องไปตั้งค่าในเว็บ หรือดูแพ็กเกจ

## b9 → assets/voice/b9.wav
ในระบบหลังบ้าน บันทึก status code และ request id ไว้ใน log ที่ลองใหม่ได้ให้ระบบลองเอง ที่เหลือแจ้งทีม หน้าจอของทีมก็บอกทางแก้ได้ แทนคำว่า เกิดข้อผิดพลาด เฉย ๆ

## b10 → assets/voice/b10.wav
สรุปครับ อ่านจาก code เก็บ request id และรับมือตามสามกลุ่ม

## b11 → assets/voice/b11.wav
คลิปนี้สนับสนุนโดย LangMind เริ่มเชื่อม API ได้ที่ LangMind ดอท อิน ดอท ทีเอช

# EP02 component sample r7

36 วินาที 1080×1920 ด้วย Explainroo 0.4.1 โดยตรง สามฉาก ไม่มีเสียง ไม่ใช่คลิปเต็ม ยังไม่มี user acceptance.

Visual: เปิด still chat@9/key@10/code@8 จริง ภาษาไทยครบ ไม่ล้นกรอบ; chat คงประวัติถามต่อ; key checkbox/cursor เป็น animation; code ใช้ syntax highlight และ steps เพิ่ม answer. ไม่มี API calls. UI/คำตอบเป็นภาพจำลอง route /api/chat เป็นของแอป.

Verification: still exit 0. check --view-width 540 exit 0 ไม่มี error แต่เตือนข้อความรอง URL labels และ code ต่ำกว่า 16px ที่ player 540px และช่วง hold. ไม่ถือว่าผ่าน readability โทรศัพท์ 360px. การเปลี่ยนข้อความผ่าน s.t บางส่วนไม่อยู่ใน cue hints.

Antislop scoped gate: hierarchy PASS จากหนึ่งจอหลักต่อฉาก; evidence PASS จากป้ายจำลองและไม่มี metrics แต่ง; identity PASS จาก Sarabun/cream/สีแยกบทบาท; framing PASS จากสาม stills. Interactive app gates ไม่เกี่ยวกับ MP4.

ข้อจำกัด: sample ไม่มีเสียง ไม่มี robot/โลโก้ภาพจริง ใช้ชื่อแบรนด์ตัวอักษร จึงยังไม่ใช่ delivery เต็ม. ต้องตรวจ export และผู้ใช้ดูทิศทางก่อนขยาย. ไม่ได้ดาวน์โหลด speech models.

Export: render exit 0, 1080 frames, 36.000s, H.264 1080×1920 30fps. FFmpeg full decode exit 0. มี AAC stream ที่ engine สร้าง โดยไม่มีบทพากย์หรือเพลงตาม config. ตรวจ contact sheet จาก MP4 9 เฟรมแล้ว UI ต่อเนื่องไม่ล้นกรอบ.

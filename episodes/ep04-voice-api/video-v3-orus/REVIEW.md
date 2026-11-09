# EP04 V3 — Orus draft

9 พฤศจิกายน 2026 · เสียง Orus จาก LangMind Voice Studio, google/gemini-3.8-flash-lite-tts, 1x; b1 ใช้ตัวอย่างแบบ 3 ที่ผู้ใช้เลือก และ b2–b9 สร้างเป็นย่อหน้าต่อเนื่องตามบทเดิม

- ไฟล์ `ep04-v3-orus.mp4`: 138.1 วินาที, 1080×1920, 30 fps, H.264/AAC
- `node build.mjs`: 9 beats, 27 captions; ใช้ความยาวเสียงจริง แต่ขอบซับประมาณจากความยาวข้อความและช่วงเงียบ ไม่ใช่ forced alignment
- `npx --yes hyperframes check --json`: ok=true; 0 errors; lint 4 warnings, contrast 9 warnings, craft 1 warning ช่วงผลถอดเสียง b4 แสดงประมาณ 2.29 วินาที
- `npx --yes hyperframes render --quality delivery -o ep04-v3-orus.mp4`: สำเร็จ
- `ffprobe` และ `ffmpeg -v error -i ep04-v3-orus.mp4 -f null -`: มี video/audio และ decode ผ่าน
- ตรวจภาพนิ่ง 67 วินาที `check-b4.jpg`: แสดงฉากและซับได้; ยังไม่ได้ตรวจทุกเฟรมหรือฟังเสียงทั้งตอน จึงยังไม่ยืนยันการออกเสียงและความตรงของซับ
- ภาพหน้าจอและผล API เป็นภาพจำลอง ไม่ใช่ผลเรียกจริง; รอผู้ใช้ตรวจรับ

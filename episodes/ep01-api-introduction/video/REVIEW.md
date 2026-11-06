> Historical / งานพักไว้ — 6 พ.ย. 2026: เอกสารนี้เก็บแผนหรือหลักฐาน ณ รุ่นเดิม ไม่ใช่คำสั่งผลิตหรือ storyboard ที่อนุมัติสำหรับรอบใหม่ งานปัจจุบันคือรีเซ็ตระบบระดับโปรเจกต์ตาม README.md และแผนหลัก เก็บเนื้อหาเดิมไว้เทียบ ไม่ใช้สถานะ PASS หรือ Next action ด้านล่างรับรองงานใหม่

# Review: EP01 API introduction, visual prototype v001

## ขอบเขต

เลือก storyline A ใช้คำถามหนึ่งข้ออธิบาย API ก่อนแสดงความสามารถ LangMind; ทางเลือก B เป็นกล่องเครื่องมือ developer, C เป็นคำถามที่เดินทางหลายช่องทาง ยังไม่ผลิต

มี storyboard พร้อมบท 11 ฉาก, หน้าจอจำลอง, request example, original vector character หนึ่งท่า, โลโก้ผู้ใช้, local Thai font และ HyperFrames source ยาว 114 วินาที ไม่เรียก LangMind, HeyGen models หรือบริการเสียเงิน

## หลักฐานตรวจ

- `hyperframes lint --json`: 12 composition files, 0 errors, 0 warnings
- `hyperframes check --at 4,15,27,37,48,60,71,81,90,101,111 --json`: ok true; lint/runtime/layout/contrast errors 0; browser รันจริง ไม่ได้ skip ผลเต็มใน check-report.json
- รอบแรกพบ text overlap 5 จุด แก้ให้ stage มีพื้นที่แยกจาก caption; รอบสองผ่าน แล้วขยาย code/หมายเลขที่เล็กกว่า floor และตรวจอีกครั้งผ่าน ไม่มี text_below_floor เหลือ
- Snapshot ทุกฉากรวมเฟรมท้าย; ดู overview 4×3 และภาพ chat เต็ม ตรวจภาษาไทย รูปโลโก้ ป้ายภาพจำลอง และตัวละครไม่บังหน้าจอ
- `snapshot --review` สำเร็จ exit 0 สร้าง beat/phone sheets และ seam strips; เปิดดู phone sheets ทั้งสองและ seam 4 (39.8–40.2s) ไม่พบ blank cut หรือการซ้อนข้อความในส่วนที่ตรวจ ไม่ได้อ้างว่าดูทุกเฟรมของทุก seam
- เปิด preview ที่ localhost:3002; browser แสดง timeline 01:54 และ 11 clips; Play เปลี่ยนเป็น Pause และเวลาเลื่อน, Pause กลับเป็น Play ที่ 00:04 ทดสอบจริง ไม่มีการกด export/publish ใน UI
- Doctor: Node/FFmpeg/Chrome พร้อม แต่ overall ok false เพราะ optional whisper/Kokoro/MusicGen ไม่มี ไม่จำเป็นสำหรับ visual-only prototype นี้
- CLI 0.9.19 รายงาน skillsOutdated 2 แม้เพิ่งติดตั้งชุด repository; ไม่ update skills ระหว่าง authoring โดยอัตโนมัติ ไม่ใช่ runtime error ของคลิป

## Warnings ที่คงไว้ด้วยเหตุผล

- film_silent 1: เป็น visual animatic ไม่มีเสียงพากย์จริง ไม่อ้างว่าเป็นวิดีโอพร้อมเผยแพร่ ผู้ใช้เลือก male Thai tone แล้ว มีบทให้เตรียมเสียงภายหลัง
- dead_stretch 9: ช่วงพักเพื่ออ่านเนื้อหาและเป็นช่องสำหรับเสียงที่จะใส่ ไม่เพิ่ม drift/loop เพียงให้ audit เงียบ Timing ต้องปรับกับเสียงจริงในขั้นถัดไป
- ยังไม่ได้ทำ burn-in subtitles แบบตรงคำพากย์ ข้อความใต้จอเป็น key message ของฉาก ไม่อ้างว่าซิงก์เสียงแล้ว

## Antislop Delivery Gate (ขอบเขต visual prototype)

- Hard Gate ด้านข้อมูล PASS: ป้ายจำลองอยู่ในฉากตัวอย่าง ไม่มี live result/citation/usage ที่แต่งเป็นของจริง ไม่มี key จริง ใช้โลโก้ที่ผู้ใช้ให้ และไม่มี em dash ใน copy ของฉากที่เขียนใหม่
- Hard Gate ด้าน layout/contrast PASS: check รัน browser จริงด้วย samples 11 ฉาก runtime/layout/contrast error 0 ตรวจ snapshot ประกอบ ไม่มี interactive mock buttons ที่ปลอมเป็นแอปใช้งานจริง
- Purpose Gate PASS: เหตุผลของ palette/พื้นกระดาษ/กรอบ/ตัวละคร/animation อยู่ใน SPEC ตาม reference ไม่ใช้ gradient background/glow เป็น default
- Liveliness PASS ในร่าง: ENERGY 2 / RHYTHM 2 / MOTION 2; ใช้การเปิดเผย request/response และข้อมูลตามความหมายหนึ่งจุดต่อจังหวะ กรอบคงที่สำหรับซีรีส์แต่เปลี่ยนวัตถุหลัก ไม่อ้างว่าตัวละครมี lip sync
- Craftsmanship PASS สำหรับขอบเขตร่าง: มี source แก้ไขได้ 11 ฉาก สถานะ UI ในคลิปเป็น illustration ไม่อ้างว่าแอปเชื่อม API แล้ว Preview Play/Pause ทดสอบจริง

เกณฑ์ keyboard/forms/empty/error ของ production demo ยังไม่ใช่สิ่งส่งมอบในรอบนี้ ไม่ตีตราว่าแอปผ่าน accessibility ทั้งระบบ ยังไม่มี live demo ให้ตรวจ

## จุดที่ควรปรับก่อน final

ฉาก 9 เป็นช่วงที่อัดข้อมูลมากที่สุด ควรทดสอบกับเสียงจริงแล้วเลือกว่าจะเก็บ Short Links/Inbox ไว้หรือย้ายไปคลิปอื่น ตัวละครยังท่าเดียวและส่วนประกอบหลักมีกรอบร่วมกัน ควรเลือกแบบตัวละครก่อนทำหลายท่า ลดข้อความซ้ำระหว่าง narrator กับจอ และล็อกความยาวเมื่อมีเสียง

## Render

สร้างด้วย `hyperframes render --quality draft --fps 15 --workers 1 -o ../exports/ep01-api-introduction-v001-draft.mp4` สำเร็จ exit 0 ใช้ CLI 0.9.19 ผ่าน path ใน npm cache เพราะ npx unpinned invocation ค้างตอนตรวจ network ภายใน sandbox หยุด invocation ที่ค้างแล้วใช้ binary เดิมโดยตรง ไม่ใช่การเปลี่ยน renderer

ผล render: 1710 frames, 1080×1920, H.264, 15 fps, 114.000000 วินาที, 1,928,577 bytes, ไม่มี audio track ยืนยันด้วย ffprobe จากไฟล์จริง Render report ระบุ hardware GPU / drawelement capture จบในประมาณ 41 วินาที

ถอดภาพจาก MP4 จริงที่ 4/15/27/37/48/60/71/81/90/101/111s และเฟรมสุดท้ายเป็น storyboard-rendered.png ตรวจภาพรวมครบ ไม่พบฉากหาย ตัวหนังสือไทยหรือโลโก้เพี้ยน และไม่มีข้อความชนกันใน frames ที่ตรวจ แยก request-screen.png สำหรับดูรายละเอียดฉาก 10 ไม่อ้างว่าฟังเสียงแล้วเพราะไม่มีเสียง

Preview เปิดให้แก้ต่อที่ http://localhost:3002/#project/video ผู้ใช้ใช้ HyperFrames desktop app แก้ต่อได้เช่นกัน แต่ยังไม่ส่ง source ไป cloud หรือเผยแพร่

เอกสารโปรเจกต์ตรวจ PowerShell: 19 files, 62 local links, broken 0; scene count 11 และ logo hash ตรง shared asset

> สถานะล่าสุด 7 พ.ย. 2026: EP02 r10 ผลิตฉบับภาพไม่มีเสียงตามคำสั่งผู้ใช้แล้ว ใช้ Catalog code-highlight จริง13cue; 440s/13200frames; MP4 H.2641080×1920/30fps BT.709/AAC48k stereoเงียบ full decode exit0 ตรวจexport86framesและplaybackช่วงสำคัญ175.8sแล้ว · [สถานะตอน](../../episodes/ep02-custom-chat/README.md) · [ผลตรวจและสิ่งยังไม่ตรวจ](../../episodes/ep02-custom-chat/video-continuity-r10/REVIEW.md) · [บันทึกผลิต](2026-11-07-ep02-r10-production.md) ยังไม่มีVO/captionsจากเสียงจริง ไม่publish ไม่อ้างuser acceptance สถานะเดิมด้านล่างเป็นประวัติ

> งาน active 7 พ.ย. 2026: ปรับแบบ EP02 r10 เสร็จในขอบเขต design/docs ยังไม่ผลิต/render ใหม่ ดู [สถานะตอน](../../episodes/ep02-custom-chat/README.md) และ [หลักฐานรอบนี้](2026-11-07-ep02-continuity-r10.md) Storyboard16ฉากงบ440s ต้องจับเวลาจากVOจริงก่อนผลิต แผน/ผลผลิตr9ด้านล่างเก็บเป็นประวัติ ไม่ใช่คำสั่งผลิตในรอบนี้

> สถานะปัจจุบัน 7 พ.ย. 2026: ผลิต EP02 ฉบับเต็ม LangMind Brand r9 ตาม sample ที่ผู้ใช้เลือกแล้ว ครบ B01–B16 / 38 ช็อต / 310.433333 วินาที / 1080×1920 30fps H.264/AAC พร้อมเสียงเดิม 1x ซับสรุป 51 ช่วงและ chapters 16 ตอน Render/decode ผ่านและ audio payload hash ตรงต้นฉบับ รอผู้ใช้ตรวจฉบับเต็ม ยังไม่ publish ข้อความอัปเดตด้านล่างเป็นประวัติก่อนรุ่นนี้ · [ดูฉบับเต็ม](../../episodes/ep02-custom-chat/video-full-brand-r9/ep02-complete-langmind-r9.mp4) · [ผลตรวจและข้อจำกัด](../../episodes/ep02-custom-chat/video-full-brand-r9/REVIEW.md)

> สถานะล่าสุด: ผู้ใช้อนุมัติผลิต EP02 ครบ B01–B16 ตามตัวอย่าง Notebook ที่เลือก พร้อมยอมรับข้อจำกัดเสียงเดิม ส่งออกฉบับสมบูรณ์ video-final-notebook-v1 แล้ว ยาว 310.433333s H.264/AAC 1080x1920 30fps และ full decode ผ่าน รอผู้ใช้ตรวจ; รายละเอียดและผลส่งมอบอยู่ README ตอน ไม่แก้ EP01

> อัปเดต 7 พฤศจิกายน 2026: งาน active คือออกแบบ EP02 เว็บแชทของเราเองด้วย LangMind Agent โครงเรื่องได้รับอนุมัติ เพิ่ม Multi Device Splay และฉากปิด Extruded Logo กับโลโก้จริง รายละเอียดสถานะอยู่ README EP02 ส่วนงาน EP01 และฐานกลางด้านล่างเป็นประวัติ

# แผนหลัก — รีเซ็ตระบบการทำงานระดับโปรเจกต์

ประเภท: Commit — เก็บเป็นเอกสารต่อเนื่อง ไม่ได้หมายถึง git commit
อัปเดต 6 พฤศจิกายน 2026 (Asia/Bangkok)

## งานปัจจุบัน
ผู้ใช้ระบุว่า EP01 อยู่ในระดับยอมรับได้สำหรับเดินหน้าตอนต่อไปและไม่ให้แก้ EP01 เพิ่ม งาน active คือ [EP02 เว็บแชทของเราเอง](../../episodes/ep02-custom-chat/README.md) โครงเรื่องรอบวิเคราะห์ได้รับอนุมัติพร้อมคำขอเพิ่มสอง Catalog และประโยคส่งท้าย

รอบนี้บันทึกแผนและออกแบบช่วงเพิ่มเติม ยังไม่ผลิต timeline ภาพ เสียง หรือ MP4 ดู [แผน EP02](../../episodes/ep02-custom-chat/PLAN.md) สำหรับขอบเขตที่อนุมัติ แบบช่วงท้าย ข้อจำกัด Catalog และลำดับงานถัดไป ไม่ตีความการอนุมัติแนวเรื่องเป็นผลตรวจรับภาพหรือเสียงที่ยังไม่ผลิต

## ประวัติการจัดฐานกลางก่อนคำสั่งรีเซ็ต EP01
ส่วนด้านล่างบันทึกรอบก่อน ไม่ใช่สถานะหรือสิทธิ์ผลิตปัจจุบัน ไฟล์ EP01 เก่าที่กล่าวถึงถูกลบแล้ว

### ขอบเขตรอบก่อน
ผู้ใช้ให้กลับมาวิเคราะห์และออกแบบ AGENTS กับเอกสารทั้งหมดก่อน หยุดวนกับ EP01 และนำ robot-all-44-poses.zip เป็นตัวละครกลาง
รอบนี้แก้เอกสาร/นำเข้า assets เท่านั้น ไม่ออกแบบ storyboard รายตอน ไม่เจนภาพ ไม่แก้ composition ไม่ render ไม่ live/paid API และไม่ publish
สิทธิ์ prototype ที่เคยให้เป็นประวัติ ไม่ใช่ next action ในรอบรีเซ็ต

## ปัญหาที่นำมาแก้ระบบ
- Brief และ workflow เดิมยังผูกกับร้านคืนสินค้า/live demo ขณะที่โจทย์เปลี่ยนไปแล้ว
- ทางเข้าเอกสารและ blueprint ทำให้กลับไปผลิต EP01 อัตโนมัติ
- แผนเน้นเนื้อหาครบกับข้อห้าม แต่ไม่แยกหน้าที่ภาพ/เสียง/ข้อความต่อ beat
- การเลือก Catalog ยังไม่เป็นขอบเขต motion ก่อน storyboard
- เกณฑ์ technical pass ถูกวางใกล้คำตัดสินภาพจนแยกความหมายไม่ชัด
ข้อวิเคราะห์ v3 มาจาก blueprint source และ saved snapshots ไม่ใช่การดู playback ใหม่หรือวัด retention

## Blast radius และแผนรอบนี้
ปรับ entry points, AGENTS, brief, workflow, style, workspace map, skills และ sources
เพิ่มข้อกำหนด storyboard/prompt กับ Catalog map นำเข้า robot พร้อม manifest/contact sheet
ปรับ README ตอนเดิมให้เป็นงานพัก และติดป้าย historical ในเอกสารแผน/blueprint เก่า โดยเก็บเนื้อหา/source/exports เดิม
ไม่เปลี่ยน langmind-api.md, HyperFrames source, skills installation หรือ dependencies

## สถานะและลำดับถัดไป
ข้อตกลงเพิ่มหลังทบทวน: สื่ออธิบาย use case จากคำถามคนดู ไม่ต้องสร้างระบบจริง; Catalog เป็นฐานหลัก เลือก/ปรับรายคลิป custom เฉพาะช่องว่างจำเป็น; robot เป็นตัวประกอบไม่กำหนดคลิป
ผู้ใช้อนุญาตเพิ่มการวางแผนจากมุมคนดู ขอบเขตคำตอบ ตรวจหลักฐานก่อนผลิต ตรวจแผนด้วยคำถามคนดู และเลือก sample ตามความไม่แน่นอน พร้อมกำหนดให้ทุกภาพหน้าจอมีแบบก่อนเจน
รอบเพิ่มนี้กระทบ 6 ไฟล์: AGENTS, PROJECT_BRIEF, WORKFLOW, STORYBOARD_GUIDELINES, VIDEO_STYLE_GUIDE และแผนนี้ ไม่เริ่มรายตอนหรือผลิตภาพ
| งาน | สถานะ | ผลส่งมอบ/สิ่งค้าง |
|---|---|---|
| ตรวจและจัดเอกสารกลาง | จัดทำและตรวจ links แล้ว รอผู้ใช้ทบทวนแนวทาง | AGENTS/brief/workflow/style/map และ guidelines |
| นำเข้าตัวละครกลาง | ตรวจไฟล์ครบและดู contact sheet แล้ว | 44 PNG, ZIP, manifest, contact sheet; ยังไม่ตรวจ placement ในคลิป |
| W1 สำรวจขอบเขต Catalog | มีทะเบียนและผลสำรวจใน Catalog map แล้ว | ตามรายงาน: 448 รายการ อ่านเชิงลึก 40 ดู motion 3; ยังไม่ยืนยัน integration กับ assets โปรเจกต์ และรอบนี้ไม่ได้ตรวจนับต้นทางซ้ำ |
| W2 แนวทางภาพและการเล่าตั้งต้น | ยังไม่เริ่มผลิต | ปรับได้ตาม sample; ยังต้องกำหนดขอบเขตตัวอย่างก่อนผลิต |
| W3–W7 งานรายตอน | พัก | ไม่เริ่ม storyboard หรือ EP01 ต่ออัตโนมัติ |

Next action: ใช้ workflow ที่ปรับแล้วเมื่อกำหนดงานถัดไป เป้าหมายยังเป็นการนำ LangMind API ไปใช้ ได้รับคำอธิบายผลิตภัณฑ์และมีทะเบียน Catalog แล้ว งานรายตอนยังพัก ไม่เริ่มซีน sample หรือผลิตจากการแก้เอกสารครั้งนี้
การเขียนเอกสารเสร็จไม่ใช่การอนุมัติภาษาภาพหรือรับงานจากผู้ใช้

## แผนปรับ workflow หลังทบทวนร่วมกัน
ขอบเขต 7 ไฟล์: AGENTS, PROJECT_BRIEF, WORKFLOW, CATALOG_USAGE_MAP, STORYBOARD_GUIDELINES, VIDEO_STYLE_GUIDE และแผนนี้ ไม่ผลิตรายตอน
ลำดับแก้: แยกสำรวจ Catalog จากเลือกใช้ → เพิ่มโครงซีนคร่าว ๆ ก่อนเลือก → ระบุหน้าที่ภาพ/เสียง/ข้อความ/ซับ → ตรวจ links ความสอดคล้อง และ hash คู่มือ API
สถานะเมื่อวางแผนรอบก่อน: รอผลสำรวจ Catalog ภายนอก ปัจจุบันมีรายงานใน CATALOG_USAGE_MAP แล้ว โดย coverage และข้อจำกัดดูจากเอกสารนั้น ไม่ถือว่าทุกรายการผ่าน motion/integration
ได้รับคำอธิบายผลิตภัณฑ์แล้ว ความเข้าใจแพลตฟอร์มช่วยเลือก use case; ก่อนล็อก claims รายคลิปยังต้องตรวจหลักฐาน API ที่เกี่ยวข้อง

## รอบปรับขอบเขตตาม use case และวิเคราะห์ workflow
แก้ 3 ไฟล์: WORKFLOW, STORYBOARD_GUIDELINES และแผนนี้ รวมคำถามร่วมไว้ใน W3 เดิมและเชื่อมกลับจาก guidelines ไม่เพิ่มขั้นผลิตหรือบังคับสร้างระบบจริง
ปรับสถานะ W1 ให้ตรงรายงาน Catalog โดยไม่แก้ผลสำรวจหรือหลักฐานเก่า วิเคราะห์ workflow จากเอกสาร ไม่ใช่ผลทดสอบกระบวนการผลิตจริง
ข้อเสนอในรอบวิเคราะห์: แยกฐานกลางจากวงรอบรายคลิปให้ชัด, กำหนดขอบเขต sample ให้พอดีกับความไม่แน่นอน, วางเสียงก่อนล็อก timing และระบุขั้นที่ย้อนกลับเมื่อพบปัญหา ต่อมาผู้ใช้อนุญาตให้แก้แล้ว ผลดำเนินการอยู่ด้านล่าง
Verification command: PowerShell inline ตรวจ Markdown local file links ด้วย regex + Test-Path, Get-FileHash langmind-api.md -Algorithm SHA256 และ rg ตรวจข้อความที่เพิ่ม
Terminal result: Documents checked 3; Local file links checked 5; Broken links 0; API snapshot unchanged True; exit code 0 ตรวจ anchor W3 ด้วยการอ่านหัวข้อปลายทาง ไม่ได้รัน Markdown renderer
ไม่รัน build/render/live API เพราะแก้เอกสารเท่านั้น ผลวิเคราะห์ยังไม่ได้พิสูจน์ด้วยการผลิตคลิปใหม่ Nexus brief/save ในการตรวจรอบก่อนใช้ไม่ได้จาก projectId validation จึงไม่มี session ที่บันทึกสำเร็จ

## Verification
### รอบนำข้อเสนอ workflow มาใช้
ผู้ใช้อนุญาตทั้ง 5 จุด แก้ WORKFLOW, STORYBOARD_GUIDELINES และแผนนี้: แยกฐานกลาง/รายคลิป จัดรายละเอียดก่อนและหลัง sample แยกตรวจ API/สื่อ วางลำดับเสียง และเพิ่มเส้นทางย้อนแก้พร้อมผูกผลตรวจกับรุ่นงาน ไม่เพิ่มขั้นอนุมัติหรือเริ่มผลิต
ตรวจ local file links และ hash คู่มือเดิมด้วย PowerShell พร้อมตรวจข้อความและความสอดคล้องของเอกสาร ไม่รัน build/render/API สำหรับงานเอกสารนี้
Verification Command: PowerShell regex Markdown links + Test-Path; Get-FileHash langmind-api.md -Algorithm SHA256; rg ตรวจหัวข้อและข้อกำหนดที่เพิ่ม
Terminal Result: Documents checked 3; Local file links checked 6; Broken links 0; API snapshot unchanged True; exit code 0 อ่านทวน W4/W5/W6 กับ guidelines ให้ขอบเขตก่อน/หลัง sample ตรงกัน ยังไม่ได้ตรวจ Markdown renderer หรือทดลอง workflow ผ่านการผลิตจริง

รอบนี้จะตรวจ local links ของเอกสารทั้งหมดที่ดูแล (ยกเว้น snapshot API และ installed skills), hash API, ZIP เทียบต้นฉบับ, PNG hashes เทียบ entries และ manifest, decode/dimensions/alpha และเงื่อนไขสถานะเอกสาร
ผลจริงอยู่ส่วนท้าย ไม่ใช้ checks เดิมรับรองระบบใหม่
Nexus get_state ใช้ได้ แต่ brief เฉพาะโปรเจกต์ล้มเหลว projectId validation ใช้ workspace เป็นหลัก ไม่ใช้ข้อมูลโปรเจกต์อื่น

## ประวัติก่อนรีเซ็ต
เคยจัด workspace และติดตั้ง HyperFrames 9 skills, antislop ระดับเครื่องมี 6 skills รับโลโก้ไว้ shared และผลิต prototype หลายรุ่น
หลักฐานแต่ละตอนอยู่ README/REVIEW ของตอน ไม่ใช่ขอบเขต active ของแผนนี้
แผน EP01 เดิมเก็บในโฟลเดอร์ plans เป็น historical ไม่ใช่ next action กลาง
API snapshot baseline SHA-256: DDDBE02F30EC0215E98CB515A3D3374A85F754298163ED84F21FACC6E9164A2C

## ผลตรวจรอบรีเซ็ต
Verification command: PowerShell inline ใช้ regex markdown links + Test-Path, Get-FileHash, System.IO.Compression.ZipFile และ System.Drawing.Bitmap อ่าน PNG จริงเทียบ manifest และ ZIP entries
Terminal result: Documents checked 28; Local links checked 72; Broken links 0; PNG decoded and hashed 44; PNGs with transparent pixels 44; Asset errors 0; API snapshot unchanged True; exit code 0
ZIP สำเนาเทียบต้นฉบับ Downloads: hash matches True; PNG entry hashes ตรงกับไฟล์นำเข้าและ manifest ทุกไฟล์
ตรวจภาพ contact sheet ครบ 44 ท่า ไม่อ้างตรวจรายละเอียดภาพเต็มทุกท่าหรือความคมเมื่อขยายบน master
ตรวจด้วยการอ่านทวน: แผนกลางไม่สั่งผลิต EP01, W1 ยังไม่เริ่ม, ไม่มีรายการ Catalog ใหม่ที่อ้างว่าเลือกแล้ว, robot เป็นตัวละครงานใหม่, ประวัติเก่ายังคงเนื้อหาใต้ป้าย historical
ไม่รัน build/render/runtime/API checks เพราะแก้เอกสารและนำเข้าสื่อ ไม่แก้ composition/config; ไม่รับรองภาพหรือเสียงของคลิปใหม่

### ผลตรวจหลังเพิ่มข้อกำหนดจากคนดูและแบบหน้าจอ
PowerShell inline: regex Markdown links + Test-Path และ Get-FileHash; Documents checked 28; Local links checked 74; Broken links 0; API snapshot unchanged True; exit code 0
อ่านทวน 6 ไฟล์ที่แก้: มีโจทย์คนดู/ขอบเขตคำตอบ แบบหน้าจอทุกภาพ การเลือก Catalog รายคลิปและ robot เป็นตัวประกอบตรงกัน ไม่มี storyboard หรือภาพใหม่ ไม่รัน build/render เพราะแก้เอกสารล้วน

### ผลตรวจหลังปรับลำดับ Catalog และหน้าที่สื่อ
แก้เอกสาร 7 ไฟล์ตามขอบเขต ตรวจด้วย PowerShell: regex Markdown links + Test-Path, Get-FileHash และ rg ค้นข้อความลำดับเดิม
Terminal result: Documents checked 7; Local links checked 25; Broken links 0; API snapshot unchanged True; ข้อความลำดับเดิมที่ค้นไม่พบ; exit code 0
อ่านทวน: แยกสำรวจ/เลือก Catalog โครงซีนคร่าว ๆ มาก่อนเลือก และหน้าที่ภาพ/เสียง/ข้อความ/ซับตรงกัน ไม่มีซีนรายตอนหรือรายการ Catalog ที่อ้างว่าตรวจแล้วเพิ่ม
ข้อจำกัด: workspace นี้ไม่มี Git repository จึงใช้ git diff ไม่ได้; ไม่รัน build/render/API เพราะแก้เอกสารล้วน ไม่รับรองภาพ เสียง หรือผลสำรวจภายนอก

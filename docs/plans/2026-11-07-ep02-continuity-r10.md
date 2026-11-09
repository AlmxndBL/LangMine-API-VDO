# EP02 ปรับเรื่องต่อเนื่อง r10

ประเภท: Commit (บันทึกงาน ไม่ใช่คำสั่ง git commit) · 7 พฤศจิกายน 2026

ขอบเขต: design/docs เท่านั้น ใช้ Explainroo ที่ .tools/explainroo 0.4.1 เป็นฐาน component และ camera contract ไม่ผลิตภาพ เสียง timeline หรือ MP4 ใหม่

Blast radius: DESIGN.md (แบบผลิตหลัก), PLAN.md (ขอบเขต/ประวัติ), README ตอน (สถานะ), README กลางและแผนหลัก (ทางเข้าสถานะ), เอกสารนี้ (แผน/หลักฐาน) เก็บ user changes และไฟล์รุ่นเก่าทั้งหมด ไม่แก้ EP01/.tools/source API/assets

แผน: ตรวจ diff และ r9 → ตรวจเครื่องมือ local/component contract → เลือก hook → เขียน storyboard/หน้าจอ/motion/เสียง → อัปเดตทางเข้าสถานะ → ตรวจเวลา ลิงก์ assets/hash และความสอดคล้อง → ส่ง prompt ผลิต

Observed: r9 มี 38 shots/310.433333s; script กำหนด cut ทุกช็อต; เปิดดู export-contact.jpg ของ r9 แล้ว เห็นหัวข้อ/กรอบ/ซับซ้ำหลายช่วง ไม่ได้ดู MP4 เต็มหรือฟังเสียงเดิมในรอบนี้
Documented: provider snapshot มี blocking endpoint, answer, conversation_id, chat:invoke; ภาพและคำตอบเป็น illustrative ไม่มี live evidence
Inferred: การคงวัตถุและเฉลยคำถามจะช่วยความต่อเนื่อง ต้องตรวจคลิปจริงภายหลัง ไม่อ้าง retention
Unknown: ความยาวเสียงบทใหม่ การอ่านที่ 360px และ channel overlay จริง ยังไม่วัด

ฐานเดิมก่อนแก้: git status มีงานผู้ใช้จำนวนมาก รวม README/แผนกลางที่แก้อยู่ EP02 custom chat ทั้งโฟลเดอร์เป็น untracked และ knowledge sample ถูกลบอยู่ก่อนแล้ว ไม่ restore/ลบ/commit งานเหล่านี้

เครื่องมือที่ใช้จริง: node .tools/explainroo/bin/explainroo.js --help และ formats --json สำเร็จ; อ่าน AGENTS camera/UI contract และ source scenes.js r9 แบบ read-only ไม่เรียก check/still/render เพราะเครื่องมืออาจสร้าง narration ที่ขาดได้

Nexus: get_state สำเร็จ; project brief เฉพาะ LangMine-API-VDO ล้มเหลว projectId validation ใช้ workspace เป็นหลัก ไม่ยืม memory โปรเจกต์อื่น

## ผลตรวจและส่งต่อ

Files Changed: DESIGN.md, STORYBOARD.md, PLAN.md, README.md ใน EP02; README.md กลาง; แผนสถานะกลาง; เอกสารนี้ รวม7ไฟล์ ไม่มี production source/config/assets เปลี่ยน

Verification Command: PowerShell here-string ส่ง Node.js stdin (`@' ... '@ | node`) ใช้ fs/path ตรวจ local Markdown links เฉพาะส่วน active, regex ตรวจ16 scene ranges/durations/fields, ตรวจไฟล์ assets และ crypto SHA256เทียบ baseline; `git diff --check -- README.md docs/plans/2026-11-06-workspace-foundation.md` สำหรับ tracked docs ที่แก้

Terminal Result: document check exit0; documents=7; activeLocalLinks=35; brokenActiveLinks=0; scenes=16; totalSeconds=440; frames=13200; timingErrors=0; requiredFieldsครบ10ช่องทุกฉาก; existingAssetsChecked=23; missingAssets=0; sourceHashesUnchanged=true; whiteEndCard=true; hookReveal=true

API SHA256: dddbe02f30ec0215e98cb515a3d3374a85f754298163ed84f21facc6e9164a2c
Logo SHA256: 025dbb6064076ac724f42009635e715f985a3d2df8abfa374a8fcec398979c49

รอบแรกพบลิงก์ประวัติ knowledge sample ที่ถูกลบอยู่ก่อนแล้วใน README ตอน จึงเปลี่ยนเป็นข้อความประวัติไม่มีลิงก์ ไม่คืนไฟล์ การเรียก git diff --check ทั้งworkspaceพบ whitespaceเดิมในbrowser logsและline-endingเอกสาร จัดLFเฉพาะ7เอกสารที่แก้แล้วตรวจtracked docsแบบscoped exit0 ไม่แตะbrowser logs/ไฟล์ผู้ใช้ส่วนอื่น

Nexus save_session เฉพาะLangMine-API-VDO ล้มเหลวprojectId validationเช่นเดียวกับbrief จึงไม่ได้บันทึกmemoryสำเร็จ ไม่มีarchitectural decisionใหม่หรือบันทึกข้ามโปรเจกต์

Seam: static document verification ไม่ใช่compiler/runtime/media verification. Antislop: Hard/Purpose/Liveliness/Craft PASSเฉพาะข้อกำหนดแผนตามDESIGN r10.8; rendered mediaเป็นUnverified: Visual/Audio ยังไม่มีraster/VO/render r10 ไม่รันproduction buildตามขอบเขตผู้ใช้

ข้อจำกัด: 440sเป็นงบออกแบบ ต้องลองอ่าน/ทำVOmapจริงก่อนเก็บtimingใหม่; ยังไม่ดูทุกเฟรมfootageหรือฟังWAVเดิมครบ; ยังไม่ตรวจreadability360px/channeloverlay/contrastของคลิปใหม่ ไม่อ้างuser acceptance

Next: สั่งผลิตจากDESIGN r10และSTORYBOARDด้วย.tools/explainrooในโฟลเดอร์ใหม่ video-continuity-r10 เตรียมraster/เสียงตามสิทธิ์ ตรวจassetก่อนtimeline แล้วrender/ตรวจMP4จริง4gate เก็บr9ไว้

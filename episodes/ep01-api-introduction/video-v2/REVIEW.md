# EP01 v2: visual animatic delivery

วันที่ 6 พฤศจิกายน 2026. ส่งเป็น animatic รอเสียง ไม่ใช่ production final. ผู้ใช้ให้ขยายเรื่อง/เวลา เพิ่มภาพและลูกเล่น โดยเก็บภาษาภาพเดิม

## ผลที่ส่ง
- ep01-v2-animatic.mp4: H.264, 1080×1920, 30fps, 214.400s, 8,681,835 bytes, ไม่มี audio track
- SHA-256 B876C7045B89F88734EA30778A44C6C5F2CC8C10A86F805D3474F241E634ADAA
- 14 ฉาก 64 กลุ่มข้อความบรรยาย สร้างภาพใหม่ 2 ภาพ ใช้ built-in ImageGen; prompts และ provenance อยู่ evidence/ASSETS-v2.md
- female-voice-audition.mp3: ตัวอย่างเสียงที่สร้างสำเร็จ 9.894750s แยกจาก animatic ไม่ใช่เสียงทั้งตอน

## Creative decisions
รักษากระดาษ/หมึกเขียวและ robot เดิม ภาพเริ่มจากคำถามคุ้นเคย เปิดเหตุผลและกติกา API ก่อนแนะนำ chat/knowledge/conversation/voice ตาม provider snapshot แล้วตามหนึ่งตัวอย่างครบขาไป/ขากลับ. ไม่สร้างระบบจริงเพื่อถ่าย ไม่ใส่ผล API หรือ metrics ที่ไม่ได้เรียกจริง
Motion เพิ่มการเปลี่ยน framing, reveal ส่วนของ diagram, token คำถามขาไปและข้อมูลขากลับ, การสลับ raster หลังข้อมูลกลับ, pan ไปคำถามต่อ และภาพประกอบฐานความรู้. ไม่เพิ่ม shader/glitch/bounce ที่ไม่ช่วยอธิบาย
ENERGY 2 / RHYTHM 3 / MOTION 2; progression และ composition เปลี่ยนตามหน้าที่เรื่อง ไม่ใช้ robot เป็นผู้กำหนดทุกซีน. ui-ux-pro-max ใช้ hierarchy/readability/progressive disclosure/motion meaning ไม่เพิ่ม checklist ของ native app ให้ MP4

## Verification command และ terminal result
| Command / method | Result |
|---|---|
| node --check build.mjs / motion.js | exit 0, syntax only |
| hyperframes lint --json | 0 errors, 16 warnings: 14 nested-structure suggestions, dense track, repeated raster discovery |
| hyperframes check --at 7.875,35.875,82.482,99.07,143.677,159.283,208.997 --max-transition-samples 0 --json | ok true; runtime/layout/motion/contrast errors 0; craft warnings 2 (small secondary type, silent film) |
| node evidence/review.cjs (หลังแก้ขนาด type) | errors 0, external requests 0, broken images 0, Thai font true, caption overflows 0, forward/reverse seek match 14 points |
| hyperframes preview --background --port 4201 | preview พร้อมที่ localhost:4201; sandbox รอบแรกบล็อก network/profile ใช้ escalation เฉพาะ local browser แล้วสำเร็จ |
| hyperframes render --quality draft --workers 4 -o ep01-v2-animatic.mp4 | exit 0; 6432/6432 frames; 5m11.5s; artifact validated; hardware screenshot capture |
| ffprobe -show_entries format=duration,size:stream=codec_name,width,height,r_frame_rate,codec_type | H.264 1080×1920 30/1; duration 214.400s; no audio track |
| FFmpeg decode + select 6 frames at beginning/knowledge/followup/outbound/inbound/recap | exit 0, 6 frames saved; viewed rendered-mobile-frames.jpg at 360×640 per frame |
| node evidence/verify-delivery.mjs | 8 documents, 51 links, broken 0, API hash unchanged true (ก่อนเพิ่มลิงก์ส่งมอบใน README) |
| Pillow image manifest | PNG 6 files decoded, dimensions/modes/hash recorded; robot/logo RGBA alpha 0–255 |
| git -c core.longpaths=true diff --check | exit 0; LF/CRLF warnings from existing Git config |

ขนาดข้อความรองที่ craft เตือนถูกเพิ่มจาก 25/27px เป็น 29/30px และ hook bar เป็น 40px ก่อน render (scaled 0.72 จึงเหลือ 28.8px). ดูและตรวจ browser ใหม่หลังแก้; ไม่อ้างว่า rerun craft เต็มหลังแก้. Silent warning คงไว้ตามสถานะเสียงที่ยังค้าง ไม่ใส่เพลงกลบปัญหา

## Delivery gate ที่ใช้กับ animatic
- PASS, R-17/R-36/R-38: แยก documented snapshot กับภาพ/คำตอบสมมติ ไม่แต่งผลเรียกจริง ตัวเลขส่งมอบมาจาก FFprobe และ log
- PASS, R-03/R-25: ดูเฟรม MP4 มือถือ 360×640; native layout/contrast ผ่าน sampled points; caption overflow ตรวจครบ 64 กลุ่มใน browser เป็น 0
- PASS, R-04/R-07/R-19/R-31: กระดาษเชื่อม visual direction, robot ชี้บริการเฉพาะฉาก, motion ส่งข้อมูล/เปิดเหตุผล มีหน้าที่ระบุใน storyboard
- PASS, R-37/liveliness: มีทิศทางและ dials ก่อนเจนภาพ/ประกอบ; ภาพ UI/diagram/illustration/recap เปลี่ยนตามเนื้อหา
- PASS, R-35 technical media scope: render และดูเฟรมจากไฟล์จริง; seek ไป/ย้อนตรงกัน ไม่อ้าง click-through ของ MP4
- N/A, R-24/R-26/R-27/R-32/R-34/R-39 controls: ไม่มีแอป interactive ที่ส่งมอบ จึงไม่เพิ่ม nav, forms, keyboard หรือ theme toggle ให้คลิป
- PENDING, audio/storytelling acceptance: agent ไม่ได้ฟัง audition โดยตรง ไม่มีเสียงเต็มและไม่มี beginner comprehension test จึงไม่รับรอง production gate

## สิ่งค้างและฉากอ่อนที่สุด
เสียงเป็น blocker หลัก: Edge TTS ได้ s01 แล้ว s02 NoAudioReceived ซ้ำสองครั้ง ผู้ใช้อนุญาตทดลองประโยคสั้นเพิ่มหนึ่งรอบ ยังล้มเหลว จึงหยุด. ไม่ retry/switch provider โดยอัตโนมัติ. เมื่อมีเสียงที่ใช้ได้ต้อง retime ภาพ/ซับใหม่ ไม่ใช้เวลาอ่านใน timing.json อ้างเป็น voice sync
ฉาก request/responsibility ยังพึ่งข้อความ explanatory มากกว่าฉากทำงานจริง; รอบถัดไปควรทวนกับเสียงว่าคนดูต้องจำศัพท์มากเกินไปหรือไม่. ยังไม่สรุปว่าความยาว 3:34 เหมาะที่สุดจนได้เสียงและทดสอบคนดู
Source เป็น static HTML scene sections ใน root สำหรับ animatic; lint แนะนำแยก sub-compositions ก่อนขยาย production/editor workflow. ไม่ปิดบัง warning หรืออ้างว่า installed Catalog เท่ากับใช้ component ใหม่ครบ

แก้ต่อได้จาก HyperFrames preview local หรือ HyperFrames desktop app; CLI เสนอ https://hyperframes.studio/studio/download?os=windows&src=cli. ไม่ publish

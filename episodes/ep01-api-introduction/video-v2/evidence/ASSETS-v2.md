# Assets v2

ภาพสร้างด้วย built-in ImageGen ตามสิทธิ์ผู้ใช้เพิ่มภาพอธิบาย ไม่ใช้ CLI/API key. นำไฟล์ที่เลือกมาอยู่ assets ใน workspace จริงก่อนประกอบ ไม่มี remote image dependency ใน timeline

## ภาพใหม่และ prompt เต็ม

### knowledge-v2.png
Generated source: exec-ee32629e-7493-433e-84e1-99fd7a0fd8ad.png. Conceptual illustration ไม่ใช่ screenshot. ดูภาพจริงแล้ว: ไม่มีข้อความ ตัวเลข คน robot หรือโลโก้ เอกสาร/แฟ้ม/หน้าต่างว่างแยกออก อ่านเป็นการเตรียมข้อมูลได้ ใช้พร้อมคำอธิบายที่ระบุเงื่อนไข indexed และผูกผู้ช่วย ไม่อ้างว่าภาพนี้แสดง live processing

Prompt:
> Create a single polished editorial paper-cut illustration asset for a Thai beginner explainer video about preparing a knowledge base for an AI assistant. Landscape 3:2. Ivory paper background #f5f1e7, deep forest ink #20352c, muted sage green #acc98e, restrained teal. Three cream document sheets with simple abstract dark green lines on the left flow toward an open sage green file folder at center, and a single plain blank rounded assistant window on the right. Physical layered paper, slight offset hard shadows, calm friendly craftsmanship, no glossy 3D, no gradients, no glow. Make the folder the focal object and preserve 8 percent empty margins. Absolutely no text, no letters, no numbers, no logos, no people, no robots, no sparkles. This is conceptual illustration, not a software screenshot. Clean isolated composition filling the canvas, large simple forms readable on a phone.

### app-followup-v2.png
Generated source: exec-43f1e527-af86-441d-b7db-7a1c9c0655d5.png. Edit target/reference คือ APP-A v1 ที่ดูภาพเต็มก่อน edit. ดูผลจริง: header บริการ และ 4 ข้อความถูกต้อง ป้ายภาพจำลองยังอยู่; status เก่าถูกนำออกตามแบบ ไม่รับรอง pixel identity กับ v1. ใช้เป็น raster จริง ไม่สร้าง bubble HTML ทับข้อความ

Prompt:
> Edit this Thai app illustration into a follow-up conversation screen. Keep same near-white background, dark bold legible Thai typography, pale sage question bubbles, subdued gray-green answer bubbles, same width, and existing top title ถามผู้ช่วย and service tag บริการปรึกษาออนไลน์. This is an illustrative fictional app, not LangMind official UI. Reflow vertically to fit four chat messages with generous margins and large phone-readable text. Exact messages in order: user ‘เริ่มใช้บริการต้องเตรียมอะไร?’ then assistant ‘เตรียมอีเมลและหัวข้อที่อยากปรึกษา’ then user ‘แล้วต้องจองเวลาก่อนไหม?’ then assistant ‘ติดต่อเจ้าหน้าที่เพื่อเลือกเวลาปรึกษา’. Remove redundant status ได้รับคำตอบแล้ว to make space. Keep ภาพจำลอง clearly visible at bottom. No new logo/avatar/buttons/timestamps/metrics or extra text. Portrait 4:5. All Thai marks must be correct. Do not crop text.

## Reuse
- app-q-v1.png / app-a-v1.png: สำเนา raster เดิมจาก video/assets; provenance/prompt เดิมอยู่ video/evidence/ASSETS-v1.md
- langmind-logo.png / 05-point-up.png: สำเนาจาก shared ไม่เจนหรือแก้โลโก้/ตัวละคร
- NotoSansThai.ttf และ NotoSansThai-OFL.txt: สำเนาฟอนต์และ license จาก v1
- gsap.min.js: local GSAP 3.14.2 จาก source Catalog v1 คง license header

## เสียง
ผู้ใช้อนุญาตส่งเฉพาะบท EP01 ไป Microsoft Edge TTS และเลือก th-TH-PremwadeeNeural rate +0%. เกิดไฟล์ s01 สำเร็จ แต่ s02 NoAudioReceived สองครั้ง หลังผู้ใช้ให้สิทธิ์ทดลองประโยคสั้นอีกหนึ่งรอบยังล้มเหลว หยุดเรียก ไม่มีเสียงเต็ม ไม่มี music/SFX และไม่มีการใช้เสียง v1 แทน

female-voice-audition.mp3: จาก s01.mp3 ตัด padding หัวท้ายแล้ว loudnorm I=-16 TP=-1.5 LRA=9; ffprobe duration 9.894750s เป็น audition แยก ไม่อ้างว่าเป็น narrator ที่ผู้ใช้รับแล้ว และไม่ใส่เฉพาะเสียงช่วงต้นลง animatic จนทำให้ส่วนที่เหลือเหมือนเสียงหาย

timing.json ของ animatic เป็นเวลาอ่านจากกลุ่มคำไทย 16 code units/s ค่าทดลอง ไม่ใช่ timestamp เสียง ไม่อ้าง voice-sync. make-voice.py เก็บไว้เพื่อทำซ้ำเมื่อมีสิทธิ์/แหล่งเสียงที่ใช้ได้ แต่ห้ามรันซ้ำอัตโนมัติหลัง service failure

## Catalog provenance
hw-pipeline และ browser-device-stage จาก v1 เป็นฐานลักษณะกรอบ/connector/host raster. v2 เป็น adaptation ไม่อ้างว่าติดตั้ง component เพิ่ม. ค้น marker/zoom candidate แล้วไม่เพิ่ม shader transition ที่ทำลายความอ่านง่าย ภาพ raster ใช้ใน host; HTML เป็น diagram/caption และ explanatory layers เท่านั้น

## ข้อจำกัด
ขนาด/hash/alpha เก็บใน asset-manifest.json หลังตรวจไฟล์จริง. model name ของ built-in ImageGen ไม่ส่งกลับ จึงไม่แต่งชื่อโมเดล. เสียงวัดทางเทคนิค ไม่ได้ฟังโดย agent ไม่อ้าง audio acceptance

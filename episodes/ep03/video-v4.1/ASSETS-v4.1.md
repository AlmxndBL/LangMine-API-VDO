# EP03 Animatic v4.1 — Asset ledger

ตรวจ assets จริงหลังผลิต: ขนาดภาพ, โหมดสี, alpha และ SHA-256. แบบหน้าจอ โค้ด และไดอะแกรมสร้างขึ้นโดยอิงมาตรฐานภาพและโมชันของ `ep04-v3-orus.mp4`. ทุกภาพเป็นภาพจำลอง ไม่ใช่ official LangMind UI หรือผล live API จริง.

## Assets ร่วมและภาพจำลองในโฟลเดอร์ assets/

| Asset | ขนาด/ชนิด | Alpha | SHA-256 | การใช้ |
|---|---|---|---|---|
| assets/langmind-logo.png | 689×606 RGBA | 0–255 | `025dbb6064076ac724f42009635e715f985a3d2df8abfa374a8fcec398979c49` | โลโก้จริงในไดอะแกรมสถาปัตยกรรม และฉากปิดท้ายคลิป |
| assets/app-chat-q.jpg | 1160×1304 RGB | ไม่มี | `6f76af218c633758f097580fa2c493c42a1e72989077ff323831ea9eb40d85ab` | หน้าจอแชทโทรศัพท์มือถือจำลอง: ผู้ใช้พิมพ์คำถามแรก |
| assets/app-chat-a.jpg | 1160×1304 RGB | ไม่มี | `2a54d8bb80f5d1b790e57d615380227095b729f4200b99ac4e2c2d82c7c4fc16` | หน้าจอแชทโทรศัพท์มือถือจำลอง: ได้รับคำตอบแรก และถามต่อ |
| assets/01-question.png | 445×503 RGBA | 0–255 | `c7d8bbe30cbc7ecbaf439b499ed35c4c2cb9dead8144dd08fcb84445065a5085` | Robot pose 01 ประกอบซีน 3 (การเตรียมการ) |
| assets/05-point-up.png | 445×503 RGBA | 0–255 | `6596f6b0a6fd7a57a3a6cc6c31b8da13e18cf17bf14777351480bd222e04dc01` | Robot pose 05 ชี้เน้น conversation_id ในซีน 9 |
| assets/10-thumbs-up.png | 512×485 RGBA | 0–254 | `a12f374f8b804ab812c185f2191ec19b736cfea8466bae947a54926f4764cb17` | Robot pose 10 ประกอบซีนสรุปในซีน 10 |
| assets/fonts/Sarabun-Regular.ttf | TTF, 90,220 bytes | — | `226d4f368fbc0457990ddef2692679badfd2c1a4e89e5ac4d43c10ba7743b2f1` | ข้อความไทยเนื้อหาและคำอธิบาย |
| assets/fonts/Sarabun-Bold.ttf | TTF, 89,804 bytes | — | `d38308ca27d067b9a1b79006337c1f9a66c29aa016d96a9d88d3801da7fa83b9` | หัวข้อและข้อความเน้น |
| assets/gsap.min.js | JavaScript, 72,790 bytes | — | `fd6978c80858a3036c39b4e53b5a6f9385d759d43283e6b1de89237e5640d85f` | local GSAP library |

## Generated plates (1080×1920 RGB)

ทุก plate มีขนาด 1080×1920 RGB ฝังลายสมุดบรรทัด Soft Cream `#f8f4e9` และแถบซับไตเติลภาษาไทยฝังที่กรอบล่าง:

| Plate | Beat | SHA-256 | รายละเอียด |
|---|---|---|---|
| stage_01_b1_s0.png | B1 | `1abad0d16f3431e502cd1214025e34cc6e1c696b22ff5b45333154358dd11f32` | กรอบโทรศัพท์: ผู้ใช้พิมพ์ขอร่างข้อความ |
| stage_02_b1_s1.png | B1 | `b104ffd0ed75e33250fde819cc6d272408fb5f9ab488998962ca9b40347dfb79` | กรอบโทรศัพท์: ปรากฏคำตอบแรกและการถามต่อ |
| stage_03_b1_s2.png | B1 | `ac2c3bc705bd15e7a40351ac33306c9172488523fbd0c1cd1283830f4a9ef91d` | ชิปคำถาม 3 ข้อ: เตรียมอะไร? เชื่อมตรงไหน? ส่งคำขอยังไง? |
| stage_04_b2_s0.png | B2 | `9f13905d34307789b14dce17acc72dbcec07a4c2aa6d0f40ea94df8a7f401af3` | แผนภาพแนวคิด: แอปของคุณ (พนักงาน) ─ LangMind (สมอง/ครัว) |
| stage_05_b2_s1.png | B2 | `e9bb8749c9c173d4aa1ee8a5be7f07e992bebe5c1d4691bdf73c25b5e5c2ac33` | สถาปัตยกรรม 3 ชั้น: แอปมือถือ ─ Backend ─ LangMind |
| stage_06_b2_s2.png | B2 | `699454b7be9f324548eb45fec03e9f143ec14f94153a384ba9e5215ef17b4570` | สถาปัตยกรรม 3 ชั้น: ไฮไลต์ 3 สเต็ป ส่งคำขอ ─ สตรีมผล ─ คุยต่อ |
| stage_07_b3_s0.png | B3 | `384ae70aceaec8db1c58e253ee140a35f9e03c93a4f3ddc69bd5d796e4a3f2e7` | เตรียมข้อที่ 1: Agent ใน LangMind (กด Publish) |
| stage_08_b3_s1.png | B3 | `b05e1ee6147148520b508385ca485df20740b30f500ef536cc66768d45168058` | เตรียมข้อที่ 2: Personal API Key (chat:invoke) |
| stage_09_b3_s2.png | B3 | `249f0df2533f1db7dff03f3c2bbdeabf3e314807a86e9baf13a6f23882215c35` | เตรียมข้อที่ 3: ระบบหลังบ้าน (Backend Server) |
| stage_10_b4_s0.png | B4 | `ce59cb50b281001e7151f458ca641025e785562605b3e5fafb15d74a77297546` | กลุ่มที่ 1: เน้น POST /api/chat/message (SSE Stream) |
| stage_11_b4_s1.png | B4 | `6d9f59fe1a26a98edd8a8bb0674fe84372afd508fd35d9fae84cf31c1ea90711` | กลุ่มที่ 1: เน้น POST /api/chat/message/blocking (JSON ก้อนเดียว) |
| stage_12_b4_s2.png | B4 | `bfbdd4c7b37a3f09f5ca57cd8d8f2c4a7fec5665d9660c319f7203172f9a59dc` | กลุ่มที่ 1: เส้น preview ใน Builder และคำสั่ง stop stream |
| stage_13_b5_s0.png | B5 | `f9f25e9c34a8d86b32c117f85d08558b63f1fa8772d6fe3896b07c4b3ae97969` | กลุ่มที่ 2: อ่านประวัติบทสนทนา (GET conversations, {id}, messages) |
| stage_14_b5_s1.png | B5 | `28dedd052cf4c9d2a220a5429cfe2632247cbd49f7891aba8821f5ae4abeb0ba` | กลุ่มที่ 2: PATCH แก้ชื่อ และ DELETE ลบถาวร (เตือนความปลอดภัย) |
| stage_15_b6_s0.png | B6 | `bb6d5b9c7a34f832c5a7cf295eb72e494eaabc7c24bc98d0df8cea95a601206b` | กลุ่มที่ 3: POST feedback ให้คะแนนคำตอบ (1 / -1) |
| stage_16_b6_s1.png | B6 | `bdda72304c412135267d9d0cbbd21279f354450b949d233d3198387b82772381` | กลุ่มที่ 3: GET generated-files ดาวน์โหลดไฟล์ที่สร้าง |
| stage_17_b7_s0.png | B7 | `fbad1e62122f74b10eb780930054483c98d94ff41e5017a5272c4089874766f5` | ลองส่ง 1: กล่องคำถามและโครงสร้าง cURL POST |
| stage_18_b7_s1.png | B7 | `450982f544ca136e6f8eb6f9a912cdf297d4908b1650ee5ddce53a0c4dcbb8e5` | ลองส่ง 1: ไฮไลต์ "conversation_id": null เพื่อเริ่มห้องใหม่ |
| stage_19_b8_s0.png | B8 | `dfea06ad208cbbbdf6f31939455b2ccd646fe5bba0a9ec9b96cc747ce771d1e5` | รับสตรีม 2: Event message_start ได้ ID |
| stage_20_b8_s1.png | B8 | `cae8c101dd1a8d32409870ff2922b3a1f81c5d02ba360d6dadc72b531138f9cd` | รับสตรีม 2: Event message ทยอยส่งข้อความเป็น chunks |
| stage_21_b8_s2.png | B8 | `c71971518f2c182e262cc35ae0aba086972c1281cbf17ba655aba772712525d2` | รับสตรีม 2: Event message_end คำตอบเต็ม + usage |
| stage_22_b9_s0.png | B9 | `4cf39a9870fc4497adb33b914b89b249e79b388adb26af2f61ba2393fdf0ca13` | ถามต่อ 3: กล่องคำขอส่ง "conversation_id": "conv_123" |
| stage_23_b9_s1.png | B9 | `e154d31e3b5af7c1abcaefd568080bb39a5bea905ad6dcabc9f582cb66050075` | ถามต่อ 3: Agent ตอบสั้นลงในบริบทเดิม + Robot pose 05 |
| stage_24_b10_s0.png | B10 | `cb7878cb2bcc222fb325bce8e79c9301fb1a4ba6abd08bc1d664aaa68a5be04c` | สรุป: การ์ด 3 ขั้นตอนสำคัญ (Endpoint, Server Key, conversation_id) |
| stage_25_b10_s1.png | B10 | `086a72479351f1ca8d8e198c60be2f1083bb97efedbe125e25086d5081be5008` | ปิดท้าย: โลโก้ LangMind, URL langmind.in.th และ Robot pose 10 |

## ผลส่งออกวิดีโอ (MP4 Export)

- **ไฟล์:** `renders/ep03-v4.1.mp4`
- **ขนาดมิติ:** 1080×1920 (9:16 portrait)
- **อัตราเฟรม:** 30.00 fps
- **ความยาว:** 133.167 วินาที (3,995 frames)
- **ระบบเสียง:** Silent (ไม่มี audio stream ตามเงื่อนไข ไม่ทำเสียง)
- **ขนาดไฟล์:** 2,971,054 bytes (~2.8 MB)
- **SHA-256:** `148c9d2e13b5fe416f2f61fbeeda386b83970ac4bcb9b92211e9090503017d5b`
- **Contact Sheet ตรวจทาน:** `renders/final-review-v4.1/contact-sheet.png`

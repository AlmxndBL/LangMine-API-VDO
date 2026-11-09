# EP03 Animatic v4 — Asset ledger

ตรวจ assets จริงหลังผลิต: ขนาดภาพ, โหมดสี, alpha และ SHA-256. ทุกภาพและข้อความบนจอเป็นภาพ raster และไดอะแกรมที่สร้างในเครื่องจาก `render_fallback.py`; ไม่ใช่ official LangMind UI หรือผล live API จริง.

## Assets ร่วมจาก workspace

| Asset | ขนาด/ชนิด | Alpha | SHA-256 | การใช้ |
|---|---|---|---|---|
| assets/brand/langmind-logo.png | 689×606 RGBA | 0–255 | `025dbb6064076ac724f42009635e715f985a3d2df8abfa374a8fcec398979c49` | โลโก้จริงในซีนเปิดและสรุปท้ายคลิป |
| assets/characters/01-question.png | 445×503 RGBA | 0–255 | `c7d8bbe30cbc7ecbaf439b499ed35c4c2cb9dead8144dd08fcb84445065a5085` | Robot pose 01 ประกอบคำถามใน Beat 1 |
| assets/characters/05-point-up.png | 445×503 RGBA | 0–255 | `6596f6b0a6fd7a57a3a6cc6c31b8da13e18cf17bf14777351480bd222e04dc01` | Robot pose 05 ชี้เน้น conversation_id ใน Beat 1, 10 |
| assets/characters/10-thumbs-up.png | 512×485 RGBA | 0–254 | `a12f374f8b804ab812c185f2191ec19b736cfea8466bae947a54926f4764cb17` | Robot pose 10 ประกอบซีนสรุปใน Beat 10 |
| assets/fonts/Sarabun-Regular.ttf | TTF, 90,220 bytes | — | `226d4f368fbc0457990ddef2692679badfd2c1a4e89e5ac4d43c10ba7743b2f1` | ข้อความไทยเนื้อหาและคำอธิบาย |
| assets/fonts/Sarabun-Bold.ttf | TTF, 89,804 bytes | — | `d38308ca27d067b9a1b79006337c1f9a66c29aa016d96a9d88d3801da7fa83b9` | หัวข้อและข้อความเน้น |
| assets/fonts/NotoSansThai.ttf | TTF, 218,652 bytes | — | `5a1c559bb539583c8a1fd99d1c5b9491e5e14478c9cd2bd0970d5c3096cc9ef8` | ฟอนต์สำรองระบบ |
| assets/vendor/gsap.min.js | JavaScript, 72,790 bytes | — | `fd6978c80858a3036c39b4e53b5a6f9385d759d43283e6b1de89237e5640d85f` | local GSAP สำหรับ HyperFrames timeline |

## Generated plates (1080×1920 RGB)

ทุก plate มีขนาด 1080×1920 RGB ไม่มี alpha และมีแถบซับร่างภาษาไทยฝังที่กรอบล่าง:

| Plate | Beat | SHA-256 | รายละเอียด |
|---|---|---|---|
| assets/plates/v4/b1-hook-1.png | B1 | `bbf7592d1fbd60408836d295f70c587a3b758104aa28e77b40b7e5aa929c9542` | โจทย์ขอร่างข้อความแจ้งเลื่อนประชุม + robot pose 01 |
| assets/plates/v4/b1-hook-2.png | B1 | `bfec536b67121cfd3cfcdaabafb47814880d6284c6f1e990928db2db0cc02ff8` | โจทย์ขอแก้ต่อให้สั้นลงอีกนิด + robot pose 05 |
| assets/plates/v4/b2-chat-q.png | B2 | `388beb4d5545b3294a21fb73c4ebaa77b86706d526f6fd5fe6bd0f7b37896133` | กรอบแชทจำลอง: คุณส่งคำขอร่างข้อความ |
| assets/plates/v4/b2-chat-a.png | B2 | `ae085f1d09abfd3b2905c402f0de1e05953b431a9e4a41fa0ee7c6bfcc938164` | กรอบแชทจำลอง: Agent ส่งคำตอบแรกกลับมา |
| assets/plates/v4/b3-followup-q.png | B3 | `42e594a322d1be2d1c9c2bb1a78f6881f5c575e4e879e3602b104b35e2efb1e4` | กรอบแชทจำลองเดิม: คุณถามต่อ "ขอให้สั้นลงอีกนิด" |
| assets/plates/v4/b3-followup-a.png | B3 | `9626e06922109ffd8ad2b3cfb9a63ba1b5d8a76c2c9408155fbab4c96950effc` | กรอบแชทจำลองเดิม: Agent ตอบสั้นลง + ป้ายเชื่อม conversation_id |
| assets/plates/v4/b4-arch-front.png | B4 | `421f7227be2b10188caa3677c4eda009706a8e8f6daab1ea62a1b9bef5c28488` | แผนภาพสถาปัตยกรรม: เน้น Client Frontend |
| assets/plates/v4/b4-arch-back.png | B4 | `9443789126a9a967b832ebba0f7dd6677ec5dd7b83c158a41b2c772e1fe3bf1a` | แผนภาพสถาปัตยกรรม: เน้น Backend Server + ป้ายเตือนเก็บ Key |
| assets/plates/v4/b4-arch-api.png | B4 | `f2519c78a43c1139a95f86a419881cffa86d77af2b4670ad631776eead41519f` | แผนภาพสถาปัตยกรรม: เน้น LangMind Chat API |
| assets/plates/v4/b5-ep-stream.png | B5 | `4cc5e1eeb54bc3653a36f1305c4d34538acc2c9040b15bbb8c9229597d6e1a2b` | Endpoints: เน้น POST /api/chat/message (SSE) |
| assets/plates/v4/b5-ep-blocking.png | B5 | `4f900a2c221c6db9d1296904a7143c49ce4a179e63e6e84d4b37ec5b5be96cf2` | Endpoints: เน้น POST /api/chat/message/blocking (JSON เต็ม) |
| assets/plates/v4/b5-ep-preview-stop.png | B5 | `99dcb25d58e739ffe37147a457265d697018a43727b59f15e97e8d60894ba64b` | Endpoints: POST /preview และ POST /stop |
| assets/plates/v4/b6-ep-read.png | B6 | `0e2e128c31e436f11eccd8124e058cdd120136df28b51f90c2698cdecf791581` | Endpoints: GET conversations, {id}, messages + ต้องมี agent_id |
| assets/plates/v4/b6-ep-manage.png | B6 | `d8ee9d5761ed238e17557c9bf32b36bc61f0e14699b5796daa635eb2e3bb7d9f` | Endpoints: PATCH และ DELETE (เตือนลบถาวร) |
| assets/plates/v4/b7-ep-feedback.png | B7 | `21230717346dc0e746b22805446049c5b595e67db4ea95096b1f82f790514dd9` | Endpoints: POST feedback (rating 1 หรือ -1) |
| assets/plates/v4/b7-ep-files.png | B7 | `d8869e2ca96324a02298af63a5c0ed533ccb17cac35406733c9e2521765757ef` | Endpoints: GET generated-files + สรุป scope chat:invoke |
| assets/plates/v4/b8-req-auth.png | B8 | `71c877b91f46e78868998220b362dbf82ffdf61f7f9164704d03de30b57f0744` | ตัวอย่างคำสั่ง: เตรียม LM_TOKEN ใน Server Environment |
| assets/plates/v4/b8-req-curl.png | B8 | `128b01109c826f46af884223e9b9a37daa8c3e688c93b8f190e1a6ce9dfb39f3` | ตัวอย่างคำสั่ง: cURL POST พร้อม "conversation_id": null |
| assets/plates/v4/b9-sse-start.png | B9 | `73952addbfbe17c8f238fcf948e1c372632468f173e52fc5a74eeb8c02182bad` | ลำดับ SSE Event: message_start ได้ ID |
| assets/plates/v4/b9-sse-chunks.png | B9 | `81a61079b76b67ec76733b9677f8259e0755c988abef9bdb5471660c4dde8136` | ลำดับ SSE Event: message chunks ทยอยมา |
| assets/plates/v4/b9-sse-citations.png | B9 | `9d9cb04f1608163227a72857acf9ce62a1f2b78587273e0bb3c32a5bf204643c` | ลำดับ SSE Event: citations (ถ้ามี) |
| assets/plates/v4/b9-sse-end.png | B9 | `ab46494511f1a6c0cbe9cd26408b60bce8a89e4d2aa784ff77b7042a52ec6715` | ลำดับ SSE Event: message_end คำตอบเต็ม + usage |
| assets/plates/v4/b10-cont-body.png | B10 | `a66ab3edf886ae2efeb9d6cf3974c204de9e3e890040de03b783582ac794daf3` | ถามต่อ: ส่ง JSON body ด้วย conversation_id เดิม + robot pose 05 |
| assets/plates/v4/b10-summary.png | B10 | `11c001a1eca6d62c57aa5461f74f7bdcd89dab7f7ce92e8fe13feedd0ce0c29a` | สรุป 3 ขั้นตอนสำคัญ + โลโก้ LangMind + robot pose 10 |

## ผลส่งออกวิดีโอ (MP4 Export)

- **ไฟล์:** `renders/EP03-v4.mp4`
- **ขนาดมิติ:** 1080×1920 (9:16 portrait)
- **อัตราเฟรม:** 30.00 fps
- **ความยาว:** 91.167 วินาที (2,735 frames)
- **ระบบเสียง:** Silent (ไม่มี audio stream ตามคำสั่งผู้ใช้ ให้รอทำเสียงในภายหลัง)
- **ขนาดไฟล์:** 2,523,744 bytes (~2.4 MB)
- **SHA-256:** `6017b0cfdb3a8aeadb878a8c42f7bd716c1ad2d15d4592506badd2af91488d6a`
- **Contact Sheet ตรวจทาน:** `renders/final-review-v4/contact-sheet.png`

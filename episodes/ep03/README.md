# EP03 — การรับและแสดงผลด้วย Streaming API (SSE)

Episode ID: ep03-streaming-chat  
อัปเดต: 9 พฤศจิกายน 2026 (Asia/Bangkok) — v3.1 เพิ่มภาพอธิบาย ปรับ motion และตรวจข้อความ

## 1. สถานะปัจจุบัน

v3.1 เป็นผลคลิปล่าสุดสำหรับทบทวน; v3 เดิมคงอยู่แยกเป็นหลักฐานก่อนปรับ. ยังไม่มีการยืนยันตรวจรับจากผู้ใช้.

| ขั้นตอน | สถานะ | เอกสาร/หลักฐาน |
|---|---|---|
| **W3 ออกแบบเรื่องและขอบเขต** | แผนเดิมยังใช้เป็นหลักฐาน | [แผน W3](plan/PLAN.md) — ผู้ชม, ขอบเขต claims และ API snapshot |
| **W4 บทและ storyboard** | v3.1 ปรับคำอธิบายซีนเปรียบเทียบ; รอทบทวนจากผู้ใช้ | [SCRIPT-v3.1.md](SCRIPT-v3.1.md), [STORYBOARD-v3.1.md](STORYBOARD-v3.1.md) |
| **W5 ภาพและเสียงตัวอย่าง** | เพิ่มภาพอธิบาย 2 ภาพและ motion จาก Catalog ใน v3.1; voice audition ยังรอเลือก | Screen specs และ catalog choices ใน [STORYBOARD-v3.1.md](STORYBOARD-v3.1.md); ขั้นตอนเสียง [evidence/REVIEW-sample.md](evidence/REVIEW-sample.md) |
| **W6 ประกอบคลิป** | ผลิต silent animatic v3.1 พร้อมซับร่างและ wipe comparison | [video-v3.1/README.md](video-v3.1/README.md), [MP4](video-v3.1/renders/EP03-animatic-v3.1.mp4), [review](video-v3.1/REVIEW-v3.1.md) |
| **W7 ตรวจส่งมอบ** | ตรวจ export และภาพตัวอย่างของ v3.1 แล้ว; ยังมีขอบเขตค้าง | ffprobe และเฟรมจากซีนหลัก; HyperFrames lint ไม่มี error แต่ browser runtime เปิด localhost ไม่ได้ใน environment นี้; ยังไม่มีเสียงและ user comprehension review |

## 2. สาระที่คงไว้

- **Documented:** LangMind API มี **POST /chat/message/blocking** สำหรับรับคำตอบครบ และ **POST /chat/message** สำหรับ SSE
- **Documented:** ลำดับ event คือ **message_start → message → citations (ถ้ามี) → message_end**
- **Documented:** **message_end** ให้คำตอบฉบับเต็มและ usage; ต้องได้รับ event นี้ก่อนถือว่าคำตอบสมบูรณ์
- **งานของแอป:** Backend เก็บ API key, ส่งคำขอและอ่าน/parse stream; Client UI จัดการสถานะและการแสดงผล
- **Illustrative:** คำถามและสถานะบนภาพเป็นตัวอย่าง ไม่ใช่ผลเรียก API จริง
- **Unknown:** latency, เวลาเริ่มตอบและประสิทธิภาพจริงของ provider ไม่แสดงเป็นตัวเลขหรือคำรับประกัน

## 3. เนื้อหาที่ปรับใน v3.1

- เปลี่ยนซีนเปรียบเทียบเป็นภาพอธิบายสองภาพ พร้อม wipe จาก HyperFrames Catalog
- ใช้ Soft Blur In กับหัวข้อทั้งบรรทัด และตรวจคำอธิบาย event/ซับร่างภาษาไทยใหม่
- แสดง event แบบสะสมทีละขั้น พร้อมคำแปลที่บอกหน้าที่
- แยกทิศทางคำขอ, SSE events และข้อมูลที่ Backend ส่งต่อให้ UI
- ตัดข้อความตัวอย่างคำตอบที่อาจดูเหมือนคำแนะนำจริงจาก LangMind ออก
- คงคำถามเดียวและแยกให้เห็นว่า API ส่งข้อมูล ส่วน Backend/UI เป็นงานของแอป

## 4. ขั้นตอนถัดไป

- ทำ voice audition และ retime/ปรับซับตามเสียงที่ผู้ใช้เลือกก่อนคลิปฉบับเสียง
- จบ HyperFrames runtime review เมื่อ environment อนุญาตให้ Chrome เข้าถึง localhost; ทดสอบกับอุปกรณ์หรือผู้ชมตามขอบเขตงาน
- โลโก้ต้นฉบับใน workspace มีคำ LANG MIND ชิดขอบล่าง; v3.1 คงไฟล์เดิมและไม่แก้/วาดใหม่ตามคู่มือแบรนด์
- รอบนี้ไม่เรียก live/paid API, ไม่สร้าง provider resources และไม่ publish

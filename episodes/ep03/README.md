# EP03 — การรับและแสดงผลด้วย Streaming API (SSE)

Episode ID: `ep03-streaming-chat`  
อัปเดต: 8 พฤศจิกายน 2026 (Asia/Bangkok) — รอบทบทวนตามแผน W3–W5

---

## 1. สถานะปัจจุบันของตอน

| ขั้นตอน (Workflow) | สถานะ | เอกสาร/หลักฐาน |
|---|---|---|
| **W3 ออกแบบเรื่องและขอบเขต** | **ผ่านการทบทวนและอนุมัติ (Done)** | [plan/PLAN.md](plan/PLAN.md) — ปรับขอบเขตตาม snapshot `langmind-api.md`, ตัดตัวเลขเวลาจำลอง, แยก API vs Backend/App |
| **W4 Storyboard & แบบหน้าจอ** | **ปรับปรุงแล้วเสร็จ (Done)** | • [SCRIPT.md](SCRIPT.md) — ใช้ "ทยอยส่ง/แสดง" แทน "ทันที", ไม่เคลมความเร็ว<br>• [STORYBOARD.md](STORYBOARD.md) — แตก 5 Beats, สเปกหน้าจอมีป้ายภาพจำลอง<br>• [CATALOG.md](CATALOG.md) — ทบทวน Motion ตามหน้าที่จริงของซีน |
| **W5 ภาพนิ่ง & ตัวอย่างเสียง** | **ภาพนิ่งผ่าน / เสียงรอเลือก (Pending Voice)** | • [evidence/ASSETS.md](evidence/ASSETS.md) — ทะเบียนสินทรัพย์ (ตัดตัวเลขเวลาผลวัดออก)<br>• [evidence/REVIEW-sample.md](evidence/REVIEW-sample.md) — ผลตรวจภาพและสเปก Audition<br>• [evidence/mobile-frames.jpg](evidence/mobile-frames.jpg) — แผ่นตรวจขนาดมือถือ |
| **W6 ประกอบคลิป** | **มี silent animatic v2 แล้ว; ยังไม่ sync เสียง** | [video-v2/README.md](video-v2/README.md), [MP4](video-v2/renders/EP03-animatic-v2.mp4), [review](video-v2/REVIEW-v2.md) |
| **W7 ตรวจส่งมอบ 4 ประตู** | **ตรวจ export และเฟรมตัวอย่างบางส่วน; ยังไม่ครบ** | Technical export อ่านได้; HyperFrames runtime/preview ถูก localhost access denial, ยังไม่มี audio review หรือทดสอบกับผู้ชมใหม่ ดู [review v2](video-v2/REVIEW-v2.md) |

---

## 2. สรุปสาระสำคัญจากการทบทวน W3–W5
1. **ความถูกต้องตาม API Snapshot:**
   - ใช้ Endpoint `POST /chat/message` ส่งผลแบบ Server-Sent Events (SSE)
   - ไล่เรียง Event ครบถ้วน: `message_start` ➜ `message` (chunks) ➜ `citations` (ถ้ามี) ➜ `message_end`
   - ย้ำว่าต้องรอจนได้รับ terminal event (`message_end`) จึงจะถือว่าคำตอบเสร็จสมบูรณ์
2. **ขอบเขตความปลอดภัยและหน้าที่ระบบ:**
   - ย้ำชัดเจนว่า **ต้องเก็บ API Key ไว้ที่ Server/Backend ของแอปเสมอ** ห้ามเปิดเผยในเบราว์เซอร์
   - ชี้ให้เห็นว่า API ทำหน้าที่ส่งข้อมูล ส่วน Backend ทำหน้าที่ parse stream และ Client หน้าบ้านเป็นผู้จัดการ UI State
3. **การควบคุมคำกล่าวอ้าง (Non-Claims Enforcement):**
   - ไม่กำหนดเวลารอ 5–10 วินาที หรือใส่ตัวเลขผลวัดหลอก
   - ไม่รับประกันว่าเริ่มแสดงผล "ทันที" หรือแชท "ไม่ค้างแน่นอน" (ใช้คำว่า "ทยอยส่ง/ทยอยแสดง" ตามความเป็นจริง)
   - ไม่เรียกการรับผลครบก่อนแสดง (Blocking) ว่าเป็นเทคโนโลยีเก่าหรือไม่ดี
   - ทุกหน้าจอตัวอย่างมีป้ายกำกับ `[ภาพจำลอง]` ชัดเจน

---

## 3. Next Actions (ขั้นตอนถัดไป)
- ทำ Voice Audition ย่อหน้าต่อเนื่องและให้ผู้ใช้เลือกเสียงก่อนผลิตเสียงเต็ม; ใช้เสียงจริงเป็นฐาน retime
- หลังมีเสียงและ runtime ตรวจได้ ให้ตรวจ W7 เพิ่ม โดยแยก technical, visual, storytelling และ audio; สถานะนี้ไม่ใช่การรับงานจากผู้ใช้
- รอบ v2 นี้ใช้ local assets เท่านั้น ไม่เรียก live/paid API, ไม่สร้าง provider resource และไม่ publish

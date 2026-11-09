# EP03 Animatic v3 — Review

อัปเดต: 8 พฤศจิกายน 2026 (Asia/Bangkok)

## สรุป

ปรับบทและภาพให้เล่าแนวคิด SSE ผ่านคำถามเดียวตั้งแต่เริ่มจนจบ: ส่งคำถาม → เปรียบเทียบการรอคำตอบครบกับการทยอยเห็นข้อความ → ดูลำดับ event → แยกหน้าที่ API, Backend และ UI → ทวนใจความสำคัญ

ผลที่มีตอนนี้เป็น **silent animatic พร้อมซับร่างภาษาไทย** สำหรับตรวจความเข้าใจของภาพและลำดับเรื่อง ซับค้างตามช่วงภาพเพื่อให้อ่านสาระได้ แต่ยังไม่ได้ sync กับเสียงจริง จึงยังไม่ใช่คลิปเสียงสมบูรณ์ และยังไม่มีผลทดสอบกับผู้ชม

## สิ่งที่เปลี่ยน

- ลดการสลับบริบท ใช้คำถามตัวอย่างเดิมในช่วงเปรียบเทียบทุกภาพ
- เรียงคำอธิบายจากสิ่งที่คนดูเห็นก่อน แล้วจึงอธิบายชื่อ event และบทบาทของแต่ละส่วน
- จัดแผงเปรียบเทียบแนวตั้งให้อ่านบนจอมือถือ และเน้นคำว่า “รับครบก่อน” กับ “ทยอยแสดง”
- ทำการ์ด event ให้สะสมตามลำดับ เพื่อไม่ให้ผู้ชมต้องจำการ์ดจากเฟรมก่อน
- ใช้ข้อความ “ข้อความส่วนที่ 1/2/3” เป็นภาพแทน chunk แทนการแต่งคำตอบให้ดูเหมือนผล API จริง
- แสดงทิศทางคำขอจากแอปไป API, SSE events กลับเข้า Backend และ Backend ส่งข้อมูลให้ UI แยกกัน
- เพิ่มซับร่างภาษาไทยด้านล่างในทุก visual stage ใช้แถบพื้นเข้มและข้อความสีขาวเพื่อให้เห็นชัดบนภาพ
- เอาพื้นสีขาวที่ renderer วางหลังตัวละครออก; ครอปขอบ alpha โปร่งใสและขยายตัวละครให้เห็นชัดขึ้น โดยจัดให้อยู่พ้นกรอบเนื้อหาและแถบซับ

## ผลตรวจตามหลักฐาน

### Documented — ข้อมูลจาก API snapshot

- `POST /chat/message/blocking` รอผลคำตอบครบ ส่วน `POST /chat/message` ส่งข้อมูลผ่าน SSE
- event หลักเรียงเป็น `message_start` → `message` → `citations` (ถ้ามี) → `message_end`
- `message_end` มีคำตอบครบและ usage; ฝั่งแอปควรรอ event นี้ก่อนถือว่าคำตอบสมบูรณ์
- Backend ของแอปเก็บ API key และอ่าน/แยก stream; UI เป็นส่วนของแอปที่แสดงสถานะและข้อความ

### Observed — สิ่งที่ตรวจจากไฟล์ที่สร้าง

- MP4 ถอดรหัสได้: H.264, 1080×1920, 30 fps, 1,560 frames, 52 วินาที; มี video stream เดียวและไม่มี audio stream; ซับภาษาไทยถูกฝังลงในภาพ
- ตรวจเฟรมจาก MP4 ที่ขนาด 360×640: ตัวละครไม่มีพื้นสี่เหลี่ยมสีขาว, ขยายเห็นท่าทางชัดขึ้นและไม่ทับแถบซับ; event state ที่แสดงภายหลังมีการ์ดก่อนหน้าสะสมอยู่ด้วย
- timing manifest มี 5 beats, 15 visual stages และซับครบทุก stage; plate/composition ที่อ้างมีอยู่ครบ
- ตรวจขนาด, alpha และ SHA-256 ของ source assets และ generated plates ไว้ใน [ASSETS-v3.md](ASSETS-v3.md)
- source logo มีคำ “LANG MIND” ชิดขอบล่างตามต้นฉบับ; คงไฟล์เดิมและบันทึกเป็นข้อจำกัด

### Illustrative — ภาพจำลอง

หน้าจอ คำถาม และการทยอยแสดงข้อความเป็นภาพประกอบที่สร้างในเครื่อง ไม่ใช่ official LangMind UI และไม่ใช่ผลจากการเรียก API จริง

### Unknown / ยังไม่ตรวจ

- ยังไม่วัดความเข้าใจหรือ retention กับผู้ชม จึงสรุปได้เพียงว่าลำดับภาพชัดขึ้นตามการตรวจภายใน ไม่ใช่ผล user test
- ยังไม่ได้ทดสอบบนโทรศัพท์จริง; เฟรม 360×640 เป็นการย่อเฟรม export เพื่อตรวจการอ่านเบื้องต้น
- ยังไม่มีเสียงพากย์/ดนตรี; timing ของซับผูกกับช่วงภาพและยังไม่ sync กับเสียง; voice audition รอผู้ใช้เลือก
- ยังไม่ได้ตรวจพฤติกรรมของ composition ผ่าน HyperFrames runtime เพราะ CLI ใช้ไม่ได้ใน environment นี้
- ไม่ทราบเวลาเริ่มตอบหรือ latency จริง จึงไม่แสดงตัวเลขหรือกล่าวอ้างความเร็ว

## Verification

| รายการ | คำสั่ง/หลักฐาน | ผล |
|---|---|---|
| Python syntax | `python -m py_compile render_fallback.py` | ผ่าน |
| สร้าง animatic | `python render_fallback.py` | ผ่าน — เขียน MP4 15 stages, ซับร่างฝังในภาพ, 52 วินาที, ไม่มีเสียง |
| HyperFrames source syntax | `node --check build.mjs` | ผ่าน |
| สร้าง compositions | `node build.mjs` | ผ่าน — 5 beats, 15 visual stages |
| Timing, captions และ asset ledger | PowerShell ตรวจ `timing.json`, captions, plate files และ SHA-256 เทียบ [ASSETS-v3.md](ASSETS-v3.md) | ผ่าน — ครบ 15/15 stages และ hashes ตรงกัน |
| MP4 metadata | `ffprobe` | ผ่าน — H.264, 1080×1920, 30 fps, 52s, video only |
| ตรวจภาพ | decode เฟรม export แล้วดูที่ 360×640 และภาพเต็มของ event sequence | ผ่านสำหรับการตรวจภายใน; ไม่ใช่ผลทดสอบผู้ชม |
| HyperFrames lint/check/preview | `hyperframes` shim เรียก Volta ที่ไม่มีในเครื่อง; `npx --offline` ไม่พบแพ็กเกจใน cache | ทำไม่ได้ใน environment นี้; ไม่ใช่ผลยืนยันว่า runtime ผ่าน |

## Files ในรุ่นนี้

- บทและ storyboard ที่ปรับ: [SCRIPT.md](../SCRIPT.md), [STORYBOARD.md](../STORYBOARD.md)
- Manifest: [timing.json](timing.json)
- Source composition: [index.html](index.html), [build.mjs](build.mjs), [compositions/](compositions/)
- Renderer สำหรับ export ใน environment ปัจจุบัน: [render_fallback.py](render_fallback.py)
- ไฟล์ผลลัพธ์: [EP03-animatic-v3.mp4](renders/EP03-animatic-v3.mp4)
- รุ่น v2 เก็บไว้เดิม; v3 อยู่ในโฟลเดอร์แยก

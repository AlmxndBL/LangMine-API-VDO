# EP03 Animatic v3.1 — Review record

Revision date: 9 พฤศจิกายน 2026<br>
Scope: script, explanatory images, Catalog motion adaptation, silent MP4 export and spot visual review. No user acceptance is inferred.

## 1. สรุปภาพและเนื้อหา

- **Observed in export:** ซีน 2 ใช้ภาพกองเอกสารและเครื่องหมายถูกเทียบกับกล่องข้อมูล 1–3; wipe หยุดที่เส้นแบ่งกลาง; หัวข้อเข้าด้วย blur/เลื่อนขึ้น; endpoint กับข้อความอธิบายอยู่ในเฟรม
- **Documented:** `POST /chat/message/blocking` รับคำตอบครบทั้งชุด; `POST /chat/message` ส่งแบบ SSE; event มี `message_start`, `message`, `citations` ที่อาจมี และ `message_end` ที่ให้คำตอบครบพร้อม usage
- **Illustrative:** แผนภาพสองภาพเป็น raster ที่สร้างในเครื่อง; ตัวอย่างแชตและสถานะหน้าจอไม่ได้มาจากการเรียก API
- **Unknown:** latency, เวลาเริ่มตอบ และพฤติกรรมของ provider ใน live request ไม่ถูกแสดงหรือสรุป
- **Audio/subtitles:** ไม่มี audio track; มีซับร่างฝังตาม visual stage และยังไม่ sync กับเสียง

## 2. HyperFrames Catalog

| รายการ | สิ่งที่เห็นจาก preview | การนำมาใช้ | ข้อจำกัด |
|---|---|---|---|
| [Before After Wipe](https://hyperframes.heygen.com/catalog/components/before-after-wipe) — component | before เป็นภาพฐาน; after wipe จากซ้าย; divider ค้างที่สัดส่วนที่ตั้ง | ใช้เปรียบเทียบภาพอธิบายสองฝั่ง; wipe เริ่มที่ 0.25s, เดิน 1.05s ด้วย `sine.inOut`, ตั้ง divider ที่ 50% | แสดงภาพเปรียบเทียบที่ผู้ทำสร้างเอง ไม่ใช่ผล stream; source ปรับให้ใช้ไฟล์ภาพและ GSAP ในเครื่อง |
| [Soft Blur In](https://hyperframes.heygen.com/catalog/components/soft-blur-in) — component | opacity, blur และการเลื่อนขึ้น; settle ภายใน 0.8s ด้วย `power3.out` | ใช้กับหัวข้อทั้งบรรทัด เพื่อไม่ให้สระ/วรรณยุกต์ไทยเคลื่อนไหวแยกกัน | ใช้เฉพาะหัวข้อซีน 2; ไม่เพิ่มเอฟเฟกต์กับทุกข้อความ |

Preview ของทั้งสองรายการเปิดและตรวจด้วยตาแล้ว; รายละเอียด source ทางการและการดัดแปลงอยู่ใน header ของ `compositions/components/*.html`. CLI catalog add ไม่ได้ใช้ในการติดตั้ง เพราะการอ่าน registry จาก `raw.githubusercontent.com` ล้มเหลวด้วย DNS (`ENOTFOUND`); จึงระบุสถานะเป็นการดัดแปลง source ที่ดูจาก preview/source ไม่ใช่ CLI-installed.

## 3. การตรวจข้อความและภาพ

- อ่านซับ stage, ชื่อ event, endpoint และข้อความภาพซ้ำทั้งใน source และ export
- ปรับเป็น `message_start: เริ่มต้นและให้รหัสบทสนทนา/ข้อความ`, `message: เนื้อหาคำตอบทยอยมาเป็นชิ้น (chunks)`, และ `message_end: คำตอบฉบับเต็มและข้อมูล usage`
- ซีน 2 ติดป้าย `ภาพอธิบาย · ไม่ใช่ผลเรียก API จริง`; ไม่มีข้อความคำตอบสมมติ
- ดู [contact sheet](renders/final-review-v3.1/contact-sheet.png) ที่ 7 เวลาและเฟรมเต็ม [ซีน 2 ที่ 9.3s](renders/final-review-v3.1/frame-9.3s.png); ตรวจขนาด ย่อหน้า endpoint สัดส่วนภาพ divider และแถบซับบน export จริง
- การตรวจภาพเป็น spot check ของเฟรม ไม่ใช่การทดสอบความเข้าใจผู้ชม

## 4. Technical evidence

| รายการ | คำสั่ง/หลักฐาน | ผล |
|---|---|---|
| สร้าง raster และ MP4 | `python render_fallback.py` | Exit 0; 15 visual stages รวม segment motion ซีน 2; 52 วินาที; silent |
| ไฟล์ส่งออก | `ffprobe -v error -select_streams v:0 -show_entries stream=width,height,avg_frame_rate,duration,nb_frames -show_entries format=duration -of json renders/EP03-animatic-v3.1.mp4` | 1080×1920, 30/1 fps, 52.000 วินาที, 1,560 frames |
| HyperFrames source syntax | `node --check build.mjs` | ผ่าน |
| HyperFrames lint | `hyperframes lint --json` ผ่าน CLI entry ของเครื่อง | 0 errors; 1 warning `timeline_track_too_dense` ที่ `compositions/beat03.html`; ไม่มี component error |
| HyperFrames runtime/layout/motion check | `hyperframes check --json --snapshots` | ไม่สำเร็จ: Chrome ได้ `net::ERR_NETWORK_ACCESS_DENIED` เมื่อเปิด local `127.0.0.1`; จึงไม่มี runtime, layout หรือ motion audit ที่รันครบ; report เขียน cache ไม่ได้ (`EPERM`) |

MP4 สร้างด้วย local FFmpeg หลัง check เปิด runtime browser ไม่ได้. เฟรมซีน 2 ใน MP4 จำลองจังหวะ Catalog wipe และ Soft Blur In ตามพฤติกรรมที่ตรวจจาก preview; **ไม่ได้**ยืนยันว่า HyperFrames renderer เองเรนเดอร์ component source ได้. ยังต้องทำ runtime render/check เมื่อ local browser เปิด composition ได้

## 5. ไฟล์และสถานะค้าง

- MP4: [EP03-animatic-v3.1.mp4](renders/EP03-animatic-v3.1.mp4)
- Asset dimensions, alpha และ hashes: [ASSETS-v3.1.md](ASSETS-v3.1.md)
- บทและ storyboard: [SCRIPT-v3.1.md](../SCRIPT-v3.1.md), [STORYBOARD-v3.1.md](../STORYBOARD-v3.1.md)
- ยังไม่มีเสียงพากย์หรือผลทดสอบความเข้าใจ; voice audition ยังรอผู้ใช้เลือกก่อน retime ซับ
- `v3` เดิมไม่ได้แก้ทับในงานนี้; ไม่มี live/paid API call, provider resource หรือ publication

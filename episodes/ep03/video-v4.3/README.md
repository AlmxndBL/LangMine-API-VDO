# EP03 v4.3 — Chat API ใน LangMind

วาง workflow และการเล่าเรื่องตาม [langmind-video-producer](../../../.agents/skills/langmind-video-producer/SKILL.md); ใช้ [HyperFrames](../../../.agents/skills/hyperframes/SKILL.md), [CLI](../../../.agents/skills/hyperframes-cli/SKILL.md), [Catalog registry](../../../.agents/skills/hyperframes-registry/SKILL.md) และ [media-use](../../../.agents/skills/media-use/SKILL.md) สำหรับ composition, Catalog, asset handling และ QA. หลักฐานรายขั้นอยู่ใน plan, storyboard, catalog log และ review ด้านล่าง

## ผลผลิต

- **Silent Draft:** [ep03-v4.3-silent.mp4](renders/ep03-v4.3-silent.mp4) — H.264, 1080×1920, 30 fps, 2,830 เฟรม, 94.33 วินาที, ไม่มีเสียง
- **ภาพตรวจจาก MP4:** [qa-contact-sheet-v4.3.png](renders/qa-contact-sheet-v4.3.png)
- **บท/ซับ:** [SCRIPT-v4.3.md](SCRIPT-v4.3.md)
- **Storyboard:** [STORYBOARD-v4.3.md](STORYBOARD-v4.3.md)
- **แผน/ข้อเท็จจริง:** [PLAN-v4.3.md](PLAN-v4.3.md), [SPEC-v4.3.md](SPEC-v4.3.md), [STORYLINES-v4.3.md](STORYLINES-v4.3.md)
- **แบบหน้าจอ:** [SCREEN-DESIGNS-v4.3.md](SCREEN-DESIGNS-v4.3.md); ภาพ raster อยู่ใน `assets/screens/`
- **Timing:** [SILENT-TIMING-v4.3.md](SILENT-TIMING-v4.3.md), [timing.generated.json](timing.generated.json)
- **Catalog/asset/review:** [CATALOG-v4.3.md](CATALOG-v4.3.md), [ASSETS-v4.3.md](ASSETS-v4.3.md), [REVIEW-v4.3.md](REVIEW-v4.3.md), [render manifest](renders/render-manifest-v4.3.json)
- **HyperFrames source:** [index.html](index.html), [build.mjs](build.mjs), [motion.js](motion.js), [style.css](style.css), scene compositions ใน `compositions/`
- **Fallback renderer:** [render_silent.py](render_silent.py); raster source: [build_screens.py](build_screens.py)

## เนื้อหาและหลักฐาน

คลิปพาเหตุการณ์เดียวจากผู้ใช้ขอข้อความสุภาพเพื่อเลื่อนประชุม 14:00 → 15:00 แล้วขอให้ย่อ ไปยังการเตรียม `agent_id`/API key, `POST /api/chat/message`, SSE events, การส่ง `conversation_id` เดิมเมื่อถามต่อ และภาพรวม route ของ Chat API

- **Documented:** endpoint, scope `chat:invoke`, field และลำดับ SSE อ้างจาก `langmind-api.md` snapshot ใน workspace
- **Illustrative:** หน้าจอแชตและคำตอบถูกสร้างใหม่พร้อมป้าย “ภาพจำลอง”; ไม่มีการเรียก API และไม่ใช่ official UI
- **Unknown/omitted:** ไม่มี ID จริง, citations, usage values, latency, cost หรือผลลัพธ์จาก Agent จริง
- API key ในภาพเป็น `$LM_TOKEN` placeholder และเก็บไว้ฝั่ง server; ไม่มี key จริงหรือ provider resource

## สถานะการ render และข้อจำกัด

HyperFrames project มี scene hosts แยก 9 beats และ Catalog source HF-113 แบบปรับแต่งใน B4; `hyperframes lint` ผ่าน 0 errors/0 warnings. Native `check`/`snapshot` เปิด `127.0.0.1` ไม่ได้ใน sandbox (`ERR_NETWORK_ACCESS_DENIED`) และ HyperFrames cache/history นอก workspace เขียนไม่ได้ (`EPERM`). จึงสร้าง MP4 ด้วย Pillow + FFmpeg fallback; highlight ใน MP4 วาดด้วย fallback renderer ไม่ได้ render จาก Catalog composition จริง. ดูสถานะแยกตามหลักฐานใน [CATALOG-v4.3.md](CATALOG-v4.3.md) และ [REVIEW-v4.3.md](REVIEW-v4.3.md)

การตรวจที่ผ่าน: HyperFrames lint, `ffprobe`, FFmpeg decode และการเปิดดู contact sheet/เฟรมตัวอย่างจาก MP4. ยังไม่มี native HyperFrames snapshot/render, เสียงพากย์, ดนตรี, audio sync, การทดสอบกับผู้ชม หรือการตรวจรับจากผู้ใช้. ตาม workflow ให้เลือกเสียงจาก sample ก่อนทำฉบับเสียง.

## สร้างซ้ำ

รันจาก workspace root:

```powershell
node episodes/ep03/video-v4.3/build.mjs
python episodes/ep03/video-v4.3/render_silent.py
```

`build.mjs` สร้าง timing และ 9 scene compositions; `render_silent.py` สร้าง Silent Draft โดยไม่เรียก live API. HyperFrames native render ต้องตรวจซ้ำในสภาพแวดล้อมที่ preview/browser และ cache path ใช้งานได้

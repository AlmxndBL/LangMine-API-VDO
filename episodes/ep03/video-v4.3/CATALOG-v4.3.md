# EP03 v4.3 — HyperFrames Catalog log

แยกสถานะ `preview observed`, `source installed`, `integrated in editable project`, `native-rendered`, และ `visually verified` ออกจากกัน. ไม่ใช้การมีไฟล์หรือผล lint แทนการดู native render.

| Item | หน้าที่ | หลักฐาน preview/source | การเลือก/ปรับ | สถานะ v4.3 |
|---|---|---|---|---|
| HF-113 Code Highlight Sweep | เน้น field ใน request | Source ที่เคยใช้ใน EP02 r10: `compositions/code-highlight-B08-body.html`; still ที่เกี่ยวข้องถูกเปิดดูในรอบนี้. ยังไม่มีหลักฐาน official player preview ใน workspace | คัดลอกไว้ที่ `catalog-source/HF-113-code-highlight-original.html`; ปรับรุ่นที่ `compositions/code-highlight.html` ให้เป็นสี sage, Sarabun และ payload B4 | Local source copied/adapted: yes. Referenced by B4 editable composition: yes. HyperFrames lint: pass. Native render/visual behavior: unverified. MP4 fallback วาด highlight ด้วย Pillow แยกต่างหาก จึงไม่อ้างว่า Catalog block เป็นตัว render ใน MP4 |
| HF-118 Code Typing | แสดงการพิมพ์โค้ด | `docs/CATALOG_USAGE_MAP.md` เก็บผล preview ที่สังเกตเมื่อ 6 พ.ย. 2026; ไม่มีการดู preview ใหม่ใน session นี้ | พิจารณา แต่ไม่ได้ใช้ เพราะไม่สามารถติดตั้ง source ในรอบนี้ | Historical preview observed; source not installed; not integrated |
| HF-196 Code Terminal Run | command/output ตาม cue | `docs/CATALOG_USAGE_MAP.md` เก็บผล preview ที่สังเกตเมื่อ 6 พ.ย. 2026; ไม่มีการดู preview ใหม่ใน session นี้ | พิจารณาแล้วไม่ใช้ terminal เพราะไม่มีผลเรียก API จริงให้แสดง; B5 ใช้ diagram ที่ระบุเป็นภาพอธิบาย | Historical preview observed; source not installed; not integrated |
| HF-409 Flowchart Vertical | decision tree แนวตั้ง | local catalog search ให้คำอธิบาย decision tree; official preview เปิดไม่ได้ใน browser ที่พร้อมใช้งาน | ไม่เลือก เพราะเนื้อหา B2 เป็นเส้นทางข้อมูลทางเดียว ไม่ใช่การตัดสินใจแบบ tree | Assessed; not selected; preview not observed in this session |

## การค้นหาและข้อจำกัด

- CLI ที่ใช้: HyperFrames 0.9.20; มีเวอร์ชัน 0.9.26 ให้ปรับปรุง
- Catalog search สำหรับ code typing/terminal พบ HF-118 และ HF-196. คำสั่ง add ล้มเหลวด้วย DNS `getaddrinfo ENOTFOUND raw.githubusercontent.com`; หยุด retry ตามข้อกำหนด workspace.
- Browser preview ถูกปิดใน Work settings และการเปิด localhost จาก HyperFrames snapshot ถูก sandbox ปฏิเสธ; จึงไม่มี official player preview หรือ native frame สำหรับ review รอบนี้.
- `hyperframes usage --json` คืน `status: unknown`; ไม่มีการสรุป usage จากสถานะที่ไม่ชัดเจน.

## การใช้ในวิดีโอ

- B2 ใช้เส้นแสดงหน้าที่ app → server → Chat API → Agent; เป็น custom diagram เพราะไม่พบ Catalog block ที่พอดีกับเส้นทางตรงนี้
- B4 มี HF-113 adapted source เป็น nested composition ในโปรเจกต์ HyperFrames; lint ผ่านและตรวจโครงสร้างใน source แล้ว แต่พฤติกรรมยังไม่ยืนยันด้วย native preview
- B5 ใช้ diagram ของ event ตาม `langmind-api.md`, ไม่ใช่ terminal output และไม่มีค่า ID/citation/usage จำลอง
- MP4 ปัจจุบันสร้างด้วย `render_silent.py` (Pillow + FFmpeg fallback). ผล highlight ใน MP4 เป็นการวาดแยกตามแบบ ไม่ได้เรียก Catalog composition จริง

# EP03 v4 — Catalog map

สถานะ: shortlist สำหรับ storyboard; ยังไม่ได้ติดตั้งเข้าคอมโพสิชัน v4  
หลักอ้างอิง: [Catalog Usage Map](../../../docs/CATALOG_USAGE_MAP.md), source documentation ทางการ, และ preview observations ที่บันทึกใน map เมื่อ 6 พ.ย. 2026

## รายการที่เลือกตามหน้าที่ของซีน

| ID / ชื่อ | ชนิด / URL | Preview และหลักฐานพฤติกรรม | ใช้ใน | ข้อจำกัด / สิ่งที่ต้องทดลอง | สถานะ |
|---|---|---|---|---|---|
| HF-118 — Code Typing | Block · [หน้า Catalog](https://hyperframes.heygen.com/catalog/blocks/code-typing) | preview จริงถูกดูหลายช่วงเวลาใน Catalog Usage Map: ราว 1s เห็นต้นบรรทัดกับ caret; ราว 4s เห็น snippet หลายบรรทัดและ caret ตามปลายข้อความ. เอกสารทางการอธิบายว่าเผย token ตามลำดับพร้อม caret; ตัวอย่างต้นทาง 5s ที่ 1920×1080. | B8: เปิดเผย request code ทีละช่วง | ขนาดอ้างอิงแนวนอน; ต้องตัด snippet เหลือ field ที่จำเป็นและทดสอบการจัดใหม่ 9:16/ขนาดมือถือ; ยังไม่มีการติดตั้งหรือทดสอบกับ code ไทย/เส้นยาว | Candidate เลือกสำหรับ storyboard; preview มีบันทึกแล้ว, integration ยังไม่ verified |
| HF-196 — Code Terminal Run | Component · [หน้า Catalog](https://hyperframes.heygen.com/catalog/components/code-terminal-run) | preview จริงถูกดูหลายช่วงเวลาใน Catalog Usage Map: 0s เห็น prompt/caret; ราว 4s เห็นคำสั่งและ log หลายบรรทัด. เอกสารทางการระบุพิมพ์หนึ่งคำสั่งแล้วแสดง output ตาม cue; ปรับ `prompt_glyph`, `cadence`, `cues`, `accent`, `exit`; component รับขนาดจาก host. | B9: แสดงลำดับ SSE events ในกล่อง output จำลอง | output ต้องเป็นตัวอย่างพร้อมป้ายจำลอง; คิวและการแบ่งบรรทัดต้องทำเอง; ทดสอบการใช้งานใน vertical host, font ไทย/monospace, safe area และความอ่านได้ | Candidate เลือกสำหรับ storyboard; preview มีบันทึกแล้ว, integration ยังไม่ verified |

## รายการที่ยังไม่เลือก

| รายการ | เหตุผลที่ยังไม่เลือก | สถานะ preview |
|---|---|---|
| Streaming Text (HF-298) · [หน้า Catalog](https://hyperframes.heygen.com/catalog/components/streaming-text) | ใกล้กับภาพคำตอบทยอยมา แต่ในงานนี้ต้องสื่อ event name แยกกันด้วย; ยังไม่เห็นว่ารับ Thai text/line breaks ตามต้องการหรือไม่ | อ่านคำอธิบายและ options แล้ว; preview motion ยังไม่ได้ดูใน turn นี้ |
| Hand-Drawn Arrow (HF-322) · [หน้า Catalog](https://hyperframes.heygen.com/catalog/components/hw-arrow) | ลูกศรวาดมีบุคลิกเด่น อาจแย่ง path/route; ยังไม่จำเป็นในทุก beat | อ่านคำอธิบายแล้ว; preview motion ยังไม่ได้ดูใน turn นี้ |
| Code Diff (HF-112) · [หน้า Catalog](https://hyperframes.heygen.com/catalog/blocks/code-diff) | อาจทำให้การเปรียบเทียบ SSE/JSON ดูเหมือนการแก้ source code; ใช้การ์ด infographic ที่นิ่งกว่า | preview จริงเคยดูใน Catalog Usage Map; ไม่ได้เลือกเข้าซีน |

ไม่ใช้ named effect อื่นใน storyboard จนกว่าจะดู preview แล้วพบว่าช่วยความเข้าใจ. ฉากอธิบายที่ไม่มีความต้องการ motion ใช้ภาพนิ่ง/การตัดภาพหรือ crop ที่มีหน้าที่ชัด ไม่เติม movement เป็นเครื่องประดับ.

## สถานะเครื่องมือและขอบเขต

- เปิดดูเอกสาร Catalog ทางการล่าสุดสำหรับ Code Typing, Code Terminal Run, Streaming Text และ Hand-Drawn Arrow; พฤติกรรมที่ระบุข้างต้นยึด preview observation ที่มีอยู่ใน Catalog Usage Map วันที่ 6 พ.ย. 2026 ไม่ถือว่า preview ในเว็บปัจจุบันถูกตรวจซ้ำแล้ว
- ผล CLI ล่าสุดที่ผู้ใช้ส่งมา: เรียก `C:\Users\lenovo\AppData\Local\Volta\bin\hyperframes.cmd --version` ได้ `0.9.20`; คำสั่ง `catalog --query "reveal code request and stream response in terminal" --json` สำเร็จด้วย tier `words` / `local word match`, แสดง 88 จาก 448 รายการ และพบ `terminal-simulator`, `code-terminal-run`, `code-typing`. นี่เป็นหลักฐานว่าค้น metadata ใน local Catalog ได้เมื่อเรียก shim ด้วย path เต็ม ไม่ใช่หลักฐาน preview หรือ integration
- สภาพแวดล้อม Codex ที่ตรวจในรอบนี้ยังเรียก CLI ไม่ผ่าน: `where.exe` พบ Volta และ HyperFrames แต่ `$env:LOCALAPPDATA` ชี้ไปยัง path sandbox; เรียก shim ด้วย path จริงแล้ว child `cmd` ตอบว่าไม่พบ `volta`. จึงถือว่าผลสำเร็จข้างต้นเกิดใน PowerShell ของผู้ใช้ ไม่ใช่การยืนยันว่า CLI ใช้ได้จาก Codex
- การเปิด preview ผ่าน browser ในสภาพแวดล้อมนี้ยังติด Work settings ที่ปิด local browser (ตามสถานะก่อนหน้า); ผล CLI ข้างต้นไม่ได้เปิด preview หรือทดลอง item ใน composition
- ดังนั้นสองรายการแรกเป็น candidate ที่ผ่านการดู preview ก่อนหน้านี้ แต่ยังไม่อ้างว่า integrated, verified ใน composition v4 หรืออ่านได้ในสัดส่วน 9:16
- ก่อน W6 ต้องเปิด preview ผ่าน browser หรือใช้ preview environment ที่อนุญาต แล้ว mount เฉพาะรายการที่เหมาะใน sample; ถ้าผลไม่เหมาะ ให้เลือก Catalog item อื่นหลังดู preview หรือบันทึก gap ก่อนทำ custom

## References

- [Code Typing — official description](https://hyperframes.heygen.com/catalog/blocks/code-typing)
- [Code Terminal Run — official description and variables](https://hyperframes.heygen.com/catalog/components/code-terminal-run)
- [Streaming Text — official description and options](https://hyperframes.heygen.com/catalog/components/streaming-text)
- [Hand-Drawn Arrow — official description](https://hyperframes.heygen.com/catalog/components/hw-arrow)
- [Local Catalog Usage Map](../../../docs/CATALOG_USAGE_MAP.md) — preview observations dated 6 Nov 2026

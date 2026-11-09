> ขอบเขตล่าสุด 7 พ.ย. 2026: งานปรับแบบ r10 เป็น design/docs เท่านั้น ไม่ผลิตหรือ render ในรอบนี้ แบบ active อยู่ [DESIGN](DESIGN.md) ส่วนบท/เวลา/motion รายฉากอยู่ [STORYBOARD](STORYBOARD.md) ไม่ใช้แผนผลิต r9 หรือ r2 เก่าทับคำสั่งล่าสุด เก็บไฟล์/ประวัติเดิมทั้งหมด สถานะส่งต่อ: ออกแบบครบ16ฉาก งบ440s ยังต้องสร้างและตรวจ raster/เสียงใหม่ก่อนประกอบ หลักฐานอยู่ [บันทึกรอบนี้](../../docs/plans/2026-11-07-ep02-continuity-r10.md)

# EP02 — แผนเรื่องและแบบช่วงออกแบบแอป/ปิดท้าย

วันที่ 7 พฤศจิกายน 2026 (Asia/Bangkok)

อัปเดตรอบออกแบบทั้งหมด: [DESIGN r2](DESIGN.md) เป็นรายละเอียดบท/storyboard/หน้าจอ/โค้ด/Catalog/เสียงสำหรับทำงานต่อ ส่วนด้านล่างเก็บแนวคิดและประวัติการขยายก่อน r2 ยังไม่ประกอบตามคำสั่งล่าสุด

## 1. ขอบเขตและสถานะการอนุมัติ

ผู้ใช้อนุมัติข้อเสนอในแชตก่อนหน้าและให้เพิ่ม Multi Device Splay เพื่อสื่อการออกแบบตามต้องการ รวมถึงประโยคส่งท้ายที่ให้ความรู้สึกถึงนวัตกรรม อนาคต และสิ่งใหม่ ก่อนปิดด้วย Extruded Logo และโลโก้ LangMind

เอกสารนี้เก็บโครงที่อนุมัติพร้อม working design ของส่วนเพิ่ม ไม่ใช่ storyboard ทุกเฟรมหรือหลักฐานว่า MP4 ผ่านตรวจรับแล้ว ไม่เปลี่ยน EP01 หรือ knowledge sample เดิม ชื่อผลิตภัณฑ์ใช้ LangMind ตาม source กลาง

ใช้ HyperFrames/hyperframes-registry สำหรับ motion, Apex-core สำหรับเอกสารและ API boundaries และ antislop เป็นตัวกรองตามขอบเขตสื่อวิดีโอ ไม่เพิ่มเกณฑ์ interactive app ให้ MP4

## 2. เป้าหมายคนดูและตัวอย่างหลัก

ผู้ชมล่าสุด: อายุ 24–48 ปี รู้จัก AI/เทคโนโลยีบ้างแต่พื้นฐานยังไม่แน่น ไม่จำกัดเฉพาะ developer ใช้หลัก “เวลาเราทำสื่อ ทำคลิป ต้องคิดในมุมคนดู ว่าเหตุผลอะไรถึงดูคลิปนี้” บทและลำดับ active อยู่ DESIGN r2 ตารางด้านล่างเป็นประวัติแนวคิด

ดูจบควรอธิบายเส้นทาง frontend → server → LangMind Agent → คำตอบกลับได้ รู้ว่าต้องเตรียมอะไรและใช้ conversation เดิมถามต่ออย่างไร รวมถึงรู้ว่าส่วนหน้าตา/อุปกรณ์เป็นสิ่งที่ตนออกแบบและพัฒนาเอง

ตัวอย่าง: ผู้ขายพิมพ์ “ช่วยเขียนข้อความแจ้งลูกค้าว่าสินค้าส่งช้า ให้สุภาพหน่อย” แล้วถามต่อ “ขอสั้นลงสำหรับส่งใน LINE” แสดงเป็นการร่างข้อความ ไม่ได้ส่ง LINE จริง คำตอบในสื่อเป็น illustrative จนมีหลักฐาน API จริง

## 3. โครงเรื่องที่ใช้ต่อ

| ID | คำถาม/ใจความ | ภาพและ Catalog | เสียง/ข้อความและการส่งต่อ |
|---|---|---|---|
| S01 | อยากมีแชทแบบที่คุ้นเคยในเว็บเราเองได้ไหม | chatgpt-exchange ช่วงถาม–ตอบ ตัดตารางจัดอันดับเดิม | เปิดด้วยสถานการณ์ ไม่อ้างสร้างฟีเจอร์ทั้งหมดของ ChatGPT; ป้ายภาพจำลอง |
| S02 | เรากำลังจะทำอะไร | ai-chat-reveal เป็นผู้ช่วยร่างข้อความของเรา | แสดงผลที่อยากทำได้ก่อนแกะวิธี |
| S03 | ข้อความเดินทางอย่างไร | diagram ค่อยเพิ่ม frontend, server, LangMind Agent; Flowchart Vertical เป็น candidate ที่ต้องตรวจ preview ก่อนใช้ | server เก็บ key และเชื่อม API; frontend แสดงผล |
| S04 | ก่อนเรียกต้องมีอะไร | Agent ที่พร้อมใช้งาน, agent_id, secret ฝั่ง server | อธิบายหน้าที่ Agent/คำสั่ง/credential ตาม contract; ไม่แต่งขั้นตอน dashboard ที่ยังไม่ตรวจ |
| S05 | โค้ดแต่ละส่วนทำอะไร | code-highlight ทีละชุด: frontend ส่งเข้า route ของเรา → server เรียก provider → ส่งผลกลับ | ระบุว่า /api/chat เป็น route ตัวอย่างของแอป ไม่ใช่ provider endpoint |
| S06 | ถามต่ออย่างไร | แชทคำถามที่สอง สลับไฮไลต์ conversation_id | ใช้ ID เดิมและตรวจ ownership ฝั่ง server |
| S07 | อยากให้ทยอยตอบต้องทำอย่างไร | เปรียบเทียบรอคำตอบเต็มกับ SSE; ใช้ ai-chat-reveal ที่ปรับจังหวะตรงวิธี | blocking แสดงผลเต็ม; streaming แสดงทยอยตาม event ไม่ปะปนกับเอฟเฟกต์พิมพ์ |
| S08 | หน้าตาต้องเหมือนแชทเดิมไหม | Multi Device Splay จากหนึ่งแอปสู่สาม viewport พร้อมปรับหน้าตา | แบบรายละเอียดในส่วน 5 |
| S09 | จากตรงนี้ทำอะไรเพิ่มได้ | แอปเดิมเชื่อมคำสั่ง Agent, เอกสาร, tools/ระบบงานเพิ่มทีละส่วน | ผู้ช่วยร่างข้อความ → FAQ/คู่มือ → งานที่เชื่อมระบบพร้อมสิทธิ์; ไม่อ้างว่าทุกอย่างพร้อมทันที |
| S10 | สิ่งต่อไปที่คนดูจะสร้าง | หน้าจอค่อยออก เหลือข้อความส่งท้าย | “LangMind สร้างสิ่งต่อไป ในแบบของคุณ” |
| S11 | จดจำแบรนด์ | Extruded Logo เปิดตัวอักษร LANGMIND → โลโก้ต้นฉบับบนพื้นอ่อน | sound accent สั้นแล้วคลี่จบ ให้เวลาอ่านโลโก้และ langmind.in.th |

กรอบร่างเดิม 3–5 นาทีเป็นประมาณการเพื่ออธิบายครบ ไม่ล็อกความยาว เวลาเพิ่ม/ลดตามบทอ่านและ sample เสียง

## 4. Catalog และหลักฐาน

| รายการ/ชนิด | แหล่ง preview | สถานะและพฤติกรรม | การปรับ/ข้อจำกัด |
|---|---|---|---|
| ChatGPT Exchange / block | [preview](https://hyperframes.heygen.com/catalog/blocks/chatgpt-exchange) | เปิดดูในรอบวิเคราะห์ก่อนหน้า; พิมพ์/ส่ง/ตอบ/ตาราง; หน้าเว็บระบุ 1080×1920 | เลือกช่วงเปิด ตัด default ranking และ source chips; ไม่ใช้คำตอบจัดฉากเป็นผลจริง |
| AI Chat Reveal / block | [preview](https://hyperframes.heygen.com/catalog/blocks/ai-chat-reveal) | เปิดดูในรอบวิเคราะห์ก่อนหน้า; คีย์บอร์ด ส่ง รอ ตอบและ end card; 1080×1920 | เปลี่ยนเนื้อหา เพิ่ม follow-up ตัด end card กลางเรื่อง ทดสอบไทยและ timing |
| Code Highlight Sweep / block | [preview](https://hyperframes.heygen.com/catalog/blocks/code-highlight) | เปิดดูในรอบวิเคราะห์ก่อนหน้า; แถบเน้นบรรทัดและหรี่ส่วนอื่น; 1920×1080 | จัดโค้ดใหม่ให้เหมาะแนวตั้ง ไม่ย่อทั้งกรอบจนอ่านไม่ได้ |
| Multi Device Splay / component | [preview](https://hyperframes.heygen.com/catalog/components/multi-device-splay) | observed 7 พ.ย.: อุปกรณ์สามชิ้นแผ่ออกจากกองกลาง เห็นภาพหลายจังหวะ; documented: phone/tablet/desktop และ idle float | หน้า Tune มีเพียง accent ไม่ใช่ระบบรับ screenshots สำเร็จรูป ต้องแก้ source ใส่เนื้อหา EP02 และออกแบบ responsive views เอง |
| Extruded Logo / block | [preview](https://hyperframes.heygen.com/catalog/blocks/extruded-logo) | observed 7 พ.ย.: ตัวอักษร 3D และภาพค้างปลาย; documented: ตัวอักษรพลิกขึ้น รับแสงแล้วหยุด, 5 วินาที 1920×1080 | รับ basic Latin text ไม่ใช่ PNG/vector logo; ใช้ LANGMIND เป็น motion title แล้วส่งต่อโลโก้จริง แยกภาษาไทยเป็น overlay ของ host |

สถานะทั้งห้า: ตรวจต้นทาง/preview แล้ว แต่ยังไม่ติดตั้งหรือ integrated ในตอนนี้ และยังไม่ตรวจ render กับข้อความจริง ไม่ถือว่า default duration คือเวลาที่เนื้อหาจริงต้องใช้

คำสั่งเฉพาะ EP02 ใช้ Catalog แชทและอุปกรณ์โดยตรง มีผลเหนือค่าเริ่มต้น generated raster สำหรับ UI ส่วนนี้ ถ้าจำเป็นใช้ raster ให้ทำแบบรายภาพและตรวจจริงก่อนนำเข้า ไม่เจนภาพแทน Catalog โดยไม่มี gap

## 5. แบบช่วง Multi Device Splay

ตำแหน่ง: หลังเข้าใจโค้ดและการถามต่อ ก่อนสรุป use case เพิ่ม เพราะคนดูเพิ่งเห็นว่าเบื้องหลังเชื่อมได้แล้ว จึงอธิบายอิสระด้าน frontend ได้โดยไม่หลุดเรื่อง

บทพากย์ร่าง: “เมื่อเชื่อม LangMind ได้แล้ว หน้าตาแอปก็ออกแบบได้ตามงานของคุณ ทั้งสี เลย์เอาต์ และรูปแบบการใช้งาน จะวางบนมือถือ แท็บเล็ต หรือเดสก์ท็อป ก็เป็นส่วนที่คุณพัฒนาต่อได้ โดยให้ LangMind Agent ช่วยตอบอยู่เบื้องหลัง”

ข้อความเน้น: “ออกแบบหน้าตาได้ ในแบบของคุณ” แล้วเปลี่ยนเป็น “Frontend ของคุณ · LangMind Agent ช่วยตอบ” ไม่ขึ้นรายละเอียดทั้งประโยคแข่งกับซับ

| จังหวะ/เวลาร่าง | ภาพและจุดสนใจ | สิ่งคงเดิม/สิ่งเปลี่ยน |
|---|---|---|
| A / 0–3 วินาที | แชทเดิมย่อเข้าสู่จอมือถือกลางภาพ อีกสองจอซ้อนอยู่ด้านหลัง | คงข้อความ คำถาม คำตอบ และชื่อแอปจาก S06–S07 |
| B / 3–7 วินาที | มือถือ แท็บเล็ต และเดสก์ท็อปแผ่ออกตาม component แล้วค้าง | แสดงการจัดหน้าใหม่ตาม viewport; ใช้เนื้อหาเดิมให้เห็นความสัมพันธ์ |
| C / 7–12 วินาที | เน้นทีละเรื่อง: สีแบรนด์ → layout → เครื่องมือร่างข้อความ โดยหรี่จอที่ไม่ได้อธิบาย | มือถือเป็นแชทเต็มพื้นที่ แท็บเล็ตมีแผงเลือกงาน เดสก์ท็อปแบ่งบทสนทนากับพื้นที่ร่าง; ไม่ใส่ข้อมูลใหม่ที่ต้องอ่านพร้อมกันสามจอ |
| D / 12–15 วินาที | กรอบทั้งสามค้าง เห็นเส้นทางเชื่อม Agent เดียวกัน ก่อนส่งต่อ use case | ความหมายคือ frontend ต่างรูปแบบเชื่อม Agent ได้ ไม่ใช่หลักฐาน sync ข้ามอุปกรณ์ |

เวลาเป็นกรอบลองอ่าน ปรับตามเสียงจริง ไม่ยืดบทให้พอดี default component

แบบหน้าจอสำหรับ sample: UI-PHONE, UI-TABLET, UI-DESKTOP ใช้ข้อความสอง turn เดียวกัน; ป้าย “ภาพจำลอง” อยู่ใน host; โทรศัพท์โชว์ turn ปัจจุบัน แท็บเล็ตเพิ่มเมนูงาน เดสก์ท็อปเพิ่มพื้นที่ข้อความร่าง แผงเหล่านี้เป็นฟีเจอร์ที่ developer ออกแบบ ไม่ใช่ UI ที่ API ส่งมา ก่อนผลิตต้องระบุ geometry/crop/ขนาดจริงและตรวจมือถือ รวมถึงไม่ให้เครื่องพัดออกชนซับ

ไม่อ้าง API ทำ responsive layout, native app หรือ sync history ให้อัตโนมัติ ถ้าจะอธิบาย resume ข้ามอุปกรณ์ต้องเพิ่ม account/history mapping ของแอปและหลักฐานเฉพาะ

## 6. ประโยคส่งท้ายและลำดับปิด

Working line ที่เลือกใช้ในแบบรอบนี้:

> LangMind สร้างสิ่งต่อไป ในแบบของคุณ

เชื่อม “สิ่งต่อไป” กับการต่อยอดจากแชทที่เพิ่งสร้าง และ “ในแบบของคุณ” กับหน้าตา/งานที่ developer กำหนดเอง เป็นถ้อยคำชวนสร้าง ไม่ใช่ claim ว่าผลิตภัณฑ์ทำทุกอย่างได้

ทางเลือกสำรองถ้าปรับน้ำเสียงภายหลัง: “LangMind สิ่งใหม่ เริ่มที่คุณสร้าง” (ตรงและชวนลงมือ) หรือ “LangMind จากไอเดียคุณ สู่สิ่งที่เป็นไปได้” (นุ่มกว่า) ยังไม่ใช้สลับหลายประโยคในคลิป

| จังหวะ | แบบภาพ/เสียง |
|---|---|
| ก่อนโลโก้ / ร่าง 3–4 วินาที | จบคำอธิบาย use case แล้วขึ้น “สร้างสิ่งต่อไป” / “ในแบบของคุณ” สองบรรทัด พากย์ working line หนึ่งครั้ง ใช้พื้นโล่ง ไม่มีโค้ดหรือสามอุปกรณ์แข่งขัน |
| เปิด 3D / ร่าง 2–3 วินาที | ใช้ Extruded Logo สร้าง LANGMIND เป็น title สามมิติ วัสดุ chrome จากตัวเลือก Catalog แสงขอบ cyan อิงสีต้นฉบับ พื้นเข้ม ลดการแกว่งให้คำยาวอ่านได้ ไม่มี tagline อังกฤษ default และไม่มี robot บัง |
| จบแบรนด์ / ร่าง 2–3 วินาที | เปลี่ยนเป็นพื้นอ่อนแล้วแสดง PNG ต้นฉบับครบทั้งสัญลักษณ์และ LANG MIND แบบ flat คงสีและสัดส่วน; ด้านล่าง langmind.in.th ค้างให้อ่านได้ ไม่มี CTA เพิ่มที่ไม่ได้อธิบาย |

ตัวอักษร 3D เป็น title ประกอบ ไม่อ้างเป็น logo asset ใหม่หรือการ extrude สัญลักษณ์ต้นฉบับ หาก LANGMIND ยาวเกินกรอบแนวตั้งให้ปรับ camera/ขนาดหรือแบ่ง title อย่างมีแบบ ไม่บีบสัดส่วนโลโก้จริง แยกประโยคไทยเป็นข้อความใน host เพื่อไม่ติดข้อจำกัดฟอนต์ Latin ของ block

ตั้งใจให้ภาพสุดท้ายเป็นโลโก้จริง ไม่ค้างจบที่ wordmark 3D ซึ่งรูปร่างไม่ตรงต้นฉบับ เสียงเป็น brief สำหรับ sound accent สั้นและจบสงบ ยังไม่เลือกไฟล์หรือสร้างเสียง

## 7. API และโค้ดที่ต้องรักษา

อ้างอิง [ต้นฉบับ provider](../../langmind-api.md) ส่วน Chat API ไม่ยก implementation ของ AlmondChat มาเป็น requirement

- เตรียม Agent ที่พร้อมใช้, agent_id และ Bearer API key ฝั่ง server; chat:invoke สำหรับแชท และ agents:read เมื่ออ่านรายการ Agent
- ตัวอย่างเริ่มจาก blocking endpoint https://langmind.in.th/api/chat/message/blocking แล้วอธิบาย SSE ที่ /api/chat/message แยกกัน
- body หลัก: agent_id, query, conversation_id; รับ answer และ conversation_id เก็บสำหรับรอบถัดไป
- ตรวจเจ้าของ conversation ใน server; user_id กับ conversation_id:null มีเงื่อนไข reuse เธรดตาม snapshot ต้องเลือกตัวอย่างให้ชัดก่อนทำ code sample
- SSE ใช้ event message_start, message, message_end; ไม่ถือว่าจบสมบูรณ์เมื่อยังไม่มี terminal event
- แสดง loading และกรณีส่งไม่สำเร็จเฉพาะที่ช่วยอธิบาย ผู้ใช้อนุญาต 7 พ.ย. ให้ key ใน screen recording ปรากฏในสื่อได้; ตัวอย่างโค้ด/เอกสารยังใช้ environment variable ไม่คัดลอกค่าจริงซ้ำ และไม่แต่ง citations/latency/cost
- stack ของโค้ดยังไม่ล็อก เสนอ JavaScript frontend + Node server เพื่อแยกสองฝั่งชัด ต้องจัดทำตัวอย่างที่ตรวจได้ก่อนนำไปแสดง ไม่อ้างว่ามี source พร้อมใช้แล้ว

## 8. Assets และขั้นต่อไป

### เพิ่มรายละเอียด API walkthrough ตามคลิปผู้ใช้

ต้นทาง: C:/Users/Admin/Videos/Screen Recordings/Screen Recording 2026-11-07 083850.mp4 ความยาวจาก ffprobe 42.5 วินาที ตรวจภาพตัวอย่างทุก 8 วินาทีด้วย FFmpeg แล้ว เห็นหน้าตั้งค่าบัญชี/API การเปิดแผงสร้าง key ตั้งชื่อ เลือกอายุ/สิทธิ์ และกลับสู่รายการ key พร้อมแถบผลการสร้าง ไม่ใช่หลักฐานการเรียก Chat API หรือรับคำตอบจริง ยังไม่ได้ตรวจทุกเฟรมหรือเสียงในคลิป

ลำดับขยาย S04–S06 (เวลาร่าง ปรับหลังลองอ่าน):

| ช่วง | ภาพ | เนื้อหาที่อธิบาย |
|---|---|---|
| เตรียม Agent / 15–25 วินาที | diagram Agent กับ agent_id; ต้องมี footage เพิ่มหรือภาพอธิบายที่กำกับชัด | Agent คือผู้ช่วยที่ตั้งหน้าที่/โมเดลและความพร้อมไว้แล้ว ส่วน agent_id ใช้เลือกผู้ช่วย ไม่ใช่ key |
| สร้าง API key / 35–50 วินาที | ตัดจากคลิปจริงเป็นช่วง เปิดแผง → ชื่อ → อายุ → สิทธิ์ → ผลสร้าง; zoom แผงขวาให้คนดูอ่านได้ | ชื่อตั้งเพื่อจำการใช้งาน อายุคือเวลาที่ key ใช้ได้ สิทธิ์กำหนดงานที่เรียกได้; แชทใช้ chat:invoke และอ่านรายการ Agent เพิ่ม agents:read ตาม snapshot ไม่สอนเลือกสิทธิ์ทั้งหมดตามการคลิกใน footage |
| นำ key ไปใช้ / 15–20 วินาที | จากค่าที่หน้าเว็บไปยัง LANGMIND_API_KEY ใน environment ฝั่ง server ด้วย code-highlight | key ใช้ยืนยันสิทธิ์ เก็บฝั่ง server; การอนุญาตให้ปรากฏในคลิปนี้ไม่เปลี่ยนวิธีเก็บ key ในแอปจริง |
| ทดลอง request / 25–40 วินาที | code-highlight แยก URL, POST, headers, body ทีละจุด | https://langmind.in.th/api/chat/message/blocking, Authorization: Bearer, Content-Type: application/json; agent_id เลือก Agent, query คือคำถาม, conversation_id:null ในตัวอย่างที่ไม่ส่ง user_id เริ่มแชทใหม่ |
| อ่าน response / 15–25 วินาที | response ตัวอย่างกำกับ illustrative แล้วเน้น answer กับ conversation_id | answer ไปเป็นข้อความผู้ช่วย; เก็บ conversation_id สำหรับถามต่อ ไม่แสดงผลจำลองเป็นผล API จริง |
| ต่อ frontend / 25–40 วินาที | ข้อความเดียวกันวิ่ง frontend → route /api/chat ของเรา → LangMind → กลับแชท | frontend ส่งคำถามไป server; server ตรวจ input/สิทธิ์แล้วแนบ key เรียก provider; ข้อผิดพลาดแสดงในแอป ไม่ส่ง secret กลับ browser |
| ถามต่อ / 15–25 วินาที | ส่ง “ขอสั้นลงสำหรับส่งใน LINE” แล้วไฮไลต์ ID เดิม | คง conversation_id เดิม; server ตรวจว่าแชทเป็นของผู้ใช้ก่อนส่งต่อ; ไม่อ้างว่าร่างข้อความคือส่ง LINE จริง |

บทเชื่อมร่าง: “เราต้องเตรียมสองอย่างที่ทำหน้าที่ต่างกันก่อน รหัส Agent ใช้บอกว่าจะให้ผู้ช่วยตัวไหนตอบ ส่วน API key ใช้ยืนยันว่าแอปของเรามีสิทธิ์เรียกใช้งาน จากหน้าตั้งค่านี้ สร้าง key ตั้งชื่อให้จำได้ เลือกอายุและสิทธิ์ที่ต้องใช้ แล้วนำค่าไปเก็บไว้ที่ server ของเรา”

บทอธิบาย request: “เมื่อผู้ใช้กดส่ง server จะส่ง POST ไปที่ endpoint นี้ แนบ key ใน Authorization แล้วส่งรหัส Agent คำถาม และรหัสบทสนทนาใน body พอได้ผลกลับมา เรานำ answer ไปแสดง และเก็บ conversation_id ไว้ใช้ตอนผู้ใช้ถามต่อ”

ตัวอย่าง fetch ที่จะแสดงต้องอยู่ฝั่ง server อ่าน key จาก process.env.LANGMIND_API_KEY และ Agent จาก process.env.LANGMIND_AGENT_ID ตรวจ response.ok ก่อนอ่านผลสำเร็จ ใช้ code-highlight ครั้งละหน้าที่ ไม่โชว์โค้ดเต็มพร้อม narration ทุกบรรทัด ยังไม่อ้าง runnable integration จนสร้างและตรวจตัวอย่างจริง

ใช้คลิปจริงสำหรับขั้นสร้าง key ไม่สร้าง dashboard จำลองแทน ไม่ยึด footage 42.5 วินาทีเป็นเวลาบังคับของบททั้งหมด แยกเสียงพากย์/ซับใหม่ตามจังหวะอธิบาย ส่วน streaming อธิบายต่อภายหลังจาก blocking เข้าใจแล้ว

Verification รอบเพิ่ม: ffprobe อ่าน duration=42.500000; FFmpeg สร้าง contact sheet ทุก 8 วินาที exit code 0 และเปิดดูภาพแล้ว เก็บ contact.jpg ใน evidence/api-walkthrough; ไม่ได้เรียก live API ไม่ยืนยันรายละเอียดตัวเลือกที่อ่านไม่ชัดจากภาพย่อ ก่อนตัดจริงต้องตรวจเฟรมเต็มและตำแหน่งคลิกทุกช่วง

| Asset | สถานะ/การใช้ |
|---|---|
| [โลโก้ต้นฉบับ](../../shared/assets/brand/langmind-logo.png) | ดูภาพจริงแล้ว 7 พ.ย.; ใช้ final hold คงสี/สัดส่วน ไม่แก้ source; SHA-256 025DBB6064076AC724F42009635E715F985A3D2DF8ABFA374A8FCEC398979C49 |
| Catalog source ห้ารายการ | ตรวจ preview แล้ว ยังไม่ติดตั้งในตอน |
| UI สามอุปกรณ์และแชทสอง turn | มี content/layout intent ข้างต้น ยังต้องทำแบบรายภาพ/ขนาด/crop ก่อน sample |
| โค้ด/diagram | ขอบเขตเนื้อหามีแล้ว ยังต้องสร้างตัวอย่าง sanitized และตรวจ contract |
| เสียง/ซับ/เสียงประกอบ | ยังไม่ผลิต; ทำ sample ย่อหน้าต่อเนื่องให้ผู้ใช้ฟังเลือกก่อนเสียงเต็ม |
| robot กลาง | optional ตามหน้าที่ซีน ไม่จำเป็นในฉากท้าย ไม่เปลี่ยน source |

ลำดับต่อไป: บทร่างทั้งตอน → storyboard/แบบหน้าจอช่วง sample → source/asset ที่จำเป็น → sample ไทยและ code readability รวม motion ปิด → ปรับรายละเอียดส่วนที่เหลือ → ผลิตและตรวจตาม Workflow

## 9. Verification ของงานออกแบบรอบนี้

Verification Command: PowerShell regex ตรวจ local Markdown file links + Test-Path และ Get-FileHash -Algorithm SHA256 ของ langmind-api.md กับโลโก้ เทียบ baseline ก่อนแก้

Terminal Result: Documents checked 5; Local file links checked 28; Broken links 0; API snapshot unchanged True; Logo source unchanged True; exit code 0 อ่านทวนลำดับช่วงท้ายและสถานะว่าเป็นแผน ไม่ใช่ผลผลิตที่ตรวจรับแล้ว

ไม่รัน build/render/live API เพราะงานนี้เปลี่ยนแผนและสถานะเอกสาร ยังไม่เปลี่ยน code/config ผลตรวจเอกสารไม่รับรองความอ่านได้ของ composition การออกเสียงหรือ API runtime

Nexus get_state ใช้ได้ แต่ brief และ save_session เฉพาะโปรเจกต์ล้มเหลว projectId validation; ใช้ workspace เป็นหลัก ไม่ใช้ context โปรเจกต์อื่น และไม่ได้บันทึก session สำเร็จ


## หลักฐานปรับแบบ r2 · 7 พฤศจิกายน 2026

แก้ DESIGN/README/PLAN เฉพาะ EP02: หลักคนดู 24–48 ปี, hook/บท/ลำดับข้อความ, key → env → code, แบบไฟล์ตัวอย่าง, สรุปวงจร, ขนาดโค้ด และ Catalog เลือกเพิ่ม Stepper/Spotlight ไม่มี timeline หรือแอปใหม่

Verification Command: Node.js stdin script ใช้ fs/path ตรวจ markdown local links, vm.Script ตรวจ fenced JavaScript, crypto SHA-256 เทียบ API/โลโก้ และตรวจ B01–B16 เรียงครบ

Terminal Result: exit 0; documents=3; localLinks=7; brokenLinks=[]; beats=16; jsSyntaxSnippets=2; apiUnchanged=true; logoUnchanged=true. เป็น syntax/document verification เท่านั้น ไม่มี API runtime, rendered visual, audio หรือ audience testing

Catalog CLI ไม่สำเร็จ ENOTFOUND registry.npmjs.org จึงใช้หน้าเว็บทางการและ browser preview แทน ไม่ติดตั้ง source; preview ที่ไม่แสดงเนื้อหาบันทึกใน DESIGN ไม่อ้างผ่าน motion check Nexus brief/save ใช้ไม่ได้ด้วย projectId validation error จึงใช้ workspace เป็นหลักและไม่ได้บันทึก memory สำเร็จ


## ข้อมูลเพิ่มจากผู้ใช้: Agent ID จาก URL

ผู้ใช้ให้ภาพหน้า Agent และยืนยัน ID a056aef2-3bfb-4564-8166-7abd28849c42 จาก URL https://langmind.in.th/agents/a056aef2-3bfb-4564-8166-7abd28849c42 ปรับ DESIGN B06/K06 ให้เปิด Agent ที่สร้างและคัดลอกเฉพาะรหัสหลัง /agents/ ไป LANGMIND_AGENT_ID ไม่คัดลอกทั้ง URL ไม่ใช่ key/conversation ID; ผู้ชมใช้ Agent ตนเอง ภาพ NECTEC ใช้อธิบายตำแหน่ง ไม่เปลี่ยน use case ร้านค้า GET /agents คงทางเลือกในเอกสาร ไม่บังคับ agents:read ในเส้นหลัก ไม่มีการเปิดบัญชี/เรียก API/ประกอบคลิป


## แก้ขอบเขตล่าสุด: สื่ออธิบาย ไม่สร้างระบบ

ผู้ใช้ยืนยัน key และ Agent ID เดิมใช้ไม่ได้แล้ว ไม่ต้องการแอปจริง ยกเลิกข้อเสนอสร้าง executable example/server/frontend และ mocked provider ทุกส่วนในประวัติ/ prompt ก่อนหน้า DESIGN และ README อัปเดตให้เหลือโค้ดบนภาพ diagram แชทจำลอง และภาพ/คลิปเดิมสำหรับอธิบายขั้นตอน ตรวจได้เพียง syntax/contract และคุณภาพสื่อ ไม่อ้าง runtime ไม่หาหรือทดสอบ key/ID ใหม่

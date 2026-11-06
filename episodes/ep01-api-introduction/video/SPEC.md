> Historical / งานพักไว้ — 6 พ.ย. 2026: เอกสารนี้เก็บแผนหรือหลักฐาน ณ รุ่นเดิม ไม่ใช่คำสั่งผลิตหรือ storyboard ที่อนุมัติสำหรับรอบใหม่ งานปัจจุบันคือรีเซ็ตระบบระดับโปรเจกต์ตาม README.md และแผนหลัก เก็บเนื้อหาเดิมไว้เทียบ ไม่ใช้สถานะ PASS หรือ Next action ด้านล่างรับรองงานใหม่

# EP01 visual specification

GOAL: ผู้ชมเข้าใจว่า API คือข้อตกลงให้ซอฟต์แวร์คุยกัน และ LangMind API เชื่อมความสามารถของ agent/knowledge/voice/analytics กับแอปของเรา

OUTPUT: HyperFrames, 1080 × 1920, master 30 fps; visual animatic 114 วินาที draft encode ที่ 1080 × 1920/15 fps เพื่อดูจังหวะ ยังไม่ใช่ final

DESIGN READ: explainer ภาษาไทยสำหรับผู้สนใจ API ในภาษาภาพสมุดอธิบายกับหน้าจอแอปและตัวละคร; ENERGY 2 / RHYTHM 2 / MOTION 2 กรอบตำแหน่งคงที่เพื่อเป็นซีรีส์ แต่เปลี่ยนวัตถุหลักตามความหมาย (diagram, chat, document, request)

LOOK: พื้น #FFF9ED หมึก #172D35 สีหลัก #007D94 เขียว #426B1F เหลือง #FFD65B เป็นแถบเน้น; ไม่เปลี่ยนสี logo ต้นฉบับ ฟอนต์ Noto Sans Thai จาก google/fonts ภายใต้ OFL เก็บใน assets เพื่ออ่านไทยและ render ซ้ำได้

TYPE: หัวเรื่อง 76 px/1.3, หัวข้อย่อย 50 px, body 42 px/1.55, ป้าย 30 px และ code 30 px; ลดจำนวนคำก่อนลดขนาด ระยะขอบซ้าย 82 ขวา 160, เนื้อหาสำคัญอยู่ y=180..1320; พื้นล่างใช้ตัวละคร/ของตกแต่ง ไม่วางข้อความสำคัญใต้ platform overlay

OBJECTS: หน้าจอเว็บที่ติดป้ายภาพจำลอง, request/response, เอกสาร, waveform เชิงสัญลักษณ์, กราฟไม่แสดงยอดแต่ง, API key placeholder, ตัวละครผู้ช่วยสวมเสื้อ teal ใส่แว่นวงกลม ไม่ใช่คนจริงหรือ mascot ทางการ

COMPONENTS: header strip, browser frame, bubble, request slip, document snippet, capability screen, character prototype หนึ่งท่า (อธิบายด้วยมือ), caption strip, footer chapter indicator. ท่า point/think/wave เป็นงานขยายหลังเลือกแบบตัวละคร ไม่อ้างว่าสร้างแล้ว Chat arrival ปรับหลักการจาก Catalog chat-message โดยใช้สี/ขนาด/ภาษาให้ตรงเนื้อหา

PURPOSE: กระดาษและเส้นบางสื่อสมุดอธิบายตาม reference; กรอบเข้มแยกหน้าจอให้เห็นว่าเป็นตัวอย่าง; เหลืองใช้เน้นคำที่กำลังพูด; ตัวละครชี้ลำดับเหตุผล; โลโก้ยืนยันผลิตภัณฑ์ในฉาก 4/11; สี teal เชื่อมกับสีโลโก้โดยไม่อ้างเป็น official palette

MOTION: enter power2.out 0.5s, send/receive power2.inOut 0.8s, word/part reveal stagger 0.35s, ออกด้วย cut ระหว่างบท; ไม่ loop ลอย/bounce ไม่มี Date.now/random/network ใน composition ความเคลื่อนไหวแต่ละส่วนเกิดเมื่ออธิบายถึงส่วนนั้น

SCREENS: S01 hook, S02 API definition, S03 request/response, S04 LangMind, S05 chat, S06 knowledge, S07 voice, S08 analytics, S09 other APIs, S10 integration/key, S11 recap. รายละเอียดเวลาและบทอยู่ ../script/STORYBOARD.md

BANNED: ข้ออ้างประหยัดเวลา/ราคา/ความแม่นยำที่ไม่มีหลักฐาน, ผลจำลองปลอมเป็น live, citations/เลขหน้าที่แต่งให้เหมือนผลจริง, floating card wall, glow, gradient background, bullet slides ที่ narrator อ่านซ้ำทุกคำ, ข้อมูลลับ และคัดลอกตัวละคร reference

QA: snapshot กลางทุกฉาก, ตรวจต้น/ปลายแต่ละ cut, phone width 360, ไม่มีข้อความล้น/ชน, ตัวละครไม่บัง evidence, ทุกภาพ API example มีป้ายจำลอง, ไม่มีการอ้าง runtime success และดู decoded frames หาก render แล้ว

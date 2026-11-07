# Storyboard และแบบหน้าจอทุกภาพ (Storyboard & Screen Specs) — EP03

Episode ID: `ep03-streaming-chat`  
หัวข้อ: **ตอบทันใจ ไม่ต้องรอโหลด ด้วย Streaming API (SSE)**  
สถานะ: แผน W4 ละเอียด (เตรียมสำหรับผลิต Asset และเสียงตัวแทนใน W5)  
อ้างอิง: [plan/PLAN.md](plan/PLAN.md), [SCRIPT.md](SCRIPT.md), [CATALOG.md](CATALOG.md), [STORYBOARD_GUIDELINES.md](../../docs/STORYBOARD_GUIDELINES.md)

---

## 1. รายละเอียดรายซีน (Scene & Beat Breakdown)

### ซีนที่ 1: ปัญหาของคนรอ (Scene 01: The Waiting Pain)
- **Scene ID:** `SC01-PAIN`
- **เป้าหมาย:** สื่อถึงความรู้สึกกระวนกระวายเมื่อผู้ใช้พิมพ์ถามคำถามยาว แล้วเจอปัญหารอโหลดนาน (Blocking Latency)
- **เวลาโดยประมาณ:** ~15 วินาที
- **Beats:**
  - *Beat 1.1:* ผู้ใช้กดส่งข้อความคำถามในแอปแชท หน้าจอขึ้นสถานะ Loading หมุนวน
  - *Beat 1.2:* เวลาค่อย ๆ นับผ่านไป 1s.. 3s.. 5s.. ข้อความยังไม่โผล่
  - *Beat 1.3:* ตัวละครหุ่นยนต์แสดงท่าทางสงสัยและกระวนกระวายว่าแอปค้างหรือไม่
- **Composition & Focus:**
  - สัดส่วนแนวตั้ง 9:16 (1080×1920)
  - กล่องแชทมือถืออยู่กึ่งกลางเยื้องบน (Safe Area สำหรับมือถือ)
  - จุดสนใจหลักคือวงล้อ Loading และตัวเลขนับเวลาวินาทีที่กระพริบ
  - พื้นที่ด้านล่างเว้นว่าง 25% สำหรับกล่องซับไตเติลฟอนต์ Sarabun
- **Character (หุ่นยนต์):**
  - ไฟล์: `shared/assets/characters/robot/01-question.png`
  - บทบาท: ยืนอยู่มุมล่างขวาของกรอบมือถือ ชะเง้อคอมองหน้าจอด้วยความสงสัย
- **Narration & Subtitle:**
  - บทพากย์: *"เคยเป็นไหมครับ? พิมพ์ถาม AI ไปแล้ว หน้าจอก็หมุนติ้วอยู่นิ่ง ๆ นานหลายวินาที จนเราเริ่มสงสัยว่าแอปค้าง หรือระบบล่มไปแล้วกันแน่... ความจริงระบบไม่ได้ล่มครับ แต่เพราะการเรียก API แบบเดิม เซิร์ฟเวอร์ต้องรอให้คิดคำตอบให้จบครบ 100% ถึงจะยอมส่งข้อมูลกลับมา"*
  - คำเน้นบนจอ: `Loading... (5s)` / `Blocking API = รอจนจบก้อน`
- **Motion:**
  - ตัวหมุน Loading หมุนต่อเนื่อง (`CSS @keyframes spin`)
  - ตัวเลขวินาทีนับขึ้น `00:01` ➜ `00:05`
- **Evidence:** Documented Contract ([langmind-api.md](../../langmind-api.md#L30)) + Illustrative UI
- **Exit & ส่งต่อ:** ป้าย `Blocking API` หรี่ลง เลื่อนกรอบมือถือไปทางซ้ายเพื่อเตรียมเปิดฉากเปรียบเทียบในซีนที่ 2

---

### ซีนที่ 2: เปรียบเทียบ Blocking vs Streaming (Scene 02: The Comparison)
- **Scene ID:** `SC02-COMPARE`
- **เป้าหมาย:** แสดงทางออกด้วย `POST /chat/message` และให้เห็นความต่างชัดเจนของการพิมพ์ทีละคำ
- **เวลาโดยประมาณ:** ~20 วินาที
- **Beats:**
  - *Beat 2.1:* หน้าจอแยกเป็น 2 ฝั่ง (Split Screen) ฝั่งซ้ายคือแบบเดิม (Blocking) ฝั่งขวาคือแบบใหม่ (Streaming)
  - *Beat 2.2:* กดส่งคำถามพร้อมกัน ฝั่งซ้ายยังคงขึ้นจุดหมุนรอ แต่ฝั่งขวาตัวอักษรเริ่มพิมพ์ออกมาทันทีที่วินาทีที่ 1
  - *Beat 2.3:* หุ่นยนต์เปลี่ยนท่าทางเป็นชี้นิ้วชื่นชมฝั่งขวา
- **Composition & Focus:**
  - เลย์เอาต์เปรียบเทียบซ้าย-ขวา (#hf-312 Comparison Split)
  - ด้านซ้าย: การ์ดสีเทาหม่น ป้ายกำกับ `Blocking (รอจบก้อน)`
  - ด้านขวา: การ์ดสีเขียวมิ้นต์สดใส ป้ายกำกับ `Streaming API (SSE)`
  - ตัวหนังสือพิมพ์ดีดวิ่งในฝั่งขวาเป็นจุดดึงสายตาหลัก
- **Character (หุ่นยนต์):**
  - ไฟล์: `shared/assets/characters/robot/05-point-up.png`
  - บทบาท: ยืนตรงกลางเยื้องล่าง ชี้มือไปยังฝั่งขวาเพื่อนำสายตาคนดู
- **Narration & Subtitle:**
  - บทพากย์: *"เพื่อแก้ปัญหานี้ LangMind มีทางออกที่ดีกว่า ด้วย Streaming API ผ่าน Endpoint chat/message ครับ แทนที่จะต้องรอจนจบ ทันทีที่ AI เริ่มคิดคำแรกออก ข้อมูลจะเริ่มทยอยส่งมาที่หน้าจอแอปของเราทันที เหมือนมีคนกำลังนั่งพิมพ์ตอบให้เราอ่านแบบสด ๆ เลยครับ"*
  - คำเน้นบนจอ: `POST /chat/message` / `Real-time Streaming` / `พิมพ์ตอบทันที`
- **Motion:**
  - #hf-312 Comparison Split เผยการ์ดคู่
  - #hf-298 Streaming Text จำลองข้อความทยอยปรากฏทีละคำในฝั่งขวา
- **Evidence:** Documented ([langmind-api.md](../../langmind-api.md#L31)) + Illustrative Comparison
- **Exit & ส่งต่อ:** การ์ดฝั่งซ้ายเลือนหาย ยุบการ์ดฝั่งขวาเข้าไปในแผนภาพท่อส่งข้อมูลในซีนที่ 3

---

### ซีนที่ 3: กลไก 3 Event สำคัญ (Scene 03: Event Stream Anatomy)
- **Scene ID:** `SC03-EVENTS`
- **เป้าหมาย:** ทำความเข้าใจโครงสร้าง Server-Sent Events (SSE) ของ LangMind 3 จังหวะสำคัญ
- **เวลาโดยประมาณ:** ~25 วินาที
- **Beats:**
  - *Beat 3.1:* ปรากฏแผนภาพท่อส่งข้อมูล (Data Stream Pipe) เชื่อมระหว่าง LangMind API กับ Mobile App
  - *Beat 3.2:* แพ็กเก็ตที่ 1 วิ่งผ่านท่อ: `event: message_start` (ส่ง conversation_id / message_id)
  - *Beat 3.3:* แพ็กเก็ตชุดต่อมาวิ่งรัว ๆ ผ่านท่อ: `event: message` (ส่ง chunks ข้อความคำตอบ)
  - *Beat 3.4:* แพ็กเก็ตสุดท้ายวิ่งมาปิดท้าย: `event: message_end` (ยืนยันจบคำตอบ + สรุป Token Usage)
- **Composition & Focus:**
  - โครงสร้างท่อแนวนอนจากขวา (Server) มายังซ้าย (Client)
  - กล่อง Event ปรากฏเป็นบล็อกสีชัดเจนตามลำดับ
  - พื้นที่ซับด้านล่างยังคงตำแหน่งเดิม
- **Character (หุ่นยนต์):**
  - ไฟล์: `shared/assets/characters/robot/20-laptop.png`
  - บทบาท: นั่งเปิดแล็ปท็อปอยู่ที่ฝั่ง Client คอยรับข้อมูลแพ็กเก็ตที่วิ่งเข้ามา
- **Narration & Subtitle:**
  - บทพากย์: *"เบื้องหลังการทำงานนี้ ใช้เทคโนโลยี Server-Sent Events ส่งข้อมูลผ่านท่อเดียว มาเป็น 3 จังหวะสำคัญ เริ่มจาก message_start ยืนยันว่าเริ่มคุย พร้อมส่งไอดีบทสนทนามาให้ ต่อด้วย message ส่งก้อนข้อความคำตอบย่อย ๆ วิ่งเข้ามาทีละท่อน และปิดท้ายด้วย message_end ที่ส่งคำตอบฉบับเต็มและจำนวน Token สรุปมาให้เพื่อบอกว่า คำตอบสมบูรณ์แล้ว"*
  - คำเน้นบนจอ: `1. message_start` ➜ `2. message (chunks)` ➜ `3. message_end (Terminal)`
- **Motion:**
  - กล่องข้อมูลเลื่อนตามท่อแบบ TranslateX จากขวาไปซ้าย
  - เมื่อ `message_end` วิ่งถึงฝั่งซ้าย มีประกาย Success Check เปล่งแสง
- **Evidence:** Documented SSE Contract ใน [langmind-api.md](../../langmind-api.md#L39)
- **Exit & ส่งต่อ:** ท่อข้อมูลคลี่ขยายออก กลายเป็นการ์ดแสดงโค้ดตัวอย่างในซีนที่ 4

---

### ซีนที่ 4: สิ่งที่ Developer ต้องเขียนเพิ่ม (Scene 04: Developer Implementation)
- **Scene ID:** `SC04-DEV`
- **เป้าหมาย:** สรุปหน้าที่ของโค้ดฝั่งแอปพลิเคชัน (SSE Client + UI Buffer)
- **เวลาโดยประมาณ:** ~20 วินาที
- **Beats:**
  - *Beat 4.1:* แสดงหน้าต่าง Code Snippet มินิมอล ชี้ให้เห็นฟังก์ชันดักฟัง Stream
  - *Beat 4.2:* ไฮไลต์บรรทัด `onMessage((chunk) => { text += chunk; })`
  - *Beat 4.3:* หน้าจอแอปด้านข้างจำลองข้อความที่พิมพ์ต่อกันจนครบถ้วน
- **Composition & Focus:**
  - หน้าต่างโค้ดธีมมืดด้านบน (Code Snippet)
  - ตัวอย่างหน้าจอแชทขนาดกะทัดรัดด้านล่าง
  - เส้นลูกศรเชื่อมโยงจากโค้ด chunk วิ่งไปยังฟองคำพูดบนหน้าจอ
- **Character (หุ่นยนต์):**
  - ไฟล์: `shared/assets/characters/robot/39-tiptoe.png`
  - บทบาท: ชี้ปลายเท้าและชี้นิ้วไปยังบรรทัดโค้ดที่ได้รับการไฮไลต์
- **Narration & Subtitle:**
  - บทพากย์: *"ในฝั่งแอปพลิเคชันของคุณ สิ่งที่ต้องทำเพิ่มก็แค่เปิดตัวรับสตรีม และนำชิ้นส่วนข้อความที่เข้ามา ไปทยอยต่อกันบนหน้าจอ ผู้ใช้ก็จะได้ประสบการณ์การใช้งานที่ลื่นไหล ตอบสนองทันใจ ไม่ต้องทนรอหน้าจอว่างเปล่าอีกต่อไปครับ"*
  - คำเน้นบนจอ: `SSE Client / Stream Reader` / `String Buffer ➜ UI State`
- **Motion:**
  - #hf-113 Code Highlight Sweep เลื่อนแถบสีเหลืองอ่อนเน้นบรรทัดรับ chunk
  - ข้อความในฟองคำพูดแชททยอยต่อท้ายสตริงอย่างราบรื่น
- **Evidence:** Documented Architecture + Illustrative Code
- **Exit & ส่งต่อ:** ซูมเอาต์หน้าต่างโค้ดและแอปออก รวมกลายเป็นฉากสรุปโลโก้ในซีนที่ 5

---

### ซีนที่ 5: สรุปและ Call to Action (Scene 05: Wrap-up & Security)
- **Scene ID:** `SC05-OUTRO`
- **เป้าหมาย:** สรุปประโยชน์ ย้ำเตือนการเก็บ API Key ฝั่งเซิร์ฟเวอร์ และปิดท้ายคลิป
- **เวลาโดยประมาณ:** ~15 วินาที
- **Beats:**
  - *Beat 5.1:* โลโก้ LangMind ปรากฏตรงกลางพร้อมป้ายสโลแกน
  - *Beat 5.2:* กล่องข้อความเตือนความปลอดภัย: *"เก็บ API Key ไว้ที่ Server เสมอ"*
  - *Beat 5.3:* หุ่นยนต์ยกนิ้วโป้งเยี่ยม โบกมือทักทายผู้ชม
- **Composition & Focus:**
  - โลโก้ LangMind เด่นกลางจอ (ดึงจาก `shared/assets/brand/`)
  - การ์ดเตือนความปลอดภัยสีอำพันด้านล่าง
  - หุ่นยนต์ยืนเคียงข้างโลโก้อย่างเป็นมิตร
- **Character (หุ่นยนต์):**
  - ไฟล์: `shared/assets/characters/robot/10-thumbs-up.png`
  - บทบาท: ยืนยิ้มยกนิ้วโป้งแสดงความมั่นใจ
- **Narration & Subtitle:**
  - บทพากย์: *"แค่เปลี่ยนมาใช้ Streaming API บน LangMind แชทบอทของคุณก็ดูเป็นมืออาชีพขึ้นทันที และอย่าลืมเก็บ API Key ไว้ที่ฝั่ง Server เสมอนะครับ ลองนำไปปรับใช้กับโปรเจกต์ของคุณดู แล้วพบกันใหม่ในตอนต่อไป สวัสดีครับ"*
  - คำเน้นบนจอ: `https://langmind.in.th` / `Keep API Key on Server!`
- **Motion:**
  - โลโก้เฟดขยายเบา ๆ แบบนุ่มนวล
  - การ์ดเตือนความปลอดภัยป๊อปอัปขึ้นมา
- **Evidence:** Documented Security Rule ([langmind-api.md](../../langmind-api.md#L20))
- **Exit & ส่งต่อ:** จบตอน เฟดดำนุ่มนวล

---

## 2. แบบหน้าจอทุกภาพก่อนเจน (Screen Specs Matrix)

ตามข้อกำหนด [STORYBOARD_GUIDELINES.md](../../docs/STORYBOARD_GUIDELINES.md) ทุกภาพหน้าจอที่จะถูกนำไปเจนเป็นภาพ Raster UI จะต้องมีสเปกที่ชัดเจน:

### Screen Spec 1: หน้าจอแชทสถานะรอโหลด (Screen ID: `SCR-01-CHAT-LOADING`)
- **การใช้งานในคลิป:** ซีนที่ 1 (Beat 1.1 – 1.3) และด้านซ้ายของซีนที่ 2
- **วัตถุประสงค์:** แสดงภาพแอปแชทบนมือถือที่มีคำถามส่งไปแล้ว แต่คำตอบยังไม่มา มีเพียงสถานะ Loading ค้างอยู่
- **เนื้อหาข้อความภาษาไทยจริง:**
  - ชื่อหัวแอป: `ผู้ช่วย AI ร้านค้า (ภาพจำลอง)`
  - ฟองคำพูดผู้ใช้ (สีเขียวอ่อนขวาบน): *"สวัสดีครับ อยากสอบถามเงื่อนไขการรับประกันสินค้าหน่อยครับ"*
  - กล่องฝั่งผู้ช่วย (สีขาวซ้าย): แสดงตัวหมุน Loading พร้อมข้อความ *"กำลังคิดคำตอบ..."* และตัวเลขนับเวลา `00:05`
  - ป้ายกำกับมุมล่าง: `[ภาพจำลองระบบ Blocking]`
- **Layout:** กรอบสมาร์ตโฟนแนวตั้ง ขอบโค้งมน พื้นหลังแชทสีเทาอ่อน `#F8FAFC`
- **สถานะ:** `Waiting / Loading State` (ยังไม่มีข้อความคำตอบโผล่มา)
- **Continuity:** ฟอนต์หัวข้อและฟองคำพูดผู้ใช้ต้องคงที่เหมือนกับ `SCR-02` ทุกประการ (Geometry และคู่สีเดียวกัน)
- **ขนาดและ Framing:** สัดส่วนการ์ด 9:16 ขนาดต้นทาง 1080×1920 (เมื่อวางในวิดีโอจะสเกลเหลือ 45%–70% ของกรอบ)
- **Layer & Separation:**
  - Raster พื้นหลัง + ข้อความคำถามผู้ใช้
  - แยกชิ้นส่วน: ตัวหมุน Loading และตัวเลขวินาทีจะใช้ CSS ขยับทับบนตำแหน่งที่เว้นว่างไว้
- **Prompt สำหรับเจนใน W5:**
  > Modern clean mobile chat app UI mockup, iOS style, light mode, vertical 9:16 layout. Header displays "AI Assistant". User message bubble on the right says Thai text. On the left assistant area, there is an empty placeholder card ready for loading indicator. Neutral slate-100 background, pastel green user bubble, high resolution, minimalist UI design.

---

### Screen Spec 2: หน้าจอแชทกำลังสตรีมพิมพ์ตอบสด (Screen ID: `SCR-02-CHAT-STREAMING`)
- **การใช้งานในคลิป:** ด้านขวาของซีนที่ 2 (Beat 2.2) และซีนที่ 4
- **วัตถุประสงค์:** แสดงภาพแอปแชทเดียวกัน แต่ฝั่ง AI กำลังพิมพ์คำตอบวิ่งออกมาทีละคำอย่างต่อเนื่อง
- **เนื้อหาข้อความภาษาไทยจริง:**
  - ชื่อหัวแอป: `ผู้ช่วย AI ร้านค้า (ภาพจำลอง)`
  - ฟองคำพูดผู้ใช้: *"สวัสดีครับ อยากสอบถามเงื่อนไขการรับประกันสินค้าหน่อยครับ"* (เหมือน `SCR-01` 100%)
  - ฟองคำพูดผู้ช่วย (กำลังพิมพ์): *"สินค้ารับประกัน 1 ปีเต็มครับ ครอบคลุมความเสียหายจากการใช้งานปกติ..."* พร้อมเคอร์เซอร์กระพริบ `|`
  - ป้ายกำกับมุมล่าง: `[ภาพจำลองระบบ Streaming SSE]`
- **Layout:** กรอบสมาร์ตโฟนเดียวกับ `SCR-01` แบบ 1:1 เพื่อให้เปรียบเทียบกันได้ชัดเจน
- **สถานะ:** `Streaming State` (ข้อความโผล่มาแล้ว 50% และกำลังพิมพ์ต่อ)
- **Continuity:** กรอบนอก ขนาดฟอนต์ สีฟองคำพูด ต้องตรงกับ `SCR-01` ห้ามคลาดเคลื่อน
- **ขนาดและ Framing:** 1080×1920 อัตราส่วน 9:16
- **Layer & Separation:**
  - กล่องฟองคำพูด AI จะเป็นตัวอักษร HTML ที่ควบคุมผ่าน HyperFrames เพื่อให้พิมพ์ทีละคำได้จริง ไม่ฝังตัวอักษรตายตัวในภาพ Raster
- **Prompt สำหรับเจนใน W5:**
  > Identical mobile chat UI as SCR-01, same dimensions and colors. User bubble at top right is exactly identical. Assistant area on the left has an open white message container with subtle border, ready to receive dynamic streaming text. Pixel-perfect continuity with SCR-01.

---

### Screen Spec 3: แผนผังท่อส่งข้อมูล 3 Events (Screen ID: `SCR-03-SSE-DIAGRAM`)
- **การใช้งานในคลิป:** ซีนที่ 3 (Beat 3.1 – 3.4)
- **วัตถุประสงค์:** แสดงแผนภาพการไหลของข้อมูล Server-Sent Events จากฝั่ง LangMind สู่ Mobile App
- **เนื้อหาข้อความจริง:**
  - ฝั่งขวา (Server Box): `LangMind API Server (/chat/message)`
  - ท่อเชื่อมตรงกลาง (Data Pipe): `HTTP SSE Stream (Persistent Connection)`
  - ก้อนข้อมูลที่ลอยในท่อ:
    - ก้อนที่ 1 (สีน้ำเงิน): `event: message_start` (ID ข้อมูล)
    - ก้อนที่ 2 (สีเขียว): `event: message` ("สินค้า...")
    - ก้อนที่ 3 (สีเขียว): `event: message` ("รับประกัน...")
    - ก้อนที่ 4 (สีม่วง): `event: message_end` (จบคำตอบ + Usage)
  - ฝั่งซ้าย (Client Box): `Client App (Stream Buffer)`
- **Layout:** ไดอะแกรมแนวนอนโมเดิร์น กราฟิกทรงการ์ดมินิมอล พื้นหลังสีเข้มโปร่งแสง
- **สถานะ:** `Animated Flow State`
- **Continuity:** การ์ดทั้ง 3 สีจะสอดคล้องกับสี Badge ในซับไตเติล
- **Layer & Separation:** บล็อกโครงสร้างท่อเป็นพื้นหลัง ส่วนก้อน Event ทั้ง 4 ก้อนแยกเป็นชิ้นขยับได้ใน HTML

---

### Screen Spec 4: หน้าต่างโค้ดจำลองฝั่ง Developer (Screen ID: `SCR-04-CODE-SNIPPET`)
- **การใช้งานในคลิป:** ซีนที่ 4 (Beat 4.1 – 4.2)
- **วัตถุประสงค์:** แสดงตัวอย่างโค้ดมินิมอลที่เข้าใจง่ายในการดักรับสตรีม
- **เนื้อหาโค้ดจำลอง (Sanitized Example):**
  ```javascript
  // ยิงคำขอแบบ Streaming
  const response = await fetch('/api/chat/message', {
    method: 'POST',
    body: JSON.stringify({ query: userQuestion })
  });

  // ดักรับชิ้นส่วนข้อความมาแสดงผลทันที
  reader.on('message', (chunk) => {
    chatUI.append(chunk.text); // อัปเดตหน้าจอทันที!
  });
  ```
- **Layout:** การ์ดหน้าต่าง Code Editor ธีมมืด สไตล์ Dark Modern ขอบมน มีจุดไฟ Mac 3 สีที่มุมซ้ายบน
- **สถานะ:** มีแถบไฮไลต์สีเหลืองโปร่งแสงพาดบนบล็อก `chatUI.append(chunk.text)`
- **ขนาดและ Framing:** กว้าง 900px จัดกึ่งกลางจอแนวตั้ง ฟอนต์โค้ดขนาดใหญ่ คมชัด อ่านออกบนจอมือถือ

---

## 3. รายการ Asset ทั้งหมดที่ต้องเตรียมใน W5 (Asset Manifest)

| Asset ID | ชนิดไฟล์ | ที่มา / วิธีทำ | การนำไปใช้ในคลิป |
|---|---|---|---|
| `img-screen-loading` | Raster PNG | เจนภาพตามสเปก `SCR-01` | หน้าจอแชทกำลังโหลด (ซีน 1 และซีน 2 ฝั่งซ้าย) |
| `img-screen-streaming` | Raster PNG | เจนภาพตามสเปก `SCR-02` | หน้าจอแชทสำหรับสตรีม (ซีน 2 ฝั่งขวา และซีน 4) |
| `img-diagram-pipe` | SVG / Raster | วาดตามสเปก `SCR-03` | โครงสร้างท่อส่ง Event Stream (ซีน 3) |
| `robot-question` | PNG ต้นฉบับ | `shared/assets/characters/robot/01-question.png` | หุ่นยนต์สงสัยในซีนที่ 1 |
| `robot-point-up` | PNG ต้นฉบับ | `shared/assets/characters/robot/05-point-up.png` | หุ่นยนต์ชี้นำสายตาในซีนที่ 2 |
| `robot-laptop` | PNG ต้นฉบับ | `shared/assets/characters/robot/20-laptop.png` | หุ่นยนต์นั่งรับข้อมูลในซีนที่ 3 |
| `robot-tiptoe` | PNG ต้นฉบับ | `shared/assets/characters/robot/39-tiptoe.png` | หุ่นยนต์ชี้โค้ดในซีนที่ 4 |
| `robot-thumbs-up` | PNG ต้นฉบับ | `shared/assets/characters/robot/10-thumbs-up.png` | หุ่นยนต์ยกนิ้วสรุปในซีนที่ 5 |
| `brand-logo` | SVG / PNG | `shared/assets/brand/` | โลโก้ LangMind ในซีนที่ 5 |
| `audio-audition-sample` | MP3 | สร้างเสียงทดลองผ่าน Voice Studio | ย่อหน้าตัวแทนสำหรับฟังคัดเลือกเสียงพากย์ใน W5 |

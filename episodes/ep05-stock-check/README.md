# EP05 — ลูกค้าถาม ของมีไหม? ให้ AI เช็กให้

ข้อมูลสมมติ ร้านเสื้อ คำถามเดียว “เสื้อสีดำ ไซซ์ M ยังมีไหม?”
ตารางตัวอย่างมี ดำ / S / 2, ดำ / M / 3, ขาว / M / 5 คำตอบ “สีดำ ไซซ์ M มี 3 ตัวค่ะ”
ความสามารถอ้างอิง https://langmind.in.th/features ส่วน Custom Tools / OpenAPI ระบบร้านต้องมีเครื่องมือหรือ API ที่เตรียมไว้

ลำดับภาพ คำถาม → LangMind เรียกเครื่องมือ → ระบบร้านคืนข้อมูล → แอปแสดงคำตอบ
ภาพร่าง 3 ช่องแนวนอน แต่ละช่องเป็น raster 4:5
ช่องแรกเป็น UI คำถาม พื้นขาว เขียวอ่อน หัว “ถามร้าน” กล่องคำถาม และสถานะ “ส่งคำถามแล้ว”
ช่องกลางเป็นตารางข้อมูลร้าน หัว “สต็อกตัวอย่าง” คอลัมน์ “สี / ไซซ์ / จำนวน” และสามแถวข้างต้น ไฮไลต์แถว ดำ M 3
ช่องท้ายเป็น UI เดียวกับช่องแรก เพิ่มกล่องคำตอบเท่านั้น
ป้ายภาพจำลองอยู่ภายนอก raster ตลอดเวลา ครอปแต่ละช่องเพื่อแสดงกว้าง 864 px บนจอ 1080×1920
HTML ทำกรอบภาพ diagram ป้ายชื่อและซับ ภาพแชทกับตารางทั้งหมดอยู่ใน raster
## Prompt ภาพที่ใช้จริง

Create ONE wide flat storyboard image, landscape aspect ratio 12:5, containing THREE equal-width portrait panels touching edge to edge with NO gutters. Each panel is a clean Thai app screenshot 4:5 with near-white background, dark very large Thai typography, pale sage accents. All text exact. Panel 1: header 'ถามร้าน', pale green question bubble 'เสื้อสีดำ ไซซ์ M ยังมีไหม?', status 'ส่งคำถามแล้ว', empty bottom. Panel 2: header 'สต็อกตัวอย่าง', a legible three column table with headers 'สี' 'ไซซ์' 'จำนวน', rows 'ดำ' 'S' '2', 'ดำ' 'M' '3', 'ขาว' 'M' '5'. Highlight ONLY the middle row in pale green. Panel 3: same exact layout header and question as panel 1, status 'ได้รับคำตอบแล้ว', and additional answer bubble 'สีดำ ไซซ์ M มี 3 ตัวค่ะ'. Preserve same UI typography and geometry for panels 1 and 3. No other words, icons, browser frames, badges, citations, logos or decoration. Flat full bleed rectangular screenshots only. All Thai words must be accurate and prominent.

Built-in ImageGen ผล exec-e7df1956-63d5-4b0b-88dc-b781fae0b946.png ไม่มี reference inputs ตรวจภาพจริงและอ่านคำไทยครบแล้ว นำเข้า assets/screens.png ใช้ครอปสามช่องจากไฟล์เดียว
เสียงร่าง Edge TTS th-TH-NiwatNeural rate -4% เวลาแต่ละวลีวัดจาก PCM 24 kHz mono บวกพัก 1.1 วินาที ตาม timing.json
ใช้ raster รวมทั้งแชทและตาราง ส่วน HTML ทำกรอบ ป้าย connector และซับ ใช้กรอบภาพจากรูปแบบ EP02 และกลไก seek/render จาก EP01

## ผลตรวจ sample v1

ไฟล์ ep05-stock-sample.mp4 ยาว 31.71 วินาที H.264 1080×1920 30 fps เสียง AAC mono 24 kHz
คำสั่งตรวจ ffmpeg -hide_banner -i ep05-stock-sample.mp4 -af volumedetect -f null NUL
Terminal result ถอดรหัสครบ 951 เฟรม peak −3.8 dBFS
Visual ตรวจเฟรม MP4 ที่ 2,10,16,23,28 วินาทีด้วยภาพจริงที่ 360×640 คำถาม ตาราง และคำตอบอ่านได้ ป้ายภาพจำลองอยู่ทุกฉาก
Storytelling เป็นการประเมินโดย agent ลำดับคำตอบอยู่หลังฉากระบบร้านคืนข้อมูล ยังไม่มีผลทดสอบผู้ชมจริง
Audio มีเสียงร่างที่วัดเวลาจริง และยังไม่ได้ฟังทวนการออกเสียงหรือทดสอบเวลาอ่านซับกับผู้ชม
ใช้ Edge + FFmpeg จับภาพจาก HyperFrames paused timeline ตามวิธี sample ที่มีใน repo
ไฟล์ที่เพิ่มอยู่ในโฟลเดอร์ EP05 มีบท/แบบ/ผลตรวจ README, timing.json, index.html, assets, MP4 และ preview.jpg

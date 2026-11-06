# Asset ledger · B04–B05 draft v1

| ไฟล์ | ต้นทางและการใช้ |
|---|---|
| app-q-v1.png | Built-in ImageGen generate, exec-bb219748-fe0c-4e9d-8106-cc714ddd523f.png, ไม่มีภาพอ้างอิง |
| app-a-v1.png | Built-in ImageGen edit, exec-ab384518-b637-4401-bc11-446d54300952.png, reference เดียวคือ APP-Q ที่ตรวจภาพเต็มแล้ว |
| 05-point-up.png | shared/assets/characters/robot/05-point-up.png, 445×436 RGBA alpha 0–255, วางกว้าง 389 px และไม่กลับด้าน |
| langmind-logo.png | shared/assets/brand/langmind-logo.png, 689×606 RGBA alpha 0–255, วางกว้าง 349 px คงสัดส่วน |
| NotoSansThai.ttf | Google Fonts / ofl/notosansthai, SIL OFL ตามไฟล์ที่บันเดิล |
| gsap.min.js | GSAP 3.14.2, สำเนา local ตามเวอร์ชันที่ hw-pipeline อ้างในซอร์ส |
| vo-draft.wav | Edge TTS 7.3.1, th-TH-NiwatNeural, -6%, 24 kHz mono PCM, แยกวลีตาม voice-timing.json เว้นช่วงพักหลังวลี ไม่มีดนตรี |

ImageGen built-in ไม่ส่งคืนชื่อโมเดลในผล จึงระบุรุ่นงานและ ID ไฟล์แทน ทั้งคู่ 1122×1402 RGB ใกล้ 4:5 ใช้ขนาด native โดยแสดงกว้าง 864 px ป้ายบริการออกมาเป็นสีเขียวและกรอบจริงคลาดพิกัดร่างเล็กน้อย ใช้กับ draft เพราะห้าข้อความของ Q และสองจุดเปลี่ยนใน A อ่านได้ที่ขนาดมือถือ หัวเรื่อง ป้ายบริการ กล่องคำถาม และป้ายจำลองอยู่ที่เดิมโดยการดูภาพคู่ ส่วนพิกเซลพื้น/ขอบอาจเปลี่ยนจากการ edit แบบ generative ไม่รับรอง pixel identity. APP-A ขยาย 1.178× เฉพาะช่วงคำตอบ พร้อมป้ายภาพจำลองด้านนอก.

## Prompt APP-Q

Create APP-Q v1 as a flat edge-to-edge Thai app UI raster, portrait 4:5 target 1440×1800, no device chrome or perspective. Near-white background, dark ink, pale sage green question bubble only, typography very legible at mobile scale, no icons or decoration. Use this exact text with Thai marks intact, no other text: header at x .08 y .06 ‘ถามผู้ช่วย’; service pill at x .08 y .17 ‘บริการปรึกษาออนไลน์’; question in pale green bubble from x .10 to .90 y .30 to .43 ‘เริ่มใช้บริการต้องเตรียมอะไร?’; status at x .10 y .48 ‘ส่งคำถามแล้ว’; leave y .57–.78 entirely blank for an answer; at x .10 y .86 a high contrast small pill ‘ภาพจำลอง’. Use generous Thai text sizes and quiet flat layout, no answer, logo, gradients, avatar, citation, badges, times, prices or buttons. Raster fills the whole canvas. Thai spelling is essential.

## Prompt APP-A

Edit this exact APP-Q Thai UI image into APP-A. Preserve the exact image aspect ratio, pixel positions, typography, colors and text everywhere outside the middle status and previously blank answer area. In the same status location replace ‘ส่งคำถามแล้ว’ with exactly ‘ได้รับคำตอบแล้ว’. Below it, within x .10 to .90 and y .57 to .78, add a single understated pale gray-green rounded response box with dark Thai text, exactly ‘เตรียมอีเมลและหัวข้อที่อยากปรึกษา’, wrapped after ‘และ’ if needed. Keep the existing header ‘ถามผู้ช่วย’, service tag ‘บริการปรึกษาออนไลน์’, original question ‘เริ่มใช้บริการต้องเตรียมอะไร?’ and bottom ‘ภาพจำลอง’ badge untouched. No new labels, icons, decoration, or UI. Exact Thai orthography is essential.

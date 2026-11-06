# ผลตรวจ B04–B05 · draft v1

[MP4](../ep01-b04-b05-draft-v1.mp4) · [เฟรมจากไฟล์ส่งมอบขนาดมือถือ](mobile-frames.jpg) · [ที่มาและ prompt](ASSETS-v1.md) · [Asset SHA-256](asset-sha256-v1.txt)

## ผลแยกตามด้าน

| ด้าน | สิ่งที่ตรวจและผล |
|---|---|
| Technical | Studio ตอบ 200 และเปิดใน Edge headless ได้ จับเฟรมด้วย HyperFrames ได้ 10 จุด ตรวจ seek สองทิศทางตรงกัน 9 จุด โหลดฟอนต์ Thai จริง ไม่มีไฟล์ภาพเสียหรือ request ออกนอกเครื่องในฉาก FFmpeg ถอดรหัส MP4 ได้ครบ 995 เฟรมพร้อมเสียง ส่วน HyperFrames check ออก 1 เพราะเครื่องขาด ffprobe |
| Visual | ดูภาพเต็มคู่ APP-Q/APP-A ก่อนประกอบ และตรวจเฟรม MP4 ที่ 360×640 ตามภาพประกอบ คำถามเดิมและคำตอบอ่านได้ในเฟรมเต็ม ครอปคำตอบไม่ตัดข้อความและคงป้ายภาพจำลองด้านนอก โลโก้และ robot ใช้เฉพาะตอนเปิด ไม่ทับข้อมูล ซับอยู่ใต้กรอบจอและ diagram |
| Storytelling | ประเมินจากภาพโดย agent เห็นขาไปจากหน้าจอผ่านระบบแอปถึง LangMind แล้วเห็นข้อมูลขากลับก่อน APP-A วลีสรุปแยกหน้าจอ/การเชื่อมต่อของแอปจากบริการผู้ช่วย AI การยืนยันว่าผู้ชมใหม่เข้าใจและการประเมินจังหวะขณะฟังพร้อมภาพยังค้าง |
| Audio | เสียงสังเคราะห์จริง 33.16 วินาทีรวมพัก ซับ 7 ช่วงอิงความยาว PCM รายวลี ใน MP4 พบ AAC mono 24 kHz ไม่มีเพลง Peak −3.6 dBFS ยังต้องฟังทวนคุณภาพเสียง การออกเสียง LangMind/API และเวลาที่คนอ่านซับทัน |

ตรวจคำกล่าวกับ [snapshot LangMind ส่วนต้นฉบับครบทุกหมวด](../../../../langmind-api.md#ต้นฉบับครบทุกหมวด) ในหมวดสิทธิ์ chat:invoke และการสนทนา ใช้เป็นหลักฐานว่าเรียกผู้ช่วยและรับผลได้ ส่วนการเชื่อมผ่านระบบของแอปเป็นแบบวางระบบของคลิป ตัวอย่างคำตอบเป็นข้อความสมมติจากบท

## Verification command และผลจริง

| คำสั่ง | Terminal result |
|---|---|
| `npx hyperframes catalog --query "hand drawn flowchart" --json` และ `npx hyperframes add` สำหรับสองรายการ | พบ hw-pipeline, add ทั้งคู่ `ok:true` |
| `npx hyperframes preview --background --port 4101` และเปิด Studio ผ่าน Puppeteer | `Studio HTTP 200 HyperFrames Studio` |
| `npx hyperframes lint` | `0 error(s), 3 warning(s)` เรื่อง nested structure ใน sample เดียว |
| `npx hyperframes snapshot --at 0,2,7,12.8,16,17.5,18.1,19.5,22.2,30 --no-end --output evidence/frames` | `Fonts: 1 loaded`, `10 snapshots saved` |
| `npx hyperframes check --at 2,7,12.8,16,17.5,18.1,19.5,22.2,30 --max-transition-samples 0 --json` | exit 1, runtime/layout/motion/contrast มี 0 errors, audio มี 1 error `ffprobe not found` กฎ connector_orphan เตือน 3 และ info 1 จากการจับคู่ endpoint ของ SVG ที่เฟรมจริงมีกรอบครบ ช่วงนิ่งเพื่ออ่านขึ้น craft warning 3 |
| `node evidence/verify-seek.cjs <puppeteer-core>` กับ Studio 4101 และ local HTTP 4102 | `Seek states match in both orders at 9 times; return completed before APP-A; Thai loaded; external requests 0; broken assets 0; duration 33.167` |
| `npx hyperframes render --quality looks -o ep01-b04-b05-draft-v1.mp4` | สองครั้งรอ Chrome Headless Shell install lock เกิน 100 วินาทีแล้วหยุด จึงเปลี่ยนวิธี export |
| `node evidence/render-local.cjs <puppeteer-core> <Edge> <ffmpeg> ep01-b04-b05-draft-v1.mp4` | `Wrote 995 frames at 30 fps to ep01-b04-b05-draft-v1.mp4` จาก paused timeline เดิม ใช้ HTTP เฉพาะ loopback |
| `ffmpeg -hide_banner -i ep01-b04-b05-draft-v1.mp4 -af volumedetect -f null NUL` | `Duration: 00:00:33.17`, H.264 1080×1920 30 fps, AAC mono, `frame=995`, `mean_volume: -22.7 dB`, `max_volume: -3.6 dB` |
| `Get-FileHash` คู่มือและสำเนาสื่อ | คู่มือ SHA-256 `DDDBE02F30EC0215E98CB515A3D3374A85F754298163ED84F21FACC6E9164A2C` ตรง baseline, robot และ logo ตรง shared ทั้งคู่ |

MP4 ขนาด 1,386,081 ไบต์ · SHA-256 `D8FB5ED1BF726D0954E589B02F5A929B614FD8D666CC6CD1404C79329B7480EF`

## ก่อนผลิตเต็ม

- การคงกรอบและตำแหน่งภาพทำให้การเปลี่ยนสถานะเห็นได้ชัด ส่วนครอปขยายคำตอบช่วยให้อ่านง่ายขึ้นที่ 360×640 ข้อความคำถามอ่านได้ในภาพเต็ม จึงเว้นการครอปคำถามใน timeline
- ลองให้ผู้ชมใหม่ดูพร้อม B01–B03 เพื่อทดสอบว่าคำอธิบาย API มาก่อนศัพท์ในช่วง sample และให้เล่าว่าใครส่งคำถาม ใครให้ผู้ช่วย และใครแสดงผล
- ฟังทวนเสียงร่างพร้อมภาพและซับบนมือถือ ก่อนล็อกระยะถือภาพรวมและตัดสินใจขยายทั้งตอน เวลาบทเต็มยังเป็นประมาณการ
- หากต้องใช้ native CLI export ให้แก้การจัดหา Chrome Headless Shell และ ffprobe ของเครื่อง แล้วตรวจ native render เทียบกับ draft นี้

ทำงานจาก clone ที่ `D:/New folder/LangMine-API-VDO` เพราะ workspace เดิมในไฟล์แนบไม่มีบนเครื่องนี้ รอบนี้ไม่พบ Apex-core, Nexus หรือ antislop ในเครื่องมือและตำแหน่ง skills ที่เข้าถึงได้ จึงใช้กติกาและหลักฐานใน repo และไม่มี Nexus session ที่บันทึกสำเร็จ

> สถานะ 6 พ.ย. 2026: คู่มือเครื่องมือกลาง ใช้หลักการจาก EP01 ตาม Workflow และคำสั่งล่าสุด โหมด antislop ยึดคำสั่ง session หรือ preference ที่ใช้ได้

# Skills ที่ใช้ในโปรเจกต์

เอกสารนี้เป็นรายการติดตั้งและตรวจความพร้อม กติกาการทำงานอยู่ใน [AGENTS.md](../AGENTS.md) ส่วนทิศทางภาพอยู่ใน [Video style guide](VIDEO_STYLE_GUIDE.md) ใช้ skills ชุดกลางร่วมกันทุก episode ไม่ติดตั้งซ้ำในโฟลเดอร์คลิป

## ชุดหลักสำหรับผลิตวิดีโอ (LangMind API Video Standard)

### สกิลหลักประจำโปรเจกต์ (Core Production Skill)
| Skill | หน้าที่ / ขอบเขต | ความจำเป็น |
|---|---|---|
| [langmind-video-producer](../.agents/skills/langmind-video-producer/SKILL.md) | พิมพ์เขียวผลิตวิดีโออธิบาย LangMind API แนวตั้ง (1080×1920 30fps) ตามมาตรฐาน EP04-EP11 ครบวงจร (โครงเรื่อง 9 Beat, ธีม Editorial Paper & Sage Ink, โค้ด build.mjs อัตโนมัติ, ระบบ Silent Draft และเสียง Edge TTS) | **แกนหลักสูงสุด (Primary)** สำหรับทุก Episode |

### สกิลสนับสนุนระบบ HyperFrames
ติดตั้งจาก `heygen-com/hyperframes` ระดับ workspace ที่ `.agents/skills/` ครบ 9 ตัวแล้ว รายการและ source hashes อยู่ใน [skills-lock.json](../skills-lock.json)

| Skill | ใช้เมื่อ | ความจำเป็น |
|---|---|---|
| hyperframes | สร้าง/แก้ composition และตรวจ render contract | รองรับการทำงานภายใน |
| hyperframes-cli | Init, check, preview และ render ผ่าน CLI | เครื่องมือตรวจและ Render |
| hyperframes-registry | เลือก Catalog blocks/components ก่อนสร้างเอฟเฟกต์เอง | ค้นหาไอเดีย Motion |
| media-use | เตรียมภาพ เสียง คำบรรยาย และ media | เตรียมสื่อและฟอนต์ |
| style-sampling | ทำตอนใหม่โดยใช้แนวภาพที่กำหนด | เสริมตามโจทย์ |
| figma | นำ design จาก Figma มาใช้ | เสริม ยังไม่มี Figma input |
| remotion-to-hyperframes | ย้ายวิดีโอจาก framework อื่น | เสริม ไม่ได้ใช้งานหลัก |
| reverse-any-video | วิเคราะห์และสร้างวิดีโออ้างอิงกลับเป็น project | เสริม ไม่ใช่คำอนุญาตคัดลอกสื่อของผู้อื่น |
| slideshow | ทำ presentation แบบนำเสนอสด | เสริม ไม่ใช่งานคลิปวิดีโอ |

## ชุด antislop

มีครบทั้ง 6 ตัวระดับเครื่องที่ `C:/Users/Admin/.codex/skills/` แล้ว ไม่คัดลอกซ้ำเข้าแต่ละคลิป เครื่องใหม่ต้องติดตั้งชุดนี้หรือมีให้ค้นพบใน skill catalog ก่อนเริ่มงานที่เกี่ยวข้อง

| Skill | ใช้กับ |
|---|---|
| antislop | ตัวกรองหลักสำหรับงาน UI ตามขอบเขตของ skill |
| antislop-ui | ลำดับความสำคัญ สี องค์ประกอบ และความเรียบร้อยของ UI |
| antislop-human | Accessibility, contrast, focus และการใช้งานจริง |
| antislop-layoutmobile | การ reflow และการอ่าน/ใช้งานบนมือถือ |
| antislop-copywriting | ข้อความบน UI หัวข้อ และคำอธิบาย |
| antislop-code | ตรวจ comment hygiene เมื่อมี source code |

ผู้ใช้เลือก During ใน session ติดตั้งนี้ ไม่ได้บันทึก global default การเริ่ม session ใหม่ให้ resolve โหมดตาม SKILL.md ของ antislop ไม่สมมติว่า setting ระดับเครื่องถูกเปลี่ยนแล้ว ใช้เกณฑ์ interactive UI กับ demo และตรวจวิดีโอตามลักษณะสื่อ ไม่เพิ่มปุ่มใน MP4 เพื่อผ่านเกณฑ์ UI

## เครื่องมือประกอบที่มีอยู่แล้ว

- Apex-core: มีจาก personal plugin ใช้ตาม AGENTS กับงาน engineering ไม่ใช่ package ที่ต้องติดตั้งซ้ำในทุก episode
- skill-installer: system skill สำหรับช่วยจัดการ skills มีอยู่แล้ว
- imagegen: ใช้เฉพาะเมื่อสั่งสร้าง/แก้ raster assets; ไม่ต้องติดตั้งเพิ่มตอนนี้ โลโก้ใช้ไฟล์ที่ผู้ใช้ให้
- Nexus: เป็น memory connector ไม่ใช่ local skill และไม่ใช่ prerequisite ที่ต้องทำให้ผ่านก่อนทำงานจาก workspace

## ติดตั้งในเครื่องใหม่

รันจาก **workspace root** ไม่ใช่ `episodes/<id>/video/` หรือ `demo/` ตรวจ existing skills ก่อนติดตั้งเพื่อไม่ทับชุดเดิมโดยไม่จำเป็น

HyperFrames ครบชุด เฉพาะ Codex (คำสั่งที่ใช้สำเร็จใน workspace นี้):

```powershell
npx --yes skills add heygen-com/hyperframes --skill '*' --agent codex --yes
```

สำหรับ antislop บนเครื่องที่ยังไม่มี ตัวอย่างคำสั่งติดตั้งจาก repository ที่ระบุในคู่มือของ antislop เลือกติดตั้งระดับเครื่องให้ทุก workspace ใช้ร่วมกัน:

```powershell
npx --yes skills add miqdadbadjuber/anti-slop --skill '*' --agent codex --global --yes
```

คำสั่ง antislop ด้านบนเป็นวิธีเตรียมเครื่องใหม่ ยังไม่ได้รันใน session นี้เพราะมีครบอยู่แล้ว ตรวจผลและรายการ skills หลังรันจริง หาก installer เปลี่ยน flags ให้ดู help/version ก่อน หลีกเลี่ยง `--all` เพราะรอบที่ใช้กับ HyperFrames มันเลือกหลาย agent และเกิดการคัดลอกผิดพลาด ใช้ `--skill '*' --agent codex` เพื่อระบุขอบเขตตรง ๆ

หลังติดตั้ง skills จะพร้อมค้นพบใน turn ถัดไป หาก catalog ยังไม่เปลี่ยนให้เปิด session ใหม่ ไม่ถือว่าการติดตั้ง skills คือการติดตั้ง HyperFrames runtime/สร้าง project หรือผ่าน render test

## ตรวจความพร้อมโดยไม่เรียก API

จาก workspace root:

```powershell
Get-ChildItem .agents/skills -Directory | ForEach-Object {
    [pscustomobject]@{
        Skill = $_.Name
        Ready = Test-Path -LiteralPath (Join-Path $_.FullName 'SKILL.md')
    }
}
Get-Content skills-lock.json -Raw | ConvertFrom-Json
```

ตรวจ antislop แต่ละชื่อจากตำแหน่งระดับเครื่องหรือ workspace ที่ติดตั้งจริง ไม่ใช้ผล lock ของ HyperFrames ยืนยัน antislop

## สถานะที่ตรวจแล้ว

6 พฤศจิกายน 2026: HyperFrames 9/9 มี SKILL.md, antislop 6/6 มี SKILL.md และลบโฟลเดอร์ส่วนเกิน `.claude` กับ `agent` ตามคำสั่งผู้ใช้แล้ว ชุดกลาง `.agents/skills` ยังคงอยู่ ไม่ติดตั้ง application dependencies, ไม่เรียก LangMind และไม่ render วิดีโอในงานจัด skills นี้

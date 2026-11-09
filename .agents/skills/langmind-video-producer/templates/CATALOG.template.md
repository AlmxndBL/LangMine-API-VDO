# EPXX — Catalog & Motion Selection Register

Episode ID: `epXX-<slug>`  
ระบบ: HyperFrames Motion Framework + GSAP Timeline Controller

---

## 1. ทะเบียนการเลือก Motion Components ตามหน้าที่ของแต่ละ Beat

| Beat | หน้าที่ของซีน | Motion Component / กลไก | แหล่งที่มา / วิธีทำ |
|---|---|---|---|
| **b1** | เปิดตัว แสดงหน้าจอและตั้ง 3 คำถาม | Device Mockup (`.device`) + `qchip` Pop animation + `robot` fade-in | Built-in CSS & GSAP back.out |
| **b2** | แผนผังระบบและทิศทางข้อมูล | Architecture Node (`.node.wide`) + SVG `pathLength` draw + Animated `dot` data flow | Custom SVG + GSAP stroke/cy loop |
| **b3** | แสดงรายการเตรียมความพร้อม | Stack Cards (`.card`) slide-up + Warning card + Scope chips pop | GSAP staggered slide-up & pop |
| **b4** | ขั้นตอนที่ 1 (เตรียม/ส่งข้อมูล) | Sticky Minimap (Green) + Input/Output Slots + Code Block sweep | Minimap component + code sweep |
| **b5** | ขั้นตอนที่ 2 (ผูกระบบ/ประมวลผล) | Sticky Minimap (Gold) + Parameter Highlight (`.hl`) pulse | GSAP scale & highlight pulse |
| **b6** | ขั้นตอนที่ 3 (ทดสอบ/ดึงผลลัพธ์) | Sticky Minimap (Teal) + Device Output Fade (`.img-a` opacity) | GSAP cross-fade & device slide |
| **b7** | คำแนะนำและข้อควรระวัง | Feature Cards (`.use`) + Tip card accent | GSAP staggered slide-in |
| **b8** | สรุป 3 เสาหลัก | Numbered Recap Cards (`.rc-n`) pulse | Number badge sequential pop |
| **b9** | ปิดท้ายแบรนด์และผู้สนับสนุน | Sponsor Layout (`.sponsor`) + LangMind Logo pulse + URL pill | Brand logo entrance & glow |

---

## 2. จุดตรวจทางเทคนิค W5 ก่อน Render เต็ม

- [ ] ทุก Component ใช้ฟอนต์ Sarabun จากโฟลเดอร์ Local (ไม่มี external network request)
- [ ] อนิเมชันทุกชิ้นทำงานแบบ Seek-Safe (ใช้เฉพาะ `fromTo`, `set`, และ absolute time ใน GSAP)
- [ ] Dot ในลูกศรหยุดวิ่งเมื่อฉากจบ (ป้องกัน memory leak หรือ visual artifact)
- [ ] ความโปร่งใส (Alpha channel) ของ Robot Mascot คมชัด ไม่มีขอบขาวรบกวน

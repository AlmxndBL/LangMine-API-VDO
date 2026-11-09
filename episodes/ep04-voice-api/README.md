> อัปเดต 9 พ.ย. 2026: [EP04 V3 เสียง Orus draft](video-v3-orus/ep04-v3-orus.mp4) สร้างจากเสียงแบบ 3 ที่ผู้ใช้เลือก ยาว 2:18.1 · [ผลตรวจและข้อจำกัด](video-v3-orus/REVIEW.md) · รอฟังและตรวจจังหวะซับ

# EP04 — Voice API: คุยกับ AI ด้วยเสียงพูด

Episode ID: `ep04-voice-api`  
อัปเดต 9 พฤศจิกายน 2026 (Asia/Bangkok)

## สถานะปัจจุบัน: W7 — video-v3 draft ครบ 9 beat รอผู้รับผิดชอบฟังตรวจและรับงาน

- **ฉบับทำงานหลัก**: [video-v3/](video-v3/PLAN.md) ใช้โครงเล่าจากมุมคนดูของ v2 (เตรียม → เชื่อม → ใช้ผล) ผสมฉากเดิน API 3 ครั้งจาก v1 และปิดท้ายด้วยฉากผู้สนับสนุน LangMind ยังไม่ผ่านการตรวจรับจากผู้ใช้
- **วิดีโอ draft**: [video-v3/ep04-video-v3-draft.mp4](video-v3/ep04-video-v3-draft.mp4) H.264 1080×1920 + AAC ยาว 133.27 s (2:13) เสียง Edge TTS `th-TH-NiwatNeural` rate −16% `hyperframes check` ไม่มี finding ผลตรวจอยู่ที่ [video-v3/REVIEW.md](video-v3/REVIEW.md)
  - [ep04-video-v3-niwat-draft.mp4](video-v3/ep04-video-v3-niwat-draft.mp4) ยาว 130.77 s เป็น render ก่อนหน้า (สั้นกว่า 2.5 s ตรงกับ `hold` ของ b5 ที่เพิ่มภายหลัง — inferred จากความยาว)
- **บทและ claim ledger**: บทพูด/ซับอยู่ใน [video-v3/timing.json](video-v3/timing.json) และ [VOICE-SCRIPT.md](video-v3/VOICE-SCRIPT.md); claim ledger เทียบ `langmind-api.md` อยู่ใน [video-v3/PLAN.md](video-v3/PLAN.md)
- **ภาพหน้าจอจำลอง**: `app-voice-q.jpg` / `app-voice-a.jpg` ชุดเดียวกับ v1 (ที่มาและสคริปต์สร้างอยู่ [video/evidence/make-voice-screens.py](video/evidence/make-voice-screens.py)) เป็นภาพจำลอง ไม่ใช่ official UI หรือผลเรียก API จริง

### รุ่นอื่นที่เก็บไว้ (ไม่แก้)
| โฟลเดอร์ | แนวเล่า | ผลงาน |
|---|---|---|
| [video/](video/REVIEW.md) (v1) | เล่าตาม endpoint 6 beat | [ep04-full-draft-v2.mp4](video/ep04-full-draft-v2.mp4) 86.3 s และ sample B03–B05 draft v2–v4 |
| [video-v2/](video-v2/PLAN.md) | เล่าจากมุมคนดู 7 beat | ยังไม่มีเสียง มีเฉพาะเฟรมตรวจใน `video-v2/evidence/` |

## เอกสารประจำตอน
| เอกสาร | หน้าที่ | สถานะ |
|---|---|---|
| [README.md](README.md) | สถานะภาพรวมของตอน และลำดับถัดไป | อัปเดตล่าสุด |
| [PLAN.md](PLAN.md) | แผน W3: โจทย์คนดู ขอบเขต use case และโครงเรื่องคร่าว ๆ | จัดทำแล้ว (ฐานของ v1) |
| [SCRIPT.md](SCRIPT.md) | บทพากย์ 6 Beats และ Claim Ledger ของ v1 | v2 แก้ตามคู่มือ |
| [CATALOG.md](CATALOG.md) | ทะเบียนคัดเลือกบล็อก Motion ตามหน้าที่ของแต่ละ Beat | จัดทำแล้ว |
| [STORYBOARD.md](STORYBOARD.md) | Storyboard ราย Beat และแบบหน้าจอ Mockup (APP-VOICE-Q / A) | จัดทำแล้ว (ฐานของ v1) |
| [video-v3/PLAN.md](video-v3/PLAN.md) | โครงเรื่อง 9 beat, claim ledger และวิธีทำงานของ v3 | ฉบับทำงานหลัก |
| [video-v3/REVIEW.md](video-v3/REVIEW.md) | ผลตรวจ technical/visual ของ draft v3 และสิ่งที่ต้องฟังตรวจ | รอตรวจเสียงโดยคน |

## ลำดับถัดไป (Next Actions)
1. ดู [video-v3/ep04-video-v3-draft.mp4](video-v3/ep04-video-v3-draft.mp4) บนมือถือ ฟังการออกเสียงชื่อเฉพาะตามรายการใน [REVIEW.md](video-v3/REVIEW.md) ดูว่าซับตรงเสียง และตัดสินว่าความยาว 2:13 เหมาะกับคนดูหรือไม่
2. ถ้ามีคำที่ออกเสียงผิดหรือต้องแก้บท แก้ `say`/`cap` ใน [video-v3/timing.json](video-v3/timing.json) แล้วรันในโฟลเดอร์ `video-v3/`: `python make-voice-samples.py` → `node build.mjs` → `npx hyperframes check` → `npx hyperframes render --quality draft` (render เป็นไฟล์ชื่อใหม่ ไม่เขียนทับ draft เดิม)
3. ตรวจเงื่อนไขการใช้เสียง Edge TTS ก่อนเผยแพร่ แล้วบันทึกผลรับงานใน [video-v3/REVIEW.md](video-v3/REVIEW.md)
4. เมื่อผู้ใช้รับงานแล้ว render ฉบับส่งมอบด้วย `npx hyperframes render --quality delivery`; publish ต้องมีคำสั่ง


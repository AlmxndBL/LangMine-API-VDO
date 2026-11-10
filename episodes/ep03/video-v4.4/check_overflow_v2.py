from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path('episodes/ep03/video-v4.4')
REG = ROOT / 'assets/fonts/Sarabun-Regular.ttf'
BOLD = ROOT / 'assets/fonts/Sarabun-Bold.ttf'

def fnt(sz, b=False):
    return ImageFont.truetype(str(BOLD if b else REG), sz, layout_engine=ImageFont.Layout.BASIC)

im = Image.new('RGB', (1080, 1920))
d = ImageDraw.Draw(im)

checks = [
    # (scene, label, text, font, x, max_x)
    # Stepper: x0 for i=1,2,3 is 72, 385, 698. Box is x0 to x0+300.
    ('stepper', 'cap1', 'เริ่มห้องใหม่', fnt(22, True), (72 + 54 + 372 - 10) / 2, 372 - 10),
    ('stepper', 'cap2', 'สตรีมคำตอบ', fnt(22, True), (385 + 54 + 685 - 10) / 2, 685 - 10),
    ('stepper', 'cap3', 'ถามต่อในห้องเดิม', fnt(22, True), (698 + 54 + 998 - 10) / 2, 998 - 10),
    
    # B1
    ('b1', 'tip-head', 'แชตบอตตอบช้า หรือจำเรื่องเดิมไม่ได้?', fnt(36, True), 315, 980),
    ('b1', 'tip-l1', 'ต่อ Chat API ของ LangMind เพื่อให้ตอบแบบสตรีมมิ่ง', fnt(28), 315, 980),
    ('b1', 'tip-l2', 'พิมพ์สดทีละคำ และจำบริบทการคุยได้ทันที', fnt(28), 315, 980),
    
    # B2
    ('b2', 'node1-title', 'แอปพลิเคชันของคุณ (Client)', fnt(38, True), 205, 940),
    ('b2', 'node1-sub', 'แสดงผล UI หน้าแชต · ส่งคำถามผู้ใช้', fnt(26), 205, 940),
    ('b2', 'node2-title', 'เซิร์ฟเวอร์หลังบ้าน (Backend Server)', fnt(38, True), 205, 940),
    ('b2', 'node2-sub', 'เก็บ API Key ปลอดภัย · เรียก Chat API', fnt(26), 205, 940),
    ('b2', 'node3-title', 'LangMind Chat API & Agent', fnt(38, True), 205, 940),
    ('b2', 'node3-sub', 'ประมวลผลคำตอบ · สตรีมข้อความ Real-time', fnt(26), 205, 940),
    
    # B3
    ('b3', 'card1-title', '1. Agent ใน LangMind', fnt(40, True), 210, 730),
    ('b3', 'card1-sub', 'ระบุ agent_id และเปิดใช้งานโมเดลเรียบร้อย', fnt(28), 210, 730),
    ('b3', 'card2-title', '2. API Key (Personal Token)', fnt(40, True), 210, 730),
    ('b3', 'card2-sub', 'lmpat_•••••••• พร้อม Scope: chat:invoke', fnt(28), 210, 730),
    ('b3', 'card3-title', '3. เซิร์ฟเวอร์หลังบ้าน', fnt(40, True), 210, 730),
    ('b3', 'card3-sub', 'เก็บ Key ฝั่ง Server เท่านั้น ห้ามใส่ในหน้าเว็บ', fnt(28), 210, 730),
    ('b3', 'warn-head', 'ข้อควรระวัง:', fnt(30, True), 150, 940),
    ('b3', 'warn-l1', 'หากไม่ระบุ agent_id หรือ Agent ยังไม่พร้อมใช้งาน', fnt(26), 150, 940),
    ('b3', 'warn-l2', 'ระบบจะคืนรหัสข้อผิดพลาด (Error) ทันที', fnt(26), 150, 940),

    # B4
    ('b4', 'code-head', 'POST /api/chat/message', fnt(34, True), 150, 700),
    ('b4', 'code-foot', '✓ ค่า conversation_id: null หมายถึงขอเปิดห้องแชตใหม่', fnt(26, True), 170, 920),
    ('b4', 'res-head', 'รับ event แรกชื่อ message_start ทันที:', fnt(28, True), 150, 940),
    ('b4', 'res-data', 'data: {"event": "message_start", "conversation_id": "conv_8892"}', fnt(25, True), 150, 940),
    ('b4', 'res-foot', '» เก็บรหัส conv_8892 นี้ไว้ใช้ส่งในคำถามถัดไป «', fnt(26), 150, 940),

    # B5
    ('b5', 'tip-head', 'ทางเลือกสำหรับสคริปต์หลังบ้าน:', fnt(30, True), 150, 940),
    ('b5', 'tip-l1', 'สามารถใช้ POST /api/chat/message/blocking', fnt(26), 150, 940),
    ('b5', 'tip-l2', 'เพื่อรับคำตอบเป็น JSON ก้อนเดียวจบ เหมาะกับระบบที่ไม่สะดวกอ่าน SSE', fnt(26), 150, 940),

    # B6
    ('b6', 'res-head', 'ผลลัพธ์:', fnt(28, True), 150, 940),
    ('b6', 'res-l1', 'AI จำได้ทันทีว่าเป็นสินค้าชิ้นไหน', fnt(26), 150, 940),
    ('b6', 'res-l2', 'พร้อมคำนวณส่วนลดให้ต่อเนื่อง โดยที่ลูกค้าไม่ต้องถามซ้ำ', fnt(26), 150, 940),

    # B7
    ('b7', 'item1-t', '1. ส่ง user_id ปลายทาง', fnt(36, True), 205, 940),
    ('b7', 'item1-d', 'ส่งรหัสผู้ใช้ปลายทางทุกครั้งเพื่อนับสถิติ Unique Users ได้อย่างแท้จริง', fnt(24), 205, 940),
    ('b7', 'item2-t', '2. สั่งยกเลิกสตรีมกะทันหัน', fnt(36, True), 205, 940),
    ('b7', 'item2-d', 'ใช้ POST /chat/messages/{id}/stop สั่งหยุดการพิมพ์ของ AI ได้ทันที', fnt(24), 205, 940),
    ('b7', 'item3-t', '3. ดึงประวัติข้อความย้อนหลัง', fnt(36, True), 205, 940),
    ('b7', 'item3-d', 'ใช้ GET /chat/conversations/{id}/messages ดึงข้อความมาแสดงในแอป', fnt(24), 205, 940),
    ('b7', 'item4-t', '4. เช็ก message_end & ปลอดภัย', fnt(36, True), 205, 940),
    ('b7', 'item4-d', 'รอตรวจ event message_end เสมอ และเก็บ API Key ฝั่ง Server เท่านั้น', fnt(24), 205, 940),

    # B8
    ('b8', 'rc1', 'Agent พร้อมใช้ + API Key (chat:invoke) + เซิร์ฟเวอร์หลังบ้าน', fnt(23, True), 260, 940),
    ('b8', 'rc2', 'เริ่มห้องใหม่ (null) → สตรีมสด (message) → ถามต่อด้วย ID เดิม', fnt(23, True), 260, 940),
    ('b8', 'rc3', 'สลับ Blocking ได้ + ส่ง user_id + ควบคุมแชตผ่าน API เต็มรูปแบบ', fnt(23, True), 260, 940),
]

all_ok = True
for sc, lbl, txt, f, x, max_x in checks:
    w = d.textbbox((0, 0), txt, font=f)[2]
    end_x = x + w/2 if 'cap' in lbl else x + w
    is_ok = end_x <= max_x
    if not is_ok:
        all_ok = False
    status = 'OK' if is_ok else 'OVERFLOW'
    print(f'[{status}] {sc:8s} {lbl:12s}: w={w:5.1f}, end_x={end_x:6.1f}, max_x={max_x} (margin={max_x-end_x:+6.1f})')

print(f'\nResult: {"ALL PASSED! Zero overflows." if all_ok else "STILL HAS OVERFLOWS!"}')

print("\n--- Checking All Caption Lines from timing.json ---")
import json
timing = json.loads((ROOT / 'timing.json').read_text(encoding='utf-8'))
font_cap = fnt(38, True)
box_w = 1008 - 72

caps_ok = True
for b in timing['beats']:
    for s in b['segments']:
        for line in s['cap'].splitlines():
            w = d.textbbox((0, 0), line, font=font_cap)[2]
            margin = (box_w - w) / 2
            is_ok = w <= (box_w - 60)
            if not is_ok:
                caps_ok = False
            status = 'OK' if is_ok else 'OVERFLOW'
            msg = f'[{status}] {b["id"]} cap: w={w:5.1f}, margin={margin:5.1f}'
            print(msg)

print(f'\nCaptions Result: {"ALL PASSED! Zero caption overflows." if caps_ok else "CAPTION OVERFLOW FOUND!"}')

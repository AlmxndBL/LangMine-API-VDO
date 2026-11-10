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
    ('stepper', 'cap1', 'เริ่มห้องใหม่', fnt(23, True), 72+173, 372),
    ('stepper', 'cap2', 'สตรีมคำตอบ', fnt(23, True), 385+173, 685),
    ('stepper', 'cap3', 'ถามต่อในห้องเดิม', fnt(23, True), 698+173, 998),
    ('b1', 'tip-head', 'แชตบอตตอบช้า หรือจำเรื่องเดิมไม่ได้?', fnt(36, True), 315, 1000),
    ('b1', 'tip-l1', 'ต่อ Chat API ของ LangMind เพื่อให้ตอบแบบสตรีมมิ่ง', fnt(29), 315, 1000),
    ('b1', 'tip-l2', 'พิมพ์สดทีละคำ และจำบริบทการคุยได้ทันที', fnt(29), 315, 1000),
    ('b3', 'warn', 'หากไม่ระบุ agent_id หรือ Agent ยังไม่พร้อมใช้งาน ระบบจะคืนรหัส Error ทันที', fnt(28), 150, 960),
    ('b4', 'code-foot', '✓ ค่า conversation_id: null หมายถึงขอเปิดห้องแชตใหม่', fnt(28, True), 170, 930),
    ('b4', 'res-data', 'data: {"event": "message_start", "conversation_id": "conv_8892"}', fnt(27, True), 150, 960),
    ('b5', 'tip', 'สามารถใช้ POST /api/chat/message/blocking เพื่อรับคำตอบเป็น JSON ก้อนเดียวจบได้', fnt(28), 150, 960),
    ('b6', 'result', 'AI จำได้ทันทีว่าเป็นสินค้าชิ้นไหน พร้อมคำนวณส่วนลดให้โดยไม่ต้องถามซ้ำ', fnt(28), 150, 960),
    ('b7', 'item1', 'ส่งรหัสผู้ใช้ปลายทางทุกครั้งเพื่อนับสถิติ Unique Users ได้อย่างแท้จริง', fnt(28), 205, 960),
    ('b7', 'item2', 'ใช้ POST /chat/messages/{id}/stop สั่งหยุดการพิมพ์ของ AI ได้ทันที', fnt(28), 205, 960),
    ('b7', 'item3', 'ใช้ GET /chat/conversations/{id}/messages ดึงข้อความมาแสดงในแอป', fnt(28), 205, 960),
    ('b7', 'item4', 'รอตรวจ event message_end เสมอ และเก็บ API Key ฝั่ง Server เท่านั้น', fnt(28), 205, 960),
    ('b8', 'rc1', 'Agent พร้อมใช้ + API Key (chat:invoke) + เซิร์ฟเวอร์หลังบ้าน', fnt(28, True), 270, 960),
    ('b8', 'rc2', 'เริ่มห้องใหม่ (null) → สตรีมสด (message) → ถามต่อด้วย ID เดิม', fnt(28, True), 270, 960),
    ('b8', 'rc3', 'สลับ Blocking ได้ + ส่ง user_id + ควบคุมแชตผ่าน API เต็มรูปแบบ', fnt(28, True), 270, 960),
]

for sc, lbl, txt, f, x, max_x in checks:
    w = d.textbbox((0, 0), txt, font=f)[2]
    end_x = x + w/2 if 'cap' in lbl else x + w
    status = 'OVERFLOW' if end_x > max_x else 'OK'
    print(f'[{status}] {sc:8s} {lbl:10s}: w={w:5.1f}, end_x={end_x:6.1f}, max_x={max_x} (diff={end_x-max_x:+6.1f})')

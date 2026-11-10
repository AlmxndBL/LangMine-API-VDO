from pathlib import Path
from shutil import which
import json
import subprocess
import tempfile
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).parent
TIMING_PATH = ROOT / "timing.json"
TIMING = json.loads(TIMING_PATH.read_text(encoding="utf-8"))

PLATES_DIR = ROOT / "assets" / "plates" / "v4"
ILLUST_DIR = ROOT / "assets" / "illustrations" / "v4"
REVIEW_DIR = ROOT / "renders" / "final-review-v4"

PLATES_DIR.mkdir(parents=True, exist_ok=True)
ILLUST_DIR.mkdir(parents=True, exist_ok=True)
REVIEW_DIR.mkdir(parents=True, exist_ok=True)

W, H = TIMING["width"], TIMING["height"]
FPS = TIMING["fps"]

# Color Palette (Refined from EP04 / EP03 guidelines)
BG_COLOR = (248, 244, 233)       # Warm cream paper
INK_COLOR = (22, 37, 54)         # Deep dark slate/navy
GREEN_PRIMARY = (8, 121, 95)     # LangMind Forest Green
GREEN_LIGHT = (232, 245, 239)    # Soft green tint
CARD_BG = (255, 253, 248)        # Pure card paper
BORDER_COLOR = (200, 211, 207)   # Muted card border
MUTED_TEXT = (90, 105, 115)      # Secondary text
CODE_BG = (21, 39, 34)           # Dark green/slate code box
CODE_TEXT = (230, 241, 236)      # Code light text
CODE_KEYWORD = (166, 226, 46)    # Green keyword
CODE_STRING = (230, 219, 116)    # Yellow string
CODE_COMMENT = (120, 145, 135)   # Muted comment
ACCENT_ORANGE = (217, 130, 43)   # Highlight / Warning
RED_ACCENT = (200, 40, 40)       # Delete / Permanent warning

REG_FONT_PATH = str(ROOT / "assets" / "fonts" / "Sarabun-Regular.ttf")
BOLD_FONT_PATH = str(ROOT / "assets" / "fonts" / "Sarabun-Bold.ttf")

def font(size, bold=False):
    return ImageFont.truetype(BOLD_FONT_PATH if bold else REG_FONT_PATH, size)

def wrap(draw, text, fnt, max_width):
    lines = []
    for paragraph in text.split("\n"):
        if not paragraph:
            lines.append("")
            continue
        line = ""
        for word in paragraph.split(" "):
            test = word if not line else line + " " + word
            if draw.textbbox((0, 0), test, font=fnt)[2] <= max_width:
                line = test
            else:
                if line:
                    lines.append(line)
                line = word
        lines.append(line)
    return lines

def draw_header(draw, title_extra="", badge_text=""):
    # Top Kicker
    kicker = "EP03 · CHAT API"
    kfnt = font(28, bold=True)
    draw.text((72, 80), kicker, font=kfnt, fill=GREEN_PRIMARY)
    if title_extra:
        draw.text((72 + draw.textbbox((0, 0), kicker, font=kfnt)[2] + 20, 80),
                  "|  " + title_extra, font=font(28, bold=False), fill=MUTED_TEXT)
    
    # Top divider
    draw.line((72, 130, W - 72, 130), fill=BORDER_COLOR, width=2)
    
    # Badge (Right aligned)
    if badge_text:
        bfnt = font(24, bold=True)
        bb = draw.textbbox((0, 0), badge_text, font=bfnt)
        bw = bb[2] - bb[0] + 32
        bx = W - 72 - bw
        draw.rounded_rectangle((bx, 68, bx + bw, 108), radius=12, fill=(230, 239, 233), outline=GREEN_PRIMARY, width=2)
        draw.text((bx + 16, 74), badge_text, font=bfnt, fill=GREEN_PRIMARY)

def add_caption(image, text):
    if not text:
        return image
    draw = ImageDraw.Draw(image)
    x, y, w, h = 72, 1540, W - 144, 230
    draw.rounded_rectangle((x, y, x + w, y + h), radius=28, fill=INK_COLOR, outline=(255, 255, 255), width=3)
    caption_font = font(42, True)
    lines = wrap(draw, text, caption_font, w - 80)
    while len(lines) > 2 and caption_font.size > 28:
        caption_font = font(caption_font.size - 2, True)
        lines = wrap(draw, text, caption_font, w - 80)
    line_h = caption_font.size + 12
    total_h = len(lines) * line_h - 12
    yy = y + (h - total_h) / 2
    for line in lines:
        bounds = draw.textbbox((0, 0), line, font=caption_font)
        xx = x + (w - (bounds[2] - bounds[0])) / 2
        draw.text((xx, yy), line, font=caption_font, fill=(255, 255, 255))
        yy += line_h
    return image

def base_canvas():
    img = Image.new("RGB", (W, H), BG_COLOR)
    return img

def paste_alpha(canvas, asset_path, pos, max_size=None):
    if not Path(asset_path).exists():
        return
    asset = Image.open(asset_path).convert("RGBA")
    if max_size:
        asset.thumbnail(max_size, Image.Resampling.LANCZOS)
    canvas.paste(asset, pos, asset)

# ----------------- STAGE BUILDERS ----------------- #

def build_b1_hook_1():
    img = base_canvas()
    d = ImageDraw.Draw(img)
    draw_header(d, "จุดตั้งต้น", "ภาพจำลอง")
    
    # Title
    d.text((72, 220), "จากคำถามแรก สู่การถามต่อ", font=font(56, bold=True), fill=INK_COLOR)
    d.text((72, 300), "ทำความเข้าใจประสบการณ์แชท ก่อนเริ่มเขียนโค้ดต่อ API", font=font(34), fill=MUTED_TEXT)
    
    # Card 1: Request draft
    x, y, w, h = 72, 420, W - 144, 520
    d.rounded_rectangle((x, y, x + w, y + h), radius=24, fill=CARD_BG, outline=GREEN_PRIMARY, width=3)
    
    # Step pill
    d.rounded_rectangle((x + 40, y + 40, x + 240, y + 96), radius=12, fill=GREEN_PRIMARY)
    d.text((x + 60, y + 48), "โจทย์ข้อที่ 1", font=font(28, bold=True), fill=(255, 255, 255))
    
    d.text((x + 40, y + 130), "ขอให้ผู้ช่วยช่วยร่างข้อความ", font=font(44, bold=True), fill=INK_COLOR)
    
    # User message quote box
    qx, qy, qw, qh = x + 40, y + 210, w - 80, 180
    d.rounded_rectangle((qx, qy, qx + qw, qy + qh), radius=16, fill=GREEN_LIGHT, outline=GREEN_PRIMARY, width=2)
    d.text((qx + 30, qy + 24), "💬 ผู้ใช้พิมพ์ถาม:", font=font(28, bold=True), fill=GREEN_PRIMARY)
    d.text((qx + 30, qy + 70), "“ช่วยร่างข้อความแจ้งทีมว่า\nเลื่อนประชุมเป็น 15:00 น. ให้สุภาพ”", font=font(34), fill=INK_COLOR)
    
    d.text((x + 40, y + 420), "• ส่งคำขอครั้งแรก โดยยังไม่มีประวัติการคุยมาก่อน", font=font(30), fill=MUTED_TEXT)
    
    # Character robot pose
    paste_alpha(img, ROOT / "assets" / "characters" / "01-question.png", (W - 380, 1000), (320, 360))
    return img

def build_b1_hook_2():
    img = base_canvas()
    d = ImageDraw.Draw(img)
    draw_header(d, "จุดตั้งต้น", "ภาพจำลอง")
    
    d.text((72, 200), "จากคำถามแรก สู่การถามต่อ", font=font(56, bold=True), fill=INK_COLOR)
    
    # Card 1 (compact)
    x, y, w, h = 72, 320, W - 144, 280
    d.rounded_rectangle((x, y, x + w, y + h), radius=20, fill=CARD_BG, outline=BORDER_COLOR, width=2)
    d.text((x + 40, y + 36), "1. ส่งคำขอแรก", font=font(34, bold=True), fill=MUTED_TEXT)
    d.text((x + 40, y + 90), "“ช่วยร่างข้อความแจ้งทีมว่าเลื่อนประชุมเป็น 15:00 น. ให้สุภาพ”", font=font(30), fill=INK_COLOR)
    d.text((x + 40, y + 160), "Agent: ตอบข้อความร่างฉบับแรกกลับมา", font=font(28), fill=MUTED_TEXT)
    
    # Arrow down
    d.text((W // 2 - 20, 625), "⬇️", font=font(44), fill=GREEN_PRIMARY)
    
    # Card 2 (highlighted)
    y2 = 710
    h2 = 420
    d.rounded_rectangle((x, y2, x + w, y2 + h2), radius=24, fill=CARD_BG, outline=ACCENT_ORANGE, width=3)
    d.rounded_rectangle((x + 40, y2 + 36, x + 260, y2 + 92), radius=12, fill=ACCENT_ORANGE)
    d.text((x + 60, y2 + 44), "โจทย์ข้อที่ 2", font=font(28, bold=True), fill=(255, 255, 255))
    
    d.text((x + 40, y2 + 120), "อยากขอแก้ต่อในเรื่องเดิม", font=font(44, bold=True), fill=INK_COLOR)
    
    qx, qy, qw, qh = x + 40, y2 + 190, w - 80, 140
    d.rounded_rectangle((qx, qy, qx + qw, qy + qh), radius=16, fill=(255, 248, 235), outline=ACCENT_ORANGE, width=2)
    d.text((qx + 30, qy + 20), "💬 ผู้ใช้พิมพ์ต่อ:", font=font(28, bold=True), fill=ACCENT_ORANGE)
    d.text((qx + 30, qy + 65), "“ขอให้สั้นลงอีกนิด”", font=font(38, bold=True), fill=INK_COLOR)
    
    d.text((x + 40, y2 + 350), "• ต้องคุยต่อในบทสนทนาเดิม โดยไม่ต้องเล่าเรื่องใหม่", font=font(30), fill=MUTED_TEXT)
    
    paste_alpha(img, ROOT / "assets" / "characters" / "05-point-up.png", (W - 360, 1140), (280, 340))
    return img

def draw_chat_frame(img, d, current_state=1):
    draw_header(d, "มุมมองผู้ใช้ทั่วไป", "ภาพจำลอง")
    
    # Chat container box
    cx, cy, cw, ch = 72, 200, W - 144, 1260
    d.rounded_rectangle((cx, cy, cx + cw, cy + ch), radius=28, fill=CARD_BG, outline=BORDER_COLOR, width=3)
    
    # Chat header inside box
    d.rounded_rectangle((cx, cy, cx + cw, cy + 100), radius=28, fill=(240, 245, 242))
    d.text((cx + 40, cy + 30), "🤖  LangMind Agent (ภาพจำลองบทสนทนา)", font=font(32, bold=True), fill=INK_COLOR)
    d.line((cx, cy + 100, cx + cw, cy + 100), fill=BORDER_COLOR, width=2)
    
    # 1. User Message 1
    ux, uy, uw, uh = cx + 80, cy + 150, cw - 120, 190
    d.rounded_rectangle((ux, uy, ux + uw, uy + uh), radius=20, fill=GREEN_PRIMARY)
    d.text((ux + 30, uy + 20), "คุณ", font=font(24, bold=True), fill=(210, 240, 230))
    d.text((ux + 30, uy + 60), "ช่วยร่างข้อความแจ้งทีมว่า\nเลื่อนประชุมเป็น 15:00 น. ให้สุภาพ", font=font(32), fill=(255, 255, 255))
    
    if current_state == 1:
        # Waiting state
        d.text((cx + 60, uy + uh + 50), "⏳ Agent กำลังพิมพ์คำตอบ...", font=font(30), fill=MUTED_TEXT)
        return
    
    # 2. Agent Response 1
    ax, ay, aw, ah = cx + 40, uy + uh + 40, cw - 120, 170
    d.rounded_rectangle((ax, ay, ax + aw, ay + ah), radius=20, fill=(245, 247, 246), outline=BORDER_COLOR, width=2)
    d.text((ax + 30, ay + 20), "Agent", font=font(24, bold=True), fill=GREEN_PRIMARY)
    d.text((ax + 30, ay + 60), "“ขอแจ้งเลื่อนประชุมเป็นเวลา 15:00 น.\nขอบคุณครับ”", font=font(32), fill=INK_COLOR)
    
    if current_state == 2:
        d.rounded_rectangle((cx + 40, cy + ch - 120, cx + cw - 40, cy + ch - 40), radius=14, fill=GREEN_LIGHT)
        d.text((cx + 70, cy + ch - 92), "✓ คำถามแรกเสร็จสิ้น: ได้รับคำตอบเริ่มต้น", font=font(28, bold=True), fill=GREEN_PRIMARY)
        return
        
    # 3. User Message 2 (Follow up)
    u2x, u2y, u2w, u2h = cx + 180, ay + ah + 50, cw - 220, 130
    d.rounded_rectangle((u2x, u2y, u2x + u2w, u2y + u2h), radius=20, fill=GREEN_PRIMARY if current_state == 3 else (14, 140, 110))
    d.text((u2x + 30, u2y + 16), "คุณ (ถามต่อ)", font=font(24, bold=True), fill=(210, 240, 230))
    d.text((u2x + 30, u2y + 54), "“ขอให้สั้นลงอีกนิด”", font=font(34, bold=True), fill=(255, 255, 255))
    
    if current_state == 3:
        d.text((cx + 60, u2y + u2h + 40), "⏳ Agent กำลังปรับปรุงคำตอบในบริบทเดิม...", font=font(30), fill=MUTED_TEXT)
        return
        
    # 4. Agent Response 2
    a2x, a2y, a2w, a2h = cx + 40, u2y + u2h + 40, cw - 120, 170
    d.rounded_rectangle((a2x, a2y, a2x + a2w, a2y + a2h), radius=20, fill=(235, 247, 240), outline=GREEN_PRIMARY, width=3)
    d.text((a2x + 30, a2y + 20), "Agent (คำตอบที่ปรับแล้ว)", font=font(24, bold=True), fill=GREEN_PRIMARY)
    d.text((a2x + 30, a2y + 65), "“ประชุมเลื่อนเป็น 15:00 น. นะครับ”", font=font(34, bold=True), fill=INK_COLOR)
    
    # Continuity tag
    d.rounded_rectangle((cx + 40, cy + ch - 130, cx + cw - 40, cy + ch - 40), radius=14, fill=(255, 248, 230), outline=ACCENT_ORANGE, width=2)
    d.text((cx + 60, cy + ch - 96), "🔗 เชื่อมโยงด้วย conversation_id เดียวกัน", font=font(28, bold=True), fill=ACCENT_ORANGE)

def build_b2_chat_q():
    img = base_canvas()
    d = ImageDraw.Draw(img)
    draw_chat_frame(img, d, current_state=1)
    return img

def build_b2_chat_a():
    img = base_canvas()
    d = ImageDraw.Draw(img)
    draw_chat_frame(img, d, current_state=2)
    return img

def build_b3_followup_q():
    img = base_canvas()
    d = ImageDraw.Draw(img)
    draw_chat_frame(img, d, current_state=3)
    return img

def build_b3_followup_a():
    img = base_canvas()
    d = ImageDraw.Draw(img)
    draw_chat_frame(img, d, current_state=4)
    return img

def draw_arch_diagram(img, d, active_tier=1):
    draw_header(d, "สถาปัตยกรรมระบบ", "โครงสร้าง")
    
    d.text((72, 170), "เบื้องหลังการทำงานระหว่าง แอป กับ Chat API", font=font(46, bold=True), fill=INK_COLOR)
    d.text((72, 235), "แยกบทบาทหน้าที่ระหว่าง Client, Backend และ LangMind ให้ชัดเจน", font=font(30), fill=MUTED_TEXT)
    
    bx, bw = 72, W - 144
    
    # 1. Tier 1: User & App UI
    y1, h1 = 300, 260
    border1 = GREEN_PRIMARY if active_tier == 1 else BORDER_COLOR
    bg1 = GREEN_LIGHT if active_tier == 1 else CARD_BG
    d.rounded_rectangle((bx, y1, bx + bw, y1 + h1), radius=20, fill=bg1, outline=border1, width=3 if active_tier == 1 else 1)
    d.text((bx + 40, y1 + 30), "1. แอปพลิเคชัน / ผู้ใช้งาน (Frontend)", font=font(34, bold=True), fill=INK_COLOR)
    d.text((bx + 40, y1 + 80), "• รับข้อความคำถามจากผู้ใช้ ส่งต่อไปยัง Backend\n• จัดการ UI หน้าต่างแชท, แสดง Animation หรือฟองสบู่ข้อความ\n• ทยอยแสดงผลข้อความตามที่ Backend ส่งมา", font=font(28), fill=INK_COLOR if active_tier == 1 else MUTED_TEXT)
    
    # Arrow 1 -> 2
    d.text((W // 2 - 20, y1 + h1 + 10), "⬇️  คำขอ /  ⬆️ ผลลัพธ์", font=font(26, bold=True), fill=MUTED_TEXT)
    
    # 2. Tier 2: App Backend Server
    y2, h2 = 640, 340
    border2 = GREEN_PRIMARY if active_tier == 2 else BORDER_COLOR
    bg2 = GREEN_LIGHT if active_tier == 2 else CARD_BG
    d.rounded_rectangle((bx, y2, bx + bw, y2 + h2), radius=20, fill=bg2, outline=border2, width=3 if active_tier == 2 else 1)
    d.text((bx + 40, y2 + 30), "2. เซิร์ฟเวอร์หลังบ้าน (Backend Server)", font=font(34, bold=True), fill=INK_COLOR)
    d.text((bx + 40, y2 + 80), "• เก็บรักษา Personal API Key อย่างปลอดภัย (ห้ามเผยแพร่)\n• เรียก LangMind Chat API ด้วย Bearer Token\n• รับ Stream SSE หรือ JSON ก้อนเดียว แล้วส่งต่อให้หน้าบ้าน", font=font(28), fill=INK_COLOR if active_tier == 2 else MUTED_TEXT)
    
    # Security Callout
    d.rounded_rectangle((bx + 40, y2 + 220, bx + bw - 40, y2 + 300), radius=12, fill=(255, 240, 240), outline=RED_ACCENT, width=2)
    d.text((bx + 60, y2 + 242), "🔒 ข้อสำคัญ: API Key ต้องอยู่ฝั่ง Server เท่านั้น ห้ามใส่ใน Client", font=font(26, bold=True), fill=RED_ACCENT)
    
    # Arrow 2 -> 3
    d.text((W // 2 - 20, y2 + h2 + 10), "⬇️  POST /api/chat/message  ⬆️ Stream events", font=font(26, bold=True), fill=MUTED_TEXT)
    
    # 3. Tier 3: LangMind Chat API
    y3, h3 = 1060, 280
    border3 = GREEN_PRIMARY if active_tier == 3 else BORDER_COLOR
    bg3 = GREEN_LIGHT if active_tier == 3 else CARD_BG
    d.rounded_rectangle((bx, y3, bx + bw, y3 + h3), radius=20, fill=bg3, outline=border3, width=3 if active_tier == 3 else 1)
    d.text((bx + 40, y3 + 30), "3. LangMind Chat API", font=font(34, bold=True), fill=INK_COLOR)
    d.text((bx + 40, y3 + 80), "• Base URL: https://langmind.in.th/api\n• Scope ที่ใช้: chat:invoke\n• ประมวลผลข้อความด้วย Agent ที่ระบุ แล้ว Stream ผลลัพธ์กลับ", font=font(28), fill=INK_COLOR if active_tier == 3 else MUTED_TEXT)
    d.text((bx + 40, y3 + 200), "✓ API มีหน้าที่ส่งข้อมูลกลับ ส่วนการเรนเดอร์หน้าจอเป็นงานของแอป", font=font(26, bold=True), fill=GREEN_PRIMARY)

def build_b4_arch_front():
    img = base_canvas()
    d = ImageDraw.Draw(img)
    draw_arch_diagram(img, d, active_tier=1)
    return img

def build_b4_arch_back():
    img = base_canvas()
    d = ImageDraw.Draw(img)
    draw_arch_diagram(img, d, active_tier=2)
    return img

def build_b4_arch_api():
    img = base_canvas()
    d = ImageDraw.Draw(img)
    draw_arch_diagram(img, d, active_tier=3)
    return img

def draw_api_group_1(img, d, highlight_idx=1):
    draw_header(d, "ภาพรวม Chat API", "Scope: chat:invoke")
    
    d.text((72, 170), "กลุ่มที่ 1: ส่งข้อความและควบคุมการตอบ", font=font(46, bold=True), fill=INK_COLOR)
    d.text((72, 235), "4 Endpoints หลักสำหรับการสนทนากับ Agent", font=font(30), fill=MUTED_TEXT)
    
    cards = [
        ("POST", "/api/chat/message", "SSE Stream (ค่าเริ่มต้น)", 
         "ส่งคำถามไปยัง Agent และรับคำตอบทยอย stream กลับมาแบบ Server-Sent Events", 1),
        ("POST", "/api/chat/message/blocking", "JSON ทั้งก้อน (Blocking)", 
         "ส่งคำถามและรอจน Agent ประมวลผลเสร็จสมบูรณ์ ก่อนส่ง JSON คำตอบกลับครั้งเดียว", 2),
        ("POST", "/api/chat/preview", "Preview ใน Agent Builder", 
         "ทดสอบสนทนาในระบบ Builder โดยใช้ Published Version และ Channel Web", 3),
        ("POST", "/api/chat/messages/{id}/stop", "หยุดการสร้างคำตอบ (Stop Stream)", 
         "สั่งหยุด Stream ทันที โดยใช้ message_id ที่ได้รับจาก event message_start", 3)
    ]
    
    bx, bw = 72, W - 144
    cur_y = 300
    for idx, (method, path, tag, desc, group_id) in enumerate(cards, 1):
        is_hl = (highlight_idx == group_id)
        h = 240 if idx <= 2 else 200
        bg = GREEN_LIGHT if is_hl else CARD_BG
        border = GREEN_PRIMARY if is_hl else BORDER_COLOR
        
        d.rounded_rectangle((bx, cur_y, bx + bw, cur_y + h), radius=20, fill=bg, outline=border, width=3 if is_hl else 1)
        
        # Method pill
        mbg = GREEN_PRIMARY if method == "POST" else (50, 100, 150)
        d.rounded_rectangle((bx + 30, cur_y + 24, bx + 130, cur_y + 68), radius=10, fill=mbg)
        d.text((bx + 45, cur_y + 30), method, font=font(24, bold=True), fill=(255, 255, 255))
        
        # Path
        d.text((bx + 150, cur_y + 26), path, font=font(30, bold=True), fill=INK_COLOR)
        
        # Tag
        tb = draw_header_tag = draw_tag(d, bx + bw - 30, cur_y + 24, tag, is_hl)
        
        # Desc
        d.text((bx + 30, cur_y + 86), desc, font=font(26), fill=INK_COLOR if is_hl else MUTED_TEXT)
        cur_y += h + 24

def draw_tag(d, right_x, y, text, is_hl):
    tfnt = font(22, bold=True)
    bb = d.textbbox((0, 0), text, font=tfnt)
    w = bb[2] - bb[0] + 24
    bx = right_x - w
    tbg = (200, 230, 215) if is_hl else (235, 238, 236)
    tfg = GREEN_PRIMARY if is_hl else MUTED_TEXT
    d.rounded_rectangle((bx, y, bx + w, y + 42), radius=8, fill=tbg)
    d.text((bx + 12, y + 8), text, font=tfnt, fill=tfg)
    return bx

def build_b5_ep_stream():
    img = base_canvas()
    d = ImageDraw.Draw(img)
    draw_api_group_1(img, d, highlight_idx=1)
    return img

def build_b5_ep_blocking():
    img = base_canvas()
    d = ImageDraw.Draw(img)
    draw_api_group_1(img, d, highlight_idx=2)
    return img

def build_b5_ep_preview_stop():
    img = base_canvas()
    d = ImageDraw.Draw(img)
    draw_api_group_1(img, d, highlight_idx=3)
    return img

def build_b6_ep_read():
    img = base_canvas()
    d = ImageDraw.Draw(img)
    draw_header(d, "ภาพรวม Chat API", "Scope: chat:invoke")
    
    d.text((72, 170), "กลุ่มที่ 2: จัดการประวัติและบทสนทนา", font=font(46, bold=True), fill=INK_COLOR)
    d.text((72, 235), "ส่วนที่ 1: การเรียกอ่านประวัติและข้อความ", font=font(30), fill=MUTED_TEXT)
    
    # Requirement notice
    bx, bw = 72, W - 144
    d.rounded_rectangle((bx, 300, bx + bw, 370), radius=14, fill=(255, 248, 230), outline=ACCENT_ORANGE, width=2)
    d.text((bx + 30, 320), "⚠️ เงื่อนไขสำคัญ: การอ่านหรือแก้บทสนทนาต้องระบุ agent_id เสมอ", font=font(28, bold=True), fill=ACCENT_ORANGE)
    
    endpoints = [
        ("GET", "/api/chat/conversations", "รายการห้องสนทนา", 
         "ดึงรายการบทสนทนาทั้งหมดของ Agent นั้น\nรองรับ cursor pagination และกำหนด limit"),
        ("GET", "/api/chat/conversations/{id}", "รายละเอียดห้อง", 
         "ดึงข้อมูลสรุปของบทสนทนานั้น เช่น ชื่อบทสนทนา, วันที่สร้าง, สถานะ"),
        ("GET", "/api/chat/conversations/{id}/messages", "ข้อความในบทสนทนา", 
         "อ่านประวัติข้อความทั้งหมดที่คุยกันในห้องนั้น (รองรับ cursor, limit)")
    ]
    
    cur_y = 410
    for method, path, tag, desc in endpoints:
        h = 240
        d.rounded_rectangle((bx, cur_y, bx + bw, cur_y + h), radius=20, fill=GREEN_LIGHT, outline=GREEN_PRIMARY, width=2)
        
        d.rounded_rectangle((bx + 30, cur_y + 24, bx + 120, cur_y + 68), radius=10, fill=(40, 110, 160))
        d.text((bx + 45, cur_y + 30), method, font=font(24, bold=True), fill=(255, 255, 255))
        d.text((bx + 140, cur_y + 26), path, font=font(28, bold=True), fill=INK_COLOR)
        
        draw_tag(d, bx + bw - 30, cur_y + 24, tag, True)
        d.text((bx + 30, cur_y + 90), desc, font=font(28), fill=INK_COLOR)
        cur_y += h + 30
        
    return img

def build_b6_ep_manage():
    img = base_canvas()
    d = ImageDraw.Draw(img)
    draw_header(d, "ภาพรวม Chat API", "Scope: chat:invoke")
    
    d.text((72, 170), "กลุ่มที่ 2: จัดการประวัติและบทสนทนา", font=font(46, bold=True), fill=INK_COLOR)
    d.text((72, 235), "ส่วนที่ 2: แก้ไขชื่อ และการลบบทสนทนา", font=font(30), fill=MUTED_TEXT)
    
    bx, bw = 72, W - 144
    
    # 1. PATCH
    y1, h1 = 340, 300
    d.rounded_rectangle((bx, y1, bx + bw, y1 + h1), radius=20, fill=CARD_BG, outline=GREEN_PRIMARY, width=2)
    d.rounded_rectangle((bx + 30, y1 + 30, bx + 140, y1 + 76), radius=10, fill=(180, 130, 20))
    d.text((bx + 45, y1 + 36), "PATCH", font=font(24, bold=True), fill=(255, 255, 255))
    d.text((bx + 160, y1 + 34), "/api/chat/conversations/{id}", font=font(30, bold=True), fill=INK_COLOR)
    draw_tag(d, bx + bw - 30, y1 + 30, "อัปเดตข้อมูล", True)
    
    d.text((bx + 30, y1 + 100), "• แก้ไขชื่อหัวข้อห้องสนทนา (Rename title)\n• ปรับเปลี่ยนสถานะของบทสนทนา\n• ต้องส่ง agent_id ประกอบในคำขอ", font=font(28), fill=INK_COLOR)
    
    # 2. DELETE
    y2, h2 = 700, 380
    d.rounded_rectangle((bx, y2, bx + bw, y2 + h2), radius=20, fill=(255, 245, 245), outline=RED_ACCENT, width=3)
    d.rounded_rectangle((bx + 30, y2 + 30, bx + 150, y2 + 76), radius=10, fill=RED_ACCENT)
    d.text((bx + 45, y2 + 36), "DELETE", font=font(24, bold=True), fill=(255, 255, 255))
    d.text((bx + 170, y2 + 34), "/api/chat/conversations/{id}", font=font(30, bold=True), fill=RED_ACCENT)
    draw_tag(d, bx + bw - 30, y2 + 30, "ลบถาวร", True)
    
    d.text((bx + 30, y2 + 100), "• สั่งลบบทสนทนาและประวัติข้อความทั้งหมด\n• ต้องส่ง agent_id เพื่อยืนยันสิทธิ์", font=font(28), fill=INK_COLOR)
    
    # Warning box
    d.rounded_rectangle((bx + 30, y2 + 220, bx + bw - 30, y2 + 330), radius=14, fill=(255, 230, 230), outline=RED_ACCENT, width=2)
    d.text((bx + 50, y2 + 240), "⚠️ คำเตือน: การลบบทสนทนาเป็นการลบถาวร (Permanent)", font=font(28, bold=True), fill=RED_ACCENT)
    d.text((bx + 50, y2 + 280), "ข้อมูลจะไม่สามารถกู้คืนได้ ควรทำระบบยืนยันกับผู้ใช้ก่อนเรียก", font=font(26), fill=RED_ACCENT)
    
    return img

def build_b7_ep_feedback():
    img = base_canvas()
    d = ImageDraw.Draw(img)
    draw_header(d, "ภาพรวม Chat API", "Scope: chat:invoke")
    
    d.text((72, 170), "กลุ่มที่ 3: เสริมหลังได้รับคำตอบ", font=font(46, bold=True), fill=INK_COLOR)
    d.text((72, 235), "ส่วนที่ 1: การให้ Feedback คะแนนแก่คำตอบ", font=font(30), fill=MUTED_TEXT)
    
    bx, bw = 72, W - 144
    y, h = 340, 520
    d.rounded_rectangle((bx, y, bx + bw, y + h), radius=24, fill=GREEN_LIGHT, outline=GREEN_PRIMARY, width=3)
    
    # Method
    d.rounded_rectangle((bx + 40, y + 40, bx + 140, y + 86), radius=10, fill=GREEN_PRIMARY)
    d.text((bx + 55, y + 46), "POST", font=font(24, bold=True), fill=(255, 255, 255))
    d.text((bx + 160, y + 44), "/api/chat/messages/{id}/feedback", font=font(32, bold=True), fill=INK_COLOR)
    
    d.text((bx + 40, y + 120), "ส่งคะแนนประเมินคำตอบของข้อความนั้น เพื่อเก็บสถิติและพัฒนา Agent", font=font(28), fill=INK_COLOR)
    
    # Rating options box
    rx, ry, rw, rh = bx + 40, y + 180, bw - 80, 200
    d.rounded_rectangle((rx, ry, rx + rw, ry + rh), radius=16, fill=CARD_BG, outline=BORDER_COLOR, width=2)
    d.text((rx + 30, ry + 24), "ค่าที่อนุญาตให้ส่งใน body (rating):", font=font(28, bold=True), fill=INK_COLOR)
    
    d.text((rx + 40, ry + 80), "👍  rating: 1   (ชอบ / พึงพอใจในคำตอบ)", font=font(32, bold=True), fill=GREEN_PRIMARY)
    d.text((rx + 40, ry + 130), "👎  rating: -1  (ไม่ชอบ / คำตอบไม่ตรงจุด)", font=font(32, bold=True), fill=RED_ACCENT)
    
    d.text((bx + 40, y + 420), "• ใช้ message_id ของข้อความตอบที่ต้องการให้ feedback\n• ช่วยให้ระบบนำ Feedback ไปปรับแต่ง Prompt หรือคัดเลือกชุดข้อมูล", font=font(26), fill=MUTED_TEXT)
    return img

def build_b7_ep_files():
    img = base_canvas()
    d = ImageDraw.Draw(img)
    draw_header(d, "ภาพรวม Chat API", "Scope: chat:invoke")
    
    d.text((72, 170), "กลุ่มที่ 3: เสริมหลังได้รับคำตอบ", font=font(46, bold=True), fill=INK_COLOR)
    d.text((72, 235), "ส่วนที่ 2: ดาวน์โหลดไฟล์ที่ Agent สร้างขึ้น", font=font(30), fill=MUTED_TEXT)
    
    bx, bw = 72, W - 144
    y, h = 340, 520
    d.rounded_rectangle((bx, y, bx + bw, y + h), radius=24, fill=GREEN_LIGHT, outline=GREEN_PRIMARY, width=3)
    
    # Method
    d.rounded_rectangle((bx + 40, y + 40, bx + 130, y + 86), radius=10, fill=(40, 110, 160))
    d.text((bx + 55, y + 46), "GET", font=font(24, bold=True), fill=(255, 255, 255))
    d.text((bx + 150, y + 44), ".../generated-files/{file_id}", font=font(30, bold=True), fill=INK_COLOR)
    
    d.text((bx + 40, y + 120), "Path เต็ม:", font=font(26, bold=True), fill=MUTED_TEXT)
    d.text((bx + 40, y + 160), "GET /api/chat/messages/{id}/generated-files/{file_id}", font=font(26, bold=True), fill=INK_COLOR)
    
    fx, fy, fw, fh = bx + 40, y + 230, bw - 80, 160
    d.rounded_rectangle((fx, fy, fx + fw, fy + fh), radius=16, fill=CARD_BG, outline=BORDER_COLOR, width=2)
    d.text((fx + 30, fy + 24), "📁 รองรับไฟล์ผลลัพธ์ เช่น:", font=font(28, bold=True), fill=INK_COLOR)
    d.text((fx + 30, fy + 75), "• เอกสารสรุป PDF หรือ Markdown\n• ไฟล์ข้อมูล CSV, Excel หรือรูปภาพที่ Agent สร้างขึ้น", font=font(26), fill=INK_COLOR)
    
    # Scope footer note
    d.rounded_rectangle((bx + 40, y + 420, bx + bw - 40, y + 480), radius=12, fill=(230, 240, 235))
    d.text((bx + 60, y + 438), "✓ ทุก Endpoint ใน Chat API ใช้ Scope เดียวกัน: chat:invoke", font=font(26, bold=True), fill=GREEN_PRIMARY)
    return img

def build_b8_req_auth():
    img = base_canvas()
    d = ImageDraw.Draw(img)
    draw_header(d, "ตัวอย่างการใช้งาน", "ตัวอย่างคำสั่ง")
    
    d.text((72, 170), "ขั้นตอนที่ 1: เตรียม API Key ฝั่ง Server", font=font(46, bold=True), fill=INK_COLOR)
    d.text((72, 235), "สร้าง Personal API Key ใน LangMind แล้วเก็บเป็น Secret ใน Backend", font=font(30), fill=MUTED_TEXT)
    
    bx, bw = 72, W - 144
    
    # Key properties card
    y1, h1 = 300, 280
    d.rounded_rectangle((bx, y1, bx + bw, y1 + h1), radius=20, fill=CARD_BG, outline=GREEN_PRIMARY, width=2)
    d.text((bx + 40, y1 + 30), "สิ่งที่ต้องเตรียมก่อนยิง API:", font=font(32, bold=True), fill=INK_COLOR)
    d.text((bx + 40, y1 + 80), "1. สร้าง Personal API Key พร้อมเลือก Scope: chat:invoke\n2. คัดลอก Token ทันที (ระบบแสดงครั้งเดียวเท่านั้น)\n3. เก็บลงใน .env, Secret Manager หรือ Password Manager", font=font(28), fill=INK_COLOR)
    
    # Code snippet box
    y2, h2 = 630, 420
    d.rounded_rectangle((bx, y2, bx + bw, y2 + h2), radius=20, fill=CODE_BG)
    d.text((bx + 40, y2 + 30), "# ตัวอย่างการตั้งค่าในสภาพแวดล้อม Server (Bash)", font=font(26), fill=CODE_COMMENT)
    d.text((bx + 40, y2 + 80), "export LM_TOKEN=\"lmpat_xxxxxxxxxxxxxxxxxxxxxxxx\"", font=font(30, bold=True), fill=CODE_TEXT)
    d.text((bx + 40, y2 + 150), "# ระบุ Agent ID ที่สร้างไว้แล้ว", font=font(26), fill=CODE_COMMENT)
    d.text((bx + 40, y2 + 200), "export AGENT_ID=\"agent_meeting_assistant\"", font=font(30, bold=True), fill=CODE_TEXT)
    
    d.rounded_rectangle((bx + 30, y2 + 300, bx + bw - 30, y2 + 380), radius=12, fill=(35, 60, 50))
    d.text((bx + 50, y2 + 325), "🔒 Bearer Token จะถูกส่งผ่าน Header Authorization", font=font(26, bold=True), fill=(200, 240, 220))
    
    return img

def build_b8_req_curl():
    img = base_canvas()
    d = ImageDraw.Draw(img)
    draw_header(d, "ตัวอย่างการใช้งาน", "ตัวอย่างคำสั่ง")
    
    d.text((72, 170), "ขั้นตอนที่ 2: ยิงคำขอแรกด้วย cURL (SSE)", font=font(46, bold=True), fill=INK_COLOR)
    d.text((72, 235), "ส่งข้อความแรก และใส่ conversation_id: null เพื่อเริ่มห้องใหม่", font=font(30), fill=MUTED_TEXT)
    
    bx, bw = 72, W - 144
    y, h = 300, 780
    d.rounded_rectangle((bx, y, bx + bw, y + h), radius=20, fill=CODE_BG)
    
    code_lines = [
        ("# 1. ใช้ตัวเลือก --no-buffer เพื่อรับ event ทันทีที่มาถึง", CODE_COMMENT, False),
        ("curl --no-buffer -X POST \\", CODE_TEXT, True),
        ("  \"https://langmind.in.th/api/chat/message\" \\", CODE_STRING, False),
        ("  -H \"Authorization: Bearer ${LM_TOKEN}\" \\", CODE_TEXT, False),
        ("  -H \"Content-Type: application/json\" \\", CODE_TEXT, False),
        ("  --data '{", CODE_TEXT, False),
        ("    \"agent_id\": \"<AGENT_ID>\",", CODE_TEXT, False),
        ("    \"query\": \"ช่วยร่างข้อความแจ้งทีมว่าเลื่อนประชุมเป็น 15:00 น. ให้สุภาพ\",", (255, 230, 140), False),
        ("    \"conversation_id\": null,", ACCENT_ORANGE, True),
        ("    \"attachment_ids\": []", CODE_TEXT, False),
        ("  }'", CODE_TEXT, False)
    ]
    
    cy = y + 40
    for line, color, is_bold in code_lines:
        d.text((bx + 40, cy), line, font=font(28, bold=is_bold), fill=color)
        cy += 48
        
    # Callout pill for conversation_id: null
    d.rounded_rectangle((bx + 40, y + h - 160, bx + bw - 40, y + h - 40), radius=16, fill=(40, 70, 60), outline=ACCENT_ORANGE, width=2)
    d.text((bx + 60, y + h - 136), "💡 จุดสังเกต: \"conversation_id\": null", font=font(28, bold=True), fill=ACCENT_ORANGE)
    d.text((bx + 60, y + h - 94), "เป็นการบอก LangMind ให้เปิดบทสนทนาใหม่สำหรับผู้ใช้นี้", font=font(26), fill=(220, 240, 230))
    return img

def draw_sse_events(img, d, step=1):
    draw_header(d, "ตัวอย่างการใช้งาน", "ข้อมูลจำลอง")
    
    d.text((72, 170), "ขั้นตอนที่ 3: รับ SSE Stream Events", font=font(46, bold=True), fill=INK_COLOR)
    d.text((72, 235), "การส่งข้อมูลกลับมาทาง Server-Sent Events ตามลำดับ", font=font(30), fill=MUTED_TEXT)
    
    bx, bw = 72, W - 144
    events = [
        ("1. message_start", 
         "เริ่มต้น stream: ส่ง conversation_id และ message_id",
         "event: message_start\ndata: {\"conversation_id\":\"conv_123\", \"message_id\":\"msg_01\"}", 1),
        ("2. message", 
         "คำตอบทยอยส่งมาเป็นช่วง (chunks) ให้แอปนำไปต่อเติมบนหน้าจอ",
         "event: message\ndata: {\"answer\":\"ขอแจ้งเลื่อนประชุมเป็นเวลา 15:00 น. ขอบคุณครับ\"}", 2),
        ("3. citations (ถ้ามี)", 
         "แหล่งอ้างอิงเอกสารหรือข้อมูลเสริม (มีเฉพาะกรณีที่ Agent ค้นเอกสาร)",
         "event: citations\ndata: {\"citations\": [ ... ]}", 3),
        ("4. message_end", 
         "สิ้นสุด stream: ส่งคำตอบฉบับเต็มและข้อมูล usage (token/latency)",
         "event: message_end\ndata: {\"answer\":\"ขอแจ้งเลื่อน...\", \"usage\":{\"total_tokens\":78}}", 4)
    ]
    
    cur_y = 300
    for title, desc, sample, group_id in events:
        is_active = (step >= group_id)
        is_hl = (step == group_id)
        h = 240
        bg = CODE_BG if is_active else (235, 238, 236)
        border = GREEN_PRIMARY if is_hl else (BORDER_COLOR if not is_active else (50, 90, 80))
        
        d.rounded_rectangle((bx, cur_y, bx + bw, cur_y + h), radius=18, fill=bg, outline=border, width=3 if is_hl else 1)
        
        # Title
        tcolor = (255, 255, 255) if is_active else MUTED_TEXT
        d.text((bx + 30, cur_y + 18), title, font=font(30, bold=True), fill=tcolor)
        
        # Desc
        dcolor = (180, 215, 200) if is_active else MUTED_TEXT
        d.text((bx + 30, cur_y + 60), desc, font=font(24), fill=dcolor)
        
        # Code sample box inside
        if is_active:
            sx, sy, sw, sh = bx + 30, cur_y + 105, bw - 60, 110
            d.rounded_rectangle((sx, sy, sx + sw, sy + sh), radius=10, fill=(12, 25, 20))
            d.text((sx + 20, sy + 14), sample, font=font(24), fill=CODE_KEYWORD if is_hl else (160, 185, 175))
            
        cur_y += h + 24

def build_b9_sse_start():
    img = base_canvas()
    d = ImageDraw.Draw(img)
    draw_sse_events(img, d, step=1)
    return img

def build_b9_sse_chunks():
    img = base_canvas()
    d = ImageDraw.Draw(img)
    draw_sse_events(img, d, step=2)
    return img

def build_b9_sse_citations():
    img = base_canvas()
    d = ImageDraw.Draw(img)
    draw_sse_events(img, d, step=3)
    return img

def build_b9_sse_end():
    img = base_canvas()
    d = ImageDraw.Draw(img)
    draw_sse_events(img, d, step=4)
    return img

def build_b10_cont_body():
    img = base_canvas()
    d = ImageDraw.Draw(img)
    draw_header(d, "ตัวอย่างการใช้งาน", "ตัวอย่างคำสั่ง")
    
    d.text((72, 170), "ขั้นตอนที่ 4: ถามต่อในบทสนทนาเดิม", font=font(46, bold=True), fill=INK_COLOR)
    d.text((72, 235), "ส่งคำถามใหม่ พร้อมระบุ conversation_id เดิมที่ได้รับจากข้อความแรก", font=font(30), fill=MUTED_TEXT)
    
    bx, bw = 72, W - 144
    y, h = 300, 680
    d.rounded_rectangle((bx, y, bx + bw, y + h), radius=20, fill=CODE_BG)
    
    json_lines = [
        ("# ส่ง POST /api/chat/message อีกครั้งด้วย JSON Body ดังนี้:", CODE_COMMENT, False),
        ("{", CODE_TEXT, False),
        ("  \"agent_id\": \"<AGENT_ID>\",", CODE_TEXT, False),
        ("  \"query\": \"ขอให้สั้นลงอีกนิด\",", (255, 230, 140), True),
        ("  \"conversation_id\": \"conv_123\",", CODE_KEYWORD, True),
        ("  \"attachment_ids\": []", CODE_TEXT, False),
        ("}", CODE_TEXT, False)
    ]
    
    cy = y + 40
    for line, color, is_bold in json_lines:
        d.text((bx + 40, cy), line, font=font(32, bold=is_bold), fill=color)
        cy += 60
        
    # Callout
    d.rounded_rectangle((bx + 40, y + h - 180, bx + bw - 40, y + h - 40), radius=16, fill=(35, 75, 60), outline=GREEN_PRIMARY, width=2)
    d.text((bx + 60, y + h - 150), "🔑 ระบุ \"conversation_id\": \"conv_123\"", font=font(30, bold=True), fill=(255, 255, 255))
    d.text((bx + 60, y + h - 100), "Agent จะจดจำบริบทเดิม และปรับข้อความให้สั้นลงได้ทันที", font=font(28), fill=(210, 245, 230))
    
    # Character robot pose pointing up
    paste_alpha(img, ROOT / "assets" / "characters" / "05-point-up.png", (W - 380, 1060), (320, 380))
    return img

def build_b10_summary():
    img = base_canvas()
    d = ImageDraw.Draw(img)
    draw_header(d, "สรุปท้ายคลิป", "สรุปใจความ")
    
    # LangMind Logo at top
    paste_alpha(img, ROOT / "assets" / "brand" / "langmind-logo.png", (W // 2 - 120, 170), (240, 120))
    
    d.text((72, 330), "สรุป 3 หัวใจสำคัญของ Chat API", font=font(52, bold=True), fill=INK_COLOR)
    
    bx, bw = 72, W - 144
    steps = [
        ("1. เลือก Endpoint ให้ตรงกับลักษณะงาน", 
         "• ใช้ /api/chat/message (SSE) เมื่อต้องการแสดงผลแบบแชทสด\n• ใช้ /api/chat/message/blocking เมื่อต้องการรับ JSON ก้อนเดียว"),
        ("2. ปลอดภัยด้วย Server-Side Architecture", 
         "• เก็บ Personal API Key ใน Backend เสมอ ห้ามใส่ใน Client\n• ทุก Chat Endpoint ใช้ Scope เดียวกัน: chat:invoke"),
        ("3. เก็บ conversation_id เพื่อต่อบทสนทนา", 
         "• ส่ง conversation_id: null เมื่อเริ่มเปิดหัวข้อใหม่\n• ส่ง conversation_id เดิมเสมอ เมื่อต้องการคุยต่อในเรื่องเดิม")
    ]
    
    cur_y = 430
    for title, desc in steps:
        h = 230
        d.rounded_rectangle((bx, cur_y, bx + bw, cur_y + h), radius=20, fill=CARD_BG, outline=GREEN_PRIMARY, width=2)
        d.text((bx + 35, cur_y + 25), title, font=font(32, bold=True), fill=GREEN_PRIMARY)
        d.text((bx + 35, cur_y + 80), desc, font=font(28), fill=INK_COLOR)
        cur_y += h + 30
        
    # Thumbs up robot at bottom right
    paste_alpha(img, ROOT / "assets" / "characters" / "10-thumbs-up.png", (W - 320, 1220), (260, 280))
    return img

STAGE_BUILDERS = {
    "b1-hook-1": build_b1_hook_1,
    "b1-hook-2": build_b1_hook_2,
    "b2-chat-q": build_b2_chat_q,
    "b2-chat-a": build_b2_chat_a,
    "b3-followup-q": build_b3_followup_q,
    "b3-followup-a": build_b3_followup_a,
    "b4-arch-front": build_b4_arch_front,
    "b4-arch-back": build_b4_arch_back,
    "b4-arch-api": build_b4_arch_api,
    "b5-ep-stream": build_b5_ep_stream,
    "b5-ep-blocking": build_b5_ep_blocking,
    "b5-ep-preview-stop": build_b5_ep_preview_stop,
    "b6-ep-read": build_b6_ep_read,
    "b6-ep-manage": build_b6_ep_manage,
    "b7-ep-feedback": build_b7_ep_feedback,
    "b7-ep-files": build_b7_ep_files,
    "b8-req-auth": build_b8_req_auth,
    "b8-req-curl": build_b8_req_curl,
    "b9-sse-start": build_b9_sse_start,
    "b9-sse-chunks": build_b9_sse_chunks,
    "b9-sse-citations": build_b9_sse_citations,
    "b9-sse-end": build_b9_sse_end,
    "b10-cont-body": build_b10_cont_body,
    "b10-summary": build_b10_summary,
}

def create_plates():
    stages = []
    for stage_meta in TIMING["stages"]:
        sid = stage_meta["id"]
        builder = STAGE_BUILDERS[sid]
        img = builder()
        img = add_caption(img, stage_meta.get("caption", ""))
        out_path = PLATES_DIR / stage_meta["file"]
        img.save(out_path, format="PNG")
        stages.append((out_path, stage_meta["frames"]))
    return stages

def render(stages):
    ffmpeg = which("ffmpeg")
    if not ffmpeg:
        raise RuntimeError("ffmpeg was not found on PATH")
    output = ROOT / "renders" / "EP03-v4.mp4"
    output.parent.mkdir(parents=True, exist_ok=True)
    
    args = [ffmpeg, "-y", "-hide_banner", "-loglevel", "warning"]
    for image, frames in stages:
        args.extend(["-loop", "1", "-framerate", str(FPS), "-t", f"{frames / FPS:.6f}", "-i", str(image)])
        
    filters = []
    for i, (_, frames) in enumerate(stages):
        filters.append(f"[{i}:v]fps={FPS},scale={W}:{H}:flags=lanczos,trim=end_frame={frames},setpts=PTS-STARTPTS,setsar=1[v{i}]")
    joined = "".join(f"[v{i}]" for i in range(len(stages)))
    filters.append(f"{joined}concat=n={len(stages)}:v=1:a=0,format=yuv420p[outv]")
    
    args.extend([
        "-filter_complex", ";".join(filters),
        "-map", "[outv]", "-an", "-r", str(FPS),
        "-c:v", "libx264", "-preset", "medium", "-crf", "18",
        "-movflags", "+faststart", str(output)
    ])
    subprocess.run(args, check=True)
    return output

def generate_contact_sheet(stages):
    # Sample 8 distinct frames across the stages for the contact sheet
    indices = [0, 3, 5, 8, 11, 14, 17, 23]
    sampled = [stages[i][0] for i in indices]
    
    cols = 4
    rows = 2
    cell_w = 270
    cell_h = 480
    sheet = Image.new("RGB", (cols * cell_w, rows * cell_h), (255, 255, 255))
    for idx, path in enumerate(sampled):
        r = idx // cols
        c = idx % cols
        thumb = Image.open(path).resize((cell_w, cell_h), Image.Resampling.LANCZOS)
        sheet.paste(thumb, (c * cell_w, r * cell_h))
    sheet_path = REVIEW_DIR / "contact-sheet.png"
    sheet.save(sheet_path)
    print(f"Saved contact sheet to {sheet_path}")

if __name__ == "__main__":
    print("Generating 24 visual stages...")
    stages = create_plates()
    print("Rendering video MP4 via ffmpeg...")
    out_file = render(stages)
    generate_contact_sheet(stages)
    total_frames = sum(frames for _, frames in stages)
    print(f"SUCCESS: Wrote {out_file} ({len(stages)} stages, {total_frames / FPS:.3f}s @ {FPS}fps, silent)")

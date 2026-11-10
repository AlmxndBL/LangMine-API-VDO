from pathlib import Path
from shutil import which
import json
import math
import subprocess
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).parent
TIMING_PATH = ROOT / "timing.json"
CFG = json.loads(TIMING_PATH.read_text(encoding="utf-8"))

PLATES_DIR = ROOT / "assets" / "plates" / "v4.1"
REVIEW_DIR = ROOT / "renders" / "final-review-v4.1"
PLATES_DIR.mkdir(parents=True, exist_ok=True)
REVIEW_DIR.mkdir(parents=True, exist_ok=True)

W, H = 1080, 1920
FPS = CFG["fps"]

# Palette from EP04 v3 Orus
BG_PAPER = (248, 244, 233)
LINE_COLOR = (232, 226, 213)
INK_COLOR = (32, 53, 44)
MUTED_GREEN = (62, 93, 79)
GREEN_PRIMARY = (56, 129, 90)     # #38815A
OCHRE = (141, 115, 44)            # #8d732c
TEAL = (30, 117, 120)             # #1E7578
CARD_BG = (255, 250, 240)
CARD_BORDER = (38, 59, 50)
SHADOW_GREEN = (162, 183, 141)    # #a2b78d
CODE_BG = (31, 42, 37)            # #1f2a25
CODE_TEXT = (233, 239, 230)
CAPTION_BG = (35, 56, 46)         # #23382e
RED_ACCENT = (155, 59, 43)

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

def create_base_paper():
    img = Image.new("RGB", (W, H), BG_PAPER)
    d = ImageDraw.Draw(img)
    # Repeating lined notebook pattern: line every 60px
    for y in range(60, H, 60):
        d.line((0, y, W, y), fill=LINE_COLOR, width=2)
    return img

def draw_header(d, show_spine=True, active_phase=1):
    # Kicker
    kicker = "EP03  /  CHAT API"
    d.text((92, 112), kicker, font=font(34, bold=True), fill=MUTED_GREEN)
    
    # Underline rotated -3 deg: draw small polygon
    poly = [(92, 162), (224, 155), (224, 164), (92, 171)]
    d.polygon(poly, fill=GREEN_PRIMARY)
    
    # Note pill at right
    note_text = "ภาพจำลอง"
    nfnt = font(30, bold=True)
    nbb = d.textbbox((0, 0), note_text, font=nfnt)
    nw = nbb[2] - nbb[0] + 48
    nx = W - 92 - nw
    d.rounded_rectangle((nx, 108, nx + nw, 166), radius=22, fill=(252, 250, 241), outline=(68, 96, 80), width=3)
    d.text((nx + 24, 116), note_text, font=nfnt, fill=(68, 96, 80))
    
    # Spine progress
    if show_spine:
        sx = 92
        sy = 322
        phases = [("1 เข้าใจ", GREEN_PRIMARY), ("2 รู้จัก API", OCHRE), ("3 ลองส่ง", TEAL)]
        for i, (label, col) in enumerate(phases, 1):
            pfnt = font(30, bold=True)
            pbb = d.textbbox((0, 0), label, font=pfnt)
            pw = pbb[2] - pbb[0] + 48
            ph = 48
            
            if i < active_phase:
                pbg, pborder, ptext = (228, 237, 230), (127, 165, 143), (47, 94, 70)
            elif i == active_phase:
                pbg, pborder, ptext = col, col, (255, 255, 255)
            else:
                pbg, pborder, ptext = (252, 250, 241), (169, 185, 175), (111, 133, 122)
                
            d.rounded_rectangle((sx, sy, sx + pw, sy + ph), radius=20, fill=pbg, outline=pborder, width=3)
            d.text((sx + 24, sy + 6), label, font=pfnt, fill=ptext)
            sx += pw + 10
            if i < len(phases):
                d.line((sx, sy + 24, sx + 30, sy + 24), fill=(183, 197, 188), width=4)
                sx += 40

def draw_heading(d, num_str, title_str, subtitle_str=""):
    x, y = 92, 206
    cur_x = x
    if num_str:
        d.ellipse((x, y, x + 84, y + 84), fill=INK_COLOR)
        d.text((x + 28, y + 10), num_str, font=font(50, bold=True), fill=(255, 250, 240))
        cur_x += 106
    d.text((cur_x, y + 4), title_str, font=font(68, bold=True), fill=INK_COLOR)
    if subtitle_str:
        bb = d.textbbox((0, 0), title_str, font=font(68, bold=True))
        sub_x = cur_x + (bb[2] - bb[0]) + 18
        d.text((sub_x, y + 26), subtitle_str, font=font(38, bold=False), fill=(78, 107, 94))

def add_caption(img, cap_text):
    if not cap_text:
        return img
    d = ImageDraw.Draw(img)
    x, y, w, h = 70, 1572, W - 140, 150
    # Shadow
    d.rounded_rectangle((x, y + 8, x + w, y + h + 8), radius=24, fill=(180, 195, 185))
    # Main Box
    d.rounded_rectangle((x, y, x + w, y + h), radius=24, fill=CAPTION_BG)
    cfnt = font(42, bold=True)
    lines = cap_text.split("\n")
    if len(lines) == 1:
        lines = wrap(d, cap_text, cfnt, w - 60)
    line_h = cfnt.size + 14
    total_h = len(lines) * line_h - 14
    yy = y + (h - total_h) / 2
    for line in lines:
        bounds = d.textbbox((0, 0), line, font=cfnt)
        xx = x + (w - (bounds[2] - bounds[0])) / 2
        d.text((xx, yy), line, font=cfnt, fill=(255, 250, 240))
        yy += line_h
    return img

def draw_card(d, x, y, w, h, border_col=CARD_BORDER, shadow_col=SHADOW_GREEN):
    # Offset shadow
    d.rounded_rectangle((x + 10, y + 12, x + w + 10, y + h + 12), radius=28, fill=shadow_col)
    # Card surface
    d.rounded_rectangle((x, y, x + w, y + h), radius=28, fill=CARD_BG, outline=border_col, width=4)

def paste_alpha(canvas, asset_path, pos, max_size=None):
    p = Path(asset_path)
    if not p.exists():
        return
    asset = Image.open(p).convert("RGBA")
    if max_size:
        asset.thumbnail(max_size, Image.Resampling.LANCZOS)
    canvas.paste(asset, pos, asset)

# ----------------- SCENE BUILDERS ----------------- #

def render_b1(seg_idx):
    img = create_base_paper()
    d = ImageDraw.Draw(img)
    draw_header(d, show_spine=False)
    draw_heading(d, "", "แอปที่คุยด้วยแชท", "ทำได้ยังไง?")
    
    # Phone frame
    px, py, pw, ph = 242, 370, 596, 668
    d.rounded_rectangle((px + 12, py + 14, px + pw + 12, py + ph + 14), radius=44, fill=SHADOW_GREEN)
    d.rounded_rectangle((px, py, px + pw, py + ph), radius=44, fill=(243, 238, 224), outline=INK_COLOR, width=8)
    
    # Inner phone image
    screen_img = "app-chat-a.jpg" if seg_idx >= 1 else "app-chat-q.jpg"
    screen_path = ROOT / "assets" / screen_img
    if screen_path.exists():
        simg = Image.open(screen_path).resize((580, 652), Image.Resampling.LANCZOS)
        img.paste(simg, (px + 8, py + 8))
        
    # Question chips below phone
    if seg_idx >= 2:
        chips = ["เตรียมอะไร?", "เชื่อมตรงไหน?", "ส่งคำขอยังไง?"]
        cx = 90
        for chip in chips:
            cfnt = font(36, bold=True)
            cbb = d.textbbox((0, 0), chip, font=cfnt)
            cw = cbb[2] - cbb[0] + 56
            d.rounded_rectangle((cx, 1300, cx + cw, 1374), radius=37, fill=INK_COLOR)
            d.text((cx + 28, 1314), chip, font=cfnt, fill=(255, 250, 240))
            cx += cw + 20
            
    return img

def render_b2(seg_idx):
    img = create_base_paper()
    d = ImageDraw.Draw(img)
    draw_header(d, show_spine=False)
    draw_heading(d, "", "ภาพรวมทั้งหมด", "API คืออะไร · ใครคุยกับใคร")
    
    if seg_idx == 0:
        # Concept nodes: App -> LangMind
        # Node 1
        draw_card(d, 150, 430, 780, 160)
        d.text((220, 460), "แอปของคุณ", font=font(46, bold=True), fill=INK_COLOR)
        d.text((220, 520), "= พนักงานหน้าร้าน", font=font(34, bold=True), fill=OCHRE)
        
        # Arrows
        d.text((220, 680), "ส่งคำขอ (ส่งออร์เดอร์)", font=font(34, bold=True), fill=INK_COLOR)
        d.text((640, 680), "รับผลลัพธ์ (รับคำตอบ)", font=font(34, bold=True), fill=INK_COLOR)
        d.line((490, 620, 490, 830), fill=GREEN_PRIMARY, width=8)
        d.polygon([(475, 810), (490, 840), (505, 810)], fill=GREEN_PRIMARY)
        d.line((570, 620, 570, 830), fill=TEAL, width=8)
        d.polygon([(555, 640), (570, 610), (585, 640)], fill=TEAL)
        
        # Node 2
        draw_card(d, 150, 880, 780, 180)
        paste_alpha(img, ROOT / "assets" / "langmind-logo.png", (190, 915), (100, 100))
        d.text((310, 910), "LangMind", font=font(46, bold=True), fill=INK_COLOR)
        d.text((310, 970), "= สมอง / ครัวประมวลผล", font=font(34, bold=True), fill=OCHRE)
    else:
        # 3 Tiers Architecture
        # Node 1: App Frontend
        draw_card(d, 90, 400, 900, 150)
        d.text((150, 425), "แอปมือถือ / Frontend", font=font(44, bold=True), fill=INK_COLOR)
        d.text((150, 480), "รับคำถามจากผู้ใช้ · แสดงผลหน้าต่างแชท", font=font(30), fill=(78, 107, 94))
        
        # Lane 1
        d.text((160, 600), "คำถาม", font=font(32, bold=True), fill=INK_COLOR)
        d.line((490, 570, 490, 680), fill=GREEN_PRIMARY, width=6)
        d.polygon([(478, 665), (490, 685), (502, 665)], fill=GREEN_PRIMARY)
        d.line((570, 570, 570, 680), fill=TEAL, width=6)
        d.polygon([(558, 585), (570, 565), (582, 585)], fill=TEAL)
        d.text((640, 600), "คำตอบ", font=font(32, bold=True), fill=INK_COLOR)
        
        # Node 2: Backend Server
        draw_card(d, 90, 710, 900, 160)
        d.text((150, 735), "ระบบหลังบ้านของคุณ (Backend)", font=font(44, bold=True), fill=INK_COLOR)
        d.text((150, 790), "เก็บ Personal API Key ปลอดภัย", font=font(30), fill=(78, 107, 94))
        # Key Badge
        d.rounded_rectangle((740, 745, 930, 805), radius=20, fill=(220, 239, 227))
        d.text((770, 755), "🔒 Key", font=font(30, bold=True), fill=(47, 106, 76))
        
        # Lane 2
        d.line((490, 890, 490, 1020), fill=GREEN_PRIMARY, width=6)
        d.polygon([(478, 1005), (490, 1025), (502, 1005)], fill=GREEN_PRIMARY)
        d.line((570, 890, 570, 1020), fill=TEAL, width=6)
        d.polygon([(558, 905), (570, 885), (582, 905)], fill=TEAL)
        if seg_idx == 2:
            d.rounded_rectangle((100, 915, 270, 965), radius=20, fill=GREEN_PRIMARY)
            d.text((120, 922), "1 ส่งคำขอ", font=font(28, bold=True), fill=(255, 255, 255))
            d.rounded_rectangle((100, 975, 270, 1025), radius=20, fill=OCHRE)
            d.text((120, 982), "2 สตรีมผล", font=font(28, bold=True), fill=(255, 255, 255))
            d.rounded_rectangle((650, 945, 820, 995), radius=20, fill=TEAL)
            d.text((670, 952), "3 คุยต่อ", font=font(28, bold=True), fill=(255, 255, 255))
            
        # Node 3: LangMind
        draw_card(d, 90, 1050, 900, 160)
        paste_alpha(img, ROOT / "assets" / "langmind-logo.png", (140, 1080), (100, 100))
        d.text((260, 1075), "LangMind Chat API", font=font(44, bold=True), fill=INK_COLOR)
        d.text((260, 1130), "Agent · Server-Sent Events (SSE)", font=font(30), fill=(78, 107, 94))
        
    return img

def render_b3(seg_idx):
    img = create_base_paper()
    d = ImageDraw.Draw(img)
    draw_header(d, show_spine=True, active_phase=1)
    draw_heading(d, "1", "เตรียม", "ต้องมี 3 อย่าง")
    
    # Card 1: Agent
    draw_card(d, 90, 410, 900, 240)
    d.text((140, 440), "Agent ใน LangMind", font=font(42, bold=True), fill=INK_COLOR)
    d.text((140, 495), "ตั้งค่า Prompt คำแนะนำ และ Knowledge คลังความรู้", font=font(30), fill=(78, 107, 94))
    # Switch
    d.text((140, 560), "แท็บตั้งค่า → กด Publish", font=font(32, bold=True), fill=INK_COLOR)
    d.rounded_rectangle((560, 555, 644, 601), radius=23, fill=GREEN_PRIMARY)
    d.ellipse((600, 560, 636, 596), fill=(255, 255, 255))
    d.rounded_rectangle((680, 552, 850, 604), radius=22, fill=GREEN_PRIMARY)
    d.text((710, 560), "publish ✓", font=font(30, bold=True), fill=(255, 255, 255))
    
    # Card 2: API Key
    draw_card(d, 90, 680, 900, 190)
    d.text((140, 710), "Personal API Key", font=font(42, bold=True), fill=INK_COLOR)
    d.text((140, 765), "สิทธิ์การเข้าถึง (Scope):", font=font(30), fill=(78, 107, 94))
    d.rounded_rectangle((480, 760, 700, 810), radius=20, fill=(238, 242, 234))
    d.text((505, 766), "chat:invoke", font=font(28, bold=True), fill=(47, 106, 76))
    
    # Card 3: Backend Server
    draw_card(d, 90, 900, 900, 190)
    d.text((140, 930), "ระบบหลังบ้าน (Backend Server)", font=font(42, bold=True), fill=INK_COLOR)
    d.text((140, 985), "เก็บ Key เป็น Secret อย่างปลอดภัย · เรียก API แทนหน้าบ้าน", font=font(30), fill=(78, 107, 94))
    
    paste_alpha(img, ROOT / "assets" / "01-question.png", (W - 320, 1140), (240, 280))
    return img

def render_b4(seg_idx):
    img = create_base_paper()
    d = ImageDraw.Draw(img)
    draw_header(d, show_spine=True, active_phase=2)
    draw_heading(d, "2", "เชื่อม", "กลุ่มที่ 1 · ส่งข้อความ")
    
    # Minimap
    d.rounded_rectangle((70, 350, W - 70, 420), radius=22, fill=(252, 250, 241), outline=(183, 197, 188), width=3)
    d.text((100, 368), "📱 แอป  ─  🔒 หลังบ้าน  ─", font=font(30, bold=True), fill=(78, 107, 94))
    d.rounded_rectangle((440, 360, 680, 410), radius=20, fill=GREEN_PRIMARY)
    d.text((465, 368), "1 · ส่งข้อความ", font=font(28, bold=True), fill=(255, 255, 255))
    d.text((710, 368), "─  LangMind", font=font(30, bold=True), fill=(78, 107, 94))
    
    # Call 1: SSE
    draw_card(d, 70, 470, W - 140, 260, border_col=GREEN_PRIMARY if seg_idx == 0 else CARD_BORDER)
    d.rounded_rectangle((110, 500, 210, 546), radius=15, fill=GREEN_PRIMARY)
    d.text((125, 506), "POST", font=font(24, bold=True), fill=(255, 255, 255))
    d.text((230, 504), "/api/chat/message", font=font(36, bold=True), fill=INK_COLOR)
    d.text((110, 570), "SSE Stream (ค่าเริ่มต้น)", font=font(32, bold=True), fill=GREEN_PRIMARY)
    d.text((110, 620), "ทยอยสตรีมคำตอบกลับมาแบบ real-time ผ่าน Server-Sent Events", font=font(28), fill=(51, 77, 66))
    
    # Call 2: Blocking
    draw_card(d, 70, 760, W - 140, 260, border_col=OCHRE if seg_idx == 1 else CARD_BORDER)
    d.rounded_rectangle((110, 790, 210, 836), radius=15, fill=OCHRE)
    d.text((125, 796), "POST", font=font(24, bold=True), fill=(255, 255, 255))
    d.text((230, 794), "/api/chat/message/blocking", font=font(36, bold=True), fill=INK_COLOR)
    d.text((110, 860), "JSON ก้อนเดียว (Blocking)", font=font(32, bold=True), fill=OCHRE)
    d.text((110, 910), "รอประมวลผลจนเสร็จสมบูรณ์ แล้วส่งคำตอบเต็มกลับครั้งเดียว", font=font(28), fill=(51, 77, 66))
    
    # Card 3: Preview & Stop
    draw_card(d, 70, 1050, W - 140, 160)
    d.text((110, 1080), "• POST /api/chat/preview (Builder Channel Web)", font=font(28, bold=True), fill=INK_COLOR)
    d.text((110, 1130), "• POST /api/chat/messages/{id}/stop (สั่งหยุด stream)", font=font(28, bold=True), fill=INK_COLOR)
    
    return img

def render_b5(seg_idx):
    img = create_base_paper()
    d = ImageDraw.Draw(img)
    draw_header(d, show_spine=True, active_phase=2)
    draw_heading(d, "2", "เชื่อม", "กลุ่มที่ 2 · จัดการประวัติ")
    
    # Minimap
    d.rounded_rectangle((70, 350, W - 70, 420), radius=22, fill=(252, 250, 241), outline=(183, 197, 188), width=3)
    d.text((100, 368), "📱 แอป  ─  🔒 หลังบ้าน  ─", font=font(30, bold=True), fill=(78, 107, 94))
    d.rounded_rectangle((440, 360, 680, 410), radius=20, fill=OCHRE)
    d.text((455, 368), "2 · จัดการประวัติ", font=font(28, bold=True), fill=(255, 255, 255))
    d.text((710, 368), "─  LangMind", font=font(30, bold=True), fill=(78, 107, 94))
    
    # Notice
    d.rounded_rectangle((70, 450, W - 70, 515), radius=16, fill=(255, 242, 214), outline=OCHRE, width=2)
    d.text((100, 466), "⚠️ เงื่อนไขสำคัญ: การอ่านหรือแก้บทสนทนา ต้องระบุ agent_id เสมอ", font=font(28, bold=True), fill=(141, 96, 16))
    
    # Card 1: Read routes
    draw_card(d, 70, 545, W - 140, 320, border_col=GREEN_PRIMARY if seg_idx == 0 else CARD_BORDER)
    d.text((110, 575), "1. เรียกอ่านประวัติบทสนทนา", font=font(36, bold=True), fill=INK_COLOR)
    d.text((110, 630), "GET /api/chat/conversations", font=font(30, bold=True), fill=GREEN_PRIMARY)
    d.text((110, 675), "GET /api/chat/conversations/{id}", font=font(30, bold=True), fill=GREEN_PRIMARY)
    d.text((110, 720), "GET /api/chat/conversations/{id}/messages", font=font(30, bold=True), fill=GREEN_PRIMARY)
    d.text((110, 780), "รองรับ cursor pagination และ limit เพื่อดึงข้อความย้อนหลัง", font=font(28), fill=(78, 107, 94))
    
    # Card 2: Manage & Delete
    draw_card(d, 70, 895, W - 140, 310, border_col=RED_ACCENT if seg_idx == 1 else CARD_BORDER)
    d.text((110, 925), "2. แก้ไขชื่อห้อง และการลบถาวร", font=font(36, bold=True), fill=INK_COLOR)
    d.text((110, 980), "PATCH /api/chat/conversations/{id} (แก้ชื่อ/สถานะ)", font=font(30, bold=True), fill=OCHRE)
    d.text((110, 1025), "DELETE /api/chat/conversations/{id} (ลบถาวร)", font=font(30, bold=True), fill=RED_ACCENT)
    d.rounded_rectangle((110, 1085, W - 110, 1160), radius=12, fill=(247, 225, 220))
    d.text((130, 1102), "⚠️ คำเตือน: DELETE เป็นการลบถาวร ไม่สามารถกู้คืนได้", font=font(28, bold=True), fill=RED_ACCENT)
    
    return img

def render_b6(seg_idx):
    img = create_base_paper()
    d = ImageDraw.Draw(img)
    draw_header(d, show_spine=True, active_phase=2)
    draw_heading(d, "2", "เชื่อม", "กลุ่มที่ 3 · ส่วนเสริม")
    
    # Minimap
    d.rounded_rectangle((70, 350, W - 70, 420), radius=22, fill=(252, 250, 241), outline=(183, 197, 188), width=3)
    d.text((100, 368), "📱 แอป  ─  🔒 หลังบ้าน  ─", font=font(30, bold=True), fill=(78, 107, 94))
    d.rounded_rectangle((440, 360, 680, 410), radius=20, fill=TEAL)
    d.text((455, 368), "3 · ส่วนเสริม", font=font(28, bold=True), fill=(255, 255, 255))
    d.text((710, 368), "─  LangMind", font=font(30, bold=True), fill=(78, 107, 94))
    
    # Card 1: Feedback
    draw_card(d, 70, 460, W - 140, 310, border_col=GREEN_PRIMARY if seg_idx == 0 else CARD_BORDER)
    d.text((110, 495), "1. ให้คะแนนคำตอบ (Feedback)", font=font(38, bold=True), fill=INK_COLOR)
    d.text((110, 555), "POST /api/chat/messages/{id}/feedback", font=font(32, bold=True), fill=GREEN_PRIMARY)
    d.text((110, 615), "ส่งคะแนนประเมินคุณภาพคำตอบของแต่ละข้อความ:", font=font(28), fill=(78, 107, 94))
    d.text((140, 670), "👍 rating: 1 (ชอบ)    👎 rating: -1 (ไม่ชอบ)", font=font(34, bold=True), fill=INK_COLOR)
    
    # Card 2: Generated files
    draw_card(d, 70, 800, W - 140, 320, border_col=TEAL if seg_idx == 1 else CARD_BORDER)
    d.text((110, 835), "2. ดาวน์โหลดไฟล์ที่สร้างขึ้น", font=font(38, bold=True), fill=INK_COLOR)
    d.text((110, 895), "GET /api/chat/messages/{id}/generated-files/{file_id}", font=font(28, bold=True), fill=TEAL)
    d.text((110, 955), "ดาวน์โหลดเอกสาร PDF, Excel หรือรูปภาพที่ Agent สร้าง", font=font(28), fill=(78, 107, 94))
    d.rounded_rectangle((110, 1025, W - 110, 1085), radius=16, fill=(228, 237, 230))
    d.text((140, 1040), "✓ ทุก Chat Endpoint ใช้สิทธิ์ Scope เดียวกัน: chat:invoke", font=font(28, bold=True), fill=(47, 94, 70))
    
    return img

def render_b7(seg_idx):
    img = create_base_paper()
    d = ImageDraw.Draw(img)
    draw_header(d, show_spine=True, active_phase=3)
    draw_heading(d, "3", "ลองส่ง", "ยิงคำขอแรกด้วย cURL")
    
    # Minimap
    d.rounded_rectangle((70, 350, W - 70, 420), radius=22, fill=(252, 250, 241), outline=(183, 197, 188), width=3)
    d.text((100, 368), "📱 แอป  ─  🔒 หลังบ้าน  ─", font=font(30, bold=True), fill=(78, 107, 94))
    d.rounded_rectangle((440, 360, 680, 410), radius=20, fill=GREEN_PRIMARY)
    d.text((455, 368), "1 · ส่งคำขอแรก", font=font(28, bold=True), fill=(255, 255, 255))
    d.text((710, 368), "─  LangMind", font=font(30, bold=True), fill=(78, 107, 94))
    
    # Slot-in Chip
    d.rounded_rectangle((70, 460, W - 70, 550), radius=22, fill=(255, 250, 240), outline=CARD_BORDER, width=4)
    d.text((110, 485), "💬 ช่วยร่างข้อความแจ้งทีมว่าเลื่อนประชุมเป็น 15:00 น. ให้สุภาพ", font=font(32, bold=True), fill=INK_COLOR)
    
    # Arrow
    d.line((W // 2, 570, W // 2, 630), fill=GREEN_PRIMARY, width=6)
    d.polygon([(W // 2 - 12, 615), (W // 2, 635), (W // 2 + 12, 615)], fill=GREEN_PRIMARY)
    
    # Code Card
    draw_card(d, 70, 650, W - 140, 620, border_col=GREEN_PRIMARY)
    d.rectangle((74, 654, W - 74, 730), fill=CODE_BG)
    d.text((110, 675), "POST", font=font(26, bold=True), fill=GREEN_PRIMARY)
    d.text((200, 675), "/api/chat/message", font=font(32, bold=True), fill=(255, 255, 255))
    d.text((750, 675), "chat:invoke", font=font(26, bold=True), fill=(191, 229, 204))
    
    # Code lines
    d.rectangle((74, 730, W - 74, 1220), fill=CODE_BG)
    code_text = [
        ("Authorization: Bearer $LM_TOKEN", (233, 239, 230)),
        ("Content-Type: application/json", (233, 239, 230)),
        ("--data '{", (233, 239, 230)),
        ('  "agent_id": "<AGENT_ID>",', (159, 211, 180)),
        ('  "query": "ช่วยร่างข้อความ...",', (242, 213, 138)),
        ('  "conversation_id": null,', (217, 130, 43)),
        ('  "attachment_ids": [] }', (233, 239, 230))
    ]
    cy = 760
    for line, col in code_text:
        d.text((110, cy), line, font=font(30, bold=True), fill=col)
        cy += 50
        
    d.line((74, 1140, W - 74, 1140), fill=(74, 90, 82), width=2)
    d.text((110, 1170), "💡 จุดสำคัญ: ส่ง \"conversation_id\": null เพื่อเริ่มบทสนทนาใหม่", font=font(28, bold=True), fill=(217, 130, 43))
    
    return img

def render_b8(seg_idx):
    img = create_base_paper()
    d = ImageDraw.Draw(img)
    draw_header(d, show_spine=True, active_phase=3)
    draw_heading(d, "3", "ลองส่ง", "รับผลแบบ SSE Stream")
    
    # Minimap
    d.rounded_rectangle((70, 350, W - 70, 420), radius=22, fill=(252, 250, 241), outline=(183, 197, 188), width=3)
    d.text((100, 368), "📱 แอป  ─  🔒 หลังบ้าน  ─", font=font(30, bold=True), fill=(78, 107, 94))
    d.rounded_rectangle((440, 360, 680, 410), radius=20, fill=GREEN_PRIMARY)
    d.text((455, 368), "2 · อ่านผลสตรีม", font=font(28, bold=True), fill=(255, 255, 255))
    d.text((710, 368), "─  LangMind", font=font(30, bold=True), fill=(78, 107, 94))
    
    # SSE Event list
    events = [
        ("event: message_start", '{ "conversation_id": "conv_123", "message_id": "msg_01" }', 0),
        ("event: message", '{ "answer": "ขอแจ้งเลื่อนประชุมเป็นเวลา 15:00 น. ขอบคุณครับ" }', 1),
        ("event: message_end", '{ "answer": "...", "usage": { "total_tokens": 78 } }', 2)
    ]
    ey = 460
    for title, payload, req_seg in events:
        is_active = (seg_idx >= req_seg)
        border_col = GREEN_PRIMARY if is_active else CARD_BORDER
        draw_card(d, 70, ey, W - 140, 180, border_col=border_col)
        d.text((110, ey + 25), title, font=font(34, bold=True), fill=INK_COLOR if is_active else (140, 160, 150))
        d.rounded_rectangle((110, ey + 80, W - 110, ey + 150), radius=12, fill=(235, 242, 238) if is_active else (245, 247, 246))
        d.text((130, ey + 95), payload, font=font(26, bold=True), fill=(47, 106, 76) if is_active else (150, 160, 155))
        ey += 210
        
    # Result chip
    if seg_idx >= 2:
        d.rounded_rectangle((70, 1120, W - 70, 1220), radius=22, fill=(238, 248, 242), outline=GREEN_PRIMARY, width=3)
        d.text((110, 1145), "✓ แอปนำคำตอบไปแสดงผล และเก็บ conversation_id ไว้คุยต่อ", font=font(30, bold=True), fill=(47, 106, 76))
        
    return img

def render_b9(seg_idx):
    img = create_base_paper()
    d = ImageDraw.Draw(img)
    draw_header(d, show_spine=True, active_phase=3)
    draw_heading(d, "3", "ลองส่ง", "คุยต่อในเรื่องเดิม")
    
    # Minimap
    d.rounded_rectangle((70, 350, W - 70, 420), radius=22, fill=(252, 250, 241), outline=(183, 197, 188), width=3)
    d.text((100, 368), "📱 แอป  ─  🔒 หลังบ้าน  ─", font=font(30, bold=True), fill=(78, 107, 94))
    d.rounded_rectangle((440, 360, 680, 410), radius=20, fill=TEAL)
    d.text((455, 368), "3 · ถามต่อ", font=font(28, bold=True), fill=(255, 255, 255))
    d.text((710, 368), "─  LangMind", font=font(30, bold=True), fill=(78, 107, 94))
    
    # Slot-in
    d.rounded_rectangle((70, 460, W - 70, 550), radius=22, fill=(238, 246, 244), outline=TEAL, width=3)
    d.text((110, 485), "💬 ขอให้สั้นลงอีกนิด (คำถามต่อในเรื่องเดิม)", font=font(32, bold=True), fill=TEAL)
    
    # Code Card
    draw_card(d, 70, 580, W - 140, 420, border_col=TEAL)
    d.rectangle((74, 584, W - 74, 650), fill=CODE_BG)
    d.text((110, 605), "POST /api/chat/message", font=font(30, bold=True), fill=(255, 255, 255))
    d.rectangle((74, 650, W - 74, 980), fill=CODE_BG)
    
    lines = [
        ('--data \'{', (233, 239, 230)),
        ('  "agent_id": "<AGENT_ID>",', (159, 211, 180)),
        ('  "query": "ขอให้สั้นลงอีกนิด",', (242, 213, 138)),
        ('  "conversation_id": "conv_123" }\'', (46, 196, 182))
    ]
    cy = 680
    for line, col in lines:
        d.text((110, cy), line, font=font(32, bold=True), fill=col)
        cy += 54
        
    # Result Box
    if seg_idx >= 1:
        d.rounded_rectangle((70, 1030, W - 70, 1140), radius=22, fill=(255, 250, 240), outline=GREEN_PRIMARY, width=4)
        d.text((110, 1055), "Agent: “ประชุมเลื่อนเป็น 15:00 น. นะครับ”", font=font(36, bold=True), fill=INK_COLOR)
        d.rounded_rectangle((70, 1170, W - 70, 1250), radius=18, fill=(238, 246, 244), outline=TEAL, width=2)
        d.text((100, 1195), "🔗 ส่ง conversation_id เดิม Agent จะจำบริบทเดิมได้ทันที", font=font(28, bold=True), fill=TEAL)
        
    paste_alpha(img, ROOT / "assets" / "05-point-up.png", (W - 320, 1120), (240, 280))
    return img

def render_b10(seg_idx):
    img = create_base_paper()
    d = ImageDraw.Draw(img)
    draw_header(d, show_spine=False)
    draw_heading(d, "", "สรุปภาพรวม", "3 หัวใจสำคัญ & LangMind")
    
    if seg_idx == 0:
        # 3 Recap cards
        draw_card(d, 90, 410, 900, 220, border_col=GREEN_PRIMARY)
        d.text((140, 440), "1. เลือก Endpoint ให้ตรงงาน", font=font(40, bold=True), fill=GREEN_PRIMARY)
        d.text((140, 500), "• ใช้ SSE Stream เมื่อต้องการแสดงผลแชทสดบนหน้าจอ\n• ใช้ Blocking เมื่อต้องการรับ JSON คำตอบเต็มก้อนเดียว", font=font(28), fill=INK_COLOR)
        
        draw_card(d, 90, 660, 900, 220, border_col=OCHRE)
        d.text((140, 690), "2. ปลอดภัยที่ระบบหลังบ้าน", font=font(40, bold=True), fill=OCHRE)
        d.text((140, 750), "• เก็บ Personal API Key ฝั่ง Server เท่านั้น ห้ามใส่ใน Client\n• ทุก Chat Endpoint ใช้ Scope เดียวกัน: chat:invoke", font=font(28), fill=INK_COLOR)
        
        draw_card(d, 90, 910, 900, 220, border_col=TEAL)
        d.text((140, 940), "3. ส่ง conversation_id เพื่อคุยต่อ", font=font(40, bold=True), fill=TEAL)
        d.text((140, 1000), "• ส่ง null เพื่อเปิดบทสนทนาใหม่\n• ส่ง ID เดิมเมื่อต้องการปรับคำตอบหรือคุยต่อในเรื่องเดิม", font=font(28), fill=INK_COLOR)
    else:
        # Sponsor / Outro Card
        paste_alpha(img, ROOT / "assets" / "langmind-logo.png", (W // 2 - 240, 460), (480, 240))
        d.text((W // 2 - 120, 750), "สนับสนุนโดย", font=font(40, bold=True), fill=(78, 107, 94))
        d.text((W // 2 - 280, 830), "LangMind Chat API", font=font(64, bold=True), fill=INK_COLOR)
        d.rounded_rectangle((W // 2 - 250, 930, W // 2 + 250, 1030), radius=50, fill=INK_COLOR)
        d.text((W // 2 - 180, 955), "langmind.in.th", font=font(56, bold=True), fill=(255, 255, 255))
        paste_alpha(img, ROOT / "assets" / "10-thumbs-up.png", (W // 2 - 140, 1080), (280, 300))
        
    return img

SCENE_RENDERERS = {
    "b1": render_b1,
    "b2": render_b2,
    "b3": render_b3,
    "b4": render_b4,
    "b5": render_b5,
    "b6": render_b6,
    "b7": render_b7,
    "b8": render_b8,
    "b9": render_b9,
    "b10": render_b10,
}

def build_all_plates():
    # Read timing calculations from build.mjs output
    # Each segment becomes a distinct plate
    stages = []
    plate_idx = 0
    for beat in CFG["beats"]:
        bid = beat["id"]
        renderer = SCENE_RENDERERS[bid]
        for si, seg in enumerate(beat["segments"]):
            plate_idx += 1
            file_name = f"stage_{plate_idx:02d}_{bid}_s{si}.png"
            plate_path = PLATES_DIR / file_name
            img = renderer(si)
            img = add_caption(img, seg["cap"])
            img.save(plate_path, format="PNG")
            
            # Segment duration in frames
            say_len = len(seg["say"].replace(" ", ""))
            dur_sec = (say_len / CFG["chars_per_second"]) + 0.35
            frames = max(30, int(round(dur_sec * FPS)))
            stages.append((plate_path, frames, seg["cap"]))
            print(f"Generated {file_name} ({frames} frames)")
            
    return stages

def render_video(stages):
    ffmpeg = which("ffmpeg")
    if not ffmpeg:
        raise RuntimeError("ffmpeg not found on PATH")
    output = ROOT / "renders" / "ep03-v4.1.mp4"
    output.parent.mkdir(parents=True, exist_ok=True)
    
    args = [ffmpeg, "-y", "-hide_banner", "-loglevel", "warning"]
    for image, frames, _ in stages:
        args.extend(["-loop", "1", "-framerate", str(FPS), "-t", f"{frames / FPS:.6f}", "-i", str(image)])
        
    filters = []
    for i, (_, frames, _) in enumerate(stages):
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
    # Sample 8 frames
    indices = [0, 3, 6, 9, 12, 15, 19, 23]
    sampled = [stages[i][0] for i in indices]
    cols, rows = 4, 2
    cell_w, cell_h = 270, 480
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
    print("Building all plates matching EP04 v3 Orus style...")
    stages = build_all_plates()
    print("Rendering video MP4 via ffmpeg...")
    out_file = render_video(stages)
    generate_contact_sheet(stages)
    total_frames = sum(frames for _, frames, _ in stages)
    print(f"SUCCESS: Wrote {out_file} ({len(stages)} stages, {total_frames / FPS:.3f}s @ {FPS}fps, silent)")

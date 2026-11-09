from __future__ import annotations

import hashlib
import json
import math
import subprocess
from pathlib import Path
from shutil import which

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parent
CFG = json.loads((ROOT / "timing.json").read_text(encoding="utf-8"))
ASSETS = ROOT / "assets"
PLATES = ROOT / "assets" / "plates" / "v4.2"
REVIEW = ROOT / "renders" / "review"
PLATES.mkdir(parents=True, exist_ok=True)
REVIEW.mkdir(parents=True, exist_ok=True)

W, H, FPS = CFG["width"], CFG["height"], CFG["fps"]
PAPER = (248, 245, 235)
RULE = (230, 225, 213)
INK = (25, 43, 57)
SAGE = (43, 108, 89)
SAGE_DARK = (24, 58, 50)
SAGE_PALE = (228, 240, 234)
TEAL = (31, 123, 122)
OCHRE = (163, 124, 49)
RED = (163, 61, 49)
MUTED = (91, 111, 119)
CARD = (255, 253, 248)
CARD_EDGE = (196, 211, 204)
CODE_BG = (22, 34, 44)
CODE_FG = (236, 244, 240)
CODE_MUTE = (149, 172, 166)

FONT_REG = str(ASSETS / "fonts" / "Sarabun-Regular.ttf")
FONT_BOLD = str(ASSETS / "fonts" / "Sarabun-Bold.ttf")
FONT_CODE = str(Path("C:/Windows/Fonts/consola.ttf"))
if not Path(FONT_CODE).exists():
    FONT_CODE = FONT_REG


def f(size: int, bold: bool = False, code: bool = False):
    return ImageFont.truetype(FONT_CODE if code else (FONT_BOLD if bold else FONT_REG), size)


def text_width(draw, text, font):
    b = draw.textbbox((0, 0), text, font=font)
    return b[2] - b[0]


def wrap_words(draw, text, font, max_width):
    out = []
    for para in text.split("\n"):
        if para == "":
            out.append("")
            continue
        line = ""
        for word in para.split(" "):
            trial = word if not line else line + " " + word
            if text_width(draw, trial, font) <= max_width:
                line = trial
            else:
                if line:
                    out.append(line)
                line = word
        if line:
            out.append(line)
    return out


def draw_centered(draw, xy, text, font, fill, max_width=None, line_gap=8):
    x, y = xy
    lines = wrap_words(draw, text, font, max_width) if max_width else text.split("\n")
    line_h = font.size + line_gap
    for line in lines:
        w = text_width(draw, line, font)
        draw.text((x - w / 2, y), line, font=font, fill=fill)
        y += line_h
    return y


def base_frame(beat, caption):
    img = Image.new("RGB", (W, H), PAPER)
    d = ImageDraw.Draw(img)
    for y in range(250, 1440, 64):
        d.line((42, y, W - 42, y), fill=RULE, width=2)
    d.rounded_rectangle((26, 26, W - 26, H - 26), radius=30, outline=(224, 218, 205), width=3)
    d.text((72, 76), "LANGMIND  ·  EP03 / CHAT API", font=f(29, True), fill=SAGE)
    d.text((W - 160, 80), f"{beat:02d} / 09", font=f(26, True), fill=MUTED)
    d.line((74, 132, W - 74, 132), fill=(211, 218, 207), width=2)
    d.rounded_rectangle((72, 158, W - 72, 202), radius=18, fill=(232, 241, 235))
    phase = CFG["beats"][beat - 1]["phase"]
    steps = [("1 · เข้าใจแชท", 72, 358), ("2 · รู้จัก API", 376, 682), ("3 · ลองเชื่อม", 700, 1008)]
    for ix, (label, x1, x2) in enumerate(steps, 1):
        on = ix == phase
        fill = [SAGE, OCHRE, TEAL][ix - 1] if on else (245, 248, 244)
        color = (255, 255, 255) if on else MUTED
        d.rounded_rectangle((x1, 162, x2, 198), radius=14, fill=fill)
        d.text((x1 + 14, 166), label, font=f(22, True), fill=color)

    title = CFG["beats"][beat - 1]["title"]
    draw_centered(d, (W / 2, 232), title, f(57, True), INK, max_width=920, line_gap=2)
    draw_caption(img, caption)
    return img


def draw_caption(img, caption):
    d = ImageDraw.Draw(img)
    x, y, w, h = 66, 1502, W - 132, 230
    d.rounded_rectangle((x + 8, y + 9, x + w + 8, y + h + 9), radius=28, fill=(204, 215, 207))
    d.rounded_rectangle((x, y, x + w, y + h), radius=28, fill=SAGE_DARK)
    lines = wrap_words(d, caption, f(42, True), w - 64)
    line_h = 56
    yy = y + (h - len(lines) * line_h) / 2 + 4
    for line in lines:
        tw = text_width(d, line, f(42, True))
        d.text((x + (w - tw) / 2, yy), line, font=f(42, True), fill=(255, 255, 250))
        yy += line_h


def card(d, box, fill=CARD, edge=CARD_EDGE, radius=28, shadow=True):
    x1, y1, x2, y2 = box
    if shadow:
        d.rounded_rectangle((x1 + 8, y1 + 10, x2 + 8, y2 + 10), radius=radius, fill=(213, 221, 208))
    d.rounded_rectangle(box, radius=radius, fill=fill, outline=edge, width=3)


def arrow(d, p1, p2, fill=SAGE, width=7):
    d.line((p1, p2), fill=fill, width=width)
    x1, y1 = p1
    x2, y2 = p2
    if abs(y2 - y1) >= abs(x2 - x1):
        if y2 >= y1:
            d.polygon([(x2 - 12, y2 - 19), (x2, y2), (x2 + 12, y2 - 19)], fill=fill)
        else:
            d.polygon([(x2 - 12, y2 + 19), (x2, y2), (x2 + 12, y2 + 19)], fill=fill)
    elif x2 >= x1:
        d.polygon([(x2 - 19, y2 - 12), (x2, y2), (x2 - 19, y2 + 12)], fill=fill)
    else:
        d.polygon([(x2 + 19, y2 - 12), (x2, y2), (x2 + 19, y2 + 12)], fill=fill)


def label_pill(d, box, text, fill=SAGE_PALE, color=SAGE_DARK, size=28):
    d.rounded_rectangle(box, radius=(box[3] - box[1]) // 2, fill=fill)
    x1, y1, x2, y2 = box
    font = f(size, True)
    lines = wrap_words(d, text, font, (x2 - x1) - 24)
    h = len(lines) * (font.size + 4)
    yy = y1 + ((y2 - y1) - h) / 2
    for line in lines:
        tw = text_width(d, line, font)
        d.text((x1 + ((x2 - x1) - tw) / 2, yy), line, font=font, fill=color)
        yy += font.size + 4


def paste_fit(img, path, box, contain=True):
    src = Image.open(path).convert("RGBA")
    x1, y1, x2, y2 = box
    bw, bh = x2 - x1, y2 - y1
    factor = min(bw / src.width, bh / src.height) if contain else max(bw / src.width, bh / src.height)
    nw, nh = round(src.width * factor), round(src.height * factor)
    src = src.resize((nw, nh), Image.Resampling.LANCZOS)
    img.paste(src, (round(x1 + (bw - nw) / 2), round(y1 + (bh - nh) / 2)), src)


def create_mock_screens():
    path = ASSETS / "screens"
    path.mkdir(parents=True, exist_ok=True)
    for second in (False, True):
        img = Image.new("RGB", (1440, 1800), (248, 248, 244))
        d = ImageDraw.Draw(img)
        d.rectangle((0, 0, 1440, 196), fill=(255, 255, 252))
        d.line((0, 196, 1440, 196), fill=(221, 229, 222), width=3)
        d.rounded_rectangle((76, 63, 134, 121), radius=18, fill=(228, 240, 234))
        d.text((91, 65), "LM", font=f(34, True), fill=SAGE)
        d.text((170, 62), "ตัวอย่างแชท", font=f(48, True), fill=INK)
        d.text((170, 124), "LangMind Assistant · ภาพจำลอง", font=f(28), fill=MUTED)
        d.rounded_rectangle((74, 232, 1366, 312), radius=28, fill=(239, 235, 222))
        draw_centered(d, (720, 247), "ภาพจำลอง · ตัวอย่างบทสนทนาสมมติ", f(27, True), (99, 90, 64), max_width=1200, line_gap=0)

        # First user turn
        d.rounded_rectangle((270, 390, 1338, 564), radius=34, fill=(54, 129, 97))
        draw_centered(d, (804, 426), "ช่วยร่างข้อความขอเลื่อนประชุมเป็นบ่ายสามให้หน่อย", f(39, True), (255, 255, 255), max_width=980, line_gap=6)
        d.rounded_rectangle((104, 626, 1118, 790), radius=34, fill=(232, 239, 235))
        draw_centered(d, (611, 667), "ขอเลื่อนเวลาประชุมเป็น 15:00 น. ได้ไหมครับ", f(39), INK, max_width=920, line_gap=4)
        if second:
            d.rounded_rectangle((270, 852, 1338, 1010), radius=34, fill=(54, 129, 97))
            draw_centered(d, (804, 894), "ช่วยย่อให้สั้นลงอีก", f(39, True), (255, 255, 255), max_width=980, line_gap=4)
            d.rounded_rectangle((104, 1070, 1118, 1234), radius=34, fill=(232, 239, 235))
            draw_centered(d, (611, 1111), "ขอเลื่อนประชุมเป็นบ่ายสามได้ไหมครับ", f(39), INK, max_width=920, line_gap=4)
        d.line((90, 1508, 1350, 1508), fill=(220, 226, 218), width=3)
        d.rounded_rectangle((96, 1560, 1344, 1690), radius=40, fill=(255, 255, 255), outline=(204, 216, 208), width=3)
        d.text((144, 1590), "เขียนข้อความ...", font=f(32), fill=(142, 155, 151))
        out = path / ("CHAT-02.png" if second else "CHAT-01.png")
        img.save(out, format="PNG", optimize=True)


def scene_chat(beat, si, cap):
    img = base_frame(beat, cap)
    d = ImageDraw.Draw(img)
    label_pill(d, (332, 328, 748, 378), "แชทตัวอย่าง · ไม่ใช่ผลเรียกจริง", size=22)
    phone = (210, 395, 870, 1280)
    card(d, phone, fill=(245, 242, 230), edge=INK, radius=46)
    d.rounded_rectangle((phone[0] + 13, phone[1] + 13, phone[2] - 13, phone[3] - 13), radius=36, fill=(248, 248, 244))
    screen = Image.open(ASSETS / "screens" / ("CHAT-02.png" if si > 0 else "CHAT-01.png")).convert("RGB")
    screen = screen.resize((630, 788), Image.Resampling.LANCZOS)
    img.paste(screen, (phone[0] + 20, phone[1] + 24))
    paste_fit(img, ASSETS / "robot" / "01-question.png", (800, 1060, 1030, 1300))
    d = ImageDraw.Draw(img)
    d.text((136, 1345), "ภาพอธิบายบทสนทนาหนึ่งเรื่อง", font=f(27, True), fill=MUTED)
    return img


def scene_architecture(beat, si, cap):
    img = base_frame(beat, cap)
    d = ImageDraw.Draw(img)
    nodes = [
        ("แอปของคุณ", "รับคำถาม · แสดงผลแชท", (SAGE, 0)),
        ("ระบบหลังบ้าน", "เก็บ Key · เรียก API แทนแอป", (OCHRE, 1)),
        ("LangMind Chat API", "รับคำขอ · ส่งข้อมูลตอบกลับ", (TEAL, 2)),
        ("Agent", "สร้างคำตอบตามการตั้งค่า", (SAGE, 3)),
    ]
    y0, h, gap = 384, 184, 38
    for i, (title, sub, (accent, _)) in enumerate(nodes):
        y = y0 + i * (h + gap)
        on = (i == si + (0 if si == 0 else 1)) or (si == 1 and i in (1, 2, 3))
        edge = accent if on else CARD_EDGE
        card(d, (116, y, 964, y + h), edge=edge, radius=26)
        d.rounded_rectangle((116, y, 144, y + h), radius=12, fill=accent if on else (208, 219, 211))
        d.text((180, y + 28), title, font=f(39, True), fill=INK)
        d.text((180, y + 92), sub, font=f(29), fill=MUTED)
        if i < len(nodes) - 1:
            arrow(d, (540, y + h + 6), (540, y + h + gap - 6), TEAL if si == 1 else SAGE, 6)
    # Request travels down the center; the response returns up the outer rail.
    d.line((964, 1142, 988, 1142), fill=TEAL, width=6)
    d.line((988, 1142, 988, 476), fill=TEAL, width=6)
    arrow(d, (988, 476), (966, 476), TEAL, 6)
    d.rounded_rectangle((280, 1348, 800, 1422), radius=28, fill=(236, 241, 232))
    draw_centered(d, (540, 1360), "↓ คำถามไป  ·  ↑ คำตอบกลับ", f(28, True), SAGE_DARK, max_width=500, line_gap=0)
    return img


def scene_prepare(beat, si, cap):
    img = base_frame(beat, cap)
    d = ImageDraw.Draw(img)
    cards = [
        ("01", "Agent ที่เผยแพร่แล้ว", "ใช้ Agent เวอร์ชันที่พร้อมให้เรียก", SAGE),
        ("02", "agent_id", "ระบุ Agent ที่ต้องการคุยด้วย", OCHRE),
        ("03", "Personal API Key", "กำหนด scope: chat:invoke", TEAL),
    ]
    for i, (num, title, sub, color) in enumerate(cards):
        y = 390 + i * 280
        active = (si == 0 and i == 0) or (si == 1 and i >= 1)
        card(d, (108, y, 974, y + 218), edge=color if active else CARD_EDGE, radius=28)
        d.ellipse((140, y + 48, 218, y + 126), fill=color if active else (222, 231, 224))
        draw_centered(d, (179, y + 65), num, f(34, True), (255, 255, 255) if active else MUTED, line_gap=0)
        d.text((254, y + 42), title, font=f(39, True), fill=INK)
        d.text((254, y + 110), sub, font=f(30), fill=MUTED)
    # Backend boundary and lock; no API key value is ever shown.
    d.rounded_rectangle((154, 1260, 930, 1408), radius=30, fill=(235, 242, 236), outline=SAGE, width=3)
    d.text((194, 1280), "SERVER", font=f(24, True), fill=SAGE)
    d.text((194, 1324), "เก็บ Key เป็น secret · อย่าส่งไปฝั่ง browser", font=f(29, True), fill=INK)
    paste_fit(img, ASSETS / "robot" / "01-question.png", (830, 1012, 1000, 1210))
    return img


def scene_request(beat, si, cap):
    img = base_frame(beat, cap)
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((104, 350, 976, 438), radius=26, fill=(226, 241, 233), outline=(104, 166, 139), width=3)
    d.text((134, 368), "POST", font=f(34, True), fill=SAGE)
    d.text((266, 365), "/api/chat/message", font=f(37, True, code=True), fill=INK)
    d.text((124, 454), "Request · illustrative · ไม่ได้เรียก API จริง", font=f(26, True), fill=MUTED)
    card(d, (78, 504, 1002, 1388), fill=CODE_BG, edge=CODE_BG, radius=25, shadow=False)
    lines = [
        ("Authorization: Bearer $LM_TOKEN", 0),
        ("{", 1),
        ('  "agent_id": "{{AGENT_ID}}",', 2),
        ('  "query": "ช่วยร่างข้อความขอเลื่อนประชุมเป็นบ่ายสามให้หน่อย",', 3),
        ('  "conversation_id": null', 4),
        ("}", 5),
    ]
    visible = len(lines) if si == 1 else 4
    for j, (text, _) in enumerate(lines[:visible]):
        yy = 564 + j * 108
        col = (133, 209, 173) if "Authorization" in text else CODE_FG
        if '"conversation_id"' in text and si == 1:
            d.rounded_rectangle((108, yy - 9, 970, yy + 75), radius=18, fill=(41, 78, 66))
            col = (255, 223, 148)
        d.text((128, yy), text, font=f(23 if "ช่วยร่าง" in text else 25, code="ช่วยร่าง" not in text), fill=col)
    d.text((128, 1246), "Key อยู่ใน backend · {{AGENT_ID}} คือ placeholder", font=f(27, True), fill=(198, 219, 208))
    # Caret is a static cue marker on the progressive state; the staged plates reveal lines in order.
    if si == 0:
        d.rounded_rectangle((838, 884, 857, 936), radius=5, fill=(114, 216, 169))
    else:
        d.rounded_rectangle((858, 1014, 877, 1068), radius=5, fill=(255, 218, 130))
    return img


def scene_events(beat, si, cap):
    img = base_frame(beat, cap)
    d = ImageDraw.Draw(img)
    d.text((116, 346), "text/event-stream", font=f(28, True, code=True), fill=TEAL)
    rows = [
        ("message_start", "conversation_id · message_id", SAGE),
        ("message", "answer chunks · ทยอยส่งคำตอบ", OCHRE),
        ("citations", "อาจมีแหล่งอ้างอิงประกอบ", MUTED),
        ("message_end", "answer เต็ม · usage", TEAL),
    ]
    for i, (name, desc, color) in enumerate(rows):
        y = 405 + i * 228
        active = (si == 0 and i <= 1) or (si == 1 and i <= 2) or (si == 2 and i == 3)
        edge = color if active else CARD_EDGE
        fill = (239, 247, 241) if active else CARD
        card(d, (116, y, 964, y + 170), fill=fill, edge=edge, radius=24)
        d.ellipse((146, y + 50, 208, y + 112), fill=color if active else (218, 226, 220))
        draw_centered(d, (177, y + 65), str(i + 1), f(28, True), (255, 255, 255) if active else MUTED, line_gap=0)
        d.text((244, y + 32), name, font=f(33, True, code=True), fill=INK if active else MUTED)
        d.text((244, y + 91), desc, font=f(27), fill=MUTED)
        if i < len(rows) - 1:
            arrow(d, (540, y + 176), (540, y + 220), TEAL if active else (180, 192, 184), 5)
    d.rounded_rectangle((204, 1350, 876, 1420), radius=26, fill=(220, 239, 228))
    draw_centered(d, (540, 1364), "รอ message_end ก่อนใช้คำตอบฉบับเต็ม", f(27, True), SAGE_DARK, max_width=620, line_gap=0)
    return img


def scene_followup(beat, si, cap):
    img = base_frame(beat, cap)
    d = ImageDraw.Draw(img)
    card(d, (102, 392, 978, 640), edge=SAGE, radius=28)
    label_pill(d, (142, 420, 366, 470), "ได้รับจาก stream", size=24)
    d.text((148, 508), "conversation_id", font=f(34, True, code=True), fill=INK)
    d.text((570, 508), "[ID ที่ได้รับ]", font=f(30, True), fill=SAGE)
    arrow(d, (540, 660), (540, 778), TEAL, 9)
    card(d, (102, 806, 978, 1120), edge=TEAL if si > 0 else CARD_EDGE, radius=28)
    label_pill(d, (142, 834, 392, 884), "คำขอถามต่อ", fill=(225, 242, 240), color=TEAL, size=24)
    d.text((148, 932), '"query": "ช่วยย่อให้สั้นลงอีก"', font=f(28), fill=INK)
    d.rounded_rectangle((140, 1003, 938, 1083), radius=20, fill=(225, 242, 240))
    d.text((168, 1024), '"conversation_id":', font=f(26, True, code=True), fill=TEAL)
    d.text((535, 1023), "[ID เดิม]", font=f(27, True), fill=TEAL)
    d.rounded_rectangle((220, 1180, 860, 1288), radius=26, fill=(244, 238, 222), outline=(223, 208, 170), width=3)
    draw_centered(d, (540, 1191), "conversation_id: null", f(25, True, code=True), (118, 88, 38), line_gap=0)
    draw_centered(d, (540, 1234), "เริ่มบทสนทนาใหม่", f(25, True), (118, 88, 38), line_gap=0)
    paste_fit(img, ASSETS / "robot" / "05-point-up.png", (824, 1110, 1004, 1334))
    return img


def scene_routes(beat, si, cap):
    img = base_frame(beat, cap)
    d = ImageDraw.Draw(img)
    cards = [
        ("1 · ส่งข้อความและควบคุม", ["POST /api/chat/message", "POST /api/chat/preview", "POST /api/chat/message/blocking", "POST /api/chat/messages/{id}/stop"], SAGE, (82, 354, 998, 638)),
        ("2 · ประวัติบทสนทนา", ["GET /api/chat/conversations", "GET /api/chat/conversations/{id}", "GET /api/chat/conversations/{id}/messages", "PATCH /api/chat/conversations/{id}", "DELETE /api/chat/conversations/{id}"], OCHRE, (82, 658, 998, 1040)),
        ("3 · Feedback และไฟล์", ["POST /api/chat/messages/{id}/feedback · rating 1/-1", "GET /api/chat/messages/{id}/generated-files/{file_id}"], TEAL, (82, 1060, 998, 1354)),
    ]
    for i, (title, lines, color, box) in enumerate(cards):
        active = (si == 0 and i == 0) or (si == 1 and i >= 1)
        edge = RED if i == 1 and si == 1 else (color if active else CARD_EDGE)
        x1, y1, x2, y2 = box
        card(d, box, edge=edge, radius=23)
        d.rounded_rectangle((x1, y1, x2, y1 + 58), radius=20, fill=edge if active or (i == 1 and si == 1) else (235, 239, 233))
        d.text((x1 + 28, y1 + 10), title, font=f(27, True), fill=(255, 255, 255) if active or (i == 1 and si == 1) else MUTED)
        line_gap = 39 if i == 1 else 43
        for j, line in enumerate(lines):
            yy = y1 + 72 + j * line_gap
            color_line = RED if i == 1 and "DELETE" in line else INK
            d.text((x1 + 26, yy), line, font=f(19 if i == 2 else 20, "DELETE" in line, code=True), fill=color_line)
    d.text((108, 927), "ทุก route /conversations ต้องระบุ agent_id", font=f(21, True), fill=MUTED)
    d.text((108, 960), "PATCH เปลี่ยน title/status · DELETE ลบถาวร", font=f(21, True), fill=RED)
    d.rounded_rectangle((296, 1372, 784, 1432), radius=23, fill=(225, 241, 232))
    draw_centered(d, (540, 1386), "ทุก endpoint ใช้ scope: chat:invoke", f(23, True), SAGE_DARK, max_width=460, line_gap=0)
    return img


def scene_recap(beat, si, cap):
    img = base_frame(beat, cap)
    d = ImageDraw.Draw(img)
    steps = [
        ("เก็บ API Key ไว้ที่ server", "ไม่ส่ง key ไป browser", SAGE),
        ("ส่งคำถามไปที่ Chat API", "เริ่มใหม่ด้วย conversation_id: null", OCHRE),
        ("อ่าน SSE จน message_end", "คำตอบเต็มอยู่ใน event สุดท้าย", TEAL),
        ("เก็บ conversation_id", "ใช้ ID เดิมเมื่อถามต่อ", SAGE),
    ]
    for i, (title, detail, color) in enumerate(steps):
        y = 368 + i * 236
        active = i <= min(3, si + 1)
        card(d, (110, y, 970, y + 174), edge=color if active else CARD_EDGE, radius=24)
        d.ellipse((144, y + 44, 220, y + 120), fill=color if active else (224, 231, 225))
        draw_centered(d, (182, y + 60), str(i + 1), f(32, True), (255, 255, 255) if active else MUTED, line_gap=0)
        d.text((252, y + 34), title, font=f(34, True), fill=INK if active else MUTED)
        d.text((252, y + 94), detail, font=f(26), fill=MUTED)
    return img


def scene_outro(beat, si, cap):
    img = base_frame(beat, cap)
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((160, 416, 920, 1124), radius=55, fill=(255, 254, 248), outline=(219, 225, 214), width=3)
    paste_fit(img, ASSETS / "langmind-logo.png", (340, 485, 740, 840))
    d = ImageDraw.Draw(img)
    draw_centered(d, (540, 902), "Chat API ใน LangMind", f(43, True), INK, max_width=670, line_gap=2)
    d.rounded_rectangle((290, 1012, 790, 1092), radius=34, fill=(228, 240, 234))
    draw_centered(d, (540, 1032), "langmind.in.th", f(33, True), SAGE_DARK, line_gap=0)
    paste_fit(img, ASSETS / "robot" / "10-thumbs-up.png", (810, 1120, 1008, 1338))
    return img


SCENES = {
    "chat": scene_chat,
    "architecture": scene_architecture,
    "prepare": scene_prepare,
    "request": scene_request,
    "events": scene_events,
    "followup": scene_followup,
    "routes": scene_routes,
    "recap": scene_recap,
    "outro": scene_outro,
}


def generate_stages():
    rows = []
    idx = 0
    for bi, beat in enumerate(CFG["beats"], 1):
        scene = SCENES[beat["scene"]]
        for si, seg in enumerate(beat["segments"]):
            idx += 1
            duration = max(3.1, len("".join(seg["say"].split())) / CFG["chars_per_second"] + CFG["inter_segment_seconds"])
            frames = max(90, round(duration * FPS))
            image = scene(bi, si, seg["cap"])
            filename = f"stage_{idx:02d}_{beat['id']}_{seg['cue']}.png"
            out = PLATES / filename
            image.save(out, format="PNG", optimize=True)
            rows.append({"index": idx, "beat": beat["id"], "cue": seg["cue"], "image": out, "frames": frames, "seconds": frames / FPS, "caption": seg["cap"]})
            print(f"{filename}: {frames}f / {frames / FPS:.2f}s")
    return rows


def render_mp4(stages):
    ffmpeg = which("ffmpeg")
    if not ffmpeg:
        raise RuntimeError("ffmpeg not found on PATH")
    output = ROOT / "renders" / "ep03-v4.2-silent.mp4"
    args = [ffmpeg, "-y", "-hide_banner", "-loglevel", "warning"]
    for row in stages:
        args += ["-loop", "1", "-framerate", str(FPS), "-t", f"{row['seconds']:.6f}", "-i", str(row["image"])]
    filters = []
    for i, row in enumerate(stages):
        frames = row["frames"]
        # A very restrained 1.5% push gives still diagrams a little camera motion.
        filters.append(f"[{i}:v]fps={FPS},scale={W}:{H}:flags=lanczos,zoompan=z='min(zoom+0.00007,1.015)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s={W}x{H}:fps={FPS},trim=end_frame={frames},setpts=PTS-STARTPTS,setsar=1[v{i}]")
    joined = "".join(f"[v{i}]" for i in range(len(stages)))
    filters.append(f"{joined}concat=n={len(stages)}:v=1:a=0,format=yuv420p[outv]")
    args += ["-filter_complex", ";".join(filters), "-map", "[outv]", "-an", "-r", str(FPS), "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-movflags", "+faststart", str(output)]
    subprocess.run(args, check=True)
    return output


def contact_sheet(stages):
    # One selected stage from each of the nine story beats.
    chosen = []
    seen = set()
    for row in stages:
        if row["beat"] not in seen:
            chosen.append(row)
            seen.add(row["beat"])
    cols, rows_n = 3, 3
    cell_w, cell_h = 360, 640
    sheet = Image.new("RGB", (cols * cell_w, rows_n * cell_h), (241, 241, 237))
    for i, row in enumerate(chosen):
        thumb = Image.open(row["image"]).convert("RGB").resize((cell_w, cell_h), Image.Resampling.LANCZOS)
        sheet.paste(thumb, ((i % cols) * cell_w, (i // cols) * cell_h))
    path = REVIEW / "contact-sheet-v4.2.png"
    sheet.save(path, format="PNG", optimize=True)
    return path


def write_render_manifest(stages, video):
    total_frames = sum(row["frames"] for row in stages)
    asset_records = []
    for asset in sorted(p for p in ASSETS.rglob("*") if p.is_file()):
        item = {
            "path": asset.relative_to(ROOT).as_posix(),
            "bytes": asset.stat().st_size,
            "sha256": hashlib.sha256(asset.read_bytes()).hexdigest(),
        }
        if asset.suffix.lower() in (".png", ".jpg", ".jpeg", ".webp"):
            im = Image.open(asset)
            item["dimensions"] = list(im.size)
            item["mode"] = im.mode
            item["alpha_extrema"] = list(im.getchannel("A").getextrema()) if "A" in im.getbands() else None
        asset_records.append(item)
    data = {
        "version": "4.2",
        "fps": FPS,
        "width": W,
        "height": H,
        "stages": [{**{k: (str(v) if isinstance(v, Path) else v) for k, v in row.items()}, "sha256": hashlib.sha256(row["image"].read_bytes()).hexdigest()} for row in stages],
        "assets": asset_records,
        "duration_seconds": total_frames / FPS,
        "frame_count": total_frames,
        "silent": True,
        "video": str(video.relative_to(ROOT)).replace("\\", "/"),
        "sha256": hashlib.sha256(video.read_bytes()).hexdigest(),
    }
    (ROOT / "renders" / "render-manifest-v4.2.json").write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return data


if __name__ == "__main__":
    create_mock_screens()
    stages = generate_stages()
    video = render_mp4(stages)
    contact = contact_sheet(stages)
    manifest = write_render_manifest(stages, video)
    print(f"SUCCESS: {video} | {manifest['duration_seconds']:.2f}s | {manifest['frame_count']} frames @ {FPS} fps | silent")
    print(f"Contact sheet: {contact}")

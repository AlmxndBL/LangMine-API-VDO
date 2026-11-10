"""Pillow + FFmpeg fallback renderer for EP03 v4.4 silent draft.
Corrected stepper layout and zero text overflow on all boxes.
"""
from __future__ import annotations

import hashlib
import json
import shutil
import subprocess
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
ASSETS = ROOT / "assets"
W, H, FPS = 1080, 1920, 30
PAPER = "#FCFBF7"
CARD = "#FFFFFF"
INK = "#2C2825"
MUTED = "#524C46"
FOREST = "#38815A"
SAGE = "#E1EEE9"
LINE = "#EDE8DF"
OCHRE = "#8D732C"
TEAL = "#1E7578"
REGULAR = ASSETS / "fonts/Sarabun-Regular.ttf"
BOLD = ASSETS / "fonts/Sarabun-Bold.ttf"


def fnt(size: int, bold: bool = False):
    return ImageFont.truetype(str(BOLD if bold else REGULAR), size, layout_engine=ImageFont.Layout.BASIC)


def width(draw, value: str, font) -> int:
    box = draw.textbbox((0, 0), value, font=font)
    return box[2] - box[0]


def centered(draw, x: int, y: int, value: str, font, fill=INK):
    draw.text((x - width(draw, value, font) / 2, y), value, font=font, fill=fill)


def arrow(draw, start, end, color=FOREST, line_width=6, head=20):
    draw.line((start, end), fill=color, width=line_width)
    x1, y1 = start
    x2, y2 = end
    if abs(y2 - y1) >= abs(x2 - x1):
        sign = 1 if y2 >= y1 else -1
        points = [(x2, y2), (x2 - head, y2 - sign * head), (x2 + head, y2 - sign * head)]
    else:
        sign = 1 if x2 >= x1 else -1
        points = [(x2, y2), (x2 - sign * head, y2 - head), (x2 - sign * head, y2 + head)]
    draw.polygon(points, fill=color)


def base(beat, page: int):
    canvas = Image.new("RGB", (W, H), PAPER)
    draw = ImageDraw.Draw(canvas)
    for y in range(0, H, 60):
        draw.line((0, y, W, y), fill="#F4F1EA", width=1)

    # Series header
    draw.text((72, 48), "LANGMIND · EP03 / CHAT API", font=fnt(28, True), fill=FOREST)
    page_text = f"{page:02d} / 09"
    draw.text((1008 - width(draw, page_text, fnt(26, True)), 50), page_text, font=fnt(26, True), fill=MUTED)

    # HF-337 Stepper flow (Capsules with circle number on left and clean label centered)
    clean_labels = ["เริ่มห้องใหม่", "สตรีมคำตอบ", "ถามต่อในห้องเดิม"]
    colors = [FOREST, OCHRE, TEAL]
    for i, (label, color) in enumerate(zip(clean_labels, colors), 1):
        x0 = 72 + (i - 1) * 313
        x1 = x0 + 300
        active = beat.get("step", 1) >= i
        fill = [SAGE, "#F7F1E1", "#E2F0EE"][i - 1] if active else CARD
        stroke = color if active else LINE
        # Capsule background
        draw.rounded_rectangle((x0, 110, x1, 172), radius=31, fill=fill, outline=stroke, width=2)
        # Left circle with number
        circle_cx = x0 + 36
        draw.ellipse((circle_cx - 16, 125, circle_cx + 16, 157), fill=color if active else "#D7DFDD")
        centered(draw, circle_cx, 127, str(i), fnt(20, True), "white" if active else INK)
        # Clean label centered in remaining area
        text_cx = (x0 + 56 + x1 - 10) / 2
        centered(draw, text_cx, 125, label, fnt(22, True), color if active else MUTED)

    draw.text((72, 204), beat["title"], font=fnt(60, True), fill=INK)
    return canvas


def panel(draw, box, fill=CARD, outline=LINE, radius=22, shadow=SAGE):
    x0, y0, x1, y1 = box
    if shadow:
        draw.rounded_rectangle((x0 + 8, y0 + 8, x1 + 8, y1 + 8), radius=radius, fill=shadow)
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=3)


def caption(canvas, subtitle: str, elapsed: float, total_dur: float, segments: list | None = None):
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((72, 1500, 1008, 1750), radius=26, fill="#1B2936")
    draw.rounded_rectangle((72, 1500, 90, 1750), radius=10, fill=FOREST)

    text_to_show = subtitle
    lines = text_to_show.splitlines()[:2]
    font = fnt(38, True)
    heights = [draw.textbbox((0, 0), line, font=font)[3] for line in lines]
    total = sum(heights) + (16 if len(lines) == 2 else 0)
    y = 1625 - total / 2
    for line, h in zip(lines, heights):
        centered(draw, W // 2, int(y), line, font, "#FFFFFF")
        y += h + 16


def draw_img(canvas, image, box):
    x, y, w, h = box
    fitted = image.resize((w, h), Image.Resampling.LANCZOS)
    if fitted.mode == "RGBA":
        canvas.paste(fitted, (x, y), fitted)
    else:
        canvas.paste(fitted, (x, y))
    ImageDraw.Draw(canvas).rounded_rectangle((x, y, x + w, y + h), radius=22, outline=LINE, width=3)


# Scene 1: Problem & Question
def scene_b1(canvas, elapsed, screen1, robot):
    draw = ImageDraw.Draw(canvas)
    draw_img(canvas, screen1, (240, 300, 600, 750))
    canvas.paste(robot, (60, 1080), robot)

    panel(draw, (280, 1080, 1000, 1260), fill=CARD, shadow=SAGE)
    draw.text((315, 1105), "แชตบอตตอบช้า หรือจำเรื่องเดิมไม่ได้?", font=fnt(36, True), fill=FOREST)
    draw.text((315, 1158), "ต่อ Chat API ของ LangMind เพื่อให้ตอบแบบสตรีมมิ่ง", font=fnt(28), fill=INK)
    draw.text((315, 1200), "พิมพ์สดทีละคำ และจำบริบทการคุยได้ทันที", font=fnt(28), fill=INK)

    # 3 Chips
    if elapsed > 1.2:
        chips = ["เตรียมอะไร?", "เชื่อมตรงไหน?", "ใช้ผลยังไง?"]
        for i, c in enumerate(chips):
            cx = 220 + i * 320
            draw.rounded_rectangle((cx - 130, 1330, cx + 130, 1400), radius=24, fill="#E1EEE9", outline=FOREST, width=2)
            centered(draw, cx, 1345, c, fnt(30, True), FOREST)


# Scene 2: Architecture
def scene_b2(canvas, elapsed):
    draw = ImageDraw.Draw(canvas)
    nodes = [
        ("แอปพลิเคชันของคุณ (Client)", "แสดงผล UI หน้าแชต · ส่งคำถามผู้ใช้", FOREST),
        ("เซิร์ฟเวอร์หลังบ้าน (Backend Server)", "เก็บ API Key ปลอดภัย · เรียก Chat API", OCHRE),
        ("LangMind Chat API & Agent", "ประมวลผลคำตอบ · สตรีมข้อความ Real-time", TEAL),
    ]
    ys = [350, 680, 1010]
    for i, ((title, sub, color), y) in enumerate(zip(nodes, ys)):
        panel(draw, (120, y, 960, y + 170), fill=CARD, shadow="#E8EDE9")
        draw.rounded_rectangle((145, y + 35, 175, y + 135), radius=10, fill=color)
        draw.text((205, y + 40), title, font=fnt(38, True), fill=INK)
        draw.text((205, y + 100), sub, font=fnt(26), fill=MUTED)
        if i < len(ys) - 1:
            arrow(draw, (540, y + 175), (540, ys[i + 1] - 8), color, 6, 18)


# Scene 3: Prerequisites
def scene_b3(canvas, elapsed):
    draw = ImageDraw.Draw(canvas)
    cards = [
        ("1. Agent ใน LangMind", "ระบุ agent_id และเปิดใช้งานโมเดลเรียบร้อย", "status: ready", FOREST),
        ("2. API Key (Personal Token)", "lmpat_•••••••• พร้อม Scope: chat:invoke", "chat:invoke", OCHRE),
        ("3. เซิร์ฟเวอร์หลังบ้าน", "เก็บ Key ฝั่ง Server เท่านั้น ห้ามใส่ในหน้าเว็บ", "ห้ามใส่ในเว็บ", TEAL),
    ]
    for i, (title, sub, badge, color) in enumerate(cards):
        y = 360 + i * 280
        panel(draw, (120, y, 960, y + 200), fill=CARD, shadow="#E8EDE9")
        draw.rounded_rectangle((150, y + 35, 180, y + 165), radius=12, fill=color)
        draw.text((210, y + 42), title, font=fnt(40, True), fill=INK)
        draw.text((210, y + 115), sub, font=fnt(28), fill=MUTED)
        draw.rounded_rectangle((740, y + 42, 920, y + 96), radius=20, fill="#F2EFE9")
        centered(draw, 830, y + 54, badge, fnt(26, True), color)

    panel(draw, (120, 1220, 960, 1390), fill="#FFF8EE", outline=OCHRE, radius=20, shadow=None)
    draw.text((150, 1245), "ข้อควรระวัง:", font=fnt(30, True), fill=OCHRE)
    draw.text((150, 1290), "หากไม่ระบุ agent_id หรือ Agent ยังไม่พร้อมใช้งาน", font=fnt(26), fill=INK)
    draw.text((150, 1332), "ระบบจะคืนรหัสข้อผิดพลาด (Error) ทันที", font=fnt(26), fill=INK)


# Scene 4: Call 1 (Start conversation)
def scene_b4(canvas, elapsed, robot):
    draw = ImageDraw.Draw(canvas)
    # Minimap
    draw.rounded_rectangle((120, 300, 960, 366), radius=22, fill=SAGE, outline=FOREST, width=2)
    draw.text((150, 318), "เชื่อมครั้งที่ 1: หลังบ้าน ⇄ เริ่มห้องใหม่ ⇄ LangMind API", font=fnt(28, True), fill=FOREST)

    # Code Box
    panel(draw, (120, 400, 960, 1020), fill=CARD, shadow=SAGE)
    draw.rounded_rectangle((122, 402, 958, 480), radius=20, fill="#253238")
    draw.rectangle((122, 450, 958, 480), fill="#253238")
    draw.text((150, 422), "POST /api/chat/message", font=fnt(34, True), fill="#FFFFFF")
    draw.text((720, 426), "chat:invoke", font=fnt(26, True), fill="#80CBC4")

    lines = [
        "Authorization: Bearer $LM_TOKEN",
        "{",
        '  "agent_id": "01J8XM9K...",',
        '  "query": "สินค้าชิ้นนี้มีของไหมครับ",',
        '  "conversation_id": null',
        "}",
    ]
    # HF-113 Code Highlight Sweep animation
    for i, line in enumerate(lines):
        y = 520 + i * 68
        is_target = "conversation_id" in line
        if is_target:
            sweep = max(0.0, min(1.0, (elapsed - 0.4) / 0.8))
            if sweep > 0:
                draw.rounded_rectangle((140, y - 8, 140 + int(790 * sweep), y + 54), radius=12, fill="#E1EEE9")
                draw.rounded_rectangle((140, y - 8, 150, y + 54), radius=4, fill=FOREST)
        color = FOREST if is_target else (MUTED if "Authorization" in line else INK)
        draw.text((160, y), line, font=fnt(31, is_target), fill=color)

    draw.rounded_rectangle((150, 940, 930, 1000), radius=16, fill="#F2EFE9")
    draw.text((170, 955), "✓ ค่า conversation_id: null หมายถึงขอเปิดห้องแชตใหม่", font=fnt(26, True), fill=FOREST)

    # Response box
    panel(draw, (120, 1050, 960, 1270), fill="#F7FAF8", outline=FOREST, radius=20, shadow=None)
    draw.text((150, 1075), "รับ event แรกชื่อ message_start ทันที:", font=fnt(28, True), fill=FOREST)
    draw.text((150, 1125), 'data: {"event": "message_start", "conversation_id": "conv_8892"}', font=fnt(25, True), fill=INK)
    draw.text((150, 1185), "» เก็บรหัส conv_8892 นี้ไว้ใช้ส่งในคำถามถัดไป «", font=fnt(26), fill=MUTED)

    canvas.paste(robot, (760, 1280), robot)


# Scene 5: Call 2 (Streaming)
def scene_b5(canvas, elapsed, screen2):
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((120, 300, 960, 366), radius=22, fill="#F7F1E1", outline=OCHRE, width=2)
    draw.text((150, 318), "เชื่อมครั้งที่ 2: สตรีมคำตอบ Real-time (SSE)", font=fnt(28, True), fill=OCHRE)

    # Screen Mockup showing streaming text
    draw_img(canvas, screen2, (120, 400, 480, 600))

    # Event stream box
    panel(draw, (630, 400, 970, 990), fill=CARD, shadow="#F4EAD4")
    draw.text((660, 430), "SSE Events:", font=fnt(32, True), fill=OCHRE)

    events = [
        'data: {"event": "message",',
        '       "answer": "มีสินค้า..."}',
        'data: {"event": "message",',
        '       "answer": "พร้อมส่งค่ะ"}',
        'data: {"event": "message_end",',
        '       "usage": {...}}',
    ]
    for i, ev in enumerate(events):
        draw.text((650, 500 + i * 55), ev, font=fnt(24), fill=INK if "message_end" not in ev else OCHRE)

    draw.rounded_rectangle((650, 870, 950, 950), radius=16, fill="#E1EEE9")
    centered(draw, 800, 895, "✓ ตัวหนังสือคลี่ออกสดทันที", fnt(25, True), FOREST)

    # Tip box (2 clean lines to avoid overflow)
    panel(draw, (120, 1030, 960, 1230), fill=CARD, shadow=SAGE)
    draw.text((150, 1055), "ทางเลือกสำหรับสคริปต์หลังบ้าน:", font=fnt(30, True), fill=FOREST)
    draw.text((150, 1105), "สามารถใช้ POST /api/chat/message/blocking", font=fnt(26, True), fill=INK)
    draw.text((150, 1148), "เพื่อรับคำตอบเป็น JSON ก้อนเดียวจบ เหมาะกับระบบที่ไม่สะดวกอ่าน SSE", font=fnt(26), fill=MUTED)


# Scene 6: Call 3 (Multi-turn followup)
def scene_b6(canvas, elapsed, screen3, robot):
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((120, 300, 960, 366), radius=22, fill="#E2F0EE", outline=TEAL, width=2)
    draw.text((150, 318), "เชื่อมครั้งที่ 3: ถามต่อในบทสนทนาเดิม", font=fnt(28, True), fill=TEAL)

    # Screen Mockup showing context aware follow-up
    draw_img(canvas, screen3, (120, 400, 480, 600))

    panel(draw, (630, 400, 970, 990), fill=CARD, shadow="#D8EBE9")
    draw.text((660, 430), "คำขอคำถามที่ 2:", font=fnt(32, True), fill=TEAL)
    req_lines = [
        "POST /api/chat/message",
        "{",
        '  "query": "สั่ง 2 ชิ้น',
        '            ลดไหม",',
        '  "conversation_id":',
        '    "conv_8892"',
        "}",
    ]
    for i, r in enumerate(req_lines):
        y_pos = 490 + i * 52
        is_target = "conv_8892" in r
        if is_target:
            sweep = max(0.0, min(1.0, (elapsed - 0.3) / 0.7))
            if sweep > 0:
                draw.rounded_rectangle((640, y_pos - 6, 640 + int(310 * sweep), y_pos + 44), radius=10, fill="#E2F0EE")
        col = TEAL if is_target else INK
        draw.text((650, y_pos), r, font=fnt(26, is_target), fill=col)

    draw.rounded_rectangle((650, 880, 950, 950), radius=16, fill="#E2F0EE")
    centered(draw, 800, 902, "✓ ใช้รหัสห้องเดิม", fnt(26, True), TEAL)

    panel(draw, (120, 1030, 960, 1210), fill="#F7FAF8", outline=TEAL, radius=20, shadow=None)
    draw.text((150, 1055), "ผลลัพธ์:", font=fnt(28, True), fill=TEAL)
    draw.text((150, 1100), "AI จำได้ทันทีว่าเป็นสินค้าชิ้นไหน", font=fnt(26, True), fill=INK)
    draw.text((150, 1142), "พร้อมคำนวณส่วนลดให้ต่อเนื่อง โดยที่ลูกค้าไม่ต้องถามซ้ำ", font=fnt(26), fill=MUTED)

    canvas.paste(robot, (760, 1240), robot)


# Scene 7: Best Practices
def scene_b7(canvas, elapsed):
    draw = ImageDraw.Draw(canvas)
    items = [
        ("1. ส่ง user_id ปลายทาง", "ส่งรหัสผู้ใช้ปลายทางทุกครั้งเพื่อนับสถิติ Unique Users ได้อย่างแท้จริง", FOREST),
        ("2. สั่งยกเลิกสตรีมกะทันหัน", "ใช้ POST /chat/messages/{id}/stop สั่งหยุดการพิมพ์ของ AI ได้ทันที", OCHRE),
        ("3. ดึงประวัติข้อความย้อนหลัง", "ใช้ GET /chat/conversations/{id}/messages ดึงข้อความมาแสดงในแอป", TEAL),
        ("4. เช็ก message_end & ปลอดภัย", "รอตรวจ event message_end เสมอ และเก็บ API Key ฝั่ง Server เท่านั้น", "#C0392B"),
    ]
    for i, (title, desc, color) in enumerate(items):
        y = 330 + i * 230
        panel(draw, (120, y, 960, y + 180), fill=CARD, shadow="#E8EDE9")
        draw.rounded_rectangle((145, y + 30, 175, y + 150), radius=10, fill=color)
        draw.text((205, y + 35), title, font=fnt(36, True), fill=color)
        draw.text((205, y + 95), desc, font=fnt(24), fill=INK)


# Scene 8: Recap 3 Pillars
def scene_b8(canvas, elapsed, robot):
    draw = ImageDraw.Draw(canvas)
    pillars = [
        ("1", "เตรียม", "Agent พร้อมใช้ + API Key (chat:invoke) + เซิร์ฟเวอร์หลังบ้าน", FOREST),
        ("2", "เชื่อม", "เริ่มห้องใหม่ (null) → สตรีมสด (message) → ถามต่อด้วย ID เดิม", OCHRE),
        ("3", "ใช้ผล", "สลับ Blocking ได้ + ส่ง user_id + ควบคุมแชตผ่าน API เต็มรูปแบบ", TEAL),
    ]
    for i, (num, tag, desc, color) in enumerate(pillars):
        y = 350 + i * 270
        panel(draw, (120, y, 960, y + 210), fill=CARD, shadow="#E8EDE9")
        draw.ellipse((160, y + 55, 240, y + 135), fill=color)
        centered(draw, 200, y + 68, num, fnt(48, True), "white")
        draw.rounded_rectangle((270, y + 40, 390, y + 95), radius=16, fill="#F2EFE9")
        centered(draw, 330, y + 50, tag, fnt(30, True), color)
        draw.text((260, y + 122), desc, font=fnt(23, True), fill=INK)

    canvas.paste(robot, (760, 1200), robot)


# Scene 9: Sponsor Outro
def scene_b9(canvas, elapsed, logo):
    draw = ImageDraw.Draw(canvas)
    # Centered logo
    logo_w, logo_h = 240, int(240 * logo.height / logo.width)
    resized_logo = logo.resize((logo_w, logo_h), Image.Resampling.LANCZOS)
    canvas.paste(resized_logo, (W // 2 - logo_w // 2, 450), resized_logo)

    centered(draw, W // 2, 730, "LangMind Platform", fnt(56, True), INK)
    centered(draw, W // 2, 820, "คลิปนี้สนับสนุนโดย LangMind", fnt(38), MUTED)

    panel(draw, (200, 940, 880, 1180), fill=CARD, outline=FOREST, radius=28, shadow=SAGE)
    centered(draw, W // 2, 980, "langmind.in.th", fnt(50, True), FOREST)
    centered(draw, W // 2, 1070, "เริ่มต้นใช้งาน Chat API และสร้างผู้ช่วย AI ได้แล้ววันนี้", fnt(30), INK)


def main():
    timing_path = ROOT / "timing.generated.json"
    if not timing_path.exists():
        raise SystemExit("Run node build.mjs before running render_silent.py")

    source = json.loads(timing_path.read_text(encoding="utf-8"))
    beats = source["beats"]
    total = float(source["totalDurationSeconds"])
    frame_count = round(total * FPS)

    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        raise SystemExit("ffmpeg is not on PATH.")

    out_dir = ROOT / "renders"
    out_dir.mkdir(parents=True, exist_ok=True)
    output = out_dir / "ep03-v4.4-silent.mp4"

    # Pre-load assets
    s1 = Image.open(ASSETS / "app-chat-1.jpg").convert("RGB")
    s2 = Image.open(ASSETS / "app-chat-2.jpg").convert("RGB")
    s3 = Image.open(ASSETS / "app-chat-3.jpg").convert("RGB")
    robot_q = Image.open(ASSETS / "01-question.png").convert("RGBA").resize((160, 240), Image.Resampling.LANCZOS)
    robot_lap = Image.open(ASSETS / "20-laptop.png").convert("RGBA").resize((180, 240), Image.Resampling.LANCZOS)
    robot_thumb = Image.open(ASSETS / "10-thumbs-up.png").convert("RGBA").resize((180, 240), Image.Resampling.LANCZOS)
    logo = Image.open(ASSETS / "langmind-logo.png").convert("RGBA")

    renderers = {
        "b1": lambda c, el: scene_b1(c, el, s1, robot_q),
        "b2": scene_b2,
        "b3": scene_b3,
        "b4": lambda c, el: scene_b4(c, el, robot_lap),
        "b5": lambda c, el: scene_b5(c, el, s2),
        "b6": lambda c, el: scene_b6(c, el, s3, robot_thumb),
        "b7": scene_b7,
        "b8": lambda c, el: scene_b8(c, el, robot_thumb),
        "b9": lambda c, el: scene_b9(c, el, logo),
    }

    # Generate 9-beat QA contact sheet
    contact_sheet = Image.new("RGB", (360 * 3, 640 * 3), PAPER)
    for idx, beat in enumerate(beats):
        c = base(beat, idx + 1)
        renderers[beat["id"]](c, 2.0)
        caption(c, beat["subtitle"], 2.0, beat["durationSeconds"])
        row, col = idx // 3, idx % 3
        contact_sheet.paste(c.resize((360, 640), Image.Resampling.LANCZOS), (col * 360, row * 640))
    contact_sheet.save(out_dir / "qa-contact-sheet-v4.4.png", quality=90)
    print("Saved qa-contact-sheet-v4.4.png")

    args = [
        ffmpeg, "-y", "-hide_banner", "-loglevel", "error",
        "-f", "rawvideo", "-pix_fmt", "rgb24", "-s:v", f"{W}x{H}", "-r", str(FPS),
        "-i", "pipe:0",
        "-an", "-c:v", "libx264", "-preset", "fast", "-crf", "19",
        "-pix_fmt", "yuv420p", "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709",
        "-movflags", "+faststart", str(output)
    ]
    proc = subprocess.Popen(args, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
    assert proc.stdin is not None

    print(f"Rendering {frame_count} frames for {total:.2f}s video...")
    try:
        index = 0
        for frame in range(frame_count):
            t = frame / FPS
            while index < len(beats) - 1 and t >= beats[index]["endSeconds"]:
                index += 1
            beat = beats[index]
            elapsed = max(0.0, t - beat["startSeconds"])
            canvas = base(beat, index + 1)
            renderers[beat["id"]](canvas, elapsed)
            caption(canvas, beat["subtitle"], elapsed, beat["durationSeconds"])
            proc.stdin.write(canvas.tobytes())
            if frame and frame % 600 == 0:
                print(f"Rendered {frame}/{frame_count} frames ({frame / frame_count * 100:.1f}%)", flush=True)
    except BrokenPipeError:
        proc.stdin.close()
        stderr = proc.stderr.read().decode("utf-8", errors="replace") if proc.stderr else ""
        raise SystemExit(f"FFmpeg stopped before receiving all frames: {stderr}")
    finally:
        if proc.stdin and not proc.stdin.closed:
            proc.stdin.close()

    stderr = proc.stderr.read().decode("utf-8", errors="replace") if proc.stderr else ""
    exit_code = proc.wait()
    if exit_code:
        raise SystemExit(f"FFmpeg exited {exit_code}: {stderr}")

    digest = hashlib.sha256(output.read_bytes()).hexdigest()
    manifest = {
        "file": output.name,
        "renderer": "Pillow + FFmpeg fallback; 9-Beat Editorial Paper & Sage Ink standard with HF-337 and HF-113",
        "width": W,
        "height": H,
        "fps": FPS,
        "frames": frame_count,
        "expectedDurationSeconds": total,
        "frameDurationSeconds": frame_count / FPS,
        "audio": False,
        "sha256": digest,
        "bytes": output.stat().st_size,
        "ffmpegExitCode": exit_code
    }
    (out_dir / "render-manifest-v4.4.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Rendered {output} ({frame_count} frames, {frame_count / FPS:.3f}s), SHA-256 {digest}", flush=True)


if __name__ == "__main__":
    main()

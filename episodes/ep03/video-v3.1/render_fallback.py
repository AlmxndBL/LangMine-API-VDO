from pathlib import Path
from shutil import which
import json
import math
import subprocess
import tempfile

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).parent
TIMING = json.loads((ROOT / "timing.json").read_text(encoding="utf-8"))
PLATES = ROOT / "assets" / "plates" / "v3.1"
ILLUSTRATIONS = ROOT / "assets" / "illustrations" / "v3.1"
PLATES.mkdir(parents=True, exist_ok=True)
ILLUSTRATIONS.mkdir(parents=True, exist_ok=True)
W, H = TIMING["width"], TIMING["height"]
FPS = TIMING["fps"]
BG = (243, 240, 232)
INK = (22, 37, 54)
GREEN = (8, 121, 95)
MUTED = (86, 103, 116)
PAPER = (255, 253, 248)
STROKE = (200, 211, 207)
REG = str(ROOT / "assets" / "fonts" / "Sarabun-Regular.ttf")
BOLD = str(ROOT / "assets" / "fonts" / "Sarabun-Bold.ttf")


def font(size, bold=False):
    return ImageFont.truetype(BOLD if bold else REG, size)


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


def draw_lines(draw, box, text, fnt, fill=INK, spacing=5, align="left"):
    x, y, w, h = box
    lines = wrap(draw, text, fnt, w)
    line_h = fnt.size + spacing
    total = len(lines) * line_h - spacing
    yy = y + (h - total) / 2
    for line in lines:
        bounds = draw.textbbox((0, 0), line, font=fnt)
        width = bounds[2] - bounds[0]
        xx = x if align == "left" else x + (w - width) / 2
        draw.text((xx, yy), line, font=fnt, fill=fill)
        yy += line_h


def add_caption(image, text):
    if not text:
        return image
    draw = ImageDraw.Draw(image)
    x, y, w, h = 72, 1560, W - 144, 232
    draw.rounded_rectangle((x, y, x + w, y + h), radius=30, fill=(22, 37, 54), outline=(255, 255, 255), width=3)
    caption_font = font(42, True)
    lines = wrap(draw, text, caption_font, w - 80)
    while len(lines) > 2 and caption_font.size > 30:
        caption_font = font(caption_font.size - 2, True)
        lines = wrap(draw, text, caption_font, w - 80)
    if len(lines) > 2:
        raise ValueError(f"Caption does not fit in two lines: {text}")
    line_h = caption_font.size + 12
    total_h = len(lines) * line_h - 12
    yy = y + (h - total_h) / 2
    for line in lines:
        bounds = draw.textbbox((0, 0), line, font=caption_font)
        line_w = bounds[2] - bounds[0]
        draw.text((x + (w - line_w) / 2, yy), line, font=caption_font, fill=(255, 255, 255))
        yy += line_h
    return image


def base(title, count, note=None):
    im = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(im)
    for y in range(42, H, 46):
        for x in range(42, W, 46):
            d.ellipse((x, y, x + 2, y + 2), fill=(224, 220, 211))
    d.rounded_rectangle((30, 30, W - 30, H - 30), radius=32, outline=(215, 210, 200), width=3)
    d.text((96, 76), "LANGMIND  ·  EP03 / SSE", font=font(26, True), fill=GREEN)
    d.text((910, 82), count, font=font(22, True), fill=MUTED)
    title_lines = wrap(d, title, font(56, True), 888)
    yy = 140
    for line in title_lines[:2]:
        d.text((96, yy), line, font=font(56, True), fill=INK)
        yy += 68
    if note:
        draw_lines(d, (100, 270, 880, 50), note, font(30, True), MUTED, 2, "center")
    return im, d


def rounded(draw, box, fill=PAPER, outline=STROKE, radius=20, width=3):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def pill(draw, box, text, fill=(227, 238, 232), ink=(7, 92, 74), size=25, outline=STROKE):
    x, y, w, h = box
    rounded(draw, (x, y, x + w, y + h), fill, outline, h // 2, 2)
    draw_lines(draw, (x + 10, y + 2, w - 20, h - 4), text, font(size, True), ink, 2, "center")


def card(draw, box, title, detail="", index=None, fill=PAPER, outline=STROKE, active=False, dashed=False):
    x, y, w, h = box
    rounded(draw, (x, y, x + w, y + h), fill, outline, 22, 4 if active else 3)
    if dashed:
        for px in range(x + 16, x + w - 16, 26):
            draw.line((px, y, min(px + 12, x + w - 16), y), fill=outline, width=3)
            draw.line((px, y + h, min(px + 12, x + w - 16), y + h), fill=outline, width=3)
    text_x, text_w = x + 28, w - 56
    if index is not None:
        mark_y = y + (h - 58) // 2
        draw.ellipse((x + 24, mark_y, x + 82, mark_y + 58), fill=GREEN)
        draw_lines(draw, (x + 24, mark_y, 58, 58), str(index), font(27, True), PAPER, 0, "center")
        text_x, text_w = x + 104, w - 132
    if detail:
        title_font = font(36, True)
        title_lines = wrap(draw, title, title_font, text_w)
        detail_font = font(30)
        detail_lines = wrap(draw, detail, detail_font, text_w)
        total_h = len(title_lines) * 42 + len(detail_lines) * 35 + 4
        yy = y + max(12, (h - total_h) // 2)
        for line in title_lines:
            draw.text((text_x, yy), line, font=title_font, fill=INK)
            yy += 42
        for line in detail_lines:
            draw.text((text_x, yy + 3), line, font=detail_font, fill=MUTED)
            yy += 35
    else:
        draw_lines(draw, (text_x, y + 10, text_w, h - 20), title, font(34, True), INK, 2, "left")


def put_image(canvas, path, box, outline=INK, radius=24):
    x, y, w, h = box
    image = Image.open(path).convert("RGBA")
    image.thumbnail((w, h), Image.Resampling.LANCZOS)
    frame = Image.new("RGBA", (w, h), (255, 255, 255, 255))
    frame.alpha_composite(image, ((w - image.width) // 2, (h - image.height) // 2))
    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, w - 1, h - 1), radius=radius, fill=255)
    canvas.paste(frame.convert("RGB"), (x, y), mask)
    if outline:
        ImageDraw.Draw(canvas).rounded_rectangle((x, y, x + w, y + h), radius=radius, outline=outline, width=3)


def put_sprite(canvas, path, box, alpha_threshold=8):
    x, y, w, h = box
    image = Image.open(path).convert("RGBA")
    alpha = image.getchannel("A")
    bounds = alpha.point(lambda value: 255 if value > alpha_threshold else 0).getbbox()
    if bounds:
        image = image.crop(bounds)
    image.thumbnail((w, h), Image.Resampling.LANCZOS)
    canvas.paste(image, (x + (w - image.width) // 2, y + (h - image.height) // 2), image.getchannel("A"))


def create_explanatory_images():
    """Create two abstract diagrams for the compare component's named slots."""
    size = (980, 800)

    batch = Image.new("RGB", size, BG)
    bd = ImageDraw.Draw(batch)
    bd.ellipse((585, 90, 975, 480), fill=(229, 239, 233))
    # Three pages are held as one complete set until the final answer is ready.
    pages = [(610, 160), (632, 182), (654, 204)]
    for px, py in pages:
        rounded(bd, (px, py, px + 235, py + 300), PAPER, STROKE, 20, 4)
        for i, line_w in enumerate((158, 182, 142, 170)):
            yy = py + 62 + i * 42
            bd.rounded_rectangle((px + 34, yy, px + 34 + line_w, yy + 9), radius=4,
                                 fill=GREEN if i == 0 else (177, 190, 189))
    arrow(bd, 780, 515, 780, 572, width=8, head=18)
    rounded(bd, (653, 590, 892, 738), (255, 253, 248), GREEN, 24, 5)
    for i, line_w in enumerate((158, 178, 132)):
        yy = 625 + i * 34
        bd.rounded_rectangle((682, yy, 682 + line_w, yy + 9), radius=4,
                             fill=GREEN if i == 0 else (177, 190, 189))
    bd.ellipse((865, 635, 943, 713), fill=GREEN)
    bd.line((886, 675, 905, 693), fill=PAPER, width=9)
    bd.line((905, 693, 928, 656), fill=PAPER, width=9)
    draw_lines(bd, (510, 754, 460, 38), "POST /chat/message/blocking", font(26, True), GREEN, 1, "center")
    batch.save(ILLUSTRATIONS / "batch-complete.png", format="PNG", optimize=True)

    stream = Image.new("RGB", size, BG)
    sd = ImageDraw.Draw(stream)
    sd.ellipse((8, 88, 470, 550), fill=(229, 239, 233))
    chunk_rows = ((120, 150, 0.86), (335, 365, 0.68), (520, 550, 0.92))
    for index, (top, next_top, line_ratio) in enumerate(chunk_rows, start=1):
        if index > 1:
            arrow(sd, 245, top - 42, 245, top - 10, width=7, head=15)
        rounded(sd, (76, top, 414, top + 116), PAPER, GREEN if index == 3 else STROKE, 22, 4)
        sd.ellipse((97, top + 30, 153, top + 86), fill=GREEN)
        draw_lines(sd, (97, top + 30, 56, 56), str(index), font(28, True), PAPER, 0, "center")
        line_width = int(190 * line_ratio)
        sd.rounded_rectangle((178, top + 36, 178 + line_width, top + 45), radius=4, fill=GREEN)
        sd.rounded_rectangle((178, top + 62, 178 + int(line_width * 0.7), top + 71), radius=4, fill=(177, 190, 189))
        if index < 3:
            sd.line((245, top + 116, 245, next_top - 6), fill=(122, 184, 160), width=6)
    draw_lines(sd, (22, 754, 450, 38), "POST /chat/message  ·  SSE", font(26, True), GREEN, 1, "center")
    stream.save(ILLUSTRATIONS / "stream-chunks.png", format="PNG", optimize=True)


def put_image_crop(canvas, path, box, crop, outline=INK, radius=24):
    x, y, w, h = box
    image = Image.open(path).convert("RGBA").crop(crop)
    image.thumbnail((w, h), Image.Resampling.LANCZOS)
    frame = Image.new("RGBA", (w, h), (255, 255, 255, 255))
    frame.alpha_composite(image, ((w - image.width) // 2, (h - image.height) // 2))
    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, w - 1, h - 1), radius=radius, fill=255)
    canvas.paste(frame.convert("RGB"), (x, y), mask)
    if outline:
        ImageDraw.Draw(canvas).rounded_rectangle((x, y, x + w, y + h), radius=radius, outline=outline, width=3)


def arrow(draw, x1, y1, x2, y2, color=(122, 184, 160), width=7, head=16):
    draw.line((x1, y1, x2, y2), fill=color, width=width)
    if y2 >= y1:
        draw.polygon([(x2 - head, y2 - head), (x2 + head, y2 - head), (x2, y2)], fill=GREEN)
    else:
        draw.polygon([(x2 - head, y2 + head), (x2 + head, y2 + head), (x2, y2)], fill=GREEN)


def stage_path(filename):
    return PLATES / filename


def create_plates():
    create_explanatory_images()
    plates = {}

    # Beat 1: one question anchors the whole example.
    for stage in ("b1-question", "b1-waiting"):
        im, d = base("เริ่มจากคำถามเดียวกัน", "01 / 05")
        pill(d, (350, 270, 380, 58), "[ภาพจำลอง]", size=30)
        put_image_crop(im, ROOT / "assets" / "ui" / "scr-01-chat-loading.png", (105, 345, 870, 645), (0, 0, 1080, 800), outline=(29, 53, 68), radius=25)
        if stage == "b1-question":
            card(d, (170, 1030, 740, 104), "ผู้ใช้ถาม", "ช่วยแนะนำขั้นตอนเริ่มต้นให้หน่อย", index=1, fill=PAPER)
        else:
            card(d, (170, 1030, 740, 104), "คำถามถูกส่งแล้ว", "หน้าจอกำลังรอคำตอบ", index=1, fill=(232, 244, 238), outline=GREEN, active=True)
        put_sprite(im, ROOT / "assets" / "characters" / "01-question.png", (430, 1140, 220, 260))
        plates[stage] = im

    # Beat 2: the Catalog comparison component supplies the split/wipe motion.
    for state, stage in enumerate(("b2-compare-1", "b2-compare-2", "b2-compare-3"), start=1):
        im, d = base("", "02 / 05", "คำถามเดียวกัน · สองวิธีรับข้อมูล")
        rounded(d, (120, 325, 960, 405), PAPER, STROKE, 20, 2)
        draw_lines(d, (140, 330, 800, 70), "คำถาม: ช่วยแนะนำขั้นตอนเริ่มต้นให้หน่อย", font(32, True), INK, 3, "center")
        rounded(d, (50, 420, 1030, 1240), PAPER, STROKE, 28, 3)
        pill(d, (145, 1260, 790, 64), "ภาพอธิบาย · ไม่ใช่ผลเรียก API จริง", size=29)
        plates[stage] = im

    # Beat 3: reveal the event sequence one at a time and finish on the terminal event.
    events = [
        ("message_start", "เริ่มต้นและให้รหัสบทสนทนา/ข้อความ"),
        ("message", "เนื้อหาคำตอบทยอยมาเป็นชิ้น (chunks)"),
        ("citations (ถ้ามี)", "แหล่งอ้างอิงประกอบคำตอบ"),
        ("message_end", "คำตอบฉบับเต็มและข้อมูล usage"),
    ]
    for n, stage in enumerate(("b3-event-1", "b3-event-2", "b3-event-3", "b3-event-4"), start=1):
        im, d = base("ข้อความมาเป็นลำดับ event", "03 / 05")
        pill(d, (150, 280, 780, 64), "POST /chat/message  ·  Server-Sent Events (SSE)", size=30)
        arrow(d, 540, 365, 540, 1070, width=6, head=15)
        for i, (name, detail) in enumerate(events[:n]):
            y = 390 + i * 164
            current = i == n - 1
            fill = (232, 244, 238) if current else PAPER
            edge = GREEN if current else STROKE
            card(d, (120, y, 840, 136), name, detail, index=i + 1, fill=fill, outline=edge, active=current, dashed=(i == 2))
        if n == 4:
            card(d, (145, 1088, 790, 128), "จำสองจุด", "message = เนื้อหาที่ทยอยมา  ·  message_end = คำตอบครบ", fill=(232, 244, 238), outline=GREEN, active=True)
        put_sprite(im, ROOT / "assets" / "characters" / "20-laptop.png", (830, 1240, 210, 270))
        plates[stage] = im

    # Beat 4: make request, provider stream and app display separate responsibilities.
    for n, stage in enumerate(("b4-roles-1", "b4-roles-2", "b4-roles-3"), start=1):
        im, d = base("ใครส่ง ใครอ่าน ใครแสดง", "04 / 05")
        card(d, (150, 330, 780, 148), "LangMind API", "ส่ง event กลับเป็น SSE", index=1, fill=(232, 244, 238), outline=GREEN, active=(n == 1))
        if n >= 2:
            draw_lines(d, (162, 493, 345, 54), "POST request ↑", font(30, True), GREEN, 2, "center")
            draw_lines(d, (572, 493, 345, 54), "SSE events ↓", font(30, True), GREEN, 2, "center")
            arrow(d, 330, 600, 330, 552, width=5, head=12)
            arrow(d, 748, 552, 748, 600, width=5, head=12)
        card(d, (150, 612, 780, 200), "App Backend", "เก็บ API key  ·  ส่งคำขอ  ·  อ่านและแยก stream", index=2, fill=(255, 253, 248), outline=GREEN if n == 2 else STROKE, active=(n == 2))
        if n >= 3:
            draw_lines(d, (195, 830, 690, 52), "ข้อมูลที่แอปส่งต่อ ↓", font(30, True), GREEN, 2, "center")
            arrow(d, 540, 881, 540, 930, width=5, head=12)
            card(d, (150, 944, 780, 190), "Client UI", "รับข้อมูลจาก Backend  ·  จัดการสถานะ  ·  แสดงผล", index=3, fill=(247, 249, 250), outline=(130, 149, 166), active=True)
            pill(d, (180, 1165, 720, 74), "API ส่งข้อมูล · แอปเป็นผู้สร้างและจัดการหน้าจอ", size=30)
            put_sprite(im, ROOT / "assets" / "characters" / "39-tiptoe.png", (850, 1270, 190, 250))
        plates[stage] = im

    # Beat 5: repeat only the two things a developer needs to remember.
    for n, stage in enumerate(("b5-recap-1", "b5-recap-2", "b5-recap-3"), start=1):
        im, d = base("จำให้ได้สองจุด", "05 / 05")
        put_image(im, ROOT / "assets" / "brand" / "langmind-logo.png", (112, 330, 218, 192), outline=None, radius=0)
        put_sprite(im, ROOT / "assets" / "characters" / "10-thumbs-up.png", (775, 285, 250, 265))
        recap = [
            ("Backend", "เก็บ API key · ส่งคำขอ · อ่าน stream"),
            ("Client UI", "เลือกแสดงข้อความตามที่แอปออกแบบ"),
            ("message_end", "เมื่อได้รับ event นี้ คำตอบจึงครบ"),
        ]
        for i, (title, detail) in enumerate(recap[:n]):
            y = 560 + i * 190
            current = i == n - 1
            card(d, (145, y, 790, 154), title, detail, index=i + 1,
                 fill=(232, 244, 238) if current else PAPER,
                 outline=GREEN if current else STROKE, active=current)
        if n == 3:
            draw_lines(d, (130, 1160, 820, 100), "message = ข้อความที่ทยอยมา\nmessage_end = สัญญาณว่าคำตอบครบ", font(32, True), INK, 5, "center")
        plates[stage] = im

    for stage in TIMING["stages"]:
        image = add_caption(plates[stage["id"]], stage.get("caption", ""))
        image.save(stage_path(stage["file"]), format="PNG", optimize=True)
    return [(stage_path(s["file"]), s["frames"]) for s in TIMING["stages"]]


def render_beat02_segment(stages, output):
    """Render the Catalog wipe and Soft Blur In motion to an intermediate segment."""
    ffmpeg = which("ffmpeg")
    if not ffmpeg:
        raise RuntimeError("ffmpeg was not found on PATH")
    panel_box = (50, 420, 980, 820)
    panel_x, panel_y, panel_w, panel_h = panel_box
    before_source = Image.open(ILLUSTRATIONS / "batch-complete.png").convert("RGB")
    after_source = Image.open(ILLUSTRATIONS / "stream-chunks.png").convert("RGB")
    before = Image.new("RGB", (panel_w, panel_h), BG)
    after = Image.new("RGB", (panel_w, panel_h), BG)
    before.paste(before_source, (0, (panel_h - before_source.height) // 2))
    after.paste(after_source, (0, (panel_h - after_source.height) // 2))
    panel_mask = Image.new("L", (panel_w, panel_h), 0)
    ImageDraw.Draw(panel_mask).rounded_rectangle((0, 0, panel_w - 1, panel_h - 1), radius=26, fill=255)
    before_panel = before.copy()
    before_draw = ImageDraw.Draw(before_panel)
    before_draw.rounded_rectangle((panel_w - 220, 18, panel_w - 18, 68), radius=25,
                                  fill=(255, 253, 248), outline=STROKE, width=2)
    draw_lines(before_draw, (panel_w - 214, 20, 190, 46), "รับคำตอบครบ", font(27, True), INK, 1, "center")
    after_panel = after.copy()
    after_draw = ImageDraw.Draw(after_panel)
    after_draw.rounded_rectangle((18, 18, 212, 68), radius=25,
                                 fill=(255, 253, 248), outline=GREEN, width=2)
    draw_lines(after_draw, (24, 20, 182, 46), "ทยอยแสดง", font(27, True), (7, 92, 74), 1, "center")

    total_frames = sum(count for _, count in stages)
    args = [ffmpeg, "-y", "-hide_banner", "-loglevel", "error", "-f", "rawvideo", "-pixel_format", "rgb24",
            "-video_size", f"{W}x{H}", "-framerate", str(FPS), "-i", "pipe:0", "-frames:v", str(total_frames),
            "-an", "-c:v", "libx264", "-preset", "ultrafast", "-crf", "18", "-pix_fmt", "yuv420p", str(output)]
    process = subprocess.Popen(args, stdin=subprocess.PIPE)
    try:
        for frame_index in range(total_frames):
            stage_index = min(frame_index // 110, len(stages) - 1)
            canvas = Image.open(stages[stage_index][0]).convert("RGB")
            t = frame_index / FPS

            # Catalog Soft Blur In: whole-heading reveal, never per glyph.
            title_p = max(0.0, min(1.0, t / 0.8))
            title_ease = 1 - (1 - title_p) ** 3
            if title_ease > 0:
                title_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
                title_draw = ImageDraw.Draw(title_layer)
                title_draw.text((96, 140 + round(28 * (1 - title_ease))), "คำตอบแสดงได้สองจังหวะ",
                                font=font(56, True), fill=(*INK, round(255 * title_ease)))
                blur_radius = 18 * (1 - title_ease)
                if blur_radius > 0.15:
                    title_layer = title_layer.filter(ImageFilter.GaussianBlur(blur_radius))
                canvas.paste(title_layer, (0, 0), title_layer)

            # Catalog Before After Wipe: 0.25s lead-in, 1.05s sine.inOut pass,
            # then hold the divider at the 50% comparison split.
            stage_opacity_p = max(0.0, min(1.0, t / 0.32))
            stage_opacity = 1 - (1 - stage_opacity_p) ** 2
            wipe_p = max(0.0, min(1.0, (t - 0.25) / 1.05))
            wipe_ease = (1 - math.cos(math.pi * wipe_p)) / 2
            split_x = round(panel_w * 0.5 * wipe_ease)
            panel = before_panel.copy()
            if split_x > 0:
                panel.paste(after_panel.crop((0, 0, split_x, panel_h)), (0, 0))

            divider_p = max(0.0, min(1.0, (t - 0.25) / 0.22))
            divider_alpha = round(255 * (1 - (1 - divider_p) ** 2))
            if divider_alpha > 0:
                panel_rgba = panel.convert("RGBA")
                pd = ImageDraw.Draw(panel_rgba)
                pd.line((split_x, 0, split_x, panel_h), fill=(255, 255, 255, divider_alpha), width=5)
                knob = 58
                cx, cy = split_x, panel_h // 2
                pd.ellipse((cx - knob // 2, cy - knob // 2, cx + knob // 2, cy + knob // 2),
                           fill=(255, 253, 248, divider_alpha), outline=(8, 121, 95, divider_alpha), width=5)
                panel = panel_rgba.convert("RGB")

            mask = panel_mask.point(lambda value: round(value * stage_opacity))
            canvas.paste(panel, (panel_x, panel_y), mask)
            process.stdin.write(canvas.tobytes())
    finally:
        if process.stdin:
            process.stdin.close()
    if process.wait() != 0:
        raise RuntimeError("ffmpeg failed while rendering the beat02 motion segment")


def render(stages):
    ffmpeg = which("ffmpeg")
    if not ffmpeg:
        raise RuntimeError("ffmpeg was not found on PATH")
    output = ROOT / "renders" / "EP03-animatic-v3.1.mp4"
    output.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="ep03-v31-", dir=output.parent) as temp_dir:
        segment = Path(temp_dir) / "beat02-wipe.mp4"
        render_beat02_segment(stages[2:5], segment)
        render_stages = stages[:2] + [(segment, 330)] + stages[5:]
        args = [ffmpeg, "-y", "-hide_banner", "-loglevel", "warning"]
        for image, frames in render_stages:
            if image == segment:
                args.extend(["-i", str(image)])
            else:
                args.extend(["-loop", "1", "-framerate", str(FPS), "-t", f"{frames / FPS:.6f}", "-i", str(image)])
        filters = []
        for i, (_, frames) in enumerate(render_stages):
            filters.append(f"[{i}:v]fps={FPS},scale={W}:{H}:flags=lanczos,trim=end_frame={frames},setpts=PTS-STARTPTS,setsar=1[v{i}]")
        joined = "".join(f"[v{i}]" for i in range(len(render_stages)))
        filters.append(f"{joined}concat=n={len(render_stages)}:v=1:a=0,format=yuv420p[outv]")
        args.extend(["-filter_complex", ";".join(filters), "-map", "[outv]", "-an", "-r", str(FPS),
                     "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-movflags", "+faststart", str(output)])
        subprocess.run(args, check=True)
    return output


if __name__ == "__main__":
    stages = create_plates()
    output = render(stages)
    total_frames = sum(frames for _, frames in stages)
    print(f"Wrote {output} ({len(stages)} stages incl. a Catalog-inspired wipe, {total_frames / FPS:.3f}s, silent)")

"""Pillow + FFmpeg fallback renderer for the EP03 v4.3.1 silent draft."""
from __future__ import annotations

import hashlib
import json
import shutil
import subprocess
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
W, H, FPS = 1080, 1920, 30
PAPER = "#F7F5EE"
CARD = "#FFFEFA"
INK = "#1D2B39"
MUTED = "#536575"
FOREST = "#006D5E"
SAGE = "#E1EEE9"
LINE = "#C9D7D2"
OCHRE = "#A97717"
TEAL = "#277D7A"
REGULAR = ROOT / "assets/fonts/Sarabun-Regular.ttf"
BOLD = ROOT / "assets/fonts/Sarabun-Bold.ttf"


def fnt(size: int, bold: bool = False):
    return ImageFont.truetype(str(BOLD if bold else REGULAR), size, layout_engine=ImageFont.Layout.BASIC)


def width(draw, value: str, font) -> int:
    box = draw.textbbox((0, 0), value, font=font)
    return box[2] - box[0]


def centered(draw, x: int, y: int, value: str, font, fill=INK):
    draw.text((x - width(draw, value, font) / 2, y), value, font=font, fill=fill)


def arrow(draw, start, end, color=FOREST, line_width=7, head=22):
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
    for y in range(0, H, 50):
        draw.line((0, y, W, y), fill="#F0EEE7", width=1)
    draw.text((72, 48), "LANGMIND · EP03 / CHAT API", font=fnt(28, True), fill=FOREST)
    page_text = f"{page:02d} / 09"
    draw.text((1008 - width(draw, page_text, fnt(26, True)), 50), page_text, font=fnt(26, True), fill=MUTED)
    labels = ["รู้จักแชต", "ส่งคำถาม", "ถามต่อ"]
    centers = [226, 540, 854]
    colors = [FOREST, OCHRE, TEAL]
    for i, (label, cx, color) in enumerate(zip(labels, centers, colors), 1):
        active = beat["step"] >= i
        fill = [SAGE, "#F4EAD4", "#E1F0EE"][i - 1] if active else CARD
        stroke = color if active else LINE
        draw.rounded_rectangle((72 + (i - 1) * 313, 112, 72 + (i - 1) * 313 + 300, 174), radius=30, fill=fill, outline=stroke, width=2)
        draw.ellipse((cx - 18, 127, cx + 18, 163), fill=color if active else "#D7DFDD")
        centered(draw, cx, 130, str(i), fnt(20, True), "white" if active else INK)
        centered(draw, cx + 78, 125, label, fnt(25, True), color if active else MUTED)
    draw.text((72, 208), beat["title"], font=fnt(64, True), fill=INK)
    return canvas


def panel(draw, box, fill=CARD, outline=LINE, radius=22, shadow=SAGE):
    x0, y0, x1, y1 = box
    if shadow:
        draw.rounded_rectangle((x0 + 10, y0 + 10, x1 + 10, y1 + 10), radius=radius, fill=shadow)
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=3)


def caption(canvas, subtitle: str):
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((72, 1492, 1008, 1740), radius=24, fill="#15283A")
    draw.rounded_rectangle((72, 1492, 88, 1740), radius=8, fill=FOREST)
    lines = subtitle.splitlines()[:2]
    font = fnt(38, True)
    heights = [draw.textbbox((0, 0), line, font=font)[3] for line in lines]
    total = sum(heights) + (16 if len(lines) == 2 else 0)
    y = 1616 - total / 2
    for line, h in zip(lines, heights):
        centered(draw, W // 2, int(y), line, font, CARD)
        y += h + 16


def draw_img(canvas, image, box):
    x, y, w, h = box
    fitted = image.resize((w, h), Image.Resampling.LANCZOS)
    if fitted.mode == "RGBA":
        canvas.paste(fitted, (x, y), fitted)
    else:
        canvas.paste(fitted, (x, y))
    ImageDraw.Draw(canvas).rounded_rectangle((x, y, x + w, y + h), radius=18, outline=LINE, width=3)


def scene_b1(canvas, elapsed, screen1, robot):
    draw_img(canvas, screen1, (120, 300, 840, 1050))
    canvas.paste(robot, (8, 1180), robot)


def scene_b2(canvas, elapsed):
    draw = ImageDraw.Draw(canvas)
    titles = [
        ("แอปของคุณ", "แสดงหน้าจอให้ผู้ใช้"),
        ("server", "เก็บ API key และส่งคำถาม"),
        ("LangMind Chat API", "รับคำขอและส่งข้อมูลกลับ"),
        ("ผู้ช่วยที่เลือกไว้", "สร้างคำตอบให้บทสนทนา"),
    ]
    x0, x1 = 210, 870
    ys = [350, 560, 770, 980]
    for i, ((title, note), y) in enumerate(zip(titles, ys)):
        panel(draw, (x0, y, x1, y + 142), fill=CARD, shadow="#E5EBE6")
        draw.text((x0 + 34, y + 20), title, font=fnt(42, True), fill=INK)
        draw.text((x0 + 34, y + 78), note, font=fnt(29), fill=MUTED)
        if i < len(ys) - 1 and elapsed > 0.5 + i * 0.45:
            arrow(draw, (540, y + 148), (540, ys[i + 1] - 12), FOREST, 6, 18)
    if elapsed > 2.4:
        arrow(draw, (900, 1122), (900, 432), TEAL, 6, 18)
        draw.rounded_rectangle((812, 690, 1020, 746), radius=24, fill="#E1F0EE", outline=TEAL, width=2)
        centered(draw, 916, 698, "คำตอบกลับ", fnt(27, True), TEAL)


def scene_b3(canvas, elapsed):
    draw = ImageDraw.Draw(canvas)
    rows = [
        ("agent_id", "เลือกว่าจะคุยกับผู้ช่วยตัวไหน", FOREST),
        ("API key · chat:invoke", "สิทธิ์เรียก Chat API · เก็บ key ที่ server", TEAL),
    ]
    for i, (title, note, color) in enumerate(rows):
        start = 0.35 + i * 0.9
        if elapsed < start:
            continue
        y = 405 + i * 300
        panel(draw, (120, y, 960, y + 214), shadow="#E5EBE6")
        draw.rounded_rectangle((154, y + 50, 186, y + 164), radius=14, fill=color)
        draw.text((222, y + 44), title, font=fnt(42, True), fill=color)
        draw.text((222, y + 116), note, font=fnt(29), fill=INK)
    if elapsed > 2.1:
        draw.rounded_rectangle((210, 1040, 870, 1120), radius=38, fill="#E1F0EE", outline=TEAL, width=2)
        centered(draw, 540, 1056, "ห้ามใส่ API key ในหน้าเว็บ", fnt(30, True), TEAL)


def scene_b4(canvas, elapsed):
    draw = ImageDraw.Draw(canvas)
    panel(draw, (110, 330, 970, 1390), fill=CARD, shadow=SAGE)
    draw.rounded_rectangle((112, 332, 968, 444), radius=20, fill=SAGE)
    draw.rectangle((112, 410, 968, 444), fill=SAGE)
    draw.text((148, 360), "POST /api/chat/message", font=fnt(38, True), fill=INK)
    draw.text((148, 474), "Authorization: Bearer $LM_TOKEN · server", font=fnt(28, True), fill=FOREST)
    lines = [
        "{",
        '  "agent_id": "YOUR_AGENT_ID",',
        '  "query": "ขอเลื่อนประชุมเป็น 15:00",',
        '  "conversation_id": null,',
        '  "attachment_ids": []',
        "}",
    ]
    y0, step = 570, 108
    highlight = max(0.0, min(1.0, (elapsed - 0.3) / 0.8))
    y = y0 + step * 3
    if highlight > 0:
        draw.rounded_rectangle((164, y - 10, 164 + int(760 * highlight), y + 65), radius=12, fill="#E1EEE9")
        draw.rounded_rectangle((164, y - 10, 174, y + 65), radius=4, fill=FOREST)
    for i, line in enumerate(lines):
        yy = y0 + i * step
        color = FOREST if "conversation_id" in line else INK
        draw.text((144, yy), f"{i + 1}", font=fnt(26), fill=MUTED)
        draw.text((194, yy), line, font=fnt(31), fill=color)
    draw.rounded_rectangle((222, 1240, 858, 1320), radius=38, fill="#F4EAD4", outline=OCHRE, width=2)
    centered(draw, 540, 1254, "conversation_id: null = เริ่มบทสนทนาใหม่", fnt(28, True), "#78540F")


def scene_b5(canvas, elapsed):
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((126, 306, 954, 366), radius=28, fill="#E1F0EE", outline=TEAL, width=2)
    centered(draw, 540, 314, "ภาพอธิบาย · ลำดับการส่งคำตอบ", fnt(28, True), TEAL)
    events = [("message_start", "เริ่มต้นและให้รหัสห้อง", 420), ("message", "คำตอบทยอยมาเป็นช่วง ๆ", 720), ("message_end", "คำตอบครบแล้ว", 1170)]
    draw.line((164, 470, 164, 1210), fill=LINE, width=7)
    for i, (name, note, y) in enumerate(events):
        start = 0.35 + i * 2.2
        if elapsed < start:
            continue
        color = TEAL if i == 2 else FOREST
        draw.ellipse((142, y + 5, 186, y + 49), fill=color, outline=CARD, width=4)
        panel(draw, (220, y - 18, 920, y + 104), shadow="#E5EBE6")
        draw.text((252, y - 2), name, font=fnt(35, True), fill=color)
        draw.text((252, y + 48), note, font=fnt(28), fill=INK)
    if elapsed > 2.0:
        chunks = ["ขอเลื่อนประชุม", "จาก 14:00", "เป็น 15:00"]
        for i, value in enumerate(chunks):
            if elapsed < 2.0 + i * 0.8:
                continue
            x = 250 + i * 202
            draw.rounded_rectangle((x, 900, x + 180, 966), radius=18, fill=SAGE, outline=FOREST, width=2)
            centered(draw, x + 90, 912, value, fnt(25, True), INK)
    if elapsed > 4.4:
        centered(draw, 540, 1300, "แอปเป็นผู้เลือกวิธีแสดงข้อความ", fnt(28, True), MUTED)


def scene_b6(canvas, elapsed):
    draw = ImageDraw.Draw(canvas)
    x0, y0, x1, y1 = 140, 380, 940, 1040
    offset = round(14 * max(0.0, 1.0 - elapsed / 0.45))
    panel(draw, (x0, y0 - offset, x1, y1 - offset), shadow=SAGE)
    draw.rounded_rectangle((220, 430 - offset, 860, 492 - offset), radius=30, fill="#E1F0EE", outline=TEAL, width=2)
    centered(draw, 540, 440 - offset, "ภาพอธิบาย · ไม่มี ID จริง", fnt(28, True), TEAL)
    centered(draw, 540, 562 - offset, "conversation_id", fnt(48, True), INK)
    draw.rounded_rectangle((220, 652 - offset, 860, 766 - offset), radius=24, fill=CARD, outline=FOREST, width=3)
    centered(draw, 540, 674 - offset, "รหัสของบทสนทนานี้", fnt(40, True), FOREST)
    centered(draw, 540, 846 - offset, "เก็บไว้ใช้เมื่อต้องถามต่อ", fnt(32), MUTED)
    if elapsed > 1.2:
        arrow(draw, (780, 1150), (300, 1150), TEAL, 6, 20)
        centered(draw, 540, 1070, "API ส่งรหัสกลับมา", fnt(32, True), INK)


def scene_b7(canvas, elapsed, screen2):
    draw_img(canvas, screen2, (140, 300, 800, 1000))
    if elapsed > 0.8:
        draw = ImageDraw.Draw(canvas)
        draw.rounded_rectangle((140, 1360, 940, 1448), radius=44, fill="#E1F0EE", outline=TEAL, width=2)
        centered(draw, 540, 1380, "conversation_id เดิม  +  คำถามใหม่", fnt(34, True), TEAL)


def scene_b8(canvas, elapsed):
    draw = ImageDraw.Draw(canvas)
    cards = [
        ("ส่งข้อความและควบคุม", "รับคำตอบเป็นช่วง · รอคำตอบครบ\nพรีวิว · หยุดการส่ง", "ส่ง / ควบคุม", 340),
        ("ดูแลบทสนทนา", "ดูรายการ · เปิดประวัติ\nเปลี่ยนชื่อ · ปิดหรือลบ", "ประวัติ", 650),
        ("ให้คะแนนและรับไฟล์", "ให้คะแนนคำตอบ\nดาวน์โหลดไฟล์ที่ Agent สร้าง", "คำตอบ", 960),
    ]
    for i, (title, note, tag, y) in enumerate(cards):
        if elapsed < 0.3 + i * 1.15:
            continue
        panel(draw, (120, y, 960, y + 238), shadow=SAGE)
        draw.rounded_rectangle((700, y + 28, 918, y + 72), radius=22, fill="#E1F0EE", outline=TEAL, width=1)
        centered(draw, 809, y + 35, tag, fnt(23, True), TEAL)
        draw.text((158, y + 27), title, font=fnt(37, True), fill=FOREST)
        draw.multiline_text((158, y + 102), note, font=fnt(27), fill=INK, spacing=7)
    if elapsed > 4:
        centered(draw, 540, 1270, "ทั้งหมดนี้คือความสามารถของ Chat API", fnt(28, True), MUTED)


def scene_b9(canvas, elapsed, logo):
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((120, 350, 960, 1070), radius=34, fill=CARD, outline=LINE, width=3)
    draw_img(canvas, logo, (325, 410, 430, 378))
    centered(draw, 540, 850, "langmind.in.th", fnt(42, True), FOREST)
    labels = ["เลือกผู้ช่วย", "ส่งคำถาม", "เก็บรหัสไว้ถามต่อ"]
    colors = [FOREST, OCHRE, TEAL]
    for i, (label, color) in enumerate(zip(labels, colors)):
        x = 128 + i * 310
        draw.rounded_rectangle((x, 1160, x + 286, 1270), radius=24, fill=CARD, outline=color, width=3)
        centered(draw, x + 143, 1190, label, fnt(28, True), color)
        if i < 2:
            arrow(draw, (x + 292, 1225), (x + 304, 1225), MUTED, 4, 12)


SCREENS = [
    Image.open(ROOT / "assets/screens/CHAT-01.png").convert("RGB"),
    Image.open(ROOT / "assets/screens/CHAT-02.png").convert("RGB"),
]
ROBOT = Image.open(ROOT / "assets/robot/01-question.png").convert("RGBA").resize((100, 165), Image.Resampling.LANCZOS)
LOGO = Image.open(ROOT / "assets/brand/langmind-logo.png").convert("RGBA")


RENDERERS = {
    "b1": lambda canvas, elapsed: scene_b1(canvas, elapsed, SCREENS[0], ROBOT),
    "b2": scene_b2,
    "b3": scene_b3,
    "b4": scene_b4,
    "b5": scene_b5,
    "b6": scene_b6,
    "b7": lambda canvas, elapsed: scene_b7(canvas, elapsed, SCREENS[1]),
    "b8": scene_b8,
    "b9": lambda canvas, elapsed: scene_b9(canvas, elapsed, LOGO),
}


def main():
    timing_path = ROOT / "timing.generated.json"
    if not timing_path.exists():
        raise SystemExit("Run node build.mjs before the raster fallback renderer.")
    source = json.loads(timing_path.read_text(encoding="utf-8"))
    beats = source["beats"]
    total = float(source["totalDurationSeconds"])
    frame_count = round(total * FPS)
    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        raise SystemExit("ffmpeg is not on PATH.")
    out_dir = ROOT / "renders"
    out_dir.mkdir(parents=True, exist_ok=True)
    output = out_dir / "ep03-v4.3.1-silent.mp4"
    args = [ffmpeg, "-y", "-hide_banner", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s:v", f"{W}x{H}", "-r", str(FPS), "-i", "pipe:0", "-an", "-c:v", "libx264", "-preset", "fast", "-crf", "19", "-pix_fmt", "yuv420p", "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709", "-movflags", "+faststart", str(output)]
    proc = subprocess.Popen(args, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
    assert proc.stdin is not None
    try:
        index = 0
        for frame in range(frame_count):
            t = frame / FPS
            while index < len(beats) - 1 and t >= beats[index]["endSeconds"]:
                index += 1
            beat = beats[index]
            elapsed = max(0.0, t - beat["startSeconds"])
            canvas = base(beat, index + 1)
            RENDERERS[beat["id"]](canvas, elapsed)
            caption(canvas, beat["subtitle"])
            proc.stdin.write(canvas.tobytes())
            if frame and frame % 300 == 0:
                print(f"Rendered {frame}/{frame_count} frames", flush=True)
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
    manifest = {"file": output.name, "renderer": "Pillow + FFmpeg fallback; native HyperFrames visual render not verified in this sandbox", "width": W, "height": H, "fps": FPS, "frames": frame_count, "expectedDurationSeconds": total, "frameDurationSeconds": frame_count / FPS, "audio": False, "sha256": digest, "bytes": output.stat().st_size, "ffmpegExitCode": exit_code}
    (out_dir / "render-manifest-v4.3.1.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Rendered {output} ({frame_count} frames, {frame_count / FPS:.3f}s), SHA-256 {digest}", flush=True)


if __name__ == "__main__":
    main()

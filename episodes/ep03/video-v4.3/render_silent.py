"""Raster fallback render for EP03 v4.3 when Chromium cannot reach HyperFrames' local server."""
from __future__ import annotations

import hashlib
import json
import math
import shutil
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
W, H, FPS = 1080, 1920, 30
GROUND = "#F1F6F4"
INK = "#183431"
MUTED = "#52706A"
ACCENT = "#087F68"
SAGE = "#D5E8DF"
LINE = "#A9C2B9"
WHITE = "#FFFFFF"
REGULAR = ROOT / "assets/fonts/Sarabun-Regular.ttf"
BOLD = ROOT / "assets/fonts/Sarabun-Bold.ttf"


def fnt(size: int, bold: bool = False):
    return ImageFont.truetype(str(BOLD if bold else REGULAR), size, layout_engine=ImageFont.Layout.BASIC)


def text(draw: ImageDraw.ImageDraw, xy, value: str, font, fill=INK, spacing=5):
    x, y = xy
    if "\n" in value:
        draw.multiline_text((x, y), value, font=font, fill=fill, spacing=spacing, align="left")
    else:
        draw.text((x, y), value, font=font, fill=fill)


def tw(draw, value: str, font) -> int:
    box = draw.textbbox((0, 0), value, font=font)
    return box[2] - box[0]


def arrow(draw, start, end, color=INK, width=6, size=18):
    draw.line((start, end), fill=color, width=width)
    x1, y1 = start
    x2, y2 = end
    if y2 >= y1:
        points = [(x2, y2), (x2 - size, y2 - size), (x2 + size, y2 - size)]
    else:
        points = [(x2, y2), (x2 - size, y2 + size), (x2 + size, y2 + size)]
    draw.polygon(points, fill=color)


def fresh(bg=GROUND):
    return Image.new("RGB", (W, H), bg)


def headline(draw, value: str):
    text(draw, (72, 170), value, fnt(68, True), INK, spacing=4)


def caption(canvas, beat):
    draw = ImageDraw.Draw(canvas)
    x0, y0, x1, y1 = 72, 1136, 1008, 1320
    draw.rectangle((x0, y0, x1, y1), fill=INK)
    draw.rectangle((x0, y0, x0 + 8, y1), fill=ACCENT)
    lines = beat["subtitle"].splitlines()
    capfont = fnt(34)
    y = 1156
    for line in lines[:3]:
        text(draw, (106, y), line, capfont, WHITE)
        y += 47


def load_visuals():
    screen1 = Image.open(ROOT / "assets/screens/CHAT-01.png").convert("RGB").crop((0, 0, 1440, 1400)).resize((840, 817), Image.Resampling.LANCZOS)
    screen2 = Image.open(ROOT / "assets/screens/CHAT-02.png").convert("RGB").crop((0, 0, 1440, 1400)).resize((840, 817), Image.Resampling.LANCZOS)
    robot = Image.open(ROOT / "assets/robot/01-question.png").convert("RGBA").resize((108, 178), Image.Resampling.LANCZOS)
    logo = Image.open(ROOT / "assets/brand/langmind-logo.png").convert("RGBA")
    logo_h = round(710 * logo.height / logo.width)
    logo = logo.resize((710, logo_h), Image.Resampling.LANCZOS)
    return screen1, screen2, robot, logo


SCREEN1, SCREEN2, ROBOT, LOGO = load_visuals()


def draw_screen(canvas, image, x, y):
    canvas.paste(image, (x, y))
    draw = ImageDraw.Draw(canvas)
    draw.rectangle((x, y, x + 839, y + 816), outline=LINE, width=2)


def scene_b1(elapsed):
    canvas = fresh()
    draw = ImageDraw.Draw(canvas)
    headline(draw, "ขอร่าง แล้วขอแก้ต่อ")
    draw_screen(canvas, SCREEN1, 120, 280)
    canvas.paste(ROBOT, (8, 912), ROBOT)
    return canvas


def scene_b2(elapsed):
    canvas = fresh()
    draw = ImageDraw.Draw(canvas)
    headline(draw, "หน้าจอเป็นของแอป")
    top, bottom, x = 352, 962, 190
    request_progress = max(0.0, min(1.0, (elapsed - 0.3) / 2.2))
    req_end = int(top + (bottom - top) * request_progress)
    if request_progress > 0:
        draw.line((x, top, x, req_end), fill=INK, width=6)
    if request_progress >= 0.96:
        arrow(draw, (x, bottom - 28), (x, bottom), INK, width=6, size=16)
    response_progress = max(0.0, min(1.0, (elapsed - 3.2) / 2.2))
    resp_start = int(bottom - (bottom - top) * response_progress)
    if response_progress > 0:
        draw.line((925, bottom, 925, resp_start), fill=ACCENT, width=6)
    if response_progress >= 0.96:
        arrow(draw, (925, top + 28), (925, top), ACCENT, width=6, size=16)
    roles = [
        (0.4, 345, "แอปของคุณ", "หน้าจอที่ผู้ใช้เห็น"),
        (1.2, 525, "server", "เก็บ key และเรียก API"),
        (2.0, 704, "LangMind Chat API", "รับคำถามและส่ง event กลับ"),
        (2.8, 882, "Agent", "Agent ที่เตรียมไว้"),
    ]
    for start, y, title, note in roles:
        draw.ellipse((178, y + 26, 202, y + 50), fill=ACCENT if elapsed >= start else GROUND, outline=INK, width=4)
        if elapsed >= start:
            text(draw, (270, y), title, fnt(48, True), INK)
            text(draw, (270, y + 57), note, fnt(32), MUTED)
    if elapsed >= 3.4:
        text(draw, (820, 565), "SSE กลับ", fnt(30, True), ACCENT)
    return canvas


def scene_b3(elapsed):
    canvas = fresh()
    draw = ImageDraw.Draw(canvas)
    headline(draw, "เตรียมก่อนเรียก API")
    line_progress = max(0.0, min(1.0, (elapsed - 0.2) / 2.8))
    end_y = int(380 + 530 * line_progress)
    if line_progress > 0:
        draw.line((146, 380, 146, end_y), fill=LINE, width=6)
    rows = [
        (0.5, 365, "agent_id", "ใช้ ID ของ Agent ที่มีอยู่"),
        (1.5, 585, "chat:invoke", "สิทธิ์สำหรับเรียก Chat API"),
        (2.5, 805, "API key → server", "เก็บ secret ฝั่ง server ไม่ใส่ browser"),
    ]
    for start, y, label, note in rows:
        if elapsed < start:
            continue
        draw.ellipse((132, y + 8, 160, y + 36), fill=GROUND, outline=ACCENT, width=5)
        text(draw, (250, y), label, fnt(48, True), INK)
        text(draw, (250, y + 64), note, fnt(32), MUTED)
    return canvas


def scene_b4(elapsed):
    canvas = fresh()
    draw = ImageDraw.Draw(canvas)
    headline(draw, "ส่งคำถาม")
    text(draw, (144, 256), "SSE stream · Authorization: Bearer $LM_TOKEN", fnt(30, True), ACCENT)
    x, y, w, h = 144, 300, 792, 820
    draw.rounded_rectangle((x, y, x + w, y + h), radius=18, fill=WHITE, outline=LINE, width=3)
    draw.rounded_rectangle((x, y, x + w, y + 100), radius=18, fill="#E5EFEA", outline=LINE, width=3)
    draw.rectangle((x, y + 78, x + w, y + 101), fill="#E5EFEA")
    text(draw, (x + 32, y + 24), "POST /api/chat/message · body", fnt(34, True), INK)
    lines = [
        "{",
        '  "agent_id": "YOUR_AGENT_ID",',
        '  "query": "ขอเลื่อนประชุม 14:00 เป็น 15:00 แบบสุภาพ",',
        '  "conversation_id": null,',
        '  "attachment_ids": []',
        "}",
    ]
    codefont = fnt(30)
    line_h = 64
    start_y = y + 150
    active = 3
    active_text = lines[active]
    sweep_progress = max(0.0, min(1.0, (elapsed - 0.2) / 0.9))
    active_width = min(w - 110, tw(draw, active_text, codefont) + 28)
    highlight_width = int(active_width * sweep_progress)
    if highlight_width > 0:
        hy = start_y + active * line_h - 4
        draw.rounded_rectangle((x + 76, hy, x + 76 + highlight_width, hy + 48), radius=8, fill="#E1F2EA")
        draw.rectangle((x + 76, hy, x + 81, hy + 48), fill=ACCENT)
    for i, line in enumerate(lines):
        yy = start_y + i * line_h
        text(draw, (x + 23, yy), str(i + 1), fnt(25), MUTED)
        color = ACCENT if any(key in line for key in ('"agent_id"', '"query"', '"conversation_id"', '"attachment_ids"')) else INK
        if "YOUR_AGENT_ID" in line:
            color = "#4D7400"
        text(draw, (x + 76, yy), line, codefont, color)
    return canvas


def scene_b5(elapsed):
    canvas = fresh()
    draw = ImageDraw.Draw(canvas)
    headline(draw, "คำตอบทยอยกลับ")
    text(draw, (126, 272), "ลำดับ event ในตัวอย่าง · ภาพอธิบาย", fnt(32, True), ACCENT)
    top, bottom = 362, 930
    progress = max(0.0, min(1.0, (elapsed - 0.2) / 6.4))
    end_y = int(top + (bottom - top) * progress)
    if progress > 0:
        draw.line((138, top, 138, end_y), fill=LINE, width=6)
    rows = [
        (0.5, 352, "message_start", "ให้ conversation_id และ message_id", False),
        (2.2, 512, "message", "ส่งข้อความเป็นช่วง ๆ", False),
        (4.1, 672, "citations · อาจมี", "ไม่ใช่ทุกคำตอบจะมี event นี้", True),
        (6.0, 832, "message_end", "มีคำตอบเต็มและ usage", False),
    ]
    for start, y, title, note, dashed in rows:
        if elapsed < start:
            continue
        box = (122, y + 12, 154, y + 44)
        draw.ellipse(box, fill=ACCENT if title == "message_end" else GROUND, outline=ACCENT, width=5)
        if dashed:
            draw.arc((122, y + 12, 154, y + 44), 20, 330, fill=ACCENT, width=5)
        text(draw, (200, y), title, fnt(43, True), INK)
        text(draw, (200, y + 54), note, fnt(32), MUTED)
    return canvas


def scene_b6(elapsed):
    canvas = fresh()
    draw = ImageDraw.Draw(canvas)
    headline(draw, "ถามต่อในบทสนทนาเดิม")
    draw_screen(canvas, SCREEN2, 120, 260)
    if elapsed >= 0.6:
        text(draw, (180, 1082), "conversation_id เดิม → request ถัดไป", fnt(32, True), ACCENT)
    return canvas


def draw_route(draw, y, method, endpoint, suffix=""):
    method_font = fnt(24 if method == "PATCH / DELETE" else 28, True)
    route_font = fnt(28)
    text(draw, (116, y), method, method_font, MUTED)
    x = 330
    text(draw, (x, y), endpoint, route_font, INK)
    if suffix:
        suffix_font = fnt(26, True)
        suffix_width = tw(draw, suffix, suffix_font)
        text(draw, (1008 - suffix_width, y), suffix, suffix_font, ACCENT)


def scene_b7(elapsed):
    canvas = fresh()
    draw = ImageDraw.Draw(canvas)
    headline(draw, "Chat API ทำอะไรได้บ้าง?")
    if elapsed >= 0.4:
        text(draw, (116, 310), "ส่งข้อความและควบคุม", fnt(34, True), ACCENT)
        draw_route(draw, 354, "POST", "/api/chat/message", "SSE")
        draw_route(draw, 398, "POST", "/api/chat/message/blocking", "JSON")
        draw_route(draw, 442, "POST", "/api/chat/preview", "Agent Builder")
        draw_route(draw, 486, "POST", "/api/chat/messages/{id}/stop")
    if elapsed >= 2.3:
        text(draw, (116, 548), "อ่านและจัดการประวัติ", fnt(34, True), ACCENT)
        draw_route(draw, 592, "GET", "/api/chat/conversations")
        draw_route(draw, 636, "GET", "/api/chat/conversations/{id}")
        draw_route(draw, 680, "GET", "/api/chat/conversations/{id}/messages")
        draw_route(draw, 724, "PATCH / DELETE", "/api/chat/conversations/{id}")
    if elapsed >= 4.6:
        text(draw, (116, 790), "feedback และไฟล์", fnt(34, True), ACCENT)
        draw_route(draw, 834, "POST", "/api/chat/messages/{id}/feedback")
        draw_route(draw, 878, "GET", "/api/chat/messages/{id}/generated-files/")
        text(draw, (248, 916), "{file_id}", fnt(28), INK)
    if elapsed >= 6.4:
        text(draw, (116, 1050), "ทุก endpoint ใช้ chat:invoke · งานประวัติต้องระบุ agent_id", fnt(28, True), MUTED)
    return canvas


def scene_b8(elapsed):
    canvas = fresh()
    draw = ImageDraw.Draw(canvas)
    headline(draw, "กลับไปที่ผู้ใช้")
    draw_screen(canvas, SCREEN2, 120, 260)
    if elapsed >= 0.5:
        text(draw, (168, 1082), "server ส่ง → แอปแสดง → ID ใช้ถามต่อ", fnt(32, True), ACCENT)
    return canvas


def scene_b9(elapsed):
    canvas = fresh(WHITE)
    draw = ImageDraw.Draw(canvas)
    x = 185 + round(36 * (1 - min(1, max(0, (elapsed - 0.2) / 0.5))))
    canvas.paste(LOGO, (x, 360), LOGO)
    brand, url = "LangMind API", "langmind.in.th"
    text(draw, ((W - tw(draw, brand, fnt(54, True))) // 2, 1000), brand, fnt(54, True), INK)
    text(draw, ((W - tw(draw, url, fnt(40))) // 2, 1075), url, fnt(40), ACCENT)
    return canvas


RENDERERS = {
    "b1": scene_b1,
    "b2": scene_b2,
    "b3": scene_b3,
    "b4": scene_b4,
    "b5": scene_b5,
    "b6": scene_b6,
    "b7": scene_b7,
    "b8": scene_b8,
    "b9": scene_b9,
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
    output = out_dir / "ep03-v4.3-silent.mp4"
    args = [
        ffmpeg,
        "-y",
        "-hide_banner",
        "-loglevel", "error",
        "-f", "rawvideo",
        "-pix_fmt", "rgb24",
        "-s:v", f"{W}x{H}",
        "-r", str(FPS),
        "-i", "pipe:0",
        "-an",
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "19",
        "-pix_fmt", "yuv420p",
        "-color_primaries", "bt709",
        "-color_trc", "bt709",
        "-colorspace", "bt709",
        "-movflags", "+faststart",
        str(output),
    ]
    proc = subprocess.Popen(args, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
    assert proc.stdin is not None
    try:
        beat_index = 0
        for frame in range(frame_count):
            t = frame / FPS
            while beat_index < len(beats) - 1 and t >= beats[beat_index]["endSeconds"]:
                beat_index += 1
            beat = beats[beat_index]
            elapsed = max(0.0, t - beat["startSeconds"])
            canvas = RENDERERS[beat["id"]](elapsed)
            caption(canvas, beat)
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
    manifest = {
        "file": str(output.relative_to(ROOT)),
        "renderer": "Pillow + FFmpeg fallback; HyperFrames native snapshot/render blocked by sandbox localhost access",
        "width": W,
        "height": H,
        "fps": FPS,
        "frames": frame_count,
        "expectedDurationSeconds": total,
        "frameDurationSeconds": frame_count / FPS,
        "audio": False,
        "sha256": digest,
        "bytes": output.stat().st_size,
        "ffmpegExitCode": exit_code,
    }
    (out_dir / "render-manifest-v4.3.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(f"Rendered {output} ({frame_count} frames, {frame_count / FPS:.3f}s), SHA-256 {digest}", flush=True)


if __name__ == "__main__":
    main()

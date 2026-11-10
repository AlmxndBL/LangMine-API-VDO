"""Deterministic raster mockups for EP03 v4.3; no network or API access."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "assets" / "screens"
REGULAR = ROOT / "assets" / "fonts" / "Sarabun-Regular.ttf"
BOLD = ROOT / "assets" / "fonts" / "Sarabun-Bold.ttf"
W, H = 1440, 1800

BG = "#F1F6F4"
INK = "#183431"
MUTED = "#52706A"
GREEN = "#087F68"
USER_BUBBLE = "#D5E8DF"
WHITE = "#FFFFFF"
LINE = "#B6C9C2"


def font(path: Path, size: int):
    try:
        return ImageFont.truetype(str(path), size, layout_engine=ImageFont.Layout.RAQM)
    except (AttributeError, OSError, TypeError):
        return ImageFont.truetype(str(path), size)


def rounded(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def draw_header(draw):
    draw.rectangle((0, 0, W, 200), fill="#E5EFEA")
    draw.line((0, 200, W, 200), fill=LINE, width=3)
    draw.text((72, 54), "แชตตัวอย่าง", font=font(BOLD, 56), fill=INK)
    draw.rectangle((1075, 65, 1368, 137), fill=WHITE, outline=GREEN, width=3)
    draw.text((1100, 75), "ภาพจำลอง", font=font(BOLD, 39), fill=GREEN)


def draw_bubble(draw, box, label, text, *, user=False, size=47):
    x1, y1, x2, y2 = box
    fill = USER_BUBBLE if user else WHITE
    stroke = GREEN if user else LINE
    rounded(draw, box, 30, fill, stroke, 3)
    label_font = font(BOLD, 32)
    body_font = font(BOLD if user else REGULAR, size)
    label_color = GREEN if user else MUTED
    draw.text((x1 + 34, y1 + 23), label, font=label_font, fill=label_color)
    draw.multiline_text((x1 + 34, y1 + 70), text, font=body_font, fill=INK, spacing=12, align="left")


def draw_composer(draw):
    rounded(draw, (72, 1535, 1368, 1710), 24, WHITE, LINE, 3)
    draw.text((112, 1587), "พิมพ์ข้อความ…", font=font(REGULAR, 43), fill="#71847F")
    rounded(draw, (1220, 1570, 1336, 1678), 18, GREEN)
    draw.polygon([(1250, 1634), (1308, 1598), (1308, 1626), (1320, 1636), (1308, 1648), (1308, 1670)], fill=WHITE)


def make_chat01():
    image = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(image)
    draw_header(draw)
    draw_bubble(
        draw,
        (278, 285, 1368, 560),
        "คุณ",
        "ช่วยร่างข้อความเลื่อนประชุมจาก\n14:00 เป็น 15:00 ให้สุภาพหน่อย",
        user=True,
        size=48,
    )
    draw_bubble(
        draw,
        (72, 650, 1160, 895),
        "ผู้ช่วย",
        "ขอเลื่อนประชุมวันนี้จาก 14:00\nเป็น 15:00 นะคะ",
        size=50,
    )
    draw_composer(draw)
    image.save(OUT / "CHAT-01.png", optimize=True)


def make_chat02():
    image = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(image)
    draw_header(draw)
    draw_bubble(
        draw,
        (278, 285, 1368, 560),
        "คุณ",
        "ช่วยร่างข้อความเลื่อนประชุมจาก\n14:00 เป็น 15:00 ให้สุภาพหน่อย",
        user=True,
        size=48,
    )
    draw_bubble(
        draw,
        (72, 650, 1160, 895),
        "ผู้ช่วย",
        "ขอเลื่อนประชุมวันนี้จาก 14:00\nเป็น 15:00 นะคะ",
        size=50,
    )
    draw_bubble(draw, (278, 945, 1368, 1125), "คุณ", "ขอย่อให้เหลือประโยคเดียว", user=True, size=48)
    draw_bubble(draw, (72, 1190, 1160, 1375), "ผู้ช่วย", "ขอเลื่อนประชุมวันนี้เป็น 15:00 นะคะ", size=50)
    draw_composer(draw)
    image.save(OUT / "CHAT-02.png", optimize=True)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    if not REGULAR.is_file() or not BOLD.is_file():
        raise SystemExit("Sarabun fonts are required in assets/fonts before drawing screens.")
    make_chat01()
    make_chat02()
    print(f"Created CHAT-01.png and CHAT-02.png ({W}x{H}, RGB)")


if __name__ == "__main__":
    main()

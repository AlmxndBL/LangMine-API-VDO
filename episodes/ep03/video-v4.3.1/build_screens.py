"""Build the two illustrative chat screens for EP03 v4.3.1."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "assets/screens"
W, H = 1440, 1800
PAPER = "#fcfbf7"
CARD = "#f6f4ee"
INK = "#2c2825"
MUTED = "#625c55"
LINE = "#ded8cc"
GREEN = "#dcebe1"
WHITE = "#ffffff"
FONT = ROOT / "assets/fonts/Sarabun-Regular.ttf"
BOLD = ROOT / "assets/fonts/Sarabun-Bold.ttf"


def font(size, bold=False):
    return ImageFont.truetype(str(BOLD if bold else FONT), size, layout_engine=ImageFont.Layout.BASIC)


def centered(draw, x, y, value, f, fill):
    box = draw.textbbox((0, 0), value, font=f)
    draw.text((x - (box[2] - box[0]) / 2, y), value, font=f, fill=fill)


def make_base():
    im = Image.new("RGB", (W, H), PAPER)
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((28, 28, 1412, 1772), radius=42, fill=WHITE, outline=INK, width=4)
    d.rounded_rectangle((42, 42, 1398, 1758), radius=34, fill=PAPER)
    d.text((88, 82), "แชตตัวอย่าง", font=font(58, True), fill=INK)
    badge = (1080, 80, 1348, 150)
    d.rounded_rectangle(badge, radius=28, fill=CARD, outline=INK, width=3)
    centered(d, (badge[0] + badge[2]) / 2, 92, "ภาพจำลอง", font(36, True), INK)
    d.line((88, 190, 1352, 190), fill=LINE, width=4)
    d.rounded_rectangle((88, 1620, 1352, 1718), radius=40, fill=WHITE, outline=LINE, width=3)
    d.text((130, 1634), "พิมพ์ข้อความ...", font=font(40), fill="#8d867f")
    d.ellipse((1258, 1632, 1330, 1704), fill="#38815a")
    d.polygon([(1281, 1650), (1310, 1668), (1281, 1686)], fill=WHITE)
    return im, d


def bubble(draw, y, role, lines, side="right", fill=GREEN):
    label = font(38, True)
    body = font(58)
    if side == "right":
        x0, x1 = 380, 1334
        label_x = 1260
    else:
        x0, x1 = 106, 1092
        label_x = 142
    draw.text((label_x, y), role, font=label, fill=MUTED)
    top = y + 54
    height = 84 * len(lines) + 70
    draw.rounded_rectangle((x0, top, x1, top + height), radius=34, fill=fill, outline=INK, width=3)
    for i, line in enumerate(lines):
        draw.text((x0 + 36, top + 24 + i * 76), line, font=body, fill=INK)


def screen1():
    im, d = make_base()
    bubble(d, 242, "คุณ", ["ช่วยร่างข้อความเลื่อนประชุม", "จาก 14:00 เป็น 15:00 ให้สุภาพหน่อย"], "right", GREEN)
    bubble(d, 676, "ผู้ช่วย", ["ขอเลื่อนประชุมวันนี้จาก", "14:00 เป็น 15:00 นะคะ"], "left", CARD)
    return im


def screen2():
    im, d = make_base()
    bubble(d, 220, "คุณ", ["ช่วยร่างข้อความเลื่อนประชุม", "จาก 14:00 เป็น 15:00 ให้สุภาพหน่อย"], "right", GREEN)
    bubble(d, 555, "ผู้ช่วย", ["ขอเลื่อนประชุมวันนี้จาก", "14:00 เป็น 15:00 นะคะ"], "left", CARD)
    bubble(d, 918, "คุณ", ["ขอย่อให้เหลือประโยคเดียว"], "right", GREEN)
    bubble(d, 1200, "ผู้ช่วย", ["ขอเลื่อนประชุมวันนี้เป็น", "15:00 นะคะ"], "left", CARD)
    return im


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    screen1().save(OUT / "CHAT-01.png", optimize=True)
    screen2().save(OUT / "CHAT-02.png", optimize=True)
    print(f"Built CHAT-01/02 at {W}x{H} from the approved screen design.")


if __name__ == "__main__":
    main()

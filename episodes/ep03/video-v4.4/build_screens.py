"""Build the illustrative chat screens for EP03 v4.4 — snug fit without empty space."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
ASSETS = ROOT / "assets"
W = 1440
PAPER = "#fcfbf7"
CARD = "#f6f4ee"
INK = "#2c2825"
MUTED = "#625c55"
LINE = "#ded8cc"
GREEN_USER = "#dcebe1"
TEAL_AGENT = "#e2f0ee"
WHITE = "#ffffff"
FONT = ASSETS / "fonts/Sarabun-Regular.ttf"
BOLD = ASSETS / "fonts/Sarabun-Bold.ttf"


def font(size, bold=False):
    return ImageFont.truetype(str(BOLD if bold else FONT), size, layout_engine=ImageFont.Layout.BASIC)


def centered(draw, x, y, value, f, fill):
    box = draw.textbbox((0, 0), value, font=f)
    draw.text((x - (box[2] - box[0]) / 2, y), value, font=f, fill=fill)


def make_base(height, input_y, title="ฝ่ายบริการลูกค้า AI"):
    im = Image.new("RGB", (W, height), PAPER)
    d = ImageDraw.Draw(im)
    # Device outer border & inner screen
    d.rounded_rectangle((24, 24, W - 24, height - 24), radius=48, fill=WHITE, outline=INK, width=4)
    d.rounded_rectangle((40, 40, W - 40, height - 40), radius=38, fill=PAPER)

    # Header bar
    d.text((88, 72), title, font=font(54, True), fill=INK)
    d.text((88, 138), "ออนไลน์ · ตอบกลับทันทีด้วย LangMind", font=font(32), fill=MUTED)

    # "ภาพจำลอง" badge
    badge = (1060, 72, 1348, 142)
    d.rounded_rectangle(badge, radius=28, fill=CARD, outline=INK, width=3)
    centered(d, (badge[0] + badge[2]) / 2, 84, "ภาพจำลอง", font(34, True), INK)

    d.line((88, 190, 1352, 190), fill=LINE, width=4)

    # Bottom input bar placed snugly at input_y
    d.rounded_rectangle((88, input_y, 1352, input_y + 98), radius=40, fill=WHITE, outline=LINE, width=3)
    d.text((130, input_y + 24), "พิมพ์ข้อความสอบถาม...", font=font(38), fill="#8d867f")
    d.ellipse((1258, input_y + 12, 1330, input_y + 84), fill="#38815a")
    d.polygon([(1281, input_y + 30), (1310, input_y + 48), (1281, input_y + 66)], fill=WHITE)
    return im, d


def bubble(draw, y, role, lines, side="right", fill=GREEN_USER, tag=None):
    label_fnt = font(34, True)
    body_fnt = font(50)
    if side == "right":
        x0, x1 = 340, 1334
        label_x = 1240
        draw.text((label_x, y), role, font=label_fnt, fill=MUTED)
    else:
        x0, x1 = 106, 1100
        label_x = 142
        draw.text((label_x, y), role, font=label_fnt, fill="#1E7578")
        if tag:
            draw.rounded_rectangle((320, y - 6, 560, y + 40), radius=16, fill="#E1EEE9")
            draw.text((336, y), tag, font=font(28, True), fill="#006D5E")

    top = y + 50
    height = 76 * len(lines) + 54
    draw.rounded_rectangle((x0, top, x1, top + height), radius=32, fill=fill, outline=INK, width=3)
    for i, line in enumerate(lines):
        draw.text((x0 + 36, top + 20 + i * 72), line, font=body_fnt, fill=INK)
    return top + height


def screen1():
    # Height = 880, input bar at 720
    im, d = make_base(880, 720)
    bubble(d, 230, "ลูกค้า", ["สินค้าชิ้นนี้มีของพร้อมส่งไหมครับ?"], "right", GREEN_USER)
    return im


def screen2():
    # Height = 880, input bar at 720
    im, d = make_base(880, 720)
    y = bubble(d, 230, "ลูกค้า", ["สินค้าชิ้นนี้มีของพร้อมส่งไหมครับ?"], "right", GREEN_USER)
    bubble(d, y + 40, "AI Assistant", [
        "มีสินค้าพร้อมส่ง 5 รายการค่ะ",
        "สั่งซื้อตอนนี้ จัดส่งรอบบ่ายได้ทันทีค่ะ"
    ], "left", TEAL_AGENT, tag="● กำลังสตรีมคำตอบ")
    return im


def screen3():
    # 4 message conversation: Height = 1140, input bar at 980
    im, d = make_base(1140, 980)
    y = bubble(d, 210, "ลูกค้า", ["สินค้าชิ้นนี้มีของพร้อมส่งไหมครับ?"], "right", GREEN_USER)
    y = bubble(d, y + 36, "AI Assistant", ["มีสินค้าพร้อมส่ง 5 รายการค่ะ จัดส่งได้ทันที"], "left", TEAL_AGENT)
    y = bubble(d, y + 36, "ลูกค้า", ["ถ้าสั่ง 2 ชิ้น มีส่วนลดไหมครับ?"], "right", GREEN_USER)
    bubble(d, y + 36, "AI Assistant", [
        "สั่ง 2 ชิ้นได้รับส่วนลด 10% ทันทีค่ะ",
        "รวมยอดสุทธิ 1,062 บาทค่ะ"
    ], "left", TEAL_AGENT, tag="✓ จำบริบทเดิมได้")
    return im


def main():
    ASSETS.mkdir(parents=True, exist_ok=True)
    screen1().save(ASSETS / "app-chat-1.jpg", quality=95)
    screen2().save(ASSETS / "app-chat-2.jpg", quality=95)
    screen3().save(ASSETS / "app-chat-3.jpg", quality=95)
    print("Generated app-chat-1.jpg (1440x880), app-chat-2.jpg (1440x880), app-chat-3.jpg (1440x1140)")


if __name__ == "__main__":
    main()

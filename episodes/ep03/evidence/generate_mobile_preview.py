"""Create mobile comparison contact sheet for visual inspection."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
UI_DIR = ROOT / "assets" / "ui"
EVIDENCE_DIR = ROOT / "evidence"
FONTS_DIR = ROOT / "assets" / "fonts"

FONT_BOLD = str(FONTS_DIR / "Sarabun-Bold.ttf")


def make_mobile_contact_sheet():
    im1 = Image.open(UI_DIR / "scr-01-chat-loading.png")
    im2 = Image.open(UI_DIR / "scr-02-chat-streaming.png")

    # Target height 800, scale down to inspect mobile legibility
    target_h = 960
    scale = target_h / im1.height
    target_w = int(im1.width * scale)  # 540

    im1_thumb = im1.resize((target_w, target_h), Image.Resampling.LANCZOS)
    im2_thumb = im2.resize((target_w, target_h), Image.Resampling.LANCZOS)

    canvas_w = target_w * 2 + 60
    canvas_h = target_h + 120
    canvas = Image.new("RGB", (canvas_w, canvas_h), (241, 245, 249))

    draw = ImageDraw.Draw(canvas)
    font_title = ImageFont.truetype(FONT_BOLD, 36)
    font_label = ImageFont.truetype(FONT_BOLD, 28)

    draw.text((30, 25), "การตรวจภาพนิ่งขนาดจำลองมือถือ (EP03 W5 Sample Preview)", fill=(15, 23, 42), font=font_title)

    # Paste im1
    canvas.paste(im1_thumb, (20, 90))
    draw.text((20, canvas_h - 45), "SCR-01: Blocking (หมุนรอโหลด)", fill=(100, 116, 139), font=font_label)

    # Paste im2
    canvas.paste(im2_thumb, (target_w + 40, 90))
    draw.text((target_w + 40, canvas_h - 45), "SCR-02: Streaming (พิมพ์ตอบทันที)", fill=(4, 120, 87), font=font_label)

    out_jpg = EVIDENCE_DIR / "mobile-frames.jpg"
    canvas.save(out_jpg, "JPEG", quality=90)
    print(f"Created: {out_jpg} ({canvas.size})")


if __name__ == "__main__":
    make_mobile_contact_sheet()

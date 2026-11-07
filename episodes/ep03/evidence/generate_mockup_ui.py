"""Generate pixel-perfect mock UI rasters for EP03 sample (SCR-01 and SCR-02)
ensuring 100% geometry and typographic continuity between states.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "assets" / "ui"
FONTS_DIR = ROOT / "assets" / "fonts"

WIDTH = 1080
HEIGHT = 1920

FONT_BOLD = str(FONTS_DIR / "Sarabun-Bold.ttf")
FONT_REG = str(FONTS_DIR / "Sarabun-Regular.ttf")


def draw_chat_base():
    img = Image.new("RGBA", (WIDTH, HEIGHT), (248, 250, 252, 255))  # #F8FAFC
    draw = ImageDraw.Draw(img)

    # 1. Header Bar
    draw.rectangle([0, 0, WIDTH, 220], fill=(255, 255, 255, 255))
    draw.line([0, 220, WIDTH, 220], fill=(226, 232, 240, 255), width=3)

    font_title = ImageFont.truetype(FONT_BOLD, 52)
    font_sub = ImageFont.truetype(FONT_REG, 36)

    # Header Avatar Circle
    draw.ellipse([80, 70, 160, 150], fill=(16, 185, 129, 255))  # Emerald 500
    # Draw simple robot / AI icon in circle
    draw.text((102, 78), "AI", fill=(255, 255, 255, 255), font=ImageFont.truetype(FONT_BOLD, 44))

    # Header text
    draw.text((190, 75), "ผู้ช่วย AI ร้านค้า (ภาพจำลอง)", fill=(15, 23, 42, 255), font=font_title)
    draw.text((190, 142), "สถานะ: พร้อมให้บริการ · LangMind API", fill=(100, 116, 139, 255), font=font_sub)

    # 2. User Message Bubble (Right Side)
    # Box bounds
    user_x0, user_y0, user_x1, user_y1 = 260, 320, 1000, 520
    draw.rounded_rectangle([user_x0, user_y0, user_x1, user_y1], radius=32, fill=(220, 252, 231, 255), outline=(187, 247, 208, 255), width=2)
    
    font_msg = ImageFont.truetype(FONT_REG, 42)
    font_time = ImageFont.truetype(FONT_REG, 30)

    msg_line1 = "สวัสดีครับ อยากสอบถามเงื่อนไข"
    msg_line2 = "การรับประกันสินค้าหน่อยครับ"
    draw.text((user_x0 + 45, user_y0 + 35), msg_line1, fill=(20, 83, 45, 255), font=font_msg)
    draw.text((user_x0 + 45, user_y0 + 95), msg_line2, fill=(20, 83, 45, 255), font=font_msg)
    draw.text((user_x1 - 130, user_y1 - 45), "10:42", fill=(22, 101, 52, 200), font=font_time)

    # 3. Bottom Input Bar Placeholder
    draw.rectangle([0, HEIGHT - 180, WIDTH, HEIGHT], fill=(255, 255, 255, 255))
    draw.line([0, HEIGHT - 180, WIDTH, HEIGHT - 180], fill=(226, 232, 240, 255), width=3)
    draw.rounded_rectangle([60, HEIGHT - 145, WIDTH - 200, HEIGHT - 45], radius=24, fill=(241, 245, 249, 255))
    draw.text((100, HEIGHT - 118), "พิมพ์ข้อความสอบถาม...", fill=(148, 163, 184, 255), font=font_msg)
    draw.ellipse([WIDTH - 160, HEIGHT - 145, WIDTH - 60, HEIGHT - 45], fill=(16, 185, 129, 255))
    # Send triangle
    draw.polygon([(WIDTH - 118, HEIGHT - 110), (WIDTH - 118, HEIGHT - 80), (WIDTH - 90, HEIGHT - 95)], fill=(255, 255, 255, 255))

    return img


def create_scr01_loading():
    img = draw_chat_base()
    draw = ImageDraw.Draw(img)

    font_bold = ImageFont.truetype(FONT_BOLD, 40)
    font_reg = ImageFont.truetype(FONT_REG, 36)
    font_badge = ImageFont.truetype(FONT_BOLD, 32)

    # Assistant Response Box (Loading State)
    ax0, ay0, ax1, ay1 = 80, 580, 750, 780
    draw.rounded_rectangle([ax0, ay0, ax1, ay1], radius=32, fill=(255, 255, 255, 255), outline=(203, 213, 225, 255), width=2)

    # Loading dots / spinner placeholder
    draw.ellipse([ax0 + 50, ay0 + 60, ax0 + 80, ay0 + 90], fill=(148, 163, 184, 255))
    draw.ellipse([ax0 + 95, ay0 + 60, ax0 + 125, ay0 + 90], fill=(203, 213, 225, 255))
    draw.ellipse([ax0 + 140, ay0 + 60, ax0 + 170, ay0 + 90], fill=(226, 232, 240, 255))

    draw.text((ax0 + 195, ay0 + 52), "กำลังคิดคำตอบ...", fill=(100, 116, 139, 255), font=font_bold)
    draw.text((ax0 + 50, ay0 + 120), "รอข้อมูลชุดสมบูรณ์จากเซิร์ฟเวอร์", fill=(148, 163, 184, 255), font=font_reg)

    # Timer Badge on top right of box
    draw.rounded_rectangle([ax1 - 180, ay0 + 35, ax1 - 40, ay0 + 95], radius=16, fill=(254, 242, 242, 255), outline=(254, 202, 202, 255), width=2)
    draw.text((ax1 - 165, ay0 + 45), "00:05", fill=(220, 38, 38, 255), font=font_bold)

    # Bottom Illustrative Badge
    draw.rounded_rectangle([80, HEIGHT - 270, 520, HEIGHT - 210], radius=16, fill=(241, 245, 249, 255), outline=(203, 213, 225, 255), width=2)
    draw.text((105, HEIGHT - 258), "[ภาพจำลอง: ระบบ Blocking (รอจบก้อน)]", fill=(71, 85, 105, 255), font=font_badge)

    out_path = OUT_DIR / "scr-01-chat-loading.png"
    img.save(out_path, "PNG")
    print(f"Created: {out_path} ({img.size})")


def create_scr02_streaming():
    img = draw_chat_base()
    draw = ImageDraw.Draw(img)

    font_bold = ImageFont.truetype(FONT_BOLD, 40)
    font_msg = ImageFont.truetype(FONT_REG, 42)
    font_badge = ImageFont.truetype(FONT_BOLD, 32)

    # Assistant Response Box (Streaming State)
    ax0, ay0, ax1, ay1 = 80, 580, 960, 950
    draw.rounded_rectangle([ax0, ay0, ax1, ay1], radius=32, fill=(255, 255, 255, 255), outline=(16, 185, 129, 255), width=3)

    # Active stream badge
    draw.rounded_rectangle([ax0 + 40, ay0 + 35, ax0 + 310, ay0 + 85], radius=12, fill=(236, 253, 245, 255), outline=(167, 243, 208, 255), width=1)
    draw.text((ax0 + 55, ay0 + 42), "⚡ กำลังส่งข้อมูลแบบสด (SSE)", fill=(4, 120, 87, 255), font=font_badge)

    # Streaming Content
    line1 = "สินค้ารับประกัน 1 ปีเต็มครับ"
    line2 = "ครอบคลุมความเสียหายจากการใช้งานปกติ"
    line3 = "โดยสามารถนำใบเสร็จหรือเลขออเดอร์..."

    draw.text((ax0 + 45, ay0 + 115), line1, fill=(15, 23, 42, 255), font=font_msg)
    draw.text((ax0 + 45, ay0 + 185), line2, fill=(15, 23, 42, 255), font=font_msg)
    draw.text((ax0 + 45, ay0 + 255), line3, fill=(15, 23, 42, 255), font=font_msg)

    # Typing cursor
    cursor_x = ax0 + 45 + draw.textlength(line3, font=font_msg) + 8
    draw.rectangle([cursor_x, ay0 + 260, cursor_x + 6, ay0 + 305], fill=(16, 185, 129, 255))

    # Bottom Illustrative Badge
    draw.rounded_rectangle([80, HEIGHT - 270, 560, HEIGHT - 210], radius=16, fill=(236, 253, 245, 255), outline=(167, 243, 208, 255), width=2)
    draw.text((105, HEIGHT - 258), "[ภาพจำลอง: ระบบ Streaming API (SSE)]", fill=(4, 120, 87, 255), font=font_badge)

    out_path = OUT_DIR / "scr-02-chat-streaming.png"
    img.save(out_path, "PNG")
    print(f"Created: {out_path} ({img.size})")


if __name__ == "__main__":
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    create_scr01_loading()
    create_scr02_streaming()

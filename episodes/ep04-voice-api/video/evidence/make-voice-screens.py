"""Build APP-VOICE-Q and APP-VOICE-A from one original frame with one text style.

Usage: python make_voice_screens.py <original-q.jpg> <out-q.jpg> <out-a.jpg> <NotoSansThaiLooped.ttf>

Both screens keep the original frame pixels (header, card, rings, "ภาพจำลอง" tag).
Only the bubble text, the button glyph and the status line are redrawn, using the
same font, size and weight in both screens so the two states match.
"""
import sys
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFont

SRC, OUT_Q, OUT_A, FONT = sys.argv[1:5]
SS = 4  # supersampling for drawn shapes

TEXT = (22, 24, 22)
WHITE_CARD = (255, 255, 255)
BUBBLE = (240, 241, 235)          # user question bubble (neutral)
BUBBLE_REPLY = (220, 238, 226)    # assistant reply bubble (light sage green)
GREEN = (60, 124, 89)

# One text style for both screens
BUBBLE_SIZE, BUBBLE_LEAD, BUBBLE_WGHT = 47, 72, 475
STATUS_SIZE, STATUS_WGHT = 49, 400
# stroke of bubble text (47px @475) == stroke of status text (49px @400), measured ~3.8px

BX0, BX1, BY0 = 418, 1021, 580           # bubble left/right/top from the original frame
PAD_X, PAD_TOP, PAD_BOTTOM = 38, 34, 44
CX, CY = 720, 1278                       # button centre


def font(size, wght):
    f = ImageFont.truetype(FONT, size, layout_engine=ImageFont.Layout.RAQM)
    f.set_variation_by_axes([wght, 100])
    return f


def draw_bubble(img, lines, fill=BUBBLE):
    PX0, PY0, PX1, PY1 = 400, 540, 1040, 950   # card interior, inside the rounded edge
    patch = Image.new("RGB", ((PX1 - PX0) * SS, (PY1 - PY0) * SS), WHITE_CARD)
    d = ImageDraw.Draw(patch)
    f = font(BUBBLE_SIZE * SS, BUBBLE_WGHT)
    by1 = round(BY0 + PAD_TOP + BUBBLE_LEAD * len(lines) + PAD_BOTTOM
                - (BUBBLE_LEAD - BUBBLE_SIZE * 1.15))

    def S(x, y):
        return ((x - PX0) * SS, (y - PY0) * SS)

    d.rounded_rectangle([S(BX0, BY0), S(BX1, by1)], radius=36 * SS, fill=fill)
    d.polygon([S(468, by1 - 2), S(522, by1 - 2), S(468, by1 + 42)], fill=fill)
    for i, t in enumerate(lines):
        d.text(S(BX0 + PAD_X, BY0 + PAD_TOP + i * BUBBLE_LEAD), t, font=f, fill=TEXT)
        w = f.getbbox(t)[2] / SS
        assert BX0 + PAD_X + w <= BX1 - 24, (t, w)
    img.paste(patch.resize((PX1 - PX0, PY1 - PY0), Image.LANCZOS), (PX0, PY0))
    return img


def draw_status(img, text):
    a = np.asarray(img).copy()
    SX0, SY0, SX1, SY1 = 380, 1480, 1060, 1572
    region = a[SY0:SY1, SX0:SX1].astype(int)
    m = cv2.dilate((region.sum(2) < 3 * 200).astype(np.uint8) * 255, np.ones((9, 9), np.uint8))
    full = np.zeros(a.shape[:2], np.uint8)
    full[SY0:SY1, SX0:SX1] = m
    img = Image.fromarray(cv2.inpaint(a, full, 6, cv2.INPAINT_TELEA))
    f = font(STATUS_SIZE, STATUS_WGHT)
    # keep the original line's top edge (y=1498 for 'กำลังฟังเสียงพูด...')
    y = 1498 - f.getbbox("กำลังฟังเสียงพูด...")[1]
    w = f.getbbox(text)[2]
    ImageDraw.Draw(img).text((round(CX - w / 2), y), text, font=f, fill=TEXT)
    return img


def draw_speaker(img):
    a = np.asarray(img).copy()
    yy, xx = np.mgrid[0:a.shape[0], 0:a.shape[1]]
    inside = (xx - CX) ** 2 + (yy - CY) ** 2 <= 92 ** 2
    glyph = inside & (a.astype(int).sum(2) > 3 * 120)
    mask = cv2.dilate(glyph.astype(np.uint8) * 255, np.ones((7, 7), np.uint8))
    a[mask > 0] = GREEN
    a = cv2.inpaint(a, cv2.dilate(mask, np.ones((3, 3), np.uint8)) - mask, 3, cv2.INPAINT_TELEA)
    img = Image.fromarray(a)

    R = 100
    ic = Image.new("L", (2 * R * SS, 2 * R * SS), 0)
    g = ImageDraw.Draw(ic)

    def P(x, y):
        return ((x + R) * SS, (y + R) * SS)

    ox = -6
    g.polygon([P(-50 + ox, -18), P(-30 + ox, -18), P(-4 + ox, -42), P(-4 + ox, 42),
               P(-30 + ox, 18), P(-50 + ox, 18)], fill=255)
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * 6 * SS + 1, 2 * 6 * SS + 1))
    ic = Image.fromarray(cv2.morphologyEx(np.asarray(ic), cv2.MORPH_OPEN, k))
    g = ImageDraw.Draw(ic)
    SW = 10
    c = (8 + ox, 0)
    for r, span in [(24, 48), (46, 48)]:
        g.arc([P(c[0] - r, c[1] - r), P(c[0] + r, c[1] + r)], -span, span, fill=255, width=SW * SS)
        for ang in (-span, span):
            th = np.radians(ang)
            rm = r - SW / 2
            ex, ey = c[0] + rm * np.cos(th), c[1] + rm * np.sin(th)
            g.ellipse([P(ex - SW / 2, ey - SW / 2), P(ex + SW / 2, ey + SW / 2)], fill=255)
    ic = ic.resize((2 * R, 2 * R), Image.LANCZOS)
    img.paste(Image.new("RGB", ic.size, (255, 255, 255)), (CX - R, CY - R), ic)
    return img


base = Image.open(SRC).convert("RGB")
assert base.size == (1440, 1800), base.size

q = draw_bubble(base.copy(), ["ขอสั่งอเมริกาโน่เย็น", "1 แก้วครับ"])
q = draw_status(q, "กำลังฟังเสียงพูด...")
q.save(OUT_Q, quality=95, subsampling=0, optimize=True)

a = draw_bubble(base.copy(), ["รับอเมริกาโน่เย็น 1 แก้วครับ", "ทั้งหมด 65 บาท", "รับหวานกี่เปอร์เซ็นต์ดีครับ?"], fill=BUBBLE_REPLY)
a = draw_speaker(a)
a = draw_status(a, "กำลังเล่นเสียงตอบกลับ...")
a.save(OUT_A, quality=95, subsampling=0, optimize=True)
print("ok", q.size, a.size)

from pathlib import Path
from shutil import which
import subprocess
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).parent
PLATES = ROOT / 'renders' / 'plates'
PLATES.mkdir(parents=True, exist_ok=True)
W, H = 1080, 1920
BG = (243, 240, 232)
INK = (22, 37, 54)
GREEN = (8, 121, 95)
MUTED = (86, 103, 116)
PAPER = (255, 253, 248)
STROKE = (200, 211, 207)
REG = str(ROOT / 'assets' / 'fonts' / 'Sarabun-Regular.ttf')
BOLD = str(ROOT / 'assets' / 'fonts' / 'Sarabun-Bold.ttf')

def font(size, bold=False):
    return ImageFont.truetype(BOLD if bold else REG, size)

def wrap(draw, text, fnt, max_width):
    lines = []
    for paragraph in text.split('\n'):
        if not paragraph:
            lines.append('')
            continue
        line = ''
        for word in paragraph.split(' '):
            test = word if not line else line + ' ' + word
            if draw.textbbox((0, 0), test, font=fnt)[2] <= max_width:
                line = test
            else:
                if line:
                    lines.append(line)
                line = word
        lines.append(line)
    return lines

def draw_center(draw, box, text, fnt, fill=INK, spacing=8):
    x, y, w, h = box
    lines = wrap(draw, text, fnt, w - 32)
    line_h = fnt.size + spacing
    total = len(lines) * line_h - spacing
    yy = y + (h - total) / 2
    for line in lines:
        bounds = draw.textbbox((0, 0), line, font=fnt)
        draw.text((x + (w - (bounds[2] - bounds[0])) / 2, yy), line, font=fnt, fill=fill)
        yy += line_h

def base(title, count):
    im = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(im)
    for y in range(42, H, 46):
        for x in range(42, W, 46):
            d.ellipse((x, y, x + 2, y + 2), fill=(224, 220, 211))
    d.rounded_rectangle((30, 30, W-30, H-30), radius=32, outline=(215, 210, 200), width=3)
    d.text((96, 76), 'LANGMIND  ·  EP03 / SSE', font=font(26, True), fill=GREEN)
    lines = wrap(d, title, font(62, True), 888)
    yy = 140
    for line in lines[:2]:
        d.text((96, yy), line, font=font(62, True), fill=INK)
        yy += 74
    d.text((910, 82), count, font=font(22, True), fill=MUTED)
    return im, d

def pill(draw, box, text, fill=(227, 238, 232), ink=(7, 92, 74), size=27, outline=STROKE):
    x, y, w, h = box
    draw.rounded_rectangle((x, y, x+w, y+h), radius=h//2, fill=fill, outline=outline, width=2)
    draw_center(draw, box, text, font(size, True), ink, 2)

def card(draw, box, title, detail='', index=None, fill=PAPER, outline=STROKE, dashed=False):
    x, y, w, h = box
    draw.rounded_rectangle((x, y, x+w, y+h), radius=20, fill=fill, outline=outline, width=3)
    if dashed:
        for px in range(x+16, x+w-16, 22):
            draw.line((px, y, min(px+10, x+w-16), y), fill=outline, width=3)
            draw.line((px, y+h, min(px+10, x+w-16), y+h), fill=outline, width=3)
    text_x = x + 30
    text_w = w - 60
    if index is not None:
        draw.ellipse((x+26, y+(h-58)//2, x+84, y+(h-58)//2+58), fill=GREEN)
        draw_center(draw, (x+26, y+(h-58)//2, 58, 58), str(index), font(28, True), PAPER, 0)
        text_x = x + 108
        text_w = w - 138
    title_font = font(34, True)
    if detail:
        lines = wrap(draw, title, title_font, text_w)
        start_y = y + (h - (len(lines)*(title_font.size+4) + 32))/2
        for line in lines:
            draw.text((text_x, start_y), line, font=title_font, fill=INK)
            start_y += title_font.size + 4
        detail_font = font(27)
        detail_lines = wrap(draw, detail, detail_font, text_w)
        for line in detail_lines:
            draw.text((text_x, start_y+4), line, font=detail_font, fill=MUTED)
            start_y += detail_font.size + 4
    else:
        draw_center(draw, (text_x, y+10, text_w, h-20), title, title_font, INK, 3)

def put_image(canvas, path, box, outline=INK, radius=24):
    x, y, w, h = box
    image = Image.open(path).convert('RGBA')
    image.thumbnail((w, h), Image.Resampling.LANCZOS)
    frame = Image.new('RGBA', (w, h), (255, 255, 255, 255))
    frame.alpha_composite(image, ((w-image.width)//2, (h-image.height)//2))
    mask = Image.new('L', (w, h), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, w-1, h-1), radius=radius, fill=255)
    canvas.paste(frame.convert('RGB'), (x, y), mask)
    ImageDraw.Draw(canvas).rounded_rectangle((x, y, x+w, y+h), radius=radius, outline=outline, width=3)

def caption(draw, text):
    box = (108, 1570, 864, 170)
    x, y, w, h = box
    draw.rounded_rectangle((x, y, x+w, y+h), radius=20, fill=PAPER, outline=(36,73,90), width=3)
    draw_center(draw, box, text, font(39, True), INK, 5)

def save(im, name):
    path = PLATES / name
    im.save(path, quality=95)
    return path

def create_plates():
    created = []
    # Beat 1: one question and the waiting state; the raster is explicitly marked illustrative.
    im, d = base('ส่งคำถามแล้ว แอปกำลังรอ', '01 / 05')
    put_image(im, ROOT/'assets/ui/scr-01-chat-loading.png', (215, 300, 650, 1155))
    put_image(im, ROOT/'assets/characters/01-question.png', (45, 1270, 155, 155))
    d = ImageDraw.Draw(im)
    pill(d, (250, 1490, 580, 58), 'รูปแบบรับผลครบก่อนแสดง', size=26)
    caption(d, 'คำถามมาแล้ว แอปยังรอข้อมูลตอบกลับ')
    created.append((save(im, 'beat01.png'), 10.0))

    # Beat 2: paired W5 rasters show two delivery patterns without a speed claim.
    im, d = base('ต่างกันที่วิธีรับข้อมูล', '02 / 05')
    pill(d, (68, 360, 444, 68), 'รับผลครบก่อนแสดง', size=27)
    pill(d, (568, 360, 444, 68), 'ทยอยรับและแสดงผ่าน SSE', size=25, fill=(229, 244, 234))
    put_image(im, ROOT/'assets/ui/scr-01-chat-loading.png', (74, 450, 432, 768), radius=22)
    put_image(im, ROOT/'assets/ui/scr-02-chat-streaming.png', (574, 450, 432, 768), radius=22)
    d.text((112, 1285), 'สองรูปแบบการรับข้อมูล', font=font(30, True), fill=INK)
    d.text((112, 1330), 'แอปเลือกวิธีแสดงผลให้เหมาะกับประสบการณ์ที่ต้องการ', font=font(25), fill=MUTED)
    caption(d, 'รับผลครบก่อนแสดง\nหรือทยอยรับผ่าน SSE')
    created.append((save(im, 'beat02.png'), 11.0))

    # Beat 3: reveal the documented SSE events in order, then connect them to the app.
    events = [
        ('message_start', 'เริ่ม และส่ง conversation/message ID'),
        ('message', 'ชิ้นส่วนข้อความ (chunks)'),
        ('citations (ถ้ามี)', 'แหล่งอ้างอิงประกอบคำตอบ'),
        ('message_end', 'คำตอบฉบับเต็มและ usage')]
    for n, duration in zip(range(1, 5), (97/30, 97/30, 98/30, 98/30)):
        im, d = base('ข้อมูลมาเป็นลำดับ event', '03 / 05')
        card(d, (150, 340, 780, 128), 'POST /chat/message', 'Server-Sent Events', fill=(233, 244, 238), outline=(122,184,160))
        d.line((540, 468, 540, 1220), fill=(155,198,180), width=7)
        d.polygon([(522,1205),(558,1205),(540,1234)], fill=GREEN)
        for i, (name, detail) in enumerate(events[:n]):
            card(d, (150, 505+i*174, 780, 142), name, detail, index=i+1,
                 outline=(126,166,151) if i < n-1 else (8,121,95), dashed=(i==2))
        app_title = 'แอป Backend รับ event' if n < 4 else 'แอปอ่าน event ตามลำดับ'
        app_detail = 'นำข้อมูลที่ได้รับไปแสดงผล' if n < 4 else 'คำตอบสมบูรณ์เมื่อได้รับ message_end'
        card(d, (150, 1240, 780, 140), app_title, app_detail, fill=(231,238,233))
        if n == 4:
            d.text((152, 1400), 'ลำดับและชื่อ event อ้างอิง API snapshot', font=font(24, True), fill=MUTED)
            caption(d, 'อ่าน event ตามลำดับ\nคำตอบสมบูรณ์เมื่อได้ message_end')
        created.append((save(im, f'beat03-{n}.png'), duration))

    # Beat 4: separate provider response from work implemented by the app.
    for stage in (1, 2):
        im, d = base('ส่วนที่แอปต้องจัดการเอง', '04 / 05')
        card(d, (144, 450, 792, 265), 'APP SERVER', 'เก็บ API key ไว้ที่ server\nรับและ parse SSE stream', fill=(232,244,238), outline=GREEN)
        if stage == 2:
            d.line((540, 725, 540, 965), fill=(122,184,160), width=8)
            d.polygon([(522,950),(558,950),(540,982)], fill=GREEN)
            card(d, (144, 1000, 792, 250), 'CLIENT UI', 'รับข้อมูลที่แอปส่งต่อ\nจัดการ state และแสดงผลเอง', fill=(247,249,247), outline=(130,149,166))
            put_image(im, ROOT/'assets/characters/39-tiptoe.png', (850, 1285, 150, 150))
            d.text((145, 1370), 'API ส่ง event · แอปกำหนดการแสดงผล', font=font(26, True), fill=MUTED)
            caption(d, 'เก็บ API key ที่ server\nBackend อ่าน stream แล้วส่งให้ UI')
        else:
            for px in range(180, 900, 28):
                d.line((px, 725, min(px+13, 900), 725), fill=(155,198,180), width=5)
                d.line((px, 965, min(px+13, 900), 965), fill=(155,198,180), width=5)
            for py in range(725, 965, 26):
                d.line((144, py, 144, min(py+12, 965)), fill=(155,198,180), width=5)
                d.line((936, py, 936, min(py+12, 965)), fill=(155,198,180), width=5)
            draw_center(d, (144, 725, 792, 240), 'Client UI · จุดแสดงผลของแอป', font(30, True), MUTED)
            put_image(im, ROOT/'assets/characters/39-tiptoe.png', (850, 1130, 150, 150))
            d.text((145, 1005), 'ข้อมูลจาก stream ถูกส่งต่อให้ส่วนแสดงผล', font=font(27, True), fill=MUTED)
        created.append((save(im, f'beat04-{stage}.png'), 6.0))

    # Beat 5: summarize the same task from request to the terminal event.
    for n in range(1, 4):
        im, d = base('รับเป็นช่วง จบเมื่อได้ message_end', '05 / 05')
        put_image(im, ROOT/'assets/brand/langmind-logo.png', (125, 355, 230, 190), outline=(8,121,95), radius=18)
        put_image(im, ROOT/'assets/characters/10-thumbs-up.png', (755, 365, 165, 165))
        labels = [
            'ส่งคำขอผ่าน server',
            'อ่าน event แล้วแสดง chunks',
            'จบเมื่อได้รับ message_end']
        for i, label in enumerate(labels[:n]):
            card(d, (144, 650+i*190, 792, 140), label, index=i+1,
                 fill=(232,244,238) if i == 2 else PAPER,
                 outline=GREEN if i == 2 else STROKE)
        if n == 3:
            d.text((145, 1275), 'LangMind API', font=font(34, True), fill=GREEN)
            d.text((145, 1323), 'langmind.in.th', font=font(27), fill=MUTED)
            d.text((145, 1400), 'ภาพประกอบจำลอง ไม่ใช่ผลเรียก API จริง', font=font(24, True), fill=MUTED)
            caption(d, 'แอปเลือกวิธีแสดงผลเอง\nคำตอบสมบูรณ์เมื่อได้ message_end')
        created.append((save(im, f'beat05-{n}.png'), 3.0))
    return created

def render(clips):
    ffmpeg = which('ffmpeg')
    if not ffmpeg:
        raise RuntimeError('ffmpeg was not found on PATH')
    output = ROOT/'renders'/'EP03-animatic-v2.mp4'
    args = [ffmpeg, '-y', '-hide_banner', '-loglevel', 'warning']
    for plate, duration in clips:
        args.extend(['-loop', '1', '-framerate', '30', '-t', str(duration), '-i', str(plate)])
    filters = []
    for i, (_, duration) in enumerate(clips):
        frames = round(duration * 30)
        filters.append(f'[{i}:v]zoompan=z=\'min(zoom+0.00045,1.035)\':d=1:s=1080x1920:fps=30,trim=end_frame={frames},setpts=PTS-STARTPTS,setsar=1[v{i}]')
    joined = ''.join(f'[v{i}]' for i in range(len(clips)))
    filters.append(f'{joined}concat=n={len(clips)}:v=1:a=0,format=yuv420p[outv]')
    args.extend(['-filter_complex', ';'.join(filters), '-map', '[outv]', '-an', '-r', '30', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-movflags', '+faststart', str(output)])
    subprocess.run(args, check=True)
    return output

if __name__ == '__main__':
    plates = create_plates()
    output = render(plates)
    print(f'Wrote {output} ({len(plates)} visual stages, silent)')

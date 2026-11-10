import os, sys, subprocess
from PIL import Image

video_path = "episodes/ep03/video-v4.4/renders/ep03-v4.4-silent.mp4"
output_sheet = "episodes/ep03/video-v4.4/renders/qa-contact-sheet-v4.4.png"
temp_dir = "episodes/ep03/video-v4.4/renders/temp_shots"
os.makedirs(temp_dir, exist_ok=True)

# Timestamps at the active motion moment of each beat (seconds)
times = [10.0, 32.0, 54.0, 76.0, 98.0, 120.0, 142.0, 163.0, 178.0]
thumbs = []

for i, t in enumerate(times, 1):
    out_img = os.path.join(temp_dir, f"beat_{i}.png")
    cmd = [
        "ffmpeg", "-y", "-ss", str(t), "-i", video_path,
        "-vframes", "1", "-vf", "scale=360:640", out_img
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    if os.path.exists(out_img):
        thumbs.append(Image.open(out_img))

# Build 3x3 grid: 360*3 = 1080 width, 640*3 = 1920 height
sheet = Image.new("RGB", (1080, 1920), "#f8f4e9")
for idx, img in enumerate(thumbs):
    col = idx % 3
    row = idx // 3
    sheet.paste(img, (col * 360, row * 640))

sheet.save(output_sheet, quality=95)
print(f"Saved {output_sheet} from {len(thumbs)} frames.")

# Clean up temp
for img in os.listdir(temp_dir):
    try: os.remove(os.path.join(temp_dir, img))
    except: pass
try: os.rmdir(temp_dir)
except: pass

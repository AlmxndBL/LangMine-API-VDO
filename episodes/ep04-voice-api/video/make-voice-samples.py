"""Make EP04 B03–B05 narration with Edge TTS (free, no API key).

Run on your own computer from the episode's video folder:
    python make-voice-samples.py            # chosen voice only (Niwat)
    python make-voice-samples.py --all      # also make the other voice to compare

Each caption segment in timing.json is spoken as its own clip, trimmed, then joined
with a short pause, so build.mjs knows exactly when every caption starts.

Writes (one set per beat in timing.json):
    assets/voice/samples/<voice>/<beat>.wav
    assets/voice/<beat>.wav               (chosen voice, used by build.mjs)
    assets/voice/<beat>.segments.json     (start/end of each caption segment)

ffmpeg is taken from PATH, or from <repo>/tools/ffmpeg/ if it is there.
Then run:  node build.mjs
"""
import asyncio
import json
import os
import shutil
import subprocess
import sys
import wave
from pathlib import Path

try:
    import edge_tts  # type: ignore
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "edge-tts"])
    import edge_tts  # type: ignore

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[2]
local_ffmpeg = REPO / "tools" / "ffmpeg"
if local_ffmpeg.exists():
    os.environ["PATH"] = str(local_ffmpeg) + os.pathsep + os.environ.get("PATH", "")

CHOSEN = "niwat"
VOICES = {
    "niwat": "th-TH-NiwatNeural",          # male (chosen 7 Nov 2026)
    "premwadee": "th-TH-PremwadeeNeural",  # female
}
RATE = "-16%"  # slower for readable captions (takes: +0%, -8%, now -16%)
LEAD, GAP, TAIL = 0.2, 0.35, 0.6  # seconds: before first line, between caption lines, after last line
# trim the silence Edge TTS adds at both ends of every clip
TRIM = "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse"


async def main():
    names = list(VOICES) if "--all" in sys.argv else [CHOSEN]
    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        sys.exit("ffmpeg not found: install it or put ffmpeg.exe in <repo>/tools/ffmpeg/")
    cfg = json.loads((HERE / "timing.json").read_text(encoding="utf-8"))
    voice_dir = HERE / "assets" / "voice"
    for name in names:
        out_dir = voice_dir / "samples" / name
        tmp = out_dir / "_parts"
        tmp.mkdir(parents=True, exist_ok=True)
        for beat in cfg["beats"]:
            frames, marks, rate_hz = [], [], 48000
            pos = int(LEAD * rate_hz)
            frames.append(b"\0\0" * pos)
            for i, seg in enumerate(beat["segments"]):
                mp3 = tmp / f"{beat['id']}-{i}.mp3"
                part = tmp / f"{beat['id']}-{i}.wav"
                await edge_tts.Communicate(seg["say"], VOICES[name], rate=RATE).save(str(mp3))
                subprocess.run([ffmpeg, "-v", "error", "-y", "-i", str(mp3), "-ar", str(rate_hz), "-ac", "1", "-sample_fmt", "s16",
                                "-af", TRIM, str(part)], check=True)
                with wave.open(str(part), "rb") as w:
                    data = w.readframes(w.getnframes())
                n = len(data) // 2
                if i:
                    frames.append(b"\0\0" * int(GAP * rate_hz)); pos += int(GAP * rate_hz)
                marks.append({"start": round(pos / rate_hz, 3), "end": round((pos + n) / rate_hz, 3)})
                frames.append(data); pos += n
                mp3.unlink(); part.unlink()
            frames.append(b"\0\0" * int(TAIL * rate_hz)); pos += int(TAIL * rate_hz)
            wav = out_dir / f"{beat['id']}.wav"
            with wave.open(str(wav), "wb") as w:
                w.setnchannels(1); w.setsampwidth(2); w.setframerate(rate_hz)
                w.writeframes(b"".join(frames))
            seg_json = json.dumps({"duration": round(pos / rate_hz, 3), "segments": marks}, indent=1)
            (out_dir / f"{beat['id']}.segments.json").write_text(seg_json, encoding="utf-8")
            if name == CHOSEN:
                shutil.copyfile(wav, voice_dir / f"{beat['id']}.wav")
                (voice_dir / f"{beat['id']}.segments.json").write_text(seg_json, encoding="utf-8")
            print("ok", name, beat["id"], f"{pos / rate_hz:.2f}s")
        tmp.rmdir()
    (voice_dir / "samples" / "SOURCE.txt").write_text(
        "Generated with Edge TTS (Microsoft neural voices) via the edge-tts package.\n"
        f"Voices: {', '.join(VOICES[n] for n in names)} · rate {RATE} · used in video: {VOICES[CHOSEN]}\n"
        "Check the usage terms before publishing; record the chosen voice in REVIEW.md.\n",
        encoding="utf-8",
    )
    beats = ", ".join(f"{b['id']}.wav" for b in cfg["beats"])
    print(f"done: assets/voice/{beats} = {VOICES[CHOSEN]} at {RATE}. Next: node build.mjs")


asyncio.run(main())

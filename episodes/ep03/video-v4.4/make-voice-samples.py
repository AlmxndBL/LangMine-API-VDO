"""Generate Narration Voiceover with Edge TTS (Free, no API key required).

Run from the video folder:
    python make-voice-samples.py            # chosen voice only (th-TH-NiwatNeural)
    python make-voice-samples.py --all      # generate both voices to compare

Each segment in timing.json is synthesized, silences at both ends trimmed,
and joined with natural pauses, exporting:
    assets/voice/<beat>.wav               (WAV audio file)
    assets/voice/<beat>.segments.json     (precise caption timestamp boundaries)

Then run: node build.mjs
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
    "niwat": "th-TH-NiwatNeural",          # Male (EP04 Standard)
    "premwadee": "th-TH-PremwadeeNeural",  # Female
}
RATE = "-16%"  # slower for readable captions and comfortable learning
LEAD, GAP, TAIL = 0.2, 0.35, 0.6  # seconds: lead-in, between sentences, tail padding
TRIM = "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse"


async def main():
    names = list(VOICES) if "--all" in sys.argv else [CHOSEN]
    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        sys.exit("ffmpeg not found: install ffmpeg and add to PATH or put in <repo>/tools/ffmpeg/")
    
    cfg = json.loads((HERE / "timing.json").read_text(encoding="utf-8"))
    voice_dir = HERE / "assets" / "voice"
    voice_dir.mkdir(parents=True, exist_ok=True)

    for name in names:
        out_dir = voice_dir / "samples" / name
        tmp = out_dir / "_parts"
        tmp.mkdir(parents=True, exist_ok=True)
        print(f"\nSynthesizing voice: {name} ({VOICES[name]}) at {RATE}...")

        for beat in cfg["beats"]:
            bid = beat["id"]
            wav_paths = []
            print(f"  Beat {bid}: {len(beat['segments'])} segments")

            for i, seg in enumerate(beat["segments"]):
                text = seg["say"]
                raw_mp3 = tmp / f"{bid}_{i}_raw.mp3"
                trim_wav = tmp / f"{bid}_{i}.wav"

                # Edge TTS synthesize
                comm = edge_tts.Communicate(text, VOICES[name], rate=RATE)
                await comm.save(str(raw_mp3))

                # Trim silent edges and normalize sample rate
                subprocess.run(
                    [ffmpeg, "-y", "-i", str(raw_mp3), "-af", TRIM, "-ar", "24000", "-ac", "1", str(trim_wav)],
                    check=True,
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.DEVNULL,
                )
                wav_paths.append(trim_wav)

            # Measure segment durations
            durs = []
            for wp in wav_paths:
                with wave.open(str(wp), "rb") as w:
                    durs.append(w.getnframes() / float(w.getframerate()))

            # Stitch with silence padding
            filter_parts = []
            filter_parts.append(f"aevalsrc=0:d={LEAD}:s=24000:c=1[s0]")
            for i in range(1, len(durs)):
                filter_parts.append(f"aevalsrc=0:d={GAP}:s=24000:c=1[s{i}]")
            filter_parts.append(f"aevalsrc=0:d={TAIL}:s=24000:c=1[stail]")

            # Concat chain
            chain = ["[s0]"]
            for i in range(len(durs)):
                chain.append(f"[{i}:a]")
                if i < len(durs) - 1:
                    chain.append(f"[s{i+1}]")
            chain.append("[stail]")
            n_inputs = len(chain)
            filter_parts.append(f"{''.join(chain)}concat=n={n_inputs}:v=0:a=1[out]")

            cmd = [ffmpeg, "-y"]
            for wp in wav_paths:
                cmd.extend(["-i", str(wp)])
            cmd.extend(["-filter_complex", ";".join(filter_parts), "-map", "[out]"])

            out_wav = out_dir / f"{bid}.wav"
            cmd.append(str(out_wav))
            subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

            # Compute exact timing marks for .segments.json
            cur = LEAD
            marks = []
            for i, d in enumerate(durs):
                marks.append({"cue": beat["segments"][i]["cue"], "start": round(cur, 3), "end": round(cur + d, 3)})
                cur += d + GAP

            seg_file = out_dir / f"{bid}.segments.json"
            seg_file.write_text(json.dumps({"segments": marks}, indent=2, ensure_ascii=False), encoding="utf-8")

            # If chosen voice, copy directly to assets/voice/ for build.mjs
            if name == CHOSEN:
                shutil.copyfile(out_wav, voice_dir / f"{bid}.wav")
                shutil.copyfile(seg_file, voice_dir / f"{bid}.segments.json")

    print("\n[Done] Voice synthesis finished successfully! Run 'node build.mjs' to recompile index.html with audio.")


if __name__ == "__main__":
    asyncio.run(main())

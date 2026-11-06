"""Generate the authorized female Edge draft and record measured timing."""
import asyncio
import json
import subprocess
import wave
from pathlib import Path

import edge_tts
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
PARTS = ASSETS / "voice-parts"


def run(*args):
    subprocess.run(args, check=True, stdout=subprocess.DEVNULL)


def trimmed_pcm(path):
    with wave.open(str(path), "rb") as audio:
        pcm = np.frombuffer(audio.readframes(audio.getnframes()), dtype=np.int16).copy()
    active = np.flatnonzero(np.abs(pcm.astype(np.int32)) > 180)
    if not len(active):
        raise RuntimeError(f"No audible samples in {path.name}")
    left = max(0, int(active[0]) - 1920)
    right = min(len(pcm), int(active[-1]) + 2880)
    return pcm[left:right], left / 24000


def write_pcm(path, pcm):
    with wave.open(str(path), "wb") as out:
        out.setnchannels(1)
        out.setsampwidth(2)
        out.setframerate(24000)
        out.writeframes(pcm.tobytes())


async def main():
    PARTS.mkdir(exist_ok=True)
    story = json.loads((ROOT / "story.json").read_text(encoding="utf-8"))
    all_pcm = []
    cursor = 0.0
    sentences = json.loads((ROOT / "evidence/voice-sentences.json").read_text(encoding="utf-8"))
    for scene in story:
        base = PARTS / scene["id"]
        raw = base.with_suffix(".mp3")
        boundaries = []
        if not raw.exists() or not raw.stat().st_size or not base.with_suffix(".json").exists():
            sentence_pcm = []
            offset_seconds = 0.0
            for index, sentence in enumerate(sentences[scene["id"]]):
                part = PARTS / f"{scene['id']}-{index+1:02}"
                events = []
                communicate = edge_tts.Communicate(sentence, "th-TH-PremwadeeNeural", rate="+0%", boundary="WordBoundary")
                with part.with_suffix(".pending").open("wb") as output:
                    async for chunk in communicate.stream():
                        if chunk["type"] == "audio":
                            output.write(chunk["data"])
                        elif chunk["type"] == "WordBoundary":
                            events.append({k: chunk[k] for k in ("offset", "duration", "text")})
                part.with_suffix(".pending").replace(part.with_suffix(".mp3"))
                run("ffmpeg", "-y", "-v", "error", "-i", str(part.with_suffix(".mp3")), "-ar", "24000", "-ac", "1", str(part.with_suffix(".wav")))
                samples, trim = trimmed_pcm(part.with_suffix(".wav"))
                for event in events:
                    event["offset"] = round(max(0, event["offset"] / 1e7 - trim + offset_seconds) * 1e7)
                    boundaries.append(event)
                pause = np.zeros(3840, dtype=np.int16)
                sentence_pcm.extend([samples, pause])
                offset_seconds += (len(samples) + len(pause)) / 24000
                await asyncio.sleep(1)
            write_pcm(base.with_suffix(".sentences.wav"), np.concatenate(sentence_pcm))
            run("ffmpeg", "-y", "-v", "error", "-i", str(base.with_suffix(".sentences.wav")), str(raw))
            base.with_suffix(".json").write_text(json.dumps(boundaries, ensure_ascii=False), encoding="utf-8")
            await asyncio.sleep(1)
        else:
            boundaries = json.loads(base.with_suffix(".json").read_text(encoding="utf-8"))
        wav = base.with_suffix(".wav")
        run("ffmpeg", "-y", "-v", "error", "-i", str(raw), "-ar", "24000", "-ac", "1", str(wav))
        with wave.open(str(wav), "rb") as audio:
            pcm = np.frombuffer(audio.readframes(audio.getnframes()), dtype=np.int16).copy()
        active = np.flatnonzero(np.abs(pcm.astype(np.int32)) > 180)
        if not len(active):
            raise RuntimeError(f"No audible samples in {scene['id']}")
        left = max(0, int(active[0]) - 1920)
        right = min(len(pcm), int(active[-1]) + 2880)
        trimmed = pcm[left:right]
        hold = 0.55 if scene["kind"] != "recap" else 1.0
        scene["start"] = round(cursor, 6)
        scene["spoken_duration"] = len(trimmed) / 24000
        scene["duration"] = round(scene["spoken_duration"] + hold, 6)
        scene["trim_start"] = left / 24000
        scene["trim_end"] = (len(pcm) - right) / 24000
        captions = []
        text = ""
        start = 0.0
        end = 0.0
        for item in boundaries:
            item_start = max(0.0, item["offset"] / 1e7 - left / 24000)
            item_end = min(scene["spoken_duration"], (item["offset"] + item["duration"]) / 1e7 - left / 24000)
            if len(text) + len(item["text"]) > 56 and text:
                captions.append({"text": text, "start": start, "end": max(start + .2, end)})
                text = ""
            if not text:
                start = item_start
            text += item["text"]
            end = item_end
        if text:
            captions.append({"text": text, "start": start, "end": max(start + .2, end)})
        scene["captions"] = captions
        all_pcm.extend([trimmed, np.zeros(round(hold * 24000), dtype=np.int16)])
        cursor += scene["duration"]
        print(scene["id"], round(scene["duration"], 2), "seconds", len(captions), "captions", flush=True)
    full = np.concatenate(all_pcm)
    with wave.open(str(ASSETS / "voice-unmixed.wav"), "wb") as out:
        out.setnchannels(1)
        out.setsampwidth(2)
        out.setframerate(24000)
        out.writeframes(full.tobytes())
    run("ffmpeg", "-y", "-v", "error", "-i", str(ASSETS / "voice-unmixed.wav"), "-af", "loudnorm=I=-16:TP=-1.5:LRA=9", "-ar", "24000", str(ASSETS / "voice-v2.wav"))
    (ROOT / "timing.json").write_text(json.dumps({"duration": len(full) / 24000, "voice": "th-TH-PremwadeeNeural", "rate": "+0%", "scenes": story}, ensure_ascii=False, indent=2), encoding="utf-8")
    print("TOTAL", round(len(full) / 24000, 3), flush=True)


asyncio.run(main())

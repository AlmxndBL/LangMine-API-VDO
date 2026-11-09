import json
import subprocess
import numpy as np
from pathlib import Path
from faster_whisper import WhisperModel

root = Path(__file__).parent
model = WhisperModel('small', device='cpu', compute_type='int8', download_root=str(root / '.models'))
for path in sorted((root / 'assets').glob('EP02 B*.wav')):
    dest = root / 'evidence' / (path.name.split()[1] + '-transcript.json')
    if dest.exists():
        continue
    pcm = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', str(path), '-f', 'f32le', '-ac', '1', '-ar', '16000', '-'])
    audio = np.frombuffer(pcm, dtype=np.float32)
    segments, info = model.transcribe(audio, language='th', beam_size=5, word_timestamps=True, vad_filter=True)
    rows = [dict(start=s.start, end=s.end, text=s.text, words=[dict(start=w.start, end=w.end, text=w.word) for w in s.words or []]) for s in segments]
    dest.write_text(json.dumps(rows, ensure_ascii=False, indent=2), encoding='utf-8')
    print(path.name, ''.join(s['text'] for s in rows), flush=True)

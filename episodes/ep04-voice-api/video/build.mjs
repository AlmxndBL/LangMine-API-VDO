// EP04 sample builder: timing.json (+ optional voice files) -> index.html
// Run from this folder: node build.mjs
// With voice files present (paths in timing.json), every beat/caption is timed from the
// real audio length; without them, durations are estimated from the narration length.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const cfg = JSON.parse(fs.readFileSync(path.join(root, 'timing.json'), 'utf8'));
const esc = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const fr = t => Math.round(t * cfg.fps) / cfg.fps;   // snap to frame
const len = s => [...s.replace(/\s+/g, '')].length;

function audioSeconds(rel) {
  let p = path.join(root, rel);
  if (!fs.existsSync(p)) {
    const alt = p.endsWith('.wav') ? p.replace(/\.wav$/, '.mp3') : p.replace(/\.mp3$/, '.wav');
    if (fs.existsSync(alt)) {
      p = alt;
    } else {
      return null;
    }
  }
  try {
    const out = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p]).toString().trim();
    return Number(out);
  } catch {
    const pyCode = `
import sys, wave, os
p = sys.argv[1]
if p.endswith('.wav'):
    with wave.open(p, 'rb') as w:
        print(w.getnframes() / float(w.getframerate()))
elif p.endswith('.mp3'):
    with open(p, 'rb') as f:
        data = f.read()
    idx = 10 + ((data[6] << 21) | (data[7] << 14) | (data[8] << 7) | data[9]) if data[:3] == b'ID3' else 0
    total, sr = 0, 24000
    sr_map, br_map = {0: 22050, 1: 24000, 2: 16000}, [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, 0]
    while idx < len(data) - 4:
        if data[idx] == 0xFF and (data[idx+1] & 0xE0) == 0xE0:
            b1, b2 = data[idx+1], data[idx+2]
            spf = 576 if ((b1 >> 3) & 3) in [0, 2] else 1152
            sr = sr_map.get((b2 >> 2) & 3, sr)
            br = br_map[(b2 >> 4) & 0x0F] * 1000
            if br > 0 and sr > 0:
                idx += max(int((spf / 8 * br) / sr + ((b2 >> 1) & 1)), 1)
                total += spf
            else: idx += 1
        else: idx += 1
    print(total / sr)
`;
    const out = execFileSync('python', ['-c', pyCode, p]).toString().trim();
    return Number(out);
  }
}

function resolveVoiceRel(rel) {
  let p = path.join(root, rel);
  if (fs.existsSync(p)) return rel;
  const alt = rel.endsWith('.wav') ? rel.replace(/\.wav$/, '.mp3') : rel.replace(/\.mp3$/, '.wav');
  if (fs.existsSync(path.join(root, alt))) return alt;
  return null;
}

function pauseList(rel) {
  const p = path.join(root, rel);
  const r = require_ffmpeg(p);
  const starts = [...r.matchAll(/silence_start: ([0-9.]+)/g)].map(m => Number(m[1]));
  const ends = [...r.matchAll(/silence_end: ([0-9.]+)/g)].map(m => Number(m[1]));
  return starts.map((s, i) => ({ start: s, end: ends[i] ?? s }));
}
function require_ffmpeg(p) {
  // ffmpeg writes silencedetect to stderr; spawnSync keeps it without throwing
  const res = spawnSync('ffmpeg', ['-hide_banner', '-i', p, '-af', 'silencedetect=n=-40dB:d=0.18', '-f', 'null', '-'], { encoding: 'utf8' });
  return res.stderr || '';
}

let t = cfg.lead_in;
let exactBeats = 0;
let usedVoice = 0;
const beats = cfg.beats.map(b => {
  const audio = audioSeconds(b.voice);
  const est = b.segments.reduce((n, s) => n + len(s.say) / cfg.chars_per_second + 0.35, 0);
  const dur = audio ?? est;
  if (audio) usedVoice++;
  const total = b.segments.reduce((n, s) => n + len(s.say), 0);
  // segment boundaries: share of narration length across the spoken span;
  // with real audio, snap each boundary to the nearest pause within 0.8 s
  let spanStart = 0, spanEnd = dur, gaps = [];
  if (audio) {
    const ps = pauseList(resolveVoiceRel(b.voice));
    if (ps.length && ps[0].start < 0.05) { spanStart = ps[0].end; ps.shift(); }
    if (ps.length && ps[ps.length - 1].end > dur - 0.05) { spanEnd = ps[ps.length - 1].start; ps.pop(); }
    gaps = ps.map(p => (p.start + p.end) / 2);
  }
  // exact caption cuts when make-voice-samples.py wrote <beat>.segments.json
  const segFile = audio ? path.join(root, resolveVoiceRel(b.voice).replace(/\.(wav|mp3)$/, '.segments.json')) : null;
  const marks = segFile && fs.existsSync(segFile) ? JSON.parse(fs.readFileSync(segFile, 'utf8')).segments : null;
  if (marks && marks.length === b.segments.length) {
    exactBeats++;
    return finish(b, audio, dur, [0, ...marks.slice(1).map((m, i) => (marks[i].end + m.start) / 2), dur]);
  }
  const cuts = [0];
  let acc = 0;
  b.segments.slice(0, -1).forEach(s => {
    acc += len(s.say);
    let c = spanStart + (spanEnd - spanStart) * acc / total;
    const near = gaps.reduce((best, g) => (Math.abs(g - c) < Math.abs(best - c) ? g : best), Infinity);
    if (Math.abs(near - c) <= 0.8) c = near;
    cuts.push(c);
  });
  cuts.push(dur);
  return finish(b, audio, dur, cuts);
});

function finish(b, audio, dur, cuts) {
  const segments = b.segments.map((s, i) => ({ ...s, start: fr(t + cuts[i]), duration: fr(cuts[i + 1] - cuts[i]) }));
  const resolvedVoice = resolveVoiceRel(b.voice);
  const beat = { id: b.id, voice: audio ? resolvedVoice : null, start: fr(t), duration: fr(dur), segments };
  t += dur + cfg.beat_gap;
  return beat;
}
const duration = fr(t - cfg.beat_gap + cfg.tail);

// ---------- markup ----------
const mic = `<svg class="ico" viewBox="0 0 24 24"><rect x="8.5" y="2.5" width="7" height="12" rx="3.5"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3.5"/></svg>`;
const spk = `<svg class="ico" viewBox="0 0 24 24"><path class="fill" d="M3.5 9.5h3.5l5-4v13l-5-4H3.5z"/><path d="M15.5 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"/></svg>`;
const txt = `<svg class="ico" viewBox="0 0 24 24"><path d="M4 6h16M4 11h16M4 16h10"/></svg>`;
const bars = (n, cls) => `<div class="wave ${cls}">${Array.from({ length: n }, () => '<i></i>').join('')}</div>`;
const arrow = (id) => `<svg class="arrow" id="${id}" viewBox="0 0 60 70"><path d="M30 4 V58 M14 44 L30 62 L46 44"/><circle class="dot" cx="30" cy="8" r="7"/></svg>`;
const line = (html, cls = '') => `<div class="ln ${cls}">${html}</div>`;
const k = s => `<span class="k">${s}</span>`;      // json key
const v = s => `<span class="v">${s}</span>`;      // json value

const panels = {
  b03: {
    input: `<div class="chip in-chip">${mic}<span><b>order.wav</b> · เสียงจากไมค์</span></div>`,
    method: 'POST', path: '/api/v1/agents/{id}/voice/transcribe', scope: 'voice:invoke',
    lines: [
      line(`Authorization: Bearer ${v('$LM_TOKEN')}`),
      line(`-F ${v('audio=@order.wav;type=audio/wav')}`),
      line(`-F ${v('language=th')}`),
    ],
    foot: 'ไฟล์ไม่เกิน 4 MB · wav, mp3, webm, ogg, m4a',
    output: `<div class="chip out-chip json">{ ${k('"text"')}: ${v('"ขอสั่งอเมริกาโน่เย็น 1 แก้วครับ"')} }</div>`,
  },
  b04: {
    input: `<div class="chip in-chip">${txt}<span>“ขอสั่งอเมริกาโน่เย็น 1 แก้วครับ”</span></div>`,
    method: 'POST', path: '/api/chat/message/blocking', scope: 'chat:invoke',
    lines: [
      line(`${k('"agent_id"')}: ${v('"01J8..."')},`),
      line(`${k('"query"')}: ${v('"ขอสั่งอเมริกาโน่เย็น 1 แก้วครับ"')},`),
      line(`<span class="mark"></span>${k('"input_mode"')}: ${v('"voice"')},`, 'hl'),
      line(`${k('"conversation_id"')}: ${v('null')}`),
    ],
    foot: 'Agent ใช้การตั้งค่า “ตอบแบบภาษาพูด” ที่เปิดไว้',
    output: `<div class="chip out-chip json">{ ${k('"answer"')}: ${v('"รับอเมริกาโน่เย็น 1 แก้วครับ<br>&nbsp;&nbsp;&nbsp;ทั้งหมด 65 บาท<br>&nbsp;&nbsp;&nbsp;รับหวานกี่เปอร์เซ็นต์ดีครับ?"')},<div class="ln hl2">&nbsp;&nbsp;<span class="mark"></span>${k('"conversation_id"')}: ${v('"c_7Q2…"')} }</div><em>คำตอบตัวอย่าง (ภาพจำลอง)</em></div>`,
  },
  b05: {
    input: `<div class="chip in-chip">${txt}<span>“รับอเมริกาโน่เย็น 1 แก้วครับ ทั้งหมด…”</span></div>`,
    method: 'POST', path: '/api/v1/agents/{id}/voice/speech', scope: 'voice:invoke',
    lines: [
      line(`${k('"text"')}: ${v('"รับอเมริกาโน่เย็น 1 แก้วครับ…"')},`),
      line(`${k('"format"')}: ${v('"auto"')}`),
    ],
    foot: 'ข้อความไม่เกิน 4,000 ตัวอักษรต่อครั้ง',
    output: `<div class="chip out-chip audio">${spk}<span><b>audio/mpeg</b> หรือ <b>audio/wav</b></span>${bars(14, 'mini')}</div>`,
  },
};

const panelHtml = Object.entries(panels).map(([id, p]) => `
  <div class="panel" id="panel-${id}">
    <div class="slot-in">${p.input}</div>
    ${arrow(`arr1-${id}`)}
    <div class="code">
      <div class="code-head"><span class="method">${p.method}</span><span class="scope">สิทธิ์ ${p.scope}</span></div>
      <div class="code-path">${esc(p.path)}</div>
      <div class="code-body">${p.lines.join('')}</div>
      <div class="code-foot">${p.foot}</div>
    </div>
    ${arrow(`arr2-${id}`)}
    <div class="slot-out">${p.output}</div>
  </div>`).join('\n');

const headings = {
  b01: ['', 'คุยด้วยเสียง', 'ในแอปของคุณ'],
  b02: ['', 'ท่อ 3 สเต็ป', 'ฟัง → คิด → พูด'],
  b06: ['✓', 'เช็กลิสต์', 'ก่อนเริ่มใช้งาน'],
  b03: ['1', 'ฟัง', 'ถอดเสียงเป็นข้อความ'],
  b04: ['2', 'คิด', 'ตอบแบบภาษาพูด'],
  b05: ['3', 'พูด', 'อ่านคำตอบออกเสียง'],
};


const overview = `
  <div class="scene" id="overview">
    <div class="no-train" id="no-train"><b class="x">✕</b><span>ไม่ต้องเทรนโมเดลเสียงเอง</span></div>
    <div class="ov-card" id="ov-1" style="--c:#38815A"><b class="ov-num">1</b><div><div class="ov-verb">ฟัง <em>เสียง → ข้อความ</em></div><div class="ov-api">Voice API · <code>voice/transcribe</code></div></div></div>
    ${arrow('ov-arr1')}
    <div class="ov-card" id="ov-2" style="--c:#8d732c"><b class="ov-num">2</b><div><div class="ov-verb">คิด <em>ข้อความ → คำตอบ</em></div><div class="ov-api">Chat API ของ Agent<br><code>chat/message/blocking</code></div></div></div>
    ${arrow('ov-arr2')}
    <div class="ov-card" id="ov-3" style="--c:#1E7578"><b class="ov-num">3</b><div><div class="ov-verb">พูด <em>คำตอบ → เสียง</em></div><div class="ov-api">Voice API · <code>voice/speech</code></div></div></div>
  </div>`;

const tick = `<svg class="tick" viewBox="0 0 48 48"><circle cx="24" cy="24" r="21"/><path d="M14 25 L21 32 L35 17"/></svg>`;
const checklist = `
  <div class="scene" id="checklist">
    ${[
      ['เปิด “สนทนาด้วยเสียง” + publish', 'ไม่เปิด = 403 VOICE_DISABLED<br>แก้แล้วไม่ publish = ยังไม่มีผล'],
      ['สิทธิ์ <code>voice:invoke</code> + <code>chat:invoke</code>', 'voice = ถอด/อ่านเสียง · chat = ถาม Agent'],
      ['เก็บ API Key ฝั่ง server', 'แอปมือถือเรียกผ่าน backend ของคุณ<br>ไม่ฝัง Key ไว้ในแอป'],
    ].map(([t, d], i) => `<div class="check" id="check-${i + 1}">${tick}<div><div class="check-t">${t}</div><div class="check-d">${d}</div></div></div>`).join('')}
  </div>`;

const captions = beats.flatMap(b => b.segments.map((s, i) =>
  `<div id="cap-${b.id}-${i}" class="clip caption" data-start="${s.start}" data-duration="${s.duration}" data-track-index="8" data-layout-allow-caption-zone>${esc(s.cap).replaceAll('\n', '<br>')}</div>`)).join('\n');
const audio = beats.filter(b => b.voice).map(b =>
  `<audio id="vo-${b.id}" class="clip" data-start="${b.start}" data-duration="${b.duration}" data-track-index="9" src="${b.voice}"></audio>`).join('\n');

const html = `<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8">
<title>EP04 · Voice API · B01–B06 draft</title>
<link rel="stylesheet" href="style.css">
<script src="assets/gsap.min.js"></script>
</head>
<body>
<main id="film" data-composition-id="ep04-voice" data-width="1080" data-height="1920" data-fps="${cfg.fps}" data-duration="${duration}">
  <div class="kicker">EP04 &nbsp;/&nbsp; VOICE API</div>
  <div class="note">ภาพจำลอง</div>

  <section id="stage" class="clip" data-start="0" data-duration="${duration}" data-track-index="1">
    ${Object.entries(headings).map(([id, [n, verb, rest]]) => `<h1 id="h-${id}" class="heading">${n ? `<span class="num">${n}</span>` : ''}${verb}<small>${rest}</small></h1>`).join('\n    ')}
    <div class="spine">
      <span id="pill-b03" class="pill">1 ฟัง</span><i></i><span id="pill-b04" class="pill">2 คิด</span><i></i><span id="pill-b05" class="pill">3 พูด</span>
    </div>

    <div class="device" id="device">
      <div class="screen">
        <img id="img-q" src="assets/app-voice-q.jpg" width="1440" height="1800" alt="หน้าจอลูกค้ากดไมค์สั่งกาแฟ (ภาพจำลอง)" data-layout-allow-overflow>
        <img id="img-a" src="assets/app-voice-a.jpg" width="1440" height="1800" alt="หน้าจอแอปเล่นเสียงตอบกลับ (ภาพจำลอง)" data-layout-allow-overflow>
      </div>
    </div>
    ${bars(32, 'big')}
    <div class="wave-label" id="wave-label"></div>

    ${panelHtml}

    ${overview}
    ${checklist}
    <img id="robot-q" class="robot q" src="assets/01-question.png" width="445" height="503" alt="">
    <div class="server-note q" id="ask-b01"><b>เบื้องหลังเชื่อมต่ออย่างไร?</b><br>แอป → ? → คำตอบเป็นเสียง</div>
    <img id="robot-b06" class="robot b06" src="assets/04-open-arms.png" width="425" height="503" alt="">
    <img id="robot-b05" class="robot b05" src="assets/04-open-arms.png" width="425" height="503" alt="">
    <div class="server-note b05" id="tip-b05"><b>ปรับเสียงได้</b> ด้วย voice, speed<br>ไม่ส่ง = ใช้ค่าเสียงของ Agent ที่ publish</div>
    <img id="robot" class="robot" src="assets/05-point-up.png" width="445" height="436" alt="">
    <div class="server-note" id="server-note"><b>เรียกจาก server ของแอป</b><br>API Key ไม่ใส่ในแอปมือถือ</div>
  </section>

  ${captions}
  ${audio}
</main>
<script>window.FILM=${JSON.stringify({ duration, beats: beats.map(({ id, start, duration, segments }) => ({ id, start, duration, segments: segments.map(({ cue, start, duration }) => ({ cue, start, duration })) })) })}</script>
<script src="motion.js"></script>
</body>
</html>
`;
fs.writeFileSync(path.join(root, 'index.html'), html);

// narration text for recording / TTS, one file per beat
const vo = beats.map(b => `## ${b.id} → ${cfg.beats.find(x => x.id === b.id).voice}\n${b.segments.map(s => s.say).join(' ')}\n`).join('\n');
fs.writeFileSync(path.join(root, 'VOICE-SCRIPT.md'), `# EP04 B01–B06 — บทสำหรับสร้างเสียง\n\nอ่านต่อเนื่องเป็นย่อหน้าเดียวต่อ beat แล้วบันทึกเป็นไฟล์ตาม path ที่ระบุ จากนั้นรัน \`node build.mjs\`\n\n${vo}`);
console.log(`${beats.length} beats, ${beats.reduce((n, b) => n + b.segments.length, 0)} captions, ${duration.toFixed(2)} s, timing from ${usedVoice ? `${usedVoice} voice file(s), ${exactBeats} with exact caption cuts` : 'estimated reading time (no voice yet)'}`);

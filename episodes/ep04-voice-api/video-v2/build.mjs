// EP04 video-v2 builder (viewer-first): timing.json (+ voice files) -> index.html + VOICE-SCRIPT.md
// Run from this folder: node build.mjs
// Voice: assets/voice/<beat>.wav and <beat>.segments.json from make-voice-samples.py give exact caption cuts;
// without them durations are estimated from narration length.
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

// ---------- markup helpers ----------
const I = {
  mic: '<rect x="8.5" y="2.5" width="7" height="12" rx="3.5"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3.5"/>',
  spk: '<path class="fill" d="M3.5 9.5h3.5l5-4v13l-5-4H3.5z"/><path d="M15.5 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"/>',
  txt: '<path d="M4 6h16M4 11h16M4 16h10"/>',
  phone: '<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>',
  server: '<rect x="3.5" y="4" width="17" height="6.5" rx="1.5"/><rect x="3.5" y="13.5" width="17" height="6.5" rx="1.5"/><path d="M7 7.2h.01M7 16.7h.01M11 7.2h6M11 16.7h6"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l8.5-8.5M16 7l2.5 2.5M14 9l2 2"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
  bot: '<rect x="4" y="7" width="16" height="12" rx="3"/><path d="M12 3.5V7M9 12.5h.01M15 12.5h.01M9.5 16h5"/>',
  book: '<path d="M4 5.5A2 2 0 0 1 6 3.5h12v15H6a2 2 0 0 0-2 2z"/><path d="M4 20.5V5.5M8 8h7M8 11.5h7"/>',
  play: '<circle cx="12" cy="12" r="9"/><path class="fill" d="M10 8.5l5.5 3.5-5.5 3.5z"/>',
  chat: '<path d="M4 5.5h16v10H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/>',
  loop: '<path d="M4 12a8 8 0 0 1 13.7-5.6L20 9M20 4.5V9h-4.5M20 12a8 8 0 0 1-13.7 5.6L4 15M4 19.5V15h4.5"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
};
const ico = (n, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24">${I[n]}</svg>`;
const at = (k, d = 0.1, anim = 'up') => `data-in="${k}" data-at="${d}" data-anim="${anim}"`;
const bars = (n, cls, extra = '') => `<div class="wave ${cls}" ${extra}>${Array.from({ length: n }, () => '<i></i>').join('')}</div>`;
const vArrow = (h, attrs = '', flip = false) =>
  `<svg class="varrow${flip ? ' up' : ''}" ${attrs} viewBox="0 0 60 ${h}" style="height:${h}px"><path pathLength="1" d="M30 6 V${h - 14} M14 ${h - 28} L30 ${h - 10} L46 ${h - 28}"/><circle class="dot" cx="30" cy="10" r="7" data-y0="10" data-y1="${h - 22}"/></svg>`;
const hArrow = (attrs = '') =>
  `<svg class="harrow" ${attrs} viewBox="0 0 70 40"><path pathLength="1" d="M4 20 H58 M46 8 L62 20 L46 32"/></svg>`;
const device = (id, w, h) => `
  <div class="device" id="${id}" style="width:${w + 16}px">
    <div class="screen" style="width:${w}px;height:${h}px">
      <img src="assets/app-voice-q.jpg" width="1440" height="1800" alt="หน้าจอลูกค้ากดไมค์สั่งกาแฟ (ภาพจำลอง)" data-layout-allow-overflow style="width:${w}px">
      <img class="img-a" src="assets/app-voice-a.jpg" width="1440" height="1800" alt="หน้าจอแอปเล่นเสียงตอบกลับ (ภาพจำลอง)" data-layout-allow-overflow style="width:${w}px">
    </div>
  </div>`;
const head = (id, n, verb, rest) => `<h1 class="heading">${n ? `<span class="num">${n}</span>` : ''}${verb}<small>${rest}</small></h1>`;

const scenes = {
  b1: `
    ${head('b1', '', 'แอปที่คุยด้วยเสียง', 'ทำได้ยังไง?')}
    <div class="place" style="left:242px;top:370px">${device('dev-b1', 580, 652)}</div>
    ${bars(30, 'big', 'id="wave-b1" style="left:242px;top:1090px;width:596px"')}
    <div class="wave-label" style="top:1226px"><span id="wl-b1-l" ${at(0, 0.3)}>กำลังฟังเสียงพูด…</span><span id="wl-b1-p" ${at(1, 0.5)}>กำลังเล่นเสียงตอบกลับ…</span></div>
    <div class="qrow" style="top:1330px">
      <span class="qchip" ${at(2, 0.4, 'pop')}>เตรียมอะไร?</span>
      <span class="qchip" ${at(2, 1.0, 'pop')}>เชื่อมตรงไหน?</span>
      <span class="qchip" ${at(2, 1.6, 'pop')}>ใช้ผลยังไง?</span>
    </div>`,

  b2: `
    ${head('b2', '', 'API คืออะไร', 'ฉบับไม่ต้องเขียนโค้ดก็เข้าใจ')}
    <div class="node" style="top:420px" ${at(0, 0.1)}>${ico('phone', 'big')}<div><b>แอปของคุณ</b><span class="alias" ${at(1, 0.2, 'left')}>= พนักงานหน้าร้าน</span></div></div>
    <div class="lane" style="top:630px">
      <div class="lane-l" ${at(0, 0.7, 'left')}><b>ส่งงาน</b><span ${at(1, 0.6)}>ส่งออร์เดอร์</span></div>
      ${vArrow(250, at(0, 0.6))}
      ${vArrow(250, at(0, 1.4), true)}
      <div class="lane-r" ${at(0, 1.5)}><b>รับผล</b><span ${at(1, 1.0)}>รับจานกลับ</span></div>
    </div>
    <div class="node lm" style="top:900px" ${at(0, 1.0)}><img src="assets/langmind-logo.png" width="689" height="606" alt="LangMind"><div><b>LangMind</b><span class="alias" ${at(1, 0.4, 'left')}>= ครัว</span></div></div>
    <div class="steps3" style="top:1190px">
      <span class="step s1" ${at(2, 0.6, 'pop')}>1 ฟัง</span><i ${at(2, 0.9)}>→</i>
      <span class="step s2" ${at(2, 1.2, 'pop')}>2 คิด</span><i ${at(2, 1.5)}>→</i>
      <span class="step s3" ${at(2, 1.8, 'pop')}>3 พูด</span>
    </div>`,

  b3: `
    ${head('b3', '1', 'เตรียม', 'ต้องมี 3 อย่าง')}
    <div class="stack" style="top:410px">
      <div class="card" ${at(0, 0.4)}>
        <div class="card-h">${ico('bot', 'big')}<div><b>Agent ใน LangMind</b><span>ใส่ข้อมูลร้านไว้</span></div></div>
        <div class="chips"><span class="chip" ${at(0, 1.4, 'pop')}>${ico('book')}เมนู</span><span class="chip" ${at(0, 1.8, 'pop')}>${ico('book')}ราคา</span></div>
        <div class="setting" ${at(1, 0.1)}>
          <span class="setting-l">แท็บสื่อและเสียง → <b>สนทนาด้วยเสียง</b></span>
          <span class="switch" data-toggle="1" data-toggle-at="0.8"><i></i></span>
          <span class="badge pub" ${at(1, 1.8, 'pop')}>publish ✓</span>
        </div>
      </div>
      <div class="card" ${at(2, 0.1)}>
        <div class="card-h">${ico('key', 'big')}<div><b>API Key</b><span class="mono">lmpat_••••••••</span></div></div>
        <div class="chips"><span class="chip mono" ${at(2, 1.6, 'pop')}>voice:invoke</span><span class="chip mono" ${at(2, 2.4, 'pop')}>chat:invoke</span></div>
      </div>
      <div class="card" ${at(3, 0.1)}>
        <div class="card-h">${ico('server', 'big')}<div><b>ระบบหลังบ้าน (server)</b><span>เก็บ Key · เป็นคนเรียก API</span></div></div>
      </div>
    </div>`,

  b4: `
    ${head('b4', '2', 'เชื่อม', 'ใครคุยกับใคร')}
    <div class="node wide" id="n-phone" style="top:400px" ${at(0, 0.1)}>${ico('phone', 'big')}<div><b>แอปมือถือ</b>
      <span class="roles"><span class="role" ${at(0, 1.4, 'pop')}>${ico('mic')}อัดเสียง</span><span class="role" ${at(0, 2.0, 'pop')}>${ico('spk')}เล่นเสียง</span></span></div>
      <span class="badge nokey" ${at(2, 1.2, 'pop')}>${ico('x')}ไม่มี Key</span></div>
    <div class="lane small" style="top:600px">
      <div class="lane-l" ${at(1, 0.1, 'left')}><b>ไฟล์เสียง</b></div>
      ${vArrow(150, at(1, 0.1))}${vArrow(150, at(1, 0.4), true)}
      <div class="lane-r" ${at(1, 0.5)}><b>เสียงตอบ</b></div>
    </div>
    <div class="node wide" id="n-server" style="top:760px" ${at(1, 0.6)}>${ico('server', 'big')}<div><b>ระบบหลังบ้าน</b><span>ของคุณเอง</span></div>
      <span class="badge haskey" ${at(2, 0.4, 'pop')}>${ico('lock')}API Key อยู่ที่นี่</span></div>
    <div class="lane small" style="top:960px">
      <div class="lane-l" ${at(1, 1.4, 'left')}><b>เรียก API</b><span>3 ครั้ง</span></div>
      ${vArrow(150, at(1, 1.3))}${vArrow(150, at(1, 1.6), true)}
      <div class="lane-r" ${at(1, 1.7)}><b>ผลลัพธ์</b></div>
    </div>
    <div class="node wide lm" style="top:1120px" ${at(1, 1.9)}><img src="assets/langmind-logo.png" width="689" height="606" alt="LangMind"><div><b>LangMind</b><span>ฟัง · คิด · พูด</span></div></div>`,

  b5: `
    ${head('b5', '2', 'ส่งอะไร ได้อะไร', '1 ออร์เดอร์ = 3 ครั้ง')}
    <div class="calls" style="top:400px">
    ${[
      ['1', 'ฟัง', 'voice/transcribe', '#38815A', `${ico('mic')}<b>order.wav</b>`, '“ขอสั่งอเมริกาโน่เย็น 1 แก้วครับ”'],
      ['2', 'คิด', 'chat/message/blocking', '#8d732c', '“ขอสั่งอเมริกาโน่เย็น 1 แก้วครับ”<span class="tag">input_mode: voice</span>', '“รับอเมริกาโน่เย็น 1 แก้วครับ ทั้งหมด 65 บาท รับหวานกี่เปอร์เซ็นต์ดีครับ?”'],
      ['3', 'พูด', 'voice/speech', '#1E7578', '“รับอเมริกาโน่เย็น 1 แก้วครับ…”', `${ico('spk')}<b>ไฟล์เสียง</b> MP3 / WAV`],
    ].map(([n, verb, ep, c, send, got], i) => `
      <div class="call" id="call-${n}" style="--c:${c}" ${at(i, 0.1)}>
        <div class="call-h"><span class="call-n">ครั้งที่ ${n} · ${verb}</span><code>${ep}</code></div>
        <div class="call-b">
          <div class="io in" id="in-${n}"><small>ส่ง</small><div>${send}</div></div>
          ${hArrow(at(i, 0.9))}
          <div class="io out" id="out-${n}" ${at(i, 1.5, 'left')}><small>ได้กลับมา</small><div>${got}</div></div>
        </div>
      </div>`).join('')}
    </div>
    <div class="chain-note" style="top:1330px" ${at(3, 1.6)}>ผลของครั้งก่อน = ของที่ส่งในครั้งถัดไป</div>`,

  b6: `
    ${head('b6', '3', 'ใช้ผล', 'เอาผลลัพธ์ไปทำอะไร')}
    <div class="place" style="left:70px;top:400px" ${at(0, 0.1)}>${device('dev-b6', 414, 470)}</div>
    ${bars(20, 'mid', 'id="wave-b6" style="left:70px;top:905px;width:430px"')}
    <div class="uses" style="top:400px">
      <div class="use" ${at(0, 0.6, 'left')}>${ico('play', 'big')}<div><b>เล่นไฟล์เสียง</b><span>ให้ลูกค้าฟังคำตอบ</span></div></div>
      <div class="use" ${at(1, 0.1, 'left')}>${ico('chat', 'big')}<div><b>แสดงเป็นแชท</b><span>ข้อความที่ถอดได้ + คำตอบ</span></div></div>
      <div class="use" ${at(2, 0.1, 'left')}>${ico('loop', 'big')}<div><b>เก็บ conversation_id</b><span>ไว้คุยต่อรอบถัดไป</span></div></div>
    </div>
    <div class="convo" style="top:1000px" ${at(2, 0.9)}>
      <span class="bub">“หวาน 50%”</span><span class="plus">+</span><code>conversation_id</code><span class="eq">→ บทสนทนาเดิม</span>
    </div>
    <img class="robot" src="assets/01-question.png" width="445" height="503" alt="" style="left:60px;top:1160px;width:180px" ${at(3, 0.1)}>
    <div class="tip" style="top:1170px" ${at(3, 0.3, 'left')}><code>{ "text": "" }</code><br>= ไม่ได้ยินเสียงพูด ไม่ใช่ error<br><b>→ ให้แอปชวนลูกค้าพูดใหม่</b></div>`,

  b7: `
    ${head('b7', '', 'สรุป', 'เตรียม → เชื่อม → ใช้ผล')}
    <div class="stack" style="top:410px">
      ${[
        ['1', 'เตรียม', '#38815A', ['Agent + เปิดเสียง + publish', 'API Key (voice + chat)', 'ระบบหลังบ้าน']],
        ['2', 'เชื่อม', '#8d732c', ['ฟัง', '→', 'คิด', '→', 'พูด']],
        ['3', 'ใช้ผล', '#1E7578', ['เล่นเสียง', 'แสดงข้อความ', 'คุยต่อ']],
      ].map(([n, t, c, items], i) => `
        <div class="recap" style="--c:${c}" ${at(i, 0.1)}>
          <span class="recap-t"><b>${n}</b>${t}</span>
          <div class="chips">${items.map((x, j) => x === '→' ? `<i class="arr" ${at(i, 0.4 + j * 0.25)}>→</i>` : `<span class="chip" ${at(i, 0.4 + j * 0.25, 'pop')}>${x}</span>`).join('')}</div>
        </div>`).join('')}
    </div>
    <img class="robot" src="assets/04-open-arms.png" width="425" height="503" alt="" style="left:410px;top:1180px;width:260px" ${at(3, 0.1)}>`,
};

const sceneHtml = Object.entries(scenes).map(([id, html]) => `<section class="scene" id="sc-${id}">${html}</section>`).join('\n');
const captions = beats.flatMap(b => b.segments.map((s, i) =>
  `<div id="cap-${b.id}-${i}" class="clip caption" data-start="${s.start}" data-duration="${s.duration}" data-track-index="8" data-layout-allow-caption-zone>${esc(s.cap).replaceAll('\n', '<br>')}</div>`)).join('\n');
const audioTags = beats.filter(b => b.voice).map(b =>
  `<audio id="vo-${b.id}" class="clip" data-start="${b.start}" data-duration="${b.duration}" data-track-index="9" src="${b.voice}"></audio>`).join('\n');

const html = `<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8">
<title>EP04 · Voice API · video-v2</title>
<link rel="stylesheet" href="style.css">
<script src="assets/gsap.min.js"></script>
</head>
<body>
<main id="film" data-composition-id="ep04-voice-v2" data-width="1080" data-height="1920" data-fps="${cfg.fps}" data-duration="${duration}">
  <div class="kicker">EP04 &nbsp;/&nbsp; VOICE API</div>
  <div class="note">ภาพจำลอง</div>
  <section id="stage" class="clip" data-start="0" data-duration="${duration}" data-track-index="1">
    <div class="spine"><span id="sp1" class="pill">1 เตรียม</span><i></i><span id="sp2" class="pill">2 เชื่อม</span><i></i><span id="sp3" class="pill">3 ใช้ผล</span></div>
    ${sceneHtml}
  </section>
  ${captions}
  ${audioTags}
</main>
<script>window.FILM=${JSON.stringify({ duration, beats: beats.map(({ id, start, duration, segments }) => ({ id, start, duration, segments: segments.map(({ cue, start, duration }) => ({ cue, start, duration })) })) })}</script>
<script src="motion.js"></script>
</body>
</html>
`;
fs.writeFileSync(path.join(root, 'index.html'), html);

const vo = beats.map(b => `## ${b.id} → ${cfg.beats.find(x => x.id === b.id).voice}\n${b.segments.map(s => s.say).join(' ')}\n`).join('\n');
fs.writeFileSync(path.join(root, 'VOICE-SCRIPT.md'), `# EP04 video-v2 — บทสำหรับสร้างเสียง\n\nรัน \`python make-voice-samples.py\` (สร้างเสียงทีละประโยคจาก timing.json) แล้ว \`node build.mjs\`\n\n${vo}`);
console.log(`${beats.length} beats, ${beats.reduce((n, b) => n + b.segments.length, 0)} captions, ${duration.toFixed(2)} s, timing from ${usedVoice ? `${usedVoice} voice file(s), ${exactBeats} with exact caption cuts` : 'estimated reading time (no voice yet)'}`);

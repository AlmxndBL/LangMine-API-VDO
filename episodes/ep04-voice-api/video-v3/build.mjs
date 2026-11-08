// EP04 video-v3 builder (v2 story + v1 API walkthrough + sponsor): timing.json (+ voice files) -> index.html + VOICE-SCRIPT.md
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
  t += dur + cfg.beat_gap + (b.hold || 0);   // optional hold: keep the scene up after the narration
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

const k = s => `<span class="k">${s}</span>`;
const v = s => `<span class="v">${s}</span>`;
const lnx = (html, seg, d, cls = '') => `<div class="ln ${cls}" ${at(seg, d, 'left')}>${html}</div>`;
const COLORS = { 1: '#38815A', 2: '#8d732c', 3: '#1E7578' };

// overview strip shown during the three calls: where are we in the system?
const minimap = (n, verb) => `
  <div class="minimap" style="--c:${COLORS[n]}">
    <span class="mm-node">${ico('phone')}แอป</span>
    <i class="mm-link"></i>
    <span class="mm-node srv">${ico('server')}หลังบ้าน${ico('lock', 'sm')}</span>
    <span class="mm-call">${n} · ${verb}</span>
    <span class="mm-node lm"><img src="assets/langmind-logo.png" width="689" height="606" alt="">LangMind</span>
  </div>`;

// live API panel (from v1): input → endpoint card → output
const panel = ({ n, input, method = 'POST', path: p, scope, lines, foot, output, hl }) => `
  <div class="panel">
    <div class="slot-in" ${at(0, 0.2)}>${input}</div>
    ${vArrow(70, at(0, 0.7))}
    <div class="code" ${at(0, 1.0)}>
      <div class="code-head"><span class="method">${method}</span><span class="scope">สิทธิ์ ${scope}</span></div>
      <div class="code-path">${p}</div>
      <div class="code-body">${lines}</div>
      <div class="code-foot">${foot}</div>
    </div>
    ${vArrow(70, at(output.seg, output.at - 0.4))}
    <div class="slot-out" ${at(output.seg, output.at)}>${output.html}</div>
  </div>`;

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
    ${head('b2', '', 'ภาพรวมทั้งหมด', 'API คืออะไร · ใครคุยกับใคร')}
    <div class="group" data-out="1" data-out-at="0">
      <div class="node" style="top:430px" ${at(0, 0.1)}>${ico('phone', 'big')}<div><b>แอปของคุณ</b><span class="alias" ${at(0, 2.6, 'left')}>= พนักงานหน้าร้าน</span></div></div>
      <div class="lane" style="top:640px">
        <div class="lane-l" ${at(0, 0.7, 'left')}><b>ส่งงาน</b><span ${at(0, 3.0)}>ส่งออร์เดอร์</span></div>
        ${vArrow(250, at(0, 0.6))}
        ${vArrow(250, at(0, 1.4), true)}
        <div class="lane-r" ${at(0, 1.5)}><b>รับผล</b><span ${at(0, 3.4)}>รับจานกลับ</span></div>
      </div>
      <div class="node lm" style="top:910px" ${at(0, 1.0)}><img src="assets/langmind-logo.png" width="689" height="606" alt="LangMind"><div><b>LangMind</b><span class="alias" ${at(0, 2.8, 'left')}>= ครัว</span></div></div>
    </div>
    <div class="node wide" style="top:400px" ${at(1, 0.4)}>${ico('phone', 'big')}<div><b>แอปมือถือ</b><span>อัดเสียง · เล่นเสียง</span></div></div>
    <div class="lane small" style="top:600px">
      <div class="lane-l" ${at(1, 0.9, 'left')}><b>ไฟล์เสียง</b></div>
      ${vArrow(150, at(1, 0.8))}${vArrow(150, at(1, 1.1), true)}
      <div class="lane-r" ${at(1, 1.2)}><b>เสียงตอบ</b></div>
    </div>
    <div class="node wide" style="top:760px" ${at(1, 1.2)}>${ico('server', 'big')}<div><b>ระบบหลังบ้านของคุณ</b><span>เก็บ API Key</span></div><span class="badge haskey" ${at(1, 1.8, 'pop')}>${ico('lock')}Key</span></div>
    <div class="lane small" style="top:960px">
      <div class="calls3" ${at(2, 0.2)}><span class="step s1" ${at(2, 0.5, 'pop')}>1 ฟัง</span><span class="step s2" ${at(2, 0.9, 'pop')}>2 คิด</span><span class="step s3" ${at(2, 1.3, 'pop')}>3 พูด</span></div>
      ${vArrow(150, at(1, 1.9))}${vArrow(150, at(1, 2.2), true)}
      <div class="lane-r" ${at(1, 2.3)}><b>ผลลัพธ์</b></div>
    </div>
    <div class="node wide lm" style="top:1120px" ${at(1, 2.4)}><img src="assets/langmind-logo.png" width="689" height="606" alt="LangMind"><div><b>LangMind</b><span>Agent · Voice API · Chat API</span></div></div>`,

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
        <div class="warn" ${at(1, 2.6)}>ไม่เปิด = <code>403 VOICE_DISABLED</code> · แก้แล้วไม่ publish = ยังไม่มีผล</div>
      </div>
      <div class="card" ${at(2, 0.1)}>
        <div class="card-h">${ico('key', 'big')}<div><b>API Key</b><span class="mono">lmpat_••••••••</span></div></div>
        <div class="chips"><span class="chip mono" ${at(2, 1.6, 'pop')}>voice:invoke</span><span class="chip mono" ${at(2, 2.4, 'pop')}>chat:invoke</span></div>
      </div>
      <div class="card" ${at(3, 0.1)}>
        <div class="card-h">${ico('server', 'big')}<div><b>ระบบหลังบ้าน (server)</b><span>เก็บ Key · เรียก API แทนแอปมือถือ</span></div></div>
      </div>
    </div>`,

  b4: `
    ${head('b4', '2', 'เชื่อม', 'ครั้งที่ 1 · ฟัง')}
    ${minimap(1, 'ฟัง')}
    ${panel({
      input: `<div class="chip in-chip">${ico('mic')}<span><b>order.wav</b> · เสียงจากไมค์</span></div>`,
      path: '/api/v1/agents/{id}/voice/transcribe', scope: 'voice:invoke',
      lines: lnx(`Authorization: Bearer ${v('$LM_TOKEN')}`, 0, 1.3) + lnx(`-F ${v('audio=@order.wav;type=audio/wav')}`, 0, 1.5) + lnx(`-F ${v('language=th')}`, 0, 1.7),
      foot: 'ไฟล์ไม่เกิน 4 MB · wav, mp3, webm, ogg, m4a',
      output: { seg: 1, at: 0.5, html: `<div class="chip out-chip json">{ ${k('"text"')}: ${v('"ขอสั่งอเมริกาโน่เย็น 1 แก้วครับ"')} }</div>` },
    })}`,

  b5: `
    ${head('b5', '2', 'เชื่อม', 'ครั้งที่ 2 · คิด')}
    ${minimap(2, 'คิด')}
    ${panel({
      input: `<div class="chip in-chip">${ico('txt')}<span>“ขอสั่งอเมริกาโน่เย็น 1 แก้วครับ”</span></div>`,
      path: '/api/chat/message/blocking', scope: 'chat:invoke',
      lines: lnx(`${k('"query"')}: ${v('"ขอสั่งอเมริกาโน่เย็น 1 แก้วครับ"')},`, 0, 1.3)
        + lnx(`<span class="mark" data-mark="0" data-mark-at="2.4"></span>${k('"input_mode"')}: ${v('"voice"')},`, 0, 1.5, 'hl')
        + lnx(`${k('"conversation_id"')}: ${v('null')}`, 0, 1.7),
      foot: 'agent_id ของร้าน · Agent ตอบแบบภาษาพูดตามที่ตั้งไว้',
      output: { seg: 1, at: 0.2, html: `<div class="chip out-chip json">{ ${k('"answer"')}: ${v('"รับอเมริกาโน่เย็น 1 แก้วครับ<br>&nbsp;&nbsp;&nbsp;ทั้งหมด 65 บาท<br>&nbsp;&nbsp;&nbsp;รับหวานกี่เปอร์เซ็นต์ดีครับ?"')},<div class="ln hl2">&nbsp;&nbsp;<span class="mark" data-mark="2" data-mark-at="0.2"></span>${k('"conversation_id"')}: ${v('"c_7Q2…"')} }</div><em>คำตอบตัวอย่าง (ภาพจำลอง)</em></div>` },
    })}`,

  b6: `
    ${head('b6', '2', 'เชื่อม', 'ครั้งที่ 3 · พูด')}
    ${minimap(3, 'พูด')}
    <div class="group" data-out="2" data-out-at="0">
    ${panel({
      input: `<div class="chip in-chip">${ico('txt')}<span>“รับอเมริกาโน่เย็น 1 แก้วครับ ทั้งหมด…”</span></div>`,
      path: '/api/v1/agents/{id}/voice/speech', scope: 'voice:invoke',
      lines: lnx(`${k('"text"')}: ${v('"รับอเมริกาโน่เย็น 1 แก้วครับ…"')},`, 0, 1.3) + lnx(`${k('"format"')}: ${v('"auto"')}`, 0, 1.5),
      foot: 'ข้อความไม่เกิน 4,000 ตัวอักษรต่อครั้ง',
      output: { seg: 1, at: 0.5, html: `<div class="chip out-chip audio">${ico('spk')}<span><b>audio/mpeg</b> หรือ <b>audio/wav</b></span>${bars(14, 'mini', 'id="wave-b6-mini"')}</div>` },
    })}
    </div>
    <div class="place" style="left:270px;top:520px" ${at(2, 0.2)}>${device('dev-b6', 524, 610)}</div>
    ${bars(28, 'big', 'id="wave-b6" style="left:270px;top:1180px;width:540px"')}
    <div class="wave-label" style="top:1316px"><span ${at(2, 0.9)}>กำลังเล่นเสียงตอบกลับ…</span></div>`,

  b7: `
    ${head('b7', '3', 'ใช้ผล', 'เอาผลลัพธ์ไปทำอะไร')}
    <div class="stack" style="top:410px">
      <div class="use" ${at(0, 0.5, 'left')}>${ico('play', 'big')}<div><b>เล่นไฟล์เสียง</b><span>ให้ลูกค้าฟังคำตอบ (audio/mpeg หรือ audio/wav)</span></div></div>
      <div class="use" ${at(1, 0.1, 'left')}>${ico('chat', 'big')}<div><b>แสดงเป็นแชท</b><span>ข้อความที่ถอดได้ (text) + คำตอบ (answer)</span></div></div>
      <div class="use" ${at(2, 0.1, 'left')}>${ico('loop', 'big')}<div><b>เก็บ conversation_id</b><span>ส่งไปพร้อมข้อความรอบถัดไป</span></div></div>
    </div>
    <div class="convo" style="top:960px" ${at(2, 1.0)}>
      <span class="bub">“หวาน 50%”</span><span class="plus">+</span><code>conversation_id</code><span class="eq">→ บทสนทนาเดิม</span>
    </div>
    <img class="robot" src="assets/01-question.png" width="445" height="503" alt="" style="left:60px;top:1120px;width:180px" ${at(3, 0.1)}>
    <div class="tip" style="top:1130px" ${at(3, 0.3, 'left')}><code>{ "text": "" }</code><br>= ไม่ได้ยินเสียงพูด ไม่ใช่ error<br><b>→ ให้แอปชวนลูกค้าพูดใหม่</b></div>`,

  b8: `
    ${head('b8', '', 'สรุป', 'เตรียม → เชื่อม → ใช้ผล')}
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
    <img class="robot" src="assets/04-open-arms.png" width="425" height="503" alt="" style="left:410px;top:1180px;width:260px" ${at(2, 1.4)}>`,

  b9: `
    <div class="sponsor">
      <div class="sp-by" ${at(0, 0.2)}>สนับสนุนโดย</div>
      <img class="sp-logo" src="assets/langmind-logo.png" width="689" height="606" alt="LangMind" ${at(0, 0.5, 'pop')}>
      <div class="sp-url" ${at(1, 0.3, 'pop')}>langmind.in.th</div>
      <div class="chips sp-chips" ${at(1, 1.0)}><span class="chip">Agent</span><span class="chip">Voice API</span><span class="chip">Chat API</span></div>
    </div>`,
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
<title>EP04 · Voice API · video-v3</title>
<link rel="stylesheet" href="style.css">
<script src="assets/gsap.min.js"></script>
</head>
<body>
<main id="film" data-composition-id="ep04-voice-v3" data-width="1080" data-height="1920" data-fps="${cfg.fps}" data-duration="${duration}">
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
fs.writeFileSync(path.join(root, 'VOICE-SCRIPT.md'), `# EP04 video-v3 — บทสำหรับสร้างเสียง\n\nรัน \`python make-voice-samples.py\` (สร้างเสียงทีละประโยคจาก timing.json) แล้ว \`node build.mjs\`\n\n${vo}`);
console.log(`${beats.length} beats, ${beats.reduce((n, b) => n + b.segments.length, 0)} captions, ${duration.toFixed(2)} s, timing from ${usedVoice ? `${usedVoice} voice file(s), ${exactBeats} with exact caption cuts` : 'estimated reading time (no voice yet)'}`);

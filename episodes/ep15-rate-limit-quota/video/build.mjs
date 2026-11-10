// EP15 Rate Limit & Quota builder (same engine as EP04 video-v3): timing.json (+ voice files) -> index.html + VOICE-SCRIPT.md
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
  download: '<path d="M12 4v11M7 10.5l5 5 5-5M5 19.5h14"/>',
  file: '<path d="M6 2.5h8l4.5 4.5v14.5h-12.5z"/><path d="M14 2.5V7h4.5M9 12h6M9 15.5h6"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.2 1.2"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.2-1.2"/>',
  chart: '<path d="M4 20.5h16"/><path d="M7 17V12M11.5 17V7M16 17v-7"/>',
  gauge: '<path d="M4.5 16a7.5 7.5 0 1 1 15 0"/><path d="M12 16l3.5-5"/><circle cx="12" cy="16" r="1.2"/>',
  shield: '<path d="M12 3l7.5 3v5.5c0 4.5-3.2 8-7.5 9.5-4.3-1.5-7.5-5-7.5-9.5V6z"/><path d="M9 12l2.2 2.2L15.5 10"/>',
  check: '<circle cx="12" cy="12" r="8.5"/><path d="M8 12.3l2.7 2.7L16.2 9.5"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.3-4.3"/>',
  refresh: '<path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3"/><path d="M19.5 4v4h-4"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  trash: '<path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13"/>',
  inbox: '<path d="M3.5 13.5l2.5-8h12l2.5 8v5a1.5 1.5 0 0 1-1.5 1.5h-14A1.5 1.5 0 0 1 3.5 18.5z"/><path d="M3.5 13.5h5l1.5 2.5h4l1.5-2.5h5"/>',
};
const ico = (n, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24">${I[n]}</svg>`;
const at = (k, d = 0.1, anim = 'up') => `data-in="${k}" data-at="${d}" data-anim="${anim}"`;
const bars = (n, cls, extra = '') => `<div class="wave ${cls}" ${extra}>${Array.from({ length: n }, () => '<i></i>').join('')}</div>`;
const vArrow = (h, attrs = '', flip = false) =>
  `<svg class="varrow${flip ? ' up' : ''}" ${attrs} viewBox="0 0 60 ${h}" style="height:${h}px"><path pathLength="1" d="M30 6 V${h - 14} M14 ${h - 28} L30 ${h - 10} L46 ${h - 28}"/><circle class="dot" cx="30" cy="10" r="7" data-y0="10" data-y1="${h - 22}"/></svg>`;
const hArrow = (attrs = '') =>
  `<svg class="harrow" ${attrs} viewBox="0 0 70 40"><path pathLength="1" d="M4 20 H58 M46 8 L62 20 L46 32"/></svg>`;
// zoom into the mock's phone card (card spans x 290–1150, y 140–1640 of the 1440×1800 raster)
const device = (id, w, h, a, b, altA = 'หน้าจอแอป (ภาพจำลอง)', altB = 'หน้าจอแอป (ภาพจำลอง)') => {
  const iw = Math.round(w / 0.6), left = -Math.round(290 / 1440 * iw) + Math.round((w - 860 / 1440 * iw) / 2), top = -Math.round(130 / 1440 * iw);
  const st = `width:${iw}px;left:${left}px;top:${top}px`;
  return `
  <div class="device" id="${id}" style="width:${w + 16}px">
    <div class="screen" style="width:${w}px;height:${h}px">
      <img src="${a}" width="1440" height="1800" alt="${altA}" data-layout-allow-overflow style="${st}">
      ${b ? `<img class="img-a" src="${b}" width="1440" height="1800" alt="${altB}" data-layout-allow-overflow style="${st}">` : ''}
    </div>
  </div>`;
};
const head = (id, n, verb, rest) => `<h1 class="heading">${n ? `<span class="num">${n}</span>` : ''}${verb}<small>${rest}</small></h1>`;
const QUOTA = 'assets/app-q-quota.jpg', QLOW = 'assets/app-q-quota-low.jpg';

const k = s => `<span class="k">${s}</span>`;
const v = s => `<span class="v">${s}</span>`;
const lnx = (html, seg, d, cls = '') => `<div class="ln ${cls}" ${at(seg, d, 'left')}>${html}</div>`;
const c = s => `<span class="c">// ${s}</span>`;
const pl = () => `<span class="pl" data-in="2" data-at="0.8" data-anim="pop">ตามแผน</span>`;
const codeBox = ({ method = 'GET', path: p, scope, lines, foot, attrs = '' }) => `
    <div class="code" ${attrs}>
      <div class="code-head"><span class="method${method === 'DELETE' ? ' del' : ''}">${method}</span><span class="scope">สิทธิ์ ${scope}</span></div>
      <div class="code-path">${p}</div>
      ${lines ? `<div class="code-body">${lines}</div>` : ''}
      ${foot ? `<div class="code-foot">${foot}</div>` : ''}
    </div>`;
const COLORS = { 1: '#38815A', 2: '#8d732c', 3: '#1E7578', 4: '#5b5f9e' };

const minimap = (n, verb) => `
  <div class="minimap" style="--c:${COLORS[n]}">
    <span class="mm-node srv">${ico('server')}หลังบ้านร้าน${ico('lock', 'sm')}</span>
    <span class="mm-call">${n} · ${verb}</span>
    <span class="mm-node lm"><img src="assets/langmind-logo.png" width="689" height="606" alt="">ลิงก์ย่อ</span>
  </div>`;

const panel = ({ input, method = 'GET', path: p, scope, lines, foot, output }) => `
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

const callout = (field, meaning, seg, d) => `<div class="callout" ${at(seg, d, 'left')}><code>${field}</code><span>${meaning}</span></div>`;

const E = (http, code, extra = '') => `<span class="chip err${extra}"><i>${http}</i>${code}</span>`;
const codemap = active => `
  <div class="codemap">${['401', '403', '404', '422', '429', 'Voice'].map(x => `<span class="${x === active || (Array.isArray(active) && active.includes(x)) ? 'on' : ''}">${x}</span>`).join('')}</div>`;
const fixCard = (seg, d, title, items) => `
      <div class="card ok" ${at(seg, d)}>
        <div class="card-h">${ico('check', 'big')}<div><b>${title}</b></div></div>
        <div class="chips col">${items.map(([s, dd, h]) => `<span class="chip note" ${at(s, dd, 'pop')}>${h}</span>`).join('')}</div>
      </div>`;

const scenes = {
  b1: `
    ${head('b1', '', 'โควตาเต็ม', 'หรือโดน 429')}
    <div class="place" style="left:242px;top:370px">${device('dev-b1', 580, 720, QLOW, QLOW, 'หน้าการใช้งาน API ของร้าน โควตาเสียงใกล้หมด (ภาพจำลอง)', 'หน้าการใช้งาน API ของร้าน (ภาพจำลอง)')}</div>
    <div class="wave-label" style="top:1150px"><span ${at(0, 3.0)}>แชท · เสียง · ลิงก์ย่อ → 429 / โควตาเต็ม</span></div>
    <div class="qrow" style="top:1350px">
      <span class="qchip" ${at(1, 0.4, 'pop')}>นับยังไง?</span>
      <span class="qchip" ${at(1, 1.6, 'pop')}>ลิมิตเท่าไร?</span>
      <span class="qchip" ${at(1, 2.8, 'pop')}>ดูยอดที่ไหน?</span>
    </div>`,

  b2: `
    ${head('b2', '1', 'โควตา', 'บัญชีเดียวกับเว็บ')}
    <div class="pool" style="top:440px">
      <div class="src" ${at(0, 1.4)}>${ico('chat', 'big')}<b>เว็บ</b><span>ทีมใช้งาน</span></div>
      <div class="src" ${at(0, 2.2)}>${ico('key', 'big')}<b>API Key</b><span>ระบบหลังบ้าน</span></div>
    </div>
    <div class="pool-arrows" ${at(0, 3.0)}>${vArrow(90, '')}${vArrow(90, '')}</div>
    <div class="meter-card" style="top:860px" ${at(0, 3.6)}>
      <b>โควตาบัญชีเดียวกัน</b>
      <div class="mbar"><i class="m-web"></i><i class="m-api"></i></div>
      <div class="mleg"><span class="lw">เว็บ</span><span class="la">API Key</span><span class="lf">เหลือ</span></div>
    </div>
    <div class="warn wide" style="top:1220px" ${at(1, 0.4)}>ทีมใช้เว็บเยอะ → API เหลือน้อยลงด้วย</div>`,

  b3: `
    ${head('b3', '1', 'โควตา', 'คิดจากผู้ใช้คนเดียวกัน')}
    <div class="stack" style="top:420px">
      <div class="card" ${at(0, 0.2)}>
        <div class="card-h">${ico('bot', 'big')}<div><b>ผู้ใช้คนเดียวกัน</b><span>ไม่ว่าจะเรียกจาก browser หรือ API Key</span></div></div>
        <div class="chips"><span class="chip note" ${at(0, 1.2, 'pop')}>โควตาโทเค็น LLM</span><span class="chip note" ${at(0, 3.4, 'pop')}>rate limit การสนทนา</span></div>
        <div class="chips"><span class="chip" ${at(0, 6.4, 'pop')}>browser</span><span class="chip" ${at(0, 7.0, 'pop')}>API Key</span><span class="chip mono" ${at(0, 7.6, 'pop')}>= คนเดียวกัน</span></div>
      </div>
      <div class="card ok" ${at(1, 0.2)}>
        <div class="card-h">${ico('gauge', 'big')}<div><b>เช็กโควตาที่เหลือ</b><span>หน้า Credentials ในเว็บ LangMind</span></div></div>
      </div>
    </div>`,

  b4: `
    ${head('b4', '2', 'ลิมิต', 'Voice มีลิมิตของตัวเอง')}
    <div class="stack" style="top:420px">
      <div class="card" ${at(0, 0.2)}>
        <div class="card-h">${ico('mic', 'big')}<div><b>ลิมิตต่อผู้ใช้ (ค่าเริ่มต้น)</b></div></div>
        <div class="stats"><div ${at(0, 4.2, 'pop')}><b>60</b><span>ถอดเสียง / นาที</span></div><div ${at(0, 7.4, 'pop')}><b>300</b><span>อ่านออกเสียง / นาที</span></div></div>
      </div>
      <div class="card" ${at(1, 0.2)}>
        <div class="chips"><span class="chip note" ${at(1, 0.4, 'pop')}>ไม่ผูกกับแพ็กเกจ</span><span class="chip note" ${at(1, 2.4, 'pop')}>ค่าใช้จ่ายตามโมเดลเสียงที่ agent เลือก</span></div>
      </div>
      <div class="flow" ${at(2, 0.2)}><span>${ico('mic')}ถอดเสียง</span><i>→</i><span>${ico('txt')}ข้อความ</span><i>→</i><span>${ico('chat')}chat</span><b ${at(2, 2.8, 'pop')}>นับโควตา chat ด้วย</b></div>
    </div>`,

  b5: `
    ${head('b5', '2', 'ลิมิต', 'โควตาเสียง')}
    <div class="stack" style="top:420px">
      <div class="units" ${at(0, 0.2)}>
        <div ${at(0, 3.0, 'pop')}>${ico('mic', 'big')}<b>ถอดเสียง</b><span>นับเป็น <em>นาที</em></span></div>
        <div ${at(0, 5.0, 'pop')}>${ico('spk', 'big')}<b>อ่านออกเสียง</b><span>นับเป็น <em>ตัวอักษร</em></span></div>
      </div>
      <div class="fine" ${at(0, 1.2)}>โควตาเสียงของแพ็กเกจ + เครดิต</div>
      <div class="card no" ${at(1, 0.2)}>
        <div class="card-h">${ico('gauge', 'big')}<div>${E('429', 'VOICE_QUOTA_EXCEEDED', ' big')}<span>โควตาเสียงไม่พอสำหรับคำขอนี้</span></div></div>
      </div>
      <div class="chip mono big-path" ${at(1, 3.0, 'pop')}>GET /api/me/voice-quota · ยอดคงเหลือ</div>
    </div>`,

  b6: `
    ${head('b6', '2', 'ลิมิต', 'โควตาลิงก์ย่อ')}
    <div class="stack" style="top:420px">
      ${codeBox({ path: '/api/short-links/usage', scope: 'short_links:read', attrs: at(0, 0.2),
        lines: lnx(`ใช้ไปเท่าไร ${c('เทียบเพดานของแผน')}`, 0, 3.6) + lnx(`ฟีเจอร์ที่แผนเปิดให้`, 0, 4.4),
        foot: 'นับโควตาเดียวกับหน้า “ลิงก์ย่อ” ในเว็บ' })}
      <div class="chips col" ${at(1, 0.2)}>
        <span class="chip err" ${at(1, 0.6, 'pop')}><i>422</i>SHORT_LINK_LIMIT_EXCEEDED</span>
        <span class="chip err" ${at(1, 3.2, 'pop')}><i>429</i>SHORT_LINK_RATE_EXCEEDED</span>
      </div>
      <div class="fine" ${at(1, 4.6)}>รายละเอียด Short Links ดู EP13</div>
    </div>`,

  b7: `
    ${head('b7', '3', 'รับมือ', 'เจอ 429 ทำยังไง')}
    <div class="stack" style="top:420px">
      <div class="card ok" ${at(0, 0.2)}>
        <div class="card-h">${ico('refresh', 'big')}<div>${E('429', 'RATE_LIMIT_EXCEEDED', ' big')}<span>รอแล้วลองใหม่ · เว้นให้นานขึ้น</span></div></div>
        <div class="backoff">
          <span ${at(0, 3.6, 'pop')}>ลอง</span><i ${at(0, 4.0)}>รอ 1 วิ</i><span ${at(0, 4.4, 'pop')}>ลอง</span><i ${at(0, 4.8)}>รอ 2 วิ</i><span ${at(0, 5.2, 'pop')}>ลอง</span><i ${at(0, 5.6)}>รอ 4 วิ</i><span class="okk" ${at(0, 6.0, 'pop')}>✓</span>
        </div>
        <div class="fine" ${at(0, 6.6)}>ตัวเลขเป็นตัวอย่าง · คู่มือไม่ได้ระบุเวลารอ</div>
      </div>
      <div class="card" ${at(1, 0.2)}>
        <div class="card-h">${ico('gauge', 'big')}<div><b>เช็กยอดก่อนงานใหญ่</b></div></div>
        <div class="chips"><span class="chip mono" ${at(1, 1.0, 'pop')}>/api/me/voice-quota</span><span class="chip mono" ${at(1, 1.6, 'pop')}>/api/short-links/usage</span><span class="chip note" ${at(1, 2.2, 'pop')}>หน้า Credentials</span></div>
      </div>
    </div>`,

  b8: `
    ${head('b8', '3', 'รับมือ', 'ดูแล Key = ดูแลโควตา')}
    <div class="stack tight" style="top:420px">
      <div class="warn" ${at(0, 0.4)}>Key ที่หลุด ใช้โควตาบัญชีคุณได้</div>
      ${[
        [0, 3.6, 'shield', 'scope น้อยที่สุดเท่าที่จำเป็น', 'สคริปต์ที่แค่อ่าน agent ไม่ต้องมี agents:write'],
        [0, 6.0, 'key', 'แยก API Key ตามงาน', 'เพิกถอนทีละอันได้ ไม่กระทบอันอื่น'],
        [1, 0.3, 'clock', 'ตั้งวันหมดอายุ', 'โดยเฉพาะ Key ทดสอบชั่วคราว'],
        [1, 1.8, 'lock', 'อย่า commit Key ลง repo', 'ใช้ environment variable / secret manager'],
        [2, 0.3, 'trash', 'สงสัยว่าหลุด → เพิกถอนทันที', 'มีผลในคำขอถัดไป ไม่ต้องรอ'],
      ].map(([s, d, ic, b, sp]) => `<div class="safe" ${at(s, d)}>${ico(ic, 'big')}<div><b>${b}</b><span>${sp}</span></div></div>`).join('')}
    </div>`,

  b9: `
    ${head('b9', '3', 'ใช้ผล', 'หน้าโควตาของร้าน')}
    <div class="place" style="left:252px;top:390px">${device('dev-b9', 560, 660, QUOTA, QLOW, 'หน้าการใช้งาน API ของร้าน (ภาพจำลอง)', 'หน้าการใช้งาน API ของร้าน โควตาเสียงใกล้หมด (ภาพจำลอง)')}</div>
    <div class="callouts" style="top:1100px" data-out="1" data-out-at="0">
      ${callout('/api/me/voice-quota', 'ยอดเสียง', 0, 2.4)}
      ${callout('/api/short-links/usage', 'ยอดลิงก์ย่อ', 0, 4.8)}
    </div>
    <div class="callouts" style="top:1100px">
      ${callout('ใกล้หมด', 'แจ้งทีมล่วงหน้า', 1, 0.6)}
      ${callout('โทเค็น LLM', 'ดูที่หน้า Credentials', 1, 3.2)}
    </div>`,

  b10: `
    ${head('b10', '', 'สรุป', 'โควตา → ลิมิต → รับมือ')}
    <div class="stack" style="top:410px">
      ${[
        ['1', 'โควตา', '#38815A', ['บัญชีเดียวกับเว็บ', 'หน้า Credentials'], 0.3],
        ['2', 'ลิมิต', '#8d732c', ['Voice 60 / 300 ต่อนาที', 'voice-quota', 'short-links/usage'], 2.4],
        ['3', 'รับมือ', '#1E7578', ['รอแล้วลองใหม่', 'เช็กยอดก่อน', 'ดูแล Key'], 5.0],
      ].map(([n, t, col, items, d]) => `
        <div class="recap" style="--c:${col}" ${at(0, d)}>
          <span class="recap-t"><b>${n}</b>${t}</span>
          <div class="chips">${items.map((x, j) => `<span class="chip" ${at(0, d + 0.3 + j * 0.25, 'pop')}>${x}</span>`).join('')}</div>
        </div>`).join('')}
    </div>
    <img class="robot" src="assets/04-open-arms.png" width="425" height="503" alt="" style="left:410px;top:1180px;width:260px" ${at(0, 6.4)}>`,

  b11: `
    <div class="sponsor">
      <div class="sp-by" ${at(0, 0.2)}>สนับสนุนโดย</div>
      <img class="sp-logo" src="assets/langmind-logo.png" width="689" height="606" alt="LangMind" ${at(0, 0.5, 'pop')}>
      <div class="sp-url" ${at(1, 0.3, 'pop')}>langmind.in.th</div>
      <div class="chips sp-chips" ${at(1, 1.0)}><span class="chip">Rate Limit</span><span class="chip">Quota</span><span class="chip">API Key</span></div>
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
<title>EP15 · Rate Limit & Quota · draft</title>
<link rel="stylesheet" href="style.css">
<script src="assets/gsap.min.js"></script>
</head>
<body>
<main id="film" data-composition-id="ep15-rate-limit-quota" data-width="1080" data-height="1920" data-fps="${cfg.fps}" data-duration="${duration}">
  <div class="kicker">EP15 &nbsp;/&nbsp; RATE LIMIT &amp; QUOTA</div>
  <div class="note">ภาพจำลอง</div>
  <section id="stage" class="clip" data-start="0" data-duration="${duration}" data-track-index="1">
    <div class="spine"><span id="sp1" class="pill">1 โควตา</span><i></i><span id="sp2" class="pill">2 ลิมิต</span><i></i><span id="sp3" class="pill">3 รับมือ</span></div>
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
fs.writeFileSync(path.join(root, 'VOICE-SCRIPT.md'), `# EP15 Rate Limit & Quota — บทสำหรับสร้างเสียง\n\nรัน \`python make-voice-samples.py\` (สร้างเสียงทีละประโยคจาก timing.json) แล้ว \`node build.mjs\`\n\n${vo}`);
console.log(`${beats.length} beats, ${beats.reduce((n, b) => n + b.segments.length, 0)} captions, ${duration.toFixed(2)} s, timing from ${usedVoice ? `${usedVoice} voice file(s), ${exactBeats} with exact caption cuts` : 'estimated reading time (no voice yet)'}`);

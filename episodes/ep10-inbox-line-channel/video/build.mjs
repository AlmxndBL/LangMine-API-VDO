// EP10 video builder (Inbox API & LINE Channel): timing.json (+ voice files) -> index.html + VOICE-SCRIPT.md
// Run from this folder: node build.mjs
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
  let spanStart = 0, spanEnd = dur, gaps = [];
  if (audio) {
    const ps = pauseList(resolveVoiceRel(b.voice));
    if (ps.length && ps[0].start < 0.05) { spanStart = ps[0].end; ps.shift(); }
    if (ps.length && ps[ps.length - 1].end > dur - 0.05) { spanEnd = ps[ps.length - 1].start; ps.pop(); }
    gaps = ps.map(p => (p.start + p.end) / 2);
  }
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
  t += dur + cfg.beat_gap + (b.hold || 0);
  return beat;
}
const duration = fr(t - cfg.beat_gap + cfg.tail);

// ---------- markup helpers ----------
const I = {
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
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
};
const ico = (n, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24">${I[n] || ''}</svg>`;
const at = (k, d = 0.1, anim = 'up') => `data-in="${k}" data-at="${d}" data-anim="${anim}"`;
const vArrow = (h, attrs = '', flip = false) =>
  `<svg class="varrow${flip ? ' up' : ''}" ${attrs} viewBox="0 0 60 ${h}" style="height:${h}px"><path pathLength="1" d="M30 6 V${h - 14} M14 ${h - 28} L30 ${h - 10} L46 ${h - 28}"/><circle class="dot" cx="30" cy="10" r="7" data-y0="10" data-y1="${h - 22}"/></svg>`;

const device = (id, w, h) => `
  <div class="device" id="${id}" style="width:${w + 16}px">
    <div class="screen" style="width:${w}px;height:${h}px">
      <img src="assets/app-inbox-threads.jpg" width="1440" height="1800" alt="หน้าจอมอนิเตอร์กล่องข้อความร้านกาแฟ (ภาพจำลอง)" data-layout-allow-overflow style="width:${w}px">
      <img class="img-a" src="assets/app-inbox-handover.jpg" width="1440" height="1800" alt="หน้าจอมอนิเตอร์แชทสถานะ Handover (ภาพจำลอง)" data-layout-allow-overflow style="width:${w}px">
    </div>
  </div>`;

const head = (id, n, verb, rest) => `<h1 class="heading">${n ? `<span class="num">${n}</span>` : ''}${verb}<small>${rest}</small></h1>`;

const k = s => `<span class="k">${s}</span>`;
const v = s => `<span class="v">${s}</span>`;
const lnx = (html, seg, d, cls = '') => `<div class="ln ${cls}" ${at(seg, d, 'left')}>${html}</div>`;
const COLORS = { 1: '#38815A', 2: '#8d732c', 3: '#1E7578' };

const minimap = (n, verb) => `
  <div class="minimap" style="--c:${COLORS[n]}">
    <span class="mm-node">${ico('phone')}LINE แชท</span>
    <i class="mm-link"></i>
    <span class="mm-node lm"><img src="assets/langmind-logo.png" width="689" height="606" alt="">Inbox</span>
    <span class="mm-call">${n} · ${verb}</span>
    <span class="mm-node srv">${ico('server')}หลังบ้าน${ico('lock', 'sm')}</span>
  </div>`;

const panel = ({ n, input, method = 'GET', path: p, scope, lines, foot, output }) => `
  <div class="panel">
    <div class="slot-in" ${at(0, 0.2)}>${input}</div>
    ${vArrow(60, at(0, 0.6))}
    <div class="code" ${at(0, 0.9)}>
      <div class="code-head"><span class="method">${method}</span><span class="scope">สิทธิ์ ${scope}</span></div>
      <div class="code-path">${p}</div>
      <div class="code-body">${lines}</div>
      <div class="code-foot">${foot}</div>
    </div>
    ${vArrow(60, at(output.seg, output.at - 0.4))}
    <div class="slot-out" ${at(output.seg, output.at)}>${output.html}</div>
  </div>`;

const scenes = {
  b1: `
    ${head('b1', '', 'แชทจาก LINE', 'ดึงแชท · เช็กแอดมิน · โหลดไฟล์')}
    <div class="place" style="left:242px;top:350px">${device('dev-b1', 580, 725)}</div>
    <div class="wave-label" style="top:1130px">
      <span id="wl-b1-1" ${at(0, 0.3)}>LINE Official Account ⇄ หลังบ้าน</span>
      <span id="wl-b1-2" ${at(1, 0.4)}>เช็กแอดมินรับสาย · Export รายงาน</span>
    </div>
    <div class="qrow" style="top:1230px">
      <span class="qchip" ${at(2, 0.3, 'pop')}>เตรียมอะไร?</span>
      <span class="qchip" ${at(2, 0.8, 'pop')}>เชื่อมตรงไหน?</span>
      <span class="qchip" ${at(2, 1.3, 'pop')}>ใช้ผลยังไง?</span>
    </div>
    <img class="robot" src="assets/03-wave-chest.png" width="456" height="503" alt="" style="left:780px;top:1000px;width:220px" ${at(0, 0.5)}>`,

  b2: `
    ${head('b2', '', 'ภาพรวม', 'LINE ⇄ LangMind Inbox ⇄ หลังบ้าน')}
    <div class="node wide" style="top:390px" ${at(0, 0.2)}>${ico('phone', 'big')}<div><b>แชทภายนอก (LINE)</b><span>ลูกค้าทักสอบถามเข้ามา</span></div></div>
    <div class="lane small" style="top:550px">
      <div class="lane-l" ${at(0, 0.6, 'left')}><b>ข้อความแชท</b></div>
      ${vArrow(130, at(0, 0.5))}
      ${vArrow(130, at(0, 0.8), true)}
      <div class="lane-r" ${at(0, 0.9)}><b>ตอบกลับ</b></div>
    </div>
    <div class="node wide lm" style="top:690px" ${at(0, 1.0)}><img src="assets/langmind-logo.png" width="689" height="606" alt="LangMind"><div><b>LangMind Inbox</b><span>โปรไฟล์สด · รวมเธรด · จัดการ Handover</span></div></div>
    <div class="lane small" style="top:870px">
      <div class="calls3" ${at(2, 0.2)}>
        <span class="step s1" ${at(2, 0.4, 'pop')}>1 threads</span>
        <span class="step s2" ${at(2, 0.8, 'pop')}>2 handover</span>
        <span class="step s3" ${at(2, 1.2, 'pop')}>3 export</span>
      </div>
      ${vArrow(140, at(1, 0.6))}
      ${vArrow(140, at(1, 0.9), true)}
      <div class="lane-r" ${at(1, 1.0)}><b>อ่านข้อมูล 3 จุด</b></div>
    </div>
    <div class="node wide" style="top:1030px" ${at(1, 0.2)}>${ico('server', 'big')}<div><b>ระบบหลังบ้านของคุณ</b><span>เก็บ Key (inbox:read) · มอนิเตอร์แชท</span></div><span class="badge haskey" ${at(1, 0.8, 'pop')}>${ico('lock')}Key</span></div>`,

  b3: `
    ${head('b3', '1', 'เตรียม', 'ต้องมี 3 อย่าง')}
    <div class="stack" style="top:390px">
      <div class="card" ${at(0, 0.3)}>
        <div class="card-h">${ico('bot', 'big')}<div><b>Agent ใน LangMind</b><span>เปิดใช้งานช่องทาง LINE</span></div></div>
        <div class="chips"><span class="chip">${ico('chat')}LINE Channel</span><span class="chip">${ico('check')}Webhook พร้อมใช้งาน</span></div>
        <div class="setting" ${at(0, 1.0)}>
          <span class="setting-l">แท็บช่องทาง → <b>LINE Official Account</b></span>
          <span class="switch" data-toggle="0" data-toggle-at="1.2"><i></i></span>
          <span class="badge pub" ${at(0, 1.6, 'pop')}>เชื่อมต่อสำเร็จ ✓</span>
        </div>
      </div>
      <div class="card" ${at(1, 0.1)}>
        <div class="card-h">${ico('key', 'big')}<div><b>API Key</b><span class="mono">lmpat_••••••••</span></div></div>
        <div class="chips"><span class="chip mono" ${at(1, 0.8, 'pop')}>inbox:read (อ่าน Inbox)</span><span class="chip mono" ${at(1, 1.4, 'pop')}>chat:invoke (ส่งแชทผ่าน API)</span></div>
        <div class="warn" ${at(1, 2.0)}>API Key ใช้สิทธิ์ <code>inbox:read</code> อ่านได้เท่านั้น ปลอดภัยต่อระบบ</div>
      </div>
      <div class="card" ${at(2, 0.1)}>
        <div class="card-h">${ico('server', 'big')}<div><b>ระบบหลังบ้าน (Server)</b><span>เก็บ Key ปลอดภัย · เรียก API แทน client</span></div></div>
      </div>
    </div>`,

  b4: `
    ${head('b4', '2', 'เชื่อม', 'ครั้งที่ 1 · รายการเธรด')}
    ${minimap(1, 'ดึงเธรด')}
    ${panel({
      input: `<div class="chip in-chip">${ico('chat')}<span><b>?channel=line&amp;limit=25</b> · กรองเฉพาะ LINE</span></div>`,
      path: '/api/agents/{agent_id}/inbox/threads?channel=line', scope: 'inbox:read',
      lines: lnx(`Authorization: Bearer ${v('$LM_TOKEN')}`, 0, 1.0)
        + lnx(`Query: ${v('channel=line')}, ${v('page=1')}, ${v('limit=25')}`, 0, 1.3),
      foot: 'ดึงชื่อ (display_name) และรูปโปรไฟล์สดจาก LINE อัตโนมัติ',
      output: {
        seg: 1, at: 0.3,
        html: `<div class="chip out-chip json">{ ${k('"items"')}: [{ ${k('"display_name"')}: ${v('"คุณสมชาย"')}, ${k('"channel"')}: ${v('"line"')}, ${k('"message_count"')}: ${v('6')} }],<br>
<div class="ln hl"><span class="mark" data-mark="2" data-mark-at="0.2"></span>&nbsp;&nbsp;${k('"channel_counts"')}: { ${k('"line"')}: ${v('1')}, ${k('"web"')}: ${v('0')} }</div>}<em>คืน channel_counts รวมทุกช่องทาง ทำ badge ได้ทันที</em></div>`
      },
    })}
    <img class="robot" src="assets/05-point-up.png" width="425" height="503" alt="" style="left:820px;top:1080px;width:190px" ${at(2, 0.2)}>`,

  b5: `
    ${head('b5', '2', 'เชื่อม', 'ครั้งที่ 2 · สถานะรับสาย')}
    ${minimap(2, 'Handover')}
    ${panel({
      input: `<div class="chip in-chip">${ico('user')}<span><b>เธรดคุณสมชาย</b> · conversation_id: c_9X1...</span></div>`,
      path: '/api/agents/{agent_id}/inbox/threads/{cid}/handover', scope: 'inbox:read',
      lines: lnx(`Authorization: Bearer ${v('$LM_TOKEN')}`, 0, 1.0)
        + lnx(`${k('cid')}: ${v('"c_9X17kL4..."')}`, 0, 1.3),
      foot: 'active: true = มีแอดมินคุมสายอยู่ (AI จะหยุดตอบอัตโนมัติ)',
      output: {
        seg: 1, at: 0.3,
        html: `<div class="chip out-chip json">{ <span class="mark" data-mark="1" data-mark-at="0.2"></span>${k('"active"')}: ${v('true')}, ${k('"expires_in_sec"')}: ${v('1420')} }<div class="ln hl" style="margin-top:6px"><em>✓ แอดมินกำลังคุยแทน AI อยู่ (เหลือ 1,420 วินาที)</em></div></div>`
      },
    })}
    <img class="robot" src="assets/12-clipboard.png" width="445" height="503" alt="" style="left:820px;top:1080px;width:190px" ${at(2, 0.2)}>`,

  b6: `
    ${head('b6', '2', 'เชื่อม', 'ครั้งที่ 3 · Export ไฟล์')}
    ${minimap(3, 'Export')}
    ${panel({
      input: `<div class="chip in-chip">${ico('download')}<span><b>format=xlsx &amp; channel=line</b></span></div>`,
      path: '/api/agents/{agent_id}/inbox/export?format=xlsx&channel=line', scope: 'inbox:read',
      lines: lnx(`Authorization: Bearer ${v('$LM_TOKEN')}`, 0, 1.0)
        + lnx(`Accept: ${v('application/vnd.openxmlformats-officedocument...')}`, 0, 1.3),
      foot: 'คืนไฟล์ไบนารีโดยตรง สูงสุด 20,000 แถวต่อครั้ง',
      output: {
        seg: 1, at: 0.3,
        html: `<div class="chip out-chip" style="border-color:#1E7578;background:#eef6f4;display:flex;align-items:center;gap:16px">${ico('file')}<div><b>inbox-export.xlsx</b><span style="display:block;font-size:28px;color:#4e6b5e">ไฟล์ไบนารี Excel สด · สูงสุด 20,000 แถว</span></div><span class="badge pub" style="background:#1E7578;margin-left:auto">ดาวน์โหลดสำเร็จ ✓</span></div>`
      },
    })}`,

  b7: `
    ${head('b7', '3', 'ใช้ผล', 'ขอบเขตและความปลอดภัย')}
    <div class="stack" style="top:390px">
      <div class="use" ${at(0, 0.3, 'left')}>${ico('chat', 'big')}<div><b>มอนิเตอร์แชทหลังบ้าน</b><span>แสดงรายการเธรด LINE พร้อมรูปโปรไฟล์และ badge จำนวนแยกช่องทาง</span></div></div>
      <div class="use" ${at(1, 0.1, 'left')}>${ico('file', 'big')}<div><b>อ่านข้อความในเธรด</b><span>เรียก <code>GET .../inbox/threads/{cid}/messages</code> (โครงสร้างเดียวกับ Chat API)</span></div></div>
      <div class="use" ${at(2, 0.1, 'left')}>${ico('shield', 'big')}<div><b>สิทธิ์ API Key ปลอดภัย</b><span>สิทธิ์ <code>inbox:read</code> อ่านข้อมูลและ export ได้เท่านั้น</span></div></div>
    </div>
    <div class="tip" style="top:980px" ${at(2, 0.8, 'left')}>
      <b>ข้อควรจำสำคัญ:</b><br>
      การตอบกลับลูกค้า (<code>/reply</code>) หรือเริ่มและจบ handover<br>
      <b>ต้องล็อกอินทำผ่านหน้าเว็บเท่านั้น</b> เพื่อความปลอดภัย
    </div>`,

  b8: `
    ${head('b8', '', 'สรุป', 'เตรียม → เชื่อม → ใช้ผล')}
    <div class="stack" style="top:390px">
      ${[
        ['1', 'เตรียม', '#38815A', ['Agent เปิด LINE', 'API Key (inbox:read)', 'ระบบหลังบ้าน']],
        ['2', 'เชื่อม', '#8d732c', ['threads', '→', 'handover', '→', 'export']],
        ['3', 'ใช้ผล', '#1E7578', ['มอนิเตอร์แชท', 'เช็กแอดมิน', 'ดาวน์โหลดรายงาน']],
      ].map(([n, t, c, items], i) => `
        <div class="recap" style="--c:${c}" ${at(i, 0.1)}>
          <span class="recap-t"><b>${n}</b>${t}</span>
          <div class="chips">${items.map((x, j) => x === '→' ? `<i class="arr" ${at(i, 0.4 + j * 0.25)}>→</i>` : `<span class="chip" ${at(i, 0.4 + j * 0.25, 'pop')}>${x}</span>`).join('')}</div>
        </div>`).join('')}
    </div>
    <img class="robot" src="assets/10-thumbs-up.png" width="465" height="503" alt="" style="left:410px;top:1180px;width:260px" ${at(2, 1.0)}>`,

  b9: `
    <div class="sponsor">
      <div class="sp-by" ${at(0, 0.2)}>สนับสนุนโดย</div>
      <img class="sp-logo" src="assets/langmind-logo.png" width="689" height="606" alt="LangMind" ${at(0, 0.4, 'pop')}>
      <div class="sp-url" ${at(1, 0.2, 'pop')}>langmind.in.th</div>
      <div class="chips sp-chips" ${at(1, 0.8)}><span class="chip">Inbox API</span><span class="chip">LINE Channel</span><span class="chip">Handover</span><span class="chip">Export</span></div>
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
<title>EP10 · Inbox API &amp; LINE Channel</title>
<link rel="stylesheet" href="style.css">
<script src="assets/gsap.min.js"></script>
</head>
<body>
<main id="film" data-composition-id="ep10-inbox-line-channel" data-width="1080" data-height="1920" data-fps="${cfg.fps}" data-duration="${duration}">
  <div class="kicker">EP10 &nbsp;/&nbsp; INBOX API</div>
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
fs.writeFileSync(path.join(root, 'VOICE-SCRIPT.md'), `# EP10 — บทสำหรับสร้างเสียง (Inbox API & LINE Channel)\n\nเมื่อพร้อมสร้างเสียง ให้ใช้บทนี้สร้างไฟล์ wav/mp3 ใส่ใน \`assets/voice/\` แล้วรัน \`node build.mjs\`\n\n${vo}`);
console.log(`${beats.length} beats, ${beats.reduce((n, b) => n + b.segments.length, 0)} captions, ${duration.toFixed(2)} s, timing from ${usedVoice ? `${usedVoice} voice file(s), ${exactBeats} with exact caption cuts` : 'estimated reading time (no voice yet)'}`);

// EP04 sample builder: timing.json (+ optional voice files) -> index.html
// Run from this folder: node build.mjs
// With voice files present (paths in timing.json), every beat/caption is timed from the
// real audio length; without them, durations are estimated from the narration length.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const cfg = JSON.parse(fs.readFileSync(path.join(root, 'timing.json'), 'utf8'));
const esc = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const fr = t => Math.round(t * cfg.fps) / cfg.fps;   // snap to frame
const len = s => [...s.replace(/\s+/g, '')].length;

function audioSeconds(rel) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) return null;
  const out = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p]).toString().trim();
  return Number(out);
}

let t = cfg.lead_in;
let usedVoice = 0;
const beats = cfg.beats.map(b => {
  const audio = audioSeconds(b.voice);
  const est = b.segments.reduce((n, s) => n + len(s.say) / cfg.chars_per_second + 0.35, 0);
  const dur = audio ?? est;
  if (audio) usedVoice++;
  const total = b.segments.reduce((n, s) => n + len(s.say), 0);
  let st = t;
  const segments = b.segments.map(s => {
    const d = dur * len(s.say) / total;
    const seg = { ...s, start: fr(st), duration: fr(d) };
    st += d;
    return seg;
  });
  const beat = { id: b.id, voice: audio ? b.voice : null, start: fr(t), duration: fr(dur), segments };
  t += dur + cfg.beat_gap;
  return beat;
});
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
    input: `<div class="chip in-chip">${mic}<span><b>order.wav</b> · เสียงลูกค้าจากไมค์</span></div>`,
    method: 'POST', path: '/api/v1/agents/{id}/voice/transcribe', scope: 'voice:invoke',
    lines: [
      line(`Authorization: Bearer ${v('$LM_TOKEN')}`),
      line(`-F ${v('audio=@order.wav;type=audio/wav')}`),
      line(`-F ${v('language=th')}`),
    ],
    foot: 'ไฟล์เสียงไม่เกิน 4 MB · wav, mp3, webm, ogg, m4a',
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
    output: `<div class="chip out-chip json">{ ${k('"answer"')}: ${v('"รับอเมริกาโน่เย็น 1 แก้วครับ ทั้งหมด 65 บาท<br>&nbsp;&nbsp;&nbsp;รับหวานกี่เปอร์เซ็นต์ดีครับ?"')},<div class="ln hl2">&nbsp;&nbsp;<span class="mark"></span>${k('"conversation_id"')}: ${v('"c_7Q2…"')} }</div><em>คำตอบตัวอย่าง (ภาพจำลอง)</em></div>`,
  },
  b05: {
    input: `<div class="chip in-chip">${txt}<span>“รับอเมริกาโน่เย็น 1 แก้วครับ ทั้งหมด 65 บาท…”</span></div>`,
    method: 'POST', path: '/api/v1/agents/{id}/voice/speech', scope: 'voice:invoke',
    lines: [
      line(`${k('"text"')}: ${v('"รับอเมริกาโน่เย็น 1 แก้วครับ ทั้งหมด…"')},`),
      line(`${k('"format"')}: ${v('"auto"')}`),
    ],
    foot: 'ข้อความไม่เกิน 4,000 ตัวอักษรต่อครั้ง',
    output: `<div class="chip out-chip audio">${spk}<span>Content-Type: <b>audio/mpeg</b> หรือ <b>audio/wav</b></span>${bars(14, 'mini')}</div>`,
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
  b03: ['1', 'ฟัง', 'ถอดเสียงเป็นข้อความ'],
  b04: ['2', 'คิด', 'ตอบแบบภาษาพูด'],
  b05: ['3', 'พูด', 'อ่านคำตอบออกเสียง'],
};

const captions = beats.flatMap(b => b.segments.map((s, i) =>
  `<div id="cap-${b.id}-${i}" class="clip caption" data-start="${s.start}" data-duration="${s.duration}" data-track-index="8" data-layout-allow-caption-zone>${esc(s.cap).replaceAll('\n', '<br>')}</div>`)).join('\n');
const audio = beats.filter(b => b.voice).map(b =>
  `<audio id="vo-${b.id}" class="clip" data-start="${b.start}" data-duration="${b.duration}" data-track-index="9" src="${b.voice}"></audio>`).join('\n');

const html = `<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8">
<title>EP04 · B03–B05 · Voice API Sample v2</title>
<link rel="stylesheet" href="style.css">
<script src="assets/gsap.min.js"></script>
</head>
<body>
<main id="film" data-composition-id="ep04-voice-sample" data-width="1080" data-height="1920" data-fps="${cfg.fps}" data-duration="${duration}">
  <div class="kicker">EP04 &nbsp;/&nbsp; VOICE API</div>
  <div class="note">ภาพจำลอง</div>

  <section id="stage" class="clip" data-start="0" data-duration="${duration}" data-track-index="1">
    ${Object.entries(headings).map(([id, [n, verb, rest]]) => `<h1 id="h-${id}" class="heading"><span class="num">${n}</span>${verb}<small>${rest}</small></h1>`).join('\n    ')}
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
fs.writeFileSync(path.join(root, 'VOICE-SCRIPT.md'), `# EP04 B03–B05 — บทสำหรับสร้างเสียง\n\nอ่านต่อเนื่องเป็นย่อหน้าเดียวต่อ beat แล้วบันทึกเป็นไฟล์ตาม path ที่ระบุ จากนั้นรัน \`node build.mjs\`\n\n${vo}`);
console.log(`${beats.length} beats, ${beats.reduce((n, b) => n + b.segments.length, 0)} captions, ${duration.toFixed(2)} s, timing from ${usedVoice ? `${usedVoice} voice file(s)` : 'estimated reading time (no voice yet)'}`);

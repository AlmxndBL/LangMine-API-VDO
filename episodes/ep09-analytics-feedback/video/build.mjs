// EP09 video builder (Analytics & Feedback API): timing.json -> index.html + VOICE-SCRIPT.md
// Run from this folder: node build.mjs
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
    return null;
  }
}

function resolveVoiceRel(rel) {
  let p = path.join(root, rel);
  if (fs.existsSync(p)) return rel;
  const alt = rel.endsWith('.wav') ? rel.replace(/\.wav$/, '.mp3') : rel.replace(/\.mp3$/, '.wav');
  if (fs.existsSync(path.join(root, alt))) return alt;
  return null;
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
  let spanStart = 0, spanEnd = dur;
  const cuts = [0];
  let acc = 0;
  b.segments.slice(0, -1).forEach(s => {
    acc += len(s.say);
    let c = spanStart + (spanEnd - spanStart) * acc / total;
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
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  thumbsUp: '<path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>',
  chart: '<path d="M18 20V10M12 20V4M6 20v-6"/>',
};
const ico = (n, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24">${I[n] || I.chat}</svg>`;
const at = (k, d = 0.1, anim = 'up') => `data-in="${k}" data-at="${d}" data-anim="${anim}"`;
const vArrow = (h, attrs = '', flip = false) =>
  `<svg class="varrow${flip ? ' up' : ''}" ${attrs} viewBox="0 0 60 ${h}" style="height:${h}px"><path pathLength="1" d="M30 6 V${h - 14} M14 ${h - 28} L30 ${h - 10} L46 ${h - 28}"/><circle class="dot" cx="30" cy="10" r="7" data-y0="10" data-y1="${h - 22}"/></svg>`;
const device = (id, w, h) => `
  <div class="device" id="${id}" style="width:${w + 16}px">
    <div class="screen" style="width:${w}px;height:${h}px">
      <img src="assets/app-chat-feedback.jpg" width="1440" height="1800" alt="หน้าจอแชทลูกค้าพร้อมปุ่มให้คะแนน (ภาพจำลอง)" data-layout-allow-overflow style="width:${w}px">
      <img class="img-a" src="assets/app-analytics-dashboard.jpg" width="1440" height="1800" alt="หน้าจอ Dashboard สรุปสถิติและต้นทุน (ภาพจำลอง)" data-layout-allow-overflow style="width:${w}px">
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
    <span class="mm-node">${ico('phone')}หน้าแชท</span>
    <i class="mm-link"></i>
    <span class="mm-node srv">${ico('server')}หลังบ้าน${ico('lock', 'sm')}</span>
    <span class="mm-call">${n} · ${verb}</span>
    <span class="mm-node lm"><img src="assets/langmind-logo.png" width="689" height="606" alt="">LangMind</span>
  </div>`;

// live API panel: input → endpoint card → output
const panel = ({ n, input, method = 'POST', path: p, scope, lines, foot, output }) => `
  <div class="panel">
    <div class="slot-in" ${at(0, 0.2)}>${input}</div>
    ${vArrow(60, at(0, 0.6))}
    <div class="code" ${at(0, 0.9)}>
      <div class="code-head"><span class="method">${method}</span><span class="scope">สิทธิ์ ${scope}</span></div>
      <div class="code-path">${p}</div>
      <div class="code-body">${lines}</div>
      <div class="code-foot">${foot}</div>
    </div>
    ${vArrow(60, at(output.seg, output.at - 0.3))}
    <div class="slot-out" ${at(output.seg, output.at)}>${output.html}</div>
  </div>`;

const scenes = {
  b1: `
    ${head('b1', '', 'วัดผลแชท AI', 'คุมงบ &amp; คุณภาพยังไง?')}
    <div class="place" style="left:242px;top:370px">${device('dev-b1', 580, 652)}</div>
    <img class="robot" src="assets/01-question.png" width="445" height="503" alt="" style="left:70px;top:1060px;width:180px" ${at(1, 0.2, 'pop')}>
    <div class="tip" style="left:270px;top:1090px;font-size:32px" ${at(1, 0.4, 'left')}><b>เปิดใช้แชท AI จริงแล้ว</b><br>คนใช้กี่คน · เสียค่า Token เท่าไหร่?</div>
    <div class="qrow" style="top:1290px">
      <span class="qchip" ${at(2, 0.4, 'pop')}>เตรียมอะไร?</span>
      <span class="qchip" ${at(2, 1.0, 'pop')}>เชื่อมตรงไหน?</span>
      <span class="qchip" ${at(2, 1.6, 'pop')}>ใช้ผลยังไง?</span>
    </div>`,

  b2: `
    ${head('b2', '', 'ภาพรวม', '3 ส่วน · 3 จังหวะ')}
    <div class="group" data-out="1" data-out-at="0">
      <div class="node" style="top:430px" ${at(0, 0.1)}>${ico('phone', 'big')}<div><b>หน้าแชทของลูกค้า</b><span class="alias" ${at(0, 2.0, 'left')}>= ส่งคำถาม + กดถูกใจ</span></div></div>
      <div class="lane" style="top:640px">
        <div class="lane-l" ${at(0, 0.6, 'left')}><b>แชท / ประเมิน</b><span ${at(0, 2.4)}>ส่ง user_id</span></div>
        ${vArrow(250, at(0, 0.5))}
        ${vArrow(250, at(0, 1.2), true)}
        <div class="lane-r" ${at(0, 1.3)}><b>รายงานสถิติ</b><span ${at(0, 2.8)}>Dashboard</span></div>
      </div>
      <div class="node lm" style="top:910px" ${at(0, 0.9)}><img src="assets/langmind-logo.png" width="689" height="606" alt="LangMind"><div><b>LangMind Analytics API</b><span class="alias" ${at(0, 2.2, 'left')}>= รวบรวมสถิติ &amp; ต้นทุน</span></div></div>
    </div>
    <div class="node wide" style="top:400px" ${at(1, 0.3)}>${ico('phone', 'big')}<div><b>หน้าแชทของลูกค้า</b><span>ส่ง user_id · กดปุ่ม 👍/👎</span></div></div>
    <div class="lane small" style="top:600px">
      <div class="lane-l" ${at(1, 0.7, 'left')}><b>คำขอ &amp; คะแนน</b></div>
      ${vArrow(150, at(1, 0.6))}${vArrow(150, at(1, 0.9), true)}
      <div class="lane-r" ${at(1, 1.0)}><b>คำตอบ &amp; สถิติ</b></div>
    </div>
    <div class="node wide" style="top:760px" ${at(1, 1.1)}>${ico('server', 'big')}<div><b>ระบบหลังบ้านของคุณ</b><span>เก็บ API Key 2 สิทธิ์</span></div><span class="badge haskey" ${at(1, 1.6, 'pop')}>${ico('lock')}Key</span></div>
    <div class="lane small" style="top:960px">
      <div class="calls3" ${at(2, 0.2)}>
        <span class="step s1" ${at(2, 0.4, 'pop')}>1 ส่ง user_id</span>
        <span class="step s2" ${at(2, 0.8, 'pop')}>2 feedback</span>
        <span class="step s3" ${at(2, 1.2, 'pop')}>3 analytics</span>
      </div>
      ${vArrow(150, at(1, 1.7))}${vArrow(150, at(1, 2.0), true)}
      <div class="lane-r" ${at(1, 2.1)}><b>สรุปต้นทุน</b></div>
    </div>
    <div class="node wide lm" style="top:1120px" ${at(1, 2.2)}><img src="assets/langmind-logo.png" width="689" height="606" alt="LangMind"><div><b>LangMind</b><span>Chat API · Feedback · Analytics</span></div></div>`,

  b3: `
    ${head('b3', '1', 'เตรียม', 'ต้องมี 3 อย่าง')}
    <div class="stack" style="top:410px">
      <div class="card" ${at(0, 0.4)}>
        <div class="card-h">${ico('user', 'big')}<div><b>user_id และ message_id</b><span class="mono">usr_cafe_01 · msg_01J8...</span></div></div>
        <div class="chips"><span class="chip mono" ${at(0, 1.2, 'pop')}>user_id</span><span class="chip mono" ${at(0, 1.6, 'pop')}>message_id</span></div>
        <div class="warn" ${at(1, 0.2)}>user_id ใช้นับผู้ใช้จริง · message_id ใช้ส่งคะแนนประเมิน</div>
      </div>
      <div class="card" ${at(2, 0.1)}>
        <div class="card-h">${ico('key', 'big')}<div><b>API Key (ต้องมี 2 สิทธิ์)</b><span class="mono">lmpat_••••••••</span></div></div>
        <div class="chips"><span class="chip mono" ${at(2, 0.8, 'pop')}>chat:invoke</span><span class="chip mono" ${at(2, 1.4, 'pop')}>analytics:read</span></div>
      </div>
      <div class="card" ${at(3, 0.1)}>
        <div class="card-h">${ico('server', 'big')}<div><b>ระบบหลังบ้าน (Backend Server)</b><span>เก็บ Key ปลอดภัย · เรียกดูสถิตินำมาแสดง Dashboard</span></div></div>
      </div>
    </div>`,

  b4: `
    ${head('b4', '2', 'เชื่อม', 'ครั้งที่ 1 · ส่ง user_id')}
    ${minimap(1, 'ส่ง user_id')}
    ${panel({
      input: `<div class="chip in-chip">${ico('user')}<span><b>user_id</b>: "usr_cafe_01"</span></div>`,
      method: 'POST',
      path: '/api/chat/message',
      scope: 'chat:invoke',
      lines: lnx(`${k('"query"')}: ${v('"ราคาสินค้า A เท่าไร"')},`, 0, 0.8)
        + lnx(`<span class="mark" data-mark="1" data-mark-at="0.2"></span>${k('"user_id"')}: ${v('"usr_cafe_01"')},`, 0, 1.1, 'hl')
        + lnx(`${k('"conversation_id"')}: ${v('null')}`, 0, 1.4),
      foot: 'ไม่ส่ง user_id = นับเป็นเจ้าของ Key คนเดียว · ส่ง = นับแยกคนตามจริง',
      output: {
        seg: 1, at: 0.2,
        html: `<div class="chip out-chip json">{ ${k('"answer"')}: ${v('"สินค้า A ราคา 590 บาทค่ะ"')},<br>
  &nbsp;&nbsp;${k('"message_id"')}: ${v('"msg_01J8..."')}, ${k('"conversation_id"')}: ${v('"c_01J8..."')} }</div><em data-layout-ignore style="font-size:28px">คำตอบพร้อม message_id (ภาพจำลอง)</em>`
      },
    })}`,

  b5: `
    ${head('b5', '2', 'เชื่อม', 'ครั้งที่ 2 · เก็บ feedback')}
    ${minimap(2, 'เก็บ feedback')}
    ${panel({
      input: `<div class="chip in-chip">${ico('thumbsUp')}<span>กด 👍 <b>ถูกใจ (rating: 1)</b></span></div>`,
      method: 'POST',
      path: '/api/chat/messages/{id}/feedback',
      scope: 'chat:invoke',
      lines: lnx(`POST /api/chat/messages/msg_01J8.../feedback`, 0, 0.8)
        + lnx(`<span class="mark" data-mark="1" data-mark-at="0.2"></span>${k('"rating"')}: ${v('1')},`, 0, 1.1, 'hl')
        + lnx(`${k('"comment"')}: ${v('"ตอบตรงประเด็นดี"')}`, 0, 1.4),
      foot: 'rating รับเฉพาะ 1 (ถูกใจ) หรือ -1 (ไม่ถูกใจ) ไม่ใช่สเกล 1-5',
      output: {
        seg: 1, at: 0.2,
        html: `<div class="chip out-chip json">{ ${k('"status"')}: ${v('"success"')}, ${k('"http_code"')}: ${v('204')} }</div><em data-layout-ignore style="font-size:28px">บันทึกคะแนนสำเร็จ (ภาพจำลอง)</em>`
      },
    })}`,

  b6: `
    ${head('b6', '2', 'เชื่อม', 'ครั้งที่ 3 · ดึงสถิติ')}
    ${minimap(3, 'ดึงสถิติ')}
    <div class="group" data-out="2" data-out-at="0">
    ${panel({
      input: `<div class="chip in-chip">${ico('chart')}<span><b>GET /api/analytics/agents/{id}</b></span></div>`,
      method: 'GET',
      path: '/api/analytics/agents/{id}?from=...&to=...',
      scope: 'analytics:read',
      lines: lnx(`Query: ${k('from')}=${v('2026-08-01')}&amp;${k('to')}=${v('2026-08-18')}`, 0, 0.8)
        + lnx(`Authorization: Bearer ${v('$LM_TOKEN')}`, 0, 1.1),
      foot: 'คืน summary, daily, models, channels (web/line), tools',
      output: {
        seg: 1, at: 0.2,
        html: `<div class="chip out-chip json">{ ${k('"conversations"')}: ${v('42')}, ${k('"users"')}: ${v('30')},<br>
  &nbsp;&nbsp;${k('"tokens"')}: ${v('50400')}, ${k('"cost_usd"')}: ${v('"1.2600"')},<br>
  &nbsp;&nbsp;${k('"feedback"')}: { ${k('"positive"')}: ${v('18')}, ${k('"negative"')}: ${v('1')} } }</div><em data-layout-ignore style="font-size:28px">สถิติสรุป (ภาพจำลองจากคู่มือ)</em>`
      },
    })}
    </div>
    <div class="place" style="left:270px;top:440px" ${at(2, 0.2)}>${device('dev-b6', 524, 610)}</div>
    <img class="robot" src="assets/11-reading.png" width="448" height="503" alt="" style="left:60px;top:1110px;width:170px" ${at(2, 0.4, 'pop')}>
    <div class="tip" style="left:250px;top:1140px" ${at(2, 0.6, 'left')}><b>Dashboard สรุปงบ AI</b><br>คุมต้นทุน Token &amp; เช็กผลตอบรับแยกรายวัน</div>`,

  b7: `
    ${head('b7', '3', 'ใช้ผล', 'สร้าง Dashboard คุมงบ AI')}
    <div class="stack" style="top:410px">
      <div class="use" ${at(0, 0.4, 'left')}>${ico('chart', 'big')}<div><b>คุมงบประมาณค่า Token</b><span>ดู total_tokens และ cost_usd รู้ทันทีเมื่อมีค่าใช้จ่ายผิดปกติ</span></div></div>
      <div class="use" ${at(1, 0.2, 'left')}>${ico('thumbsUp', 'big')}<div><b>ติดตามคุณภาพคำตอบ</b><span>ดู feedback_positive / negative เพื่อนำข้อคิดเห็นไปปรับปรุง</span></div></div>
      <div class="use" ${at(2, 0.2, 'left')}>${ico('user', 'big')}<div><b>วิเคราะห์ช่องทาง &amp; ผู้ใช้</b><span>แยกสถิติ Web / LINE และอัตราสำเร็จของโมเดล</span></div></div>
    </div>
    <img class="robot" src="assets/14-heart.png" width="480" height="503" alt="" style="left:60px;top:1130px;width:170px" ${at(2, 0.8, 'pop')}>
    <div class="tip" style="left:250px;top:1150px" ${at(2, 1.0, 'left')}>นำข้อมูลไปสร้าง <b>Dashboard ภายในองค์กร</b><br>ช่วยให้ทีมดูแลทั้งงบและประสบการณ์ผู้ใช้ได้พร้อมกัน</div>`,

  b8: `
    ${head('b8', '', 'สรุป', 'เตรียม → เชื่อม 3 จังหวะ → ใช้ผล')}
    <div class="stack" style="top:410px">
      ${[
        ['1', 'เตรียม', '#38815A', ['user_id + message_id', 'Key (chat + analytics)', 'ระบบหลังบ้าน']],
        ['2', 'เชื่อม', '#8d732c', ['1 ส่ง user_id', '→', '2 เก็บ feedback (1/-1)', '→', '3 ดึง analytics']],
        ['3', 'ใช้ผล', '#1E7578', ['คุมงบ Token (cost_usd)', 'พัฒนาคุณภาพคำตอบ', 'Dashboard สรุปผล']],
      ].map(([n, t, c, items], i) => `
        <div class="recap" style="--c:${c}" ${at(i, 0.1)}>
          <span class="recap-t"><b>${n}</b>${t}</span>
          <div class="chips">${items.map((x, j) => x === '→' ? `<i class="arr" ${at(i, 0.4 + j * 0.2)}>→</i>` : `<span class="chip" ${at(i, 0.4 + j * 0.2, 'pop')}>${x}</span>`).join('')}</div>
        </div>`).join('')}
    </div>
    <img class="robot" src="assets/10-thumbs-up.png" width="425" height="503" alt="" style="left:410px;top:1180px;width:260px" ${at(2, 1.0)}>`,

  b9: `
    <div class="sponsor">
      <div class="sp-by" ${at(0, 0.2)}>สนับสนุนโดย</div>
      <img class="sp-logo" src="assets/langmind-logo.png" width="689" height="606" alt="LangMind" ${at(0, 0.5, 'pop')}>
      <div class="sp-url" ${at(1, 0.3, 'pop')}>langmind.in.th</div>
      <div class="chips sp-chips" ${at(1, 0.8)}><span class="chip">Agent</span><span class="chip">Analytics API</span><span class="chip">Feedback API</span></div>
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
<title>EP09 · Analytics & Feedback API</title>
<link rel="stylesheet" href="style.css">
<script src="assets/gsap.min.js"></script>
</head>
<body>
<main id="film" data-composition-id="ep09-analytics-feedback" data-width="1080" data-height="1920" data-fps="${cfg.fps}" data-duration="${duration}">
  <div class="kicker">EP09 &nbsp;/&nbsp; ANALYTICS &amp; FEEDBACK</div>
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
fs.writeFileSync(path.join(root, 'VOICE-SCRIPT.md'), `# EP09 — บทสำหรับสร้างเสียง\n\n${vo}`);
console.log(`${beats.length} beats, ${beats.reduce((n, b) => n + b.segments.length, 0)} captions, ${duration.toFixed(2)} s, timing from ${usedVoice ? `${usedVoice} voice file(s), ${exactBeats} with exact caption cuts` : 'estimated reading time (no voice yet)'}`);

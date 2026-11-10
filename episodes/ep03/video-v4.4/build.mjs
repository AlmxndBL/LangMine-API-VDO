// EP03 video-v4.4 builder (Chat API — 9-Beat Blueprint & EP04 Motion Engine)
// Timing is driven by timing.json (+ optional voice files) -> index.html + VOICE-SCRIPT.md
// Run from this directory: node build.mjs

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
  if (!rel) return null;
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
  if (!rel) return null;
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

  const cuts = [0];
  let acc = 0;
  b.segments.slice(0, -1).forEach(s => {
    acc += len(s.say);
    cuts.push(dur * acc / total);
  });
  cuts.push(dur);

  const segments = b.segments.map((s, i) => ({ ...s, start: fr(t + cuts[i]), duration: fr(cuts[i + 1] - cuts[i]) }));
  const resolvedVoice = resolveVoiceRel(b.voice);
  const beat = { id: b.id, voice: audio ? resolvedVoice : null, start: fr(t), duration: fr(dur), segments };
  t += dur + cfg.beat_gap + (b.hold || 0);
  return beat;
});

const duration = fr(t - cfg.beat_gap + cfg.tail);

// ---------- markup helpers ----------
const I = {
  chat: '<path d="M4 5.5h16v10H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/>',
  phone: '<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>',
  server: '<rect x="3.5" y="4" width="17" height="6.5" rx="1.5"/><rect x="3.5" y="13.5" width="17" height="6.5" rx="1.5"/><path d="M7 7.2h.01M7 16.7h.01M11 7.2h6M11 16.7h6"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l8.5-8.5M16 7l2.5 2.5M14 9l2 2"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
  bot: '<rect x="4" y="7" width="16" height="12" rx="3"/><path d="M12 3.5V7M9 12.5h.01M15 12.5h.01M9.5 16h5"/>',
  book: '<path d="M4 5.5A2 2 0 0 1 6 3.5h12v15H6a2 2 0 0 0-2 2z"/><path d="M4 20.5V5.5M8 8h7M8 11.5h7"/>',
  play: '<circle cx="12" cy="12" r="9"/><path class="fill" d="M10 8.5l5.5 3.5-5.5 3.5z"/>',
  loop: '<path d="M4 12a8 8 0 0 1 13.7-5.6L20 9M20 4.5V9h-4.5M20 12a8 8 0 0 1-13.7 5.6L4 15M4 19.5V15h4.5"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  check: '<path d="M5 13l4 4L19 7"/>',
};

const ico = (n, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24">${I[n] || ''}</svg>`;
const at = (k, d = 0.1, anim = 'up') => `data-in="${k}" data-at="${d}" data-anim="${anim}"`;
const vArrow = (h, attrs = '', flip = false) =>
  `<svg class="varrow${flip ? ' up' : ''}" ${attrs} viewBox="0 0 60 ${h}" style="height:${h}px"><path pathLength="1" d="M30 6 V${h - 14} M14 ${h - 28} L30 ${h - 10} L46 ${h - 28}"/><circle class="dot" cx="30" cy="10" r="7" data-y0="10" data-y1="${h - 22}"/></svg>`;
const device = (id, w, h, imgQ, imgA) => `
  <div class="device" id="${id}" style="width:${w + 16}px">
    <div class="screen" style="width:${w}px;height:${h}px">
      <img src="${imgQ}" style="width:${w}px;height:${h}px;display:block" alt="ภาพจำลองหน้าจอแชต">
      ${imgA ? `<img class="img-a" src="${imgA}" style="width:${w}px;height:${h}px;display:block" alt="ภาพจำลองคำตอบ">` : ''}
    </div>
  </div>`;
const head = (id, n, verb, rest) => `<h1 class="heading">${n ? `<span class="num">${n}</span>` : ''}${verb}<small>${rest}</small></h1>`;

const k = s => `<span class="k">${s}</span>`;
const v = s => `<span class="v">${s}</span>`;
const lnx = (html, seg, d, cls = '') => `<div class="ln ${cls}" ${at(seg, d, 'left')}>${html}</div>`;
const COLORS = { 1: '#38815A', 2: '#8d732c', 3: '#1E7578' };

// Overview strip shown during the three calls
const minimap = (n, verb) => `
  <div class="minimap" style="--c:${COLORS[n]}">
    <span class="mm-node">${ico('phone')}แอป</span>
    <i class="mm-link"></i>
    <span class="mm-node srv">${ico('server')}หลังบ้าน${ico('lock', 'sm')}</span>
    <span class="mm-call">${n} · ${verb}</span>
    <span class="mm-node lm"><img src="assets/langmind-logo.png" width="689" height="606" alt="">LangMind</span>
  </div>`;

// Live API panel: input -> endpoint card -> output
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
    ${head('b1', '', 'แอปที่มีแชตบอต AI', 'ทำได้ยังไง?')}
    <div class="place" style="left:232px;top:380px">${device('dev-b1', 600, 367, 'assets/app-chat-1.jpg', 'assets/app-chat-2.jpg')}</div>
    <div class="tip" style="left:110px;right:110px;top:800px;text-align:center" ${at(1, 0.3, 'up')}>
      <b>แชตบอตตอบช้า หรือจำเรื่องเดิมไม่ได้?</b><br>
      ต่อ Chat API ให้ตอบแบบสตรีมมิ่ง พิมพ์สดทีละคำ และจำบริบทคุยต่อได้ทันที
    </div>
    <div class="qrow" style="top:1000px">
      <span class="qchip" ${at(2, 0.4, 'pop')}>เตรียมอะไร?</span>
      <span class="qchip" ${at(2, 1.0, 'pop')}>เชื่อมตรงไหน?</span>
      <span class="qchip" ${at(2, 1.6, 'pop')}>ใช้ผลยังไง?</span>
    </div>
    <img class="robot" src="assets/01-question.png" width="445" height="503" alt="" style="left:440px;top:1180px;width:200px" ${at(2, 1.8, 'pop')}>`,

  b2: `
    ${head('b2', '', 'ภาพรวมทั้งหมด', 'Chat API ทำงานร่วมกับแอปยังไง')}
    <div class="group" data-out="1" data-out-at="0">
      <div class="node" style="top:430px" ${at(0, 0.1)}>${ico('phone', 'big')}<div><b>แอปของคุณ</b><span class="alias" ${at(0, 2.6, 'left')}>= หน้าร้าน (รับคำถามลูกค้า)</span></div></div>
      <div class="lane" style="top:640px">
        <div class="lane-l" ${at(0, 0.7, 'left')}><b>ส่งคำถาม</b><span ${at(0, 3.0)}>ผ่านหลังบ้าน</span></div>
        ${vArrow(250, at(0, 0.6))}
        ${vArrow(250, at(0, 1.4), true)}
        <div class="lane-r" ${at(0, 1.5)}><b>สตรีมตอบ</b><span ${at(0, 3.4)}>พิมพ์สดทีละคำ</span></div>
      </div>
      <div class="node lm" style="top:910px" ${at(0, 1.0)}><img src="assets/langmind-logo.png" width="689" height="606" alt="LangMind"><div><b>LangMind Chat API</b><span class="alias" ${at(0, 2.8, 'left')}>= สมอง AI</span></div></div>
    </div>
    <div class="node wide" style="top:400px" ${at(1, 0.4)}>${ico('phone', 'big')}<div><b>แอปพลิเคชันของคุณ (Client)</b><span>แสดงหน้าแชต · ส่งคำถามผู้ใช้</span></div></div>
    <div class="lane small" style="top:600px">
      <div class="lane-l" ${at(1, 0.9, 'left')}><b>คำถามผู้ใช้</b></div>
      ${vArrow(150, at(1, 0.8))}${vArrow(150, at(1, 1.1), true)}
      <div class="lane-r" ${at(1, 1.2)}><b>สตรีมคำตอบ</b></div>
    </div>
    <div class="node wide" style="top:760px" ${at(1, 1.2)}>${ico('server', 'big')}<div><b>เซิร์ฟเวอร์หลังบ้าน (Backend Server)</b><span>เก็บ API Key ปลอดภัย · เรียก Chat API</span></div><span class="badge haskey" ${at(1, 1.8, 'pop')}>${ico('lock')}Key</span></div>
    <div class="lane small" style="top:960px">
      <div class="calls3" ${at(2, 0.2)}><span class="step s1" ${at(2, 0.5, 'pop')}>1 เริ่มห้อง</span><span class="step s2" ${at(2, 0.9, 'pop')}>2 สตรีมสด</span><span class="step s3" ${at(2, 1.3, 'pop')}>3 ถามต่อ</span></div>
      ${vArrow(150, at(1, 1.9))}${vArrow(150, at(1, 2.2), true)}
      <div class="lane-r" ${at(1, 2.3)}><b>ประมวลผล</b></div>
    </div>
    <div class="node wide lm" style="top:1120px" ${at(1, 2.4)}><img src="assets/langmind-logo.png" width="689" height="606" alt="LangMind"><div><b>LangMind Chat API & Agent</b><span>ประมวลผลคำตอบ · สตรีมข้อความ Real-time</span></div></div>`,

  b3: `
    ${head('b3', '1', 'เตรียม', 'ต้องมี 3 อย่าง')}
    <div class="stack" style="top:410px">
      <div class="card" ${at(0, 0.4)}>
        <div class="card-h">${ico('bot', 'big')}<div><b>Agent ใน LangMind</b><span>ตั้งค่าผู้ช่วย AI และข้อมูลร้านค้าไว้</span></div><span class="badge haskey" ${at(0, 1.2, 'pop')}>ready ✓</span></div>
        <div class="chips"><span class="chip" ${at(0, 1.4, 'pop')}>${ico('book')}ข้อมูลสินค้า</span><span class="chip" ${at(0, 1.8, 'pop')}>${ico('book')}คำนวณส่วนลด</span></div>
      </div>
      <div class="card" ${at(1, 0.2)}>
        <div class="card-h">${ico('key', 'big')}<div><b>API Key (Personal Token)</b><span class="mono">lmpat_••••••••</span></div></div>
        <div class="chips"><span class="chip mono" ${at(1, 1.4, 'pop')}>chat:invoke</span><span class="chip mono" ${at(1, 2.0, 'pop')}>agents:read</span></div>
      </div>
      <div class="card" ${at(2, 0.2)}>
        <div class="card-h">${ico('server', 'big')}<div><b>เซิร์ฟเวอร์หลังบ้าน</b><span>เก็บ API Key ปลอดภัย · ห้ามใส่ในหน้าเว็บ</span></div><span class="badge nokey" ${at(2, 1.2, 'pop')}>ห้ามใส่ในเว็บ</span></div>
      </div>
    </div>
    <div class="warn" style="margin:24px 90px 0;font-size:29px;line-height:1.4" ${at(3, 0.2, 'left')}>
      <b>ข้อควรระวัง:</b> หากไม่ระบุ <code>agent_id</code> หรือ Agent ยังไม่พร้อมใช้งาน ระบบจะคืนรหัสข้อผิดพลาดทันที
    </div>`,

  b4: `
    ${head('b4', '2', 'เชื่อม', 'ครั้งที่ 1 · เริ่มห้องใหม่')}
    ${minimap(1, 'เริ่มห้องใหม่')}
    ${panel({
      n: 1,
      input: `<div class="chip in-chip">${ico('chat')}<span><b>คำถามแรก:</b> “สินค้าชิ้นนี้มีของพร้อมส่งไหมครับ?”</span></div>`,
      method: 'POST',
      path: '/api/chat/message',
      scope: 'chat:invoke',
      lines: lnx(`Authorization: Bearer <span class="v">$LM_TOKEN</span>`, 0, 1.2)
        + lnx(`${k('"agent_id"')}: <span class="v">"01J8XM9K…"</span>,`, 0, 1.4)
        + lnx(`${k('"query"')}: <span class="v">"สินค้าชิ้นนี้มีของพร้อมส่งไหมครับ"</span>,`, 0, 1.6)
        + lnx(`<span class="mark" data-mark="0" data-mark-at="2.2"></span>${k('"conversation_id"')}: <span class="v">null</span>`, 0, 1.8, 'hl'),
      foot: '💡 ส่ง conversation_id: null หมายถึงขอเปิดห้องแชตใหม่',
      output: {
        seg: 1,
        at: 0.4,
        html: `<div class="chip out-chip json">
          <b>รับ event แรกชื่อ message_start ทันที:</b><br>
          <code>data: { "event": "message_start", ${k('"conversation_id"')}: <span class="v">"conv_8892"</span> }</code>
          <em>» เก็บ รหัส conv_8892 นี้ไว้ใช้ส่งในคำถามถัดไป «</em>
        </div>`
      }
    })}`,

  b5: `
    ${head('b5', '2', 'เชื่อม', 'ครั้งที่ 2 · สตรีมคำตอบ')}
    ${minimap(2, 'สตรีมคำตอบ')}
    <div class="chat-row" style="top:470px">
      <div class="device" id="dev-b5" style="width:456px;flex:none" ${at(0, 0.2)}>
        <div class="screen" style="width:440px;height:269px">
          <img src="assets/app-chat-2.jpg" style="width:440px;height:269px;display:block" alt="แชตสตรีมคำตอบ">
        </div>
      </div>
      <div style="flex:1;display:flex;flex-direction:column;gap:16px" ${at(0, 0.5)}>
        <div class="code" style="padding:20px 24px">
          <div class="code-head"><span class="method">SSE Stream</span><span class="scope">Real-time Events</span></div>
          <div class="code-body" style="font-size:26px;line-height:1.6">
            <div class="ln" ${at(0, 0.8, 'left')}>data: { ${k('"event"')}: ${v('"message"')}, ${k('"answer"')}: ${v('"มีสินค้า..."')} }</div>
            <div class="ln" ${at(0, 1.2, 'left')}>data: { ${k('"event"')}: ${v('"message"')}, ${k('"answer"')}: ${v('"พร้อมส่งค่ะ"')} }</div>
            <div class="ln hl" ${at(0, 1.6, 'left')}><span class="mark" data-mark="0" data-mark-at="2.0"></span>data: { ${k('"event"')}: ${v('"message_end"')}, ${k('"usage"')}: { ... } }</div>
          </div>
          <div class="code-foot" style="font-size:25px">✓ ตัวหนังสือทยอยออกทันที ไม่ต้องรอทั้งประโยค</div>
        </div>
        <div class="tip" style="position:static;font-size:27px;padding:16px 20px" ${at(1, 0.3, 'up')}>
          <b>ทางเลือกสำหรับสคริปต์หลังบ้าน:</b><br>
          ใช้ <code>POST /api/chat/message/blocking</code> เพื่อรับ JSON ก้อนเดียวจบ
        </div>
      </div>
    </div>`,

  b6: `
    ${head('b6', '2', 'เชื่อม', 'ครั้งที่ 3 · ถามต่อในห้องเดิม')}
    ${minimap(3, 'ถามต่อในห้องเดิม')}
    <div class="chat-row" style="top:470px">
      <div class="device" id="dev-b6" style="width:456px;flex:none" ${at(0, 0.2)}>
        <div class="screen" style="width:440px;height:348px">
          <img src="assets/app-chat-3.jpg" style="width:440px;height:348px;display:block" alt="แชตถามต่อ">
        </div>
      </div>
      <div style="flex:1;display:flex;flex-direction:column;gap:16px" ${at(0, 0.5)}>
        <div class="code" style="padding:20px 24px">
          <div class="code-head"><span class="method">POST</span><span class="scope">/api/chat/message</span></div>
          <div class="code-body" style="font-size:26px;line-height:1.6">
            <div class="ln" ${at(0, 0.8, 'left')}>${k('"query"')}: <span class="v">"ถ้าสั่ง 2 ชิ้น มีส่วนลดไหม"</span>,</div>
            <div class="ln hl" ${at(0, 1.2, 'left')}><span class="mark" data-mark="0" data-mark-at="1.6"></span>${k('"conversation_id"')}: <span class="v">"conv_8892"</span></div>
          </div>
          <div class="code-foot" style="font-size:25px">✓ ใช้รหัสห้องเดิม เพื่อให้ AI ดึงประวัติที่คุยไว้มาคิดต่อ</div>
        </div>
        <div class="tip" style="position:static;font-size:27px;padding:16px 20px" ${at(1, 0.3, 'up')}>
          <b>ผลลัพธ์:</b> AI จำได้ทันทีว่าเป็นสินค้าชิ้นไหน<br>พร้อมคำนวณส่วนลดให้ต่อเนื่อง โดยที่ลูกค้าไม่ต้องถามซ้ำ
        </div>
      </div>
    </div>`,

  b7: `
    ${head('b7', '3', 'ใช้ผล', 'นำไปใช้ & ข้อควรระวัง')}
    <div class="stack" style="top:410px">
      <div class="use" ${at(0, 0.4, 'left')}>${ico('play', 'big')}<div><b>1. ส่ง user_id ปลายทาง</b><span>ส่งรหัสผู้ใช้ทุกครั้งเพื่อนับสถิติ Unique Users ได้อย่างแท้จริง</span></div></div>
      <div class="use" ${at(1, 0.1, 'left')}>${ico('x', 'big')}<div><b>2. สั่งยกเลิกสตรีมกะทันหัน</b><span>ใช้ POST /chat/messages/{id}/stop สั่งหยุดการพิมพ์ของ AI ได้ทันที</span></div></div>
      <div class="use" ${at(2, 0.1, 'left')}>${ico('chat', 'big')}<div><b>3. ดึงประวัติข้อความย้อนหลัง</b><span>ใช้ GET /chat/conversations/{id}/messages ดึงข้อความมาแสดงในแอป</span></div></div>
      <div class="use" ${at(2, 0.7, 'left')}>${ico('lock', 'big')}<div><b>4. เช็ก message_end & ปลอดภัย</b><span>รอตรวจ event message_end เสมอ และเก็บ API Key ฝั่ง Server เท่านั้น</span></div></div>
    </div>
    <img class="robot" src="assets/01-question.png" width="445" height="503" alt="" style="left:80px;top:1180px;width:180px" ${at(2, 1.2)}>
    <div class="tip" style="top:1210px;left:290px;right:90px" ${at(2, 1.4, 'left')}>
      <b>ความปลอดภัยสูงสุด:</b><br>
      เก็บ Personal Token ไว้ที่หลังบ้านเท่านั้น ห้ามฝังใน Frontend หรือแอปมือถือ
    </div>`,

  b8: `
    ${head('b8', '', 'สรุป', 'เตรียม → เชื่อม → ใช้ผล')}
    <div class="stack" style="top:410px">
      ${[
        ['1', 'เตรียม', '#38815A', ['Agent พร้อมใช้', 'API Key (chat:invoke)', 'เซิร์ฟเวอร์หลังบ้าน']],
        ['2', 'เชื่อม', '#8d732c', ['เริ่มห้อง (null)', '→', 'สตรีมสด (message)', '→', 'ถามต่อ ID เดิม']],
        ['3', 'ใช้ผล', '#1E7578', ['สลับ Blocking ได้', 'ส่ง user_id', 'ดึงประวัติย้อนหลัง']],
      ].map(([n, t, c, items], i) => `
        <div class="recap" style="--c:${c}" ${at(i, 0.1)}>
          <span class="recap-t"><b>${n}</b>${t}</span>
          <div class="chips">${items.map((x, j) => x === '→' ? `<i class="arr" ${at(i, 0.4 + j * 0.2)}>→</i>` : `<span class="chip" ${at(i, 0.4 + j * 0.2, 'pop')}>${x}</span>`).join('')}</div>
        </div>`).join('')}
    </div>
    <img class="robot" src="assets/04-open-arms.png" width="425" height="503" alt="" style="left:410px;top:1180px;width:260px" ${at(2, 1.4)}>`,

  b9: `
    <div class="sponsor">
      <div class="sp-by" ${at(0, 0.2)}>สนับสนุนโดย</div>
      <img class="sp-logo" src="assets/langmind-logo.png" width="689" height="606" alt="LangMind" ${at(0, 0.5, 'pop')}>
      <div class="sp-url" ${at(1, 0.3, 'pop')}>langmind.in.th</div>
      <div class="chips sp-chips" ${at(1, 1.0)}><span class="chip" style="font-size:38px;padding:8px 36px">Chat API</span></div>
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
<title>EP03 · Chat API · video-v4.4</title>
<link rel="stylesheet" href="style.css">
<script src="assets/gsap.min.js"></script>
</head>
<body>
<main id="film" data-composition-id="ep03-chat-v4.4" data-width="1080" data-height="1920" data-fps="${cfg.fps}" data-duration="${duration}">
  <div class="kicker">EP03 &nbsp;/&nbsp; CHAT API</div>
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
fs.writeFileSync(path.join(root, 'VOICE-SCRIPT.md'), `# EP03 video-v4.4 — บทสำหรับสร้างเสียง\n\n${vo}`);

console.log(`${beats.length} beats, ${beats.reduce((n, b) => n + b.segments.length, 0)} captions, ${duration.toFixed(2)} s, timing from ${usedVoice ? `${usedVoice} voice file(s), ${exactBeats} with exact caption cuts` : 'estimated reading time (silent draft)'}`);

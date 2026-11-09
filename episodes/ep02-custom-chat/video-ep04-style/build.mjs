// EP02 (r10 content + voice-r10 audio) in EP04 video-v3 style builder: timing.json -> index.html + VOICE-SCRIPT.md
// Run from this folder: node build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const cfg = JSON.parse(fs.readFileSync(path.join(root, 'timing.json'), 'utf8'));
const esc = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const fr = t => Math.round(t * cfg.fps) / cfg.fps;

const beats = cfg.beats.map(b => ({
  id: b.id,
  beat: b.beat,
  title: b.title,
  voice: b.voice,
  start: fr(b.start),
  duration: fr(b.duration),
  end: fr(b.end),
  length: fr(b.length),
  segments: b.segments.map(s => ({
    ...s,
    start: fr(s.start),
    duration: fr(s.duration),
  })),
}));
const duration = fr(cfg.total);

// ---------- markup helpers (same design language as EP04 video-v3) ----------
const I = {
  txt: '<path d="M4 6h16M4 11h16M4 16h10"/>',
  phone: '<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>',
  web: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 9h18M7 6.5h.01M10 6.5h.01"/>',
  server: '<rect x="3.5" y="4" width="17" height="6.5" rx="1.5"/><rect x="3.5" y="13.5" width="17" height="6.5" rx="1.5"/><path d="M7 7.2h.01M7 16.7h.01M11 7.2h6M11 16.7h6"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l8.5-8.5M16 7l2.5 2.5M14 9l2 2"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
  bot: '<rect x="4" y="7" width="16" height="12" rx="3"/><path d="M12 3.5V7M9 12.5h.01M15 12.5h.01M9.5 16h5"/>',
  book: '<path d="M4 5.5A2 2 0 0 1 6 3.5h12v15H6a2 2 0 0 0-2 2z"/><path d="M4 20.5V5.5M8 8h7M8 11.5h7"/>',
  play: '<circle cx="12" cy="12" r="9"/><path class="fill" d="M10 8.5l5.5 3.5-5.5 3.5z"/>',
  chat: '<path d="M4 5.5h16v10H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/>',
  loop: '<path d="M4 12a8 8 0 0 1 13.7-5.6L20 9M20 4.5V9h-4.5M20 12a8 8 0 0 1-13.7 5.6L4 15M4 19.5V15h4.5"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.8 2.8L16.5 9.5"/>',
  warn: '<path d="M12 3.5L2.5 20h19L12 3.5z"/><path d="M12 9.5v5M12 17.2h.01"/>',
};
const ico = (n, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24">${I[n]}</svg>`;
const at = (k, d = 0.1, anim = 'up') => `data-in="${k}" data-at="${d}" data-anim="${anim}"`;
const vArrow = (h, attrs = '', flip = false) =>
  `<svg class="varrow${flip ? ' up' : ''}" ${attrs} viewBox="0 0 60 ${h}" style="height:${h}px"><path pathLength="1" d="M30 6 V${h - 14} M14 ${h - 28} L30 ${h - 10} L46 ${h - 28}"/><circle class="dot" cx="30" cy="10" r="7" data-y0="10" data-y1="${h - 22}"/></svg>`;

// Chat screen frame cropping the white card from 916x1717 rasters (x:68..848, y:455..1573 -> 780x1118)
const chatDevice = (id, w, h, imgs) => {
  const scale = w / 780;
  const imgW = Math.round(916 * scale);
  const left = -Math.round(68 * scale);
  const top = -Math.round(455 * scale);
  return `
  <div class="device" id="${id}" style="width:${w + 16}px">
    <div class="screen" style="width:${w}px;height:${h}px">
      ${imgs.map((src, i) => `<img class="${i === 0 ? 'img-a' : i === 1 ? 'img-b' : 'img-c'}" src="assets/${src}" width="916" height="1717" alt="หน้าจอเว็บแชทตัวอย่าง (ภาพจำลอง)" data-layout-allow-overflow style="width:${imgW}px;left:${left}px;top:${top}px">`).join('')}
    </div>
  </div>`;
};

const srvTag = (topPx, attrs = '') =>
  `<div class="srv-tag" style="top:${topPx}px" ${attrs}>${ico('server')}<span>server · รหัสบทสนทนา / <code>conv_demo_01</code></span></div>`;

const head = (id, n, verb, rest) => `<h1 class="heading">${n ? `<span class="num">${n}</span>` : ''}${verb}<small>${rest}</small></h1>`;
const k = s => `<span class="k">${s}</span>`;
const v = s => `<span class="v">${s}</span>`;
const lnx = (html, seg, d, cls = '') => `<div class="ln ${cls}" ${at(seg, d, 'left')}>${html}</div>`;
const COLORS = { 1: '#38815A', 2: '#8d732c', 3: '#1E7578' };

const minimap = (n, verb) => `
  <div class="minimap" style="--c:${COLORS[n]}">
    <span class="mm-node">${ico('web')}หน้าเว็บ</span>
    <i class="mm-link"></i>
    <span class="mm-node srv">${ico('server')}Server${ico('lock', 'sm')}</span>
    <span class="mm-call">${n} · ${verb}</span>
    <span class="mm-node lm"><img src="assets/langmind-logo.png" width="689" height="606" alt="">LangMind</span>
  </div>`;

const panel = ({ input, method = 'POST', path: p, scope, lines, foot, output, outSeg = 1, outAt = 0.4 }) => `
  <div class="panel">
    <div class="slot-in" ${at(0, 0.2)}>${input}</div>
    ${vArrow(64, at(0, 0.6))}
    <div class="code" ${at(0, 0.9)}>
      <div class="code-head"><span class="method">${method}</span><span class="scope">${scope}</span></div>
      <div class="code-path">${p}</div>
      <div class="code-body">${lines}</div>
      <div class="code-foot">${foot}</div>
    </div>
    ${vArrow(64, at(outSeg, Math.max(0.1, outAt - 0.35)))}
    <div class="slot-out" ${at(outSeg, outAt)}>${output}</div>
  </div>`;

const scenes = {
  b01: `
    ${head('b01', '', 'พิมพ์ว่า “ขอสั้นลง”', 'แชทรู้ได้อย่างไร?')}
    <div class="place" style="left:252px;top:360px">${chatDevice('dev-b01', 560, 790, ['R01.png'])}</div>
    <div class="wave-label" style="top:1185px">
      <span id="wl-b01-a" ${at(0, 0.2)}>พิมพ์ว่า “ขอสั้นลง” แชทรู้ได้อย่างไรว่าหมายถึงอะไร?</span>
      <span id="wl-b01-b" ${at(2, 0.2)}>“ขอสั้นลง” เชื่อมกับเรื่องเดิมอย่างไร? (ลองทายก่อน!)</span>
    </div>
    <div class="qrow" style="top:1270px">
      <span class="qchip" ${at(1, 0.2, 'pop')}>1. ส่งเรื่องเดิมใหม่ทุกครั้ง?</span>
      <span class="qchip" style="background:#38815A" ${at(1, 0.8, 'pop')}>2. หรือมีตัวเชื่อมบทสนทนา?</span>
    </div>
    <img class="robot" src="assets/01-question.png" width="445" height="503" alt="" style="right:56px;top:960px;width:190px" ${at(1, 0.3)}>`,

  b02: `
    ${head('b02', '', 'ตัวอย่างทีมร้านค้า', 'ย้อนดูข้อความแรก')}
    <div class="place" style="left:90px;top:370px" ${at(0, 0.15)}>${chatDevice('dev-b02', 530, 760, ['R01.png', 'R02-composer.png'])}</div>
    <div style="position:absolute;left:660px;right:70px;top:395px;display:flex;flex-direction:column;gap:22px">
      <div class="card" style="padding:20px 22px" ${at(0, 0.4, 'left')}>
        <div class="card-h">${ico('web')}<div><b style="font-size:35px">เว็บแชททีมขาย</b><span>ใช้ร่างข้อความไทยสุภาพ</span></div></div>
      </div>
      <div class="card" style="padding:20px 22px" ${at(1, 0.2, 'left')}>
        <div class="card-h">${ico('chat')}<div><b style="font-size:35px">ข้อความแรก (Q1)</b><span>แจ้งสินค้าส่งช้า → ขอสั้นลง</span></div></div>
      </div>
      <div class="card" style="padding:20px 22px;border-color:#8d732c;background:#fbf2d8" ${at(2, 0.2, 'left')}>
        <div class="card-h">${ico('check')}<div><b style="font-size:35px">ตัวอย่างอธิบาย</b><span>ยังไม่ได้ส่งให้ลูกค้าจริง</span></div></div>
      </div>
    </div>
    <img class="robot" src="assets/10-thumbs-up.png" width="512" height="485" alt="" style="right:85px;top:1140px;width:220px" ${at(1, 0.8)}>`,

  b03: `
    ${head('b03', '', 'มองเป็น 3 ส่วน', 'คำถามผ่าน Server')}
    <div class="node wide" style="top:390px" ${at(0, 0.2)}>${ico('web', 'big')}<div><b>1. หน้าเว็บของเรา</b><span>ที่พิมพ์คำถาม · อ่านคำตอบ</span></div><span class="badge nokey" ${at(4, 0.2, 'pop')}>ไม่ถือ Key เอง</span></div>
    <div class="lane small" style="top:585px">
      <div class="lane-l" ${at(1, 0.2, 'left')}><b>ส่งคำถาม</b><span>/api/chat</span></div>
      ${vArrow(155, at(1, 0.1))}${vArrow(155, at(3, 0.1), true)}
      <div class="lane-r" ${at(3, 0.2)}><b>คำตอบกลับ</b><span>ทางเดิม</span></div>
    </div>
    <div class="node wide" style="top:745px" ${at(1, 0.4)}>${ico('server', 'big')}<div><b>2. server ของแอป</b><span>รับข้อความ · เก็บข้อมูลเชื่อมต่อ</span></div><span class="badge haskey" ${at(1, 1.0, 'pop')}>${ico('lock')}เก็บ Key</span></div>
    <div class="lane small" style="top:940px">
      <div class="lane-l" ${at(2, 0.2, 'left')}><b>ส่งต่อคำถาม</b><span>พร้อม Key + ID</span></div>
      ${vArrow(155, at(2, 0.1))}${vArrow(155, at(3, 0.4), true)}
      <div class="lane-r" ${at(3, 0.5)}><b>รับคำตอบ</b><span>จากผู้ช่วย</span></div>
    </div>
    <div class="node wide lm" style="top:1100px" ${at(2, 0.4)}><img src="assets/langmind-logo.png" width="689" height="606" alt="LangMind"><div><b>3. LangMind Agent</b><span>ผู้ช่วยที่เราตั้งหน้าที่ไว้</span></div></div>
    <div class="convo" style="top:1320px" ${at(4, 0.4)}>
      <span class="bub">หน้าเว็บและส่วนเชื่อมต่อ: เราพัฒนา</span><span class="eq">·</span><span class="bub">ไม่ต้องให้หน้าเว็บถือ key</span>
    </div>`,

  b04: `
    ${head('b04', '1', 'เตรียม', 'ผู้ช่วย และแยกสองค่า')}
    <div class="stack" style="top:410px">
      <div class="card" ${at(0, 0.2)}>
        <div class="card-h">${ico('bot', 'big')}<div><b>1. เตรียม Agent ที่พร้อมใช้งาน</b><span>ผู้ช่วยร่างข้อความไทยสุภาพ · ไม่แต่งวันส่งสินค้า</span></div></div>
        <div class="chips">
          <span class="chip" ${at(0, 1.2, 'pop')}>${ico('book')}ร่างข้อความไทยสุภาพ</span>
          <span class="chip" ${at(0, 1.8, 'pop')}>${ico('warn')}ไม่แต่งวันส่งสินค้า</span>
        </div>
      </div>
      <div class="card" ${at(1, 0.2)}>
        <div class="card-h">${ico('chat', 'big')}<div><b>2. รหัส Agent (Agent ID)</b><span>ใช้เลือกว่าจะให้ผู้ช่วยตัวไหนตอบ</span></div></div>
        <div class="chips"><span class="chip mono" ${at(1, 1.0, 'pop')}>Agent ID → เลือกผู้ช่วย</span></div>
      </div>
      <div class="card" ${at(2, 0.2)}>
        <div class="card-h">${ico('key', 'big')}<div><b>3. API key</b><span>ใช้ยืนยันสิทธิ์ในการเรียก API</span></div></div>
        <div class="chips">
          <span class="chip mono" ${at(2, 1.0, 'pop')}>API key → ยืนยันสิทธิ์</span>
          <span class="badge pub" ${at(3, 0.2, 'pop')}>คนละตัวกับรหัสบทสนทนาตอนถามต่อ</span>
        </div>
      </div>
    </div>
    <img class="robot" src="assets/05-point-up.png" width="445" height="436" alt="" style="right:65px;top:1265px;width:190px" ${at(3, 0.5)}>`,

  b05: `
    ${head('b05', '1', 'เตรียม', 'สร้าง key สำหรับแอปเรา')}
    <div class="group" data-out="2" data-out-at="0">
      <div class="place" style="left:90px;top:405px;width:900px" ${at(0, 0.2)}>
        <div class="shot-card"><img src="assets/K-name-hold.png" width="626" height="390" alt="ตั้งชื่อ API Key"><span class="shot-tag">1 · ชื่อ: ป้ายกำกับ</span></div>
      </div>
      <div class="place" style="left:90px;top:980px;width:900px" ${at(1, 0.2)}>
        <div class="shot-card"><img src="assets/K-age-hold.png" width="626" height="420" alt="เลือกวันหมดอายุ"><span class="shot-tag">2 · อายุ: ช่วงที่ key ใช้งานได้</span></div>
      </div>
    </div>
    <div class="place" style="left:90px;top:405px;width:900px" ${at(2, 0.2)}>
      <div class="shot-card"><img src="assets/K-scope-hold.png" width="626" height="560" alt="เลือกสิทธิ์ chat:invoke"><span class="shot-tag">3 · สิทธิ์แชท: chat:invoke</span></div>
    </div>
    <div class="card" style="position:absolute;left:90px;right:90px;top:1230px" ${at(2, 1.0)}>
      <div class="card-h">${ico('key', 'big')}<div><b>สิทธิ์แชท: <code class="mono" style="color:#2f6a4c">chat:invoke</code></b><span>คัดลอกรหัส Agent จากหน้าผู้ช่วย ไม่ต้องเพิ่มสิทธิ์อ่านรายการ</span></div><span class="badge haskey" ${at(3, 0.2, 'pop')}>${ico('server')}เก็บฝั่ง server</span></div>
    </div>`,

  b06: `
    ${head('b06', '1', 'เตรียม', 'ตั้งค่าฝั่ง server')}
    <div class="stack" style="top:400px">
      <div class="url-box" ${at(1, 0.2)}>
        <img src="assets/K-agent-domain.png" width="350" height="74" alt="langmind.in.th/agents/">
        <span class="mono url-id" ${at(1, 1.0, 'pop')}>&lt;AGENT_ID&gt;</span>
        <span style="margin-left:auto;font-size:28px;color:#bfe5cc">คัดลอกเฉพาะรหัสหลัง /agents/</span>
      </div>
      <div class="code" ${at(0, 0.2)}>
        <div class="code-head"><span class="method">.env / ค่าตั้งต้น</span><span class="scope">server ของแอปเรา</span></div>
        <div class="code-body">
          ${lnx(`<span class="mark" data-mark="0" data-mark-at="0.8"></span>${k('LANGMIND_API_KEY')} = ${v('&lt;API_KEY&gt;')}`, 0, 0.5, 'hl')}
          ${lnx(`<span class="mark" data-mark="1" data-mark-at="0.5"></span>${k('LANGMIND_AGENT_ID')} = ${v('&lt;AGENT_ID&gt;')}`, 0, 1.0, 'hl')}
        </div>
        <div class="code-foot">ตัวอย่างตำแหน่งตั้งค่า · ไม่ใช่รหัส Agent ของร้านนี้</div>
      </div>
      <div class="code" ${at(2, 0.2)}>
        <div class="code-head"><span class="method">server</span><span class="scope">อ่านค่าจากชื่อตัวแปร</span></div>
        <div class="code-body">
          ${lnx(`<span class="mark" data-mark="2" data-mark-at="0.6"></span>const API_KEY = ${k('process.env.LANGMIND_API_KEY')};`, 2, 0.4, 'hl')}
          ${lnx(`const AGENT_ID = ${k('process.env.LANGMIND_AGENT_ID')};`, 2, 0.8)}
        </div>
        <div class="code-foot">เก็บ key บน server · ไม่ฝังในหน้าเว็บที่ผู้ใช้เปิดดูได้</div>
      </div>
    </div>`,

  b07: `
    ${head('b07', '2', 'เชื่อม', 'หน้าเว็บ → /api/chat')}
    ${minimap(1, 'หน้าเว็บ → server')}
    ${panel({
      input: `<div class="chip in-chip">${ico('web')}<span>กดส่งข้อความแรก: <b>“ช่วยเขียนข้อความแจ้งลูกค้าว่าสินค้าส่งช้า ให้สุภาพหน่อย”</b></span></div>`,
      method: 'POST',
      path: '/api/chat  (ทางรับข้อความใน server ที่เราพัฒนา)',
      scope: 'หน้าเว็บ → server',
      lines: lnx(`fetch(${v("'/api/chat'")}, {`, 1, 0.2)
        + lnx(`  method: ${v("'POST'")},`, 1, 0.5)
        + lnx(`  <span class="mark" data-mark="1" data-mark-at="1.0"></span>body: JSON.stringify({ ${k('message')} })`, 1, 0.8, 'hl')
        + lnx(`})`, 1, 1.0),
      foot: '/api/chat = route ของแอปเรา ไม่ใช่ endpoint ของ LangMind · หน้าเว็บไม่ต้องรู้ key',
      outSeg: 2,
      outAt: 0.2,
      output: `<div class="chip out-chip">${ico('server')}<span><b>server ตรวจผู้ใช้และข้อความ</b> → หาบทสนทนาของผู้ใช้นั้น → ส่งต่อไปยัง Agent</span></div>`,
    })}`,

  b08: `
    ${head('b08', '2', 'เชื่อม', 'ปลายทาง · ส่วนหัว · ข้อมูล')}
    ${minimap(2, 'POST → LangMind')}
    ${panel({
      input: `<div class="chip in-chip">${ico('server')}<span><b>server ของแอปเรา</b> ส่ง POST ไปที่ API ของ LangMind (รอคำตอบเต็มก่อน)</span></div>`,
      method: 'POST',
      path: 'https://langmind.in.th/api/chat/message/blocking',
      scope: 'ส่วนหนึ่งของ request',
      lines: lnx(`${k('Authorization')}: Bearer ${v('&lt;API_KEY&gt;')}`, 1, 0.2)
        + lnx(`${k('Content-Type')}: ${v('application/json')}`, 1, 0.6)
        + lnx(`${k('agent_id')}: ${v('&lt;AGENT_ID&gt;')}`, 2, 0.2)
        + lnx(`${k('query')}: ${v('"ช่วยเขียนข้อความแจ้งลูกค้าว่าสินค้าส่งช้า ให้สุภาพหน่อย"')}`, 2, 0.6)
        + lnx(`<span class="mark" data-mark="2" data-mark-at="1.2"></span>${k('conversation_id')}: ${v('null')}`, 2, 1.0, 'hl'),
      foot: 'ตัวอย่างนี้ไม่ส่ง user_id · อย่าเหมารวมว่า null เริ่มเรื่องใหม่เสมอในทุกเงื่อนไข',
      outSeg: 3,
      outAt: 0.2,
      output: `<div class="chip out-chip json">ครั้งแรก: ${k('conversation_id')}: ${v('null')} &nbsp;·&nbsp; ${k('agent_id')} เลือกผู้ช่วย &nbsp;·&nbsp; ${k('query')} คือคำถาม</div>`,
    })}`,

  b09: `
    ${head('b09', '2', 'เชื่อม', 'ส่งคำขอ แล้วตรวจผล')}
    ${minimap(2, 'fetch & ตรวจผล')}
    ${panel({
      input: `<div class="chip in-chip">${ico('key')}<span><b>key และ Agent ID</b> อ่านจากค่าตั้งต้น · คำถามและรหัสบทสนทนามาจากผู้ใช้นั้น</span></div>`,
      method: 'SERVER',
      path: 'fetch ฝั่ง server · ตรวจผลก่อนนำไปใช้',
      scope: 'โค้ดประกอบคำอธิบาย',
      lines: lnx(`const response = await fetch(endpoint, {`, 0, 0.5)
        + lnx(`  method: ${v("'POST'")}, // blocking endpoint`, 0, 0.9)
        + lnx(`  headers: { Authorization: ${v('`Bearer ${API_KEY}`')} },`, 1, 0.2)
        + lnx(`  body: JSON.stringify({ ${k('agent_id')}: AGENT_ID, ${k('query')}: message, ${k('conversation_id')} })`, 1, 0.6)
        + lnx(`});`, 1, 0.9)
        + lnx(`<span class="mark" data-mark="2" data-mark-at="0.4"></span>if (${k('!response.ok')}) { // จัดการข้อผิดพลาด }`, 2, 0.2, 'hl')
        + lnx(`const data = await response.json();`, 2, 0.6),
      foot: 'ตรวจรูปแบบข้อมูลก่อนใช้ · ยังต้องเชื่อมระบบผู้ใช้และที่เก็บข้อมูลจริง',
      outSeg: 3,
      outAt: 0.2,
      output: `<div class="chip out-chip">${ico('check')}<span><b>ตรวจว่าสำเร็จและรูปแบบถูกต้อง</b> ก่อนนำคำตอบไปใช้</span></div>`,
    })}`,

  b10: `
    ${head('b10', '2', 'เชื่อม', 'แสดงคำตอบ · เก็บรหัส')}
    ${minimap(2, 'Response ← LangMind')}
    <div class="group" data-out="2" data-out-at="0.1">
      ${panel({
        input: `<div class="chip in-chip">${ico('bot')}<span><b>ผลตัวอย่างแบบย่อ</b> จาก LangMind Agent กลับมาที่ server</span></div>`,
        method: '200 OK',
        path: 'ผลตัวอย่างแบบย่อ · เก็บคู่กับเจ้าของ',
        scope: 'answer + conversation_id',
        lines: lnx(`<span class="mark" data-mark="0" data-mark-at="0.6"></span>${k('answer')}: ${v('"ขออภัยค่ะ สินค้าจัดส่งล่าช้ากว่ากำหนด ทางร้านกำลังติดตามและจะแจ้งให้ทราบค่ะ"')}`, 0, 0.4, 'hl')
          + lnx(`<span class="mark" data-mark="1" data-mark-at="0.4"></span>${k('conversation_id')}: ${v('"conv_demo_01"')}`, 1, 0.2, 'hl')
          + lnx(`// server ตรวจเจ้าของและเก็บรหัสไว้คู่กับผู้ใช้นั้น`, 1, 0.6),
        foot: 'answer → ส่งไปให้หน้าเว็บแสดง · conversation_id → เก็บฝั่ง server',
        outSeg: 1,
        outAt: 0.8,
        output: `<div class="chip out-chip json">${k('answer')} → แสดงคำตอบ &nbsp;·&nbsp; ${k('conversation_id')}: ${v('conv_demo_01')} → เก็บฝั่ง server</div>`,
      })}
    </div>
    <div class="place" style="left:252px;top:465px" ${at(2, 0.2)}>${chatDevice('dev-b10', 560, 740, ['R03-success.png'])}</div>
    ${srvTag(1235, at(2, 0.5))}
    <div class="wave-label" style="top:1340px"><span ${at(3, 0.2)}>จำรหัสบทสนทนานี้ไว้! เราจะใช้กับคำว่า “ขอสั้นลง”</span></div>
    <img class="robot" src="assets/10-thumbs-up.png" width="512" height="485" alt="" style="right:50px;top:980px;width:205px" ${at(2, 0.6)}>`,

  b11: `
    ${head('b11', '3', 'ใช้ผล', 'กรณีระหว่างรอ · ส่งไม่สำเร็จ')}
    <div class="place" style="left:95px;top:385px" ${at(0, 0.2)}>${chatDevice('dev-b11', 530, 740, ['R02-pending.png', 'R04-error.png', 'R01.png'])}</div>
    <div style="position:absolute;left:660px;right:65px;top:400px;display:flex;flex-direction:column;gap:22px">
      <div class="card" style="padding:20px 22px" ${at(0, 0.4, 'left')}>
        <div class="card-h">${ico('loop')}<div><b style="font-size:35px">1. กรณีระหว่างรอ</b><span>แจ้งว่ากำลังรอคำตอบ · กันกดส่งซ้ำ</span></div></div>
      </div>
      <div class="card" style="padding:20px 22px;border-color:#9b3b2b;background:#f7e1dc" ${at(1, 0.2, 'left')}>
        <div class="card-h">${ico('warn')}<div><b style="font-size:35px;color:#9b3b2b">2. ถ้าส่งไม่สำเร็จ</b><span>บอกตรง ๆ และเก็บข้อความไว้ให้ลองใหม่</span></div></div>
      </div>
      <div class="card" style="padding:20px 22px" ${at(2, 0.2, 'left')}>
        <div class="card-h">${ico('chat')}<div><b style="font-size:35px">3. กลับมาถามต่อ</b><span>แอปจัดการสถานะเอง ไม่ใช่คำตอบ Agent</span></div></div>
      </div>
    </div>
    ${srvTag(1165, at(0, 0.6))}
    <div class="convo" style="top:1270px" ${at(2, 0.4)}>
      <span class="bub">สถานะหน้าจอเป็นงานของแอปที่เราพัฒนา · ไม่ใช่ข้อความที่ Agent ตอบ</span>
    </div>`,

  b12: `
    ${head('b12', '3', 'ใช้ผล', 'เปลี่ยน query · คงรหัสเดิม')}
    ${minimap(3, 'ใช้ conversation_id เดิม')}
    <div class="group" data-out="3" data-out-at="0.1">
      ${panel({
        input: `<div class="chip in-chip">${ico('chat')}<span>ถามต่อ: <b>“ขอสั้นลง”</b> ต้องเปลี่ยนอะไร เก็บอะไรไว้?</span></div>`,
        method: 'POST',
        path: 'ส่วนหนึ่งของ request · รอบถามต่อในแชทเดิม',
        scope: 'server ของแอปเรา',
        lines: lnx(`<span class="mark" data-mark="1" data-mark-at="0.3"></span>${k('query')}: ${v('"ขอสั้นลงสำหรับส่งใน LINE"')}`, 1, 0.1, 'hl')
          + lnx(`<span class="mark" data-mark="1" data-mark-at="1.2"></span>${k('conversation_id')}: ${v('"conv_demo_01"')}`, 1, 0.6, 'hl')
          + lnx(`${k('agent_id')}: ${v('&lt;AGENT_ID&gt;')}`, 1, 1.0),
        foot: 'ไม่ใช่เอา API key หรือรหัส Agent มาแทนรหัสนี้ · server ต้องตรวจเจ้าของบทสนทนา',
        outSeg: 2,
        outAt: 0.2,
        output: `<div class="chip out-chip" style="border-color:#9b3b2b;background:#f7e1dc">${ico('lock')}<span><b>server ตรวจเจ้าของบทสนทนา:</b> ยืนยันว่าบทสนทนานี้เป็นของผู้ใช้คนนี้จริง</span></div>`,
      })}
    </div>
    <div class="place" style="left:252px;top:465px" ${at(3, 0.2)}>${chatDevice('dev-b12', 560, 740, ['R05-pending.png', 'R05-answer.png'])}</div>
    ${srvTag(1235, at(3, 0.4))}
    <div class="wave-label" style="top:1340px"><span ${at(3, 1.2)}>ร่างคำตอบฉบับสั้นในแชทเดิม (ตรวจก่อนส่ง LINE)</span></div>
    <img class="robot" src="assets/10-thumbs-up.png" width="512" height="485" alt="" style="right:50px;top:980px;width:205px" ${at(3, 1.0)}>`,

  b13: `
    ${head('b13', '3', 'ใช้ผล', 'รอคำตอบครบ vs รับเป็นช่วง')}
    <div class="stack" style="top:405px">
      <div class="card" style="border-color:#38815A" ${at(0, 0.2)}>
        <div class="card-h">${ico('check', 'big')}<div><b>1. ตัวอย่างนี้: รอคำตอบครบ (Blocking)</b><span>คำตอบครบ แล้วค่อยแสดงผลทีเดียว</span></div></div>
        <div class="chips"><span class="chip mono" ${at(0, 0.8, 'pop')}>POST /api/chat/message/blocking</span></div>
      </div>
      <div class="card" style="border-color:#1E7578" ${at(1, 0.2)}>
        <div class="card-h">${ico('play', 'big')}<div><b>2. อีกทางเลือก: รับข้อมูลเป็นช่วง (Streaming)</b><span>ต้องปรับทั้ง server และหน้าเว็บ ไม่ใช่แค่ทำตัวอักษรค่อย ๆ ปรากฏ หรือเปลี่ยน URL อย่างเดียว</span></div></div>
        <div class="chips">
          <span class="chip" ${at(1, 0.8, 'pop')}>${ico('server')}ปรับฝั่ง server</span>
          <span class="chip" ${at(1, 1.3, 'pop')}>${ico('web')}ปรับฝั่งหน้าเว็บ</span>
        </div>
      </div>
    </div>
    ${srvTag(1155, at(0, 0.6))}
    <img class="robot" src="assets/06-thinking.png" width="430" height="436" alt="" style="right:80px;top:1245px;width:195px" ${at(1, 0.6)}>`,

  b14: `
    ${head('b14', '3', 'ใช้ผล', 'มือถือ vs จอใหญ่')}
    <div style="position:absolute;left:75px;top:390px" ${at(0, 0.2)}>
      ${chatDevice('dev-b14-mob', 425, 620, ['R06-mobile.png'])}
      <div style="text-align:center;font-size:32px;font-weight:700;margin-top:12px;color:#38815A">มือถือ: พิมพ์และอ่าน</div>
    </div>
    <div style="position:absolute;right:75px;top:390px" ${at(1, 0.2)}>
      ${chatDevice('dev-b14-desk', 425, 620, ['R06-desktop.png'])}
      <div style="text-align:center;font-size:32px;font-weight:700;margin-top:12px;color:#1E7578">จอใหญ่: เพิ่มพื้นที่แก้ข้อความ</div>
    </div>
    ${srvTag(1110, at(0, 0.6))}
    <div class="convo" style="top:1215px" ${at(2, 0.2)}>
      <span class="bub">หน้าจอเราออกแบบให้เหมาะกับทีม</span><span class="eq">·</span><code>การเรียก Agent ใช้หลักเดิม</code>
    </div>
    <img class="robot" src="assets/04-open-arms.png" width="425" height="503" alt="" style="left:435px;top:1310px;width:190px" ${at(2, 0.6)}>`,

  b15: `
    ${head('b15', '', 'ทวนวงจร', 'ใช้ conversation_id เดิม คุยต่อ')}
    <div class="stack" style="top:390px">
      ${[
        ['1', 'ทวนจากข้อความเดียว', '#38815A', ['หน้าเว็บส่งคำถาม', '→', 'server เชื่อม Agent', '→', 'แสดง answer', 'เก็บ conversation_id ถามต่อ']],
        ['2', 'แยก 3 ค่าสำคัญคนละหน้าที่', '#8d732c', ['Agent ID = เลือกผู้ช่วย', 'API key = ยืนยันสิทธิ์', 'conversation_id = เชื่อมเรื่องเดิม']],
        ['3', 'เริ่มจากงานของทีมเรา', '#1E7578', ['เลือกข้อความ 1 เรื่อง', 'ที่อยากให้ผู้ช่วยร่างก่อน', 'แล้วลองขอให้สั้นลงในแชทเดิม']],
      ].map(([n, t, c, items], i) => `
        <div class="recap" style="--c:${c}" ${at(i, 0.2)}>
          <span class="recap-t"><b>${n}</b>${t}</span>
          <div class="chips">${items.map((x, j) => x === '→' ? `<i class="arr" ${at(i, 0.4 + j * 0.2)}>→</i>` : `<span class="chip" ${at(i, 0.4 + j * 0.2, 'pop')}>${x}</span>`).join('')}</div>
        </div>`).join('')}
    </div>
    ${srvTag(1195, at(0, 0.8))}
    <div class="convo" style="top:1295px" ${at(2, 0.3)}>
      <span class="bub">คุณอยากให้ผู้ช่วยร่างเรื่องอะไรเป็นเรื่องแรก?</span>
    </div>
    <img class="robot" src="assets/04-open-arms.png" width="425" height="503" alt="" style="right:45px;top:1365px;width:160px" ${at(2, 0.5)}>`,

  b16: `
    <div class="sponsor" style="top:390px">
      <div class="sp-by" ${at(0, 0.15)}>ตาคุณลองแล้ว</div>
      <img class="sp-logo" src="assets/langmind-logo.png" width="689" height="606" alt="LangMind" ${at(0, 0.4, 'pop')}>
      <div class="sp-url" ${at(1, 0.1, 'pop')}>https://langmind.in.th</div>
      <div class="chips sp-chips" ${at(0, 1.0)}>
        <span class="chip">ร่างข้อความหนึ่งเรื่อง</span>
        <span class="chip">แล้วขอให้สั้นลงในแชทเดิม</span>
      </div>
    </div>
    <img class="robot" src="assets/08-high-wave.png" width="425" height="436" alt="" style="left:425px;top:1275px;width:220px" ${at(0, 0.8)}>`,
};

const sceneHtml = Object.entries(scenes).map(([id, html]) => `<section class="scene" id="sc-${id}">${html}</section>`).join('\n');
const captions = beats.flatMap(b => b.segments.map((s, i) =>
  `<div id="cap-${b.id}-${i}" class="clip caption" data-start="${s.start}" data-duration="${s.duration}" data-track-index="8" data-layout-allow-caption-zone>${esc(s.cap).replaceAll('\n', '<br>')}</div>`)).join('\n');
const audioTags = beats.map(b =>
  `<audio id="vo-${b.id}" class="clip" data-start="${b.start}" data-duration="${b.duration}" data-track-index="9" src="${esc(b.voice)}"></audio>`).join('\n');

const html = `<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8">
<title>EP02 · Custom Chat (r10) · EP04 Style</title>
<link rel="stylesheet" href="style.css">
<script src="assets/gsap.min.js"></script>
</head>
<body>
<main id="film" data-composition-id="ep02-ep04-style" data-width="1080" data-height="1920" data-fps="${cfg.fps}" data-duration="${duration}">
  <div class="kicker">EP02 &nbsp;/&nbsp; CUSTOM CHAT</div>
  <div class="note">ภาพจำลอง</div>
  <section id="stage" class="clip" data-start="0" data-duration="${duration}" data-track-index="1">
    <div class="spine"><span id="sp1" class="pill">1 เตรียม</span><i></i><span id="sp2" class="pill">2 เชื่อม</span><i></i><span id="sp3" class="pill">3 ใช้ผล</span></div>
    ${sceneHtml}
  </section>
  ${captions}
  ${audioTags}
</main>
<script>window.FILM=${JSON.stringify({ duration, beats: beats.map(({ id, start, duration, length, segments }) => ({ id, start, duration, length, segments: segments.map(({ cue, start, duration }) => ({ cue, start, duration })) })) })}</script>
<script src="motion.js"></script>
</body>
</html>
`;
fs.writeFileSync(path.join(root, 'index.html'), html);

const stamp = t => {
  const ms = Math.round(t * 1000);
  return `${String(Math.floor(ms / 3600000)).padStart(2, '0')}:${String(Math.floor(ms / 60000) % 60).padStart(2, '0')}:${String(Math.floor(ms / 1000) % 60).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`;
};
const allCaps = beats.flatMap(b => b.segments);
fs.writeFileSync(path.join(root, 'captions-summary.srt'), allCaps.map((c, i) => `${i + 1}\n${stamp(c.start)} --> ${stamp(c.start + c.duration)}\n${c.cap}\n`).join('\n'));

const vo = beats.map(b => `## ${b.id} (${b.beat} · ${b.title}) → ${b.voice}\n${b.segments.map(s => s.say).join(' ')}\n`).join('\n');
fs.writeFileSync(path.join(root, 'VOICE-SCRIPT.md'), `# EP02 r10 (EP04 Style) — บทพากย์และซับสรุป\n\nใช้เสียง Kore r10 ชุด B01.wav–B16.wav ความยาวรวม ${duration} วินาที\n\n${vo}`);
console.log(`${beats.length} beats, ${allCaps.length} captions, ${duration.toFixed(6)} s`);

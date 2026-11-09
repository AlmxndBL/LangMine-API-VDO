// Video Builder Engine (LangMind API Walkthrough Standard: EP04-EP11)
// Transforms timing.json -> index.html + VOICE-SCRIPT.md + SILENT-TIMING.md
// Run from the video folder: node build.mjs

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const cfg = JSON.parse(fs.readFileSync(path.join(root, 'timing.json'), 'utf8'));

const esc = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const fr = t => Math.round(t * cfg.fps) / cfg.fps;   // snap to frame boundary
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
    try {
      const out = execFileSync('python', ['-c', pyCode, p]).toString().trim();
      return Number(out);
    } catch {
      return null;
    }
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

function pauseList(rel) {
  if (!rel) return [];
  const p = path.join(root, rel);
  try {
    const res = spawnSync('ffmpeg', ['-hide_banner', '-i', p, '-af', 'silencedetect=n=-40dB:d=0.18', '-f', 'null', '-'], { encoding: 'utf8' });
    const r = res.stderr || '';
    const starts = [...r.matchAll(/silence_start: ([0-9.]+)/g)].map(m => Number(m[1]));
    const ends = [...r.matchAll(/silence_end: ([0-9.]+)/g)].map(m => Number(m[1]));
    return starts.map((s, i) => ({ start: s, end: ends[i] ?? s }));
  } catch {
    return [];
  }
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
  t += dur + cfg.beat_gap + (b.hold || 0);   // optional hold
  return beat;
}

const duration = fr(t - cfg.beat_gap + cfg.tail);

// ---------- Markup Helpers (Editorial Paper & Sage Ink) ----------
const I = {
  db: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
  search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  phone: '<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>',
  server: '<rect x="3.5" y="4" width="17" height="6.5" rx="1.5"/><rect x="3.5" y="13.5" width="17" height="6.5" rx="1.5"/><path d="M7 7.2h.01M7 16.7h.01M11 7.2h6M11 16.7h6"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l8.5-8.5M16 7l2.5 2.5M14 9l2 2"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
  bot: '<rect x="4" y="7" width="16" height="12" rx="3"/><path d="M12 3.5V7M9 12.5h.01M15 12.5h.01M9.5 16h5"/>',
  book: '<path d="M4 5.5A2 2 0 0 1 6 3.5h12v15H6a2 2 0 0 0-2 2z"/><path d="M4 20.5V5.5M8 8h7M8 11.5h7"/>',
  spark: '<path d="M12 2l2.4 6.9 6.9 2.4-6.9 2.4L12 20.6l-2.4-6.9L2.7 11.3l6.9-2.4z"/>',
};

const ico = (n, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24">${I[n] || ''}</svg>`;
const at = (k, d = 0.1, anim = 'up') => `data-in="${k}" data-at="${d}" data-anim="${anim}"`;
const vArrow = (h, attrs = '', flip = false) =>
  `<svg class="varrow${flip ? ' up' : ''}" ${attrs} viewBox="0 0 60 ${h}" style="height:${h}px"><path pathLength="1" d="M30 6 V${h - 14} M14 ${h - 28} L30 ${h - 10} L46 ${h - 28}"/><circle class="dot" cx="30" cy="10" r="7" data-y0="10" data-y1="${h - 22}"/></svg>`;

const device = (id, w, h, img1, img2, showSecond = false) => `
  <div class="device" id="${id}" style="width:${w + 16}px">
    <div class="screen" style="width:${w}px;height:${h}px">
      <img src="${img1}" width="1440" height="1800" alt="หน้าจอจำลองสถานะที่ 1" data-layout-allow-overflow style="width:${w}px">
      <img class="img-a" src="${img2}" width="1440" height="1800" alt="หน้าจอจำลองสถานะที่ 2" data-layout-allow-overflow style="width:${w}px;${showSecond ? 'opacity:1;' : ''}">
    </div>
  </div>`;

const head = (id, n, verb, rest) => `<h1 class="heading">${n ? `<span class="num">${n}</span>` : ''}${verb}<small>${rest}</small></h1>`;
const k = s => `<span class="k">${s}</span>`;
const v = s => `<span class="v">${s}</span>`;
const lnx = (html, seg, d, cls = '') => `<div class="ln ${cls}" ${at(seg, d, 'left')}>${html}</div>`;

const COLORS = { 1: '#38815A', 2: '#8d732c', 3: '#1E7578' };

// Minimap sticky indicator shown during the three API calls
const minimap = (n, verb, dest = 'LangMind') => `
  <div class="minimap" style="--c:${COLORS[n]}">
    <span class="mm-node srv">${ico('server')}หลังบ้าน${ico('lock', 'sm')}</span>
    <i class="mm-link"></i>
    <span class="mm-call">${n} · ${verb}</span>
    <i class="mm-link"></i>
    <span class="mm-node lm"><img src="assets/langmind-logo.png" width="689" height="606" alt="">${dest}</span>
  </div>`;

// ---------- Scene Definitions (Customize endpoints and assets per episode) ----------
const scenes = {
  b1: `
    ${head('b1', '', 'ชื่อฟีเจอร์หลัก', 'ทำได้ยังไง?')}
    <div class="place" style="left:242px;top:370px">${device('dev-b1', 580, 725, 'assets/app-feature-1.jpg', 'assets/app-feature-2.jpg')}</div>
    <img class="robot" src="assets/01-question.png" width="445" height="503" alt="" style="left:70px;top:1130px;width:190px" ${at(0, 0.4)}>
    <div class="tip" style="top:1170px;left:280px;right:70px" ${at(1, 0.2)}><b>คำอธิบายสั้น ๆ</b><br>เชื่อมต่อระบบของคุณกับ AI ได้ทันที<br>ทำงานแบบอัตโนมัติไม่ต้องทำมือ</div>
    <div class="qrow" style="top:1360px">
      <span class="qchip" ${at(2, 0.3, 'pop')}>เตรียมอะไร?</span>
      <span class="qchip" ${at(2, 0.9, 'pop')}>เชื่อมตรงไหน?</span>
      <span class="qchip" ${at(2, 1.5, 'pop')}>ใช้ผลยังไง?</span>
    </div>`,

  b2: `
    ${head('b2', '', 'ภาพรวมทั้งหมด', '3 ส่วนสำคัญ')}
    <div class="node wide" style="top:410px" ${at(0, 0.1)}>${ico('server', 'big')}<div><b>ระบบหลังบ้านของคุณ</b><span>ส่งคำขอ · จัดการข้อมูล</span></div><span class="badge haskey" ${at(0, 1.2, 'pop')}>${ico('lock')}Key</span></div>
    <div class="lane small" style="top:600px">
      <div class="lane-l" ${at(0, 0.6, 'left')}><b>ส่งข้อมูลตั้งต้น</b></div>
      ${vArrow(150, at(0, 0.5))}
      ${vArrow(150, at(0, 0.9), true)}
      <div class="lane-r" ${at(0, 1.0)}><b>รับผลลัพธ์</b></div>
    </div>
    <div class="node wide lm" style="top:760px" ${at(0, 0.8)}><img src="assets/langmind-logo.png" width="689" height="606" alt="LangMind"><div><b>LangMind Platform</b><span>APIs · Workflows · RAG Engine</span></div></div>
    <div class="lane small" style="top:950px">
      <div class="calls3" ${at(1, 0.2)}><span class="step s1" ${at(2, 0.2, 'pop')}>1 เตรียมข้อมูล</span><span class="step s2" ${at(2, 0.7, 'pop')}>2 ผูกระบบ</span><span class="step s3" ${at(2, 1.2, 'pop')}>3 ดึงผลลัพธ์</span></div>
      ${vArrow(150, at(1, 0.8))}
      ${vArrow(150, at(1, 1.2), true)}
      <div class="lane-r" ${at(1, 1.3)}><b>ดึงตอบคำถาม</b></div>
    </div>
    <div class="node wide" style="top:1110px" ${at(1, 0.4)}>${ico('bot', 'big')}<div><b>LangMind Agent</b><span>ผู้ช่วยอัจฉริยะในระบบ</span></div></div>`,

  b3: `
    ${head('b3', '1', 'เตรียม', 'ต้องมี 3 อย่าง')}
    <div class="stack" style="top:410px">
      <div class="card" ${at(0, 0.2)}>
        <div class="card-h">${ico('bot', 'big')}<div><b>Agent ใน LangMind</b><span>ตั้งค่าฟีเจอร์ไว้เรียบร้อย</span></div></div>
        <div class="chips"><span class="chip" ${at(0, 1.0, 'pop')}>${ico('book')}Active</span><span class="chip mono" ${at(0, 1.4, 'pop')}>status: ready</span></div>
        <div class="warn" ${at(1, 0.2)}><b>สำคัญ:</b> ไม่ได้เปิดใช้งานฟังก์ชัน จะคืนรหัสข้อผิดพลาด เช่น <code>403 FORBIDDEN</code></div>
      </div>
      <div class="card" ${at(2, 0.2)}>
        <div class="card-h">${ico('key', 'big')}<div><b>API Key (ระบุสิทธิ์)</b><span class="mono">lmpat_••••••••</span></div></div>
        <div class="chips">
          <span class="chip mono" ${at(2, 1.0, 'pop')}>scope:write</span>
          <span class="chip mono" ${at(2, 1.4, 'pop')}>scope:read</span>
        </div>
      </div>
      <div class="card" ${at(3, 0.2)}>
        <div class="card-h">${ico('server', 'big')}<div><b>ระบบหลังบ้าน (Server)</b><span>เก็บ Key ฝั่งเซิร์ฟเวอร์ · ปลอดภัย ไม่หลุดเข้า Client</span></div></div>
      </div>
    </div>`,

  b4: `
    ${head('b4', '2', 'เชื่อม', 'ครั้งที่ 1 · ส่งข้อมูล')}
    ${minimap(1, 'ส่งข้อมูลเริ่มต้น', 'LangMind API')}
    <div class="panel">
      <div class="slot-in" ${at(0, 0.2)}>
        <div class="chip in-chip">${ico('file')}<span><b>payload_input.json</b> · 12 KB</span></div>
      </div>
      ${vArrow(60, at(0, 0.6))}
      <div class="code" ${at(0, 0.8)}>
        <div class="code-head"><span class="method">POST</span><span class="scope">สิทธิ์ scope:write</span></div>
        <div class="code-path">/api/v1/resource-create</div>
        <div class="code-body">
          ${lnx(`Authorization: Bearer ${v('$LM_TOKEN')}`, 0, 1.0)}
          ${lnx(`{ ${k('"name"')}: ${v('"demo-item"')}, ${k('"type"')}: ${v('"auto"')} }`, 0, 1.2)}
        </div>
        <div class="code-foot">HTTP 200 OK · ดำเนินการเรียบร้อย</div>
      </div>
      ${vArrow(60, at(1, 0.3))}
      <div class="slot-out" ${at(1, 0.5)}>
        <div class="chip out-chip json">
          { ${k('"status"')}: ${v('"success"')}, ${k('"id"')}: ${v('"res_9x12"')} }
          <em>บันทึกสำเร็จ รับรหัสอ้างอิงเพื่อใช้ต่อ</em>
        </div>
      </div>
    </div>`,

  b5: `
    ${head('b5', '2', 'เชื่อม', 'ครั้งที่ 2 · ผูกระบบ')}
    ${minimap(2, 'ผูกระบบเข้ากับ Agent', 'Agent Engine')}
    <div class="panel">
      <div class="slot-in" ${at(0, 0.2)}>
        <div class="chip in-chip">${ico('bot')}<span><b>agent_id:</b> "ag_cafe_01"</span></div>
      </div>
      ${vArrow(60, at(0, 0.6))}
      <div class="code" ${at(0, 0.8)}>
        <div class="code-head"><span class="method">PUT</span><span class="scope">สิทธิ์ agents:write</span></div>
        <div class="code-path">/api/v1/agents/{id}/bind</div>
        <div class="code-body">
          ${lnx(`Authorization: Bearer ${v('$LM_TOKEN')}`, 0, 1.0)}
          ${lnx(`{ ${k('"resource_id"')}: ${v('"res_9x12"')}, ${k('"weight"')}: ${v('1.0')} }`, 0, 1.3, 'hl')}
        </div>
        <div class="code-foot">HTTP 200 OK · ผูกข้อมูลสำเร็จ</div>
      </div>
      ${vArrow(60, at(1, 0.3))}
      <div class="slot-out" ${at(1, 0.5)}>
        <div class="chip out-chip json">
          { ${k('"updated"')}: ${v('true')}, ${k('"active"')}: ${v('true')} }
          <em>Agent พร้อมใช้งานข้อมูลนี้ทันที</em>
        </div>
      </div>
    </div>`,

  b6: `
    ${head('b6', '2', 'เชื่อม', 'ครั้งที่ 3 · ทดสอบดึงผล')}
    ${minimap(3, 'ทดสอบและแสดงผลลัพธ์', 'LangMind Core')}
    <div class="panel">
      <div class="code" ${at(0, 0.4)}>
        <div class="code-head"><span class="method">POST</span><span class="scope">สิทธิ์ service:invoke</span></div>
        <div class="code-path">/api/v1/service/test</div>
        <div class="code-body">
          ${lnx(`Authorization: Bearer ${v('$LM_TOKEN')}`, 0, 0.6)}
          ${lnx(`{ ${k('"agent_id"')}: ${v('"ag_cafe_01"')}, ${k('"query"')}: ${v('"ทดสอบเรียก"') } }`, 0, 0.9)}
        </div>
        <div class="code-foot">HTTP 200 OK · ได้ผลลัพธ์ทันที</div>
      </div>
      ${vArrow(50, at(1, 0.2))}
      <div class="slot-out" ${at(1, 0.4)}>
        <div class="chip out-chip json">
          { ${k('"response"')}: ${v('"ผลลัพธ์พร้อมใช้"')}, ${k('"score"')}: ${v('0.94')} }
          <em>ดึงข้อมูลตรงจุดและรวดเร็ว</em>
        </div>
      </div>
      <div class="place" style="left:140px;top:1030px" ${at(2, 0.2)}>
        ${device('dev-b6', 520, 360, 'assets/app-feature-1.jpg', 'assets/app-feature-2.jpg', true)}
      </div>
    </div>`,

  b7: `
    ${head('b7', '3', 'ใช้ผล', 'นำไปต่อยอด & ข้อควรระวัง')}
    <div class="stack" style="top:410px">
      <div class="use" ${at(0, 0.2)}>
        ${ico('spark', 'big')}
        <div>
          <b>นำผลลัพธ์ไปต่อยอดในแอป</b>
          <p>แสดงผลลัพธ์ในหน้าแชท นำค่าไปประมวลผลต่อ หรือเชื่อมโยงเข้ากับระบบหลังบ้านเดิมของคุณ</p>
        </div>
      </div>
      <div class="use" ${at(1, 0.2)}>
        ${ico('file', 'big')}
        <div>
          <b>รองรับการทำงานหลายรูปแบบ</b>
          <p>เลือกยิงคำขอแบบเดี่ยว แบบชุด (Batch) หรือผ่านช่องทางอัตโนมัติต่าง ๆ</p>
        </div>
      </div>
      <div class="use tip-card" ${at(2, 0.2)}>
        ${ico('lock', 'big')}
        <div>
          <b>ข้อควรระวังสำคัญ</b>
          <p>ตรวจสอบสิทธิ์ API Key, รักษาความปลอดภัยของ Token บน Server เสมอ และจัดการ Error ให้รอบคอบ</p>
        </div>
      </div>
    </div>`,

  b8: `
    ${head('b8', '', 'สรุป', '3 ขั้นตอนสู่ความสำเร็จ')}
    <div class="stack recap" style="top:430px">
      <div class="rc" ${at(0, 0.2)}>
        <span class="rc-n">1</span>
        <div class="rc-b"><span class="rc-tag">เตรียม</span><b>Agent ในระบบ + API Key พร้อมสิทธิ์ + เซิร์ฟเวอร์หลังบ้าน</b><p>เตรียมสิ่งจำเป็นให้ครบถ้วนก่อนเริ่มต้นเขียนโค้ดเชื่อมต่อ</p></div>
      </div>
      <div class="rc" ${at(1, 0.2)}>
        <span class="rc-n">2</span>
        <div class="rc-b"><span class="rc-tag">เชื่อม</span><b>ส่งข้อมูล → ผูกระบบเข้ากับ Agent → ทดสอบดึงผลลัพธ์</b><p>เรียก API สามขั้นตอนอย่างเป็นระบบและปลอดภัย</p></div>
      </div>
      <div class="rc" ${at(2, 0.2)}>
        <span class="rc-n">3</span>
        <div class="rc-b"><span class="rc-tag">ใช้ผล</span><b>นำคำตอบไปใช้งานจริง และตรวจสอบความถูกต้อง</b><p>ได้แอปพลิเคชันที่ฉลาดและทำงานได้อย่างราบรื่น</p></div>
      </div>
    </div>`,

  b9: `
    <div class="sponsor">
      <div class="sp-logo" ${at(0, 0.2)}><img src="assets/langmind-logo.png" width="689" height="606" alt="LangMind"></div>
      <div class="sp-tag" ${at(0, 0.6)}>คลิปนี้สนับสนุนโดย</div>
      <div class="sp-name" ${at(0, 0.9)}>LangMind</div>
      <div class="sp-sub" ${at(1, 0.2)}>สร้าง Agent อัจฉริยะและเชื่อมต่อ API ของคุณได้แล้ววันนี้</div>
      <div class="sp-url" ${at(1, 0.6)}>langmind.in.th</div>
    </div>`
};

// ---------- Render HTML Frame & Captions ----------
const scenesHtml = beats.map(b => `
  <section class="scene" id="${b.id}" data-start="${b.start}" data-duration="${b.duration}">
    <div class="scene-inner">
      ${scenes[b.id] || ''}
      <div class="caps">
        ${b.segments.map(s => `<div class="cap" data-start="${s.start}" data-duration="${s.duration}">${esc(s.cap).replace(/\n/g, '<br>')}</div>`).join('\n        ')}
      </div>
    </div>
  </section>`).join('\n');

const audioTags = beats.filter(b => b.voice).map(b =>
  `<audio id="a-${b.id}" src="${b.voice}" preload="auto"></audio>`
).join('\n  ');

const html = `<!doctype html>
<html lang="th">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=1080, height=1920, initial-scale=1">
  <title>LangMind API Explainer</title>
  <link rel="stylesheet" href="style.css">
  <script src="assets/gsap.min.js"></script>
</head>
<body>
  <div id="film" class="film" data-duration="${duration}" data-fps="${cfg.fps}">
    ${scenesHtml}
  </div>
  ${audioTags}
  <script>
    window.FILM = ${JSON.stringify({ duration, fps: cfg.fps, beats }, null, 2)};
  </script>
  <script src="motion.js"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(root, 'index.html'), html);

// Export VOICE-SCRIPT.md
const voiceScript = `# Voiceover Script

Generated: ${new Date().toISOString()} · Duration: ${duration.toFixed(2)}s (${Math.floor(duration / 60)}:${Math.floor(duration % 60).toString().padStart(2, '0')})
Mode: ${usedVoice ? `Audio Files Active (${usedVoice}/${beats.length} beats)` : 'Silent Draft Mode (11 chars/sec)'}

${beats.map(b => `## Beat ${b.id.toUpperCase()} (${b.duration.toFixed(2)}s)
${b.segments.map(s => `- **${s.cue}** (${s.duration.toFixed(2)}s): ${s.say}`).join('\n')}
`).join('\n')}
`;
fs.writeFileSync(path.join(root, 'VOICE-SCRIPT.md'), voiceScript);

// Export SILENT-TIMING.md
const fmtTime = sec => {
  const m = Math.floor(sec / 60);
  const s = (sec % 60).toFixed(2).padStart(5, '0');
  return `${m}:${s}`;
};

const silentTiming = `# Silent Timing Reference Table

Generated: ${new Date().toISOString()} · Total Duration: ${duration.toFixed(2)}s

| Beat | ช่วง (Cue) | เริ่มต้น | สิ้นสุด | ความยาว (s) | บทพูด (Say) |
|---|---|---|---|---|---|
${beats.flatMap(b => b.segments.map(s => `| ${b.id} | ${s.cue} | ${fmtTime(s.start)} | ${fmtTime(s.start + s.duration)} | ${s.duration.toFixed(2)} | ${s.say} |`)).join('\n')}
`;
fs.writeFileSync(path.join(root, 'SILENT-TIMING.md'), silentTiming);

console.log(`[build.mjs] Built index.html successfully!`);
console.log(`[build.mjs] Total duration: ${duration.toFixed(2)}s (${(duration / 60).toFixed(2)} mins)`);
console.log(`[build.mjs] Audio mode: ${usedVoice}/${beats.length} beats with audio (Exact matches: ${exactBeats})`);

// EP06 video builder (Knowledge & RAG API walkthrough): timing.json -> index.html + VOICE-SCRIPT.md
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
    try {
      const out = execFileSync('python', ['-c', pyCode, p]).toString().trim();
      return Number(out);
    } catch {
      return null;
    }
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

// ---------- markup helpers ----------
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

const device = (id, w, h, showSecond = false) => `
  <div class="device" id="${id}" style="width:${w + 16}px">
    <div class="screen" style="width:${w}px;height:${h}px">
      <img src="assets/app-rag-upload.jpg" width="1440" height="1800" alt="หน้าจอจัดการคลังความรู้ (ภาพจำลอง)" data-layout-allow-overflow style="width:${w}px">
      <img class="img-a" src="assets/app-rag-test.jpg" width="1440" height="1800" alt="หน้าจอทดสอบค้นคืน (ภาพจำลอง)" data-layout-allow-overflow style="width:${w}px;${showSecond ? 'opacity:1;' : ''}">
    </div>
  </div>`;
const head = (id, n, verb, rest) => `<h1 class="heading">${n ? `<span class="num">${n}</span>` : ''}${verb}<small>${rest}</small></h1>`;

const k = s => `<span class="k">${s}</span>`;
const v = s => `<span class="v">${s}</span>`;
const lnx = (html, seg, d, cls = '') => `<div class="ln ${cls}" ${at(seg, d, 'left')}>${html}</div>`;
const COLORS = { 1: '#38815A', 2: '#8d732c', 3: '#1E7578' };

// overview strip shown during the three calls
const minimap = (n, verb, dest = 'LangMind') => `
  <div class="minimap" style="--c:${COLORS[n]}">
    <span class="mm-node srv">${ico('server')}หลังบ้าน${ico('lock', 'sm')}</span>
    <i class="mm-link"></i>
    <span class="mm-call">${n} · ${verb}</span>
    <i class="mm-link"></i>
    <span class="mm-node lm"><img src="assets/langmind-logo.png" width="689" height="606" alt="">${dest}</span>
  </div>`;

const scenes = {
  b1: `
    ${head('b1', '', 'อัปเดตความรู้ AI อัตโนมัติ', 'ทำได้ยังไง?')}
    <div class="place" style="left:242px;top:370px">${device('dev-b1', 580, 725)}</div>
    <img class="robot" src="assets/01-question.png" width="445" height="503" alt="" style="left:70px;top:1130px;width:190px" ${at(0, 0.4)}>
    <div class="tip" style="top:1170px;left:280px;right:70px" ${at(1, 0.2)}><b>คลังความรู้ร้านกาแฟ</b><br>ส่งโปรโมชันใหม่เข้า AI ได้ทันที<br>ไม่ต้องเข้าเว็บกดอัปโหลดเอง</div>
    <div class="qrow" style="top:1360px">
      <span class="qchip" ${at(2, 0.3, 'pop')}>เตรียมอะไร?</span>
      <span class="qchip" ${at(2, 0.9, 'pop')}>เชื่อมตรงไหน?</span>
      <span class="qchip" ${at(2, 1.5, 'pop')}>ใช้ผลยังไง?</span>
    </div>`,

  b2: `
    ${head('b2', '', 'ภาพรวมทั้งหมด', '3 ส่วนสำคัญ')}
    <div class="node wide" style="top:410px" ${at(0, 0.1)}>${ico('server', 'big')}<div><b>ระบบหลังบ้านของคุณ</b><span>ส่งไฟล์ · จัดการคลังข้อมูล</span></div><span class="badge haskey" ${at(0, 1.2, 'pop')}>${ico('lock')}Key</span></div>
    <div class="lane small" style="top:600px">
      <div class="lane-l" ${at(0, 0.6, 'left')}><b>ส่งเอกสาร</b></div>
      ${vArrow(150, at(0, 0.5))}
      ${vArrow(150, at(0, 0.9), true)}
      <div class="lane-r" ${at(0, 1.0)}><b>สถานะ indexed</b></div>
    </div>
    <div class="node wide lm" style="top:760px" ${at(0, 0.8)}><img src="assets/langmind-logo.png" width="689" height="606" alt="LangMind"><div><b>LangMind Knowledge</b><span>Datasets · Documents · RAG Search</span></div></div>
    <div class="lane small" style="top:950px">
      <div class="calls3" ${at(1, 0.2)}><span class="step s1" ${at(2, 0.2, 'pop')}>1 อัปโหลด</span><span class="step s2" ${at(2, 0.7, 'pop')}>2 ผูกคลัง</span><span class="step s3" ${at(2, 1.2, 'pop')}>3 ทดสอบค้นคืน</span></div>
      ${vArrow(150, at(1, 0.8))}
      ${vArrow(150, at(1, 1.2), true)}
      <div class="lane-r" ${at(1, 1.3)}><b>ดึงตอบคำถาม</b></div>
    </div>
    <div class="node wide" style="top:1110px" ${at(1, 0.4)}>${ico('bot', 'big')}<div><b>LangMind Agent</b><span>ผู้ช่วยตอบคำถามร้านกาแฟ</span></div></div>`,

  b3: `
    ${head('b3', '1', 'เตรียม', 'ต้องมี 3 อย่าง')}
    <div class="stack" style="top:410px">
      <div class="card" ${at(0, 0.2)}>
        <div class="card-h">${ico('bot', 'big')}<div><b>Agent ใน LangMind</b><span>ตั้งค่า RAG ไว้เรียบร้อย</span></div></div>
        <div class="chips"><span class="chip" ${at(0, 1.0, 'pop')}>${ico('book')}RAG Setting</span><span class="chip mono" ${at(0, 1.4, 'pop')}>rag: active</span></div>
        <div class="warn" ${at(1, 0.2)}><b>สำคัญ:</b> ไม่ได้ตั้งค่า RAG จะเรียกใช้งานไม่ได้ คืนรหัส <code>503 RAGFLOW_NOT_CONFIGURED</code></div>
      </div>
      <div class="card" ${at(2, 0.2)}>
        <div class="card-h">${ico('key', 'big')}<div><b>API Key (3 สิทธิ์)</b><span class="mono">lmpat_••••••••</span></div></div>
        <div class="chips">
          <span class="chip mono" ${at(2, 1.0, 'pop')}>knowledge:write</span>
          <span class="chip mono" ${at(2, 1.4, 'pop')}>knowledge:read</span>
          <span class="chip mono" ${at(2, 1.8, 'pop')}>agents:write</span>
        </div>
      </div>
      <div class="card" ${at(3, 0.2)}>
        <div class="card-h">${ico('server', 'big')}<div><b>ระบบหลังบ้าน (Server)</b><span>เก็บ Key ฝั่งเซิร์ฟเวอร์ · อัปโหลดไฟล์แทนหน้าเว็บ</span></div></div>
      </div>
    </div>`,

  b4: `
    ${head('b4', '2', 'เชื่อม', 'ครั้งที่ 1 · อัปโหลดเอกสาร')}
    ${minimap(1, 'อัปโหลด &amp; รอ indexed', 'Knowledge')}
    <div class="panel">
      <div class="slot-in" ${at(0, 0.2)}>
        <div class="chip in-chip">${ico('file')}<span><b>โปรโมชันเดือนนี้.pdf</b> · 200 KB</span></div>
      </div>
      ${vArrow(60, at(0, 0.6))}
      <div class="code" ${at(0, 0.8)}>
        <div class="code-head"><span class="method">POST</span><span class="scope">สิทธิ์ knowledge:write</span></div>
        <div class="code-path">/api/datasets/{id}/documents/upload</div>
        <div class="code-body">
          ${lnx(`Authorization: Bearer ${v('$LM_TOKEN')}`, 0, 1.0)}
          ${lnx(`-F ${v('file=@โปรโมชันเดือนนี้.pdf')}`, 0, 1.2)}
          ${lnx(`-F ${v('dataset_id="ds_5e2a..."')}`, 0, 1.4)}
        </div>
        <div class="code-foot">HTTP 202 Accepted · การจัดทำดัชนีทำงานเบื้องหลัง</div>
      </div>
      ${vArrow(60, at(1, 0.3))}
      <div class="slot-out" ${at(1, 0.5)}>
        <div class="chip out-chip json">
          { ${k('"status"')}: ${v('"pending"')}, ${k('"document_id"')}: ${v('"doc_8x1"')} }
          <em>จัดทำดัชนีเบื้องหลัง (Background indexing)</em>
        </div>
      </div>
      <div class="code" style="margin-top:10px" ${at(2, 0.2)}>
        <div class="code-head"><span class="method" style="background:#1E7578">GET</span><span class="scope">สิทธิ์ knowledge:read</span></div>
        <div class="code-path">/api/documents/doc_8x1</div>
        <div class="chips" style="margin-top:8px">
          <span class="chip mono" style="opacity:0.6">pending</span>
          <span class="chip mono" style="opacity:0.8">processing</span>
          <span class="chip mono" style="background:#38815A;color:#fff"><span class="mark" data-mark="2" data-mark-at="0.6"></span>indexed ✓</span>
        </div>
      </div>
    </div>
    <img class="robot" src="assets/21-carry-books.png" width="445" height="503" alt="" style="right:70px;top:1320px;width:170px" ${at(0, 0.4)}>`,

  b5: `
    ${head('b5', '2', 'เชื่อม', 'ครั้งที่ 2 · ผูกคลังเข้ากับ Agent')}
    ${minimap(2, 'ผูกคลังข้อมูล', 'Agent')}
    <div class="panel">
      <div class="slot-in" ${at(0, 0.2)}>
        <div class="chip in-chip">${ico('db')}<span><b>dataset_id</b>: "ds_5e2a..." (คลังที่ indexed แล้ว)</span></div>
      </div>
      ${vArrow(70, at(0, 0.6))}
      <div class="code" ${at(0, 0.8)}>
        <div class="code-head"><span class="method" style="background:#8d732c">PUT</span><span class="scope">สิทธิ์ agents:write</span></div>
        <div class="code-path">/api/agents/{id}/datasets</div>
        <div class="code-body">
          ${lnx(`Content-Type: application/json`, 0, 1.0)}
          ${lnx(`${k('"dataset_ids"')}: [${v('"ds_5e2a..."')}],`, 0, 1.2)}
          ${lnx(`<span class="mark" data-mark="1" data-mark-at="0.2"></span>${k('"weight"')}: ${v('1.0')}`, 1, 0.1, 'hl')}
        </div>
        <div class="code-foot">กำหนดค่าน้ำหนัก weight เพื่อให้ Agent ดึงคลังนี้ตอบคำถาม</div>
      </div>
      ${vArrow(70, at(1, 0.4))}
      <div class="slot-out" ${at(1, 0.6)}>
        <div class="chip out-chip json">
          { ${k('"agent_id"')}: ${v('"ag_cafe01"')}, ${k('"datasets_count"')}: ${v('1')}, ${k('"status"')}: ${v('"bound"')} }
          <em>ผูกคลังเข้ากับ Agent เรียบร้อย พร้อมตอบ</em>
        </div>
      </div>
    </div>`,

  b6: `
    ${head('b6', '2', 'เชื่อม', 'ครั้งที่ 3 · ทดสอบค้นคืน')}
    ${minimap(3, 'ทดสอบค้นคืน (ไม่เรียก LLM)', 'RAG')}
    <div class="group" data-out="2" data-out-at="0">
      <div class="panel">
        <div class="slot-in" ${at(0, 0.2)}>
          <div class="chip in-chip">${ico('search')}<span>คำค้น: <b>“โปรโมชันอเมริกาโน่”</b></span></div>
        </div>
        ${vArrow(60, at(1, 0.2))}
        <div class="code" ${at(1, 0.4)}>
          <div class="code-head"><span class="method" style="background:#1E7578">POST</span><span class="scope">สิทธิ์ knowledge:read</span></div>
          <div class="code-path">/api/retrieval/test</div>
          <div class="code-body">
            ${lnx(`${k('"agent_id"')}: ${v('"ag_cafe01"')},`, 1, 0.6)}
            ${lnx(`${k('"query"')}: ${v('"โปรโมชันอเมริกาโน่"')}`, 1, 0.8)}
          </div>
          <div class="code-foot">ทดสอบค้นคืนโดยตรง ไม่เสียโควตาเรียกโมเดลภาษา (LLM)</div>
        </div>
        ${vArrow(60, at(1, 1.2))}
        <div class="slot-out" ${at(1, 1.4)}>
          <div class="chip out-chip json">
            { ${k('"document_name"')}: ${v('"โปรโมชันเดือนนี้.pdf"')},<br>
              &nbsp;&nbsp;${k('"content"')}: ${v('"อเมริกาโน่เย็น ซื้อ 2 แก้ว ลด 20 บาท"')},<br>
              &nbsp;&nbsp;${k('"score"')}: ${v('0.84')} }
            <em>*score คือค่าความคล้าย (similarity) ไม่ใช่ % ความถูกต้อง</em>
          </div>
        </div>
      </div>
    </div>
    <div class="place" style="left:270px;top:470px" ${at(2, 0.2)}>${device('dev-b6', 524, 655, true)}</div>
    <img class="robot" src="assets/11-reading.png" width="445" height="503" alt="" style="left:50px;top:1180px;width:200px" ${at(2, 0.5)}>
    <div class="tip" style="top:1200px;left:270px;right:70px" ${at(2, 0.7)}><b>พบเนื้อหาตรงจุด:</b><br>โปรโมชันอเมริกาโน่ ในหน้า 1<br>ค่า score: 0.84 (ไม่เสียค่า LLM)</div>`,

  b7: `
    ${head('b7', '3', 'ใช้ผล', 'ต่อยอดการใช้งานคลังความรู้')}
    <div class="stack" style="top:410px">
      <div class="use" ${at(0, 0.3, 'left')}>
        ${ico('check', 'big')}
        <div><b>เช็กคุณภาพเอกสารก่อนเปิดจริง</b><span>ยิง retrieval/test ตรวจว่า AI ดึงถูกท่อนไหม โดยไม่ต้องเปลืองโทเค็น</span></div>
      </div>
      <div class="use" ${at(1, 0.1, 'left')}>
        ${ico('upload', 'big')}
        <div><b>นำเข้าได้หลายรูปแบบ</b><span><code>upload-batch</code> รวมไม่เกิน 50 MB · ดึงจาก <code>/url</code> · <code>/text</code> · <code>/crawl</code></span></div>
      </div>
      <div class="use" ${at(2, 0.1, 'left')}>
        ${ico('spark', 'big')}
        <div><b>เข้าใจค่า Score ให้ถูกต้อง</b><span>score = ค่าความคล้ายในการค้นคืน ไม่ใช่เปอร์เซ็นต์ความถูกต้องของคำตอบ</span></div>
      </div>
    </div>
    <img class="robot" src="assets/01-question.png" width="445" height="503" alt="" style="left:60px;top:1120px;width:180px" ${at(3, 0.1)}>
    <div class="tip" style="top:1130px;left:260px;right:70px" ${at(3, 0.3, 'left')}><b>ข้อควรจำ:</b><br>คลังข้อมูลขนาดใหญ่ควรแบ่งเป็นหมวดหมู่<br>และกำหนดค่าน้ำหนัก <code>weight</code> ให้เหมาะกับ Agent</div>`,

  b8: `
    ${head('b8', '', 'สรุป', 'เตรียม → เชื่อม 3 ขั้น → ใช้ผล')}
    <div class="stack" style="top:410px">
      ${[
        ['1', 'เตรียม', '#38815A', ['Agent (ตั้งค่า RAG)', 'API Key (3 สิทธิ์)', 'ระบบหลังบ้าน']],
        ['2', 'เชื่อม', '#8d732c', ['อัปโหลด', '→', 'ผูก Agent', '→', 'ทดสอบค้นคืน']],
        ['3', 'ใช้ผล', '#1E7578', ['เช็กคุณภาพ', 'upload-batch ≤ 50MB', 'score = ความคล้าย']],
      ].map(([n, t, c, items], i) => `
        <div class="recap" style="--c:${c}" ${at(i, 0.1)}>
          <span class="recap-t"><b>${n}</b>${t}</span>
          <div class="chips">${items.map((x, j) => x === '→' ? `<i class="arr" ${at(i, 0.4 + j * 0.25)}>→</i>` : `<span class="chip" ${at(i, 0.4 + j * 0.25, 'pop')}>${x}</span>`).join('')}</div>
        </div>`).join('')}
    </div>
    <img class="robot" src="assets/10-thumbs-up.png" width="425" height="503" alt="" style="left:410px;top:1160px;width:260px" ${at(2, 1.2)}>`,

  b9: `
    <div class="sponsor">
      <div class="sp-by" ${at(0, 0.2)}>สนับสนุนโดย</div>
      <img class="sp-logo" src="assets/langmind-logo.png" width="689" height="606" alt="LangMind" ${at(0, 0.5, 'pop')}>
      <div class="sp-url" ${at(1, 0.3, 'pop')}>langmind.in.th</div>
      <div class="chips sp-chips" ${at(1, 0.9)}><span class="chip">Agent</span><span class="chip">Knowledge API</span><span class="chip">Retrieval RAG</span></div>
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
<title>EP06 · Knowledge &amp; Datasets API</title>
<link rel="stylesheet" href="style.css">
<script src="assets/gsap.min.js"></script>
</head>
<body>
<main id="film" data-composition-id="ep06-knowledge-rag" data-width="1080" data-height="1920" data-fps="${cfg.fps}" data-duration="${duration}">
  <div class="kicker">EP06 &nbsp;/&nbsp; KNOWLEDGE RAG</div>
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
fs.writeFileSync(path.join(root, 'VOICE-SCRIPT.md'), `# EP06 — บทสำหรับสร้างเสียง\n\nรัน \`python make-voice-samples.py\` แล้ว \`node build.mjs\`\n\n${vo}`);
console.log(`${beats.length} beats, ${beats.reduce((n, b) => n + b.segments.length, 0)} captions, ${duration.toFixed(2)} s, timing from ${usedVoice ? `${usedVoice} voice file(s), ${exactBeats} with exact caption cuts` : 'estimated reading time (no voice yet)'}`);

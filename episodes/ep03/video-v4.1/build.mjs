// EP03 video-v4.1 builder (Chat API). Modelled on EP04 v3 Orus architecture.
// Run from this folder: node build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const cfg = JSON.parse(fs.readFileSync(path.join(root, 'timing.json'), 'utf8'));
const esc = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const fr = t => Math.round(t * cfg.fps) / cfg.fps;
const len = s => [...s.replace(/\s+/g, '')].length;

function audioSeconds(rel) {
  let p = path.join(root, rel);
  if (!fs.existsSync(p)) {
    const alt = p.endsWith('.wav') ? p.replace(/\.wav$/, '.mp3') : p.replace(/\.mp3$/, '.wav');
    if (fs.existsSync(alt)) p = alt;
    else return null;
  }
  try {
    const out = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p]).toString().trim();
    return Number(out);
  } catch {
    return null;
  }
}

let t = cfg.lead_in;
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

  const segments = b.segments.map((s, i) => ({
    ...s,
    start: fr(t + cuts[i]),
    duration: fr(cuts[i + 1] - cuts[i])
  }));

  const beat = { id: b.id, voice: audio ? b.voice : null, start: fr(t), duration: fr(dur), segments };
  t += dur + cfg.beat_gap + (b.hold || 0);
  return beat;
});

const duration = fr(t - cfg.beat_gap + cfg.tail);

// Markup helpers
const I = {
  chat: '<path d="M4 5.5h16v10H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/>',
  phone: '<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>',
  server: '<rect x="3.5" y="4" width="17" height="6.5" rx="1.5"/><rect x="3.5" y="13.5" width="17" height="6.5" rx="1.5"/><path d="M7 7.2h.01M7 16.7h.01M11 7.2h6M11 16.7h6"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l8.5-8.5M16 7l2.5 2.5M14 9l2 2"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
  bot: '<rect x="4" y="7" width="16" height="12" rx="3"/><path d="M12 3.5V7M9 12.5h.01M15 12.5h.01M9.5 16h5"/>',
  book: '<path d="M4 5.5A2 2 0 0 1 6 3.5h12v15H6a2 2 0 0 0-2 2z"/><path d="M4 20.5V5.5M8 8h7M8 11.5h7"/>',
  play: '<circle cx="12" cy="12" r="9"/><path class="fill" d="M10 8.5l5.5 3.5-5.5 3.5z"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
  thumbs: '<path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>'
};

const ico = (n, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24">${I[n] || I.chat}</svg>`;
const at = (k, d = 0.1, anim = 'up') => `data-in="${k}" data-at="${d}" data-anim="${anim}"`;
const vArrow = (h, attrs = '', flip = false) =>
  `<svg class="varrow${flip ? ' up' : ''}" ${attrs} viewBox="0 0 60 ${h}" style="height:${h}px"><path pathLength="1" d="M30 6 V${h - 14} M14 ${h - 28} L30 ${h - 10} L46 ${h - 28}"/><circle class="dot" cx="30" cy="10" r="7" data-y0="10" data-y1="${h - 22}"/></svg>`;

const device = (id, w, h) => `
  <div class="device" id="${id}" style="width:${w + 16}px">
    <div class="screen" style="width:${w}px;height:${h}px">
      <img src="assets/app-chat-q.jpg" width="1160" height="1304" alt="หน้าจอลูกค้าพิมพ์ขอร่างข้อความ" style="width:${w}px">
      <img class="img-a" src="assets/app-chat-a.jpg" width="1160" height="1304" alt="หน้าจอแชทถามต่อและปรับสั้นลง" style="width:${w}px">
    </div>
  </div>`;

const head = (id, n, verb, rest) => `<h1 class="heading">${n ? `<span class="num">${n}</span>` : ''}${verb}<small>${rest}</small></h1>`;

const COLORS = { 1: '#38815A', 2: '#8d732c', 3: '#1E7578' };

const minimap = (n, stepLabel) => `
  <div class="minimap" style="--c:${COLORS[n]}">
    <span class="mm-node">${ico('phone')}แอป</span>
    <i class="mm-link"></i>
    <span class="mm-node srv">${ico('server')}หลังบ้าน${ico('lock', 'sm')}</span>
    <span class="mm-call">${stepLabel}</span>
    <span class="mm-node lm"><img src="assets/langmind-logo.png" width="689" height="606" alt="">LangMind</span>
  </div>`;

const scenes = {
  b1: `
    ${head('b1', '', 'แอปที่คุยด้วยแชท', 'ทำได้ยังไง?')}
    <div class="place" style="left:242px;top:370px">${device('dev-b1', 580, 652)}</div>
    <div class="qrow" style="top:1280px">
      <span class="qchip" ${at(2, 0.4, 'pop')}>เตรียมอะไร?</span>
      <span class="qchip" ${at(2, 1.0, 'pop')}>เชื่อมตรงไหน?</span>
      <span class="qchip" ${at(2, 1.6, 'pop')}>ส่งคำขอยังไง?</span>
    </div>`,

  b2: `
    ${head('b2', '', 'ภาพรวมทั้งหมด', 'API คืออะไร · ใครคุยกับใคร')}
    <div class="group" data-out="1" data-out-at="0">
      <div class="node" style="top:430px" ${at(0, 0.1, 'up')}>${ico('phone', 'big')}<div><b>แอปของคุณ</b><span class="alias" ${at(0, 1.2, 'left')}>= พนักงานหน้าร้าน</span></div></div>
      <div class="lane" style="top:640px">
        <div class="lane-l" ${at(0, 0.5, 'left')}><b>ส่งคำขอ</b><span ${at(0, 1.5, 'up')}>ส่งคำถาม</span></div>
        <svg class="varrow" ${at(0, 0.4, 'up')} viewBox="0 0 60 250" style="height:250px"><path pathLength="1" d="M30 6 V236 M14 222 L30 240 L46 222"/><circle class="dot" cx="30" cy="10" r="7" data-y0="10" data-y1="228"/></svg>
        <svg class="varrow up" ${at(0, 0.8, 'up')} viewBox="0 0 60 250" style="height:250px"><path pathLength="1" d="M30 6 V236 M14 222 L30 240 L46 222"/><circle class="dot" cx="30" cy="10" r="7" data-y0="10" data-y1="228"/></svg>
        <div class="lane-r" ${at(0, 0.9, 'up')}><b>รับผลลัพธ์</b><span ${at(0, 1.8, 'up')}>รับคำตอบ</span></div>
      </div>
      <div class="node lm" style="top:910px" ${at(0, 0.7, 'up')}><img src="assets/langmind-logo.png" width="689" height="606" alt="LangMind"><div><b>LangMind</b><span class="alias" ${at(0, 1.4, 'left')}>= ครัว / สมอง</span></div></div>
    </div>
    <div class="node wide" style="top:400px" ${at(1, 0.2, 'up')}>${ico('phone', 'big')}<div><b>แอปมือถือ / Frontend</b><span>รับคำถาม · แสดงผลแชท</span></div></div>
    <div class="lane small" style="top:590px">
      <div class="lane-l" ${at(1, 0.5, 'left')}><b>คำถาม</b></div>
      <svg class="varrow" ${at(1, 0.4, 'up')} viewBox="0 0 60 140" style="height:140px"><path pathLength="1" d="M30 6 V126 M14 112 L30 130 L46 112"/><circle class="dot" cx="30" cy="10" r="7" data-y0="10" data-y1="118"/></svg>
      <svg class="varrow up" ${at(1, 0.7, 'up')} viewBox="0 0 60 140" style="height:140px"><path pathLength="1" d="M30 6 V126 M14 112 L30 130 L46 112"/><circle class="dot" cx="30" cy="10" r="7" data-y0="10" data-y1="118"/></svg>
      <div class="lane-r" ${at(1, 0.8, 'up')}><b>คำตอบ</b></div>
    </div>
    <div class="node wide" style="top:740px" ${at(1, 0.8, 'up')}>${ico('server', 'big')}<div><b>ระบบหลังบ้านของคุณ (Backend)</b><span>เก็บ API Key ปลอดภัย</span></div><span class="badge haskey" ${at(1, 1.2, 'pop')}>${ico('lock')}Key</span></div>
    <div class="lane small" style="top:930px">
      <div class="calls3" ${at(2, 0.2, 'up')}><span class="step s1" ${at(2, 0.4, 'pop')}>1 ส่งคำขอ</span><span class="step s2" ${at(2, 0.8, 'pop')}>2 สตรีมผล</span><span class="step s3" ${at(2, 1.2, 'pop')}>3 คุยต่อ</span></div>
      <svg class="varrow" ${at(1, 1.3, 'up')} viewBox="0 0 60 140" style="height:140px"><path pathLength="1" d="M30 6 V126 M14 112 L30 130 L46 112"/><circle class="dot" cx="30" cy="10" r="7" data-y0="10" data-y1="118"/></svg>
      <svg class="varrow up" ${at(1, 1.5, 'up')} viewBox="0 0 60 140" style="height:140px"><path pathLength="1" d="M30 6 V126 M14 112 L30 130 L46 112"/><circle class="dot" cx="30" cy="10" r="7" data-y0="10" data-y1="118"/></svg>
      <div class="lane-r" ${at(1, 1.6, 'up')}><b>ผลลัพธ์</b></div>
    </div>
    <div class="node wide lm" style="top:1080px" ${at(1, 1.7, 'up')}><img src="assets/langmind-logo.png" width="689" height="606" alt="LangMind"><div><b>LangMind Chat API</b><span>Agent · Server-Sent Events</span></div></div>`,

  b3: `
    ${head('b3', '1', 'เตรียม', 'ต้องมี 3 อย่าง')}
    <div class="stack" style="top:410px">
      <div class="card" ${at(0, 0.2, 'up')}>
        <div class="card-h">${ico('bot', 'big')}<div><b>Agent ใน LangMind</b><span>ตั้งค่า Prompt & ข้อมูลร้าน</span></div></div>
        <div class="chips"><span class="chip" ${at(0, 0.8, 'pop')}>${ico('book')}คำแนะนำ</span><span class="chip" ${at(0, 1.2, 'pop')}>${ico('book')}คลังความรู้</span></div>
        <div class="setting" ${at(0, 1.5, 'up')}>
          <span class="setting-l">บันทึก Agent → <b>กด Publish</b></span>
          <span class="switch" data-toggle="0" data-toggle-at="1.8"><i></i></span>
          <span class="badge pub" ${at(0, 2.2, 'pop')}>publish ✓</span>
        </div>
      </div>
      <div class="card" ${at(1, 0.2, 'up')}>
        <div class="card-h">${ico('key', 'big')}<div><b>Personal API Key</b><span class="mono">lmpat_••••••••</span></div></div>
        <div class="chips"><span class="chip mono" ${at(1, 0.8, 'pop')}>chat:invoke</span></div>
      </div>
      <div class="card" ${at(2, 0.2, 'up')}>
        <div class="card-h">${ico('server', 'big')}<div><b>ระบบหลังบ้าน (Backend Server)</b><span>เก็บ Key เป็น Secret · ป้องกันรั่วไหลสู่ Client</span></div></div>
      </div>
    </div>`,

  b4: `
    ${head('b4', '2', 'เชื่อม', 'กลุ่มที่ 1 · ส่งข้อความ')}
    ${minimap(1, '1 · ส่งข้อความ')}
    <div class="calls">
      <div class="call" style="--c:#38815A" ${at(0, 0.2, 'up')}>
        <div class="call-h"><span class="call-n">POST</span><code>/api/chat/message</code></div>
        <div class="call-b">
          <div class="io in"><b>SSE Stream (ค่าเริ่มต้น)</b><small>ทยอยสตรีมคำตอบกลับมาแบบ real-time เหมาะกับหน้าจอแชท</small></div>
        </div>
      </div>
      <div class="call" style="--c:#8d732c" ${at(1, 0.2, 'up')}>
        <div class="call-h"><span class="call-n" style="background:#8d732c">POST</span><code>/api/chat/message/blocking</code></div>
        <div class="call-b">
          <div class="io in"><b>JSON ก้อนเดียว (Blocking)</b><small>รอประมวลผลจนเสร็จสมบูรณ์ แล้วส่งคำตอบเต็มกลับครั้งเดียว</small></div>
        </div>
      </div>
      <div class="card" style="margin-top:10px" ${at(2, 0.2, 'up')}>
        <div class="chips" style="margin-top:0">
          <span class="chip mono">POST /api/chat/preview (Builder)</span>
          <span class="chip mono">POST /messages/{id}/stop (สั่งหยุด)</span>
        </div>
      </div>
    </div>`,

  b5: `
    ${head('b5', '2', 'เชื่อม', 'กลุ่มที่ 2 · จัดการประวัติ')}
    ${minimap(2, '2 · จัดการห้องแชท')}
    <div class="stack" style="top:460px">
      <div class="card" ${at(0, 0.2, 'up')}>
        <div class="card-h"><b>1. เรียกอ่านประวัติบทสนทนา</b></div>
        <div class="chips">
          <span class="chip mono">GET /api/chat/conversations</span>
          <span class="chip mono">GET /api/chat/conversations/{id}</span>
          <span class="chip mono">GET /api/chat/conversations/{id}/messages</span>
        </div>
        <div class="warn" style="background:#fff2d6;color:#8d6010;margin-top:14px">⚠️ ทุกเส้นต้องระบุ agent_id เสมอเพื่อยืนยันสิทธิ์</div>
      </div>
      <div class="card" ${at(1, 0.2, 'up')}>
        <div class="card-h"><b>2. แก้ไขชื่อห้อง และลบประวัติ</b></div>
        <div class="chips">
          <span class="chip mono">PATCH /api/chat/conversations/{id} (เปลี่ยนชื่อ)</span>
          <span class="chip mono" style="color:#a83232">DELETE /api/chat/conversations/{id} (ลบถาวร)</span>
        </div>
        <div class="warn">⚠️ DELETE เป็นการลบถาวร ไม่สามารถกู้คืนได้ ควรถามยืนยันผู้ใช้</div>
      </div>
    </div>`,

  b6: `
    ${head('b6', '2', 'เชื่อม', 'กลุ่มที่ 3 · ส่วนเสริม')}
    ${minimap(3, '3 · Feedback & Files')}
    <div class="stack" style="top:460px">
      <div class="card" ${at(0, 0.2, 'up')}>
        <div class="card-h"><b>1. ให้คะแนนประเมินคำตอบ (Feedback)</b></div>
        <div class="chips">
          <span class="chip mono">POST /api/chat/messages/{id}/feedback</span>
          <span class="chip">👍 rating: 1</span>
          <span class="chip">👎 rating: -1</span>
        </div>
      </div>
      <div class="card" ${at(1, 0.2, 'up')}>
        <div class="card-h"><b>2. ดาวน์โหลดไฟล์ที่ Agent สร้างขึ้น</b></div>
        <div class="chips">
          <span class="chip mono">GET /api/chat/messages/{id}/generated-files/{file_id}</span>
          <span class="chip">${ico('file')}PDF, Excel, ภาพ</span>
        </div>
        <div class="chips" style="margin-top:16px">
          <span class="chip" style="background:#e4ede6;color:#2f5e46">✓ ทุก Endpoint ใช้สิทธิ์ Scope: chat:invoke</span>
        </div>
      </div>
    </div>`,

  b7: `
    ${head('b7', '3', 'ลองส่ง', 'ยิงคำขอแรกด้วย cURL')}
    ${minimap(1, '1 · ส่งคำขอแรก')}
    <div class="panel">
      <div class="slot-in" ${at(0, 0.2, 'up')}><div class="chip in-chip"><span>💬 ช่วยร่างข้อความแจ้งทีมว่าเลื่อนประชุมเป็น 15:00 น. ให้สุภาพ</span></div></div>
      ${vArrow(60, at(0, 0.6, 'up'))}
      <div class="code" ${at(0, 0.8, 'up')}>
        <div class="code-head"><span class="method">POST</span><span class="scope">chat:invoke</span></div>
        <div class="code-path">/api/chat/message</div>
        <div class="code-body">
          <div class="ln" ${at(0, 1.0, 'left')}>Authorization: Bearer <span class="v">$LM_TOKEN</span></div>
          <div class="ln" ${at(0, 1.2, 'left')}>Content-Type: application/json</div>
          <div class="ln" ${at(1, 0.2, 'left')}>--data '{<span class="k">"agent_id"</span>: <span class="v">"&lt;AGENT_ID&gt;"</span>,</div>
          <div class="ln" ${at(1, 0.5, 'left')}>  <span class="k">"query"</span>: <span class="v">"ช่วยร่างข้อความ..."</span>,</div>
          <div class="ln" ${at(1, 0.8, 'left')}><span class="mark" data-mark="1" data-mark-at="1.0"></span>  <span class="k">"conversation_id"</span>: <span class="v" style="color:#d9822b;font-weight:700">null</span> }'</div>
        </div>
        <div class="code-foot">💡 ส่ง "conversation_id": null เพื่อเริ่มบทสนทนาใหม่</div>
      </div>
    </div>`,

  b8: `
    ${head('b8', '3', 'ลองส่ง', 'รับผลแบบ SSE Stream')}
    ${minimap(2, '2 · อ่านผลสตรีม')}
    <div class="stack" style="top:450px">
      <div class="card" ${at(0, 0.2, 'up')}>
        <div class="card-h"><b>event: message_start</b></div>
        <div class="chip mono" style="margin-top:6px">{ "conversation_id": "conv_123", "message_id": "msg_01" }</div>
      </div>
      <div class="card" ${at(1, 0.2, 'up')}>
        <div class="card-h"><b>event: message</b></div>
        <div class="chip mono" style="margin-top:6px">{ "answer": "ขอแจ้งเลื่อนประชุมเป็นเวลา 15:00 น. ขอบคุณครับ" }</div>
      </div>
      <div class="card" ${at(2, 0.2, 'up')}>
        <div class="card-h"><b>event: message_end</b></div>
        <div class="chip mono" style="margin-top:6px">{ "answer": "...", "usage": { "total_tokens": 78 } }</div>
      </div>
      <div class="slot-out" ${at(2, 0.6, 'up')}><div class="chip out-chip ok"><span>✓ แอปนำข้อความคำตอบไปแสดงผล และเก็บ conversation_id ไว้</span></div></div>
    </div>`,

  b9: `
    ${head('b9', '3', 'ลองส่ง', 'คุยต่อในเรื่องเดิม')}
    ${minimap(3, '3 · ถามต่อ')}
    <div class="panel">
      <div class="slot-in" ${at(0, 0.2, 'up')}><div class="chip in-chip cont"><span>💬 ขอให้สั้นลงอีกนิด (ถามต่อ)</span></div></div>
      ${vArrow(60, at(0, 0.6, 'up'))}
      <div class="code" ${at(0, 0.8, 'up')}>
        <div class="code-head"><span class="method">POST</span><span class="scope">chat:invoke</span></div>
        <div class="code-path">/api/chat/message</div>
        <div class="code-body">
          <div class="ln">--data '{<span class="k">"agent_id"</span>: <span class="v">"&lt;AGENT_ID&gt;"</span>,</div>
          <div class="ln">  <span class="k">"query"</span>: <span class="v">"ขอให้สั้นลงอีกนิด"</span>,</div>
          <div class="ln"><span class="mark" data-mark="0" data-mark-at="1.0"></span>  <span class="k">"conversation_id"</span>: <span class="v" style="color:#1E7578;font-weight:700">"conv_123"</span> }'</div>
        </div>
      </div>
      ${vArrow(60, at(1, 0.2, 'up'))}
      <div class="slot-out" ${at(1, 0.4, 'up')}><div class="chip out-chip ok"><span>Agent: “ประชุมเลื่อนเป็น 15:00 น. นะครับ”</span></div></div>
    </div>`,

  b10: `
    ${head('b10', '', 'สรุปภาพรวม', '3 หัวใจสำคัญ & LangMind')}
    <div class="stack" style="top:410px">
      <div class="recap" style="--c:#38815A" ${at(0, 0.2, 'up')}>
        <div class="recap-t"><b>1</b>เลือก Endpoint ให้ตรงงาน</div>
        <div class="desc">ใช้ SSE Stream สำหรับแชทสด · ใช้ Blocking เมื่อต้องการรับ JSON ก้อนเดียว</div>
      </div>
      <div class="recap" style="--c:#8d732c" ${at(0, 0.8, 'up')}>
        <div class="recap-t"><b>2</b>ปลอดภัยที่ระบบหลังบ้าน</div>
        <div class="desc">เก็บ Personal API Key ฝั่ง Server เท่านั้น · ทุก Endpoint ใช้ scope chat:invoke</div>
      </div>
      <div class="recap" style="--c:#1E7578" ${at(0, 1.4, 'up')}>
        <div class="recap-t"><b>3</b>ส่ง conversation_id เพื่อคุยต่อ</div>
        <div class="desc">ส่ง null เพื่อเริ่มใหม่ · ส่ง ID เดิมเมื่อต้องการคุยต่อในเรื่องเดิม</div>
      </div>
    </div>
    <div class="sponsor" ${at(1, 0.2, 'up')}>
      <div class="sp-by">สนับสนุนโดย</div>
      <img class="sp-logo" src="assets/langmind-logo.png" width="689" height="606" alt="LangMind">
      <div class="sp-url">langmind.in.th</div>
    </div>
    <img class="robot" src="assets/10-thumbs-up.png" style="right:80px;bottom:380px;width:240px" ${at(1, 0.6, 'pop')}>`
};

const stageScenes = beats.map(b => `
  <section class="scene" id="sc-${b.id}">
    ${scenes[b.id] || ''}
  </section>`).join('\n');

const captionDivs = beats.flatMap(b =>
  b.segments.map((s, i) =>
    `<div id="cap-${b.id}-${i}" class="clip caption" data-start="${s.start}" data-duration="${s.duration}" data-track-index="8" data-layout-allow-caption-zone>${esc(s.cap).replace(/\n/g, '<br>')}</div>`
  )
).join('\n');

const audioTags = beats.filter(b => b.voice).map(b =>
  `<audio id="vo-${b.id}" class="clip" data-start="${b.start}" data-duration="${b.duration}" data-track-index="9" src="${esc(b.voice)}"></audio>`
).join('\n');

const filmData = JSON.stringify({ fps: cfg.fps, duration, beats }, null, 2);

const html = `<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8">
<title>EP03 · Chat API · video-v4.1</title>
<link rel="stylesheet" href="style.css">
<script src="assets/gsap.min.js"></script>
</head>
<body>
<main id="film" data-composition-id="ep03-chat-v41" data-width="1080" data-height="1920" data-fps="30" data-duration="${duration}">
  <div class="kicker">EP03 &nbsp;/&nbsp; CHAT API</div>
  <div class="note">ภาพจำลอง</div>
  <section id="stage" class="clip" data-start="0" data-duration="${duration}" data-track-index="1">
    <div class="spine"><span id="sp1" class="pill">1 เข้าใจ</span><i></i><span id="sp2" class="pill">2 รู้จัก API</span><i></i><span id="sp3" class="pill">3 ลองส่ง</span></div>
${stageScenes}
  </section>
${captionDivs}
${audioTags}
</main>
<script>
window.FILM = ${filmData};
</script>
<script src="motion.js"></script>
</body>
</html>`;

fs.writeFileSync(path.join(root, 'index.html'), html, 'utf8');

// Also write VOICE-SCRIPT.md
const voiceScript = `# EP03 v4.1 — Voice Script & Timing

ความยาวโดยประมาณ: ${duration.toFixed(1)} วินาที (${beats.length} beats, ${captionDivs.split('\n').length} captions)

${beats.map(b => `## ${b.id.toUpperCase()} (เริ่ม ${b.start.toFixed(1)}s, ยาว ${b.duration.toFixed(1)}s)
${b.segments.map(s => `- [${s.start.toFixed(1)}s - ${(s.start + s.duration).toFixed(1)}s] **พากย์:** ${s.say}\n  **ซับ:** ${s.cap.replace(/\n/g, ' ')}`).join('\n\n')}
`).join('\n')}
`;

fs.writeFileSync(path.join(root, 'VOICE-SCRIPT.md'), voiceScript, 'utf8');
console.log(`Built EP03 video-v4.1: ${beats.length} beats, duration ${duration.toFixed(2)}s @ ${cfg.fps}fps`);

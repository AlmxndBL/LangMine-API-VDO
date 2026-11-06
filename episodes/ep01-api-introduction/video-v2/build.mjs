import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const timing = JSON.parse(fs.readFileSync(path.join(root, 'timing.json'), 'utf8'));
const esc = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
const device = (image, cls = '') => `<div class="device ${cls}"><div class="browser-bar"><i></i><i></i><i></i><span>แอปของเรา</span></div><div class="screen-slot"><img src="assets/${image}" width="1122" height="1402" alt="หน้าจอแอปสมมติ"></div></div>`;
const box = (text, sub = '', cls = '') => `<div class="diagram-box ${cls}"><strong>${text}</strong>${sub ? `<small>${sub}</small>` : ''}</div>`;
const flow = (direction = 'out') => `<div class="pipeline ${direction}">
${box('หน้าจอแอป', 'ผู้ใช้พิมพ์ / อ่านคำตอบ', 'flow-screen')}
<svg class="link l1" viewBox="0 0 100 100"><path d="M40 5 Q25 47 50 85 M30 65 L50 85 L62 60"/></svg>
${box('ระบบของแอป', 'เชื่อมต่อ • เก็บกุญแจอย่างปลอดภัย', 'flow-app')}
<svg class="link l2" viewBox="0 0 100 100"><path d="M40 5 Q25 47 50 85 M30 65 L50 85 L62 60"/></svg>
${box('LangMind', 'ผู้ช่วย AI ที่ตั้งค่าไว้', 'flow-service')}
<div class="traveler">${direction === 'out' ? 'คำถาม' : 'ข้อมูลคำตอบ'}</div></div>`;

const content = {
  hook: `${device('app-q-v1.png', 'hook-device')}<div class="behind piece">มีบริการอีกแห่ง<br>ช่วยอยู่เบื้องหลัง</div>`,
  connect: `<div class="two-systems"><div class="app-system piece">${box('แอปของเรา', 'สิ่งที่ผู้ใช้เปิดใช้งาน')}</div><svg class="bridge" viewBox="0 0 800 220"><path d="M70 100 C220 0 570 0 725 100 M700 70 L725 100 L690 115"/><path class="back" d="M725 160 C550 250 240 250 70 160 M90 145 L70 160 L100 185"/></svg><div class="other-system piece">${box('บริการผู้ช่วย', 'ความสามารถที่เราเรียกใช้')}</div></div><div class="explain-note piece">แยกกันทำงาน<br><b>เชื่อมต่อกันได้</b></div>`,
  api: `<div class="api-systems">${box('แอป', '', 'piece')}${box('อีกบริการ', '', 'piece')}</div><div class="api-link"><span>ส่งคำขอ</span><svg viewBox="0 0 800 170"><path d="M30 40 L760 40 M735 15 L760 40 L735 65"/><path class="back" d="M760 120 L30 120 M55 95 L30 120 L55 145"/></svg><span>รับข้อมูลกลับ</span></div><div class="contract piece"><b>กติกาที่ตกลงกัน</b><p>เรียกที่ไหน · ส่งอะไร · รับแบบใด</p></div><div class="service-examples piece">ข้อมูลอากาศ / การชำระเงิน / AI</div>`,
  request: `<div class="request-sheet"><div class="paper-heading">คำขอใช้ผู้ช่วย</div><div class="request-row piece"><small>เลือกปลายทาง</small><b>ผู้ช่วยตอบคำถามบริการ</b></div><div class="request-row piece"><small>ส่งคำถาม</small><b>เริ่มใช้บริการต้องเตรียมอะไร?</b></div><div class="request-row permission piece"><small>ยืนยันสิทธิ์</small><b>ระบบแอปมีสิทธิ์เรียกใช้งาน</b></div></div><div class="explain-note low piece">ตัวอย่างข้อมูลที่ต้องส่ง<br>ไม่ใช่แบบฟอร์มหรือ key จริง</div>`,
  brand: `<div class="brand-stage"><img class="brand-logo" src="assets/langmind-logo.png" width="689" height="606" alt="LangMind"><img class="robot" src="assets/05-point-up.png" width="445" height="436" alt=""></div><div class="brand-role piece">คุยกับผู้ช่วยที่ตั้งค่าไว้<br><b>รับข้อมูลคำตอบผ่าน API</b></div><div class="ownership piece"><span>LangMind<br><b>ให้บริการผู้ช่วย</b></span><span>แอปของเรา<br><b>เชื่อมต่อและแสดงผล</b></span></div>`,
  knowledge: `<div class="knowledge-art"><img src="assets/knowledge-v2.png" width="1536" height="1024" alt="เอกสารเข้าสู่แฟ้มข้อมูลและผู้ช่วย"><div class="knowledge-mask"></div></div><div class="knowledge-labels"><span class="piece">ข้อมูลของเรา</span><span class="piece">ฐานความรู้</span><span class="piece">ผู้ช่วย</span></div><div class="ready-track"><span class="piece">นำเข้า</span><i>→</i><span class="piece">พร้อมใช้</span><i>→</i><span class="piece">ผูกผู้ช่วย</span></div><div class="explain-note low piece">อัปโหลดแล้ว<br>ต้องตรวจสถานะก่อนใช้งาน</div>`,
  followup: `${device('app-followup-v2.png', 'followup-device')}<div class="thread-tag piece">บทสนทนาเดิม</div>`,
  voice: `<div class="voice-path">${box('เสียงพูด', 'ผู้ใช้พูดกับแอป', 'piece')}${box('ข้อความ', 'ถอดเสียงก่อนส่งไปคุย', 'piece')}${box('ข้อมูลคำตอบ', 'รับจากการสนทนา', 'piece')}${box('เสียงตอบ', 'อ่านข้อความออกเสียง', 'piece')}</div><div class="voice-condition piece">ต้องเปิดฟีเจอร์เสียงและสิทธิ์ที่เกี่ยวข้อง</div>`,
  example: `<div class="source-note"><small>ข้อมูลตั้งต้นของบริการสมมติ</small><b>ก่อนเริ่มปรึกษา</b><p>เตรียมอีเมล<br>และหัวข้อที่อยากปรึกษา</p></div><div class="example-screen">${device('app-q-v1.png')}</div>`,
  outbound: `${flow('out')}<div class="api-tag piece">LangMind API</div>`,
  inbound: `<div class="return-diagram">${flow('return')}</div><div class="answer-display">${device('app-a-v1.png')}</div>`,
  display: `<div class="answer-data piece"><small>ข้อมูลคำตอบ</small><b>เตรียมอีเมลและหัวข้อ<br>ที่อยากปรึกษา</b></div><svg class="fork" viewBox="0 0 850 250"><path d="M425 0 L425 90 Q425 150 210 220 M425 90 Q425 150 640 220"/></svg><div class="outputs"><div class="piece">แสดงข้อความ<br><b>ในแอป</b></div><div class="piece">อ่านออกเสียง<br><b>เมื่อเตรียมระบบเสียง</b></div></div>`,
  responsibility: `<div class="owner-heading">งานของ developer</div><div class="task-group"><div class="task piece"><small>ฝั่งระบบ</small><b>เก็บกุญแจให้ปลอดภัย</b></div><div class="task piece"><small>ผู้ใช้แต่ละคน</small><b>แยกสิทธิ์และบทสนทนา</b></div><div class="task piece"><small>ระหว่างใช้งาน</small><b>บอกสถานะรอ / เรียกไม่สำเร็จ</b></div></div><div class="quality-stamp piece">ทดสอบคำตอบ<br>กับข้อมูลและโจทย์จริง</div>`,
  recap: `<div class="recap-chain">${box('แอปของเรา', 'เชื่อมต่อและแสดงผล', 'piece')}<div class="recap-api piece">API<span>ช่องทาง + กติกา</span></div>${box('LangMind', 'ผู้ช่วยและบริการที่เกี่ยวข้อง', 'piece')}</div><div class="closing-question piece">เลือกงานหนึ่งอย่าง<br>ที่อยากให้ผู้ช่วยทำ</div>`
};

const scenes = timing.scenes.map(s => `<section id="${s.id}" class="clip scene ${s.kind}" data-start="${s.start}" data-duration="${s.duration}" data-track-index="1" data-track-kind="graphics" data-beat="${esc(s.chapter)}">
<div class="chapter">${esc(s.chapter)}</div><h1>${esc(s.title).replaceAll('\n', '<br>')}</h1><div class="stage">${content[s.kind]}</div><div class="emphasis">${esc(s.emphasis)}</div></section>`).join('\n');
const captions = timing.scenes.flatMap(s => s.captions.map((c, i) => `<div id="${s.id}-cap-${i}" class="clip caption" data-start="${(s.start+c.start).toFixed(6)}" data-duration="${Math.min(c.end-c.start+.12,s.duration-c.start).toFixed(6)}" data-track-index="8" data-track-kind="captions" data-layout-allow-caption-zone>${esc(c.text)}</div>`)).join('\n');
const audio = fs.existsSync(path.join(root, 'assets/voice-v2.wav')) ? `<audio id="narration" class="clip" data-start="0" data-duration="${timing.duration}" data-track-index="9" src="assets/voice-v2.wav"></audio>` : '';
const html = `<!doctype html><html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>EP01: API และ LangMind ทำงานอย่างไร</title><link rel="stylesheet" href="style.css"><script src="assets/gsap.min.js"></script></head><body><main id="film" data-composition-id="ep01-v2" data-width="1080" data-height="1920" data-fps="30" data-duration="${timing.duration}"><div class="paper-lines" aria-hidden="true"></div>${scenes}<div class="series-label">LangMind / EP01${audio ? '' : ' · Animatic รอเสียง'}</div><div class="simulation-label">ภาพจำลอง</div>${captions}<div class="progress"></div>${audio}</main><script>window.FILM_TIMING=${JSON.stringify(timing.scenes.map(({id,kind,start,duration})=>({id,kind,start,duration})))}</script><script src="motion.js"></script></body></html>`;
fs.writeFileSync(path.join(root, 'index.html'), html);
console.log(`Authored ${timing.scenes.length} static scenes, ${timing.scenes.reduce((n,s)=>n+s.captions.length,0)} caption groups; ${timing.duration.toFixed(3)} seconds`);

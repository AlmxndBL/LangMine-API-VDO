import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const timing = JSON.parse(await readFile(path.join(here, 'timing.json'), 'utf8'));
const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
let nextTrackIndex = 0;
const clip = (id, duration, cls, content, extra = '') => `<div id="${id}" class="clip ${cls}" data-start="0" data-duration="${duration}" data-track-index="${nextTrackIndex++}" ${extra}>${content}</div>`;
const img = (src, alt, id, duration, cls = '') => `<img id="${id}" class="clip ${cls}" data-start="0" data-duration="${duration}" data-track-index="${nextTrackIndex++}" src="${src}" alt="${esc(alt)}">`;
const rootStyle = `
  @font-face{font-family:Sarabun;src:url('assets/fonts/Sarabun-Regular.ttf') format('truetype');font-weight:400}
  @font-face{font-family:Sarabun;src:url('assets/fonts/Sarabun-Bold.ttf') format('truetype');font-weight:700}
  *{box-sizing:border-box} html,body{margin:0;width:1080px;height:1920px;overflow:hidden}
  #root{position:absolute;inset:0;background:#f3f0e8;color:#162536;font-family:Sarabun,sans-serif;overflow:hidden}
  #root:before{content:'';position:absolute;inset:30px;border:2px solid #d7d2c8;border-radius:32px;pointer-events:none}
  .grain{position:absolute;inset:0;background-image:radial-gradient(#c7c0b5 0.7px,transparent 0.7px);background-size:18px 18px;opacity:.16}
  .kicker{position:absolute;left:96px;top:78px;color:#08795f;font-size:25px;font-weight:700;letter-spacing:1px}
  .title{position:absolute;left:96px;top:138px;width:888px;margin:0;font-size:62px;line-height:1.14;font-weight:700;letter-spacing:-1px}
  .eyebrow{font-size:25px;font-weight:700;color:#657181;letter-spacing:.4px}
  .tag{position:absolute;padding:10px 18px;border:2px solid #c9d6ce;border-radius:14px;background:#fffdf8;color:#335246;font-size:24px;font-weight:700}
  .accent{color:#08795f}.muted{color:#5c6a78}.line{position:absolute;height:5px;border-radius:5px;background:#9bc6b4;transform-origin:left center}
  .screen{object-fit:contain;border:3px solid #1d3544;border-radius:28px;box-shadow:0 18px 42px rgba(26,45,55,.18);background:white}
  .robot{object-fit:contain}.caption{position:absolute;left:108px;top:1570px;width:864px;min-height:170px;padding:25px 34px;border:2px solid #24495a;border-radius:18px;background:#fffdf8;color:#162536;display:flex;align-items:center;justify-content:center;text-align:center;white-space:pre-line;font-size:39px;line-height:1.24;font-weight:700;box-shadow:0 10px 24px rgba(22,37,54,.12);z-index:20}
  .node{position:absolute;border-radius:18px;background:#fffdf8;border:2px solid #c8d4d1;box-shadow:0 10px 28px rgba(22,37,54,.1);display:flex;align-items:center;gap:20px;padding:24px 28px}
  .node-mark{width:58px;height:58px;flex:0 0 58px;border-radius:50%;display:grid;place-items:center;background:#08795f;color:#fffdf8;font-size:28px;font-weight:700}
  .node-title{font-size:34px;font-weight:700;line-height:1.18}.node-detail{font-size:27px;line-height:1.25;color:#536271;margin-top:4px}
  .small-note{font-size:23px;color:#536271}.scene-label{position:absolute;left:96px;top:270px;color:#5c6a78;font-size:26px}
  .pill{display:inline-flex;padding:9px 16px;border-radius:999px;background:#e3eee8;color:#075c4a;font-size:23px;font-weight:700}
  .scene-label .pill{margin-right:10px}`;

function sceneContent(beat) {
  const d = beat.duration;
  if (beat.kind === 'waiting') return `
    ${clip('b1-context',d,'scene-label',`<span class="pill">ภาพจำลอง</span> คำถามหนึ่งครั้งในแชท`)}
    ${img('assets/ui/scr-01-chat-loading.png','หน้าจอแชทจำลองที่กำลังรอคำตอบ','b1-screen',d,'screen')}
    ${img('assets/characters/01-question.png','ตัวละคร Robot ท่าสงสัย','b1-robot',d,'robot')}
    ${clip('b1-note',d,'tag b1-note','รูปแบบรับผลครบก่อนแสดงผล')}`;
  if (beat.kind === 'compare') return `
    ${clip('b2-left-tag',d,'compare-tag left-tag','รับผลครบก่อนแสดง')}
    ${clip('b2-right-tag',d,'compare-tag right-tag','ทยอยรับและแสดงผ่าน SSE')}
    ${img('assets/ui/scr-01-chat-loading.png','ภาพจำลองสถานะรอรับคำตอบครบ','b2-screen-left',d,'compare-screen')}
    ${img('assets/ui/scr-02-chat-streaming.png','ภาพจำลองข้อความที่ทยอยแสดง','b2-screen-right',d,'compare-screen')}
    ${clip('b2-bottom',d,'compare-foot','ภาพหน้าจอเป็นตัวอย่างประกอบ ไม่ใช่ผลเรียก API จริง')}`;
  if (beat.kind === 'events') return `
    ${clip('b3-api',d,'node api-node',`<span class="node-mark">API</span><div><div class="node-title">POST /chat/message</div><div class="node-detail">Server-Sent Events</div></div>`)}
    <div class="flow-line" aria-hidden="true"></div>
    ${clip('b3-e1',d,'node event event-one',`<span class="node-mark">1</span><div><div class="node-title">message_start</div><div class="node-detail">เริ่มและแจ้ง conversation/message ID</div></div>`)}
    ${clip('b3-e2',d,'node event event-two',`<span class="node-mark">2</span><div><div class="node-title">message</div><div class="node-detail">ชิ้นส่วนข้อความ (chunks)</div></div>`)}
    ${clip('b3-e3',d,'node event event-three',`<span class="node-mark">3</span><div><div class="node-title">citations <span class="small-note">(ถ้ามี)</span></div><div class="node-detail">แหล่งอ้างอิงประกอบคำตอบ</div></div>`)}
    ${clip('b3-e4',d,'node event event-four',`<span class="node-mark">4</span><div><div class="node-title">message_end</div><div class="node-detail">คำตอบฉบับเต็มและ usage</div></div>`)}
    ${clip('b3-client',d,'node client-node',`<span class="node-mark">APP</span><div><div class="node-title">App Backend รับ event</div><div class="node-detail">นำข้อมูลที่ได้รับไปแสดงผล</div></div>`)}`;
  if (beat.kind === 'responsibilities') return `
    ${clip('b4-server',d,'responsibility server-card',`<span class="server-chip">APP SERVER</span><strong>เก็บ API key ไว้ฝั่ง server</strong><span>รับและ parse SSE stream</span>`)}
    ${clip('b4-client-ghost',d,'client-ghost','Client UI · จุดแสดงผลของแอป')}
    <div id="b4-arrow" class="clip handoff-arrow" data-start="6.1" data-duration="${d-6.1}" data-track-index="${nextTrackIndex++}" aria-hidden="true"><span></span></div>
    ${clip('b4-client',d,'responsibility client-card',`<span class="client-chip">CLIENT UI</span><strong>รับข้อมูลที่แอปส่งต่อ</strong><span>จัดการ state และแสดงผลเอง</span>`)}
    ${img('assets/characters/39-tiptoe.png','ตัวละคร Robot ชี้ไปยังขั้นตอนฝั่งแอป','b4-robot',d,'robot app-robot')}
    ${clip('b4-boundary',d,'boundary-note','API ส่ง event · แอปเป็นผู้จัดการการแสดงผล')}`;
  return `
    ${img('assets/brand/langmind-logo.png','โลโก้ LangMind','b5-logo',d,'brand-logo')}
    ${img('assets/characters/10-thumbs-up.png','ตัวละคร Robot ยกนิ้วโป้ง','b5-robot',d,'robot summary-robot')}
    ${clip('b5-step1',d,'summary-step step-one',`<span>1</span><strong>ส่งคำขอผ่าน server</strong>`)}
    ${clip('b5-step2',d,'summary-step step-two',`<span>2</span><strong>อ่าน event และแสดง chunks</strong>`)}
    ${clip('b5-step3',d,'summary-step step-three',`<span>3</span><strong>จบเมื่อได้รับ message_end</strong>`)}
    ${clip('b5-mock',d,'micro-note','ภาพตัวอย่าง ไม่ใช่ผลเรียก API จริง')}`;
}

const globalAnimations = {
  waiting: [['b1-screen',0.35,0.65,'y',22],['b1-robot',1.2,0.45,'x',-18],['b1-note',1.65,0.4,'y',12]],
  compare: [['b2-screen-left',0.55,0.55,'x',-20],['b2-screen-right',0.8,0.55,'x',20],['b2-left-tag',0.25,0.3,'y',10],['b2-right-tag',0.4,0.3,'y',10]],
  events: [['b3-api',0.35,0.35,'y',-12],['b3-e1',0.5,0.34,'y',14],['b3-e2',3.25,0.34,'y',14],['b3-e3',6.5,0.34,'y',14],['b3-e4',9.75,0.34,'y',14]],
  responsibilities: [['b4-server',0.45,0.45,'y',18],['b4-client',6.1,0.45,'y',18],['b4-robot',6.3,0.4,'x',16],['b4-boundary',6.5,0.35,'y',10]],
  summary: [['b5-logo',0.2,0.45,'y',10],['b5-robot',0.65,0.4,'x',18],['b5-step1',0.2,0.34,'y',12],['b5-step2',3,0.34,'y',12],['b5-step3',6,0.34,'y',12],['b5-mock',6.2,0.3,'y',8]]
};

const sharedSceneCss = `
  ${rootStyle}
  .kicker,.title,.scene-label,.tag,.screen,.robot,.node,.flow-line,.responsibility,.handoff-arrow,.boundary-note,.brand-logo,.summary-step,.micro-note,.compare-tag,.compare-screen,.compare-foot{position:absolute}
  .screen{left:222px;top:300px;width:636px;height:1130px}
  #b1-robot{left:52px;top:1215px;width:158px;height:158px}
  #b1-note{left:250px;top:1490px;width:580px;height:58px;display:flex;align-items:center;justify-content:center;text-align:center}
  .compare-tag{top:365px;width:448px;padding:12px 15px;border-radius:16px;text-align:center;font-size:27px;font-weight:700;border:2px solid #a9c4b6;background:#fffdf8;color:#075c4a}
  .left-tag{left:64px}.right-tag{right:64px;background:#e3eee8}
  .compare-screen{top:440px;width:432px;height:768px;object-fit:contain;border:3px solid #1d3544;border-radius:22px;background:white;box-shadow:0 14px 34px rgba(26,45,55,.16)}
  #b2-screen-left{left:74px}#b2-screen-right{right:74px}
  .compare-foot{left:108px;top:1280px;width:864px;text-align:center;font-size:25px;color:#586a72}
  .api-node{left:150px;top:365px;width:780px;height:132px;border-color:#7ab8a0}
  .flow-line{left:536px;top:468px;width:7px;height:760px;background:#9bc6b4}
  .flow-line:after{content:'';position:absolute;left:-11px;bottom:-1px;border-left:15px solid transparent;border-right:15px solid transparent;border-top:22px solid #08795f}
  .event{left:150px;width:780px;height:142px}
  .event-one{top:505px}.event-two{top:679px}.event-three{top:853px;border-style:dashed}.event-four{top:1027px;border-color:#99a8cf}
  .client-node{left:150px;top:1245px;width:780px;height:138px;background:#e7eee9}
  .flow-robot{right:54px;top:1370px;width:138px;height:138px}
  .server-card,.client-card{left:144px;width:792px;height:250px;border-radius:28px;background:#fffdf8;box-shadow:0 14px 34px rgba(22,37,54,.11);display:flex;flex-direction:column;justify-content:center;gap:12px;padding:28px 38px}
  .server-card{top:450px;height:265px;border:3px solid #08795f}.client-card{top:1000px;border:3px solid #8295a6}
  .client-ghost{left:144px;top:725px;width:792px;height:240px;border:3px dashed #9bc6b4;border-radius:24px;display:grid;place-items:center;color:#5c6a78;font-size:30px;font-weight:700}
  .server-card strong,.client-card strong{font-size:39px;line-height:1.2}.server-card>span:last-child,.client-card>span:last-child{font-size:29px;color:#586a72}
  .server-chip,.client-chip{align-self:flex-start;border-radius:999px;padding:5px 14px;background:#e3eee8;color:#075c4a;font-size:21px;font-weight:700;letter-spacing:1px}
  .client-chip{background:#e9edf1;color:#3d5365}
  .handoff-arrow{left:520px;top:710px;width:40px;height:245px}
  .handoff-arrow:before{content:'';position:absolute;left:17px;top:0;width:6px;height:218px;background:#9bc6b4;border-radius:6px}
  .handoff-arrow:after{content:'';position:absolute;left:7px;bottom:0;border-left:15px solid transparent;border-right:15px solid transparent;border-top:22px solid #08795f}
  .app-robot{right:70px;top:1285px;width:150px;height:150px}
  .boundary-note{left:145px;top:1370px;width:700px;color:#536271;font-size:25px;font-weight:700}
  .brand-logo{left:112px;top:360px;width:225px;height:185px;object-fit:contain}
  .summary-robot{right:130px;top:360px;width:170px;height:170px}
  .summary-step{left:144px;width:792px;height:133px;border-radius:20px;background:#fffdf8;border:2px solid #c8d4d1;box-shadow:0 8px 20px rgba(22,37,54,.09);display:flex;align-items:center;gap:24px;padding:20px 28px}
  .step-one{top:650px}.step-two{top:840px}.step-three{top:1030px;border-color:#08795f;background:#e3eee8}
  .summary-step span{width:54px;height:54px;flex:0 0 54px;border-radius:50%;display:grid;place-items:center;background:#08795f;color:white;font-size:28px;font-weight:700}
  .summary-step strong{font-size:34px;line-height:1.2}
  .micro-note{left:108px;top:1400px;width:864px;text-align:center;color:#5c6a78;font-size:23px;font-weight:700}`;

function makeComposition(beat) {
  nextTrackIndex = 0;
  const cues = globalAnimations[beat.kind];
  const timeline = cues.map(([id,at,dur,axis,offset]) => `    tl.fromTo('#${id}', { opacity: 0, ${axis}: ${offset} }, { opacity: 1, ${axis}: 0, duration: ${dur}, ease: 'power2.out' }, ${at});`).join('\n');
  const extraTimeline = beat.kind === 'responsibilities' ? `\n    tl.to('#b4-client-ghost', { opacity: 0, duration: 0.25 }, 6);` : '';
  return `<template>
<style>${sharedSceneCss}</style>
<div id="root" data-composition-id="${beat.id}" data-width="${timing.width}" data-height="${timing.height}" data-duration="${beat.duration}">
  <div class="grain"></div>
  <div id="${beat.id}-kicker" class="clip kicker" data-start="0" data-duration="${beat.duration}" data-track-index="0">LANGMIND · EP03 / SSE</div>
  <h1 id="${beat.id}-title" class="clip title" data-start="0" data-duration="${beat.duration}" data-track-index="0">${esc(beat.title)}</h1>
  ${sceneContent(beat)}
</div>
<script>
  window.__timelines = window.__timelines || {};
  const tl = gsap.timeline({ paused: true });
${timeline}
${extraTimeline}
  window.__timelines['${beat.id}'] = tl;
</script>
</template>`;
}

await mkdir(path.join(here, 'compositions'), { recursive: true });
for (const beat of timing.beats) await writeFile(path.join(here, 'compositions', `${beat.id}.html`), makeComposition(beat), 'utf8');

const hosts = timing.beats.map((beat, index) => `<div id="${beat.id}" class="scene-host" data-composition-id="${beat.id}" data-composition-src="compositions/${beat.id}.html" data-start="${beat.start}" data-duration="${beat.duration}" data-track-index="0" data-track-kind="graphics" data-width="${timing.width}" data-height="${timing.height}" aria-label="${esc(beat.title)}"></div>`).join('\n');
const captions = timing.onScreenCues.map((cue, i) => `<div id="${cue.id}" class="clip caption" data-start="${cue.start}" data-duration="${cue.duration}" data-track-index="5"><span>${esc(cue.text)}</span><small>${String(i+1).padStart(2,'0')} / ${String(timing.onScreenCues.length).padStart(2,'0')}</small></div>`).join('\n');
const capAnimations = timing.onScreenCues.map((cue) => `  rootTl.fromTo('#${cue.id}', {opacity:0,y:16}, {opacity:1,y:0,duration:.25,ease:'power2.out'}, ${cue.start});`).join('\n');
const main = `<!doctype html><html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=${timing.width}, initial-scale=1"><title>EP03 · SSE · Animatic v2</title>
<style>
@font-face{font-family:Sarabun;src:url('assets/fonts/Sarabun-Regular.ttf') format('truetype');font-weight:400}@font-face{font-family:Sarabun;src:url('assets/fonts/Sarabun-Bold.ttf') format('truetype');font-weight:700}
*{box-sizing:border-box}html,body{margin:0;width:${timing.width}px;height:${timing.height}px;overflow:hidden;background:#f3f0e8;font-family:Sarabun,sans-serif;color:#162536}
#root{position:relative;width:${timing.width}px;height:${timing.height}px;overflow:hidden;background:#f3f0e8}.scene-host{position:absolute;inset:0}
#caption-track{position:absolute;inset:0;z-index:30;pointer-events:none}.caption{position:absolute;left:108px;top:1570px;width:864px;min-height:170px;padding:25px 34px;border:2px solid #24495a;border-radius:18px;background:#fffdf8;color:#162536;display:flex;align-items:center;justify-content:center;text-align:center;white-space:pre-line;font-size:39px;line-height:1.24;font-weight:700;box-shadow:0 10px 24px rgba(22,37,54,.12)}.caption small{position:absolute;right:18px;bottom:8px;color:#677684;font-size:17px;font-weight:700}
</style></head><body><main id="root" data-composition-id="main" data-start="0" data-duration="${timing.durationSeconds}" data-width="${timing.width}" data-height="${timing.height}" data-fps="${timing.fps}">
${hosts}
<div id="caption-track" data-track-kind="captions">${captions}</div>
</main><script src="assets/vendor/gsap.min.js"></script><script>window.__timelines=window.__timelines||{};const rootTl=gsap.timeline({paused:true});
${capAnimations}
window.__timelines['main']=rootTl;</script></body></html>`;
await writeFile(path.join(here, 'index.html'), main, 'utf8');
console.log(`Built EP03 animatic-v2: ${timing.beats.length} scenes, ${timing.onScreenCues.length} on-screen text groups, ${timing.durationSeconds}s @ ${timing.fps}fps`);

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const timing = JSON.parse(await readFile(path.join(here, 'timing.json'), 'utf8'));
const seconds = (frame) => (frame / timing.fps).toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[char]));
const image = (src, className, alt) => `<img class="${className}" src="${escapeHtml(src)}" alt="${escapeHtml(alt)}">`;
const pill = (text, className = 'pill') => `<div class="${className}">${escapeHtml(text)}</div>`;

function sceneVisual(scene) {
  if (scene.visual === 'loading') {
    return `${image(scene.asset, 'scene-screen full-screen', 'หน้าจอแชทจำลองสถานะ Blocking จาก W5')}
      ${pill('ภาพจำลอง • ตัวเลขเวลาไม่ใช่ผลวัด API', 'mock-note')}
      ${image(scene.robot, 'robot robot-right', 'ตัวละคร robot ท่าสงสัย')}`;
  }
  if (scene.visual === 'comparison') {
    return `<div class="compare-labels">
        ${pill('BLOCKING · รอคำตอบครบก้อน', 'compare-label blocking-label')}
        ${pill('STREAMING · รับ event เป็นช่วง', 'compare-label streaming-label')}
      </div>
      <div class="compare-screens">
        ${image(scene.leftAsset, 'compare-screen', 'ภาพจำลอง Blocking จาก W5')}
        ${image(scene.rightAsset, 'compare-screen', 'ภาพจำลอง Streaming จาก W5')}
      </div>
      ${pill('ภาพเปรียบเทียบจำลอง • ไม่ได้วัดความเร็วหรือ latency จริง', 'mock-note')}
      ${image(scene.robot, 'robot robot-small-right', 'ตัวละคร robot ชี้ทาง')}`;
  }
  if (scene.visual === 'events') {
    const eventCards = scene.events.map((event, index) => `
      <div id="event-${index + 1}" class="event-card event-${index + 1}">
        <span class="event-index">${index + 1}</span>
        <div><strong>${escapeHtml(event.name)}</strong><p>${escapeHtml(event.detail)}</p></div>
      </div>`).join('');
    return `${pill('LangMind API · POST /chat/message', 'server-node')}
      <div class="event-flow">${eventCards}</div>
      ${pill('Client App · อ่าน stream และจัดการ UI', 'client-node')}
      ${pill('แผนภาพอธิบายตาม API snapshot • ไม่ใช่ network trace จริง', 'mock-note')}
      ${image(scene.robot, 'robot robot-top-right', 'ตัวละคร robot ใช้ laptop')}`;
  }
  if (scene.visual === 'app-flow') {
    return `<div class="app-flow">
      ${scene.steps.map((step, index) => `<div id="step-${index + 1}" class="flow-step">
        <span>${index + 1}</span><strong>${escapeHtml(step)}</strong></div>`).join('')}
      </div>
      ${pill('ตัวอย่างหน้าที่ integration ฝั่งแอป', 'mock-note')}
      ${image(scene.robot, 'robot robot-small-right', 'ตัวละคร robot ชี้ขั้นตอน')}`;
  }
  return `<div class="outro-brand">${image(scene.logo, 'brand-logo', 'โลโก้ LangMind')}
      ${image(scene.robot, 'robot outro-robot', 'ตัวละคร robot ยกนิ้วโป้ง')}</div>
      ${pill('ตัวอย่างภาพประกอบ • ไม่ใช่ผลเรียก API จริง', 'mock-note')}
      <div class="security-card"><strong>เก็บ API key ไว้ฝั่ง server</strong><span>รอ message_end ก่อนถือว่าคำตอบสมบูรณ์</span></div>`;
}

const sceneMarkup = timing.scenes.map((scene, index) => {
  const start = seconds(scene.startFrame);
  const duration = seconds(scene.durationFrames);
  return `<section id="${escapeHtml(scene.id)}" class="clip scene scene-${escapeHtml(scene.visual)}"
      data-start="${start}" data-duration="${duration}" data-track-index="0">
    <div class="scene-kicker">EP03 · ${String(index + 1).padStart(2, '0')} / 05</div>
    <h1 id="title-${escapeHtml(scene.id)}" class="scene-title">${escapeHtml(scene.title)}</h1>
    <div class="scene-content">${sceneVisual(scene)}</div>
  </section>`;
}).join('\n');

const captionMarkup = timing.captions.map((caption, index) => {
  const start = seconds(caption.startFrame);
  const duration = seconds(caption.endFrame - caption.startFrame);
  return `<div id="${escapeHtml(caption.id)}" class="clip caption" data-start="${start}"
      data-duration="${duration}" data-track-index="5"
      data-voice-cue-ids="${escapeHtml(caption.voiceCueIds.join(','))}"
      data-audio-start-sec="${caption.audioStartSec ?? ''}" data-audio-end-sec="${caption.audioEndSec ?? ''}">
    <span class="caption-text">${escapeHtml(caption.text)}</span>
    <span class="caption-count">${String(index + 1).padStart(2, '0')} / ${String(timing.captions.length).padStart(2, '0')}</span>
  </div>`;
}).join('\n');

const animationCalls = timing.scenes.map((scene) => {
  const start = Number(seconds(scene.startFrame));
  return `  tl.fromTo('#title-${scene.id}', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, ${start + 0.25});`;
}).join('\n');
const eventAnimations = timing.scenes.find((scene) => scene.visual === 'events').events.map((_, index) => {
  const scene = timing.scenes.find((item) => item.visual === 'events');
  const at = Number(seconds(scene.startFrame)) + 1.8 + index * 0.75;
  return `  tl.fromTo('#event-${index + 1}', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, ${at});`;
}).join('\n');
const stepAnimations = timing.scenes.find((scene) => scene.visual === 'app-flow').steps.map((_, index) => {
  const scene = timing.scenes.find((item) => item.visual === 'app-flow');
  const at = Number(seconds(scene.startFrame)) + 1.4 + index * 0.7;
  return `  tl.fromTo('#step-${index + 1}', { opacity: 0, x: -18 }, { opacity: 1, x: 0, duration: 0.32, ease: 'power2.out' }, ${at});`;
}).join('\n');

const html = `<!doctype html>
<html lang="th">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=1080, initial-scale=1">
  <title>EP03 · Streaming API (SSE) · Silent Animatic</title>
  <style>
    @font-face { font-family: Sarabun; src: url('assets/fonts/Sarabun-Regular.ttf') format('truetype'); font-weight: 400; }
    @font-face { font-family: Sarabun; src: url('assets/fonts/Sarabun-Bold.ttf') format('truetype'); font-weight: 700; }
    * { box-sizing: border-box; }
    html, body { width: 1080px; height: 1920px; margin: 0; overflow: hidden; background: #f8fafc; }
    body { font-family: Sarabun, sans-serif; color: #142137; }
    #root { position: relative; width: 1080px; height: 1920px; overflow: hidden; background: #f8fafc; }
    .scene { position: absolute; inset: 0; width: 1080px; height: 1920px; overflow: hidden; background: #f8fafc; }
    .scene::before { content: ''; position: absolute; inset: 34px; border: 2px solid #e4eaf1; border-radius: 36px; pointer-events: none; }
    .scene-kicker { position: absolute; top: 82px; left: 82px; color: #64748b; font-size: 30px; font-weight: 700; letter-spacing: 1px; }
    .scene-title { position: absolute; top: 150px; left: 74px; width: 850px; margin: 0; font-size: 58px; line-height: 1.2; font-weight: 700; color: #142137; }
    .scene-content { position: absolute; inset: 0; }
    .scene-screen { position: absolute; left: 0; top: 0; width: 1080px; height: 1920px; object-fit: cover; }
    .scene-loading::before { z-index: 2; border-color: rgba(20,33,55,.12); }
    .scene-loading .scene-kicker, .scene-loading .scene-title { z-index: 3; }
    .scene-loading .scene-kicker { top: 238px; }
    .scene-loading .scene-title { top: 870px; width: 660px; padding: 22px 28px; border-radius: 22px; background: rgba(255,255,255,.92); }
    .mock-note { position: absolute; left: 82px; top: 1195px; z-index: 4; max-width: 620px; padding: 12px 20px; border: 2px solid #cbd5e1; border-radius: 16px; background: rgba(255,255,255,.94); color: #475569; font-size: 28px; font-weight: 700; }
    .robot { position: absolute; z-index: 3; object-fit: contain; }
    .robot-right { left: 760px; top: 1050px; width: 235px; height: 235px; }
    .robot-small-right { right: 84px; top: 1170px; width: 180px; height: 180px; }
    .robot-top-right { right: 92px; top: 242px; width: 155px; height: 155px; }
    .scene-comparison { background: #f1f5f9; }
    .compare-labels { position: absolute; top: 340px; left: 58px; right: 58px; display: flex; justify-content: space-between; gap: 30px; }
    .compare-label { width: 455px; padding: 16px 12px; border-radius: 18px; text-align: center; font-size: 29px; font-weight: 700; }
    .blocking-label { color: #475569; background: #e2e8f0; }
    .streaming-label { color: #047857; background: #d1fae5; }
    .compare-screens { position: absolute; top: 420px; left: 58px; right: 58px; display: flex; gap: 32px; }
    .compare-screen { width: 455px; height: 808px; border: 3px solid #d8e1ea; border-radius: 20px; background: white; object-fit: cover; box-shadow: 0 14px 38px rgba(31,49,73,.12); }
    .scene-comparison .mock-note { top: 1265px; left: 82px; max-width: 700px; }
    .scene-events { background: #f8fafc; }
    .server-node, .client-node { position: absolute; left: 165px; width: 750px; padding: 20px 26px; border-radius: 20px; text-align: center; font-size: 34px; font-weight: 700; }
    .server-node { top: 365px; color: #075985; background: #e0f2fe; border: 2px solid #7dd3fc; }
    .client-node { top: 1230px; color: #334155; background: #e2e8f0; border: 2px solid #cbd5e1; }
    .event-flow { position: absolute; left: 155px; top: 535px; width: 770px; display: grid; gap: 18px; }
    .event-card { min-height: 145px; display: flex; align-items: center; gap: 24px; padding: 18px 26px; border-radius: 20px; background: white; border: 2px solid #dbe5ef; box-shadow: 0 8px 20px rgba(31,49,73,.08); }
    .event-index { flex: 0 0 58px; width: 58px; height: 58px; border-radius: 50%; display: grid; place-items: center; color: white; background: #0f9f78; font-size: 30px; font-weight: 700; }
    .event-card strong { font-family: Sarabun, sans-serif; font-size: 32px; color: #0f766e; }
    .event-card p { margin: 4px 0 0; font-size: 27px; color: #475569; }
    .event-1 { border-color: #7dd3fc; }
    .event-3 { border-style: dashed; }
    .event-4 { border-color: #a78bfa; }
    .scene-events .mock-note { top: 1330px; left: 82px; }
    .scene-app-flow { background: #f8fafc; }
    .app-flow { position: absolute; top: 410px; left: 88px; width: 900px; display: grid; gap: 28px; }
    .flow-step { min-height: 145px; display: flex; align-items: center; gap: 26px; padding: 22px 30px; border: 2px solid #d9e4ec; border-radius: 24px; background: white; box-shadow: 0 10px 26px rgba(31,49,73,.08); }
    .flow-step span { flex: 0 0 62px; width: 62px; height: 62px; display: grid; place-items: center; border-radius: 50%; color: white; background: #0f9f78; font-size: 32px; font-weight: 700; }
    .flow-step strong { font-size: 34px; line-height: 1.25; }
    .scene-app-flow .mock-note { top: 1245px; left: 82px; }
    .scene-outro { background: #f2f7f5; }
    .outro-brand { position: absolute; left: 140px; top: 420px; width: 800px; height: 510px; display: flex; align-items: center; justify-content: center; gap: 30px; }
    .brand-logo { width: 420px; height: 370px; object-fit: contain; }
    .outro-robot { position: relative; width: 280px; height: 280px; }
    .scene-outro .mock-note { top: 1030px; left: 82px; }
    .security-card { position: absolute; left: 88px; top: 1175px; width: 900px; min-height: 176px; display: flex; flex-direction: column; justify-content: center; gap: 12px; padding: 24px 34px; border: 2px solid #f5c46a; border-radius: 24px; background: #fff8e8; color: #70420e; }
    .security-card strong { font-size: 39px; }
    .security-card span { font-size: 30px; }
    #caption-track { position: absolute; inset: 0; z-index: 10; pointer-events: none; }
    .caption { position: absolute; left: 72px; top: 1460px; width: 936px; min-height: 170px; display: flex; align-items: center; justify-content: center; padding: 24px 34px 42px; border: 2px solid rgba(15,118,110,.28); border-radius: 24px; background: rgba(255,255,255,.97); color: #142137; text-align: center; box-shadow: 0 12px 30px rgba(31,49,73,.15); }
    .caption-text { white-space: pre-line; font-size: 44px; line-height: 1.25; font-weight: 700; }
    .caption-count { position: absolute; right: 20px; bottom: 9px; color: #64748b; font-size: 20px; font-weight: 700; }
  </style>
</head>
<body>
  <main id="root" data-composition-id="main" data-start="0" data-duration="${seconds(timing.durationFrames)}" data-width="${timing.width}" data-height="${timing.height}" data-fps="${timing.fps}" data-timing-version="${escapeHtml(timing.version)}" data-timing-basis="${escapeHtml(timing.timingBasis)}" data-audio-status="${escapeHtml(timing.audioStatus)}">
    ${sceneMarkup}
    <div id="caption-track" data-track-kind="captions">${captionMarkup}</div>
  </main>
  <script src="assets/vendor/gsap.min.js"></script>
  <script>
    window.__timelines = window.__timelines || {};
    const tl = gsap.timeline({ paused: true });
${animationCalls}
${eventAnimations}
${stepAnimations}
    window.__timelines['main'] = tl;
  </script>
</body>
</html>
`;

await writeFile(path.join(here, 'index.html'), html, 'utf8');
console.log(`Generated index.html: ${timing.scenes.length} scenes, ${timing.captions.length} captions, ${timing.durationFrames / timing.fps}s at ${timing.fps} fps.`);

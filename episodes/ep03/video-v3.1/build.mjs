import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const timing = JSON.parse(await readFile(path.join(here, 'timing.json'), 'utf8'));
const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const duration = (frames) => Number((frames / timing.fps).toFixed(6));
const byBeat = new Map(timing.beats.map((beat) => [beat.id, []]));
for (const stage of timing.stages) byBeat.get(stage.beat).push(stage);

const sceneCss = '*{box-sizing:border-box}\n' +
  '@font-face{font-family:Sarabun;src:url("assets/fonts/Sarabun-Bold.ttf")}\n' +
  'html,body{margin:0;width:' + timing.width + 'px;height:' + timing.height + 'px;overflow:hidden;background:#f3f0e8}\n' +
  '#root{position:absolute;inset:0;width:' + timing.width + 'px;height:' + timing.height + 'px;overflow:hidden}\n' +
  '.plate{position:absolute;inset:0;width:' + timing.width + 'px;height:' + timing.height + 'px;object-fit:cover;opacity:0}\n';

function stageLayers(beat) {
  const stages = byBeat.get(beat.id);
  let cursor = 0;
  const images = stages.map((stage) => {
    const start = duration(cursor);
    const stageDuration = duration(stage.frames);
    const id = 'stage-' + stage.id;
    cursor += stage.frames;
    return '<img id="' + id + '" class="clip plate" data-start="' + start + '" data-duration="' + stageDuration + '" data-track-index="0" data-layout-allow-overlap="true" src="assets/plates/v3.1/' + esc(stage.file) + '" alt="' + esc(beat.title + ' — ' + stage.id) + '">';
  }).join('\n');
  cursor = 0;
  const actions = stages.map((stage) => {
    const start = duration(cursor);
    cursor += stage.frames;
    const end = duration(cursor);
    const id = 'stage-' + stage.id;
    return '  tl.set("#' + id + '", {opacity:1}, ' + start + ');\n' +
      '  tl.set("#' + id + '", {opacity:0}, ' + end + ');';
  }).join('\n');
  return { images, actions };
}

const wipeComponent = await readFile(path.join(here, 'compositions', 'components', 'before-after-wipe.html'), 'utf8');
const softBlurComponent = await readFile(path.join(here, 'compositions', 'components', 'soft-blur-in.html'), 'utf8');

function makeScene(beat) {
  const { images, actions } = stageLayers(beat);
  const rootStart = '<div id="root" data-composition-id="' + beat.id + '" data-width="' + timing.width + '" data-height="' + timing.height + '" data-duration="' + beat.duration + '" data-layout-allow-overlap="true">';
  let extras = '';
  let extraCss = '';
  let extraTimeline = '';

  if (beat.id === 'beat02') {
    extraCss = softBlurComponent + '\n' +
      '#b2-catalog-title{position:absolute;z-index:3;left:96px;top:140px;width:888px;margin:0;color:#162536;font:700 56px/1.22 Sarabun,Arial,sans-serif}\n';
    extras = '<h1 id="b2-catalog-title" class="hf-soft-blur-in" data-layout-allow-overlap="true">คำตอบแสดงได้สองจังหวะ</h1>\n' + wipeComponent;
    extraTimeline =
      '  tl.fromTo("#b2-catalog-title", {opacity:0, y:28, filter:"blur(18px)"}, {opacity:1, y:0, filter:"blur(0px)", duration:0.8, ease:"power3.out"}, 0);\n' +
      '  tl.set("#baw-stage", {opacity:0, "--baw-split":0}, 0);\n' +
      '  tl.to("#baw-stage", {opacity:1, duration:0.32, ease:"power2.out"}, 0);\n' +
      '  tl.to("#baw-stage", {"--baw-split":50, duration:1.05, ease:"sine.inOut"}, 0.25);\n' +
      '  tl.fromTo("#baw-divider", {opacity:0}, {opacity:1, duration:0.22, ease:"power1.out"}, 0.25);';
  }

  return '<template>\n<style>' + sceneCss + extraCss + '</style>\n' + rootStart + '\n' + images + '\n' + extras + '\n</div>\n<script>\n' +
    '  window.__timelines = window.__timelines || {};\n' +
    '  const tl = gsap.timeline({paused:true});\n' + actions + '\n' + extraTimeline + '\n' +
    '  window.__timelines["' + beat.id + '"] = tl;\n' +
    '</script>\n</template>';
}

await mkdir(path.join(here, 'compositions'), { recursive: true });
for (const beat of timing.beats) {
  await writeFile(path.join(here, 'compositions', beat.id + '.html'), makeScene(beat), 'utf8');
}

const hosts = timing.beats.map((beat, index) =>
  '<div id="' + beat.id + '" class="scene-host" data-composition-id="' + beat.id + '" data-composition-src="compositions/' + beat.id + '.html" data-start="' + beat.start + '" data-duration="' + beat.duration + '" data-track-index="' + index + '" data-track-kind="graphics" data-width="' + timing.width + '" data-height="' + timing.height + '" aria-label="' + esc(beat.title) + '"></div>'
).join('\n');
const main = '<!doctype html><html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=' + timing.width + ', initial-scale=1"><title>EP03 · SSE · Animatic v3.1</title>\n' +
  '<style>\n*{box-sizing:border-box}html,body{margin:0;width:' + timing.width + 'px;height:' + timing.height + 'px;overflow:hidden;background:#f3f0e8}\n' +
  '#root{position:relative;width:' + timing.width + 'px;height:' + timing.height + 'px;overflow:hidden;background:#f3f0e8}\n' +
  '.scene-host{position:absolute;inset:0}\n</style></head><body><main id="root" data-composition-id="main" data-start="0" data-duration="' + timing.durationSeconds + '" data-width="' + timing.width + '" data-height="' + timing.height + '" data-fps="' + timing.fps + '">\n' +
  hosts + '\n</main><script src="assets/vendor/gsap.min.js"></script><script>\n' +
  'window.__timelines=window.__timelines||{};\nwindow.__timelines["main"]=gsap.timeline({paused:true});\n' +
  '</script></body></html>';
await writeFile(path.join(here, 'index.html'), main, 'utf8');
console.log('Built EP03 animatic-v3.1: ' + timing.beats.length + ' beats, ' + timing.stages.length + ' visual stages, ' + timing.durationSeconds + 's @ ' + timing.fps + 'fps');

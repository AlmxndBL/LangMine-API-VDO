import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const timing = JSON.parse(await readFile(path.join(here, 'timing.json'), 'utf8'));
const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const duration = (frames) => Number((frames / timing.fps).toFixed(6));
const byBeat = new Map(timing.beats.map((beat) => [beat.id, []]));
for (const stage of timing.stages) byBeat.get(stage.beat).push(stage);

const sceneCss = `*{box-sizing:border-box}
@font-face{font-family:Sarabun;src:url("assets/fonts/Sarabun-Bold.ttf");font-weight:bold}
@font-face{font-family:Sarabun;src:url("assets/fonts/Sarabun-Regular.ttf");font-weight:normal}
html,body{margin:0;width:${timing.width}px;height:${timing.height}px;overflow:hidden;background:#f8f4e9}
#root{position:absolute;inset:0;width:${timing.width}px;height:${timing.height}px;overflow:hidden}
.plate{position:absolute;inset:0;width:${timing.width}px;height:${timing.height}px;object-fit:cover;opacity:0}
`;

function stageLayers(beat) {
  const stages = byBeat.get(beat.id);
  let cursor = 0;
  const images = stages.map((stage) => {
    const start = duration(cursor);
    const stageDuration = duration(stage.frames);
    const id = 'stage-' + stage.id;
    cursor += stage.frames;
    return `<img id="${id}" class="clip plate" data-start="${start}" data-duration="${stageDuration}" data-track-index="0" data-layout-allow-overlap="true" src="assets/plates/v4/${esc(stage.file)}" alt="${esc(beat.title + ' — ' + stage.id)}">`;
  }).join('\n');
  cursor = 0;
  const actions = stages.map((stage) => {
    const start = duration(cursor);
    cursor += stage.frames;
    const end = duration(cursor);
    const id = 'stage-' + stage.id;
    return `  tl.set("#${id}", {opacity:1}, ${start});\n  tl.set("#${id}", {opacity:0}, ${end});`;
  }).join('\n');
  return { images, actions };
}

function makeScene(beat) {
  const { images, actions } = stageLayers(beat);
  const rootStart = `<div id="root" data-composition-id="${beat.id}" data-width="${timing.width}" data-height="${timing.height}" data-duration="${beat.duration}" data-layout-allow-overlap="true">`;
  
  return `<template>\n<style>${sceneCss}</style>\n${rootStart}\n${images}\n</div>\n<script>\n` +
    `  window.__timelines = window.__timelines || {};\n` +
    `  const tl = gsap.timeline({paused:true});\n${actions}\n` +
    `  window.__timelines["${beat.id}"] = tl;\n` +
    `</script>\n</template>`;
}

await mkdir(path.join(here, 'compositions'), { recursive: true });
for (const beat of timing.beats) {
  await writeFile(path.join(here, 'compositions', beat.id + '.html'), makeScene(beat), 'utf8');
}

const hosts = timing.beats.map((beat, index) =>
  `<div id="${beat.id}" class="scene-host" data-composition-id="${beat.id}" data-composition-src="compositions/${beat.id}.html" data-start="${beat.start}" data-duration="${beat.duration}" data-track-index="${index}" data-track-kind="graphics" data-width="${timing.width}" data-height="${timing.height}" aria-label="${esc(beat.title)}"></div>`
).join('\n');

const main = `<!doctype html><html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=${timing.width}, initial-scale=1"><title>EP03 · Chat API · Animatic v4</title>
<style>
*{box-sizing:border-box}html,body{margin:0;width:${timing.width}px;height:${timing.height}px;overflow:hidden;background:#f8f4e9}
#root{position:relative;width:${timing.width}px;height:${timing.height}px;overflow:hidden;background:#f8f4e9}
.scene-host{position:absolute;inset:0}
</style></head><body><main id="root" data-composition-id="main" data-start="0" data-duration="${timing.durationSeconds}" data-width="${timing.width}" data-height="${timing.height}" data-fps="${timing.fps}">
${hosts}
</main><script src="assets/vendor/gsap.min.js"></script><script>
window.__timelines=window.__timelines||{};
window.__timelines["main"]=gsap.timeline({paused:true});
</script></body></html>`;

await writeFile(path.join(here, 'index.html'), main, 'utf8');
console.log(`Built EP03 animatic-v4: ${timing.beats.length} beats, ${timing.stages.length} visual stages, ${timing.durationSeconds}s @ ${timing.fps}fps`);

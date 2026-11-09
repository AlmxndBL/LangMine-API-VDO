import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(await readFile(path.join(root, 'renders/render-manifest-v4.2.json'), 'utf8'));
const total = manifest.duration_seconds;
const stages = manifest.stages;

const htmlStages = stages.map((stage, i) => {
  const start = stages.slice(0, i).reduce((sum, row) => sum + row.seconds, 0);
  const image = path.relative(root, stage.image).replaceAll('\\', '/');
  const id = `${stage.beat}-${stage.cue}`.replace(/[^a-zA-Z0-9_-]/g, '-');
  return `    <figure class="plate clip" id="plate-${id}" data-start="${start.toFixed(3)}" data-duration="${stage.seconds.toFixed(3)}" data-track-index="1"><img class="plate-image" src="${image}" alt="${stage.beat} ${stage.cue}" /></figure>`;
}).join('\n');

const html = `<!doctype html>
<html lang="th">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>EP03 · Chat API · video-v4.2</title>
  <link rel="stylesheet" href="style.css" />
  <script src="assets/gsap.min.js"></script>
</head>
<body>
  <main id="film" data-composition-id="ep03-chat-v42" data-width="${manifest.width}" data-height="${manifest.height}" data-fps="${manifest.fps}" data-duration="${total.toFixed(3)}">
${htmlStages}
  </main>
  <script src="motion.js"></script>
</body>
</html>
`;
await writeFile(path.join(root, 'index.html'), html, 'utf8');

const css = `@font-face{font-family:Sarabun;src:url('assets/fonts/Sarabun-Regular.ttf')}\n@font-face{font-family:Sarabun;src:url('assets/fonts/Sarabun-Bold.ttf');font-weight:700}\n*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#f8f5eb}#film{position:relative;width:${manifest.width}px;height:${manifest.height}px;overflow:hidden;background:#f8f5eb;font-family:Sarabun,sans-serif}.plate{position:absolute;inset:0;width:${manifest.width}px;height:${manifest.height}px;margin:0;overflow:hidden}.plate-image{display:block;width:100%;height:100%;object-fit:cover;opacity:0;transform:scale(1.015);will-change:transform,opacity}\n`;
await writeFile(path.join(root, 'style.css'), css, 'utf8');

const motion = `// Deterministic, seek-safe plate timeline; all text and mock UI are rasterized in reviewed source plates.\n(() => {\n const root=document.getElementById('film');\n const tl=gsap.timeline({paused:true});\n const items=[...root.querySelectorAll('.plate')];\n for(let i=0;i<items.length;i++){\n  const clip=items[i], image=clip.querySelector('.plate-image');\n  const start=Number(clip.dataset.start), duration=Number(clip.dataset.duration);\n  tl.set(image,{opacity:0,scale:1.015},start);\n  tl.to(image,{opacity:1,scale:1,duration:0.28,ease:'power2.out'},start);\n  if(i>0){const prev=items[i-1].querySelector('.plate-image');tl.to(prev,{opacity:0,duration:0.22,ease:'power1.in'},start+0.06)}\n }\n window.__timelines=window.__timelines||{};\n window.__timelines[root.dataset.compositionId]=tl;\n})();\n`;
await writeFile(path.join(root, 'motion.js'), motion, 'utf8');
console.log(`Generated index.html, style.css and motion.js: ${stages.length} plates, ${total.toFixed(2)}s @ ${manifest.fps}fps`);

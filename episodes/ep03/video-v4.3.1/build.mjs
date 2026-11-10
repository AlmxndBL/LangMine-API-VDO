import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const project = path.dirname(fileURLToPath(import.meta.url));
const timingPath = path.join(project, "timing.json");
const timing = JSON.parse(await readFile(timingPath, "utf8"));
const stepperTemplate = await readFile(path.join(project, "compositions/components/onboarding-stepper-flow.html"), "utf8");
const { charactersPerSecond, pauseSecondsPerBeat } = timing.durationFormula;

if (timing.beats.length !== 9) throw new Error(`Expected 9 beats, received ${timing.beats.length}`);
if (timing.width !== 1080 || timing.height !== 1920 || timing.fps !== 30) throw new Error("Unexpected composition size or fps");

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

let cursor = 0;
const beats = [];
await mkdir(path.join(project, "compositions"), { recursive: true });

for (const beat of timing.beats) {
  const characters = Array.from(beat.narration).length;
  const duration = characters / charactersPerSecond + pauseSecondsPerBeat + beat.holdSeconds;
  const row = {
    ...beat,
    characters,
    startSeconds: Number(cursor.toFixed(3)),
    durationSeconds: Number(duration.toFixed(3)),
    endSeconds: Number((cursor + duration).toFixed(3)),
  };
  const sourcePath = path.join(project, "source-scenes", `${beat.id}.html`);
  const source = await readFile(sourcePath, "utf8");
  if (!source.includes("__DURATION__")) throw new Error(`Missing duration token in ${sourcePath}`);
  const page = Number(beat.id.slice(1));
  const states = [1, 2, 3].map((number) => beat.step > number ? "done" : beat.step === number ? "active" : "");
  const stepper = stepperTemplate
    .replace("__STEP1_CLASS__", states[0])
    .replace("__STEP2_CLASS__", states[1])
    .replace("__STEP3_CLASS__", states[2]);
  const chrome = `<header class="series-header" data-layout-ignore><span>LANGMIND · EP03 / CHAT API</span><span class="page-index">${String(page).padStart(2, "0")} / 09</span></header>${stepper}`;
  const composition = source
    .replaceAll("__DURATION__", row.durationSeconds.toFixed(3))
    .replace('<div class="scene-ground" data-layout-ignore></div>', `<div class="scene-ground" data-layout-ignore></div>${chrome}`)
    .replace('const tl = gsap.timeline({ paused: true });', 'const tl = gsap.timeline({ paused: true });\n        tl.fromTo("#ep03-stepper .hf-ui-onboarding-steps span", { scale: 0.88, opacity: 0.55 }, { scale: 1, opacity: 1, duration: 0.28, stagger: 0.08, ease: "back.out(1.4)" }, 0.12);');
  await writeFile(path.join(project, "compositions", `${beat.id}.html`), composition, "utf8");
  beats.push(row);
  cursor += duration;
}

const totalDuration = Number(cursor.toFixed(3));
const sceneHosts = beats.map((beat, index) => `      <div id="host-${beat.id}" class="clip scene-host" data-composition-src="./compositions/${beat.id}.html" data-composition-id="${beat.id}" data-start="${beat.startSeconds.toFixed(3)}" data-duration="${beat.durationSeconds.toFixed(3)}" data-track-index="0" data-track-kind="graphics" style="z-index:${index + 1}"></div>`).join("\n");
const rootHtml = `<!doctype html>
<html lang="th">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=1080,height=1920" />
    <title>EP03 · Chat API · v4.3.1</title>
    <link rel="stylesheet" href="style.css" />
    <script src="assets/gsap.min.js"></script>
  </head>
  <body>
    <main id="root" class="scene-root" data-composition-id="ep03-chat-api-v431" data-width="${timing.width}" data-height="${timing.height}" data-fps="${timing.fps}" data-duration="${totalDuration.toFixed(3)}">
${sceneHosts}
      <div id="caption-host" class="clip scene-host" data-composition-src="./compositions/captions.html" data-composition-id="captions" data-start="0" data-duration="${totalDuration.toFixed(3)}" data-track-index="10" data-track-kind="captions" data-layout-allow-overlap style="z-index:20"></div>
    </main>
    <script src="motion.js"></script>
  </body>
</html>
`;
await writeFile(path.join(project, "index.html"), rootHtml, "utf8");

const captionClips = beats.map((beat, index) => `      <div id="caption-${beat.id}" class="clip caption-clip" data-start="${beat.startSeconds.toFixed(3)}" data-duration="${beat.durationSeconds.toFixed(3)}" data-track-index="${index}"><div class="caption-inner"><p>${escapeHtml(beat.subtitle).replaceAll("\n", "<br />")}</p></div></div>`).join("\n");
const captionMotion = beats.map((beat) => `        { const node = document.querySelector("#caption-${beat.id} .caption-inner"); const start = ${beat.startSeconds.toFixed(3)}; const end = ${(beat.startSeconds + beat.durationSeconds).toFixed(3)}; gsap.set(node, { opacity: 0 }); tl.to(node, { opacity: 1, duration: 0.12, ease: "none" }, start); tl.to(node, { opacity: 0, duration: 0.10, ease: "none" }, Math.max(start, end - 0.10)); }`).join("\n");
const captionsHtml = `<!doctype html>
<html lang="th">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=1080,height=1920" />
    <link rel="stylesheet" href="../style.css" />
    <script src="../assets/gsap.min.js"></script>
  </head>
  <body>
    <main id="root" style="position:relative;width:1080px;height:1920px;overflow:hidden;background:transparent;font-family:Sarabun,sans-serif;color:var(--ink)" data-composition-id="captions" data-width="1080" data-height="1920" data-duration="${totalDuration.toFixed(3)}">
${captionClips}
    </main>
    <script>
      (() => {
        const root = document.getElementById("root");
        const tl = gsap.timeline({ paused: true });
${captionMotion}
        tl.to({}, { duration: ${totalDuration.toFixed(3)} }, 0);
        window.__timelines = window.__timelines || {};
        window.__timelines[root.dataset.compositionId] = tl;
      })();
    </script>
  </body>
</html>
`;
await writeFile(path.join(project, "compositions", "captions.html"), captionsHtml, "utf8");

const rootMotion = `(() => {\n  const root = document.getElementById("root");\n  const tl = gsap.timeline({ paused: true });\n  tl.to({}, { duration: ${totalDuration.toFixed(3)} }, 0);\n  window.__timelines = window.__timelines || {};\n  window.__timelines[root.dataset.compositionId] = tl;\n})();\n`;
await writeFile(path.join(project, "motion.js"), rootMotion, "utf8");
await writeFile(path.join(project, "timing.generated.json"), `${JSON.stringify({ ...timing, beats, totalDurationSeconds: totalDuration }, null, 2)}\n`, "utf8");

const timingTable = beats.map((beat) => `| ${beat.id.toUpperCase()} | ${beat.startSeconds.toFixed(3)} | ${beat.durationSeconds.toFixed(3)} | ${beat.endSeconds.toFixed(3)} | ${beat.characters} | ${beat.holdSeconds.toFixed(2)} |`).join("\n");
const timingMarkdown = `# EP03 v4.3.1 — Silent timing\n\nDuration estimate: ${totalDuration.toFixed(3)} s (${(totalDuration * timing.fps).toFixed(0)} frames) at ${timing.fps} fps.\n\nFormula: Unicode code points in narration ÷ ${charactersPerSecond} characters/s + ${pauseSecondsPerBeat} s per beat + listed hold. This is an editorial estimate, not audio synchronization.\n\n| Beat | Start (s) | Duration (s) | End (s) | Characters | Hold (s) |\n|---|---:|---:|---:|---:|---:|\n${timingTable}\n\nSilent draft only; captions show the review script, with no recorded voice.\n`;
await writeFile(path.join(project, "SILENT-TIMING.md"), timingMarkdown, "utf8");

console.log(`Generated 9 scene compositions and captions: ${totalDuration.toFixed(3)}s, ${(totalDuration * timing.fps).toFixed(0)} frames @ ${timing.fps}fps.`);


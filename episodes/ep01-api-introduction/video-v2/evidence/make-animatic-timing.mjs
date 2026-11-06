import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const story = JSON.parse(fs.readFileSync(path.join(root, 'story.json'), 'utf8'));
let cursor = 0;
for (const scene of story) {
  let local = 0;
  scene.captions = scene.captionText.map(text => {
    const start = local;
    local += Math.max(2.25, text.length / 13);
    return { text, start, end: local };
  });
  scene.start = cursor;
  scene.duration = local + .25;
  cursor += scene.duration;
}
fs.writeFileSync(path.join(root, 'timing.json'), JSON.stringify({duration:cursor, status:'visual-animatic-no-complete-voice', timingMethod:'Authored meaning groups, provisional reading holds; not speech-synchronized', scenes:story}, null, 2));
console.log('Animatic duration', cursor.toFixed(3), 'seconds; no complete narration');

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const story = JSON.parse(fs.readFileSync(path.join(root, 'story.json'), 'utf8'));
const segmenter = new Intl.Segmenter('th', { granularity: 'word' });
let cursor = 0;
for (const scene of story) {
  const groups = [];
  let group = '';
  for (const { segment } of segmenter.segment(scene.narration)) {
    if (group.length + segment.length > 56 && group.trim()) {
      groups.push(group.trim());
      group = '';
    }
    group += segment;
  }
  if (group.trim()) groups.push(group.trim());
  let local = .15;
  scene.captions = groups.map(text => {
    const start = local;
    local += Math.max(2, text.length / 16);
    return { text, start, end: local - .05 };
  });
  scene.start = cursor;
  scene.duration = Math.round((local + .6) * 1000) / 1000;
  cursor += scene.duration;
}
fs.writeFileSync(path.join(root, 'timing.json'), JSON.stringify({duration:cursor, status:'visual-animatic-no-complete-voice', timingMethod:'Thai word groups, 16 code units per second starting estimate; not speech-synchronized', scenes:story}, null, 2));
console.log('Animatic duration', cursor.toFixed(3), 'seconds; no complete narration');

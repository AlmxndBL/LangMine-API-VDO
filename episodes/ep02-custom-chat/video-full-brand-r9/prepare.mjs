import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url));
const prior=path.resolve(dir,'../video-final-notebook-v1');
const timing=JSON.parse(fs.readFileSync(path.join(dir,'timing.json')));
const source=JSON.parse(fs.readFileSync(path.join(prior,'shots.json')));
// Explainroo scenes have a one-second floor; borrow two frames from the next shot.
const brief=source.findIndex(s=>s.id==='b07-1');
source[brief+1].start=source[brief].start+1;
const shots=source.map((shot,i)=>{const start=Math.round(shot.start*30)/30;const end=i+1<source.length?Math.round(source[i+1].start*30)/30:timing.total;return {...shot,start,duration:end-start,scene:shot.id.replaceAll('-','_')};});
const captions=JSON.parse(fs.readFileSync(path.join(dir,'captions-summary.json')));
fs.writeFileSync(path.join(dir,'data.js'),`export const shots=${JSON.stringify(shots,null,2)};\nexport const captions=${JSON.stringify(captions,null,2)};\n`);
fs.writeFileSync(path.join(dir,'shots.json'),JSON.stringify(shots,null,2));
fs.writeFileSync(path.join(dir,'script.md'),'# EP02 LangMind brand full\n\n'+shots.map(x=>`## ${x.scene} {min=${x.duration.toFixed(9)} hold=0 lead=0 transition=cut}\n> ${x.title}. Audio is muxed from original approved 1x narration after visual render.\n`).join('\n'));
const config=JSON.parse(fs.readFileSync(path.join(dir,'video.json')));config.title='EP02 · เว็บแชทของเราเองด้วย LangMind API · Brand r9';fs.writeFileSync(path.join(dir,'video.json'),JSON.stringify(config,null,2));
const assets=fs.readdirSync(path.join(dir,'assets')).map(name=>({name,bytes:fs.statSync(path.join(dir,'assets',name)).size}));
fs.writeFileSync(path.join(dir,'evidence/asset-files.json'),JSON.stringify(assets,null,2));
console.log(JSON.stringify({shots:shots.length,frames:Math.round(timing.total*30),duration:shots.reduce((n,s)=>n+s.duration,0),gaps:shots.slice(1).filter((s,i)=>Math.abs(s.start-shots[i].start-shots[i].duration)>1e-6).length}));

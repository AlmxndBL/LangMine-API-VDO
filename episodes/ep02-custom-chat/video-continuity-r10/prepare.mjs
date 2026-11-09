import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url));
const story=fs.readFileSync(path.resolve(dir,'../STORYBOARD.md'),'utf8');
const parts=[...story.matchAll(/^## (B\d{2}) · ([^\n]+) · (\d+)s\r?\n([\s\S]*?)(?=^## |$(?![\s\S]))/gm)];
if(parts.length!==16)throw Error(`Expected 16 scenes, got ${parts.length}`);
let start=0;
const beats=parts.map(m=>{const b={id:m[1],start,duration:Number(m[3]),narration:m[4].match(/- บทพากย์: “([^”]+)”/)?.[1],sequence:m[4].match(/- ลำดับ: (.+)/)?.[1],camera:m[4].match(/- Camera\/focus: (.+)/)?.[1],audioStatus:'deferred-by-user; no recording generated or reused',in:null,out:null};start+=b.duration;return b;});
if(start!==440||beats.some(b=>!b.narration))throw Error('Storyboard parse mismatch');
fs.writeFileSync(path.join(dir,'vo-map-cues.json'),JSON.stringify({status:'silent-visual-draft',timingBasis:'STORYBOARD design budget; not measured VO',duration:start,fps:30,beats},null,2));
fs.writeFileSync(path.join(dir,'data.js'),`export const beats=${JSON.stringify(beats)};\n`);
fs.writeFileSync(path.join(dir,'script.md'),'# EP02 continuity r10 · silent visual draft\n\n'+beats.map(b=>`## ${b.id} {min=${b.duration} hold=0 lead=0 transition=cut}\n> ${b.sequence}\n> Silent version explicitly requested; narration retained in vo-map-cues.json only.\n`).join('\n'));
const config=JSON.parse(fs.readFileSync(path.join(dir,'video.json')));config.title='EP02 · continuity r10 · ไม่มีเสียง';config.fps=30;config.camera='still';config.end=0;config.music=false;config.sfx=false;config.captions=false;config.motionBlur=false;delete config.voice;
fs.writeFileSync(path.join(dir,'video.json'),JSON.stringify(config,null,2));
fs.writeFileSync(path.join(dir,'captions-th.srt'),'');
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const assets=fs.readdirSync(path.join(dir,'assets')).map(name=>{
  const item={file:'assets/'+name,bytes:fs.statSync(path.join(dir,'assets',name)).size,sha256:sha(path.join(dir,'assets',name)),visualReview:'pending'};
  if(name.startsWith('code-')){item.kind='actual Catalog code-highlight prerender / hold frame';item.source='compositions/code-highlight-'+name.replace(/^code-/,'').replace(/-hold\.png$|\.mp4$/,'')+'.html';}
  else if(name.startsWith('R')){item.kind='generated fictional demo UI raster';item.source='built-in imagegen; raster-prompts.json';if(name==='R06-mobile.png')item.source='assets/R05-answer.png (exact reuse for continuity)';}
  else if(name.startsWith('K-')){item.kind='historical footage / sanitized reference';item.source='../video-full-r3/assets/'+(name.includes('agent')?'agent-url.png':'key-'+name.replace(/^K-/,'').replace(/-hold\.png$|\.mp4$/,'')+'.mp4');item.processing=name.includes('agent')?'crop x0 y0 w350 h74 excludes UUID':name.includes('hold')?'last real frame, no invented UI':'audio removed, original form content retained';}
  else if(name.includes('logo')){item.kind='original shared logo';item.source='../../../shared/assets/brand/langmind-logo.png';}
  else if(name==='gsap.min.js'){item.kind='local GSAP runtime';item.source='../video-full-r3/assets/gsap.min.js';}
  else{item.kind=name.endsWith('.txt')?'font license':'local Sarabun font';item.source=name.endsWith('.txt')?'../../ep01-api-introduction/video-voice/assets/fonts/Sarabun-OFL.txt':'../video-full-brand-r9/assets/'+name;}
  return item;
});
fs.writeFileSync(path.join(dir,'asset-manifest.json'),JSON.stringify({status:'in-production',noLiveAPI:true,noTTS:true,sourceDesign:'../DESIGN.md r10 only',assets},null,2));
console.log(JSON.stringify({scenes:beats.length,duration:start,frames:start*30,narratedScenes:0,assets:assets.length}));

import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const dir=path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/,'$1'));
const timing=JSON.parse(fs.readFileSync(path.join(dir,'timing.json'),'utf8'));
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const audio=[];
for(const b of timing.beats){const p=path.join(dir,'assets',b.file);const origin=path.join('C:/Users/Admin/Downloads',b.file);const same=sha(p)===sha(origin);if(!same)throw Error(b.id+' audio changed');audio.push({beat:b.id,file:'assets/'+b.file,duration:b.duration,start:b.start,sha256:sha(p),sourceHashMatches:same,speed:1});}
const manifest={audio,visualAssets:fs.readdirSync(path.join(dir,'assets')).filter(f=>/\.(png|mp4|ttf)$/.test(f)).map(f=>({file:'assets/'+f,sha256:sha(path.join(dir,'assets',f))})),total:timing.total,provider:'No API calls; supplied Voice Studio WAV files',catalog:['chatgpt-exchange','ai-chat-reveal','flowchart-vertical','code-highlight','code-diff','onboarding-stepper-flow','dart-cursor','multi-device-splay','extruded-logo']};
fs.writeFileSync(path.join(dir,'evidence/asset-manifest.json'),JSON.stringify(manifest,null,2));
console.log(JSON.stringify({audioFiles:audio.length,sourceHashMatches:audio.every(a=>a.sourceHashMatches),speed:1,total:timing.total}));
const out=path.join(dir,'ep02-complete-notebook-v1.mp4');
if(fs.existsSync(out)){
 const probe=JSON.parse(execFileSync('ffprobe',['-v','error','-show_streams','-show_format','-of','json',out],{encoding:'utf8'}));
 const video=probe.streams.find(s=>s.codec_type==='video'),sound=probe.streams.find(s=>s.codec_type==='audio');
 if(!sound||video.width!==1080||video.height!==1920||Math.abs(+probe.format.duration-timing.total)>.12)throw Error('Export format mismatch');
 execFileSync('ffmpeg',['-v','error','-i',out,'-f','null','-'],{stdio:'pipe'});
 const result={file:'ep02-complete-notebook-v1.mp4',sha256:sha(out),duration:probe.format.duration,width:video.width,height:video.height,fps:video.r_frame_rate,videoCodec:video.codec_name,audioCodec:sound.codec_name,bytes:fs.statSync(out).size,fullDecode:'PASS'};
 fs.writeFileSync(path.join(dir,'evidence/export-verification.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
}

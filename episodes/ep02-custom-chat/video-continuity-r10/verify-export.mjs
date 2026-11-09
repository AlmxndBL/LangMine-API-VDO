import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync,spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url));
const file=path.join(dir,'ep02-continuity-r10.mp4');
const ev=path.join(dir,'evidence');
const run=(cmd,args,encoding='utf8')=>execFileSync(cmd,args,{encoding,maxBuffer:128*1024*1024});
const probe=JSON.parse(run('ffprobe',['-v','error','-show_streams','-show_format','-of','json',file]));
fs.writeFileSync(path.join(ev,'ffprobe.json'),JSON.stringify(probe,null,2));
const v=probe.streams.find(s=>s.codec_type==='video'),a=probe.streams.find(s=>s.codec_type==='audio');
if(v.codec_name!=='h264'||v.width!==1080||v.height!==1920||v.r_frame_rate!=='30/1'||Number(v.nb_frames)!==13200)throw Error('Video export format mismatch');
if(a.codec_name!=='aac'||a.sample_rate!=='48000'||a.channels!==2)throw Error('Audio format mismatch');
const decode=spawnSync('ffmpeg',['-hide_banner','-v','error','-i',file,'-f','null','-'],{encoding:'utf8',maxBuffer:4*1024*1024});
fs.writeFileSync(path.join(ev,'full-decode.log'),decode.stderr||'FFmpeg full decode: exit 0; no error output\n');
if(decode.status!==0)throw Error('Full decode failed: '+decode.stderr);
const silence=spawnSync('ffmpeg',['-hide_banner','-i',file,'-af','volumedetect,silencedetect=noise=-80dB:d=0.5','-vn','-f','null','-'],{encoding:'utf8',maxBuffer:4*1024*1024});
fs.writeFileSync(path.join(ev,'audio-silence.log'),silence.stderr);
const times=[0,3.4,5,11,13.5,18.3,21,37,43,55,65,70,80,88,100,105,110,115,120,125,130,141,146.5,151,160,170,173,176,181,188,196,199,202,208,212,216,224,230,235,242,246,252,261,265,270,272,278,280,285,291,292.3,295,300,306,310,315,316.3,320,323.5,324,328,332,333.5,335.5,338,341,345,353,355,362,370,373,380.5,382,388,395,397,405,412,419,420.3,421,423,428,435,439];
fs.mkdirSync(path.join(ev,'export-frames'),{recursive:true});
for(let i=0;i<times.length;i++){const name=String(i+1).padStart(3,'0');run('ffmpeg',['-v','error','-ss',String(times[i]),'-i',file,'-frames:v','1','-y',path.join(ev,'export-frames',name+'.png')]);}
for(let i=0;i<times.length;i+=9){run('ffmpeg',['-v','error','-start_number',String(i+1),'-i',path.join(ev,'export-frames/%03d.png'),'-vf','scale=360:640,tile=3x3','-frames:v','1','-y',path.join(ev,`export-sheet-${Math.floor(i/9)+1}.jpg`)]);}
const cornerResults=[];
for(const [x,y] of [[0,0],[1060,0],[0,1900],[1060,1900]]){const rgb=run('ffmpeg',['-v','error','-ss','423','-i',file,'-t','17','-vf',`crop=20:20:${x}:${y}`,'-pix_fmt','rgb24','-f','rawvideo','-'],null);let min=255,max=0;for(const value of rgb){min=Math.min(min,value);max=Math.max(max,value);}cornerResults.push({x,y,min,max,frames:rgb.length/(20*20*3)});}
fs.writeFileSync(path.join(ev,'export-frame-index.json'),JSON.stringify(times.map((time,i)=>({time,file:`export-frames/${String(i+1).padStart(3,'0')}.png`})),null,2));
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const manifest=JSON.parse(fs.readFileSync(path.join(dir,'asset-manifest.json')));
for(const asset of manifest.assets){const f=path.join(dir,asset.file);if(/\.(png|mp4)$/.test(f)){asset.media=JSON.parse(run('ffprobe',['-v','error','-show_entries','stream=codec_name,width,height,pix_fmt,duration','-of','json',f])).streams;}if(f.endsWith('.png')){const alpha=run('ffmpeg',['-v','error','-i',f,'-vf','format=rgba,alphaextract','-frames:v','1','-pix_fmt','gray','-f','rawvideo','-'],null);let min=255,max=0,nonOpaque=0;for(const value of alpha){min=Math.min(min,value);max=Math.max(max,value);if(value<255)nonOpaque++;}asset.alpha={min,max,nonOpaquePixels:nonOpaque};}}
manifest.assets.forEach(a=>{a.visualReview=a.file.startsWith('assets/R')?'opened generated state and host preflight; export review recorded in REVIEW.md':'see REVIEW.md';});
fs.writeFileSync(path.join(dir,'asset-manifest.json'),JSON.stringify(manifest,null,2));
const report={file:path.basename(file),bytes:fs.statSync(file).size,sha256:sha(file),duration:Number(probe.format.duration),frames:Number(v.nb_frames),video:{codec:v.codec_name,width:v.width,height:v.height,fps:v.r_frame_rate,pixFmt:v.pix_fmt,colorRange:v.color_range,colorSpace:v.color_space},audio:{codec:a.codec_name,rate:a.sample_rate,channels:a.channels,status:'silent track by explicit user request; no VO/BGM/SFX'},fullDecodeExit:decode.status,exportFrames:times.length,whiteEndCorners:cornerResults,sourceHashes:{api:sha(path.resolve(dir,'../../..','langmind-api.md')),logo:sha(path.join(dir,'assets/langmind-logo.png'))}};
fs.writeFileSync(path.join(ev,'export-verification.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));

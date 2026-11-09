import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const dir=path.dirname(fileURLToPath(import.meta.url));
const project=path.resolve(dir,'..');
const cues=JSON.parse(fs.readFileSync(path.join(project,'vo-map-cues.json'),'utf8'));
const speed=1.25;
const duration=cues.duration/speed;
const output=path.join(dir,'ep02-r10-125x-boxed-captions.mp4');
const srt=path.join(dir,'captions-th-r10-125x.srt');
const metadata=path.join(dir,'chapters-r10-125x.ffmeta');
const run=(cmd,args)=>execFileSync(cmd,args,{cwd:dir,encoding:'utf8',maxBuffer:24*1024*1024});
const captionText={
  B01:'แชทรู้ได้อย่างไร\\Nว่า “ขอสั้นลง” หมายถึงอะไร?',
  B02:'ใช้เว็บช่วยทีมขาย\\Nร่างข้อความให้ลูกค้า',
  B03:'หน้าเว็บส่งข้อความผ่าน server\\Nแล้วคุยกับ LangMind Agent',
  B04:'Agent ID เลือกผู้ช่วย\\NAPI key ยืนยันสิทธิ์',
  B05:'ตั้งชื่อ key เลือกอายุ\\Nและสิทธิ์ chat:invoke',
  B06:'เก็บ key กับ Agent ID\\Nไว้ฝั่ง server',
  B07:'หน้าเว็บส่งข้อความให้ /api/chat\\Nserver จัดการก่อนเรียก Agent',
  B08:'POST ส่งคำถามพร้อม key\\Nครั้งแรก conversation_id = null',
  B09:'server ส่งคำขอ ตรวจผล\\Nแล้วค่อยนำคำตอบไปใช้',
  B10:'answer คือคำตอบ\\Nconversation_id เชื่อมแชทเดิม',
  B11:'แอปแจ้งว่ากำลังรอ\\Nและเก็บข้อความเมื่อล้มเหลว',
  B12:'ถามต่อด้วย conversation_id เดิม\\Nserver ตรวจเจ้าของบทสนทนา',
  B13:'คำตอบทยอยขึ้นได้\\Nแต่ต้องปรับทั้ง server และหน้าเว็บ',
  B14:'ออกแบบหน้าจอให้เหมาะกับทีม\\Nการเรียก Agent ใช้หลักเดิม',
  B15:'Agent ID เลือกผู้ช่วย\\NAPI key ยืนยันสิทธิ์\\Nconversation_id เชื่อมแชทเดิม',
  B16:'เริ่มจากข้อความเดียว\\Nแล้วลองถามต่อในแชทเดิม'
};
const sec=t=>{const ms=Math.round(t*1000);return `${String(Math.floor(ms/3600000)).padStart(2,'0')}:${String(Math.floor(ms/60000)%60).padStart(2,'0')}:${String(Math.floor(ms/1000)%60).padStart(2,'0')},${String(ms%1000).padStart(3,'0')}`;};
if(cues.beats.length!==16||cues.duration!==440)throw new Error('Expected r10 16 beat / 440s cues');
const inputs=[];const srtBlocks=[];
for(const [i,b] of cues.beats.entries()){
  const wav=path.join(dir,'assets',`${b.id}.wav`);
  if(!fs.existsSync(wav))throw new Error(`Missing ${wav}`);
  const seconds=Number(run('ffprobe',['-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',wav]).trim());
  if(!Number.isFinite(seconds)||seconds>b.duration)throw new Error(`${b.id} voice ${seconds}s exceeds beat ${b.duration}s`);
  b.in=0;b.out=seconds;b.audioStatus='Kore custom TTS, WAV; playback speed 1.25x';
  inputs.push('-i',wav);
  const begin=b.start/speed;
  const end=(cues.beats[i+1]?.start??cues.duration)/speed;
  const caption=captionText[b.id];
  if(!caption)throw new Error(`Missing concise caption for ${b.id}`);
  srtBlocks.push(`${i+1}\n${sec(begin)} --> ${sec(end)}\n${caption.replaceAll('\\N','\n')}\n`);
}
fs.writeFileSync(srt,srtBlocks.join('\n'),'utf8');
const escMeta=s=>s.replace(/\\/g,'\\\\').replace(/=/g,'\\=').replace(/;/g,'\\;').replace(/#/g,'\\#').replace(/,/g,'\\,').replace(/\n/g,' ');
fs.writeFileSync(metadata,[';FFMETADATA1',...cues.beats.flatMap((b,i)=>['[CHAPTER]','TIMEBASE=1/1000',`START=${Math.round(b.start/speed*1000)}`,`END=${Math.round((cues.beats[i+1]?.start??cues.duration)/speed*1000)}`,`title=${escMeta(b.id+' · '+b.narration.slice(0,54))}`])].join('\n'),'utf8');
const filters=cues.beats.map((b,i)=>`[${i+1}:a]adelay=${Math.round(b.start*1000)}|${Math.round(b.start*1000)},aresample=48000,aformat=channel_layouts=stereo[v${i}]`).join(';')+
  ';'+cues.beats.map((_,i)=>`[v${i}]`).join('')+`amix=inputs=${cues.beats.length}:duration=longest:normalize=0,atempo=${speed},apad=whole_dur=${duration},atrim=duration=${duration}[aout]`;
const videoFilter=`setpts=PTS/${speed}`;
run('ffmpeg',['-hide_banner','-v','error','-i',path.join(project,'out/explainroo-master-v5.mp4'),...inputs,'-f','ffmetadata','-i',metadata,'-filter_complex',filters,'-map','0:v:0','-map','[aout]','-map_metadata','17','-map_chapters','17','-vf',videoFilter,'-t',String(duration),'-r','30','-c:v','libx264','-preset','veryfast','-crf','19','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-ar','48000','-movflags','+faststart','-y',output]);
run('ffmpeg',['-hide_banner','-v','error','-i',output,'-f','null','-']);
const probe=JSON.parse(run('ffprobe',['-v','error','-show_streams','-show_format','-show_chapters','-of','json',output]));
const video=probe.streams.find(s=>s.codec_type==='video');const audio=probe.streams.find(s=>s.codec_type==='audio');
if(Math.abs(Number(probe.format.duration)-duration)>0.1||video.width!==1080||video.height!==1920||video.r_frame_rate!=='30/1'||audio.sample_rate!=='48000'||probe.chapters.length!==16)throw new Error('Output stream verification failed');
const sha=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const report={file:path.basename(output),sourceDuration:cues.duration,duration:Number(probe.format.duration),playbackSpeed:speed,video:{codec:video.codec_name,width:video.width,height:video.height,fps:video.r_frame_rate},audio:{codec:audio.codec_name,sampleRate:audio.sample_rate,channels:audio.channels,tempo:speed},captions:{format:'concise Thai summaries shown in dark green scene cards',cues:cues.beats.length,sidecar:path.basename(srt)},chapters:probe.chapters.length,removedSceneLabels:['ฉบับภาพ · ไม่มีเสียง','ภาพจำลอง · คำตอบตัวอย่าง'],voiceFiles:cues.beats.map(b=>({id:b.id,start:b.start/speed,duration:Number((b.out/speed).toFixed(3)),sha256:sha(path.join(dir,'assets',`${b.id}.wav`))})),sha256:sha(output),decodeExit:0};
fs.writeFileSync(path.join(dir,'verification-125x.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({output,duration:report.duration,speed,video:report.video,audio:report.audio,captions:cues.beats.length,chapters:report.chapters,decodeExit:0,sha256:report.sha256},null,2));

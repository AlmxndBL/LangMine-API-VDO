import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {launch} from '../../../../.tools/explainroo/src/browser.js';
const ev=path.dirname(fileURLToPath(import.meta.url));
const file=path.resolve(ev,'../ep02-continuity-r10.mp4');
fs.writeFileSync(path.join(ev,'playback-source.json'),JSON.stringify({file:'../ep02-continuity-r10.mp4',sha256:crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),player:{width:360,height:640,rate:1}},null,2));
const browser=await launch();
const log=[];
const ranges=[
  {name:'hook',start:0,end:40,cues:[.2,4,10.2,13.5,18.3,21,37]},
  {name:'data-path',start:172,end:198,cues:[173,176,181,188,196]},
  {name:'answer-followup',start:264,end:354,cues:[265,272,280,291,292.3,300,310,316.3,320,323.5,328,333.5,335.5,341,353]},
  {name:'closing',start:420,end:439.8,cues:[420.2,423,428,438]}
];
try{
  const page=await browser.newPage({viewport:{width:360,height:640},deviceScaleFactor:1});
  const html=path.join(ev,'playback-review.html');
  fs.writeFileSync(html,`<!doctype html><html lang="th"><head><meta charset="utf-8"><title>EP02 r10 playback QA</title><style>*{margin:0}body{background:#000}video{display:block;width:360px;height:640px}</style></head><body><video id="v" muted playsinline preload="auto" src="${pathToFileURL(file).href}"></video></body></html>`);
  await page.goto(pathToFileURL(html).href);await page.waitForFunction(()=>document.querySelector('video').readyState>=2,null,{timeout:20000});
  for(const range of ranges){
    await page.evaluate(async start=>{const v=document.querySelector('video');v.pause();if(Math.abs(v.currentTime-start)>.001){await new Promise((resolve,reject)=>{v.addEventListener('seeked',resolve,{once:true});v.addEventListener('error',reject,{once:true});v.currentTime=start;});}v.playbackRate=1;await v.play();},range.start);
    for(const cue of range.cues){await page.waitForFunction(t=>document.querySelector('video').currentTime>=t,cue,{polling:50,timeout:30000});const state=await page.evaluate(()=>{const v=document.querySelector('video');return {time:v.currentTime,paused:v.paused,readyState:v.readyState,playbackRate:v.playbackRate,frames:v.getVideoPlaybackQuality().totalVideoFrames,dropped:v.getVideoPlaybackQuality().droppedVideoFrames};});const name=`playback-${range.name}-${String(cue).replace('.','_')}.png`;await page.screenshot({path:path.join(ev,name)});log.push({range:range.name,cue,...state,file:name});fs.writeFileSync(path.join(ev,'playback-review.json'),JSON.stringify(log,null,2));console.log(range.name+' '+state.time.toFixed(2)+'s playing='+!state.paused);}
    await page.waitForFunction(t=>document.querySelector('video').currentTime>=t,range.end,{polling:50,timeout:30000});await page.evaluate(()=>{document.querySelector('video').pause();});
  }
  await page.close();
}finally{await browser.close();}

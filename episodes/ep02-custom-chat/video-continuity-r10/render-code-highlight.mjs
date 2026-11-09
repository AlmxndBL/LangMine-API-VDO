import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawn,execFileSync} from 'node:child_process';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {once} from 'node:events';
import {launch} from '../../../.tools/explainroo/src/browser.js';
import scenes from './scenes.js';
import {codeCues} from './code-cues.js';
const dir=path.dirname(fileURLToPath(import.meta.url));
const source=fs.readFileSync(path.join(dir,'catalog-source/code-highlight.html'),'utf8');
const assets=path.join(dir,'assets');
const calls=[];
const noop=()=>{};
const ctx=new Proxy({measureText:t=>({width:String(t).length*24})},{get:(o,k)=>o[k]??noop,set:(o,k,v)=>(o[k]=v,true)});
for(const cue of codeCues){const s={id:cue.scene,t:cue.start+.01,ctx,ui:new Proxy({},{get:()=>noop}),camera:noop,draw:noop,captureCode:data=>calls.push({...cue,...data})};scenes[cue.scene](s);}
if(calls.length!==13)throw Error('Code cue capture mismatch');
fs.writeFileSync(path.join(dir,'code-highlight-cases.json'),JSON.stringify(calls,null,2));
const escape=t=>t.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const css=`
@font-face{font-family:Sarabun;src:url('../assets/Sarabun-Regular.ttf')}
html,body,#root{width:792px!important;height:820px!important;background:#071719!important;font-family:Sarabun!important}
.bg-field,.bg-grid,.bg-glow,.dots{display:none!important}
.editor{inset:0!important;left:0!important;top:0!important;transform:none!important;width:792px!important;height:820px!important;background:#071719!important;border:1px solid #35575a!important;box-shadow:none!important;border-radius:18px!important}
.titlebar{height:100px!important;flex:0 0 100px!important;background:#071719!important;border-color:#35575a!important;padding:0 32px!important}
.filename{font-family:Sarabun!important;font-size:42px!important;color:#B7CBCA!important;letter-spacing:0!important}
.code{top:42px!important;padding:0 28px 0 82px!important;font-size:48px!important;line-height:72px!important;font-family:Sarabun!important}
.gutter{top:42px!important;width:62px!important;padding-right:12px!important;font-size:28px!important;line-height:72px!important;color:#92afad!important;font-family:Sarabun!important}
.line,.ln{min-height:72px!important;height:72px!important;line-height:72px!important}
.tok{font-family:Sarabun!important;white-space:pre!important}
.hl-box{background:rgba(128,206,236,.20)!important;border-left:3px solid #80CEEC!important}
`;
const browser=await launch();
try{
  const page=await browser.newPage({viewport:{width:792,height:820},deviceScaleFactor:1});
  await page.route(/^https?:/,r=>r.abort());
  for(const item of calls){
    let html=source.replace(/src="[^\"]*gsap[^\"]*"/,'src="../assets/gsap.min.js"').replace('</head>',`<style>${css}</style></head>`);
    html=html.replace('data-width="1920"','data-width="792"').replace('data-height="1080"','data-height="820"').replace('data-duration="5"','data-duration="1.2"');
    html=html.replace(/<span class="filename"[\s\S]*?<\/span>\s*<\/div>/,`<span class="filename">${escape(item.title)}</span></div>`);
    const setup=`window.__TOKENS={};window.__BLOCK={id:'code-highlight',effect:'highlight',seq:'feature',line:0,duration:1.2};window.__buildTokens=function(){
      const data=${JSON.stringify(item)},ctx=document.createElement('canvas').getContext('2d');ctx.font='48px Sarabun';
      document.querySelector('.filename').textContent=data.title;
      let lines=[],target=0;const segmenter=new Intl.Segmenter('th',{granularity:'word'});
      data.rows.forEach((row,i)=>{if(i===data.active)target=lines.length;for(const paragraph of row.split('\\n')){let line='';for(const {segment} of segmenter.segment(paragraph)){if(line&&ctx.measureText(line+segment).width>660){lines.push(line.trimEnd());line=segment.trimStart();}else line+=segment;}lines.push(line);}});
      const tokens=[];lines.forEach((line,i)=>{for(const part of line.split(/(\\s+|[:{}(),;])/).filter(Boolean)){let color=/^(const|await|if|return|fetch|POST|Authorization|Content-Type|query|answer|agent_id|conversation_id|process.env)$/.test(part)?'#80CEEC':part.includes('<')||part.includes('conv_demo')||part.includes('Bearer')?'#B7DD78':'#E3EEED';tokens.push({key:'line'+i+'-'+tokens.length,content:part,color,fontStyle:0});}tokens.push({key:'nl'+i,content:'\\n',color:'#E3EEED',fontStyle:0});});
      window.__TOKENS={feature:{states:[{code:lines.join('\\n'),tokens}]}};window.__BLOCK.line=target;window.__caseLayout={lines,target};
    };`;
    html=html.replace(/<script>\s*window\.__TOKENS[\s\S]*?<\/script>/,`<script>${setup}</script>`);
    html=html.replace('var FADE = 0.45;','var FADE = 0;').replace('var start = 0.45;','var start = 0;').replace('{ opacity: 0.45, duration: SWEEP','{ opacity: 0.65, duration: SWEEP');
    html=html.replace('document.fonts.ready.then(function () {','document.fonts.ready.then(function () {window.__buildTokens();T=window.__TOKENS;');
    html=html.replace(/tl\.from\("#editor",[^\n]+\n/,'');
    if(item.zoom)html=html.replace('buildEffect(tl, surface, spec);','buildEffect(tl, surface, spec);tl.fromTo(document.querySelectorAll(".line")[spec.line],{scale:1,transformOrigin:"left top"},{scale:1.15,duration:.8,ease:"power1.inOut"},0);');
    const file=path.join(dir,'compositions',`code-highlight-${item.id}.html`);
    fs.writeFileSync(file,html);
    await page.goto(pathToFileURL(file).href);await page.waitForFunction(()=>!!window.__timelines?.['code-highlight']);
    const layout=await page.evaluate(()=>window.__caseLayout);
    if(layout.lines.length>9)throw Error(item.id+' exceeds 9 visible physical lines');
    const out=path.join(assets,`code-${item.id}.mp4`);
    const ff=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-framerate','30','-c:v','mjpeg','-i','-','-c:v','libx264','-preset','veryfast','-crf','17','-pix_fmt','yuv420p','-an',out],{stdio:['pipe','ignore','pipe']});
    let stderr='';ff.stderr.on('data',d=>stderr+=d);
    for(let frame=0;frame<36;frame++){
      await page.evaluate(t=>{window.__timelines['code-highlight'].seek(t,false);},frame/30);
      const jpeg=await page.screenshot({type:'jpeg',quality:96});
      if(!ff.stdin.write(jpeg))await once(ff.stdin,'drain');
    }
    ff.stdin.end();const [exit]=await once(ff,'close');if(exit!==0)throw Error(stderr);
    await page.evaluate(()=>{window.__timelines['code-highlight'].seek(1.2,false);});
    await page.screenshot({path:path.join(assets,`code-${item.id}-hold.png`)});
    item.layout=layout;item.video=`assets/code-${item.id}.mp4`;item.hold=`assets/code-${item.id}-hold.png`;
    console.log(item.id+': '+layout.lines.length+' lines, sweep .2..1.1s, hold after1.2s');
  }
  await page.close();
}finally{await browser.close();}
fs.writeFileSync(path.join(dir,'code-highlight-cases.json'),JSON.stringify(calls,null,2));
const hash=crypto.createHash('sha256').update(source).digest('hex');
fs.writeFileSync(path.join(dir,'evidence/code-highlight-provenance.json'),JSON.stringify({source:'../video-sample-b06-b12/compositions/code-highlight.html',catalog:'https://hyperframes.heygen.com/catalog/blocks/code-highlight',sourceSHA256:hash,engine:'actual hf-code-anim.js highlight() + GSAP paused timeline from the Catalog source; not a Canvas reimplementation',changes:['792x820 portrait host','local Sarabun48 / lineHeight72','brand palette','replacement canonical code tokens','no grid/glow/dots','no editor scale entrance','surrounding lines opacity .65','cue sweep .2..1.1s','B12 query field scale1.15 only'],variants:calls.length},null,2));

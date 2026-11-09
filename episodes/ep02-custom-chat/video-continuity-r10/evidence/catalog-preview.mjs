import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {launch} from '../../../../.tools/explainroo/src/browser.js';
const dir=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(dir,'../../../..');
const gsap=pathToFileURL(path.join(root,'episodes/ep02-custom-chat/video-full-r3/assets/gsap.min.js')).href;
const items=[['multi-device-splay','video-final-notebook-v1/compositions/components/multi-device-splay.html'],['yt-feather-highlight','video-final-notebook-v1/compositions/components/yt-feather-highlight.html'],['flowchart-vertical','video-sample-b06-b12/compositions/flowchart-vertical.html']];
const browser=await launch();
try{for(const [id,src] of items){let html=fs.readFileSync(path.resolve(dir,'../../'+src),'utf8');html=html.replace(/<template>/,'').replace(/<\/template>/,'').replace(/src="[^"]*gsap[^\"]*"/g,`src="${gsap}"`);const file=path.join(dir,'catalog-'+id+'.html');fs.writeFileSync(file,html);const page=await browser.newPage({viewport:{width:1080,height:1920}});await page.route(/^https?:/,r=>r.abort());await page.goto(pathToFileURL(file).href);await page.evaluate(id=>{for(const tl of Object.values(window.__timelines||{}))tl.seek(2);if(window.gsap)gsap.globalTimeline.time(2);},id);await page.screenshot({path:path.join(dir,'catalog-'+id+'.png')});await page.close();console.log(id+' local source preview captured');}}
finally{await browser.close();}

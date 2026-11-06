const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const puppeteer = require(process.argv[2]);
const root = path.resolve(__dirname, '..');
const timing = JSON.parse(fs.readFileSync(path.join(root, 'timing.json')));
const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.ttf':'font/ttf','.wav':'audio/wav'};
const server = http.createServer((req,res) => {
  const target = path.resolve(root, '.' + decodeURIComponent(req.url === '/' ? '/index.html' : req.url.split('?')[0]));
  if (!target.startsWith(root + path.sep) || !fs.existsSync(target)) {res.writeHead(404);res.end();return;}
  res.setHeader('Content-Type', mime[path.extname(target)] || 'application/octet-stream');
  fs.createReadStream(target).pipe(res);
});
(async()=>{
  server.listen(4202,'127.0.0.1');
  const browser = await puppeteer.launch({executablePath:process.argv[3],userDataDir:path.resolve(root,'../../..','.tools','review-browser-v2'),headless:true,args:['--disable-background-timer-throttling']});
  try {
    const page = await browser.newPage();
    await page.setViewport({width:1080,height:1920});
    const errors=[];const external=[];
    page.on('pageerror', e=>errors.push(e.message));
    await page.setRequestInterception(true);
    page.on('request', req=>{if(req.url().startsWith('http://127.0.0.1:4202/'))req.continue();else{external.push(req.url());req.abort();}});
    await page.goto('http://127.0.0.1:4202');
    await page.evaluate(async()=>{
      await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));
      window.reviewFrame=t=>{window.__timelines['ep01-v2'].seek(t,false);for(const clip of document.querySelectorAll('.clip:not(audio)')){const a=+clip.dataset.start,b=a+(+clip.dataset.duration);clip.style.visibility=t>=a&&t<b?'visible':'hidden';}};
    });
    const frames=[];fs.mkdirSync(path.join(__dirname,'frames'),{recursive:true});
    const times=timing.scenes.map(s=>s.start+s.duration*.7);
    for(let i=0;i<times.length;i++){
      await page.evaluate(t=>window.reviewFrame(t),times[i]);
      const file=`${timing.scenes[i].id}.jpg`;
      await page.screenshot({path:path.join(__dirname,'frames',file),type:'jpeg',quality:90});
      frames.push({scene:timing.scenes[i].id,time:times[i],file});
    }
    const state=async t=>page.evaluate(t=>{window.reviewFrame(t);return [...document.querySelectorAll('#film .scene, #film .traveler, #film .screen-slot img')].map(e=>[e.id,e.className,e.getAttribute('style')]);},t);
    const forward=[];for(const t of times)forward.push(JSON.stringify(await state(t)));
    const backward=[];for(const t of [...times].reverse())backward.unshift(JSON.stringify(await state(t)));
    const assets=await page.evaluate(()=>({fonts:document.fonts.check('43px Thai'),broken:[...document.images].filter(i=>!i.naturalWidth).length}));
    const overflows=[];
    for(const scene of timing.scenes){
      for(const caption of scene.captions){
        await page.evaluate(t=>window.reviewFrame(t),scene.start+caption.start+.1);
        const bad=await page.evaluate(()=>[...document.querySelectorAll('.caption')].filter(e=>getComputedStyle(e).visibility==='visible'&&(e.scrollHeight>e.clientHeight+1||e.scrollWidth>e.clientWidth+1)).map(e=>e.id));
        overflows.push(...bad);
      }
    }
    const report={errors,externalRequests:external.length,assets,captionOverflows:[...new Set(overflows)],seekMatches:forward.every((v,i)=>v===backward[i]),frames,duration:timing.duration};
    fs.writeFileSync(path.join(__dirname,'browser-review.json'),JSON.stringify(report,null,2));
    console.log(JSON.stringify(report));
    if(errors.length||external.length||!assets.fonts||assets.broken||overflows.length||!report.seekMatches)process.exitCode=1;
  }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});

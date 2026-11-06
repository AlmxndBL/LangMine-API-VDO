const assert = require('node:assert/strict');
const puppeteer = require(process.argv[2]);
(async () => {
  const browser = await puppeteer.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
  try {
    let page = await browser.newPage();
    await page.setViewport({width:1080,height:1920});
    const studio = await page.goto('http://localhost:4101/#project/video');
    console.log('Studio HTTP', studio.status(), await page.title());
    await page.close();
    page = await browser.newPage();
    await page.setViewport({width:1080,height:1920});
    const errors = [], external = [], failed = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setRequestInterception(true);
    page.on('request', req => {
      if (req.url().startsWith('http://127.0.0.1:4102/') || req.url().startsWith('data:')) req.continue();
      else { external.push(req.url()); req.abort(); }
    });
    page.on('requestfailed', req => { if (req.failure()?.errorText !== 'net::ERR_ABORTED') failed.push(req.url()); });
    await page.goto('http://127.0.0.1:4102/index.html');
    const result = await page.evaluate(async () => {
      await document.fonts.ready;
      const timeline = window.__timelines['ep01-b04-b05'];
      const opacity = id => getComputedStyle(document.querySelector(id)).opacity;
      const state = t => {
        timeline.seek(t, false);
        return {a: opacity('#app-a'), q: opacity('#app-q'), screen: opacity('#screen'), flow: opacity('#flow'), outbound: getComputedStyle(document.querySelector('#to-service')).visibility, inbound: getComputedStyle(document.querySelector('#to-app')).visibility, head: getComputedStyle(document.querySelector('#to-screen')).strokeDashoffset};
      };
      const times = [0,7,12.8,16,17.5,18.1,19.5,22.2,30];
      const forward = times.map(state);
      const backward = [...times].reverse().map(state).reverse();
      return {forward,backward, font:[...document.fonts].map(f => [f.family,f.status]), broken:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src), duration:timeline.duration()};
    });
    assert.deepEqual(result.forward,result.backward);
    assert.equal(result.forward[0].flow,'0');
    assert.equal(result.forward[2].inbound,'hidden');
    assert.equal(result.forward[4].head,'0px');
    assert.equal(result.forward[5].a,'0');
    assert.equal(result.forward[6].a,'1');
    assert.deepEqual(result.font,[['Thai','loaded']]);
    assert.deepEqual([...errors,...external,...failed,...result.broken],[]);
    console.log('Seek states match in both orders at 9 times; return completed before APP-A; Thai loaded; external requests 0; broken assets 0; duration',result.duration);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });

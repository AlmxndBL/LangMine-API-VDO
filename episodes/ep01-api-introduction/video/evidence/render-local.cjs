const { once } = require('node:events');
const { spawn } = require('node:child_process');
const puppeteer = require(process.argv[2]);

async function render() {
  const browser = await puppeteer.launch({
    executablePath: process.argv[3], headless: true, args: ['--disable-background-timer-throttling']
  });
  const fps = 30;
  const output = process.argv[5];
  const ffmpeg = spawn(process.argv[4], [
    '-y', '-hide_banner', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps),
    '-vcodec', 'mjpeg', '-i', '-', '-i', 'assets/vo-draft.wav', '-map', '0:v:0',
    '-map', '1:a:0', '-c:v', 'libx264', '-preset', 'fast', '-crf', '18',
    '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', output
  ], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = once(ffmpeg, 'close');
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1920 });
    await page.setRequestInterception(true);
    page.on('request', req => req.url().startsWith('http://127.0.0.1:4102/') ? req.continue() : req.abort());
    await page.goto('http://127.0.0.1:4102/index.html');
    const seconds = await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map(img => img.decode()));
      const clips = [...document.querySelectorAll('.clip:not(audio)')];
      const timeline = window.__timelines['ep01-b04-b05'];
      window.renderFrame = t => {
        timeline.seek(t, false);
        for (const clip of clips) {
          const start = Number(clip.dataset.start);
          const end = start + Number(clip.dataset.duration);
          clip.style.visibility = t >= start && t < end ? 'visible' : 'hidden';
        }
      };
      return Number(document.querySelector('#sample').dataset.duration);
    });
    const frames = Math.round(seconds * fps);
    for (let i = 0; i < frames; i++) {
      await page.evaluate(t => window.renderFrame(t), i / fps);
      const frame = await page.screenshot({ type: 'jpeg', quality: 97 });
      if (!ffmpeg.stdin.write(frame)) await once(ffmpeg.stdin, 'drain');
      if (i % 150 === 0) console.log('Rendered frame', i, 'of', frames);
    }
    ffmpeg.stdin.end();
    const [code] = await done;
    if (code) throw new Error('FFmpeg exit ' + code);
    console.log('Wrote', frames, 'frames at', fps, 'fps to', output);
  } finally {
    ffmpeg.stdin.destroy();
    await browser.close();
  }
}

render().catch(error => { console.error(error); process.exitCode = 1; });

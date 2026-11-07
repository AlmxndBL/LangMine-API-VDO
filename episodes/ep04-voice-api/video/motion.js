// EP04 Voice API sample (B03–B05). Timing comes from window.FILM, written by build.mjs.
// Everything here is seek-safe: only tweens and sets (no className tweens, no callbacks).
(() => {
  const F = window.FILM;
  const tl = gsap.timeline({ paused: true });
  const q = s => document.querySelector(s);
  const qa = s => gsap.utils.toArray(s);

  const COLOR = { b03: '#38815A', b04: '#8d732c', b05: '#1E7578' };
  const DONE = { backgroundColor: '#e4ede6', borderColor: '#7fa58f', color: '#2f5e46' };

  // two fixed labels under the big waveform (no text swapping on the timeline)
  q('#wave-label').innerHTML = '<span id="wl-listen">กำลังฟังเสียงพูด…</span><span id="wl-play">กำลังเล่นเสียงตอบกลับ…</span>';
  gsap.set('#wl-play', { display: 'none' });

  gsap.set('.arrow path', { strokeDasharray: 90, strokeDashoffset: 90 });
  gsap.set('.panel .slot-in, .panel .code, .panel .slot-out, .panel .code .ln', { opacity: 0 });

  const waveBars = sel => qa(`${sel} i`);
  function wave(sel, t0, t1, color) {
    const bars = waveBars(sel);
    tl.set(bars, { backgroundColor: color }, t0);
    const step = 0.2;
    const cycles = Math.max(1, Math.floor((t1 - t0 - 0.6) / (step * 2)));
    tl.to(bars, {
      scaleY: i => 0.35 + 0.6 * Math.abs(Math.sin(i * 1.73 + 0.6)),
      duration: step, ease: 'sine.inOut', yoyo: true, repeat: cycles * 2 - 1,
      stagger: { each: 0.02, from: 'center' },
    }, t0);
    tl.to(bars, { scaleY: 0.14, duration: 0.25, ease: 'power1.out' }, t1 - 0.3);
  }

  const beats = F.beats;
  beats.forEach((b, bi) => {
    const color = COLOR[b.id];
    const next = beats[bi + 1];
    const end = next ? next.start - 0.35 : F.duration;
    const dev = b.segments.find(s => s.cue === 'device');
    const panelEnd = b.id === 'b05' && dev ? dev.start - 0.1 : end;
    const panel = `#panel-${b.id}`;

    // heading + progress spine
    tl.fromTo(`#h-${b.id}`, { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.45, ease: 'power2.out' }, b.start);
    if (next) tl.to(`#h-${b.id}`, { opacity: 0, x: 24, duration: 0.3, ease: 'power1.in' }, end);
    tl.set(`#pill-${b.id}`, { backgroundColor: color, borderColor: color, color: '#ffffff' }, b.start);
    tl.fromTo(`#pill-${b.id}`, { scale: 1 }, { scale: 1.08, duration: 0.5, yoyo: true, repeat: 1, ease: 'sine.inOut' }, b.start);
    if (next) tl.set(`#pill-${b.id}`, DONE, next.start);
    tl.set(`${panel} .arrow`, { stroke: color, color }, 0);
    // data keeps flowing down the arrows while the step is on screen
    const flow = (sel, t0, t1) => {
      const n = Math.max(1, Math.floor((t1 - t0) / 1.1));
      tl.set(sel, { opacity: 1 }, t0);
      tl.fromTo(sel, { attr: { cy: 6 } }, { attr: { cy: 54 }, duration: 1.1, ease: 'none', repeat: n - 1 }, t0);
      tl.set(sel, { opacity: 0 }, t0 + n * 1.1);
    };

    b.segments.forEach((s, si) => {
      const t = s.start;
      const segEnd = s.start + s.duration;

      if (s.cue === 'device' && b.id === 'b03') {
        tl.fromTo('#device', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, t);
        tl.to(['.wave.big', '#wave-label'], { opacity: 1, duration: 0.4 }, t + 0.3);
        wave('.wave.big', t + 0.3, segEnd, color);
        tl.to(['#device', '.wave.big', '#wave-label'], { opacity: 0, y: -20, duration: 0.35, ease: 'power1.in' }, segEnd - 0.1);
      }

      if (s.cue === 'device' && b.id === 'b05') {
        // reply audio comes back to the phone: same frame, screen state Q -> A
        tl.to(panel, { opacity: 0, y: -20, duration: 0.35, ease: 'power1.in' }, t - 0.1);
        tl.set('#wl-listen', { display: 'none' }, t);
        tl.set('#wl-play', { display: 'inline' }, t);
        tl.set('#img-a', { opacity: 0 }, t);
        tl.fromTo('#device', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', immediateRender: false }, t + 0.1);
        tl.to('#img-a', { opacity: 1, duration: 0.5, ease: 'power1.inOut' }, t + 0.7);
        tl.fromTo(['.wave.big', '#wave-label'], { opacity: 0, y: 0 }, { opacity: 1, duration: 0.4, immediateRender: false }, t + 0.9);
        wave('.wave.big', t + 0.9, F.duration - 0.2, color);
      }

      if (s.cue === 'request') {
        tl.fromTo(panel, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', immediateRender: false }, t);
        tl.fromTo(`${panel} .slot-in`, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4 }, t + 0.1);
        tl.to(`#arr1-${b.id} path`, { strokeDashoffset: 0, duration: 0.5, ease: 'power1.inOut' }, t + 0.55);
        flow(`#arr1-${b.id} .dot`, t + 1.1, panelEnd - 0.2);
        tl.fromTo(`${panel} .code`, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, t + 0.9);
        tl.fromTo(`${panel} .code .ln`, { opacity: 0, x: -14 }, { opacity: 1, x: 0, duration: 0.3, stagger: 0.18 }, t + 1.2);
        if (b.id === 'b03') {
          tl.fromTo('#robot', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.6)' }, t + 1.4);
          tl.fromTo('#server-note', { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.45 }, t + 1.7);
        }
      }

      if (s.cue === 'highlight') {
        tl.to(`${panel} .code .mark`, { scaleX: 1, duration: 0.6, ease: 'power2.out' }, t + 0.15);
        tl.to(`#arr2-${b.id} path`, { strokeDashoffset: 0, duration: 0.5, ease: 'power1.inOut' }, t + 1.0);
        tl.fromTo(`${panel} .slot-out`, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, t + 1.35);
        tl.set(`${panel} .slot-out .ln`, { opacity: 1 }, t + 1.35);
        flow(`#arr2-${b.id} .dot`, t + 1.5, panelEnd - 0.2);
        tl.fromTo(`${panel} .hl`, { scale: 1 }, { scale: 1.04, transformOrigin: 'left center', duration: 0.35, yoyo: true, repeat: 1, ease: 'sine.inOut' }, t + 0.8);
      }

      if (s.cue === 'response' && b.id === 'b04') {
        tl.to(`${panel} .hl2 .mark`, { scaleX: 1, duration: 0.6, ease: 'power2.out' }, t + 0.15);
        tl.fromTo(`${panel} .hl2`, { scale: 1 }, { scale: 1.04, transformOrigin: 'left center', duration: 0.35, yoyo: true, repeat: 1, ease: 'sine.inOut' }, t + 0.8);
      }

      if (s.cue === 'response' && b.id !== 'b04') {
        flow(`#arr2-${b.id} .dot`, t + 0.6, panelEnd - 0.2);
        tl.to(`#arr2-${b.id} path`, { strokeDashoffset: 0, duration: 0.5, ease: 'power1.inOut' }, t);
        tl.fromTo(`${panel} .slot-out`, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, t + 0.35);
        if (b.id === 'b05') wave(`${panel} .wave.mini`, t + 0.6, segEnd, color);
      }
    });

    // leave the step (b05 leaves through its device cue)
    if (next) {
      tl.to(panel, { opacity: 0, y: -20, duration: 0.35, ease: 'power1.in' }, end);
      if (b.id === 'b03') tl.to(['#robot', '#server-note'], { opacity: 0, duration: 0.3 }, end);
    }
  });

  window.__timelines = window.__timelines || {};
  window.__timelines['ep04-voice-sample'] = tl;
})();

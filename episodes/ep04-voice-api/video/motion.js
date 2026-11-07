// EP04 Voice API (B01–B06). Timing comes from window.FILM, written by build.mjs.
// Everything here is seek-safe: only tweens and sets (no className tweens, no callbacks).
(() => {
  const F = window.FILM;
  const tl = gsap.timeline({ paused: true });
  const q = s => document.querySelector(s);
  const qa = s => gsap.utils.toArray(s);

  const COLOR = { b01: '#38815A', b02: '#38815A', b03: '#38815A', b04: '#8d732c', b05: '#1E7578', b06: '#38815A' };
  const STEP = { b03: 1, b04: 1, b05: 1 };
  const DONE = { backgroundColor: '#e4ede6', borderColor: '#7fa58f', color: '#2f5e46' };
  const IDLE = { backgroundColor: '#fcfaf1', borderColor: '#a9b9af', color: '#6f857a' };

  // two fixed labels under the big waveform (no text swapping on the timeline)
  q('#wave-label').innerHTML = '<span id="wl-listen">กำลังฟังเสียงพูด…</span><span id="wl-play">กำลังเล่นเสียงตอบกลับ…</span>';
  gsap.set('#wl-play', { display: 'none' });

  gsap.set('.arrow path', { strokeDasharray: 90, strokeDashoffset: 90 });
  gsap.set('.tick circle', { strokeDasharray: 132, strokeDashoffset: 132 });
  gsap.set('.tick path', { strokeDasharray: 34, strokeDashoffset: 34 });
  gsap.set('.spine', { opacity: 0 });
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

  // data keeps flowing down an arrow while its step is on screen
  const flow = (sel, t0, t1) => {
    const n = Math.max(1, Math.floor((t1 - t0) / 1.1));
    tl.set(sel, { opacity: 1 }, t0);
    tl.fromTo(sel, { attr: { cy: 6 } }, { attr: { cy: 54 }, duration: 1.1, ease: 'none', repeat: n - 1, immediateRender: false }, t0);
    tl.set(sel, { opacity: 0 }, t0 + n * 1.1);
  };

  // gentle pulse so a held frame keeps breathing (avoids dead stretches)
  const idle = (sel, t0, t1) => {
    const n = Math.floor((t1 - t0) / 1.2);
    if (n < 1) return;
    tl.fromTo(sel, { scale: 1 }, { scale: 1.08, duration: 0.6, ease: 'sine.inOut', yoyo: true, repeat: n * 2 - 1, stagger: 0.2, immediateRender: false }, t0);
  };

  const beats = F.beats;
  beats.forEach((b, bi) => {
    const color = COLOR[b.id];
    const next = beats[bi + 1];
    const end = next ? next.start - 0.35 : F.duration;
    const dev = b.segments.find(s => s.cue === 'device');
    const panelEnd = b.id === 'b05' && dev ? dev.start - 0.1 : end;
    const panel = `#panel-${b.id}`;

    // heading + progress spine
    tl.fromTo(`#h-${b.id}`, { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.45, ease: 'power2.out', immediateRender: false }, b.start);
    if (next) tl.to(`#h-${b.id}`, { opacity: 0, x: 24, duration: 0.3, ease: 'power1.in' }, end);
    if (b.id === 'b03') tl.set('.pill', IDLE, b.start);
    if (STEP[b.id]) {
      tl.set(`#pill-${b.id}`, { backgroundColor: color, borderColor: color, color: '#ffffff' }, b.start);
      tl.fromTo(`#pill-${b.id}`, { scale: 1 }, { scale: 1.08, duration: 0.5, yoyo: true, repeat: 1, ease: 'sine.inOut', immediateRender: false }, b.start);
      if (next) tl.set(`#pill-${b.id}`, DONE, next.start);
      tl.set(`${panel} .arrow`, { stroke: color, color }, 0);
    }

    b.segments.forEach((s, si) => {
      const t = s.start;
      const segEnd = s.start + s.duration;


      // ---- B01: the problem ----
      if (b.id === 'b01' && s.cue === 'device') {
        tl.fromTo('#device', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', immediateRender: false }, t + 0.1);
        tl.fromTo('#device', { scale: 1 }, { scale: 1.03, duration: segEnd - t - 0.2, ease: 'sine.inOut', immediateRender: false }, t + 0.7);
      }
      if (b.id === 'b01' && s.cue === 'voice') {
        tl.fromTo(['.wave.big', '#wave-label'], { opacity: 0, y: 0 }, { opacity: 1, duration: 0.4, immediateRender: false }, t);
        wave('.wave.big', t, segEnd, color);
        tl.to(['.wave.big', '#wave-label'], { opacity: 0, duration: 0.3 }, segEnd - 0.2);
      }
      if (b.id === 'b01' && s.cue === 'question') {
        tl.fromTo('#robot-q', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.6)', immediateRender: false }, t);
        tl.fromTo('#ask-b01', { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.4, immediateRender: false }, t + 0.2);
        tl.to(['#device', '#robot-q', '#ask-b01'], { opacity: 0, y: -20, scale: 1, duration: 0.35, ease: 'power1.in' }, end);
      }

      // ---- B02: overview ----
      if (b.id === 'b02' && s.cue === 'no-train') {
        tl.set('#overview', { opacity: 1 }, t);
        tl.fromTo('#no-train', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.8)', immediateRender: false }, t + 0.2);
        tl.fromTo('#no-train .x', { rotation: -90, scale: 0.5 }, { rotation: 0, scale: 1, duration: 0.5, ease: 'back.out(2)', immediateRender: false }, t + 0.5);
        idle('#no-train .x', t + 1.2, segEnd);
      }
      if (b.id === 'b02' && s.cue === 'apis') {
        tl.fromTo('#ov-1', { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.45, ease: 'power2.out', immediateRender: false }, t + 0.2);
        tl.fromTo('#ov-3', { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.45, ease: 'power2.out', immediateRender: false }, t + 0.6);
        const t2 = t + Math.min(2.2, s.duration * 0.55);
        tl.fromTo('#ov-2', { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.45, ease: 'power2.out', immediateRender: false }, t2);
        idle(['#ov-1 .ov-num', '#ov-2 .ov-num', '#ov-3 .ov-num'], t2 + 0.6, segEnd);
      }
      if (b.id === 'b02' && s.cue === 'pipeline') {
        tl.to('.spine', { opacity: 1, duration: 0.4 }, t);
        ['b03', 'b04', 'b05'].forEach((id, k) => {
          const tk = t + 0.3 + k * 0.6;
          tl.set(`#pill-${id}`, { backgroundColor: COLOR[id], borderColor: COLOR[id], color: '#ffffff' }, tk);
          tl.fromTo(`#ov-${k + 1}`, { scale: 1 }, { scale: 1.04, duration: 0.25, yoyo: true, repeat: 1, ease: 'sine.inOut', immediateRender: false }, tk);
        });
        tl.to('#ov-arr1 path', { strokeDashoffset: 0, duration: 0.4 }, t + 0.5);
        tl.to('#ov-arr2 path', { strokeDashoffset: 0, duration: 0.4 }, t + 1.1);
        flow('#ov-arr1 .dot', t + 0.9, end - 0.2);
        flow('#ov-arr2 .dot', t + 1.5, end - 0.2);
        tl.to('#overview', { opacity: 0, y: -20, duration: 0.35, ease: 'power1.in' }, end);
      }

      // ---- B06: checklist ----
      if (b.id === 'b06' && s.cue.startsWith('check')) {
        const k = s.cue.slice(5);
        if (k === '1') {
          tl.to('.pill', { ...DONE, duration: 0.3 }, b.start);
          tl.fromTo('#checklist', { opacity: 0 }, { opacity: 1, duration: 0.3, immediateRender: false }, t);
        }
        tl.fromTo(`#check-${k}`, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.45, ease: 'power2.out', immediateRender: false }, t + 0.1);
        tl.to(`#check-${k} .tick circle`, { strokeDashoffset: 0, duration: 0.5, ease: 'power1.inOut' }, t + 0.5);
        tl.to(`#check-${k} .tick path`, { strokeDashoffset: 0, duration: 0.35, ease: 'power2.out' }, t + 0.95);
        idle(`#check-${k} .tick`, t + 1.5, segEnd);
      }
      if (b.id === 'b06' && s.cue === 'outro') {
        tl.fromTo('#robot-b06', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.6)', immediateRender: false }, t);
        tl.fromTo('.check', { scale: 1 }, { scale: 1.02, duration: 0.3, yoyo: true, repeat: 1, stagger: 0.15, ease: 'sine.inOut', immediateRender: false }, t + 0.4);
      }

      if (s.cue === 'device' && b.id === 'b03') {
        tl.fromTo('#device', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', immediateRender: false }, t);
        tl.fromTo(['.wave.big', '#wave-label'], { opacity: 0, y: 0 }, { opacity: 1, duration: 0.4, immediateRender: false }, t + 0.3);
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
        wave('.wave.big', t + 0.9, end, color);
      }

      if (STEP[b.id] && s.cue === 'request') {
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

      if (STEP[b.id] && s.cue === 'highlight') {
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

      if (s.cue === 'response' && b.id === 'b05') {
        tl.fromTo('#robot-b05', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.6)' }, t + 0.2);
        tl.fromTo('#tip-b05', { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.35 }, t + 0.25);
        tl.to(['#robot-b05', '#tip-b05'], { opacity: 0, duration: 0.3 }, panelEnd - 0.1);
      }

      if (s.cue === 'response' && b.id !== 'b04') {
        flow(`#arr2-${b.id} .dot`, t + 0.6, panelEnd - 0.2);
        tl.to(`#arr2-${b.id} path`, { strokeDashoffset: 0, duration: 0.5, ease: 'power1.inOut' }, t);
        tl.fromTo(`${panel} .slot-out`, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, t + 0.35);
        if (b.id === 'b05') wave(`${panel} .wave.mini`, t + 0.6, segEnd, color);
      }
    });

    // leave the step (b05 leaves through its device cue)
    if (next && STEP[b.id]) {
      tl.to(panel, { opacity: 0, y: -20, duration: 0.35, ease: 'power1.in' }, end);
      if (b.id === 'b03') tl.to(['#robot', '#server-note'], { opacity: 0, duration: 0.3 }, end);
      if (b.id === 'b05') tl.to(['#device', '.wave.big', '#wave-label'], { opacity: 0, y: -20, duration: 0.35, ease: 'power1.in' }, end);
    }
  });

  window.__timelines = window.__timelines || {};
  window.__timelines['ep04-voice'] = tl;
})();

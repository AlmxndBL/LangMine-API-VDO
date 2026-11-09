// EP02 (r10 content + voice-r10 audio) in EP04 video-v3 style. Timing comes from window.FILM (build.mjs). Seek-safe: tweens and sets only.
// Generic cues in the markup:
//   data-in="k" data-at="s" data-anim="up|left|pop|fade"  appear at segment k (+s seconds)
//   svg path[pathLength=1] inside an appearing element      draws itself
//   .dot[data-y0][data-y1] inside an appearing arrow        data keeps flowing until the scene ends
//   [data-out=k][data-out-at=s]                             fades out at segment k (+s seconds)
//   .mark[data-mark=k][data-mark-at=s]                      highlight sweep at segment k (+s seconds)
(() => {
  const F = window.FILM;
  const tl = gsap.timeline({ paused: true });
  const qa = (s, root = document) => [...root.querySelectorAll(s)];
  const GREEN = '#38815A', OCHRE = '#8d732c', TEAL = '#1E7578';
  const IDLE = { backgroundColor: '#fcfaf1', borderColor: '#a9b9af', color: '#6f857a' };
  const DONE = { backgroundColor: '#e4ede6', borderColor: '#7fa58f', color: '#2f5e46' };
  const ON = c => ({ backgroundColor: c, borderColor: c, color: '#ffffff' });

  gsap.set('[data-in]', { opacity: 0 });
  gsap.set('svg path[pathLength]', { strokeDasharray: 1, strokeDashoffset: 1 });

  const FROM = {
    up: { opacity: 0, y: 24 }, left: { opacity: 0, x: -30 }, pop: { opacity: 0, scale: 0.85 }, fade: { opacity: 0 },
  };
  const TO = { up: { y: 0 }, left: { x: 0 }, pop: { scale: 1 }, fade: {} };

  const flow = (dot, t0, t1) => {
    const n = Math.floor((t1 - t0) / 1.2);
    if (n < 1) return;
    tl.set(dot, { opacity: 1 }, t0);
    tl.fromTo(dot, { attr: { cy: +dot.dataset.y0 } }, { attr: { cy: +dot.dataset.y1 }, duration: 1.2, ease: 'none', repeat: n - 1, immediateRender: false }, t0);
    tl.set(dot, { opacity: 0 }, t0 + n * 1.2);
  };
  const pulse = (sel, t0, t1, amt = 1.05) => {
    const n = Math.floor((t1 - t0) / 1.4);
    if (n < 1) return;
    tl.fromTo(sel, { scale: 1 }, { scale: amt, duration: 0.7, ease: 'sine.inOut', yoyo: true, repeat: n * 2 - 1, immediateRender: false }, t0);
  };

  const PHASE_MAP = {
    b04: 1, b05: 1, b06: 1,
    b07: 2, b08: 2, b09: 2, b10: 2,
    b11: 3, b12: 3, b13: 3, b14: 3,
  };

  F.beats.forEach((b, bi) => {
    const sc = document.getElementById(`sc-${b.id}`);
    const next = F.beats[bi + 1];
    const end = next ? next.start - 0.35 : F.duration;
    const seg = k => b.segments[Math.min(k, b.segments.length - 1)];

    tl.fromTo(sc, { opacity: 0 }, { opacity: 1, duration: 0.4, immediateRender: false }, b.start - 0.05);
    if (next) tl.to(sc, { opacity: 0, duration: 0.3 }, end);

    qa('[data-in]', sc).forEach(el => {
      const k = +el.dataset.in;
      const t = seg(k).start + (+el.dataset.at || 0);
      const a = el.dataset.anim || 'up';
      tl.fromTo(el, FROM[a], { opacity: 1, ...TO[a], duration: 0.45, ease: a === 'pop' ? 'back.out(1.8)' : 'power2.out', immediateRender: false }, t);
      const paths = qa('path[pathLength]', el);
      if (paths.length) tl.to(paths, { strokeDashoffset: 0, duration: 0.5, ease: 'power1.inOut', stagger: 0.3 }, t + 0.1);
      qa('.dot', el).forEach(d => flow(d, t + 0.7, end - 0.2));
    });
    qa('[data-out]', sc).forEach(el => {
      const t = seg(+el.dataset.out).start + (+el.dataset.outAt || 0);
      tl.to(el, { opacity: 0, y: -16, duration: 0.35, ease: 'power1.in' }, t);
    });
    qa('.mark[data-mark]', sc).forEach(el => {
      const t = seg(+el.dataset.mark).start + (+el.dataset.markAt || 0);
      tl.to(el, { scaleX: 1, duration: 0.6, ease: 'power2.out' }, t);
    });

    // progress spine: 1 เตรียม / 2 เชื่อม / 3 ใช้ผล
    const phase = PHASE_MAP[b.id];
    if (b.id === 'b04') tl.to('.spine', { opacity: 1, duration: 0.4 }, b.start);
    if (phase) {
      [1, 2, 3].forEach(p => tl.set(`#sp${p}`, p < phase ? DONE : p === phase ? ON([GREEN, OCHRE, TEAL][p - 1]) : IDLE, b.start));
    }
    if (b.id === 'b15') tl.set('.pill', DONE, b.start);
    if (b.id === 'b16') tl.to(['.spine', '.note'], { opacity: 0, duration: 0.3 }, b.start);

    // ---- per-scene moments ----
    if (b.id === 'b01') {
      const dev = sc.querySelector('.device');
      tl.fromTo(dev, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', immediateRender: false }, b.start + 0.1);
      pulse(dev, b.start + 1.0, seg(1).start, 1.015);
      tl.to('#wl-b01-a', { opacity: 0, duration: 0.25 }, seg(2).start + 0.1);
      pulse(qa('.qchip', sc), seg(1).start + 1.4, end, 1.04);
    }
    if (b.id === 'b02') {
      tl.to(qa('.img-b', sc), { opacity: 1, duration: 0.5 }, b.start + 3.0);
      pulse(qa('.card-h .ico', sc), seg(0).start + 1.2, end, 1.08);
    }
    if (b.id === 'b03') {
      pulse(qa('.node .ico.big, .node.lm img', sc), seg(0).start + 1.5, end, 1.06);
    }
    if (b.id === 'b04') {
      pulse(qa('.card-h .ico.big', sc), seg(0).start + 1.2, end, 1.08);
    }
    if (b.id === 'b05') {
      pulse(qa('.shot-tag', sc), seg(0).start + 1.0, end, 1.05);
      pulse(qa('.card-h .ico.big', sc), seg(2).start + 1.4, end, 1.08);
    }
    if (b.id === 'b06') {
      pulse(qa('.method', sc), seg(0).start + 1.2, end, 1.05);
      pulse(qa('.url-id', sc), seg(1).start + 1.4, end, 1.05);
    }
    if (['b07', 'b08', 'b09', 'b10', 'b12'].includes(b.id)) {
      const hasSwitch = b.id === 'b10' ? seg(2).start : b.id === 'b12' ? seg(3).start : end;
      pulse(sc.querySelector('.mm-call'), b.start + 0.4, hasSwitch, 1.06);
      const outEl = sc.querySelector('.slot-out');
      if (outEl) pulse(outEl, seg(1).start + 1.2, hasSwitch, 1.02);
      if (b.id === 'b10') {
        pulse(qa('#dev-b10', sc), seg(2).start + 1.0, end, 1.015);
        pulse(qa('.srv-tag', sc), seg(2).start + 1.4, end, 1.03);
      }
      if (b.id === 'b12') {
        tl.to(qa('#dev-b12 .img-b', sc), { opacity: 1, duration: 0.5 }, seg(3).start + 1.2);
        pulse(qa('#dev-b12', sc), seg(3).start + 1.6, end, 1.015);
        pulse(qa('.srv-tag', sc), seg(3).start + 1.4, end, 1.03);
      }
    }
    if (b.id === 'b11') {
      tl.to(qa('.img-b', sc), { opacity: 1, duration: 0.5 }, seg(1).start + 0.2);
      tl.to(qa('.img-c', sc), { opacity: 1, duration: 0.5 }, seg(2).start + 0.4);
      pulse(qa('.card-h .ico', sc), seg(0).start + 1.2, end, 1.08);
      pulse(qa('.srv-tag', sc), seg(0).start + 1.6, end, 1.03);
    }
    if (b.id === 'b13') {
      pulse(qa('.card-h .ico.big', sc), seg(0).start + 1.2, end, 1.08);
      pulse(qa('.srv-tag', sc), seg(0).start + 1.6, end, 1.03);
    }
    if (b.id === 'b14') {
      pulse(sc.querySelector('.convo code'), seg(2).start + 1.0, end, 1.05);
      pulse(qa('.srv-tag', sc), seg(0).start + 1.6, end, 1.03);
    }
    if (b.id === 'b15') {
      pulse(qa('.recap-t b', sc), seg(0).start + 1.5, end, 1.1);
      pulse(qa('.srv-tag', sc), seg(1).start + 1.0, end, 1.03);
    }
    if (b.id === 'b16') {
      pulse(sc.querySelector('.sp-logo'), seg(0).start + 1.2, end, 1.03);
    }
  });

  window.__timelines = window.__timelines || {};
  window.__timelines['ep02-ep04-style'] = tl;
})();

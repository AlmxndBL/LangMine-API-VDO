// EP12 Inbox API. Timing comes from window.FILM (build.mjs). Seek-safe: tweens and sets only.
// Generic cues in the markup:
//   data-in="k" data-at="s" data-anim="up|left|pop|fade"  appear at segment k (+s seconds)
//   svg path[pathLength=1] inside an appearing element      draws itself
//   .dot[data-y0][data-y1] inside an appearing arrow        data keeps flowing until the scene ends
//   .switch[data-toggle=k][data-toggle-at=s]                turns on
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

  function wave(el, t0, t1, color) {
    const bars = qa('i', el);
    tl.set(bars, { backgroundColor: color }, t0);
    tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.3, immediateRender: false }, t0);
    const step = 0.2;
    const cycles = Math.max(1, Math.floor((t1 - t0 - 0.5) / (step * 2)));
    tl.to(bars, {
      scaleY: i => 0.35 + 0.6 * Math.abs(Math.sin(i * 1.73 + 0.6)),
      duration: step, ease: 'sine.inOut', yoyo: true, repeat: cycles * 2 - 1, stagger: { each: 0.02, from: 'center' },
    }, t0);
    tl.to(bars, { scaleY: 0.14, duration: 0.25 }, t1 - 0.3);
  }
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
    qa('.switch[data-toggle]', sc).forEach(s => {
      const t = seg(+s.dataset.toggle).start + (+s.dataset.toggleAt || 0);
      tl.to(s, { backgroundColor: GREEN, duration: 0.3 }, t);
      tl.to(s.querySelector('i'), { x: 38, duration: 0.3, ease: 'power2.out' }, t);
    });

    // progress spine: 1 prepare / 2 connect / 3 use
    const phase = { b3: 1, b4: 2, b5: 2, b6: 2, b7: 2, b8: 3, b9: 3 }[b.id];
    if (b.id === 'b3') tl.to('.spine', { opacity: 1, duration: 0.4 }, b.start);
    if (phase) {
      [1, 2, 3].forEach(p => tl.set(`#sp${p}`, p < phase ? DONE : p === phase ? ON([GREEN, OCHRE, TEAL][p - 1]) : IDLE, b.start));
    }
    if (b.id === 'b10') tl.set('.pill', DONE, b.start);
    if (b.id === 'b11') tl.to(['.spine', '#film > .note'], { opacity: 0, duration: 0.3 }, b.start);

    // ---- per-scene moments ----
    if (b.id === 'b1') {
      const dev = sc.querySelector('.device');
      tl.fromTo(dev, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', immediateRender: false }, b.start + 0.1);
      tl.fromTo(dev, { scale: 1 }, { scale: 1.04, duration: seg(1).start - b.start - 0.4, ease: 'sine.inOut', immediateRender: false }, b.start + 0.7);
      tl.to(qa('.img-a', sc), { opacity: 1, duration: 0.6 }, seg(1).start + 0.3);
      tl.to(dev, { scale: 1, duration: 0.6, ease: 'sine.inOut' }, seg(1).start + 0.3);
      pulse(qa('.wave-label span', sc), seg(0).start + 2.0, seg(2).start, 1.04);
      pulse(qa('.qchip', sc), seg(2).start + 2.2, end, 1.04);
    }
    if (b.id === 'b2') pulse(qa('.node .ico.big, .node.lm img', sc), seg(2).start + 1.2, end, 1.06);
    if (b.id === 'b3') pulse(qa('.card-h .ico.big', sc), seg(0).start + 1.0, end, 1.08);
    if (['b4', 'b5', 'b6', 'b7'].includes(b.id)) {
      pulse(sc.querySelector('.mm-call'), b.start + 0.4, end, 1.06);
      pulse(sc.querySelector('.slot-out'), seg(1).start + 1.6, b.segments.length > 2 ? seg(2).start : end, 1.02);
    }
    if (b.id === 'b8') {
      const dev = sc.querySelector('.device');
      tl.fromTo(dev, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out', immediateRender: false }, b.start + 0.1);
      tl.to(qa('.img-a', sc), { opacity: 1, duration: 0.6 }, seg(2).start + 0.2);
      tl.to(qa('.img-a', sc), { opacity: 0, duration: 0.6 }, seg(3).start + 0.1);
      pulse(qa('.callout code', sc), seg(0).start + 3.0, end, 1.03);
    }
    if (b.id === 'b9') pulse(qa('.card-h .ico.big', sc), seg(0).start + 2.2, end, 1.08);
    if (b.id === 'b10') pulse(qa('.recap-t b', sc), seg(0).start + 1.5, end, 1.1);
    if (b.id === 'b11') pulse(sc.querySelector('.sp-logo'), seg(0).start + 1.2, end, 1.03);
  });

  window.__timelines = window.__timelines || {};
  window.__timelines['ep12-inbox'] = tl;
})();

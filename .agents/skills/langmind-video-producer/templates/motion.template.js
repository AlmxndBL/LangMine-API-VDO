// Motion Controller (Editorial Paper & Sage Ink Engine)
// Timing is driven by window.FILM (compiled by build.mjs).
// Seek-Safe Contract: uses exclusively GSAP fromTo, set, and absolute-time tweens.

(function () {
  const film = window.FILM;
  if (!film) return;

  const tl = gsap.timeline({ paused: true });
  window.__timelines = window.__timelines || {};
  window.__timelines['langmind-explainer'] = tl;

  const qa = (s, root = document) => [...root.querySelectorAll(s)];
  const GREEN = '#38815A';
  const GOLD = '#8d732c';
  const TEAL = '#1E7578';

  function pulse(el, t0, t1, scale = 1.05) {
    if (!el || (Array.isArray(el) && !el.length)) return;
    const count = Math.max(1, Math.floor((t1 - t0) / 0.8));
    tl.to(el, {
      scale: scale,
      transformOrigin: 'center center',
      duration: 0.4,
      yoyo: true,
      repeat: count * 2 - 1,
      ease: 'sine.inOut'
    }, t0);
    tl.set(el, { scale: 1 }, t1);
  }

  // Iterate over beats and construct animations
  film.beats.forEach(b => {
    const sc = document.getElementById(b.id);
    if (!sc) return;

    const start = b.start;
    const end = b.start + b.duration;
    const seg = i => b.segments[i] || { start, duration: b.duration };

    // 1. Scene In / Out Visibility
    tl.set(sc, { display: 'block', opacity: 1 }, start);
    tl.set(sc, { display: 'none', opacity: 0 }, end);

    // 2. Play Audio if available
    const audio = document.getElementById('a-' + b.id);
    if (audio) {
      tl.call(() => {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }, null, start);
      tl.call(() => {
        audio.pause();
      }, null, end);
    }

    // 3. Subtitles (Captions) Transitions
    const caps = qa('.cap', sc);
    caps.forEach(c => {
      const cStart = +c.dataset.start;
      const cDur = +c.dataset.duration;
      tl.set(c, { opacity: 1, y: 0 }, cStart);
      tl.set(c, { opacity: 0, y: 6 }, cStart + cDur);
    });

    // 4. Generic Animated Elements (data-in, data-at, data-anim)
    qa('[data-in]', sc).forEach(el => {
      const sIdx = +el.dataset.in;
      const offset = +el.dataset.at || 0;
      const anim = el.dataset.anim || 'up';
      const tIn = seg(sIdx).start + offset;

      let fromProps = { opacity: 0 };
      if (anim === 'up') fromProps.y = 20;
      if (anim === 'left') fromProps.x = -24;
      if (anim === 'pop') { fromProps.scale = 0.85; fromProps.y = 10; }

      tl.fromTo(el, fromProps, {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.4,
        ease: anim === 'pop' ? 'back.out(1.7)' : 'power2.out',
        immediateRender: false
      }, tIn);

      // Self-drawing SVG paths inside appearing element
      qa('path[pathLength="1"]', el).forEach(p => {
        tl.fromTo(p, { strokeDasharray: 1, strokeDashoffset: 1 }, {
          strokeDashoffset: 0,
          duration: 0.4,
          ease: 'power1.inOut',
          immediateRender: false
        }, tIn + 0.1);
      });

      // Flowing data dots inside arrows
      qa('.dot[data-y0][data-y1]', el).forEach(dot => {
        const y0 = +dot.dataset.y0;
        const y1 = +dot.dataset.y1;
        const flowTime = 0.8;
        const repeats = Math.max(1, Math.floor((end - (tIn + 0.2)) / flowTime));
        tl.fromTo(dot, { cy: y0, opacity: 0 }, {
          cy: y1,
          opacity: 1,
          duration: flowTime,
          repeat: repeats,
          ease: 'linear',
          immediateRender: false
        }, tIn + 0.2);
      });
    });

    // 5. Scene-specific Rhythmic Pulses & State Transitions
    if (b.id === 'b1') {
      pulse(qa('.qchip', sc), seg(2).start + 1.8, end, 1.04);
    }

    if (b.id === 'b2') {
      pulse(qa('.node .ico.big, .node.lm img', sc), seg(0).start + 2.0, seg(1).start, 1.06);
      pulse(qa('.calls3 .step', sc), seg(2).start + 1.5, end, 1.06);
    }

    if (b.id === 'b3') {
      pulse(qa('.card-h .ico.big', sc), seg(0).start + 0.8, end, 1.08);
    }

    if (b.id === 'b4' || b.id === 'b5') {
      pulse(sc.querySelector('.slot-out'), seg(1).start + 1.2, end, 1.02);
    }

    if (b.id === 'b5') {
      const hl = sc.querySelector('.hl');
      if (hl) {
        tl.fromTo(hl, { scale: 1 }, { scale: 1.04, transformOrigin: 'left center', duration: 0.35, yoyo: true, repeat: 3, ease: 'sine.inOut' }, seg(0).start + 1.5);
      }
    }

    if (b.id === 'b6') {
      const dev = sc.querySelector('.device');
      if (dev) {
        tl.fromTo(dev, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', immediateRender: false }, seg(2).start);
      }
      pulse(sc.querySelector('.slot-out'), seg(1).start + 1.0, seg(2).start, 1.02);
    }

    if (b.id === 'b7') {
      pulse(qa('.use .ico.big', sc), seg(0).start + 1.0, end, 1.08);
    }

    if (b.id === 'b8') {
      pulse(qa('.rc-n', sc), seg(0).start + 1.2, end, 1.1);
    }

    if (b.id === 'b9') {
      pulse(sc.querySelector('.sp-logo'), seg(0).start + 1.0, end, 1.03);
    }
  });

  // HyperFrames Time Scrubbing / Playback hook
  window.renderFrame = function (currentTime) {
    tl.time(currentTime);
  };
})();

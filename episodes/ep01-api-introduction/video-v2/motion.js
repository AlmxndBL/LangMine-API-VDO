const tl = gsap.timeline({ paused: true });
const scenes = window.FILM_TIMING;
for (const s of scenes) {
  const selector = `#${s.id}`;
  const at = fraction => s.start + s.duration * fraction;
  const pieces = [...document.querySelectorAll(selector + ' .piece')];
  pieces.forEach((piece, i) => {
    const fraction = Math.min(.72, .06 + i * (.58 / Math.max(1, pieces.length - 1)));
    tl.fromTo(piece, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: .4, ease: 'power2.out' }, at(fraction));
  });
  for (const [i, path] of [...document.querySelectorAll(selector + ' svg path')].entries()) {
    const length = path.getTotalLength();
    tl.fromTo(path, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration: Math.min(1.4, s.duration * .13), ease: 'power1.inOut' }, at(.17 + i * .13));
  }
  if (s.kind === 'hook') {
    tl.to(`${selector} .device`, { x: -155, scale: .72, duration: 1, ease: 'power2.inOut' }, at(.4));
    tl.fromTo(`${selector} .behind`, { x: 110 }, { x: 0, duration: .7, ease: 'power2.out' }, at(.5));
  }
  if (s.kind === 'knowledge') {
    tl.fromTo(`${selector} .knowledge-mask`, { scaleX: 1 }, { scaleX: 0, duration: s.duration * .35, ease: 'none' }, at(.08));
  }
  if (s.kind === 'followup') {
    tl.fromTo(`${selector} .screen-slot img`, { scale: 1.02, y: 60 }, { scale: 1.12, y: -95, duration: s.duration * .5, ease: 'power1.inOut' }, at(.22));
  }
  if (s.kind === 'outbound') {
    tl.set(`${selector} .api-tag`, { x: 175, y: 20 }, s.start);
    tl.fromTo(`${selector} .traveler`, { opacity: 0, y: -36 }, { opacity: 1, y: 0, duration: .45 }, at(.08));
    tl.to(`${selector} .flow-app`, { backgroundColor: '#c9dcb0', duration: .35 }, at(.22));
    tl.to(`${selector} .traveler`, { y: 335, duration: .9, ease: 'power1.inOut' }, at(.43));
    tl.to(`${selector} .flow-service`, { backgroundColor: '#c6e0d7', duration: .4 }, at(.68));
  }
  if (s.kind === 'inbound') {
    tl.fromTo(`${selector} .traveler`, { opacity: 0, y: 345 }, { opacity: 1, duration: .25 }, at(.08));
    tl.to(`${selector} .flow-app`, { backgroundColor: '#c6e0d7', duration: .4 }, at(.27));
    tl.to(`${selector} .traveler`, { y: 0, duration: .95, ease: 'power1.inOut' }, at(.43));
    tl.to(`${selector} .return-diagram`, { opacity: 0, scale: .96, duration: .35 }, at(.66));
    tl.to(`${selector} .answer-display`, { opacity: 1, duration: .4 }, at(.69));
    tl.to(`${selector} .answer-display .screen-slot img`, { scale: 1.12, y: -60, duration: .8, ease: 'power2.inOut' }, at(.81));
  }
  if (s.kind === 'responsibility') {
    tl.fromTo(`${selector} .state-wait`, { opacity: 0 }, { opacity: 1, duration: .35 }, at(.12));
    tl.fromTo(`${selector} .state-error`, { opacity: 0 }, { opacity: 1, duration: .35 }, at(.33));
    tl.to(`${selector} .state-wait`, { backgroundColor: '#fffdf7', duration: .35 }, at(.33));
    tl.fromTo(`${selector} .state-review`, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .45 }, at(.71));
  }
  if (s.kind === 'brand') {
    tl.fromTo(`${selector} .robot`, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: .6, ease: 'power2.out' }, at(.12));
  }
  if (s.kind === 'recap') {
    tl.set(['.series-label', '.simulation-label'], { color: '#fffdf7', borderColor: '#fffdf7' }, s.start);
  }
}
const duration = Number(document.querySelector('#film').dataset.duration);
tl.fromTo('.progress', { scaleX: 0 }, { scaleX: 1, duration, ease: 'none' }, 0);
tl.set({}, {}, duration);
window.__timelines = window.__timelines || {};
window.__timelines['ep01-v2'] = tl;

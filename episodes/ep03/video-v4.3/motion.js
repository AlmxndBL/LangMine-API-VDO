(() => {
  const root = document.getElementById("root");
  const tl = gsap.timeline({ paused: true });
  tl.to({}, { duration: 94.323 }, 0);
  window.__timelines = window.__timelines || {};
  window.__timelines[root.dataset.compositionId] = tl;
})();

// Deterministic, seek-safe plate timeline; all text and mock UI are rasterized in reviewed source plates.
(() => {
 const root=document.getElementById('film');
 const tl=gsap.timeline({paused:true});
 const items=[...root.querySelectorAll('.plate')];
 for(let i=0;i<items.length;i++){
  const clip=items[i], image=clip.querySelector('.plate-image');
  const start=Number(clip.dataset.start), duration=Number(clip.dataset.duration);
  tl.set(image,{opacity:0,scale:1.015},start);
  tl.to(image,{opacity:1,scale:1,duration:0.28,ease:'power2.out'},start);
  if(i>0){const prev=items[i-1].querySelector('.plate-image');tl.to(prev,{opacity:0,duration:0.22,ease:'power1.in'},start+0.06)}
 }
 window.__timelines=window.__timelines||{};
 window.__timelines[root.dataset.compositionId]=tl;
})();

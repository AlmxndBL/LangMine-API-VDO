// EP04 Voice API - Motion Script for Sample (B03-B05)
const tl = gsap.timeline({ paused: true });

// Setup initial states
gsap.set(["#scene-pipeline", "#scene-return"], { opacity: 0 });
gsap.set(".caption", { display: "none", opacity: 0 });
gsap.set(["#conn-1", "#conn-2"], { strokeDasharray: 150, strokeDashoffset: 150 });

// Scene 1: Intro (0s - 8s)
tl.fromTo("#scene-intro .device", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, 0.2);

// Transition from Intro to Pipeline (8s)
tl.to("#scene-intro", { opacity: 0, duration: 0.5 }, 7.5);
tl.to("#scene-pipeline", { opacity: 1, duration: 0.5 }, 8.0);

// Node 1: STT Active & Caption 1 (8s - 16s)
tl.set("#cap-1", { display: "block", opacity: 0 }, 8.0);
tl.to("#cap-1", { opacity: 1, duration: 0.4 }, 8.2);
tl.fromTo("#node-stt", { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5 }, 8.2);
tl.to("#robot-pointer", { opacity: 1, duration: 0.5 }, 9.0);

// Step 1 to Step 2 Connector (15s)
tl.to("#conn-1", { strokeDashoffset: 0, duration: 0.8, ease: "power1.inOut" }, 15.0);

// Node 2: Agent Active & Caption 2 (16s - 24s)
tl.to("#cap-1", { opacity: 0, duration: 0.3 }, 15.8);
tl.set("#cap-1", { display: "none" }, 16.1);
tl.set("#cap-2", { display: "block", opacity: 0 }, 16.2);
tl.to("#cap-2", { opacity: 1, duration: 0.4 }, 16.4);

tl.set("#heading-stt", { opacity: 0 }, 16.0);
tl.set("#heading-agent", { opacity: 1 }, 16.0);
tl.to("#node-stt .pipe-box", { className: "pipe-box", duration: 0.3 }, 16.0);
tl.to("#node-agent .pipe-box", { className: "pipe-box active-agent", duration: 0.4 }, 16.2);
tl.to("#robot-pointer", { y: 330, duration: 0.8, ease: "power2.inOut" }, 16.5);

// Step 2 to Step 3 Connector (23s)
tl.to("#conn-2", { strokeDashoffset: 0, duration: 0.8, ease: "power1.inOut" }, 23.0);

// Node 3: TTS Active & Caption 3 (24s - 32s)
tl.to("#cap-2", { opacity: 0, duration: 0.3 }, 23.8);
tl.set("#cap-2", { display: "none" }, 24.1);
tl.set("#cap-3", { display: "block", opacity: 0 }, 24.2);
tl.to("#cap-3", { opacity: 1, duration: 0.4 }, 24.4);

tl.set("#heading-agent", { opacity: 0 }, 24.0);
tl.set("#heading-tts", { opacity: 1 }, 24.0);
tl.to("#node-agent .pipe-box", { className: "pipe-box", duration: 0.3 }, 24.0);
tl.to("#node-tts .pipe-box", { className: "pipe-box active-tts", duration: 0.4 }, 24.2);
tl.to("#robot-pointer", { y: 660, duration: 0.8, ease: "power2.inOut" }, 24.5);

// Transition to Return Scene (32s - 42s)
tl.to("#scene-pipeline", { opacity: 0, duration: 0.5 }, 31.5);
tl.to("#robot-pointer", { opacity: 0, duration: 0.4 }, 31.5);
tl.to("#scene-return", { opacity: 1, duration: 0.5 }, 32.0);
tl.fromTo("#device-return", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, 32.2);

// End fade
tl.to(["#scene-return", "#cap-3"], { opacity: 0, duration: 0.8 }, 41.0);

window.__timelines = window.__timelines || {};
window.__timelines["ep04-voice-sample"] = tl;



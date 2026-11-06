// Catalog origins: hw-pipeline seeded outlines and quadratic tangent barbs.
// The Browser Device Stage window chrome and its image slot are adapted to 4:5.
const tl = gsap.timeline({ paused: true });
const shapes = document.querySelectorAll(".box");
shapes.forEach((shape, i) => shape.setAttribute("d", wobbleRect(756, 171, 28, i + 1, 4)));

function ink(id, sx, sy, qx, qy, tx, ty) {
  const path = document.querySelector(id);
  const angle = Math.atan2(ty - qy, tx - qx) + Math.PI;
  const barb = (a) => `${tx + 32 * Math.cos(a)} ${ty + 32 * Math.sin(a)}`;
  path.setAttribute("d", `M ${sx} ${sy} Q ${qx} ${qy} ${tx} ${ty} M ${barb(angle - .42)} L ${tx} ${ty} L ${barb(angle + .42)}`);
}

ink("#to-system", 371, 681, 338, 738, 373, 798);
ink("#to-service", 371, 1013, 324, 1095, 373, 1191);
ink("#to-app", 708, 1191, 750, 1094, 709, 1013);
ink("#to-screen", 708, 798, 748, 738, 709, 681);

function draw(path, start, duration) {
  const length = path.getTotalLength();
  tl.set(path, { strokeDasharray: length, strokeDashoffset: length }, 0);
  tl.set(path, { visibility: "visible" }, start);
  tl.to(path, { strokeDashoffset: 0, duration, ease: "power1.inOut" }, start);
}

function showNode(id, start) {
  tl.set(id, { opacity: 1 }, start);
  draw(document.querySelector(id + " path"), start, .36);
  tl.fromTo(id + " text", { opacity: 0 }, { opacity: 1, duration: .2 }, start + .26);
}

gsap.set(".connector", { visibility: "hidden" });
tl.fromTo(".logo-paper", { y: 26 }, { y: 0, duration: .45, ease: "power2.out" }, 0);
tl.fromTo(".robot", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .5 }, .48);
tl.fromTo("#screen .device", { y: 23 }, { y: 0, duration: .38 }, 4.884);
tl.set("#screen", { opacity: 0 }, 9.912);
tl.set("#flow", { opacity: 1 }, 9.912);
showNode("#node-screen", 9.912);
draw(document.querySelector("#to-system"), 10.33, .46);
showNode("#node-app", 10.76);
tl.set("#question-label", { opacity: 1 }, 11.22);
draw(document.querySelector("#to-service"), 11.22, 1.12);
showNode("#node-service", 12.23);

tl.set(["#flow-title", "#question-label"], { opacity: 0 }, 13.752);
tl.set(["#to-system", "#to-service"], { opacity: .24 }, 13.752);
tl.set(["#return-title", "#answer-label"], { opacity: 1 }, 13.752);
draw(document.querySelector("#to-app"), 14.1, 1.65);
draw(document.querySelector("#to-screen"), 16.18, 1.1);
tl.set("#flow", { opacity: 0 }, 17.93);
tl.set("#screen", { opacity: 1 }, 17.93);
tl.set(["#app-q", "#screen-title"], { opacity: 0 }, 18.244);
tl.set(["#app-a", "#answer-title"], { opacity: 1 }, 18.244);
tl.set("#screen", { opacity: 0 }, 20.7);

tl.set(["#return-title", "#answer-label", "#to-app", "#to-screen"], { opacity: 0 }, 23.892);
tl.set(["#flow", "#roles-title"], { opacity: 1 }, 23.892);
tl.set("#node-service", { opacity: .42 }, 23.892);
tl.to("#node-service", { opacity: 1, duration: .4 }, 27.7);
tl.to(["#node-app", "#node-screen"], { opacity: .54, duration: .4 }, 27.7);
tl.to(["#node-app", "#node-screen"], { opacity: 1, duration: .45 }, 31.66);
tl.set({}, {}, 33.167);

window.__timelines = window.__timelines || {};
window.__timelines["ep01-b04-b05"] = tl;

// Seeded paths from the installed hw-pipeline block.
function hwHash (n, seed) {
          var x = Math.sin(n * 127.1 + (seed || 1) * 311.7) * 43758.5453;
          return (x - Math.floor(x)) * 2 - 1;
        };
function wobbleRect (w, h, r, seed, amp) {
          amp = amp === undefined ? 3.5 : amp;
          function wob(n) {
            return hwHash(n, seed) * amp;
          }
          var d = "M " + (r + wob(1)) + " " + wob(2);
          d += " L " + (w / 2 + wob(3)) + " " + wob(4);
          d += " L " + (w - r + wob(5)) + " " + wob(6);
          d += " Q " + (w + wob(7)) + " " + wob(8) + " " + (w + wob(9)) + " " + (r + wob(10));
          d += " L " + (w + wob(11)) + " " + (h / 2 + wob(12));
          d += " L " + (w + wob(13)) + " " + (h - r + wob(14));
          d +=
            " Q " +
            (w + wob(15)) +
            " " +
            (h + wob(16)) +
            " " +
            (w - r + wob(17)) +
            " " +
            (h + wob(18));
          d += " L " + (w / 2 + wob(19)) + " " + (h + wob(20));
          d += " L " + (r + wob(21)) + " " + (h + wob(22));
          d += " Q " + wob(23) + " " + (h + wob(24)) + " " + wob(25) + " " + (h - r + wob(26));
          d += " L " + wob(27) + " " + (h / 2 + wob(28));
          d += " L " + wob(29) + " " + (r + wob(30));
          d += " Q " + wob(31) + " " + wob(32) + " " + (r + wob(33)) + " " + wob(34);
          return d;
        };


import { readFileSync, writeFileSync } from 'node:fs';
import './build-visual.mjs';
let html = readFileSync(new URL('index.html', import.meta.url), 'utf8');
const css = `
@font-face{font-family:Sarabun;src:url('assets/Sarabun-Regular.ttf');font-weight:400}
@font-face{font-family:Sarabun;src:url('assets/Sarabun-Bold.ttf');font-weight:700}
html,body,.file,.diff-label{font-family:Sarabun,sans-serif}
.scene{background-color:#fff9e9;background-image:linear-gradient(#acc7d044 2px,transparent 2px),linear-gradient(90deg,#acc7d044 2px,transparent 2px);background-size:54px 54px}
.scene:nth-of-type(3n+2){background-color:#eaf5ff}.scene:nth-of-type(3n){background-color:#fff0f0}
.inner{padding-top:175px}.eyebrow{display:none}
h1{font-family:Sarabun;font-weight:700;font-size:65px;text-align:center;line-height:1.3;background:#ffd536;color:#111;padding:26px 24px;border:7px solid #202326;box-shadow:9px 10px 0 #fff;transform:rotate(-1deg);margin:20px 0 68px}
.scene:nth-of-type(3n+2) h1{background:#256eea;color:#fff}.scene:nth-of-type(3n) h1{background:#19ae70;color:#101f1c}
.code,.diff,.chat,.url,.screenshot{border:8px solid #24252c;box-shadow:0 0 0 10px white,10px 16px 0 #24252c22;border-radius:28px}
.code,.diff{background:#182531}.file{color:white;border-bottom:3px solid #6d8d9d}
.line.active{background:#305a8b;border-left-color:#ffda32}.hint,.disclaimer{color:#172d36;background:#fffdf5;border:4px solid #202326;padding:19px 24px;display:table;font-size:38px;box-shadow:5px 6px 0 #fff}
.large{font-family:Sarabun;font-weight:700;background:white;border:5px solid #202326;padding:24px 30px;border-radius:30px;font-size:49px}
.node{border:6px solid #25252b;box-shadow:7px 9px 0 white;background:#fff}.node.on{background:#ffe26b;border-color:#25252b}
.bubble{background:#d7f1e3;border:3px solid #204c43}.reply{font-family:Sarabun}.chat-head{background:#d9ecff;font-weight:700}.chat-body{font-family:Sarabun}
.brand-logo{position:absolute;right:85px;top:55px;width:220px;height:78px;object-fit:contain;z-index:20}.brand-robot{position:absolute;right:25px;bottom:80px;width:225px;height:260px;object-fit:contain;z-index:20}
.screenshot{height:350px;position:relative}.screenshot img{position:absolute;width:1750px;max-width:none;left:-110px;top:0}.screenshot:after{content:'';position:absolute;left:0;right:0;top:36px;bottom:0;background:#fff9e9}.spotlight{display:none}
.disclaimer{font-size:34px}.inner{padding-bottom:300px}
`;
html = html.replace('</style>', css + '</style>');
html = html.replace('</div><script>window.__timelines', `<img class="brand-logo" src="assets/logo.png" alt="LangMind"><img class="brand-robot" src="assets/robot.png" alt="Robot ชี้สอน"><div id="dart-cursor" data-composition-id="dart-cursor" data-composition-src="compositions/components/dart-cursor.html" data-start="17" data-duration="6" data-width="1080" data-height="1920" data-track-index="3" data-track-kind="graphics" data-variable-values='{"target_x":40,"target_y":34,"target2_x":42,"target2_y":40,"tone":"light","blur":0.5}'></div></div><script>window.__timelines`);
writeFileSync(new URL('index.html', import.meta.url), html);

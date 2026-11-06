> Historical / งานพักไว้ — 6 พ.ย. 2026: เอกสารนี้เก็บแผนหรือหลักฐาน ณ รุ่นเดิม ไม่ใช่คำสั่งผลิตหรือ storyboard ที่อนุมัติสำหรับรอบใหม่ งานปัจจุบันคือรีเซ็ตระบบระดับโปรเจกต์ตาม README.md และแผนหลัก เก็บเนื้อหาเดิมไว้เทียบ ไม่ใช้สถานะ PASS หรือ Next action ด้านล่างรับรองงานใหม่

# EP01 complete visual preview v3

Source of direction: ../../BLUEPRINT-v3.md. All seven image assets passed source inspection before this composition was implemented. Duration 104 seconds, portrait 1080×1920, 30fps. Eight scenes. No MP4 export, no live LangMind API, no paid audio calls.

Shots and narration follow the blueprint. Screens are generated PNGs. HTML only hosts images, explanatory diagrams, code snippets, headings and motion. No HTML recreates the demo application's controls or bubbles.

Actual Catalog usage: browser-device-stage adapted in compositions/s05.html, preserving stage/device/screen structure and settle motion; full upstream file retained at compositions/components/browser-device-stage-upstream.html. Inline-highlight CSS and scalar animation from Catalog are integrated in assets/style.css and scenes 01/03/08; upstream remains in components/inline-highlight.html. No claim that chat-message/agent-cursor/streaming-text is mounted.

Design: ENERGY 2 / RHYTHM 3 / MOTION 2. Screen-led opening, dark explanatory diagram, brand-to-screen, question-to-answer demo, document result, voice workflow, developer request, and image montage. Stills move only to establish focus or show app state. Contrast and readability measured separately for DOM text and raster assets.

Banned: live-looking fake results, invented statistics, unsupported citations, demo UI in HTML, repeated centered slide layout, idle floating mascot, flashing transitions, logo recoloring, hidden key in browser, screenshot placeholders disguised as product evidence.

Audio scope: visual preview with complete narration draft in BLUEPRINT-v3; no recorded voice or music yet. This is not an audio-ready publishing deliverable. User selected male Thai conversational voice for later production.

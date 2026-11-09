# EP02 continuity r10 · ฉบับภาพไม่มีเสียง

คำสั่งเพิ่มเติมล่าสุด: code ใช้ [Code Highlight Sweep](https://hyperframes.heygen.com/catalog/blocks/code-highlight) นำ HTML source ที่ติดตั้งอยู่มาปรับจริง เก็บ source เดิมใน catalog-source/ และ13 HTML variants ใน compositions/ ใช้ hf-code-anim.js highlight() กับ GSAP paused timeline เดิม pre-render ช่วง sweep1.2s/30fps และ PNG hold ให้ Explainroo host แทน Canvas code เดิม ดู code-highlight-cases.json และ evidence/code-highlight-provenance.json

ผล preflight รอบ Catalog: ดู13 host stills ที่360pxแล้ว; Sarabun48px/line-height72px; surrounding opacity.65; sweepเริ่ม.2sถึง1.1sและholdหลัง1.2s; ไม่มีauto zoomกรอบ; เฉพาะquery B12ขยาย1.15xตามcue Check errors0/warnings96 คำเตือนในเนื้อหา clip ต้องตรวจด้วยภาพแยก เพราะ Explainroo layout checker ไม่อ่านข้อความภายใน prerendered clip

Full render ล่าสุดหลังคำสั่งนี้ใช้ source ปัจจุบันทั้ง440s ไม่มีการต่อไฟล์แบบ stream-copy ผล MP4 final จะบันทึกท้ายเอกสาร

เก็บ continuity ตามแบบหลังตรวจ playback: nodeหน้าเว็บ/server/Agentอยู่y470/800/1130ทุกครั้ง, ขากลับB10เดิน15–17sก่อนแสดงA1, B15ค้างคำเฉลยแทนตั้งhookใหม่, H1เป็น64px/ไม่เกิน3บรรทัดและย่อด้วยcrossfade.6s, B16dissolve.6sก่อนขาวเต็มเฟรม ป้ายIDที่y1368–1448หนึ่งบรรทัด42pxนอกraster/เหนือcaption; Q1บนflowย1332และCTAcenterประมาณ1270อยู่main safe area LabelB07ระบุหน้าเว็บ ไม่ปะปนฝั่งserver

ตรวจสีจากplayerจริง: master full-rangeของExplainroo decodeพื้นได้RGB8,28,31แต่Chromiumแสดง0,12,18 เทียบsource9,29,32 ทดลองBT.709 limitedแสดง7,27,29 จึงexportด้วยnormalize-color.mjs (แปลงrange/matrix, H.264 yuv420p BT.709 limited, AACcopy) เป็นไฟล์ส่งมอบ การแปลงและcompressionยังมีlossไม่อ้างRGBตรงทุกpixel

คำสั่งล่าสุด: ผู้ใช้ตอบ “ทำมาแบบไม่มีเสียงก่อน” จึงไม่สร้าง/reuse VO, ไม่เรียก TTS และไม่ใส่ BGM/SFX ใช้ 440 วินาทีจาก STORYBOARD เป็น visual budget เท่านั้น ไม่ใช่เวลาที่วัดจากเสียงจริง ไม่ publish และไม่เรียก LangMind API

Source of truth: DESIGN.md เฉพาะ r10 ก่อนประวัติ r2; STORYBOARD.md สำหรับบท/ลำดับ/เวลา; แผนออกแบบ 2026-11-07-ep02-continuity-r10.md เก็บ r9/.tools/EP01 และ user changes เดิม

## ผลิตแล้วและแหล่งที่มา

- Explainroo 0.4.1 เป็น renderer หลัก ใช้สี/config/font/framing conventions จาก r9 แยก source ใหม่ ไม่แก้ engine
- Demo เป็น raster ที่สร้างด้วย built-in imagegen จริง: R01, R02 composer/sent/pending, R03 success, R04 error, R05 pending/answer, R06 mobile/desktop ทุก state เปิดดูผลจริงแล้ว R06 mobile ใช้ raster R05-answer เดิมเพื่อคง thread
- Canonical Q1/A1/Q2/A2 จาก DESIGN r10 ไม่ใช้คำตอบ r2; ภาพจำลองติดป้าย ไม่มี live API result/citations/latency/metrics
- Host crop หัวและ composer จาก raster แล้วตรึงไว้ เลื่อนเฉพาะ raster message region ไม่วาด chat bubble/dashboard ใน HTML/Canvas ใหม่ ภาพเจนจริง 916×1717 จัด crop เข้า master 1080×1920 ตามขนาดจริงใน manifest ไม่อ้างไฟล์ native 1080×1920
- Host ใช้ Sarabun Regular/Bold local; สำเนา OFL มาจากไฟล์เดิมใน workspace โดยไม่แก้ EP01 ภาพ raster ขอ Sarabun ใน prompt แต่ไม่มี font metadata ให้รับรองว่า glyph ทุกตัวเป็นไฟล์ฟอนต์เดียวกับ host
- K-name/age/scope ใช้ footage ฟอร์มจริงจาก r3 ตัดเสียงออก ไม่ใส่ข้อมูลใหม่ Freeze frame จริงเมื่อ footage จบก่อน cue ไม่วนกลับไปพิมพ์ซ้ำ เปิด source contact 2fps ตลอดทุกช่วง ไม่มี key/profile ปรากฏในฟอร์มที่ตรวจ; ไม่อ้างว่าอ่านทุก source frame ด้วยสายตา
- K-agent-domain crop เหลือ x0..350 y0..74 จาก agent-url.png จึงไม่รวม UUID เดิม โค้ดใช้ placeholder ไม่เก็บ key จริงใน source/output
- โลโก้ shared ต้นฉบับ contain ที่ความกว้าง480 สูงตาม aspect; B16 พื้นขาว #FFFFFF คง CTA/URL จาก3sถึง20s ไม่มีปุ่ม/QR/robot

## Catalog และช่องว่าง

เปิด local source preview จริงและเก็บภาพใน evidence/catalog-*.png สำหรับ flowchart-vertical, yt-feather-highlight และ multi-device-splay แหล่ง source อยู่ในรุ่นเดิม ไม่ติดตั้ง/ดาวน์โหลดใหม่

Flow ใช้โครง connector/reveal จาก Catalog และ r9 ปรับเป็นเส้นเดียวไปกลับ Custom gap: ขากลับ, query copy, ConversationTag, QuestionThread และ raster viewport ที่คง state ส่วน spotlight ใช้แนว dim รอบ focus พร้อมกรอบ3px แทน ellipse ที่ครอบ field ไม่พอดี ข้อจำกัด preview splay: template เปล่ามีแต่ device shells และ overshoot/rotation/float ซึ่งขัด r10 จึงดัดแปลงโครง host ให้เห็นหน้าจอครั้งละหนึ่งและนิ่งช่วงอ่าน ไม่อ้างว่านำ runtime Catalog เดิมมารันตรง ๆ ทั้งตัว

## Verification ระหว่างผลิต

`node --check scenes.js` / `prepare.mjs`: exit0 [Syntax-Only]

`node prepare.mjs`: 16 scenes / 440s / 13200 frames / narratedScenes0 ไม่มีบท spoken ใน script.md จึงไม่กระตุ้น default Kokoro

Explainroo still เปิดดู 26 จุด ครบ16ฉากและ query/ID/error/device/ending แล้ว แก้ H1 ตัดคำไทยล้นขอบ, code row height ที่ซ้อนบรรทัด query และคำกำกับ code ชน conversation tag แล้ว

Explainroo check รอบผ่าน: 0 errors / 109 warnings ที่ view-width360 ส่วนใหญ่เป็น metadata/secondary labels ต่ำกว่า16px กับ no-entrance/hold heuristics เพราะวัตถุใช้ at:-1 เพื่อคงข้ามฉาก ไม่ใช่หลักฐานว่าข้อความฝัง raster ผ่าน ข้อความหลัก48px/คำถาม58px และ raster ต้องตรวจจาก export แยก

รอบแรก still ใน sandbox ล้มเหลว ERR_NETWORK_ACCESS_DENIED ที่ localhost เปลี่ยนเป็น local Chromium นอก sandbox แล้วสำเร็จ ไม่แก้ .tools และไม่เรียก live/paid API

## ขอบเขตการตรวจ

Technical: ผล MP4 ส่งมอบอยู่ท้ายเอกสาร ผูกกับ SHA256 ของไฟล์สุดท้ายแล้ว

Visual: ตรวจpreflightและexport86framesครบ16ฉากแล้ว ผลและขอบเขตอยู่ท้ายเอกสาร ไม่รับรองoverlayของช่องทางที่ยังไม่ได้ระบุหรือทุกraster glyphจากOCR

Storytelling: ตรวจcanonical thread, ทาย3sในB01/B12, Q2ส่งก่อนA2, conversation IDเดิมคงB10→B12และB13–15จากexportและplaybackช่วงสำคัญของMP4สุดท้ายแล้ว ไม่อ้างผลทดสอบผู้ชมหรือretention

Audio: ไม่มีเสียงตามคำสั่ง ไม่ตรวจการออกเสียง/VO sync/ท้ายคำ ไม่มี transcript/in-out จากเสียงเดิมเพราะไม่ reuse เสียง; vo-map-cues.json เก็บบทจริงจาก STORYBOARD และ in/out=null ไว้ทำเสียงภายหลัง captions-th.srt ว่างโดยเจตนา ไม่แต่งเวลาเป็นซับจากเสียงจริง

Scoped antislop: Hard/Purpose/Liveliness/Craft ใช้เฉพาะเกณฑ์วิดีโอ; เหตุผลสี/font/focus ตาม DESIGN; ENERGY2/RHYTHM3/MOTION2 ไม่มีเกณฑ์ keyboard/theme-toggle ของ interactive app ปนเข้ากับ MP4 การตรวจองค์ประกอบไม่ใช่ user acceptance

## ปัญหาที่พบและการแก้ระหว่างผลิต

ก่อนคำสั่ง Catalog พบcodeแสดง Q1 เป็นตัวแปร จึงแก้เป็น message ตาม snippet; CTAเดิมบรรทัดแรกเลยsafe-area nominalเล็กน้อย จึงแบ่งเป็นสามบรรทัดตามข้อความเดิม

การต่อ partial correction แบบ stream-copy พบprefix/middleเกิน2เฟรมจากB-frame (5162/6662แทน5160/6660) ตัวตรวจหยุดและเก็บoriginalไว้ เปลี่ยนเป็นtrimตามframeแล้วencodeและตรวจได้13200frames/440s ต่อมาผู้ใช้สั่งCatalog จึงใช้full renderใหม่เป็นผลส่งมอบ ประวัติการประกอบไม่ใช่คำสั่งผลิตฉบับปัจจุบัน

Catalog adapter รอบแรกค้างเพราะpage.evaluateคืนGSAP Timelineให้serialize แก้เป็นseekในblockที่ไม่คืนobject ตรวจseek/screenshotสำเร็จและสร้าง13variantsครบ Renderรอบแรกพบengineเรียกprobeตรงt=endของscene แก้lookupcueให้clampที่เฟรมสุดท้ายในฉาก ไม่เปลี่ยนbudget/cueหรือเครื่องมือใน.tools


## ผลส่งมอบจริง · 7 พฤศจิกายน 2026

ไฟล์ ep02-continuity-r10.mp4 · 440s / 07:20 · 13200 frames · 15542078 bytes · SHA256 8cbb8efb8e8588935e62b0da1dd5543f893fbfb40d6bc95481696dc8d6a229eb

- Technical VERIFIED: ffprobe H.264/yuv420p/1080×1920/30fps/BT.709 limited; AAC48000Hz stereo. FFmpeg full decode exit0 ไม่มีerror ดู evidence/ffprobe.json, full-decode.log, export-verification.json
- Visual REVIEWED: เปิดexport86frames/10sheetsครบ16ฉากและmid-zoom ที่360px/1080px รวมพิกัดID/ขอบchat/ไทย/code/CTA; เปิด rasterทุกstateก่อนใช้และhostcodeครบ13cue; metadata/secondarylabelsยังเล็กตามwarnings ไม่รับรองoverlayของช่องทางที่ไม่ได้ระบุหรือglyphทุกตัวจากOCR
- Storytelling REVIEWED: เปิดเล่นMP4สุดท้ายจริง360×640/1xช่วง0–40,172–198,264–354,420–439.8s รวม175.8s มี31capturesทุกจุดplaying/readyState4และdropped0; SHA256ในplayback-source.jsonตรงoutput. ดูภาพตามลำดับยืนยันQ1/A1/Q2/A2และconv_demo_01เดิม รอ/ผิดพลาดเป็นกิ่ง เฉลยหลังช่วงทายและส่งQ2ก่อนA2 ขากลับก่อนแสดงA1มีจริง
- Audio SILENCE VERIFIED: silencedetect0–440sครบ; volumedetect mean/max−91.0dBซึ่งเป็นfloorของการวัดPCM16 ไม่ใช่LUFS ไม่มีVO/BGM/SFXตามคำสั่ง จึงยังไม่ได้ตรวจออกเสียง/ซับVO/ท้ายคำ ไม่ได้reuseเสียงเก่าหรือเร่งเสียง

B16: sourceพื้น#FFFFFFเต็มเฟรมหลังdissolve.6s โลโก้ต้นฉบับสัดส่วนเดิม; URL/CTAสามบรรทัดคงนิ่ง3–20s=17s ไม่มีปุ่ม/QR. วัดสี่มุม20×20ตลอด510เฟรมท้ายได้RGB253–255จากlossyH.264 ไม่อ้างencodedทุกpixelเป็น255

Assets48ไฟล์: hashจริงครบ, media metadata44ไฟล์, PNG alpha28ไฟล์. API hash dddbe02f30ec0215e98cb515a3d3374a85f754298163ed84f21facc6e9164a2c; logo hash 025dbb6064076ac724f42009635e715f985a3d2df8abfa374a8fcec398979c49 ตรงbaseline. captions-th.srt 0bytesโดยเจตนา; VO map16ฉากเป็นบทจากSTORYBOARDและplannedcues ไม่ใช่transcriptจากเสียง

Verification Command: node --check scenes.js/prepare.mjs/render-code-highlight.mjs/normalize-color.mjs/verify-export.mjs; Explainroo still/check/render; node normalize-color.mjs; node verify-export.mjs; node evidence/playback-review.mjs. Terminal Result: syntax exit0; Catalog13variants; final check0errors/100warnings; render13200frames/440s exit0; normalize exit0; verify exit0; playback exit0. ไม่รันproductionbuildของแอปเพราะเป็นงานmediaและไม่ได้สร้างแอป

Scoped antislop final: Hard PASSจากป้ายจำลองและไม่มีclaims/APIผลจริงที่แต่ง; Purpose PASSจากสี/font/focusตามแบบและCode Highlight runtimeจริง; Liveliness PASSจากmotifs/ช่วงคิด/เส้นไปกลับ/เฉลยที่ตรวจ; Craft PASSในขอบเขตเฟรมและplaybackที่ตรวจ ไม่มีuser acceptanceแทนผู้ใช้

ยังไม่ตรวจ: realtimeครบ440sทุกเฟรม, การอ่านทุกตัวเลือกของfootageที่360px, overlayทุกแพลตฟอร์ม, font metadataในgenerated raster, audience test/retention และVO/caption syncหลังมีเสียงจริง. งานเสียงพักตามคำสั่งผู้ใช้ ไม่ใช่blockedจากTTS

ตรวจเอกสารส่งมอบ: local linksเสีย0, asset hash mismatches0, output hashตรงreport, Catalog sourceเดิมhashตรง, API/logo baselineไม่เปลี่ยน; scoped git diff --check exit0 มีเพียงคำเตือนLF→CRLF ไม่มีwhitespace error เนื้อหาเดิมของstatus filesทั้ง3ยังคงเป็นsuffixครบตามstatus-prefix-preservation.json

Nexus: get_stateสำเร็จ; briefและsave_sessionเฉพาะLangMine-API-VDOล้มเหลวด้วยprojectId validation จึงไม่มีsessionที่บันทึกสำเร็จ ใช้บันทึกในworkspace ไม่ยืมบริบทหรือเขียนmemoryโปรเจกต์อื่น

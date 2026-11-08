# EP03 Silent Animatic Assets

Episode ID: `ep03-streaming-chat`  
Build version: `silent-v1`  
Assets copied from existing W5/ shared sources; files were not modified. SHA-256 hashes are recorded below.

| Project asset | Source | Dimensions / format | SHA-256 |
|---|---|---|---|
| `assets/ui/scr-01-chat-loading.png` | `episodes/ep03/assets/ui/scr-01-chat-loading.png` | 1080×1920, RGBA | `38FDEB49A700A9A9756BCAA817C98ADF0E77D006A1461679BF321B6D166940D1` |
| `assets/ui/scr-02-chat-streaming.png` | `episodes/ep03/assets/ui/scr-02-chat-streaming.png` | 1080×1920, RGBA | `6A54A039FEC7D224702BC5CFAE9F8671C244F768F42D347F69B890A623369693` |
| `assets/characters/01-question.png` | `episodes/ep03/assets/characters/01-question.png` | 445×503, RGBA | `C7D8BBE30CBC7ECBAF439B499ED35C4C2CB9DEAD8144DD08FCB84445065A5085` |
| `assets/characters/05-point-up.png` | `episodes/ep03/assets/characters/05-point-up.png` | 445×436, RGBA | `6596F6B0A6FD7A57A3A6CC6C31B8DA13E18CF17BF14777351480BD222E04DC01` |
| `assets/characters/20-laptop.png` | `shared/assets/characters/robot/20-laptop.png` | 1254×1254, RGBA | `66584B5A029117702AF7F8BB85634B4A3979B327CA4BBAFEE62D572DB008AB72` |
| `assets/characters/39-tiptoe.png` | `shared/assets/characters/robot/39-tiptoe.png` | 1254×1254, RGBA | `DD9A9452DCD8FFAA03D9CBC440511B21807B4ADC9E0DBC291BD4205AD41F7F4B` |
| `assets/characters/10-thumbs-up.png` | `shared/assets/characters/robot/10-thumbs-up.png` | 512×485, RGBA | `A12F374F8B804AB812C185F2191EC19B736CFEA8466BAE947A54926F4764CB17` |
| `assets/brand/langmind-logo.png` | `episodes/ep03/assets/brand/langmind-logo.png` | 689×606, RGBA | `025DBB6064076AC724F42009635E715F985A3D2DF8ABFA374A8FCEC398979C49` |
| `assets/fonts/Sarabun-Regular.ttf` | `episodes/ep03/assets/fonts/Sarabun-Regular.ttf` | TTF | `226D4F368FBC0457990DDEF2692679BADFD2C1A4E89E5AC4D43C10BA7743B2F1` |
| `assets/fonts/Sarabun-Bold.ttf` | `episodes/ep03/assets/fonts/Sarabun-Bold.ttf` | TTF | `D38308CA27D067B9A1B79006337C1F9A66C29AA016D96A9D88D3801DA7FA83B9` |
| `assets/fonts/Sarabun-OFL.txt` | `episodes/ep03/assets/fonts/Sarabun-OFL.txt` | License text | `8F5639919580943AC354CF131D69F1A452C686CFD68E2743A319F70B1DAB2BFF` |
| `assets/vendor/gsap.min.js` | `episodes/ep02-knowledge-sample/assets/gsap.min.js` | GSAP 3.14.2, 72,790 bytes | `FD6978C80858A3036C39B4E53B5A6F9385D759D43283E6B1DE89237E5640D85F` |

Raster UI text and example answer remain illustrative. See `timing.json` for scene/caption IDs and future voice anchors.

Image files were decoded in PowerShell with System.Drawing and use `Format32bppArgb`; the source and project-copy hashes match for the copied raster/font assets. GSAP is copied unmodified with its embedded license header and loaded from this local path; no CDN request is used. Note: this inspection measured `01-question.png` at 445×503, while the earlier W5 ledger reports 445×436; the copied file hash matches that ledger's recorded SHA prefix.

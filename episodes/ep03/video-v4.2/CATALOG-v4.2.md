# Catalog selection log — EP03 v4.2

| Catalog item | Type / role | Preview evidence available | Planned use | Status in v4.2 |
|---|---|---|---|---|
| HF-118 Code Typing | Block; token-by-token code reveal with caret | [CATALOG_USAGE_MAP.md](../../../docs/CATALOG_USAGE_MAP.md#hf-118) records preview observed around 0:01 and 0:04 on 2026-11-06 | B4 request body reveal | Catalog behavior selected; original registry source not integrated/rendered in this environment. Python stage renderer emulates progressive visible lines only. |
| HF-196 Code Terminal Run | Component; command then output lines by cue | [CATALOG_USAGE_MAP.md](../../../docs/CATALOG_USAGE_MAP.md#hf-196) records prompt at 0:00 and multiple output lines around 0:04 on 2026-11-06 | B5 SSE event sequence | Catalog behavior selected; original registry source not integrated/rendered in this environment. Python stage renderer reveals documented event names in order. |
| HF-408 Flowchart | Component; diagram flow | [CATALOG_USAGE_MAP.md](../../../docs/CATALOG_USAGE_MAP.md#hf-408) documents the choice and constraints; preview for this project not re-opened | B2 system responsibility diagram | Considered; use simple custom diagram because the three boundaries (frontend/backend/Chat API) need explicit labels and current preview can't be checked. |
| HF-242 Marker Checklist Card | Component; progressive checklist | [CATALOG_USAGE_MAP.md](../../../docs/CATALOG_USAGE_MAP.md#hf-242) | B3 prerequisites and B8 recap | Considered; custom vertical cards used for readable Thai and to match project theme. |

**Environment limitation:** HyperFrames preview/browser is disabled in Work settings and the CLI launch failed twice because it could not resolve `volta`. Per project instructions, no more retries were made. A catalog preview record is not evidence of installation, integration, or compatibility with this specific render.

**Custom gap and fallback:** Use simple staged raster changes for Thai vertical layout and API schema readability. They approximate only the selected behavior (progressive reveal), not the component implementation. Revisit native block integration after the CLI environment can call Volta and verify a composition preview.

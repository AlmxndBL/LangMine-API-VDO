import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const workspace=path.resolve(here,'../../../..');
const files=['README.md','AGENTS.md','docs/PROJECT_BRIEF.md','docs/plans/2026-11-06-workspace-foundation.md','docs/plans/2026-11-06-ep01-v2.md','episodes/ep01-api-introduction/README.md','episodes/ep01-api-introduction/SCRIPT-v2.md','episodes/ep01-api-introduction/STORYBOARD-v2.md'];
const broken=[];let links=0;
for(const file of files){
  const full=path.join(workspace,file),text=fs.readFileSync(full,'utf8');
  for(const m of text.matchAll(/\]\(([^)]+)\)/g)){
    const link=m[1].split('#')[0];if(!link||/^(https?:|codex:|plugin:)/.test(link))continue;
    links++;if(!fs.existsSync(path.resolve(path.dirname(full),decodeURIComponent(link))))broken.push({file,link});
  }
}
const apiHash=crypto.createHash('sha256').update(fs.readFileSync(path.join(workspace,'langmind-api.md'))).digest('hex').toUpperCase();
const report={documents:files.length,links,broken,apiHash,apiUnchanged:apiHash==='DDDBE02F30EC0215E98CB515A3D3374A85F754298163ED84F21FACC6E9164A2C'};
fs.writeFileSync(path.join(here,'document-verification.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify(report));if(broken.length||!report.apiUnchanged)process.exitCode=1;

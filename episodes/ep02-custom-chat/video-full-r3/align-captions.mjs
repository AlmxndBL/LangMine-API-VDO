import fs from 'node:fs';
import path from 'node:path';
const dir=path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/,'$1'));
const beats=JSON.parse(fs.readFileSync(path.join(dir,'timing.json'),'utf8')).beats;
const cleaned=s=>s.toLowerCase().replace(/[\s.,?!:;_“”"'\/()–—…]/g,'');
const corrected=[];
const alignments={};
for(const b of beats){
 const p=path.join(dir,'evidence',b.id+'-transcript.json');if(!fs.existsSync(p))continue;
 const raw=JSON.parse(fs.readFileSync(p,'utf8'));
 const chars=[],times=[];
 for(const seg of raw)for(const w of seg.words||[]) {const t=cleaned(w.text);for(let i=0;i<t.length;i++){chars.push(t[i]);times.push(w.start+(w.end-w.start)*i/t.length);}}
 const source=cleaned(b.text),n=source.length,m=chars.length;
 const dp=Array.from({length:n+1},()=>new Uint16Array(m+1));for(let i=0;i<=n;i++)dp[i][0]=i;for(let j=0;j<=m;j++)dp[0][j]=j;
 for(let i=1;i<=n;i++)for(let j=1;j<=m;j++)dp[i][j]=Math.min(dp[i-1][j]+1,dp[i][j-1]+1,dp[i-1][j-1]+(source[i-1]===chars[j-1]?0:1));
 const mapping=[];let i=n,j=m;
 while(i>0||j>0){if(i&&j&&dp[i][j]===dp[i-1][j-1]+(source[i-1]===chars[j-1]?0:1)){mapping[i-1]=times[j-1];i--;j--;}else if(i&&dp[i][j]===dp[i-1][j]+1){mapping[i-1]=null;i--;}else j--;}
 for(let k=0;k<n;k++)if(mapping[k]==null){let l=k-1,r=k+1;while(l>=0&&mapping[l]==null)l--;while(r<n&&mapping[r]==null)r++;mapping[k]=l>=0&&r<n?mapping[l]+(mapping[r]-mapping[l])*(k-l)/(r-l):l>=0?mapping[l]:r<n?mapping[r]:0;}
 alignments[b.id]={source,times:mapping};
 const words=[...new Intl.Segmenter('th',{granularity:'word'}).segment(b.text)].map(x=>x.segment);
 let offset=0,group=[],startOffset=0;
 function flush(){if(!group.length)return;const text=group.join('').trim();const start=mapping[Math.min(startOffset,n-1)]||0;const end=mapping[Math.min(offset,n-1)]??b.duration;corrected.push({beat:b.id,text,start,end:Math.max(start+.5,end),alignment:'Whisper small word timing aligned to DESIGN narration'});group=[];}
 for(const word of words){if(group.join('').length+word.length>62&&group.length)flush();if(!group.length)startOffset=offset;group.push(word);offset+=cleaned(word).length;if(/[?]/.test(word)||group.join('').length>42&&/^\s+$/.test(word))flush();}flush();
}
fs.writeFileSync(path.join(dir,'evidence/corrected-captions.json'),JSON.stringify(corrected,null,2));console.log({beats:new Set(corrected.map(c=>c.beat)).size,cues:corrected.length});
fs.writeFileSync(path.join(dir,'evidence/narration-alignment.json'),JSON.stringify(alignments));

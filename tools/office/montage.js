// node montage.js <dir> <prefix> : 2x2 sheets of slide PNGs at 1333x750 each -> half size tiles
const fs=require('fs'),path=require('path'),sharp=require('sharp');
(async()=>{const dir=process.argv[2],pre=process.argv[3];const files=fs.readdirSync(dir).filter(f=>/^slide-\d+\.png$/.test(f)).sort();
const W=1000,H=563;for(let i=0;i<files.length;i+=4){const comp=[];files.slice(i,i+4).forEach((f,k)=>comp.push({input:path.join(dir,f),left:(k%2)*(W+10),top:Math.floor(k/2)*(H+10)}));
const tiles=await Promise.all(comp.map(async c=>({...c,input:await sharp(c.input).resize(W,H).png().toBuffer()})));
const out=path.join(dir,'..',`${pre}-sheet${i/4+1}.png`);await sharp({create:{width:W*2+10,height:H*2+10,channels:3,background:'#888'}}).composite(tiles).png().toFile(out);console.log(out);}})();

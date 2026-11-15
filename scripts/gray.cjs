const sharp=require('sharp'),fs=require('fs'),path=require('path');
const w=(d)=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?w(path.join(d,e.name)):[path.join(d,e.name)]);
(async()=>{const out=[];
for(const f of w('public/assets/images').filter(f=>/\.(png|jpe?g)$/i.test(f))){
 try{const {data,info}=await sharp(f).resize(48,48,{fit:'inside'}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 let n=0,g=0;for(let i=0;i<data.length;i+=4){if(data[i+3]<200)continue;n++;const r=data[i],gg=data[i+1],b=data[i+2];if(Math.abs(r-gg)<6&&Math.abs(gg-b)<6&&r>170&&r<215)g++;}
 const m=await sharp(f).metadata(); if(n>50&&g/n>0.55)out.push({f,w:m.width,h:m.height,frac:+(g/n).toFixed(2)});}catch(e){}}
console.log(JSON.stringify(out));fs.writeFileSync('scripts/gray.json',JSON.stringify(out));})();

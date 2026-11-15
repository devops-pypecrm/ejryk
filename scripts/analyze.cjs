const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
function walk(d){return fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);}
(async()=>{
  const out=[];
  for (const f of walk('public/assets/images').filter(f=>/\.(png|jpe?g)$/i.test(f))) {
    try {
      const img = sharp(f); const m = await img.metadata();
      const {data,info} = await img.clone().resize(64,64,{fit:'inside'}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
      let n=0,green=0,gray=0,sumv=0,sumv2=0;
      for(let i=0;i<data.length;i+=4){ const [r,g,b,a]=[data[i],data[i+1],data[i+2],data[i+3]]; if(a<40) continue; n++;
        if(g>r+25&&g>b+25) green++;
        const v=(r+g+b)/3; sumv+=v; sumv2+=v*v; }
      const mean=sumv/n, sd=Math.sqrt(Math.max(0,sumv2/n-mean*mean));
      out.push({f,w:m.width,h:m.height,n,green:+(green/Math.max(n,1)).toFixed(3),mean:Math.round(mean),sd:Math.round(sd)});
    } catch(e){ out.push({f,err:e.message}); }
  }
  fs.writeFileSync('scripts/analysis.json',JSON.stringify(out));
  console.log('total',out.length,'green>1%',out.filter(o=>o.green>0.01).length,'placeholders(sd<12,mean 150-220)',out.filter(o=>o.sd<12&&o.mean>150&&o.mean<225).length);
})();

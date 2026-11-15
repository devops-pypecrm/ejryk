// One-off: shift the template's green art to our palette and replace grey placeholder images with generated brand art.
const sharp = require('sharp'); const fs = require('fs');
const A = require('./analysis.json');
const hash = (s)=>[...s].reduce((a,c)=>(a*31+c.charCodeAt(0))>>>0,7);
function art(w,h,seed,dark){
  const r=(i)=>((hash(seed+i)%1000)/1000);
  const m=Math.min(w,h);
  const c1=dark?'#1b0f66':'#4a2cc9', c2=dark?'#07041c':'#12093f', c3=dark?'#3a22b8':'#8f4bdc';
  const cap=(i,cx,cy,len,th,rot,fill,op)=>`<g transform="rotate(${rot} ${cx} ${cy})" opacity="${op}"><rect x="${cx-len/2}" y="${cy-th/2}" width="${len}" height="${th}" rx="${th/2}" fill="${fill}"/><rect x="${cx-len/2+th*0.12}" y="${cy-th/2+th*0.08}" width="${len-th*0.24}" height="${th*0.35}" rx="${th*0.17}" fill="#fff" opacity="0.16"/></g>`;
  const ang=Math.round(r(1)*60+110);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
   <linearGradient id="g" gradientTransform="rotate(${ang} .5 .5)"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>
   <radialGradient id="r" cx="${0.2+r(2)*0.6}" cy="${0.15+r(3)*0.3}" r="0.6"><stop offset="0" stop-color="${c3}" stop-opacity="0.75"/><stop offset="1" stop-color="${c3}" stop-opacity="0"/></radialGradient>
   <radialGradient id="y" cx="0.85" cy="0.9" r="0.5"><stop offset="0" stop-color="#f2c935" stop-opacity="${dark?0.18:0.35}"/><stop offset="1" stop-color="#f2c935" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/><rect width="100%" height="100%" fill="url(#r)"/><rect width="100%" height="100%" fill="url(#y)"/>
  ${cap(1,w*0.5,h*0.36,m*0.95,m*0.26,-14,'#5a34d0',dark?0.55:0.9)}
  ${cap(2,w*0.55,h*0.56,m*0.95,m*0.26,-14,'#8f4bdc',dark?0.5:0.9)}
  ${cap(3,w*0.5,h*0.76,m*0.8,m*0.2,-14,'#f2c935',dark?0.45:0.95)}
  </svg>`;
}
(async()=>{
  let shifted=0, replaced=0;
  for (const o of A) {
    if (o.err) continue;
    const f=o.f, isJpg=/\.jpe?g$/i.test(f);
    const skip=/light-bg|award-line|logo|favicon/i.test(f);
    const placeholder = o.sd<12 && o.mean>150 && o.mean<225 && !skip && o.green<0.01;
    if (placeholder && (isJpg || /hero-image|team-0|about-image|ai\.png|case|choose/i.test(f))) {
      const dark = o.w>=1300;
      const buf = await sharp(Buffer.from(art(o.w,o.h,f,dark))).toFormat(isJpg?'jpeg':'png', isJpg?{quality:88}:{}).toBuffer();
      fs.writeFileSync(f,buf); replaced++; continue;
    }
    if (o.green>0.01 && !/logo/i.test(f)) {
      const big = Math.max(o.w,o.h)>=700;
      const buf = await sharp(f).modulate({hue: big?178:-52}).toFormat(isJpg?'jpeg':'png', isJpg?{quality:90}:{}).toBuffer();
      fs.writeFileSync(f,buf); shifted++;
    }
  }
  console.log({shifted,replaced});
})();

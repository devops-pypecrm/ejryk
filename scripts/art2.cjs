const sharp=require('sharp');const fs=require('fs');const hash=(s)=>[...s].reduce((a,c)=>(a*31+c.charCodeAt(0))>>>0,7);
function art(w,h,seed,dark){
  const r=(i)=>((hash(seed+i)%1000)/1000);
  const m=Math.min(w,h);
  const P=[['#4a2cc9','#12093f','#8f4bdc'],['#3a22b8','#0f0838','#b48cf0'],['#6a35d9','#1b0f66','#f2c935'],['#2d1ba8','#07041c','#8f4bdc']];
  const [c1,c2,c3]=P[Math.floor(r(9)*P.length)];
  const rot=Math.round(-28+r(4)*56);
  const cap=(cx,cy,len,th,fill,op)=>`<g transform="rotate(${rot} ${cx} ${cy})" opacity="${op}"><rect x="${cx-len/2}" y="${cy-th/2}" width="${len}" height="${th}" rx="${th/2}" fill="${fill}"/><rect x="${cx-len/2+th*0.12}" y="${cy-th/2+th*0.08}" width="${len-th*0.24}" height="${th*0.35}" rx="${th*0.17}" fill="#fff" opacity="0.16"/></g>`;
  const n=2+Math.floor(r(5)*3);
  let caps='';const cols=['#5a34d0','#8f4bdc','#f2c935','#b48cf0'];
  for(let i=0;i<n;i++){const t=m*(0.16+r(10+i)*0.14);caps+=cap(w*(0.3+r(20+i)*0.4),h*(0.2+0.6*(i+0.5)/n),m*(0.6+r(30+i)*0.5),t,cols[(Math.floor(r(40+i)*4)+i)%4],dark?0.5:0.92);}
  const ang=Math.round(r(1)*70+100);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="g" gradientTransform="rotate(${ang} .5 .5)"><stop offset="0" stop-color="${dark?'#1b0f66':c1}"/><stop offset="1" stop-color="${dark?'#07041c':c2}"/></linearGradient><radialGradient id="r" cx="${0.15+r(2)*0.7}" cy="${0.1+r(3)*0.5}" r="0.6"><stop offset="0" stop-color="${c3}" stop-opacity="0.6"/><stop offset="1" stop-color="${c3}" stop-opacity="0"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><rect width="100%" height="100%" fill="url(#r)"/>${caps}</svg>`;
}
const A=require('./analysis.json');const G=require('./gray.json');
const list=[];
for(const o of A){if(o.err)continue;const skip=/light-bg|award-line|logo|favicon/i.test(o.f);const isJpg=/\.jpe?g$/i.test(o.f);if(o.sd<12&&o.mean>150&&o.mean<225&&!skip&&o.green<0.01&&(isJpg||/hero-image|team-0|about-image|ai\.png|case|choose/i.test(o.f)))list.push({f:o.f,w:o.w,h:o.h,dark:o.w>=1300});}
for(const o of G)list.push({f:o.f,w:o.w,h:o.h,dark:false});
(async()=>{let n=0;for(const o of list){const isJpg=/\.jpe?g$/i.test(o.f);const buf=await sharp(Buffer.from(art(o.w,o.h,o.f,o.dark))).toFormat(isJpg?'jpeg':'png').toBuffer();fs.writeFileSync(o.f,buf);n++;}console.log('regenerated',n);})();

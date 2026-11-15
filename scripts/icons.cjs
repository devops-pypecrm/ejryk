const sharp=require('sharp');
const I={next:['Nx','#ffffff','#000000'],react:['Re','#61dafb','#0b1d2e'],node:['No','#8cc84b','#0f2a0a'],aws:['AWS','#ff9900','#1a1200'],flutter:['Fl','#54c5f8','#06263a'],docker:['Do','#2496ed','#061a2b'],git:['Gt','#f05133','#2b0c05'],ts:['TS','#3178c6','#ffffff']};
(async()=>{for(const [k,[t,bg,fg]] of Object.entries(I)){
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect x="6" y="6" width="108" height="108" rx="28" fill="${bg}"/><text x="60" y="76" font-family="Helvetica, Arial, sans-serif" font-weight="800" font-size="${t.length>2?38:50}" text-anchor="middle" fill="${fg}">${t}</text></svg>`;
 await sharp(Buffer.from(svg)).png().toFile(`public/assets/images/home-1/skills/${k}.png`);}})();

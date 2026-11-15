const sharp=require('sharp'),fs=require('fs');
const P='/private/tmp/claude-501/-Users-adithyandileep-Projects/59794fd9-5529-421e-9260-6316e37f1d2d/scratchpad/photos/';
const valid=JSON.parse(fs.readFileSync('/private/tmp/claude-501/-Users-adithyandileep-Projects/59794fd9-5529-421e-9260-6316e37f1d2d/scratchpad/valid.json'));
const R=require('./replaced.json');
const B='public/assets/images/';
const S={ // specific picks: index into valid[]
 'home-1/hero/hero-image.jpg':25,'home-1/about/about-1.jpg':20,'home-1/about/about-2.jpg':10,'home-1/about-image.jpg':35,
 'home-1/case/case-01.jpg':2,'home-1/case/case-02.jpg':31,'home-1/case/case-03.jpg':30,'home-1/case/case-04.jpg':13,
 'home-1/team/team-01.png':14,'home-1/team/team-02.png':41,'home-1/team/team-03.png':38,
 'home-1/news/news-01.jpg':34,'home-1/news/news-02.jpg':36,'home-1/news/news-03.jpg':39,
 'home-1/hero/client1.jpg':0,'home-1/hero/client2.jpg':7,'home-1/hero/client3.jpg':11,'home-1/hero/client4.jpg':42,
 'background/page-title.jpg':36,'resource/service-details.jpg':6,
 'home-2/case/case-01.jpg':2,'home-2/case/case-02.jpg':31,'home-2/case/case-03.jpg':30,'home-2/case/case-04.jpg':13,'home-2/case/case-05.jpg':43,'home-2/case/case-06.jpg':19,
 'resource/news-1.jpg':20,'resource/news-2.jpg':22,'resource/news-3.jpg':39,'resource/news-details.jpg':21,
};
const PORT=[14,41,38,7,0,11,42,4,26,44], SCENE=[25,20,10,35,2,31,30,13,34,36,39,43,22,12,19,21,45,6,27,37,33,40,32];
const hash=(s)=>[...s].reduce((a,c)=>(a*31+c.charCodeAt(0))>>>0,7);
(async()=>{let n=0;
 for(const [full,[w,h]] of Object.entries(R)){
  const rel=full.replace(B,''); const isPng=/\.png$/i.test(full);
  let idx=S[rel];
  if(idx===undefined){ const portrait=/team|client|avat|thumb|testi|about-info|number/i.test(rel); const pool=portrait?PORT:SCENE; idx=pool[hash(rel)%pool.length]; }
  const opt={fit:'cover',position:(/client|avat|team|thumb|about-info|testi/i.test(rel))?'attention':'centre'};
  let img=sharp(P+valid[idx]).resize(w,h,opt);
  img = isPng ? img.png() : img.jpeg({quality:86,mozjpeg:true});
  fs.writeFileSync(full,await img.toBuffer()); n++;
 } console.log('photos placed',n);})();

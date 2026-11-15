const sharp=require('sharp');
const P='/private/tmp/claude-501/-Users-adithyandileep-Projects/59794fd9-5529-421e-9260-6316e37f1d2d/scratchpad/photos/';
const valid=require('/private/tmp/claude-501/-Users-adithyandileep-Projects/59794fd9-5529-421e-9260-6316e37f1d2d/scratchpad/valid.json');
sharp(P+valid[22]).resize(640,780,{fit:'cover',position:'centre'}).jpeg({quality:86,mozjpeg:true}).toFile('public/assets/images/home-1/award/award-photo.jpg').then(()=>console.log('ok'));

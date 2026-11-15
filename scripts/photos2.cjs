const sharp=require('sharp'),fs=require('fs');
const P='/private/tmp/claude-501/-Users-adithyandileep-Projects/59794fd9-5529-421e-9260-6316e37f1d2d/scratchpad/photos/';
const valid=JSON.parse(fs.readFileSync('/private/tmp/claude-501/-Users-adithyandileep-Projects/59794fd9-5529-421e-9260-6316e37f1d2d/scratchpad/valid.json'));
const B='public/assets/images/home-1/';
const J=(i,w,h,out,pos='centre')=>sharp(P+valid[i]).resize(w,h,{fit:'cover',position:pos}).jpeg({quality:86,mozjpeg:true}).toFile(B+out);
(async()=>{
 await J(45,640,900,'service/photo-1.jpg');   // consulting: handshake / high five
 await J(34,640,900,'service/photo-2.jpg');   // engineering: code
 await J(43,640,900,'service/photo-3.jpg');   // design: wireframes
 await J(30,640,900,'service/photo-4.jpg');   // growth: analytics
 await J(27,760,820,'features/feature-photo.jpg'); // team at table
 console.log('ok');})();

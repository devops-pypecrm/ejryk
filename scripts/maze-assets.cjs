// One-off: build the Maze-design asset set in the brand palette (indigo / purple / yellow) from the template's art + stock photos.
const sharp = require('sharp'), fs = require('fs'), path = require('path');
const SRC = '/Users/adithyandileep/Projects/newcompany/maze-agency-portfolio-html-template-2024-09-06-09-57-41-utc/maze - placehold/images/';
const PH = '/private/tmp/claude-501/-Users-adithyandileep-Projects/59794fd9-5529-421e-9260-6316e37f1d2d/scratchpad/photos/';
const valid = JSON.parse(fs.readFileSync('/private/tmp/claude-501/-Users-adithyandileep-Projects/59794fd9-5529-421e-9260-6316e37f1d2d/scratchpad/valid.json'));
const OUT = 'public/maze/';
const jpg = (q = 84) => ({ quality: q, mozjpeg: true });

(async () => {
  // 1. straight copies (small UI glyphs)
  for (const f of ['arrow-elbow.png', 'arrow-dark.png', 'arrow-white.png', 'backtop.png', 'dott_03.png', 'plus.png', 'minus.png'])
    fs.copyFileSync(SRC + f, OUT + f);

  // 2. soft brand glow (replaces the template's green/yellow glow.png), 603x527 transparent
  const glow = `<svg xmlns="http://www.w3.org/2000/svg" width="603" height="527" viewBox="0 0 603 527">
    <defs><filter id="b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="70"/></filter></defs>
    <g filter="url(#b)">
      <ellipse cx="205" cy="270" rx="150" ry="140" fill="#7f5cff"/>
      <ellipse cx="320" cy="252" rx="150" ry="135" fill="#c39bff"/>
      <ellipse cx="425" cy="262" rx="125" ry="125" fill="#f2c935"/>
    </g></svg>`;
  await sharp(Buffer.from(glow)).png().toFile(OUT + 'glow.png');

  // 3. dark silk textures tinted to the brand ink colour
  const tintDark = (img) => img.greyscale().linear(2.6, 8).tint({ r: 120, g: 92, b: 255 });
  await tintDark(sharp(SRC + 'page-title-bg.png').flatten({ background: '#000' })).resize(1920, 431, { fit: 'cover' }).jpeg(jpg(80)).toFile(OUT + 'silk-bar.jpg');
  await tintDark(sharp(SRC + 'page-title-bg.png').flatten({ background: '#000' })).resize(1920, 1000, { fit: 'cover', position: 'centre' }).blur(1.2).jpeg(jpg(78)).toFile(OUT + 'silk-tall.jpg');
  // light silk for the clients section (template art is black swirl on transparent)
  await sharp(SRC + 'clients-bg.png').tint({ r: 28, g: 20, b: 90 }).resize(1920, 1011, { fit: 'cover' }).png({ quality: 70, compressionLevel: 9 }).toFile(OUT + 'clients-bg.png');
  fs.copyFileSync(SRC + 'service-bg.png', OUT + 'service-bg.png');

  // 4. photos
  const P = async (idx, w, h, out, position = 'centre') =>
    sharp(PH + valid[idx]).resize(w, h, { fit: 'cover', position }).jpeg(jpg()).toFile(OUT + 'p/' + out);
  const work = [2, 31, 39, 40, 36, 16, 30, 10, 29]; // orbitly mintpay craftly kinetic fluxa northwind zenvia brightloop hexa
  for (let i = 0; i < work.length; i++) {
    await P(work[i], 1040, 675, `work-${i + 1}.jpg`);
    await P(work[i], 1480, 976, `work-${i + 1}-wide.jpg`);
  }
  await P(24, 802, 530, 'hero.jpg');
  [6, 28, 19, 33, 15, 37].forEach((idx, i) => {}); // (below, awaited in order)
  const blog = [6, 28, 19, 33, 15, 37];
  for (let i = 0; i < blog.length; i++) { await P(blog[i], 860, 645, `blog-${i + 1}.jpg`); }
  await P(27, 1200, 800, 'about-team.jpg');
  await P(21, 1000, 514, 'services-main.jpg');
  const team = [14, 41, 38];
  for (let i = 0; i < team.length; i++) await P(team[i], 560, 720, `team-${i + 1}.jpg`, 'attention');
  const testi = [11, 42, 14];
  for (let i = 0; i < testi.length; i++) await P(testi[i], 320, 286, `testi-${i + 1}.jpg`, 'attention');
  const cats = [45, 43, 34, 30];
  for (let i = 0; i < cats.length; i++) await P(cats[i], 1400, 720, `cat-${i + 1}.jpg`);
  await P(13, 700, 462, 'detail-a.jpg'); await P(22, 700, 462, 'detail-b.jpg');
  await P(32, 440, 593, 'detail-c.jpg'); await P(12, 440, 593, 'detail-d.jpg'); await P(9, 440, 593, 'detail-e.jpg');
  await P(25, 1200, 800, 'cta.jpg');
  console.log('done', fs.readdirSync(OUT + 'p').length, 'photos');
})();

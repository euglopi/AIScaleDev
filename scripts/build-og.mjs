// Builds public/og.png (the social share image) from the dark background,
// the wordmark text, and the brand logo mark. Run with `npm run og`.
import sharp from 'sharp';

const W = 1200;
const H = 630;

const background = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="#0f1219" />
  <rect x="0" y="0" width="${W}" height="6" fill="#2337ff" />
  <text x="80" y="300" font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
        font-size="88" font-weight="700" fill="#ffffff">AI Scale Dev</text>
  <text x="80" y="372" font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
        font-size="36" fill="#8f9bb8">Building AI that holds up in production.</text>
</svg>`);

const logo = await sharp('public/logo.png')
	.resize(300, 300, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
	.toBuffer();

await sharp(background)
	.composite([{ input: logo, top: (H - 300) / 2, left: W - 300 - 90 }])
	.png()
	.toFile('public/og.png');

console.log('public/og.png rebuilt with logo mark');

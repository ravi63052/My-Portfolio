// One-off asset creation using the already-installed local canvas renderer.
// The generated PNG is tracked; running this helper is not required to build.
import { createRequire } from 'node:module';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const require = createRequire(resolve(process.argv[2] || 'package.json'));
const { createCanvas } = require('@napi-rs/canvas');
const canvas = createCanvas(1200, 630);
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#050b0a'; ctx.fillRect(0,0,1200,630);
ctx.strokeStyle = '#142b20'; ctx.lineWidth = 1;
for(let x=750;x<1200;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,630);ctx.stroke();}
for(let y=0;y<630;y+=40){ctx.beginPath();ctx.moveTo(750,y);ctx.lineTo(1200,y);ctx.stroke();}
ctx.fillStyle='#4af0be';ctx.font='bold 28px Arial';ctx.fillText('RG.',70,75);
ctx.font='16px Arial';ctx.fillStyle='#a0b6a9';ctx.fillText('RAVI GOUD / HYDERABAD, INDIA',70,160);
ctx.font='bold 67px Arial';ctx.fillStyle='#f2f8f5';ctx.fillText('Full Stack Developer',65,267);
ctx.fillStyle='#4af0be';ctx.fillText('& AI Application',65,350);ctx.fillText('Builder.',65,433);
ctx.font='20px Arial';ctx.fillStyle='#9aaba5';ctx.fillText('Thoughtful interfaces. Reliable systems. Applied intelligence.',70,544);
ctx.translate(1000,330);ctx.rotate(-Math.PI/5);
for(let i=2;i>=0;i--){ctx.fillStyle=['#224837','#143326','#0d2118'][i];ctx.strokeStyle='#4af0be';ctx.fillRect(-85,-100+i*50,170,145);ctx.strokeRect(-85,-100+i*50,170,145);}
await writeFile('public/og-image.png',canvas.toBuffer('image/png'));

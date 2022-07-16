import "./index.css"

const canvas = document.querySelector("canvas")!;
const ctx = canvas.getContext("2d")!;

const rect = ctx.canvas.getBoundingClientRect();
const dpr = window.devicePixelRatio ?? 1;
canvas.width = Math.round(rect.width * dpr);
canvas.height = Math.round(rect.height * dpr);
ctx.scale(dpr, dpr);

const blankBitmap: number[] = [];

for (let y = 0; y < canvas.height; y++) {
  for (let x = 0; x < canvas.width; x++) {
    const i = x * 4 + y * canvas.width * 4;
    blankBitmap[i] = 0;
    blankBitmap[i + 1] = 0;
    blankBitmap[i + 2] = 0;
    blankBitmap[i + 3] = 255;
  }
}

const buffer = new ImageData(Uint8ClampedArray.from(blankBitmap), canvas.width, canvas.height);

function start() {
  update();
}

function update() {
  render();
  requestAnimationFrame(update);
}

function render() {
  let t = performance.now() / 1000;

  for (let y = 0; y < buffer.height; y++) {
    for (let x = 0; x < buffer.width; x++) {
      const i = x * 4 + y * buffer.width * 4;

      buffer.data[i] = (i + t * 200)%256;
      buffer.data[i + 1] = 0;
      buffer.data[i + 2] = 0;
      buffer.data[i + 3] = 255;
    }
  }

  ctx.putImageData(buffer, 0, 0);
}

start();

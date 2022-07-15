import "./index.css"

const canvas = document.querySelector("canvas")!;
const ctx = canvas.getContext("2d")!;

const rect = ctx.canvas.getBoundingClientRect();
const dpr = window.devicePixelRatio ?? 1;
ctx.canvas.width = rect.width * dpr;
ctx.canvas.height = rect.height * dpr;
ctx.scale(dpr, dpr);

function start() {
  update();
}

function update() {
  render();
  requestAnimationFrame(update);
}

function render() {
  const width = Math.floor(canvas.width);
  const height = Math.floor(canvas.height);

  let t = performance.now() / 1000;

  const bitmap = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = x * 4 + y * width * 4;
      const v = (x + y + Math.round(t * 200)) % 256;
      bitmap[i] = v >> 1; // Try replacing this with a "v1 / 2"
      bitmap[i + 1] = 0;
      bitmap[i + 2] = v;
      bitmap[i + 3] = 255;
    }
  }

  ctx.putImageData(new ImageData(Uint8ClampedArray.from(bitmap), width, height), 0, 0);
}

start();

import "./index.css"

const canvas = document.querySelector("canvas")!;
const ctx = canvas.getContext("2d")!;

const rect = ctx.canvas.getBoundingClientRect();
const dpr = window.devicePixelRatio ?? 1;
canvas.width = Math.round(rect.width * dpr / 1);
canvas.height = Math.round(rect.height * dpr / 1);
ctx.scale(dpr, dpr);

let t = 0;

const blackImageData = new ImageData(canvas.width, canvas.height);

for (let y = 0; y < blackImageData.height; y++) {
  for (let x = 0; x < blackImageData.width; x++) {
    const i = x * 4 + y * blackImageData.width * 4;
    blackImageData.data[i + 0] = 0;
    blackImageData.data[i + 1] = 0;
    blackImageData.data[i + 2] = 0;
    blackImageData.data[i + 3] = 255;
  }
}

const buffer = new ImageData(canvas.width, canvas.height);

function start() {
  update();
}

function update() {
  buffer.data.set(blackImageData.data);

  render();

  ctx.putImageData(buffer, 0, 0);

  t++;

  requestAnimationFrame(update);
}

function render() {
  for (let y = 0; y < buffer.height; y++) {
    for (let x = 0; x < buffer.width; x++) {
      const r = (x + t * 5) % 256;
      const g = 0;
      const b = (y + t * 5) % 256;

      setPixel(x, y, r, g, b)
    }
  }
}

function setPixel(
  x: number,
  y: number,
  r: number,
  g: number,
  b: number
) {
  const i = x * 4 + y * buffer.width * 4;
  buffer.data[i + 0] = r;
  buffer.data[i + 1] = g;
  buffer.data[i + 2] = b;
  buffer.data[i + 3] = 255;
}

start();

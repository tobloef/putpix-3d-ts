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

function start() {
  update();
}

function update() {
  const imageData = new ImageData(
    new Uint8ClampedArray(blackImageData.data),
    blackImageData.width,
    blackImageData.height,
  );

  render(imageData);

  ctx.putImageData(imageData, 0, 0);

  t++;

  requestAnimationFrame(update);
}

function render(imageData: ImageData) {
  for (let y = 0; y < imageData.height; y++) {
    for (let x = 0; x < imageData.width; x++) {
      const i = x * 4 + y * imageData.width * 4;
      imageData.data[i + 0] = (x + t * 5) % 256;
      imageData.data[i + 1] = 0;
      imageData.data[i + 2] = (y + t * 5) % 256;
      imageData.data[i + 3] = 255;
    }
  }
}

start();

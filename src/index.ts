import "./index.css"

type Vector2 = [number, number];
type Vector3 = [number, number, number];

const canvas = document.querySelector("canvas")!;
const ctx = canvas.getContext("2d")!;

const rect = ctx.canvas.getBoundingClientRect();
const dpr = window.devicePixelRatio ?? 1;
const scale = 1 / 4;
canvas.width = Math.round(rect.width * dpr * scale);
canvas.height = Math.round(rect.height * dpr * scale);
ctx.scale(dpr, dpr);

// @ts-ignore
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

const imageData = new ImageData(canvas.width, canvas.height);

function start() {
  update();
}

function update() {
  imageData.data.set(blackImageData.data);

  render();

  ctx.putImageData(imageData, 0, 0);

  t++;

  requestAnimationFrame(update);
}

function render() {
  randomTrianglesTest();
}

/*
function triangleTest() {
  const p1: Vector2 = [
    0,
    0,
  ];
  const p2: Vector2 = [
    Math.round(imageData.width / 2),
    imageData.height - 1,
  ];
  const p3: Vector2 = [
    imageData.width - 1,
    Math.round(imageData.height / 2),
  ];

  drawTriangleNotSoGood(p1, p2, p3, [255, 255, 255]);
}
 */

function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getTriangles(n: number, pad: number = 0) {
  const triangles: [
    [Vector2, Vector2, Vector2],
    [Vector3, Vector3, Vector3]
  ][] = ([...new Array(n)]).map(() => {
    return [
      [
        [
          getRandomInt(0 - pad, imageData.width + pad),
          getRandomInt(0 - pad, imageData.height + pad),
        ],
        [
          getRandomInt(0 - pad, imageData.width + pad),
          getRandomInt(0 - pad, imageData.height + pad),
        ],
        [
          getRandomInt(0 - pad, imageData.width + pad),
          getRandomInt(0 - pad, imageData.height + pad),
        ],
      ],
      [
        [
          getRandomInt(0, 255),
          getRandomInt(0, 255),
          getRandomInt(0, 255),
        ],
        [
          getRandomInt(0, 255),
          getRandomInt(0, 255),
          getRandomInt(0, 255),
        ],
        [
          getRandomInt(0, 255),
          getRandomInt(0, 255),
          getRandomInt(0, 255),
        ],
      ],
    ]
  });

  return triangles;
}

const triangles = getTriangles(20);

function randomTrianglesTest() {

  triangles.forEach(([
    [p1, p2, p3],
    [c1, c2, c3],
  ]) => {
    drawTriangleGradient(p1, p2, p3, c1, c2, c3);
  });
}

/*
function coloredTriangleTest() {
  const p1: Vector2 = [
    0,
    0,
  ];
  const p2: Vector2 = [
    Math.round(imageData.width / 2),
    imageData.height - 1,
  ];
  const p3: Vector2 = [
    imageData.width - 1,
    Math.round(imageData.height / 2),
  ];

  const c1: Vector3 = [255, 0, 0];
  const c2: Vector3 = [0, 255, 0];
  const c3: Vector3 = [0, 0, 255];

  drawTriangleGradient(p1, p2, p3, c1, c2, c3);
}
 */

/*
function linesTest() {
  const pad = Math.round(imageData.width / 10);

  const step = 10;

  const min = 0 - pad;
  const max = imageData.width;

  for (let i = min; i < max; i += step) {
    drawLineGood(
      [
        0 + i,
        0,
      ],
      [
        pad + i,
        Math.round(imageData.height / 3) - 1,
      ],
      [
        255 - (255 / max) * i,
        (255 / max) * i,
        255,
      ],
    );
  }

  for (let i = min; i < max; i += step) {
    drawLineGood(
      [
        0 + i,
        Math.round(imageData.height / 3),
      ],
      [
        pad + i,
        Math.round((imageData.height / 3) * 2) - 1,
      ],
      [
        (255 / max) * i,
        255,
        255 - (255 / max) * i,
      ],
    );
  }

  for (let i = min; i < max; i += step) {
    drawLineGood(
      [
        0 + i,
        Math.round((imageData.height / 3) * 2),
      ],
      [
        pad + i,
        Math.round((imageData.height / 3) * 3) - 1,
      ],
      [
        255,
        255 - (255 / max) * i,
        (255 / max) * i,
      ],
    );
  }
}

 */

/*
function perPixelTest() {
  for (let y = 0; y < imageData.height; y++) {
    for (let x = 0; x < imageData.width; x++) {
      const r = (x + t * 5) % 256;
      const g = 0;
      const b = (y + t * 5) % 256;

      setPixel(x, y, [r, g, b])
    }
  }
}

 */

function setPixel(
  x: number,
  y: number,
  color: Vector3,
) {
  if (
    x < 0 ||
    y < 0 ||
    x > imageData.width - 1 ||
    y > imageData.height - 1
  ) {
    return;
  }

  x = Math.floor(x);
  y = Math.floor(y);

  const i = x * 4 + ((imageData.height - 1) - y) * imageData.width * 4;

  imageData.data[i + 0] = color[0];
  imageData.data[i + 1] = color[1];
  imageData.data[i + 2] = color[2];
  imageData.data[i + 3] = 255;
}

/*
function drawLineBad(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: Vector3,
) {
  for (let i = 0; i < 1; i += 0.001) {
    const x = Math.floor(x1 + (x2 - x1) * i);
    const y = Math.floor(y1 + (y2 - y1) * i);

    setPixel(x, y, color);
  }
}
*/

/*
function drawLineGood(
  p1: Vector2,
  p2: Vector2,
  color: Vector3,
) {
  let x1 = p1[0];
  let y1 = p1[1];
  let x2 = p2[0];
  let y2 = p2[1];

  const isSteep = Math.abs(x1 - x2) < Math.abs(y1 - y2);

  if (isSteep) {
    // Swap x and y
    [x1, y1] = [y1, x1];
    [x2, y2] = [y2, x2];
  }

  if (x2 < x1) {
    [x1, x2] = [x2, x1];
    [y1, y2] = [y2, y1];
  }

  for (let x = x1; x <= x2; x++) {
    const i = (x - x1) / (x2 - x1);
    const y = Math.floor(y1 * (1 - i) + y2 * i);

    if (isSteep) {
      setPixel(y, x, color);
    } else {
      setPixel(x, y, color);
    }
  }
}
 */

/*
function getLine(
  p1: Vector2,
  p2: Vector2,
  c1: Vector3,
  c2: Vector3,
): [Vector2, Vector3][] {
  let line: [Vector2, Vector3][] = [];

  let x1 = p1[0];
  let y1 = p1[1];
  let x2 = p2[0];
  let y2 = p2[1];

  const isSteep = Math.abs(x1 - x2) < Math.abs(y1 - y2);

  if (isSteep) {
    // Swap x and y
    [x1, y1] = [y1, x1];
    [x2, y2] = [y2, x2];
  }

  if (x2 < x1) {
    [x1, x2] = [x2, x1];
    [y1, y2] = [y2, y1];
  }

  for (let x = x1; x <= x2; x++) {
    const i = (x - x1) / (x2 - x1);
    const y = Math.floor(y1 * (1 - i) + y2 * i);

    const color: Vector3 = [
      c1[0] + (c2[0] - c1[0]) * i,
      c1[1] + (c2[1] - c1[1]) * i,
      c1[2] + (c2[2] - c1[2]) * i,
    ];

    if (isSteep) {
      line.push([[y, x], color]);
    } else {
      line.push([[x, y], color]);
    }
  }

  return line;
}

 */

/*
function drawLineGradient(
  p1: Vector2,
  p2: Vector2,
  color1: Vector3,
  color2: Vector3,
) {
  let x1 = p1[0];
  let y1 = p1[1];
  let x2 = p2[0];
  let y2 = p2[1];

  const isSteep = Math.abs(x1 - x2) < Math.abs(y1 - y2);
  if (isSteep) {
    // Swap x and y
    [x1, y1] = [y1, x1];
    [x2, y2] = [y2, x2];
  }

  if (x2 < x1) {
    [x1, x2] = [x2, x1];
    [y1, y2] = [y2, y1];
    [color1, color2] = [color2, color1];
  }

  for (let x = x1; x <= x2; x++) {
    const i = (x - x1) / (x2 - x1);
    const y = Math.floor(y1 * (1 - i) + y2 * i);

    const color: Vector3 = [
      color1[0] + (color2[0] - color1[0]) * i,
      color1[1] + (color2[1] - color1[1]) * i,
      color1[2] + (color2[2] - color1[2]) * i,
    ]

    if (isSteep) {
      setPixel(y, x, color);
    } else {
      setPixel(x, y, color);
    }
  }
}
*/

function drawTriangleGradient(
  p1: Vector2,
  p2: Vector2,
  p3: Vector2,
  c1: Vector3,
  c2: Vector3,
  c3: Vector3,
) {
  const tmp: [Vector2, Vector3][] = [
    [p1, c1],
    [p2, c2],
    [p3, c3],
  ];

  const [
    [bot, botColor],
    [mid, midColor],
    [top, topColor],
  ] = tmp.sort((a, b) => a[0][1] - b[0][1]);

  const totalHeight = top[1] - bot[1];

  for (let y = bot[1]; y <= mid[1]; y++) {
    const segmentHeight = mid[1] - bot[1] + 1;

    const alpha = (y - bot[1]) / totalHeight;
    const beta = (y - bot[1]) / segmentHeight;

    const colorA = rgbLerp(botColor, topColor, alpha);
    const colorB = rgbLerp(botColor, midColor, beta);

    let xA = bot[0] + Math.floor((top[0] - bot[0]) * alpha);
    let xB = bot[0] + Math.floor((mid[0] - bot[0]) * beta);

    if (xA > xB) {
      [xA, xB] = [xB, xA];
    }

    for (let x = xA; x <= xB; x++) {
      const i = (x - xA) / (xB - xA);

      const color = rgbLerp(colorA, colorB, i);

      setPixel(x, y, color);
    }
  }

  for (let y = mid[1] + 1; y <= top[1]; y++) {
    const segmentHeight = top[1] - mid[1] + 1;

    const alpha = (y - bot[1]) / totalHeight;
    const beta = (y - mid[1]) / segmentHeight;

    const colorA = rgbLerp(botColor, topColor, alpha);
    const colorB = rgbLerp(midColor, topColor, beta);

    let xA = bot[0] + Math.floor((top[0] - bot[0]) * alpha);
    let xB = mid[0] + Math.floor((top[0] - mid[0]) * beta);

    if (xA > xB) {
      [xA, xB] = [xB, xA];
    }

    for (let x = xA; x <= xB; x++) {
      const i = (x - xA) / (xB - xA);

      const color = rgbLerp(colorA, colorB, i);

      setPixel(x, y, color);
    }
  }
}

function rgbLerp(
  c1: Vector3,
  c2: Vector3,
  i: number,
): Vector3 {
  return [
    c1[0] + (c2[0] - c1[0]) * i,
    c1[1] + (c2[1] - c1[1]) * i,
    c1[2] + (c2[2] - c1[2]) * i,
  ]
}

/*
function drawTriangleBetter(
  p1: Vector2,
  p2: Vector2,
  p3: Vector2,
  color: Vector3,
) {
  const [top, mid, bot] = [p1, p2, p3].sort((a, b) => a[1] - b[1]);

  const totalHeight = top[1] - bot[1];

  for (let y = bot[1]; y <= mid[1]; y++) {
    const segmentHeight = mid[1] - bot[1] + 1;

    const alpha = (y - bot[1]) / totalHeight;
    const beta = (y - bot[1]) / segmentHeight;

    let xA = Math.floor(bot[0] + (top[0] - bot[0]) * alpha);
    let xB = Math.floor(bot[0] + (mid[0] - bot[0]) * beta);

    if (xA > xB) {
      [xA, xB] = [xB, xA];
    }

    for (let x = xA; x <= xB; x++) {
      setPixel(x, y, color);
    }
  }

  for (let y = mid[1] + 1; y <= top[1]; y++) {
    const segmentHeight = top[1] - mid[1] + 1;

    const alpha = (y - bot[1]) / totalHeight;
    const beta = (y - mid[1]) / segmentHeight;

    let xA = Math.floor(bot[0] + (top[0] - bot[0]) * alpha);
    let xB = Math.floor(mid[0] + (top[0] - mid[0]) * beta);

    if (xA > xB) {
      [xA, xB] = [xB, xA];
    }

    for (let x = xA; x <= xB; x++) {
      setPixel(x, y, color);
    }
  }
}

 */
/*
function drawTriangleNotSoGood(
  p1: Vector2,
  p2: Vector2,
  p3: Vector2,
  color: Vector3,
) {
  const [bot, mid, top] = [p1, p2, p3].sort((a, b) => a[1] - b[1]);

  let leftX: number;
  let rightX: number;

  for (let y = bot[1]; y <= top[1]; y++) {
    if (y <= mid[1]) {
      const leftmost = mid[0] < top[0] ? mid : top;
      const rightmost = mid[0] > top[0] ? mid : top;

      leftX = bot[1] === leftmost[1]
        ? leftmost[0]
        : getXForLine(y, bot, leftmost);
      rightX = bot[1] === rightmost[1]
        ? rightmost[0]
        : getXForLine(y, bot, rightmost);
    } else {
      const leftmost = mid[0] < bot[0] ? mid : bot;
      const rightmost = mid[0] > bot[0] ? mid : bot;

      leftX = top[1] === leftmost[1]
        ? leftmost[0]
        : getXForLine(y, top, leftmost);
      rightX = top[1] === rightmost[1]
        ? rightmost[0]
        : getXForLine(y, top, rightmost);
    }

    for (let x = leftX; x <= rightX; x++) {
      setPixel(x, y, color);
    }
  }
}

function getXForLine(
  y: number,
  p1: Vector2,
  p2: Vector2,
) {
  return Math.floor(p1[0] + ((p2[0] - p1[0]) / (p2[1] - p1[1])) * (y - p1[1]));
}
*/

start();

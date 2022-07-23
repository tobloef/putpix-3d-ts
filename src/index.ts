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
  drawConnectedTriangles();
}

function drawConnectedTriangles() {
  const space = 0;

  drawTriangleSimpleButIneffective(
    [100, 100 - space],
    [200, 200 - space],
    [300, 100 - space],
    [255 / 4 * 1, 0, 0],
  );
  drawTriangleSimpleButIneffective(
    [300 + space, 300],
    [200 + space, 200],
    [300 + space, 100],
    [255 / 4 * 2, 0, 0],
  );
  drawTriangleSimpleButIneffective(
    [100, 300 + space],
    [200, 200 + space],
    [300, 300 + space],
    [255 / 4 * 3, 0, 0],
  );
  drawTriangleSimpleButIneffective(
    [100 - space, 300],
    [200 - space, 200],
    [100 - space, 100],
    [255 / 4 * 4, 0, 0],
  );
}

function drawManySmallTriangles() {
  const steps = 100;
  const size = 20;

  const p1: Vector2 = [
    Math.round((imageData.width / steps) * (steps / 2 - size)),
    Math.round((imageData.height / steps) * (steps / 2 - size)),
  ];

  const p2: Vector2 = [
    Math.round((imageData.width / steps) * (steps / 2)),
    Math.round((imageData.height / steps) * (steps / 2 + size)),
  ];

  const p3: Vector2 = [
    Math.round((imageData.width / steps) * (steps / 2 + size)),
    Math.round((imageData.height / steps) * (steps / 2 - size)),
  ];

  const w: Vector3 = [255, 255, 255];
  const r: Vector3 = [255, 0, 0];
  const g: Vector3 = [0, 255, 0];
  const b: Vector3 = [0, 0, 255];

  for (let i = 0; i < 100; i++) {
    //drawTriangleVerbose(p1, p2, p3, w);
    //drawTriangleGradient(p1, p2, p3, r, g, b);
    drawTriangleSimpleButIneffective(p1, p2, p3, w);
  }
}

function isPointInTriangle1(
  P: Vector2,
  A: Vector2,
  B: Vector2,
  C: Vector2,
): boolean {
  const s1 = (C[1] - A[1]) || 0.00001;
  const s2 = (C[0] - A[0]) || 0.00001;
  const s3 = (B[1] - A[1]) || 0.00001;
  const s4 = (P[1] - A[1]) || 0.00001;

  const w1 = (A[0] * s1 + s4 * s2 - P[0] * s1) / (s3 * s2 - (B[0] - A[0]) * s1);
  const w2 = (s4 - w1 * s3) / s1;

  return (
    w1 >= 0 &&
    w2 >= 0 &&
    (w1 + w2) <= 1
  );
}

// Barycentric version, afaik
function isPointInTriangle2(
  P: Vector2,
  A: Vector2,
  B: Vector2,
  C: Vector2,
) {
  const v0 = [C[0] - A[0], C[1] - A[1]];
  const v1 = [B[0] - A[0], B[1] - A[1]];
  const v2 = [P[0] - A[0], P[1] - A[1]];

  const dot00 = (v0[0] * v0[0]) + (v0[1] * v0[1]);
  const dot01 = (v0[0] * v1[0]) + (v0[1] * v1[1]);
  const dot02 = (v0[0] * v2[0]) + (v0[1] * v2[1]);
  const dot11 = (v1[0] * v1[0]) + (v1[1] * v1[1]);
  const dot12 = (v1[0] * v2[0]) + (v1[1] * v2[1]);

  const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);

  const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
  const v = (dot00 * dot12 - dot01 * dot02) * invDenom;

  return ((u >= 0) && (v >= 0) && (u + v <= 1));
}

function isPointInTriangle3(
  P: Vector2,
  A: Vector2,
  B: Vector2,
  C: Vector2,
) {
  const dunno = 1 / 2 * (-B[1] * C[0] + A[1] * (-B[0] + C[0]) + A[0] * (B[1] - C[1]) + B[0] * C[1]);
  const sign = dunno < 0 ? -1 : 1;
  const s = (A[1] * C[0] - A[0] * C[1] + (C[1] - A[1]) * P[0] + (A[0] - C[0]) * P[1]) * sign;
  const t = (A[0] * B[1] - A[1] * B[0] + (A[1] - B[1]) * P[0] + (B[0] - A[0]) * P[1]) * sign;

  return s > 0 && t > 0 && (s + t) < 2 * dunno * sign;
}

function isPointInTriangle4(
  P: Vector2,
  A: Vector2,
  B: Vector2,
  C: Vector2,
) {
  const s = (A[0] - C[0]) * (P[1] - C[1]) - (A[1] - C[1]) * (P[0] - C[0]);
  const t = (B[0] - A[0]) * (P[1] - A[1]) - (B[1] - A[1]) * (P[0] - A[0]);

  if ((s < 0) != (t < 0) && s != 0 && t != 0) {
    return false;
  }

  const d = (C[0] - B[0]) * (P[1] - B[1]) - (C[1] - B[1]) * (P[0] - B[0]);
  return d == 0 || (d < 0) == (s + t <= 0);
}

function triangleArea(
  A: Vector2,
  B: Vector2,
  C: Vector2,
): number {
  //return Math.abs((A[0] * (B[1] - C[1]) + B[0] * (C[1] - A[1]) + C[0] * (A[1] - B[1])) / 2);
  return Math.abs(
    + A[0]
    * (B[1] - C[1])
    + B[0]
    * (C[1] - A[1])
    + C[0]
    * (A[1] - B[1])
  );
}

function isPointInTriangle5(
  P: Vector2,
  A: Vector2,
  B: Vector2,
  C: Vector2,
) {
  const areaABC = triangleArea(A, B, C);
  const areaPBC = triangleArea(P, B, C);
  const areaAPC = triangleArea(A, P, C);
  const areaABP = triangleArea(A, B, P);

  const margin = 0.0001;

  return Math.abs(areaABC - (areaPBC + areaAPC + areaABP)) <= margin;
}

function drawTriangleSimpleButIneffective(
  p1: Vector2,
  p2: Vector2,
  p3: Vector2,
  color: Vector3,
) {
  const [bbMin, bbMax] = getTriangleBb(p1, p2, p3);

  for (let y = bbMin[1]; y < bbMax[1]; y++) {
    for (let x = bbMin[0]; x < bbMax[0]; x++) {
      if (isPointInTriangle5([x, y], p1, p2, p3)) {
        setPixel(x, y, color);
      }
    }
  }
}

function getTriangleBb(
  p1: Vector2,
  p2: Vector2,
  p3: Vector2,
): [Vector2, Vector2] {
  let bbMin: Vector2 = [+Infinity, +Infinity];
  let bbMax: Vector2 = [-Infinity, -Infinity];

  for (const p of [p1, p2, p3]) {
    if (p[0] < bbMin[0]) {
      bbMin[0] = p[0]
    }
    if (p[1] < bbMin[1]) {
      bbMin[1] = p[1]
    }
    if (p[0] > bbMax[0]) {
      bbMax[0] = p[0]
    }
    if (p[1] > bbMax[1]) {
      bbMax[1] = p[1]
    }
  }

  return [
    [
      Math.floor(bbMin[0]),
      Math.floor(bbMin[1]),
    ],
    [
      Math.ceil(bbMax[0]),
      Math.ceil(bbMax[1]),
    ],
  ]
}

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

function perPixelTest() {
  for (let y = 0; y < imageData.height; y++) {
    for (let x = 0; x < imageData.width; x++) {
      const r = (x + t * 5) % 256;
      const g = 0;
      const b = (y + t * 5) % 256;

      setPixel(x, y, [r, g, b], false)
    }
  }
}

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

  const offset = x * 4 + ((imageData.height - 1) - y) * imageData.width * 4;

  imageData.data[offset + 0] = color[0];
  imageData.data[offset + 1] = color[1];
  imageData.data[offset + 2] = color[2];
  imageData.data[offset + 3] = 255;
}

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
    const y = Math.round(y1 * (1 - i) + y2 * i);

    if (isSteep) {
      setPixel(y, x, color);
    } else {
      setPixel(x, y, color);
    }
  }
}

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

function drawTriangleVerbose(
  p1: Vector2,
  p2: Vector2,
  p3: Vector2,
  color: Vector3,
) {
  const [bot, mid, top] = [p1, p2, p3].sort((a, b) => a[1] - b[1]);

  const totalHeight = top[1] - bot[1];

  for (let y = bot[1]; y <= mid[1]; y++) {
    const segmentHeight = mid[1] - bot[1] + 1;

    const alpha = (y - bot[1]) / totalHeight;
    const beta = (y - bot[1]) / segmentHeight;

    let xA = Math.round(bot[0] + (top[0] - bot[0]) * alpha);
    let xB = Math.round(bot[0] + (mid[0] - bot[0]) * beta);

    if (xA > xB) {
      [xA, xB] = [xB, xA];
    }

    for (let x = xA; x <= xB; x++) {
      setPixel(x, y, color);
    }
  }

  for (let y = mid[1]; y <= top[1]; y++) {
    const segmentHeight = top[1] - mid[1] + 1;

    const alpha = (y - bot[1]) / totalHeight;
    const beta = (y - mid[1]) / segmentHeight;

    let xA = Math.round(bot[0] + (top[0] - bot[0]) * alpha);
    let xB = Math.round(mid[0] + (top[0] - mid[0]) * beta);

    if (xA > xB) {
      [xA, xB] = [xB, xA];
    }

    for (let x = xA; x <= xB; x++) {
      setPixel(x, y, color);
    }
  }
}

start();

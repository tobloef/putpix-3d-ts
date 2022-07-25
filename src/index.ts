import "./index.css";

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

const imageData = new ImageData(canvas.width, canvas.height);

const viewportSize = 1;
const projectionPlaneZ = 1;

function project(p: Vector3): Vector2 {
  const ppy = (p[1] * projectionPlaneZ) / p[2];
  const ppx = (p[0] * projectionPlaneZ) / p[2];

  const cx = (ppx * imageData.width) / viewportSize + imageData.width / 2;
  const cy = (ppy * imageData.height) / viewportSize + imageData.height / 2;

  return [cx, cy];
}

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
  var vA: Vector3 = [-2, -0.5, 5];
  var vB: Vector3 = [-2, 0.5, 5];
  var vC: Vector3 = [-1, 0.5, 5];
  var vD: Vector3 = [-1, -0.5, 5];

  var vAb: Vector3 = [-2, -0.5, 6];
  var vBb: Vector3 = [-2, 0.5, 6];
  var vCb: Vector3 = [-1, 0.5, 6];
  var vDb: Vector3 = [-1, -0.5, 6];

  var red: Vector3 = [255, 0, 0];
  var green: Vector3 = [0, 255, 0];
  var blue: Vector3 = [0, 0, 255];

  drawLine(project(vA), project(vB), blue);
  drawLine(project(vB), project(vC), blue);
  drawLine(project(vC), project(vD), blue);
  drawLine(project(vD), project(vA), blue);

  drawLine(project(vAb), project(vBb), red);
  drawLine(project(vBb), project(vCb), red);
  drawLine(project(vCb), project(vDb), red);
  drawLine(project(vDb), project(vAb), red);

  drawLine(project(vA), project(vAb), green);
  drawLine(project(vB), project(vBb), green);
  drawLine(project(vC), project(vCb), green);
  drawLine(project(vD), project(vDb), green);
}

function isPointInTriangle(
  P: Vector2,
  A: Vector2,
  B: Vector2,
  C: Vector2
): [boolean, Vector3] {
  const areaABC = triangleArea(A, B, C);
  const areaPBC = triangleArea(P, B, C);
  const areaAPC = triangleArea(A, P, C);
  const areaABP = triangleArea(A, B, P);

  const margin = 0.000001;

  const isIn = Math.abs(areaABC - (areaPBC + areaAPC + areaABP)) <= margin;

  const proportionA = areaABP / areaABC;
  const proportionB = areaAPC / areaABC;
  const proportionC = areaPBC / areaABC;

  return [isIn, [proportionA, proportionB, proportionC]];
}

function drawFilledTriangle(
  p1: Vector2,
  p2: Vector2,
  p3: Vector2,
  color1: Vector3,
  color2: Vector3 = color1,
  color3: Vector3 = color1
) {
  const [bbMin, bbMax] = getBoundingBox([p1, p2, p3]);

  for (let y = bbMin[1]; y <= bbMax[1]; y++) {
    for (let x = bbMin[0]; x <= bbMax[0]; x++) {
      const [isIn, proportions] = isPointInTriangle([x, y], p1, p2, p3);

      if (isIn) {
        let color: Vector3;

        if (color1 === color2 && color2 === color3) {
          color = color1;
        } else {
          const tempColor: Vector3 = [
            interpolate(color1[0], color2[0], proportions[1]),
            interpolate(color1[1], color2[1], proportions[1]),
            interpolate(color1[2], color2[2], proportions[1]),
          ];

          color = [
            interpolate(tempColor[0], color3[0], proportions[0]),
            interpolate(tempColor[1], color3[1], proportions[0]),
            interpolate(tempColor[2], color3[2], proportions[0]),
          ];
        }

        setPixel(x, y, color);
      }
    }
  }
}

function drawWireframeTriangle(
  p1: Vector2,
  p2: Vector2,
  p3: Vector2,
  color: Vector3
) {
  drawLine(p1, p2, color);
  drawLine(p2, p3, color);
  drawLine(p1, p3, color);
}

function getBoundingBox(vertices: Vector2[]): [Vector2, Vector2] {
  if (vertices.length === 0) {
    return [
      [0, 0],
      [0, 0],
    ];
  }

  let bbMin: Vector2 = [+Infinity, +Infinity];
  let bbMax: Vector2 = [-Infinity, -Infinity];

  for (const v of vertices) {
    if (v[0] < bbMin[0]) {
      bbMin[0] = v[0];
    }
    if (v[1] < bbMin[1]) {
      bbMin[1] = v[1];
    }
    if (v[0] > bbMax[0]) {
      bbMax[0] = v[0];
    }
    if (v[1] > bbMax[1]) {
      bbMax[1] = v[1];
    }
  }

  return [
    [Math.floor(bbMin[0]), Math.floor(bbMin[1])],
    [Math.ceil(bbMax[0]), Math.ceil(bbMax[1])],
  ];
}

function setPixel(x: number, y: number, color: Vector3) {
  if (x < 0 || y < 0 || x > imageData.width - 1 || y > imageData.height - 1) {
    return;
  }

  x = Math.round(x);
  y = Math.round(y);

  const offset = x * 4 + (imageData.height - 1 - y) * imageData.width * 4;

  imageData.data[offset + 0] = color[0];
  imageData.data[offset + 1] = color[1];
  imageData.data[offset + 2] = color[2];
  imageData.data[offset + 3] = 255;
}

function drawLine(p1: Vector2, p2: Vector2, color: Vector3) {
  let x1 = p1[0];
  let y1 = p1[1];
  let x2 = p2[0];
  let y2 = p2[1];

  const isSteep = Math.abs(x1 - x2) < Math.abs(y1 - y2);

  if (isSteep) {
    // Swap x/y
    [x1, y1] = [y1, x1];
    [x2, y2] = [y2, x2];
  }

  if (x2 < x1) {
    // Swap x/x and y/y
    [x1, x2] = [x2, x1];
    [y1, y2] = [y2, y1];
  }

  for (let x = x1; x <= x2; x++) {
    const totalWidth = x2 - x1;
    const currentWidth = x - x1;
    const proportion = currentWidth / totalWidth;

    const y = Math.round(interpolate(y1, y2, proportion));

    if (isSteep) {
      setPixel(y, x, color);
    } else {
      setPixel(x, y, color);
    }
  }
}

function interpolate(start: number, end: number, proportion: number): number {
  return start * (1 - proportion) + end * proportion;
}

function triangleArea(A: Vector2, B: Vector2, C: Vector2): number {
  return (
    Math.abs(
      A[0] * (B[1] - C[1]) + B[0] * (C[1] - A[1]) + C[0] * (A[1] - B[1])
    ) / 2
  );
}

start();

import "./index.css";

type Vector2 = [number, number];
type Vector3 = [number, number, number];

const canvas = document.querySelector("canvas")!;
const ctx = canvas.getContext("2d")!;

const rect = ctx.canvas.getBoundingClientRect();
const dpr = window.devicePixelRatio ?? 1;
const renderScale = 1 / 2;
canvas.width = Math.round(rect.width * dpr * renderScale);
canvas.height = Math.round(rect.height * dpr * renderScale);
ctx.scale(dpr, dpr);

// @ts-ignore
let t = 0;

const blackImageData = new ImageData(canvas.width, canvas.height);
const imageData = new ImageData(canvas.width, canvas.height);

const fov = 1.5;
const viewportSizeX = 1 * fov;
const viewportSizeY = (imageData.height / imageData.width) * fov;
const projectionPlaneZ = 1;

function project(p: Vector3): Vector2 {
  const ppy = (p[1] * projectionPlaneZ) / p[2];
  const ppx = (p[0] * projectionPlaneZ) / p[2];

  const cx = (ppx * imageData.width) / viewportSizeX + imageData.width / 2;
  const cy = (ppy * imageData.height) / viewportSizeY + imageData.height / 2;

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

type Tri = {
  verts: [number, number, number],
  color: Vector3
};

type Model = {
  verts: Vector3[],
  tris: Tri[]
};

type Obj = {
  translation: Vector3,
  rotation: Vector3,
  scale: Vector3,
  model: Model,
};

type Scene = Obj[];

const verts: Vector3[] = [
  [+1, +1, +1],
  [-1, +1, +1],
  [-1, -1, +1],
  [+1, -1, +1],
  [+1, +1, -1],
  [-1, +1, -1],
  [-1, -1, -1],
  [+1, -1, -1],
];

const red: Vector3 = [255, 0, 0];
const green: Vector3 = [0, 255, 0];
const blue: Vector3 = [0, 0, 255];
const yellow: Vector3 = [255, 255, 0];
const purple: Vector3 = [255, 0, 255];
const cyan: Vector3 = [0, 255, 255];

const tris: Tri[] = [
  {verts: [0, 1, 2], color: red},
  {verts: [0, 2, 3], color: red},
  {verts: [4, 0, 3], color: green},
  {verts: [4, 3, 7], color: green},
  {verts: [5, 4, 7], color: blue},
  {verts: [5, 7, 6], color: blue},
  {verts: [1, 5, 6], color: yellow},
  {verts: [1, 6, 2], color: yellow},
  {verts: [4, 5, 1], color: purple},
  {verts: [4, 1, 0], color: purple},
  {verts: [2, 6, 7], color: cyan},
  {verts: [2, 7, 3], color: cyan},
];

const cube: Model = {
  tris,
  verts,
}

function translate(verts: Vector3[], translation: Vector3): Vector3[] {
  return verts.map((v) => [
    v[0] + translation[0],
    v[1] + translation[1],
    v[2] + translation[2],
  ])
}

function scale(verts: Vector3[], scale: Vector3): Vector3[] {
  return verts.map((v) => [
    v[0] * scale[0],
    v[1] * scale[1],
    v[2] * scale[2],
  ])
}

function degToRad(deg: number): number {
  return deg * (Math.PI / 180);
}

// TODO: Use matrix math: https://stackoverflow.com/a/34052492/4688606
function rotate(verts: Vector3[], rotation: Vector3): Vector3[] {
  return verts.map((v) => {
    const cosX = Math.cos(degToRad(rotation[0]));
    const sinX = Math.sin(degToRad(rotation[0]));
    const cosY = Math.cos(degToRad(rotation[1]));
    const sinY = Math.sin(degToRad(rotation[1]));
    const cosZ = Math.cos(degToRad(rotation[2]));
    const sinZ = Math.sin(degToRad(rotation[2]));

    const x_x = cosZ * cosY;
    const x_y = cosZ * sinY * sinX - sinZ * cosX;
    const x_z = cosZ * sinY * cosX + sinZ * sinX;
    const y_x = sinZ * cosY;
    const y_y = sinZ * sinY * sinX + cosZ * cosX;
    const y_z = sinZ * sinY * cosX - cosZ * sinX;
    const z_x = -sinY;
    const z_y = cosY * sinX;
    const z_z = cosY * cosX;

    const x = v[0];
    const y = v[1];
    const z = v[2];

    return [
      v[0] = x_x * x + x_y * y + x_z * z,
      v[1] = y_x * x + y_y * y + y_z * z,
      v[2] = z_x * x + z_y * y + z_z * z,
    ];
  })
}

function render() {
  const scene: Scene = [
    {
      translation: [0.5 + Math.sin(t / 20) * 2, 2, 10],
      scale: [1, 1, 1],
      rotation: [0, t, 0],
      model: cube,
    },
    {
      translation: [-1.5, -1, 8],
      scale: [0.5, 0.5 + Math.cos(t / 20) / 5, 0.5],
      rotation: [t / 5, 0, 0],
      model: cube,
    },
  ];

  scene.forEach((obj) => {
    const original = obj.model.verts;

    const scaled = scale(original, obj.scale);
    const rotated = rotate(scaled, obj.rotation);
    const translated = translate(rotated, obj.translation);

    const projected = translated.map(project);

    obj.model.tris.forEach((t) => drawWireframeTriangle(
      projected[t.verts[0]],
      projected[t.verts[1]],
      projected[t.verts[2]],
      t.color,
    ));
  });
}

function isPointInTriangle(
  P: Vector2,
  A: Vector2,
  B: Vector2,
  C: Vector2,
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

// @ts-ignore
function drawFilledTriangle(
  p1: Vector2,
  p2: Vector2,
  p3: Vector2,
  color1: Vector3,
  color2: Vector3 = color1,
  color3: Vector3 = color1,
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

// @ts-ignore
function drawWireframeTriangle(
  p1: Vector2,
  p2: Vector2,
  p3: Vector2,
  color: Vector3,
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
      A[0] * (B[1] - C[1]) + B[0] * (C[1] - A[1]) + C[0] * (A[1] - B[1]),
    ) / 2
  );
}

start();

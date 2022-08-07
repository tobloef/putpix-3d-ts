import "./index.css";

const DRAW_WIREFRAME = false;
const DRAW_Z_BUFFER = false;
const DRAW_MESH = true;

type Vector2 = [number, number];
type Vector3 = [number, number, number];
type Matrix3x3 = [Vector3, Vector3, Vector3];

const canvas = document.querySelector("canvas")!;
const ctx = canvas.getContext("2d")!;

const rect = ctx.canvas.getBoundingClientRect();
const dpr = window.devicePixelRatio ?? 1;
const renderScale = 1 / 4;
canvas.width = Math.round(rect.width * dpr * renderScale);
canvas.height = Math.round(rect.height * dpr * renderScale);
ctx.scale(dpr, dpr);

let lastFrameTime = performance.now();

const blackImageData = new ImageData(canvas.width, canvas.height);
const imageData = new ImageData(canvas.width, canvas.height);
const blankZBuffer = new Float64Array(canvas.width * canvas.height);
const zBuffer = Float64Array.from(blankZBuffer);

const viewportSizeX = imageData.width / imageData.height;
const viewportSizeY = 1;
const projectionPlaneZ = 1;

function start() {
  update();
}

function update() {
  imageData.data.set(blackImageData.data);
  zBuffer.set(blankZBuffer);

  const newFrameTime = performance.now();
  const dt = (newFrameTime - lastFrameTime) / 1000;

  render(dt);

  ctx.putImageData(imageData, 0, 0);

  lastFrameTime = newFrameTime;

  requestAnimationFrame(update);
}

const moveSens = 0.5;
const rotateSens = 5;

const str = 0.5;
const red: Vector3 = vecMult([255, 0, 0], str );
const green: Vector3 = vecMult([0, 255, 0], str );
const blue: Vector3 = vecMult([0, 0, 255], str );
const yellow: Vector3 = vecMult([255, 255, 0], str );
const purple: Vector3 = vecMult([255, 0, 255], str );
const cyan: Vector3 = vecMult([0, 255, 255], str );
const white: Vector3 = [255, 255, 255];
// @ts-ignore
const black: Vector3 = [0, 0, 0];

const cube: Model = {
  verts: [
    [+1, +1, +1],
    [-1, +1, +1],
    [-1, -1, +1],
    [+1, -1, +1],
    [+1, +1, -1],
    [-1, +1, -1],
    [-1, -1, -1],
    [+1, -1, -1],
  ],
  tris: [
    {verts: [0, 1, 2], color: [red, red, red]},
    {verts: [0, 2, 3], color: [red, red, red]},
    {verts: [4, 0, 3], color: [green, green, green]},
    {verts: [4, 3, 7], color: [green, green, green]},
    {verts: [5, 4, 7], color: [blue, blue, blue]},
    {verts: [5, 7, 6], color: [blue, blue, blue]},
    {verts: [1, 5, 6], color: [yellow, yellow, yellow]},
    {verts: [1, 6, 2], color: [yellow, yellow, yellow]},
    {verts: [4, 5, 1], color: [purple, purple, purple]},
    {verts: [4, 1, 0], color: [purple, purple, purple]},
    {verts: [2, 6, 7], color: [cyan, cyan, cyan]},
    {verts: [2, 7, 3], color: [cyan, cyan, cyan]},
  ],
};

// @ts-ignore
const cyanTriangle: Model = {
  verts: [
    [0, 0, 0],
    [2, 0, 0],
    [10, 10, 3],
  ],
  tris: [
    { verts: [0, 1, 2], color: [green, green, green] },
  ],
};

// @ts-ignore
const yellowTriangle: Model = {
  verts: [
    [6, 10, 0],
    [8, 10, 0],
    [12, 0, 3],
  ],
  tris: [
    { verts: [0, 1, 2], color: [yellow, yellow, yellow] },
  ],
};

// @ts-ignore
const purpleTriangle: Model = {
  verts: [
    [14, 4, 0],
    [14, 2, 0],
    [-2, 0, 3],
  ],
  tris: [
    { verts: [0, 1, 2], color: [red, red, red] },
  ],
};

const scene: Scene = [
  {
    translation: [0, 0, 5],
    scale: [1, 1, 1],
    rotation: [0, 0, 0],
    model: cube,
  },
];

let cam: {
  translation: Vector3,
  rotation: Vector3,
} = {
  translation: [0, 0, 0],
  rotation: [0, 0, 0],
}

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") {
    e.preventDefault();
    const m = rotationVectorToMatrix(cam.rotation);
    const camRotated = matMultVec(m, [0, 0, moveSens]).map((x) => x[0]) as Vector3;
    cam.translation = vecAdd(cam.translation, camRotated);
  }
  if (e.key === "ArrowDown") {
    e.preventDefault();
    const m = rotationVectorToMatrix(cam.rotation);
    const camRotated = matMultVec(m, [0, 0, moveSens]).map((x) => x[0]) as Vector3;
    cam.translation = vecSub(cam.translation, camRotated);
  }
  if (e.key === "ArrowLeft") {
    e.preventDefault();
    const m = rotationVectorToMatrix(cam.rotation);
    const camRotated = matMultVec(m, [moveSens, 0, 0]).map((x) => x[0]) as Vector3;
    cam.translation = vecSub(cam.translation, camRotated);
  }
  if (e.key === "ArrowRight") {
    e.preventDefault();
    const m = rotationVectorToMatrix(cam.rotation);
    const camRotated = matMultVec(m, [moveSens, 0, 0]).map((x) => x[0]) as Vector3;
    cam.translation = vecAdd(cam.translation, camRotated);
  }
  if (e.key === "w") {
    e.preventDefault();
    cam.rotation[0] += rotateSens;
  }
  if (e.key === "s") {
    e.preventDefault();
    cam.rotation[0] -= rotateSens;
  }
  if (e.key === "a") {
    e.preventDefault();
    cam.rotation[1] -= rotateSens;
  }
  if (e.key === "d") {
    e.preventDefault();
    cam.rotation[1] += rotateSens;
  }
  if (e.key === "e") {
    e.preventDefault();
    cam.rotation[2] += rotateSens;
  }
  if (e.key === "q") {
    e.preventDefault();
    cam.rotation[2] -= rotateSens;
  }


  if (e.key === "i") {
    e.preventDefault();
    scene[0].rotation[0] += rotateSens;
  }
  if (e.key === "j") {
    e.preventDefault();
    scene[0].rotation[1] += rotateSens;
  }
  if (e.key === "k") {
    e.preventDefault();
    scene[0].rotation[0] -= rotateSens;
  }
  if (e.key === "l") {
    e.preventDefault();
    scene[0].rotation[1] -= rotateSens;
  }
})

type VertAttribute = {
  color: Vector3,
  z: number,
}

type Tri = {
  verts: [number, number, number],
  color: [Vector3, Vector3, Vector3]
};

type Model = {
  verts: Vector3[],
  tris: Tri[]
};

type Transform = {
  translation: Vector3,
  rotation: Vector3,
  scale: Vector3,
}

type Obj = Transform & {
  model: Model,
};

type Scene = Obj[];

function render(dt: number) {
  scene[0].rotation = vecAdd(scene[0].rotation, [dt * 20, dt * 20, dt * 20]);

  scene.forEach((obj) => {
    const original = obj.model.verts;

    const transformed = original.map((v) => transform(v, obj));
    const camTransformed = transformed.map(transformByCamera);

    const unprojected = camTransformed;
    const projected = unprojected.map(project);

    if (DRAW_MESH) {
      obj.model.tris.forEach((t) => {
        const pvA = projected[t.verts[0]];
        const pvB = projected[t.verts[1]];
        const pvC = projected[t.verts[2]];

        drawFilledTriangle(
          pvA,
          pvB,
          pvC,
          { z: unprojected[t.verts[0]][2], color: t.color[0]},
          { z: unprojected[t.verts[1]][2], color: t.color[1]},
          { z: unprojected[t.verts[2]][2], color: t.color[2]},
        );
      });
    }

    if (DRAW_WIREFRAME) {
      obj.model.tris.forEach((t) => {
        const p1 = projected[t.verts[0]];
        const p2 = projected[t.verts[1]];
        const p3 = projected[t.verts[2]];

        drawLine(p1, p2, white);
        drawLine(p2, p3, white);
        drawLine(p1, p3, white);
      });
    }
  });

  if (DRAW_Z_BUFFER) {
    for (let i = 0; i < zBuffer.length; i++) {
      const x = i % imageData.width;
      const y = Math.floor(i / imageData.width);
      const color = interpolate(0, 255, zBuffer[i]);

      setPixel(x, y, [color, color, color]);
    }
  }
}

function project(p: Vector3): Vector2 {
  const ppy = (p[1] * projectionPlaneZ) / p[2];
  const ppx = (p[0] * projectionPlaneZ) / p[2];

  const cx = (ppx * imageData.width) / viewportSizeX + imageData.width / 2;
  const cy = (ppy * imageData.height) / viewportSizeY + imageData.height / 2;

  return [cx, cy];
}

// @ts-ignore
function unproject(c: Vector2, z: number): Vector3 {
  const [cx, cy] = c;

  const ppx = ((cx - imageData.width / 2) * viewportSizeX) / imageData.width;
  const ppy = ((cy - imageData.height / 2) * viewportSizeY) / imageData.height;

  return [
    (ppx * z) / projectionPlaneZ,
    (ppy * z) / projectionPlaneZ,
    z,
  ];
}

function transform(v: Vector3, transform: Transform): Vector3 {
  const scaled = vecMultVec(v, transform.scale);

  const m = rotationVectorToMatrix(transform.rotation);
  const rotated = matMultVec(m, scaled).map((x) => x[0]) as Vector3;

  const translated = vecAdd(rotated, transform.translation);

  return translated;
}

function transformByCamera(v: Vector3) {
  const camTranslated = vecSub(v, cam.translation);
  const m = rotationVectorToMatrix(cam.rotation);
  const mTransposed = matTranspose(m);
  const camRotated = matMultVec(mTransposed, camTranslated).map((x) => x[0]) as Vector3;
  return camRotated;
}

function rotationVectorToMatrix(rotation: Vector3) {
  const dX: number = degToRad(rotation[0]);
  const mX: Matrix3x3 = [
    [1, 0, 0],
    [0, Math.cos(dX), -Math.sin(dX)],
    [0, Math.sin(dX), Math.cos(dX)],
  ];

  const dY: number = degToRad(rotation[1]);
  const mY: Matrix3x3 = [
    [Math.cos(dY), 0, Math.sin(dY)],
    [0, 1, 0],
    [-Math.sin(dY), 0, Math.cos(dY)],
  ];

  const dZ: number = degToRad(rotation[2]);
  const mZ: Matrix3x3 = [
    [Math.cos(dZ), -Math.sin(dZ), 0],
    [Math.sin(dZ), Math.cos(dZ), 0],
    [0, 0, 1],
  ];

  const mXYZ: Matrix3x3 = matMultMat(matMultMat(mY, mX) as Matrix3x3, mZ) as Matrix3x3;

  return mXYZ;
}

function degToRad(deg: number): number {
  return deg * (Math.PI / 180);
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

  if (areaABC === 0) {
    return [false, [0, 0, 0]];
  }

  const margin = 0.000001;

  const isIn = Math.abs(areaABC - (areaPBC + areaAPC + areaABP)) <= margin;

  const aPrime = areaPBC / areaABC;
  const bPrime = areaAPC / areaABC;
  const cPrime = areaABP / areaABC;

  return [isIn, [aPrime, bPrime, cPrime]];
}

// @ts-ignore
function drawFilledTriangle(
  p1: Vector2,
  p2: Vector2,
  p3: Vector2,
  vertAtrr1: VertAttribute,
  vertAtrr2: VertAttribute,
  vertAtrr3: VertAttribute,
) {
  const [bbMin, bbMax] = getBoundingBox([p1, p2, p3]);

  for (let y = bbMin[1]; y <= bbMax[1]; y++) {
    for (let x = bbMin[0]; x <= bbMax[0]; x++) {
      const [isIn, proportions] = isPointInTriangle([x, y], p1, p2, p3);

      if (isIn) {
        const color = getInterpolatedVertVector(
          vertAtrr1.color,
          vertAtrr2.color,
          vertAtrr3.color,
          proportions,
        );
        const z = getInterpolatedVertNumber(
          vertAtrr1.z,
          vertAtrr2.z,
          vertAtrr3.z,
          proportions,
        );

        const zFrac = 1 / z;
        const zBuffIndex = x + y * imageData.width;

        if (zFrac > zBuffer[zBuffIndex]) {
          setPixel(x, y, color);
          if (x >= 0 && y >= 0 && x < imageData.width && y < imageData.height) {
            zBuffer[zBuffIndex] = zFrac;
          }
        }
      }
    }
  }
}

// @ts-ignore
function clamp(
  x: number,
  min: number,
  max: number,
): number {
  return Math.max(Math.min(x, max), min);
}

function getInterpolatedVertNumber(
  a: number,
  b: number,
  c: number,
  proportions: Vector3,
): number {
  const clampedPropA = Math.min(proportions[0], 0.99999);
  const clampedPropB = Math.min(proportions[1], 0.99999);
  const clampedPropC = Math.min(proportions[2], 0.99999);

  return (
    clampedPropA * a +
    clampedPropB * b +
    clampedPropC * c
  ) / (
    clampedPropA +
    clampedPropB +
    clampedPropC
  );
}

function getInterpolatedVertVector(
  vecA: Vector3,
  vecB: Vector3,
  vecC: Vector3,
  proportions: Vector3,
): Vector3 {
  return [
    getInterpolatedVertNumber(vecA[0], vecB[0], vecC[0], proportions),
    getInterpolatedVertNumber(vecA[1], vecB[1], vecC[1], proportions),
    getInterpolatedVertNumber(vecA[2], vecB[2], vecC[2], proportions),
  ];
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
    const proportion = totalWidth === 0 ?
      1 :
      currentWidth / totalWidth;

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

type Vector = number[];

// @ts-ignore
function vecAdd<T extends Vector>(a: T, b: T): T {
  return a.map((x, i) => x + b[i]) as T;
}

// @ts-ignore
function vecSub<T extends Vector>(a: T, b: T): T {
  return a.map((x, i) => x - b[i]) as T;
}

// @ts-ignore
function vecMult<T extends Vector>(a: T, k: number): T {
  return a.map((x) => x * k) as T;
}

// @ts-ignore
function vecMultVec<T extends Vector>(a: T, b: T): T {
  return a.map((x, i) => x * b[i]) as T;
}

// @ts-ignore
function vecDiv<T extends Vector>(a: T, k: number): T {
  return a.map((x) => x / k) as T;
}

// @ts-ignore
function vecMag<T extends Vector>(a: T): number {
  return Math.sqrt(
    Math.pow(a[0], 2) +
    Math.pow(a[1], 2) +
    Math.pow(a[2], 2),
  );
}

// @ts-ignore
function vecNorm<T extends Vector>(a: T): T {
  const mag = vecMag(a);
  return a.map((x) => x / mag) as T;
}

// @ts-ignore
function vecDot<T extends Vector>(a: T, b: T): number {
  return a.reduce((acc, x, i) => acc + (x * b[i]), 0);
}

// @ts-ignore
function vecCross(a: Vector3, b: Vector3): Vector3 {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ]
}

type Matrix = number[][];

// @ts-ignore
function matAdd<T extends Matrix>(a: T, b: T): T {
  return a.map((y, i) => {
    return y.map((x, j) => {
      return x + b[i][j];
    });
  }) as T;
}

// @ts-ignore
function matMulNum<T extends Matrix>(a: T, k: number): T {
  return a.map((y) => {
    return y.map((x) => {
      return x * k;
    });
  }) as T;
}

// @ts-ignore
function matMultMat(a: Matrix, b: Matrix): Matrix {
  if (a[0].length !== b.length) {
    throw new Error("Invalid matrix multiplication.");
  }

  return a.map((row, i) => {
    return b[0].map((_, j) => {
      return row.reduce((acc, _, k) => {
        return acc + a[i][k] * b[k][j]
      }, 0);
    })
  })
}

// @ts-ignore
function matMultVec(m: Matrix, v: Vector): Matrix {
  return matMultMat(m, v.map((x) => [x]));
}

function matTranspose<T extends Matrix>(m: T): T {
  return m.map((r, i) => {
    return r.map((_, j) => {
      return m[j][i];
    });
  }) as T;
}

start();

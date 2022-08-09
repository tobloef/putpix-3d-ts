import {
  Matrix,
  Matrix3x3,
  Vector,
  Vector2,
  Vector3,
} from "./types";

export function interpolate(start: number, end: number, proportion: number): number {
  return start * (1 - proportion) + end * proportion;
}

export function triangleArea(A: Vector2, B: Vector2, C: Vector2): number {
  return (
    Math.abs(
      A[0] * (B[1] - C[1]) + B[0] * (C[1] - A[1]) + C[0] * (A[1] - B[1]),
    ) / 2
  );
}

export function vecAdd<T extends Vector>(a: T, b: T): T {
  return a.map((x, i) => x + b[i]) as T;
}

export function vecSub<T extends Vector>(a: T, b: T): T {
  return a.map((x, i) => x - b[i]) as T;
}

export function vecMult<T extends Vector>(a: T, k: number): T {
  return a.map((x) => x * k) as T;
}

export function vecMultVec<T extends Vector>(a: T, b: T): T {
  return a.map((x, i) => x * b[i]) as T;
}

export function vecDiv<T extends Vector>(a: T, k: number): T {
  return a.map((x) => x / k) as T;
}

export function vecMag<T extends Vector>(a: T): number {
  return Math.sqrt(
    Math.pow(a[0], 2) +
    Math.pow(a[1], 2) +
    Math.pow(a[2], 2),
  );
}

export function vecNorm<T extends Vector>(a: T): T {
  const mag = vecMag(a);
  return a.map((x) => x / mag) as T;
}

export function vecDot<T extends Vector>(a: T, b: T): number {
  return a.reduce((acc, x, i) => acc + (x * b[i]), 0);
}

export function vecCross(a: Vector3, b: Vector3): Vector3 {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ]
}

export function matAdd<T extends Matrix>(a: T, b: T): T {
  return a.map((y, i) => {
    return y.map((x, j) => {
      return x + b[i][j];
    });
  }) as T;
}

export function matMulNum<T extends Matrix>(a: T, k: number): T {
  return a.map((y) => {
    return y.map((x) => {
      return x * k;
    });
  }) as T;
}

export function matMultMat(a: Matrix, b: Matrix): Matrix {
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

export function matMultVec(m: Matrix, v: Vector): Matrix {
  return matMultMat(m, v.map((x) => [x]));
}

export function matTranspose<T extends Matrix>(m: T): T {
  return m.map((r, i) => {
    return r.map((_, j) => {
      return m[j][i];
    });
  }) as T;
}

export function rotationVectorToMatrix(rotation: Vector3) {
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

export function degToRad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function isPointInTriangle(
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

export function getBoundingBox(vertices: Vector2[]): [Vector2, Vector2] {
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

export function getInterpolatedVertVector(
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

export function getInterpolatedVertNumber(
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

export function clamp(
  x: number,
  min: number,
  max: number,
): number {
  return Math.max(Math.min(x, max), min);
}

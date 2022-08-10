import {
  Matrix3x3,
  Plane,
  Tri,
  Vector3,
} from "./types";
import {
  interpolate,
  vecAdd,
  vecDot,
  vecMult,
  vecSub,
} from "./math";

const near: Plane = {
  // Distance from origin. Negative is "behind" the normal.
  distance: -0.01,
  // Pointing forward
  normal: [0, 0, 1],
}

export function clipTris(tris: Tri[]): Tri[] | null {
  const newTris: Tri[] = [];

  tris.forEach((tri) => {
    const dists = tri.verts.map((v) => vecDot(near.normal, v) + near.distance);

    let positiveIndices: number[] = [];
    let negativeIndices: number[] = [];

    dists.forEach((d, i) => {
      if (d <= 0) {
        negativeIndices.push(i);
      } else {
        positiveIndices.push(i);
      }
    });

    if (negativeIndices.length === 0) {
      newTris.push(tri);
    } else if (negativeIndices.length === 1) {
      const [posVertIndexA, posVertIndexB] = positiveIndices;
      const [negVertIndexC] = negativeIndices;

      const A = tri.verts[posVertIndexA];
      const B = tri.verts[posVertIndexB];
      const C = tri.verts[negVertIndexC];

      const t1 = (
        (-near.distance - vecDot(near.normal, A)) /
        (vecDot(near.normal, vecSub(C, A)))
      );

      const t2 = (
        (-near.distance - vecDot(near.normal, B)) /
        (vecDot(near.normal, vecSub(C, B)))
      );

      const newA = vecAdd(A, vecMult(vecSub(C, A), t1));
      const newB = vecAdd(B, vecMult(vecSub(C, B), t2));

      const colorA = tri.colors[posVertIndexA];
      const colorB = tri.colors[posVertIndexB];
      const colorC = tri.colors[negVertIndexC];

      const newColorA: Vector3 = [
        interpolate(colorA[0], colorC[0], t1),
        interpolate(colorA[1], colorC[1], t1),
        interpolate(colorA[2], colorC[2], t1),
      ];

      const newColorB: Vector3 = [
        interpolate(colorB[0], colorC[0], t2),
        interpolate(colorB[1], colorC[1], t2),
        interpolate(colorB[2], colorC[2], t2),
      ];

      let newVerts1 = [] as unknown as Matrix3x3;
      newVerts1[posVertIndexA] = A;
      newVerts1[posVertIndexB] = B;
      newVerts1[negVertIndexC] = newA;

      let newColors1 = [] as unknown as Matrix3x3;
      newColors1[posVertIndexA] = colorA;
      newColors1[posVertIndexB] = colorB;
      newColors1[negVertIndexC] = newColorA;

      let newVerts2 = [] as unknown as Matrix3x3;
      newVerts2[posVertIndexA] = newA;
      newVerts2[posVertIndexB] = B;
      newVerts2[negVertIndexC] = newB;

      let newColors2 = [] as unknown as Matrix3x3;
      newColors2[posVertIndexA] = newColorA;
      newColors2[posVertIndexB] = colorB;
      newColors2[negVertIndexC] = newColorB;

      newTris.push({
        verts: newVerts1,
        colors: newColors1,
      });
      newTris.push({
        verts: newVerts2,
        colors: newColors2,
      });

      return;
    } else if (negativeIndices.length === 2) {
      const [posVertIndexA] = positiveIndices;
      const [negVertIndexB, negVertIndexC] = negativeIndices;

      const A = tri.verts[posVertIndexA];
      const B = tri.verts[negVertIndexB]
      const C = tri.verts[negVertIndexC]

      const t1 = (
        (-near.distance - vecDot(near.normal, A)) /
        (vecDot(near.normal, vecSub(B, A)))
      );

      const t2 = (
        (-near.distance - vecDot(near.normal, A)) /
        (vecDot(near.normal, vecSub(C, A)))
      );

      const newB = vecAdd(A, vecMult(vecSub(B, A), t1));
      const newC = vecAdd(A, vecMult(vecSub(C, A), t2));

      const colorA = tri.colors[posVertIndexA];
      const colorB = tri.colors[negVertIndexB];
      const colorC = tri.colors[negVertIndexC];

      const newColorB: Vector3 = [
        interpolate(colorA[0], colorB[0], t1),
        interpolate(colorA[1], colorB[1], t1),
        interpolate(colorA[2], colorB[2], t1),
      ];

      const newColorC: Vector3 = [
        interpolate(colorA[0], colorC[0], t2),
        interpolate(colorA[1], colorC[1], t2),
        interpolate(colorA[2], colorC[2], t2),
      ];

      let newVerts = [] as unknown as Matrix3x3;
      newVerts[posVertIndexA] = A;
      newVerts[negVertIndexB] = newB;
      newVerts[negVertIndexC] = newC;

      let newColors = [] as unknown as Matrix3x3;
      newColors[posVertIndexA] = colorA;
      newColors[negVertIndexB] = newColorB;
      newColors[negVertIndexC] = newColorC;

      newTris.push({
        verts: newVerts,
        colors: newColors,
      });

      return;
    } else if (negativeIndices.length === 3) {
      return;
    }
  });

  return newTris;
}

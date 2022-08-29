import {
  Matrix3x3,
  Plane,
  Tri,
  Vector3,
} from "./types";
import {
  calculateTriNormal,
  interpolateVector,
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

export function clipTris(tris: Tri[]): Tri[] {
  const newTris: Tri[] = [];

  tris.forEach((tri) => {
    const distances = tri.verts.map((v) => vecDot(near.normal, v) + near.distance);

    let positiveIndices: number[] = [];
    let negativeIndices: number[] = [];

    distances.forEach((d, i) => {
      if (d <= 0) {
        negativeIndices.push(i);
      } else {
        positiveIndices.push(i);
      }
    });

    if (negativeIndices.length === 0) {
      newTris.push(tri);
    } else if (negativeIndices.length === 1) {
      const [posVertIndex1, posVertIndex2] = positiveIndices;
      const [negVertIndex] = negativeIndices;

      const posVert1 = tri.verts[posVertIndex1];
      const posVert2 = tri.verts[posVertIndex2];
      const negVert = tri.verts[negVertIndex];

      const pos1Color = tri.colors[posVertIndex1];
      const pos2Color = tri.colors[posVertIndex2];
      const negColor = tri.colors[negVertIndex];

      const {
        point: newNegVert1,
        proportion: pos1AndNegProportion,
      } = planeLineSegmentIntersection(near, [posVert1, negVert]);

      const {
        point: newNegVert2,
        proportion: pos2AndNegProportion,
      } = planeLineSegmentIntersection(near, [posVert2, negVert]);

      const newNegColor1 = interpolateVector(
        pos1Color,
        negColor,
        pos1AndNegProportion
      );

      const newNegColor2 = interpolateVector(
        pos2Color,
        negColor,
        pos2AndNegProportion
      );

      let newVerts1 = [] as unknown as Matrix3x3;
      newVerts1[posVertIndex1] = posVert1;
      newVerts1[posVertIndex2] = posVert2;
      newVerts1[negVertIndex] = newNegVert1;

      let newColors1 = [] as unknown as Matrix3x3;
      newColors1[posVertIndex1] = pos1Color;
      newColors1[posVertIndex2] = pos2Color;
      newColors1[negVertIndex] = newNegColor1;

      let newVerts2 = [] as unknown as Matrix3x3;
      newVerts2[posVertIndex1] = newNegVert1;
      newVerts2[posVertIndex2] = posVert2;
      newVerts2[negVertIndex] = newNegVert2;

      let newColors2 = [] as unknown as Matrix3x3;
      newColors2[posVertIndex1] = newNegColor1;
      newColors2[posVertIndex2] = pos2Color;
      newColors2[negVertIndex] = newNegColor2;

      const normal1 = calculateTriNormal(newVerts1);
      if (normal1 != null) {
        newTris.push({
          verts: newVerts1,
          colors: newColors1,
          normal: normal1,
        });
      }

      const normal2 = calculateTriNormal(newVerts2);
      if (normal2 != null) {
        newTris.push({
          verts: newVerts2,
          colors: newColors2,
          normal: normal2,
        });
      }

      return;
    } else if (negativeIndices.length === 2) {
      const [posVertIndex] = positiveIndices;
      const [negVertIndex1, negVertIndex2] = negativeIndices;

      const posVert = tri.verts[posVertIndex];
      const negVert1 = tri.verts[negVertIndex1];
      const negVert2 = tri.verts[negVertIndex2];

      const posColor = tri.colors[posVertIndex];
      const negColor1 = tri.colors[negVertIndex1];
      const negColor2 = tri.colors[negVertIndex2];

      const {
        point: newNegVert1,
        proportion: posAndNeg1Proportion,
      } = planeLineSegmentIntersection(near, [posVert, negVert1]);

      const {
        point: newNegVert2,
        proportion: posAndNeg2Proportion,
      } = planeLineSegmentIntersection(near, [posVert, negVert2]);

      const newNegColor1 = interpolateVector(
        posColor,
        negColor1,
        posAndNeg1Proportion
      );

      const newNegColor2 = interpolateVector(
        posColor,
        negColor2,
        posAndNeg2Proportion
      );

      let newVerts = [] as unknown as Matrix3x3;
      newVerts[posVertIndex] = posVert;
      newVerts[negVertIndex1] = newNegVert1;
      newVerts[negVertIndex2] = newNegVert2;

      let newColors = [] as unknown as Matrix3x3;
      newColors[posVertIndex] = posColor;
      newColors[negVertIndex1] = newNegColor1;
      newColors[negVertIndex2] = newNegColor2;

      const normal = calculateTriNormal(newVerts)

      if (normal != null) {
        newTris.push({
          verts: newVerts,
          colors: newColors,
          normal,
        });
      }

      return;
    } else if (negativeIndices.length === 3) {
      return;
    }
  });

  return newTris;
}

function planeLineSegmentIntersection(
  plane: Plane,
  lineSegment: [Vector3, Vector3],
): { point: Vector3, proportion: number } {
  const proportion = (
    (-plane.distance - vecDot(plane.normal, lineSegment[0])) /
    (vecDot(plane.normal, vecSub(lineSegment[1], lineSegment[0])))
  );

  const point = vecAdd(lineSegment[0], vecMult(vecSub(lineSegment[1], lineSegment[0]), proportion));

  return {
    point,
    proportion,
  }
}

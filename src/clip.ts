import {
  Plane,
  Tri,
} from "./types";
import { vecDot } from "./math";

const near: Plane = {
  // Distance from origin. Negative is "behind" the normal.
  distance: -0.5,
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
      const [posVertA, posVertB] = positiveIndices;
      const [negVert] = negativeIndices;

      return;
    } else if (negativeIndices.length === 2) {
      const [posVert] = positiveIndices;
      const [negVertA, negVertB] = negativeIndices;

      return;
    } else if (negativeIndices.length === 3) {
      return;
    }
  });

  return newTris;
}

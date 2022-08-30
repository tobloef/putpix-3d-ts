import randomInt from "./randomInt";
import type {
  Tri,
  Vector3,
} from "./types";
import { Matrix3x3 } from "./types";
import { calculateTriNormal } from "./math";

export function parseObjFileToTris(objFileContents: string): Tri[] {
  const lines = objFileContents.split(/\r?\n/);

  const verts = lines
    .filter((line) => line.startsWith("v "))
    .map((line) => line.slice(2))
    .map((line) => line.split(" "))
    .map((parts) => parts.map(Number) as Vector3);

  const triVerts = lines
    .filter((line) => line.startsWith("f "))
    .map((line) => line.trim())
    .map((line) => line.split(" ").slice(1))
    .map((parts) => parts.map((p) => p.split("/")[0]))
    .map((part) => part.map(Number))
    .map((indexes) => indexes.map((i) => i - 1))
    .map((triIndex) => triIndex.map((i) => {
      const mappedVert = verts[i];

      if (mappedVert == null) {
        throw new Error(`Failed to map vertex index to vert (vert index: ${i}).`);
      }

      return mappedVert;
    }))
    .map((triVerts): Matrix3x3[] => {
      const triCount = triVerts.length - 2;
      const newTris: Matrix3x3[] = [];

      if (triCount < 1) {
        return [];
      }

      for (let i = 0; i < triCount; i++) {
        newTris.push([
          triVerts[0],
          triVerts[1 + i],
          triVerts[2 + i],
        ]);
      }

      return newTris;
    })
    .flat();

  const tris: Tri[] = triVerts.map((t) => {
    const randomColor: Vector3 = [
      randomInt(255, 255),
      randomInt(255, 255),
      randomInt(255, 255)
    ];

    const normal = calculateTriNormal(t);

    if (normal == null) {
      return null;
    }

    return ({
      verts: t,
      colors: [randomColor, randomColor, randomColor],
      normal,
    });
  }).filter((t): t is Tri => t != null);

  return tris;
}

import randomInt from "./randomInt";
import type {
  Model,
  Tri,
  Vector3,
} from "./types";
import { Matrix3x3 } from "./types";

export function parseObjFile(objFileContents: string): Model {
  const lines = objFileContents.split(/\r?\n/);

  const verts = lines
    .filter((line) => line.startsWith("v "))
    .map((line) => line.slice(2))
    .map((line) => line.split(" "))
    .map((parts) => parts.map(Number) as Vector3);

  const tris = lines
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

  const coloredTris: Tri[] = tris.map((t) => {
    const randomColor: Vector3 = [
      randomInt(255, 255),
      randomInt(255, 255),
      randomInt(255, 255)
    ];
    return ({
      verts: t,
      colors: [randomColor, randomColor, randomColor]
    });
  })

  return {
    tris: coloredTris,
  };
}

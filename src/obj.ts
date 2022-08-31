import randomInt from "./randomInt";
import type {
  Tri,
  Vector2,
  Vector3,
} from "./types";
import {
  ThreeVector2,
  ThreeVector3,
} from "./types";
import {
  calculateTriNormal,
} from "./math";
import { white } from "./colors";

const RANDOM_TRI_COLOR = false;

export function parseObjFileToTris(
  objFileContents: string,
  options?: Partial<{
    calculateOwnNormals: boolean
  }>,
): Tri[] {
  const lines = objFileContents.split(/\r?\n/);

  const vertsMap = lines
    .filter((line) => line.startsWith("v "))
    .map((line) => line.trim().split(" ").slice(1))
    .map((strings) => strings.map(Number) as Vector3);

  const normalsMap = lines
    .filter((line) => line.startsWith("vn "))
    .map((line) => line.trim().split(" ").slice(1))
    .map((strings) => strings.map(Number) as Vector3);

  const textureCoordsMap = lines
    .filter((line) => line.startsWith("vt "))
    .map((line) => line.trim().split(" ").slice(1))
    .map((strings) => strings.map(Number) as Vector2);

  const faces = lines
    .filter((line) => line.startsWith("f "))
    .map((line) => line.trim().split(" ").slice(1))
    .map((vertStrings) => vertStrings.map((str) => str.split("/")))
    .map((vertStrings) => vertStrings.map((indexStrings) => [
      indexStrings[0] !== "" ? Number(indexStrings[0]) - 1 : null,
      indexStrings[1] !== "" ? Number(indexStrings[1]) - 1 : null,
      indexStrings[2] !== "" ? Number(indexStrings[2]) - 1 : null,
    ]))
    .map((vertInfos) => {
      const vertIndexes = vertInfos.map(([vertIndex]) => vertIndex);
      const textureCoordsIndexes = vertInfos.map(([_, textureCoordsIndex]) => textureCoordsIndex);
      const normalIndexes = vertInfos.map(([_1, _2, normalIndex]) => normalIndex);

      const trisVerts = getTrisVerts(vertIndexes, vertsMap);

      const hasTextureCoords = textureCoordsIndexes.every((i) => i != null);
      const trisTextureCoords = hasTextureCoords
        ? getTrisTextureCoords(textureCoordsIndexes, textureCoordsMap)
        : undefined;

      const hasNormals = normalIndexes.every((i) => i != null);

      const trisNormals = (hasNormals && !options?.calculateOwnNormals)
        ? getTrisNormals(normalIndexes, normalsMap)
        : getCalculatedTrisNormals(trisVerts);

      return trisVerts.map((_, i) => ({
        verts: trisVerts[i],
        textureCoords: trisTextureCoords?.[i],
        normals: trisNormals[i],
      }))
    })
    .flat();

  return faces.map(({ verts, textureCoords, normals }): Tri => {
    let colors: ThreeVector3;

    if (RANDOM_TRI_COLOR) {
      const randomColor: Vector3 = [
        randomInt(255, 255),
        randomInt(255, 255),
        randomInt(255, 255),
      ];
      colors = [randomColor, randomColor, randomColor];
    } else {
      colors = [white, white, white];
    }

    return {
      verts: verts,
      textureCoords: textureCoords,
      colors,
      normals,
    }
  });
}

function getTrisVerts(
  vertIndexes: Array<number | null>,
  vertsMap: Vector3[],
): ThreeVector3[] {
  const mappedVerts = vertIndexes.map((index) => {
    if (index == null) {
      throw new Error(`Cannot map vert index of ${index} to vert.`);
    }

    const mappedVert = vertsMap[index];

    if (mappedVert == null) {
      throw new Error(`Failed to map vertex index to vert (index: ${index}).`);
    }

    return mappedVert;
  });

  const triCount = Math.max(mappedVerts.length - 2, 0);
  const triVerts: ThreeVector3[] = [];

  for (let i = 0; i < triCount; i++) {
    const newVerts: ThreeVector3 = [
      mappedVerts[0],
      mappedVerts[1 + i],
      mappedVerts[2 + i],
    ];

    triVerts.push(newVerts);
  }

  return triVerts;
}

function getTrisTextureCoords(
  textureCoordsIndexes: Array<number | null>,
  textureCoordsMap: Vector2[],
): ThreeVector2[] {
  const mappedTextureCoords = textureCoordsIndexes.map((index) => {
    if (index == null) {
      throw new Error(`Cannot map texture coordinate index of ${index} to texture coordinate.`);
    }

    const mappedTextureCoord = textureCoordsMap[index];

    if (mappedTextureCoord == null) {
      throw new Error(`Failed to map texture coordinate index to texture coordinate (index: ${index}).`);
    }

    return mappedTextureCoord;
  });

  const triCount = Math.max(mappedTextureCoords.length - 2, 0);
  const triTextureCoords: ThreeVector2[] = [];

  for (let i = 0; i < triCount; i++) {
    const newTextureCoords: ThreeVector2 = [
      mappedTextureCoords[0],
      mappedTextureCoords[1 + i],
      mappedTextureCoords[2 + i],
    ];

    triTextureCoords.push(newTextureCoords);
  }

  return triTextureCoords;
}

function getTrisNormals(
  normalsIndexes: Array<number | null>,
  normalsMap: Vector3[],
): ThreeVector3[] {
  const mappedNormals = normalsIndexes.map((index) => {
    if (index == null) {
      throw new Error(`Cannot map normal index of ${index} to normal.`);
    }

    const mappedNormal = normalsMap[index];

    if (mappedNormal == null) {
      throw new Error(`Failed to map normal index to normal (index: ${index}).`);
    }

    return mappedNormal;
  });

  const triCount = Math.max(mappedNormals.length - 2, 0);
  const triNormals: ThreeVector3[] = [];

  for (let i = 0; i < triCount; i++) {
    const newTriNormals: ThreeVector3 = [
      mappedNormals[0],
      mappedNormals[1 + i],
      mappedNormals[2 + i],
    ];

    triNormals.push(newTriNormals);
  }

  return triNormals;
}

function getCalculatedTrisNormals(
  trisVerts: ThreeVector3[]
): Array<[Vector3, Vector3, Vector3]> {
  // TODO: Handle null normal better
  return trisVerts
    .map((vert) => calculateTriNormal(vert) ?? [1, 0, 0])
    .map((normal) => [normal, normal, normal] as ThreeVector3);
}

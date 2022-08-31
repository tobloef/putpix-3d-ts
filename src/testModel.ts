import { Model } from "./types";
import { calculateTriNormal } from "./math";
import { white } from "./colors";
import {
  imageDataToBitmap,
  loadImage,
} from "./images";

export const textureTestModel: Model = {
  tris: [
    {
      verts: [
        [-1, +1, 0],
        [+1, +1, 0],
        [-1, -1, 0],
      ],
      textureCoords: [
        [0, 1],
        [1, 1],
        [0, 0],
      ],
      normals: [
        calculateTriNormal([
          [-1, +1, 0],
          [+1, +1, 0],
          [-1, -1, 0],
        ])!,
        calculateTriNormal([
          [-1, +1, 0],
          [+1, +1, 0],
          [-1, -1, 0],
        ])!,
        calculateTriNormal([
          [-1, +1, 0],
          [+1, +1, 0],
          [-1, -1, 0],
        ])!,
      ],
      colors: [white, white, white],
    },
    {
      verts: [
        [+1, +1, 0],
        [+1, -1, 0],
        [-1, -1, 0],
      ],
      textureCoords: [
        [1, 1],
        [1, 0],
        [0, 0],
      ],
      normals: [
        calculateTriNormal([
          [+1, +1, 0],
          [+1, -1, 0],
          [-1, -1, 0],
        ])!,
        calculateTriNormal([
          [+1, +1, 0],
          [+1, -1, 0],
          [-1, -1, 0],
        ])!,
        calculateTriNormal([
          [+1, +1, 0],
          [+1, -1, 0],
          [-1, -1, 0],
        ])!,
      ],
      colors: [white, white, white],
    },
  ],
  texture: imageDataToBitmap(await loadImage("./textures/crate.jpeg"))
};
import {
  Vector2,
  Vector3,
  VertAttribute,
} from "./types";
import {
  clamp,
  getProportionallyInterpolatedNumber,
  getProportionallyInterpolatedVector,
  interpolate,
  isPointInTriangle,
} from "./math";

export function drawLine(
  imageData: ImageData,
  p1: Vector2,
  p2: Vector2,
  color: Vector3,
) {
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
      setPixel(imageData, y, x, color);
    } else {
      setPixel(imageData, x, y, color);
    }
  }
}

export function setPixel(imageData: ImageData, x: number, y: number, color: Vector3) {
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

export function drawWireframeTriangle(
  imageData: ImageData,
  p1: Vector2,
  p2: Vector2,
  p3: Vector2,
  color: Vector3,
) {
  drawLine(imageData, p1, p2, color);
  drawLine(imageData, p2, p3, color);
  drawLine(imageData, p1, p3, color);
}

export function drawFilledTriangle(
  imageData: ImageData,
  zBuffer: Float64Array,
  p1: Vector2,
  p2: Vector2,
  p3: Vector2,
  vertAtrr1: VertAttribute,
  vertAtrr2: VertAttribute,
  vertAtrr3: VertAttribute,
) {
  let [bbMin, bbMax] = getBoundingBox([p1, p2, p3]);
  bbMin = [clamp(bbMin[0], 0, imageData.width), clamp(bbMin[1], 0, imageData.height)];
  bbMax = [clamp(bbMax[0], 0, imageData.width), clamp(bbMax[1], 0, imageData.height)];

  for (let y = bbMin[1]; y <= bbMax[1]; y++) {
    for (let x = bbMin[0]; x <= bbMax[0]; x++) {
      const [isIn, proportions] = isPointInTriangle([x, y], p1, p2, p3);

      if (isIn) {
        const color = getProportionallyInterpolatedVector(
          vertAtrr1.color,
          vertAtrr2.color,
          vertAtrr3.color,
          proportions,
        );
        const z = getProportionallyInterpolatedNumber(
          vertAtrr1.z,
          vertAtrr2.z,
          vertAtrr3.z,
          proportions,
        );

        const zFrac = 1 / z;
        const zBuffIndex = x + y * imageData.width;

        if (zFrac > zBuffer[zBuffIndex]) {
          setPixel(imageData, x, y, color);

          if (x >= 0 && y >= 0 && x < imageData.width && y < imageData.height) {
            zBuffer[zBuffIndex] = zFrac;
          }
        }
      }
    }
  }
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

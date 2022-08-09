import {
  Vector2,
  Vector3,
} from "./types";

export function project(imageData: ImageData, p: Vector3): Vector2 {
  const viewportSizeX = imageData.width / imageData.height;
  const viewportSizeY = 1;
  const projectionPlaneZ = 1;

  const ppy = (p[1] * projectionPlaneZ) / p[2];
  const ppx = (p[0] * projectionPlaneZ) / p[2];

  const cx = (ppx * imageData.width) / viewportSizeX + imageData.width / 2;
  const cy = (ppy * imageData.height) / viewportSizeY + imageData.height / 2;

  return [cx, cy];
}

export function unproject(
  imageData: ImageData,
  c: Vector2,
  z: number,
): Vector3 {
  const viewportSizeX = imageData.width / imageData.height;
  const viewportSizeY = 1;
  const projectionPlaneZ = 1;

  const [cx, cy] = c;

  const ppx = ((cx - imageData.width / 2) * viewportSizeX) / imageData.width;
  const ppy = ((cy - imageData.height / 2) * viewportSizeY) / imageData.height;

  return [
    (ppx * z) / projectionPlaneZ,
    (ppy * z) / projectionPlaneZ,
    z,
  ];
}

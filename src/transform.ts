import {
  Transform,
  Vector3,
} from "./types";
import {
  matMultVec,
  matTranspose,
  rotationVectorToMatrix,
  vecAdd,
  vecMultVec,
  vecSub,
} from "./math";

export function transform(v: Vector3, transform: Transform): Vector3 {
  const scaled = vecMultVec(v, transform.scale);

  const m = rotationVectorToMatrix(transform.rotation);
  const rotated = matMultVec(m, scaled).map((x) => x[0]) as Vector3;

  const translated = vecAdd(rotated, transform.translation);

  return translated;
}

export function transformByCamera(cam: Transform, v: Vector3): Vector3 {
  const camTranslated = translateByCamera(cam, v);
  const camTranslatedAndRotated = rotateByCamera(cam, camTranslated);
  return camTranslatedAndRotated;
}

export function translateByCamera(cam: Transform, v: Vector3): Vector3 {
  return vecSub(v, cam.translation);
}

export function rotateByCamera(cam: Transform, v: Vector3): Vector3 {
  const m = rotationVectorToMatrix(cam.rotation);
  const mTransposed = matTranspose(m);
  const camRotated = matMultVec(mTransposed, v).map((x) => x[0]) as Vector3;
  return camRotated;
}
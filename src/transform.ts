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
  const scaled = scale(v, transform.scale);
  const rotated = rotate(scaled, transform.rotation);
  const translated = translate(rotated, transform.translation);

  return translated;
}

export function scale(v: Vector3, scale: Vector3): Vector3 {
  return vecMultVec(v, scale);
}

export function rotate(v: Vector3, rotation: Vector3): Vector3 {
  const m = rotationVectorToMatrix(rotation);
  return matMultVec(m, v).map((x) => x[0]) as Vector3;
}

export function translate(v: Vector3, translation: Vector3): Vector3 {
  return vecAdd(v, translation);
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
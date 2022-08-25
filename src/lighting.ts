import {
  Transform,
  Vector,
  Vector3,
} from "./types";
import {
  vecDiv,
  vecMult,
  vecMultVec,
} from "./math";

export type AmbientLight = {
  type: "ambient",
  intensity: number,
  color: Vector3,
};

export type DirectionalLight = {
  type: "directional",
  intensity: number,
  color: Vector3,
  direction: Vector3,
};

export type PointLight = {
  type: "point",
  intensity: number,
  color: Vector3,
  position: number,
};

export type Light = (
  | AmbientLight
  | DirectionalLight
  | PointLight
);

export function calculateIllumination(
  point: Vector3,
  normal: Vector3,
  camera: Transform,
  lights: Light[]
): Vector3 {
  let illumination: Vector3 = [0, 0, 0];

  for (const light of lights) {
    illumination = vecDiv(vecMult(light.color, light.intensity), 255)
  }

  return illumination;
}


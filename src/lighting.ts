import {
  Transform,
  Vector3,
} from "./types";
import {
  vecAdd,
  vecDiv,
  vecDot,
  vecMult,

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
  position: Vector3,
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
  let illuminationColors: Vector3 = [0, 0, 0];

  for (const light of lights) {
    let illuminationFromLight: Vector3 = [0, 0, 0];

    switch (light.type) {
      case "ambient":
        illuminationFromLight = vecMult(light.color, light.intensity);

        break;
      case "directional":
        const percentageAtAngle = Math.max(0, -vecDot(light.direction, normal));
        const intensityAtAngle = light.intensity * percentageAtAngle;
        illuminationFromLight = vecMult(light.color, intensityAtAngle);

        break;
      case "point":
        // TODO

        break;
    }

    illuminationColors = vecAdd(illuminationColors, illuminationFromLight);
  }

  const illuminationFactors = vecDiv(illuminationColors, 255);

  return illuminationFactors;
}


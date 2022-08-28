import {
  Vector3,
} from "./types";
import {
  distance,
  vecAdd,
  vecDiv,
  vecDot,
  vecMult,
  vecNorm,
  vecSub,
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
  lights: Light[]
): Vector3 {
  let illuminationColors: Vector3 = [0, 0, 0];

  for (const light of lights) {
    let intensity: number = 0;

    if (light.type === "ambient") {
      intensity = light.intensity;

    } else if (light.type === "directional") {
      const factorAtAngle = Math.max(0, -vecDot(light.direction, normal));
      intensity = light.intensity * factorAtAngle;

    } else if (light.type === "point") {
      const dist = distance(light.position, point);
      const factorAtDistance = 1 / Math.pow(dist, 2);
      const intensityAtDistance = light.intensity * factorAtDistance;
      // Notice the easy optimization we could do here!
      // Distance includes a square root, which we then negate here
      const direction = vecNorm(vecSub(point, light.position));
      const factorAtAngle = Math.max(0, -vecDot(direction, normal));
      intensity = intensityAtDistance * factorAtAngle;
    }

    const illuminationFromLight = vecMult(light.color, intensity);
    illuminationColors = vecAdd(illuminationColors, illuminationFromLight);
  }

  const illuminationFactors = vecDiv(illuminationColors, 255);

  return illuminationFactors;
}


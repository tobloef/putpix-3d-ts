import { Vector3 } from "./types";

export const white: Vector3 = [255, 255, 255];

export function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  if (result == null) {
    throw new Error("Invalid HEX format");
  }

  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ]
}

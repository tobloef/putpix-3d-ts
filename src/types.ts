import { Light } from "./lighting";
import { Bitmap } from "./images";

export type Plane = {
  normal: Vector3;
  distance: number;
}

export type Vector = number[];
export type Vector2 = [number, number];
export type Vector3 = [number, number, number];

export type Matrix = number[][];
export type Matrix3x3 = [Vector3, Vector3, Vector3];

export type VertAttribute = {
  color: Vector3,
  z: number,
}

export type Tri = {
  verts: Matrix3x3,
  colors: Matrix3x3,
  normal: Vector3,
};

export type Model = {
  tris: Tri[],
  texture?: Bitmap,
};

export type Transform = {
  translation: Vector3,
  rotation: Vector3,
  scale: Vector3,
}

export type Obj = {
  transform: Transform,
  model: Model,
}

export type Scene = {
  objects: Obj[],
  lights: Light[],
};

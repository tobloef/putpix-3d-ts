import { Light } from "./lighting";
import { Bitmap } from "./images";

export type Plane = {
  normal: Vector3;
  distance: number;
}

export type Vector = number[];
export type Vector2 = [number, number];
export type Vector3 = [number, number, number];

export type ThreeVector3 = [Vector3, Vector3, Vector3];
export type ThreeVector2 = [Vector2, Vector2, Vector2];

export type Matrix = number[][];
export type Matrix3x3 = ThreeVector3;


export type VertAttribute = {
  color: Vector3,
  textureCoord?: Vector2,
  z: number,
}

export type Tri = {
  // TODO: Instead of 3-tuples of stuff, perhaps just one with each vertex attribute in it
  verts: ThreeVector3,
  colors: ThreeVector3,
  textureCoords?: ThreeVector2,
  normals: ThreeVector3,
};

export type Model = {
  tris: Tri[],
  texture?: Bitmap,
  unlit?: boolean,
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

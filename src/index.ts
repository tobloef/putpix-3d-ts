import "./index.css";
import type {
  Scene,
  Transform,
  Tri,
  Vector3,

} from "./types";
import { white } from "./colors";
import {
  interpolate,
  vecAdd,
  vecMult,


} from "./math";
import { setupEvents } from "./events";
import {
  drawFilledTriangle,
  drawLine,
  setPixel,
} from "./draw";
import { project } from "./projection";
import { clipTris } from "./clip";
import {
  transform,
  transformByCamera,
} from "./transform";
import monumentValley from "./models/monument_valley";
import cube from "./models/cube";
import rat from "./models/rat";

const DRAW_WIREFRAME = false;
const DRAW_Z_BUFFER = false;
const DRAW_MESH = true;

const canvas = document.querySelector("canvas")!;
const ctx = canvas.getContext("2d")!;

const rect = ctx.canvas.getBoundingClientRect();
const dpr = window.devicePixelRatio ?? 1;
const renderScale = 1 / 2;
canvas.width = Math.round(rect.width * dpr * renderScale);
canvas.height = Math.round(rect.height * dpr * renderScale);
ctx.scale(dpr, dpr);

let lastFrameTime = performance.now();

const blackImageData = new ImageData(canvas.width, canvas.height);
const imageData = new ImageData(canvas.width, canvas.height);
const blankZBuffer = new Float64Array(canvas.width * canvas.height);
const zBuffer = Float64Array.from(blankZBuffer);

function start() {
  update();
}

function update() {
  imageData.data.set(blackImageData.data);
  zBuffer.set(blankZBuffer);

  const newFrameTime = performance.now();
  const dt = (newFrameTime - lastFrameTime) / 1000;

  render(dt);

  ctx.putImageData(imageData, 0, 0);

  lastFrameTime = newFrameTime;

  requestAnimationFrame(update);
}

const moveSens = 0.5;
const rotateSens = 5;

const scene: Scene = [
  {
    transform: {
      translation: [0, 0, 0],
      scale: [1, 1, 1],
      rotation: [0, 0, 0],
    },
    model: rat,
  },
];

let cam: Transform = {
  translation: [-12, 2, 0],
  rotation: [10, 90, 0],
  scale: [1, 1, 1],
}

function render(dt: number) {
  scene[0].transform.rotation = vecAdd(scene[0].transform.rotation, vecMult([0, dt, 0], 100));

  scene.forEach((obj) => {
    const originalTris = obj.model.tris;

    const transformedTris: Tri[] = originalTris.map((t): Tri => ({
      ...t,
      verts: t.verts.map((v): Vector3 => {
        const transformed = transform(v, obj.transform);
        const camTransformed = transformByCamera(cam, transformed);
        return camTransformed;
      }) as [Vector3, Vector3, Vector3],
    }));

    const clippedTris = clipTris(transformedTris);

    if (clippedTris === null) {
      return;
    }

    const projectedTris = clippedTris.map((tri) => ({
      color: tri.color,
      unprojectedVerts: tri.verts,
      projectedVerts: tri.verts.map((v) => project(imageData, v)),
    }));

    if (DRAW_MESH) {
      projectedTris.forEach((t) => {
        drawFilledTriangle(
          imageData,
          zBuffer,
          t.projectedVerts[0],
          t.projectedVerts[1],
          t.projectedVerts[2],
          {z: t.unprojectedVerts[0][2], color: t.color[0]},
          {z: t.unprojectedVerts[1][2], color: t.color[1]},
          {z: t.unprojectedVerts[2][2], color: t.color[2]},
        );
      });
    }

    if (DRAW_WIREFRAME) {
      projectedTris.forEach((t) => {
        drawLine(imageData, t.projectedVerts[0], t.projectedVerts[1], white);
        drawLine(imageData, t.projectedVerts[1], t.projectedVerts[2], white);
        drawLine(imageData, t.projectedVerts[0], t.projectedVerts[2], white);
      });
    }
  });

  if (DRAW_Z_BUFFER) {
    for (let i = 0; i < zBuffer.length; i++) {
      const x = i % imageData.width;
      const y = Math.floor(i / imageData.width);
      const color = interpolate(0, 255, zBuffer[i] * 8);

      setPixel(imageData, x, y, [color, color, color]);
    }
  }
}

setupEvents(cam, scene, moveSens, rotateSens);
start();

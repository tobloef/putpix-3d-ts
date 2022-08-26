import "./index.css";
import type {
  Matrix3x3,
  Scene,
  Transform,
  Tri,
  Vector3,

} from "./types";
import {
  white,
} from "./colors";
import {
  calculateTriNormal,
  calculateVertsCenter,
  interpolate,
  vecAdd,
  vecClamp,
  vecMult,
  vecMultVec,
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
import { parseObjFile } from "./obj";
import loadFile from "./loadFile";
import {
  calculateIllumination,
} from "./lighting";

/*
  TODO: Represent colors as numbers from 0.0 - 1.0
  TODO: Pure Cyan/Magenta/Yellow will not grow brighter with light
 */

const DRAW_WIREFRAME = false;
const DRAW_Z_BUFFER = false;
const DRAW_MESH = true;
const VERTEX_LIGHTING = true;

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

async function start() {
  scene.objects[0].model = parseObjFile(await loadFile("./models/cube.obj"));

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

const moveSens = 0.2;
const rotateSens = 5;

const scene: Scene = {
  lights: [
    {
      type: "ambient",
      intensity: 1,
      color: white,
    }
  ],
  objects: [
    {
      transform: {
        translation: [0, 0, 0],
        scale: [1, 1, 1],
        rotation: [0, 0, 0],
      },
      model: null,
    },
  ],
};


let cam: Transform = {
  translation: [0, 4, -10],
  rotation: [20, 0, 0],
  scale: [1, 1, 1],
}

function render(dt: number) {
  scene.objects[0].transform.rotation = vecAdd(
    scene.objects[0].transform.rotation,
    vecMult([0, dt, 0], 100)
  );

  scene.objects.forEach((obj) => {
    if (obj.model === null) {
      return;
    }

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

    const illuminatedTris: Tri[] = clippedTris.map((t) => {
      if (VERTEX_LIGHTING) {
        const normal = calculateTriNormal(t.verts);

        const illuminations = t.verts.map((v) => calculateIllumination(
          v, normal, cam, scene.lights,
        ));

        return {
          ...t,
          colors: t.colors.map((c, i) => vecClamp(vecMultVec(c, illuminations[i]), 0, 255)) as Matrix3x3,
        }
      } else {
        const center = calculateVertsCenter(t.verts);
        const normal = calculateTriNormal(t.verts);

        const illumination = calculateIllumination(center, normal, cam, scene.lights);

        return {
          ...t,
          colors: t.colors.map((c) => vecClamp(vecMultVec(c, illumination), 0, 255)) as Matrix3x3,
        }
      }
    });

    const projectedTris = illuminatedTris.map((tri) => ({
      color: tri.colors,
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

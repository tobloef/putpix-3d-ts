import "./index.css";
import type {
  Matrix3x3,
  Model,
  Scene,
  Transform,
  Tri,
  Vector3,
} from "./types";
import { Obj } from "./types";
import {
  blue,
  green,
  red,
  white,
} from "./colors";
import {
  calculateTriNormal,
  calculateVertsCenter,
  interpolate,
  vecClamp,
  vecMultVec,
  vecNorm,
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
  rotateByCamera,
  transform,
  transformByCamera,
  translateByCamera,
} from "./transform";
import {
  parseObjFileToTris,
} from "./obj";
import loadFile from "./loadFile";
import {
  calculateIllumination,
  Light,
} from "./lighting";
import {
  imageDataToBitmap,
  loadImage,
} from "./images";

/*
  TODO: Represent colors as numbers from 0.0 - 1.0
  TODO: Pure Cyan/Magenta/Yellow will not grow brighter with light
  TODO: Vectors as objects
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

let scene: Scene | null;
let lightGizmo: Model;

async function start() {
  const lights: Light[] = [
    {
      type: "ambient",
      intensity: 0.1,
      color: white,
    },
    {
      type: "directional",
      intensity: 0,
      direction: vecNorm([0, 0, 1]),
      color: white,
    },
    {
      type: "point",
      intensity: 20,
      position: [0, 1, 5],
      color: red,
    },
    {
      type: "point",
      intensity: 20,
      position: [-4.33, 1, -2.5],
      color: green,
    },
    {
      type: "point",
      intensity: 20,
      position: [4.33, 1, -2.5],
      color: blue,
    },
  ];

  const textureTestModel: Model = {
    tris: [
      {
        verts: [
          [-1, +1, 0],
          [+1, +1, 0],
          [-1, -1, 0],
        ],
        textureCoords: [
          [0, 1],
          [1, 1],
          [0, 0],
        ],
        normal: calculateTriNormal([
          [-1, +1, 0],
          [+1, +1, 0],
          [-1, -1, 0],
        ])!,
        colors: [white, white, white],
      },
      {
        verts: [
          [+1, +1, 0],
          [+1, -1, 0],
          [-1, -1, 0],
        ],
        textureCoords: [
          [1, 1],
          [1, 0],
          [0, 0],
        ],
        normal: calculateTriNormal([
          [+1, +1, 0],
          [+1, -1, 0],
          [-1, -1, 0],
        ])!,
        colors: [white, white, white],
      },
    ],
    texture: imageDataToBitmap(await loadImage("./textures/crate.jpeg"))
  };

  const objects: Obj[] = [
    {
      transform: {
        translation: [0, 0, 0],
        scale: [1, 1, 1],
        rotation: [0, 0, 0],
      },
      // model: await loadModel("./models/cube.obj", "./textures/crate.jpeg"),
      model: textureTestModel,
    }
  ];

  scene = {
    lights,
    objects,
  };

  setupEvents(cam, scene, moveSens, rotateSens);

  lightGizmo = await loadModel("./models/cube.obj");

  update();
}

async function loadModel(objSrc: string, textureSrc?: string): Promise<Model> {
  return {
    tris: parseObjFileToTris(await loadFile(objSrc)),
    texture: textureSrc != null
      ? imageDataToBitmap(await loadImage(textureSrc))
      : undefined,
  }
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

let cam: Transform = {
  translation: [0, 4, -10],
  rotation: [20, 0, 0],
  scale: [1, 1, 1],
}

function render(dt: number) {
  if (scene == null) {
    return;
  }

  let objs = [...scene.objects];

  scene.lights.forEach((light) => {
    if (light.type !== "point") {
      return;
    }

    light.position = rotateByCamera(
      {
      rotation: [0, 50 * dt, 0],
      scale: [1, 1, 1],
      translation: [0, 0, 0]
      },
      light.position,
    );

    objs.push({
      model: {
        tris: lightGizmo.tris.map((t) => ({
          ...t,
          colors: [light.color, light.color, light.color]
        }))
      },
      transform: {
        translation: light.position,
        scale: [0.03, 0.03, 0.03],
        rotation: [0, 0, 0],
      }
    })
  })

  const transformedLights = scene.lights.map((light): Light => {
    switch (light.type) {
      case "ambient":
        return light;
      case "directional":
        const transformedDirection = rotateByCamera(cam, light.direction);

        return {
          ...light,
          direction: transformedDirection,
        };
      case "point":
        const transformedPosition = translateByCamera(cam, light.position);

        return {
          ...light,
          position: transformedPosition,
        }
    }
  });

  objs.forEach((obj) => {
    if (obj.model == null) {
      return;
    }

    const originalTris = obj.model.tris;

    const transformedTris: Tri[] = originalTris.map((t): Tri | null => {
      const newVerts = t.verts.map((v): Vector3 => {
        const transformed = transform(v, obj.transform);
        const camTransformed = transformByCamera(cam, transformed);
        return camTransformed;
      }) as [Vector3, Vector3, Vector3];

      const normal = calculateTriNormal(newVerts);

      if (normal === null) {
        return null;
      }

      return ({
        ...t,
        verts: newVerts,
        normal,
      });
    }).filter((t): t is Tri => t != null);

    const clippedTris = clipTris(transformedTris);

    const illuminatedTris: Tri[] = clippedTris.map((t) => {
      if (VERTEX_LIGHTING) {
        const illuminations = t.verts.map((v) => calculateIllumination(
          v, t.normal, transformedLights,
        ));

        return {
          ...t,
          colors: t.colors.map((c, i) => vecClamp(vecMultVec(c, illuminations[i]), 0, 255)) as Matrix3x3,
        }
      } else {
        const center = calculateVertsCenter(t.verts);

        if (t.normal === null) {
          return t;
        }

        const illumination = calculateIllumination(center, t.normal, transformedLights);

        return {
          ...t,
          colors: t.colors.map((c) => vecClamp(vecMultVec(c, illumination), 0, 255)) as Matrix3x3,
        }
      }
    });

    const projectedTris = illuminatedTris.map((tri) => ({
      color: tri.colors,
      textureCoords: tri.textureCoords,
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
          {z: t.unprojectedVerts[0][2], color: t.color[0], textureCoord: t.textureCoords?.[0] },
          {z: t.unprojectedVerts[1][2], color: t.color[1], textureCoord: t.textureCoords?.[1] },
          {z: t.unprojectedVerts[2][2], color: t.color[2], textureCoord: t.textureCoords?.[2] },
          obj.model.texture,
        );
      });
    }

    if (DRAW_WIREFRAME) {
      projectedTris.forEach((t) => {
        drawLine(imageData, t.projectedVerts[0], t.projectedVerts[1], t.color[0], t.color[1]);
        drawLine(imageData, t.projectedVerts[1], t.projectedVerts[2], t.color[1], t.color[2]);
        drawLine(imageData, t.projectedVerts[0], t.projectedVerts[2], t.color[0], t.color[2]);
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

start();

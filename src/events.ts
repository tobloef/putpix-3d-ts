import {
  Scene,
  Transform,
  Vector3,
} from "./types";
import {
  matMultVec,
  rotationVectorToMatrix,
  vecAdd,
  vecSub,
} from "./math";

export function setupEvents(cam: Transform, scene: Scene, moveSens: number, rotateSens: number) {
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const m = rotationVectorToMatrix(cam.rotation);
      const camRotated = matMultVec(m, [0, 0, moveSens]).map((x) => x[0]) as Vector3;
      cam.translation = vecAdd(cam.translation, camRotated);
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const m = rotationVectorToMatrix(cam.rotation);
      const camRotated = matMultVec(m, [0, 0, moveSens]).map((x) => x[0]) as Vector3;
      cam.translation = vecSub(cam.translation, camRotated);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      const m = rotationVectorToMatrix(cam.rotation);
      const camRotated = matMultVec(m, [moveSens, 0, 0]).map((x) => x[0]) as Vector3;
      cam.translation = vecSub(cam.translation, camRotated);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const m = rotationVectorToMatrix(cam.rotation);
      const camRotated = matMultVec(m, [moveSens, 0, 0]).map((x) => x[0]) as Vector3;
      cam.translation = vecAdd(cam.translation, camRotated);
    }
    if (e.key === "w") {
      e.preventDefault();
      cam.rotation[0] -= rotateSens;
    }
    if (e.key === "s") {
      e.preventDefault();
      cam.rotation[0] += rotateSens;
    }
    if (e.key === "a") {
      e.preventDefault();
      cam.rotation[1] -= rotateSens;
    }
    if (e.key === "d") {
      e.preventDefault();
      cam.rotation[1] += rotateSens;
    }
    if (e.key === "e") {
      e.preventDefault();
      cam.rotation[2] += rotateSens;
    }
    if (e.key === "q") {
      e.preventDefault();
      cam.rotation[2] -= rotateSens;
    }


    if (e.key === "i") {
      e.preventDefault();
      scene[0].transform.rotation[0] += rotateSens;
    }
    if (e.key === "j") {
      e.preventDefault();
      scene[0].transform.rotation[1] += rotateSens;
    }
    if (e.key === "k") {
      e.preventDefault();
      scene[0].transform.rotation[0] -= rotateSens;
    }
    if (e.key === "l") {
      e.preventDefault();
      scene[0].transform.rotation[1] -= rotateSens;
    }
  })
}

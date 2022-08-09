import { white } from "../colors";
import { Model } from "../types";

const cube: Model = {
  tris: [
    {
      verts: [[+1, +1, +1], [-1, +1, +1], [-1, -1, +1]],
      color: [white, white, white],
    },
    {
      verts: [[+1, +1, +1], [-1, -1, +1], [+1, -1, +1]],
      color: [white, white, white],
    },
    {
      verts: [[+1, +1, -1], [+1, +1, +1], [+1, -1, +1]],
      color: [white, white, white],
    },
    {
      verts: [[+1, +1, -1], [+1, -1, +1], [+1, -1, -1]],
      color: [white, white, white],
    },
    {
      verts: [[-1, +1, -1], [+1, +1, -1], [+1, -1, -1]],
      color: [white, white, white],
    },
    {
      verts: [[-1, +1, -1], [+1, -1, -1], [-1, -1, -1]],
      color: [white, white, white],
    },
    {
      verts: [[-1, +1, +1], [-1, +1, -1], [-1, -1, -1]],
      color: [white, white, white],
    },
    {
      verts: [[-1, +1, +1], [-1, -1, -1], [-1, -1, +1]],
      color: [white, white, white],
    },
    {
      verts: [[+1, +1, -1], [-1, +1, -1], [-1, +1, +1]],
      color: [white, white, white],
    },
    {
      verts: [[+1, +1, -1], [-1, +1, +1], [+1, +1, +1]],
      color: [white, white, white],
    },
    {
      verts: [[-1, -1, +1], [-1, -1, -1], [+1, -1, -1]],
      color: [white, white, white],
    },
    {
      verts: [[-1, -1, +1], [+1, -1, -1], [+1, -1, +1]],
      color: [white, white, white],
    },
  ],
};

export default cube;

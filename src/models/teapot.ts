import { parseObjFile } from "../obj";
import loadFile from "../loadFile";

const teapot = parseObjFile(await loadFile("./teapot.obj"));

export default teapot;

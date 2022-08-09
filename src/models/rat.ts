import { parseObjFile } from "../obj";
import loadFile from "../loadFile";

const rat = parseObjFile(await loadFile("./rat.obj"));

export default rat;

import { parseObjFile } from "../obj";
import loadFile from "../loadFile";

const vehicles = parseObjFile(await loadFile("./vehicles.obj"));

export default vehicles;

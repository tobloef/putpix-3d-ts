import { parseObjFile } from "../obj";
import loadFile from "../loadFile";

const monumentValley = parseObjFile(await loadFile("./monument_valley.obj"));

export default monumentValley;

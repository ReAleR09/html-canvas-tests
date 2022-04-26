import { Point } from "../models/Point";
import { Sphere } from "../models/Sphere";
import { Vector } from "../models/Vector";

type CanvasDimensions = [number, number, number, number];
type CanvasSize = [x: number, y: number];
type ViewPort = [h: number, v: number];

export interface RenderData {
    checkerboard: boolean, // 1 byte
    dimensions: CanvasDimensions, // TODO REWRITE WITH Int16Array, meanwhile 4*4 bytes = 16
    cameraVector: Vector, // 3*4 bytes = 12
    canvasSize: CanvasSize, // 2*4 bytes = 8
    viewPort: ViewPort, // 2*4 bytes = 8
    spheres: Array<Sphere>, // offset 45 bytes to this point
}

const FLOAT_BYTES = 4;
const INT_BYTES = 2;

// TODO shit's hecked up, apparently you can't offset an value
// see https://stackoverflow.com/questions/15417310/why-typed-array-constructors-require-offset-to-be-multiple-of-underlying-type-si
export const paramsToArrayBuffer = (data: RenderData): ArrayBuffer => {
    const arrayBufferSize = 
        // 1 isCheckerBoard + 4 int canvas dimensions + 3 float point camera pos
        1 + 4 * INT_BYTES + 3 * FLOAT_BYTES +
        data.spheres.length * Sphere.BYTE_SIZE;
    const arrayBuffer = new ArrayBuffer(arrayBufferSize);
    let OFFSET = 0;
    // write bool isCheckerboard
    const intArray = new Int8Array(arrayBuffer, OFFSET, 1);
    intArray[0] = data.checkerboard ? 1 : 0;
    OFFSET += intArray.byteLength;
    // write four 2byte ints dimensions
    
    const int16Array = new Int16Array(arrayBuffer, 1, 4);
    for(let i = 0; i < 4; i++) {
        int16Array[i] = data.dimensions[i];
    }
    OFFSET += int16Array.byteLength;

    // we will write 7 4-byte floats below
    const floatArray = new Float32Array(arrayBuffer, OFFSET, 7);
    // cameraVector
    floatArray[1] = data.cameraVector.x;
    floatArray[2] = data.cameraVector.y;
    floatArray[3] = data.cameraVector.z;
    // canvasSize
    floatArray[4] = data.canvasSize[0];
    floatArray[5] = data.canvasSize[1];
    // viewPort
    floatArray[6] = data.viewPort[0];
    floatArray[7] = data.viewPort[1];    
    OFFSET += floatArray.byteLength;

    for (let i = 0; i < data.spheres.length; i++) {
        const bytesWritten = data.spheres[i].writeToArrayBuffer(arrayBuffer, OFFSET);
        OFFSET += bytesWritten;
    }

    return arrayBuffer;
}

export const arrayBufferToParams = (arrayBuffer: ArrayBuffer): RenderData => {
    let OFFSET = 0;

    // read bool isCheckerboard
    const intArray = new Int8Array(arrayBuffer, OFFSET, 1);
    const checkerboard = (intArray[0] > 0);
    OFFSET += intArray.byteLength;

    // read four 2byte ints dimensions
    const dimensions: CanvasDimensions = new Array(4) as CanvasDimensions;
    const int16Array = new Int16Array(arrayBuffer, OFFSET, 4);
    // read 4 dimensions
    for(let i = 0; i < 4; i++) {
        dimensions[i] = int16Array[i];
    }
    OFFSET += int16Array.byteLength;

    // we will read 7 4-byte floats below
    const floatArray = new Float32Array(arrayBuffer, OFFSET, 7);
    // cameraVector
    const cameraVector = new Vector(floatArray[0], floatArray[1], floatArray[2]);
    // canvasSize
    const canvasSize: CanvasSize = [floatArray[3], floatArray[4]]
    // viewPort
    const viewPort: ViewPort = [floatArray[5], floatArray[6]];
    OFFSET += floatArray.byteLength;

    // spheres
    const bytesLeft = arrayBuffer.byteLength - OFFSET;
    const spheresCount = bytesLeft / Sphere.BYTE_SIZE;
    const spheres: Sphere[] = [];
    for (let i = 0; i < spheresCount; i++) {
        const sphere = Sphere.readFromArrayBuffer(arrayBuffer, OFFSET);
        spheres.push(sphere);
        OFFSET += Sphere.BYTE_SIZE;
    }

    return {
        dimensions,
        checkerboard,
        cameraVector,
        canvasSize,
        viewPort,
        spheres,
    };
}
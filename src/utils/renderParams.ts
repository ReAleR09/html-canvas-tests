import { Point } from "../models/Point";
import { Sphere } from "../models/Sphere";
import { Vector } from "../models/Vector";

type CanvasDimensions = [number, number, number, number];
type CanvasSize = [x: number, y: number];
type ViewPort = [h: number, v: number];

export interface RenderData {
    checkerboard: boolean, // 1 byte = 1
    dimensions: CanvasDimensions, // 4 * 2 bytes = 8
    canvasSize: CanvasSize, // 2*2 bytes = 4
    cameraVector: Vector, // 3*4 bytes = 12
    viewPort: ViewPort, // 2*4 bytes = 8
    spheres: Array<Sphere>, // 19 per Sphere
}

const FLOAT_BYTES = 4;
const INT_BYTES = 2;

// DataView is used everuwhere because see:
// https://stackoverflow.com/questions/15417310/why-typed-array-constructors-require-offset-to-be-multiple-of-underlying-type-si
export const paramsToArrayBuffer = (data: RenderData): ArrayBuffer => {
    const arrayBufferSize = 
        // 1 isCheckerBoard + 4 int canvas dimensions + 2 int canv size + 3 float point camera pos + 2 float viewport
        1 + 4 * INT_BYTES + 2 * INT_BYTES + 3 * FLOAT_BYTES + 2 * FLOAT_BYTES +
        data.spheres.length * Sphere.BYTE_SIZE;
    const arrayBuffer = new ArrayBuffer(arrayBufferSize);
    let OFFSET = 0;
    const dataView = new DataView(arrayBuffer);

    // write bool isCheckerboard
    dataView.setInt8(OFFSET, (data.checkerboard ? 1 : 0));
    OFFSET += 1;

    // write four 2byte ints dimensions and two 2byte ints canvasSize
    [...data.dimensions, ...data.canvasSize].forEach((intVal) => {
        dataView.setInt16(OFFSET, intVal);
        OFFSET += 2;
    });

    // we will write 5 4-byte floats below
    [...data.cameraVector.asArray(), ...data.viewPort].forEach((floatVal) => {
        dataView.setFloat32(OFFSET, floatVal);
        OFFSET += 4;
    });

    for (let i = 0; i < data.spheres.length; i++) {
        const sphereView = new DataView(arrayBuffer, OFFSET, Sphere.BYTE_SIZE);
        const bytesWritten = data.spheres[i].writeToDataView(sphereView);
        OFFSET += bytesWritten;
    }

    return arrayBuffer;
}

export const arrayBufferToParams = (arrayBuffer: ArrayBuffer): RenderData => {
    let OFFSET = 0;
    const dataView = new DataView(arrayBuffer);

    // read bool isCheckerboard
    const checkerboard = dataView.getInt8(OFFSET) === 1;
    OFFSET += 1;

    // read four 2byte ints dimensions 
    const dimensions: CanvasDimensions = new Array(4) as CanvasDimensions;
    for (let i = 0; i < 4; i++) {
        dimensions[i] = dataView.getInt16(OFFSET);
        OFFSET += 2;
    }

    const canvasSize: CanvasSize = [dataView.getInt16(OFFSET), dataView.getInt16(OFFSET+2)];
    OFFSET += 4;

    const floats = new Array(5).fill(0).map(() => {
        const floatVal = dataView.getFloat32(OFFSET);
        OFFSET += 4;
        return floatVal;
    });

    const cameraVector = new Vector(floats[0], floats[1], floats[2]);
    const viewPort: ViewPort = [floats[3], floats[4]];

    const spheres: Sphere[] = [];
    const leftBytes = dataView.byteLength - OFFSET;
    const spheresCount = leftBytes / Sphere.BYTE_SIZE;
    const sphereByteSize = Sphere.BYTE_SIZE;
    for (let i = 0; i < spheresCount; i++) {
        const sphereView = new DataView(arrayBuffer, OFFSET, sphereByteSize);
        const sphere = Sphere.readFromDataView(sphereView);
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
import { Point } from "../models/Point";
import { Sphere } from "../models/Sphere";

type CanvasDimensions = [number, number, number, number];

interface RenderData {
    dimensions: CanvasDimensions,
    checkerboard: boolean,
    cameraPos: Point,
    spheres: Array<Sphere>,
}

const FLOAT_BYTES = 4;

export const paramsToArrayBuffer = (data: RenderData): ArrayBuffer => {
    const arrayBufferSize = 
        // 1 isCheckerBoard + 4byte float canvas dimensions + 3 float point camera pos
        1 + 4 * FLOAT_BYTES + 3 * FLOAT_BYTES +
        data.spheres.length * Sphere.BYTE_SIZE;
    const arrayBuffer = new ArrayBuffer(arrayBufferSize);
    // write bool isCheckerboard
    const intArray = new Int8Array(arrayBuffer, 0, 1);
    intArray[0] = data.checkerboard ? 1 : 0;

    const floatArray = new Float32Array(arrayBuffer, 1, 7);
    // write 4 dimensions
    for(let i = 0; i < 4; i++) {
        floatArray[i] = data.dimensions[i];
    }
    // cameraPos
    floatArray[4] = data.cameraPos.x;
    floatArray[5] = data.cameraPos.y;
    floatArray[6] = data.cameraPos.z;

    for (let i = 0; i < data.spheres.length; i++) {
        const offset = 8 + i * Sphere.BYTE_SIZE;
        const sphereFloat32 = new Float32Array(arrayBuffer, offset, Sphere.BYTE_SIZE);
        data.spheres[i].writeToFloat32Array(sphereFloat32);
    }

    return arrayBuffer;
}

export const arrayBufferToParams = (arrayBuffer: ArrayBuffer): RenderData => {
    // read bool isCheckerboard
    const intArray = new Int8Array(arrayBuffer, 0, 1);
    const checkerboard = (intArray[0] > 0);

    const floatArray = new Float32Array(arrayBuffer, 1, 7);
    const dimensions: CanvasDimensions = new Array(4) as CanvasDimensions;
    // read 4 dimensions
    for(let i = 0; i < 4; i++) {
        dimensions[i] = floatArray[i];
    }
    // cameraPos
    const cameraPos = new Point(floatArray[4], floatArray[5], floatArray[6]);

    // spheres
    const spheresByteArr = new Float32Array(arrayBuffer, 8);
    const spheresCount = spheresByteArr.byteLength / Sphere.BYTE_SIZE;

    const spheres: Sphere[] = [];
    for (let i = 0; i < spheresCount; i++) {
        const offset = 8 + i * Sphere.BYTE_SIZE;
        const sphereFloat32 = new Float32Array(arrayBuffer, offset, Sphere.BYTE_SIZE);

        const sphere = Sphere.fromFloat32Array(sphereFloat32);
        spheres.push(sphere);
    }

    return {
        dimensions,
        checkerboard,
        cameraPos,
        spheres,
    };
}
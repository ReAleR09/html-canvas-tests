import { Color } from "../color";
import { Point } from "../models/Point";
import { Sphere } from "../models/Sphere";
import { Vector } from "../models/Vector";
import { traceRay } from "../raytracing";
import { WorkerInputMessage } from "../types/render-worker";
import { arrayBufferToParams } from "../utils/renderParams";

const centeredCoordsToViewpointVector = (
    x: number,
    y: number,
    canvasWidth: number,
    canvasHeight: number,
    viewportW: number,
    viewportH: number,
): Vector => {
    const point = new Point(
        x * viewportW / canvasWidth,
        y * viewportH / canvasHeight,
        1 // TODO clarify this
    );
    return  Vector.fromPoint(point);
}

const calcPixel = (viewpointVector: Vector, spheres: Sphere[], COs: Vector[]): Color =>  {
    return traceRay(spheres, COs, viewpointVector, 1, Infinity);
}

self.addEventListener('message', ({data: {
    buffer,
    id
}}: MessageEvent<WorkerInputMessage>) => {
    
    const {
        cameraVector,
        dimensions: [xStart, xEnd, yStart, yEnd],
        spheres,
        checkerboard,
        canvasSize,
        viewPort
    } = arrayBufferToParams(buffer);

    const COs = spheres.map((sphere) => cameraVector.sub(Vector.fromPoint(sphere.center)));
    
    const actualWidth = Math.abs(xEnd - xStart);
    const actualHeight = Math.abs(yEnd - yStart);
    const resultsArrayBuffer = new ArrayBuffer(actualWidth * actualHeight * 4); // color is RGBA, 1-byte UInt per part
    const uintArray = new Uint8ClampedArray(resultsArrayBuffer);
    let OFFSET = 0;

    for (let y = yEnd; y > yStart; y--) {
        for (let x = xStart; x < xEnd; x++) {
            const viewpointVector = centeredCoordsToViewpointVector(
                x, y,
                canvasSize[0], canvasSize[1],
                viewPort[0], viewPort[1]
            );
            const color = calcPixel(viewpointVector, spheres, COs);
            uintArray[OFFSET] = color.r;
            uintArray[OFFSET+1] = color.g;
            uintArray[OFFSET+2] = color.b;
            uintArray[OFFSET+3] = 255; // TODO alpha channel is not utilized
            OFFSET+=4;
        }
    }
    (self as unknown as Worker).postMessage({
        id,
        buffer: resultsArrayBuffer
    }, [resultsArrayBuffer]);
}, false);
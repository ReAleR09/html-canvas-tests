import { Camera } from "../models/camera";
import { Point } from "../models/Point";
import { Vector } from "../models/Vector";
import { getRotationMatrix, multiplyMatrices, multiplyMV, RotationMatrix } from "../renderers/calc/matrix";
import { traceRay } from "../renderers/calc/raytracing";
import { deserializeParams, RenderDataSerialized } from "../utils/renderParams";

const getCameraToViewportPointVector = (camVector: Vector, x: number, y: number): Vector => {
    const cameraVector = new Vector(
        x * camVector.x,
        y * camVector.y,
        1 // distance from camera to the viewport. Closer to viewport - wider the Field of View?
    );
    
    return cameraVector;
}

const prepareCameraVector = (
    camera: Camera,
    canvas: [W: number, H: number],
    viewport: [viewportW: number, viewportH: number]
): Vector => {
    const cameraRotationMx = getRotationMatrix(...camera.angles);
    let someVector = new Vector(
        viewport[0] / canvas[0],
        viewport[1] / canvas[1],
        1 // distance from camera to the viewport. Closer to viewport - wider the Field of View?
    );
    someVector = multiplyMV(cameraRotationMx, someVector);

    return someVector;
}

self.addEventListener('message', ({data}: MessageEvent<RenderDataSerialized>) => {
    
    const {
        id,
        camera,
        dimensions: [xStart, xEnd, yStart, yEnd],
        spheres,
        checkerboard,
        canvasSize,
        viewPort,
        lights
    } = deserializeParams(data);
    const cameraPos = new Point(...camera.pos);
    
    const preparedCameraVector = prepareCameraVector(camera, canvasSize, viewPort); 

    const COs = spheres.map((sphere) => cameraPos.sub(Vector.fromPoint(sphere.center)));
    
    const actualWidth = Math.abs(xEnd - xStart);
    const actualHeight = Math.abs(yEnd - yStart);
    const resultsArrayBuffer = new ArrayBuffer(actualWidth * actualHeight * 4); // color is RGBA, 1-byte UInt per part
    const uintArray = new Uint8ClampedArray(resultsArrayBuffer);
    let OFFSET = 0;

    for (let y = yEnd; y > yStart; y--) {
        for (let x = xStart; x < xEnd; x++) {
            const viewpointVector = getCameraToViewportPointVector(preparedCameraVector, x, y);
            const color = traceRay(spheres, lights, COs, viewpointVector, 1, Infinity);
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
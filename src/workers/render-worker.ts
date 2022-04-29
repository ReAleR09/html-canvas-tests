import { Camera } from "../models/camera";
import { Point } from "../models/Point";
import { Vector } from "../models/Vector";
import { getRotationMatrix, multiplyMatrices, multiplyMV, RotationMatrix } from "../renderers/calc/matrix";
import { traceRay } from "../renderers/calc/raytracing";
import { deserializeParams, RenderDataSerialized } from "../utils/renderParams";
import { useMemo } from "../utils/useMemo";

const DEFAULT_X_CAMERA_VECTOR = new Vector(1, 0, 0);
const DEFAULT_Y_CAMERA_VECTOR = new Vector(0, 1, 0);
const DEFAULT_Z_CAMERA_VECTOR = new Vector(0, 0, 1); // change 1 to something else to move viewport close or far to camera

const computeParamsOnce = (
    camera: Camera,
    canvasSizes: [W: number, H: number],
    viewportRatios: [viewportW: number, viewportH: number]
) => {
    const params = useMemo('computeParamsOnce', [camera, canvasSizes, viewportRatios], () => {
        // camera pos
        const cameraPos = new Point(...camera.pos);
        // prepare rotation matrix
        const cameraRotationMx = getRotationMatrix(...camera.angles);
        // rotate default vectors. x- and y- axis vectors will be UNIT vectors directed along viewport's x and y axis
        const xAxisViewport = multiplyMV(cameraRotationMx, DEFAULT_X_CAMERA_VECTOR);
        const yAxisViewport = multiplyMV(cameraRotationMx, DEFAULT_Y_CAMERA_VECTOR);
        // this ector is a normal to viewport
        const zAxisViewport = multiplyMV(cameraRotationMx, DEFAULT_Z_CAMERA_VECTOR);
        // zero-center of new coords in real coords
        const startPoint = new Point(...camera.pos).add(zAxisViewport);

        const xAxisCanvasToCoordsRatio = viewportRatios[0] / canvasSizes[0];
        const yAxisCanvasToCoordsRatio = viewportRatios[1] / canvasSizes[1];

        return {
            xAxisCanvasToCoordsRatio,
            yAxisCanvasToCoordsRatio,
            xAxisViewport,
            yAxisViewport,
            startPoint,
            cameraPos
        }
    });
    
    return params;
}

/**
 * 
 * @param x in viewport coords
 * @param y 
 * @param camera 
 * @param canvas - sizes of canvas
 * @param viewport - coefficents of conversion from canvas pixels into coords
 */
const cameraToViewportVector = (
    x: number, y: number,
    camera: Camera,
    canvasSizes: [W: number, H: number],
    viewportRatios: [viewportW: number, viewportH: number]
): Vector => {
    const {
        cameraPos, startPoint, xAxisCanvasToCoordsRatio,
        xAxisViewport, yAxisCanvasToCoordsRatio, yAxisViewport
    } = computeParamsOnce(camera, canvasSizes, viewportRatios);

    // find x and y coords in the viewport coord sytem
    const xView = x * xAxisCanvasToCoordsRatio;
    const yView = y * yAxisCanvasToCoordsRatio;

    // find vector from canvas coord system point to the point
    const alongXaxisView = xAxisViewport.mul(xView);
    const alongYaxisVIew = yAxisViewport.mul(yView);
    const sumOfThose = alongXaxisView.add(alongYaxisVIew);
    // and find the actual point
    const thePoint = startPoint.add(sumOfThose);

    // and camera to the point
    const theVEctor = thePoint.sub(cameraPos);
    
    return theVEctor;
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
    
    const COs = spheres.map((sphere) => cameraPos.sub(Vector.fromPoint(sphere.center)));
    
    const actualWidth = Math.abs(xEnd - xStart);
    const actualHeight = Math.abs(yEnd - yStart);
    const resultsArrayBuffer = new ArrayBuffer(actualWidth * actualHeight * 4); // color is RGBA, 1-byte UInt per part
    const uintArray = new Uint8ClampedArray(resultsArrayBuffer);
    let OFFSET = 0;

    for (let y = yEnd; y > yStart; y--) {
        for (let x = xStart; x < xEnd; x++) {
            const camToViewportPointVector = cameraToViewportVector(
                x, y,
                camera,
                canvasSize,
                viewPort
            );
            const color = traceRay(spheres, lights, COs, camToViewportPointVector, 1, Infinity);
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
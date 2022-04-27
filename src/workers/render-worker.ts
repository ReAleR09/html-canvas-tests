import { Color } from "../color";
import { Point } from "../models/Point";
import { Sphere } from "../models/Sphere";
import { Vector } from "../models/Vector";
import { traceRay } from "../raytracing";
import { arrayBufferToParams } from "../utils/renderParams";
import { RenderResults } from "../utils/renderResults";


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

self.addEventListener('message', (event: MessageEvent) => {
    
    const arrayBuffer = event.data as ArrayBuffer;

    const {
        cameraVector,
        dimensions: [xStart, xEnd, yStart, yEnd],
        spheres,
        checkerboard,
        canvasSize,
        viewPort
    } = arrayBufferToParams(arrayBuffer);

    const COs = spheres.map((sphere) => cameraVector.sub(Vector.fromPoint(sphere.center)));
    
    const renderResults = new RenderResults(xEnd - xStart, yEnd - yStart);
    for (let x = xStart; x < xEnd; x++) {
        for (let y = yStart; y < yEnd; y++) {
            const viewpointVector = centeredCoordsToViewpointVector(
                x, y,
                canvasSize[0], canvasSize[1],
                viewPort[0], viewPort[1]
            );
            const color = calcPixel(viewpointVector, spheres, COs);
            renderResults.writePixelColor(x, y, color);
        }
    }

    (self as unknown as Worker).postMessage(renderResults.arrayBuffer, [renderResults.arrayBuffer]);
}, false);
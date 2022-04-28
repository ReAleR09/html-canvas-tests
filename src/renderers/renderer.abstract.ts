import { Canvas } from "../models/canvas";
import { Color } from "../models/color";
import { LightSource } from "../models/light";
import { Sphere } from "../models/Sphere";
import { Vector } from "../models/Vector";
import { traceRay } from "./calc/raytracing";

export abstract class RendererAbstract {

    protected yStep: number;
    protected isEvenDraw = false;

    constructor(
        protected canvas: Canvas,
        protected checkerBoard = false,
    ) {
        this.yStep = this.checkerBoard ? 2 : 1;
    }

    /**
     * Inheritor is responsible for calculating all pixel data and putting
     * it to canvas'es image data
     * @param cameraVector 
     * @param spheres 
     */
    protected abstract _render(cameraVector: Vector, spheres: Sphere[], lights: LightSource[]): Promise<void>;

    protected _getYstart() {
        const dimensions = this.canvas.getCanvasDimensionsInCenteredCoords();
        return this.checkerBoard
            ? dimensions.yStart + (this.isEvenDraw ? 1 : 0)
            : dimensions.yStart;
    }

    public async render(cameraVector: Vector, spheres: Sphere[], lights: LightSource[] = []): Promise<void> {
        const promise = this._render(cameraVector, spheres, lights);
        this.isEvenDraw = !this.isEvenDraw;
        this.updateCanvas();
        return promise;
    }

    protected updateCanvas() {
        this.canvas.flushImageDataToCanvas();
    }

    protected calcPixel(x: number, y: number, spheres: Sphere[], COs: Vector[]): Color {
        const viewportVector = this.canvas.centeredCoordsToViewpointVector(x, y);
        return traceRay(spheres, [], COs, viewportVector, 1, Infinity);
    }
}
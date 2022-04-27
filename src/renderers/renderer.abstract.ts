import { Canvas } from "../canvas";
import { Color } from "../color";
import { Point } from "../models/Point";
import { Sphere } from "../models/Sphere";
import { Vector } from "../models/Vector";
import { traceRay } from "../raytracing";
import { CanvasDimensions } from "../types/CanvasDivensions";

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
    protected abstract _render(cameraVector: Vector, spheres: Sphere[]): Promise<void>;

    protected _getYstart() {
        const dimensions = this.canvas.getCanvasDimensionsInCenteredCoords();
        return this.checkerBoard
            ? dimensions.yStart + (this.isEvenDraw ? 1 : 0)
            : dimensions.yStart;
    }

    public async render(cameraVector: Vector, spheres: Sphere[]): Promise<void> {
        await this._render(cameraVector, spheres);
        this.isEvenDraw = !this.isEvenDraw;
        this.updateCanvas();
    }

    protected updateCanvas() {
        this.canvas.flushImageDataToCanvas();
    }

    protected calcPixel(x: number, y: number, spheres: Sphere[], COs: Vector[]): Color {
        const viewportVector = this.canvas.centeredCoordsToViewpointVector(x, y);
        return traceRay(spheres, COs, viewportVector, 1, Infinity);
    }
}
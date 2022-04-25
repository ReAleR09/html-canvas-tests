import { c2vp, putPixel, updateCanvas } from "../canvas";
import { Point } from "../models/Point";
import { Sphere } from "../models/Sphere";
import { Vector } from "../models/Vector";
import { traceRay } from "../raytracing";

export interface CanvasDimensions {
    xStart: number;
    xEnd: number;
    yStart: number;
    yEnd: number;
}

export abstract class RendererAbstract {

    protected yStep: number;
    protected isEvenDraw = false;

    constructor(
        protected dimensions: CanvasDimensions,
        protected checkerBoard = false
    ) {
        this.yStep = this.checkerBoard ? 2 : 1;
    }

    protected abstract _render(cameraPos: Point, spheres: Sphere[]): Promise<void>;

    protected _getYstart() {
        return this.checkerBoard
            ? this.dimensions.yStart + (this.isEvenDraw ? 1 : 0)
            : this.dimensions.yStart;
    }

    public render(cameraPos: Point, spheres: Sphere[]): void {
        this._render(cameraPos, spheres);
        this.isEvenDraw = !this.isEvenDraw;
        updateCanvas();
    }

    static calcAndPaintPixel(x: number, y: number, spheres: Sphere[], COs: Vector[]) {
        const D = c2vp(x, y);
        const viewportVector = Vector.fromPoint(D);
        const color = traceRay(spheres, COs, viewportVector, 1, Infinity);
        
        putPixel(x, y, color);
    }
}
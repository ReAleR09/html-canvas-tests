import { Camera } from "../models/camera";
import { Canvas } from "../models/canvas";
import { LightSource } from "../models/light";
import { Sphere } from "../models/Sphere";

export abstract class RendererAbstract {

    constructor(
        protected canvas: Canvas
    ) { }

    /**
     * Inheritor is responsible for calculating all pixel data and putting
     * it to canvas'es image data
     * @param cameraPos 
     * @param spheres 
     */
    protected abstract _render(camera: Camera, spheres: Sphere[], lights: LightSource[]): Promise<void>;

    public async render(camera: Camera, spheres: Sphere[], lights: LightSource[] = []): Promise<void> {
        const promise = this._render(camera, spheres, lights);
        this.updateCanvas();
        return promise;
    }

    protected updateCanvas() {
        this.canvas.flushImageDataToCanvas();
    }

}
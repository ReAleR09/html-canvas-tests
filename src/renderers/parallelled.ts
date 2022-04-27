import { Vector } from "../models/Vector";
import { Point } from "../models/Point";
import { ClassicRender } from "./classic";
import { paramsToArrayBuffer } from "../utils/renderParams";
import { Sphere } from "../models/Sphere";
import { Canvas } from "../canvas";
import { RendererAbstract } from "./renderer.abstract";

export class ParallelledRender extends RendererAbstract {

    private workers: Worker[];
    private xChunkSize: number;

    constructor(
        canvas: Canvas,
        workerPath: string,
        workersCount = 4,
        checkerBoard = false,
    ) {
        super(canvas, checkerBoard);

        const workers: Worker[] = [];
        for (let i = 0; i < workersCount; i++) {
            const worker = new Worker(workerPath);
            workers.push(worker);
        }
        this.workers = workers;

        const dimensions = canvas.getCanvasDimensionsInCenteredCoords();

        this.xChunkSize = Math.ceil((dimensions.xEnd - dimensions.xStart) / workers.length);
    }

    protected async _render(cameraVector: Vector, spheres: Sphere[]): Promise<void> {
        const workersPromise = this._prepareWorkers();

        const dimensions = this.canvas.getCanvasDimensionsInCenteredCoords();

        this.workers.forEach((worker, index) => {
            // prepare slice of dimensions for render
            const xStart = dimensions.xStart + index * this.xChunkSize;
            let xEnd = xStart + this.xChunkSize;
            if (xEnd > dimensions.xEnd) {
                xEnd = dimensions.xEnd;
            }
            const renderParamsArrayBuffer = paramsToArrayBuffer({
                dimensions: [xStart, xEnd,dimensions.yStart, dimensions.yEnd],
                checkerboard: this.checkerBoard,
                cameraVector,
                spheres,
                canvasSize: [this.canvas.width, this.canvas.height],
                viewPort: [this.canvas.viewPort[0], this.canvas.viewPort[1]]
            });

            // and send it to worker
            worker.postMessage(renderParamsArrayBuffer, [renderParamsArrayBuffer]);
        });

        const results = await workersPromise;
        console.log(results);
    }

    protected _prepareWorkers(): Promise<ArrayBuffer[]> {
        
        let eventListener;

        return new Promise<ArrayBuffer[]>((resolve) => {
            let results: ArrayBuffer[] = [];
            eventListener = (event: MessageEvent) => {
                results.push(event.data);
                if (results.length === this.workers.length) {
                    resolve(results);
                }
            }
            this.workers.forEach((worker) => {
                worker.addEventListener('message', eventListener);
            });
        }).then((results) => {
            this.workers.forEach((worker) => {
                worker.removeEventListener('message', eventListener);
            });

            return results;
        });
        
    }
    
}
import { Vector } from "../models/Vector";
import { paramsToArrayBuffer } from "../utils/renderParams";
import { Sphere } from "../models/Sphere";
import { Canvas } from "../canvas";
import { RendererAbstract } from "./renderer.abstract";
import { RenderResults } from "../utils/renderResults";

export class ParallelledRender extends RendererAbstract {

    private workers: Worker[];
    private yChunkSize: number;

    constructor(
        canvas: Canvas,
        workersCount = 4,
        checkerBoard = false,
    ) {
        super(canvas, checkerBoard);

        const workers: Worker[] = [];
        for (let i = 0; i < workersCount; i++) {
            const worker = new Worker(new URL('../workers/render-worker.ts', import.meta.url));
            workers.push(worker);
        }
        this.workers = workers;

        const dimensions = canvas.getCanvasDimensionsInCenteredCoords();

        this.yChunkSize = Math.ceil((dimensions.xEnd - dimensions.xStart) / workers.length);
    }

    protected async _render(cameraVector: Vector, spheres: Sphere[]): Promise<void> {
        const workersPromise = this._prepareWorkers();

        const dimensions = this.canvas.getCanvasDimensionsInCenteredCoords();

        this.workers.forEach((worker, index) => {
            // prepare slice of dimensions for render
            const yStart = dimensions.yStart + index * this.yChunkSize;
            let yEnd = yStart + this.yChunkSize;
            if (yEnd > dimensions.yEnd) {
                yEnd = dimensions.yEnd;
            }

            const renderParamsArrayBuffer = paramsToArrayBuffer({
                dimensions: [dimensions.xStart, dimensions.xEnd, yStart, yEnd],
                checkerboard: this.checkerBoard,
                cameraVector,
                spheres,
                canvasSize: [this.canvas.width, this.canvas.height],
                viewPort: [this.canvas.viewPort[0], this.canvas.viewPort[1]]
            });

            // and send it to worker
            worker.postMessage(renderParamsArrayBuffer, [renderParamsArrayBuffer]);
        });

        const calcData = await workersPromise;
        console.log('start' + performance.now());
        calcData.forEach((arrayBuffer) => {
            const renderResults = new RenderResults(arrayBuffer);
            for (const {x, y, color} of renderResults) {
                this.canvas.putPixelToImageData(x, y, color);
            }
        });
        console.log('end' + performance.now());
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
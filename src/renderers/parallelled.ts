import { Vector } from "../models/Vector";
import { CanvasDimensions, RendererAbstract } from "./renderer.abstract";
import { Point } from "../models/Point";
import { RenderDataUnpacked } from "../types/RenderMessageData";

export class ParallelledRender extends RendererAbstract {

    private workers: Worker[];
    private xChunkSize: number;

    constructor(
        dimensions: CanvasDimensions,
        checkerBoard = false,
        workersCount = 4,
        workerPath: string
    ) {
        super(dimensions, checkerBoard);

        const workers: Worker[] = [];
        for (let i = 0; i < workersCount; i++) {
            const worker = new Worker(workerPath);
            workers.push(worker);
        }
        this.workers = workers;

        this.xChunkSize = Math.ceil((this.dimensions.xEnd - this.dimensions.xStart) / workers.length);
    }

    protected async _render(cameraPos: Point, spheres: any): Promise<void> {
        const cameraVector = Vector.fromPoint(cameraPos);
	    const COs = spheres.map((sphere) => cameraVector.sub(Vector.fromPoint(sphere.center)));

        const workersPromise = this._prepareWorkers();

        this.workers.forEach((worker, index) => {
            let message: RenderDataUnpacked;
            // prepare 'render chunk' function for every worker
            const xStart = this.dimensions.xStart + index * this.xChunkSize;
            let xEnd = xStart + this.xChunkSize;
            if (xEnd > this.dimensions.xEnd) {
                xEnd = this.dimensions.xEnd;
            }

                for (let x = xStart; x < xEnd; x++) {
                    const yStart = this._getYstart();
                    for (let y = yStart; y < this.dimensions.yEnd; y+=this.yStep) {
                        ParallelledRender.calcAndPaintPixel(x, y, spheres, COs);
                    }
                }

            // and send it to worker
            worker.postMessage(message);
        });

        await workersPromise;
    }

    protected _prepareWorkers(): Promise<void> {
        
        let eventListener;

        return new Promise<void>((resolve) => {
            let finishedWorkers = 0;
            eventListener = () => {
                finishedWorkers++;
                if (finishedWorkers === this.workers.length) {
                    resolve();
                }
            }
            this.workers.forEach((worker) => {
                worker.addEventListener('message', eventListener);
            });
        }).then(() => {
            this.workers.forEach((worker) => {
                worker.removeEventListener('message', eventListener);
            });
        });
        
    }
    
}
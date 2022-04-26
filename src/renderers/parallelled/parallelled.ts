import { Vector } from "../../models/Vector";
import { Point } from "../../models/Point";
import { ClassicRender } from "../classic";
import { paramsToArrayBuffer } from "../../utils/renderParams";
import { Sphere } from "../../models/Sphere";
import { Canvas } from "../../canvas";

export class ParallelledRender extends ClassicRender {

    private workers: Worker[];
    private xChunkSize: number;

    constructor(
        canvas: Canvas,
        checkerBoard = false,
        workersCount = 4,
        workerPath: string
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

    public renderForWorker(cameraPos: Point, spheres: Sphere[]) {
        super._render(cameraPos, spheres);
    }


    protected async _render(cameraPos: Point, spheres: Sphere[]): Promise<void> {
        const cameraVector = Vector.fromPoint(cameraPos);
	    const COs = spheres.map((sphere) => cameraVector.sub(Vector.fromPoint(sphere.center)));

        const workersPromise = this._prepareWorkers();

        // this.workers.forEach((worker, index) => {
        //     // prepare slice of dimensions for render
        //     const xStart = this.dimensions.xStart + index * this.xChunkSize;
        //     let xEnd = xStart + this.xChunkSize;
        //     if (xEnd > this.dimensions.xEnd) {
        //         xEnd = this.dimensions.xEnd;
        //     }
        //     const renderParamsArrayBuffer = paramsToArrayBuffer({
        //         dimensions: [xStart, xEnd,this.dimensions.yStart, this.dimensions.yEnd],
        //         checkerboard: this.checkerBoard,
        //         cameraPos,
        //         spheres,
        //     });

        //     // and send it to worker
        //     worker.postMessage(null, [renderParamsArrayBuffer]);
        // });

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
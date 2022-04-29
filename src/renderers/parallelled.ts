import { Vector } from "../models/Vector";
import { Sphere } from "../models/Sphere";
import { Canvas } from "../models/canvas";
import { RendererAbstract } from "./renderer.abstract";
import { serializeParams } from "../utils/renderParams";
import { WorkerOutputMessage } from "../types/render-worker";
import { LightSource } from "../models/light";
import { Point } from "../models/Point";

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

        this.yChunkSize = Math.ceil((dimensions.yEnd - dimensions.yStart) / workers.length);
    }

    protected async _render(camera, spheres: Sphere[], lights: LightSource[]): Promise<void> {
        const workersPromise = this._prepareWorkers();

        const dimensions = this.canvas.getCanvasDimensionsInCenteredCoords();

        this.workers.forEach((worker, index) => {
            const yEnd = dimensions.yEnd - index * this.yChunkSize;
            let yStart = yEnd - this.yChunkSize;
            if (yStart < dimensions.yStart) {
                yStart = dimensions.yStart
            }

            const renderParamsArrayBuffer = serializeParams({
                id: index,
                dimensions: [dimensions.xStart, dimensions.xEnd, yStart, yEnd],
                checkerboard: this.checkerBoard,
                camera,
                spheres,
                canvasSize: [this.canvas.width, this.canvas.height],
                viewPort: [this.canvas.viewPort[0], this.canvas.viewPort[1]],
                lights,
            });

            // and send it to worker
            worker.postMessage(renderParamsArrayBuffer, []); // TODO pass as 'transferable' later
        });

        return workersPromise.then((calcData) => {
            const finalArrSize = calcData.reduce((prev: number, curr: Uint8ClampedArray) => {
                return prev + curr.byteLength;
            }, 0);
            const finalArr = new Uint8ClampedArray(finalArrSize);
            let OFFSET = 0;
            for (let i = 0; i < calcData.length; i++) {
                finalArr.set(calcData[i], OFFSET);
                OFFSET += calcData[i].byteLength;
            }
            const imageData = new ImageData(finalArr, this.canvas.width, this.canvas.height);
            this.canvas.setImageData(imageData);
        });
    }

    protected _prepareWorkers(): Promise<Uint8ClampedArray[]> {
        
        let eventListener;

        return new Promise<Uint8ClampedArray[]>((resolve) => {
            let counter = 0;
            let results: Uint8ClampedArray[] = [];
            eventListener = ({data: {buffer, id}}: MessageEvent<WorkerOutputMessage>) => {
                results[id] = new Uint8ClampedArray(buffer);
                counter++;
                if (counter === this.workers.length) {
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
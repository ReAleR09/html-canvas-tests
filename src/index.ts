import { Canvas } from "./models/canvas";
import { IS_CHECKERBOARD_ENABLED, WEB_WORKERS, FPS_MEASURE_COUNTER } from "./consts";
import { Point } from "./models/Point";
import { Vector } from "./models/Vector";
import { ClassicRender } from "./renderers/classic";
import { ParallelledRender } from "./renderers/parallelled";
import { RendererAbstract } from "./renderers/renderer.abstract";
import { KEYS_PRESSED } from "./models/input";
import { LIGHTS, SPHERES } from "./objects";
import { lightTour } from "./misc/lightTour";
import { updateCamera } from "./models/camera";

const start = async () => {
    const canvasEl = document.getElementById('canvas') as HTMLCanvasElement;
    const canvas = new Canvas(canvasEl);

    let renderer: RendererAbstract;
    if (WEB_WORKERS > 0) {
        renderer = new ParallelledRender(
            canvas,
            WEB_WORKERS,
            IS_CHECKERBOARD_ENABLED,
        );
    } else {
        renderer = new ClassicRender(canvas, IS_CHECKERBOARD_ENABLED);
    }

    let secondsPassed;
    let oldTimeStamp;
    let fpsMeasures: number[] = [];
    let fps = 0;
    const drawLoop = async (timeStamp): Promise<void> => {
        // Calculate the number of seconds passed since the last frame
        secondsPassed = (timeStamp - oldTimeStamp) / 1000;
        oldTimeStamp = timeStamp;
        
        lightTour(); // TODO remove later
        const cameraPos = updateCamera();
        const cameraVector = Vector.fromPoint(cameraPos);
        const startFrame = performance.now();
        await renderer.render(cameraVector, SPHERES, LIGHTS);
        const frameTime = performance.now() - startFrame;

        // re-calculate fps
        fpsMeasures.push(Math.round(1 / secondsPassed));
        if (fpsMeasures.length === FPS_MEASURE_COUNTER) {
            fps = Math.round(fpsMeasures.reduce((prev, curr) => prev + curr, 0) / FPS_MEASURE_COUNTER)
            fpsMeasures = [];
            console.log(`FPS: ${fps}, frame time: ${frameTime.toFixed(2)}ms`);
        }
        
        // paint fps over canvas 
        // canvasContext.fillStyle = 'white';
        // canvasContext.fillRect(0, 0, 50, 12);
        // canvasContext.font = '12px Arial';
        // canvasContext.fillStyle = 'black';
        // canvasContext.fillText("FPS: " + fps, 4, 10);
        
        window.requestAnimationFrame(drawLoop);
    }

    window.requestAnimationFrame(drawLoop);

}

start();
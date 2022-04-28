require('./utils/setImmediatePoly');
import { Canvas } from "./models/canvas";
import { IS_CHECKERBOARD_ENABLED, WEB_WORKERS, FPS_MEASURE_COUNTER } from "./consts";
import { Point } from "./models/Point";
import { Vector } from "./models/Vector";
import { ClassicRender } from "./renderers/classic";
import { ParallelledRender } from "./renderers/parallelled";
import { RendererAbstract } from "./renderers/renderer.abstract";
import { KEYS_PRESSED } from "./models/input";
import { SPHERES } from "./objects";

// left-right, up-down, close-far
const CAMERA_POS = new Point(0, 0, 0);
const updateCamera = () => {
  let [x, y, z] = [0, 0, 0];
  if (KEYS_PRESSED.KeyA) {
    x -= 0.02;
  }
  if (KEYS_PRESSED.KeyD) {
    x += 0.02;
  }
  if (KEYS_PRESSED.KeyW) {
    y += 0.02;
  }
  if (KEYS_PRESSED.KeyS) {
    y -= 0.02;
  }
  if (KEYS_PRESSED.ArrowUp) {
    z += 0.02;
  }
  if (KEYS_PRESSED.ArrowDown) {
    z -= 0.02;
  }
  CAMERA_POS.modify(x, y, z);
}



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
        
        updateCamera();
        const cameraVector = Vector.fromPoint(CAMERA_POS);
        const startFrame = performance.now();
		    await renderer.render(cameraVector, SPHERES);
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
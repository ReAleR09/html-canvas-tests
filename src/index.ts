require('./utils/setImmediatePoly');
import { Canvas } from "./canvas";
import { Color } from "./color";
import { IS_CHECKERBOARD_ENABLED, WEB_WORKERS, FPS_MEASURE_COUNTER } from "./consts";
import { Point } from "./models/Point";
import { Sphere } from "./models/Sphere";
import { Vector } from "./models/Vector";
import { ClassicRender } from "./renderers/classic";
import { ParallelledRender } from "./renderers/parallelled";
import { RendererAbstract } from "./renderers/renderer.abstract";

const spheres = [
	new Sphere(new Point(0, -1, 3), 1, new Color(255, 0, 0)),
	new Sphere(new Point(2, 0, 4), 1, new Color(0, 0, 255)),
	new Sphere(new Point(-2, 0, 4), 1, new Color(0, 255, 0)),
];

// left-right, up-down, close-far
const CAMERA_POS = new Point(0, 0, 0);
const movement = {
	x: 0,
	y: 0,
	z: 0
};
const resetMovement = () => {
	movement.x = 0;
	movement.y = 0;
	movement.z = 0;
}
const updateCamera = () => {
	CAMERA_POS.x += movement.x;
	CAMERA_POS.y += movement.y;
	CAMERA_POS.z += movement.z;
}


const start = async () => {
    const canvasEl = document.getElementById('canvas') as HTMLCanvasElement;
    const canvas = new Canvas(canvasEl);
    const canvasContext = canvasEl.getContext('2d') as CanvasRenderingContext2D;
    document.addEventListener('keydown', function (event) {
      switch(event.code) {
        case 'KeyW':
          movement.y += 0.02;
          break;
        case 'KeyS':
          movement.y -= 0.02;
          break;
        case 'KeyA':
          movement.x -= 0.02;
          break;
        case 'KeyD':
          movement.x += 0.02;
          break;
        case 'ArrowUp':
          movement.z += 0.02;
          break;
        case 'ArrowDown':
          movement.z -= 0.02;
          break;
        default:
          return;
      }
    });

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
		await renderer.render(cameraVector, spheres);
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
        

		resetMovement();
        window.requestAnimationFrame(drawLoop);
    }

    window.requestAnimationFrame(drawLoop);

}

start();
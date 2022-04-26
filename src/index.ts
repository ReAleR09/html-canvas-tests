import { Canvas } from "./canvas";
import { Color } from "./color";
import { IS_CHECKERBOARD_ENABLED, FPS_MEASURE_COUNTER, FRAME_TIME, WEB_WORKERS } from "./consts";
import { Point } from "./models/Point";
import { Sphere } from "./models/Sphere";
import { Vector } from "./models/Vector";
import { ClassicRender } from "./renderers/classic";
import { ParallelledRender } from "./renderers/parallelled/parallelled";
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


const start = () => {
    const canvasEl = document.getElementById('canvas') as HTMLCanvasElement;
    const canvas = new Canvas(canvasEl);
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
            './workers/render-worker.js',
            WEB_WORKERS,
            IS_CHECKERBOARD_ENABLED,
        );
    } else {
        renderer = new ClassicRender(canvas, IS_CHECKERBOARD_ENABLED);
    }
    

	let startPeriod = performance.now();
	let framesDrawn = 0;
	setInterval(() => {
		updateCamera();
		const startRender = performance.now();
        const cameraVector = Vector.fromPoint(CAMERA_POS);
		renderer.render(cameraVector, spheres);
		const endRender = performance.now();
		resetMovement();
		
		framesDrawn++;
		// measure and output FPS every n frames
		if (framesDrawn === FPS_MEASURE_COUNTER) {
			const now = performance.now();
			const fps = (framesDrawn / ((now - startPeriod)/1000)).toFixed(2);
			console.log(`FPS: ${fps}, LAST FRAMETIME: ${(endRender - startRender).toFixed(2)}ms`);
			// reset
			startPeriod = now;
			framesDrawn = 0;
		}
		
	}, FRAME_TIME);
}

start();
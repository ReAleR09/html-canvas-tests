const spheres = [
	{
		center: new Point(0, -1, 3),
		radius: 1,
		color: new Color(255, 0, 0)
	},
	{
		center: new Point(2, 0, 4),
		radius: 1,
		color: new Color(0, 0, 255)
	},
	{
		center: new Point(-2, 0, 4),
		radius: 1,
		color: new Color(0, 255, 0)
	}
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

const calcAndPaintPixel = (x, y, spheres, COs) => {
	const D = c2vp(x, y);
	const viewportVector = Vector.fromPoint(D);
	const color = traceRay(spheres, COs, viewportVector, 1, Infinity);
	
	putPixel(x, y, color);
}

function draw(cameraPos) {
	const xStart = -canvas.width/2;
	const xEnd = canvas.width/2;

	const yStart = -canvas.height/2;
	const yEnd = canvas.height/2;

	const cameraVector = Vector.fromPoint(cameraPos);
	const COs = spheres.map((sphere) => cameraVector.sub(Vector.fromPoint(sphere.center)));

	for (let x = xStart; x < xEnd; ++x) {
		for (let y = yStart; y < yEnd; ++y) {
			calcAndPaintPixel(x, y, spheres, COs);
		}
	}
	
	updateCanvas();
}

let isEvenDraw = true;

function checkerboardDraw(cameraPos) {
	const xStart = -canvas.width/2; // this will variate "black/white cells" on checkerboard 
	const xEnd = canvas.width/2;
	const yStartBase = -canvas.height/2;
	const yEnd = canvas.height/2;

	const cameraVector = Vector.fromPoint(cameraPos);
	const COs = spheres.map((sphere) => cameraVector.sub(Vector.fromPoint(sphere.center)));

	for (let x = xStart; x < xEnd; x++) {
		const yStart = yStartBase + (isEvenDraw ? 0 : 1);
		for (let y = yStart; y < yEnd; y+=2) {
			calcAndPaintPixel(x, y, spheres, COs);
		}
	}
	
	updateCanvas();

	isEvenDraw = !isEvenDraw;
}

function start() {
	init('canvas');
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

	const renderFrame = CHECKERBOARD_MODE ? checkerboardDraw : draw;

	let startPeriod = performance.now();
	let framesDrawn = 0;
	setInterval(() => {
		updateCamera();
		const startRender = performance.now();
		renderFrame(CAMERA_POS);
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
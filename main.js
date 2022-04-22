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

	// yay, frame update frequency is 20ms which is 50 frames per second, cinematique experience >:)
	setInterval(() => {
		const a = performance.now();

		updateCamera();
		draw(CAMERA_POS);
		resetMovement();

		console.log('FT: ' + (performance.now() - a));
	}, 20);
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
			let D = c2vp(x, y);
			const viewportVector = Vector.fromPoint(D);
			let color = traceRay(spheres, COs, viewportVector, 1, Infinity);
			putPixel(x, y, color);
		}
	}
	
	updateCanvas();
}

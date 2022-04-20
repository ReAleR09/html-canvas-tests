var canvas, imageData, ctx;

function initCanvas() {
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext ('2d');
	imageData = ctx.createImageData (canvas.width, canvas.height);
}

function updateCanvas() {
	for (let i=0; i< canvas.height; ++i) {
		putPixel(0, i, {R: 255, G: 0, B: 0});
	}
	for (let i=0; i< canvas.height; ++i) {
		putPixel(canvas.width-1, i, {R: 0, G: 255, B: 0});
	}
	for (let i=0; i< canvas.width; ++i) {
		putPixel(i, 0, {R: 0, G: 0, B: 255});
	}
	for (let i=0; i< canvas.width; ++i) {
		putPixel(i, canvas.height-1, {R: 255, G: 255, B: 0});
	}

	for (let i=0; i< canvas.width; ++i) {
		putPixel(i, i, {R: 0, G: 255, B: 255});
	}
	for (let i=0; i< canvas.width; ++i) {
		putPixel(i, canvas.width-i, {R: 255, G: 0, B: 255});
	}

	for (const x of Array(20).keys()) {
		for (const y of Array(20).keys()) {
			putPixel(x, y, {R: 128, G: 128, B: 128});
		}
	}
	
	ctx.putImageData(imageData, 0, 0);
}
var canvas, imageData, ctx;

function initCanvas(canvasId) {
	canvas = document.getElementById(canvasId);
	ctx = canvas.getContext ('2d');
	imageData = ctx.createImageData (canvas.width, canvas.height);
}

function transXY(x, y) {
	let oX = canvas.width / 2 + x
	let oY = canvas.height / 2 - y
	return {x: oX, y: oY}
}

function getPixel(x, y) {
	({x, y} = transXY(x, y));
	var index = (y * imageData.width + x) * 4;
	return {
		R: imageData.data[index+0],
		G: imageData.data[index+1],
		B: imageData.data[index+2],
		A: imageData.data[index+3]
	};
}

function putPixel(x, y, c) {
	({x, y} = transXY(x, y));
	var index = (y * imageData.width + x) * 4;
	imageData.data[index+0] = c.R;
	imageData.data[index+1] = c.G;
	imageData.data[index+2] = c.B;
	if (c.A) {
		imageData.data[index+3] = c.A;
	} else {
		imageData.data[index+3] = 255;
	}
}
// assume that imageData has already exist

var getPixel = function (x, y) {
	var index = (y * imageData.width + x) * 4;
	return {
		R: imageData.data[index+0],
		G: imageData.data[index+1],
		B: imageData.data[index+2],
		A: imageData.data[index+3]
	};
}

var putPixel = function (x, y, c) {
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
import { Color } from './color';
import { Point } from './models/Point';
import { Vector } from './models/Vector';
import { CanvasDimensions } from './types/CanvasDivensions';

export class Canvas {
    
    protected context2d: CanvasRenderingContext2D;
    protected imageData: ImageData;
    protected viewPort: [W: number, H: number];

    constructor(protected canvas: HTMLCanvasElement) {
        const context2d = canvas.getContext('2d');
        if (context2d === null) {
            throw new Error('Failed to get 2d context');
        }
        this.context2d = context2d;
        this.imageData = context2d.createImageData(canvas.width, canvas.height);
        this.viewPort = [1, 1]; // TODO support different aspect ration
    }

    /**
     * input x and y are coords with center in the "center of canvas"
     * @param x 
     * @param y 
     * @returns x and y in absolute canvas dimension (x:0, y:0 is left upper corner)
     */
    centeredToAbsoluteCoords(x: number, y: number) {
        return [(this.canvas.width / 2 + x), (this.canvas.height / 2 - y)];
    }
    
    putPixelToImageData(xOrig: number, yOrig: number, c: Color) {
        const [x, y] = this.centeredToAbsoluteCoords(xOrig, yOrig);
        const i = (y * this.imageData.width + x) * 4;
        this.imageData.data[i+0] = c.r;
        this.imageData.data[i+1] = c.g;
        this.imageData.data[i+2] = c.b;
        this.imageData.data[i+3] = 255; // alpha
    }

    getPixelFromImageData(xOrig: number, yOrig: number) {
        const [x, y] = this.centeredToAbsoluteCoords(xOrig, yOrig);
        const i = (y * this.imageData.width + x) * 4;
        return new Color(
            this.imageData.data[i+0],
            this.imageData.data[i+1],
            this.imageData.data[i+2]
        );
    }

    flushImageDataToCanvas() {
        this.context2d.putImageData(this.imageData, 0, 0);
    }

    // TODO clarify decription
    /**
     * convert absolute coords to a vector to "projected viewport" i guess??
     * @param x 
     * @param y 
     * @returns 
     */
    absoluteCoordsToViewpointVector(x: number, y: number) {
        const point = new Point(
            x * this.viewPort[0] / this.canvas.width,
            y * this.viewPort[1] / this.canvas.height,
            1 // TODO clarify this
        );
        return  Vector.fromPoint(point);
    }

    getCanvasDimensionsInCenteredCoords(): CanvasDimensions {
        return {
            xStart: -this.canvas.width/2,
            xEnd: this.canvas.width/2,
            yStart: -this.canvas.height/2,
            yEnd: this.canvas.height/2,
        };
    }
}
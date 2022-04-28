import { Color } from './color';
import { Point } from './Point';
import { Vector } from './Vector';
import { CanvasDimensions } from '../types/CanvasDivensions';

export class Canvas {
    
    protected context2d: CanvasRenderingContext2D;
    protected imageData: ImageData;
    public viewPort: [W: number, H: number]; // TODO ahhhh, public

    constructor(protected canvas: HTMLCanvasElement) {
        const context2d = canvas.getContext('2d');
        if (context2d === null) {
            throw new Error('Failed to get 2d context');
        }
        this.context2d = context2d;
        this.imageData = context2d.createImageData(canvas.width, canvas.height);
        let W = 1, H = 1;
        if (canvas.width > canvas.height) {
            W = canvas.width / canvas.height;
        } else if (canvas.width < canvas.height) {
            H = canvas.height / canvas.width;
        }
        this.viewPort = [W, H];
    }

    get width() {
        return this.canvas.width;
    }
    get height() {
        return this.canvas.height;
    }

    /**
     * input x and y are coords with center in the "center of canvas"
     * @param x 
     * @param y 
     * @returns x and y in absolute canvas dimension (x:0, y:0 is left upper corner)
     */
    centeredToCanvasCoords(x: number, y: number) {
        return [(this.canvas.width / 2 + x), (this.canvas.height / 2 - y - 1)];
    }
    
    setImageData(imageData: ImageData) {
        this.imageData = imageData;
    }
    
    putPixelToImageData(xOrig: number, yOrig: number, c: Color) {
        const [x, y] = this.centeredToCanvasCoords(xOrig, yOrig);
        const i = (y * this.imageData.width + x) * 4;
        this.imageData.data[i+0] = c.r;
        this.imageData.data[i+1] = c.g;
        this.imageData.data[i+2] = c.b;
        this.imageData.data[i+3] = 255; // alpha
    }

    getPixelFromImageData(xOrig: number, yOrig: number) {
        const [x, y] = this.centeredToCanvasCoords(xOrig, yOrig);
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
    centeredCoordsToViewpointVector(x: number, y: number): Vector {
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
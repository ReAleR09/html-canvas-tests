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
        // TODO what?
        // if (canvas.width > canvas.height) {
        //     W = canvas.width / canvas.height;
        // } else if (canvas.width < canvas.height) {
        //     H = canvas.height / canvas.width;
        // }
        this.viewPort = [W, H];
    }

    get width() {
        return this.canvas.width;
    }
    get height() {
        return this.canvas.height;
    }
    
    setImageData(imageData: ImageData) {
        this.imageData = imageData;
    }
    
    flushImageDataToCanvas() {
        this.context2d.putImageData(this.imageData, 0, 0);
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
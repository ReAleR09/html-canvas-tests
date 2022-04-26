import { Vector } from "../models/Vector";
import { RendererAbstract } from "./renderer.abstract";
import { Point } from "../models/Point";

export class ClassicRender extends RendererAbstract {
    protected async _render(cameraPos: Point, spheres: any): Promise<void> {
        const cameraVector = Vector.fromPoint(cameraPos);
	    const COs = spheres.map((sphere) => cameraVector.sub(Vector.fromPoint(sphere.center)));
        const dimensions = this.canvas.getCanvasDimensionsInCenteredCoords();

        for (let x = dimensions.xStart; x < dimensions.xEnd; x++) {
            const yStart = this._getYstart();
            for (let y = yStart; y < dimensions.yEnd; y+=this.yStep) {
                const color = this.calcPixel(x, y, spheres, COs);
                this.canvas.putPixelToImageData(x, y, color);
            }
        }
    }
    
}

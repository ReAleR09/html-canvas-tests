import { Vector } from "../models/Vector";
import { RendererAbstract } from "./renderer.abstract";
import { Point } from "../models/Point";

export class ClassicRender extends RendererAbstract {
    protected _render(cameraPos: Point, spheres: any): void {
        const cameraVector = Vector.fromPoint(cameraPos);
	    const COs = spheres.map((sphere) => cameraVector.sub(Vector.fromPoint(sphere.center)));

        for (let x = this.dimensions.xStart; x < this.dimensions.xEnd; x++) {
            const yStart = this._getYstart();
            for (let y = yStart; y < this.dimensions.yEnd; y+=this.yStep) {
                ClassicRender.calcAndPaintPixel(x, y, spheres, COs);
            }
        }
    }
    
}

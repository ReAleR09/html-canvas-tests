import { Color } from "../color"
import { Point } from "./Point"

export class Sphere {
    constructor (
        public center: Point,
        public radius: number,
        public color: Color,
    ) {}
}
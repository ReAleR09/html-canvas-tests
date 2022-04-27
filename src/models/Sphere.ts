import { Color } from "../color"
import { Point } from "./Point"

export class Sphere {

    static readonly BYTE_SIZE = Point.BYTE_SIZE + 4 + Color.BYTE_SIZE;

    constructor (
        public center: Point, // 3 4-byte floats = 12
        public radius: number, // 1 4-byte float = 4
        public color: Color, // 3 1-byte clamped int = 3
    ) {}


    writeToDataView(dataView: DataView): number {
        Sphere.checkDataView(dataView);

        let OFFSET = 0;

        this.center.asArray().forEach((floatVal) => {
            dataView.setFloat32(OFFSET, floatVal);
            OFFSET += 4;
        });

        dataView.setFloat32(OFFSET, this.radius);
        OFFSET += 4;

        this.color.asArray().forEach((intVal) => {
            dataView.setUint8(OFFSET, intVal);
            OFFSET += 1;
        });

        return OFFSET;
    }

    static readFromDataView(dataView: DataView) {
        Sphere.checkDataView(dataView);

        let OFFSET = 0;

        const center = new Point(
            dataView.getFloat32(OFFSET),
            dataView.getFloat32(OFFSET+4),
            dataView.getFloat32(OFFSET+8),
        );
        OFFSET+=12;

        const radius = dataView.getFloat32(OFFSET);
        OFFSET += 4;

        const color = new Color(
            dataView.getUint8(OFFSET),
            dataView.getUint8(OFFSET+1),
            dataView.getUint8(OFFSET+2),
        );
        OFFSET+=3;

        return new Sphere(center, radius, color);
    }

    static checkDataView(dataView: DataView): void {
        if (dataView.byteLength !== Sphere.BYTE_SIZE) {
            throw new Error(`Wrong dataView byteLength: '${dataView.byteLength}', should be '${Sphere.BYTE_SIZE}'`);
        }
    }
}
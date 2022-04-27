import { Color } from "../color";

interface RenderResult {
    x: number;
    y: number;
    color: Color;
}

export class RenderResults {
    public arrayBuffer: ArrayBuffer;
    private dataView: DataView;
    private static readonly bytesPerPixel = 2 * 2 + Color.BYTE_SIZE; // 2 * 2 is for x and y being Int16, -32768 to 32767 should be enough :D
    private OFFSET = 0;

    public constructor(arrayBuffer: ArrayBuffer);
    public constructor(width: number, height: number);
    /**
     * 
     * @param width in pixels, soooo int expected
     * @param height 
     */
    constructor(...args: [ArrayBuffer] | [number, number]) {
        if (args.length === 1) {
            this.arrayBuffer = args[0];
        } else {
            const [width, height] = args;
            // determine used bytes per pixel
            const size = width * height * RenderResults.bytesPerPixel; 
            this.arrayBuffer = new ArrayBuffer(size);
        }
        this.dataView = new DataView(this.arrayBuffer);
    }


    writePixelColor(x: number, y: number, color: Color) {
        // FIXME looks ugly idk
        this.dataView.setInt16(this.OFFSET, x);
        this.dataView.setInt16(this.OFFSET+2, y);
        this.dataView.setUint8(this.OFFSET+4, color.r);
        this.dataView.setUint8(this.OFFSET+5, color.g);
        this.dataView.setUint8(this.OFFSET+6, color.b);

        this.OFFSET+=RenderResults.bytesPerPixel;
    }

    // MAD SKILLZ HERE, woah woah ez ez
    [Symbol.iterator]() {
        return this.getIterator();
    }

    private getIterator(): Iterator<RenderResult> {
        let OFFSET = 0;
        const dataView = this.dataView;

        return {
            next() {
                const x = dataView.getInt16(OFFSET);
                const y = dataView.getInt16(OFFSET+2);

                const color = new Color(
                    dataView.getUint8(OFFSET+4),
                    dataView.getUint8(OFFSET+5),
                    dataView.getUint8(OFFSET+6),
                );
                OFFSET += RenderResults.bytesPerPixel;
                const done = OFFSET >= dataView.byteLength;
                
                return {
                    done,
                    value: { x, y, color},
                }
            }
        }
    }
}
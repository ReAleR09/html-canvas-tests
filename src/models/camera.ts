import { Keys } from "./input";

type Triplet = [x: number, y: number, z: number];

// xAxis, yAxis, zAxis
export const CAMERA_ROTATION_ANGLES: Triplet = [0, 0, 0];


export class Camera {
    constructor(
        public readonly pos: Triplet = [0, 0, 0],
        public readonly angles: Triplet = [0, 0, 0],
    ) { }

    updateCameraPosition(keys: Keys, angleDiffs: [number, number, number]) {
        let [dX, dY, dZ] = [0, 0, 0];
        if (keys.KeyA) {
        dX -= 0.02;
        }
        if (keys.KeyD) {
        dX += 0.02;
        }
        if (keys.KeyW) {
        dY += 0.02;
        }
        if (keys.KeyS) {
        dY -= 0.02;
        }
        if (keys.ArrowUp) {
        dZ += 0.02;
        }
        if (keys.ArrowDown) {
        dZ -= 0.02;
        }
        this.pos[0] += dX; this.pos[1] += dY; this.pos[2] += dZ;
        const [dXaxis, dYaxis, dZaxis] = angleDiffs;
        this.angles[0] += dXaxis; this.angles[1] += dYaxis; this.angles[2] += dZaxis;
    }

    asBuffer(): ArrayBuffer {
        const arr = Float32Array.from([...this.pos, ...this.angles]);
        return arr.buffer;
    }

    static fromBuffer(arrayBuffer: ArrayBuffer, offset = 0): Camera {
        const arr = new Float32Array(arrayBuffer);
        const pos = [arr[0], arr[1], arr[2]] as Triplet;
        const angles = [arr[3], arr[4], arr[5]] as Triplet;
        return new Camera(pos, angles);
    }

}
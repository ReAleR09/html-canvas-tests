import { Triplet } from "../types/tuples";
import { CAMERA_ROTATION_SPEED } from "../utils/const";
import { Vector } from "./Vector";

// -------KEYBOARD
export interface Keys {
    'KeyW': boolean;
    'KeyS': boolean;
    'KeyA': boolean;
    'KeyD': boolean;
}

export const KEYS_PRESSED: Keys = {
    'KeyW': false,
    'KeyS': false,
    'KeyA': false,
    'KeyD': false,
};

const setKey = (keyCode: string, isDown: boolean) => {
    if (KEYS_PRESSED.hasOwnProperty(keyCode)) {
        KEYS_PRESSED[keyCode] = isDown;
    }
};

document.addEventListener('keydown', function (event) {
    setKey(event.code, true);
    event.stopPropagation();
});

document.addEventListener('keyup', function (event) {
    setKey(event.code, false);
    event.stopPropagation();
});


const LAST_MOUSE_POS = [0, 0, 0];
const SUM_MOUSE_MOVE_DIFF = [0, 0, 0];
let IS_LMB_DOWN = false;
let IS_RMB_DOWN = false;
let IS_MMB_DOWN = false;
const DIRECTION_FLAGS = new Vector(0, 0, 0);

// TODO distinguish RBM and rotate on zAxis
export const attachMouseListenerToCanvas = (canvasEl: HTMLCanvasElement) => {
    canvasEl.addEventListener("mousedown", (e) => {
        e.preventDefault();
        e.stopPropagation();
        switch(e.button) {
            case 0:
                IS_LMB_DOWN = true;
                LAST_MOUSE_POS[0] = e.clientX;
                LAST_MOUSE_POS[1] = e.clientY;
                break;
            case 1:
                IS_MMB_DOWN = true;
                DIRECTION_FLAGS.y = 0;
                break;
            case 2:
                IS_RMB_DOWN = true;
                LAST_MOUSE_POS[2] = e.clientX;
                break;
        }
    });
    canvasEl.addEventListener("mouseup", (e) => {
        e.preventDefault();
        e.stopPropagation();
        IS_LMB_DOWN = IS_RMB_DOWN = IS_MMB_DOWN = false;
        DIRECTION_FLAGS.y = 0;
    });
    canvasEl.addEventListener("mousemove", (e) => {
        if(IS_LMB_DOWN) {
            const yDiff = e.clientX - LAST_MOUSE_POS[0];
            const xDiff = e.clientY - LAST_MOUSE_POS[1];
            SUM_MOUSE_MOVE_DIFF[0] += xDiff;
            SUM_MOUSE_MOVE_DIFF[1] += yDiff;
            LAST_MOUSE_POS[0] = e.clientX;
            LAST_MOUSE_POS[1] = e.clientY;
            return;
        }
        if(IS_RMB_DOWN) {
            const zDiff = e.clientX - LAST_MOUSE_POS[2];
            SUM_MOUSE_MOVE_DIFF[2] += zDiff;
            LAST_MOUSE_POS[2] = e.clientX;
            return;
        }
        if(IS_MMB_DOWN) {
            const yMoveDiff = e.clientY - LAST_MOUSE_POS[2];
            if (yMoveDiff > 0) {
                DIRECTION_FLAGS.y = 1;
            } else if (yMoveDiff < 0) {
                DIRECTION_FLAGS.y = -1;
            } else {
                DIRECTION_FLAGS.y = 0;
            }
            LAST_MOUSE_POS[2] = e.clientY;
            return;
        }
    });
    canvasEl.addEventListener("mouseleave", (e) => {
        IS_LMB_DOWN = IS_RMB_DOWN = IS_MMB_DOWN = false;
        DIRECTION_FLAGS.y = 0;
    });
}

export const getCameraDiffs = (): [Vector, Triplet] => {
    // movement diffs
    
    if (KEYS_PRESSED.KeyA) {
        DIRECTION_FLAGS.x -= 1;
    }
    if (KEYS_PRESSED.KeyD) {
        DIRECTION_FLAGS.x += 1;
    }
    if (KEYS_PRESSED.KeyW) {
        DIRECTION_FLAGS.z += 1;
    }
    if (KEYS_PRESSED.KeyS) {
        DIRECTION_FLAGS.z -= 1;
    }

    // Rotation diffs
    const rotateDiff = SUM_MOUSE_MOVE_DIFF.map((d) => d * CAMERA_ROTATION_SPEED) as Triplet;
    SUM_MOUSE_MOVE_DIFF[0] = SUM_MOUSE_MOVE_DIFF[1] = SUM_MOUSE_MOVE_DIFF[2] = 0;

    return [DIRECTION_FLAGS, rotateDiff];

}

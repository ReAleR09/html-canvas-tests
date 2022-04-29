// -------KEYBOARD
export interface Keys {
    'KeyW': boolean;
    'KeyS': boolean;
    'KeyA': boolean;
    'KeyD': boolean;
    'ArrowUp': boolean;
    'ArrowDown': boolean;
}

export const KEYS_PRESSED: Keys = {
    'KeyW': false,
    'KeyS': false,
    'KeyA': false,
    'KeyD': false,
    'ArrowUp': false,
    'ArrowDown': false,
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


// -------MOUSE
const LAST_MOUSE_POS = [0, 0];
const SUM_DIFF = [0, 0, 0];
let IS_MOUSE_DOWN = false;

// TODO distinguish RBM and rotate on zAxis
export const attachMouseListenerToCanvas = (canvasEl: HTMLCanvasElement) => {
    canvasEl.addEventListener("mousedown", (e) => {
        if (e.button === 0) {
            IS_MOUSE_DOWN = true;
            LAST_MOUSE_POS[0] = e.clientX;
            LAST_MOUSE_POS[1] = e.clientY;
            return;
        }
    });
    canvasEl.addEventListener("mouseup", (e) => {
        if (e.button === 0) {
            IS_MOUSE_DOWN = false;
            return;
        }
    });
    canvasEl.addEventListener("mousemove", (e) => {
        if(IS_MOUSE_DOWN) {
            const yDiff = e.clientX - LAST_MOUSE_POS[0];
            const xDiff = e.clientY - LAST_MOUSE_POS[1];
            SUM_DIFF[0] += xDiff;
            SUM_DIFF[1] += yDiff;
            LAST_MOUSE_POS[0] = e.clientX;
            LAST_MOUSE_POS[1] = e.clientY;
        }
    });
    canvasEl.addEventListener("mouseleave", (e) => {
        IS_MOUSE_DOWN = false;
    });
}

const ANGLE_TO_PIXEL_RATIO = 400;
export const getAngleDiffs = (): [number, number, number] => {
    const diffs = SUM_DIFF.map((d) => d / ANGLE_TO_PIXEL_RATIO) as [number, number, number];
    SUM_DIFF[0] = SUM_DIFF[1] = 0;
    return diffs;
}

interface Keys {
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
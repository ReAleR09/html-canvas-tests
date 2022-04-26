
import { RenderDataUnpacked } from '../types/RenderMessageData';

self.addEventListener('message', ({
    data : {
        cameraPos,
        checkerboard,
        dimensions,
        spheres
    }
}: MessageEvent<RenderDataUnpacked>) => {

    self.postMessage(true);
}, false);
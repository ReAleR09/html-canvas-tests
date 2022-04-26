import { RenderData } from "../types/RenderMessageData";

const FLOAT_BYTES = 4;
const BOOL_BYTES = 1;

export const paramsToArrayBuffer = (data: RenderData): RenderDataUnpacked {
    const dimensionsTypedArr = Float32Array.from(
        [
            data.dimensions.xStart,
            data.dimensions.xEnd,
            data.dimensions.yStart,
            data.dimensions.yEnd,
        ]
    )
}
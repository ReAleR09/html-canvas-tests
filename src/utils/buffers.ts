export const concatBuffers = (...buffers: ArrayBuffer[]): ArrayBuffer => {
    const size = buffers.reduce((prev, curr) => prev + curr.byteLength, 0);
    const uint8 = new Uint8Array(size);
    let offset = 0;
    buffers.forEach((buff) => {
        uint8.set(new Uint8Array(buff), offset);
        offset += buff.byteLength;
    });

    return uint8.buffer;
}

export const splitBuffer = (arrayBuffer: ArrayBuffer, bufferSize: number): ArrayBuffer[] => {
    const count = arrayBuffer.byteLength / bufferSize;
    const results: ArrayBuffer[] = [];
    let offset = 0;
    for (let i = 0; i < count; i++) {
        results.push(arrayBuffer.slice(offset, offset + bufferSize));
        offset += bufferSize;
    }
    return results;
    
}
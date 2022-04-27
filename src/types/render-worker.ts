export interface WorkerInputMessage {
    id: number;
    buffer: ArrayBuffer;
}

export interface WorkerOutputMessage {
    id: number;
    buffer: ArrayBuffer;
}
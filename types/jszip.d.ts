// Type definitions for JSZip
// Project: https://stuk.github.io/jszip/

declare namespace JSZip {
  // TODO

  interface OutputTypes {
    base64: string;
    binarystring: string;
    array: number[];
    uint8array: Uint8Array;
    arraybuffer: ArrayBuffer;
    blob: Blob;
    nodebuffer: Uint8Array; // actually a Node.js Buffer
  }

  interface ProgressMetadata {
    percent: number;
    currentFile: string;
  }

  interface StreamHelper<T extends keyof OutputTypes> {
    resume(): void;
    pause(): void;
    on(event: 'data', callback: (data: OutputTypes[T], metadata: ProgressMetadata) => void): void;
    on(event: 'end', callback: () => void): void;
    on(event: 'error', callback: (error: Error) => void): void;
    accumulate(updateCallback?: (metadata: ProgressMetadata) => void): Promise<OutputTypes[T]>;
  }
}

declare class JSZip {
  // TODO
}

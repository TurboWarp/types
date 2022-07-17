// Type definitions for scratch-render
// Project: https://github.com/LLK/scratch-render

declare namespace RenderWebGL {
  interface Rectangle {
    left: number;
    right: number;
    bottom: number;
    top: number;
    width: number;
    height: number;
    intersects(other: Rectangle): boolean;
    contains(other: Rectangle): boolean;
    initFromBounds(left: number, right: number, bottom: number, top: number): void;
    initFromPointsAABB(points: [number, number][]): void;
    initFromModelMatrix(matrix4x4: number[]): void;
    clamp(left: number, right: number, bottom: number, top: number): void;
    snapToInt(): void;
  }
}

declare class RenderWebGL {
  canvas: HTMLCanvasElement;

  _xRight: number;
  _xLeft: number;
  _yTop: number;
  _yBottom: number;

  draw(): void;

  requestSnapshot(callback: (dataURL: string) => void): void;
}

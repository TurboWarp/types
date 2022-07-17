declare module 'scratch-render' {
  export interface Rectangle {
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

  export interface RenderWebGL {
    // TODO
  }
}

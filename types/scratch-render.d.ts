// Type definitions for scratch-render
// Project: https://github.com/LLK/scratch-render

/// <reference path="./twgl.d.ts" />
/// <reference path="./events.d.ts" />

declare namespace RenderWebGL {
  type AnyWebGLContext = WebGLRenderingContext | WebGL2RenderingContext;

  type BitmapResolution = 1 | 2;

  type BitmapData = ImageData | ImageBitmap | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement;

  const enum LayerGroup {
    // The renderer can be configured to use any strings as group names, but these are the groups
    // that scratch-vm uses, listed in order.
    Background = 'background',
    Video = 'video',
    Pen = 'pen',
    Sprite = 'sprite'
  }

  const enum UseGpuModes {
    Automatic = 'Automatic',
    ForceGPU = 'ForceGPU',
    ForceCPU = 'ForceCPU'
  }

  const enum Effect {
    Color = 'color',
    Fisheye = 'fisheye',
    Whirl = 'whirl',
    Pixelate = 'pixelate',
    Brightness = 'brightness',
    Ghost = 'ghost'
  }

  const enum DrawMode {
    Default = 'default',
    StraightAlpha = 'straightAlpha',
    Silhouette = 'silhouette',
    ColorMask = 'colorMask',
    Line = 'line',
    Background = 'background'
  }

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

  class Skin {

  }

  class BitmapSkin extends Skin {

  }

  class SVGSkin extends Skin {

  }

  interface PenAttributes {
    /**
     * Pen color in RGBA from 0-1.
     */
    color4f: [number, number, number, number];
    diameter: number;
  }

  class PenSkin extends Skin {

  }

  const enum TextBubbleType {
    Say = 'say',
    Think = 'think',
  }

  class TextBubbleSkin extends Skin {

  }

  interface Drawable {

  }

  interface ShaderManager {

  }

  interface DrawingRegion {

  }

  interface ScratchRenderEventMap {
    NativeSizeChanged: {
      newSize: [number, number];
    }
  }
}

declare class RenderWebGL extends EventEmitter<RenderWebGL.ScratchRenderEventMap> {
  static isSupported(canvas?: HTMLCanvasElement): boolean;

  /**
   * If WebGL 1 is supported, returns a WebGL 1 context.
   * If WebGL 1 is not supported but WebGL 2 is supported, returns a WebGL 2 context.
   * Otherwise, returns null.
   */
  static _getContext(canvas: HTMLCanvasElement): RenderWebGL.AnyWebGLContext | null;

  static sampleColor3b(vector: twgl.V3, drawableIds: number[], destination?: Uint8ClampedArray): Uint8ClampedArray;

  constructor(canvas: HTMLCanvasElement, xLeft?: number, xRight?: number, yBottom?: number, yTop?: number);

  get canvas(): HTMLCanvasElement;
  _gl: RenderWebGL.AnyWebGLContext;
  get gl(): RenderWebGL.AnyWebGLContext;

  _xRight: number;
  _xLeft: number;
  _yTop: number;
  _yBottom: number;

  setStageSize(xLeft: number, xRight: number, yBottom: number, yTop: number): void;
  resize(width: number, height: number): void;

  _nativeSize: [number, number];
  getNativeSize(): [number, number];
  _setNativeSize(width: number, height: number): void;
  onNativeSizeChanged(event: RenderWebGL.ScratchRenderEventMap['NativeSizeChanged']): void;

  /**
   * Renders the stage on the canvas.
   */
  draw(): void;

  _drawThese(drawableIds: number[], drawMode: RenderWebGL.DrawMode, projection: twgl.M4, opts?: {
    filter?: (drawableId: number) => boolean;
    extraUniforms?: object;
    effectMask?: number;
    ignoreVisibility?: boolean;
    framebufferWidth?: number;
    framebufferHeight?: number;
  }): void;

  _drawList: number[];
  _addToDrawList(drawableID: number, group: RenderWebGL.LayerGroup): void;
  _updateOffsets(updateType: 'add' | 'delete', index: number): void;
  get _visibleDrawList(): number[];
  getDrawableOrder(drawableID: number): number | -1;
  setDrawableOrder(drawableID: number, order: number, group: RenderWebGL.LayerGroup, isRelative?: boolean, min?: number): void;

  _groupOrdering: RenderWebGL.LayerGroup[]; 
  _layerGroups: Record<RenderWebGL.LayerGroup, {
    groupIndex: number;
    drawListOffset: number
  }>;
  setLayerGroupOrdering(groupOrdering: RenderWebGL.LayerGroup[]): void;
  _endIndexForKnownLayerGroup(layerGroup: RenderWebGL.LayerGroup): number;

  _nextDrawableId: number;
  _allDrawables: RenderWebGL.Drawable[];

  createDrawable(group: string): void;
  destroyDrawable(drawableID: number, group: RenderWebGL.LayerGroup): void;

  _allSkins: RenderWebGL.Skin[];
  _nextSkinId: number;

  createBitmapSkin(image: RenderWebGL.BitmapData, BitmapResolution: RenderWebGL.BitmapResolution, rotationCenter: [number, number]): RenderWebGL.BitmapSkin;
  updateBitmapSkin(skinId: number, image: RenderWebGL.BitmapData, BitmapResolution: RenderWebGL.BitmapResolution, rotationCenter: [number, number]): void;

  createSVGSkin(svgData: string, rotationCenter: [number, number]): RenderWebGL.SVGSkin;
  updateSVGSkin(skinId: number, svgData: string, rotationCenter: [number, number]): void;

  createTextSkin(type: RenderWebGL.TextBubbleType, text: string, pointsLeft: boolean): RenderWebGL.TextBubbleSkin;
  updateTextSkin(skinId: number, type: RenderWebGL.TextBubbleType, text: string, pointsLeft: boolean): void;

  createPenSkin(): RenderWebGL.PenSkin;

  destroySkin(skinId: number): void;

  _reskin(skinId: number, newSkin: RenderWebGL.Skin): void;

  getBounds(drawableId: number): RenderWebGL.Rectangle;
  getBoundsForBubble(drawableId: number): RenderWebGL.Rectangle;

  _getConvexHullPointsForDrawable(drawableID: number): Array<[number, number]>;

  getCurrentSkinSize(drawableId: number): [number, number];
  getSkinSize(skinId: number): [number, number];
  getSkinRotationCenter(skinId: number): [number, number];

  /**
   * Determine if a drawable is touching a color or if a certain color of the drawable is touching a color.
   * @param color RGB color from 0-255
   * @param mask RGB color from 0-255. Used by "is color touching color" block.
   */
  isTouchingColor(drawableId: number, color: [number, number, number], mask?: [number, number, number]): boolean;

  _isTouchingColorGpuStart(drawableId: number, candidateIds: number[], bounds: RenderWebGL.Rectangle, color: [number, number, number], mask?: [number, number, number]): void;
  _isTouchingColorGpuFin(bounds: RenderWebGL.Rectangle, color: [number, number, number], stop: number): boolean;

  /**
   * Determine if a drawable is intersecting a set of other drawables.
   * @param drawableId ID of the target drawable
   * @param candidateIds The IDs of the drawables to test for collision with the target drawable. Defaults to all drawables.
   */
  isTouchingDrawables(drawableId: number, candidateIds?: number[]): boolean;

  /**
   * @param centerX X coordinate in client space
   * @param centerY Y coordinate in client space
   * @param width Defaults to 1
   * @param height Defaults to 1
   */
  clientSpaceToScratchBounds(centerX: number, centerY: number, width?: number, height?: number): RenderWebGL.Rectangle;

  /**
   * Determine if a drawable is touching a point.
   * @param drawableId ID of the target drawable
   * @param centerX X coordinate in client space
   * @param centerY Y coordinate in client space
   * @param width Defaults to 1
   * @param height Defaults to 1
   */
  drawableTouching(drawableId: number, centerX: number, centerY: number, width?: number, height?: number): boolean;

  /**
   * Determine the top-most drawable at a point.
   * @param centerX X coordinate in client space
   * @param centerY Y coordinate in client space
   * @param width Defaults to 1
   * @param height Defaults to 1
   * @param candidateIds Defaults to all drawables
   * @returns The ID of the top-most drawable, or -1 or false if there is none.
   */
  pick(centerX: number, centerY: number, width?: number, height?: number, candidateIds?: number[]): number | -1 | false;

  extractDrawableScreenSpace(drawableId: number): {
    data: ImageData;
    x: number;
    y: number;
    width: number;
    height: number;
  };

  /**
   * :3
   * @see {RenderWebGL.extractDrawableScreenSpace}
   */
  canHazPixels(drawableID: number): ReturnType<RenderWebGL['extractDrawableScreenSpace']>;

  /**
   * @param x X coordinate in client space
   * @param y Y coordinate in client space
   * @param radius "Radius" of the square, in pixels
   * @returns Data about the pixels in a square around the coordinates. Color channels are RGBA from 0-255
   */
  extractColor(x: number, y: number, radius: number): {
    data: Uint8Array;
    width: number;
    height: number;
    color: {
      r: number;
      g: number;
      b: number;
      a: number;
    }
  };

  /**
   * Get the "candidate bounding box" to use for "touching" queries.
   * @returns The rectangle, or null if the drawable is offscreen or has no skin.
   */
  _touchingBounds(drawableId: number): RenderWebGL.Rectangle | null;

  _candidatesTouching(drawableId: number, candidateIds: number[]): Array<{
    id: number;
    drawable: RenderWebGL.Drawable;
    intersection: RenderWebGL.Rectangle;
  }>;
  
  _candidatesBounds(candidates: ReturnType<RenderWebGL['_candidatesTouching']>): RenderWebGL.Rectangle;

  updateDrawableSkinId(drawableId: number, skinId: number): void;
  updateDrawablePosition(drawableId: number, position: [number, number]): void;
  updateDrawableDirection(drawableId: number, direction: number): void;
  updateDrawableScale(drawableId: number, scale: number): void;
  updateDrawableDirectionScale(drawableId: number, direction: number, scale: number): void;
  updateDrawableVisible(drawableId: number, visible: boolean): void;
  updateDrawableEffect(drawableId: number, effectName: RenderWebGL.Effect, value: number): void;
  /**
   * @deprecated Use the individual updateDrawable* methods instead.
   */
  updateDrawableProperties(drawableId: number, properties: {
    skinId?: number;
    position?: [number, number];
    direction?: number;
    scale?: number;
    visible?: number;
  } | Record<RenderWebGL.Effect, number>): void;

  getFencedPositionOfDrawable(drawableId: number, position: [number, number]): [number, number];

  penClear(penSkinId: number): void;
  penPoint(penSkinId: number, penAttributes: RenderWebGL.PenAttributes, x: number, y: number): void;
  penLine(penSkinId: number, penAttributes: RenderWebGL.PenAttributes, x1: number, y1: number, x2: number, y2: number): void;
  penStamp(penSkinId: number, stampDrawableId: number): void;

  _projection: twgl.M4;

  _shaderManager: RenderWebGL.ShaderManager;

  _regionId: unknown | null;
  _exitRegion: Function | null;

  /**
   * Enter a drawing region.
   * @param regionId Any arbitrary unique object.
   * @param enter Called when entering the drawing region (which is what this function does). Defaults to regionId.enter.
   * @param exit Called when leaving the drawing region. Defaults to regionId.exit.
   */
  enterDrawRegion(regionId: unknown, enter?: Function, exit?: Function): void;

  _doExitDrawRegion(): void;

  _backgroundDrawRegionId: RenderWebGL.DrawingRegion;
  _enterDrawBackground(): void;
  _exitDrawBackground(): void;

  /**
   * RGBA from 0-1
   */
  _backgroundColor4f: [number, number, number, number];

  /**
   * RGB from 0-255
   */
  _backgroundColor3b: [number, number, number];

  /**
   * @param red Red from 0-1
   * @param green Green from 0-1
   * @param blue Blue from 0-1
   */
  setBackgroundColor(red: number, green: number, blue: number): void;

  _snapshotCallbacks: Array<(dataURL: string) => void>;
  requestSnapshot(callback: (dataURL: string) => void): void;

  _useGpuMode: RenderWebGL.UseGpuModes;
  setUseGpuMode(useGpuMode: RenderWebGL.UseGpuModes): void;
  _getMaxPixelsForCPU(): number;

  _debugCanvas?: HTMLCanvasElement;
  setDebugCanvas(canvas: HTMLCanvasElement): void;

  _bufferInfo: twgl.BufferInfo;
  _createGeometry(): void;
}

// Type definitions for scratch-render
// Project: https://github.com/LLK/scratch-render

/// <reference path="./twgl.d.ts" />
/// <reference path="./events.d.ts" />

declare namespace RenderWebGL {
  type AnyWebGLContext = WebGLRenderingContext | WebGL2RenderingContext;

  type BitmapResolution = 1 | 2;

  type BitmapData = ImageData | ImageBitmap | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement;

  type LayerGroup = 'background' | 'video' | 'pen' | 'sprite' | string;

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

  // TODO: document bit masks
  type EffectMask = number;

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

  /**
   * Suggested properties of a drawing region. Strictly, this can really be whatever you want it to be.
   */
  interface DrawingRegion {
    enter?(): void;
    exit?(): void;
  }

  interface Shader {
    // TODO
  }

  class ShaderManager {
    static EFFECT_INFO: Record<Effect, {
      uniformName: string;
      mask: number;
      converter(rawEffect: number): number;
      shapeChanges: boolean;
    }>;
    static EFFECTS: Effect[];
    static DRAW_MODE: Record<DrawMode, DrawMode>;

    _gl: AnyWebGLContext;
    _shaderCache: Record<DrawMode, Record<EffectMask, twgl.ProgramInfo[]>>;
    _buildShader(drawMode: DrawMode, effectMask: EffectMask): twgl.ProgramInfo;
    getShader(drawMode: DrawMode, effectMask: EffectMask): twgl.ProgramInfo;
  }

  class Silhouette {
    static _updateCanvas(): HTMLCanvasElement;

    _width: number;
    _height: number;
    _colorData: Uint8ClampedArray | null;

    _getColor(silhouette: Silhouette, x: number, y: number, destination?: Uint8ClampedArray): Uint8ClampedArray;

    /**
     * @param image Image data
     * @param isPremultiplied Whether alpha is premultiplied. Defaults to false.
     */
    update(image: BitmapData, isPremultiplied?: boolean): void;

    colorAtNearest(textureCoordinate: twgl.V3, destination?: Uint8ClampedArray): Uint8ClampedArray;
    colorAtLinear(textureCoordinate: twgl.V3, destination?: Uint8ClampedArray): Uint8ClampedArray;

    isTouchingNearest(textureCoordinate: twgl.V3): void;
    isTouchingLinear(textureCoordinate: twgl.V3): void;
  }

  interface SkinEventMap {
    WasAltered: void;
  }

  class Skin extends EventEmitter<SkinEventMap> {
    _id: number;
    get id(): number;

    get size(): [number, number];

    _rotationCenter: twgl.V3;
    get rotationCenter(): twgl.V3;

    /**
     * Always returns the middle of the skin (size / 2).
     * No relation to Skin._rotationCenter or Skin.rotationCenter.
     */
    calculateRotationCenter(): [number, number];

    _texture: WebGLTexture | null;

    _uniforms: {
      u_skinSize: [number, number];
      u_skin: WebGLTexture | null;
    };
    getUniforms(): Skin['_uniforms'];

    _silhouette: Silhouette;
    updateSilhouette(): void;

    /**
     * @see {Silhouette.isTouchingNearest}
     */
    isTouchingNearest(textureCoordinate: twgl.V3): boolean;

    /**
     * @see {Silhouette.isTouchingLinear}
     */
    isTouchingLinear(textureCoordinate: twgl.V3): boolean;

    useNearest(scale: [number, number], drawable: Drawable): boolean;

    getTexture(scale: [number, number]): WebGLTexture;
    _setTexture(image: BitmapData): void;
    setEmptyImageData(): void;

    getFenceBounds(): Rectangle;

    dispose(): void;
  }

  class BitmapSkin extends Skin {
    static _getBitmapSize(image: BitmapData): [number, number];

    _renderer: RenderWebGL;

    _costumeResolution: BitmapResolution;
    _textureSize: [number, number];

    /**
     * Synchronously update the content of the skin.
     * @param image The new image.
     * @param bitmapResolution Defaults to 2.
     * @param rotationCenter Defaults to the center of the image.
     */
    setBitmap(image: BitmapData, bitmapResolution?: BitmapResolution, rotationCenter?: [number, number]): void;
  }

  class SVGSkin extends Skin {
    _renderer: RenderWebGL;

    _svgImage: HTMLImageElement;
    _svgImageLoaded: boolean;
    _size: [number, number];
    _canvas: HTMLCanvasElement;
    _context: CanvasRenderingContext2D;
    _scaledMIPs: WebGLTexture[];
    _largestMIPScale: number;
    _maxTextureScale: number;

    createMIP(scale: number): WebGLTexture;
    resetMIPs(): void;

    /**
     * Asynchronously update the content of the skin. May take a couple frames for changes to appear.
     * @param svgData SVG source code
     * @param rotationCenter Defaults to the center of the image.
     */
    setSVG(svgData: string, rotationCenter?: [number, number]): void;
  }

  interface PenAttributes {
    /**
     * Pen color in RGBA from 0-1.
     */
    color4f: [number, number, number, number];
    diameter: number;
  }

  class PenSkin extends Skin {
    _renderer: RenderWebGL;

    _size: [number, number];
    _framebuffer: WebGLFramebuffer;
    _silhouetteDirty: boolean;
    _silhouettePixels: Uint8Array;
    _silhouetteImageData: ImageData;

    _lineOnBufferDrawRegionId: DrawingRegion;
    _enterDrawLineOnBuffer(): void;
    _exitDrawLineOnBuffer(): void;
    _drawLineOnBuffer(attributes: PenAttributes, x1: number, y1: number, x2: number, y2: number): void;

    _usePenBufferDrawRegionId: DrawingRegion;
    _enterUsePenBuffer(): void;
    _exitUsePenBuffer(): void;

    _lineBufferInfo: twgl.BufferInfo;
    _lineShader: Shader;

    clear(): void;
    drawPoint(attributes: PenAttributes, x: number, y: number): void;
    drawLine(attributes: PenAttributes, x1: number, y1: number, x2: number, y2: number): void;

    onNativeSizeChanged(event: ScratchRenderEventMap['NativeSizeChanged']): void;
    _setCanvasSize(size: [number, number]): void;
  }

  const enum TextBubbleType {
    Say = 'say',
    Think = 'think',
  }

  class CanvasMeasurementProvider {
    _ctx: CanvasRenderingContext2D;
    _cache: Record<string, number>;
    measureText(text: string): number;

    /**
     * Does nothing.
     */
    beginMeasurementSession(): void;

    /**
     * Does nothing.
     */
    endMeasurementSession(): void;
  }

  class TextWrapper {
    _measurementProvider: CanvasMeasurementProvider;
    _cache: Record<string, string[]>;
    wrapText(maxWidth: number, text: string): string[];
  }

  class TextBubbleSkin extends Skin {
    _renderer: RenderWebGL;

    _canvas: HTMLCanvasElement;
    _size: [number, number];
    _renderedScale: number;
    _lines: string[];
    _textAreaSize: {
      width: number;
      height: number
    };
    _bubbleType: TextBubbleType;
    _pointsLeft: boolean;
    _textDirty: boolean;
    _textureDirty: boolean;

    measurementProvider: CanvasMeasurementProvider;
    textWrapper: TextWrapper;

    /**
     * @param type Type of bubble.
     * @param text Text to display.
     * @param pointsLeft True if this bubble points left, false if this bubble points right.
     */
    setTextBubble(type: TextBubbleType, text: string, pointsLeft: boolean): void;

    _restyleCanvas(): void;
    _reflowLines(): void;

    _renderTextBubble(scale: number): void;
  }

  class Drawable {
    static color4fFromID(id: number): [number, number, number, number];
    static color3bToID(r: number, g: number, b: number): number;
    static sampleColor4b(coordinate: twgl.V3, drawable :Drawable, destination: Uint8ClampedArray, effectMask?: EffectMask): Uint8ClampedArray;

    _id: number;
    get id(): number;

    _uniforms: {
      u_modelMatrix: twgl.M4;

      /**
       * Only used in some debugging modes.
       */
      u_silhouetteColor: [number, number, number, number];
    } & Record<Effect, number>;
    getUniforms(): Drawable['_uniforms'];

    _skin: Skin;
    get skin(): Skin;
    set skin(skin: Skin);
    _skinWasAltered(): void;

    _position: twgl.V3;
    /**
     * @param position The new position. This will be rounded.
     */
    updatePosition(position: [number, number]): void;

    _scale: twgl.V3;
    get scale(): twgl.V3;
    updateScale(scale: number): void;

    _direction: number;
    updateDirection(direction: number): void;

    _visible: boolean;
    getVisible(): boolean;
    updateVisible(visible: boolean): void;

    enabledEffects: EffectMask;
    updateEffect(effect: Effect, value: number): void;

    /**
     * @deprecated Use the specific update* methods instead.
     */
    updateProperties(properties: {
      position?: [number, number];
      direction?: number;
      scale?: number;
      visible?: boolean;
    } | Record<Effect, number>): void;

    _transformDirty: boolean;
    _calculateTransform(): void;

    _rotationMatrix: twgl.M4;
    _rotationTransformDirty: boolean;

    _rotationAdjusted: twgl.V3;
    _rotationCenterDirty: boolean;

    _skinScale: twgl.V3;
    _skinScaleDirty: boolean;

    _convexHullPoints: Array<[number, number]>;
    _convexHullDirty: boolean;
    needsConvexHullPoints(): boolean;
    setConvexHullDirty(): boolean;
    setConvexHullPoints(points: Array<[number, number]>): void;

    _transformedHullPoints: Array<[number, number]>;
    _transformedHullDirty: boolean;
    _getTransformedHullPoints(): Array<[number, number]>;

    setTransformDirty(): void;

    _inverseMatrix: twgl.M4;
    _inverseTransformDirty: boolean;
    updateMatrix(): void;

    getBounds(result?: Rectangle): Rectangle;
    getBoundsForBubble(result?: Rectangle): Rectangle;
    getAABB(result?: Rectangle): Rectangle;
    getFastBounds(result?: Rectangle): Rectangle;

    updateCPURenderAttributes(): void;
    isTouching(textureCoordinate: twgl.V3): boolean;
    _isTouchingNearest(textureCoordinate: twgl.V3): boolean;
    _isTouchingLinear(textureCoordinate: twgl.V3): boolean;
    _isTouchingNever(textureCoordinate: twgl.V3): false;

    dispose(): void;
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
    effectMask?: RenderWebGL.EffectMask;
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

  createDrawable(group: string): number;
  destroyDrawable(drawableID: number, group: RenderWebGL.LayerGroup): void;

  _allSkins: RenderWebGL.Skin[];
  _nextSkinId: number;

  /**
   * @see {RenderWebGL.BitmapSkin.setBitmap}
   */
  createBitmapSkin(image: RenderWebGL.BitmapData, bitmapResolution?: RenderWebGL.BitmapResolution, rotationCenter?: [number, number]): number;

  /**
   * @see {RenderWebGL.BitmapSkin.setBitmap}
   */
  updateBitmapSkin(skinId: number, image: RenderWebGL.BitmapData, bitmapResolution?: RenderWebGL.BitmapResolution, rotationCenter?: [number, number]): void;

  /**
   * @see {RenderWebGL.SVGSkin.setSVG}
   */
  createSVGSkin(svgData: string, rotationCenter?: [number, number]): number;

  /**
   * @see {RenderWebGL.SVGSkin.setSVG}
   */
  updateSVGSkin(skinId: number, svgData: string, rotationCenter?: [number, number]): void;

  /**
   * @see {RenderWebGL.TextBubbleSkin.setTextBubble}
   */
  createTextSkin(type: RenderWebGL.TextBubbleType, text: string, pointsLeft: boolean): number;

  /**
   * @see {RenderWebGL.TextBubbleSkin.setTextBubble}
   */
  updateTextSkin(skinId: number, type: RenderWebGL.TextBubbleType, text: string, pointsLeft: boolean): void;

  createPenSkin(): number;

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

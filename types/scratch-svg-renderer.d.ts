// Type definitions for scratch-svg-renderer
// Project: https://github.com/LLK/scratch-svg-renderer

declare namespace ScratchSVGRenderer {
  class BitmapAdapter {
    constructor(makeImage?: () => HTMLImageElement, makeCanvas?: () => HTMLCanvasElement);
    resize(image: CanvasImageSource, newWidth: number, newHeight: number): HTMLCanvasElement;
    convertResolution1Bitmap(dataURI: string, callback: (error: unknown, dataURI: string) => void): void;
    getResizedWidthHeight(oldWidth: number, oldHeight: number): {
      width: number;
      height: number;
    };
    importBitmap(fileData: ArrayBuffer | string, contentType: string): Promise<Uint8Array>;
    convertDataURIToBinary(dataURI: string): Uint8Array;
    convertBinaryToDataURI(data: ArrayBufferLike, contentType: string): string;
  }

  function convertFonts(element: SVGElement): void;

  function inlineSvgFonts(svgString: string): string;

  function loadSvgString(svgString: string, fromVersion2?: boolean): SVGSVGElement;

  function serializeSvgToString(svgElement: SVGSVGElement, shouldInjectFonts?: boolean): string;

  class SvgElement {
    static get svg(): string;
    static get xmlns(): string;
    static get xlink(): string;
    static get attributeNamespace(): Record<string, string>;
    static create(tag: string, attributes?: Record<string, string | number>, formatter?: (n: number) => string): SVGElement;
    static set(node: SVGElement, attributes?: Record<string, string | number>, formatter?: (n: number) => string): SVGElement;
    static get(node: SVGElement, attributeName: string): string | null;
  }

  /**
   * @deprecated Use the individual methods instead.
   */
  class SvgRenderer {
    constructor(canvas?: HTMLCanvasElement);

    _canvas: HTMLCanvasElement;
    get canvas(): HTMLCanvasElement;
    _context: CanvasRenderingContext2D;

    _measurements: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    get size(): [number, number];
    get viewOffset(): [number, number];

    loaded?: boolean;
    _cachedImage?: HTMLImageElement | null;
    _svgTag: SVGSVGElement;

    loadString(svgString: string, fromVersion2?: boolean): void;
    loadSVG(svgString: string, fromVersion2?: boolean, callback?: () => void): void;
    _createSVGImage(onFinish?: () => void): void;
    toString(shouldInjectFonts?: boolean): string;
    draw(scale: number): void;
    _drawFromImage(scale: number): void;
  }
}

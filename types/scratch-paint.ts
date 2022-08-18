// Type definitions for scratch-paint redux state and events
// Project: https://github.com/LLK/scratch-paint

/// <reference path="./paper.d.ts" />

declare namespace ScratchPaint {
  const enum VectorMode {
    Brush = 'BRUSH',
    Eraser = 'ERASER',
    Line = 'LINE',
    Fill = 'FILL',
    Select = 'SELECT',
    Reshape = 'RESHAPE',
    Oval = 'OVAL',
    Rectangle = 'RECT',
    // Unused by scratch-paint but technically exists.
    RoundedRectangle = 'ROUNDED_RECT',
    Text = 'TEXT'
  }

  const enum BitmapMode {
    Brush = 'BIT_BRUSH',
    Line = 'BIT_LINE',
    Oval = 'BIT_OVAL',
    Rectangle = 'BIT_RECT',
    Text = 'BIT_TEXT',
    Fill = 'BIT_FILL',
    Eraser = 'BIT_ERASER',
    Select = 'BIT_SELECT'
  }

  type Mode = VectorMode | BitmapMode;

  const enum GradientType {
    Solid = 'SOLID',
    Horizontal = 'HORIZONTAL',
    Vertical = 'VERTICAL',
    Radial = 'RADIAL'
  }

  const enum Cursor {
    Default = 'default',
    Grab = 'grab',
    Grabbing = 'grabbing',
    None = 'none',
    ResizeEW = 'ew-resize',
    ResizeNS = 'ns-resize',
    ResizeNEWSW = 'nesw-resize',
    ResizeNWSE = 'nwse-resize'
  }

  type ColorIndex = 0 | 1;

  type Font = string;

  const enum Format {
    Bitmap = 'BITMAP',
    Vector = 'VECTOR',
    BitmapSkipConvert = 'BITMAP_SKIP_CONVERT',
    VectorSkipConvert = 'VECTOR_SKIP_CONVERT'
  }

  const enum Modal {
    FillColor = 'fillColor',
    StrokeColor = 'strokeColor'
  }

  interface ColorStyle {
    primary: string | null;
    secondary: string | null;
    gradientType: GradientType;
  }

  interface UndoSnapshot {
    json: unknown[];
    paintEditorFormat: Format;
  }

  interface ReduxState {
    scratchPaint: ScratchPaintState;
  }

  interface ScratchPaintState {
    mode: Mode;

    bitBrushSize: number;

    bitEraserSize: number;

    brushMode: {
      brushSize: number;
    };

    color: {
      eyeDropper: {
        active: boolean;
        callback: (color: string) => void;
        previousTool: Mode;
      };

      fillColor: ColorStyle;

      strokeColor: ColorStyle;

      strokeWidth: number;
    };

    clipboard: {
      items: Paper.Base[];
      pasteOffset: number;
    };

    cursor: Cursor;

    eraserMode: {
      brushSize: number;
    };

    fillBitmapShapes: boolean;

    fillMode: {
      gradientType: GradientType | null;
      colorIndex: ColorIndex;
    };

    font: Font;

    format: Format | null;

    hoveredItemId: number | null;

    layout: {
      rtl: boolean;
    };

    modals: Record<Modal, boolean>;

    selectedItems: Paper.Base[];

    textEditTarget: number | null;

    undo:  {
      stack: UndoSnapshot[];
      pointer: number;
    };

    viewBounds: Paper.Matrix;

    zoomLevels: {
      currentZoomLevelId: string;
    } & Record<string, Paper.Matrix>;
  }

  type ReduxEvent =
    {
      type: 'scratch-paint/modes/CHANGE_MODE';
      mode: Mode;
    } |
    {
      type: 'scratch-paint/brush-mode/CHANGE_BIT_BRUSH_SIZE';
      brushSize: number;
    } |
    {
      type: 'scratch-paint/eraser-mode/CHANGE_BIT_ERASER_SIZE';
      eraserSize: number;
    } |
    {
      type: 'scratch-paint/brush-mode/CHANGE_BRUSH_SIZE';
      brushSize: number;
    } |
    {
      type: 'scratch-paint/eye-dropper/ACTIVATE_COLOR_PICKER';
      callback: ScratchPaintState['color']['eyeDropper']['callback'];
      previousMode: Paper.Tool;
    } |
    {
      type: 'scratch-paint/eye-dropper/DEACTIVATE_COLOR_PICKER';
    } |
    {
      type: 'scratch-paint/fill-style/CHANGE_FILL_COLOR';
      color: string;
    } |
    {
      type: 'scratch-paint/fill-style/CHANGE_FILL_COLOR_2';
      color: string;
    } |
    {
      type: 'scratch-paint/fill-style/CHANGE_FILL_GRADIENT_TYPE';
      gradientType: GradientType;
    } |
    {
      type: 'scratch-paint/fill-style/CLEAR_FILL_GRADIENT';
    } |
    {
      type: 'scratch-paint/stroke-style/CHANGE_STROKE_COLOR';
      color: string;
    } |
    {
      type: 'scratch-paint/stroke-style/CHANGE_STROKE_COLOR_2';
      color: string;
    } |
    {
      type: 'scratch-paint/stroke-style/CHANGE_STROKE_GRADIENT_TYPE';
      gradientType: GradientType;
    } |
    {
      type: 'scratch-paint/stroke-style/CLEAR_STROKE_GRADIENT';
    } |
    {
      type: 'scratch-paint/stroke-width/CHANGE_STROKE_WIDTH';
      strokeWidth: number;
    } |
    {
      type: 'scratch-paint/clipboard/SET';
      clipboardItems: ScratchPaintState['clipboard']['items']
    } |
    {
      type: 'scratch-paint/clipboard/INCREMENT_PASTE_OFFSET';
    } |
    {
      type: 'scratch-paint/clipboard/CLEAR_PASTE_OFFSET';
    } |
    {
      type: 'scratch-paint/cursor/CHANGE_CURSOR';
      cursorString: Cursor;
    } |
    {
      type: 'scratch-paint/eraser-mode/CHANGE_ERASER_SIZE';
      brushSize: number;
    } |
    {
      type: 'scratch-paint/fill-bitmap-shapes/SET_FILLED';
      filled: boolean;
    } |
    {
      type: 'scratch-paint/color-index/CHANGE_COLOR_INDEX';
      index: ColorIndex;
    } |
    {
      type: 'scratch-paint/fonts/CHANGE_FONT';
      font: Font;
    } |
    {
      type: 'scratch-paint/formats/CHANGE_FORMAT';
      format: Format;
    } |
    {
      type: 'scratch-paint/hover/CHANGE_HOVERED';
      hoveredItemId: number | null;
    } |
    {
      type: 'scratch-paint/layout/SET_LAYOUT';
      layout: 'rtl' | 'ltr';
    } |
    {
      type: 'scratch-paint/modals/OPEN_MODAL';
      modal: Modal;
    } |
    {
      type: 'scratch-paint/modals/CLOSE_MODAL';
      modal: Modal;
    } |
    {
      type: 'scratch-paint/select/CHANGE_SELECTED_ITEMS';
      selectedItems: ScratchPaintState['selectedItems'];
      bitmapMode: boolean;
    } |
    {
      type: 'scratch-paint/select/REDRAW_SELECTION_BOX';
    } |
    {
      type: 'scratch-paint/text-tool/CHANGE_TEXT_EDIT_TARGET';
      textEditTargetId: number | null;
    } |
    {
      type: 'scratch-paint/undo/UNDO';
      /**
       * VECTOR_SKIP_CONVERT or BITMAP_SKIP_CONVERT
       */
       format: Format;
    } |
    {
      type: 'scratch-paint/undo/REDO';
      /**
       * VECTOR_SKIP_CONVERT or BITMAP_SKIP_CONVERT
       */
      format: Format;
    } |
    {
      type: 'scratch-paint/undo/SNAPSHOT';
      snapshot: UndoSnapshot;
    } |
    {
      type: 'scratch-paint/undo/CLEAR';
    } |
    {
      type: 'scratch-paint/view/UPDATE_VIEW_BOUNDS';
      viewBounds: Paper.Matrix;
    } |
    {
      type: 'scratch-paint/zoom-levels/SAVE_ZOOM_LEVEL';
      zoomLevel: Paper.Matrix;
    } |
    {
      type: 'scratch-paint/zoom-levels/SET_ZOOM_LEVEL_ID';
      zoomLevelId: string;
    } |
    {
      type: 'scratch-paint/zoom-levels/RESET_ZOOM_LEVELS';
    };
}

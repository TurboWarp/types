// Type definitions for scratch-render-fonts
// Project: https://github.com/LLK/scratch-render-fonts

declare namespace ScratchRenderFonts {
  const enum Font {
    SansSerif = 'Sans Serif',
    Serif = 'Serif',
    Handwriting = 'Handwriting',
    Marker = 'Marker',
    Curly = 'Curly',
    Pixel = 'Pixel',
    Scratch = 'Scratch'
  }
}

declare function ScratchRenderFonts(): Record<ScratchRenderFonts.Font, string>;

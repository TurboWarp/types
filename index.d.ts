/// <reference path="./types/scratch-vm.d.ts" />
/// <reference path="./types/scratch-render.d.ts" />
/// <reference path="./types/scratch-svg-renderer.d.ts" />
/// <reference path="./types/scratch-render-fonts.d.ts" />
/// <reference path="./types/scratch-audio.d.ts" />
/// <reference path="./types/scratch-storage.d.ts" />
/// <reference path="./types/scratch-parser.d.ts" />
/// <reference path="./types/scratch-blocks.d.ts" />

declare module 'scratch-vm' {
  export = VM;
}

declare module 'scratch-render' {
  export = RenderWebGL;
}

declare module 'scratch-svg-renderer' {
  export = ScratchSVGRenderer;
}

declare module 'scratch-render-fonts' {
  export = ScratchRenderFonts;
}

declare module 'scratch-audio' {
  export = AudioEngine;
}

declare module 'scratch-storage' {
  export = ScratchStorage;
}

declare module 'scratch-parser' {
  export = ScratchParser;
}

declare module 'scratch-blocks' {
  export = ScratchBlocks;
}

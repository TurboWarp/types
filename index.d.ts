/// <reference path="./types/scratch-vm.d.ts" />
declare module 'scratch-vm' {
  export = VM;
}

/// <reference path="./types/scratch-render.d.ts" />
declare module 'scratch-render' {
  export = RenderWebGL;
}

/// <reference path="./types/scratch-audio.d.ts" />
declare module 'scratch-audio' {
  export = AudioEngine;
}

/// <reference path="./types/scratch-storage.d.ts" />
declare module 'scratch-storage' {
  export = ScratchStorage;
}

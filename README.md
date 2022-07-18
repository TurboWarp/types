# Types

Type definitions for the Scratch runtime.

The hope is to make it easier to develop reliable third-party tools.

## Scope

The goal is not necessarily to have in-depth descriptions of every function, but to at least have type information for the most commonly used methods.

Things we want to document in the near future:

 - scratch-vm
 - scratch-render
 - sb3 project.json

Things we want to document eventually, but lower priority:

 - scratch-blocks
 - scratch-storage
 - scratch-audio
 - scratch-parser?
 - scratch-svg-render?
 - scratch-sb1-converter?
 - scratch-render-fonts?
 - TurboWarp

Things that are out of scope:

 - scratch-paint
 - scratch-gui
 - scratch-www
 - scratch-l10n
 - api.scratch.mit.edu

## Using from npm

WIP - Not ready yet

You can tell TypeScript to use these types when you import scratch-vm, scratch-render, etc.

```json
{
  "compilerOptions": {
    "module": "ES6",
    "allowSyntheticDefaultImports": true,

    // Tell TypeScript where to find the types for Scratch libraries
    "paths": {
      "scratch-vm": ["./node_modules/@turbowarp/types/index.d.ts"],
      "scratch-render": ["./node_modules/@turbowarp/types/index.d.ts"],
      "scratch-storage": ["./node_modules/@turbowarp/types/index.d.ts"],
      "scratch-audio": ["./node_modules/@turbowarp/types/index.d.ts"],
    },

    // Recommended strictness settings
    "strictNullChecks": true,
    "noImplicitAny": true,
    "noImplicitThis": true
  }
}
```

Then in your TypeScript:

```ts
import VM from 'scratch-vm';
import RenderWebGL from 'scratch-render';
import AudioEngine from 'scratch-audio';
import ScratchStorage from 'scratch-storage';

const vm = new VM();
vm.attachRenderer(new RenderWebGL());
vm.attachAudioEngine(new AudioEngine());
vm.attachStorage(new ScratchStorage());
vm.loadProject(/* load a project somehow */ new ArrayBuffer(100))
  .then(() => {
    vm.start();
    vm.greenFlag();
  });
```

## Tests

There are some tests in the tests folder. These files are never actually run, but the code will be type checked.

## License

Type definitions are licensed under the Apache 2.0 license.

The projects being documented may be licensed under different licenses.

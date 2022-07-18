# Types

Type definitions and documentation for the Scratch runtime because Scratch doesn't provide them.

The hope is to make it easier to develop reliable third-party tools.

This project is still at an early stage.

## Scope

Despite being in the TurboWarp organization, this project currently only wants to document the vanilla Scratch runtime. Additional types for the TurboWarp runtime will be added later.

We want to type and document all public APIs in:

 - scratch-vm
 - scratch-render
 - scratch-svg-render
 - scratch-render-fonts
 - scratch-audio
 - scratch-storage
 - scratch-parser
 - scratch-blocks

## Using from npm

Not ready yet.

You can tell TypeScript to use these types when you import scratch-vm, scratch-render, etc.

```json5
{
  "compilerOptions": {
    "module": "ES6",
    "allowSyntheticDefaultImports": true,

    // Tell TypeScript where to find the types for Scratch libraries
    "paths": {
      "scratch-vm": ["./node_modules/@turbowarp/types/index.d.ts"],
      "scratch-render": ["./node_modules/@turbowarp/types/index.d.ts"],
      "scratch-svg-render": ["./node_modules/@turbowarp/types/index.d.ts"],
      "scratch-render-fonts": ["./node_modules/@turbowarp/types/index.d.ts"],
      "scratch-storage": ["./node_modules/@turbowarp/types/index.d.ts"],
      "scratch-audio": ["./node_modules/@turbowarp/types/index.d.ts"],
      "scratch-parser": ["./node_modules/@turbowarp/types/index.d.ts"],
      "scratch-blocks": ["./node_modules/@turbowarp/types/index.d.ts"]
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

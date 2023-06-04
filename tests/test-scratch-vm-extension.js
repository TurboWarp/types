(function(Scratch) {
  'use strict';

  class Fetch {
    /** @returns {Scratch.Info} */
    getInfo () {
      return {
        id: 'fetch',
        name: 'Fetch',
        blocks: [
          {
            opcode: 'get',
            blockType: Scratch.BlockType.REPORTER,
            text: 'GET [URL]',
            arguments: {
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://extensions.turbowarp.org/hello.txt'
              }
            }
          },
          '---',
          {
            opcode: 'test',
            text: 'test [STRING] [IMAGE] [BOOLEAN] [NUMBER] [MATRIX] [NOTE] [ANGLE] [COLOR]',
            blockType: Scratch.BlockType.COMMAND,
            hideFromPalette: false,
            isTerminal: true,
            arguments: {
              STRING: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'test',
                menu: 'test1'
              },
              IMAGE: {
                type: Scratch.ArgumentType.IMAGE,
                dataURI: 'https://extensions.turbowarp.org/dango.png'
              },
              BOOLEAN: {
                type: Scratch.ArgumentType.BOOLEAN
              },
              NUMBER: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 5,
              },
              MATRIX: {
                type: Scratch.ArgumentType.MATRIX,
                defaultValue: '0101001010000001000101110'
              },
              NOTE: {
                type: Scratch.ArgumentType.NOTE,
                defaultValue: '30'
              },
              ANGLE: {
                type: Scratch.ArgumentType.ANGLE,
                defaultValue: 30
              },
              COLOR: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#123456'
              }
            }
          },
          {
            blockType: Scratch.BlockType.BUTTON,
            func: 'MAKE_A_VARIABLE',
            text: 'button text'
          }
        ],
        menus: {
          test1: ['1', '2', '3'],
          test2: {
            acceptReporters: false,
            items: [
              { text: 'text', value: 'value' },
              'another value'
            ]
          }
        }
      };
    }

    /**
     * @param {{URL: string;}} args
     */
    get (args) {
      return fetch(args.URL)
        .then(r => r.text())
        .catch(() => '');
    }

    /**
     * @param {unknown} args
     */
    test (args) {
      console.log(args);
    }
  }

  if (Scratch.extensions.unsandboxed) {
    // ...
  }

  Scratch.extensions.register(new Fetch());
})(Scratch);

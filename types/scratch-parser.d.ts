// Type definitions for scratch-parser
// Project: https://github.com/LLK/scratch-parser

/// <reference path="./jszip.d.ts" />

declare namespace ScratchParser {

}

/**
 * @param input The binary data representing the project or sprite.
 * @param isSprite True if this is a sprite, false if this is a project.
 * @param callback
 */
declare function ScratchParser(input: ArrayBuffer | string, isSprite: boolean, callback: (error: unknown, unpacked: [unknown, JSZip | null]) => void): void

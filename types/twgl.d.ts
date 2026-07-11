// Type definitions for twgl (rhymes with wiggle)
// Project: https://twgljs.org/

declare namespace twgl {
  interface BufferInfo {
    // TODO: returned by createBufferInfoFromArrays
    // might not be able to meaningfully type?
  }

  interface ProgramInfo {
    // TODO: returned by createProgramInfo
  }

  interface FrameBufferInfo {
    attachments: WebGLTexture[];
    framebuffer: WebGLFramebuffer;
    width: number;
    height: number;
  }

  interface M4 {
    // TODO
  }

  interface V3 {
    // TODO
  }
}

declare class twgl {
  createFramebufferInfo(...args: unknown[]): twgl.FrameBufferInfo;
  resizeFramebufferInfo(...args: unknown[]): void;
  createProgramInfo(...args: unknown[]): twgl.ProgramInfo;
  createBufferInfoFromArrays(...args: unknown[]): twgl.BufferInfo;
  createTexture(...args: unknown[]): WebGLTexture;
  setBuffersAndAttributes(...args: unknown[]): void;
  setUniforms(...args: unknown[]): void;
  drawBufferInfo(...args: unknown[]): void;
}

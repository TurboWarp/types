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

declare namespace ScratchStorage {
  interface Asset {
    // TODO
  }
}

declare class ScratchStorage {
  // TODO
}

/**
 * Modified version of ScratchStorage used by scratch-gui.
 */
declare class GUIScratchStorage extends ScratchStorage {
  projectToken?: string;
  setProjectToken(token: string): void;
}

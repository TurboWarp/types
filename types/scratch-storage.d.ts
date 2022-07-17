declare namespace ScratchStorage {
  interface Asset {
    // TODO
  }
}

declare class ScratchStorage {
  // TODO
}

declare class GUIScratchStorage extends ScratchStorage {
  projectToken?: string;
  setProjectToken(token: string): void;
}

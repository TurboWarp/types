// Type definitions for scratch-storage
// Project: https://github.com/LLK/scratch-storage

declare namespace ScratchStorage {
  enum DataFormat {
    JPG = 'jpg',
    JSON = 'json',
    MP3 = 'mp3',
    PNG = 'png',
    SB2 = 'sb2',
    SB3 = 'sb3',
    SVG = 'svg',
    WAV = 'wav'
  }

  interface AssetType {
    contentType: string;
    name: string;
    runtimeFormat: DataFormat;
    immutable: true;
  }
  namespace AssetType {
    const ImageBitmap: AssetType;
    const ImageVector: AssetType;
    const Project: AssetType;
    const Sound: AssetType;
    const Sprite: AssetType;
  }

  class Asset {
    constructor(assetType: AssetType, assetId: string, dataFormat: DataFormat | null, data: ArrayBuffer, generateId?: boolean);

    assetType: AssetType;

    dataFormat: DataFormat;

    /**
     * MD5 of asset's data.
     */
    assetId: string;

    setData(data: ArrayBuffer, dataFormat: DataFormat, generateId?: boolean): void;
    encodeTextData(text: string, dataFormat: DataFormat, generateId?: boolean): void;

    decodeText(): string;
    encodeDataURI(contentType?: string): string;

    /**
     * @deprecated Unused.
     */
    dependencies: [];
  }

  type UrlFunction = (asset: Asset) => string;

  interface Helper {
    load(assetType: AssetType, assetId: string, dataFormat: DataFormat): Promise<Asset>;
    store(assetType: AssetType, dataFormat: DataFormat, data: ArrayBuffer, assetId: string): Promise<unknown>;
  }
}

declare class ScratchStorage {
  get Asset(): typeof ScratchStorage.Asset;
  get AssetType(): typeof ScratchStorage.AssetType;
  get DataFormat(): typeof ScratchStorage.DataFormat;

  _helpers: ScratchStorage.Helper[];
  addHelper(helper: ScratchStorage.Helper, priority?: number): void;

  /**
   * Synchronously get a cached asset.
   */
  get(assetId: string): ScratchStorage.Asset | null;

  cache(assetType: ScratchStorage.AssetType, dataFormat: ScratchStorage.DataFormat, data: ArrayBuffer, assetId: string): string;

  load(assetType: ScratchStorage.AssetType, assetId: string, dataFormat: ScratchStorage.DataFormat): Promise<ScratchStorage.Asset | null>;

  store(assetType: ScratchStorage.Asset, dataFormat: ScratchStorage.DataFormat, data: ArrayBuffer, assetId: string): Promise<unknown>;

  createAsset(assetType: ScratchStorage.AssetType, dataFormat: ScratchStorage.DataFormat, data: ArrayBuffer, assetId: null, generateId: true): ScratchStorage.Asset;
  createAsset(assetType: ScratchStorage.AssetType, dataFormat: ScratchStorage.DataFormat, data: ArrayBuffer, assetId: string, generateId?: boolean): ScratchStorage.Asset;

  addWebStore(types: ScratchStorage.AssetType[], getFunction: ScratchStorage.UrlFunction, createFunction?: ScratchStorage.UrlFunction, updateFunction?: ScratchStorage.UrlFunction): void;

  /**
   * @deprecated Use addWebStore instead.
   */
  addWebSource(types: ScratchStorage.AssetType[], getFunction: ScratchStorage.UrlFunction): void;
}

/**
 * Modified version of ScratchStorage used by scratch-gui.
 */
declare class GUIScratchStorage extends ScratchStorage {
  projectToken?: string;
  setProjectToken(token: string): void;
}

// Type definitions for scratch-vm
// Project: https://github.com/LLK/scratch-vm

/// <reference path="./events.d.ts" />
/// <reference path="./immutable.d.ts" />
/// <reference path="./jszip.d.ts" />
/// <reference path="./scratch-render.d.ts" />
/// <reference path="./scratch-audio.d.ts" />
/// <reference path="./scratch-storage.d.ts" />
/// <reference path="./scratch-svg-renderer.d.ts" />

declare namespace VM {
  /**
   * Indicates the type is dependent on the existence of a renderer.
   */
  type IfRenderer<HasRenderer, NoRenderer> = HasRenderer;

  /**
   * Indicates the type is dependent on the existence of an audio engine.
   */
  type IfAudioEngine<HasAudioEngine, NoAudioEngine> = HasAudioEngine;

  /**
   * Indicates thte type is dependent on the existence of an attached storage.
   */
  type IfStorage<HasStorage, NoStorage> = HasStorage;

  /**
   * Indicates the type is dependent of whether the VM is attached to scratch-gui.
   */
  type IfGui<HasGui, NoGui> = HasGui;

  type ScratchCompatibleValue = string | boolean | number;
  type ScratchList = ScratchCompatibleValue[];
  type VariableValue = ScratchCompatibleValue | ScratchList;

  interface BaseAsset {
    /**
     * The md5 of this asset.
     */
    assetId: string;

    /**
     * The md5 + file extension of this asset.
     */
    md5: string;

    name: string;

    asset: ScratchStorage.Asset;
  }

  interface Costume extends BaseAsset {
    dataFormat: 'svg' | 'png' | 'jpg';
    bitmapResolution: number;
    rotationCenterX: number;
    rotationCenterY: number;
    size: [number, number];
    skinId: number;
  }

  interface Sound extends BaseAsset {
    dataFormat: 'mp3' | 'wav';
    format: ''; // TODO
    rate: number;
    sampleCount: number;
    soundId: string;
  }

  interface Sprite {
    runtime: Runtime;
    blocks: Blocks;
    name: string;
    costumes: Costume[];
    sounds: Sound[];
    clones: RenderedTarget[];
    soundBank: AudioEngine.SoundBank | null;
  }

  interface Field {
    id: string | null;
    name: string;
    value: string;
  }

  interface Input {
    name: string;
    block: string;
    shadow: string | null;
  }

  interface BaseMutation {
    tagName: 'mutation';
    children: [];
  }

  /**
   * Found on blocks with an opcode of procedures_call
   */
  interface ProcedureCallMutation extends BaseMutation {
    proccode: string;

    /**
     * JSON-stringified list of strings.
     */
    argumentids: string;

    /**
     * JSON-stringified boolean.
     */
    warp: string;
  }

  /**
   * Found on blocks with an opcode of procedures_prototype
   */
  interface ProcedurePrototypeMutation extends ProcedureCallMutation {
    /**
     * JSON-stringified list of strings.
     */
    argumentdefaults: string;

    /**
     * JSON-stringified list of strings.
     */
    argumentnames: string;
  }

  interface Block {
    id: string;
    opcode: string;
    parent: string | null;
    next: string | null;
    shadow: boolean;
    topLevel: boolean;
    inputs: Record<string, Input>;
    fields: Record<string, Field>;
    mutation: null | ProcedureCallMutation | ProcedurePrototypeMutation;
  }

  interface Blocks {
    runtime: Runtime;

    _blocks: Record<string, Block>;

    getBlock(id: string): Block | undefined;

    getOpcode(id: string): string | null;

    getFields(id: string): object | null;

    getInputs(id: string): object | null;

    getProcedureDefinition(procedureCode: string): string | null;

    getProcedureParamNamesAndIds(procedureCode: string): [
      // Argument name
      string[],
      // Argument IDs
      string[]
    ];

    getProcedureParamNamesIdsAndDefaults(procedureCode: string): [
      // Argument names
      string[],
      // Argument IDs
      string[],
      // Argument defaults
      unknown[]
    ];

    duplicate(): Blocks;

    resetCache(): void;

    emitProjectChanged(): void;

    toXML(): string;

    forceNoGlow: boolean;
  }

  interface BaseVariable {
    id: string;
    name: string;
    isCloud: boolean;
    toXML(isLocal?: boolean): string;
  }

  const enum VariableType {
    Scalar = '',
    List = 'list',
    Broadcast = 'broadcast_msg'
  }

  interface ScalarVariable extends BaseVariable {
    type: '';
    value: ScratchCompatibleValue;
  }

  interface ListVariable extends BaseVariable {
    type: 'list';
    value: ScratchList;
    _monitorUpToDate?: boolean;
  }

  interface BroadcastVariable extends BaseVariable {
    type: 'broadcast_msg';

    /**
     * Always the same as name.
     */
    value: string;
  }

  type Variable = ScalarVariable | ListVariable | BroadcastVariable;

  interface Comment {
    id: string;
    blockId: string | null;
    minimized: boolean;
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }

  interface PostedSpriteInfo {
    force?: boolean;
    x?: number;
    y?: number;
    direction?: number;
    draggable?: boolean;
    rotationStyle?: VM.RotationStyle;
    visible?: boolean;
    size?: number;
  }

  const enum TextToSpeechVoice {
    Alto = 'ALTO',
    Tenor = 'TENOR',
    Squeak = 'SQUEAK',
    Giant = 'GIANT',
    Kitten = 'KITTEN'
  }

  interface CustomState {
    'Scratch.looks': {
      drawableId: null | number;
      skinId: null | number;
      onSpriteRight: boolean;
      text: string;
      type: RenderWebGL.TextBubbleType;
    };

    'Scratch.sound': {
      effects: {
        pitch: number;
        pan: number;
      };
    };

    'Scratch.music': {
      currentInstrument: number;
    };

    'Scratch.pen': {
      penDown: boolean;
      color: number;
      saturation: number;
      brightness: number;
      transparency: number;
      _shade: number;
      penAttributes: RenderWebGL.PenAttributes;
    };

    'Scratch.text2speech': {
      voiceId: TextToSpeechVoice;
    };

    'Scratch.videoSensing': {
      motionFrameNumber: number;
      motionAmount: number;
      motionDirection: number;
    };
  }

  interface BaseTarget extends EventEmitter<RenderedTargetEventMap> {
    runtime: Runtime;

    id: string;

    blocks: Blocks;

    variables: Record<string, Variable>;

    comments: Record<string, Comment>;

    createComment(id: string, blockId: string, text: string, x: number, y: number, width: number, height: number, minimized?: boolean): void;

    /**
     * Called by runtime when the green flag is pressed.
     */
    onGreenFlag(): void;

    getName(): string;

    lookupOrCreateVariable(id: string, name: string): ScalarVariable;

    lookupBroadcastMsg(id: string, name: string): BroadcastVariable | undefined;

    lookupBroadcastByInputValue(name: string): BroadcastVariable | undefined;

    /**
     * Look for a variable by its ID in this target.
     * If it doesn't exist in this target, will check if it exists in the stage target.
     * If it still doesn't exist, returns undefined.
     */
    lookupVariableById(id: string): Variable | undefined;

    lookupVariableByNameAndType(name: string): ScalarVariable | undefined;
    lookupVariableByNameAndType(name: string, type: '', skipStage?: boolean): ScalarVariable | undefined;
    lookupVariableByNameAndType(name: string, type: 'list', skipStage?: boolean): ListVariable | undefined;
    lookupVariableByNameAndType(name: string, type: 'broadcast_msg', skipStage?: boolean): BroadcastVariable | undefined;

    lookupOrCreateList(id: string, name: string): ListVariable;

    /**
     * Create a new variable. If the ID is already used, silently does nothing.
     * isCloud is ignored if the sprite is not the stage or if the cloud variable limit has been reached.
     */
    createVariable(id: string, name: string, type: VariableType, isCloud?: boolean): void;

    _customState: Partial<CustomState>;
    getCustomState<T extends keyof CustomState>(name: T): CustomState[T] | undefined;
    setCustomState<T extends keyof CustomState>(name: T, value: CustomState[T]): void;

    /**
     * Mirrors custom state.
     */
    soundEffects?: CustomState['Scratch.sound']['effects'];

    postSpriteInfo(spriteInfo: PostedSpriteInfo): void;

    dispose(): void;
  }

  const enum RotationStyle {
    AllAround = 'all-around',
    LeftRight = 'left-right',
    None = "don't rotate"
  }

  interface RenderedTargetEventMap {
    TARGET_MOVED: [RenderedTarget, number, number, boolean?];

    EVENT_TARGET_VISUAL_CHANGE: [RenderedTarget];
  }

  const enum Effect {
    // TODO: document ranges
    Color = 'color',
    Fisheye = 'fisheye',
    Whirl = 'whirl',
    Pixelate = 'pixelate',
    Mosaic = 'mosaic',
    Brightness = 'brightness',
    Ghost = 'ghost'
  }

  /**
   * @see {Renderer.Rectangle}
   */
  interface SimpleRectangle {
    left: number;
    right: number;
    top: number;
    bottom: number;
  }

  interface RenderedTarget extends BaseTarget {
    sprite: Sprite;

    renderer: IfRenderer<RenderWebGL, undefined>;

    drawableID: number;

    isOriginal: boolean;

    isStage: boolean;

    /**
     * Returns true if the target is not the stage and is not a clone.
     */
    isSprite(): boolean;

    x: number;

    y: number;

    /**
     * Update the sprite's position. The given coordinates may be fenced to make the target fit on screen.
     * Set force to true to force the sprite to move even if it's being dragged.
     */
    setXY(x: number, y: number, force?: boolean): void;

    keepInFence(newX: number, newY: number, fence?: SimpleRectangle): [number, number];

    /**
     * Direction in degrees. Defaults to 90 (right). Can be from -179 to 180.
     */
    direction: number;

    /**
     * Change the sprite's direction. The direction will be wrapped as needed to fit in the expected range.
     */
    setDirection(direction: number): void;

    rotationStyle: RotationStyle;

    setRotationStyle(rotationStyle: RotationStyle): void;

    _getRenderedDirectionAndScale(): {
      direction: number;

      /**
       * X scale then Y scale, both from 100.
       * A negative scale means that the target should be flipped on that axis.
       */
      scale: [number, number];
    };

    visible: boolean;

    setVisible(visible: boolean): void;

    /**
     * The sprite's size. Default is 100.
     */
    size: number;

    /**
     * Change the sprite's size. The given size may be fenced to make the target fit on screen and isn't negative.
     */
    setSize(size: number): void;

    getBounds(): IfRenderer<RenderWebGL.Rectangle, null>;

    getBoundsForBubble(): IfRenderer<RenderWebGL.Rectangle, null>;

    draggable: boolean;

    setDraggable(draggable: boolean): void;

    /**
     * The index of the current costume.
     */
    currentCostume: number;

    getCurrentCostume(): Costume;

    getCostumes(): Costume[];

    /**
     * Update the current costume index.
     * If index is not finite, it will be converted to 0.
     * If index is not in the list, it will wrap around.
     */
    setCostume(costumeIndex: number): void;

    addCostume(costume: Costume, index: number): void;

    /**
     * Rename the costume at a given index.
     * Will throw an error if the index is out of bounds.
     * If the new name is already used, it may be modified.
     */
    renameCostume(costumeIndex: number, newName: string): void;

    /**
     * Get the index of a costume with a given name.
     * If the costume doesn't exist, returns -1.
     */
    getCostumeIndexByName(name: string): number;

    /**
     * Delete the costume at a given index.
     * Returns the deleted costume if one exists at that index, otherwise null.
     */
    deleteCostume(costumeIndex: number): Costume | null;

    /**
     * Move the costume from one index to another.
     * Returns true if any change was made.
     */
    reorderCostume(costumeIndex: number, newIndex: number): boolean;

    getSounds(): Sound[];

    addSound(sound: Sound, index: number): void;

    /**
     * @see {renameCostume}
     */
    renameSound(soundIndex: number, name: string): void;

    /**
     * @see {deleteCostume}
     */
    deleteSound(soundIndex: number): Sound | null;

    /**
     * @see {reorderCostume}
     */
    reorderSound(soundIndex: number, newIndex: number): boolean;

    /**
     * Visual effects on the target. All default to 0.
     */
    effects: Record<Effect, number>;

    /**
     * Update the value of an effect.
     * @param effectName
     * @param value
     */
    setEffect(effectName: Effect, value: number): void;

    clearEffects(): void;

    isTouchingObject(object: '_mouse_' | '_edge_' | string): boolean;

    isTouchingPoint(x: number, y: number): boolean;

    isTouchingEdge(): boolean;

    isTouchingSprite(spriteName: string): boolean;

    /**
     * @param rgb RGB channels from [0-255]
     */
    isTouchingColor(rgb: [number, number, number]): boolean;

    /**
     * @param rgb RGB channels from [0-255]
     * @param mask RGB channels from [0-255]
     */
    colorIsTouchingColor(rgb: [number, number, number], mask: [number, number, number]): boolean;

    getLayerOrder(): IfRenderer<number, null>;

    /**
     * Make sure this target is not the stage before calling this method.
     */
    goToFront(): void;

    /**
     * Make sure this target is not the stage before calling this method.
     */
    goToBack(): void;

    /**
     * Make sure this target is not the stage before calling this method.
     */
    goForwardLayers(layers: number): void;

    /**
     * Make sure this target is not the stage before calling this method.
     */
    goBackwardLayers(layers: number): void;

    /**
     * Make sure this target and the target being moved behind are not the stage before calling this method.
     */
    goBehindOther(other: RenderedTarget): void;

    /**
     * Defaults to 100.
     */
    volume: number;

    tempo: number;

    videoTransparency: number;


    /**
     * Create a clone of this sprite if the clone limit has not been reached.
     */
    makeClone(): RenderedTarget | null;

    duplicate(): Promise<RenderedTarget>;

    startDrag(): void;

    stopDrag(): void;

    /**
     * Called by the runtime when the project is stopped.
     */
    onStopAll(): void;

    updateAllDrawableProperties(): void;

    toJSON(): SerializedTarget;
  }

  // These types are intended for use in a browser environment where a base Target can never be created as
  // all targets are RenderedTarget.
  type Target = RenderedTarget;

  interface SerializedTarget {
    // TODO
  }

  interface StackFrame {
    isLoop: boolean;
    warpMode: boolean;
    justReported: unknown;
    reporting: string;
    reported: unknown;
    /** @deprecated unused */
    waitingReporter: unknown;
    params: unknown;
    executionContext: unknown;
    reset(): void;
  }

  interface BlockUtility {
    sequencer: Sequencer;
    thread: Thread;
    _nowObj: {
      now(): number;
    };
    nowObj: BlockUtility['_nowObj'],
    target: Target;
    runtime: Runtime;
    stackFrame: StackFrame;
    stackTimerFinished(): boolean;
    stackTimerNeedsInit(): boolean;
    startStackTimer(milliseconds: number): void;
    yield(): void;
    yieldTick(): void;
    startBranch(branchNumber: number, isLoop: boolean): void;
    /**
     * @see {Runtime.stopAll}
     */
    stopAll(): void;
    /**
     * @see {Runtime.stopForTarget}
     */
    stopOtherTargetThreads(): void;
    /**
     * @see {Thread.stopThisScript}
     */
    stopThisScript(): void;
    /**
     * @see {Blocks.getProcedureParamNamesAndIds}
     */
    getProcedureParamNamesAndIds(): [string[], string[]];
    /**
     * @see {Blocks.getProcedureParamNamesIdsAndDefaults}
     */
    getProcedureParamNamesIdsAndDefaults(): [string[], string[], string[]];
    /**
     * @see {Thread.initParams}
     */
    initParams(): void;
    /**
     * @see {Thread.pushParam}
     */
    pushParam(name: string, value: ScratchCompatibleValue): void;
    /**
     * @see {Thread.getParam}
     */
    getParam(name: string): ScratchCompatibleValue;
    /**
     * Use instead of runtime.startHats inside blocks.
     * @see {Runtime.startHats}
     */
    startHats: Runtime['startHats'];
    ioQuery<Device extends keyof IODevices>(device: Device, func: keyof IODevices[Device], args: unknown[]): unknown;
  }

  const enum ThreadStatus {
    STATUS_RUNNING = 0,
    STATUS_PROMISE_WAIT = 1,
    STATUS_YIELD = 2,
    STATUS_YIELD_TICK = 3,
    STATUS_DONE = 4
  }

  interface Thread {
    topBlock: string;
    stack: string[];
    stackFrames: StackFrame[];
    status: ThreadStatus;
    isKilled: boolean;
    target: Target;
    blockContainer: Blocks;
    requestScriptGlowInFrame: boolean;
    blockGlowInFrame: string | null;
    warpTimer: Timer | null;
    justReported: unknown;
    reuseStackForNextBlock(blockId: string): void;
    pushStack(blockId: string): void;
    popStack(): string;
    peekStack(): string;
    peekStackFrame(): StackFrame | null;
    peekParentStackFrame(): StackFrame | null;
    pushReportedValue(value: ScratchCompatibleValue): void;
    initParams(): void;
    pushParam(name: string, value: ScratchCompatibleValue): void;
    getParam(name: string): ScratchCompatibleValue | null;
    atStackTop(): boolean;
    goToNextBlock(): void;
    stopThisScript(): void;
    isRecursiveCall(procedureCode: string): boolean;
    stackClick: boolean;
    updateMonitor: boolean;
  }

  interface HatInfo {
    edgeActivated?: boolean;
    restartExistingThreads?: boolean;
  }

  interface ExtensionInfo {
    // TODO
  }

  interface Peripheral {
    // TODO
  }

  interface Profiler {
    // TODO
  }

  interface ProfilerFrame {
    // TODO
  }

  interface Sequencer {
    timer: Timer;
    runtime: Runtime;
    activeThread: Thread | null;
    stepThreads(): void;
    stepThread(thread: Thread): void;
    stepToBranch(thread: Thread, branch: number, isLoop: boolean): void;
    stepToProcedure(thread: Thread, procedureCode: string): void;
    retireThread(thread: Thread): void;
  }

  interface ImportedExtensionsInfo {
    extensionIDs: string[];
    extensionURLs: string[];
  }

  interface ExtensionManager {
    runtime: Runtime;

    refreshBlocks(): Promise<void[]>;

    isExtensionLoaded(extensionID: string): boolean;

    /**
     * Load a builtin extension.
     * Logs a warning if the extension is already loaded or could not be found.
     */
    loadExtensionIdSync(extensionID: string): void;

    /**
     * Load a remote extension. Does not work on scratch.mit.edu.
     */
    loadExtensionURL(extensionID: string): Promise<number>;
  }

  /**
   * Timer operates on milliseconds.
   */
  interface Timer {
    startTime: number;

    time(): number;

    relativeTime(): number;

    start(): void;

    timeElapsed(): number;

    /**
     * @see {window.setTimeout}
     */
    setTimeout(callback: () => void, timeoutMS: number): number;

    /**
     * @see {window.clearTImeout}
     */
    clearTimeout(timeoutID: number): void;
  }

  interface Clock {
    _projectTimer: Timer;

    _paused: boolean;

    _pausedTime: number | null;

    runtime: Runtime;

    /**
     * Project's current time in seconds.
     */
    projectTimer(): number;

    pause(): void;

    resume(): void;

    resetProjectTimer(): void;
  }

  interface CloudProvider {
    createVariable(name: string, value: ScratchCompatibleValue): void;
    updateVariable(name: string, value: ScratchCompatibleValue): void;
    renameVariable(oldName: string, newName: string): void;
    deleteVariable(name: string): void;
    requestCloseConnection(): void;
  }

  interface CloudVariableUpdate {
    name: string;
    value: ScratchCompatibleValue;
  }

  interface CloudData {
    varUpdate: CloudVariableUpdate;
  }

  interface Cloud {
    runtime: Runtime;
    provider: CloudProvider | null;
    setProvider(provider: CloudProvider | null): void;
    stage: Target | null;
    setStage(stage: Target | null): void;
    postData(data: CloudData): void;
    requestCreateVariable(variable: ScalarVariable): void;
    requestUpdateVariable(name: string, value: ScratchCompatibleValue): void;
    requestRenameVariable(oldName: string, newName: string): void;
    requestDeleteVariable(name: string): void;
    updateCloudVariable(varUpdate: CloudVariableUpdate): void;
    clear(): void;
  }

  interface KeyboardData {
    key: string;
    isDown: boolean;
  }

  interface Keyboard {
    runtime: Runtime;
    postData(data: KeyboardData): void;
    _keyStringToScratchKey(key: string): string;
    _keyArgToScratchKey(key: string | number): string;
    getKeyIsDown(key: string | number): boolean;
  }

  interface MouseData {
    x?: number;
    y?: number;
    canvasWidth?: number;
    canvasHeight?: number;
    isDown?: boolean;
  }

  interface Mouse {
    runtime: Runtime;
    _clientX: number;
    _clientY: number;
    getClientX(): number;
    getClientY(): number;
    _scratchX: number;
    _scratchY: number;
    getScratchX(): number;
    getScratchY(): number;
    _isDown: boolean;
    getIsDown(): boolean;
    postData(data: MouseData): void;
    _activateClickHats(target: Target): void;
    _pickTarget(x: number, y: number): Target;
  }

  interface MouseWheelData {
    deltaY: number;
  }

  interface MouseWheel {
    runtime: Runtime;
    postData(data: MouseWheelData): void;
  }

  interface UserDataData {
    username: string;
  }

  interface UserData {
    _username: string;
    getUsername(): string;
    postData(data: UserData): void;
  }

  interface VideoProvider {
    // TODO
  }

  interface VideoData {
    // TODO
  }

  interface Video {
    // TODO
    postData(data: VideoData): void;
  }

  interface IODevices {
    clock: Clock;
    cloud: Cloud;
    keyboard: Keyboard;
    mouse: Mouse;
    mouseWheel: MouseWheel;
    userData: UserData;
    video: Video;
  }

  interface RuntimeAndVirtualMachineEventMap {
    SCRIPT_GLOW_ON: [{
      id: string;
    }];

    SCRIPT_GLOW_OFF: [{
      id: string;
    }];

    BLOCK_GLOW_ON: [{
      id: string;
    }];

    BLOCK_GLOW_OFF: [{
      id: string
    }];

    PROJECT_START: [{
      id: string;
      value: string;
    }];

    PROJECT_RUN_START: [];

    PROJECT_RUN_STOP: [];

    PROJECT_CHANGED: [];

    VISUAL_REPORT: [{
      id: string;
      value: string;
    }];

    MONITORS_UPDATE: [OrderedMap];

    BLOCK_DRAG_UPDATE: [
      // Are blocks over GUI?
      boolean
    ];

    BLOCK_DRAG_END: [
      // Blocks being dragged to the GUI
      unknown[],
      // Original ID of top block being dragged
      string
    ];

    EXTENSION_ADDED: [ExtensionInfo];

    EXTENSION_FIELD_ADDED: [{
      name: string;
      implementation: unknown;
    }];

    BLOCKSINFO_UPDATE: [ExtensionInfo];

    // TODO: is this number or string?
    PERIPHERAL_LIST_UPDATE: [Record<number, Peripheral>];

    // TODO: is this number or string?
    USER_PICKED_PERIPHERAL: [Record<number, Peripheral>];

    PERIPHERAL_CONNECTED: [];

    PERIPHERAL_DISCONNECTED: [];

    PERIPHERAL_REQUEST_ERROR: [{
      message: string;
      extensionId: string;
    }];

    PERIPHERAL_CONNECTION_LOST_ERROR: [{
      message: string;
      extensionId: string;
    }];

    PERIPHERAL_SCAN_TIMEOUT: [];

    MIC_LISTENING: [
      // Is the mic listening?
      boolean
    ];

    RUNTIME_STARTED: [];

    RUNTIME_STOPPED: [];

    HAS_CLOUD_DATA_UPDATE: [
      // Has cloud data?
      boolean
    ];
  }

  interface RuntimeEventMap extends RuntimeAndVirtualMachineEventMap {
    PROJECT_STOP_ALL: [];

    STOP_FOR_TARGET: [
      // Target whose scripts are being stopped
      Target,
      // Optional thread exception to keep running
      Thread | undefined
    ];

    PROJECT_LOADED: [];

    RUNTIME_DISPOSED: [];

    TARGETS_UPDATE: [
      // Whether to emit project changed
      boolean
    ];

    BLOCKS_NEED_UPDATE: [];

    TOOLBOX_EXTENSIONS_NEED_UPDATE: [];

    targetWasCreated: [
      // The new target
      Target,
      // The original target, if any. This will be set for clones.
      Target?
    ];

    targetWasRemoved: [Target];

    SAY: [Target, 'say' | 'think', string];

    QUESTION: [string | null];

    ANSWER: [string];
  }

  interface Runtime extends EventEmitter<RuntimeEventMap> {
    /**
     * Start the runtime's event loop. This doesn't start any scripts.
     */
    start(): void;

    /**
     * Stop all timers.
     */
    quit(): void;

    /**
     * Start "when green flag pressed" scripts.
     */
    greenFlag(): void;

    /**
     * Press the stop sign.
     */
    stopAll(): void;

    /**
     * The event loop function.
     */
    _step(): void;

    turboMode: boolean;

    /**
     * If true, the runtime is running at 60 FPS. If false, the runtime is running at 30 FPS.
     */
    compatibilityMode: boolean;

    renderer: IfRenderer<RenderWebGL, undefined>;

    attachRenderer(renderer: RenderWebGL): void;

    audioEngine: IfAudioEngine<AudioEngine, undefined>;

    attachAudioEngine(audioEngine: AudioEngine): void;

    v2BitmapAdapter?: ScratchSVGRenderer.BitmapAdapter;

    attachV2BitmapAdapter(bitmapAdapter: ScratchSVGRenderer.BitmapAdapter): void;

    storage: IfGui<GUIScratchStorage, ScratchStorage>;

    attachStorage(storage: ScratchStorage): void;

    targets: Target[];

    executableTargets: Target[];

    addTarget(target: Target): void;

    moveExecutable(target: Target, delta: number): void;

    setExecutablePosition(target: Target, newIndex: number): void;

    removeExecutable(target: Target): void;

    disposeTarget(target: Target): void;

    stopForTarget(target: Target): void;

    /**
     * Returns the target that is the stage.
     * Returns undefined if called before the project has loaded or if the stage has somehow been removed.
     */
    getTargetForStage(): Target | undefined;

    /**
     * Look up a target by its ID.
     * Returns undefined if the target doesn't exist.
     */
    getTargetById(targetId: string): Target | undefined;

    /**
     * Find a sprite's original target (not a clone or stage) using the sprite's name.
     * Returns undefined if the target doesn't exist.
     */
    getSpriteTargetByName(spriteName: string): Target | undefined;

    /**
     * Look up a target by it's drawable ID.
     * Returns undefined if the target doesn't exist.
     */
    getTargetByDrawableId(drawableID: number): Target | undefined;

    /**
     * Emit a targetWasCreated event.
     */
    fireTargetWasCreated(newTarget: Target, oldTarget?: Target): void;

    /**
     * Emit a targetWasRemoved event.
     */
    fireTargetWasRemoved(target: Target): void;

    threads: Thread[];

    _pushThread(topBlockId: string, target: Target, options?: {
      stackClick?: boolean;
      updateMonitor?: boolean;
    }): Thread;

    _stopThread(thread: Thread): void;

    _restartThread(thread: Thread): void;

    /**
     * A thread is considered active if it is in the thread list and is not STATUS_DONE.
     */
    isActiveThread(thread: Thread): boolean;

    /**
     * A thread is considered waiting if:
     *  - It is in STATUS_PROMISE_WAIT, or
     *  - It is in STATUS_YIELD_TICK, or
     *  - It is not considered active
     * @see {isActiveThread}
     */
    isWaitingThread(thread: Thread): boolean;

    _getMonitorThreadCount(threads: Thread[]): number;

    startHats(opcode: string, matchFields?: Record<string, unknown>, target?: Target): Thread[];

    toggleScript(topBlockId: string, options?: {
      target?: string;
      stackClick?: boolean;
    }): void;

    allScriptsDo(callback: (blockId: string, target: Target) => void, target?: Target): void;

    allScriptsByOpcodeDo(opcode: string, callback: (blockId: string, target: Target) => void, target?: Target): void;

    sequencer: Sequencer;

    flyoutBlocks: Blocks;

    monitorBlocks: Blocks;

    visualReport(blockId: string, value: any): void;

    _primitives: Record<string, Function>;

    getOpcodeFunction(opcode: string): Function;

    getLabelForOpcode(opcode: string): {
      category: 'extension';
      label: string;
    } | undefined;

    getBlocksXML(target?: Target): Array<{
      id: string;
      xml: string;
    }>;

    _blockInfo: ExtensionInfo[];

    _hats: Record<string, HatInfo>;

    getIsHat(opcode: string): boolean;

    getIsEdgeActivatedHat(opcode: string): boolean;

    _cloneCounter: number;

    changeCloneCounter(changeAmount: number): void;

    clonesAvailable(): boolean;

    /**
     * The time of a step, measured in milliseconds. null if accessed before the project has started.
     */
    currentStepTime: number | null;

    /**
     * Interval ID returned by setInterval(). null if accessed before the project has started.
     */
    _steppingInterval: number | null;

    redrawRequested: boolean;

    requestRedraw(): void;

    currentMSecs: number;

    updateCurrentMSecs(): void;

    ioDevices: IODevices;

    /**
     * Returns true if the runtime's cloud variable counter is non-zero.
     */
    hasCloudData(): boolean;

    /**
     * Returns true if the runtime's cloud variable counter is under the limit.
     */
    canAddCloudVariable(): boolean;

    /**
     * Returns the value of the runtime's cloud variable counter.
     */
    getNumberOfCloudVariables(): number;

    /**
     * Increment the value of the runtime's cloud variable counter.
     * Check the value before you call this method; it will let the counter go above the limit.
     * This method does not actually create a new cloud variable.
     */
    addCloudVariable(): void;

    /**
     * Decrement the value of the runtime's cloud variable counter.
     * Check the value before you call this method; it will let the counter go under 0.
     * This method does not actually remove a cloud variable.
     */
    removeCloudVariable(): void;

    createNewGlobalVariable(variableName: string): ScalarVariable;
    createNewGlobalVariable(variableName: string, variableId: string): ScalarVariable;
    createNewGlobalVariable(variableName: string, variableId: string, type: ''): ScalarVariable;
    createNewGlobalVariable(variableName: string, variableId: string, type: 'list'): ListVariable;
    createNewGlobalVariable(variableName: string, variableId: string, type: 'broadcast_msg'): BroadcastVariable;

    getAllVarNamesOfType(variableType: VariableType): string[];

    origin: string | null;

    /**
     * Remove everything from the Runtime.
     */
    dispose(): void;

    requestTargetsUpdate(target: Target): void;

    requestBlocksUpdate(): void;

    requestToolboxExtensionsUpdate(): void;

    emitProjectLoaded(): void;

    emitProjectChanged(): void;

    _editingTarget: Target | null;
    getEditingTarget(): Target | null;

    setEditingTarget(target: Target): void;

    scanForPeripheral(extensionID: string): void;

    connectPeripheral(extensionID: string, peripheralId: number): void;

    disconnectPeripheral(extensionID: string): void;

    getPeripheralIsConnected(extensionID: string): boolean;

    profiler: Profiler | null;
    enableProfiling(callback: (profilerFrame: ProfilerFrame) => void): void;
    disableProfiling(): void;
  }

  interface VirtualMachineEventMap extends RuntimeAndVirtualMachineEventMap {
    TURBO_MODE_ON: [];

    TURBO_MODE_OFF: [];

    targetsUpdate: [{
      targetList: SerializedTarget[];
      editingTarget: string | null;
    }];

    workspaceUpdate: [{
      xml: string;
    }];

    playgroundData: [{
      blocks: Blocks;
      // Stringified JSON of Thread[]
      thread: string;
    }];
  }
}

declare class VM extends EventEmitter<VM.VirtualMachineEventMap> {
  constructor();

  runtime: VM.Runtime;

  renderer: VM.IfRenderer<RenderWebGL, undefined>;

  /**
   * @see {VM.Runtime.attachRenderer}
   */
  attachRenderer(renderer: RenderWebGL): void;

  /**
   * @see {VM.Runtime.attachAudioEngine}
   */
  attachAudioEngine(audioEngine: AudioEngine): void;

  /**
   * @deprecated Does nothing.
   */
  attachV2SVGAdapter(): void;

  /**
   * @see {VM.Runtime.attachV2BitmapAdapter}
   */
  attachV2BitmapAdapter(bitmapAdapter: ScratchSVGRenderer.BitmapAdapter): void;

  /**
   * @see {VM.Runtime.attachStorage}
   */
  attachStorage(storage: ScratchStorage): void;

  extensionManager: VM.ExtensionManager;

  /**
   * @see {VM.Runtime.start}
   */
  start(): void;

  /**
   * @see {VM.Runtime.quit}
   */
  quit(): void;

  /**
   * @see {VM.Runtime.greenFlag}
   */
  greenFlag(): void;

  /**
   * Changes whether the runtime is in turbo mode or not.
   * Emits either TURBO_MODE_ON or TURBO_MODE_OFF.
   * @param turboMode whether turbo mode should be enabled
   */
  setTurboMode(turboMode: boolean): void;

  /**
   * Changes whether the runtime is in "compatibility mode" (true by default)
   * Compatibility mode sets the runtime's framerate to 30 FPS. Disabling it sets the framerate to 60 FPS.
   * @param compatibilityMode
   */
  setCompatibilityMode(compatibilityMode: boolean): void;

  /**
   * @see {Runtime.stopAll}
   */
  stopAll(): void;

  /**
   * Remove everything from the VM.
   */
  clear(): void;

  /**
   * Load a project.
   * @param input Compressed sb, sb2, sb3 or sb2 project.json or sb3 project.json.
   */
  loadProject(input: ArrayBufferView | ArrayBuffer | string | object): Promise<void>;

  /**
   * Load a project usings its ID from scratch.mit.edu.
   */
  downloadProjectId(id: string | number): Promise<void>;

  deserializeProject(json: object, zip?: JSZip): Promise<void>;

  installTargets(targets: VM.Target[], extensions: VM.ImportedExtensionsInfo, wholeProject: boolean): Promise<void>;

  /**
   * @deprecated
   * @see {loadProject}
   */
  fromJSON(input: ArrayBufferView | ArrayBuffer | string | object): Promise<void>;

  /**
   * the project to a compressed sb3 file.
   */
  saveProjectSb3(): Promise<Blob>;

  toJSON(targetId?: string): string;

  /**
   * @see {VM.Runtime.getEditingTarget}
   */
  editingTarget: VM.Target | null;

  /**
   * Change the editing target. If a target with the ID doesn't exist, silently does nothing.
   * @see {VM.Runtime.setEditingTarget}
   */
  setEditingTarget(targetId: string): void;

  getTargetIdForDrawableId(drawableId: number): string | null;

  /**
   * Updates the value of a variable.
   * Returns true if the target and variable were successfully found and updated, otherwise null.
   */
  setVariableValue(targetId: string, variableId: string, value: VM.VariableValue): boolean;

  getVariableValue(targetId: string, variableId: string): VM.VariableValue | null;

  assets: ScratchStorage.Asset[];

  /**
   * Export a specific sprite to a compressed sprite3 file.
   * @param targetId The ID of the target
   */
  exportSprite(targetId: string): Promise<Blob>;
  exportSprite(targetId: string, zipType: string): Promise<unknown>;

  /**
   * Gets the string representation of a costume.
   * For an SVG costume, returns the text.
   * For a PNG or JPG costume, returns a data URL.
   * If costume doesn't exist, returns null.
   */
  getCostume(costumeIndex: number): string | null;

  getSoundBuffer(soundIndex: number): AudioBuffer | null;

  /**
   * Loads a sprite from a compressed .sprite2 or .sprite3 or JSON.
   */
  addSprite(data: ArrayBufferView | ArrayBuffer | string | object): Promise<void>;

  addCostume(md5ext: string, costume?: VM.Costume, targetId?: string, version?: 2): Promise<void>;

  addCostumeFromLibrary(md5ext: string, costume: VM.Costume): Promise<void>;

  addBackdrop(md5ext: string, costume?: VM.Costume): Promise<void>;

  addSound(sound: VM.Sound, targetId?: string): Promise<void>;

  duplicateSprite(targetId: string): Promise<void>;

  duplicateCostume(costumeIndex: number): Promise<void>;

  duplicateSound(soundIndex: number): Promise<void>;

  updateSvg(costumeIndex: number, svg: string, rotationCenterX: number, rotationCenterY: number): void;

  updateBitmap(costumeIndex: number, bitmap: ImageData, rotationCenterX: number, rotationCenterY: number, bitmapResolution: number): void;

  /**
   * Update a sound.
   * @param soundIndex The index of the sound in the current sprite
   * @param buffer The new audio data
   * @param encodedWAV The data of an encoded WAV. If not provided, the new sound won't be saved if the project is exported.
   */
  updateSoundBuffer(soundIndex: number, buffer: AudioBuffer, encodedWAV?: ArrayBuffer): void;

  reorderTarget(targetId: string, newIndex: number): boolean;

  reorderCostume(targetId: string, costumeIndex: number, newIndex: number): boolean;

  reorderSound(targetId: string, soundIndex: number, newIndex: number): boolean;

  renameSprite(targetId: string, newName: string): void;

  renameCostume(costumeIndex: number, newName: string): void;

  renameSound(soundIndex: number, newName: string): void;

  /**
   * Deletes the target with the given ID and any of its clones.
   * @returns If a sprite was deleted, returns a function to undo the deletion.
   */
  deleteSprite(targetId: string): (() => void) | null;

  /**
   * Deletes the costume at a given index int he editing target.
   * @returns If a costume was deleted, returns a function to undo the deletion.
   */
  deleteCostume(costumeIndex: number): (() => void) | null;

  /**
   * Deletes the sound at a given index in the editing target.
   * @returns If a sound was deleted, returns a function to undo the deletion.
   */
  deleteSound(soundIndex: number): (() => void) | null;

  /**
   * Returns a promise that resolves when all required extensions have been imported.
   */
  shareBlocksToTarget(blocks: VM.Block[], targetId: string, fromTargetId?: string): Promise<void>;

  /**
   * Share a costume from the editing target to another target.
   */
  shareCostumeToTarget(costumeIndex: number, targetId: string): Promise<void>;

  /**
   * Share a sound from the editing target to another target.
   */
  shareSoundToTarget(soundIndex: number, targetId: string): Promise<void>;

  refreshWorkspace(): void;

  /**
   * Emit a targetsUpdate event about the current target information.
   * @param shouldTriggerProjectChange Whether a PROJECT_CHANGED event should be emitted. Defaults to true.
   */
  emitTargetsUpdate(shouldTriggerProjectChange?: boolean): void;

  /**
  * Emit a workspaceUpdate event.
  */
  emitWorkspaceUpdate(): void;

  /**
   * Post sprite info to the target that's being dragged, otherwise the editing target.
   * @see {VM.Target.postSpriteInfo}
   */
  postSpriteInfo(spriteInfo: VM.PostedSpriteInfo): void;

  /**
   * The target that's currently being dragged, if any.
   */
  _dragTarget: VM.Target | null;

  startDrag(targetId: string): void;

  stopDrag(targetId: string): void;

  postIOData(device: 'cloud', data: VM.CloudData): void;
  postIOData(device: 'keyboard', data: VM.KeyboardData): void;
  postIOData(device: 'mouse', data: VM.MouseData): void;
  postIOData(device: 'mouseWheel', data: VM.MouseWheelData): void;
  postIOData(device: 'userData', data: VM.UserDataData): void;
  postIOData(device: 'video', data: VM.VideoData): void;

  setVideoProvider(videoProvider: VM.VideoProvider): void;

  setCloudProvider(cloudProvider: VM.CloudProvider): void;

  /**
   * @see {VM.Runtime.scanForPeripheral}
   */
  scanForPeripheral(extensionID: string): void;

  /**
   * @see {VM.Runtime.connectPeripheral}
   */
  connectPeripheral(extensionID: string, peripheralId: number): void;

  /**
   * @see {VM.Runtime.disconnectPeripheral}
   */
  disconnectPeripheral(extensionID: string): void;

  /**
   * @see {VM.Runtime.getPeripheralIsConnected}
   */
  getPeripheralIsConnected(extensionID: string): boolean;
}

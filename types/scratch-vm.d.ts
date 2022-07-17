// Type definitions for scratch-vm
// Project: https://github.com/LLK/scratch-vm

declare namespace VM {
  type ScratchCompatibleValue = string | boolean | number;

  interface Costume {
    // TODO
  }

  interface Sound {
    // TODO
  }

  interface Sprite {
    runtime: Runtime;

    blocks: Blocks;

    name: string;

    costumes: Costume[];

    sounds: Sound[];
  }

  interface Block {
    // TODO
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
    value: ScratchCompatibleValue[];
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
    // TODO
  }

  interface BaseTarget extends EventEmitter<{}> {
    runtime: Runtime;

    id: string;

    blocks: Blocks;

    variables: Record<string, Variable>;

    comments: Record<string, Comment>;

    _customState: Record<string, unknown>;

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

    dispose(): void;
  }

  const enum RotationStyle {
    AllAround = 'all-around',
    LeftRight = 'left-right',
    None = "don't rotate"
  }

  interface RenderedTargetEventMap {
    // TODO
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

    renderer: RenderWebGL;

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

    getBounds(): RenderWebGL.Rectangle;

    getBoundsForBubble(): RenderWebGL.Rectangle;

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

    getLayerOrder(): number;

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

    toJSON(): SerializedTarget;
  }

  // These types are intended for use in a browser environment where a base Target can never be created as
  // all targets are RenderedTarget.
  type Target = RenderedTarget;

  interface SerializedTarget {
    // TODO
  }

  interface Thread {
    // TODO
  }

  interface HatInfo {
    // TODO
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

  interface Sequencer {
    // TODO
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

    VISUAL_REPORT: [];

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

    STOP_FOR_TARGET: [BaseTarget, Thread | undefined];

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
  }

  interface Runtime extends EventEmitter<RuntimeEventMap> {
    /**
     * Start the runtime's event loop. This doesn't start any scripts.
     */
    start(): void;

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

    targets: Target[];

    executableTargets: Target[];

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
     * Find a sprite's original target (not a clone) using the sprite's name.
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

    sequencer: Sequencer;

    flyoutBlocks: Blocks;

    monitorBlocks: Blocks;

    visualReport(blockId: string, value: any): void;

    _primitives: Record<string, Function>;

    _blockInfo: ExtensionInfo[];

    _hats: Record<string, HatInfo>;

    getIsHat(opcode: string): boolean;

    getIsEdgeActivatedHat(opcode: string): boolean;

    _cloneCounter: number;

    changeCloneCounter(changeAmount: number): void;

    clonesAvailable(): boolean;

    currentStepTime: number;

    redrawRequested: boolean;

    requestRedraw(): void;

    currentMSecs: number;

    updateCurrentMSecs(): void;

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

    profiler: Profiler | null;
    enableProfiling(callback: (profilerFrame: unknown) => void): void;
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

  /**
   * @see {Runtime.start}
   */
  start(): void;

  /**
   * @see {Runtime.greenFlag}
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
   * Send data to one of the runtime's IO devices.
   * If the device doesn't exist, silently does nothing.
   * @param device The name of the device to send data to.
   * @param data The data to be sent. Type depends on the device being sent data.
   * TODO: type this better
   */
  postIOData(device: string, data: unknown): void;

  /**
   * Load a project.
   * @param input Compressed sb, sb2, sb3 or sb2 project.json or sb3 project.json.
   */
  loadProject(input: ArrayBufferView | ArrayBuffer | string | object): Promise<void>;

  /**
   * @deprecated
   * @see {loadProject}
   */
  fromJSON(input: ArrayBufferView | ArrayBuffer | string | object): Promise<void>;

  /**
   * the project to a compressed sb3 file.
   */
  saveProjectSb3(): Promise<Blob>;

  /**
   * a specific sprite to a compressed sprite3 file.
   * @param targetId The ID of the target
   */
  exportSprite(targetId: string): Promise<Blob>;
  exportSprite(targetId: string, zipType: string): Promise<unknown>;

  toJSON(targetId?: string): string;

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
   * The target open in the editor. This will be null before a project has loaded.
   */
  editingTarget: VM.Target | null;
}

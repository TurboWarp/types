// Type definitions for scratch-gui redux state and events
// Project: https://github.com/LLK/scratch-gui

/// <reference path="./react.d.ts" />
/// <reference path="./immutable.d.ts" />
/// <reference path="./scratch-paint.ts" />
/// <reference path="./scratch-vm.d.ts" />

declare namespace ScratchGUI {
  interface ReduxState extends ScratchPaint.ReduxState {
    scratchGui: ScratchGUIState;
    locales: LocaleState;
    session: SessionState;
  }
  type ReduxEvent = ScratchGUIEvent | LocaleEvent | ScratchPaint.ReduxEvent;

  const enum AlertType {
    Standard = 'STANDARD',
    Extension = 'EXTENSION',
    Inline = 'INLINE'
  }

  const enum AlertLevel {
    Success = 'success',
    Info = 'info',
    Warning = 'warn'
  }

  const enum Alert {
    CreateSuccess = 'createSuccess',
    CreateCopySuccess = 'createCopySuccess',
    CreateRemixSuccess = 'createRemixSuccess',
    Creating = 'creating',
    CreatingCopy = 'creatingCopy',
    CreatingRemix = 'creatingRemix',
    CreatingError = 'creatingError',
    SavingError = 'savingError',
    SaveSuccess = 'saveSuccess',
    Saving = 'saving',
    CloudInfo = 'cloudInfo',
    ImportingAsset = 'importingAsset'
  }

  // Not going to bother listing all of the IDs here.
  type Deck = string;

  const enum DragType {
    Costume = 'COSTUME',
    Sound = 'SOUND',
    Sprite = 'SPRITE'
  }

  type DragPayload = VM.Costume | VM.Sound;

  const enum StageDisplaySize {
    Large = 'large',
    Small = 'small',
    LargeConstrained = 'largeConstrained'
  }

  const enum Menu {
    About = 'aboutMenu',
    Account = 'accountMenu',
    File = 'fileMenu',
    Edit = 'editMenu',
    Language = 'languageMenu',
    Login = 'loginMenu'
  }

  const enum Modal {
    BackdropLibrary = 'backdropLibrary',
    CostumeLibrary = 'costumeLibrary',
    ExtensionLibrary = 'extensionLibrary',
    LoadingProject = 'loadingProject',
    Telemetry = 'telemetryModal',
    SoundLibrary = 'soundLibrary',
    SpriteLibrary = 'spriteLibrary',
    SoundRecorder = 'soundRecorder',
    Connection = 'connectionModal',
    TipsLibrary = 'tipsLibrary'
  }

  type ProjectData = string | Uint8Array;

  const enum LoadingState {
    NotLoaded = 'NOT_LOADED',
    Error = 'ERROR',
    AutoUpdating = 'AUTO_UPDATING',
    CreatingCopy = 'CREATING_COPY',
    CreatingNew = 'CREATING_NEW',
    FetchingNewDefault = 'FETCHING_NEW_DEFAULT',
    FetchingWithID= 'FETCHING_WITH_ID',
    LoadingVMFIleUpload = 'LOADING_VM_FILE_UPLOAD',
    LoadingVMNewDefault = 'LOADING_VM_NEW_DEFAULT',
    LoadingVMWithID = 'LOADING_VM_WITH_ID',
    ManualUpdating = 'MANUAL_UPDATING',
    Remixing = 'REMIXING',
    ShowingWithID = 'SHOWING_WITH_ID',
    ShowingWithoutID = 'SHOWING_WITHOUT_ID',
    UpdatingBeforeCopy = 'UPDATING_BEFORE_COPY',
    UpdatingBeforeNew = 'UPDATING_BEFORE_NEW'
  }

  const enum DeletedItemType {
    Costume = 'Costume',
    Sound = 'Sound',
    Sprite = 'Sprite'
  }

  const enum ActiveTabIndex {
    Blocks = 0,
    Costumes = 1,
    Sounds = 2
  }

  interface ScratchGUIState {
    alerts: {
      visible: boolean;
      alertsList: Array<{
        alertType: AlertType;
        level: AlertLevel;
        alertId?: Alert;
        extensionId?: string;
        content?: React.Element;
        message?: string;
        iconURL?: string;
        iconSpinner?: boolean;
        closeButton?: boolean;
        showReconnect?: boolean;
        showDownload?: boolean;
        showSaveNow?: boolean;
      }>;
    };

    assetDrag: {
      dragging: boolean;
      currentOffset: {
        x: number;
        y: number;
      } | null;
      img: string | null;
      index?: number;
      dragType?: DragType;
      payload?: DragPayload;
    };

    blockDrag: boolean;

    cards: {
      visible: boolean;
      content: Record<Deck, unknown>;
      activeDeckId: Deck | null;
      step: number;
      x: number;
      y: number;
      expanded: boolean;
      dragging: boolean;
    };

    colorPicker: {
      active: boolean;
      callback(color: string): void;
    };

    connectionModal: {
      extensionId: string | null;
    };

    customProcedures: {
      active: boolean;
      mutator: Element | null;
      callback: ((mutation: Element) => void) | null;
    };

    editorTab: {
      activeTabIndex: ActiveTabIndex;
    };

    mode: {
      showBranding: boolean;
      isFullScreen: boolean;
      isPlayerOnly: boolean;
      hasEverEnteredEditor: boolean;
    };

    hoveredTarget: {
      sprite: string | null;
      receivedBlocks: boolean;
    };

    stageSize: {
      /**
       * Will only be large or small. Large constrained is determined elsewhere.
       */
      stageSize: StageDisplaySize;
    };

    menus: Record<Menu, boolean>;

    micIndicator: boolean;

    modals: Record<Modal, boolean>;

    monitors: OrderedMap;

    monitorLayout: {
      monitors: Record<string, {
        upperStart: {
          x: number;
          y: number;
        };
        lowerEnd: {
          x: number;
          y: number;
        };
      }>;
      savedMonitorPositions: Record<string, {
        x: number;
        y: number
      }>;
    };

    projectChanged: boolean;

    projectState: {
      error: null | unknown;
      projectData: ProjectData | null;
      projectId: string;
      loadingState: LoadingState;
    };

    projectTitle: string;

    fontsLoaded: boolean;

    restoreDeletion: {
      restoreFun: null | (() => void);
      deletedItem: DeletedItemType | '';
    };

    targets: {
      sprites: Record<string, VM.RenderedTarget & {
        order: number;
      }>;
      stage: VM.RenderedTarget | {};
      editingTarget?: string | null;
      highlightedTargetId: string | null;
      highlightedTargetTime: number | null;
    };

    timeout: {
      autoSaveTimeoutId: number | null;
    };

    toolbox: {
      toolboxXML: string;
    };

    vm: VM;

    vmStatus: {
      running: boolean;
      started: boolean;
      turbo: boolean;
    };

    workspaceMetrics: {
      targets: Record<string, {
        scale: number;
        scrollX: number;
        scrollY: number;
      }>;
    };
  }

  type ScratchGUIEvent =
    {
      type: 'scratch-gui/alerts/SHOW_ALERT';
      alertId: string;
    } |
    {
      type: 'scratch-gui/alerts/SHOW_EXTENSION_ALERT';
      data: {
        message: string;
        extensionId: string;
      }
    } |
    {
      type: 'scratch-gui/alerts/CLOSE_ALERT';
      index: number;
    } |
    {
      type: 'scratch-gui/alerts/CLOSE_ALERT_WITH_ID';
      alertId: string;
    } |
    {
      type: 'scratch-gui/alerts/CLOSE_ALERTS_WITH_ID';
      alertId: string;
    } |
    {
      type: 'scratch-gui/asset-drag/DRAG_UPDATE';
      state: Partial<ScratchGUIState['assetDrag']>;
    } |
    {
      type: 'scratch-gui/block-drag/BLOCK_DRAG_UPDATE';
      areBlocksOverGui: boolean;
    } |
    {
      type: 'scratch-gui/cards/CLOSE_CARDS';
    } |
    {
      type: 'scratch-gui/cards/SHRINK_EXPAND_CARDS';
    } |
    {
      type: 'scratch-gui/cards/VIEW_CARDS';
    } |
    {
      type: 'scratch-gui/cards/ACTIVATE_DECK';
      activeDeckId: Deck;
    } |
    {
      type: 'scratch-gui/cards/NEXT_STEP';
    } |
    {
      type: 'scratch-gui/cards/PREV_STEP';
    } |
    {
      type: 'scratch-gui/cards/DRAG_CARD';
      x: number;
      y: number;
    } |
    {
      type: 'scratch-gui/cards/START_DRAG';
    } |
    {
      type: 'scratch-gui/cards/END_DRAG';
    } |
    {
      type: 'scratch-gui/color-picker/ACTIVATE_COLOR_PICKER';
      callback: ScratchGUIState['colorPicker']['callback'];
    } |
    {
      type: 'scratch-gui/color-picker/DEACTIVATE_COLOR_PICKER';
      color: string;
    } |
    {
      type: 'scratch-gui/color-picker/SET_CALLBACK';
      callback: ScratchGUIState['colorPicker']['callback'];
    } |
    {
      type: 'scratch-gui/connection-modal/setId';
      extensionId: string | null;
    } |
    {
      type: 'scratch-gui/custom-procedures/ACTIVATE_CUSTOM_PROCEDURES';
      mutator: Element;
      callback(mutation: Element): void;
    } |
    {
      type: 'scratch-gui/custom-procedures/DEACTIVATE_CUSTOM_PROCEDURES';
      mutator: Element | null;
    } |
    {
      // Technically exists but unused by scratch-gui
      type: 'scratch-gui/custom-procedures/SET_CALLBACK';
      callback(mutation: Element): void;
    } |
    {
      type: 'scratch-gui/navigation/ACTIVATE_TAB';
      activeTabIndex: ActiveTabIndex;
    } |
    {
      type: 'fontsLoaded/SET_FONTS_LOADED';
      loaded: boolean;
    } |
    {
      type: 'scratch-gui/hovered-target/SET_HOVERED_SPRITE';
      spriteId: string | null;
    } |
    {
      type: 'scratch-gui/hovered-target/SET_RECEIVED_BLOCKS';
      receivedBlocks: boolean;
    } |
    {
      type: 'scratch-gui/menus/OPEN_MENU';
      menu: Menu;
    } |
    {
      type: 'scratch-gui/menus/CLOSE_MENU';
      menu: Menu;
    } |
    {
      type: 'scratch-gui/mic-indicator/UPDATE';
      visible: boolean;
    } |
    {
      type: 'scratch-gui/modals/OPEN_MODAL';
      modal: Modal;
    } |
    {
      type: 'scratch-gui/modals/CLOSE_MODAL';
      modal: Modal;
    } |
    {
      type: 'scratch-gui/mode/SET_FULL_SCREEN';
      isFullScreen: boolean;
    } |
    {
      type: 'scratch-gui/mode/SET_PLAYER';
      isPlayerOnly: boolean;
    } |
    {
      type: 'scratch-gui/monitors/ADD_MONITOR_RECT';
      monitorId: string;
      upperStart: {
        x: number;
        y: number;
      };
      lowerEnd: {
        x: number;
        y: number;
      };
      savePosition: boolean;
    } |
    {
      type: 'scratch-gui/monitors/MOVE_MONITOR_RECT';
      monitorId: string;
      newX: number;
      newY: number;
    } |
    {
      type: 'scratch-gui/monitors/RESIZE_MONITOR_RECT';
      monitorId: string;
      newWidth: number;
      newHeight: number;
    } |
    {
      type: 'scratch-gui/monitors/REMOVE_MONITOR_RECT';
      monitorId: string;
    } |
    {
      type: 'scratch-gui/monitors/RESET_MONITOR_LAYOUT';
    } |
    {
      type: 'scratch-gui/monitors/UPDATE_MONITORS';
      monitors: OrderedMap;
    } |
    {
      type: 'scratch-gui/project-changed/SET_PROJECT_CHANGED';
      changed: boolean;
    } |
    {
      type: 'scratch-gui/project-state/DONE_CREATING_COPY';
      projectId: string;
    } |
    {
      type: 'scratch-gui/project-state/DONE_CREATING_NEW';
      projectId: string;
    } |
    {
      type: 'scratch-gui/project-state/DONE_FETCHING_DEFAULT';
      projectData: ProjectData;
    } |
    {
      type: 'scratch-gui/project-state/DONE_FETCHING_WITH_ID';
      projectData: ProjectData;
    } |
    {
      type: 'scratch-gui/project-state/DONE_LOADING_VM_TO_SAVE';
    } |
    {
      type: 'scratch-gui/project-state/DONE_LOADING_VM_WITH_ID';
    } |
    {
      type: 'scratch-gui/project-state/DONE_LOADING_VM_WITHOUT_ID';
    } |
    {
      type: 'scratch-gui/project-state/DONE_REMIXING';
      projectId: string;
    } |
    {
      type: 'scratch-gui/project-state/DONE_UPDATING';
    } |
    {
      type: 'scratch-gui/project-state/DONE_UPDATING_BEFORE_COPY';
    } |
    {
      type: 'scratch-gui/project-state/DONE_UPDATING_BEFORE_NEW';
    } |
    {
      type: 'scratch-gui/project-state/RETURN_TO_SHOWING';
    } |
    {
      type: 'scratch-gui/project-state/SET_PROJECT_ID';
      projectId: string;
    } |
    {
      type: 'scratch-gui/project-state/START_AUTO_UPDATING';
    } |
    {
      type: 'scratch-gui/project-state/START_CREATING_NEW';
    } |
    {
      type: 'scratch-gui/project-state/START_ERROR';
      error: unknown;
    } |
    {
      type: 'scratch-gui/project-state/START_FETCHING_NEW';
    } |
    {
      type: 'scratch-gui/project-state/START_LOADING_VM_FILE_UPLOAD';
    } |
    {
      type: 'scratch-gui/project-state/START_MANUAL_UPDATING';
    } |
    {
      type: 'scratch-gui/project-state/START_REMIXING';
    } |
    {
      type: 'scratch-gui/project-state/START_UPDATING_BEFORE_CREATING_COPY';
    } |
    {
      type: 'scratch-gui/project-state/START_UPDATING_BEFORE_CREATING_NEW';
    } |
    {
      type: 'projectTitle/SET_PROJECT_TITLE';
      title: string;
    } |
    {
      type: 'scratch-gui/restore-deletion/RESTORE_UPDATE';
      state: ScratchGUIState['restoreDeletion']
    } |
    {
      type: 'scratch-gui/StageSize/SET_STAGE_SIZE';
      /**
       * Should only be large or small.
       */
      stageSize: StageDisplaySize;
    } |
    {
      type: 'scratch-gui/targets/UPDATE_TARGET_LIST';
      targets: VM.RenderedTarget[];
      editingTarget: string | null;
    } |
    {
      type: 'scratch-gui/targets/HIGHLIGHT_TARGET';
      targetId: string;
      /**
       * Set to Date.now()
       */
      updateTime: number;
    } |
    {
      type: 'timeout/SET_AUTOSAVE_TIMEOUT_ID';
      id: number | null;
    } |
    {
      type: 'scratch-gui/toolbox/UPDATE_TOOLBOX';
      toolboxXML: string;
    } |
    {
      type: 'scratch-gui/vm-status/SET_RUNNING_STATE';
      running: boolean;
    } |
    {
      type: 'scratch-gui/vm-status/SET_TURBO_STATE';
      turbo: boolean;
    } |
    {
      type: 'scratch-gui/vm-status/SET_STARTED_STATE';
      started: boolean;
    } |
    {
      // Technically exists but unused by scratch-gui.
      // Probably doesn't work properly.
      type: 'scratch-gui/vm/SET_VM';
      vm: VM;
    } |
    {
      type: 'scratch-gui/workspace-metrics/UPDATE_METRICS';
      targetID: string;
      scrollX: number;
      scrollY: number;
      scale: number;
    };

  interface LocaleState {
    isRtl: boolean;
    locale: string;
    messages: Record<string, string>;
    messagesByLocale: Record<string, Record<string, string>>;
  }

  type LocaleEvent =
    {
      type: 'scratch-gui/locales/UPDATE_LOCALES';
      messagesByLocale: LocaleState['messagesByLocale'];
    } |
    {
      type: 'scratch-gui/locales/SELECT_LOCALE';
      locale: string;
    };

  interface SessionState {
    // TODO: Move to scratch-www?
    session?: {
      user?: {
        username?: string;
      };
    };
  }
}

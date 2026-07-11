// Type definitions for scratch-audio
// Project: https://github.com/LLK/scratch-audio

/// <reference path="./events.d.ts" />

declare namespace AudioEngine {
  interface Target {
    // TODO
  }

  interface Loudness {
    audioContext: AudioContext;
    connectingToMic: boolean;
    mic: MediaStreamAudioSourceNode;

    /**
     * Get the current loudness of sound received by the microphone.
     * Sound is measured in RMS and smoothed.
     * @returns Loudness scaled 0 to 100, or -1 if there is no microphone input.
     */
    getLoudness(): number;
  }

  interface AbstractEffect {
    audioEngine: AudioEngine;
    audioPlayer: SoundPlayer;
    lastEffect: AbstractEffect;
    value: number;
    initialized: boolean;
    initialize(): void;
    inputNode: AudioNode;
    getInputNode(): AudioNode;
    outputNode: AudioNode;
    target: Target;
    connect(target: Target): void;
    get name(): string;
    get DEFAULT_VALUE(): number;
    get _isPatch(): boolean;
    _set(value: number): void;
    set(value: number): void;
    update(): void;
    clear(): void;
    dispose(): void;
  }

  interface PitchEffect extends AbstractEffect {
    get name(): 'pitch';
    ratio: number;
    /**
     * The playback ratio is scaled so that a change of 10 in the effect value
     * gives a change of 1 semitone in the ratio.
     */
    getRatio(val: number): number;
    updatePlayer(soundPlayer: SoundPlayer): void;
    updatePlayers(soundPlayers: Record<string, SoundPlayer> | SoundPlayer[]): void;
  }

  interface PanEffect extends AbstractEffect {
    get name(): 'pan';
    leftGain: GainNode;
    rightGain: GainNode;
    channelMerger: ChannelMergerNode;
  }

  interface VolumeEffect extends AbstractEffect {
    get name(): 'volume';
  }

  type Effect = PitchEffect | PanEffect | VolumeEffect;

  interface EffectConstructor {
    new(audioEngine: AudioEngine, soundPlayer: SoundPlayer, lastEffect: Effect | null): Effect;
  }

  interface EffectChain {
    audioEngine: AudioEngine;
    inputNode: GainNode;
    getInputNode(): GainNode;
    effects: EffectConstructor[];
    _effects: Effect[];
    firstEffect: Effect;
    lastEffect: Effect;
    _soundPlayers: Set<SoundPlayer>;
    getSoundPlayers(): SoundPlayer[];
    clone(): EffectChain;
    addSoundPlayer(soundPlayer: SoundPlayer): void;
    removeSoundPlayer(soundPlayer: SoundPlayer): void;
    target?: AudioNode;
    connect(target: AudioNode): void;
    setEffectsFromTarget(target: Target): void;
    set(effect: string, value: number): void;
    update(): void;
    clear(): void;
    dispose(): void;
  }

  interface SoundPlayerEventMap {
    stop: [];
    play: [];
  }

  interface SoundPlayer extends EventEmitter<SoundPlayerEventMap> {
    id: string;
    audioEngine: AudioEngine;
    buffer: AudioBuffer;
    outputNode: AudioNode;
    isStarting: boolean;
    isPlaying: boolean;
    startingUntil: number;
    playbackRate: number;
    volumeEffect: VolumeEffect | null;
    target: AudioEngine | Effect | EffectChain | null;
    initialized: boolean;
    handleEvent(event: Event): void;
    onEnded(): void;
    _createSource(): void;
    initialize(): void;
    dispose(): void;
    play(): void;
    stop(): void;
    stopImmediately(): void;
    finished(): Promise<void>;
    setPlaybackRate(playbackRate: number): void;
    take(): SoundPlayer;
    connect(connectable: AudioEngine | Effect | EffectChain): SoundPlayer | undefined;
  }

  interface SoundBank {
    audioEngine: AudioEngine;

    /**
     * Maps sound ID to its sound player.
     */
    soundPlayers: Record<string, SoundPlayer>;

    /**
     * Maps sound IDs to the target they were most recently been started by.
     */
    playerTargets: Map<string, Target>;

    /**
     * Maps sound IDs to their effect chain.
     */
    soundEffects: Map<string, EffectChain>;

    /**
     * Original effect chain cloned for each sound.
     */
    effectChainPrime: EffectChain;

    addSoundPlayer(soundPlayer: SoundPlayer): void;
    getSoundPlayer(soundId: string): SoundPlayer | undefined;
    getSoundEffects(soundId: string): EffectChain;
    playSound(target: Target, soundId: string): Promise<void>;
    setEffects(target: Target): void;
    stop(target: Target, soundId: string): void;
    stopAllSounds(target?: Target | '*'): void;
    dispose(): void;
  }

  interface SoundToDecode {
    data: {
      buffer: ArrayBuffer;
    }
  }
}

declare class AudioEngine {
  constructor(audioContext?: AudioContext);

  audioContext: AudioContext;
  get currentTime(): number;

  inputNode: GainNode;
  getInputNode(): GainNode;

  audioBuffers: Record<string, ArrayBuffer>;

  loudness: AudioEngine.Loudness | null;
  /**
   * @see {AudioEngine.Loudness.getLoudness}
   */
  getLoudness(): number;

  effects: AudioEngine.EffectConstructor[];

  get EFFECT_NAMES(): Record<string, string>;
  get DECAY_DURATION(): number;
  get DECAY_WAIT(): number;

  _emptySound(): AudioBuffer;

  decodeSound(sound: AudioEngine.SoundToDecode): Promise<string>;

  decodeSoundPlayer(sound: AudioEngine.SoundToDecode): Promise<AudioEngine.SoundPlayer>;

  /**
   * Returns a tuple of [sound id, buffer]
   */
  _decodeSound(sound: AudioEngine.SoundToDecode): Promise<[string, AudioBuffer]>;

  createEffectChain(): AudioEngine.EffectChain;

  createBank(): AudioEngine.SoundBank;
}

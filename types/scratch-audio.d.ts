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
     * @returns Loudness measured from 0-100.
     */
    getLoudness(): number;
  }

  interface Effect {
    audioEngine: AudioEngine;
    audioPlayer: SoundPlayer;
    lastEffect: Effect;
    value: number;
    initialized: boolean;
    initialize(): void;
    inputNode: AudioNode;
    getInputNode(): AudioNode;
    outputNode: AudioNode;
    target: Target;
    connect(target: Target): void;
    get name(): string;
    get DEFAULT_VALUE(): string;
    get _isPatch(): boolean;
    _set(value: number): void;
    set(value: number): void;
    update(): void;
    clear(): void;
    dispose(): void;
  }

  interface EffectChain {
    audioEngine: AudioEngine;
    inputNode: GainNode;
    getInputNode(): GainNode;
    effects: Effect[];
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
  }

  interface SoundBank {
    audioEngine: AudioEngine;
    soundPlayers: Record<string, SoundPlayer>;
    playerTargets: Record<string, Target>;
    soundEffects: Record<string, EffectChain>;
    effectChainPrime: EffectChain;
    addSoundPlayer(soundPlayer: SoundPlayer): void;
    getSoundPlayer(soundId: string): SoundPlayer | undefined;
    getSoundEffects(soundId: string): EffectChain;
    playSound(target: Target, soundId: string): Promise<void>;
    setEffects(target: Target): void;
    stop(target: Target, soundId: string): void;
    stopAllSounds(target: Target | '*'): void;
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

  effects: AudioEngine.Effect[];
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

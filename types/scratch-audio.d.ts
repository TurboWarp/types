// Type definitions for scratch-audio
// Project: https://github.com/LLK/scratch-audio

declare namespace AudioEngine {
  interface SoundPlayer {
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
}

declare class AudioEngine {
  audioContext: AudioContext;
  inputNode: GainNode;
}

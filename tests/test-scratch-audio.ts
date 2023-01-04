import AudioEngine from 'scratch-audio';

declare const vm: VM;
const audioEngine = new AudioEngine();
vm.attachAudioEngine(audioEngine);

audioEngine.decodeSoundPlayer({
  data: {
    buffer: new ArrayBuffer(10)
  }
})
  .then((player) => {
    player.on('stop', () => {

    });
    return player.finished();
  });

declare const pitchEffect: AudioEngine.PitchEffect;
pitchEffect.ratio as number
pitchEffect.updatePlayers([]);

declare const soundPlayer: AudioEngine.SoundPlayer;

new audioEngine.effects[0](audioEngine, soundPlayer, pitchEffect);

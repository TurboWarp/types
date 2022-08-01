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

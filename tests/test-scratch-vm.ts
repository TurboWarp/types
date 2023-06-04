import VM from 'scratch-vm';
import AudioEngine from 'scratch-audio';

const vm = new VM();
const runtime = vm.runtime;

runtime.on('SCRIPT_GLOW_ON', (glowData) => {
  const id: string = glowData.id;
});
vm.on('SCRIPT_GLOW_OFF', (glowData) => {
  const id: string = glowData.id;
});

vm.emit('targetsUpdate', {
  targetList: [],
  editingTarget: 'abc 123'
});

const target = vm.runtime.getSpriteTargetByName('Sprite1');
if (target) {
  const variable = target.lookupVariableByNameAndType('test', 'list');
  if (variable) {
    const name: string = variable.name;
    const upToDate: boolean | undefined = variable._monitorUpToDate;
    variable.value.filter(i => i.toString());
  }

  target.lookupOrCreateVariable(')(!@*#)!(@#*()', 'my variable').value;

  // @ts-expect-error
  target.lookupVariableById('#@)$(*%)(#').id;

  target.effects.ghost += 10;

  const block = target.blocks.getBlock('123');
  if (!block) {
    throw new Error('no block :(');
  }
  if (block.opcode === 'procedures_call') {
    const mutation = block.mutation as VM.ProcedureCallMutation;
    JSON.parse(mutation.argumentids);
  }

  const bubbleState = target.getCustomState('Scratch.looks');
  if (bubbleState) {
    bubbleState.text.charAt(0);
    target.setCustomState('Scratch.looks', bubbleState);
  }

  target.on('TARGET_MOVED', (target, fromX, fromY, forced) => {
    const id: string = target.id;
    const x: number = fromX;
    const y: number = fromY;
    const f: boolean | undefined = forced;
  })
  target.on('EVENT_TARGET_VISUAL_CHANGE', (target) => {
    const id: string = target.id;
  });

  runtime.on('STOP_FOR_TARGET', (t: VM.RenderedTarget) => {

  });
} else {
  const doesNotExist: undefined = target;
}

runtime._editingTarget as VM.Target;
runtime.getEditingTarget() as VM.Target;

const audioEngine = new AudioEngine();
vm.attachAudioEngine(audioEngine);
audioEngine.audioContext.suspend();

vm.setTurboMode(true);
vm.runtime.turboMode as boolean
vm.setCompatibilityMode(true);
vm.runtime.compatibilityMode as boolean

const costume = vm.runtime.getTargetForStage()?.getCostumes()?.[0];
costume?.skinId as number;

declare const util: VM.BlockUtility;
util.startHats('hats', {BROADCAST_OPTION: 'test'}) as VM.Thread[];
util.ioQuery('mouse', 'getIsDown', []);

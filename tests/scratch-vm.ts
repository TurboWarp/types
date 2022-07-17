import VM from 'scratch-vm';

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
    variable.value.filter(i => i.toString());
  }

  target.lookupOrCreateVariable(')(!@*#)!(@#*()', 'my variable').value;

  // @ts-expect-error
  target.lookupVariableById('#@)$(*%)(#').id;

  target.effects.ghost += 10;
} else {
  const doesNotExist: undefined = target;
}
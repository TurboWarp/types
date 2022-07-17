import VM from 'scratch-vm';

const vm = new VM();
const callback = (i: unknown) => console.log(i);

vm.on('VISUAL_REPORT', callback);
vm.off('VISUAL_REPORT', callback);
vm.listeners('VISUAL_REPORT').forEach((i) => i({
  id: 'def',
  value: 'xyz'
}));
vm.emit('VISUAL_REPORT', {
  id: 'abc',
  value: 'def'
});

import VM from 'scratch-vm';
const vm = new VM();
// Your editor probably makes it clear that fromJSON is deprecated below
vm.fromJSON(new ArrayBuffer(10));

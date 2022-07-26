declare const RealBlockly: ScratchBlocks.RealBlockly;

if (typeof Blockly === 'undefined') {
  throw new Error('blockly doesnt exist')
}

const workspace = Blockly.getMainWorkspace();
if (!workspace) {
  throw new Error('no workspace');
}

workspace.id.toString();

const fakeWorkspace = new RealBlockly.Workspace({});
fakeWorkspace.id.charAt(0);

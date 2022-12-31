declare const state: ScratchGUI.ReduxState;
declare function dispatch(event: ScratchGUI.ReduxEvent): void;

const vm = state.scratchGui.vm;
vm.greenFlag();
vm.renderer._allDrawables[0].updateVisible(false);

dispatch({
  type: 'scratch-gui/navigation/ACTIVATE_TAB',
  activeTabIndex: 0
});

state.scratchPaint.cursor.charAt(0);
dispatch({
  type: 'scratch-paint/undo/CLEAR'
});

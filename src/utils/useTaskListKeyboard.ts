import { useEffect, useCallback } from 'react';
import { TaskListManager } from 'src/TaskListManager/TaskListManager';

export function useTaskListKeyboard(stateManager: TaskListManager) {
  const handleKeyDown = useCallback(
    (e) => {
      if (!stateManager) return;
      const state = stateManager.getState();

      const selectedId = state.client.selectedId;
      if (!selectedId) return;
      if (e.keyCode === 8) {
        // Backspace
        if (e.target.selectionStart === 0 && e.target.selectionEnd === 0) {
          e.preventDefault();
          stateManager.editing.delete(selectedId);
        }
      } else if (e.keyCode === 9) {
        // Tab
        e.preventDefault();
        if (e.shiftKey) stateManager.indention.outdent(selectedId);
        else stateManager.indention.indent(selectedId);
      } else if (e.keyCode === 13) {
        e.preventDefault();
        stateManager.editing.enter(selectedId, e.target.selectionStart);
      } else if (e.keyCode === 38) {
        // Up arrow
        e.preventDefault();
        if (e.metaKey || e.ctrlKey) {
          stateManager.expansion.collapse(selectedId);
        } else {
          stateManager.selection.selectPrev(e.target.selectionStart);
        }
      } else if (e.keyCode === 40) {
        // Down arrow
        e.preventDefault();
        if (e.metaKey || e.ctrlKey) {
          stateManager.expansion.expand(selectedId);
        } else {
          stateManager.selection.selectNext(e.target.selectionStart);
        }
      } else if (e.keyCode === 90 && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (e.shiftKey) {
          // stateManager.undoHandler.redo();
        } else {
          // stateManager.undoHandler.undo();
        }
      }
    },
    [stateManager]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}

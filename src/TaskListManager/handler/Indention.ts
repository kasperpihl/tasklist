import { indentTaskAndChildren } from '../utils/indentTaskAndChildren';
import type { TaskListManager } from '../TaskListManager';

export class Indention {
  private stateManager: TaskListManager;
  constructor(stateManager: TaskListManager) {
    this.stateManager = stateManager;
  }
  indent = (taskId: string) => {
    this._indentWithModifier(taskId, 1);
  };
  outdent = (taskId: string) => {
    this._indentWithModifier(taskId, -1);
  };
  private _indentWithModifier = (taskId: string, modifier: 1 | -1) => {
    this.stateManager.update((draftState) => {
      indentTaskAndChildren(draftState, taskId, modifier);

      // Ensure parent gets expanded
      const visibleIndex = draftState.client.visibleOrder.findIndex(
        (id) => taskId === id
      );

      if (visibleIndex > 0) {
        const prevVisibleId = draftState.client.visibleOrder[visibleIndex - 1];
        if (
          draftState.server.indention[taskId] >
            draftState.server.indention[prevVisibleId] &&
          modifier > 0
        ) {
          draftState.client.expanded[prevVisibleId] = true;
        }
      }
    });
  };
}

import type { TaskListManager } from '../TaskListManager';

export class Expansion {
  private stateManager: TaskListManager;
  constructor(stateManager: TaskListManager) {
    this.stateManager = stateManager;
  }
  setDepth = (depth: number) => {
    this.stateManager.update((draftState) => {
      draftState.client.orderAsArray.forEach((taskId) => {
        const indention = draftState.server.indention[taskId];
        const indentComp = draftState.client.indentComp[taskId] ?? 0;
        const shouldBeExpanded = indention - indentComp < depth;
        if (draftState.client.expanded[taskId] !== shouldBeExpanded) {
          draftState.client.expanded[taskId] = shouldBeExpanded;
        }
      });
    });
  };
  expand = (taskId: string, fully = false) => {
    this._expandById(taskId, fully, true);
  };
  collapse = (taskId: string, fully = false) => {
    this._expandById(taskId, fully, false);
  };
  private _expandById = (taskId: string, fully: boolean, expand: boolean) => {
    this.stateManager.update((draftState) => {
      if (!draftState.client.hasChildren[taskId]) return;
      draftState.client.expanded[taskId] = expand;

      if (fully) {
        let deltaIndex = draftState.server.ordering[taskId];
        const indention = draftState.server.indention[taskId];
        let nextTaskId: string;
        let nextTaskIndention: number;

        do {
          deltaIndex++;
          nextTaskId = draftState.client.orderAsArray[deltaIndex];
          nextTaskIndention = draftState.server.indention[nextTaskId];
          if (
            nextTaskIndention > indention &&
            draftState.client.hasChildren[nextTaskId]
          ) {
            draftState.client.expanded[nextTaskId] = expand;
          }
        } while (nextTaskId && nextTaskIndention > indention);
      }
    });
  };
}

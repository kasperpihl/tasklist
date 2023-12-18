import type { TaskListManager } from '../TaskListManager';

export class Completion {
  private stateManager: TaskListManager;
  constructor(stateManager: TaskListManager) {
    this.stateManager = stateManager;
  }
  complete = (taskId: string) => {
    this._completeById(taskId, true);
  };
  incomplete = (taskId: string) => {
    this._completeById(taskId, false);
  };
  completeAll = (flag = true) => {
    this.stateManager.update((draftState) => {
      draftState.client.orderAsArray.forEach((taskId) => {
        draftState.server.completion[taskId] = flag;
      });
    });
  };
  private _completeById = (taskId: string, flag: boolean) => {
    this.stateManager.update((draftState) => {
      const indexToComplete = draftState.server.ordering[taskId];
      const orgIndent = draftState.server.indention[taskId];

      let deltaIndex = indexToComplete;
      let deltaIndent = orgIndent;
      do {
        // Set all children and grandchildren
        let deltaId = draftState.client.orderAsArray[deltaIndex];
        draftState.server.completion[deltaId] = flag;

        deltaIndex++;
        deltaId = draftState.client.orderAsArray[deltaIndex];
        deltaIndent = draftState.server.indention[deltaId];
      } while (
        deltaIndent > orgIndent &&
        deltaIndex < draftState.client.orderAsArray.length
      );
    });
  };
}

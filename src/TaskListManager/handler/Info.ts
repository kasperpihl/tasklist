import { TaskListManager } from '../TaskListManager';

export class Info {
  private stateManager: TaskListManager;
  constructor(stateManager: TaskListManager) {
    this.stateManager = stateManager;
  }
  getCompletedAndTotal(taskId: string) {
    const state = this.stateManager.getState();

    let completed = 0;
    let total = 0;
    let dIndex = state.server.ordering[taskId];
    const targetIndention = state.server.indention[taskId];
    const sortedOrder = state.client.orderAsArray;
    while (dIndex < sortedOrder.length) {
      const tId = sortedOrder[dIndex];
      const indention = state.server.indention[tId];
      if (total > 0 && indention <= targetIndention) {
        return [completed, total];
      }
      const hasChildren = state.client.hasChildren[tId];
      if (!hasChildren) {
        total++;
        const isCompleted = state.server.completion[tId];
        if (isCompleted) {
          completed++;
        }
      }

      dIndex++;
    }

    return [completed, total];
  }
}

import { ensureVisible } from '../utils/ensureVisible';
import type { TaskListManager } from '../TaskListManager';

export class Filtering {
  private stateManager: TaskListManager;
  constructor(stateManager: TaskListManager) {
    this.stateManager = stateManager;
  }
  setFilteredCompleted = (toggle: boolean) => {
    this.stateManager.update((draftState) => {
      draftState.client.filteredCompleted = toggle;
      draftState.client.indentComp = {};
    });
  };

  setFilteredAssignee = (assigneeId: string | null) => {
    this.stateManager.update((draftState) => {
      draftState.client.filteredAssignee = assigneeId;
      draftState.client.indentComp = {};
    });
  };

  setFilteredTaskIds = (
    filteredTaskIds: string[] | null,
    visibleIds?: string[]
  ) => {
    this.stateManager.update((draftState) => {
      draftState.client.filteredTaskIds = filteredTaskIds;
      draftState.client.indentComp = {};

      if (visibleIds) {
        ensureVisible(draftState, visibleIds);
      } else {
        Object.keys(draftState.client.expanded).forEach((taskId) => {
          draftState.client.expanded[taskId] = false;
        });
      }
    });
  };
}

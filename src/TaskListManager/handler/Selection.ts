import type { TaskListManager } from '../TaskListManager';

export class Selection {
  private stateManager: TaskListManager;
  constructor(stateManager: TaskListManager) {
    this.stateManager = stateManager;
  }
  selectNext = (currSelStart: number) => {
    this._selectWithModifier(1, currSelStart);
  };
  selectPrev = (currSelStart: number) => {
    this._selectWithModifier(-1, currSelStart);
  };
  private _selectWithModifier = (modifier: 1 | -1, currSelStart: number) => {
    this.stateManager.update((draftState) => {
      const { selectedId, visibleOrder } = draftState.client;

      const visibleI = visibleOrder.findIndex(
        (taskId) => taskId === selectedId
      );
      let nextI = (visibleI + modifier) % visibleOrder.length;
      if (nextI < 0) {
        nextI = visibleOrder.length - 1;
      }

      const nextTaskId = visibleOrder[nextI];

      let selectionStart =
        draftState.server.tasks_by_id[nextTaskId].title.length;

      if (currSelStart === 0) {
        selectionStart = 0;
      }

      draftState.client.selectedId = nextTaskId;
      draftState.client.selectionStart = selectionStart;
    });
  };
  select = (taskId: string) => {
    this._selectValue(taskId);
  };
  deselect = (taskId: string) => {
    if (this.stateManager.getState().client.selectedId === taskId) {
      this._selectValue(null);
    }
  };
  private _selectValue = (value: string | null) => {
    this.stateManager.update((draftState) => {
      if (draftState.client.selectedId !== value) {
        draftState.client.selectedId = value;
      }
    });
  };
}

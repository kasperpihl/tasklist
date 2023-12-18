import { deleteTaskId } from '../utils/deleteTaskId';
import { randomString } from '../utils/randomString';
import type { TaskListManager } from '../TaskListManager';

export class Editing {
  private stateManager: TaskListManager;
  constructor(stateManager: TaskListManager) {
    this.stateManager = stateManager;
  }
  doneEditing = () => {
    this.stateManager.update((draftState) => {
      if (draftState.client.editing) {
        draftState.client.editing = false;
        draftState.client.selectedId = null;
      }
    });
  };
  attach = (taskId: string, attachment: any) => {
    this.stateManager.update((draftState) => {
      const newId = randomString();
      const nextIndex = draftState.server.ordering[taskId] + 1;
      const targetIndention = draftState.server.indention[taskId] + 1;

      draftState.client.expanded[taskId] = true;

      draftState.server.tasks_by_id[newId] = {
        task_id: newId,
        title: attachment.title,
        assignees: [],
        due_date: null,
        attachment,
      };

      draftState.server.indention[newId] = targetIndention;

      draftState.client.orderAsArray.splice(nextIndex, 0, newId);
    });
  };

  updateTitle = (taskId: string, title: string) => {
    this.stateManager.update(
      (draftState) => {
        draftState.server.tasks_by_id[taskId].title = title;
      },
      {
        skipValidation: true,
      }
    );
  };

  updateAssignees = (taskId: string, assignees: string[]) => {
    this.stateManager.update(
      (draftState) => {
        draftState.server.tasks_by_id[taskId].assignees = assignees;
      },
      {
        skipValidation: true,
      }
    );
  };

  updateDueDate = (taskId: string, dueDate: Date | null) => {
    this.stateManager.update((draftState) => {
      draftState.server.tasks_by_id[taskId].due_date = dueDate;
    });
  };

  deleteCompleted = () => {
    this.stateManager.update((draftState) => {
      draftState.client.orderAsArray.forEach((taskId) => {
        if (draftState.server.completion[taskId]) {
          deleteTaskId(draftState, taskId);
          // this.stateManager.sync.delete(taskId);
        }
      });

      draftState.client.selectedId = null;
      draftState.client.selectionStart = null;
    });
  };

  delete = (taskId: string) => {
    this.stateManager.update((draftState) => {
      const visibleOrder = draftState.client.visibleOrder;
      const visibleIndex = visibleOrder.findIndex((id) => taskId === id);

      if (visibleIndex === 0) {
        return;
      }

      const currentTitle = draftState.server.tasks_by_id[taskId].title;
      const prevId = visibleOrder[visibleIndex - 1];

      deleteTaskId(draftState, taskId);
      // this.stateManager.sync.delete(id);

      draftState.client.selectedId = prevId;
      draftState.client.selectionStart = null;

      if (currentTitle) {
        const prevTitle = draftState.server.tasks_by_id[prevId].title;
        draftState.client.selectionStart = prevTitle.length;
        draftState.server.tasks_by_id[prevId].title = prevTitle + currentTitle;
      }
    });
  };

  enter = (taskId: string, selectionStart: number | null = null) => {
    let newId = randomString();
    this.stateManager.update((draftState) => {
      let currTitle = draftState.server.tasks_by_id[taskId].title;

      selectionStart = selectionStart ?? currTitle.length;

      const indention = draftState.server.indention[taskId];

      if (!currTitle.length && indention > 0) {
        this.stateManager.indention.outdent(taskId);
        newId = taskId;
        return;
      }

      let nextTitle = '';
      if (selectionStart < currTitle.length) {
        nextTitle = currTitle.slice(selectionStart);
        currTitle = currTitle.slice(0, selectionStart);
        draftState.server.tasks_by_id[taskId].title = currTitle;
      }

      draftState.server.tasks_by_id[newId] = {
        task_id: newId,
        title: nextTitle,
        assignees: [],
        due_date: null,
        attachment: null,
      };

      draftState.client.expanded[newId] = false;
      draftState.client.hasChildren[newId] = false;
      draftState.client.selectedId = newId;
      draftState.client.selectionStart = 0;

      const currentIndention = draftState.server.indention[taskId];
      const currentHasChildren = draftState.client.hasChildren[taskId];
      const currentIsExpanded = draftState.client.expanded[taskId];

      let nextIndex = draftState.server.ordering[taskId] + 1;
      let nextIndention = currentIndention;
      if (currentHasChildren) {
        if (currentIsExpanded) {
          nextIndention++;
        } else {
          do {
            nextIndex++;
            nextIndention =
              draftState.server.indention[
                draftState.client.orderAsArray[nextIndex]
              ] || 0;
          } while (
            nextIndention > currentIndention &&
            nextIndex < draftState.client.orderAsArray.length
          );
        }
      }

      draftState.server.indention[newId] = Math.max(nextIndention, 1);
      if (
        !draftState.client.expanded[taskId] &&
        draftState.server.indention[newId] > draftState.server.indention[taskId]
      ) {
        draftState.client.expanded[taskId] = true;
      }
      draftState.client.orderAsArray.splice(nextIndex, 0, newId);
    });

    return newId;
  };
}

import { randomString } from '../utils/randomString';
import { ServerState } from '../types';
import { TaskListManager } from '../TaskListManager';

export function getEmptyManager(taskId = randomString()) {
  const serverState: ServerState = {
    tasks_by_id: {
      [taskId]: {
        task_id: taskId,
        title: '',
        due_date: null,
        assignees: [],
        attachment: null,
      },
    },
    ordering: {
      [taskId]: 0,
    },
    completionPercentage: 0,
    completion: {},
    indention: {
      [taskId]: 0,
    },
  };

  return new TaskListManager(serverState);
}

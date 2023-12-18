import { State } from '../types';

export function deleteTaskId(draftState: State, taskId: string) {
  delete draftState.server.ordering[taskId];
  delete draftState.server.completion[taskId];
  delete draftState.server.indention[taskId];
  delete draftState.server.tasks_by_id[taskId];

  draftState.client.orderAsArray = draftState.client.orderAsArray.filter(
    (id) => id !== taskId
  );

  delete draftState.client.expanded[taskId];
  delete draftState.client.hasChildren[taskId];
}

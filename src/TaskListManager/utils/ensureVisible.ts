import { State } from '../types';

export function ensureVisible(draftState: State, visibleIds: string[]) {
  let enforceVisibleIndention = 0;
  for (let i = draftState.client.orderAsArray.length; i >= 0; i--) {
    const taskId = draftState.client.orderAsArray[i];

    const indention = draftState.server.indention[taskId];
    const hasChildren = draftState.client.hasChildren[taskId];
    const expanded = draftState.client.expanded[taskId];

    if (
      indention > enforceVisibleIndention &&
      visibleIds.indexOf(taskId) > -1
    ) {
      enforceVisibleIndention = indention;
    } else if (indention < enforceVisibleIndention) {
      if (hasChildren && !expanded) {
        draftState.client.expanded[taskId] = true;
        enforceVisibleIndention = indention;
      }
    }
  }
}

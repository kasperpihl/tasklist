import { State } from '../types';

export function indentTaskAndChildren(
  draftState: State,
  taskId: string,
  modifier = 0
) {
  const { orderAsArray } = draftState.client;
  const originalIndention = draftState.server.indention[taskId];
  const index = draftState.server.ordering[taskId];
  const prevTaskId = index > 0 && orderAsArray[index - 1];
  const maxIndent = prevTaskId
    ? draftState.server.indention[prevTaskId] + 1
    : 0;

  const newIndent = originalIndention + modifier;

  if (newIndent > maxIndent || newIndent < 0) {
    return;
  }
  draftState.server.indention[taskId] = newIndent;

  let foundNextSiblingOrLess = false;
  let i = index;
  while (!foundNextSiblingOrLess) {
    const prevIndention = draftState.server.indention[orderAsArray[i]];

    i++;
    const currId = orderAsArray[i];
    const currIndention = draftState.server.indention[currId];

    if (
      typeof currIndention === 'undefined' ||
      currIndention <= originalIndention
    ) {
      foundNextSiblingOrLess = true;
    } else {
      const targetIndent = Math.min(
        prevIndention + 1,
        currIndention + modifier
      );
      if (currIndention !== targetIndent) {
        draftState.server.indention[currId] = targetIndent;
      }
    }
  }
}

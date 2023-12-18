import { State } from '../types';

export function completeTaskWithChildren(
  draftState: State,
  idToComplete: string,
  shouldComplete: boolean
) {
  const orderAsArray = draftState.client.orderAsArray;
  const indexToComplete = draftState.server.ordering[idToComplete];
  const orgIndent = draftState.server.indention[idToComplete];

  let deltaIndex = indexToComplete;
  let deltaIndent = orgIndent;
  do {
    // Set all children and grandchildren
    let deltaId = orderAsArray[deltaIndex];
    draftState.server.completion[deltaId] = !!shouldComplete;

    deltaIndex++;
    deltaId = orderAsArray[deltaIndex];
    deltaIndent = draftState.server.indention[deltaId];
  } while (deltaIndent > orgIndent && deltaIndex < orderAsArray.length);
}

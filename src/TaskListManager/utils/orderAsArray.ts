import { ServerState } from '../types';

export function orderAsArray(ordering: ServerState['ordering']) {
  return Object.entries(ordering as { [key: string]: number })
    .sort(([, aOrder], [, bOrder]) => {
      if (aOrder < bOrder) return -1;
      if (aOrder > bOrder) return 1;
      return 0;
    })
    .map(([taskId]) => taskId);
}

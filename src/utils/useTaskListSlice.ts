import { useEffect, useRef, useState } from 'react';
import { State } from 'src/TaskListManager/types';
import { useTaskListManager } from './TaskListProvider';

export function useTaskListSlice<T extends any[]>(
  slicer: (state: State) => T
): T {
  const stateManager = useTaskListManager();
  const unmountedRef = useRef(false);

  useEffect(
    () => () => {
      unmountedRef.current = true;
    },
    []
  );

  const getNewState = () => {
    if (!stateManager || unmountedRef.current) return ([] as unknown) as T;
    return slicer(stateManager.getState());
  };

  const [state, setState] = useState(getNewState());

  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  });

  useEffect(() => {
    if (stateManager) {
      setState(getNewState());
      return stateManager.subscribe(() => {
        const newState = getNewState();
        const dirty = newState.filter((val, i) => val !== stateRef.current[i]);
        // only update if anything has changed.
        dirty.length && setState(newState);
      });
    }
  }, [stateManager]);

  return state;
}

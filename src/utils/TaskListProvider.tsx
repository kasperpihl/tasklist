import React, {
  useMemo,
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useRef,
} from 'react';
import { TaskListManager } from 'src/TaskListManager/TaskListManager';
import { useTaskListKeyboard } from './useTaskListKeyboard';

export interface ITaskListProviderProps {
  children: ReactNode;
}
const initialVersion = localStorage.getItem('');

export const TaskListContext = createContext<TaskListManager | null>(null);

export const useTaskListManager = () => {
  const taskListManager = useContext(TaskListContext);
  if (!taskListManager) {
    throw Error('No task list manager as parent...');
  }

  return taskListManager;
};

export function TaskListProvider({ children }: ITaskListProviderProps) {
  const taskId = 'first-id';

  const taskListManager = useMemo(() => {
    const storage = localStorage.getItem('@storage');
    if (storage) {
      return new TaskListManager(JSON.parse(storage));
    }
    return new TaskListManager({
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
    });
  }, []);

  const lastState = useRef(taskListManager.getState().server);

  useEffect(() => {
    taskListManager.subscribe((manager) => {
      if (manager.getState().server !== lastState.current) {
        localStorage.setItem(
          '@storage',
          JSON.stringify(manager.getState().server)
        );
        lastState.current = manager.getState().server;
      }
    });
  }, [taskListManager]);

  useTaskListKeyboard(taskListManager);

  return (
    <TaskListContext.Provider value={taskListManager}>
      {children}
    </TaskListContext.Provider>
  );
}

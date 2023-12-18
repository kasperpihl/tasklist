import React, { useMemo } from 'react';
import { useClassNames } from 'swiss-react';
import { TaskListStyles } from './TaskList.style';
import { useTaskListSlice } from 'src/utils/useTaskListSlice';
import { TaskItem } from '../Item/TaskItem';
export interface ITaskListProps {}

export function TaskList({}: ITaskListProps) {
  const cn = useClassNames(TaskListStyles);

  const [visibleOrder] = useTaskListSlice((state) => [
    state.client.visibleOrder,
  ]);

  return (
    <div className={cn.Wrapper()}>
      {visibleOrder.map((taskId) => (
        <TaskItem taskId={taskId} key={taskId} />
      ))}
    </div>
  );
}

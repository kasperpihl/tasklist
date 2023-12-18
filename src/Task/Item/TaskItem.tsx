import React from 'react';
import TaskItemStyle from './TaskItem.style';
import { useClassNames } from 'swiss-react';
import { useTaskListSlice } from 'src/utils/useTaskListSlice';
import { TaskItemExpand } from './Expand/TaskItemExpand';
import { TaskItemInput } from './Input/TaskItemInput';
import { TaskItemCheckbox } from './Checkbox/TaskItemCheckbox';

export interface ITaskItemProps {
  taskId: string;
}

export function TaskItem({ taskId }: ITaskItemProps) {
  const cn = useClassNames(TaskItemStyle);

  const [indention, isFocused, indentComp] = useTaskListSlice((state) => [
    state.server.indention[taskId],
    state.client.selectedId === taskId,
    state.client.indentComp[taskId] || 0, // Indent compensation for filters
  ]);

  if (typeof indention === 'undefined') return null;

  return (
    <div
      className={`TaskItemWrapper ${cn.Wrapper({
        indention: indention - indentComp,
        isFocused,
        isSelected: false,
        isRoot: indention === 0,
      })}`}
    >
      <TaskItemExpand taskId={taskId} />
      {indention > 0 && <TaskItemCheckbox taskId={taskId} />}
      <TaskItemInput taskId={taskId} />
    </div>
  );
}

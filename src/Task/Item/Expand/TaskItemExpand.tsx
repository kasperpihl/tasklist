import React, { useCallback } from 'react';
import TaskItemExpandStyle from './TaskItemExpand.style';
import { useClassNames } from 'swiss-react';
import { useTaskListSlice } from 'src/utils/useTaskListSlice';
import { useTaskListManager } from 'src/utils/TaskListProvider';
import ArrowRight from 'src/assets/icons/arrow-right.svg';

export interface ITaskItemExpandProps {
  taskId: string;
}

export function TaskItemExpand({ taskId }: ITaskItemExpandProps) {
  const cn = useClassNames(TaskItemExpandStyle);
  const stateManager = useTaskListManager();
  const [expanded, hasChildren, indention] = useTaskListSlice((state) => [
    state.client.expanded[taskId],
    state.client.hasChildren[taskId],
    state.server.indention[taskId],
  ]);

  const handleExpandClick = useCallback(
    (e) => {
      e.stopPropagation();
      stateManager.expansion[expanded ? 'collapse' : 'expand'](
        taskId,
        indention > 0
      );
    },
    [expanded]
  );

  return (
    <div className={cn.Wrapper()} onClick={handleExpandClick}>
      {hasChildren && (
        <ArrowRight icon="ArrowRight" className={cn.Icon(expanded)} />
      )}
    </div>
  );
}

import React, { useCallback } from 'react';
import TaskItemCheckboxStyle from './TaskItemCheckbox.style';
import { useClassNames } from 'swiss-react';
import { useTaskListManager } from 'src/utils/TaskListProvider';
import { useTaskListSlice } from 'src/utils/useTaskListSlice';
import CheckmarkIcon from 'src/assets/icons/checkmark.svg';

export interface ITaskItemCheckboxProps {
  taskId: string;
}

export function TaskItemCheckbox({ taskId }: ITaskItemCheckboxProps) {
  const cn = useClassNames(TaskItemCheckboxStyle);
  const stateManager = useTaskListManager();
  const [completion] = useTaskListSlice((state) => [
    state.server.completion[taskId],
  ]);

  const handleComplete = useCallback(() => {
    if (completion) {
      stateManager.completion.incomplete(taskId);
    } else {
      stateManager.completion.complete(taskId);
    }
  }, [completion]);

  return (
    <div
      className={`TaskItemCheckbox_Wrapper ${cn.Wrapper()}`}
      onClick={handleComplete}
    >
      <div className={cn.Checkbox(Boolean(completion))}>
        {completion && <CheckmarkIcon fill="#FFFFFF" width="18" />}
      </div>
    </div>
  );
}

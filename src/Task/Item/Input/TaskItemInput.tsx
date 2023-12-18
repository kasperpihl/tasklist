import React, { useRef, useState, useCallback, useEffect } from 'react';
import TaskItemInputStyle from './TaskItemInput.style';
import useUnmountedRef from 'src/utils/useUnmountedRef';
import { useTaskListSlice } from 'src/utils/useTaskListSlice';
import { useTaskListManager } from 'src/utils/TaskListProvider';
import { useClassNames } from 'swiss-react';
import TextareaAutosize from 'react-textarea-autosize';

export interface ITaskItemInputProps {
  taskId: string;
}

export function TaskItemInput({ taskId }: ITaskItemInputProps) {
  const cn = useClassNames(TaskItemInputStyle);

  const unmountedRef = useUnmountedRef();
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const taskListManager = useTaskListManager();

  const [
    isRoot,
    title,
    isSelected,
    selectionStart,
    isCompleted,
  ] = useTaskListSlice((state) => [
    state.server.indention[taskId] === 0,
    state.server.tasks_by_id[taskId].title,
    state.client.selectedId === taskId,
    state.client.selectedId === taskId && state.client.selectionStart,
    Boolean(state.server.completion[taskId]),
  ]);

  const handleFocus = useCallback(() => {
    taskListManager.selection.select(taskId);

    setIsFocused(true);
  }, [taskListManager, taskId]);

  const handleBlur = useCallback(() => {
    taskListManager.selection.deselect(taskId);
    !unmountedRef.current && setIsFocused(false);
  }, [taskListManager, taskId]);

  const handleChange = useCallback(
    (e) => {
      if (e.keyCode === 13) {
        e.preventDefault();
      }
      taskListManager.editing.updateTitle(
        taskId,
        e.target.value.substr(0, 255)
      );
    },
    [taskListManager, taskId]
  );

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (isSelected && !isFocused) {
        inputRef.current?.focus();
        if (typeof selectionStart === 'number') {
          const selI = Math.min(title.length, selectionStart);

          inputRef.current?.setSelectionRange(selI, selI);
        }
      } else if (!isSelected && isFocused) {
        inputRef.current?.blur();
      }
    }, 1);
    return () => {
      clearTimeout(timerId);
    };
  });

  return (
    <TextareaAutosize
      className={cn.Input({ isCompleted, isRoot })}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder={isRoot ? 'Write section header' : 'Write a task'}
      value={title}
      ref={inputRef}
    />
  );
}

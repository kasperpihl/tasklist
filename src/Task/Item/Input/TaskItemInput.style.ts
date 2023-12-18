import { createStyles, condition } from 'swiss-react';
import { mixins } from 'src/TaskListManager/utils/mixins';

export default createStyles('TaskItemInput', () => ({
  Input: ({
    isRoot,
    isCompleted,
    isAttachment,
  }: {
    isRoot: boolean;
    isCompleted?: boolean;
    isAttachment?: boolean;
  }) => ({
    background: 'none',
    color: mixins.colors.dark,
    width: '100%',
    padding: '6px 6px',
    resize: 'none',
    border: 'none',
    outline: 'none',
    boxShadow: 'none',
    overflowY: 'hidden',
    [condition(isRoot)]: {
      fontSize: '20px',
      lineHeight: '28px',
    },
    [condition(isAttachment)]: {
      pointerEvents: 'none',
      '.TaskItemWrapper:hover &:not(:focus)': {
        color: mixins.colors.blue,
      },
    },
    [condition(isCompleted)]: {
      opacity: '0.5',
    },
  }),
}));

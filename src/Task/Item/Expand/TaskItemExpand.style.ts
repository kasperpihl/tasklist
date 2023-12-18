import { createStyles, condition } from 'swiss-react';
import { mixins } from 'src/TaskListManager/utils/mixins';

export default createStyles('TaskItemExpand', () => ({
  Wrapper: () => ({
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 'none',
    cursor: 'pointer',
    userSelect: 'none',
    opacity: 0.8,
    '&:hover': {
      opacity: 1,
    },
  }),
  Icon: (expanded: boolean) => ({
    width: '36px',
    height: '36px',
    fill: mixins.colors.sw2,
    pointerEvents: 'none',
    transition: '.1s',
    [condition(expanded)]: {
      transform: 'rotate(90deg)',
    },
  }),
}));

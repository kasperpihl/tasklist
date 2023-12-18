import { createStyles, condition } from 'swiss-react';
import { mixins } from 'src/TaskListManager/utils/mixins';

export default createStyles('TaskItemCheckbox', () => ({
  Wrapper: () => ({
    width: '24px',
    height: '24px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '1px',
    flex: 'none',
    cursor: 'pointer',
    userSelect: 'none',
  }),
  Checkbox: (checked: boolean) => ({
    width: '16px',
    height: '16px',
    border: `1px solid ${mixins.colors.sw3}`,
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
    [condition(!checked)]: {
      '.TaskItemCheckbox_Wrapper:hover &': {
        border: '1px solid #05A851',
      },
    },
    [condition(checked)]: {
      background: '#05A851',
      border: 'none',
      '.TaskItemCheckbox_Wrapper:hover &': {
        opacity: 0.5,
      },
    },
  }),
  Icon: () => ({}),
}));

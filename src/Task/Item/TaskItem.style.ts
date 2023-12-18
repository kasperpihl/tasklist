import { createStyles, condition } from 'swiss-react';

export default createStyles('TaskItem', () => ({
  Wrapper: ({
    indention,
    isFocused,
    isSelected,
    isRoot,
  }: {
    indention: number;
    isFocused: boolean;
    isSelected: boolean;
    isRoot: boolean;
  }) => ({
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    paddingLeft: `${Math.max(indention - 1, 0) * 24}px`,
    paddingRight: '6px',
    [condition(isRoot)]: {
      marginTop: '20px',
    },
    [condition(isSelected)]: {
      backgroundColor: '#E1F0E6',
      opacity: 1,
    },
    [condition(isFocused)]: {
      backgroundColor: '#D5EDD1',
      opacity: 1,
    },
    '&:hover': {
      opacity: 1,
    },
    cursor: 'pointer',
    borderRadius: '4px',
    // flex: 'none'
  }),
}));

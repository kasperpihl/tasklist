export type ServerState = {
  ordering: {
    [key: string]: number;
  };
  indention: {
    [key: string]: number;
  };
  completion: {
    [key: string]: boolean | null;
  };
  completionPercentage: number;
  tasks_by_id: {
    [key: string]: Task;
  };
};

export type Task = {
  task_id: string;
  title: string;
  assignees: string[];
  attachment: null;
  due_date: Date | null;
};

export type ClientState = {
  orderAsArray: string[];
  numberOfCompleted: number;
  sliderValue: number;
  numberOfLeafs: number;
  selectedId: string | null;
  selectionStart: number | null;
  maxIndention: number;
  expanded: { [key: string]: boolean };
  hasChildren: { [key: string]: boolean };
  indentComp: { [key: string]: number };
  visibleOrder: string[];
  editing: boolean;
  filteredTaskIds: string[] | null;
  filteredAssignee: string | null;
  filteredCompleted: boolean;
};

export type State = {
  server: ServerState;
  client: ClientState;
};

export type UpdateOptions = {
  skipValidation?: boolean;
};

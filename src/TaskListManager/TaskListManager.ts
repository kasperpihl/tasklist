import { Completion } from './handler/Completion';
import { Editing } from './handler/Editing';
import { Expansion } from './handler/Expansion';
import { Filtering } from './handler/Filtering';
import { Indention } from './handler/Indention';
import { Info } from './handler/Info';
import { Selection } from './handler/Selection';

import produce from 'immer';
import { validateState } from './utils/validateState';
import { randomString } from './utils/randomString';
import { ServerState, ClientState, State, UpdateOptions } from './types';
import { orderAsArray } from './utils/orderAsArray';

export class TaskListManager {
  private _state: State;
  private _subscriptions: {
    [key: string]: (manager: TaskListManager) => void;
  };
  completion: Completion;
  editing: Editing;
  filtering: Filtering;
  expansion: Expansion;
  indention: Indention;
  info: Info;
  selection: Selection;

  constructor(serverState: ServerState, clientState?: ClientState) {
    this._state = produce(
      {
        server: serverState,
        client: {
          orderAsArray: orderAsArray(serverState.ordering),
          hasChildren: {},
          selectedId: null,
          selectionStart: null,
          sliderValue: 0,
          expanded: {},
          visibleOrder: [],
          indentComp: {},
          editing: false,
          filteredAssignee: null,
          filteredCompleted: false,
          filteredTaskIds: null,
          ...clientState,
        } as ClientState,
      },
      (draftState) => validateState(draftState)
    );

    this._subscriptions = {};

    this.completion = new Completion(this);
    this.editing = new Editing(this);
    this.filtering = new Filtering(this);
    this.expansion = new Expansion(this);
    this.indention = new Indention(this);
    this.info = new Info(this);
    this.selection = new Selection(this);
  }

  private _unsubscribe = (subId: string) => {
    delete this._subscriptions[subId];
  };
  subscribe = (callback: (manager: TaskListManager) => void) => {
    const subId = randomString();
    this._subscriptions[subId] = callback;
    return this._unsubscribe.bind(null, subId);
  };

  getState = () => this._state;

  private _isUpdating = false;
  private _updateQueue: [(draftState: State) => void, UpdateOptions][] = [];

  update = (
    updater: (draftState: State) => void,
    options: UpdateOptions = {}
  ) => {
    if (this._isUpdating) {
      this._updateQueue.push([updater, options]);
      return;
    }

    this._isUpdating = true;

    this._state = produce(this._state, (draftState) => {
      updater(draftState);
      if (!options.skipValidation) {
        validateState(draftState);
      }
    });

    Object.values(this._subscriptions).forEach((callback) => callback(this));

    this._isUpdating = false;

    const next = this._updateQueue.pop();
    if (next) {
      this.update(...next);
    }
  };
}

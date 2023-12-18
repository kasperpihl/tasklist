import { State } from '../types';

export function validateState(draftState: State) {
  // Verify completion
  const order = draftState.client.orderAsArray;

  const allCompletedForLevel: { [key: string]: boolean } = {};
  let currentIndention = -1;
  let numberOfCompleted = 0;
  let numberOfLeafs = 0;
  const checkCompletionForTask = (taskId: string) => {
    const indention = draftState.server.indention[taskId];
    let completed = !!draftState.server.completion[taskId];

    const key = '' + indention; // Make sure key is a string

    // If we hit a lower indention
    if (indention < currentIndention) {
      const childLevelKey = `${indention + 1}`; // Make sure key is a string

      // check if all of it's children are completed or incomplete
      const childCompleted = allCompletedForLevel[childLevelKey];

      // assign child value to the parent element if needed.
      if (childCompleted !== completed) {
        draftState.server.completion[taskId] = childCompleted;

        completed = childCompleted;
      }

      // Clean child level status, we won't need it now.
      delete allCompletedForLevel[childLevelKey];
    }

    // set the allCompleted for this level, if it does not exist.
    if (typeof allCompletedForLevel[key] === 'undefined') {
      allCompletedForLevel[key] = !!completed;
    }

    // Keep tracking if this level is all completed.
    if (allCompletedForLevel[key] && !completed) {
      allCompletedForLevel[key] = false;
    }

    // Make sure to update indent level
    currentIndention = indention;
  };

  // Count leafs and completed
  const countLeafsAndCompleted = (taskId: string) => {
    const hasChildren = draftState.client.hasChildren[taskId];
    if (!hasChildren) {
      numberOfLeafs++;
      const completed = draftState.server.completion[taskId];
      if (completed) {
        numberOfCompleted++;
      }
    }
  };

  // Verify order
  const checkForOrderOfTask = (taskId: string, index: number) => {
    if (draftState.server.ordering[taskId] !== index) {
      draftState.server.ordering[taskId] = index;
    }
  };

  // Verify hasChildren
  let prevHasChildrenIndention = -1;
  const checkHasChildrenForTask = (taskId: string) => {
    const indention = draftState.server.indention[taskId];
    const hasChildren = draftState.client.hasChildren[taskId];
    const newHasChildren = indention < prevHasChildrenIndention;
    if (newHasChildren !== hasChildren) {
      draftState.client.hasChildren[taskId] = newHasChildren;
    }
    prevHasChildrenIndention = indention;
  };

  // Verify expanded, root elements should start expanded
  const checkExpandedRootElements = (taskId: string) => {
    const indention = draftState.server.indention[taskId];
    const hasChildren = draftState.client.hasChildren[taskId];
    const expanded = draftState.client.expanded[taskId];
    if (indention === 0 && hasChildren && typeof expanded === 'undefined') {
      draftState.client.expanded[taskId] = true;
    }
  };

  let prevIndention = 0;

  const checkIndentionForTask = (taskId: string) => {
    let indention = draftState.server.indention[taskId];
    if (indention > prevIndention + 1) {
      indention = prevIndention + 1;
      draftState.server.indention[taskId] = indention;
    }

    prevIndention = indention;
  };

  const selectedId = draftState.client.selectedId;
  let foundSelectedId = false;

  let newVisibleOrder: string[] = [];
  const filteredTaskIds = draftState.client.filteredTaskIds;
  const filteredAssignee = draftState.client.filteredAssignee;
  const filteredCompleted = draftState.client.filteredCompleted;
  let indentComp = draftState.client.indentComp;

  let visibleRootIndention = -1;
  let filteredIndention = -1;

  let blockIndentionMoreThan = -1;
  let maxIndention = 0;

  const hasAnyFilter = filteredAssignee || filteredCompleted;

  const generateVisibleOrder = (taskId: string) => {
    const indention = draftState.server.indention[taskId];
    if (!draftState.client.editing && (!selectedId || !foundSelectedId)) {
      // filteredTaskIds
      if (filteredTaskIds) {
        if (filteredIndention > -1 && indention <= filteredIndention) {
          filteredIndention = -1;
        }
        if (filteredTaskIds.indexOf(taskId) > -1) {
          filteredIndention = indention;
          visibleRootIndention = -1;
          blockIndentionMoreThan = -1;
        }
        if (filteredIndention === -1) return;
      }

      // Support filters!
      if (hasAnyFilter) {
        if (visibleRootIndention > -1 && indention <= visibleRootIndention) {
          visibleRootIndention = -1;
        }
        if (visibleRootIndention === -1) {
          let matchedAllFilters = true;
          const assignees =
            draftState.server.tasks_by_id[taskId].assignees || [];

          if (filteredAssignee && assignees.indexOf(filteredAssignee) === -1) {
            matchedAllFilters = false;
          } else if (
            filteredCompleted &&
            draftState.server.completion[taskId]
          ) {
            matchedAllFilters = false;
          }
          if (matchedAllFilters) {
            visibleRootIndention = indention;
            blockIndentionMoreThan = -1;
          }
        }
        if (visibleRootIndention === -1) {
          return;
        }
      }

      // Make sure to hide all completed, despite being children
      if (filteredCompleted && draftState.server.completion[taskId]) {
        return;
      }

      let comp = 0;
      if (visibleRootIndention > -1) {
        comp = visibleRootIndention;
      } else if (filteredIndention > -1) {
        comp = filteredIndention;
      }
      if (comp !== indentComp[taskId]) {
        indentComp[taskId] = comp;
      }

      maxIndention = Math.max(maxIndention, indention - comp);
    }

    // Hide collapsed items
    if (blockIndentionMoreThan > -1 && indention > blockIndentionMoreThan) {
      return;
    }

    if (blockIndentionMoreThan > -1 && indention <= blockIndentionMoreThan) {
      blockIndentionMoreThan = -1;
    }

    if (
      draftState.client.hasChildren[taskId] &&
      !draftState.client.expanded[taskId]
    ) {
      blockIndentionMoreThan = indention;
    }

    newVisibleOrder.push(taskId);
  };

  // Looping backwards.
  for (let index = order.length - 1; index >= 0; index--) {
    const taskId = order[index];
    if (selectedId && selectedId === taskId) {
      foundSelectedId = true;
    }
    checkCompletionForTask(taskId);
    checkForOrderOfTask(taskId, index);
    checkHasChildrenForTask(taskId);
    checkExpandedRootElements(taskId);
    countLeafsAndCompleted(taskId);
  }

  for (let index = 0; index < order.length; index++) {
    const taskId = order[index];
    checkIndentionForTask(taskId);
    generateVisibleOrder(taskId);
  }
  if (selectedId && !foundSelectedId) {
    draftState.client.selectedId = null;
  }
  if (
    draftState.client.selectedId &&
    !draftState.client.editing &&
    (hasAnyFilter || filteredTaskIds)
  ) {
    draftState.client.editing = true;
  }

  // Update max indention if needed
  if (draftState.client.maxIndention !== maxIndention) {
    draftState.client.maxIndention = maxIndention;
  }

  // Update visible order if needed
  if (draftState.client.visibleOrder.length !== newVisibleOrder.length) {
    draftState.client.visibleOrder = newVisibleOrder;
  }

  if (draftState.client.numberOfLeafs !== numberOfLeafs) {
    draftState.client.numberOfLeafs = numberOfLeafs;
  }
  if (draftState.client.numberOfCompleted !== numberOfCompleted) {
    draftState.client.numberOfCompleted = numberOfCompleted;
  }

  // Update Completion percentage if needed
  const percentageCompleted = numberOfLeafs
    ? Math.ceil((numberOfCompleted / numberOfLeafs) * 100)
    : 0;
  if (draftState.server.completionPercentage !== percentageCompleted) {
    draftState.server.completionPercentage = percentageCompleted;
  }
}

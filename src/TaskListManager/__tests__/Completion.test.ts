import { getEmptyManager } from './testUtils';

const firstId = 'firstId';

test('Completion starts as undefined', () => {
  const manager = getEmptyManager(firstId);
  expect(manager.getState().server.completion[firstId]).toEqual(undefined);
});

test('Completing a task sets completion to true', () => {
  const manager = getEmptyManager(firstId);
  manager.completion.complete(firstId);
  expect(manager.getState().server.completion[firstId]).toEqual(true);
});

test('Completing a parent sets children and grandchildren to completetd', () => {
  const manager = getEmptyManager(firstId);
  const secondId = manager.editing.enter(firstId);
  const thirdId = manager.editing.enter(secondId);
  manager.indention.indent(secondId);
  manager.indention.indent(thirdId);
  manager.indention.indent(thirdId);

  manager.completion.complete(firstId);
  expect(manager.getState().server.completion).toEqual({
    [firstId]: true,
    [secondId]: true,
    [thirdId]: true,
  });
});

test('Incompleting a child sets parent to incomplete', () => {
  const manager = getEmptyManager(firstId);
  const secondId = manager.editing.enter(firstId);
  const thirdId = manager.editing.enter(secondId);
  manager.indention.indent(secondId);
  manager.indention.indent(thirdId);

  manager.completion.complete(firstId);

  manager.completion.incomplete(thirdId);

  expect(manager.getState().server.completion).toEqual({
    [firstId]: false,
    [secondId]: true,
    [thirdId]: false,
  });
});

test('Completing all works', () => {
  const manager = getEmptyManager(firstId);
  const secondId = manager.editing.enter(firstId);
  const thirdId = manager.editing.enter(secondId);
  manager.indention.indent(secondId);

  manager.completion.completeAll(true);

  expect(manager.getState().server.completion).toEqual({
    [firstId]: true,
    [secondId]: true,
    [thirdId]: true,
  });
});

test('Incompleting all works', () => {
  const manager = getEmptyManager(firstId);
  const secondId = manager.editing.enter(firstId);
  const thirdId = manager.editing.enter(secondId);
  manager.indention.indent(secondId);

  manager.completion.completeAll(true);
  manager.completion.completeAll(false);

  expect(manager.getState().server.completion).toEqual({
    [firstId]: false,
    [secondId]: false,
    [thirdId]: false,
  });
});

test('Indenting an incomplete task into a complete parent, incompletes parent', () => {
  const manager = getEmptyManager(firstId);
  const secondId = manager.editing.enter(firstId);
  const thirdId = manager.editing.enter(secondId);
  manager.indention.indent(secondId);

  manager.completion.complete(firstId);
  manager.indention.indent(thirdId);

  expect(manager.getState().server.completion).toEqual({
    [firstId]: false,
    [secondId]: true,
    [thirdId]: undefined,
  });
});

test('Outdenting an incomplete task with only complete siblings, completes parent', () => {
  const manager = getEmptyManager(firstId);
  const secondId = manager.editing.enter(firstId);
  const thirdId = manager.editing.enter(secondId);
  manager.indention.indent(secondId);
  manager.indention.indent(thirdId);

  manager.completion.complete(secondId);
  manager.indention.outdent(thirdId);

  expect(manager.getState().server.completion).toEqual({
    [firstId]: true,
    [secondId]: true,
    [thirdId]: undefined,
  });
});

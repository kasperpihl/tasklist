import { getEmptyManager } from './testUtils';

const firstId = 'firstid';

test('initial state is correct', () => {
  const manager = getEmptyManager(firstId);
  expect(manager.getState().server.indention[firstId]).toEqual(0);
});

test('do not indent first child', () => {
  const manager = getEmptyManager(firstId);
  manager.indention.indent(firstId);

  expect(manager.getState().server.indention[firstId]).toEqual(0);
});

test('Indenting a task works', () => {
  const manager = getEmptyManager(firstId);

  const secondId = manager.editing.enter(firstId);
  manager.indention.indent(secondId);

  expect(manager.getState().server.indention).toEqual({
    [firstId]: 0,
    [secondId]: 1,
  });
});

test('Outdenting a task works', () => {
  const manager = getEmptyManager(firstId);

  const secondId = manager.editing.enter(firstId);
  manager.indention.indent(secondId);
  manager.indention.outdent(secondId);

  expect(manager.getState().server.indention).toEqual({
    [firstId]: 0,
    [secondId]: 0,
  });
});

test('Do not allow indention more than +1 from parent.', () => {
  const manager = getEmptyManager(firstId);

  const secondId = manager.editing.enter(firstId);
  manager.indention.indent(secondId);
  manager.indention.indent(secondId);

  expect(manager.getState().server.indention).toEqual({
    [firstId]: 0,
    [secondId]: 1,
  });
});

test('Do not allow outdenting to more than 0.', () => {
  const manager = getEmptyManager(firstId);

  const secondId = manager.editing.enter(firstId);
  manager.indention.indent(secondId);
  manager.indention.outdent(secondId);
  manager.indention.outdent(secondId);

  expect(manager.getState().server.indention).toEqual({
    [firstId]: 0,
    [secondId]: 0,
  });
});

test('When I press enter, the new task should keep the same indention', () => {
  const manager = getEmptyManager(firstId);

  const secondId = manager.editing.enter(firstId);
  manager.indention.indent(secondId);

  // Make sure there is a title on second, otherwise third will outdent instead
  manager.editing.updateTitle(secondId, 'i am title');

  const thirdId = manager.editing.enter(secondId);

  expect(manager.getState().server.indention).toEqual({
    [firstId]: 0,
    [secondId]: 1,
    [thirdId]: 1,
  });
});

test('When outdenting a parent, outdent its children and grandchildren as well', () => {
  const manager = getEmptyManager(firstId);

  const secondId = manager.editing.enter(firstId);
  const thirdId = manager.editing.enter(secondId);
  const fourthId = manager.editing.enter(thirdId);

  manager.indention.indent(secondId);

  manager.indention.indent(thirdId);
  manager.indention.indent(thirdId);

  manager.indention.indent(fourthId);
  manager.indention.indent(fourthId);
  manager.indention.indent(fourthId);

  manager.indention.outdent(secondId);

  expect(manager.getState().server.indention).toEqual({
    [firstId]: 0,
    [secondId]: 0,
    [thirdId]: 1,
    [fourthId]: 2,
  });
});

test('When indenting a parent, indent its children and grandchildren as well', () => {
  const manager = getEmptyManager(firstId);

  const secondId = manager.editing.enter(firstId);
  const thirdId = manager.editing.enter(secondId);
  const fourthId = manager.editing.enter(thirdId);

  manager.indention.indent(thirdId);

  manager.indention.indent(fourthId);
  manager.indention.indent(fourthId);

  manager.indention.indent(secondId);

  expect(manager.getState().server.indention).toEqual({
    [firstId]: 0,
    [secondId]: 1,
    [thirdId]: 2,
    [fourthId]: 3,
  });
});

test('when I press enter on an empty task it should OUTDENT if indented', () => {
  const manager = getEmptyManager(firstId);

  const secondId = manager.editing.enter(firstId);
  manager.indention.indent(secondId);

  manager.editing.enter(secondId);

  expect(manager.getState().server.indention).toEqual({
    [firstId]: 0,
    [secondId]: 0,
  });
});

test('when I press enter on an empty task it should CREATE A NEW if NOT indented', () => {
  const manager = getEmptyManager(firstId);

  const secondId = manager.editing.enter(firstId);
  manager.editing.enter(secondId);

  expect(Object.keys(manager.getState().server.tasks_by_id).length).toEqual(3);
});

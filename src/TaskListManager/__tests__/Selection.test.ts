import { getEmptyManager } from './testUtils';

const firstId = 'firstId';

test('Initial select is null', () => {
  const manager = getEmptyManager(firstId);
  expect(manager.getState().client.selectedId).toEqual(null);
});

test('Selecting previous from first go to last', () => {
  const manager = getEmptyManager(firstId);

  const secondId = manager.editing.enter(firstId);
  const thirdId = manager.editing.enter(secondId);
  const fourthId = manager.editing.enter(thirdId);

  manager.selection.select(firstId);

  manager.selection.selectPrev(0);

  expect(manager.getState().client.selectedId).toEqual(fourthId);
});

test('Selecting next from last go to first', () => {
  const manager = getEmptyManager(firstId);

  const secondId = manager.editing.enter(firstId);
  const thirdId = manager.editing.enter(secondId);
  const fourthId = manager.editing.enter(thirdId);

  manager.selection.select(fourthId);

  manager.selection.selectNext(0);

  expect(manager.getState().client.selectedId).toEqual(firstId);
});

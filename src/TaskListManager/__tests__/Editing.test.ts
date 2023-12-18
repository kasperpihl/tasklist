import { getEmptyManager } from './testUtils';

const firstId = 'firstId';

test('Field starts with empty title', () => {
  const manager = getEmptyManager(firstId);
  expect(manager.getState().server.tasks_by_id[firstId].title).toEqual('');
});

test('Editing a title sets the title field', () => {
  const title = 'hello there';
  const manager = getEmptyManager(firstId);
  manager.editing.updateTitle(firstId, title);
  expect(manager.getState().server.tasks_by_id[firstId].title).toEqual(title);
});

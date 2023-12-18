import { getEmptyManager } from './testUtils';

const firstId = 'firstId';

test('Initial task is not expanded', () => {
  const manager = getEmptyManager(firstId);
  expect(manager.getState().client.expanded[firstId]).toEqual(undefined);
});

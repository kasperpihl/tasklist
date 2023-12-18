import { getEmptyManager } from './testUtils';

const firstId = 'firstId';

test('Initial task is visible', () => {
  const manager = getEmptyManager(firstId);
  expect(manager.getState().client.visibleOrder[0]).toEqual(firstId);
});

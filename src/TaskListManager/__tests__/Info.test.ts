import { getEmptyManager } from './testUtils';

const firstId = 'firstId';

test('Initial completed total is [0, 1]', () => {
  const manager = getEmptyManager(firstId);
  expect(manager.info.getCompletedAndTotal(firstId)).toEqual([0, 1]);
});

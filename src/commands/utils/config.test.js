import config from './config';


const KEY_TEST = 'test';
const KEY_TEST_VALUE = 'testing';

beforeAll(() => {
  config.set(KEY_TEST, 'testing');
});

afterAll(() => {
  config.unset(KEY_TEST);
});


test('Can get key', () => {
  expect(config.get(KEY_TEST)).toBe(KEY_TEST_VALUE);
});

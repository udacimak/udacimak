import getFullErrorMessage from './getFullErrorMessage';


describe('Get Full Error Message', () => {
  test('should return string if passed a string', () => {
    const error = 'test error';

    expect(getFullErrorMessage(error)).toBe(`"${error}"`);
  });

  test('should return string if passed an Error object', () => {
    const error = new Error('test error');
    const errorMessage = getFullErrorMessage(error);
    expect(typeof errorMessage).toBe('string');
    expect(errorMessage).toMatch(/test error/);
  });
});
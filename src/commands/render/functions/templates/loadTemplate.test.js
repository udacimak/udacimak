import loadTemplate from './loadTemplate';


describe('Load Template', () => {

  test('should load template as html string', async () => {
    const html = await loadTemplate('index');

    expect(typeof html).toBe('string');
  });

  test('should throw error if html file doesn\'t exist', async () => {
    try {
      await loadTemplate('wrong!!!!!!!!');
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });
});

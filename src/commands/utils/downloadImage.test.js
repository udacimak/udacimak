import downloadImage from './downloadImage';


describe('Download image', () => {
  test('should return empty if no url given', async () => {
    expect.assertions(1);
    const img = await downloadImage('', '');
    expect(img).toBe('');
  });
});

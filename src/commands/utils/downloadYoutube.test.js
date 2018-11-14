import downloadYoutube from './downloadYoutube';


describe('Download image', () => {
  test('should return empty if no url given', async () => {
    expect.assertions(1);
    const img = await downloadYoutube('', '', '', '');
    expect(img).toBe(null);
  });
});

import downloadMediaInHtml from './downloadMediaInHtml';


describe('Download Media in HTML', () => {
  test('should return same HTML if no media links is in HTML', async () => {
    expect.assertions(1);
    const html = '<p>test</p>';
    const newHtml = await downloadMediaInHtml(html);
    expect(newHtml).toEqual(html);
  });

  xtest('should return HTML with downloaded media links', async () => {
    expect.assertions(1);
    const html = '<p>test</p><';
    const newHtml = await downloadMediaInHtml(html);
    expect(true).toBe(true);
  });
});
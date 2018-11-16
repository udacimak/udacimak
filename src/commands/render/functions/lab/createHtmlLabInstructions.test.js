import createHtmlLabInstructions from './createHtmlLabInstructions';


describe('Create HTML Lab Instructions', () => {
  test('should detect if no lab instruction data available', async () => {
    expect(await createHtmlLabInstructions(null, ''))
      .toContain('No Lab Instructions data available');
  });

  test('should return html', async () => {
    const details = {
      text: '__instructions__',
    };

    const html = '<p><strong>instructions</strong></p>';

    expect(await createHtmlLabInstructions(details, ''))
      .toEqual(html);
  });
});

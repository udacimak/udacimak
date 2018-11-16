import createHtmlLabIntroduction from './createHtmlLabIntroduction';


describe('Create HTML Lab Introduction', () => {
  test('should detect if no lab introduction data given', async () => {
    expect(await createHtmlLabIntroduction(null, '', ''))
      .toContain('No Lab Introduction data available');
  });

  test('should return html containing all data', async () => {
    const title = 'Test Introduction';
    const summary = 'Test should pass';
    const key_takeaways = [
      'test 1',
      'test 2',
    ];

    const overview = {
      title,
      summary,
      key_takeaways,
    };

    const html = await createHtmlLabIntroduction(overview, '', '');

    expect(html).toContain(title);
    expect(html).toContain(summary)
    expect(html).toContain(key_takeaways[0])
    expect(html).toContain(key_takeaways[1]);
  });
});

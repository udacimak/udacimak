import markdownToHtml from './markdownToHtml';


describe('Markdown to HTML', () => {
  test('convert markdown to html', () => {
    const md = 'paragraph _italic_ __bold__';
    const html = '<p>paragraph <em>italic</em> <strong>bold</strong></p>';

    expect(markdownToHtml(md)).toEqual(html);
  });

  test('convert table', () => {
    const md = `
| Tables   |      Are      |  Cool |
|----------|:-------------:|------:|
| col 1 is |  left-aligned | $1600 |
| col 2 is |    centered   |   $12 |
| col 3 is | right-aligned |    $1 |
`;

    expect(markdownToHtml(md).includes('table')).toBe(true);
    expect(markdownToHtml(md).includes('th')).toBe(true);
    expect(markdownToHtml(md).includes('tr')).toBe(true);
    expect(markdownToHtml(md).includes('td')).toBe(true);
  });
});
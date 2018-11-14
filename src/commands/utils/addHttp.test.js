import addHttp from './addHttp';


describe('Add HTTP', () => {
  test('Do nothing to correct url', () => {
    const url = 'https://www.google.com';
    expect(addHttp(url)).toBe(url);
  });

  test('Fix wrong urls', () => {
    const urls = [
      'www.google.com',
      '//www.google.com',
      '///www.google.com',
      'http://www.google.com',
      'http:///www.google.com',
      'https://www.google.com',
      'https:////www.google.com',
    ];
    let correctUrl = 'https://www.google.com';

    for (let i = 0, len = urls.length; i < len; i += 1) {
      expect(addHttp(urls[i])).toBe(correctUrl);
    }
  });
});

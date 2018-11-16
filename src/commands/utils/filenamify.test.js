import filenamify from './filenamify';


describe('Sanitize filename', () => {
  test("should sanitize file name", () => {
    const filename = 'correct?file/name.mp4';
    const correct = 'correctfilename.mp4';

    expect(filenamify(filename)).toBe(correct);
  });

  test('should sanitize file name that was created from an url basename', () => {
    const filename = 'chartchs=500x250&cht=p&chco=c4df9b%2C6fad0c&chl=Froyo%7CGingerbread%7CIce%20Cream%20Sandwich%7CJelly';
    const correct = 'chartchs=500x250cht=pchco=c4df9b2C6fad0cchl=Froyo7CGingerbread7CIce20Cream20Sandwich7CJelly';

    expect(filenamify(filename)).toBe(correct);
  });
});

import filenamify from './filenamify';


test("Sanitize file name", () => {
  const filename = 'correct?file/name.mp4';
  const correct = 'correctfilename.mp4';

  expect(filenamify(filename)).toBe(correct);
});

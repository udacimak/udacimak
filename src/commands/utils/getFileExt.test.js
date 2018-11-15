import getFileExt from './getFileExt';


test('Returns correct extension', () => {
  const filenames = [
    '01. test.en.mp4',
    'test.en.mp4',
    'test.en.mp4',
  ];

  const correct = '.en.mp4';

  for (let i = 0, len = filenames.length; i < len; i += 1) {
    expect(getFileExt(filenames[i])).toBe(correct);
  }
});

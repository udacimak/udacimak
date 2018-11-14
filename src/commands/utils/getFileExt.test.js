import getFileExt from './getFileExt';


xtest('Returns correct extension', () => {
  const filenames = [
    '01. test.en-us.mp4',
    'test.en-us',
    'test.en-us.mp4',
  ];

  const correct = 'en-us.mp4';

  for (let i = 0, len = filenames.length; i < len; i += 1) {
    expect(getFileExt(filenames[i])).toBe(correct);
  }
});

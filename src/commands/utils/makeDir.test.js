import mockfs from 'mock-fs';
import fs from 'fs';
import makeDir from './makeDir';


describe('Make Dir', () => {
  beforeEach(() => {
    mockfs({
      './fakeDir': {},
    });
  });

  afterEach(() => {
    mockfs.restore();
  });

  test('should create new folder if it doesn\t exist', () => {
    fs.mkdirSync = jest.fn();
    makeDir('./fakeDir', 'newDir');
    expect(fs.mkdirSync).toHaveBeenCalled();
  });

  test('should not create new folder if one already exist', () => {
    fs.mkdirSync = jest.fn();
    makeDir('', 'fakeDir');
    expect(fs.mkdirSync).not.toHaveBeenCalled();
  });
});

import fs from 'fs';
import makeDir from './makeDir';


describe('Make Dir', () => {
  test('should create new folder', () => {
    fs.existsSync = jest.fn();
    fs.existsSync.mockReturnValue(false);

    fs.mkdirSync = jest.fn();
    makeDir('', 'newDir');
    expect(fs.mkdirSync).toHaveBeenCalled();
  });

  test('should not create new folder if one already exist', () => {
    fs.existsSync = jest.fn();
    fs.existsSync.mockReturnValue(true);

    fs.mkdirSync = jest.fn();
    makeDir('', 'oldDir');
    expect(fs.mkdirSync).not.toHaveBeenCalled();
  });
});

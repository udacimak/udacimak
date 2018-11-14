import mockfs from 'mock-fs';
import fs from 'fs';
import path from 'path';
import deleteFilesInFolder from './deleteFilesInFolder';


describe('Delete Files in Folder', () => {
  const PATH_DIR = './fakeDir';

  beforeEach(() => {
    mockfs({
      './fakeDir': {
        'web.html': 'test',
        'img.png': 'test',
      },
    });
  });

  afterEach(() => {
    mockfs.restore();
  });

  test('should delete files in folder', () => {
    deleteFilesInFolder(PATH_DIR);

    const file = path.join(PATH_DIR, 'web.html');
    expect(fs.existsSync(file)).toBeFalsy();
  });

  test('should not delete unwanted files in folder', () => {
    deleteFilesInFolder(PATH_DIR, 'html');

    const fileDeleted = path.join(PATH_DIR, 'web.html');
    const fileExist = path.join(PATH_DIR, 'img.png');

    expect(fs.existsSync(fileDeleted)).toBeFalsy();
    expect(fs.existsSync(fileExist)).toBeTruthy();
  });
});

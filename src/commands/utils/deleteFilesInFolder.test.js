import deleteFilesInFolder from './deleteFilesInFolder';
import fs from 'fs';
import mockFs from 'mock-fs';


describe('Delete Files in Folder', () => {
  const PATH_DIR = 'fakeDir';

  beforeEach(() => {
    mockFs({
      PATH_DIR: {
        'web1.html': 'test',
        'web2.html': 'test',
        'web3.html': 'test',
        'img1.png': 'test',
        'img2.png': 'test',
      },
    });
  });

  afterEach(() => {
    mockFs.restore();
  });

  xtest('should delete files in folder', (done) => {

  });
});
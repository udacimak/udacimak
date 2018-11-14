import mockfs from 'mock-fs';
import fs from 'fs';
import path from 'path';
import findVideoLocalSubtitles from './findVideoLocalSubtitles';


describe('Find Video Local Subtitles', () => {
  const PATH_DIR = './fakeDir';

  beforeEach(() => {
    mockfs({
      './fakeDir': {
        'video.mp4': '',
        'video.en.vtt': '',
        'video.zh-cn.vtt': '',
        'video.bt.vtt': '',
        'video.en-us.srt': '',
        'video.vtt': '',
      },
    });
  });

  afterEach(() => {
    mockfs.restore();
  });

  test('should return subtitles', async() => {
    const subtitles = findVideoLocalSubtitles('video', PATH_DIR);

    expect(subtitles.length).toBe(5);
  });
});

import downloadYoutubeSubtitles from './downloadYoutubeSubtitles';


describe('Download Youtube subtitles', () => {
  test('should return null if no video id given', async () => {
    const dl = await downloadYoutubeSubtitles(' ', ' ', ' ');
    expect(dl).toBeNull();
  });
});
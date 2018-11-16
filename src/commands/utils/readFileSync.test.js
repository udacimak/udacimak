import readFileSync from './readFileSync';


describe('Read File Sync', () => {
  test('should throw error if file doesn\'t exist', () => {
    try {
      readFileSync('nonexist');
    } catch (error) {
      expect(error).toBeTruthy();
    }
  })
});

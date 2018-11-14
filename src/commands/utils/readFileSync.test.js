import readFileSync from './readFileSync';


describe('Read File Sync', () => {
  xtest('should throw error if file doesn\'t exist', () => {
    expect(readFileSync('doesntexist!!!')).toThrowError();
  })
});
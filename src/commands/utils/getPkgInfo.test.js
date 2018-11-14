import getPkgInfo from './getPkgInfo';


describe('Package information', () => {
  it('Can get package information', () => {
    const info = getPkgInfo();

    expect(info.name).toBe('udacimak');
    expect(info.version).toMatch(/^\d{1,2}\.\d{1,2}\.\d{1,2}$/);
  });
});
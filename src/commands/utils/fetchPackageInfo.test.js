import fetchPackageInfo from './fetchPackageInfo';
import getPkgInfo from './getPkgInfo';
import nock from 'nock';
import { API_ENDPOINTS_NPMS_PACKAGE } from '../../config';


describe('Fetch Package Info', () => {
  test('should fail if request doesn\'t return 200', async () => {
    const appName = getPkgInfo().name;
    const url = `${API_ENDPOINTS_NPMS_PACKAGE}/${appName}`;
    
    nock(url)
      .get()
      .reply(500, 'internal server error');
      

    try {
      await fetchPackageInfo();
    } catch (e) {
      expect(e).toBeTruthy();
    }
  });
});
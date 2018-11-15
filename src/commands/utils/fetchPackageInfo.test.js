import nock from 'nock';
import fetchPackageInfo from './fetchPackageInfo';
import pkg from '../../../package.json';
import { API_ENDPOINTS_NPMS_PACKAGE } from '../../config';


describe('Fetch Package Info', () => {
  test('should fail if request doesn\'t return 200', async () => {
    const appName = pkg.name;
    const url = `${API_ENDPOINTS_NPMS_PACKAGE}`;

    nock(url)
      .get(`/${appName}`)
      .replyWithError('test error');

    try {
      await fetchPackageInfo();
    } catch (e) {
      expect(e).toBeTruthy();
    }
  });
});

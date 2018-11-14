import nock from 'nock';
import notifyLatestVersion from './notifyLatestVersion';
import { API_ENDPOINTS_NPMS_PACKAGE } from '../../config';


describe('Notify Latest Version', () => {
  test('should not throw error on 500 response', async () => {
    expect.assertions(0);
    nock(API_ENDPOINTS_NPMS_PACKAGE)
      .get()
      .reply(500);

    // await expect(notifyLatestVersion()).rejects.toBeFalsy();
    try {
      await notifyLatestVersion();
    } catch (e) {
      expect(e).toBeFalsy();
    }
  });
});
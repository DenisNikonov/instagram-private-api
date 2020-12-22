import { Feed } from '../core/feed';
import { ReelsMediaFeedResponse, ReelsMediaFeedResponseItem, ReelsMediaFeedResponseRootObject } from '../responses';
import { IgAppModule } from '../types/common.types';
// import SUPPORTED_CAPABILITIES from '../samples/supported-capabilities.json';
const SUPPORTED_CAPABILITIES = [
  {
    name: 'SUPPORTED_SDK_VERSIONS',
    value:
      '13.0,14.0,15.0,16.0,17.0,18.0,19.0,20.0,21.0,22.0,23.0,24.0,25.0,26.0,27.0,28.0,29.0,30.0,31.0,32.0,33.0,34.0,35.0,36.0,37.0,38.0,39.0,40.0,41.0,42.0,43.0,44.0,45.0,46.0,47.0,48.0,49.0,50.0,51.0,52.0,53.0,54.0,55.0,56.0,57.0,58.0,59.0,60.0,61.0,62.0,63.0,64.0,65.0,66.0',
  },
  {
    name: 'FACE_TRACKER_VERSION',
    value: 12,
  },
  {
    name: 'segmentation',
    value: 'segmentation_enabled',
  },
  {
    name: 'COMPRESSION',
    value: 'ETC2_COMPRESSION',
  },
  {
    name: 'world_tracker',
    value: 'world_tracker_enabled',
  },
  {
    name: 'gyroscope',
    value: 'gyroscope_enabled',
  },
];

export class ReelsMediaFeed extends Feed<ReelsMediaFeedResponseRootObject, ReelsMediaFeedResponseItem> {
  userIds: Array<number | string>;
  source: IgAppModule = 'feed_timeline';

  protected set state(body: any) {}

  async request() {
    const { body } = await this.client.request.send<ReelsMediaFeedResponseRootObject>({
      url: `/api/v1/feed/reels_media/`,
      method: 'POST',
      form: this.client.request.sign({
        user_ids: this.userIds,
        source: this.source,
        _uuid: this.client.state.uuid,
        _uid: this.client.state.cookieUserId,
        _csrftoken: this.client.state.cookieCsrfToken,
        device_id: this.client.state.deviceId,
        supported_capabilities_new: JSON.stringify(SUPPORTED_CAPABILITIES),
      }),
    });
    return body;
  }

  async items(): Promise<ReelsMediaFeedResponseItem[]> {
    const body = await this.request();
    return Object.values(body.reels).reduce(
      (accumulator, current: ReelsMediaFeedResponse) => accumulator.concat(current.items),
      [],
    );
  }
}

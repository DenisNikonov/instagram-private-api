import _ from 'lodash';
import Bluebird from 'bluebird';
import Chance from 'chance';
import { jar } from 'request';
import { Cookie, CookieJar, MemoryCookieStore } from 'tough-cookie';
// import devices from '../samples/devices.json';
const devices = [
  '25/7.1.1; 440dpi; 1080x1920; Xiaomi; Mi Note 3; jason; qcom',
  '23/6.0.1; 480dpi; 1080x1920; Xiaomi; Redmi Note 3; kenzo; qcom',
  '23/6.0; 480dpi; 1080x1920; Xiaomi; Redmi Note 4; nikel; mt6797',
  '24/7.0; 480dpi; 1080x1920; Xiaomi/xiaomi; Redmi Note 4; mido; qcom',
  '23/6.0; 480dpi; 1080x1920; Xiaomi; Redmi Note 4X; nikel; mt6797',
  '27/8.1.0; 440dpi; 1080x2030; Xiaomi/xiaomi; Redmi Note 5; whyred; qcom',
  '23/6.0.1; 480dpi; 1080x1920; Xiaomi; Redmi 4; markw; qcom',
  '27/8.1.0; 440dpi; 1080x2030; Xiaomi/xiaomi; Redmi 5 Plus; vince; qcom',
  '25/7.1.2; 440dpi; 1080x2030; Xiaomi/xiaomi; Redmi 5 Plus; vince; qcom',
  '26/8.0.0; 480dpi; 1080x1920; Xiaomi; MI 5; gemini; qcom',
  '27/8.1.0; 480dpi; 1080x1920; Xiaomi/xiaomi; Mi A1; tissot_sprout; qcom',
  '26/8.0.0; 480dpi; 1080x1920; Xiaomi; MI 6; sagit; qcom',
  '25/7.1.1; 440dpi; 1080x1920; Xiaomi; MI MAX 2; oxygen; qcom',
  '24/7.0; 480dpi; 1080x1920; Xiaomi; MI 5s; capricorn; qcom',
  '26/8.0.0; 480dpi; 1080x1920; samsung; SM-A520F; a5y17lte; samsungexynos7880',
  '26/8.0.0; 480dpi; 1080x2076; samsung; SM-G950F; dreamlte; samsungexynos8895',
  '26/8.0.0; 640dpi; 1440x2768; samsung; SM-G950F; dreamlte; samsungexynos8895',
  '26/8.0.0; 420dpi; 1080x2094; samsung; SM-G955F; dream2lte; samsungexynos8895',
  '26/8.0.0; 560dpi; 1440x2792; samsung; SM-G955F; dream2lte; samsungexynos8895',
  '24/7.0; 480dpi; 1080x1920; samsung; SM-A510F; a5xelte; samsungexynos7580',
  '26/8.0.0; 480dpi; 1080x1920; samsung; SM-G930F; herolte; samsungexynos8890',
  '26/8.0.0; 480dpi; 1080x1920; samsung; SM-G935F; hero2lte; samsungexynos8890',
  '26/8.0.0; 420dpi; 1080x2094; samsung; SM-G965F; star2lte; samsungexynos9810',
  '26/8.0.0; 480dpi; 1080x2076; samsung; SM-A530F; jackpotlte; samsungexynos7885',
  '24/7.0; 640dpi; 1440x2560; samsung; SM-G925F; zerolte; samsungexynos7420',
  '26/8.0.0; 420dpi; 1080x1920; samsung; SM-A720F; a7y17lte; samsungexynos7880',
  '24/7.0; 640dpi; 1440x2560; samsung; SM-G920F; zeroflte; samsungexynos7420',
  '24/7.0; 420dpi; 1080x1920; samsung; SM-J730FM; j7y17lte; samsungexynos7870',
  '26/8.0.0; 480dpi; 1080x2076; samsung; SM-G960F; starlte; samsungexynos9810',
  '26/8.0.0; 420dpi; 1080x2094; samsung; SM-N950F; greatlte; samsungexynos8895',
  '26/8.0.0; 420dpi; 1080x2094; samsung; SM-A730F; jackpot2lte; samsungexynos7885',
  '26/8.0.0; 420dpi; 1080x2094; samsung; SM-A605FN; a6plte; qcom',
  '26/8.0.0; 480dpi; 1080x1920; HUAWEI/HONOR; STF-L09; HWSTF; hi3660',
  '27/8.1.0; 480dpi; 1080x2280; HUAWEI/HONOR; COL-L29; HWCOL; kirin970',
  '26/8.0.0; 480dpi; 1080x2032; HUAWEI/HONOR; LLD-L31; HWLLD-H; hi6250',
  '26/8.0.0; 480dpi; 1080x2150; HUAWEI; ANE-LX1; HWANE; hi6250',
  '26/8.0.0; 480dpi; 1080x2032; HUAWEI; FIG-LX1; HWFIG-H; hi6250',
  '27/8.1.0; 480dpi; 1080x2150; HUAWEI/HONOR; COL-L29; HWCOL; kirin970',
  '26/8.0.0; 480dpi; 1080x2038; HUAWEI/HONOR; BND-L21; HWBND-H; hi6250',
  '23/6.0.1; 420dpi; 1080x1920; LeMobile/LeEco; Le X527; le_s2_ww; qcom',
];

// import builds from '../samples/builds.json';
const builds = [
  'NMF26X',
  'MMB29M',
  'MRA58K',
  'NRD90M',
  'MRA58K',
  'OPM1.171019.011',
  'IMM76L',
  'JZO54K',
  'JDQ39',
  'JLS36I',
  'KTU84P',
  'LRX22C',
  'LMY48M',
  'MMB29V',
  'NRD91N',
  'N2G48C',
];
// import supportedCapabilities from '../samples/supported-capabilities.json';
const supportedCapabilities = [
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

const Constants = require('./constants');
import { ChallengeStateResponse, CheckpointResponse } from '../responses';
import { IgCookieNotFoundError, IgNoCheckpointError, IgUserIdNotFoundError } from '../errors';
import { Enumerable } from '../decorators';
import debug from 'debug';

export class State {
  private static stateDebug = debug('ig:state');
  get signatureKey(): string {
    return this.constants.SIGNATURE_KEY;
  }

  get signatureVersion(): string {
    return this.constants.SIGNATURE_VERSION;
  }

  get userBreadcrumbKey(): string {
    return this.constants.BREADCRUMB_KEY;
  }

  get appVersion(): string {
    return this.constants.APP_VERSION;
  }

  get appVersionCode(): string {
    return this.constants.APP_VERSION_CODE;
  }

  get fbAnalyticsApplicationId(): string {
    return this.constants.FACEBOOK_ANALYTICS_APPLICATION_ID;
  }

  get fbOtaFields(): string {
    return this.constants.FACEBOOK_OTA_FIELDS;
  }

  get fbOrcaApplicationId(): string {
    return this.constants.FACEBOOK_ORCA_APPLICATION_ID;
  }

  get loginExperiments(): string {
    return this.constants.LOGIN_EXPERIMENTS;
  }

  get experiments(): string {
    return this.constants.EXPERIMENTS;
  }

  get bloksVersionId(): string {
    return this.constants.BLOKS_VERSION_ID;
  }

  @Enumerable(false)
  constants = Constants;
  supportedCapabilities = supportedCapabilities;
  language: string = 'en_US';
  timezoneOffset: string = String(new Date().getTimezoneOffset() * -60);
  radioType = 'wifi-none';
  capabilitiesHeader = '3brTvwE=';
  connectionTypeHeader = 'WIFI';
  isLayoutRTL: boolean = false;
  euDCEnabled?: boolean = undefined;
  adsOptOut: boolean = false;
  thumbnailCacheBustingValue: number = 1000;
  igWWWClaim?: string;
  authorization?: string;
  passwordEncryptionPubKey?: string;
  passwordEncryptionKeyId?: string | number;
  deviceString: string;
  build: string;
  uuid: string;
  phoneId: string;
  /**
   * Google Play Advertising ID.
   *
   * The advertising ID is a unique ID for advertising, provided by Google
   * Play services for use in Google Play apps. Used by Instagram.
   *
   * @see https://support.google.com/googleplay/android-developer/answer/6048248?hl=en
   */
  adid: string;
  deviceId: string;
  @Enumerable(false)
  proxyUrl: string;
  @Enumerable(false)
  cookieStore = new MemoryCookieStore();
  @Enumerable(false)
  cookieJar = jar(this.cookieStore);
  @Enumerable(false)
  checkpoint: CheckpointResponse | null = null;
  @Enumerable(false)
  challenge: ChallengeStateResponse | null = null;
  clientSessionIdLifetime: number = 1200000;
  pigeonSessionIdLifetime: number = 1200000;

  /**
   * The current application session ID.
   *
   * This is a temporary ID which changes in the official app every time the
   * user closes and re-opens the Instagram application or switches account.
   *
   * We will update it once an hour
   */
  public get clientSessionId(): string {
    return this.generateTemporaryGuid('clientSessionId', this.clientSessionIdLifetime);
  }

  public get pigeonSessionId(): string {
    return this.generateTemporaryGuid('pigeonSessionId', this.pigeonSessionIdLifetime);
  }

  public get appUserAgent() {
    return `Instagram ${this.appVersion} Android (${this.deviceString}; ${this.language}; ${this.appVersionCode})`;
  }

  public get webUserAgent() {
    return `Mozilla/5.0 (Linux; Android ${this.devicePayload.android_release}; ${this.devicePayload.model} Build/${this.build}; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/70.0.3538.110 Mobile Safari/537.36 ${this.appUserAgent}`;
  }

  public get devicePayload() {
    const deviceParts = this.deviceString.split(';');
    const [android_version, android_release] = deviceParts[0].split('/');
    const [manufacturer] = deviceParts[3].split('/');
    const model = deviceParts[4];
    return {
      android_version,
      android_release,
      manufacturer,
      model,
    };
  }

  public get batteryLevel() {
    const chance = new Chance(this.deviceId);
    const percentTime = chance.integer({ min: 200, max: 600 });
    return 100 - (Math.round(Date.now() / 1000 / percentTime) % 100);
  }

  public get isCharging() {
    const chance = new Chance(`${this.deviceId}${Math.round(Date.now() / 10800000)}`);
    return chance.bool();
  }

  public get challengeUrl() {
    if (!this.checkpoint) {
      throw new IgNoCheckpointError();
    }
    return `/api/v1${this.checkpoint.challenge.api_path}`;
  }

  public get cookieCsrfToken() {
    try {
      return this.extractCookieValue('csrftoken');
    } catch {
      State.stateDebug('csrftoken lookup failed, returning "missing".');
      return 'missing';
    }
  }

  public get cookieUserId() {
    return this.extractCookieValue('ds_user_id');
  }

  public get cookieUsername() {
    return this.extractCookieValue('ds_user');
  }

  public isExperimentEnabled(experiment) {
    return this.experiments.includes(experiment);
  }

  public extractCookie(key: string): Cookie | null {
    const cookies = this.cookieJar.getCookies(this.constants.HOST);
    return _.find(cookies, { key }) || null;
  }

  public extractCookieValue(key: string): string {
    const cookie = this.extractCookie(key);
    if (cookie === null) {
      State.stateDebug(`Could not find ${key}`);
      throw new IgCookieNotFoundError(key);
    }
    return cookie.value;
  }

  public extractUserId(): string {
    try {
      return this.cookieUserId;
    } catch (e) {
      if (this.challenge === null || !this.challenge.user_id) {
        throw new IgUserIdNotFoundError();
      }
      return String(this.challenge.user_id);
    }
  }

  public async deserializeCookieJar(cookies: string | CookieJar.Serialized) {
    this.cookieJar['_jar'] = await Bluebird.fromCallback(cb => CookieJar.deserialize(cookies, this.cookieStore, cb));
  }

  public async serializeCookieJar(): Promise<CookieJar.Serialized> {
    return Bluebird.fromCallback(cb => this.cookieJar['_jar'].serialize(cb));
  }

  public async serialize(): Promise<{ constants; cookies } & any> {
    const obj = {
      constants: this.constants,
      cookies: JSON.stringify(await this.serializeCookieJar()),
    };
    for (const [key, value] of Object.entries(this)) {
      obj[key] = value;
    }
    return obj;
  }

  public async deserialize(state: string | any): Promise<void> {
    State.stateDebug(`Deserializing state of type ${typeof state}`);
    const obj = typeof state === 'string' ? JSON.parse(state) : state;
    if (typeof obj !== 'object') {
      State.stateDebug(`State deserialization failed, obj is of type ${typeof obj} (object expected)`);
      throw new TypeError("State isn't an object or serialized JSON");
    }
    State.stateDebug(`Deserializing ${Object.keys(obj).join(', ')}`);
    if (obj.constants) {
      this.constants = obj.constants;
      delete obj.constants;
    }
    if (obj.cookies) {
      await this.deserializeCookieJar(obj.cookies);
      delete obj.cookies;
    }
    for (const [key, value] of Object.entries(obj)) {
      this[key] = value;
    }
  }

  public generateDevice(seed: string): void {
    const chance = new Chance(seed);
    this.deviceString = chance.pickone(devices);
    const id = chance.string({
      pool: 'abcdef0123456789',
      length: 16,
    });
    this.deviceId = `android-${id}`;
    this.uuid = chance.guid();
    this.phoneId = chance.guid();
    this.adid = chance.guid();
    this.build = chance.pickone(builds);
  }

  private generateTemporaryGuid(seed: string, lifetime: number) {
    return new Chance(`${seed}${this.deviceId}${Math.round(Date.now() / lifetime)}`).guid();
  }
}

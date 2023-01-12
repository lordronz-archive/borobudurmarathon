import dynamicLinks from '@react-native-firebase/dynamic-links';
import Config from 'react-native-config';

export enum ShortLinkType {
  /**
   * Shorten the path to a string that is only as long as needed to be unique, with a minimum length
   * of 4 characters. Use this if sensitive information would not be exposed if a short
   * Dynamic Link URL were guessed.
   */
  SHORT = 'SHORT',
  /**
   * Shorten the path to an unguessable string. Such strings are created by base62-encoding randomly
   * generated 96-bit numbers, and consist of 17 alphanumeric characters. Use unguessable strings
   * to prevent your Dynamic DynamicLinks from being crawled, which can potentially expose sensitive information.
   */
  UNGUESSABLE = 'UNGUESSABLE',
  /**
   * By default, Firebase returns a standard formatted link.
   */
  DEFAULT = 'DEFAULT',
}

export async function buildDynamicLink(
  params: string,
  social: {title: string; descriptionText: string; imageUrl: string},
) {
  const link = await dynamicLinks().buildLink({
    link: Config.WEB_BASE_URL + '/' + params,
    domainUriPrefix: Config.DYNAMIC_LINK_DOMAIN_URI_PREFIX || '',
    android: {
      fallbackUrl: Config.WEB_LANDING_URL,
      minimumVersion: undefined,
      packageName: Config.APP_ID || '',
    },
    // ios: {
    //   appStoreId: Config.APP_ID,
    //   bundleId: '',
    //   fallbackUrl: Config.WEB_LANDING_URL,
    // },
    social,
  });

  return link;
}

export async function buildShortDynamicLink(
  params: string,
  social: {title: string; descriptionText: string; imageUrl: string},
) {
  const link = await dynamicLinks().buildShortLink({
    link: Config.WEB_BASE_URL + '/' + params,
    domainUriPrefix: Config.DYNAMIC_LINK_DOMAIN_URI_PREFIX || '',
    android: {
      fallbackUrl: Config.WEB_LANDING_URL,
      minimumVersion: undefined,
      packageName: Config.APP_ID || '',
    },
    ios: {
      appStoreId: Config.APP_STORE_ID,
      bundleId: Config.APP_ID || '',
      fallbackUrl: Config.WEB_LANDING_URL,
    },
    social,
  });

  return link;
}

export function getDynamicUrlParams(url: string, path: string) {
  if (Config.WEB_BASE_URL) {
    url = url.replace(Config.WEB_BASE_URL, '');
  }
  url = url.replace(path, '');

  return url;
}

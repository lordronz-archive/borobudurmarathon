import {utils} from '@react-native-firebase/app';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {getStateFromPath} from '@react-navigation/native';
import {Linking} from 'react-native';
import {getParameterByName} from '../helpers/url';

export const linking = {
  prefixes: [
    'bormar://',
    'https://myborobudurmarathon.page.link',
    'https://my.borobudurmarathon.com',
  ],

  // Custom function to get the URL which was used to open the app
  async getInitialURL() {
    // First, you would need to get the initial URL from your third-party integration
    // The exact usage depend on the third-party SDK you use
    // For example, to get to get the initial URL for Firebase Dynamic Links:
    const {isAvailable} = utils().playServicesAvailability;

    if (isAvailable) {
      const initialLink = await dynamicLinks().getInitialLink();

      if (initialLink) {
        console.info('rnavigate initialLink', initialLink);
        return initialLink.url;
      }
    }

    // As a fallback, you may want to do the default deep link handling
    const url = await Linking.getInitialURL();
    console.info('rnavigate getInitialURL', url);

    return url;
  },

  // Custom function to subscribe to incoming links
  subscribe(listener: any) {
    // Listen to incoming links from Firebase Dynamic Links
    const unsubscribeFirebase = dynamicLinks().onLink(({url}) => {
      console.info('rnavigate onlink', url);
      listener(url);
    });

    // Listen to incoming links from deep linking
    const linkingSubscription = Linking.addEventListener('url', ({url}) => {
      console.info('rnavigate url', url);

      listener(url);
    });

    return () => {
      // Clean up the event listeners
      unsubscribeFirebase();
      linkingSubscription.remove();
    };
  },

  config: {
    screens: {
      Initial: 'init',
      Auth: 'auth-me',
      InitialEvent: 'events/:id',
      InitialPayment: 'INVOICE',
      Welcome: 'welcome',
      ResetPassword: 'reset-password',
    },
  },
  getStateFromPath: (path: any, options: any) => {
    console.info('getStateFromPath -- path', path);
    console.info('getStateFromPath -- options', options);

    if (path.includes('signin/reset')) {
      const code = getParameterByName('code', path);
      const key = getParameterByName('key', path);
      return {routes: [{name: 'ResetPassword', params: {code, key}}]};
    } else {
      const page = getParameterByName('page', path);
      if (page === 'transaction') {
        const id = getParameterByName('id', path);
        return {routes: [{name: 'InitialPayment', params: {id}}]};
      }
    }

    return getStateFromPath(path, options);
  },
};

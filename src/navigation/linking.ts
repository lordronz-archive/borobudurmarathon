import {utils} from '@react-native-firebase/app';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {Linking} from 'react-native';

export const linking = {
  prefixes: [
    'bormar://',
    'https://borobudurmarathon.page.link',
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
      Auth: 'auth-me',
    },
  },
};

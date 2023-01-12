/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect} from 'react';
import useInitialURL from './useDeepLink';
import dynamicLinks from '@react-native-firebase/dynamic-links';

export default function useDeeplinkInit() {
  // DEEPLINK
  const {handleDeeplink} = useInitialURL();

  /** DYNAMIC LINK */
  const handleDynamicLink = (link: any) => {
    console.info('handleDynamicLink', link);
    // Handle dynamic link inside your own application
    handleDeeplink(link);
  };
  useEffect(() => {
    console.info('will unsubscribe');
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    // When the component is unmounted, remove the listener
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    dynamicLinks()
      .getInitialLink()
      .then((link: any) => {
        console.info(
          'exited app- dynamic-link::: dynamicLinks.getInitialLink',
          link,
        );
        handleDeeplink(link);
      });
  }, []);
  /** END DYNAMIC LINK */

  return true;
}

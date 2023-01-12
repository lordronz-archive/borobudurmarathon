import {useNavigation, useRoute} from '@react-navigation/native';
import {Box, Button} from 'native-base';
import React, {useEffect, useState} from 'react';
import {Alert, Linking} from 'react-native';
import {AuthService} from '../../api/auth.service';
import {getErrorMessage} from '../../helpers/errorHandler';

export default function AuthScreen() {
  // const _resDLI = useDeeplinkInit();
  console.info('render AuthScreen');
  const route = useRoute();
  console.info('route', route);

  const navigation = useNavigation();

  const [uri, setUri] = useState<string>();

  useEffect(() => {
    AuthService.bindMemberToKompas().then(res => {
      console.info('res.url', res.url);
      setUri(res.url);
    });
  }, []);

  const sleep = async (timeout: number) => {
    return new Promise(resolve => setTimeout(() => resolve(true), timeout));
  };

  // const url = uri || '';
  // const redirect_uri = 'https://borobudurmarathon.page.link/iho8';
  const redirect_uri = 'bormar://auth-me';
  const url =
    'https://account.kompas.id/sso/check?client_id=3&state=borobudur_marathon&scope=nama%20lengkap,%20alamat,%20Alamat%20email%20dan%20mengirimkan%20pesan&response_type=code&redirect_uri=' +
    encodeURIComponent(redirect_uri);
  console.info('redirect_uri', redirect_uri);
  console.info('url', url);

  const openLink = async () => {
    try {
      Linking.openURL(url);
      return;

      // if (await InAppBrowser.isAvailable()) {
      //   InAppBrowser.close();
      //   const result = await InAppBrowser.openAuth(url, 'https://google.com', {
      //     // iOS Properties
      //     dismissButtonStyle: 'cancel',
      //     preferredBarTintColor: '#453AA4',
      //     preferredControlTintColor: 'white',
      //     readerMode: false,
      //     animated: true,
      //     modalPresentationStyle: 'fullScreen',
      //     modalTransitionStyle: 'coverVertical',
      //     modalEnabled: true,
      //     enableBarCollapsing: false,
      //     // Android Properties
      //     showTitle: true,
      //     toolbarColor: '#6200EE',
      //     secondaryToolbarColor: 'black',
      //     navigationBarColor: 'black',
      //     navigationBarDividerColor: 'white',
      //     enableUrlBarHiding: true,
      //     enableDefaultShare: true,
      //     forceCloseOnRedirection: true,
      //     // Specify full animation resource identifier(package:anim/name)
      //     // or only resource name(in case of animation bundled with app).
      //     animations: {
      //       startEnter: 'slide_in_right',
      //       startExit: 'slide_out_left',
      //       endEnter: 'slide_in_left',
      //       endExit: 'slide_out_right',
      //     },
      //     // headers: {
      //     //   'my-custom-header': 'my custom header value',
      //     // },
      //   });
      //   await sleep(800);
      //   console.info('result', result);
      //   Alert.alert(JSON.stringify(result));
      // } else {
      //   Linking.openURL(url);
      // }
    } catch (error) {
      Alert.alert(getErrorMessage(error));
    }
  };

  // const authorizeMe = async () => {
  //   const config: AuthConfiguration = {
  //     issuer: 'https://account.kompas.id/sso/check',
  //     clientId: '3',
  //     redirectUrl: 'https://borobudurmarathon.page.link/auth-callback',
  //     scopes: [
  //       'nama%20lengkap,%20alamat,%20Alamat%20email%20dan%20mengirimkan%20pesan',
  //     ],
  //   };

  //   const result = await authorize(config);
  //   console.info('result', result);
  // };

  return (
    <Box>
      <Button
        onPress={() => {
          openLink();
          // authorizeMe();
          // navigation.navigate('SignInWithKompas');
        }}>
        Sign In With Kompas
      </Button>
    </Box>
  );
}

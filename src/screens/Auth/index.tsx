import {useNavigation} from '@react-navigation/native';
import {Box, Button} from 'native-base';
import React, {useEffect, useState} from 'react';
import {Alert, Linking} from 'react-native';
import {InAppBrowser} from 'react-native-inappbrowser-reborn';
import {AuthService} from '../../api/auth.service';
import {getErrorMessage} from '../../helpers/errorHandler';

export default function AuthScreen() {
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

  const openLink = async () => {
    try {
      const url = uri || '';
      if (await InAppBrowser.isAvailable()) {
        InAppBrowser.close();
        const result = await InAppBrowser.openAuth(url, 'https://google.com', {
          // iOS Properties
          dismissButtonStyle: 'cancel',
          preferredBarTintColor: '#453AA4',
          preferredControlTintColor: 'white',
          readerMode: false,
          animated: true,
          modalPresentationStyle: 'fullScreen',
          modalTransitionStyle: 'coverVertical',
          modalEnabled: true,
          enableBarCollapsing: false,
          // Android Properties
          showTitle: true,
          toolbarColor: '#6200EE',
          secondaryToolbarColor: 'black',
          navigationBarColor: 'black',
          navigationBarDividerColor: 'white',
          enableUrlBarHiding: true,
          enableDefaultShare: true,
          forceCloseOnRedirection: false,
          // Specify full animation resource identifier(package:anim/name)
          // or only resource name(in case of animation bundled with app).
          animations: {
            startEnter: 'slide_in_right',
            startExit: 'slide_out_left',
            endEnter: 'slide_in_left',
            endExit: 'slide_out_right',
          },
          // headers: {
          //   'my-custom-header': 'my custom header value',
          // },
        });
        await sleep(800);
        console.info('result', result);
        Alert.alert(JSON.stringify(result));
      } else {
        Linking.openURL(url);
      }
    } catch (error) {
      Alert.alert(getErrorMessage(error));
    }
  };

  return (
    <Box>
      <Button
        onPress={() => {
          openLink();
          // navigation.navigate('SignInWithKompas');
        }}>
        Sign In With Kompas
      </Button>
    </Box>
  );
}

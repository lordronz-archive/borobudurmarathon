import {Toast, useTheme} from 'native-base';
import React, {useEffect} from 'react';
import {Alert, Linking, View} from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import WebView from 'react-native-webview';
import LoadingBlock from '../../components/loading/LoadingBlock';
import config from '../../config';
import {getErrorMessage} from '../../helpers/errorHandler';

type Props = {
  onLoadEnd: () => void;
};

export default function Logout(props: Props) {
  const {colors} = useTheme();
  // const redirect_uri = 'bormar://auth-me';
  // 'https://account.kompas.id/sso/check?redirect_uri=https://my.borobudurmarathon.com/dev.titudev.com/api/v1/kompasid/login/auth&client_id=3&state=borobudur_marathon&scope=nama%20lengkap,%20alamat,%20Alamat%20email%20dan%20mengirimkan%20pesan&response_type=code';

  // const url =
  //   'https://account.kompas.id/sso/check?client_id=3&state=borobudur_marathon&scope=nama%20lengkap,%20alamat,%20Alamat%20email%20dan%20mengirimkan%20pesan&response_type=code&redirect_uri=' +
  //   encodeURIComponent(redirect_uri);

  // const jsCode = `
  //   function deleteAllCookies() {
  //     const cookies = document.cookie.split(";");

  //     for (let i = 0; i < cookies.length; i++) {
  //         const cookie = cookies[i];
  //         const eqPos = cookie.indexOf("=");
  //         const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
  //         document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  //     }
  //   }
  //   deleteAllCookies();
  // `;
  const redirect_uri = 'bormar://auth-me';
  const url =
    'https://account.kompas.id/logout?redirect_uri=' +
    encodeURIComponent(redirect_uri);

  useEffect(() => {
    if (config.inAppBrowser) {
      openLogoutLinkInApp();
    } else {
      openLogoutLink();
    }
  }, []);

  const sleep = (timeout: number) => {
    return new Promise((resolve: any) => setTimeout(resolve, timeout));
  };

  const openLogoutLink = async () => {
    try {
      // AuthService.bindMemberToKompas()
      //   .then(res => {
      //     console.info('res bindMemberToKompas', res);
      //   })
      //   .catch(err => {
      //     console.info('err bindMemberToKompas', err);
      //   });
      Linking.openURL(url);
      return;
    } catch (error) {
      Alert.alert(getErrorMessage(error));
    }
  };

  const openLogoutLinkInApp = async () => {
    try {
      if (await InAppBrowser.isAvailable()) {
        InAppBrowser.closeAuth();
        const result = await InAppBrowser.openAuth(url, redirect_uri, {
          // iOS Properties
          dismissButtonStyle: 'cancel',
          preferredBarTintColor: colors.primary[900],
          preferredControlTintColor: 'white',
          readerMode: false,
          animated: true,
          modalPresentationStyle: 'fullScreen',
          modalTransitionStyle: 'coverVertical',
          modalEnabled: true,
          enableBarCollapsing: false,
          // Android Properties
          showTitle: true,
          toolbarColor: colors.primary[900],
          secondaryToolbarColor: 'black',
          navigationBarColor: 'black',
          navigationBarDividerColor: 'white',
          enableUrlBarHiding: false,
          enableDefaultShare: false,
          forceCloseOnRedirection: false,
          // Specify full animation resource identifier(package:anim/name)
          // or only resource name(in case of animation bundled with app).
          animations: {
            startEnter: 'slide_in_right',
            startExit: 'slide_out_left',
            endEnter: 'slide_in_left',
            endExit: 'slide_out_right',
          },
        });
        await sleep(800);

        if (result.type === 'success') {
          // setAuthorizationCode(
          //   result.url.replace(redirect_uri + '?authorization_code=', ''),
          // );
        }
        // Alert.alert(JSON.stringify(result));
      } else {
        // Linking.openURL(url);
        openLogoutLink();
      }
    } catch (error) {
      // Alert.alert(error.message)
      Toast.show({
        title: 'Failed to open authentication URL',
        description: getErrorMessage(error),
      });
    }
  };

  return (
    <View style={{flex: 1}}>
      <WebView
        // source={{uri: 'https://my.borobudurmarathon.com'}}
        source={{uri: url}}
        originWhitelist={['*']}
        // injectedJavaScript={jsCode}
        onLoadEnd={props.onLoadEnd}
      />
      <LoadingBlock text="Logout. Please wait..." />
    </View>
  );
}

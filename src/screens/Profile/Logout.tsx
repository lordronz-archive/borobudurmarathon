import {Toast, useTheme} from 'native-base';
import React, {useEffect, useState} from 'react';
import {Alert, Linking, View} from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import WebView from 'react-native-webview';
import {
  WebViewErrorEvent,
  WebViewNavigationEvent,
} from 'react-native-webview/lib/WebViewTypes';
import LoadingBlock from '../../components/loading/LoadingBlock';
import config from '../../config';
import {getErrorMessage} from '../../helpers/errorHandler';
import useInit from '../../hooks/useInit';

type Props = {
  onLoadEnd: (event?: WebViewNavigationEvent | WebViewErrorEvent) => void;
};

export default function Logout(props: Props) {
  const {colors} = useTheme();
  const {logout} = useInit();
  const [state, setState] = useState<
    'logout-kompas' | 'logout-kompas-webview' | 'logout-bormar-webview'
  >('logout-kompas-webview');

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
  const urlLogoutBormar =
    config.apiUrl.href + config.apiUrl.apis.member.logout.path;
  console.info('urlLogoutBormar', urlLogoutBormar);

  useEffect(() => {
    if (state === 'logout-kompas') {
      if (config.inAppBrowser) {
        openLogoutLinkInApp();
      } else {
        openLogoutLink();
      }
    }
  }, [state]);

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
        logout(
          () => {},
          () => {},
        );

        // if (result.type === 'success') {
        //   if (props.onLoadEnd) {
        //     props.onLoadEnd();
        //   }
        //   // setAuthorizationCode(
        //   //   result.url.replace(redirect_uri + '?authorization_code=', ''),
        //   // );
        // } else {
        //   if (props.onLoadEnd) {
        //     props.onLoadEnd();
        //   }
        // }
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
      {state === 'logout-kompas-webview' ? (
        <WebView
          // source={{uri: 'https://my.borobudurmarathon.com'}}
          source={{uri: url}}
          originWhitelist={['*']}
          // injectedJavaScript={jsCode}
          // onLoadEnd={props.onLoadEnd}
          onLoadEnd={() => {
            setState('logout-bormar-webview');
          }}
          renderLoading={() => (
            <LoadingBlock text="~ Logout Kompas. Please wait..." />
          )}
        />
      ) : state === 'logout-bormar-webview' ? (
        <WebView
          // source={{uri: 'https://my.borobudurmarathon.com'}}
          source={{
            uri: urlLogoutBormar,
          }}
          originWhitelist={['*']}
          // injectedJavaScript={jsCode}
          onLoadEnd={() => {
            setState('logout-kompas');
            // props.onLoadEnd
          }}
          renderLoading={() => (
            <LoadingBlock text="~ Logout Bormar. Please wait..." />
          )}
        />
      ) : (
        false
      )}
      <LoadingBlock
        text={
          state === 'logout-kompas-webview'
            ? 'Logout Kompas. Please wait...'
            : 'Logout Bormar. Please wait...'
        }
      />
    </View>
  );
}

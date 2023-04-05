import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Toast, useTheme} from 'native-base';
import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Linking} from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import WebView from 'react-native-webview';
import config from '../../config';
import {useAuthUser} from '../../context/auth.context';
import {getErrorMessage} from '../../helpers/errorHandler';
import useInit from '../../hooks/useInit';
import {RootStackParamList} from '../../navigation/RootNavigator';
import AppContainer from '../../layout/AppContainer';
import {t} from 'i18next';
import LoadingBlockWithChecklist from '../../components/loading/LoadingBlockWithChecklist';
import LoadingBlock from '../../components/loading/LoadingBlock';

type Status = 'loading' | 'done' | 'failed' | 'skipped';

export default function LogoutScreen() {
  console.info('===== render LogoutScreen');
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {colors} = useTheme();
  const {logout} = useInit();
  const {
    state: {loginType},
  } = useAuthUser();

  const [isLoading, setIsLoading] = useState(true);
  const [logoutBormarWebviewStatus, setLogoutBormarWebviewStatus] =
    useState<Status>('loading');
  const [logoutKompasWebviewStatus, setLogoutKompasWebviewStatus] =
    useState<Status>('loading');
  const [logoutKompasStatus, setLogoutKompasStatus] =
    useState<Status>('loading');

  const getChecklists = () => {
    const checks: {
      key: string;
      text: string;
      status: Status;
    }[] = [];
    checks.push({
      key: 'logout_bormar_webview',
      text: 'Logout Bormar...',
      status: logoutBormarWebviewStatus,
    });
    if (loginType === 'KompasId') {
      checks.push({
        key: 'logout_kompas_webview',
        text: 'Logout Kompas... (1)',
        status: logoutKompasWebviewStatus,
      });
      checks.push({
        key: 'logout_kompas',
        text: 'Logout Kompas... (2)',
        status: logoutKompasStatus,
      });
    }
    return checks;
  };

  const isDone = () => {
    const checks = getChecklists();
    return (
      checks.filter(item => item.status === 'done' || item.status === 'skipped')
        .length === checks.length
    );
  };

  useEffect(() => {
    if (isDone()) {
      logout(
        () => {},
        () => {
          console.info('success');
          navigation.navigate('Initial');
          setIsLoading(false);
        },
      );
    }
  }, [
    logoutKompasStatus,
    logoutKompasWebviewStatus,
    logoutBormarWebviewStatus,
  ]);

  const redirect_uri = 'bormar://auth-me';
  const url =
    'https://account.kompas.id/logout?redirect_uri=' +
    encodeURIComponent(redirect_uri);
  const urlLogoutBormar =
    config.apiUrl.href.href + config.apiUrl.apis.member.logout.path;
  console.info('urlLogoutBormar', urlLogoutBormar);

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
    console.info('LOGOUT - openLogoutLinkInApp');
    try {
      if (await InAppBrowser.isAvailable()) {
        console.info('await InAppBrowser.isAvailable()');
        InAppBrowser.close();
        InAppBrowser.closeAuth();

        const result = await InAppBrowser.openAuth(url, redirect_uri, {
          // iOS Properties
          dismissButtonStyle: 'done',
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

        console.info('InAppBrowser result', result);
        await sleep(800);

        setLogoutKompasStatus('done');
        try {
          console.info('will InAppBrowser.closeAuth();');
          InAppBrowser.closeAuth();
          console.info('will InAppBrowser.close();');
          InAppBrowser.close();
        } catch (err) {
          setLogoutKompasStatus('failed');
          console.info('logout err ---', err);
        }
      } else {
        openLogoutLink();
      }
    } catch (error) {
      setLogoutKompasStatus('failed');
      console.info('Failed to open authentication URL for logout');
      // Alert.alert(error.message)
      Toast.show({
        title: 'Failed to open authentication URL for logout',
        description: getErrorMessage(error),
      });
      InAppBrowser.closeAuth();
      InAppBrowser.close();
    }
  };

  return (
    <AppContainer>
      {loginType === 'KompasId' && (
        <WebView
          // source={{uri: 'https://my.borobudurmarathon.com'}}
          source={{uri: url}}
          originWhitelist={['*']}
          // injectedJavaScript={jsCode}
          // onLoadEnd={props.onLoadEnd}
          onLoadEnd={() => {
            if (logoutKompasWebviewStatus === 'done') {
              console.info('onLoadEnd logout-kompas-webview');
            } else {
              console.info('onLoadEnd logout-kompas-webview');
              setLogoutKompasWebviewStatus('done');
              openLogoutLinkInApp();
            }
          }}
          onError={event => {
            console.info(
              'logout-kompas-webview -- onError',
              JSON.stringify(event),
            );
            Toast.show({
              description: 'Failed to logout kompas',
            });
            setLogoutKompasWebviewStatus('failed');
            openLogoutLinkInApp();
          }}
          onHttpError={event => {
            console.info(
              'logout-kompas-webview -- onError',
              JSON.stringify(event),
            );
            Toast.show({
              description: 'Failed to logout kompas',
            });
            setLogoutKompasWebviewStatus('failed');
            openLogoutLinkInApp();
          }}
        />
      )}
      <WebView
        // source={{uri: 'https://my.borobudurmarathon.com'}}
        source={{
          uri: urlLogoutBormar,
        }}
        originWhitelist={['*']}
        // injectedJavaScript={jsCode}
        onLoadEnd={() => {
          console.info('onLoadEnd logout-bormar-webview');
          setLogoutBormarWebviewStatus('done');
        }}
        onError={event => {
          console.info('logout-bormar-webview -- onError', event);
          Toast.show({
            description: 'Failed to logout bormar',
          });
          setLogoutBormarWebviewStatus('failed');
        }}
        onHttpError={event => {
          console.info('logout-bormar-webview -- onError', event);
          Toast.show({
            description: 'Failed to logout bormar',
          });
          setLogoutBormarWebviewStatus('failed');
        }}
      />
      {isLoading && loginType === 'KompasId' ? (
        <LoadingBlockWithChecklist
          text={`Logout. ${t('pleaseWait')}...`}
          checklists={getChecklists()}
        />
      ) : isLoading ? (
        <LoadingBlock text={`Logout. ${t('pleaseWait')}...`} />
      ) : (
        false
      )}
    </AppContainer>
  );
}

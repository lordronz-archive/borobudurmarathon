/* eslint-disable react-hooks/exhaustive-deps */
import {useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  Box,
  Button,
  Center,
  HStack,
  Image,
  Link,
  Text,
  VStack,
  useToast,
  Spinner,
  useTheme,
} from 'native-base';
import React, {useEffect, useState} from 'react';
import {Alert, Linking} from 'react-native';
import KompasIcon from '../../components/icons/KompasIcon';
import {Heading} from '../../components/text/Heading';
import {getErrorMessage} from '../../helpers/errorHandler';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {ProfileService} from '../../api/profile.service';
import I18n from '../../lib/i18n';
import {EAuthUserAction, useAuthUser} from '../../context/auth.context';
import WebView from 'react-native-webview';
import config from '../../config';
import {getCookiesString} from '../../api/cookies';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import {SessionService} from '../../api/session.service';
import { getParameterByName } from '../../helpers/url';
import LoadingBlock from '../../components/loading/LoadingBlock';

export default function AuthScreen() {
  console.info('render AuthScreen');
  const route = useRoute();
  const toast = useToast();
  const {colors} = useTheme();
  const params: {authorization_code: string} = route.params as any;
  console.info('route', route);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {state, dispatch} = useAuthUser();
  const [isNotRegistered, setIsNotRegistered] = useState<boolean>();
  console.info('#Auth -- state', state);

  const [authorizationCode, setAuthorizationCode] = useState<string>(
    params?.authorization_code,
  );

  useEffect(() => {
    if (params && params.authorization_code) {
      setAuthorizationCode(params.authorization_code);
    }
  }, [params?.authorization_code]);

  const redirect_uri = 'bormar://auth-me';
  // 'https://account.kompas.id/sso/check?redirect_uri=https://my.borobudurmarathon.com/dev.titudev.com/api/v1/kompasid/login/auth&client_id=3&state=borobudur_marathon&scope=nama%20lengkap,%20alamat,%20Alamat%20email%20dan%20mengirimkan%20pesan&response_type=code';

  const url =
    'https://account.kompas.id/sso/check?client_id=3&state=borobudur_marathon&scope=nama%20lengkap,%20alamat,%20Alamat%20email%20dan%20mengirimkan%20pesan&response_type=code&redirect_uri=' +
    encodeURIComponent(redirect_uri);
  console.info('redirect_uri', redirect_uri);
  console.info('url', url);

  // Do not call this every time the component render
  // useEffect(() => {
  //   InAppBrowser.mayLaunchUrl(url, []);
  // }, []);

  const sleep = (timeout: number) => {
    return new Promise((resolve: any) => setTimeout(resolve, timeout));
  };

  const openAuthLink = async () => {
    try {
      Linking.openURL(url);
      return;
    } catch (error) {
      Alert.alert(getErrorMessage(error));
    }
  };

  const openAuthLinkInApp = async () => {
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
          const authCode = getParameterByName('authorization_code', result.url);
          console.info('authCode', authCode);
          // let queryString = result.url.replace(redirect_uri + '?', '');
          // const exp = queryString.split('&').map(item => item.split('='));
          // console.info('exp---', exp);
          // console.info('auth code', authCode);
          // setAuthorizationCode(authCode);
        }
        // Alert.alert(JSON.stringify(result));
      } else {
        // Linking.openURL(url);
        openAuthLink();
      }
    } catch (error) {
      // Alert.alert(error.message)
      toast.show({
        title: 'Failed to open authentication URL',
        description: getErrorMessage(error),
      });
    }
  };

  const getProfile = () => {
    ProfileService.getMemberDetail()
      .then(resProfile => {
        console.info('resProfile', resProfile);
        console.info('###resProfile###', JSON.stringify(resProfile));
        dispatch({
          type: EAuthUserAction.LOGIN,
          payload: {user: resProfile},
        });
        SessionService.saveSession();
        if (resProfile.data && resProfile.data.length > 0) {
          toast.show({
            id: 'welcome',
            description: 'Welcome, ' + resProfile.data[0].zmemFullName,
          });
          if (resProfile.linked.mbsdZmemId && resProfile.linked.mbsdZmemId[0]) {
            // profile has been completed
            // if (payload.data.linked.mbsdZmemId[0].mbsdStatus > 0) {
            //   state.readyToRegister = true;
            // }
            navigation.navigate('Main', {screen: 'Home'});
          } else {
            // need to complete profile
            navigation.navigate('InputProfile');
          }
        } else {
          toast.show({
            id: 'welcome',
            description: 'Welcome, New Runner',
          });
          navigation.navigate('InputProfile');
        }
      })
      .catch(err => {
        console.info('### error resProfile', err);
        console.info('### error resProfile --- ', JSON.stringify(err));
        if (err && err.errorCode === 409) {
          navigation.navigate('Logout');
          // setIsNotRegistered(true);
        } else {
          toast.show({
            title: 'Failed to get profile',
            variant: 'subtle',
            description: getErrorMessage(err),
          });
          navigation.navigate('Initial');
        }
      });
  };

  if (authorizationCode && isNotRegistered === true) {
    let uri =
      config.apiUrl.href.href +
      '/kompasid/newmember/auth' +
      '?authorization_code=' +
      encodeURIComponent(authorizationCode);
    // let uri =
    //   config.apiUrl.href.href +
    //   config.ssoKompasUrl.apis.newBorobudurMember.path +
    //   '?authorization_code=' +
    //   encodeURIComponent(authorizationCode);
    console.info('uri isNotRegistered === true', uri);
    uri = uri.replace('//kompasid/', '/kompasid/');
    return (
      <Box flex={1}>
        <WebView
          source={{
            uri,
          }}
          thirdPartyCookiesEnabled={true}
          onLoadEnd={async () => {
            const cookiesString = await getCookiesString();
            console.info('cookiesString isNotRegistered true', cookiesString);
            navigation.navigate('InputProfile');
          }}
          contentMode="mobile"
        />

        <LoadingBlock />
      </Box>
    );
  } else if (authorizationCode) {
    let uri =
      config.apiUrl.href.href +
      config.apiUrl.apis.kompas.authorize_code.path +
      '?authorization_code=' +
      encodeURIComponent(authorizationCode);
    uri = uri.replace('//kompasid/', '/kompasid/');
    console.info('uri', uri);

    // const jsCode =
    //   "window.postMessage(document.getElementById('gb-main').innerHTML)";

    return (
      <Box flex={1}>
        <WebView
          source={{
            uri,
          }}
          thirdPartyCookiesEnabled={true}
          onLoadEnd={async event => {
            console.info('###event', event);
            await sleep(1000);
            const cookiesString = await getCookiesString();
            console.info('cookiesString', cookiesString);
            if (cookiesString) {
              getProfile();
            } else {
              setIsNotRegistered(true);
            }
          }}
          // javaScriptEnabled={true}
          // injectedJavaScript={jsCode}
          // onMessage={event =>
          //   console.log('###Received: ', event.nativeEvent.data)
          // }
          // onNavigationStateChange={async event => {
          //   console.info('event', event);
          //   const cookiesString = await getCookiesString();
          //   if (cookiesString) {
          //     getProfile();
          //   }
          // }}
        />

        <LoadingBlock />
      </Box>
    );
  }

  return (
    <Box px="4" flex="1">
      <HStack justifyContent="center" flex="5">
        <VStack space="3" alignItems="center" justifyContent="center">
          <Image
            source={require('../../assets/images/logo.png')}
            alt="Alternate Text"
            width={221.17}
            height={100}
            mb="10"
          />
          <Heading textAlign={'center'}>
            {I18n.t('welcomeTo') + ' Borobudur Marathon'}
          </Heading>
          <Text fontWeight={400} textAlign={'center'} color="#768499">
            {I18n.t('auth.description')}
          </Text>
        </VStack>
      </HStack>
      <VStack flex="1" justifyContent={'center'} space="5">
        <Button
          backgroundColor={'#00559A'}
          rounded="sm"
          onPress={() => {
            if (config.inAppBrowser) {
              openAuthLinkInApp();
            } else {
              openAuthLink();
            }
          }}
          startIcon={<KompasIcon size="lg" px="6" />}>
          <Text color="white" px="12">
            {I18n.t('auth.signInWith') + ' Kompas.id'}
          </Text>
        </Button>
        <Center>
          <HStack>
            <Text
              justifyContent={'center'}
              alignItems="center"
              fontWeight={400}>
              {I18n.t('auth.dontHaveAccount')}{' '}
            </Text>
            <Link
              onPress={() => {
                openAuthLink();
              }}
              _text={{
                color: 'blue.600',
                fontWeight: 600,
              }}>
              {I18n.t('auth.register')}
            </Link>
          </HStack>
        </Center>
      </VStack>
    </Box>
  );
}

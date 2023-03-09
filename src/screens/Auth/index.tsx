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
  useTheme,
  Modal,
  Checkbox,
  FormControl,
} from 'native-base';
import React, {useEffect, useState} from 'react';
import {Alert, Linking} from 'react-native';
import KompasIcon from '../../components/icons/KompasIcon';
import {Heading} from '../../components/text/Heading';
import {getErrorMessage} from '../../helpers/errorHandler';
import {RootStackParamList} from '../../navigation/RootNavigator';
import I18n from '../../lib/i18n';
import {useAuthUser} from '../../context/auth.context';
import WebView from 'react-native-webview';
import config from '../../config';
import {getCookiesString} from '../../api/cookies';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import {getParameterByName} from '../../helpers/url';
import LoadingBlock from '../../components/loading/LoadingBlock';
import useInit from '../../hooks/useInit';
import {useDemo} from '../../context/demo.context';

export default function AuthScreen() {
  console.info('render AuthScreen');
  const route = useRoute();
  const toast = useToast();
  const {colors} = useTheme();
  const {getProfile} = useInit();
  const {
    isShowModal,
    showModal,
    hideModal,
    isShowDemoVerifyEmail,
    setDemoVerifyEmail,
    isShowDemoConsent,
    setDemoConsent,
    isShowDemoNewUser,
    setDemoNewUser,
  } = useDemo();
  const params: {authorization_code: string} = route.params as any;
  console.info('route', route);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {state} = useAuthUser();
  const [isNotRegistered, setIsNotRegistered] = useState<boolean>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
          onError={() => setIsLoading(false)}
          thirdPartyCookiesEnabled={true}
          onLoadEnd={async () => {
            const cookiesString = await getCookiesString();
            console.info('cookiesString isNotRegistered true', cookiesString);

            if (cookiesString) {
              getProfile();
            } else {
              toast.show({
                title: 'Failed to get cookies',
                description:
                  "We can't get the cookies, please try again later.",
              });
              navigation.navigate('Logout');
            }
          }}
          contentMode="mobile"
        />

        {isLoading && (
          <LoadingBlock text="You are not registered. Please wait..." />
        )}
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
          onError={() => setIsLoading(false)}
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

        {isLoading && <LoadingBlock text="Checking your session..." />}
      </Box>
    );
  }

  return (
    <>
      <Box px="4" flex="1">
        <HStack justifyContent="center" flex={config.isDev ? '3' : '5'}>
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
          {config.isDev && (
            <Button
              // backgroundColor={'#00559A'}
              variant="link"
              rounded="sm"
              onPress={() => {
                showModal();
              }}>
              <Text color="red.900" px="12">
                Demo Settings
              </Text>
            </Button>
          )}

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

      <Modal
        isOpen={isShowModal}
        onClose={() => hideModal()}
        safeAreaTop={true}>
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header>Demo Settings (Auto Save)</Modal.Header>
          <Modal.Body>
            <FormControl>
              <Checkbox
                onChange={() => setDemoVerifyEmail(!isShowDemoVerifyEmail)}
                isChecked={isShowDemoVerifyEmail}
                value="demo-verify-email">
                Show Verify Email
              </Checkbox>
            </FormControl>

            <FormControl>
              <Checkbox
                onChange={() => setDemoConsent(!isShowDemoConsent)}
                isChecked={isShowDemoConsent}
                value="demo-consent">
                Show Consent Screen
              </Checkbox>
            </FormControl>

            <FormControl>
              <Checkbox
                onChange={() => setDemoNewUser(!isShowDemoNewUser)}
                isChecked={isShowDemoNewUser}
                value="demo-consent">
                Flow New User
              </Checkbox>
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  hideModal();
                }}>
                OK
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  );
}

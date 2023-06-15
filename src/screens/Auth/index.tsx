/* eslint-disable react-hooks/exhaustive-deps */
import {useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  Box,
  Button,
  Center,
  HStack,
  Link,
  Text,
  VStack,
  useToast,
  useTheme,
  Modal,
  Checkbox,
  FormControl,
  Actionsheet,
  useDisclose,
  CheckCircleIcon,
  Image,
  ChevronDownIcon,
} from 'native-base';
import React, {useEffect, useState} from 'react';
import {Alert, Linking, TouchableOpacity} from 'react-native';
import KompasIcon from '../../components/icons/KompasIcon';
import {Heading} from '../../components/text/Heading';
import {getErrorMessage} from '../../helpers/errorHandler';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {useAuthUser} from '../../context/auth.context';
import WebView from 'react-native-webview';
import config from '../../config';
import {getCookiesString} from '../../api/cookies';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import {getParameterByName} from '../../helpers/url';
import LoadingBlock from '../../components/loading/LoadingBlock';
import useInit from '../../hooks/useInit';
import {useDemo} from '../../context/demo.context';
import {useTranslation} from 'react-i18next';
import AppContainer from '../../layout/AppContainer';
import i18next from 'i18next';
import {LanguageID} from '../../types/language.type';
import Config from 'react-native-config';
import {LanguageService} from '../../api/language.service';

export default function AuthScreen() {
  console.info('===render AuthScreen');
  const route = useRoute();
  const toast = useToast();
  const {colors} = useTheme();
  const {t} = useTranslation();
  const {init} = useInit();
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
    setDemoKTPVerification,
    demoKTPVerification,
  } = useDemo();
  const params: {authorization_code: string} = route.params as any;
  console.info('route', route);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {state, setLoginType} = useAuthUser();
  const [isNotRegistered, setIsNotRegistered] = useState<boolean>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  console.info('#Auth -- state', state);
  const {
    isOpen: isOpenChangeLanguage,
    onOpen: onOpenChangeLanguage,
    onClose: onCloseChangeLanguage,
  } = useDisclose();

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
    setLoginType('KompasId');

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
          authCode && setAuthorizationCode(authCode);
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

  const onLoadEndRegisterByKompas = async (nTry: number = 0) => {
    const cookiesString = await getCookiesString();
    console.info('cookiesString isNotRegistered true', cookiesString);

    await sleep(1000);
    if (cookiesString) {
      // getProfile();
      init();
    } else if (nTry > 10) {
      toast.show({
        title: t('error.failedToGetCookies'),
        description: t('error.failedToGetCookiesDesc'),
      });
      navigation.navigate('Logout');
    } else {
      onLoadEndRegisterByKompas(nTry + 1);
    }
  };

  const onLoadEndLoginByKompas = async (nTry: number = 0) => {
    // setTimeout(() => {
    //   init();
    // }, 500);
    // console.info('authorizationCode###event', event);
    await sleep(1000);
    const cookiesString = await getCookiesString();
    console.info('authorizationCode###cookiesString', cookiesString);
    if (cookiesString) {
      init();
    } else if (nTry > 5) {
      setIsNotRegistered(true);
      // toast.show({
      //   title: 'Failed to get cookies',
      //   description:
      //     'Please try to use more stable internet connection. Or try again later.',
      // });
    } else {
      onLoadEndLoginByKompas(nTry + 1);
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
          onLoadEnd={() => {
            onLoadEndRegisterByKompas();
          }}
          contentMode="mobile"
          thirdPartyCookiesEnabled={true}
          sharedCookiesEnabled={true}
        />

        {isLoading && (
          <LoadingBlock text={t('message.youAreNotRegistered') || ''} />
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
          onLoadEnd={() => {
            onLoadEndLoginByKompas();
          }}
          contentMode="mobile"
          thirdPartyCookiesEnabled={true}
          sharedCookiesEnabled={true}
          // javaScriptEnabled={true}
          // injectedJavaScript={jsCode}
          // onMessage={event =>
          //   console.log(
          //     'authorizationCode###Received: ',
          //     event.nativeEvent.data,
          //   )
          // }
          // onNavigationStateChange={async event => {
          //   console.info('event', event);
          //   const cookiesString = await getCookiesString();
          //   if (cookiesString) {
          //     getProfile();
          //   }
          // }}
        />

        {isLoading && (
          <LoadingBlock text={t('message.checkingSession') || ''} />
        )}
      </Box>
    );
  }

  const changeLanguage = async (langId: LanguageID) => {
    i18next.changeLanguage(langId === LanguageID.EN ? 'en' : 'id');
    LanguageService.setLanguage(langId === LanguageID.EN ? 'en' : 'id');
    // const url =
    //   config.apiUrl.href.href +
    //   config.apiUrl.apis.member.setLanguage.path +
    //   langId;
    // await httpRequest.get(url);
  };

  return (
    <AppContainer>
      <Box position="absolute" right="2" top="2" zIndex={10}>
        <TouchableOpacity
          onPress={() => {
            onOpenChangeLanguage();
          }}
          style={{padding: 10}}>
          <HStack alignItems="center">
            {i18next.language === 'en' && (
              <Image
                alt="English"
                source={require('../../assets/images/english.png')}
                shadow="2"
                mr="1"
              />
            )}
            {i18next.language === 'id' && (
              <Image
                alt="Indonesia"
                source={require('../../assets/images/indonesia.png')}
                shadow="2"
                mr="1"
              />
            )}
            <ChevronDownIcon size="sm" />
          </HStack>
        </TouchableOpacity>
      </Box>
      <VStack px="4" flex="1" justifyContent="space-between">
        <HStack justifyContent="center" flex={config.isDev ? '2' : '3'}>
          <VStack space="3" alignItems="center" justifyContent="center">
            <Heading textAlign={'center'}>
              {t('welcomeTo') + '\n'}
              Borobudur Marathon
            </Heading>
            <Text fontWeight={400} textAlign={'center'} color="#768499">
              {t('auth.description')}
            </Text>
          </VStack>
        </HStack>
        <VStack flex="1" justifyContent={'center'} space="1.5">
          {config.isShowDemoSettings && (
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
            h="12"
            mb="3"
            onPress={() => navigation.navigate('SignInEmail')}>
            {t('auth.signinViaEmail')}
          </Button>
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
              {t('auth.signInWith') + ' Kompas.id'}
            </Text>
          </Button>
          <Center mt="2">
            <HStack>
              <Text
                justifyContent={'center'}
                alignItems="center"
                fontWeight={400}>
                {t('auth.dontHaveAccount')}{' '}
              </Text>
              <Link
                onPress={() => {
                  // openAuthLink();
                  navigation.navigate('RegisterEmail');
                }}
                _text={{
                  color: 'red.600',
                  fontWeight: 600,
                }}>
                {t('auth.registerViaEmail')}
              </Link>
            </HStack>
          </Center>
        </VStack>

        <Center marginY={5}>
          <Text color="gray.500" fontSize="xs">
            v{Config.APP_VERSION_NAME} (build: {Config.APP_VERSION_BUILD}){' '}
            {config.codePushVersion ? ' ~ ' + config.codePushVersion : false}
          </Text>

          {config.isDev && (
            <Text color="gray.500" fontSize="xs">
              ~ development ~
            </Text>
          )}
        </Center>
      </VStack>

      <Actionsheet
        isOpen={isOpenChangeLanguage}
        onClose={onCloseChangeLanguage}
        hideDragIndicator>
        <Actionsheet.Content borderTopRadius="0">
          <Box
            w="100%"
            h={60}
            px={4}
            justifyContent="center"
            alignItems="center"
            fontWeight="bold">
            <Text
              fontSize="20"
              color="gray.900"
              _dark={{
                color: 'gray.300',
              }}>
              {t('profile.changeLanguage')}
            </Text>
          </Box>
          <Actionsheet.Item
            onPress={() => {
              changeLanguage(LanguageID.EN);
              onCloseChangeLanguage();
            }}>
            <HStack
              w={i18next.language === 'en' ? '85%' : '100%'}
              alignItems="center"
              justifyContent="space-between">
              <HStack alignItems="center" space={2}>
                <Image
                  alt="English"
                  source={require('../../assets/images/english.png')}
                />
                <Text>English</Text>
              </HStack>
              {i18next.language === 'en' && (
                <CheckCircleIcon color="primary.900" />
              )}
            </HStack>
          </Actionsheet.Item>
          <Actionsheet.Item
            onPress={() => {
              changeLanguage(LanguageID.ID);
              onCloseChangeLanguage();
            }}>
            <HStack
              w={i18next.language === 'id' ? '85%' : '100%'}
              alignItems="center"
              justifyContent="space-between">
              <HStack alignItems="center" space={2}>
                <Image
                  alt="Indonesia"
                  source={require('../../assets/images/indonesia.png')}
                />
                <Text>Indonesia</Text>
              </HStack>
              {i18next.language === 'id' && (
                <CheckCircleIcon color="primary.900" />
              )}
            </HStack>
          </Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>

      {config.isShowDemoSettings && (
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

              {isShowDemoNewUser && <Text>----------</Text>}

              {isShowDemoNewUser && (
                <FormControl>
                  <Checkbox
                    onChange={() => {
                      if (demoKTPVerification === 'processing') {
                        setDemoKTPVerification(undefined);
                      } else {
                        setDemoKTPVerification('processing');
                      }
                    }}
                    isChecked={demoKTPVerification === 'processing'}
                    value="demo-consent">
                    Demo KTP Processing
                  </Checkbox>
                </FormControl>
              )}

              {isShowDemoNewUser && (
                <FormControl>
                  <Checkbox
                    onChange={() => {
                      if (demoKTPVerification === 'invalid') {
                        setDemoKTPVerification(undefined);
                      } else {
                        setDemoKTPVerification('invalid');
                      }
                    }}
                    isChecked={demoKTPVerification === 'invalid'}
                    value="demo-consent">
                    Demo KTP Invalid
                  </Checkbox>
                </FormControl>
              )}
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
      )}
    </AppContainer>
  );
}

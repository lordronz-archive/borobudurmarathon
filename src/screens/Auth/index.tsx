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
} from 'native-base';
import React, {useEffect} from 'react';
import {Alert, Linking} from 'react-native';
import {AuthService} from '../../api/auth.service';
import KompasIcon from '../../components/icons/KompasIcon';
import {Heading} from '../../components/text/Heading';
import {getErrorMessage} from '../../helpers/errorHandler';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {ProfileService} from '../../api/profile.service';
import I18n from '../../lib/i18n';
import {useAuthUser} from '../../context/auth.context';
import WebView from 'react-native-webview';
import config from '../../config';
import CookieManager from '@react-native-community/cookies';

export default function AuthScreen() {
  console.info('render AuthScreen');
  const route = useRoute();
  const toast = useToast();
  const params: {authorization_code: string} = route.params as any;
  console.info('route', route);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {state} = useAuthUser();
  console.info('#Auth -- state', state);

  // useEffect(() => {
  //   if (params && params.authorization_code) {
  //     AuthService.authorizeKompas(params.authorization_code)
  //       .then(res => {
  //         console.info('### res.data', res.data);

  //         ProfileService.getMemberDetail()
  //           .then(resProfile => {
  //             console.info('resProfile', resProfile);
  //             console.info('resProfile', JSON.stringify(resProfile));

  //             if (resProfile.data && resProfile.data.length > 0) {
  //               toast.show({
  //                 description: 'Welcome, ' + resProfile.data[0].zmemFullName,
  //               });
  //             } else {
  //               toast.show({
  //                 description: 'Welcome, New Runner',
  //               });
  //             }

  //             // AuthService.refreshToken();
  //             navigation.navigate('DataConfirmation');
  //           })
  //           .catch(err => {
  //             console.info('### error resProfile', err);
  //             toast.show({
  //               title: 'Failed to get profile',
  //               variant: 'subtle',
  //               description: getErrorMessage(err),
  //             });
  //           });
  //       })
  //       .catch(err => {
  //         toast.show({
  //           title: 'Failed to authorize',
  //           variant: 'subtle',
  //           description: getErrorMessage(err),
  //         });
  //       });
  //   }
  // }, [route.params]);

  const redirect_uri = 'bormar://auth-me';
  // 'https://account.kompas.id/sso/check?redirect_uri=https://my.borobudurmarathon.com/dev.titudev.com/api/v1/kompasid/login/auth&client_id=3&state=borobudur_marathon&scope=nama%20lengkap,%20alamat,%20Alamat%20email%20dan%20mengirimkan%20pesan&response_type=code';

  const url =
    'https://account.kompas.id/sso/check?client_id=3&state=borobudur_marathon&scope=nama%20lengkap,%20alamat,%20Alamat%20email%20dan%20mengirimkan%20pesan&response_type=code&redirect_uri=' +
    encodeURIComponent(redirect_uri);
  console.info('redirect_uri', redirect_uri);
  console.info('url', url);

  const openAuthLink = async () => {
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

  const getProfile = () => {
    ProfileService.getMemberDetail()
      .then(resProfile => {
        console.info('resProfile', resProfile);
        console.info('resProfile', JSON.stringify(resProfile));
        if (resProfile.data && resProfile.data.length > 0) {
          toast.show({
            description: 'Welcome, ' + resProfile.data[0].zmemFullName,
          });
        } else {
          toast.show({
            description: 'Welcome, New Runner',
          });
        }
        // AuthService.refreshToken();
        navigation.navigate('DataConfirmation');
      })
      .catch(err => {
        console.info('### error resProfile', err);
        toast.show({
          title: 'Failed to get profile',
          variant: 'subtle',
          description: getErrorMessage(err),
        });
      });
  }

  if (params && params.authorization_code) {
    let uri =
      config.apiUrl.href.href +
      config.apiUrl.apis.kompas.authorize_code.path +
      '?authorization_code=' +
      encodeURIComponent(params.authorization_code);
    console.info('uri', uri);
    uri = uri.replace('//kompasid/', '/kompasid/');
    return (
      <Box>
        <HStack
          space={2}
          justifyContent="center"
          style={{position: 'absolute', width: '100%', height: '100%'}}>
          <Spinner accessibilityLabel="Loading posts" />
          <Heading color="primary.500" fontSize="md">
            Loading
          </Heading>
        </HStack>
        <WebView
          source={{
            uri,
          }}
          thirdPartyCookiesEnabled={true}
          onNavigationStateChange={event => {
            console.info('event', event);
            CookieManager.getAll(true).then(resCookie => {
              console.info('resCookie cookies', resCookie);
              const myBorMarCookie = Object.values(resCookie).find(
                item => item.domain === 'my.borobudurmarathon.com',
              );
              console.info('myBorMarCookie', myBorMarCookie);

              if (myBorMarCookie) {
                getProfile();
              }
              // const resCookie = {
              //   NID: {
              //     domain: '.google.com',
              //     expires: '2023-07-12T19:48:51.000+07:00',
              //     httpOnly: true,
              //     name: 'NID',
              //     path: '/',
              //     secure: true,
              //     value:
              //       '511=Q0yvommVbLoLw771lcBA-UyI3yYrNUKHrg5syjItvh1-jx5LJWQQrdZbv8xU7YjmBApMYAxl8uEjfek-Vywc3-VbPJV_-cZUL8rDk96QcihBIE0qsaEBI55TjsmZAGot-YfCHQAJ2-Qos0FUZs3C_Ye3-f96PfkOF09GuPGfnW4',
              //     version: '1',
              //   },
              //   PHPSESSID: {
              //     domain: 'my.borobudurmarathon.com',
              //     expires: '2024-01-16T13:56:30.000+07:00',
              //     httpOnly: false,
              //     name: 'PHPSESSID',
              //     path: '/',
              //     secure: false,
              //     value: '6afkdqsvd6rflqi7bsofp8grbc',
              //     version: '1',
              //   },
              //   USER_DATA: {
              //     domain: '.kompas.id',
              //     expires: '2023-01-17T19:52:11.000+07:00',
              //     httpOnly: false,
              //     name: 'USER_DATA',
              //     path: '/',
              //     secure: true,
              //     value:
              //       '%7B%22attributes%22%3A%5B%5D%2C%22subscribedToOldSdk%22%3Afalse%2C%22deviceUuid%22%3A%2227f856a4-85a9-4b86-ba75-0f6012890815%22%2C%22deviceAdded%22%3Atrue%7D',
              //     version: '1',
              //   },
              //   '__Host-GAPS': {
              //     domain: 'accounts.google.com',
              //     expires: '2025-01-09T19:48:47.000+07:00',
              //     httpOnly: true,
              //     name: '__Host-GAPS',
              //     path: '/',
              //     secure: true,
              //     value: '1:p6jZ85yJC-9JuaLd_QEp9QTmT4gGYA:gZGDdUGEgM62rT3d',
              //     version: '1',
              //   },
              //   _ga: {
              //     domain: '.kompas.id',
              //     expires: '2023-01-17T19:52:13.000+07:00',
              //     httpOnly: false,
              //     name: '_ga',
              //     path: '/',
              //     secure: false,
              //     value: 'GA1.2.82693122.1673354908',
              //     version: '1',
              //   },
              //   _ga_8NH8NE9VN9: {
              //     domain: '.kompas.id',
              //     expires: '2023-01-17T19:52:17.000+07:00',
              //     httpOnly: false,
              //     name: '_ga_8NH8NE9VN9',
              //     path: '/',
              //     secure: false,
              //     value: 'GS1.1.1673354907.1.1.1673355137.39.0.0',
              //     version: '1',
              //   },
              //   datr: {
              //     domain: '.facebook.com',
              //     expires: '2025-01-09T19:52:04.000+07:00',
              //     httpOnly: true,
              //     name: 'datr',
              //     path: '/',
              //     secure: true,
              //     value: 'c1-9Y72QMSl5Fm8V_yO9p09q',
              //     version: '1',
              //   },
              //   fr: {
              //     domain: '.facebook.com',
              //     expires: '2023-04-10T19:52:06.000+07:00',
              //     httpOnly: true,
              //     name: 'fr',
              //     path: '/',
              //     secure: true,
              //     value:
              //       '0bkrnATWITSE2pMFK..BjvV90.tN.AAA.0.0.BjvV93.AWUUhWhfXPI',
              //     version: '1',
              //   },
              //   m_pixel_ratio: {
              //     domain: '.facebook.com',
              //     expires: '2023-01-17T19:52:06.000+07:00',
              //     httpOnly: false,
              //     name: 'm_pixel_ratio',
              //     path: '/',
              //     secure: true,
              //     value: '3',
              //     version: '1',
              //   },
              //   sb: {
              //     domain: '.facebook.com',
              //     expires: '2025-01-09T19:52:04.000+07:00',
              //     httpOnly: true,
              //     name: 'sb',
              //     path: '/',
              //     secure: true,
              //     value: 'dF-9Yy7CXbPZH-6LJGTe0m_H',
              //     version: '1',
              //   },
              //   wd: {
              //     domain: '.facebook.com',
              //     expires: '2023-01-17T19:52:06.000+07:00',
              //     httpOnly: false,
              //     name: 'wd',
              //     path: '/',
              //     secure: true,
              //     value: '390x844',
              //     version: '1',
              //   },
              // };
            });
          }}
        />
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
            openAuthLink();
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

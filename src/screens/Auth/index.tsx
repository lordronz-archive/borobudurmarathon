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

  useEffect(() => {
    if (params && params.authorization_code) {
      AuthService.authorizeKompas(params.authorization_code)
        .then(res => {
          console.info('### res.data', res.data);

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

              AuthService.refreshToken();
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
        })
        .catch(err => {
          toast.show({
            title: 'Failed to authorize',
            variant: 'subtle',
            description: getErrorMessage(err),
          });
        });
    }
  }, [route.params]);

  const redirect_uri = 'bormar://auth-me';
  const url =
    'https://account.kompas.id/sso/check?client_id=3&state=borobudur_marathon&scope=nama%20lengkap,%20alamat,%20Alamat%20email%20dan%20mengirimkan%20pesan&response_type=code&redirect_uri=' +
    encodeURIComponent(redirect_uri);
  console.info('redirect_uri', redirect_uri);
  console.info('url', url);

  const openAuthLink = async () => {
    try {
      Linking.openURL(url);
      return;
    } catch (error) {
      Alert.alert(getErrorMessage(error));
    }
  };

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

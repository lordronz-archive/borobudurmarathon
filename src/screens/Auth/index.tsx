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
  Box, Button, useToast,
} from 'native-base';
import React, {useEffect, useState} from 'react';
import {Alert, Linking} from 'react-native';
import {AuthService} from '../../api/auth.service';
import KompasIcon from '../../components/icons/KompasIcon';
import {Heading} from '../../components/text/Heading';
import {getErrorMessage} from '../../helpers/errorHandler';
import httpRequest from '../../helpers/httpRequest';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {ProfileService} from '../../api/profile.service';

export default function AuthScreen() {
  // const _resDLI = useDeeplinkInit();
  console.info('render AuthScreen');
  const route = useRoute();
  const toast = useToast();
  const params: {authorization_code: string} = route.params as any;
  console.info('route', route);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [uri, setUri] = useState<string>();

  useEffect(() => {
    // AuthService.bindMemberToKompas().then(res => {
    //   console.info('res.url', res.url);
    //   setUri(res.url);
    // });
  }, []);

  useEffect(() => {
    if (params && params.authorization_code) {
      AuthService.authorizeKompas(params.authorization_code)
        .then(res => {
          console.info('### res.data', res.data);

          ProfileService.getMemberDetail()
            .then(resProfile => {
              console.info('resProfile', resProfile);
              console.info('resProfile', JSON.stringify(resProfile));
              navigation.navigate('DataConfirmation');

              if (resProfile.data && resProfile.data.length > 0) {
                toast.show({
                  description: 'Welcome, ' + resProfile.data[0].zmemFullName,
                });
              } else {
                toast.show({
                  description: 'Welcome, New Runner',
                });
              }
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

  const openLink = async () => {
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
          <Heading textAlign={'center'}>Welcome to Borobudur Marathon</Heading>
          <Text fontWeight={400} textAlign={'center'} color="#768499">
            Ayo bergabung menjadi bagian dari komunitas Borobudur Marathon.
            Event lari terbesar di Jawa Tengah, Indonesia.
          </Text>
        </VStack>
      </HStack>
      <VStack flex="1" justifyContent={'center'} space="5">
        <Button
          backgroundColor={'#00559A'}
          rounded="sm"
          onPress={() => {
            openLink();
          }}
          startIcon={<KompasIcon size="lg" px="6" />}>
          <Text color="white" px="12">
            Masuk dengan Kompas.id
          </Text>
        </Button>
        <Center>
          <HStack>
            <Text
              justifyContent={'center'}
              alignItems="center"
              fontWeight={400}>
              Didn't Have an Account?{' '}
            </Text>
            <Link
              href="https://nativebase.io"
              isExternal
              _text={{
                color: 'blue.600',
                fontWeight: 600,
              }}>
              Register
            </Link>
          </HStack>
        </Center>
      </VStack>
    </Box>
  );
}

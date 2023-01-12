/* eslint-disable react-hooks/exhaustive-deps */
import {useNavigation, useRoute} from '@react-navigation/native';
import {Box, Button} from 'native-base';
import React, {useEffect, useState} from 'react';
import {Alert, Linking} from 'react-native';
import {AuthService} from '../../api/auth.service';
import {getErrorMessage} from '../../helpers/errorHandler';
import httpRequest from '../../helpers/httpRequest';

export default function AuthScreen() {
  // const _resDLI = useDeeplinkInit();
  console.info('render AuthScreen');
  const route = useRoute();
  const params: {authorization_code: string} = route.params;
  console.info('route', route);

  const navigation = useNavigation();

  const [uri, setUri] = useState<string>();

  useEffect(() => {
    AuthService.bindMemberToKompas().then(res => {
      console.info('res.url', res.url);
      setUri(res.url);
    });
  }, []);

  useEffect(() => {
    if (params && params.authorization_code) {
      httpRequest
        .get(
          'https://my.borobudurmarathon.com/dev.titudev.com/api/v1/kompasid/login/auth?authorization_code' +
            params.authorization_code,
        )
        .then(res => {
          console.info('res.data', res.data);
        })
        .catch(err => {
          console.info('error', err);
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
    <Box>
      <Button
        onPress={() => {
          openLink();
          // authorizeMe();
          // navigation.navigate('SignInWithKompas');
        }}>
        Sign In With Kompas
      </Button>
    </Box>
  );
}

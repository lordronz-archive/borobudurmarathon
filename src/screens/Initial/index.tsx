import React, {useEffect, useState} from 'react';
import {Box, Center, Spinner, Text} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import {EAuthUserAction, useAuthUser} from '../../context/auth.context';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {TokenService} from '../../api/token.service';
import {ProfileService} from '../../api/profile.service';
import {AuthService} from '../../api/auth.service';
import CookieManager from '@react-native-community/cookies';
import config from '../../config';

export default function InitialScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isLoading, setIsLoading] = useState(true);
  const {dispatch} = useAuthUser();

  const checkLogin = async () => {
    const resCookie = await CookieManager.getAll(true);
    console.info('resCookie cookies', resCookie);
    const myBorMarCookie = Object.values(resCookie).find(
      item => item.domain === 'my.borobudurmarathon.com',
    );
    console.info('myBorMarCookie', myBorMarCookie);

    if (myBorMarCookie) {
      // get profile
      ProfileService.getMemberDetail()
        .then(res => {
          if (res && res.data && res.data.length > 0) {
            dispatch({
              type: EAuthUserAction.LOGIN,
              payload: {user: res.data[0]},
            });
            navigation.navigate('Main');
          } else {
            navigation.navigate('Auth');
          }
          setIsLoading(false);
        })
        .catch(err => {
          setIsLoading(false);
          CookieManager.clearAll();
          navigation.navigate('Auth');
        });

      // fetch(config.apiUrl.href.href + 'member_resource/member/', {
      //   method: 'GET',
      //   headers: {
      //     Accept: 'application/json',
      //     'Content-Type': 'application/json',
      //   },
      //   // body: JSON.stringify({
      //   //   firstParam: 'yourValue',
      //   //   secondParam: 'yourOtherValue',
      //   // }),
      //   credentials: 'omit',
      // })
      //   .then(response => response.json())
      //   .then(json => {
      //     console.info('json', json);
      //     // return json.movies;
      //   })
      //   .catch(error => {
      //     console.error('error fetch', error);
      //   });
    } else {
      navigation.navigate('Auth');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <Box>
      <Center>{isLoading ? <Spinner /> : <Text>...</Text>}</Center>
    </Box>
  );
}

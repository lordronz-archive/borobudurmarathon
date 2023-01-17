/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import {Box, Center, Spinner} from 'native-base';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {EAuthUserAction, useAuthUser} from '../../context/auth.context';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {ProfileService} from '../../api/profile.service';
import {getCookiesString} from '../../api/cookies';

export default function InitialScreen() {
  const isFocused = useIsFocused();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {isLoggedIn, dispatch} = useAuthUser();

  const checkLogin = async () => {
    if (isLoggedIn) {
      const cookiesString = await getCookiesString();

      if (cookiesString) {
        // get profile
        ProfileService.getMemberDetail()
          .then(res => {
            if (res && res.data && res.data.length > 0) {
              dispatch({
                type: EAuthUserAction.LOGIN,
                payload: {user: res.data[0]},
              });
              navigation.navigate('Main', {screen: 'Home'});
            } else {
              navigation.navigate('Auth');
            }
          })
          .catch(err => {
            console.info('err ProfileService.getMemberDetail()', err);
            navigation.navigate('Auth');
          });
      } else {
        navigation.navigate('Auth');
      }
    } else {
      navigation.navigate('Auth');
    }
  };

  useEffect(() => {
    if (isFocused) {
      checkLogin();
    }
  }, [isFocused]);

  return (
    <Box justifyContent="center" alignItems="center" flex={1}>
      <Center>
        <Spinner size="lg" />
      </Center>
    </Box>
  );
}

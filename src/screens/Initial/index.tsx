import React, {useEffect, useState} from 'react';
import {Box, Center, Spinner, Text} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import {EAuthUserAction, useAuthUser} from '../../context/auth.context';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {TokenService} from '../../api/token.service';
import {ProfileService} from '../../api/profile.service';
import {AuthService} from '../../api/auth.service';

export default function InitialScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isLoading, setIsLoading] = useState(true);
  const {dispatch} = useAuthUser();

  const checkLogin = async () => {
    const token = await TokenService.getToken();
    if (token) {
      // get profile
      ProfileService.getMemberDetail()
        .then(res => {
          if (res && res.data && res.data.length > 0) {
            dispatch({
              type: EAuthUserAction.LOGIN,
              payload: {user: res.data[0]},
            });
            AuthService.refreshToken();
            navigation.navigate('Main');
          } else {
            navigation.navigate('Auth');
          }
          setIsLoading(false);
        })
        .catch(err => {
          setIsLoading(false);
        });
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

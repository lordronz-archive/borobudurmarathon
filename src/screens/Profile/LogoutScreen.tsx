import React, {useState} from 'react';
import {Box, Center, Spinner} from 'native-base';
import CookieManager from '@react-native-cookies/cookies';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {EAuthUserAction, useAuthUser} from '../../context/auth.context';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import {SessionService} from '../../api/session.service';
import Logout from './Logout';

export default function LogoutScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {dispatch} = useAuthUser();
  const [isLoggingOut, setIsLoggingOut] = useState(true);

  const logout = async () => {
    InAppBrowser.closeAuth();
    await CookieManager.clearAll();

    dispatch({type: EAuthUserAction.LOGOUT});
    SessionService.removeSession();

    setIsLoggingOut(false);
    navigation.navigate('Initial');
  };

  if (isLoggingOut) {
    return (
      <Logout
        onLoadEnd={() => {
          logout();
        }}
      />
    );
  }

  return (
    <Box justifyContent="center" alignItems="center">
      <Center>
        <Spinner />
      </Center>
    </Box>
  );
}

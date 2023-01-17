import React, { useState } from 'react';
import {Box, Text, Button} from 'native-base';
import CookieManager from '@react-native-cookies/cookies';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {EAuthUserAction, useAuthUser} from '../../context/auth.context';
import InAppBrowser from 'react-native-inappbrowser-reborn';
// import Logout from './Logout';

export default function MyProfile() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {dispatch} = useAuthUser();
  // const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = async () => {
    await CookieManager.clearAll();

    dispatch({type: EAuthUserAction.LOGOUT});

    navigation.navigate('Initial');
  };

  // if (isLoggingOut) {
  //   return <Logout />;
  // }

  return (
    <Box>
      <Text>My Profile</Text>

      <Button
        onPress={() => {
          InAppBrowser.closeAuth();
          logout();
          // setIsLoggingOut(true);
          // setTimeout(() => {
          //   logout();
          //   setIsLoggingOut(false);
          // }, 1000);
        }}>
        Logout
      </Button>
    </Box>
  );
}

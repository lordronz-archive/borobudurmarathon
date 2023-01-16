import React from 'react';
import {Box, Text, Button} from 'native-base';
import CookieManager from '@react-native-community/cookies';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {EAuthUserAction, useAuthUser} from '../../context/auth.context';

export default function MyProfile() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {dispatch} = useAuthUser();

  const logout = async () => {
    await CookieManager.clearAll();

    dispatch({type: EAuthUserAction.LOGOUT});

    navigation.navigate('Initial');
  };

  return (
    <Box>
      <Text>My Profile</Text>

      <Button
        onPress={() => {
          logout();
        }}>
        Logout
      </Button>
    </Box>
  );
}

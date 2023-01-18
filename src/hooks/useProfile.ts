/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useState} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {getCookiesString} from '../api/cookies';
import {ProfileService} from '../api/profile.service';
import {EAuthUserAction, useAuthUser} from '../context/auth.context';
import {RootStackParamList} from '../navigation/RootNavigator';
import {SessionService} from '../api/session.service';
import {IProfile} from '../types/profile.type';

export default function useProfile() {
  const isFocused = useIsFocused();

  const {isLoggedIn, dispatch} = useAuthUser();

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [profile, setProfile] = useState<IProfile>();

  const checkLogin = async (loginStatus?: boolean) => {
    if (isLoggedIn || loginStatus) {
      const cookiesString = await getCookiesString();

      if (cookiesString) {
        // get profile
        ProfileService.getMemberDetail()
          .then(resProfile => {
            if (resProfile && resProfile.data && resProfile.data.length > 0) {
              dispatch({
                type: EAuthUserAction.LOGIN,
                payload: {user: resProfile},
              });
              setProfile(resProfile.data[0]);
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
      const isSessionAvailable = await SessionService.getSession();
      if (isSessionAvailable) {
        checkLogin(true);
      } else {
        navigation.navigate('Auth');
      }
    }
  };

  useEffect(() => {
    if (isFocused) {
      checkLogin();
    }
  }, [isFocused]);

  return profile;
}

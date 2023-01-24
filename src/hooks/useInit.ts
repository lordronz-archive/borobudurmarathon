/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {getCookiesString} from '../api/cookies';
import {ProfileService} from '../api/profile.service';
import {EAuthUserAction, useAuthUser} from '../context/auth.context';
import {RootStackParamList} from '../navigation/RootNavigator';
import {SessionService} from '../api/session.service';

export default function useInit() {
  const isFocused = useIsFocused();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {isLoggedIn, dispatch} = useAuthUser();

  const checkLogin = async (loginStatus?: boolean) => {
    if (isLoggedIn || loginStatus) {
      const cookiesString = await getCookiesString();

      if (cookiesString) {
        // get profile
        ProfileService.getMemberDetail()
          .then(resProfile => {
            if (resProfile && resProfile.data && resProfile.data.length > 0) {
              console.info('##resProfile', JSON.stringify(resProfile));

              dispatch({
                type: EAuthUserAction.LOGIN,
                payload: {user: resProfile},
              });
              if (
                resProfile.linked.mbsdZmemId &&
                resProfile.linked.mbsdZmemId[0]
              ) {
                // profile has been completed
                navigation.navigate('Main', {screen: 'Home'});
              } else {
                // need to complete profile
                navigation.navigate('InputProfile');
              }
              // if (!toast.isActive('welcome')) {
              //   toast.show({
              //     id: 'welcome',
              //     description: 'Welcome, ' + resProfile.data[0].zmemFullName,
              //   });
              // }
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
      // checkLogin();
      navigation.navigate('DataConfirmation');
    }
  }, [isFocused]);

  return {isAutoInit: true};
}

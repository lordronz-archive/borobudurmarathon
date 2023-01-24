/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useToast} from 'native-base';
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

              // if (resProfile.data[0].zmemStatus)
              dispatch({
                type: EAuthUserAction.LOGIN,
                payload: {user: resProfile},
              });
              // if (!toast.isActive('welcome')) {
              //   toast.show({
              //     id: 'welcome',
              //     description: 'Welcome, ' + resProfile.data[0].zmemFullName,
              //   });
              // }
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

  return {isAutoInit: true};
}

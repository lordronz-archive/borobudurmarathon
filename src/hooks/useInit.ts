/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {getCookiesString} from '../api/cookies';
import {ProfileService} from '../api/profile.service';
import {EAuthUserAction, useAuthUser} from '../context/auth.context';
import {RootStackParamList} from '../navigation/RootNavigator';
import {SessionService} from '../api/session.service';
import {useToast} from 'native-base';
import {getErrorMessage} from '../helpers/errorHandler';
import {AuthService} from '../api/auth.service';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import CookieManager from '@react-native-cookies/cookies';

export default function useInit() {
  const toast = useToast();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {isLoggedIn, dispatch} = useAuthUser();

  const checkLogin = async (loginStatus?: boolean) => {
    if (isLoggedIn || loginStatus) {
      const cookiesString = await getCookiesString();

      if (cookiesString) {
        getProfile();
        // get profile
        // ProfileService.getMemberDetail()
        //   .then(resProfile => {
        //     if (resProfile && resProfile.data && resProfile.data.length > 0) {
        //       console.info('##resProfile', JSON.stringify(resProfile));
        //       dispatch({
        //         type: EAuthUserAction.LOGIN,
        //         payload: {user: resProfile},
        //       });
        //       if (
        //         resProfile.linked.mbsdZmemId &&
        //         resProfile.linked.mbsdZmemId[0]
        //       ) {
        //         // profile has been completed
        //         navigation.navigate('Main', {screen: 'Home'});
        //       } else {
        //         // need to complete profile
        //         navigation.navigate('InputProfile');
        //       }
        //       // if (!toast.isActive('welcome')) {
        //       //   toast.show({
        //       //     id: 'welcome',
        //       //     description: 'Welcome, ' + resProfile.data[0].zmemFullName,
        //       //   });
        //       // }
        //     } else {
        //       navigation.navigate('Auth');
        //     }
        //   })
        //   .catch(err => {
        //     console.info('err ProfileService.getMemberDetail()', err);
        //     navigation.navigate('Auth');
        //   });
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

  const getProfile = () => {
    ProfileService.getMemberDetail()
      .then(resProfile => {
        console.info('resProfile', resProfile);
        console.info('###resProfile###', JSON.stringify(resProfile));
        dispatch({
          type: EAuthUserAction.LOGIN,
          payload: {user: resProfile},
        });
        SessionService.saveSession();
        if (resProfile.data && resProfile.data.length > 0) {
          toast.show({
            id: 'welcome',
            description: 'Welcome, ' + resProfile.data[0].zmemFullName,
          });
          if (resProfile.linked.zmemAuusId[0].auusVerification) {
            if (
              resProfile.linked.mbsdZmemId &&
              resProfile.linked.mbsdZmemId[0]
            ) {
              // profile has been completed
              // if (payload.data.linked.mbsdZmemId[0].mbsdStatus > 0) {
              //   state.readyToRegister = true;
              // }
              navigation.navigate('Main', {screen: 'Home'});
              if (!toast.isActive('welcome')) {
                toast.show({
                  id: 'welcome',
                  description: 'Welcome, ' + resProfile.data[0].zmemFullName,
                });
              }
            } else {
              toast.show({
                description: "Welcome, let's complete your data",
              });
              // need to complete profile
              navigation.navigate('InputProfile');
            }
          } else if (!resProfile.linked.zmemAuusId[0].auusVerification) {
            // need to complete profile
            toast.show({
              id: 'need-to-verify-email',
              description: 'Please confirm your email to continue',
            });
            AuthService.verificationEmail().then(() =>
              navigation.navigate('EmailValidation'),
            );
          }
        } else {
          toast.show({
            id: 'welcome',
            description: 'Welcome, New Runner',
          });
          navigation.navigate('InputProfile');
        }
      })
      .catch(err => {
        console.info('### error resProfile', err);
        console.info('### error resProfile --- ', JSON.stringify(err));
        if (err && err.errorCode === 409) {
          navigation.navigate('Logout');
          // setIsNotRegistered(true);
        } else {
          toast.show({
            title: 'Failed to get profile',
            variant: 'subtle',
            description: getErrorMessage(err),
          });
          navigation.navigate('Initial');
        }
      });
  };

  const logout = async (
    setIsLoggingOut: (val: boolean) => void,
    onCloseModalLogout: () => void,
  ) => {
    InAppBrowser.closeAuth();
    await CookieManager.clearAll();

    dispatch({type: EAuthUserAction.LOGOUT});
    SessionService.removeSession();

    setIsLoggingOut(false);

    toast.show({
      id: 'logout',
      description: 'Logout successfully',
    });

    onCloseModalLogout();
    navigation.navigate('Initial');
  };

  return {checkLogin, getProfile, logout};
}

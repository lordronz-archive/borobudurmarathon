/* eslint-disable react-hooks/exhaustive-deps */
import {useNavigation} from '@react-navigation/native';
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
import {IMemberDetailResponse} from '../types/profile.type';
import {useDemo} from '../context/demo.context';

export default function useInit() {
  const toast = useToast();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {
    isShowDemoVerifyEmail,
    setDemoVerifyEmail,
    isShowDemoConsent,
    setDemoConsent,
    isShowDemoNewUser,
    setDemoNewUser,
  } = useDemo();

  const {isLoggedIn, dispatch} = useAuthUser();

  const checkLogin = async (loginStatus?: boolean) => {
    if (isLoggedIn || loginStatus) {
      const cookiesString = await getCookiesString();

      if (cookiesString) {
        getProfile(cookiesString);
      } else {
        navigation.navigate('Auth');
      }
    } else {
      const isSessionAvailable = await SessionService.getSession();
      if (isSessionAvailable) {
        const res = await AuthService.checkSession();
        if (res && res.data) {
          checkLogin(true);
        } else {
          InAppBrowser.closeAuth();
          await CookieManager.clearAll();

          dispatch({type: EAuthUserAction.LOGOUT});
          SessionService.removeSession();

          navigation.navigate('Initial');
        }
      } else {
        navigation.navigate('Auth');
      }
    }
  };

  const getProfile = (cookie?: string) => {
    ProfileService.getMemberDetail()
      .then(resProfile => {
        console.info('resProfile', resProfile);
        console.info('###resProfile###', JSON.stringify(resProfile));
        dispatch({
          type: EAuthUserAction.LOGIN,
          payload: {user: resProfile},
        });
        if (cookie) {
          SessionService.saveSession(cookie);
        }
        if (resProfile.data && resProfile.data.length > 0) {
          if (
            resProfile.linked.zmemAuusId &&
            resProfile.linked.zmemAuusId[0] &&
            resProfile.linked.zmemAuusId[0].auusVerification
          ) {
            // start trial
            if (isShowDemoVerifyEmail) {
              toast.show({
                id: 'need-to-verify-email',
                description: '(DEMO) Please confirm your email to continue',
              });
              AuthService.verificationEmail().then(() =>
                navigation.navigate('EmailValidation', {
                  email: resProfile.linked.zmemAuusId[0].auusEmail,
                  onSuccess: () => {
                    setDemoVerifyEmail(false);
                    checkProfileIsCompleteOrNot(resProfile);
                  },
                }),
              );
            } else {
              checkProfileIsCompleteOrNot(resProfile);
            }
          } else if (
            resProfile.linked.zmemAuusId &&
            resProfile.linked.zmemAuusId[0] &&
            !resProfile.linked.zmemAuusId[0].auusVerification
          ) {
            // need to complete profile
            toast.show({
              id: 'need-to-verify-email',
              description: 'Please confirm your email to continue',
            });
            AuthService.verificationEmail().then(() =>
              navigation.navigate('EmailValidation', {
                email: resProfile.linked.zmemAuusId[0].auusEmail,
                onSuccess: () => {
                  checkProfileIsCompleteOrNot(resProfile);
                },
              }),
            );
          } else {
            toast.show({
              id: 'logout',
              description: 'Something wrong, please try again',
            });
            navigation.navigate('Logout');
          }
        } else {
          toast.show({
            id: 'logout',
            description: 'Something wrong, please try again',
          });
          navigation.navigate('Auth');
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

  const checkProfileIsCompleteOrNot = (resProfile: IMemberDetailResponse) => {
    if (resProfile.linked.mbsdZmemId && resProfile.linked.mbsdZmemId[0]) {
      // profile has been completed
      if (isShowDemoNewUser) {
        toast.show({
          id: 'welcome',
          description: 'Welcome, New Runner',
        });
        // need to complete profile
        // navigation.navigate('InputProfile');
        navigation.replace('ChooseCitizen');
        setDemoNewUser(false);
      } else {
        if (resProfile.linked.zmemAuusId[0].auusConsent === 1) {
          if (isShowDemoConsent) {
            navigation.replace('DataConfirmation');
            setDemoConsent(false);
          } else {
            // navigation.replace('Main', {screen: 'Home'});
            if (!toast.isActive('welcome')) {
              toast.show({
                id: 'welcome',
                description: 'Welcome, ' + resProfile.data[0].zmemFullName,
              });
            }
          }
        } else {
          navigation.replace('DataConfirmation');
        }
      }
    } else {
      // toast.show({
      //   description: "Let's complete your data",
      // });
      toast.show({
        id: 'welcome',
        description: 'Welcome, New Runner',
      });
      // need to complete profile
      // navigation.navigate('InputProfile');
      navigation.replace('ChooseCitizen');
    }
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

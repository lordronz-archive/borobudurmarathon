/* eslint-disable react-hooks/exhaustive-deps */
import {useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ProfileService} from '../api/profile.service';
import {EAuthUserAction, useAuthUser} from '../context/auth.context';
import {RootStackParamList} from '../navigation/RootNavigator';
import {SessionService} from '../api/session.service';
import {useToast} from 'native-base';
import {getErrorMessage} from '../helpers/errorHandler';
import {AuthService} from '../api/auth.service';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import CookieManager from '@react-native-cookies/cookies';
import {IMemberDetailResponse, IProfile} from '../types/profile.type';
import {useDemo} from '../context/demo.context';
import {IAuthResponseData} from '../types/auth.type';
import config from '../config';
import {cleanPhoneNumber} from '../helpers/phoneNumber';
import i18next from 'i18next';
import {Platform} from 'react-native';
import {useTranslation} from 'react-i18next';

export default function useInit() {
  const route = useRoute();
  const toast = useToast();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {setLoginType} = useAuthUser();
  const {t} = useTranslation();

  const {
    isShowDemoVerifyEmail,
    setDemoVerifyEmail,
    isShowDemoConsent,
    setDemoConsent,
    isShowDemoNewUser,
    setDemoNewUser,
  } = useDemo();

  const {dispatch} = useAuthUser();

  const init = async () => {
    try {
      const res = await AuthService.checkSession();

      if (res) {
        setLoginType(res.data.login);
        console.info('AuthService.checkSession', res);

        const profile = await getProfile();

        if (profile) {
          checkAccount(res.data, profile);
        }
      } else {
        console.info('AuthService.checkSession res empty');
        navigation.replace('Auth');
        logout();
      }
    } catch (err) {
      logout();
      console.info('AuthService.checkSession catch', err);
      navigation.replace('Auth');
    }
  };

  const getProfile = async () => {
    try {
      const resProfile = await ProfileService.getMemberDetail();

      // console.info('resProfile', resProfile);
      console.info('###resProfile###', JSON.stringify(resProfile));
      dispatch({
        type: EAuthUserAction.LOGIN,
        payload: {user: resProfile},
      });

      await i18next.changeLanguage(
        +resProfile.data[0].zmemLanguage === 1 ? 'en' : 'id',
      );

      return resProfile;
      // if (cookie) {
      //   SessionService.saveSession(cookie);
      // }
      // if (resProfile.data && resProfile.data.length > 0) {
      //   if (
      //     resProfile.linked.zmemAuusId &&
      //     resProfile.linked.zmemAuusId[0] &&
      //     resProfile.linked.zmemAuusId[0].auusVerification
      //   ) {
      //     // start trial
      //     if (isShowDemoVerifyEmail) {
      //       toast.show({
      //         id: 'need-to-verify-email',
      //         description: '(DEMO) Please confirm your email to continue',
      //       });
      //       AuthService.verificationEmail().then(() =>
      //         navigation.navigate('EmailValidation', {
      //           email: resProfile.linked.zmemAuusId[0].auusEmail,
      //           onSuccess: () => {
      //             setDemoVerifyEmail(false);
      //             checkProfileIsCompleteOrNot(resProfile);
      //           },
      //         }),
      //       );
      //     } else {
      //       checkProfileIsCompleteOrNot(resProfile);
      //     }
      //   } else if (
      //     resProfile.linked.zmemAuusId &&
      //     resProfile.linked.zmemAuusId[0] &&
      //     !resProfile.linked.zmemAuusId[0].auusVerification
      //   ) {
      //     // need to complete profile
      //     toast.show({
      //       id: 'need-to-verify-email',
      //       description: 'Please confirm your email to continue',
      //     });
      //     AuthService.verificationEmail().then(() =>
      //       navigation.navigate('EmailValidation', {
      //         email: resProfile.linked.zmemAuusId[0].auusEmail,
      //         onSuccess: () => {
      //           checkProfileIsCompleteOrNot(resProfile);
      //         },
      //       }),
      //     );
      //   } else {
      //     toast.show({
      //       id: 'logout',
      //       description: 'Something wrong, please try again',
      //     });
      //     navigation.navigate('Logout');
      //   }
      // } else {
      //   toast.show({
      //     id: 'logout',
      //     description: 'Something wrong, please try again',
      //   });
      //   navigation.navigate('Auth');
      // }
    } catch (err: any) {
      console.info('### error resProfile', err);
      console.info('### error resProfile --- ', JSON.stringify(err));
      if (err && err.status === 409) {
        navigation.navigate('Logout');
        // setIsNotRegistered(true);
      } else if (err && err.errorCode === 409) {
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
    }
  };

  // const checkProfileIsCompleteOrNot = (resProfile: IMemberDetailResponse) => {
  //   if (resProfile.linked.mbsdZmemId && resProfile.linked.mbsdZmemId[0]) {
  //     // profile has been completed
  //     if (isShowDemoNewUser) {
  //       toast.show({
  //         id: 'welcome',
  //         description: 'Welcome, New Runner',
  //       });
  //       // need to complete profile
  //       // navigation.navigate('InputProfile');
  //       navigation.replace('ChooseCitizen');
  //       setDemoNewUser(false);
  //     } else {
  //       if (resProfile.linked.zmemAuusId[0].auusConsent === 1) {
  //         if (isShowDemoConsent) {
  //           navigation.replace('DataConfirmation');
  //           setDemoConsent(false);
  //         } else {
  //           if (route.name !== 'Home') {
  //             navigation.replace('Main', {screen: 'Home'});
  //             if (!toast.isActive('welcome')) {
  //               toast.show({
  //                 id: 'welcome',
  //                 description: 'Welcome, ' + resProfile.data[0].zmemFullName,
  //               });
  //             }
  //           }
  //         }
  //       } else {
  //         navigation.replace('DataConfirmation');
  //       }
  //     }
  //   } else {
  //     // toast.show({
  //     //   description: "Let's complete your data",
  //     // });
  //     toast.show({
  //       id: 'welcome',
  //       description: 'Welcome, New Runner',
  //     });
  //     // need to complete profile
  //     // navigation.navigate('InputProfile');
  //     navigation.replace('ChooseCitizen');
  //   }
  // };

  const checkAccount = async (
    data: IAuthResponseData,
    profile: IMemberDetailResponse,
    replace?: {
      isShowDemoVerifyEmail?: boolean;
      isShowDemoConsent?: boolean;
      isShowDemoNewUser?: boolean;
    },
  ) => {
    console.info('checkAccount: data', data);
    console.info('checkAccount: replace', data);
    if (isShowDemoVerifyEmail) {
      if (replace && replace.isShowDemoVerifyEmail) {
        data.authEmail = '1';
      } else {
        data.authEmail = '0';
      }
    }
    if (isShowDemoConsent) {
      data.consent = '0';
    }
    if (isShowDemoNewUser) {
      data.authProfile = 0;
    }
    if (Number(data.authEmail) === 0) {
      // verify email
      AuthService.verificationEmail()
        .then(() => {
          navigation.navigate('EmailValidation', {
            email: data.email,
            onSuccess: () => {
              setDemoVerifyEmail(false);

              checkAccount({...data, authEmail: '1'}, profile, {
                isShowDemoVerifyEmail: true,
              });
            },
          });
        })
        .catch(err => {
          toast.show({
            title: 'Failed to send otp',
            variant: 'subtle',
            description: getErrorMessage(err),
          });
        });
    } else if (data.login === 'KompasId' && Number(data.consent) === 0) {
      navigation.replace('DataConfirmation');
    } else if (Number(data.authProfile) === 0) {
      // artinya, ada profil yang belum lengkap, atau ktp belum terverifikasi (authProfile = 0 sama dengan mbsdStatus = 0)
      // if (profile.linked.mbsdZmemId && profile.linked.mbsdZmemId[0]) {
      //   checkAccount({...data, authProfile: 1}, profile);
      // } else {
      navigation.replace('ChooseCitizen');
      // }
    } else if (Number(data.authTelephone) === 0) {
      if (!config.isPhoneVerificationRequired) {
        checkAccount({...data, authTelephone: 1}, profile);
      } else if (profile.linked.zmemAuusId[0].auusPhone) {
        // dianggap valid aja dulu
        checkAccount({...data, authTelephone: 1}, profile);
      } else {
        const phoneNumber = cleanPhoneNumber(
          profile.linked.zmemAuusId[0].auusPhone,
        );

        if (phoneNumber) {
          AuthService.sendOTP({phoneNumber})
            .then(sendOtpRes => {
              console.info('SendOTP result: ', sendOtpRes);
              navigation.navigate('PhoneNumberValidation', {
                phoneNumber,
                onSuccess: () => {
                  checkAccount({...data, authTelephone: 1}, profile);
                },
              });
            })
            .catch(err => {
              toast.show({
                title: 'Failed to send otp',
                variant: 'subtle',
                description: getErrorMessage(err),
              });
            });
        } else {
          navigation.replace('ChooseCitizen');
        }
      }
    } else {
      getProfile();
      navigation.replace('Main', {screen: t('tab.home')});
      if (!toast.isActive('welcome')) {
        toast.show({
          id: 'welcome',
          description: `${t('welcome')}, ` + profile.data[0].zmemFullName,
        });
      }
    }
  };

  const logout = async (
    setIsLoggingOut?: (val: boolean) => void,
    onCloseModalLogout?: () => void,
  ) => {
    InAppBrowser.closeAuth();
    await clearCookies();

    dispatch({type: EAuthUserAction.LOGOUT});

    if (setIsLoggingOut) {
      setIsLoggingOut(false);
    }

    toast.show({
      id: 'logout',
      description: 'Logout successfully',
    });

    if (onCloseModalLogout) {
      onCloseModalLogout();
    }
  };

  const clearCookies = async () => {
    await CookieManager.clearAll();
    if (Platform.OS === 'ios') {
      await CookieManager.clearByName(
        'https://my.borobudurmarathon.com',
        'PHPSESSID',
        true,
      );
      await CookieManager.clearByName('https://kompas.id', 'USER_DATA', true);
    }
    SessionService.removeSession();

    // const cookies = await getCookiesString();
    // console.info(new Date().toISOString + ' cookies', cookies);

    // if (cookies) {
    //   toast.show({title: 'Masih Ada'});
    // } else {
    //   toast.show({title: 'BERHASSSIIILL', placement: 'top'});
    // }
    // navigation.replace('Initial');
  };

  return {
    init,
    checkAccount,
    getProfile,
    clearCookies,
    logout,
  };
}

/* eslint-disable react-hooks/exhaustive-deps */
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ProfileService} from '../api/profile.service';
import {EAuthUserAction, useAuthUser} from '../context/auth.context';
import {RootStackParamList} from '../navigation/RootNavigator';
import {SessionService} from '../api/session.service';
import {useToast} from 'native-base';
import {AuthService} from '../api/auth.service';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import CookieManager from '@react-native-cookies/cookies';
import {IMemberDetailResponse} from '../types/profile.type';
import {useDemo} from '../context/demo.context';
import {IAuthResponseData} from '../types/auth.type';
import config from '../config';
import {cleanPhoneNumber} from '../helpers/phoneNumber';
import i18next from 'i18next';
import {Platform} from 'react-native';
import {useTranslation} from 'react-i18next';
import {WelcomeService} from '../api/welcome.service';
import {handleErrorMessage} from '../helpers/apiErrors';
import {useState} from 'react';
import useGallery from './useGallery';
import httpRequest from '../helpers/httpRequest';
import {LanguageID} from '../types/language.type';
import {LanguageService} from '../api/language.service';
import crashlytics from '@react-native-firebase/crashlytics';

export default function useInit() {
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const toast = useToast();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {setLoginType} = useAuthUser();
  const {t} = useTranslation();
  const {fetchGalleries} = useGallery();

  const {
    isShowDemoVerifyEmail,
    setDemoVerifyEmail,
    isShowDemoConsent,
    isShowDemoNewUser,
  } = useDemo();

  const {dispatch} = useAuthUser();

  const init = async (
    nextScreens?: {
      path: keyof RootStackParamList;
      params?: NativeStackNavigationProp<RootStackParamList>;
    }[],
  ) => {
    const language = await LanguageService.getLanguage();
    if (language) {
      await i18next.changeLanguage(language);
    }

    try {
      const res = await AuthService.checkSession();

      if (res) {
        setLoginType(res.data.login);
        console.info('AuthService.checkSession', res);
        console.info('i18next.language', i18next.language);

        await changeLanguage(
          i18next.language === 'en' ? LanguageID.EN : LanguageID.ID,
        );

        const [profile, _galleries] = await Promise.all([
          getProfile(),
          fetchGalleries(),
        ]);

        if (profile) {
          checkAccount(res.data, profile, undefined, nextScreens);
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
      setIsLoadingProfile(true);
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

      setIsLoadingProfile(false);

      return resProfile;
    } catch (err: any) {
      setIsLoadingProfile(false);
      console.info('### error resProfile', err);
      console.info('### error resProfile --- ', JSON.stringify(err));
      if (err && err.status === 409) {
        navigation.navigate('Logout');
      } else if (err && err.errorCode === 409) {
        navigation.navigate('Logout');
      } else {
        handleErrorMessage(err, t('error.failedToGetProfile'));
        navigation.navigate('Initial');
      }
    }
  };

  const checkAccount = async (
    data: IAuthResponseData,
    profile: IMemberDetailResponse,
    replace?: {
      isShowDemoVerifyEmail?: boolean;
      isShowDemoConsent?: boolean;
      isShowDemoNewUser?: boolean;
    },
    nextScreens?: {
      path: keyof RootStackParamList;
      params?: NativeStackNavigationProp<RootStackParamList>;
    }[],
  ) => {
    crashlytics().log('checkAccount, data: ' + JSON.stringify(data));
    crashlytics().log('checkAccount, profile: ' + JSON.stringify(profile));

    console.info('checkAccount: data', data);
    console.info('checkAccount: replace', data);
    if (config.isShowDemoSettings) {
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
    }

    console.info('checkAccount, after demo settings', data);
    if (data.login === 'KompasId' && Number(data.authEmail) === 0) {
      console.info("data.login === 'KompasId' && Number(data.authEmail) === 0");
      // verify email
      verifyEmailKompasId(data, profile, nextScreens);
    } else if (data.login === 'KompasId' && Number(data.consent) === 0) {
      console.info("data.login === 'KompasId' && Number(data.consent) === 0");
      if (profile.linked.mbsdZmemId && profile.linked.mbsdZmemId.length > 0) {
        navigation.navigate('DataConfirmation');
      } else {
        navigation.navigate('ChooseCitizen');
      }
    } else if (Number(data.authProfile) === 0) {
      toast.show({
        title: t('error.profileIsNotComplete'),
        description: t('error.profileIsNotCompleteDescription'),
      });
      console.info('Number(data.authProfile) === 0');
      // artinya, ada profil yang belum lengkap, atau ktp belum terverifikasi (authProfile = 0 sama dengan mbsdStatus = 0)
      // if (profile.linked.mbsdZmemId && profile.linked.mbsdZmemId[0]) {
      //   checkAccount({...data, authProfile: 1}, profile);
      // } else {
      navigation.replace('ChooseCitizen');
      // }
    } else if (Number(data.authTelephone) === 0) {
      console.info('Number(data.authTelephone) === 0');
      if (!config.isPhoneVerificationRequired) {
        checkAccount(
          {...data, authTelephone: 1},
          profile,
          undefined,
          nextScreens,
        );
      } else if (profile?.linked?.zmemAuusId?.[0]?.auusPhone) {
        // dianggap valid aja dulu
        checkAccount(
          {...data, authTelephone: 1},
          profile,
          undefined,
          nextScreens,
        );
      } else {
        const phoneNumber = cleanPhoneNumber(
          profile?.linked?.zmemAuusId?.[0]?.auusPhone,
        );

        if (phoneNumber) {
          AuthService.sendOTP({phoneNumber})
            .then(sendOtpRes => {
              console.info('SendOTP result: ', sendOtpRes);
              navigation.navigate('PhoneNumberValidation', {
                phoneNumber,
                onSuccess: () => {
                  checkAccount(
                    {...data, authTelephone: 1},
                    profile,
                    undefined,
                    nextScreens,
                  );
                },
              });
            })
            .catch(err => {
              handleErrorMessage(err, t('error.failedToSendOTP'));
            });
        } else {
          navigation.replace('ChooseCitizen');
        }
      }
    } else {
      console.info('checkAccount - else, will getProfile');
      getProfile();

      const isUserHasBeenOpenWelcome = await WelcomeService.getLatestView(
        profile.data[0].zmemId,
      );

      if (nextScreens) {
        for (const screen of nextScreens) {
          navigation.navigate(screen.path, screen.params);
        }
      } else if (isUserHasBeenOpenWelcome) {
        navigation.replace('Main', {screen: t('tab.home')});
      } else {
        navigation.replace('Welcome');
      }
      if (!toast.isActive('welcome')) {
        toast.show({
          id: 'welcome',
          description: `${t('welcome')}, ` + profile.data[0].zmemFullName,
        });
      }
    }
  };

  const verifyEmailKompasId = (
    data: IAuthResponseData,
    profile: IMemberDetailResponse,
    nextScreens?: {
      path: keyof RootStackParamList;
      params?: NativeStackNavigationProp<RootStackParamList>;
    }[],
  ) => {
    AuthService.verificationEmail()
      .then(() => {
        navigation.navigate('EmailValidationForKompas', {
          email: data.email,
          onSuccess: () => {
            setDemoVerifyEmail(false);

            checkAccount(
              {...data, authEmail: '1'},
              profile,
              {
                isShowDemoVerifyEmail: false,
              },
              nextScreens,
            );
          },
        });
      })
      .catch(err => {
        handleErrorMessage(err, t('error.failedToSendOTP'));
      });
  };

  const logout = async (
    setIsLoggingOut?: (val: boolean) => void,
    onCloseModalLogout?: () => void,
  ) => {
    try {
      console.info('will logout');
      InAppBrowser.closeAuth();
      console.info('will clearCookies');
      await clearCookies();

      console.info('will dispatch logout');
      dispatch({type: EAuthUserAction.LOGOUT});

      if (!toast.isActive('logout')) {
        console.info('before show toast');
        toast.show({
          id: 'logout',
          description: 'Logout successfully',
        });
      }

      console.info('will onCloseModalLogout');
    } catch (err) {
      //
    } finally {
      if (onCloseModalLogout) {
        onCloseModalLogout();
      }

      if (setIsLoggingOut) {
        setIsLoggingOut(false);
      }
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

  const changeLanguage = async (langId: LanguageID) => {
    i18next.changeLanguage(langId === LanguageID.EN ? 'en' : 'id');
    LanguageService.setLanguage(langId === LanguageID.EN ? 'en' : 'id');
    const url =
      config.apiUrl.href.href +
      config.apiUrl.apis.member.setLanguage.path +
      langId;
    await httpRequest.get(url);
  };

  return {
    init,
    checkAccount,
    isLoadingProfile,
    getProfile,
    clearCookies,
    logout,
  };
}

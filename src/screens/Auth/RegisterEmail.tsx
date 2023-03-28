import {useNavigation} from '@react-navigation/native';
import {HStack, Text, useToast, VStack} from 'native-base';
import React, {useEffect, useState} from 'react';
import BackHeader from '../../components/header/BackHeader';
import {Heading} from '../../components/text/Heading';
import TextInput from '../../components/form/TextInput';
import {AuthService} from '../../api/auth.service';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootNavigator';
import SelectInput from '../../components/form/SelectInput';
import {useDebounce} from 'use-debounce';
import {useTranslation} from 'react-i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Button from '../../components/buttons/Button';
import Icon from 'react-native-vector-icons/Feather';
import AppContainer from '../../layout/AppContainer';
import {handleErrorMessage} from '../../helpers/apiErrors';
import {GENDER_OPTIONS, getGenderOptions} from '../../assets/data/gender';
import i18next from 'i18next';
import {LanguageID} from '../../types/language.type';

export default function RegisterEmailScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const toast = useToast();
  const {t} = useTranslation();

  const [errors, setErrors] = useState<any>({});

  const [form, setForm] = useState<{
    ptmmFullName: string;
    ptmmGender: string | undefined;
    ptmmPassword: string;
    ptmmEmail: string;
    ptmmLanguage: '1';
  }>({
    ptmmFullName: '',
    ptmmGender: undefined,
    ptmmPassword: '',
    ptmmEmail: '',
    ptmmLanguage: '1',
  });

  const [emailWillBeCheck] = useDebounce(form.ptmmEmail, 500);
  const [isEmailCanUse, setIsEmailCanUse] = useState<boolean | undefined>(
    undefined,
  );

  const [confirmPassword, setConfirmPassword] = useState<string>();

  const [loading, setLoading] = useState(false);
  const [isLoadingCheckEmail, setIsLoadingCheckEmail] = useState(false);

  useEffect(() => {
    checkEmail();
  }, [emailWillBeCheck]);

  const checkEmail = () => {
    if (!form.ptmmEmail) {
      setIsEmailCanUse(undefined);
      return false;
    }
    console.info('emailWillBeCheck', emailWillBeCheck);
    setIsLoadingCheckEmail(true);
    AuthService.checkEmail(emailWillBeCheck)
      .then(res => {
        console.info('AuthService.checkEmail', JSON.stringify(res));
        setIsEmailCanUse(true);
        setIsLoadingCheckEmail(false);
      })
      .catch(() => {
        setIsEmailCanUse(false);
        setIsLoadingCheckEmail(false);
        // toast.show({
        //   title: 'Failed',
        //   description: getErrorMessage(err),
        // });
      });
  };

  const signup = async () => {
    try {
      setLoading(true);
      const data = {
        ...form,
        ptmmLanguage: i18next.language === 'id' ? LanguageID.ID : LanguageID.EN,
      };
      console.info('signup data', JSON.stringify(data));
      const result = await AuthService.signup(data);
      console.info('register result', result);

      toast.show({
        description: t('message.otpHasBeenSentToEmail'),
        placement: 'top',
      });

      // navigation.navigate('Initial');
      navigation.navigate('EmailVerificationWhenRegister', {
        email: form.ptmmEmail,
        onSuccess: () => {
          toast.show({
            description: t('auth.registerSuccess'),
          });
          navigation.navigate('SignInEmail');
        },
      });
    } catch (err: any) {
      const objErrors = handleErrorMessage(err, 'Failed to register');
      setErrors({...objErrors});
    } finally {
      setLoading(false);
    }
  };

  const isDisabled =
    !form.ptmmFullName ||
    !form.ptmmGender ||
    !form.ptmmPassword ||
    !confirmPassword ||
    !form.ptmmEmail ||
    isEmailCanUse === false ||
    form.ptmmPassword !== confirmPassword;

  return (
    <AppContainer>
      <VStack px="4" flex="1">
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          style={{flex: 1}}>
          <BackHeader onPress={() => navigation.goBack()} />
          <VStack space="1.5">
            <Heading>{t('auth.registerViaEmail')}</Heading>
            <Text fontWeight={400} color="#768499" fontSize={11} mb="3">
              {t('auth.registerNewAccount')}
            </Text>
          </VStack>
          <VStack space="2.5">
            <VStack space="1.5">
              <TextInput
                placeholder={t('auth.placeholderFullName') || ''}
                label={t('fullName') || ''}
                value={form.ptmmFullName}
                onChangeText={val => setForm({...form, ptmmFullName: val})}
                isInvalid={!!errors.ptmmFullName}
                errorMessage={errors.ptmmFullName}
              />
              <SelectInput
                items={getGenderOptions(t('gender.male'), t('gender.female'))}
                placeholder={t('chooseOne') || ''}
                label="Gender"
                onValueChange={val => setForm({...form, ptmmGender: val})}
                value={form.ptmmGender}
                hideSearch
                isInvalid={!!errors.ptmmGender}
                errorMessage={errors.ptmmGender}
              />
              <TextInput
                placeholder={t('auth.placeholderEmail') || ''}
                label="Email"
                helperText={
                  isEmailCanUse === undefined
                    ? t('auth.helperWeWillSendOTPToEmail')
                    : undefined
                }
                onChangeText={val => {
                  setForm({...form, ptmmEmail: val});
                }}
                value={form.ptmmEmail}
                loading={isLoadingCheckEmail}
                isInvalid={!!errors.ptmmEmail || isEmailCanUse === false}
                errorMessage={
                  errors.ptmmEmail
                    ? errors.ptmmEmail
                    : isEmailCanUse === false
                    ? t('message.emailAlreadyTaken')
                    : undefined
                }
                rightIcon={
                  isEmailCanUse === true ? (
                    <Icon
                      name="check-circle"
                      size={20}
                      style={{paddingLeft: 10, color: 'green'}}
                    />
                  ) : undefined
                }
                _inputProps={{textContentType: 'emailAddress'}}
              />
              <TextInput
                placeholder={t('auth.placeholderPassword') || ''}
                label={t('auth.password') || ''}
                type="password"
                onChangeText={val => setForm({...form, ptmmPassword: val})}
                value={form.ptmmPassword}
              />
              <TextInput
                placeholder={t('auth.placeholderPasswordAgain') || ''}
                label={t('auth.passwordAgain') || ''}
                type="password"
                onChangeText={setConfirmPassword}
                value={confirmPassword}
                isInvalid={
                  !!form.ptmmPassword &&
                  !!confirmPassword &&
                  form.ptmmPassword !== confirmPassword
                }
                errorMessage={t('message.passwordNotSame') || ''}
              />
            </VStack>
          </VStack>
          <HStack space="1" mt={22} justifyContent="center">
            <Text
              fontWeight={400}
              color="#1E1E1E"
              fontSize={12}
              textAlign="center">
              {t('auth.haveAccount')}
            </Text>
            <Text
              fontWeight={600}
              color="#EB1C23"
              fontSize={12}
              textAlign="center"
              underline
              onPress={() => navigation.navigate('SignInEmail')}>
              {t('auth.signinViaEmail')}
            </Text>
          </HStack>
        </KeyboardAwareScrollView>
        <HStack my={3}>
          <Button
            onPress={() => signup()}
            isLoading={loading}
            disabled={isDisabled || isLoadingCheckEmail}>
            {t('auth.register')}
          </Button>
        </HStack>
      </VStack>
    </AppContainer>
  );
}

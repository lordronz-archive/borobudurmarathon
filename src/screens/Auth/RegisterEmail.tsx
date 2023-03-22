import {useNavigation} from '@react-navigation/native';
import {Box, HStack, Text, useToast, VStack} from 'native-base';
import React, {useEffect, useState} from 'react';
import BackHeader from '../../components/header/BackHeader';
import {Heading} from '../../components/text/Heading';
import TextInput from '../../components/form/TextInput';
import {AuthService} from '../../api/auth.service';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootNavigator';
import SelectInput from '../../components/form/SelectInput';
import {getErrorMessage} from '../../helpers/errorHandler';
import {useDebounce} from 'use-debounce';
import {useTranslation} from 'react-i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Button from '../../components/buttons/Button';
import Icon from 'react-native-vector-icons/Feather';
import AppContainer from '../../layout/AppContainer';

export default function RegisterEmailScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const toast = useToast();
  const {t} = useTranslation();

  const [errors, setErrors] = useState<any>({});

  const [form, setForm] = useState<{
    ptmmFullName: string;
    ptmmGender: string;
    ptmmPassword: string;
    ptmmEmail: string;
    ptmmLanguage: '1';
  }>({
    ptmmFullName: '',
    ptmmGender: '',
    ptmmPassword: '',
    ptmmEmail: '',
    ptmmLanguage: '1',
  });

  const [emailWillBeCheck] = useDebounce(form.ptmmEmail, 500);
  const [isEmailCanUse, setIsEmailCanUse] = useState<boolean | undefined>();

  const [confirmPassword, setConfirmPassword] = useState<string>();

  const [loading, setLoading] = useState(false);
  const [isLoadingCheckEmail, setIsLoadingCheckEmail] = useState(false);

  useEffect(() => {
    checkEmail();
  }, [emailWillBeCheck]);

  const checkEmail = () => {
    if (!form.ptmmEmail || (form.ptmmEmail && form.ptmmEmail.length <= 5)) {
      if (!form.ptmmEmail) {
        setIsEmailCanUse(false);
      }
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
      const result = await AuthService.signup({
        ...form,
        ptmmLanguage: 1,
      });
      console.info('register result', result);

      toast.show({
        description: 'OTP has been sent to your email',
        placement: 'top',
      });

      // navigation.navigate('Initial');
      navigation.navigate('EmailVerificationWhenRegister', {
        email: form.ptmmEmail,
        onSuccess: () => {
          navigation.navigate('SignInEmail');
        },
      });
    } catch (err: any) {
      if (err?.data?.status?.error?.errors) {
        let objErrors = {};
        for (const errItem of err?.data?.status?.error?.errors || []) {
          if (errItem.length > 0) {
            objErrors = {
              ...objErrors,
              [errItem[0].field]: errItem[0].message,
            };
          }
        }
        console.info('objErrors', objErrors);

        setErrors({
          ...objErrors,
        });
      }
      toast.show({
        title: 'Failed to register',
        description: getErrorMessage(err),
        placement: 'top',
      });
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
                placeholder="Enter your full name here"
                label="Full Name"
                value={form.ptmmFullName}
                onChangeText={val => setForm({...form, ptmmFullName: val})}
                isInvalid={!!errors.ptmmFullName}
                errorMessage={errors.ptmmFullName}
              />
              <SelectInput
                items={[
                  {label: 'Male', value: '0'},
                  {label: 'Female', value: '1'},
                ]}
                placeholder="Choose gender"
                label="Gender"
                onValueChange={val => setForm({...form, ptmmGender: val})}
                value={form.ptmmGender}
                hideSearch
                isInvalid={!!errors.ptmmGender}
                errorMessage={errors.ptmmGender}
              />
              <TextInput
                placeholder="Enter your email here"
                label="Email"
                helperText={
                  isEmailCanUse === undefined
                    ? 'We will send verification code to this email for validation'
                    : undefined
                }
                onChangeText={val => {
                  setForm({...form, ptmmEmail: val});
                }}
                value={form.ptmmEmail}
                loading={isLoadingCheckEmail}
                isInvalid={!!errors.ptmmEmail || isEmailCanUse === false}
                errorMessage={
                  errors.ptmmEmail || 'Email already taken. Use another email.'
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
                placeholder="Enter your password here"
                label="Password"
                type="password"
                onChangeText={val => setForm({...form, ptmmPassword: val})}
                value={form.ptmmPassword}
              />
              <TextInput
                placeholder="Enter your password to confirm"
                label="Confirm Password"
                type="password"
                onChangeText={setConfirmPassword}
                value={confirmPassword}
                isInvalid={
                  !!form.ptmmPassword &&
                  !!confirmPassword &&
                  form.ptmmPassword !== confirmPassword
                }
                errorMessage="Password and Confirm Password is not same"
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
            disabled={isDisabled}>
            {t('auth.register')}
          </Button>
        </HStack>
      </VStack>
    </AppContainer>
  );
}

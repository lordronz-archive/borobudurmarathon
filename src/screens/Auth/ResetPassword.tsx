import {useNavigation, useRoute} from '@react-navigation/native';
import {
  HStack,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  useToast,
  VStack,
} from 'native-base';
import React, {useState} from 'react';
import BackHeader from '../../components/header/BackHeader';
import {Heading} from '../../components/text/Heading';
import TextInput from '../../components/form/TextInput';
import {AuthService} from '../../api/auth.service';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {useTranslation} from 'react-i18next';
import Button from '../../components/buttons/Button';
import AppContainer from '../../layout/AppContainer';
import {handleErrorMessage} from '../../helpers/apiErrors';
import i18next from 'i18next';
import {LanguageID} from '../../types/language.type';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Platform} from 'react-native';

export default function ResetPasswordScreen() {
  const inset = useSafeAreaInsets();

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const params = route.params as RootStackParamList['ResetPassword'];
  const toast = useToast();
  const {t} = useTranslation();

  const [form, setForm] = useState<{
    password: string;
    confirmPassword: string;
  }>({
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);

  const submitResetPassword = async () => {
    try {
      setLoading(true);
      const data = {
        ...form,
        ptmmLanguage: i18next.language === 'id' ? LanguageID.ID : LanguageID.EN,
      };
      console.info('====> resetPassword data', JSON.stringify(data));
      // return;
      const result = await AuthService.newPassword(
        params.code,
        params.key,
        form,
      );
      console.info('resetPassword result', result);

      toast.show({
        description: t('message.success'),
        placement: 'top',
      });

      navigation.navigate('Initial');
    } catch (err: any) {
      handleErrorMessage(err, t('error.failedToRegister'));
    } finally {
      setLoading(false);
    }
  };

  const isDisabled =
    !form.password ||
    !form.confirmPassword ||
    form.password !== form.confirmPassword;

  return (
    <AppContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS == 'ios' ? inset.top : undefined}
        style={{flex: 1}}>
        <VStack px="4" flex="1">
          <ScrollView flex={1}>
            <BackHeader onPress={() => navigation.goBack()} />
            <VStack space="1.5">
              <Heading>{t('auth.resetPassword')}</Heading>
              <Text fontWeight={400} color="#768499" fontSize={11} mb="3">
                {t('auth.resetPassword')}
              </Text>
            </VStack>
            <VStack space="2.5">
              <VStack space="1.5">
                <TextInput
                  placeholder={t('auth.placeholderPassword') || ''}
                  label={t('auth.password') || ''}
                  type="password"
                  onChangeText={val => setForm({...form, password: val})}
                  value={form.password}
                />
                <TextInput
                  placeholder={t('auth.placeholderPasswordAgain') || ''}
                  label={t('auth.passwordAgain') || ''}
                  type="password"
                  onChangeText={val => setForm({...form, confirmPassword: val})}
                  value={form.confirmPassword}
                  isInvalid={
                    !!form.password &&
                    !!form.confirmPassword &&
                    form.password !== form.confirmPassword
                  }
                  errorMessage={t('message.passwordNotSame') || ''}
                />
              </VStack>
            </VStack>
            <HStack space="1" mt={22} justifyContent="center">
              <Text
                fontWeight={600}
                color="#EB1C23"
                fontSize={12}
                textAlign="center"
                underline
                onPress={() => navigation.navigate('SignInEmail')}>
                {t('auth.backToLogin')}
              </Text>
            </HStack>
          </ScrollView>

          <HStack my={3}>
            <Button
              onPress={() => submitResetPassword()}
              isLoading={loading}
              disabled={isDisabled}>
              {t('auth.resetPassword')}
            </Button>
          </HStack>
        </VStack>
      </KeyboardAvoidingView>
    </AppContainer>
  );
}

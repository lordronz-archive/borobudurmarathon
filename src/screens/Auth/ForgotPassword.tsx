import {useNavigation} from '@react-navigation/native';
import {
  Box,
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
import AppContainer from '../../layout/AppContainer';
import {handleErrorMessage} from '../../helpers/apiErrors';
import {validateEmail} from '../../helpers/validate';
import Button from '../../components/buttons/Button';
import {Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export default function ForgotPasswordScreen() {
  const inset = useSafeAreaInsets();

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const toast = useToast();
  const {t} = useTranslation();

  const [email, setEmail] = useState<string>();
  const [loading, setLoading] = useState(false);

  const forgotPassword = async () => {
    try {
      setLoading(true);
      const body = {
        email,
      };
      const result = await AuthService.resetPass(body);
      console.info('forgotPassword result', result);
      navigation.goBack();
      toast.show({
        title: 'Success',
        description: t('message.forgotPasswordSuccess'),
        placement: 'top',
      });
    } catch (err) {
      handleErrorMessage(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS == 'ios' ? inset.top : undefined}
        style={{flex: 1}}>
        <VStack px="4" flex="1">
          <ScrollView flex={1}>
            <Box flex="10">
              <BackHeader onPress={() => navigation.goBack()} />
              <VStack space="1.5">
                <Heading>{t('auth.forgotPasswordTitle')}</Heading>
                <Text fontWeight={400} color="#768499" fontSize={11} mb="3">
                  {t('auth.forgotPasswordSubtitle')}
                </Text>
              </VStack>
              <VStack space="2.5">
                <VStack space="1.5">
                  <TextInput
                    placeholder={t('auth.placeholderEmail') || ''}
                    label="Email"
                    keyboardType="email-address"
                    _inputProps={{
                      textContentType: 'emailAddress',
                    }}
                    value={email}
                    onChangeText={text => setEmail(text)}
                  />
                </VStack>
              </VStack>
              {/* <HStack space="1" mt={22} justifyContent="center">
          <Text
            fontWeight={600}
            color="#EB1C23"
            fontSize={12}
            textAlign="center"
            underline
            onPress={() => navigation.navigate('SignInEmail')}>
            {t('auth.signinViaEmail')}
          </Text>
        </HStack> */}
            </Box>
          </ScrollView>

          <HStack my={3}>
            <Button
              onPress={() => forgotPassword()}
              isLoading={loading}
              disabled={!validateEmail(email || '')}>
              {t('auth.resetPassword')}
            </Button>
          </HStack>
        </VStack>
      </KeyboardAvoidingView>
    </AppContainer>
  );
}
